define(['redux','reducers/index'], function(Redux, rootReducer){
	return function(initialState){
		const store = Redux.createStore(rootReducer, initialState);
		return store;
	}
})
