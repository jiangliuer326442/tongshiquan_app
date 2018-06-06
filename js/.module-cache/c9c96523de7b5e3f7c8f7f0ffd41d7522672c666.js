'use strict'

define(['react', "react-redux","components/header",
	"actions/user"], function(React, ReactRedux, Header,
	user){
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