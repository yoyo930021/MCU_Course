var Promise = require('bluebird')
var request = Promise.promisifyAll(require("request"))
var iconv = require("iconv-lite")
var cheerio = require("cheerio")
var urlencode = require('urlencode')

var j = request.jar()

var getMustList = function (ggdb, dept, yr) {
    return new Promise(function (resolve, reject) {
        var choose = {
            url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_menu.asp?gdb=" + ggdb,
            jar: j,
            encoding: "binary",
            followAllRedirects: true
        }
        request.getAsync(choose).then(function (res) {
            var result = {
                url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_2_1.asp",
                form: {
                    "dept": dept,
                    "yr": yr
                },
                jar: j,
                encoding: "binary",
                followAllRedirects: true
            }
            return request.postAsync(result);
        }).then(function (res) {
            var $ = cheerio.load(iconv.decode(new Buffer(res.body, "binary"), "Big5"));
            resolve(parser($));
        }).catch(function (error) {
            reject(error);
        })
    });
}

var getChooseList = function (ggdb, dept, yr) {
    return new Promise(function (resolve, reject) {
        var choose = {
            url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_menu.asp?gdb=" + ggdb,
            jar: j,
            encoding: "binary",
            followAllRedirects: true
        }
        request.getAsync(choose).then(function (res) {
            var result = {
                url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_3_1.asp",
                form: {
                    "dept": dept,
                    "yr": yr
                },
                jar: j,
                encoding: "binary",
                followAllRedirects: true
            }
            return request.postAsync(result);
        }).then(function (res) {
            var $ = cheerio.load(iconv.decode(new Buffer(res.body, "binary"), "Big5"));
            resolve(parser($));
        }).catch(function (error) {
            reject(error);
        })
    });
}

var getCommonList = function (ggdb, sch) {
    return new Promise(function (resolve, reject) {
        var choose = {
            url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_menu.asp?gdb=" + ggdb,
            jar: j,
            encoding: "binary",
            followAllRedirects: true
        }
        request.getAsync(choose).then(function (res) {
            var result = {
                url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_4_1.asp",
                form: {
                    "sch": sch
                },
                jar: j,
                encoding: "binary",
                followAllRedirects: true
            }
            return request.postAsync(result);
        }).then(function (res) {
            var $ = cheerio.load(iconv.decode(new Buffer(res.body, "binary"), "Big5"));
            resolve(parser($));
        }).catch(function (error) {
            reject(error);
        })
    });
}

var getTeachList = function (ggdb, sch) {
    return new Promise(function (resolve, reject) {
        var choose = {
            url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_menu.asp?gdb=" + ggdb,
            jar: j,
            encoding: "binary",
            followAllRedirects: true
        }
        request.getAsync(choose).then(function (res) {
            var result = {
                url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_5_1.asp",
                form: {
                    "sch": sch
                },
                jar: j,
                encoding: "binary",
                followAllRedirects: true
            }
            return request.postAsync(result);
        }).then(function (res) {
            var $ = cheerio.load(iconv.decode(new Buffer(res.body, "binary"), "Big5"));
            resolve(parser($));
        }).catch(function (error) {
            reject(error);
        })
    });
}

var getSportList = function (ggdb, sch) {
    return new Promise(function (resolve, reject) {
        var choose = {
            url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_menu.asp?gdb=" + ggdb,
            jar: j,
            encoding: "binary",
            followAllRedirects: true
        }
        request.getAsync(choose).then(function (res) {
            var result = {
                url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_10_1.asp",
                form: {
                    "sch": sch
                },
                jar: j,
                encoding: "binary",
                followAllRedirects: true
            }
            return request.postAsync(result);
        }).then(function (res) {
            var $ = cheerio.load(iconv.decode(new Buffer(res.body, "binary"), "Big5"));
            resolve(parser($));
        }).catch(function (error) {
            reject(error);
        })
    });
}

var parser = function ($) {
    var rows = $("table tr");
    var courses = [];
    for (var i = 1; i < rows.length; i++) {
        var sub = rows.eq(i).children();

        var course = {
            depart: sub.eq(0).text().trim(),
            subjectId: sub.eq(1).text().trim().split(' ')[0].trim(),
            subjectName: sub.eq(1).text().trim().split(' ').slice(1,sub.eq(1).text().trim().split(' ').length+1).join(' '),
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
            }).map((element)=>{
                return element.substring(0,(element.indexOf("【")!=-1)?element.indexOf("【"):element.length+1)
            }),
            type: sub.eq(8).text().trim(),
            credit: parseInt(sub.eq(9).text()),
            note: (sub.eq(10).text() + " " + sub.eq(13).text()).trim()
        };
        if (sub.eq(4).find("a").length>0) {
            course.detail = sub.eq(4).find("a").attr("href").replace("學年度","105");
        }
        courses.push(course);
    }
    return courses;
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
    getMustList: getMustList,
    getChooseList: getChooseList,
    getCommonList: getCommonList,
    getTeachList: getTeachList,
    getSportList: getSportList
}