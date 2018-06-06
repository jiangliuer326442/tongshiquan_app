'use strict'

define(['react', "react-redux", 
	"components/reglog/thirdlogin",
	"config/index", 
	"actions/reglog",
	'css!./css/register'], function(React, ReactRedux, 
	ThirdLogin,
	config, 
	reglog){
	class Putcompany extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				picker: new mui.PopPicker(),
			}
		}
		
		componentWillMount(){
			document.addEventListener('show_putcompany', function(event){
				mui(this.refs.companyname_input).keyboard();
			}.bind(this));
			window.addEventListener('resize', function() {
				if(document.documentElement.clientHeight<500){
					if(mui(".reglogin .head").length>0){
						mui(".reglogin .head")[0].style.display = "none";
					}
				}else{
					if(mui(".reglogin .head").length>0){
						mui(".reglogin .head")[0].style.display = "block";
					}
				}
			}, false);
			if(mui.os.plus){
				plus.webview.currentWebview().setStyle({
					softinputMode: "adjustResize"
				});
			}
		}
		
		componentDidMount(){
			this.bindEvent();
			mui('.mui-input-row input').input();
		}
		
		componentWillUnmount(){
			this.state.picker.dispose();
		}
		
		bindEvent(){
			mui(".putcompanyname").on('tap','.btn', this.handleNext.bind(this));
		}
		
		handleNext(){
			if(!mui(this.refs.nextbtn).hasClass("btngray")){
				var inputElem = document.querySelector('input');
				inputElem.blur();
				var companyname = mui(this.refs.companyname_input)[0].value;
		  		if(companyname.length < 4){
		  			mui("#msg1")[0].innerHTML = "公司名称至少是4个汉字！";
		  			return;
		  		}else{
		  			var isChineseChar = function(str){
					   var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
					   return reg.test(str);
					}
		  			for(var i=0; i<companyname.length; i++){
						if (!isChineseChar(companyname[i])){
				  			mui("#msg1")[0].innerHTML = "公司名称至少是4个汉字！";
				  			return;
						}
		  			}
		  		}
				reglog.getcompanylist(companyname,this.props.dispatch, function(status, info, data){
					if(status != 200){
						mui("#msg1")[0].innerHTML = info;
					}else if(data.length == 1){
						this.nextView();
					}else{
						var arrays = new Array();
						for(var i=0; i<data.length; i++){
							arrays[i] = {};
							arrays[i].value = data[i].KeyNo;
							arrays[i].text = data[i].Name;
						}
						this.state.picker.setData(arrays); 
						this.state.picker.show(function(selectItems){
							reglog.setcompany(selectItems[0].value,this.props.dispatch);
							this.nextView();
						}.bind(this))
					}
				}.bind(this));
			}
		}
		
		nextView(){
			config.history.push("/reg/putphone");
		}
		
		handleChangeCompanynae(e){
			var companyname = e.target.value;
			if(companyname.length > 0){
				mui(this.refs.nextbtn).removeClass("btngray");	
			}else if(companyname.length == 0){
				mui(this.refs.nextbtn).addClass("btngray");	
			}
		}
		
		render() {
			return ( 
			 	<div className="reglogin putcompanyname">
		 			<div className="head">
		 				<img onClick={function(){mui.back()}} className="return" src="./js/containers/register/img/return.png" />
		 			</div>
			 		<h2 className="title">填写公司名称</h2>
			 		<p className="subtitle">尽量填写营业执照上的公司名称</p>
			 		<div className="inputbox">
			 			<div className="msg" id="msg1">填写公司名称</div>
			 			<div className="mui-input-row">
			 				<input className="mui-input-clear" ref="companyname_input" onChange={this.handleChangeCompanynae.bind(this)} type="search" placeholder="" />
			 			</div>
			 		</div>
			 		<button ref="nextbtn" className="btn btngray" type="mutton">下一步</button>
			    	<p>注册即表示同意<em>《卡拉布用户协议》</em></p>
			    	<ThirdLogin />
			    </div>
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {
	  	selected_company: state.reglog.selected_company,
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Putcompany);
})
