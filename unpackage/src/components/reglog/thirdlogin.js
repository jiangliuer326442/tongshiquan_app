'use strict'

define(['react', "react-redux","actions/common","config/index","actions/nav","actions/reglog","actions/myuser",'css!./css/thirdlogin'], function(React, ReactRedux, common, config, nav, reglog,myuser){
	class ThirdLogin extends React.Component {
		constructor(props) {
		    super(props);
		    this.state = {
		    	qq_flg: true,
		    	auth_qq: null,
		    	wx_flg: true,
		    	auth_wx: null
		    }
		}
		
		componentDidMount(){
			if(mui.os.plus){
				mui(".thirdlogin")[0].style.top = plus.screen.resolutionHeight*0.62 + "px";
				this.services_init();
			}
			mui(".thirdlogin").on('tap','.mui-icon-weixin', this.handleWXReg.bind(this));
			mui(".thirdlogin").on('tap','.mui-icon-qq', this.handleQQReg.bind(this));
		}
		
		handleQQReg(){
			var openid = null;
			var username = null;
			var avatar1 = null;
			var avatar2 = null;
			var s = this.state.auth_qq;
			var that = this;
			var getuserInfo = function(openid){
				s.getUserInfo( function(e){
					username = s.userInfo.nickname;
					avatar1 = s.userInfo.figureurl_qq_1;
					avatar2 = s.userInfo.figureurl_qq_2;
					reglog.qqlogin(openid, username, avatar1, avatar2, that.props.vendor, that.props.uuid, function(status,info,data){
				      if(status == 200){
						var companyid = data.companyid;
						var is_manager = data.is_manager;
						var uid = data.uid;
						var token = data.token;
						var bindcompany_flg = companyid != "0" ? true:false;
						//发布用户登陆结果
						that.props.dispatch({
							type: myuser.LOGIN,
							companyid: companyid,
							uid: uid,
							token: token,
							is_manager: is_manager
						});
						if(!bindcompany_flg){
							config.history.push("/reg/putcompany");
						}else{
							mui.setItem("uid", uid);
							mui.setItem("token", token);
							mui.setItem("companyid", companyid);
							plus.runtime.restart();
						}
				     }else{
							plus.nativeUI.toast(info);
				      }
					});
				}, function(e){
					alert( "获取用户信息失败："+e.message+" - "+e.code );
				} );
			}
			if ( !s.authResult ) {
				s.login( function(e){
					// 获取登录操作结果
					openid = e.target.authResult.openid;
					getuserInfo(openid);
				}, function(e){
					alert( "登录认证失败！" );
				} );
			}else{
				openid = s.authResult.openid;
				getuserInfo(openid);
			}
		}
		
		handleWXReg(){
			if(mui.os.plus){
				var openid = null;
				var unionid = null;
				var username = null;
				var avatar1 = null;
				var avatar2 = null;
				
				var that = this;
				
				var getuserInfo = function(){
					s.getUserInfo( function(e){
						openid = s.userInfo.openid;
						unionid = s.userInfo.unionid;
						username = s.userInfo.nickname;
						avatar1 = s.userInfo.headimgurl;
						avatar2 = avatar1;
						reglog.wxlogin(openid, unionid, username, avatar1, avatar2, that.props.vendor, that.props.uuid, function(status,info,data){
					      if(status == 200){
							var companyid = data.companyid;
							var is_manager = data.is_manager;
							var uid = data.uid;
							var token = data.token;
							var bindcompany_flg = companyid != "0" ? true:false;
							//发布用户登陆结果
							that.props.dispatch({
								type: myuser.LOGIN,
								companyid: companyid,
								uid: uid,
								token: token,
								is_manager: is_manager
							});
							if(!bindcompany_flg){
								config.history.push("/reg/putcompany");
							}else{
								mui.setItem("uid", uid);
								mui.setItem("token", token);
								mui.setItem("companyid", companyid);
								plus.runtime.restart();
							}
					      }else{
								if(mui.os.plus){
									plus.nativeUI.toast(info);
								}else{
									new common.Toast({message:info}).show();
								}
					      }
						});
					}, function(e){
						alert( "获取用户信息失败："+e.message+" - "+e.code );
					} );
				}
				var s = this.state.auth_wx;
				if ( !s.authResult ) {
					s.login( function(e){
						getuserInfo();
					}, function(e){
						alert( "登录认证失败！" );
					} );
				}else{
					getuserInfo();
				}	
			}
		}
		
		//初始化第三方登陆平台
		services_init(){
			var qq_flg = false;
			var wx_flg = false;
			var auth_qq = null;
			var auth_wx = null;
			// 扩展API加载完毕，现在可以正常调用扩展API
			plus.oauth.getServices( function(services){
				for (var x in services){
					if(services[x].id == "weixin"){
						wx_flg = true;
						auth_wx = services[x];
					}
					if(services[x].id == "qq"){
						qq_flg = true;
						auth_qq = services[x]; 
					}
				}
				this.setState({
					qq_flg: qq_flg,
					wx_flg: wx_flg,
					auth_qq: auth_qq,
					auth_wx: auth_wx
				})
			}.bind(this), function(e){
				alert( "获取分享服务列表失败："+e.message+" - "+e.code );
			} );
		}
		
		render(){
			return (
				<div className="thirdlogin">
					<h5>快速登陆</h5>
					<div className="loginicon">
					{this.state.wx_flg?
						<div className="mui-icon mui-icon-weixin" />
					:null}
					{this.state.qq_flg?
						<div className="mui-icon mui-icon-qq" />
					:null}
					</div>
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
	  	vendor: state.myuser.vendor,
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(ThirdLogin);
})