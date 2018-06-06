'use strict'

define(["config/index"], function(config){
	var user = {}; 
	user.SETUSERINFO = 'user_setuserinfo';
	user.TOGGLECARE = 'user_togglecare';
	
	user.getemp = function(uid, cb){
		var table = window.db.instance('employee');
		table.get("uid == "+uid, function(r){
			if(r.length>0){
		    	cb(r[0]);
	    	}
		})
	}
	
	user.setemp = function(uid, token, uuid, userid, avatar, name, nick, mail, cb){
	  	mui.ajax({
		    url: config.server + "company_modifyemployee.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
		    type: "POST",
		    data: {userid: userid.toString(), user_avatar: avatar, user_name: name, user_nick: nick, user_mail: mail},
		    success:function(status, info, data){
		    	if(status == 200){
		    		var table = window.db.instance('employee');
		    		table.save({id: userid, avatar: avatar, mail: mail, name: name, nick: nick}, 'id');
		    		if(uid == userid){
				      	mui.setItem('uname', name);
				      	mui.setItem('unick', nick);
				      	mui.setItem('umail', mail);
		    		}
		    		cb();
		    	}
		    }
	  	});
	}
	
	//获取好友列表
	user.getfriends = function(uid, token, uuid, cb){
	  	mui.ajax({
		    url: config.server + "friendlist.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
		    type:"GET",
		    success:function(status, info, data){
		    	if(status == 200){
		    		cb(data);
		    	}
		    }
	  	});
	}
	
	//反转关注
	user.toggleCare = function(uid, token, uuid, tuid, dispatch){
		if(uid!=tuid && uid>0){
		  	mui.ajax({
			    url: config.server + "careuser.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
			    type:"POST",
			    data:{touid: tuid.toString()},
			    success:function(status, info, data){
			    }
		  	});
			dispatch({
				type: user.TOGGLECARE
			});
		}
	}
	
	//获取用户信息
	user.getuserinfo = function(uid, token, uuid, tuid, dispatch, cb){
	  	mui.ajax({
		    url: config.server + "company_getsbuserinfo.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
		    type:"POST",
		    data:{touid: tuid.toString()},
		    success:function(status, info, data){
		    	if(status == 200){
			    	dispatch({
			    		type: user.SETUSERINFO,
			    		data: data
			    	});
			    	cb(status,info,data);
		    	}
		    }
	  	});
	}
	
	return user;
})