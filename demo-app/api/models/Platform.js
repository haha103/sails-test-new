/**
 * Platform
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	schema: true,
	
  attributes: {
    key: { type: 'string' },
		sval: { type: 'string' },
		ival: { type: 'integer' },
		fval: { type: 'float' },
		bval: { type: 'boolean' },
  },
	

};
