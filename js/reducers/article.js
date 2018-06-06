'use strict'

define(['actions/article'],function(article){
	return function(state, action){
		 var state = arguments[0] ? arguments[0] : {
			  commenttimes: 0,
			  content: "",
			  content_text: "",
			  inserttime: "",
			  is_allow_comment: true,
			  is_hide_comment: true,
			  readtimes: 0,
			  title: "",
			  user_avatar: "",
			  user_nick: "",
			  userid: 0,
			  comments: [],
			  pnum: 10,
			  alist: [],
			  anum: 0
		};
		switch (action.type) {
			case article.SETLIST:
				var alist = [];
				if(action.page == 1){
					alist = action.list;
				}else{
					alist = state.alist.concat(action.list);
				}
				return Object.assign({}, state, {
					alist: alist,
					anum: action.total
				});
			case article.SETCOMMENTS:
				var list = [];
				if(action.page == 1){
					list = action.list;
				}else{
					list = state.comments.concat(action.list);
				}
				return Object.assign({}, state, {
					comments: list
				});
			case article.SETARTICLE:
		    	return Object.assign({},state, {
				  commenttimes: action.data.commenttimes,
				  content: action.data.content.replace(/\/"/g,'"'),
				  content_text: action.data.content_text,
				  inserttime: action.data.inserttime,
				  is_allow_comment: action.data.is_allow_comment,
				  is_hide_comment: action.data.is_hide_comment,
				  readtimes: action.data.readtimes,
				  title: action.data.title,
				  user_avatar: action.data.user_avatar,
				  user_nick: action.data.user_nick,
				  userid: action.data.userid
		      });
		    default:
		      	return state
		}
	}
})