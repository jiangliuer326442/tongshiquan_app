'use strict'

define(['actions/nav'],function(nav){
	return function(state, action){
		 var state = arguments[0] ? arguments[0] : {
			  cmpfooter: isNaN(parseInt(mui.getItem('nav')))?0:mui.getItem('nav'),
			  direct: 0,
		};
		switch (action.type) {
			case nav.PAGEDIRECT:
		      return Object.assign({},state, {
					direct: action.direct
		      });
			case nav.CMPFOOTER:
				mui.setItem('nav', action.index);
			      return Object.assign({},state, {
						cmpfooter: action.index
			      });
		    default:
		      	return state
		}
	}
})