var JS_EXTENSION = '.min';
var LIB = 'http://cdn.companyclub.cn/';
requirejs.config({
	baseUrl: "js",
	paths: {
		"react": LIB + "bower_components/react/react" + JS_EXTENSION,
		"react-dom": LIB + "bower_components/react/react-dom" + JS_EXTENSION,
		"react-router": LIB + "library/ReactRouter" + JS_EXTENSION,
		"redux": LIB + "library/redux" + JS_EXTENSION,
		"react-redux": LIB + "library/react-redux" + JS_EXTENSION,
		'jquery': LIB + "bower_components/jquery/jquery" + JS_EXTENSION,
		'wangeditor': "lib/wangEditor/wangEditor",
		'jquery-browser': LIB + "bower_components/jquery.browser/dist/jquery.browser" + JS_EXTENSION,
		'jquery-qqface': "lib/jquery-qqface/js/jquery.qqFace",
		'socket-io': LIB + "bower_components/socket.io-client/dist/socket.io.slim",
		'webview-group': LIB + "bower_components/mui/examples/hello-mui/js/webviewGroup",
		'md5': LIB + "bower_components/js-md5/build/md5" + JS_EXTENSION,
		'websqlwrapper': LIB + "bower_components/websqlWrapper/websqlWrapper/websqlwrapper",
	},
	map: {
		'*': {
			'css': LIB+'bower_components/require-css/css'+JS_EXTENSION+".js"
		}
	},
	shim: {
		'jquery-browser': ['jquery'],
		'jquery-qqface': ['jquery'],
		'webview-group': {
			exports: 'webviewGroup'
		},
	}
});

var plusReady = function(){
	
	requirejs(['react', 'react-dom', "react-router", "react-redux", "actions/common", "config/route", 'css!'+LIB+'library/animate.min'],
		function(React, ReactDOM, ReactRouter, ReactRedux, common, rootRoute) {
				window.db = common.initDB();
				
				requirejs(['stores/configureStore', 'config/index'], function(configureStore, config){
					const history = config.history;
					const store = configureStore();
					ReactDOM.render(
						React.createElement(ReactRedux.Provider, {store: store}, 
							React.createElement(ReactRouter.Router, {history: history, routes: rootRoute}
							)
						),
						document.getElementById('app')
					);
				})
		}
	);
}

if(mui.os.plus){
	mui.plusReady(plusReady);
}else{
	mui.ready(plusReady);
}