'use strict'

define(['actions/cmpdiscuz'],function(cmpdiscuz){
	return function(state, action){
		 var state = arguments[0] ? arguments[0] : {
			  articles: [],
			  page: 1,
			  postbars: [],
			  current: -1
		};
		switch (action.type) {
			case cmpdiscuz.SETCURRENT:
				state.postbars[action.index].logo = action.img;
		      	return Object.assign({},state, {
					current: action.index
		      	});
			case cmpdiscuz.SETPOSTBARS:
		      return Object.assign({},state, {
				postbars: action.list
		      });
			case cmpdiscuz.SETNEWLYPOSTS:
				var list = [];
				if(action.page == 1){
					list = action.list;
				}else{
					list = state.articles.concat(action.list);
				}
		      return Object.assign({},state, {
					  articles: list,
					  page: action.page
		      });
			case cmpdiscuz.SETBARPOSTS:
				var list2 = [];
				if(action.page == 1){
					list2 = action.list;
				}else{
					list2 = state.articles.concat(action.list);
				}
		      return Object.assign({},state, {
					  articles: list2,
					  page: action.page
		      });
		    default:
		      	return state
		}
	}
})