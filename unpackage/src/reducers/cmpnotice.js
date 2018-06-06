'use strict'

define(['actions/cmpnotice'],function(cmpnotice){
	return function(state, action){
		 var state = arguments[0] ? arguments[0] : {
			  fmodel: {
			  	name: "",
			  	list: []
			  },
			  omodel: [],
			  size: 4,
			  selected: 0
		};
		switch (action.type) {
			case cmpnotice.SETFARTICLE:
		      return Object.assign({},state, {
					  fmodel: {
					  	name: action.name,
					  	list: action.list
					  },
		      });
		    case cmpnotice.SETOARTICLE:
		      return Object.assign({},state, {
					  omodel: action.list,
		      });
		    case cmpnotice.SETSLTMODLE:
		      return Object.assign({},state, {
					  selected: action.index,
		      });
		    default:
		      	return state
		}
	}
})