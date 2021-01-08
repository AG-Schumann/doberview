const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send('Not Logged In');
  }
}
module.exports = isLoggedIn

//function ensureAuthenticated(req, res, next) {
//  return (req.isAuthenticated()) ? next(): res.redirect('/login');
//}
