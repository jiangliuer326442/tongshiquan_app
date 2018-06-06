'use strict'

define(['actions/structor'],function(structor){
	return function(state, action){
		var state = arguments[0] ? arguments[0] : {
			employee_list: [],
			department_list: [],
			selected_list: [{id: 0, name: "全公司"}],
			current_selected: 0,
			all_employee: []
		};
		switch (action.type) {
			case structor.GETALLEMPLOYEE:
				return Object.assign({}, state, {
					all_employee: action.allemployee
				});
			case structor.POPSTRUCTOR:
				var i=0;
				for(; i<state.selected_list.length; i++){
					if(state.selected_list[i].id == action.id){
						break;
					}
				}
				var selected_list = state.selected_list.slice(0, i+1);
				return Object.assign({}, state, {
					current_selected: action.id,
					selected_list: selected_list
				});
			case structor.PUSHSTRUCTOR:
				state.selected_list.push({
					id: action.id,
					name: action.name
				});
				return Object.assign({}, state, {
					current_selected: action.id,
					selected_list: state.selected_list
				});
			case structor.SETSTRUCTOR:
		    	return Object.assign({}, state, {
		            employee_list: action.employee,
		            department_list: action.structure,
		       });
		    default:
		      	return state
		}
	}
});