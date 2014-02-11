module.exports = function (req, res, ok) {
  if (req.session.User) {
    return ok();
  } else {
    res.send(403);
  }
};
