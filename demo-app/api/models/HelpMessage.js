/**
 * HelpMessage
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	schema: true,
	
  attributes: {
		title: 'string',
		desc: 'string',
		type: 'string',
		user: 'integer',
		online: { type: 'boolean', defaultsTo: false },
  },

};
