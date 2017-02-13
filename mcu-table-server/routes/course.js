var express = require('express');
var router = express.Router();

var CourseListWebSpiders = require('../app/WebSpiders/CourseList.js');
var MyCourse = require('../app/WebSpiders/MyCourse.js');
var CourseDrop = require('../app/WebSpiders/CourseDrop.js')
var CourseComment = require('../app/WebSpiders/CourseComment.js')
var redis = require('../app/Service/Redis.js');

router.post('/:ggdb/my/', function (req, res, next) {
    MyCourse.get(req.params.ggdb, req.body.account, req.body.password).then(function (result) {
        redis.incr("sum:login").then()
        res.status(200).json(result);
    }).catch(function (error) {
        console.log(error);
        if (error == "帳號密碼錯誤") {
            redis.incr("login:" + req.body.account).then((value) => {
                redis.expire("login:" + req.body.account, 21600).then();
            })
            redis.get("login:" + req.body.account).then((value) => {
                res.status(401).json({
                    message: "帳號密碼錯誤",
                    step: value
                });
            })
        } else {
            res.status(500).json({
                message: "伺服器錯誤"
            });
        }
    })
})

router.get('/:ggdb/must/:dept/:yr', function (req, res, next) {
    CourseListWebSpiders.getMustList(req.params.ggdb, req.params.dept, req.params.yr).then(function (result) {
        res.status(200).json(result);
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({
            message: "伺服器錯誤"
        });
    })
});
router.get('/:ggdb/choose/:dept/:yr', function (req, res, next) {
    CourseListWebSpiders.getChooseList(req.params.ggdb, req.params.dept, req.params.yr).then(function (result) {
        res.status(200).json(result);
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({
            message: "伺服器錯誤"
        });
    })
});

router.get('/:ggdb/common/:sch', function (req, res, next) {
    CourseListWebSpiders.getCommonList(req.params.ggdb, req.params.sch).then(function (result) {
        res.status(200).json(result);
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({
            message: "伺服器錯誤"
        });
    })
});

router.get('/:ggdb/teach/:sch', function (req, res, next) {
    CourseListWebSpiders.getTeachList(req.params.ggdb, req.params.sch).then(function (result) {
        res.status(200).json(result);
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({
            message: "伺服器錯誤"
        });
    })
});

router.get('/:ggdb/sport/:sch', function (req, res, next) {
    CourseListWebSpiders.getSportList(req.params.ggdb, req.params.sch).then(function (result) {
        res.status(200).json(result);
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({
            message: "伺服器錯誤"
        });
    })
});

router.get('/:ggdb/search/:subject', function (req, res, next) {
    CourseListWebSpiders.getSearchList(req.params.ggdb, req.params.subject).then(function (result) {
        res.status(200).json(result);
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({
            message: "伺服器錯誤"
        });
    })
})

router.get('/:ggdb/option/:type', function (req, res, next) {
    switch (req.params.type) {
        case "must":
            CourseDrop.getMustOptine(req.params.ggdb).then(function (result) {
                res.status(200).json(result)
            }).catch(function (error) {
                console.log(error);
                res.status(500).json({
                    message: "伺服器錯誤"
                });
            })
            break;
        case "choose":
            CourseDrop.getChooseOptine(req.params.ggdb).then(function (result) {
                res.status(200).json(result)
            }).catch(function (error) {
                console.log(error);
                res.status(500).json({
                    message: "伺服器錯誤"
                });
            })
            break;
        case "common":
            CourseDrop.getCommonOptine(req.params.ggdb).then(function (result) {
                res.status(200).json(result)
            }).catch(function (error) {
                console.log(error);
                res.status(500).json({
                    message: "伺服器錯誤"
                });
            })
            break;
        case "teach":
            CourseDrop.getTeachOptine(req.params.ggdb).then(function (result) {
                res.status(200).json(result)
            }).catch(function (error) {
                console.log(error);
                res.status(500).json({
                    message: "伺服器錯誤"
                });
            })
            break;
        case "sport":
            CourseDrop.getSportOptine(req.params.ggdb).then(function (result) {
                res.status(200).json(result)
            }).catch(function (error) {
                console.log(error);
                res.status(500).json({
                    message: "伺服器錯誤"
                });
            })
            break;
        default:
            res.status(500).json({
                message: "伺服器錯誤"
            });
    }
})

router.get('comment/:teacher/:subject', function (req, res, next) {
    CourseComment.getCommentList(req.params.teacher, req.params.subject).then(function (result) {
        res.status(200).json(result)
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({
            message: "伺服器錯誤"
        });
    })
})

router.get('more/:id/:time', function (req, res, next) {
    CourseComment.getMoreList(req.params.id, req.params.time).then(function (result) {
        res.status(200).json(result)
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({
            message: "伺服器錯誤"
        });
    })
})

router.get('reply/:id/:time', function (req, res, next) {
    CourseComment.getReplyList(req.params.id, req.params.time).then(function (result) {
        res.status(200).json(result)
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({
            message: "伺服器錯誤"
        });
    })
})

module.exports = router;