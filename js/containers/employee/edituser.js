'use strict'

define(['react', "react-redux","components/header",
	"actions/user",
	"css!./css/edituser"], function(React, ReactRedux, Header,
	user){
	class EditUser extends React.Component {
		
		constructor(props){
			super(props);
			this.state = {
				userid: 0,
				avatar: "",
				name: "",
				nick: "",
				mail: ""
			}
		}
		
		componentWillMount(){
			document.addEventListener('init_edituser', function(event){
				var uid = event.detail.uid;
				user.getemp(uid, function(user){
					this.setState({
						userid: user.id,
						avatar: user.avatar,
						name: user.name,
						nick: user.nick,
						mail: user.mail
					});
				}.bind(this));
			}.bind(this));
		}
		
		componentDidMount(){
			mui(".edituser").on("tap", ".editemployee-triggler", function(){
				user.setemp(this.props.uid, this.props.token, this.props.uuid, this.state.userid, this.state.avatar, this.state.name, this.state.nick, this.state.mail, function(){
					mui.fire(plus.webview.getWebviewById("index.html/ucenter"), "getuserinfo");
					mui.fire(plus.webview.getWebviewById("index.html/ucenter"), "refresh_structor");
					mui.back();
				});
			}.bind(this));
		}
		
		render(){
			return (
				React.createElement("div", {id: "edituser", className: "edituser mui-page"}, 
					React.createElement("header", {className: "mui-navbar-inner mui-bar mui-bar-nav"}, 
						React.createElement("h1", {className: "mui-title"}, 
							"修改员工信息"
						), 
						React.createElement("a", {className: "mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"}), 
						React.createElement("button", {type: "button", className: "editemployee-triggler mui-btn mui-btn-primary  mui-pull-right"}, "确定")
					), 
					React.createElement("div", {className: "mui-page-content"}, 
						React.createElement("form", {className: "mui-input-group"}, 
						    React.createElement("div", {className: "mui-input-row"}, 
						        React.createElement("label", null, "昵称"), 
						    	React.createElement("input", {type: "text", className: "mui-input-clear", value: this.state.nick, onChange: function(e){
						    		var value = e.target.value;
						    		this.setState({nick: value});
						    	}.bind(this), placeholder: "员工昵称"})
						    ), 
						    React.createElement("div", {className: "mui-input-row"}, 
						        React.createElement("label", null, "姓名"), 
						    	React.createElement("input", {type: "text", className: "mui-input-clear", value: this.state.name, onChange: function(e){
						    		var value = e.target.value;
						    		this.setState({name: value});
						    	}.bind(this), placeholder: "员工真实姓名"})
						    ), 
						    React.createElement("div", {className: "mui-input-row"}, 
						        React.createElement("label", null, "邮箱"), 
						        React.createElement("input", {type: "email", value: this.state.mail, onChange: function(e){
						    		var value = e.target.value;
									this.setState({mail: value});
						    	}.bind(this), placeholder: "工作邮箱"})
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
	  	uuid: state.myuser.uuid,
	  	list: state.structor.all_employee
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(EditUser);
});