$(function() {
	localStorage.setItem('ip', returnCitySN['cip']);
	if(GetRequest().qbCode) {
		localStorage.setItem('qbCode', GetRequest().qbCode);
	}
	if(localStorage.getItem('ticket_ids') && localStorage.getItem('oId')) {
		var ss = {
			"ticketIds": localStorage.getItem('ticket_ids'),
			"openId": localStorage.getItem('oId')
		}
		var ssv = ajaxg(ss, 'ticket', 'unLock');
		localStorage.setItem('ticket_ids', '');
		localStorage.setItem('oId', '');
	}

	$('#btnSubmit').on('click', function() {
		var num = $('#phone').val();
		if($('#phone').val() == "") {
			toast('手机号码不能为空！！');
			return false;
		} else if(!/^(13|15|16|18|19|14|17)[0-9]{9}$/.test($('#phone').val())) {
			toast('请输入正确的手机号码！！');
			return false;
		} else {
			$('.loading').show();
		}
		var data = {},
			sign = '',
			datas = null,
			keys = [],
			beforesign = "";
		data.body = {
			"carryStaId": $('.CarryStaName').data('num'),
			"strDate": $('.DrvDateTime').data('time'),
			"signId": $('.City').data('id'),
			"stopName": $('.StopName').html(),
			"phone": $('#phone').val(),
			"quantity": $('.select-list li.active').data('picker-value')
		};
		data.body.key = '123435dasfdg34t4ewfe414214';
		var ss = eval(data.body);
		for(var a in ss) {
			if(a != "sign") keys.push(a);
		}
		keys.sort();
		for(var a in keys) {
			if(formatV(ss[keys[a]]) != "") {
				beforesign += "&" + keys[a] + "=" + formatV(ss[keys[a]]);
			}
		}
		beforesign = beforesign.substr(1);
		var besign = beforesign;
		console.log(besign);
		sign = $.md5(besign);
		sign = sign.toUpperCase();
		data.head = {
			"ip": localStorage.getItem('ip'),
			"sign": sign,
			"signType": "MD5",
			"version": '1.5',
			"token": 'kjsmtesta4f351997a2382c8ac50b432',
			"server": 'lockForQuickBuy'
		};
		delete data.body.key;
		$.ajax({
			url: 'http://192.168.1.240:9020/tourism/quick_buy',
			type: "post",
			data: JSON.stringify(data),
			dataType: 'json',
			contentType: 'application/json',
			success: function(res) {
				console.log(res);
				if(res.head.statusCode == "0000") {
					if($('.list li.active').data('picker-value') > res.body.ticket_lines.amount) {
						toast('余票不足');
						return false;
					}
					$(this).off('click');

					localStorage.setItem('oId', res.body.openId);
					localStorage.setItem('ticket_ids', res.body.ticket_ids);
					localStorage.setItem('payOId', res.body.pay_order_id);
					localStorage.setItem('code', res.body.code);
					location.href = 'payfor.html?order_id=' + res.body.pay_order_id + '&pri=' + localStorage.getItem('price') + '&qbCode=' + localStorage.getItem('qbCode') + '&expire_time=' + res.body.expire_time + '&w_order_id=' + res.body.web_order_id[0];
				} else {
					if(res.head.statusCode == "B00021") {
						alert_f(res.head.statusMessage);
						$('.footer').html('<span class="ft-btn linkH"><a href="http://wap.scqcp.com">前往微官网购买车票</span>');
					} else if(res.head.statusCode == "B00037") {
						alert_f('本班次已超过预售时间，是否继续购买下一班次车票？', '<a href="#" class="btn_rpay">再次购买</a>', 1);
					} else {
						toast(res.head.statusMessage);
					}
				}
				$('.loading').hide();
			},
			error: function(res, status) {
				if(status == 'error') {
					toast('服务器无响应');
				} else {
					toast('请求服务器失败');
				}
			}
		});
	});
	$('#picker').on('click', function() {
		var i = $('.select-list li.active').index();
		$('.panel-wrap').addClass('active');
		$('.select-list').css({
			'transform': 'translate3d(0px, ' + (72 - 36 * i) + 'px, 0px)'
		}, {
			'transition-duration': '0ms'
		});
	}); 
	$('.btn-cancel').on('click', function() {
		$('.panel-wrap').removeClass('active');
	});
	$(document).on('click', '.btn_rpay', function(){
		location=location;
	});
	$('.btn-ok').on('click', function() {
		$('#picker .pn,.num').html($('.list li.active').data('picker-value') + '张');
		$('.panel-wrap').removeClass('active');
		if($('.list li.active').data('picker-value') > localStorage.getItem('SAmount')) {
			toast('余票不足');
		}
		total();
	});

	var ss = {
		"qbCode": localStorage.getItem('qbCode')
	};
	var data = ajaxg(ss, 'quick_buy', 'searchForQuickBuy');
	if(data) {
		var datatime = new Date(data.body.DrvDateTime.replace("-", "/").replace("-", "/"));
		$('.City').attr('data-Id', data.body.SignID).html(data.body.City);
		$('.StopName').html(data.body.StopName);
		$('.CarryStaName').attr('data-num', data.body.CarryStaId).html(data.body.CarryStaName);
		$('.price').attr('price', data.body.FullPrice);
		$('.price b,.total').html('&yen' + data.body.FullPrice);
		localStorage.setItem('price', data.body.FullPrice);
		localStorage.setItem('SAmount', data.body.SAmount);
		$('.data').html(datatime.format('yyyy年MM月dd日'));
		if(data.body.SchTypeName == '固定班') {
			$('.DrvDateTime').attr('data-time', data.body.DrvDateTime).html(datatime.format('hh:mm'));
		} else if(data.body.SchTypeName == '流水班') {
			$('.DrvDateTime').attr('data-time', data.body.DrvDateTime).html(datatime.format('hh:mm') + '前乘车');
			$('.attentions').html('本班次是流水班，即滚动发车。乘客须在截止时间之前到站乘车');
		}
		// 	var dataUrl = 'http://test.liziqun.com/token/AuthoKjsm/?carry_sta_id=' + data.body.CarryStaId + '&stop_name=' + data.body.StopName + '&str_date=' + data.body.DrvDateTime.replace(" ", "_");
		//	var dataUrl = encodeURIComponent('http://wxmanage.scqcp.net/token/AuthoKjsm/?carry_sta_id=&stop_name=&str_date=');
		var dataUrl = 'http://wxmanage.scqcp.net/token/AuthoKjsm/?carry_sta_id=&stop_name=&str_date=';
		localStorage.setItem('wxcode', GetRequest().wxcode);
		if(isWeixin && GetRequest().qbCode) {
			location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe8a3b7f56da1f90a&redirect_uri=' + dataUrl + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
		}
	}

	var touchStartX = 0;
	var touchStartY = 0;
	var baseY = 0;
	$(".picker-list").on('touchstart', function(e) {
		var touch = e.originalEvent.changedTouches[0]; //获取第一个触点
		touchStartX = Number(touch.clientX); //页面触点X坐标
		touchStartY = Number(touch.clientY); //页面触点Y坐标
		baseY = (72 - (Number($(".picker-list").find(".active").data("picker-value")) - 1) * 36);
	});
	$(".picker-list").on('touchmove', function(e) {
		e.preventDefault();
		var touch = e.originalEvent.changedTouches[0]; //获取第一个触点
		var x = Number(touch.clientX); //页面触点X坐标
		var y = Number(touch.clientY); //页面触点Y坐标
		var showY = baseY + y - touchStartY;
		if(showY > 72) {
			showY = 72;
		}
		if(showY < -72) {
			showY = -72;
		}
		$(".picker-list").find(".active").removeClass("active");
		pickerSelect(showY);
		$(".select-list").css("transform", "translate3d(0px, " + showY + "px, 0px)");
	});

	$(".picker-list").on('touchend', function(e) {
		$(".select-list").css("transform", "translate3d(0px, " + (72 - (Number($(".picker-list").find(".active").data("picker-value")) - 1) * 36) + "px, 0px)");
	});
});

function pickerSelect(currentY) {
	if(currentY > 54) {
		$("#1z").addClass("active");
	} else if(currentY > 18) {
		$("#2z").addClass("active");
	} else if(currentY > -18) {
		$("#3z").addClass("active");
	} else if(currentY > -54) {
		$("#4z").addClass("active");
	} else {
		$("#5z").addClass("active");
	}
}