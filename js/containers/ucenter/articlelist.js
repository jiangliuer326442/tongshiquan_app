'use strict'

define(['react', "react-redux","components/header","actions/admin"], function(React, ReactRedux, Header, admin){
	class ArticleList extends React.Component {
		componentDidMount(){
			var that = this;
			mui('.articlelist').on('tap', '.mui-btn', function(event) {
				var elem = this;
				var li = elem.parentNode.parentNode;
				mui.confirm("确定要删除这篇文章吗？","提示", ["取消","确定"], function(e){
					if (e.index == 1) {
						var aid = li.getAttribute("data-id");
						li.parentNode.removeChild(li);
						admin.delarticle(that.props.uid, that.props.token, that.props.uuid, aid, that.props.dispatch, function(){
					    	mui.fire(plus.webview.getLaunchWebview(), "refresh", {
					    		companyid: this.props.companyid
					    	})
						});
					}
				});;
			});
		}
		
		render() {
			return ( 
				React.createElement("div", {id: "articlelist", className: "articlelist mui-page"}, 
					React.createElement("header", {className: "mui-navbar-inner mui-bar mui-bar-nav"}, 
						React.createElement("h1", {className: "mui-title"}, 
							"文章列表"
						), 
						React.createElement("a", {className: "mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"})
					), 
					React.createElement("div", {className: "mui-page-content"}, 
						React.createElement("div", {className: "mui-scroll-wrapper"}, 
							React.createElement("div", {className: "mui-scroll"}, 
								React.createElement("ul", {className: "mui-table-view mui-table-view-chevron"}, 
								this.props.list.map(function(item, index){
									return (
									React.createElement("li", {"data-id": item.id, className: "mui-table-view-cell"}, 
										React.createElement("div", {className: "mui-slider-right mui-disabled"}, 
											React.createElement("a", {className: "mui-btn mui-btn-red"}, "删除")
										), 
										React.createElement("div", {className: "mui-slider-handle mui-table"}, 
											item.title
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
	  	list: state.admin.article_list
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(ArticleList);
})