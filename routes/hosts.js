var express = require('express');
var router = express.Router();
var url = require('url');
var common = require('common');


router.get('/', common.ensureAuthenticated, function(req, res) {

});
