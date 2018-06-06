'use strict'

define(['react','css!./company/css/cmpheader'], function(React){
	class Header extends React.Component {
		render(){
			return (
				<header className="mui-bar mui-bar-nav">
					{this.props.children}
				</header>
			)
		}
	}
	
	return Header;
})