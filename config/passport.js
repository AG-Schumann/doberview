var passport = require('passport');
var bcrypt = require('bcrypt');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

var GithubStrategy = require('passport-github2').Strategy;
var LocalStrategy = require('passport-local').Strategy;

passport.use(new GithubStrategy(
  {
    clientID: process.env.GITHUB_OAUTH_CLIENT_ID,
    clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    callbackURL: "http://10.4.73.172:3001/auth/github/callback",
    scope: ['user:email', 'user:name', 'user:login', 'user:id'],
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
	  //var collection = db.get('users');
    //collection.findOne({github_id: profile.id})
    //.then( (doc) => {if (doc) return done(null, doc); return done(null, false);})
    //.catch((err) => done(err, false));
  })
);

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.get('users').findOne({username: username})
    .then( (doc) => bcrypt.compare(password, doc.password_hash))
    .then( (result) => {if (result) done(null, doc); done(null, false);})
    .catch( (err) => done(err, false));
  })
);
