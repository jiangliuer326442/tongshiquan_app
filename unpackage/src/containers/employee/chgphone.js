'use strict'

define(['react', "react-redux","components/header",
	"actions/myuser",
	"css!./css/chgphone"], function(React, ReactRedux, Header,
	myuser){
	class ChgPhone extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				phone: "",
				codes: "",
			}
		}
		
		componentDidMount(){
			mui(".chgphonecodes-triggler")[0].addEventListener("tap", this.handleSendCode.bind(this));
			
			mui(".editmyphone-triggler")[0].addEventListener("tap", this.handleChgPhone.bind(this));
		}
		
		handleChgPhone(){
			if(!mui(".chgphonecodes-triggler").hasClass("gray")){
	            var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		        if(!myreg.test(this.state.phone)){
	                mui.toast("手机号不合规范");
	                return;
	            }
		        if(this.state.codes.length != 4){
	                mui.toast("请填写验证码");
	                return;
		        }
		        myuser.chgphone(this.props.uid, this.props.token, this.props.uuid, this.state.phone, this.state.codes, function(status, info){
		        	if(status == 200){
		        		mui.fire(plus.webview.getWebviewById("index.html/ucenter"), "getuserinfo");
		        		mui.toast("设置成功");
		        		mui.back();
		        	}else{
		        		mui.toast(info);
		        	}
		        });
			}
		}
		
		handleSendCode(){
			if(!mui(".chgphonecodes-triggler").hasClass("gray")){
	            var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		        if(!myreg.test(this.state.phone)){
	                mui.toast("手机号不合规范");
	                return;
	            }
		        myuser.sendchgphone(this.props.uid, this.props.token, this.props.uuid, this.state.phone, function(status, info){
		        	if(status == 200){
						mui(".chgphonecodes-triggler").addClass("disabled");
						mui(".chgphonecodes-triggler")[0].setAttribute("disabled",true);
						var waittime = 120;
						var lefttime = waittime;
						var setsendcontent = function(){
							lefttime--;
							mui(".chgphonecodes-triggler")[0].innerHTML = lefttime+"秒重发";
						}
						var intervalId = window.setInterval(setsendcontent, 1000);
						window.setTimeout(function(){
							mui(".chgphonecodes-triggler").removeClass("disabled");
							mui(".chgphonecodes-triggler")[0].setAttribute("disabled",false);
							window.clearInterval(intervalId);
							mui(".chgphonecodes-triggler")[0].innerHTML = "重新发送";
						},waittime*1000);
		        	}else{
		        		mui.toast(info);
		        	}
		        });
			}
		}
		
		render(){
			return (
				<div id="chgphone" className="chgphone mui-page">
					<header className="mui-navbar-inner mui-bar mui-bar-nav">
						<h1 className="mui-title">
							重置手机号
						</h1>
						<a className="mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"></a>
						<button type="button" className="editmyphone-triggler mui-btn mui-btn-primary  mui-pull-right">确定</button>
					</header>
					<div className="mui-page-content">
						<form className="mui-input-group">
						    <div className="mui-input-row">
						        <label>手机号</label>
						    	<input type="phone" className="mui-input-clear" value={this.state.phone} onChange={function(e){
						    		var value = e.target.value;
						    		this.setState({phone: value});
						    	}.bind(this)} placeholder="请输入新手机号" />
						    </div>
						    <div className="mui-input-row">
						        <label>验证码</label>
						    	<input type="number" className="mui-input-clear codes" value={this.state.codes} onChange={function(e){
						    		var value = e.target.value;
						    		this.setState({codes: value});
						    	}.bind(this)} placeholder="4位数字" />
						    	<button type="button" className={"chgphonecodes-triggler mui-btn mui-btn-primary  mui-pull-right" + (this.state.phone.length != 11 ? " gray":"")}>获取验证码</button>
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
	
	return ReactRedux.connect(mapStateToProps)(ChgPhone);
})