$(document).ready(function () {
  $.validator.addMethod("validIdCard", function(value, element) {
    return this.optional(element) || validate_id_card(value);
  }, "非法身份证号码");

  $.validator.addMethod("validCaptcha", function(value, element) {
    return this.optional(element) || validate_captcha(value);
  }, "验证码错误");

	$.validator.addMethod("validPaypass", function(value, element) {
    return this.optional(element) || ajax_validate("user", "paypass", value);
  }, "支付密码错误");

	$.validator.addMethod("validBalance", function(value, element) {
    return this.optional(element) || ajax_validate("user", "balance", value);
  }, "钱不够啦");

	$.validator.addMethod("validRefundBalance", function(value, element) {
    return this.optional(element) || ajax_validaterefundbalance(value);
  }, "您确定到账了这么多钱");


	jquery_validate(
		"#haha-form-paypass-update", {
			old_paypass: { required: true, validPaypass: true },
      paypass: { required: true },
      paypass_confirm: { equalTo: "#paypass" },
    }, {
			old_paypass: { required: "请输入旧支付密码", validPaypass: "旧支付密码输入错误" },
      paypass: { required: "请输入密码" },
      paypass_confirm: { equalTo: "两次输入的密码不匹配" },
    }
	);

	jquery_validate(
		"#haha-form-withdraw", {
      withdraw_amount: { required: true, digits: true, validBalance: true },
      withdraw_amount_confirm: { equalTo: "#withdraw_amount" },
			paypass: { required: true, validPaypass: true }
    }, {
      withdraw_amount: { required: "请输入提现金额", digits: "您的输入不是数字", validBalance: "钱不够啦" },
      withdraw_amount_confirm: { equalTo: "两次输入的提现金额不匹配" },
			paypass: { required: "请输入支付密码", validPaypass: "支付密码输入错误" }
    }
	);

	jquery_validate(
		"#haha-form-refundplatform", {
      refundplatform_amount: { required: true, digits: true, validRefundBalance: true },
      refundplatform_amount_confirm: { equalTo: "#refundplatform_amount" },
    }, {
      refundplatform_amount: { required: "请输入还款金额", digits: "您的输入不是数字", validRefundBalance: "您不需要还这么多" },
      refundplatform_amount_confirm: { equalTo: "两次输入的金额不匹配" },
    }
	);

	jquery_validate(
		"#haha-form-refundinvestor", {
      refundinvestor_amount: { required: true, digits: true },
      refundinvestor_amount_confirm: { equalTo: "#refundinvestor_amount" },
    }, {
      refundinvestor_amount: { required: "请输入还款金额", digits: "您的输入不是数字" },
      refundinvestor_amount_confirm: { equalTo: "两次输入的金额不匹配" },
    }
	);

	jquery_validate(
		"#haha-form-recharge", {
      recharge_amount: { required: true, digits: true },
      recharge_amount_confirm: { equalTo: "#recharge_amount" },
    }, {
      recharge_amount: { required: "请输入充值金额", digits: "您的输入不是数字" },
      recharge_amount_confirm: { equalTo: "两次输入的充值金额不匹配" },
    }
	);

	jquery_validate(
		"#haha-form-invest", {
      invest_amount: { required: true, digits: true },
      invest_amount_confirm: { equalTo: "#invest_amount" },
			paypass: { required: true, validPaypass: true },
      invest_contract_agreed: { required: true }
    }, {
      invest_amount: { required: "请输入投资金额", digits: "您的输入不是数字" },
      invest_amount_confirm: { equalTo: "两次输入的投资金额不匹配" },
			paypass: { required: "请输入支付密码", validPaypass: "支付密码输入错误" },
      invest_contract_agreed: { required: "您还没有同意投资合同" }
    }
	);

	jquery_validate(
		'#haha-form-signup', {
			user_name: { required: true },
			name: { required: true },
			email: { required: true, email: true },
			password: { minlength: 6, required: true },
			confirmation: { equalTo: "#password" },
      id_card: { required: true, validIdCard: true },
      captcha: { required: true, validCaptcha: true }
		}, {
      user_name: { required: "请输入用户名" },
      name: { required: "请输入您的真实姓名" },
      email: { required: "请输入你的常用邮箱地址", email: "电子邮箱格式不正确" },
      password: { minlength: "密码至少应为{0}位", required: "请输入密码" },
      confirmation: { equalTo: "两次输入的密码不匹配" },
      id_card: { required: "请输入身份证号码" }
    }
	);
	
	jquery_validate(
		'#haha-form-signin', {
      captcha: { required: true, validCaptcha: true }
		}, {
      captcha: { required: "请输入验证码", validCaptcha: '验证码输入错误' }
    }
	);

	jquery_validate(
		'#bindbank-form', {
			bank_province: { required: true },
			bank_city: { required: true },
			bank_name: { required: true },
			bank_account: { required: true }
		}, {
			bank_province: { required: "您必须选择开户行所在省份" },
			bank_city: { required: "您必须选择开户行所在城市" },
			bank_name: { required: "您必须提供开户行的全称" },
			bank_account: { required: "您必须提供您的银行帐号" }
		}
	);
	
});

function jquery_validate(selector, rules, messages) {
	$(selector).validate({
		ignore: ':not(select:hidden, input:visible, textarea:visible)',
    debug: true,
		rules: rules,
    messages: messages,
    highlight: function(element) {
      fg = $(element).closest('.form-group');
      fg.removeClass('has-success');
      fg.addClass('has-error');
    },
    unhighlight: function(element) {
      fg = $(element).closest('.form-group');
      fg.removeClass('has-error');
      $(element).closest('.validate-message').remove();
			$(element).siblings('.validate-message').remove();
    },
    success: function(element) {
      fg = $(element).closest('.form-group');
			fg.removeClass('has-error');
			fg.addClass('has-success');
      $(element).closest('.validate-message').remove();
			$(element).siblings('.validate-message').remove();
		},
		errorElement: 'span',
		errorClass: 'haha-validate-error validate-message',
		errorPlacement: function(error, element) {
			if ($(element).parent().attr("class") == "input-group") {
				error.insertAfter($(element).closest(".input-group"));
			}	else if ($(element).next("div.bootstrap-select").length != 0) {
				error.insertAfter($(element).next("div.bootstrap-select")[0]);
			} else {
				error.insertAfter($(element));
			}
		},
    submitHandler: function(form) {
      form.submit();
    }
	});
}

function validate_id_card(s) {
  return /^(\d{6})(18|19|20)?(\d{2})([01]\d)([0123]\d)(\d{3})(\d|X|x)?$/.test(s);
}

function validate_captcha(s) {
  var result = false;
  $.ajax({
    url: '/user/validatecaptcha',
    type: 'get',
    async: false,
    data: 'captcha=' + s,
    success: function(data) {
      console.log(data);
      result = data.result;
    },
    error: function(e) {
      console.log(e.message);
    }
  });
  console.log(result);
  return result;
}

function ajax_validate(controller, key, value) {
	var result = false;
  $.ajax({
    url: '/' + controller + '/validate' + key,
    type: 'get',
    async: false,
    data: key + '=' + value,
    success: function(data) {
      console.log(data);
      result = data.result;
    },
    error: function(e) {
      console.log(e.message);
    }
  });
  console.log(result);
  return result;
}

function ajax_validaterefundbalance(value) {
	var result = false;
	var product = $('input#pid').attr('value');
  $.ajax({
    url: '/product/validaterefundbalance',
    type: 'get',
    async: false,
    data: 'product=' + product + '&refundplatform_amount=' + value,
    success: function(data) {
      console.log(data);
      result = data.result;
    },
    error: function(e) {
      console.log(e.message);
    }
  });
  console.log(result);
  return result;
}
