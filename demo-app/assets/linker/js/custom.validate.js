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

	$("#haha-form-paypass-update").validate({
    debug: true,
    rules: {
			old_paypass: { required: true, validPaypass: true },
      paypass: { required: true },
      paypass_confirm: { equalTo: "#paypass" },
    },
    messages: {
			old_paypass: { required: "请输入旧支付密码", validPaypass: "旧支付密码输入错误" },
      paypass: { required: "请输入密码" },
      paypass_confirm: { equalTo: "两次输入的密码不匹配" },
    },
    highlight: function(element) {
      fg = $(element).closest('.form-group');
      fg.removeClass('has-success');
      fg.addClass('has-error');
    },
    unhighlight: function(element) {
      fg = $(element).closest('.form-group');
      fg.removeClass('has-error');
      $(element).closest('.validate-message').remove();
    },
    success: function(element) {
      fg = $(element).closest('.form-group');
			fg.removeClass('has-error');
			fg.addClass('has-success');
      $(element).closest('.validate-message').remove();
		},
		errorElement: 'span',
		errorClass: 'haha-validate-error validate-message',
		/*
		errorPlacement: function(error, element) {
			error.insertAfter($(element).closest(".input-group"));
		},
		*/
    submitHandler: function(form) {
      form.submit();
    }
  });

  $("#haha-form-withdraw").validate({
    debug: true,
    rules: {
      withdraw_amount: { required: true, digits: true },
      withdraw_amount_confirm: { equalTo: "#withdraw_amount" },
    },
    messages: {
      withdraw_amount: { required: "请输入提现金额", digits: "您的输入不是数字" },
      withdraw_amount_confirm: { equalTo: "两次输入的提现金额不匹配" },
    },
    highlight: function(element) {
      fg = $(element).closest('.form-group');
      fg.removeClass('has-success');
      fg.addClass('has-error');
    },
    unhighlight: function(element) {
      fg = $(element).closest('.form-group');
      fg.removeClass('has-error');
      $(element).closest('.validate-message').remove();
    },
    success: function(element) {
      fg = $(element).closest('.form-group');
			fg.removeClass('has-error');
			fg.addClass('has-success');
      $(element).closest('.validate-message').remove();
		},
		errorElement: 'span',
		errorClass: 'haha-validate-error validate-message',
		errorPlacement: function(error, element) {
			error.insertAfter($(element).closest(".input-group"));
		},
    submitHandler: function(form) {
      form.submit();
    }
  });
  $("#haha-form-recharge").validate({
    debug: true,
    rules: {
      recharge_amount: { required: true, digits: true },
      recharge_amount_confirm: { equalTo: "#recharge_amount" },
    },
    messages: {
      recharge_amount: { required: "请输入充值金额", digits: "您的输入不是数字" },
      recharge_amount_confirm: { equalTo: "两次输入的充值金额不匹配" },
    },
    highlight: function(element) {
      fg = $(element).closest('.form-group');
      fg.removeClass('has-success');
      fg.addClass('has-error');
    },
    unhighlight: function(element) {
      fg = $(element).closest('.form-group');
      fg.removeClass('has-error');
      $(element).closest('.validate-message').remove();
    },
    success: function(element) {
      fg = $(element).closest('.form-group');
			fg.removeClass('has-error');
			fg.addClass('has-success');
      $(element).closest('.validate-message').remove();
		},
		errorElement: 'span',
		errorClass: 'haha-validate-error validate-message',
		errorPlacement: function(error, element) {
			error.insertAfter($(element).closest(".input-group"));
		},
    submitHandler: function(form) {
      form.submit();
    }
  });
  $("#haha-form-invest").validate({
    debug: true,
    rules: {
      invest_amount: { required: true, digits: true },
      invest_amount_confirm: { equalTo: "#invest_amount" },
			paypass: { required: true, validPaypass: true },
      invest_contract_agreed: { required: true }
    },
    messages: {
      invest_amount: { required: "请输入投资金额", digits: "您的输入不是数字" },
      invest_amount_confirm: { equalTo: "两次输入的投资金额不匹配" },
			paypass: { required: "请输入支付密码", validPaypass: "支付密码输入错误" },
      invest_contract_agreed: { required: "您还没有同意投资合同" }
    },
    highlight: function(element) {
      fg = $(element).closest('.form-group');
      fg.removeClass('has-success');
      fg.addClass('has-error');
    },
    unhighlight: function(element) {
      fg = $(element).closest('.form-group');
      fg.removeClass('has-error');
      $(element).closest('.validate-message').remove();
    },
    success: function(element) {
      fg = $(element).closest('.form-group');
			fg.removeClass('has-error');
			fg.addClass('has-success');
      $(element).closest('.validate-message').remove();
		},
		errorElement: 'span',
		errorClass: 'haha-validate-error validate-message',
		errorPlacement: function(error, element) {
			if ($(element).parent().attr("class") == "input-group") {
				error.insertAfter($(element).closest(".input-group"));
			} else {
				error.insertAfter($(element));
			}
		},
    submitHandler: function(form) {
      form.submit();
    }
  });

	$('#haha-form-signup').validate({
    debug: true,
		rules: {
			user_name: {
				required: true
			},
			name: {
				required: true
			},
			email: {
				required: true,
				email: true
			},
			password: {
				minlength: 6,
				required: true
			},
			confirmation: {
				equalTo: "#password"
			},
      id_card: {
        required: true,
        validIdCard: true
      },
      captcha: {
        required: true,
        validCaptcha: true
      }
		},
    messages: {
      user_name: { required: "请输入用户名" },
      name: { required: "请输入您的真实姓名" },
      email: { required: "请输入你的常用邮箱地址", email: "电子邮箱格式不正确" },
      password: { minlength: "密码至少应为{0}位", required: "请输入密码" },
      confirmation: { equalTo: "两次输入的密码不匹配" },
      id_card: { required: "请输入身份证号码" }
    },
    highlight: function(element) {
      fg = $(element).closest('.form-group');
      fg.removeClass('has-success');
      fg.addClass('has-error');
    },
    unhighlight: function(element) {
      fg = $(element).closest('.form-group');
      fg.removeClass('has-error');
      $(element).closest('.validate-message').remove();
    },
    success: function(element) {
      fg = $(element).closest('.form-group');
			fg.removeClass('has-error');
			fg.addClass('has-success');
      $(element).closest('.validate-message').remove();
		},
		errorElement: 'span',
		errorClass: 'haha-validate-error validate-message',
		//errorClass: 'help-block validate-message',
    //focusCleanup: true,
		errorPlacement: function(error, element) {
			error.insertAfter(element);
		}
	});

	$('#haha-form-signin').validate({
    debug: true,
		rules: {
      captcha: {
        required: true,
        validCaptcha: true
      }
		},
    messages: {
      captcha: { required: "请输入验证码", validCaptcha: '验证码输入错误' }
    },
    highlight: function(element) {
      fg = $(element).closest('.form-group');
      fg.removeClass('has-success');
      fg.addClass('has-error');
    },
    unhighlight: function(element) {
      fg = $(element).closest('.form-group');
      fg.removeClass('has-error');
      $(element).closest('.validate-message').remove();
    },
    success: function(element) {
      fg = $(element).closest('.form-group');
			fg.removeClass('has-error');
			fg.addClass('has-success');
      $(element).closest('.validate-message').remove();
		},
		errorElement: 'span',
		errorClass: 'haha-validate-error validate-message',
		//errorClass: 'help-block validate-message',
    //focusCleanup: true,
		errorPlacement: function(error, element) {
			error.insertAfter(element);
		},
    submitHandler: function(form) {
      form.submit();
    }
	});
});

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
