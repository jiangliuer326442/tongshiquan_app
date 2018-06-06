'use strict'

define(['react', "react-redux","components/header","config/index",
	"actions/reglog",
	"actions/version",
	"css!./css/settings"], function(React, ReactRedux, Header, config,
		reglog,
		version){
	class Settings extends React.Component {
		
		componentDidMount(){
			var uid = this.props.uid;
			var token = this.props.token;
			var uuid = this.props.uuid;
			mui(".settings").on("tap", ".ckversion", version.ckversion);
			mui(".settings").on("tap",".logout",function(){
				mui.confirm("确定退出登录吗？","提示", ["取消","确定"], function(e){
					if (e.index == 1) {
						reglog.logout(uid,token,uuid);
					}
				});
			})
			mui(".settings").on("tap",".opennotice",function(){
				if(mui.os.android){
					var main = plus.android.runtimeMainActivity();
					var Intent = plus.android.importClass('android.content.Intent');
					var Settings = plus.android.importClass('android.provider.Settings');
					var Uri = plus.android.importClass("android.net.Uri");
					var pkUri = Uri.fromParts('package', plus.android.invoke(main, "getPackageName"), null);
					var intent = new Intent();
					intent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");
					intent.setData(pkUri);
					main.startActivity(intent);	
				}
			});
		}
		render() {
			return ( 
				React.createElement("div", {id: "settings", className: "settings mui-page"}, 
					React.createElement("header", {className: "mui-navbar-inner mui-bar mui-bar-nav"}, 
						React.createElement("h1", {className: "mui-title"}, 
							"设置"
						), 
						React.createElement("a", {className: "mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"})
					), 
					React.createElement("div", {className: "mui-page-content"}, 
						React.createElement("div", {className: "mui-scroll-wrapper"}, 
							React.createElement("div", {className: "mui-scroll"}, 
								React.createElement("ul", {className: "mui-table-view mui-table-view-chevron"}, 
									React.createElement("li", {className: "mui-table-view-cell"}, 
										React.createElement("a", {className: "ckversion"}, "版本更新", React.createElement("span", {className: "mui-pull-right"}, "当前版本："+ (mui.os.plus? mui.os.plus && plus.runtime.version:"")))
									), 
									React.createElement("li", {className: "mui-table-view-cell"}, 
										React.createElement("a", {className: "mui-navigate-right"}, "清除图片缓存")
									), 
									React.createElement("li", {className: "mui-table-view-cell"}, 
										React.createElement("a", {className: "mui-navigate-right"}, "清除数据缓存")
									), 
									React.createElement("li", {className: "mui-table-view-cell"}, 
										React.createElement("a", {className: "opennotice mui-navigate-right"}, "开启通知")
									), 
									React.createElement("li", {className: "mui-table-view-cell"}, 
										React.createElement("a", {className: "mui-navigate-right"}, "给我五星级的爱")
									), 
									React.createElement("li", {className: "mui-table-view-cell"}, 
										React.createElement("a", {className: "mui-navigate-right"}, "反馈和建议")
									)
								), 
								React.createElement("ul", {className: "mui-table-view"}, 
									React.createElement("li", {className: "mui-table-view-cell", style: {textAlign: "center"}}, 
										React.createElement("a", {className: "logout"}, "退出登录")
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
	  	uuid: state.myuser.uuid
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Settings);
});