/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	schema: true,

  attributes: {
  	
  	name: { type: 'string', required: true },

  	id_card: { type: 'string', required: true },

  	user_name: { type: 'string' },

  	email: { type: 'string', email: true, required: true, unique: true },

    admin: { type: 'boolean', defaultsTo: false },

    online: { type: 'boolean', defaultsTo: false },

    encryptedPassword: { type: 'string' },

    activated: { type: 'boolean', defaultsTo: false },

    bank_binded: { type: 'boolean', defaultsTo: false },
  	bank_province: { type: 'string' },
  	bank_city: { type: 'string' },
  	bank_account: { type: 'string' },
  	bank_name: { type: 'string' },
    reg_completed: { type: 'boolean', defaultsTo: false },
    
  	phone: { type: 'string' },
  	city: { type: 'string' },
  	province: { type: 'string' },
  	address: { type: 'string' },

    balance: { type: 'float', defaultsTo: 0 },

    /*
    toJSON: function() {
    	var obj = this.toObject();
    	delete obj.password;
    	delete obj.confirmation;
    	delete obj.encryptedPassword;
    	delete obj._csrf;
    	return obj;
    }
    */
  },

  beforeValidation: function(values, next) {
    if (values.bank_account) {
      values.bank_account = values.bank_account.replace(/ /g, '');
    }
    // admin
    if (values.admin && values.admin == 'on') {
      values.admin = true;
    }
    //console.log(values);
    next();
  },

  beforeCreate: function(values, next) {
    // encrypt password
    if (!values.password || values.password != values.confirmation) {
      return next({ err: ["两次输入的密码不同"] });
    }
    require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
      if (err) return next(err);
      values.encryptedPassword = encryptedPassword;
      next();
    });
  }

};
