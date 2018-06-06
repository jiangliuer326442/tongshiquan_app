'use strict'

define(['react', "react-redux","components/header","config/index",
	"actions/company",
	"actions/reglog",
	"css!./css/mycompany"], function(React, ReactRedux, Header, config,
		company,
		reglog){
	class Mycompany extends React.Component {
		
		componentDidMount(){
			var uid = this.props.uid;
			var token = this.props.token;
			var uuid = this.props.uuid;
			mui(".mycompany").on("tap",".leave",function(){
				mui.confirm("解除绑定后，您的账号将不属于该公司，是否继续？","提示", ["取消","确定"], function(e){
					if (e.index == 1) {
						company.unbind(uid, token, uuid, function(){
							reglog.logout(uid,token,uuid);
						});
					}
				});
			})
		}
		
		render() {
			return ( 
				<div id="mycompany" className="mycompany mui-page">
					<header className="mui-navbar-inner mui-bar mui-bar-nav">
						<h1 className="mui-title">
							公司信息
						</h1>
						<a className="mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"></a>
					</header>
					<div className="mui-page-content">
						<div className="mui-scroll-wrapper">
							<div className="mui-scroll">
								<ul className="mui-table-view mui-table-view-chevron">
									<li className="mui-table-view-cell">
										<a className="ckversion">名称<span className="mui-pull-right">{this.props.name}</span></a>
									</li>
									<li className="mui-table-view-cell">
										<a className="ckversion">编号<span className="mui-pull-right">{this.props.no}</span></a>
									</li>
									<li className="mui-table-view-cell">
										<a className="ckversion">法人<span className="mui-pull-right">{this.props.opername}</span></a>
									</li>
									<li className="mui-table-view-cell">
										<a className="ckversion">注册时间<span className="mui-pull-right">{this.props.startdate}</span></a>
									</li>
								</ul>
							{this.props.is_admin == 0 ? 
								<ul className="mui-table-view">
									<li className="mui-table-view-cell" style={{textAlign: "center"}}>
										<a className="leave">离开该公司</a>
									</li>
								</ul>
							:null}
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
		name: state.mycompany.name,
		no: state.mycompany.no,
		opername: state.mycompany.opername,
		startdate: state.mycompany.startdate,
		is_admin: state.myuser.is_admin
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Mycompany);
});