'use strict'

define(['react', "react-redux","components/header",
	"actions/myuser"], function(React, ReactRedux, Header,
	myuser){
	class ChgPhone extends React.Component {
		render(){
			return (
				React.createElement("div", {id: "chgphone", className: "chgphone mui-page"}, 
					React.createElement("header", {className: "mui-navbar-inner mui-bar mui-bar-nav"}, 
						React.createElement("h1", {className: "mui-title"}, 
							"重置手机号"
						), 
						React.createElement("a", {className: "mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"}), 
						React.createElement("button", {type: "button", className: "editmypasswd-triggler mui-btn mui-btn-primary  mui-pull-right"}, "确定")
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
	
	return ReactRedux.connect(mapStateToProps)(ChgPhone);
})