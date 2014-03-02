module.exports = function (req, res, ok) {
  if (req.session.User) {
    return ok();
  } else {
    var err = [{
      name: '权限错误',
      message: '请登录'
    }];
    req.session.flash = { err: err };
    res.redirect('/session/new');
    return;
  }
};
