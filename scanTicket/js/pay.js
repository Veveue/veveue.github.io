var fUrl = "http://192.168.1.208:9001/";

$(function() {
	setInterval(GetRTime, 1000);
	$.jsplugin = {};
	$.jsplugin.StringBuilder = function() {
		this._buffers = [];
		this._length = 0;
		this._splitChar = arguments.length > 0 ? arguments[arguments.length - 1] : '';
		if(arguments.length > 0) {
			for(var i = 0, iLen = arguments.length - 1; i < iLen; i++) {
				this.Append(arguments[i]);
			}
		}
	};
	$.jsplugin.StringBuilder.prototype.Append = function(str) {
		this._length += str.length;
		this._buffers[this._buffers.length] = str;
	};
	$.jsplugin.StringBuilder.prototype.ToString = function() {
		if(arguments.length == 1) {
			return this._buffers.join(arguments[0]);
		} else {
			return this._buffers.join(this._splitChar);
		}
	};

	var ss = {
		'f': 'f'
	};
	var data_pay = ajaxg(ss, 'pay', 'getPayChannel');
	var dpy = data_pay.body.payChannel,
		_html = "";
	for(var i = 0; i < dpy.length; i++) {
		if(dpy[i].plateform == 'wsAlipayM') {
			if(!isWeixin) {
				_html += '<li><i class="zfb"></i><label>支付宝支付</label><i class="nselected fr wsAlipayM" pay="wsAlipayM"></i></li>';
			}
		} else if(dpy[i].plateform == "wsUnionpayM") {
			_html += '<li><i class="yl"></i><label>银联支付</label><i class="nselected fr wsUnionpay" pay="wsUnionpayM"></i></li>';
		} else if(dpy[i].plateform == 'weixin') {
			if(!isAlipay) {
				_html += '<li><i class="wx"></i><label>微信支付 </label><i class="selected fr appWeixin" pay="weixin"></i></li>';
			}
		}
	} 
	$('.payList').html(_html);
	$('.pr_ice').html('&yen' + GetRequest().pri);
	$('.orderId').html(GetRequest().w_order_id);
	localStorage.setItem('orderid',GetRequest().order_id);
	$('.btn_buy').on('click', function() {
		var ss = {
			"payChannel": $('.selected').attr('pay'),
			"subjectName": '扫码购票',
			"customerIp": localStorage.getItem('ip'),
			"payOrderId": GetRequest().order_id,
			"tradeType": 'WAP',
			"frontUrl": fUrl + "order.html?orderid=" + GetRequest().order_id,
			"errorUrl": fUrl + "order.html?orderid=" + GetRequest().order_id
		};
		if(isWeixin) {
			ss.tradeType = 'JSAPI';
//			ss.openId = localStorage.getItem('wxcode');
			ss.openId = 'o7Swjt5AYtao-TQdnuX4NV-Y1cVo'
		} 
		var data = ajaxg(ss, 'pay', 'getPayInfo');
		if(data.head.statusCode == '0000') { 
			if($('.selected').attr('pay') == 'weixin') {
				var fhref = decodeURIComponent(data.body.payInfo[0].weixin.deeplink);
				if(isWeixin) {
//					var jsons = [];
//					if(fhref.indexOf("?") != -1) {
//						var str1 = fhref.split("?", 2);
//						var strs = str1[1].split("&");
//						for(var i = 0; i < strs.length; i++) {
//							jsons[strs[i].split("=", 2)[0]] = (strs[i].split("=", 2)[1]);
//						}
//					}  
					WeixinJSBridge.invoke('getBrandWCPayRequest', {
						"appId": data.body.payInfo[0].weixin.appId,
						"timeStamp": data.body.payInfo[0].weixin.timeStamp,
						"nonceStr": data.body.payInfo[0].weixin.nonceStr,
						"package": data.body.payInfo[0].weixin.package,
						"signType": data.body.payInfo[0].weixin.signType,
						"paySign": data.body.payInfo[0].weixin.paySign
					}, function(res) {
						if(res.err_msg == "get_brand_wcpay_request：ok") {
							location.href = fUrl + "order.html?orderid=" + GetRequest().order_id;
						} // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
					});
				} else {
					alert_f('<p style="text-align: left;">1.如果您已支付成功，请点击“支付成功”按钮</p><p style="text-align: left;">2.如果您还未安装微信客户端，请点击“取消”按钮并选择其他支付方式完成支付。</p>', '<a href="#" class="btn_payover">支付完成</a>', 1);
					location.href = fhref;
				}
			} else if($('.selected').attr('pay') == 'wsAlipayM') {
				if(data.body.payInfo[0].wsAlipayM) {
					var q = data.body.payInfo[0].wsAlipayM,
						u = q.substr(q.indexOf('?') + 1);
					var u1 = u.split('&');
					u = '';
					for(var a in u1) {
						u += (u ? "&" : "") + u1[a].substr(0, u1[a].indexOf('=') + 1) + encodeURIComponent(u1[a].substr(u1[a].indexOf('=') + 1));
					}
					location.href = q.substr(0, q.indexOf('?') + 1) + u;
				} else {
					toast('提交订单出错');
				}
			} else if($('.selected').attr('pay') == 'wsUnionpayM') {
				var u = data.body.payInfo[0],
					ps = u.wsUnionpay.split('&'),
					sb = new $.jsplugin.StringBuilder(),
					temp = '';
				sb.Append('<form id="upmppaysubmit" name="upmppaysubmit" action="' + u.payUrl + '" method="post">');
				for(var a in ps) {
					temp = ps[a].split('=');
					sb.Append("<input type='hidden' name='" + temp[0] + "'");
					if(temp.length > 2) {
						temp.shift(0, 1);
						temp[1] = temp.join('=');
					}
					sb.Append(" value='" + (temp[1]) + "'/>");
				}
				sb.Append("<input type='submit' value='提交' style='display:none;'></form>");
				sb.Append("<script>document.forms['upmppaysubmit'].submit();</script>");

				$('body').append(sb.ToString());
			}
		} else {
			toast(data.head.statusMessage);
		}
	});

	$('.payList li').on('click', function() {
		$('.payList li .fr').addClass('nselected').removeClass('selected');
		$(this).find('.fr').addClass('selected').removeClass('nselected');
		$('.Pay').html('(' + $(this).find('.fr').prev().html() + ')');
	});
	$(document).on('click', '.btn_payover', function() {
		var sv = {
			"payOrderId": GetRequest().order_id,
			"openId": localStorage.getItem('oId')
		};
		var data_pay = ajaxg(sv, 'ticket', 'getUserOrderTicketInfo');
		if(data_pay.body.state == "pending") {
			toast('待支付!');
		} else if(data_pay.body.state == "payfail") {
			toast('支付失败,重新支付！');
		} else if(data_pay.body.state == "sell_succeeded") {
			location.href = "order.html?orderid=" + GetRequest().order_id;
		}
	});
	$('.js-back').on('click', function() {
		location.href = 'index.html?qbCode=' + localStorage.getItem('qbCode');
	});

	if(isAlipay) {
		$('.wsAlipayM').addClass('selected').removeClass('nselected');
	}
	$('.Pay').html('(' + $('.selected').prev().html() + ')');
});