

function ensureAuthenticated(req, res, next) {
  return (req.isAuthenticated()) ? next() res.redirect('/login');
}