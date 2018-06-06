define(['redux',
	'./reglog',
	'./myuser',
	'./mycompany',
	'./cmpnotice',
	'./cmpdiscuz',
	'./article',
	'./chat',
	'./structor',
	'./user',
	'./twitter',
	'./admin'],function(Redux,
		reglog, 
		myuser,
		mycompany,
		cmpnotice,
		cmpdiscuz,
		article,
		chat,
		structor,
		user,
		twitter,
		admin){
	const rootReducer = Redux.combineReducers({
		reglog: reglog,
		myuser: myuser,
		mycompany: mycompany,
		cmpnotice: cmpnotice,
		cmpdiscuz: cmpdiscuz,
		article: article,
		chat: chat,
		structor: structor,
		user: user,
		twitter: twitter,
		admin: admin
	});
    return rootReducer;
})