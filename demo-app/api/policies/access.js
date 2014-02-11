module.exports = function (req, res, ok) {
  if (req.session.User && 
      (req.session.User.admin || 
       req.session.User.id == req.param('id'))) {
    return ok();
  } else {
    var err = [{
      name: 'No Access',
      message: 'You don\'t have access to this page.'
    }];
    req.session.flash = { err: err };
    res.redirect('/session/new');
    return;
  }
};
