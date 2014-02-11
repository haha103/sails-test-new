/**
 * ClientBankAccount
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {
  	
  	client: 'integer',
    application: 'integer',
    investigation: "integer",
    basic_account: 'boolean',
    bank: 'string',
    account: 'string'
    
  },

  beforeValidation: function(values, next) {
    _.keys(values).map(function(k) {
      if (ClientBankAccount.attributes[k] && ClientBankAccount.attributes[k].type == "boolean" && typeof values[k] == "string") {
        values[k] = (values[k] == "true");
      }
    });
    console.log(values);
    next();
  }

};
