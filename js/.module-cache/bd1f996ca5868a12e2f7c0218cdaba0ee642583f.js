'use strict'

define(['react', "react-redux","components/header","actions/admin"], function(React, ReactRedux, Header, admin){
	class NoticeModel extends React.Component {	
		componentDidMount(){
			mui(".noticemodel").on("tap",".createarticle",this.getsectiondetail.bind(this));
			mui(".noticemodel").on("tap",".listarticle",this.getsectionarticles.bind(this));
		}
		
		getsectionarticles(event){
			admin.getsectionarticles(this.props.uid, this.props.token, this.props.uuid, this.props.dispatch, event.target.parentNode.getAttribute("data-id"))
		}
		
		getsectiondetail(event){
			admin.getsectiondetail(this.props.uid, this.props.token, this.props.uuid, this.props.dispatch, event.target.parentNode.getAttribute("data-id"))
		}
		
		render() {
			return ( 
				React.createElement("div", {id: "noticemodel", className: "noticemodel mui-page"}, 
					React.createElement("header", {className: "mui-navbar-inner mui-bar mui-bar-nav"}, 
						React.createElement("h1", {className: "mui-title"}, 
							"企业通知"
						), 
						React.createElement("a", {className: "mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"})
					), 
					React.createElement("div", {className: "mui-page-content"}, 
						React.createElement("div", {className: "mui-scroll-wrapper"}, 
							React.createElement("div", {className: "mui-scroll"}, 
								React.createElement("ul", {className: "mui-table-view mui-table-view-chevron"}, 
									React.createElement("li", {className: "createmodel mui-table-view-cell"}, React.createElement("a", {href: "#createarticle"}, "新增模块")
									)
								), 
								React.createElement("ul", {className: "mui-table-view mui-table-view-chevron"}, 
							this.props.list.map(function(item, index){
								return (
									React.createElement("li", {className: "mui-table-view-cell mui-collapse"}, 
										React.createElement("a", {className: "mui-navigate-right"}, item.name), 
										React.createElement("ul", {className: "mui-table-view mui-table-view-chevron"}, 
											React.createElement("li", {"data-id": item.id, className: "createarticle mui-table-view-cell"}, React.createElement("a", {href: "#createarticle"}, "发布文章")
											), 
											React.createElement("li", {"data-id": item.id, className: "listarticle mui-table-view-cell"}, React.createElement("a", {href: "#articlelist"}, "文章列表")
											)
										)
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
	  	list: state.admin.model_list,
	  	admin_flg: state.admin.admin_flg,
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(NoticeModel);
});