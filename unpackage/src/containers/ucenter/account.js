'use strict'

define(['react', "react-redux","components/header","config/index",
	"actions/myuser",
	"actions/reglog",
	"css!./css/account"], function(React, ReactRedux, Header, config,
	myuser,
	reglog){
	class Account extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				qq_flg: false,
		    	auth_qq: null,
				wx_flg: false,
		    	auth_wx: null
			};
		}
		
		componentDidMount(){
			var that = this;
			if(mui.os.plus){
				that.services_init();
			}
			mui(".account").on("tap", ".nick", function(event){
				mui.prompt("请输入您在本公司的昵称", that.props.unick, "修改昵称", ["取消","确认修改"], function(e){
					if(e.index == 1){
						if(e.value){
							myuser.setnick(that.props.uid, that.props.token, that.props.uuid, e.value, that.props.dispatch);
						}
					}
				})
			})
			myuser.getuserbind(this.props.uid, this.props.token, this.props.uuid, this.props.dispatch, function(bindinfo){
				var that = this;
				this.setState({
					qq_flg: bindinfo.qq_flg,
					wx_flg: bindinfo.wx_flg
				});
			}.bind(this));
			mui(".account").on("tap", ".qq", function(event){
				if(!that.state.qq_flg){
					var openid = null;
					var s = that.state.auth_qq;
					var binduser = function(openid){
						reglog.qqbind(openid, that.props.uid, that.props.token, that.props.uuid, function(status, info){
							mui.toast(info);
							if(status == 200){
								that.setState({qq_flg: true});
							}
						});
					}
					if ( !s.authResult ) {
						s.login( function(e){
							// 获取登录操作结果
							openid = e.target.authResult.openid;
							binduser(openid);
						}, function(e){
							alert( "登录认证失败！" );
						} );
					}else{
						openid = s.authResult.openid;
						binduser(openid);
					}
				}else{
					mui.toast("您已绑定qq");
				}
			});
			mui(".account").on("tap", ".wx", function(event){
				if(!that.state.wx_flg){
					var openid = null;
					var unionid = null;
					var s = that.state.auth_wx;
					var binduser = function(){
						s.getUserInfo( function(e){
							openid = s.userInfo.openid;
							unionid = s.userInfo.unionid;
							reglog.wxbind(openid, unionid, that.props.uid, that.props.token, that.props.uuid, function(status, info){
								mui.toast(info);
								if(status == 200){
									that.setState({wx_flg: true});
								}
							});
						});
					}
					if ( !s.authResult ) {
						s.login( function(e){
							binduser();
						}, function(e){
							alert( "登录认证失败！" );
						} );
					}else{
						binduser();
					}
				}else{
					mui.toast("您已绑定微信");
				}
			});
		}
		
		//初始化第三方登陆平台
		services_init(){
			var auth_qq = null;
			var auth_wx = null;
			// 扩展API加载完毕，现在可以正常调用扩展API
			plus.oauth.getServices( function(services){
				for (var x in services){
					if(services[x].id == "weixin"){
						auth_wx = services[x];
					}
					if(services[x].id == "qq"){
						auth_qq = services[x]; 
					}
				}
				this.setState({
					auth_qq: auth_qq,
					auth_wx: auth_wx
				})
			}.bind(this), function(e){
				alert( "获取分享服务列表失败："+e.message+" - "+e.code );
			} );
		}
		
		render() {
			return ( 
				<div id="account" className="account mui-page">
					<header className="mui-navbar-inner mui-bar mui-bar-nav">
						<h1 className="mui-title">
							账号和安全
						</h1>
						<a className="mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"></a>
					</header>
					<div className="mui-page-content">
						<div className="mui-scroll-wrapper">
							<div className="mui-scroll">
								<ul className="mui-table-view mui-table-view-chevron">
									<li className="mui-table-view-cell">
										<a href="#mycompany" className="mui-navigate-right">所属公司<span className="mui-pull-right">{this.props.companyname}</span></a>
									</li>
									<li className="mui-table-view-cell">
										<a>姓名<span className="mui-pull-right">{this.props.username}</span></a>
									</li>
									<li className="mui-table-view-cell">
										<a className="nick mui-navigate-right">昵称<span className="mui-pull-right" ref="unick">{this.props.unick}</span></a>
									</li>
									<li className="mui-table-view-cell">
										<a>手机号<span className="mui-pull-right">{this.props.phone}</span></a>
									</li>
									<li className="mui-table-view-cell">
										<a>邮箱<span className="mui-pull-right">{this.props.umail}</span></a>
									</li>
								</ul>
								<ul className="mui-table-view mui-table-view-chevron">
									<li className="mui-table-view-cell qq">
										<a><i className="mui-icon mui-icon-qq" />QQ<span className={"mui-pull-right "+(this.state.qq_flg?"bind":"unbind")}>{this.state.qq_flg?"已绑定":"未绑定"}</span></a>
									</li>
									<li className="mui-table-view-cell wx">
										<a><i className="mui-icon mui-icon-weixin" />微信<span className={"mui-pull-right "+(this.state.wx_flg?"bind":"unbind")}>{this.state.wx_flg?"已绑定":"未绑定"}</span></a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {
	  	uid: state.myuser.uid,
	  	token: state.myuser.token,
	  	uuid: state.myuser.uuid,
	  	companyname: state.mycompany.name,
	  	username: state.myuser.uname,
	  	phone: state.myuser.uphone,
	  	umail: state.myuser.umail,
	  	unick: state.myuser.unick
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Account);
})