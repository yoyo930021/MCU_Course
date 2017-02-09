var express = require('express');
var router = express.Router();

var share = require('../app/Service/Share.js');

/* GET users listing. */
router.get('/:token', function (req, res, next) {
    share.getCourses(req.params.token).then((result) => {
        res.status(200).json(result)
    }).catch((error) => {
        console.log(error)
        res.status(500).json({
            message: "伺服器錯誤"
        })
    })
});

router.post('/',function(req, res, next) {
    share.saveCourses(req.body.body).then((token)=>{
        res.status(200).json({token:token})
    }).catch((error) => {
        console.log(error)
        res.status(500).json({
            message: "伺服器錯誤"
        })
    })
})



module.exports = router;