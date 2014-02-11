/**
 * RiskAssessment
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {
  	application: 'integer',
    fact_basics: 'string',
    fact_finance: 'string',
    fact_background: 'string',
    fact_misc: 'string',
    analysis_purpose_and_amount: 'string',
    analysis_repay_src: 'string',
    analysis_risk_items: 'string',
    analysis_guarantee: 'string',
    analysis_risk_control: 'string',
    analysis_materials: 'string',
    overall_comment: 'string'
  }

};
