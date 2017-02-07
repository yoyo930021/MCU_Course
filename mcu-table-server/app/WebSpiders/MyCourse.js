var Promise = require('bluebird')
var request = Promise.promisifyAll(require("request"))
var iconv = require("iconv-lite")
var cheerio = require("cheerio")
var urlencode = require('urlencode')
var redis = require('../Service/Redis.js');

var j = request.jar()

var get = function (ggdb, account, password) {
    return new Promise(function (resolve, reject) {
        var login = {
            url: "http://www.mcu.edu.tw/student/new-query/Chk_Pass_New_v1.asp",
            jar: j,
            form: {
                "t_tea_no": account,
                "t_tea_pass": password
            },
            encoding: "binary"
            //followAllRedirects: true
        }
        request.postAsync(login).then(function (res) {
            var cookies = j.getCookies("http://www.mcu.edu.tw/student/new-query/Chk_Pass_New_v1.asp");
            if (cookies[cookies.findIndex((value)=>{return (value!==undefined)?(value.toString().search("std%5Fno")!=null):false})].toString().search("error") != null) reject("帳號密碼錯誤")
            var result = {
                url: "https://www.mcu.edu.tw/student/new-query/sel-5-2.asp?d=5",
                jar: j,
                encoding: "binary",
                followAllRedirects: true
            }
            return request.getAsync(result);
        }).then(function (res) {
            //console.log(res.body);
            let $ = cheerio.load(iconv.decode(new Buffer(res.body, "binary"), "Big5"))
            return listParser($, ggdb)
        }).then(function (result) {
            resolve(result)
        }).catch(function (error) {
            reject(error)
        })
    })
}

var listParser = function ($, ggdb) {
    return new Promise(function (resolve, reject) {
        var rows = $("table").eq(1).children("tr");
        var list = [];
        for (var i = 2; i < rows.length; i += 2) {
            var sub = rows.eq(i).children();
            var subjectId = sub.eq(1).text().trim().split("　")[0];
            var classId = sub.eq(0).text().trim();
            list.push({
                subjectId: subjectId,
                classId: classId
            });
        }
        var choose = {
            url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_menu.asp?gdb=" + ggdb,
            jar: j,
            encoding: "binary",
            followAllRedirects: true
        }
        request.getAsync(choose).then(function () {
            Promise.map(list, function (list) {
                return fetchCourse(ggdb, list.subjectId, list.classId)
            }, {
                concurrency: 5
            }).then(function (courses) {
                resolve(courses)
            }).catch(function (error) {
                reject(error)
            })
        }).catch(function (error) {
            reject(error)
        })

    })
}

var fetchCourse = function (ggdb, subjectId, classId) {
    return new Promise(function (resolve, reject) {
        redis.exists("course:"+ggdb+":subject:" + subjectId).then(function (value) {
            if (value == 1) {
                redis.get("course:"+ggdb+":subject:" + subjectId).then(function (result) {
                    let $ = cheerio.load(iconv.decode(new Buffer(result, "binary"), "Big5"));
                    resolve(fetchParser($, classId))
                }).catch(function (error) {
                    reject(error);
                })
            } else {
                var result = {
                    url: "http://www.mcu.edu.tw/student/new-query/sel-query/qslist_1.asp",
                    form: {
                        "courna": subjectId
                    },
                    jar: j,
                    encoding: "binary",
                    followAllRedirects: true
                }
                request.postAsync(result).then(function (res) {
                    redis.set("course:"+ggdb+":subject:" + subjectId,res.body).then(function(){
                        redis.expire("course:"+ggdb+":subject:" + subjectId,3600).then();
                    })
                    let $ = cheerio.load(iconv.decode(new Buffer(res.body, "binary"), "Big5"));
                    resolve(fetchParser($, classId))
                }).catch(function (error) {
                    reject(error);
                })
            }
        }).catch(function (error) {
            reject(error);
        })
    })
}

var fetchParser = function ($, classId) {
    var rows = $("table tr");
    for (var i = 1; i < rows.length; i++) {
        var sub = rows.eq(i).children();
        if (sub.eq(2).text().trim().split(' ')[0].trim() == classId) {
            var course = {
                depart: sub.eq(0).text().trim(),
                subjectId: sub.eq(1).text().trim().split(' ')[0].trim(),
                subjectName: sub.eq(1).text().trim().split(' ')[1].trim(),
                classId: sub.eq(2).text().trim().split(' ')[0],
                className: sub.eq(2).text().trim().split(' ')[1],
                maxPeople: parseInt(sub.eq(3).text().trim().split('／')[0].trim()),
                nowPeople: parseInt(sub.eq(3).text().trim().split('／')[1].trim()),
                teacher: sub.eq(4).find("font").contents().map(function () {
                    return (this.type === 'text') ? $(this).text() : ''
                }).get().filter((value) => {
                    return value.length > 0
                }),
                time: formatTime(sub.eq(5).has("font").contents()[0].children),
                site: sub.eq(7).text().trim(),
                type: sub.eq(8).text().trim(),
                credit: parseInt(sub.eq(9).text()),
                note: (sub.eq(10).text() + " " + sub.eq(13).text()).trim()
            };
            if (sub.eq(4).find("a").length > 0) {
                course.detail = sub.eq(4).find("a").attr("href");
            }
            return course;
        }
    }
}


var formatTime = function (data) {
    //console.log(data)
    var temp = [];
    data.map(function (ele) {
        if (ele.type === 'text') {
            temp.push(ele.data);
        }
    });
    var result = [];
    temp.map(function (ele) {
        if (ele.match(":") != null) {
            //console.log(ele.split(":")[0].trim())
            var sub = {
                day: parseInt(ele.split(":")[0].trim().split(" ")[1]),
                sec: []
            }
            ele.split(":")[1].trim().split(" ").map(function (element) {
                if (!isNaN(parseInt(element))) {
                    sub.sec.push(parseInt(element));
                }
            });
            result.push(sub);
        }
    })
    return result;
}

module.exports = {
    get: get
}