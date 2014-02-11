/**
 * Workflow
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {
  	
    name: { type: 'string', required: true, unique: true },

    definition: { type: 'json', required: true }
     
  },

  beforeCreate: function(values, next) {
    values.definition = JSON.parse(values.definition);
    next();
  }

};
