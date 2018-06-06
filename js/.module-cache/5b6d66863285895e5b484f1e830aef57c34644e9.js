'use strict'

define(["config/index"], function(config){
	var structor = {}; 
	
	structor.SETSTRUCTOR = 'structor_set';
	structor.PUSHSTRUCTOR = 'structor_push';
	structor.POPSTRUCTOR = 'structor_pop';
	structor.GETALLEMPLOYEE = 'structor_allemployee';
	
	//获取全部员工信息
	structor.emplist = function(uid, token, uuid, dispatch, cb){
		var table = window.db.instance('employee');
	  	mui.ajax({
		    url: config.server + "company_epllist.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
		    type:"POST",
		    success:function(status, info, data){
		    	if(status == 200){
		    		var emplist = [];
		    		for(var i=0; i<data.length; i++){
		    			var user = data[i];
		    			emplist[user.userid] = {};
		    			emplist[user.userid].avatar = user.user_avatar;
		    			emplist[user.userid].mail = user.user_mail;
		    			emplist[user.userid].name = user.user_name;
		    			emplist[user.userid].nick = user.user_nick;
		    			emplist[user.userid].phone = user.user_phone;
		    			table.save({id: user.id, uid: user.userid, avatar: user.user_avatar, mail: user.user_mail, name: user.user_name, nick: user.user_nick, phone: user.user_phone}, 'id');
		    		}

			    	dispatch({
			    		type: structor.GETALLEMPLOYEE,
			    		allemployee: emplist
			    	});
			    	cb(emplist);
		    	}
		    }
	  	});
	}
	
	//推入组织
	structor.pop_structor = function(uid, token, uuid, departmentid, dispatch, cb){
		dispatch({
			type: structor.POPSTRUCTOR,
			id: departmentid,
		});
		structor.get_structor(uid, token, uuid, departmentid, dispatch, cb);
	}
	
	//推入组织
	structor.push_structor = function(uid, token, uuid, departmentid, departmentname, dispatch, cb){
		dispatch({
			type: structor.PUSHSTRUCTOR,
			id: departmentid,
			name: departmentname
		});
		structor.get_structor(uid, token, uuid, departmentid, dispatch, cb);
	}
	
	//获取组织结构
	structor.get_structor = function(uid, token, uuid, superid, dispatch, cb){
	  mui.ajax({
	    url: config.server + "company_getstructureemployee.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
	    type:"POST",
	    data:{superid: superid.toString()},
	    success:function(status, info, data){
	    	if(status == 200){
		    	dispatch({
		    		type: structor.SETSTRUCTOR,
		    		employee: data.employee,
		    		structure: data.structure
		    	});
		    	cb(status,info,data);
	    	}
	    }
	  });
	}
	
	return structor;
	
});