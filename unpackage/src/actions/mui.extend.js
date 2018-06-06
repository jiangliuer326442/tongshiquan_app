(function( mui ) {
	mui.extend({
		network_flg: function(){
			if(mui.getItem("network_flg") == "0")
				return false;
			else
				return true;
		},
		ajax : function(options){
			requirejs(['./lib/crypto-js/index'], function(CryptoJS){
				var form_key;	
				function getkey(){
					var key = null;
					if(mui.os.plus){
						key = plus.storage.getItem("_k");
					}else{
				  		key = localStorage.getItem("_k");
				  	}
				  	if(key == null){
				  　　	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
				  　　	var maxPos = $chars.length;
				  　　	key = '';
				  　　	for (var i = 0; i < 16; i++) {
				  　　　　	key += $chars.charAt(Math.floor(Math.random() * maxPos));
				  　　	}
						if(mui.os.plus){
							plus.storage.setItem("_k", key);
						}else{
					  		localStorage.setItem("_k", key);
					  	}
				  	}
				  	return key;
				}
				
				function encrypt(word){
					 var key = CryptoJS.enc.Utf8.parse(form_key);
					 var iv  = CryptoJS.enc.Utf8.parse(form_key);
					 var srcs = CryptoJS.enc.Utf8.parse(word);
					 var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv,mode:CryptoJS.mode.CBC});
				    return encrypted.toString();
				}
				function decrypt(word){
					 var key = CryptoJS.enc.Utf8.parse(form_key);
					 var iv  = CryptoJS.enc.Utf8.parse(form_key);
					 var srcs = CryptoJS.enc.Utf8.parse(word);
					 var decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv,mode:CryptoJS.mode.CBC});
					 return CryptoJS.enc.utf8.stringify(decrypt).toString();
				}
				//格式化参数
				function formatParams(data, type) {
					if(type == "POST"){
						var formdata = new FormData();
					    for (var name in data) {
					    	if(typeof data[name] == "string"){
			                    data[name] = encodeURI(encodeURI(data[name]));
					    		formdata.append(name, encrypt(data[name]));
					    	}else{
					    		formdata.append(name, data[name]);
					    	}
					    }
					    return formdata;
					}else{
						var arr = [];
						for (var name in data) {
							arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
						}
						arr.push(("v=" + Math.random()).replace(".",""));
						return arr.join("&");
					}
				}
				var ajax = function (options) {
					form_key = getkey();
				    options = options || {};
				    options.type = (options.type || "GET").toUpperCase();
				    options.dataType = options.dataType || "json";
				    var params = formatParams(options.data, options.type);
				    //创建 - 非IE6 - 第一步
				    if (window.XMLHttpRequest) {
				        var xhr = new XMLHttpRequest();
				    } else { //IE6及其以下版本浏览器
				        var xhr = new ActiveXObject('Microsoft.XMLHTTP');
				    }
					xhr.timeout=3000;
				    //接收 - 第三步
				    xhr.onreadystatechange = function () {
				        if (xhr.readyState == 4) {
				            var status = xhr.status;
				            if (status >= 200 && status < 300) {
				            	if(options.dataType == "json"){
				            		try{
				    	            	var data = JSON.parse(xhr.responseText);
				    	            	options.success && options.success(data.status, data.info, data.data);
				    	           	} catch(e){
				    	           		options.fail && options.fail(500);
				    	           	}
				            	}else{
				            		options.success && options.success(xhr.responseText);
				            	}
				            } else {
				            	mui.setItem("network_flg", "0");
				                options.fail && options.fail(status);
				            }
				        }
				    }
			
				    //连接 和 发送 - 第二步
				    if (options.type == "GET") {
				        xhr.open("GET", options.url + (options.url.indexOf('?') >= 0 ? "&":"?") + params, true);
				        xhr.send(null);
				    } else if (options.type == "POST") {
				        xhr.open("POST", options.url + "&k=" + form_key);
				        xhr.send(params);
				    }
				}
		
				ajax(options);
			})
		},
		
		getItem : function(key){
			var value = null;
			if(mui.os.plus){
				value = plus.storage.getItem(key);
			}else{
				value = localStorage.getItem(key);
			}
			if(value == null) value="";
			return value;
		},
		
		removeItem : function(key){
			if(mui.os.plus){
				plus.storage.removeItem(key);
			}else{
				localStorage.removeItem(key);
			}
		},
		
		setItem : function(key, value){
			if(mui.os.plus){
				plus.storage.setItem(key,value.toString());
			}else{
				localStorage.setItem(key,value.toString());
			}
		}
	})
	
	mui.fn.hasClass = function(cls){
		if(this.length>0){
			that = this[0]
		}else{
			that = this;
		}
		var obj_class = that.className,//获取 class 内容.
		obj_class_lst = obj_class.split(/\s+/);//通过split空字符将cls转换成数组.
	  	var x = 0;
	  	for(x in obj_class_lst) {
	    	if(obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
	      		return true;
	    	}
	  	}
	  	return false;
	}
	
	mui.fn.addClass = function(cls){
		var obj_class = this[0].className,//获取 class 内容.
		obj_class_lst = obj_class.split(/\s+/);//通过split空字符将cls转换成数组.
	  	var x = 0;
	  	for(x in obj_class_lst) {
	    	if(obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
	      		return false;
	    	}
	  	}

		blank = (obj_class != '') ? ' ' : '';//判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
		var added = obj_class + blank + cls;//组合原来的 class 和需要添加的 class.
		this[0].className = added;//替换原来的 class.
		return true;
	}
	
	mui.fn.removeClass = function(cls){
		var obj_class = this[0].className,//获取 class 内容.
		obj_class_lst = obj_class.split(/\s+/);//通过split空字符将cls转换成数组.
	  	var x = 0;
	  	for(x in obj_class_lst) {
	    	if(obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
			  	obj_class = ' '+obj_class+' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
			  	obj_class = obj_class.replace(/(\s+)/gi, ' ');//将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
			  	var removed = obj_class.replace(' '+cls+' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
			  	removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
			  	this[0].className = removed;//替换原来的 class.
	      		return true;
	    	}
	  	}
	  	return false;
	}
	
    mui.fn.keyboard = function() {
    	var that = this;
		if(mui.os.plus){
			var nativeWebview, imm, InputMethodManager;
			var initNativeObjects = function() {
			    if (mui.os.android) {
			        var main = plus.android.runtimeMainActivity();
			        var Context = plus.android.importClass("android.content.Context");
			        InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
			        imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
			    } else {
			        nativeWebview = plus.webview.currentWebview().nativeInstanceObject();
			    }
			};
			var showSoftInput = function() {
			    if (mui.os.android) {
			        imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
			    } else {
			        nativeWebview.plusCallMethod({
			            "setKeyboardDisplayRequiresUserAction": false
			        });
			    }
			    setTimeout(function() {
			       that[0].focus();
			    }, 1000);
			};
		    initNativeObjects();
		    showSoftInput();
		}else{
			this[0].focus();
		}
    };
})( mui );
