'use strict'

define(['react', "react-redux",'css!./css/cmpheader'], function(React, ReactRedux){
	class Header extends React.Component {
		render(){
			return (
				React.createElement("div", {className: "header"+(this.props.direction==1?" hide":"")+(this.props.direction==-1?" show":"")}, 
					this.props.children
				)
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {
	  	direction: state.nav.direct,
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Header);
})