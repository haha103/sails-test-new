/**
 * Guarantor
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {
  	
    application        :  { type : 'integer' }  ,
    name               :  { type : 'string'  }  ,
    legal_person       :  { type : 'string'  }  ,
    registered_capital :  { type : 'integer' }  ,
    total_asset        :  { type : 'integer' }  ,
    net_asset          :  { type : 'integer' }  ,
    bonding_amount     :  { type : 'integer' }  ,
     
  }

};
