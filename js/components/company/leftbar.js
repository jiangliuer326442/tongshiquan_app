'use strict'

define(['react', "mui","actions/common","config/index",'css!./css/leftnav'], function(React, mui, common, config){
	class LeftNav extends React.Component {
		componentDidMount(){
			mui(".company").on('tap','.cmp_leftnav', this.hide); 
		}
		
		hide(event){
			if(common.hasClass(event.target, "cmp_leftnav")){
				if(!common.hasClass(mui(".cmp_leftnav .left")[0], "hide")){
					common.addClass(mui(".cmp_leftnav .left")[0], "hide");
					setTimeout(function(){
						mui(".cmp_leftnav")[0].style.display = "none";
						common.removeClass(mui(".cmp_leftnav .left")[0], "hide");
					} ,400);
				}
			}
		}
		
		render(){
			return (
				React.createElement("div", {className: "cmp_leftnav"}, 
					React.createElement("div", {className: "left"}, 
						React.createElement("img", {className: "avatar", src: this.props.avatar})
					)
				)
			)
		}
	}
	
	return LeftNav;
})