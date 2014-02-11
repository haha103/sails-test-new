/**
 * Review
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {
  	application: 'integer',
    topics: 'string',
    date: 'date',
    host: 'string',
    recorder: 'string',
    account_mgr: 'string', // TODO: should be selected from users.
    risk_mgr: 'string', // TODO: should be selected from users.
    attendees: 'string', // TODO: more advanced completion from users might be good.
    reviewed_amount: 'string',
    reviewed_due: 'string',
    reviewed_interest_rate: 'string',
    summary: 'string',
    review_result: 'integer', // 1 = ok, 2 = nok, 3 = 再议
  }

};
