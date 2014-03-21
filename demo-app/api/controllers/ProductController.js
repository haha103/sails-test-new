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
var moment = require("moment");
var UPLOAD_PATH = 'assets/userdata/products';

var display_name = {
  'contract': '合同编号',
  'needed_amount': '需求金额',
	'return_amount': '还款金额',
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

	validaterefundbalance: function(req, res) {
		var data = { result: false };
		var product = req.param("product");
		if (product) {
			Product.findOne({ id: product }).done(function(err, p) {
				if (!err && (p.return_amount - p.returned_amount >= req.param("refundplatform_amount"))) {
					data.result = true;
				}
			});
		}
		res.json(data);
	},
	
  admin: function(req, res) {
    var subpage = req.param('subpage') ? req.param('subpage') : 'new';
    var products = []; // for index
		var product = null; // for update
		if (req.param('product')) {
			Product.findOne({ id: req.param('product') }).done(function(err, p) {
				if (!err) {
					p.progress = ((p.current_amount / p.needed_amount) * 100).toFixed(2);
					p.return_investor_sum_n = (p.needed_amount * (1 + p.interest)).toFixed(0);
					p.returned_investor_amount_n = p.returned_investor_amount ? p.returned_investor_amount : 0;
					p.return_investor_progress = ((p.returned_investor_amount_n / p.return_investor_sum_n) * 100).toFixed(2);
					p.return_investor_due_n = p.return_investor_sum_n - p.returned_investor_amount_n;
					p.return_progress = ((p.returned_amount / p.return_amount) * 100).toFixed(2);
					p.return_amount_due = to_ten_thousand(p.return_amount - p.returned_amount);
					p.return_amount_due_n = p.return_amount - p.returned_amount;
          p.remain_amount = to_ten_thousand(p.needed_amount - p.current_amount);
					p.remain_amount_n = p.needed_amount - p.current_amount;
					p.needed_amount_n = p.needed_amount;
          p.needed_amount = to_ten_thousand(p.needed_amount);
					p.interest_n = p.interest;
          p.interest = (p.interest * 100).toString() + "%";
          p.duration_diff = dayDiff(new Date(p.duration_from), new Date(p.duration_to));
					p.due_in_days = dayDiff(new Date(), new Date(p.duration_to));
					product = p;
				}
			});
			console.log("--- aaa ---");
			console.log(product);
			console.log("--- aaa ---");
		}
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
			product: product,
			commait: commait,
			moment: moment
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
			commait: commait,
			moment: moment
    });
  },

	startinvest: function(req, res, next) {
		var pid = req.param("product");
		Product.update({ id: pid }, { invest_started: true }, function(err, p) {
			if (!err) {
				res.redirect("/product/admin?subpage=update&product=" + pid);
			}
		});
	},

	stopinvest: function(req, res, next) {
		var pid = req.param("product");
		Product.update({ id: pid }, { invest_started: false }, function(err, p) {
			if (!err) {
				res.redirect("/product/admin?subpage=update&product=" + pid);
			}
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

	refundinvestor: function(req, res, next) {
		var pid = req.param("product");
		var uid = req.param("user");
		var amount = parseInt(req.param("refundinvestor_amount"));

		console.log("pid=" + pid);
		console.log("uid=" + uid);
		
		var errs = [];
		
		Transaction.find({ type: "invest", invest_product: pid, user_id: uid }).groupBy("user_id").sum("amount").done(function(err, t) {
			if (err) { errs.push(err); return; }
			Product.findOne({ id: pid }).done(function(err, p) {
				if (err) { errs.push(err); return; }
				var refund_amount = amount ? amount : (t[0].amount * (1 + p.interest)).toFixed(0);
				if (refund_amount > p.returned_amount) {
					console.log("平台收到的还款金额不够!");
					return;
				}
				var tran = {
					user_id: req.session.User.id,
					type: "refundinvestor",
					amount: refund_amount,
					product: pid,
					target_user_id: uid
				};
				Transaction.create(tran, function(err, t2) {
					if (err) { errs.push(err); return; }
					if (t2) {
						p.returned_investor_amount += refund_amount;
						p.save(function(err, p2) {
							if (err) { errs.push(err); return; }
							User.findOne(uid).done(function(err, user) {
								if (err) { errs.push(err); return; }
								user.balance += refund_amount;
								user.save(function(err, user2) {
									if (err) { errs.push(err); return; }
								});
							});
						});
					}
				});
			});
		});

		if (errs.length > 0) {
			res.json(errs);
		} else {
			res.redirect("/product/admin?subpage=refundinvestor&product=" + pid);
		}
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
