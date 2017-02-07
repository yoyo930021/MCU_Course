var Promise = require('bluebird')
var request = Promise.promisifyAll(require("request"))
var iconv = require("iconv-lite")
var cheerio = require("cheerio")
var urlencode = require('urlencode')

var j = request.jar()

var getMustOptine = function (ggdb) {
    return new Promise(function (resolve, reject) {
        var choose = {
            url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_menu.asp?gdb=" + ggdb,
            jar: j,
            encoding: "binary",
            followAllRedirects: true
        }
        request.getAsync(choose).then(function (res) {
            var result = {
                url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_2_up.asp",
                jar: j,
                encoding: "binary",
                followAllRedirects: true
            }
            return request.getAsync(result);
        }).then(function (res) {
            var $ = cheerio.load(iconv.decode(new Buffer(res.body, "binary"), "Big5"));
            resolve(parser($));
        }).catch(function (error) {
            reject(error);
        })
    });
}

var getChooseOptine = function (ggdb) {
    return new Promise(function (resolve, reject) {
        var choose = {
            url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_menu.asp?gdb=" + ggdb,
            jar: j,
            encoding: "binary",
            followAllRedirects: true
        }
        request.getAsync(choose).then(function (res) {
            var result = {
                url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_3_up.asp",
                jar: j,
                encoding: "binary",
                followAllRedirects: true
            }
            return request.getAsync(result);
        }).then(function (res) {
            var $ = cheerio.load(iconv.decode(new Buffer(res.body, "binary"), "Big5"));
            resolve(parser($));
        }).catch(function (error) {
            reject(error);
        })
    });
}

var getCommonOptine = function (ggdb) {
    return new Promise(function (resolve, reject) {
        var choose = {
            url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_menu.asp?gdb=" + ggdb,
            jar: j,
            encoding: "binary",
            followAllRedirects: true
        }
        request.getAsync(choose).then(function (res) {
            var result = {
                url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_4_up.asp",
                jar: j,
                encoding: "binary",
                followAllRedirects: true
            }
            return request.getAsync(result);
        }).then(function (res) {
            var $ = cheerio.load(iconv.decode(new Buffer(res.body, "binary"), "Big5"));
            resolve(parser($));
        }).catch(function (error) {
            reject(error);
        })
    });
}

var getTeachOptine = function (ggdb) {
    return new Promise(function (resolve, reject) {
        var choose = {
            url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_menu.asp?gdb=" + ggdb,
            jar: j,
            encoding: "binary",
            followAllRedirects: true
        }
        request.getAsync(choose).then(function (res) {
            var result = {
                url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_5_up.asp",
                jar: j,
                encoding: "binary",
                followAllRedirects: true
            }
            return request.getAsync(result);
        }).then(function (res) {
            var $ = cheerio.load(iconv.decode(new Buffer(res.body, "binary"), "Big5"));
            resolve(parser($));
        }).catch(function (error) {
            reject(error);
        })
    });
}

var getSportOptine = function (ggdb) {
    return new Promise(function (resolve, reject) {
        var choose = {
            url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_menu.asp?gdb=" + ggdb,
            jar: j,
            encoding: "binary",
            followAllRedirects: true
        }
        request.getAsync(choose).then(function (res) {
            var result = {
                url: "http://www.mcu.edu.tw/student/new-query/sel-query/query_10_up.asp",
                jar: j,
                encoding: "binary",
                followAllRedirects: true
            }
            return request.getAsync(result);
        }).then(function (res) {
            var $ = cheerio.load(iconv.decode(new Buffer(res.body, "binary"), "Big5"));
            resolve(parser($));
        }).catch(function (error) {
            reject(error);
        })
    });
}

var parser = function ($) {
    var select = $("select");
    var options = [];
    for(var i=0;i<select.length;i++){
        var option = [];
        var ele = select.eq(i).children();
        for(var j=0;j<ele.length;j++){
            var opt = {
                value:ele.eq(j).attr("value"),
                text:ele.eq(j).text().trim()
            }
            option.push(opt)
        }
        options.push(option)
    }
    return options;
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
    getMustOptine: getMustOptine,
    getChooseOptine: getChooseOptine,
    getCommonOptine: getCommonOptine,
    getTeachOptine: getTeachOptine,
    getSportOptine: getSportOptine
}