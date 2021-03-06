$(document).ready(function(){

  var page = document.location.pathname;
  page = page.replace(/(\/)$/, '');
	
  $('select').selectpicker({
    style: 'btn btn-default',
		size: 6,
    title: '请选择',
		dropupAuto: false
  });
  
  $('select#client-type').on("change", function(e) {
    var selected_type = $('option:selected', this);
    var selected_type_name = selected_type.text();
    if (selected_type_name == "个人") {
      $("[company]").addClass("hide");
      $("[individual]").removeClass("hide");
    } else { // 企业
      $("[individual]").addClass("hide");
      $("[company]").removeClass("hide");
    }
  });

  $('input[datepicker]').datetimepicker({
    format    : 'yyyy-mm-dd' ,
    minView   : 'month'      ,
    autoclose : true
  });

  handle_preview_img();
	handle_captcha_refresh();

  if (page == '/client/new') {
    handle_shareholder_modal();
    handle_loan_modal();
    handle_bonding_modal();
  } else if (page == '/application/new') {
    handle_mortgage_model();
    handle_guarantor_model();
  } else if (page == '/investigation/new') {
    handle_bank_account_model();
  } else if (/^\/(investigation|riskassessment|review)\/show/.test(page)) {
    handle_edit_btn();
  } else if (page == '/user/new') {
    handle_input_tooltip();
    handle_agreement_checkbox();
  } else if (/^\/user\/bindbank/.test(page)) {
    handle_input_tooltip();
    handle_city_selection();
    handle_auto_spacing();
  } else if (/^\/user\/show/.test(page)) {
    handle_city_selection();
		handle_sidebar_menu();
  } else if (/^\/product\/admin/.test(page)) {
    handle_guarantee_model();
    handle_file_input();
		handle_invest();
		handle_sidebar_menu();
	} else if (/^\/product(\/index)?/.test(page)) {
		handle_invest();
		handle_product_filter();
	} else if (/^\/user\/admin/.test(page)) {
		handle_user_filter();
  } else {

  }
});

function handle_product_filter() {
	
}

function handle_sidebar_menu() {
	$("a.parent").click(function() {
		$(this).siblings("ul").toggle();
	});
}

function handle_invest() {
	$(".invest-btn").click(function() {
		var idx = $(this).attr("modal-index");
		var modal_selector = "#invest-" + idx;
		var result = false;
		$.ajax({
			url: '/session/authenticated',
			type: 'get',
			async: false,
			success: function(data) {
				result = data.result;
			},
			error: function(e) {
				console.log(e.message);
			}
		});
		if (!result) {
			window.location = "/session/new";
			return;
		}
		$(modal_selector).modal('show');
	});
}

function handle_captcha_refresh() {
	$(".refreshable-captcha").click(function() {
		var uri = null;
		$.ajax({
			url: '/user/refreshcaptcha',
			type: 'get',
			async: false,
			success: function(data) {
				console.log(data);
				uri = data.uri;
			},
			error: function(e) {
				console.log(e.message);
			}
		});
		console.log(uri);
		$(this).attr("src", uri);
	});
}

function handle_preview_img() {
  $('.apreview').popover({
    html: true,
    trigger: 'hover',
    placement: 'auto',
    content: function () {
      return '<img src="' + $(this)[0].href + '" />';
    }
  });
  $('.preview').popover({
    html: true,
    trigger: 'hover',
    placement: 'top',
    content: function () {
      return '<img src="' + $(this)[0].src + '" />';
    }
  });
}

function handle_file_input() {
  $('.fileinput').fileinput({ width: '100%' });
}

function handle_guarantee_model() {
  var count = 0;
  $("button#guarantee-modal-save").on("click", function(e) {
    var guarantee_company = $("#new-guarantee-modal .modal-body input#guarantee-company").val();
    var guarantee_letter_code = $("#new-guarantee-modal .modal-body input#guarantee-letter_code").val();
    var guarantee_letter_scan = $("#new-guarantee-modal .modal-body input#guarantee-letter_scan").val();
    if (guarantee_company == "") {
      alert("不能留空!");
      return;
    }
    var new_row = JST['assets/linker/templates/add_row.ejs']({ 
      vals: [ guarantee_company, guarantee_letter_code, guarantee_letter_scan ]
    });
    var new_row_obj = $(new_row).appendTo("table#guarantees tbody");
    count++;
    $('<input>').attr({ type: 'hidden', name: 'guarantee_company_' + count, value: guarantee_company}).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'guarantee_letter_scan_' + count, value: guarantee_letter_scan}).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'guarantee_letter_code_' + count, value: guarantee_letter_code}).appendTo("form");
    $("#new-guarantee-modal .modal-body input").val('');
    $("#new-guarantee-modal").modal("hide");
  });
}

function handle_auto_spacing() {
  $('input#bank_account').keyup(function(e) {
    var val = this.value;
    if (e.which != 8 && e.which != 46) {  // handle delete and backspace
      if (val.replace(/\s/g, '').length % 4 == 0) {
        $(this).val(val + ' ');
      }
    } else {
      $(this).val(val);        
    }
  });
}

function handle_city_selection() {
  $('select.province').change(function(e) {
    var elem = $("option:selected", this);
    var p = elem.val();
		$(this).closest("form").validate().element("select.province");
    $.ajax({
      url: '/user/cities',
      type: 'get',
      data: 'province=' + p,
      success: function(cities) {
				console.log(cities);
        $('select.city').empty();
				if (cities.length == 0) {
					$('select.city').append("<option value=''>请先选择省份</option>");
				}
        for (var i = 0; i < cities.length; ++i) {
          $('select.city').append("<option value='" + cities[i] + "'>" + cities[i] + "</option>");
        }
				$('select.city').val(cities[0]);
        $('select.city').selectpicker('refresh');
				$('select.city').closest("form").validate().element("select.city");
      },
      error: function(e) {
        console.log(e.message);
      }
    });
  });
}

function handle_submit_btn(elem) {
  $(elem).closest("form")[0].submit();
  //$("form#haha-form-signup")[0].submit();
}

function handle_agreement_checkbox() {
  $("button.haha-btn-toggle").attr("disabled", "");
  $('input[name="agreement_acknowledged"]').change(function() {
    if(this.checked) {
      $("button.haha-btn-toggle").removeAttr("disabled");
    } else {
      $("button.haha-btn-toggle").attr("disabled", "");
    }
  });
}

function handle_input_tooltip() {
  $('input').tooltip({ 
    delay: 200
  });
}

function handle_edit_btn() {
  $("div#edit-btn-container").on('click', 'a#edit', function() {
    ["div.form-group input", "div.form-group select", "div.form-group textarea", "button#toggle-disabled"].map(function(elem) {
      $(elem).removeAttr("disabled");
    });
    ["hr", "div"].map(function(elem) {
      var selector = elem + "#toggle-hidden";
      $(selector).removeAttr("hidden");
    });
    $(this).text("取消修改");
    $(this).attr('id', "cancel-edit");
    $('select').selectpicker('refresh');
  });
  $("div#edit-btn-container").on('click', 'a#cancel-edit', function() {
    ["div.form-group input", "div.form-group select", "div.form-group textarea", "button#toggle-disabled"].map(function(elem) {
      $(elem).attr("disabled", "");
    });
    ["hr", "div"].map(function(elem) {
      var selector = elem + "#toggle-hidden";
      $(selector).attr("hidden", "");
    });
    $(this).text("修改");
    $(this).attr('id', "edit");
    $('select').selectpicker('refresh');
  });
}

function handle_bank_account_model() {
  var count = 0;
  $("button#bank_account-modal-save").on("click", function(e) {
    var bank = $("#new-bank_account-modal .modal-body input#bank_account-bank").val();
    var account = $("#new-bank_account-modal .modal-body input#bank_account-account").val();
    var basic_account_val = $("#new-bank_account-modal .modal-body select#bank_account-basic_account option:selected").val(); 
    var basic_accont_text = $("#new-bank_account-modal .modal-body select#bank_account-basic_account option:selected").text(); 
    if (bank == "" || account == "") {
      alert("不能留空!");
      return;
    }
    var new_row = JST['assets/linker/templates/add_row.ejs']({ 
      vals: [ basic_accont_text, bank, account ]
    });
    var new_row_obj = $(new_row).appendTo("table#bank_accounts tbody");
    count++;
    $('<input>').attr({ type: 'hidden', name: 'bank_account_bank_' + count, value: bank }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'bank_account_account_' + count, value: account }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'bank_account_basic_account_' + count, value: basic_account_val }).appendTo("form");
    $("#new-bank_account-modal .modal-body input").val('');
    $("#new-bank_account-modal").modal("hide");
  });
 
}


function handle_guarantor_model() {
  var count = 0;
  $("button#guarantor-modal-save").on("click", function(e) {
    var name = $("#new-guarantor-modal .modal-body input#guarantor-name").val();
    var legal_person = $("#new-guarantor-modal .modal-body input#guarantor-legal_person").val();
    var registered_capital = $("#new-guarantor-modal .modal-body input#guarantor-registered_capital").val();
    var total_asset = $("#new-guarantor-modal .modal-body input#guarantor-total_asset").val();
    var net_asset = $("#new-guarantor-modal .modal-body input#guarantor-net_asset").val();
    var bonding_amount = $("#new-guarantor-modal .modal-body input#guarantor-bonding_amount").val();
    if (name == "" || legal_person == "") {
      alert("不能留空!");
      return;
    }
    var new_row = JST['assets/linker/templates/add_row.ejs']({ 
      vals: [ name, legal_person, registered_capital, total_asset, net_asset, bonding_amount ]
    });
    var new_row_obj = $(new_row).appendTo("table#guarantors tbody");
    count++;
    $('<input>').attr({ type: 'hidden', name: 'guarantor_name_' + count, value: name }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'guarantor_legal_person_' + count, value: legal_person }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'guarantor_registered_capital_' + count, value: registered_capital }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'guarantor_total_asset_' + count, value: total_asset }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'guarantor_net_asset_' + count, value: net_asset }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'guarantor_bonding_amount_' + count, value: bonding_amount }).appendTo("form");
    $("#new-guarantor-modal .modal-body input").val('');
    $("#new-guarantor-modal").modal("hide");
  });
 
}


function handle_mortgage_model() {
  var count = 0;
  $("button#mortgage-modal-save").on("click", function(e) {
    var name = $("#new-mortgage-modal .modal-body input#mortgage-name").val();
    var value = $("#new-mortgage-modal .modal-body input#mortgage-value").val();
    var type_id = $("#new-mortgage-modal .modal-body select#mortgage-type option:selected").val(); 
    var type_name = $("#new-mortgage-modal .modal-body select#mortgage-type option:selected").text(); 
    if (name == "" || value == "") {
      alert("不能留空!");
      return;
    }
    //var new_sh_row = "<tr><td>" + name + "</td><td>" + amount + "</td><td>" + form_name + "</td><td>" + share + "</td></tr>";
    var new_row = JST['assets/linker/templates/add_row.ejs']({ vals: [ type_name, name, value ]});
    var new_row_obj = $(new_row).appendTo("table#mortgages tbody");
    count++;
    $('<input>').attr({ type: 'hidden', name: 'mortgage_name_' + count, value: name }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'mortgage_value_' + count, value: value }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'mortgage_type_' + count, value: type_id }).appendTo("form");
    $("#new-mortgage-modal .modal-body input").val('');
    $("#new-mortgage-modal").modal("hide");
  });
 
}

function handle_shareholder_modal() {
  var shareholder_count = 0;
  $("button#shareholder-modal-save").on("click", function(e) {
    var name = $("#new-shareholder-modal .modal-body input#name").val();
    var amount = $("#new-shareholder-modal .modal-body input#amount").val();
    var share = $("#new-shareholder-modal .modal-body input#share").val();
    var form_id = $("#new-shareholder-modal .modal-body select#form option:selected").val(); 
    var form_name = $("#new-shareholder-modal .modal-body select#form option:selected").text(); 
    if (name == "" || amount == "" || share == "") {
      alert("不能留空!");
      return;
    }
    //var new_sh_row = "<tr><td>" + name + "</td><td>" + amount + "</td><td>" + form_name + "</td><td>" + share + "</td></tr>";
    var new_sh_row = JST['assets/linker/templates/add_row.ejs']({ vals: [ name, amount, form_name, share ]});
    var new_sh_row_obj = $(new_sh_row).appendTo("table#shareholders tbody");
    shareholder_count++;
    $('<input>').attr({ type: 'hidden', name: 'shareholder_name_' + shareholder_count, value: name }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'shareholder_amount_' + shareholder_count, value: amount }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'shareholder_share_' + shareholder_count, value: share }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'shareholder_form_' + shareholder_count, value: form_id }).appendTo("form");
    $("#new-shareholder-modal .modal-body input").val('');
    $("#new-shareholder-modal").modal("hide");
  });
}

function handle_loan_modal() {
  var loan_count = 0;
  $("button#loan-modal-save").on("click", function(e) {
    var amount = $("#new-loan-modal .modal-body input#amount").val();
    var start = $("#new-loan-modal .modal-body input#start").val();
    var end = $("#new-loan-modal .modal-body input#end").val();
    var loaner_id = $("#new-loan-modal .modal-body select#loaner option:selected").val(); 
    var loaner_name = $("#new-loan-modal .modal-body select#loaner option:selected").text(); 
    var form_id = $("#new-loan-modal .modal-body select#form option:selected").val(); 
    var form_name = $("#new-loan-modal .modal-body select#form option:selected").text(); 
    if (amount == "" || start == "" || end == "") {
      alert("不能留空!");
      return;
    }
    var new_sh_row = JST['assets/linker/templates/add_row.ejs']({ vals: [ loaner_name, amount, start, end, form_name ]});
    var new_sh_row_obj = $(new_sh_row).appendTo("table#loans tbody");
    loan_count++;
    $('<input>').attr({ type: 'hidden', name: 'loan_amount_' + loan_count, value: amount }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'loan_start_' + loan_count, value: start }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'loan_end_' + loan_count, value: end }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'loan_form_' + loan_count, value: form_id }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'loan_loaner_' + loan_count, value: loaner_id }).appendTo("form");
    $("#new-loan-modal .modal-body input").val('');
    $("#new-loan-modal").modal("hide");
  });
}

function handle_bonding_modal() {
  var bonding_count = 0;
  $("button#bonding-modal-save").on("click", function(e) {
    var warrantee_type_id = $("#new-bonding-modal .modal-body select#warrantee_type option:selected").val(); 
    var warrantee_type_name = $("#new-bonding-modal .modal-body select#warrantee_type option:selected").text(); 
    var warrantee = $("#new-bonding-modal .modal-body input#warrantee").val();
    var loaner_id = $("#new-bonding-modal .modal-body select#loaner option:selected").val(); 
    var loaner_name = $("#new-bonding-modal .modal-body select#loaner option:selected").text(); 
    var amount = $("#new-bonding-modal .modal-body input#amount").val();
    var start = $("#new-bonding-modal .modal-body input#start").val();
    var end = $("#new-bonding-modal .modal-body input#end").val();
    if (warrantee == "" || amount == "" || start == "" || end == "") {
      alert("不能留空!");
      return;
    }
    var new_row = JST['assets/linker/templates/add_row.ejs']({ vals: [ warrantee_type_name, warrantee, loaner_name, amount, start, end ]});
    var new_row_obj = $(new_row).appendTo("table#bondings tbody");
    bonding_count++;
    $('<input>').attr({ type: 'hidden', name: 'bonding_warrantee_type_' + bonding_count, value: warrantee_type_id }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'bonding_warrantee_' + bonding_count, value: warrantee }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'bonding_loaner_' + bonding_count, value: loaner_id }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'bonding_amount_' + bonding_count, value: amount }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'bonding_start_' + bonding_count, value: start }).appendTo("form");
    $('<input>').attr({ type: 'hidden', name: 'bonding_end_' + bonding_count, value: end }).appendTo("form");
    $("#new-bonding-modal .modal-body input").val('');
    $("#new-bonding-modal").modal("hide");
  });
}

function handle_user_filter() {
	var $rows = $('table#users > tbody > tr');
	$('input#user-filter').keyup(function() {
    var val = $.trim($(this).val());
    var reg = RegExp(val, 'i');
    var text;
    $rows.show().filter(function() {
      text = _.map($.trim($(this).text()).split(/\n/), function(e) { return $.trim(e); }).join(" ");
      return !reg.test(text);
    }).hide();
	});
}

function handle_product_filter() {
	var $titles = $('h4.panel-title > a');
	$('input#product-filter').keyup(function() {
    var val = $.trim($(this).val());
    var reg = RegExp(val, 'i');
    var text;
		// rest all to be shown
		$titles.closest('div.panel').show();
    $titles.filter(function() {
      text = $.trim($(this).text());
      return !reg.test(text);
    }).closest('div.panel').hide();
	});
}

function updateUrl() {
	
}

/* internal */
