'use strict'

define(['react', "react-redux","components/header","components/common/img",
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
	"containers/employee/chgpasswd",
	"css!./css/ucenter"], function(React, ReactRedux, Header, Img,
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
			ChgPasswd){
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
				React.createElement("div", {className: "mui-fullscreen"}, 
					React.createElement("div", {id: "app", className: "mui-views"}, 
						React.createElement("div", {className: "mui-view"}, 
							React.createElement("div", {className: "mui-navbar"}
							), 
							React.createElement("div", {className: "mui-pages"}
							)
						)
					), 
					React.createElement(Account, null), 
					React.createElement(Manager, null), 
					React.createElement(Secure, null), 
					React.createElement(Settings, null), 
					React.createElement(NoticeModel, null), 
					React.createElement(CreateArticle, null), 
					React.createElement(ArticleList, null), 
					React.createElement(MyCompany, null), 
					React.createElement(ChgPasswd, null), 
					React.createElement(Structor, {onEmployeeDetail: function(uid,avatar,nick){this.onEmployeeDetail(uid,avatar,nick);}.bind(this)}), 
					React.createElement("div", {id: "ucenter", className: "ucenter mui-page"}, 
						React.createElement("header", {className: "mui-navbar-inner mui-bar mui-bar-nav"}, 
							React.createElement("h1", {className: "mui-title"}, 
								"个人中心"
							)
						), 
						React.createElement("div", {className: "mui-page-content"}, 
							React.createElement("div", {className: "mui-scroll-wrapper"}, 
								React.createElement("div", {className: "mui-scroll"}, 
									React.createElement("a", {href: "#account", className: "header account mui-navigate-right"}, 
										React.createElement("div", {className: "avatar"}, 
											React.createElement(Img, {src: this.props.avatar, placeholder: "./js/containers/img/60x60.gif", folder: "avatar"})
										), 
										React.createElement("div", {className: "body"}, 
											React.createElement("span", {className: "username"}, this.props.uname), 
											React.createElement("span", {className: "companyname"}, this.props.companyname)
										)
									), 
								this.props.models.length>0 ?
									React.createElement("ul", {className: "management mui-table-view mui-table-view-chevron"}, 
										React.createElement("li", {className: "mui-table-view-cell"}, 
											React.createElement("a", {className: "mui-navigate-right", href: "#manager"}, React.createElement("i", {className: "mui-icon mui-icon-extra mui-icon-extra-class"}), "企业管理")
										)
									)
								:null, 
									React.createElement("ul", {className: "mui-table-view mui-table-view-chevron"}, 
										React.createElement("li", {className: "mui-table-view-cell"}, 
											React.createElement("a", {className: "mui-navigate-right", href: ""}, React.createElement("i", {className: "mui-icon mui-icon-chat"}), "收到的回复")
										), 
										React.createElement("li", {className: "mui-table-view-cell"}, 
											React.createElement("a", {className: "mui-navigate-right", href: ""}, React.createElement("i", {className: "mui-icon mui-icon-extra mui-icon-extra-comment"}), "我的说说")
										)
									), 
									React.createElement("ul", {className: "mui-table-view mui-table-view-chevron"}, 
										React.createElement("li", {className: "mui-table-view-cell"}, 
											React.createElement("a", {className: "mui-navigate-right", href: ""}, React.createElement("i", {className: "mui-icon clubfriends icon--ttpodicon"}), "邀请同事")
										), 
										React.createElement("li", {className: "mui-table-view-cell"}, 
											React.createElement("a", {className: "mui-navigate-right", href: "#secure"}, React.createElement("i", {className: "mui-icon clubfriends icon--ttpodicon"}), "安全和隐私")
										), 
										React.createElement("li", {className: "mui-table-view-cell"}, 
											React.createElement("a", {className: "mui-navigate-right", href: "#settings"}, React.createElement("i", {className: "mui-icon clubfriends icon--ttpodicon"}), "设置")
										)
									)
								)
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