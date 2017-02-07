var Redis = require('ioredis');
var redis = new Redis();

var existTime = 60 * 30; // 30 mins

redis.on('ready',function(err){
    console.log('ready')
});

redis.on("error",function(error){
    console.log("Error:" + error)
})

var set = function(key, value) {
    return redis.set(key, value)
}

var expire = function(key,time){
    return redis.expire(key, time)
}

var get = function(key){
    return redis.get(key)
}

var incr = function(key){
    return redis.incr(key)
}

var exists = function(key){
    return redis.exists(key)
}

module.exports = {

    set: set,

    expire: expire,

    get: get,

    incr: incr,

    exists: exists
};