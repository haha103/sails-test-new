/**
 * ClientBonding
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    warrantee : { type : 'string'  , required : true } ,
    start     : { type : 'date'    , required : true } ,
    end       : { type : 'date'    , required : true } ,
    amount    : { type : 'integer' , required : true } ,
    // fk
    loaner         : { type : 'integer' , required : true } , // Loaner model
    warrantor      : { type : 'integer' , required : true } , // Client model
    warrantee_type : { type : 'integer' , required : true } , // ClientType model

  }

};
