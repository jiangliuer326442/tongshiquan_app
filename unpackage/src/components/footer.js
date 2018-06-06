'use strict'

define(['react','css!./company/css/cmpfooter'], function(React){
	class Footer extends React.Component {
		
		render(){
			return (
				<nav className="mui-bar mui-bar-tab common_footer">
					{this.props.children}
				</nav>
			)
		}
	}
	
	return Footer;
})