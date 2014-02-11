/**
 * Loan
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {
  	
    amount : { type : 'integer' , required : true } ,
    start  : { type : 'date'    , required : true } ,
    end    : { type : 'date'    , required : true } ,
    // fk
    loanee : { type : 'integer'  , required : true } ,
    loaner : { type : 'integer'  , required : true } ,
    form   : { type : 'integer'  , required : true } ,
    
  }

};
