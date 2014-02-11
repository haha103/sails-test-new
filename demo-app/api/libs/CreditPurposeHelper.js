module.exports = {
  getNamesByIDs: function(ids) {
    var names = [];
    for (var i = 0; i < ids.length; ++i) {
      CreditPurpose.findOne({ id: ids[i] }).done(function(err, ctype) {
        if (!err) {
          names.push(ctype.name);
        }
      });
    }
    return names;
  }
};
