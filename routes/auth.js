var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/local',
  passport.authenticate('local', {failureRedirect: '/login'}),
    function(req, res) {
      res.redirect('/');
    });

router.get('/github',
  passport.authenticate('github', {scope: ['user:email', 'user:login', 'user:id']}));

router.get('/github/callback',
  passport.authenticate('github', {failureRedirect: '/login'}),
  function(req, res) {
    res.redirect('/');
});

module.exports = router;
