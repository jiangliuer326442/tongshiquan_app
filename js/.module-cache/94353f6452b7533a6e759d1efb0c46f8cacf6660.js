'use strict'

define(["actions/common", "config/index"], function(common, config){
	var myuser = {}; 
	myuser.LOGIN = "login";
	myuser.SETUSERINFO = "setuserinfo";
	myuser.SETNICK = "setmyusernick";
	
	myuser.chgpasswd = function(uid, token, uuid, passwd, npasswd, cb){
	  	mui.ajax ({
	    	url: config.server + "changepasswd.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
	    	type:"POST",
	    	data:{password: passwd, new_password: npasswd},
	    	success:function(status, info, data){
	    		cb(status, info);
	    	}
	   })
	}
	
	myuser.chgphone = function(uid, token, uuid, phone, codes, cb){
	  	mui.ajax ({
	    	url: config.server + "changephone.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
	    	type:"POST",
	    	data:{phone: phone, codes: codes},
	    	success:function(status, info, data){
	    		cb(status, info);
	    	}
	   })
	}
	
	myuser.setnick = function(uid, token, uuid, nick, dispatch){
	  	mui.ajax ({
	    	url: config.server + "setmycompanynick.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
	    	type:"POST",
	    	data:{nick: nick},
	    	success:function(status, info, data){
	    		if(status == 200){
	    			dispatch({
	    				type: myuser.SETNICK,
	    				nick: nick
	    			});
	    		}
	    	}
	   })
	}
	
	myuser.setuseravatar = function(uid, token, uuid, path, cb){
		var upload_server = config.server+'setmycompanyavatar.jsp?uid='+uid+'&token='+token+'&uuid='+uuid;
		var task = plus.uploader.createUpload( upload_server, {}, function ( t, status ) {
			// 上传完成
			if ( status == 200 ) {
				console.log(t.responseText);
				var imgUrl = JSON.parse(t.responseText).data;
				cb(imgUrl);
			} else {
				console.log( "Upload failed: " + status );
			}
		});
		task.addFile( path, {key:"avatar"} );
		task.start();
	}
	
	myuser.getuserbind = function(uid, token, uuid, dispatch, cb){
	  	mui.ajax ({
	    	url: config.server + "getuserbind.jsp?",
	    	type:"GET",
	    	data:{uid: uid, token: token, uuid: uuid},
	    	success:function(status, info, data){
	    		cb(data);
	    	}
	   })
	}
	
	myuser.getuserinfo = function(uid, token, uuid, dispatch, cb){
	  mui.ajax ({
	    url: config.server + "company_getuserinfo.jsp?",
	    type:"GET",
	    data:{uid: uid, token: token, uuid: uuid},
	    success:function(status, info, data){
	    	cb(status,info,data);
	    	if(status == 200){
	    		dispatch({
	    			type: myuser.SETUSERINFO,
	    			is_admin: data.is_admin,
	    			models: data.models,
	    			companyid: data.companyid,
	    			uname: data.uname,
	    			uphone: data.uphone,
	    			avatar: data.avatar,
	    			unick: data.unick,
	    			umail: data.umail
	    		})
	    	}
	    },
	    fail(status){
	    	cb(status);
	    }
	  });
	}
	return myuser;
})