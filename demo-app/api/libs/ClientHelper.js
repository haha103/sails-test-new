var DomainHelper = require("../libs/DomainHelper");

module.exports = {
  getTypeName: function(id) {
    var name = "";
    Client.findOne({ id: id }).done(function(err, client) {
      ClientType.findOne({ id: client.type }).done(function(err, ctype) {
        if (err) {
          name = null;
        } else {
          name = ctype.name;
        }
      });
    });
    return name;
  },
  getName: function(id) {
    var name = "";
    Client.findOne({ id: id }).done(function(err, client) {
      if (err) return null;
      name = client.name;
    });
    return name;
  },
  getDomainsByID: function(client_id) {
    var domains = [];
    Client.findOne({ id: client_id }).done(function(err, client) {
      if (!err) {
        domains = DomainHelper.getNamesByIDs(client.domains);
      }
    });
    return domains;
  }
};
