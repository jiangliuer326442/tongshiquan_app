'use strict'

define(["config/index"], function(config){
	var reglog = {}; 
	
	reglog.GETCOMPANY = 'bdcompany_get';
	reglog.SETCOMPANY = 'bdcompany_set';
	reglog.SENDREGCODE = 'sendregcode';
	
	//QQ登陆
	reglog.qq_login = function() {
	  window.open ( config.server + "/qqlogin.jsp",'qqwindow','height=500,width=700,top=100,left=200px,toolbar=no, menubar=no, scrollbars=no, resizable=no, loca tion=no, status=no');
	}
	
	//qq登录
	reglog.qqlogin = function(openid, username, avatar1, avatar2, vendor, uuid, cb){
	  mui.ajax({
	    url: config.server + "qqloginbyapp.jsp?",
	    type:"POST",
	    data:{openid: openid, username: username, avatar1: avatar1, avatar2: avatar2, vendor: vendor, uuid: uuid},
	    success:function(status, info, data){
	    	cb(status,info,data);
	    }
	  });
	}
	
	reglog.wxbind = function(openid, unionid, uid, token, uuid, cb){
	  mui.ajax({
	    url: config.server + "setwxopenid.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
	    type:"POST",
	    data:{openid: openid, unionid: unionid},
	    success:function(status, info, data){
	    	cb(status,info);
	    }
	  });
	}
	
	//微信登录
	reglog.wxlogin = function(openid, unionid, username, avatar1, avatar2, vendor, uuid, cb){
	  mui.ajax({
	    url: config.server + "wxloginbyapp.jsp?",
	    type:"POST",
	    data:{openid: openid, unionid: unionid, username: username, avatar1: avatar1, avatar2: avatar2, vendor: vendor, uuid: uuid},
	    success:function(status, info, data){
	    	cb(status,info,data);
	    }
	  });
	}
	
	//手机号，密码登录
	reglog.send_login = function(phone,password,uuid,vendor,cb){
	  mui.ajax({
	    url: config.server + "loginbypass.jsp?",
	    type:"POST",
	    data:{phone: phone, password: password, uuid: uuid, vendor: vendor},
	    success:function(status, info, data){
	    	cb(status,info,data);
	    }
	  });
	}
	
	//第三方登录注册
	reglog.thirdreg = function(uid,token,companyid,phone,codes,password,uuid,vendor,cb){
	  mui.ajax({
	    url: config.server + "company_adduser.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
	    type:"POST",
	    data:{companyid:companyid,phone:phone,codes:codes,vendor:vendor,uuid:uuid},
	    success:function(status, info, data){
	      cb(status,info,data);
	    }
	  });
	}
	
	//手机哈注册
	reglog.send_register = function(companyid,phone,codes,password,uuid,vendor,cb){
	  mui.ajax({
	    url: config.server + "registerbyphone.jsp?",
	    type:"POST",
	    data:{companyid: companyid, phone: phone, codes: codes, password: password, uuid: uuid, vendor: vendor},
	    success:function(status, info, data){
	    	cb(status,info,data);
	    }
	  });
	}
	
	reglog.sendregcode = function(uid,token,phone,password,dispatch,cb){
		dispatch({
          type: reglog.SENDREGCODE,
          phone: phone,
          password: password,
        });
	  mui.ajax({
	    url:config.server + "/sendregcode.jsp?uid="+uid+"&token="+token,
	    type:"POST",
	    data:{phone:phone},
	    success:function(status, info, data){
	      cb(status,info);
	    }
	  });
	}
	
	reglog.setcompany = function(selectedcompany, dispatch){
        dispatch({
          type: reglog.SETCOMPANY,
          selected_company: selectedcompany
        });
	}
	
	reglog.getcompanylist = function(companyname,dispatch,cb){
		mui.ajax({
		    url: config.server+"/company_search.jsp?",
		    type: "POST",    
		    data: {name: companyname}, 
		    success: function (status, info, data) {
		      cb(status,info,data);
		      if(status == 200){
		        dispatch({
		          type: reglog.GETCOMPANY,
		          selected_company: data.length == 1 ? data[0].KeyNo: ""
		        });
		      }
		    }
		});
	}
	
	reglog.quit = function(){
		plus.runtime.quit();
		/**
		if(mui.os.android){
			var main = plus.android.runtimeMainActivity();
			main.moveTaskToBack(true);
		}
		**/
	}
	
	reglog.logout = function(uid, token, uuid){
		window.db.drop('article');
		window.db.drop('company');
		window.db.drop('category');
		window.db.drop('postbars');
		window.db.drop('posts');
		window.db.drop('chaters');
		window.db.drop('chatlog');
		window.db.drop('employee');
		var old_logout = function(){
	      	mui.removeItem("uid");
	      	mui.removeItem("token");
	      	mui.removeItem("companyid");
	      	mui.removeItem("is_manager");
	      	mui.removeItem("avatar");
	      	mui.removeItem("uname");
	      	mui.removeItem("uphone");
	      	plus.runtime.quit();
		}
		if(mui.network_flg()){
			mui.ajax({
			    url: config.server+"/logout.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
			    type: "POST",
			    success: function (status, info, data) {
			      	if(status == 200){
						old_logout();
			      	}
			    }
			});
		}else{
			old_logout();
		}
	}
	
	return reglog;
})	