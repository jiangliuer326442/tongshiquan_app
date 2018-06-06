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
			mui(".editmypasswd-triggler")[0].addEventListener("tap", function(){
				if(this.state.new_passwd != this.state.rep_passwd){
					mui.alert("两次密码不一致");
					this.setState({
						rep_passwd: ""
					});
				}else{
					myuser.chgpasswd(this.props.uid, this.props.token, this.props.uuid, this.state.old_passwd, this.state.new_passwd, function(status, info){
						if(status == 200){
							mui.alert("密码更换成功");
							mui.back();
						}else{
							mui.alert(info);
						}
					});
				}
			}.bind(this));
		}
		
		render(){
			return (
				<div id="chgpasswd" className="chgpasswd mui-page">
					<header className="mui-navbar-inner mui-bar mui-bar-nav">
						<h1 className="mui-title">
							修改密码
						</h1>
						<a className="mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"></a>
						<button type="button" className="editmypasswd-triggler mui-btn mui-btn-primary  mui-pull-right">确定</button>
					</header>
					<div className="mui-page-content">
						<form className="mui-input-group">
						    <div className="mui-input-row">
						        <label>旧密码</label>
						    	<input type="password" className="mui-input-clear" value={this.state.old_passwd} onChange={function(e){
						    		var value = e.target.value;
						    		this.setState({old_passwd: value});
						    	}.bind(this)} placeholder="旧密码" />
						    </div>
						    <div className="mui-input-row">
						        <label>新密码</label>
						    	<input type="password" className="mui-input-clear" value={this.state.new_passwd} onChange={function(e){
						    		var value = e.target.value;
						    		this.setState({new_passwd: value});
						    	}.bind(this)} placeholder="新密码" />
						    </div>
						    <div className="mui-input-row">
						        <label>确认密码</label>
						        <input type="password" value={this.state.rep_passwd} onChange={function(e){
						    		var value = e.target.value;
									this.setState({rep_passwd: value});
						    	}.bind(this)} placeholder="确认密码" />
						    </div>
						</form>
					</div>
				</div>
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