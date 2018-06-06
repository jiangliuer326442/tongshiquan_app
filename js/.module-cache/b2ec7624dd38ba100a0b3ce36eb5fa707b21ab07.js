'use strict'

define(['react', "react-redux","components/common/img","config/index",
	'actions/cmpdiscuz',
	'jquery',
	'css!./css/postbars'], function(React, ReactRedux, Img, config,
		cmpdiscuz,
		jQuery){
	class PostBars extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				createbar_detail: null,
			};
		}
		
		componentWillMount(){
			document.addEventListener('getpostbars', function(event){
				var companyid = event.detail.companyid;
				cmpdiscuz.getpostbars(companyid, this.props.dispatch, function(){
					mui(".discuz_postbars").on('tap','.commonbar', this.enterBar.bind(this));
					mui(".discuz_postbars").on('tap','.createbar', this.createBar.bind(this));
				}.bind(this));
			}.bind(this));
		}
		
		componentDidMount(){
			mui(".company").on('tap','.discuz_postbars', function(){
				if(mui(event.target).hasClass("discuz_postbars")){
					this.hide();
				}
			}.bind(this));
			mui.fire(plus.webview.currentWebview(), 'getpostbars', {
				companyid: this.props.companyid
			});
			this.state.createbar_detail = mui.preload({
				url: 'index.html#/discuz/createbar',
				id: 'postbar_create',
			});
		}
		
		createBar(){
			var that = this;
			setTimeout(function () {
				that.hide();
				that.state.createbar_detail.show("slide-in-right", 300);
			},150);
		}
		
		enterBar(event){
			var obj;
			if(mui(event.target.parentNode).hasClass("commonbar")){
				obj = event.target.parentNode;
			}else{
				obj = event.target.parentNode.parentNode;
			}
			var index = obj.getAttribute("data-index");
			cmpdiscuz.getsectionposts(this.props.companyid, this.props.list[index].id, 1, 10, this.props.dispatch, function(status, info, data){
				mui('#refreshContainer').pullRefresh().refresh(true);
	      		if(mui.os.plus){
	      			mui("#refreshContainer").pullRefresh().endPulldown(data.length==0?true:false);
	      		}else{
	      			mui("#refreshContainer .mui-pull-top-pocket").removeClass("mui-visibility");
	      		}
				cmpdiscuz.setpostbar(index, jQuery(obj).find("img").attr("src"), this.props.dispatch)
				this.hide();
			}.bind(this));
		}
		
		hide(event){
			mui(".discuz_postbars .bars").removeClass("show")
			mui(".discuz_postbars .bars").addClass("show")
			mui.later(function(){
				mui(".discuz_postbars")[0].style.visibility = "hidden";
			},300);
		}
		
		render(){
			return (
				React.createElement("div", {className: "discuz_postbars"}, 
					React.createElement("div", {className: "bars"}, 
			
				this.props.list.map(function(item, index){
					return (
						React.createElement("div", {"data-index": index, className: "bar commonbar"}, 
							React.createElement("div", {className: "banner"}, 
								React.createElement(Img, {src: item.logo, placeholder: "./js/containers/img/60x60.gif", folder: "postbar"})
							), 
							React.createElement("div", {className: "context"}, 
								item.name
							)
						)
					)
				}.bind(this)), 
			
						React.createElement("div", {className: "bar createbar"}, 
							React.createElement("div", {className: "banner addpost"}
							), 
							React.createElement("div", {className: "context"}, 
								"创建贴吧"
							)
						)
					)
				)
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {
		list: state.cmpdiscuz.postbars
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(PostBars);
})