/**
 * ProductController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var display_name = {
  'contract': '合同编号',
  'amount': '需求金额',
  'interest': '年化利率',
  'duration_from': '开始',
  'duration_to': '截至',
  'duration': '期限',
  'status': '当前状态',
  'invest_receiver': '投资接受人',
  'invest_purpose': '项目用途',
  'payment_method': '兑付方式',
  'guarantee_company': '担保公司',
  'guarantee_letter_code': '担保函编号',
  'guarantee_letter_scan': '担保函扫描件',
};

module.exports = {

  admin: function(req, res) {
    var subpage = req.param('subpage') ? req.param('subpage') : 'new';
    res.view({ 
      display_name : display_name ,
      subpage: subpage
    });
  },   
  
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ProductController)
   */
  _config: {}

  
};
