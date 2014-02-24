$(document).ready(function () {
  $.validator.addMethod("validIdCard", function(value, element) {
    return this.optional(element) || validate_id_card(value);
  }, "非法身份证号码");

  $.validator.addMethod("validCaptcha", function(value, element) {
    return this.optional(element) || validate_captcha(value);
  }, "验证码错误");

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
    },
    success: function(element) {
      fg = $(element).closest('.form-group');
			fg.removeClass('has-error');
			fg.addClass('has-success');
		},
		errorElement: 'span',
		errorClass: 'help-block',
		errorPlacement: function(error, element) {
			error.insertAfter(element);
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
