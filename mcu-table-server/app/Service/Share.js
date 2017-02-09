var Promise = require('bluebird')
var redis = require('../Service/Redis.js');
var sha256 = require('js-sha256').sha256;

var saveCourses = function(courses){
    return new Promise(function (resolve, reject) {
        console.log(JSON.stringify(courses))
        var token = getHash(Date.now().toString());
    
        redis.set("share:"+token,JSON.stringify(courses)).then(()=>{
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
            resolve(JSON.parse(value))
        }).catch((error)=>{
            reject(error)
        })
    })
}

var getHash = function(data){
    return sha256(data);
}

module.exports = {
    saveCourses: saveCourses,
    getCourses: getCourses
}