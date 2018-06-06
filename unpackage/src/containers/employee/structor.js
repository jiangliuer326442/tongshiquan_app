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
				<div id="structor" className="structor mui-page">
					<header className="mui-navbar-inner mui-bar mui-bar-nav">
						<h1 className="mui-title">
							按组织架构查看
						</h1>
						<a className="mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"></a>
					</header>
					<div className="mui-page-content">
						<div className="structor_line">
					{this.props.selected_list.map(function(item, index){
						return (
							<span>
								<a className={item.id==this.props.current_selected?"active":""} data-id={item.id} href="">{item.name}</a>
								{index+1<this.props.selected_list.length?
									<span>&gt;</span>
								:null}
							</span>
						)
					}.bind(this))}
						</div>
					{this.props.department_list.length>0?
						<ul className="department_list mui-table-view mui-table-view-chevron">
					{this.props.department_list.map(function(item, index){
						return (
							<li data-id={item.id} data-name={item.groupname}  className="mui-table-view-cell mui-media">
								<span className="structor-logo mui-media-object mui-icon clubfriends icon--guanli mui-pull-left"></span>
								<div className="mui-media-body">
									{item.groupname}
									<p className='mui-ellipsis'>{item.membernum}人</p>
								</div>
							</li>
						)
					}.bind(this))}
						</ul>
					:null}
					{this.props.current_selected>0?
						<h3>部门群组</h3>
					:null}
					{this.props.employee_list.length>0?
						<ul className="employee_list mui-table-view mui-table-view-chevron">
					{this.props.employee_list.map(function(item, index){
						return (
							<li data-uid={item.userid} data-avatar={item.user_avatar} data-nick={item.user_name} className="mui-table-view-cell mui-media">
								<img className="mui-media-object mui-pull-left" src={item.user_avatar} />
								<div className="mui-media-body">
									{item.user_name}
									<p className='mui-ellipsis'>{item.user_phone}</p>
								</div>
							</li>
						)
					}.bind(this))}
						</ul>
					:null}
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
	  	employee_list: state.structor.employee_list,
	  	department_list: state.structor.department_list,
	  	selected_list: state.structor.selected_list,
	  	current_selected: state.structor.current_selected
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Structor);
})
