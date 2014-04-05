/**
 * HelpMessageComments
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	schema: true,
  attributes: {
  	message: 'integer', // fk: HelpMessage
		user: 'integer', // fk: User
		content: 'string',
  }

};
