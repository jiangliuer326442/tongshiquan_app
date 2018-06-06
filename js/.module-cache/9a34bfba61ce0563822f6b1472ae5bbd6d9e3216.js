'use strict'

define(['react', "react-redux", "config/index",
	"components/company/cmpheader",
	"components/common/img",
	"actions/company",
	"actions/cmpnotice",
	"actions/version",
	'css!./css/company'], function(React, ReactRedux, config,
		CmpHeader,
		Img,
		company,
		cmpnotice,
		version){
	
	class Company extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				article_detail: null
			};
		}

		componentWillMount(){
			//预加载详情页
			this.state.article_detail = mui.preload({
				url: 'index.html#/article',
				id: 'detail_article',
			});
			
			document.addEventListener('onShow', function(){
				mui.fire(plus.webview.getWebviewById("detail_article"), "jump", {
					url: "/article"
				});
			});
			
			document.addEventListener('refresh', function(event){
				var companyid = event.detail.companyid;
				var dispatch = this.props.dispatch;
				cmpnotice.getfarticle(companyid, dispatch);
				cmpnotice.getoarticle(companyid, this.props.onotice_size, dispatch, function(){
					mui(".company>.othernotice>.tab_box").off('tap','li').on('tap','li', function(){
						var index = this.getAttribute("data-index");
						cmpnotice.setsltmodle(index, dispatch);
					});
					if(mui.os.plus){
						plus.navigator.closeSplashscreen();
					}
				})
			}.bind(this));
		}
		
		componentDidMount(){
			mui.fire(plus.webview.currentWebview(), 'refresh', {
				companyid: this.props.params.companyid,
			});
			
			//通知管理
			if(mui.os.android){
var main = plus.android.runtimeMainActivity(); //获取activity
var Intent = plus.android.importClass('android.content.Intent');
var Settings = plus.android.importClass('android.provider.Settings');
var intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);//可设置表中所有Action字段
main.startActivity(intent);
			}
			
			//检查版本更新
			if(mui.network_flg() && (!mui.getItem("last_ckversion_time") || (mui.getItem("last_ckversion_time")<(Date.parse(new Date())-24*3600*1000)))){
				mui.later(function(){
					version.ckversion();
				}, 5000);
				mui.setItem("last_ckversion_time", Date.parse(new Date()));
			}
		}
		
		jumpArticle(articleid, articletitle, thumb, desc){
			mui.fire(this.state.article_detail, 'get_detail', {
				companyid: this.props.params.companyid,
				postid: articleid,
				title: articletitle,
				thumb: 'http:'+thumb,
				desc: desc
			});
			setTimeout(function() {
				this.state.article_detail.show("slide-in-right", 300);
			}.bind(this),300);
		}
		
		render() {
			return ( 
				React.createElement("div", {className: "company"}, 
					React.createElement(CmpHeader, {companyid: this.props.params.companyid}), 
					React.createElement("div", {className: "farticle"}, 
			this.props.fnotice_list.map(function(item, index){
				return (
					item.thumb.length>10 ?
						React.createElement("div", {onClick: this.jumpArticle.bind(this, item.id, item.title, item.thumb, item.desc), className: "article_with_thumb"}, 
							React.createElement("div", {className: "title"}, item.title.substring(0,20)), 
							React.createElement("div", {className: "thumb"}, 
								React.createElement(Img, {src: "http:"+item.thumb, folder: "notice", placeholder: "./js/containers/img/120_90.png"})
							)
						)
					:
						React.createElement("div", {onClick: this.jumpArticle.bind(this, item.id, item.title, "", item.desc), className: "article_without_thumb"}, 
							React.createElement("div", {className: "title"}, item.title.substring(0,20)), 
							React.createElement("p", {className: "desc"}, 
								item.desc
							)
						)
				)
			}.bind(this))
					), 
					React.createElement("div", {className: "othernotice"}, 
						React.createElement("ul", {className: "tab_box"}, 
				
					this.props.onotice_list.map(function(item, index){
						return (
							React.createElement("li", {"data-index": index, className: this.props.onotice_selected==index?"current":""}, item.name)
						)
					}.bind(this))
				
						), 
						React.createElement("div", {className: "articlelist"}, 
				this.props.onotice_list.length>0?
					this.props.onotice_list[this.props.onotice_selected].list.map(function(item, index){
						return (
							React.createElement("div", {onClick: this.jumpArticle.bind(this, item.id, item.title, item.thumb, item.desc), className: "article"}, 
								React.createElement("div", {className: "thumb"}, 
									React.createElement("img", {src: "http:"+item.thumb})
								), 
								React.createElement("div", {className: "texts"}, 
									React.createElement("h3", null, 
										React.createElement("a", null, item.title)
									), 
									React.createElement("article", null, 
										item.desc
									)
								)
							)
						)
					}.bind(this))
				:null
						)
					)
				)
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {
	  	fnotice_list: state.cmpnotice.fmodel.list,
	  	onotice_size: state.cmpnotice.size,
	  	onotice_list: state.cmpnotice.omodel,
	  	onotice_selected: state.cmpnotice.selected
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Company);
})