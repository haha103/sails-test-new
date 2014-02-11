/**
 * Client
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  
  schema: true,

  attributes: {

    /* common attrs */
    pid : { type : 'string' , required : true , unique : true } ,

    type    : { type : 'integer' , required : true } , // ClientType model
    name    : { type : 'string'  , required : true } ,
    phone   : { type : 'string'  , required : true } ,
    address : { type : 'string'  , required : true } ,

    domains : { type : 'array' } , // Domain model
  	email   : { type : 'email' } ,
    loans   : { type : 'array' } , // ClientLoan model

    /* individual clients */
    education     : { type : 'string'  } ,
    employer      : { type : 'string'  } ,
    title         : { type : 'string'  } ,
    yearly_income : { type : 'integer' } ,

    /* company clients */
    legal_person           : { type : 'string'  } ,
    contact                : { type : 'string'  } ,
    contact_phone          : { type : 'string'  } ,
    founded                : { type : 'date'    } ,
    products               : { type : 'string'  } ,
    registered_capital     : { type : 'integer' } ,
    total_asset            : { type : 'integer' } ,
    net_asset              : { type : 'integer' } ,
    asset_liability_ratio  : { type : 'integer' } ,
    current_ratio          : { type : 'integer' } ,
    quick_ratio            : { type : 'integer' } ,
    sales_income_last_year : { type : 'integer' } ,
    sales_income_curr_year : { type : 'integer' } ,
    profit_curr_year       : { type : 'integer' } ,
    profit_last_year       : { type : 'integer' } ,

    shareholders : { type : 'array' } , // ClientShareholder model
    bondings     : { type : 'array' } , // ClientBonding model

  }

};
