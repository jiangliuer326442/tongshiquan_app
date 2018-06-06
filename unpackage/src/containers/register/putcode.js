'use strict'

define(['react', "react-redux", "config/index", "actions/reglog", "actions/myuser",'css!./css/register'], function(React, ReactRedux, config, reglog, myuser){
	class Putcode extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				codelength: 4,
				codes: "",
				isreg_flg: false,
			}
		}
		
		componentDidMount(){
			this.focus(0);
			this.bindEvent();
		}
		
		bindEvent(){
			mui(".putcode").on('tap','.btn', this.handleReg.bind(this));
		}
		
		handleReg(){
			if(!mui(this.refs.regbtn).hasClass("btngray")){
				if(!this.state.isreg_flg){
					this.state.isreg_flg = true;
					var uuid = this.props.uuid;
					var vendor = this.props.vendor;
					if(parseInt(this.props.uid)>0){
						reglog.thirdreg(this.props.uid, this.props.token, this.props.companyid, this.props.phone, this.state.codes, this.props.password, uuid, vendor, function(status,info,data){
						      if(status == 200){
								var companyid = data.companyid;
								var is_manager = data.is_manager;
								var uid = data.uid;
								var token = data.token;
								//发布用户登陆结果
								this.props.dispatch({
									type: myuser.LOGIN,
									companyid: companyid,
									uid: uid,
									token: token,
									is_manager: is_manager
								});
								mui.setItem("myphone", this.props.phone);
								mui.setItem("uid", uid);
								mui.setItem("token", token);
								mui.setItem("companyid", companyid);
								plus.runtime.restart();
						      }else{
						      	mui.toast(info);
						      }
						      this.state.isreg_flg = false;
						})
					}else{
						reglog.send_register(this.props.companyid, this.props.phone, this.state.codes, this.props.password, uuid, vendor, function(status,info,data){
						      if(status == 200){
								var companyid = data.companyid;
								var is_manager = data.is_manager;
								var uid = data.uid;
								var token = data.token;
								//发布用户登陆结果
								this.props.dispatch({
									type: myuser.LOGIN,
									companyid: companyid,
									uid: uid,
									token: token,
									is_manager: is_manager
								});
								mui.setItem("myphone", this.props.phone);
								mui.setItem("uid", uid);
								mui.setItem("token", token);
								mui.setItem("companyid", companyid);
								plus.runtime.restart();
						      }else{
									if(mui.os.plus){
										plus.nativeUI.toast(info);
									}else{
										mui.toast({message:info}).show();
									}
						      }
						      this.state.isreg_flg = false;
						}.bind(this))
					}
				}
			}
		}
		
		handleChange(i,event){
			var no = event.target.value;
			var codes = this.state.codes;
			if(no.length>0){
				if(no>9){
					codes = codes.substr(0,i);
					no= no.substr(1);
					mui(event.target)[0].value = no;
				}
				if(i+1<this.state.codelength){
					this.focus(i+1);
				}
				codes+=no;
			}else{
				if(i>0){
					this.focus(i-1);
				}
				codes = codes.substr(0,i);
			}
			this.setState({codes: codes});
		}
		
		rendercodes(){
			var codes = [];
			for( var i = 0; i < this.state.codelength; i++ ){
				codes.push(<input type="number" onChange={this.handleChange.bind(this, i)} length="1" />);
			}
			return codes;
		}
		
		focus(t){
			for(var i=0; i<this.state.codelength; i++){
				mui(".codesgroup input")[i].classList.remove("focus");
			}
			mui(".codesgroup input")[t].classList.add("focus");
			mui(".codesgroup input")[t].focus();
		}
		
		replacephoneno(phone){
			var result = "";
			for(var i=0; i<phone.length; i++){
				result += phone[i];
				if(i==2 || i==6){
					result += " ";
				}
			}
			return result;
		}
		
		render(){
			return ( 
			 	<div className="reglogin putcode">
		 			<div className="head">
		 				<img onClick={function(){mui.back()}} className="return" src="./js/containers/register/img/return.png" />
		 			</div>
			 		<h2 className="title">输入验证码</h2>
			 		<p className="subtitle">验证码已经发送到<i>{this.replacephoneno(this.props.phone)}</i></p>
			 		<div className="codesgroup">
			 			{this.rendercodes()}
			 		</div>
			 		<button ref="regbtn" className={this.state.codes.length==this.state.codelength?"btn":"btn btngray"} type="mutton">完成注册</button>
			 	</div>
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {
	  	uid: state.myuser.uid,
	  	token: state.myuser.token,
	  	companyid: state.reglog.selected_company,
	  	phone: state.reglog.phone,
	  	password: state.reglog.password,
	  	uuid: state.myuser.uuid,
	  	vendor: state.myuser.vendor
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Putcode);
});