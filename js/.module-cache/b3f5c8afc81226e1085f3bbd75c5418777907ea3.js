'use strict'

define(['react', "react-redux","components/header","config/index",
	"css!./css/settings"], function(React, ReactRedux, Header, config){
	class Secure extends React.Component {
		
		render() {
			return ( 
				React.createElement("div", {id: "secure", className: "secure mui-page"}, 
					React.createElement("header", {className: "mui-navbar-inner mui-bar mui-bar-nav"}, 
						React.createElement("h1", {className: "mui-title"}, 
							"安全和隐私"
						), 
						React.createElement("a", {className: "mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"})
					), 
					React.createElement("div", {className: "mui-page-content"}, 
						React.createElement("div", {className: "mui-scroll-wrapper"}, 
							React.createElement("div", {className: "mui-scroll"}, 
								React.createElement("ul", {className: "mui-table-view mui-table-view-chevron"}, 
									React.createElement("li", {className: "mui-table-view-cell"}, 
										React.createElement("a", {className: "mui-navigate-right", href: ""}, "更换手机号")
									), 
									React.createElement("li", {className: "mui-table-view-cell"}, 
										React.createElement("a", {className: "mui-navigate-right", href: "#chgpasswd"}, "修改密码")
									)
								), 
								React.createElement("ul", {className: "mui-table-view mui-table-view-chevron"}, 
									React.createElement("li", {className: "mui-table-view-cell"}, 
										React.createElement("a", {className: "mui-navigate-right", href: ""}, "不看Ta的动态")
									), 
									React.createElement("li", {className: "mui-table-view-cell"}, 
										React.createElement("a", {className: "mui-navigate-right", href: ""}, "不让Ta看我的动态")
									)
								)
							)
						)
					)
				)
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {
	  	uid: state.myuser.uid,
	  	token: state.myuser.token,
	  	uuid: state.myuser.uuid
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Secure);
});