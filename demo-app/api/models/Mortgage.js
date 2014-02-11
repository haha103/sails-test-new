/**
 * Mortgage
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {

    // fk
    type        : { type : 'integer' , required : true } ,
    application : { type : 'integer' , required : true } ,

    name  : { type : 'string'  , required : true } ,
    value : { type : 'integer' , required : true } ,

  }

};
