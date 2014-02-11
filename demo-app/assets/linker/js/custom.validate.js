$(document).ready(function () {
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
			}
		},
    messages: {
      user_name: { required: "请输入用户名" },
      name: { required: "请输入您的真实姓名" },
      email: { required: "请输入你的常用邮箱地址", email: "电子邮箱格式不正确" },
      password: { minlength: "密码至少应为{0}位", required: "请输入密码" },
      confirmation: { equalTo: "两次输入的密码不匹配" },
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
