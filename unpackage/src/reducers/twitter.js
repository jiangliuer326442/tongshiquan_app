'use strict'

define(['actions/club'],function(club){
	return function(state, action){
		var state = arguments[0] ? arguments[0] : {
			company_twt: [],
			visible_list: [],
			pnum: 10,
			refresh_flg: false
		};
		switch (action.type) {
			case club.DELCOMMENT:
				state.company_twt[action.twtindex].comment.splice(action.cmtindex,1);
				return state;
			case club.DELTWT:
				state.company_twt.splice(actions.index,1);
				return state;
			case club.GETTWTVISIBLE:
		    	return Object.assign({}, state, {
		            visible_list: action.list
		       });
		    case club.ADDCOMMENT:
		    	for(var i=0; i< state.company_twt.length; i++){
		    		if(state.company_twt[i].id == action.twtid){
		    			state.company_twt[i].comment.push({
		    				nick: "我",
		    				content: action.content
		    			})
		    			break;
		    		}
		    	}
		    	return state;
			case club.GETCMPTWITTER:
				var list = [];
				if(action.page == 1){
					list = action.list;
				}else{
					list = state.company_twt.concat(action.list);
				}
		    	return Object.assign({}, state, {
		            company_twt: list,
		            refresh_flg: !state.refresh_flg
		       });
		    default:
		      	return state
		}
	}
})