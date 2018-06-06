'use strict'

define(['actions/reglog'],function(reglog){
	return function(state, action){
		 var state = arguments[0] ? arguments[0] : {
			selected_company: "",
			phone: "",
			password: "",
		};
		switch (action.type) {
			case reglog.SENDREGCODE:
		    	return Object.assign({},state, {
		            phone: action.phone,
		            password: action.password,
		        });
			case reglog.SETCOMPANY:
		    	return Object.assign({},state, {
		            selected_company: action.selected_company
		        });
		    case reglog.GETCOMPANY:
		    	return Object.assign({},state, {
		            companyList: action.companyList,
		            selected_company: action.selected_company
		        });
		    default:
		      	return state
		}
	}
})