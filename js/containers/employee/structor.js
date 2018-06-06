'use strict'

define(['react', "react-redux","components/header","actions/structor","css!./css/structor"], function(React, ReactRedux, Header, structor){
	class Structor extends React.Component {
		
		componentWillMount(){
			document.addEventListener('refresh_structor', function(){
				var uid = this.props.uid;
				var token = this.props.token;
				var uuid = this.props.uuid;
				var dispatch = this.props.dispatch;
				structor.get_structor(uid, token, uuid, this.props.current_selected, dispatch, function(status, info, data){
					var that = this;
					that.bindDepartment();
					mui(".structor_line").off("tap","a").on("tap", "a", function(){
						structor.pop_structor(uid, token, uuid, this.getAttribute("data-id"), dispatch, function(){
							that.bindDepartment();
						});
						return false;
					});
				}.bind(this));
			}.bind(this));
		}
		
		componentDidMount(){
			mui.os.plus && mui.fire(plus.webview.currentWebview(), "refresh_structor");
		}
		
		bindEmployee(){
			var that = this;
			mui(".employee_list").on("tap", "li", function(){
				var uid = this.getAttribute("data-uid");
				var avatar = this.getAttribute("data-avatar");
				var nick = this.getAttribute("data-nick");
				that.props.onEmployeeDetail(uid, avatar, nick);
			});
		}
		
		bindDepartment(){
			var uid = this.props.uid;
			var token = this.props.token;
			var uuid = this.props.uuid;
			var dispatch = this.props.dispatch;
			var that = this;
			mui(".department_list").on("tap", "li", function(){
				structor.push_structor(uid, token, uuid, this.getAttribute("data-id"), this.getAttribute("data-name"), dispatch, function(status, info, data){
					that.bindEmployee();
				});
				return false;
			});
		}
		
		render() {
			return ( 
				React.createElement("div", {id: "structor", className: "structor mui-page"}, 
					React.createElement("header", {className: "mui-navbar-inner mui-bar mui-bar-nav"}, 
						React.createElement("h1", {className: "mui-title"}, 
							"按组织架构查看"
						), 
						React.createElement("a", {className: "mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"})
					), 
					React.createElement("div", {className: "mui-page-content"}, 
						React.createElement("div", {className: "structor_line"}, 
					this.props.selected_list.map(function(item, index){
						return (
							React.createElement("span", null, 
								React.createElement("a", {className: item.id==this.props.current_selected?"active":"", "data-id": item.id, href: ""}, item.name), 
								index+1<this.props.selected_list.length?
									React.createElement("span", null, ">")
								:null
							)
						)
					}.bind(this))
						), 
					this.props.department_list.length>0?
						React.createElement("ul", {className: "department_list mui-table-view mui-table-view-chevron"}, 
					this.props.department_list.map(function(item, index){
						return (
							React.createElement("li", {"data-id": item.id, "data-name": item.groupname, className: "mui-table-view-cell mui-media"}, 
								React.createElement("span", {className: "structor-logo mui-media-object mui-icon clubfriends icon--guanli mui-pull-left"}), 
								React.createElement("div", {className: "mui-media-body"}, 
									item.groupname, 
									React.createElement("p", {className: "mui-ellipsis"}, item.membernum, "人")
								)
							)
						)
					}.bind(this))
						)
					:null, 
					this.props.current_selected>0?
						React.createElement("h3", null, "部门群组")
					:null, 
					this.props.employee_list.length>0?
						React.createElement("ul", {className: "employee_list mui-table-view mui-table-view-chevron"}, 
					this.props.employee_list.map(function(item, index){
						return (
							React.createElement("li", {"data-uid": item.userid, "data-avatar": item.user_avatar, "data-nick": item.user_name, className: "mui-table-view-cell mui-media"}, 
								React.createElement("img", {className: "mui-media-object mui-pull-left", src: item.user_avatar}), 
								React.createElement("div", {className: "mui-media-body"}, 
									item.user_name, 
									React.createElement("p", {className: "mui-ellipsis"}, item.user_phone)
								)
							)
						)
					}.bind(this))
						)
					:null
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
	  	employee_list: state.structor.employee_list,
	  	department_list: state.structor.department_list,
	  	selected_list: state.structor.selected_list,
	  	current_selected: state.structor.current_selected
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Structor);
})
