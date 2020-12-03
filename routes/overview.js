var express = require('express');
var router = express.Router();
var url = require('url');


function ensureAuthenticated(req, res, next) {
  return (req.isAuthenticated()) ? next() : res.redirect('/login');
}

router.get('/', function(req, res) {
  
});
