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
				<div id="noticemodel" className="noticemodel mui-page">
					<header className="mui-navbar-inner mui-bar mui-bar-nav">
						<h1 className="mui-title">
							企业通知
						</h1>
						<a className="mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"></a>
					</header>
					<div className="mui-page-content">
						<div className="mui-scroll-wrapper">
							<div className="mui-scroll">
								<ul className="mui-table-view mui-table-view-chevron">
									<li className="createmodel mui-table-view-cell"><a href="#createarticle">新增模块</a>
									</li>
								</ul>
								<ul className="mui-table-view mui-table-view-chevron">
							{this.props.list.map(function(item, index){
								return (
									<li className="mui-table-view-cell mui-collapse">
										<a className="mui-navigate-right">{item.name}</a>
										<ul className="mui-table-view mui-table-view-chevron">
											<li data-id={item.id} className="createarticle mui-table-view-cell"><a href="#createarticle">发布文章</a>
											</li>
											<li data-id={item.id} className="listarticle mui-table-view-cell"><a href="#articlelist">文章列表</a>
											</li>
										</ul>
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
	  	list: state.admin.model_list,
	  	admin_flg: state.admin.admin_flg,
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(NoticeModel);
});