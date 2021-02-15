var express = require('express');
var router = express.Router();
var url = require('url');
var common = require('./common');
var gp="";

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    return res.redirect(gp+'/login');
}

/* GET home page. */
router.get('/', ensureAuthenticated, function (req, res) {
    res.render('overview');
});


router.get('/get_current_shifters', function (req, res) {
    var db = req.db;
    var on_shift = [];
    var ret = [];
    var today = new Date();
    db.collection("shifts").findOne({"start": {"$lte": today}, "end": {"$gte": today}}, function (err, result) {
        if (err) throw err;
        for (var i in result.shifters) {
            on_shift.push(result.shifters[i]);
        }
        db.collection("contacts").find({"name": {"$in": on_shift}}).toArray(function (err, cursor) {
            ret = []
            for (var i in cursor) {
                ret.push({"name": cursor[i]["first_name"] + " " + cursor[i]["last_name"]});
                if (i == 0){
                    ret[i]["shift_type"] = "primary";
                } else{
                    ret[i]["shift_type"] = "secondary";
                }
                ret[i]["email"] = cursor[i]["email"];
                ret[i]["sms"] = cursor[i]["sms"];
            }
            return res.json(ret);
        });
    });
});

router.get('/get_host_status', function (req, res) {
    var db = req.common_db;
    var ret = [];
    var today = new Date();
    db.collection("hosts").find({}).toArray(function (err, result) {
        if (err) throw err;
        for (var i in result) {
            ret.push({"hostname": result[i]["hostname"]});
            var heartbeat = (new Date().getTime() - result[i]["heartbeat"].getTime()) / 1000 >> 0;

            if (heartbeat > 3600){
                ret[i]["heartbeat"] = "more than 1 hour ago";
            } else{
                heartbeat += " seconds ago";
                ret[i]["heartbeat"] = heartbeat;
            }

        }
        return res.json(ret);
        });
});

router.get('/login', function(req, res){
    res.render('login', { user: req.user });
});


module.exports = router
