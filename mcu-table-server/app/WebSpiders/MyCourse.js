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
            var cookies = j.getCookieString("http://www.mcu.edu.tw/student/new-query/Chk_Pass_New_v1.asp");
            if (cookies.split(";").filter((value) => { return value.search("std%5Fno") != -1 })[0].search("error") != -1) reject("帳號密碼錯誤")
            var result = {
                url: "http://www.mcu.edu.tw/student/new-query/sel-5-2.asp?d=5",
                jar: j,
                encoding: "binary",
                followAllRedirects: true
            }
            return request.getAsync(result);
        }).then(function (res) {
            //console.log(iconv.decode(new Buffer(res.body, "binary"), "Big5"));
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
        //console.log(rows.eq(3).text())
        var list = [];
        for (var i = 2; i < rows.length; i++) {
            var sub = rows.eq(i).find("td");
            //console.log(sub.html());
            var subjectId = sub.eq(1).text().trim().split("　")[0];
            var classId = sub.eq(0).text().trim();
            list.push({
                subjectId: subjectId,
                classId: classId
            });
        }
        //console.log(list);
        var cookie = request.cookie('ggdb=' + ggdb);
        var url = 'http://www.mcu.edu.tw/student/new-query/sel-query/';
        j.setCookie(cookie, url);
        Promise.map(list, function (list) {
            return fetchCourse(ggdb, list.subjectId, list.classId)
        }, {
                concurrency: 5
            }).then(function (courses) {
                resolve(courses)
            }).catch(function (error) {
                reject(error)
            })

    })
}

var fetchCourse = function (ggdb, subjectId, classId) {
    return new Promise(function (resolve, reject) {
        redis.exists("course:" + ggdb + ":subject:" + subjectId).then(function (value) {
            if (value == 1) {
                redis.get("course:" + ggdb + ":subject:" + subjectId).then(function (result) {
                    let $ = cheerio.load(iconv.decode(new Buffer(result, "binary"), "Big5"));
                    resolve(fetchParser($, classId))
                }).catch(function (error) {
                    reject(error);
                })
            } else {
                var formData = "sch=&dept1=&yr1=&dept2=&yr2=&dept3=&yr3=&sel=&courna=" + urlencode(subjectId, "Big5") + "&teana=&wk1=&ssec1=&esec1=&wk2=&ssec2=&esec2=&wk3=&ssec3=&esec3=&wk4=&ssec4=&esec4=";
                var contentLength = formData.length;

                var result = {
                    url: "http://www.mcu.edu.tw/student/new-query/sel-query/qslist_1.asp",
                    headers: {
                        'Content-Length': contentLength,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData,
                    jar: j,
                    encoding: "binary",
                    followAllRedirects: true
                }
                request.postAsync(result).then(function (res) {
                    redis.set("course:" + ggdb + ":subject:" + subjectId, res.body).then(function () {
                        redis.expire("course:" + ggdb + ":subject:" + subjectId, 3600).then();
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
                subjectName: sub.eq(1).text().trim().split(' ').slice(1, sub.eq(1).text().trim().split(' ').length + 1).join(' '),
                classId: sub.eq(2).text().trim().split(' ')[0],
                className: sub.eq(2).text().trim().split(' ')[1],
                maxPeople: parseInt(sub.eq(3).text().trim().split('／')[0].trim()),
                nowPeople: parseInt(sub.eq(3).text().trim().split('／')[1].trim()),
                teacher: sub.eq(4).find("font").contents().map(function () {
                    return (this.type === 'text') ? $(this).text().substring(4) : ''
                }).get().filter((value) => {
                    return value.length > 0
                }),
                time: formatTime(sub.eq(5).has("font").contents()[0].children),
                site: sub.eq(7).find("font").contents().map(function () {
                    return (this.type === 'text') ? $(this).text() : ''
                }).get().filter((value) => {
                    return value.length > 0
                }).map((element) => {
                    return element.substring(0, (element.indexOf("【") != -1) ? element.indexOf("【") : element.length + 1)
                }),
                type: sub.eq(8).text().trim(),
                credit: parseInt(sub.eq(9).text()),
                note: (sub.eq(10).text() + " " + sub.eq(13).text()).trim()
            };
            if (sub.eq(4).find("a").length > 0) {
                course.detail = sub.eq(4).find("a").attr("href").replace("學年度", "105");
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