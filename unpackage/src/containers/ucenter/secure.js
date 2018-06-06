'use strict'

define(['react', "react-redux","components/header","config/index",
	"css!./css/settings"], function(React, ReactRedux, Header, config){
	class Secure extends React.Component {
		
		render() {
			return ( 
				<div id="secure" className="secure mui-page">
					<header className="mui-navbar-inner mui-bar mui-bar-nav">
						<h1 className="mui-title">
							安全和隐私
						</h1>
						<a className="mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"></a>
					</header>
					<div className="mui-page-content">
						<div className="mui-scroll-wrapper">
							<div className="mui-scroll">
								<ul className="mui-table-view mui-table-view-chevron">
									<li className="mui-table-view-cell">
										<a className="mui-navigate-right" href="#chgphone">更换手机号</a>
									</li>
									<li className="mui-table-view-cell">
										<a className="mui-navigate-right" href="#chgpasswd">修改密码</a>
									</li>
								</ul>
								<ul className="mui-table-view mui-table-view-chevron">
									<li className="mui-table-view-cell">
										<a className="mui-navigate-right" href="">不看Ta的动态</a>
									</li>
									<li className="mui-table-view-cell">
										<a className="mui-navigate-right" href="">不让Ta看我的动态</a>
									</li>
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
	  	uuid: state.myuser.uuid
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Secure);
});