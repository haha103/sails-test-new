/**
 * ClientShareholder
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema     : true,
  attributes : {

    name   : { type : 'string' , required : true } ,
    share  : { type : 'float'  , required : true } ,
    amount : { type : 'float'  , required : true } ,
    // fk
    form    : { type : 'integer' , required : true },
    company : { type : 'integer' , required : true } // id of Client model

  }

};
