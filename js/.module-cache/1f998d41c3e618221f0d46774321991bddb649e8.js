'use strict'

define(['react', "react-redux","components/header",
	"actions/myuser"], function(React, ReactRedux, Header,
	myuser){
	class ChgPasswd extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				old_passwd: "",
				new_passwd: "",
				rep_passwd: ""
			}
		}
		
		componentDidMount(){
			mui(".chgpasswd").on("tap", ".editmypasswd-triggler", function(){
				myuser.chgpasswd(this.props.uid, this.props.token, this.props.uuid, this.state.old_passwd, this.state.new_passwd, function(status, info){
					if(status == 200){
						mui.alert("密码更换成功");
						mui.back();
					}else{
						mui.alert(info);
					}
				});
			}.bind(this));
		}
		
		render(){
			return (
				React.createElement("div", {id: "chgpasswd", className: "chgpasswd mui-page"}, 
					React.createElement("header", {className: "mui-navbar-inner mui-bar mui-bar-nav"}, 
						React.createElement("h1", {className: "mui-title"}, 
							"修改密码"
						), 
						React.createElement("a", {className: "mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"}), 
						React.createElement("button", {type: "button", className: "editmypasswd-triggler mui-btn mui-btn-primary  mui-pull-right"}, "确定")
					), 
					React.createElement("div", {className: "mui-page-content"}, 
						React.createElement("form", {className: "mui-input-group"}, 
						    React.createElement("div", {className: "mui-input-row"}, 
						        React.createElement("label", null, "旧密码"), 
						    	React.createElement("input", {type: "password", className: "mui-input-clear", value: this.state.old_passwd, onChange: function(e){
						    		var value = e.target.value;
						    		this.setState({old_passwd: value});
						    	}.bind(this), placeholder: "旧密码"})
						    ), 
						    React.createElement("div", {className: "mui-input-row"}, 
						        React.createElement("label", null, "新密码"), 
						    	React.createElement("input", {type: "password", className: "mui-input-clear", value: this.state.new_passwd, onChange: function(e){
						    		var value = e.target.value;
						    		this.setState({new_passwd: value});
						    	}.bind(this), placeholder: "新密码"})
						    ), 
						    React.createElement("div", {className: "mui-input-row"}, 
						        React.createElement("label", null, "确认密码"), 
						        React.createElement("input", {type: "password", value: this.state.rep_passwd, onChange: function(e){
						    		var value = e.target.value;
									this.setState({rep_passwd: value});
						    	}.bind(this), placeholder: "确认密码"})
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
	
	return ReactRedux.connect(mapStateToProps)(ChgPasswd);
});