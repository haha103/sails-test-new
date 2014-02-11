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
  	
  	name: {
  		type: 'string',
  		required: true
  	},

  	title: {
  		type: 'string'
  	},

  	email: {
  		type: 'string',
  		email: true,
  		required: true,
  		unique: true
  	},

    admin: {
      type: 'boolean',
      defaultsTo: false
    },

    online: {
      type: 'boolean',
      defaultsTo: false
    },

    encryptedPassword: {
    	type: 'string'
    }/*,

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
      return next({err: ["Password does not match password confirmation"]});
    }
    require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
      if (err) return next(err);
      values.encryptedPassword = encryptedPassword;
      next();
    });
  }

};
