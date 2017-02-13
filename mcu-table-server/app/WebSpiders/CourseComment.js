var Promise = require('bluebird')
var request = Promise.promisifyAll(require("request"))
var cheerio = require("cheerio")
var urlencode = require('urlencode')

var j = request.jar()

var getCommentList = function (teacher, subjectId) {
    return new Promise(function (resolve, reject) {
        var result = {
            url: "https://goldenfinger.csie.mcu.edu.tw/search/advanced?by_course=&by_instructor="+urlencode(teacher)+"&by_courseID="+subjectId,
            jar: j,
            followAllRedirects: true,
        }
        request.getAsync(result).then(function (res) {
            let $ = cheerio.load(res.body);
            resolve(parser($))
        }).catch(function (error) {
            reject(error);
        })
    })
}

var getMoreList = function (id,time) {
    return new Promise(function (resolve, reject){
        var result = {
            url: "https://goldenfinger.csie.mcu.edu.tw/fetch/comment/"+id+"/"+time,
            jar: j,
            followAllRedirects: true,
        }
        request.getAsync(result).then(function (res) {
            resolve(JSON.parse(res.body)[1])
        }).catch(function (error) {
            reject(error);
        })
    })
}

var getReplyList = function (id,time) {
    return new Promise(function (resolve, reject){
        var result = {
            url: "https://goldenfinger.csie.mcu.edu.tw/fetch/reply/"+id+"/"+time,
            jar: j,
            followAllRedirects: true,
        }
        request.getAsync(result).then(function (res) {
            resolve(JSON.parse(res.body)[1])
        }).catch(function (error) {
            reject(error);
        })
    })
}

var parser = function ($) {
    var rows = $(".course-row");
    var comments = [];
    if(rows.length>0){
        var sub = rows.eq(0).find(".box-comments").children(".box-comment");
        //console.log(sub.eq(0).find(".comment-text").children(".comment-func").children("button").eq(1).attr("data-comment-id").split(".")[1])
        for(var i=0;i<sub.length;i++){
            var comment = {
                cid: sub.eq(i).find(".comment-text").children(".comment-func").children("button").eq(1).attr("data-comment-id").split(".")[1],
                course: sub.eq(i).find(".comment-text").children(".comment-func").children("button").eq(1).attr("data-comment-id").split(".")[0],
                message: sub.eq(i).find(".user-comment").text(),
                timestamp: sub.eq(i).find(".comment-text").find(".comment-timestamp").eq(0).attr("title")
            }
            if(sub.eq(i).find(".comment-text").children(".more-resp").children().length!=1){
                comment.respCount = parseInt(sub.eq(i).find(".comment-text").children(".more-resp").children("button").text());
                comment.respTimeStamp = sub.eq(i).find(".comment-text").children(".more-resp").children("span").eq(1).attr("title");
            }
            comments.push(comment)
        }
    }
    return comments;
}

module.exports = {
    getCommentList: getCommentList,
    getMoreList: getMoreList,
    getReplyList: getReplyList
}

