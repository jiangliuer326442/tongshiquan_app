'use strict'

define(['react', 'react-redux', "config/index", 'css!./css/guide'], function(React, ReactRedux, config){
	class Guide extends React.Component {
		componentWillMount(){
			mui.back = function(){
				plus.runtime.quit();
			}
		}
		
		componentDidMount(){
			mui(".mui-slider").slider();
			document.querySelector('.mui-slider').addEventListener('slide', function(event) {
			 	//注意slideNumber是从0开始的；
			 	var index = event.detail.slideNumber+1;
			 	if(index == 4){
			 		mui.setItem("lauchFlag", "1");
			 		mui.later(function(){
			 			config.history.push("/reg/putcompany");
			 		}, 1000)
			 	}
			});
		}
		
		render(){
			return (
				<div className="guide mui-slider">
				  <div className="mui-slider-group">
				    <div className="mui-slider-item"></div>
					<div className="mui-slider-item"></div>
					<div className="mui-slider-item"></div>
					<div className="mui-slider-item"></div>
				  </div>
				</div>
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {

	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Guide);
})