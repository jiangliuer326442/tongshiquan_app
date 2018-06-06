'use strict'

define(['react', "react-redux","components/header",
	"actions/cmpdiscuz",
	"css!./css/createbar"], function(React, ReactRedux, Header,
		cmpdiscuz){
	class DiscuzCreateBar extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				logo: ""
			};
		}
		
		componentDidMount(){
			mui(".create_bar").on('tap', ".logo", this.uploadLogo.bind(this));
			mui(".create_bar").on('tap', ".addpostbar-triggler", this.handleSubmit.bind(this));
		}
		
		handleSubmit(){
			var title = mui(this.refs.title)[0].value;
			if(title == ""){
				mui.toast("贴吧名称必填");
				return;
			}
			var logo = this.state.logo;
			if(logo == ""){
				mui.toast("贴吧图标未上传");
				return;
			}
			var desc = mui(this.refs.desc)[0].value;
			if(desc == ""){
				mui.toast("请填写贴吧的描述内容");
				return;
			}
			cmpdiscuz.addpostbar(this.props.uid, this.props.token, this.props.uuid, title, logo, desc, function(status, info){
				mui.toast(info, {
					duration: "long"
				});
				if(status == 200){
					mui.fire(plus.webview.currentWebview().opener(), 'getpostbars', {
						companyid: this.props.companyid
					});
					mui.later(function(){
						mui.back();
					}, 1000);
				}else if(status == 2000){
					mui.back();
				}
			})
		}
		
		uploadLogo(){
			plus.gallery.pick(function(path){
				cmpdiscuz.addpostbarimg(this.props.uid, this.props.token, this.props.uuid, path, function(imgpath){
					this.state.logo = imgpath;
				}.bind(this))
				mui(".logo img")[0].setAttribute("src", path);
			}.bind(this), function(err) {}, {
				system: false
			});
		}
		
		render() {
			return ( 
				React.createElement("div", {className: "create_bar"}, 
					React.createElement(Header, null, 
						React.createElement("h1", {className: "mui-title"}, 
							"创建贴吧"
						), 
						React.createElement("a", {className: "mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"}), 
						React.createElement("button", {type: "button", className: "addpostbar-triggler mui-btn mui-btn-primary  mui-pull-right"}, "创建")
					), 
					React.createElement("div", {className: "mui-content"}, 
						React.createElement("p", null, "贴吧名称"), 
						React.createElement("div", {className: "row mui-input-row"}, 
							React.createElement("input", {type: "text", ref: "title", placeholder: "4到6个汉字"})
						), 
					    React.createElement("div", {className: "mui-input-row logo"}, 
					        React.createElement("p", null, "图标"), 
					        React.createElement("span", {className: "image-box"}, 
					        	React.createElement("img", {src: "./js/containers/discuz/img/iconfont-tianjia.png"})
					        )
					    ), 
					    React.createElement("p", null, "贴吧描述"), 
					    React.createElement("div", {className: "row mui-input-row desc"}, 
							React.createElement("textarea", {ref: "desc", placeholder: "简要描述一下创建贴吧主题的描述"})
					    )
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
	  	companyid: state.myuser.companyid
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(DiscuzCreateBar);
})