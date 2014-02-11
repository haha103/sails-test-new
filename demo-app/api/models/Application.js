/**
 * Application
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,
  attributes: {

    workflow       : { type : 'integer' , required : true } , // Workflow
    type           : { type : 'integer' , required : true } , // ApplicationType
    applicant      : { type : 'integer' , required : true } , // Client
    state          : { type : 'string'  , required : true } ,
    amount         : { type : 'integer' , required : true } ,
    due            : { type : 'date'    , required : true } ,
    payment_source : { type : 'string'  , required : true } ,

    partners   :  { type : 'array' } , // Partner

    credit_types    :  { type : 'array' , required : true }  , // CreditType
    credit_purposes :  { type : 'array' , required : true }  , // CreditPurpose

    guarantors :  { type : 'array' } , // Guarantor
    mortgages  :  { type : 'array' } // Mortgage

  },

  beforeCreate: function(values, next) {
    
    next();
  }

};
