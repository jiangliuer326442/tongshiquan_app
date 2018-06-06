'use strict'

define(["react-router"], function(ReactRouter){
	var config = {};
	config.history = ReactRouter.hashHistory;
	config.server = "http://develop.companyclub.cn/";
	config.chat_server = "http://chat.dev.companyclub.cn";
	// config.server = "http://api.companyclub.cn/";
	// config.chat_server = "http://chat.companyclub.cn";
	return config;
})	