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
				<div id="articlelist" className="articlelist mui-page">
					<header className="mui-navbar-inner mui-bar mui-bar-nav">
						<h1 className="mui-title">
							文章列表
						</h1>
						<a className="mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"></a>
					</header>
					<div className="mui-page-content">
						<div className="mui-scroll-wrapper">
							<div className="mui-scroll">
								<ul className="mui-table-view mui-table-view-chevron">
								{this.props.list.map(function(item, index){
									return (
									<li data-id={item.id} className="mui-table-view-cell">
										<div className="mui-slider-right mui-disabled">
											<a className="mui-btn mui-btn-red">删除</a>
										</div>
										<div className="mui-slider-handle mui-table">
											{item.title}
										</div>
									</li>
									)
								}.bind(this))}
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
	  	list: state.admin.article_list
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(ArticleList);
})