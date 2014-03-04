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

var fs = require('fs');
var path = require('path');
var uuid = require('node-uuid');
var mkdirp = require('mkdirp');
var commait = require('comma-it');
var UPLOAD_PATH = 'assets/userdata/products';

var display_name = {
  'contract': '合同编号',
  'needed_amount': '需求金额',
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
    var products = [];
    Product.find({}).done(function (err, ps) {
      if (!err) {
        ps.map(function(p) {
          p.progress = ((p.current_amount / p.needed_amount) * 100).toFixed(2);
          p.remain_amount = to_ten_thousand(p.needed_amount - p.current_amount);
          p.needed_amount = to_ten_thousand(p.needed_amount);
          p.interest = (p.interest * 100).toString() + "%";
          p.duration_diff = dayDiff(new Date(p.duration_from), new Date(p.duration_to));
        });
        products = ps;
      }
    });
    console.log(products);
    res.view({ 
      display_name : display_name ,
      subpage: subpage,
      products: products,
			commait: commait
    });
  },
  
  index: function(req, res) {
    var products = [];
    Product.find({}).done(function (err, ps) {
      if (!err) {
        ps.map(function(p) {
          p.progress = ((p.current_amount / p.needed_amount) * 100).toFixed(2);
          p.remain_amount = to_ten_thousand(p.needed_amount - p.current_amount);
          p.needed_amount = to_ten_thousand(p.needed_amount);
          p.interest = (p.interest * 100).toString() + "%";
          p.duration_diff = dayDiff(new Date(p.duration_from), new Date(p.duration_to));
        });
        products = ps;
      }
    });
    console.log(products);
    res.view({ 
      display_name : display_name,
      products: products,
			commait: commait
    });
  },

  create: function(req, res, next) {
    var file = req.files.guarantee_letter_scan;
    var upload_path = UPLOAD_PATH + "/guaranett_letter_scan/";
    var filename = upload_path + uuid.v1() + path.extname(file.name);
    fs.readFile(file.path, function(err, data) {
      if (err) {
        res.json(err);
      } else {
        mkdirp(upload_path, function(err) {
          if (err) console.error(err);
          fs.writeFile(filename, data, function(err) {
            if (err) res.json(err);
          });
        });
      }
    });
    var product = req.params.all();
    product.guarantee_letter_scan = filename;
    Product.create(product, function(err, p) {
      if (err) res.json(err);
    });
    res.redirect("/product/admin?subpage=index");
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ProductController)
   */
  _config: {}

  
};

function dayDiff(d1, d2)
{
  d1 = d1.getTime() / 86400000;
  d2 = d2.getTime() / 86400000;
  return new Number(d2 - d1).toFixed(0);
}

function to_ten_thousand(n) {
  return (n / 10000).toFixed(0) + "万";
}
