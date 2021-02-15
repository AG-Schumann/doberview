var passport = require('passport');
var bcrypt = require('bcrypt');
const https = require('https');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

var GithubStrategy = require('passport-github2').Strategy;
var LocalStrategy = require('passport-local').Strategy;

passport.use(new GithubStrategy(
  {
    clientID: process.env.GITHUB_OAUTH_CLIENT_ID,
    clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback",
    scope: ['user:email', 'user:name', 'user:login', 'user:id'],
  },
  function(accessToken, refreshToken, profile, done) {
      https.get('https://api.github.com/orgs/AG-Schumann/members', (res) => {
          console.log(res);

          res.on('data', (d) => {
              process.stdout.write(d);
          });

      }).on('error', (e) => {
          console.error(e);
      });
  }));


passport.use(new LocalStrategy(
  function(username, password, done) {
    db.get('users').findOne({username: username})
    .then( (doc) => bcrypt.compare(password, doc.password_hash))
    .then( (result) => {if (result) done(null, doc); done(null, false);})
    .catch( (err) => done(err, false));
  })
);
