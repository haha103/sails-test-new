module.exports = {
  getTypeNameByTypeID: function(id) {
    var name = "";
    ApplicationType.findOne({ id: id }).done(function(err, atype) {
      if (err) {
        name = null;
      } else {
        name = atype.name;
      }
    });
    return name;
  }
};
