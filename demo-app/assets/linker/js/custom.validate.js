$(document).ready(function () {
	$('.haha-form-signup').validate({
		rules: {
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
