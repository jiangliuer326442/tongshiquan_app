'use strict'

define(['react', "react-redux",
	"components/reglog/thirdlogin",
	"config/index",
	"actions/common",
	"actions/nav",
	"actions/reglog", 
	"actions/myuser",
	'css!./css/register'], function(React, ReactRedux,
		ThirdLogin,
		config,
		common,
		nav,
		reglog,
		myuser){
	class Login extends React.Component {
		constructor(props) {
		    super(props);
		    this.state = {
		    	focus: true,
		    	phone: "",
		    	password: ""
		    }
		}
		
		componentWillMount(){
			if(mui.os.plus){
				plus.webview.currentWebview().setStyle({
					softinputMode: "adjustResize"
				});
			}
			//初始化数据库
			common.buildTable();
			window.addEventListener('resize', function() {
				if(document.documentElement.clientHeight<500){
					if(mui(".reglogin .head").length>0){
						mui(".reglogin .head")[0].style.display = "none";
					}
				}else{
					if(mui(".reglogin .head").length>0){
						mui(".reglogin .head")[0].style.display = "block";
					}
				}
			}, false);
		}
		
		handleChange(event){
			var current_input = mui(event.target)[0].parentNode;
			var value = mui(event.target)[0].value;
			if(mui(current_input).hasClass("phonebox")){
				this.setState({phone: value});
			}else{
				this.setState({password: value});
			}
		}
		
		handleFocus(event){
			var current_input = mui(event.target)[0].parentNode;
			this.setState({focus: mui(current_input).hasClass("phonebox")});
		}
		
		componentDidMount(){
			mui('.mui-input-row input').input();
			var myphone = mui.getItem("myphone");
			if(myphone){
				this.setState({focus: false, phone: myphone});
			}
		   	mui(".login").on('tap','.btn', this.handleLog.bind(this));
		}
		
		handleLog(){
			if(!mui(this.refs.loginbtn).hasClass("btngray")){
				var phone = this.state.phone;
				var password = this.state.password;
				var uuid = this.props.uuid;
				var vendor = this.props.vendor;
				mui(".mui-input-password")[0].blur();
				reglog.send_login(phone,password,uuid,vendor,function(status,info,data){
			      if(status == 200){
					var companyid = data.companyid;
					var is_manager = data.is_manager;
					var uid = data.uid;
					var token = data.token;
					var bindcompany_flg = companyid != "0" ? true:false;
					mui.setItem("myphone", phone);
					if(!bindcompany_flg){
						plus.webview.getWebviewById("reg_putcompany").show("slide-in-right", 300);
					}else{
						mui.setItem("uid", uid);
						mui.setItem("token", token);
						mui.setItem("companyid", companyid);
						plus.runtime.restart();
					}
			      }else{
			      	mui.toast(info)
			      }
				}.bind(this));
			}
		}
		
		render(){
			return ( 
			 	<div className="reglogin login">
		 			<div className="head">
		 				<img onClick={function(){mui.back()}} className="return" src="./js/containers/register/img/return.png" />
		 			</div>
		 			<h2 className="title">账号登录</h2>
		 			<div className="inputbox phonebox mui-input-row">
		 			{this.state.focus||this.state.phone?
		 				<div className={"msg "+(this.state.focus?"on":"")} id="msg1">手机号码</div>
		 			:null}
			  			<input onChange={this.handleChange.bind(this)} onFocus={this.handleFocus.bind(this)} className={(this.state.focus?"on":"")+" mui-input-clear"} ref="phone_input" value={this.state.phone} type="number" placeholder="手机号码" />
		 			</div>
		 			<div className="inputbox passwordbox mui-input-row mui-password">
		 			{!this.state.focus?
		 				<div className={"msg mui-input-clear "+(!this.state.focus?"on":"")} id="msg2">请输入密码</div>
		 			:null}
			  			<input onChange={this.handleChange.bind(this)} onFocus={this.handleFocus.bind(this)} className={(!this.state.focus?"on":"")+" mui-input-password"} ref="password_input" value={this.state.password} type="password" placeholder="请输入密码" />
		 			</div>
		 			<button ref="loginbtn" className={this.state.phone.length == 11 && this.state.password.length>=6?"btn":"btn btngray"} type="mutton">登录</button>
		 			<ThirdLogin />
		 		</div>
		 	)
		}
	}
	
	function mapStateToProps(state) {
	  return {
	  	companyid: state.reglog.selected_company,
	  	phone: state.reglog.phone,
	  	password: state.reglog.password,
	  	uuid: state.myuser.uuid,
	  	vendor: state.myuser.vendor
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Login);
})