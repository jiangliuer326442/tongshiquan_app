'use strict'

define(['react', "react-redux","components/header",
	"actions/admin",
	"actions/structor",
	"css!./css/manager"], function(React, ReactRedux, Header, 
		admin,
		structor){
	class Manager extends React.Component {
		componentWillMount(){
			document.addEventListener("manager_init", function(){
				mui(".management").off("tap",".icon--tongzhi").on("tap",".icon--tongzhi",this.getmodellists.bind(this));
				mui(".management").off("tap",".icon--iconfonthaoyou").on("tap",".icon--iconfonthaoyou",this.employeelists.bind(this));
			}.bind(this));
		}
		
		
		//获取管理模块列表
		getmodellists(){
			var modelid = event.target.parentNode.getAttribute("data-id");
			var admin_flg = event.target.parentNode.getAttribute("data-role");
			if(admin_flg == 1 || this.props.is_admin == 1){
				mui(".createmodel")[0].style.display = "block";
			}else{
				mui(".createmodel")[0].style.display = "none";
			}
			admin.getsectionlist(this.props.uid, this.props.token, this.props.uuid, this.props.dispatch, modelid, admin_flg);
		}
		
		//获取员工列表
		employeelists(){
			structor.emplist(this.props.uid, this.props.token, this.props.uuid, this.props.dispatch, function(){});
			mui.fire(plus.webview.getWebviewById("detail_article"), "jump", {
				url: "/structor/edituser"
			});
		}
		
		render() {
			return ( 
				React.createElement("div", {id: "manager", className: "manager mui-page"}, 
					React.createElement("header", {className: "mui-navbar-inner mui-bar mui-bar-nav"}, 
						React.createElement("h1", {className: "mui-title"}, 
							"企业管理"
						), 
						React.createElement("a", {className: "mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"})
					), 
					React.createElement("div", {className: "mui-page-content"}, 
						React.createElement("div", {className: "mui-scroll-wrapper"}, 
							React.createElement("div", {className: "mui-scroll"}, 
							this.props.is_admin == 1? 
								React.createElement("ul", {className: "management mui-table-view mui-table-view-chevron"}, 
									React.createElement("li", {className: "mui-table-view-cell"}, 
										React.createElement("a", {href: "", className: "mui-navigate-right mui-icon mui-icon-extra mui-icon-extra-express"}, "全局设置")
									), 
									React.createElement("li", {className: "mui-table-view-cell"}, 
										React.createElement("a", {href: "", className: "mui-navigate-right mui-icon mui-icon-upload"}, "管理员转让")
									)
								)
							:null, 
								React.createElement("ul", {className: "management mui-table-view mui-table-view-chevron"}, 
							this.props.models.map(function(item, index){
								var icon = "";
								var href = "";
								if(item.name == "人事"){
									item.name = "人员管理";
									icon = "clubfriends icon--iconfonthaoyou";
									href = "#structor";
								}else if(item.name == "公告"){
									item.name = "企业通知";
									icon = "clubfriends icon--tongzhi";
									href = "#noticemodel";
								}else if(item.name == "贴吧"){
									item.name = "论坛帖子";
									icon = "clubfriends icon--shequtieba201";
								}else if(item.name == "空间"){
									item.name = "企业说说";
									icon = "clubfriends icon--pengyouquan";
								}
								return (
									React.createElement("li", {"data-id": item.id, "data-role": item.leaderid == this.props.uid ? 1:0, className: "mui-table-view-cell"}, 
										React.createElement("a", {href: href, className: "mui-navigate-right mui-icon "+icon}, item.name)
									)
								)
							}.bind(this))
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
	  	models: state.myuser.models,
	  	is_admin: state.myuser.is_admin
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Manager);
})