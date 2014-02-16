/**
 * ProductGuarantee
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

  	product: { type: 'integer' },
    guarantee_company: { type: 'integer' }, // GuaranteeCompany
    guarantee_letter_code: { type: 'string' },
    guarantee_letter_scan: { type: 'array' },

  }

};
