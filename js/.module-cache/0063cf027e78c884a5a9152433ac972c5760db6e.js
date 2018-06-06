'use strict'

define(['react', "react-redux","components/header",
	"actions/company"], function(React, ReactRedux, Header,
	company){
	class CmpHeader extends React.Component {
		componentDidMount(){
			var companyid = this.props.companyid;
			var uid = this.props.uid;
			var token = this.props.token;
			var uuid = this.props.uuid;
			var dispatch = this.props.dispatch;
			//获取企业信息
			company.getinfo(companyid, uid, token, uuid, dispatch);
		}
		
		render(){
			return (
				React.createElement(Header, null, 
					React.createElement("a", {className: "mui-icon mui-icon-extra mui-icon-extra-notice mui-pull-left"}), 
					React.createElement("h1", {className: "mui-title"}, 
						this.props.companyname
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
	  	companylogo: state.mycompany.logo,
	  	companyname: state.mycompany.name,
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(CmpHeader);
})