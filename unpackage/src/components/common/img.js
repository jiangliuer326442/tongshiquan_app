'use strict'

define(['./lazyload','react',"css!./css/img"], function(lazyload, React){
	class Img extends React.Component {
		render(){
			var cb = this.props.cb;
			if(typeof(cb)!='function'){
				cb = function(){}
			}
			var myclass = this.props.class;
			if(typeof(myclass)!='string'){
				myclass = "";
			}
			return (
				<img className={myclass} src={this.props.placeholder} data-lazyload={this.props.src} data-folder={this.props.folder}  onLoad={function(event){
					lazyload(event.target, cb);
				}} />
			)
		}
	}
	
	return Img;
})