'use strict'

define(['actions/user','actions/article'],function(user, article){
	return function(state, action){
		var state = arguments[0] ? arguments[0] : {
			employee_allowhim_flg: false,
			employee_care_flg: false,
			employee_friend_flg: false,
			employee_markedname: "",
			employee_umail: "",
			employee_uphone: "",
			employee_watchhim_flg: false,
			friends: []
		};
		switch (action.type) {
			case user.TOGGLECARE:
				return Object.assign({}, state, {
					employee_care_flg: state.employee_friend_flg ? false :  !state.employee_care_flg,
					employee_friend_flg: false
				});
			case article.SETARTICLE:
		    	return Object.assign({},state, {
				  employee_care_flg: action.data.care_flg,
				});
			case user.SETUSERINFO:
				return Object.assign({}, state, {
					employee_allowhim_flg: action.data.allowhim_flg,
					employee_care_flg: action.data.care_flg,
					employee_friend_flg: action.data.friend_flg,
					employee_markedname: action.data.markedname,
					employee_umail: action.data.umail,
					employee_uphone: action.data.uphone,
					employee_watchhim_flg: action.data.watchhim_flg
				});
		    default:
		      	return state
		}
	}
});