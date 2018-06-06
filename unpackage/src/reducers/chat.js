'use strict'

define(['actions/socket'],function(socketio){
	return function(state, action){
		var state = arguments[0] ? arguments[0] : {
			chat_pnum: 10,//每页显示的聊天人数
			chatlog_pnum: 20,//每页显示的聊天记录数量
			chatlog_list: [],//聊天记录数组
			list: [],
			recent_list: [], //最近聊天人数组
			refresh_flg: false //是否刷新
		};
		switch (action.type) {
			case socketio.ADDCHAT:
				var list = state.list;
				var myDate = new Date();
				list.push({
					fuid: action.fuid,
					content_type: action.content_type,
					content: action.content,
					create_time: myDate.getFullYear()+"-"+((myDate.getMonth()<9)?'0'+(myDate.getMonth()+1):(myDate.getMonth()+1))+"-"+((myDate.getDate()<9)?'0'+(myDate.getDate()+1):(myDate.getDate()+1))+" "+myDate.getHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds()
				});
				var mylist = [];
				for(var i=0; i<list.length; i++){
					var time = list[i].create_time.split(" ")[0].replace(/-/g, "")-20170000;
					if(typeof(mylist[time]) != "object"){
						mylist[time] = {};
						mylist[time].time = list[i].create_time.split(" ")[0];
						mylist[time].list = [];
					}
					mylist[time].list.push(list[i]);
				}
		      	return Object.assign({},state, {
					  list: list,
					  chatlog_list: mylist,
					  refresh_flg: !state.refresh_flg
		              });
			case socketio.SETCHATLOG:
				var chatlog_list = action.list;
				var list = [];
				var mylist = [];
				if(action.page == 1){
					list = chatlog_list;
				}else{
					list = action.list.concat(state.list);
				}
				for(var i=0; i<list.length; i++){
					var time = list[i].create_time.split(" ")[0].replace(/-/g, "")-20170000
					if(typeof(mylist[time]) != "object"){
						mylist[time] = {};
						mylist[time].time = list[i].create_time.split(" ")[0];
						mylist[time].list = [];
					}
					mylist[time].list.push(list[i]);
				}
		      	return Object.assign({},state, {
					  chatlog_list: mylist,
					  list: list,
					  refresh_flg: !state.refresh_flg
		              });
			case socketio.SETRECENTCHAT:
		      	return Object.assign({},state, {
					  recent_list: action.list
		              });
		    default:
		      	return state
		}
	}
})