'use strict'

define(['actions/myuser','actions/socket'],function(myuser, socketio){
	return function(state, action){
		var state = arguments[0] ? arguments[0] : {
			uid: mui.getItem('uid'),
			token: mui.getItem('token'),
			companyid: mui.getItem('companyid'),
			is_manager: mui.getItem('is_manager'),
			avatar: mui.getItem('avatar'),
			uuid: mui.os.plus?plus.device.uuid:"",
			vendor: mui.os.plus?plus.device.vendor:"",
			is_admin: 0,
			models: [],
			uname: mui.getItem('uname'),
			uphone: mui.getItem('uphone'),
			unick: mui.getItem('unick'),
			umail: mui.getItem('umail')
		};
		switch (action.type) {
			case myuser.LOGIN:
		      mui.setItem('companyid', action.companyid);
		      mui.setItem('is_manager', action.is_manager);
		      mui.setItem('uid', action.uid);
		      mui.setItem('token', action.token);
		      return Object.assign({},state, {
		                companyid: action.companyid,
		                is_manager: action.is_manager,
		                token: action.token,
		                uid: action.uid
		              });
		    case socketio.SETUSERINFO:
		      	return Object.assign({},state, {
		                uname: action.nick,
		                uphone: action.phone,
		                avatar: action.avatar,
		              });
		    case myuser.SETNICK:
		      	return Object.assign({},state, {
		                unick: action.nick,
		              });
		    case myuser.SETUSERINFO:
			      	mui.setItem('avatar', action.avatar);
			      	mui.setItem('uname', action.uname);
			      	mui.setItem('uphone', action.uphone);
			      	mui.setItem('unick', action.unick);
			      	mui.setItem('umail', action.umail);
		      		return Object.assign({},state, {
		                is_admin: action.is_admin,
		                models: action.models,
		                companyid: action.companyid,
		                uname: action.uname,
		                uphone: action.uphone,
		                avatar: action.avatar,
		                unick: action.unick,
		                umail: action.umail,
		            });
		    default:
		      	return state
		}
	}
})