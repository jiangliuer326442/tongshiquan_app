'use strict'

define(['actions/admin'],function(admin){
	return function(state, action){
		var state = arguments[0] ? arguments[0] : {
			model_list: [],
			article_list: [],
			admin_flg: 0,
			modelid: 0,
			sectionid: 0,
			is_allow_comment: true,
			is_hide_comment: false,
			leaderid: 0,
			sort: 0
		};
		switch (action.type) {
			case admin.GETMODELARTICLES:
				return Object.assign({}, state, {
					article_list: action.list,
					sectionid: action.sectionid
				});
			case admin.GETMODELDETAIL:
				return Object.assign({}, state, {
					is_allow_comment: action.is_allow_comment,
					is_hide_comment: action.is_hide_comment,
					leaderid: action.leaderid,
					sort: action.sort,
					sectionid: action.sectionid
				});
			case admin.GETMODELLIST:
				return Object.assign({}, state, {
					model_list: action.list,
					admin_flg: action.admin_flg,
					modelid: action.id
				});
		    default:
		      	return state
		}
	}
});