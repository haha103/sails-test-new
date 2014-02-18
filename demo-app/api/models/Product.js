/**
 * Product
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    contract: { type: 'string' },
    ammount: { type: 'integer' },
    interest: { type: 'float' },
    duration_from: { type: 'date' },
    duration_to: { type: 'date' },
    status: { type: 'string' },
    guarantee_company: { type: 'string' },
    guarantee_letter_code: { type: 'string' },
    guarantee_letter_scan: { type: 'string' },
    invest_receiver: { type: 'string' },
    invest_purpose: { type: 'string' },
    payment_method: { type: 'string' },

  }

};
