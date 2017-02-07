var Promise = require('bluebird')
var redis = require('../Service/Redis.js');

var saveCourses = function(courses){
    return new Promise(function (resolve, reject) {
        var token = randomText(10);
        while(redis.exists("share:"+token)!=0){
            token = randomText(10);
        }
        redis.set("share:"+token,courses).then(()=>{
            redis.expire("share:"+token,31556926).then();
        }).then(()=>{
            resolve(token)
        }).catch((error)=>{
            reject(error)
        })
    })
}

var getCourses = function(token){
    return new Promise(function (resolve, reject) {
        redis.get("share:"+token).then((value)=>{
            resolve(value)
        }).catch((error)=>{
            reject(error)
        })
    })
}

var randomText = function(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = {
    saveCourses: saveCourses,
    getCourses: getCourses
}