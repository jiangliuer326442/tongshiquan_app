'use strict'

define(['react', "react-redux","components/header",
	"actions/myuser"], function(React, ReactRedux, Header,
	myuser){
	class ChgPhone extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				phone: "",
				codes: "",
			}
		}
		
		render(){
			return (
				React.createElement("div", {id: "chgphone", className: "chgphone mui-page"}, 
					React.createElement("header", {className: "mui-navbar-inner mui-bar mui-bar-nav"}, 
						React.createElement("h1", {className: "mui-title"}, 
							"重置手机号"
						), 
						React.createElement("a", {className: "mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"}), 
						React.createElement("button", {type: "button", className: "editmypasswd-triggler mui-btn mui-btn-primary  mui-pull-right"}, "确定")
					), 
					React.createElement("div", {className: "mui-page-content"}, 
						React.createElement("form", {className: "mui-input-group"}, 
						    React.createElement("div", {className: "mui-input-row"}, 
						        React.createElement("label", null, "手机号"), 
						    	React.createElement("input", {type: "phone", className: "mui-input-clear", value: this.state.phone, onChange: function(e){
						    		var value = e.target.value;
						    		this.setState({phone: value});
						    	}.bind(this), placeholder: "请输入新手机号"})
						    ), 
						    React.createElement("div", {className: "mui-input-row"}, 
						        React.createElement("label", null, "验证码"), 
						    	React.createElement("input", {type: "number", className: "mui-input-clear", value: this.state.codes, onChange: function(e){
						    		var value = e.target.value;
						    		this.setState({codes: value});
						    	}.bind(this), placeholder: "4位数字"})
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
	
	return ReactRedux.connect(mapStateToProps)(ChgPhone);
})