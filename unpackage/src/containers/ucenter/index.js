'use strict'

define(['react', "react-redux","components/header",
	"components/reglog/invitereg",
	"containers/ucenter/account",
	"containers/ucenter/manager",
	"containers/ucenter/secure",
	"containers/ucenter/settings",
	"containers/ucenter/noticemodel",
	"containers/ucenter/createarticle",
	"containers/ucenter/articlelist",
	"containers/ucenter/mycompany",
	"containers/employee/structor",
	"actions/reglog",
	"actions/myuser",
	"actions/company",
	"containers/employee/chgpasswd",
	"containers/employee/chgphone",
	"css!./css/ucenter"], function(React, ReactRedux, Header,
			InviteReg,
			Account,
			Manager,
			Secure,
			Settings,
			NoticeModel,
			CreateArticle,
			ArticleList,
			MyCompany,
			Structor,
			reglog, 
			myuser,
			company,
			ChgPasswd,
			ChgPhone){
	class Ucenter extends React.Component {
		
		componentWillMount(){
			document.addEventListener("getuserinfo", function(){
				myuser.getuserinfo(this.props.uid, this.props.token, this.props.uuid, this.props.dispatch, function(status, info, data){
					if(status == 502 || status == 500){
						reglog.logout(this.props.uid, this.props.token, this.props.uuid);
					}
					mui.fire(plus.webview.currentWebview(), "manager_init");
				}.bind(this));
			}.bind(this))
		}
		
		componentDidMount(){
			mui.init({
				gestureConfig: {
					longtap: true
				}
			});
			
			mui.os.plus && mui.fire(plus.webview.currentWebview(), "getuserinfo");
			
			var that = this;
			var viewApi = mui('#app').view({
				defaultPage: '.ucenter'
			});
			mui.back = function() {
				if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
					viewApi.back();
				} else { //执行webview后退
					reglog.quit();
				}
			};

			mui(".ucenter").on("tap",".avatar", that.uploadPhoto.bind(that, event));
		
			//打开分享给好友
			mui(".ucenter").on('tap','.share-btn', this.handleInvite.bind(this))
		}
		
		handleInvite(){
			plus.nativeObj.View.getViewById('tabBar').hide();
			plus.nativeObj.View.getViewById('icon').hide();
			company.getqrcode(this.props.uid, this.props.token, this.props.uuid, this.props.companyid, this.props.dispatch);
			mui(".invite_reg")[0].style.visibility = "visible";
			mui(".invite_reg .box").addClass("show");
			mui(".invite_reg .box").removeClass("hide");
		}
		
		onEmployeeDetail(uid,avatar,nick){
			mui.fire(plus.webview.getWebviewById("detail_article"), "init_edituser", {
				uid: uid
			});
			setTimeout(function () {
				plus.webview.getWebviewById("detail_article").show("slide-in-right", 300);
			},150);
		}
		
		//上传头像
		uploadPhoto(event){
			var that = this;
			var btnArray = [{
				title: "拍照"
			}, {
				title: "从相册选择"
			}];
			plus.nativeUI.actionSheet({
				title: "更换头像",
				cancel: "取消",
				buttons: btnArray
			}, function(e){
				var index = e.index;
				switch (index) {
					case 0:
						break;
					case 1:
						var cmr = plus.camera.getCamera(2);
						cmr.captureImage(function(path){
							path = "file://" + plus.io.convertLocalFileSystemURL(path);
							myuser.setuseravatar(that.props.uid, that.props.token, that.props.uuid, path, function(imgUrl){
								mui.setItem('avatar', imgUrl);
							})
							mui(".avatar img")[0].setAttribute("src", path);
						}, function(){}, {
							index: 2,
							resolution: cmr.supportedImageResolutions[cmr.supportedImageResolutions.length-1]
						});
						break;
					case 2:
						plus.gallery.pick(function(path){
							myuser.setuseravatar(that.props.uid, that.props.token, that.props.uuid, path, function(imgUrl){
								mui.setItem('avatar', imgUrl);
							})
							mui(".avatar img")[0].setAttribute("src", path);									this.send(path, "图片");
						}, function(err) {}, {
							system: false
						});
						break;
				}
			});
			event.stopPropagation();
		}
		
		render() {
			return ( 
				<div className="company mui-fullscreen">
					<div id="app" className="mui-views">
						<div className="mui-view">
							<div className="mui-navbar">
							</div>
							<div className="mui-pages">
							</div>
						</div>
					</div>
					<InviteReg />
					<Account />
					<Manager />
					<Secure />
					<Settings />
					<NoticeModel />
					<CreateArticle />
					<ArticleList />
					<MyCompany />
					<ChgPasswd />
					<ChgPhone />
					<Structor onEmployeeDetail={function(uid,avatar,nick){this.onEmployeeDetail(uid,avatar,nick);}.bind(this)} />
					<div id="ucenter" className="ucenter mui-page">
						<header className="mui-navbar-inner mui-bar mui-bar-nav">
							<h1 className="mui-title">
								个人中心
							</h1>
						</header>
						<div className="mui-page-content">
							<div className="mui-scroll-wrapper">
								<div className="mui-scroll">
									<a href="#account" className="header account mui-navigate-right">
										<div className="avatar">
											<img src={this.props.avatar} />
										</div>
										<div className="body">
											<span className="username">{this.props.uname}</span>
											<span className="companyname">{this.props.companyname}</span>
										</div>
									</a>
								{this.props.models.length>0 ?
									<ul className="management mui-table-view mui-table-view-chevron">
										<li className="mui-table-view-cell">
											<a className="mui-navigate-right" href="#manager"><i className="mui-icon mui-icon-extra mui-icon-extra-class"></i>企业管理</a>
										</li>
									</ul>
								:null}
									<ul className="mui-table-view mui-table-view-chevron">
										<li className="mui-table-view-cell">
											<a className="mui-navigate-right" href=""><i className="mui-icon mui-icon-chat"></i>收到的回复</a>
										</li>
										<li className="mui-table-view-cell">
											<a className="mui-navigate-right" href=""><i className="mui-icon mui-icon-extra mui-icon-extra-comment"></i>我的说说</a>
										</li>
									</ul>
									<ul className="mui-table-view mui-table-view-chevron">
										<li className="mui-table-view-cell share-btn">
											<a className="mui-navigate-right" href="javascript:;"><i className="mui-icon mui-icon-extra mui-icon-extra-share"></i>邀请同事注册</a>
										</li>
										<li className="mui-table-view-cell">
											<a className="mui-navigate-right" href="#secure"><i className="mui-icon clubfriends icon--niming"></i>安全和隐私</a>
										</li>
										<li className="mui-table-view-cell">
											<a className="mui-navigate-right" href="#settings"><i className="mui-icon clubfriends icon--ttpodicon"></i>设置</a>
										</li>
									</ul>
								</div>
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
	  		avatar: state.myuser.avatar,
	  		uname: state.myuser.uname,
	  		companyid: state.myuser.companyid,
	  		companyname: state.mycompany.name,
	  		unick: state.myuser.unick,
	  		umail: state.myuser.umail,
	  		models: state.myuser.models
	  	}
	}
	
	return ReactRedux.connect(mapStateToProps)(Ucenter);
});