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
				myuser.chgpasswd(this.props.uid, this.props.token, this.props.uuid, this.state.old_passwd, this.state.new_passwd, function(){
					mui.alert("密码更换成功");
					mui.back();
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