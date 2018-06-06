'use strict'

define(['react', "react-redux","components/header",
	"components/common/img",
	"containers/club/friends",
	"containers/employee/structor",
	"actions/socket",
	"actions/reglog",
	'css!./css/chat'], function(React, ReactRedux, Header,
	Img,
	Friends,
	Structor,
	socketio,
	reglog){
	class Recent extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				chat_detail: null,
				talk_uid: 0
			};
		}
		
		componentWillMount(){
			//链接服务器
			socketio.connect(this.props.uid, this.props.token, this.props.uuid, this.props.dispatch, function(err, userinfo){

			});
			//处理点击通知的事件
			mui.os.plus && plus.push.addEventListener( "click", function ( msg ) {
				if(plus.navigator.isBackground()){
					return;
				}
				var payload = JSON.parse(msg.payload);
				if(payload.type == "chat"){
					var from = payload.from;
					for(var i=0; i<this.props.list.length; i++){
						if(this.props.list[i].touid == from){
							var chater = this.props.list[i];
							//打开聊天详情页
							this.openChatBox(chater.touid, chater.username, chater.avatar);
							break;
						}
					}
				}
			}.bind(this), false ); 
			//处理新消息
			socketio.socket.on('newMsg', function(content, from, content_type){
				socketio.getrecentchat(this.props.uid, this.props.token, this.props.uuid, 1, this.props.pnum, this.props.dispatch, function(status, info, data){
		      		this.bindEvent();
		      		
					//正在和收到这个消息的人聊天，就刷新最新消息
		      		if(plus.webview.getTopWebview().getURL().split("#")[1] == "/chat/detail" && this.state.talk_uid == from){
						mui.fire(this.state.chat_detail, 'get_chatlog', {
							talk_uid: from,
							talk_avatar: data[0].avatar,
							talk_nick: data[0].username,
						});
		      		}else{
		      			//否则，进行消息通知
						for(var i=0; i<this.props.list.length; i++){
							if(this.props.list[i].touid == from){
								var chater = this.props.list[i];
					      		var content = "";
					      		if(chater.content_type=="文字"){
					      			content = chater.content;
					      		}else if(chater.content_type=="语音"){
					      			content = "[收到一条语音]";
					      		}else{
					      			content = "[收到一条图片]";
					      		}
								plus.push.createMessage( content, '{"type": "chat","from": '+from+'}', {
									title: chater.username,
									cover: true
								} );
								plus.device.beep(1);
								break;
							}
						}
		      		}
				}.bind(this));
			}.bind(this));

			document.addEventListener('postMsg', function(event){
				var touid = event.detail.touid;
				var content = event.detail.content;
				var content_type = event.detail.content_type;
				socketio.socket.emit('postMsg', parseInt(touid), parseInt(this.props.uid), content, content_type);
			}.bind(this));
			
			document.addEventListener('getrecentchat', function(event){
				var uid = event.detail.uid;
				var token = event.detail.token;
				var uuid = event.detail.uuid;
				socketio.getrecentchat(uid, token, uuid, 1, this.props.pnum, this.props.dispatch, function(){
					
				});
			}.bind(this));
			
			this.prevLoad();
		}
		
		prevLoad(){
			//预加载详情页
			this.state.chat_detail = mui.preload({
				url: 'index.html#/chat/detail',
				id: 'detail_chat',
			    subpages:[{
					url: 'index.html#/chat/box',
					id: 'chat_box',
			      	styles:{
			        	top:48,//内容页面顶部位置,需根据实际页面布局计算，若使用标准mui导航，顶部默认为48px；
			      		bottom: 50
			      	}
			    }]
			});
		}
		
		pullRefresh(){
			socketio.getrecentchat(this.props.uid, this.props.token, this.props.uuid, 1, 20, this.props.dispatch, function(status, info ,data){
	      		this.bindEvent();
				var viewApi = mui('#chatbox').view({
					defaultPage: '#chat'
				});
				var view = viewApi.view;
				//监听页面切换事件方案1,通过view元素监听所有页面切换事件，目前提供pageBeforeShow|pageShow|pageBeforeBack|pageBack四种事件(before事件为动画开始前触发)
				//第一个参数为事件名称，第二个参数为事件回调，其中e.detail.page为当前页面的html对象
				view.addEventListener('pageBeforeShow', function(e) {
					//				console.log(e.detail.page.id + ' beforeShow');
				});
				view.addEventListener('pageShow', function(e) {
					//				console.log(e.detail.page.id + ' show');
				});
				view.addEventListener('pageBeforeBack', function(e) {
					//				console.log(e.detail.page.id + ' beforeBack');
				});
				view.addEventListener('pageBack', function(e) {
					//				console.log(e.detail.page.id + ' back');
				});
				
				mui.back = function() {
					if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
						viewApi.back();
					} else { //执行webview后退
						reglog.quit();
					}
				};
			}.bind(this));
		}
		
		componentDidMount(){
			this.pullRefresh();
		}
		
		bindEvent(){
			var that = this;
			mui("#refreshContainer").off("tap", "li").on('tap','li',function() {
				var uid = this.getAttribute("data-uid");
				var avatar = this.getAttribute("data-avatar");
				var nick = this.getAttribute("data-nick");
				that.onEmployeeDetail(uid, avatar, nick);
			});
			mui('#refreshContainer').off("tap", ".mui-btn").on('tap', '.mui-btn', function(event) {
				var elem = this;
				var li = elem.parentNode.parentNode;
				li.parentNode.removeChild(li);
				socketio.rmrecentchat(that.props.uid, that.props.token, that.props.uuid, li.getAttribute("data-uid"));
			});
			mui("#topPopover").on('tap','.myfriends',function() {
				mui.later(function(){
					var list2 = document.getElementById('list');
					//calc hieght
					list2.style.height = (document.documentElement.clientHeight - 50) + 'px';
					//create
					window.indexedList = new mui.IndexedList(list2);	
				}, 700);
				mui('#topPopover').popover('hide');
			});
			mui("#topPopover").on('tap','.structor',function(){
				mui('#topPopover').popover('hide');
			});
		}
		
		onEmployeeDetail(uid,avatar,nick){
			this.state.talk_uid = uid;
			mui.fire(plus.webview.getWebviewById("detail_chat"), 'get_chatlog', {
				talk_uid: uid,
				talk_avatar:avatar,
				talk_nick: nick,
			});
			setTimeout(function () {
				plus.webview.getWebviewById("detail_chat").show();
			},150);
		}
		
		render() {
			return ( 
				React.createElement("div", {className: "mui-fullscreen"}, 
					React.createElement("div", {id: "chatbox", className: "mui-views"}, 
						React.createElement("div", {className: "mui-view"}, 
							React.createElement("div", {className: "mui-navbar"}
							), 
							React.createElement("div", {className: "mui-pages"}
							)
						)
					), 
					React.createElement(Friends, {onEmployeeDetail: function(uid,avatar,nick){this.onEmployeeDetail(uid,avatar,nick)}.bind(this)}), 
					React.createElement(Structor, {onEmployeeDetail: function(uid,avatar,nick){this.onEmployeeDetail(uid,avatar,nick)}.bind(this)}), 
					React.createElement("div", {id: "chat", className: "chat mui-page"}, 
						React.createElement("header", {className: "mui-navbar-inner mui-bar mui-bar-nav"}, 
							React.createElement("h1", {className: "mui-title"}, 
								"聊天"
							), 
							React.createElement("a", {className: "mui-action-menu mui-icon mui-icon-plusempty mui-pull-right", href: "#topPopover"})
						), 
						React.createElement("div", {className: "mui-page-content"}, 
							React.createElement("div", {id: "refreshContainer", className: "recentchats mui-scroll-wrapper"}, 
								React.createElement("div", {className: "mui-scroll"}), 
								React.createElement("ul", {className: "mui-table-view mui-table-view-chevron"}, 
						this.props.list.map(function(chater,index){
							return (
									React.createElement("li", {"data-uid": chater.touid, "data-avatar": chater.avatar, "data-nick": chater.username, className: "mui-table-view-cell mui-media", style: {paddingRight: "0px"}}, 
										React.createElement("div", {className: "mui-slider-right mui-disabled"}, 
											React.createElement("a", {className: "mui-btn mui-btn-red"}, "删除")
										), 
										React.createElement("div", {className: "mui-slider-handle mui-table"}, 
											React.createElement("div", {className: "mui-table-cell mui-navigate-right"}, 
												React.createElement(Img, {class: "mui-media-object mui-pull-left", src: chater.avatar, placeholder: "./js/containers/img/60x60.gif", folder: "avatar"}), 
												React.createElement("div", {className: "mui-media-body"}, 
													chater.username, 
												chater.content_type=="文字"?
												React.createElement("p", {className: "mui-ellipsis"}, chater.content)
												:(chater.content_type=="语音"?
													React.createElement("p", {className: "mui-ellipsis"}, "[收到一条语音]"):
													React.createElement("p", {className: "mui-ellipsis"}, "[收到一张图片]")
												)
												)
											)
										)
									)
							)
						}.bind(this))
								)
							), 
							React.createElement("div", {id: "topPopover", className: "mui-popover"}, 
								React.createElement("ul", {className: "mui-table-view"}, 
									React.createElement("li", {className: "buildchat mui-table-view-cell myfriends"}, 
										React.createElement("a", {href: "#friends"}, "我的好友")
									), 
									React.createElement("li", {className: "buildchat mui-table-view-cell structor"}, 
										React.createElement("a", {href: "#structor"}, "组织架构")
									)
								)
							)
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
	  	pnum: state.chat.chat_pnum,
	  	list: state.chat.recent_list,
	  	companyid: state.myuser.companyid
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Recent);
})