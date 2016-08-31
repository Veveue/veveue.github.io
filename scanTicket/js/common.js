var ua = navigator.userAgent.toLowerCase();
var isWeixin = ua.indexOf('micromessenger') != -1; 
var isAlipay = ua.indexOf('alipayclient') != -1; 
if($('body').width()==320){$('body').css('min-height','480px');}
function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串 
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

if(/android/i.test(navigator.userAgent)) {
	var $body = $("body"),
		$_document = $(document);
	$body.find(".weui_input").focus(function(e) {
		e.preventDefault();
		var _this = $(this);
		setTimeout(function() {
			var body_scrollTop = $_document.scrollTop();
			$body.css("padding-bottom", $(window).height() * 0.5 + "px");
			$_document.scrollTop(body_scrollTop + $(window).height() * 0.5);
			_this.blur(function() {
				$body.css("padding-bottom", "0px");
				$_document.scrollTop(body_scrollTop);
			});
		}, 200);
	});
}

//倒计时
function GetRTime() {
	var EndTime = new Date(decodeURIComponent(GetRequest().expire_time).replace("-", "/").replace("-", "/"));
	var NowTime = new Date();
	var t = EndTime.getTime() - NowTime.getTime();
	var d = 0;
	var h = 0;
	var m = 0;
	var s = 0;
	if(t >= 0) {
		d = Math.floor(t / 1000 / 60 / 60 / 24);
		h = Math.floor(t / 1000 / 60 / 60 % 24);
		m = Math.floor(t / 1000 / 60 % 60);
		s = Math.floor(t / 1000 % 60);
		$('.djs').html(m + '分' + s + '秒');
	}else{
		$('.tips').html('已超过支付时间，请重新扫码购买！');
	}
}

function toast(v) {
	var toast = '<section class="toast-wrap active"><div class="toast"><p class="toast-txt">' + v + '</p></div></section>',
		$toastWrap = $('.toast-wrap');
	if($toastWrap.size() === 0) {
		$('body').append(toast);
	}
	$('.toast-txt').html(v);
	$toastWrap.addClass('active');
	setTimeout(function() {
		$('.toast-wrap').removeClass('active');
	}, 2000);
}

function alert_f(v, p, z) {
	var tis = '<section class="dialog-wrap active"><div class="overlay"></div><div class="dialog"><div class="dialog-bd"><p class="bd-txt">' + v + '</p></div><div class="dialog-ft ft footer"> <span class="ft-btn">' + p + '</span><span class="ft-btn canal">取消</span></div></div></section>';
	var $dialogWrap = $('.dialog-wrap');
	if($dialogWrap.size() === 0) {
		$('body').append(tis);
	}
	$dialogWrap.addClass('active');
	$('.canal').on('click', function() {
		$('.dialog-wrap').removeClass('active');
	})
}

function formatV(v) {
	return typeof v == "string" ? v : JSON.stringify(v);
}

function total() {
	if($('.price').attr('price')){ 
		var price = $('.price').attr('price') * $('.select-list li.active').data('picker-value');
		$('.total').html('&yen' + price);
		$('.total').attr('price', price);
		localStorage.setItem('price', price);
	}
}

function ajaxg(s, v, g) {   
	var data = {},
		sign = '',
		datas = null,
		keys = [],
		beforesign = "";
	data.body = s;
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
	sign = $.md5(besign);
	sign = sign.toUpperCase();
	data.head = {
		"ip": localStorage.getItem('ip'),
		"sign": sign,
		"signType": "MD5",
		"version": '1.5',
		"token": 'kjsmtesta4f351997a2382c8ac50b432',
		"server": g
	};
	delete data.body.key;
	$.ajax({
		url: 'http://192.168.1.240:9020/tourism/' + v,
		type: "post",  
		data: JSON.stringify(data),
		dataType: 'json',
		contentType: 'application/json',
		async: false,
		success: function(res) { 
			if(res.head.statusCode == "0000") {
				datas = res;
			} else {
				if(res.head.statusCode == "B00021") {
					alert_f(res.head.statusMessage);
					$('.footer').html('<span class="ft-btn linkH"><a href="http://wap.scqcp.com">前往微官网购买车票</span>');
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
	return datas;
}
Date.prototype.format = function(format) {
	/* 
	 * eg:format="yyyy-MM-dd hh:mm:ss"; 
	 */
	var o = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds(),
		'W': this.getDay()
	}

	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}

	for(var k in o) {
		if(new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

/**
 * jQuery MD5 hash algorithm function
 * 
 * 	<code>
 * 		Calculate the md5 hash of a String 
 * 		String $.md5 ( String str )
 * 	</code>
 * 
 * Calculates the MD5 hash of str using the » RSA Data Security, Inc. MD5 Message-Digest Algorithm, and returns that hash. 
 * MD5 (Message-Digest algorithm 5) is a widely-used cryptographic hash function with a 128-bit hash value. MD5 has been employed in a wide variety of security applications, and is also commonly used to check the integrity of data. The generated hash is also non-reversable. Data cannot be retrieved from the message digest, the digest uniquely identifies the data.
 * MD5 was developed by Professor Ronald L. Rivest in 1994. Its 128 bit (16 byte) message digest makes it a faster implementation than SHA-1.
 * This script is used to process a variable length message into a fixed-length output of 128 bits using the MD5 algorithm. It is fully compatible with UTF-8 encoding. It is very useful when u want to transfer encrypted passwords over the internet. If you plan using UTF-8 encoding in your project don't forget to set the page encoding to UTF-8 (Content-Type meta tag). 
 * This function orginally get from the WebToolkit and rewrite for using as the jQuery plugin.
 * 
 * Example
 * 	Code
 * 		<code>
 * 			$.md5("I'm Persian."); 
 * 		</code>
 * 	Result
 * 		<code>
 * 			"b8c901d0f02223f9761016cfff9d68df"
 * 		</code>
 * 
 * @alias Muhammad Hussein Fattahizadeh < muhammad [AT] semnanweb [DOT] com >
 * @link http://www.semnanweb.com/jquery-plugin/md5.html
 * @see http://www.webtoolkit.info/
 * @license http://www.gnu.org/licenses/gpl.html [GNU General Public License]
 * @param {jQuery} {md5:function(string))
 * @return string
 */
(function($) {
	var rotateLeft = function(lValue, iShiftBits) {
		return(lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	}
	var addUnsigned = function(lX, lY) {
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if(lX4 & lY4) return(lResult ^ 0x80000000 ^ lX8 ^ lY8);
		if(lX4 | lY4) {
			if(lResult & 0x40000000) return(lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			else return(lResult ^ 0x40000000 ^ lX8 ^ lY8);
		} else {
			return(lResult ^ lX8 ^ lY8);
		}
	}
	var F = function(x, y, z) {
		return(x & y) | ((~x) & z);
	}
	var G = function(x, y, z) {
		return(x & z) | (y & (~z));
	}
	var H = function(x, y, z) {
		return(x ^ y ^ z);
	}
	var I = function(x, y, z) {
		return(y ^ (x | (~z)));
	}
	var FF = function(a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};
	var GG = function(a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};
	var HH = function(a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};
	var II = function(a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};
	var convertToWordArray = function(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWordsTempOne = lMessageLength + 8;
		var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
		var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
		var lWordArray = Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while(lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	};
	var wordToHex = function(lValue) {
		var WordToHexValue = "",
			WordToHexValueTemp = "",
			lByte, lCount;
		for(lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255;
			WordToHexValueTemp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
		}
		return WordToHexValue;
	};
	var uTF8Encode = function(string) {
		string = string.replace(/\x0d\x0a/g, "\x0a");
		var output = "";
		for(var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if(c < 128) {
				output += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				output += String.fromCharCode((c >> 6) | 192);
				output += String.fromCharCode((c & 63) | 128);
			} else {
				output += String.fromCharCode((c >> 12) | 224);
				output += String.fromCharCode(((c >> 6) & 63) | 128);
				output += String.fromCharCode((c & 63) | 128);
			}
		}
		return output;
	};
	$.extend({
		md5: function(string) {
			var x = Array();
			var k, AA, BB, CC, DD, a, b, c, d;
			var S11 = 7,
				S12 = 12,
				S13 = 17,
				S14 = 22;
			var S21 = 5,
				S22 = 9,
				S23 = 14,
				S24 = 20;
			var S31 = 4,
				S32 = 11,
				S33 = 16,
				S34 = 23;
			var S41 = 6,
				S42 = 10,
				S43 = 15,
				S44 = 21;
			string = uTF8Encode(string);
			x = convertToWordArray(string);
			a = 0x67452301;
			b = 0xEFCDAB89;
			c = 0x98BADCFE;
			d = 0x10325476;
			for(k = 0; k < x.length; k += 16) {
				AA = a;
				BB = b;
				CC = c;
				DD = d;
				a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
				d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
				c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
				b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
				a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
				d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
				c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
				b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
				a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
				d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
				c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
				b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
				a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
				d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
				c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
				b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
				a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
				d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
				c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
				b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
				a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
				d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
				c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
				b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
				a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
				d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
				c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
				b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
				a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
				d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
				c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
				b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
				a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
				d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
				c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
				b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
				a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
				d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
				c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
				b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
				a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
				d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
				c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
				b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
				a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
				d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
				c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
				b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
				a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
				d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
				c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
				b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
				a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
				d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
				c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
				b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
				a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
				d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
				c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
				b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
				a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
				d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
				c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
				b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
				a = addUnsigned(a, AA);
				b = addUnsigned(b, BB);
				c = addUnsigned(c, CC);
				d = addUnsigned(d, DD);
			}
			var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
			return tempValue.toLowerCase();
		}
	});
})(jQuery);

(function() {
	var BASE64_MAPPING = [
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
		'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
		'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
		'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
		'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
		'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
		'w', 'x', 'y', 'z', '0', '1', '2', '3',
		'4', '5', '6', '7', '8', '9', '+', '/'
	];

	/**
	 *ascii convert to binary
	 */
	var _toBinary = function(ascii) {
		var binary = new Array();
		while(ascii > 0) {
			var b = ascii % 2;
			ascii = Math.floor(ascii / 2);
			binary.push(b);
		}
		/*
		 var len = binary.length;
		 if(6-len > 0){
		 for(var i = 6-len ; i > 0 ; --i){
		 binary.push(0);
		 }
		 }*/
		binary.reverse();
		return binary;
	};

	/**
	 *binary convert to decimal
	 */
	var _toDecimal = function(binary) {
		var dec = 0;
		var p = 0;
		for(var i = binary.length - 1; i >= 0; --i) {
			var b = binary[i];
			if(b == 1) {
				dec += Math.pow(2, p);
			}
			++p;
		}
		return dec;
	};

	/**
	 *unicode convert to utf-8
	 */
	var _toUTF8Binary = function(c, binaryArray) {
		var mustLen = (8 - (c + 1)) + ((c - 1) * 6);
		var fatLen = binaryArray.length;
		var diff = mustLen - fatLen;
		while(--diff >= 0) {
			binaryArray.unshift(0);
		}
		var binary = [];
		var _c = c;
		while(--_c >= 0) {
			binary.push(1);
		}
		binary.push(0);
		var i = 0,
			len = 8 - (c + 1);
		for(; i < len; ++i) {
			binary.push(binaryArray[i]);
		}

		for(var j = 0; j < c - 1; ++j) {
			binary.push(1);
			binary.push(0);
			var sum = 6;
			while(--sum >= 0) {
				binary.push(binaryArray[i++]);
			}
		}
		return binary;
	};

	var __BASE64 = {
		/**
		 *BASE64 Encode
		 */
		encoder: function(str) {
			var base64_Index = [];
			var binaryArray = [];
			for(var i = 0, len = str.length; i < len; ++i) {
				var unicode = str.charCodeAt(i);
				var _tmpBinary = _toBinary(unicode);
				if(unicode < 0x80) {
					var _tmpdiff = 8 - _tmpBinary.length;
					while(--_tmpdiff >= 0) {
						_tmpBinary.unshift(0);
					}
					binaryArray = binaryArray.concat(_tmpBinary);
				} else if(unicode >= 0x80 && unicode <= 0x7FF) {
					binaryArray = binaryArray.concat(_toUTF8Binary(2, _tmpBinary));
				} else if(unicode >= 0x800 && unicode <= 0xFFFF) { //UTF-8 3byte
					binaryArray = binaryArray.concat(_toUTF8Binary(3, _tmpBinary));
				} else if(unicode >= 0x10000 && unicode <= 0x1FFFFF) { //UTF-8 4byte
					binaryArray = binaryArray.concat(_toUTF8Binary(4, _tmpBinary));
				} else if(unicode >= 0x200000 && unicode <= 0x3FFFFFF) { //UTF-8 5byte
					binaryArray = binaryArray.concat(_toUTF8Binary(5, _tmpBinary));
				} else if(unicode >= 4000000 && unicode <= 0x7FFFFFFF) { //UTF-8 6byte
					binaryArray = binaryArray.concat(_toUTF8Binary(6, _tmpBinary));
				}
			}

			var extra_Zero_Count = 0;
			for(var i = 0, len = binaryArray.length; i < len; i += 6) {
				var diff = (i + 6) - len;
				if(diff == 2) {
					extra_Zero_Count = 2;
				} else if(diff == 4) {
					extra_Zero_Count = 4;
				}
				//if(extra_Zero_Count > 0){
				//	len += extra_Zero_Count+1;
				//}
				var _tmpExtra_Zero_Count = extra_Zero_Count;
				while(--_tmpExtra_Zero_Count >= 0) {
					binaryArray.push(0);
				}
				base64_Index.push(_toDecimal(binaryArray.slice(i, i + 6)));
			}

			var base64 = '';
			for(var i = 0, len = base64_Index.length; i < len; ++i) {
				base64 += BASE64_MAPPING[base64_Index[i]];
			}

			for(var i = 0, len = extra_Zero_Count / 2; i < len; ++i) {
				base64 += '=';
			}
			return base64;
		},
		/**
		 *BASE64  Decode for UTF-8
		 */
		decoder: function(_base64Str) {
			var _len = _base64Str.length;
			var extra_Zero_Count = 0;
			/**
			 *计算在进行BASE64编码的时候，补了几个0
			 */
			if(_base64Str.charAt(_len - 1) == '=') {
				//alert(_base64Str.charAt(_len-1));
				//alert(_base64Str.charAt(_len-2));
				if(_base64Str.charAt(_len - 2) == '=') { //两个等号说明补了4个0
					extra_Zero_Count = 4;
					_base64Str = _base64Str.substring(0, _len - 2);
				} else { //一个等号说明补了2个0
					extra_Zero_Count = 2;
					_base64Str = _base64Str.substring(0, _len - 1);
				}
			}

			var binaryArray = [];
			for(var i = 0, len = _base64Str.length; i < len; ++i) {
				var c = _base64Str.charAt(i);
				for(var j = 0, size = BASE64_MAPPING.length; j < size; ++j) {
					if(c == BASE64_MAPPING[j]) {
						var _tmp = _toBinary(j);
						/*不足6位的补0*/
						var _tmpLen = _tmp.length;
						if(6 - _tmpLen > 0) {
							for(var k = 6 - _tmpLen; k > 0; --k) {
								_tmp.unshift(0);
							}
						}
						binaryArray = binaryArray.concat(_tmp);
						break;
					}
				}
			}

			if(extra_Zero_Count > 0) {
				binaryArray = binaryArray.slice(0, binaryArray.length - extra_Zero_Count);
			}

			var unicode = [];
			var unicodeBinary = [];
			for(var i = 0, len = binaryArray.length; i < len;) {
				if(binaryArray[i] == 0) {
					unicode = unicode.concat(_toDecimal(binaryArray.slice(i, i + 8)));
					i += 8;
				} else {
					var sum = 0;
					while(i < len) {
						if(binaryArray[i] == 1) {
							++sum;
						} else {
							break;
						}
						++i;
					}
					unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 1, i + 8 - sum));
					i += 8 - sum;
					while(sum > 1) {
						unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 2, i + 8));
						i += 8;
						--sum;
					}
					unicode = unicode.concat(_toDecimal(unicodeBinary));
					unicodeBinary = [];
				}
			}
			return unicode;
		}
	};
	window.BASE64 = __BASE64;
})();