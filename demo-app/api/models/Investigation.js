/**
 * Investigation
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
var Helper = require('../libs/Helper');
var S = require('string');

module.exports = {

  schema: true,

  attributes: {
  
    application: { type: "integer", required: true },

    blacklisted: { type: "array" }, // Blacklist
    credit_rating: { type: "integer" }, 
    avg_score: { type: "integer" },
    case_summary: { type: "string" },

    bank_card: { type: "string" },
    actual_owner: { type: "string" },
    last_year_inspected: { type: "boolean" },
    licence: { type: "string" },
    national_tax_id: { type: "string" },
    local_tax_id: { type: "string" },
    require_certs: { type: "string" },
    has_certs: { type: "string" },
    legal_person_addr: { type: "string" },
    actual_owner_addr: { type: "string" },
    actual_owner_phone: { type: "string" },
    registration_others: { type: "string" },

    bank_accounts: { type: "array" }, // ClientBankAccount
  },

  beforeValidation: function(values, next) {
    _.keys(values).map(function(k) {
      console.log(k);
      if (Investigation.attributes[k] && Investigation.attributes[k].type == "boolean" && typeof values[k] == "string") {
        values[k] = (values[k] == "true");
      }
    });
    console.log(values);
    next();
  }

};
