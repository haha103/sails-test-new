module.exports = function (req, res, ok) {
  if (req.session.User && req.session.User.admin) {
    return ok();
  } else {
    var err = [{
      name: '权限错误',
      message: '您没有权限访问该页面。请用管理员帐号登录。'
    }];
    req.session.flash = { err: err };
    res.redirect('/session/new');
    return;
  }
};
