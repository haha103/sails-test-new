/**
 * Transaction
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {
  	
    user_id: { type: 'integer' },
    type: { type: 'string' },
    amount: { type: 'float' },

    recharge_from_bank_account: { type: 'string' },
    invest_product: { type: 'integer' },
    withdraw_bank_account: { type: 'string' },
    transfer_to_user_id: { type: 'integer' },
    transfer_to_bank_account: { type: 'string' },
    
  }

};
