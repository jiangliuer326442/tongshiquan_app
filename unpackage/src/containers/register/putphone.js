'use strict'

define(['react', "react-redux", "config/index", "actions/reglog",'css!./css/register'], function(React, ReactRedux, config, reglog){
	class Putphone extends React.Component {
		componentWillMount(){
			window.addEventListener('resize', function() {
				if(document.documentElement.clientHeight<500){
					if(mui(".reglogin .subtitle").length>0){
						mui(".reglogin .subtitle")[0].style.display = "none";
					}
				}else{
					if(mui(".reglogin .subtitle").length>0){
						mui(".reglogin .subtitle")[0].style.display = "block";
					}
				}
			}, false);
			if(mui.os.plus){
				plus.webview.currentWebview().setStyle({
					softinputMode: "adjustResize"
				});
			}
		}
		
		componentDidMount(){
			mui('.mui-input-row input').input();
			mui(".putphoneno")[0].style.backgroundPositionY = "-59px";
			this.bindEvent();
		}
		
		handleChangePhone(e){
			var password = mui(this.refs.password_input)[0].value;
			var phone = e.target.value;
			this.handleChange(phone, password)
		}
		
		handleChangePasswd(e){
			var password = e.target.value;
			var phone = mui(this.refs.phone_input)[0].value;
			this.handleChange(phone, password)
		}
		
		bindEvent(){
			mui(".putphoneno").on('tap','.btn', this.handleNext.bind(this));
		}
		
		handleNext(){
			if(!mui(this.refs.nextbtn).hasClass("btngray")){
				reglog.sendregcode(0, "", mui(this.refs.phone_input)[0].value, mui(this.refs.password_input)[0].value, this.props.dispatch, function(status, info){
					if(status==200){
						config.history.push("/reg/putcode");
					}else{
						mui.toast(info);
					}
				});
			}
		}
		
		handleChange(phone, password){
			if(phone.length==11){
				var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
			    if(myreg.test(phone)){
			    	if(password.length>=6){
			    		mui(this.refs.nextbtn).removeClass("btngray");
			    		return;
			    	}
			    }
			}
			mui(this.refs.nextbtn).addClass("btngray");
		}
		
		render() {
			return ( 
			 	<div className="reglogin putphoneno">
			 		<h2 className="title">输入你的手机号</h2>
			 		<p className="subtitle">手机号仅用于登录和保护账号安全</p>
			 		<div className="inputbox phonebox mui-input-row">
			 			<input className="mui-input-clear" ref="phone_input" type="number" onChange={this.handleChangePhone.bind(this)} placeholder="输入手机号码" />
			 		</div>
			 		<div className="inputbox passwordbox mui-input-row mui-password">
			 			<input className="mui-input-password" ref="password_input" type="password" onChange={this.handleChangePasswd.bind(this)} placeholder="输入密码&nbsp;&nbsp;长度不小于6位" />
			 		</div>
			 		<button ref="nextbtn" className="btn btngray" type="mutton">下一步</button>
			 	</div>
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {
	  	selected_company: state.reglog.selected_company,
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Putphone);
})