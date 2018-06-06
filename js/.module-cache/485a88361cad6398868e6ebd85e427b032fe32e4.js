'use strict'

define(['react'], function(React){
	class ChgPasswd extends React.Component {
		render(){
			return (
				React.createElement("div", {id: "chgpasswd", className: "chgpasswd mui-page"}
				)
			)
		}
	}
	
	return ChgPasswd;
});