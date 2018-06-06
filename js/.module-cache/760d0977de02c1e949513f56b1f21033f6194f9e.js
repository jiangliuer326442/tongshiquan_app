'use strict'

var page = 1;

define(['react', "react-redux", 
	"components/common/img",
	'actions/socket', 
	"jquery", 
	"css!./css/chatbox"], function(React, ReactRedux, 
		Img,
		socketio, 
		JQuery){
	class ChatBox extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				talk_uid: 0,
				talk_avatar: "",
				talk_nick: "",
				refresh_flg: false
			};
		}
		
		componentWillMount(){
			document.addEventListener('append_chat', function(event){
				var content = event.detail.content;
				var content_type = event.detail.content_type;
				this.props.dispatch({
					type: socketio.ADDCHAT,
					fuid: this.props.uid,
					content_type: content_type,
					content: content,
				})
				this.bindMsgList();
				if(content_type=="图片"){
					mui.later(function(){
						this.state.ui.areaMsgList.style.transform="translate3d(0px, -"+(this.state.ui.areaMsgList.scrollHeight - document.documentElement.clientHeight)+"px, 0px)";
					}.bind(this), 2000);
				}else{
					this.state.ui.areaMsgList.style.transform="translate3d(0px, -"+(this.state.ui.areaMsgList.scrollHeight - document.documentElement.clientHeight)+"px, 0px)";
				}
				this.bindPreviewImg();
				/**
				mui(".mui-table-view")[0].lastChild.append(""+
					"<dd class=\"mui-table-view-cell msg-item msg-item-self\" data-msg-type=\"图片\" data-msg-content=\"http://static.companyclub.cn/chat_20171226110601174.jpg\">"+
						"<i class=\"msg-user mui-icon mui-icon-person\"></i>"+
						"<div class=\"msg-content\">"+
							"<div class=\"msg-content-inner\">"+
								"<img src=\"./js/containers/img/120_90.png\" data-lazyload=\"http://static.companyclub.cn/chat_20171226110601174.jpg\" data-folder=\"chat\" />"+
							"</div>"+
							"<div class=\"msg-content-arrow\"></div>"+
						"</div>"+
						"<div class=\"mui-item-clear\"></div>"+
					"</dd>");
				**/
			}.bind(this));
			document.addEventListener('get_chatlog2', function(event){
				var uid = event.detail.talk_uid;
				var avatar = event.detail.talk_avatar;
				var nick = event.detail.talk_nick;
				this.setState({
					talk_uid: uid,
					talk_avatar: avatar,
					talk_nick: nick,
				});
				page = 1;
				this.getchatlog(function(){
					this.bindMsgList();
					mui.later(function(){
						this.state.ui.areaMsgList.style.transform="translate3d(0px, -"+(this.state.ui.areaMsgList.scrollHeight - document.documentElement.clientHeight)+"px, 0px)";
					}.bind(this), 2000);
					this.bindPreviewImg();
				}.bind(this));
			}.bind(this));
		}
		
		componentDidMount(){
			/**
			var uid = 5;
			var avatar = "http://cdn.companyclub.cn/tongshiquan/avatar/905944f9.gif";
			var nick = "15216669259";
			this.state.talk_uid = uid;
			this.state.talk_avatar = avatar;
			this.state.talk_nick = nick;
			this.setState({
				talk_uid: uid,
				talk_avatar: avatar,
				talk_nick: nick,
			});
			page = 1;
			this.getchatlog(function(){
				this.bindMsgList();
				mui.later(function(){
					this.state.ui.areaMsgList.style.transform="translate3d(0px, -"+(this.state.ui.areaMsgList.scrollHeight - document.documentElement.clientHeight)+"px, 0px)"
				}.bind(this), 3000);
		      	var images = [].slice.call(document.querySelectorAll('.msg-content img'));
		      	var urls = [];
		      	images.forEach(function(item) {
		        	urls.push(item.src);
		      	});
		      	mui('.msg-content').off('tap', 'img').on('tap', 'img', function() {
		        	var index = images.indexOf(this);
		        	plus.nativeUI.previewImage(urls, {
		        		background: "#333333",
		          		current: index,
		          		loop: false,
		          		indicator: 'number'
		        	});
		      	});
			}.bind(this));
			**/
			this.state.ui = {
				areaMsgList: document.querySelector('#msg-list'),
				content: document.querySelector('.mui-content')
			};
			this.state.ui.areaMsgList.addEventListener('drag', function(event) {
				var style = this.state.ui.areaMsgList.style;
				var transform = style.transform || '';
				if(transform.match(/translate3d\(\d+px,\s*(\d+)px,\s*(\d+)px\)/i) != null){
					var transformY = transform.match(/translate3d\(\d+px,\s*(\d+)px,\s*(\d+)px\)/i)[1];
					if(transformY>20 && !this.state.refresh_flg){
						var w=plus.nativeUI.showWaiting();
						this.state.refresh_flg = true;
						
						page = page+1;
						this.getchatlog(function(){
							this.bindMsgList();
					      	var images = [].slice.call(document.querySelectorAll('.msg-content img'));
					      	var urls = [];
					      	images.forEach(function(item) {
					        	urls.push(item.src);
					      	});
					      	mui('.msg-content').off('tap', 'img').on('tap', 'img', function() {
					        	var index = images.indexOf(this);
					        	plus.nativeUI.previewImage(urls, {
					        		background: "#333333",
					          		current: index,
					          		loop: false,
					          		indicator: 'number'
					        	});
					      	});
					      	this.state.refresh_flg = false;
					      	w.close();
						}.bind(this));
					}
				}
			}.bind(this))
			//mui(".mui-scroll-wrapper")[0].style.height = (document.documentElement.clientHeight) + 'px';
			window.addEventListener('resize', function() {
				this.state.ui.areaMsgList.style.transform="translate3d(0px, -"+(this.state.ui.areaMsgList.scrollHeight - document.documentElement.clientHeight)+"px, 0px)";
			}.bind(this), false);
			
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0007,
				 indicators: true, //是否显示滚动条
				 bounce: true
			});
		}
		
		bindPreviewImg(){
	      	var images = [].slice.call(document.querySelectorAll('.msg-content img'));
	      	var urls = [];
	      	images.forEach(function(item) {
	        	urls.push(item.getAttribute("data-lazyload"));
	      	});
	      	mui('.msg-content').off('tap', 'img').on('tap', 'img', function() {
	        	var index = images.indexOf(this);
	        	plus.nativeUI.previewImage(urls, {
	        		background: "#333333",
	          		current: index,
	          		loop: false,
	          		indicator: 'number'
	        	});
	      	});
		}
		
		bindMsgList(){
			var msgItems = this.state.ui.areaMsgList.querySelectorAll('.msg-item');
			var that = this;
			[].forEach.call(msgItems, function(item, index) {
				item.addEventListener('tap', function(event) {
					that.msgItemTap(item, event);
				}, false);
			});
		}
		
		msgItemTap(msgItem, event){
			var msgType = msgItem.getAttribute('data-msg-type');
			var msgContent = msgItem.getAttribute('data-msg-content');
			if (msgType == '语音') {
				var player = plus.audio.createPlayer(msgContent);
				var playState = msgItem.querySelector('.play-state');
				playState.innerText = '正在播放...';
				player.play(function() {
					playState.innerText = '点击播放';
				}, function(e) {
					playState.innerText = '点击播放';
				});
			}
		}
		
		getchatlog(cb){
			socketio.getchatlog(this.props.uid, this.props.token, this.props.uuid, this.state.talk_uid, page, 10, this.props.dispatch, function(status, info, data){
				cb(status, info, data);
			});
		}
		
		replace_em(str) {
			str = str.replace(/em_([0-9]*)/g, '<Img src="./js/lib/jquery-qqface/arclist/$1.gif" border="0" />');
			str = str.replace(/\[/g, '');
			str = str.replace(/]/g, '');
			return str;
		}
		
		render(){
			return(
				React.createElement("div", {className: "mui-content mui-scroll-wrapper chatbox"}, 
					React.createElement("div", {id: "msg-list", className: "mui-scroll"}, 
						React.createElement("dl", {className: "mui-table-view mui-table-view-chevron"}, 
					this.props.list.map(function(item1, index1){
						return (
							React.createElement("div", {key: index1}, 
								React.createElement("dt", null, item1.time), 
							item1.list.map(function(item, index){
								return (
								React.createElement("dd", {key: index, className: "mui-table-view-cell msg-item "+(item.fuid==this.props.uid?"msg-item-self":""), "data-msg-type": item.content_type, "data-msg-content": item.content}, 
									item.fuid==this.props.uid ?
										React.createElement("i", {className: "msg-user mui-icon mui-icon-person"})
									:
										React.createElement("img", {className: "msg-user-img", src: this.state.talk_avatar, alt: ""}), 
									
									React.createElement("div", {className: "msg-content"}, 
										React.createElement("div", {className: "msg-content-inner"}, 
											
												item.content_type == '文字'?
												React.createElement("span", {dangerouslySetInnerHTML: {__html: this.replace_em(item.content)}})
											:
												(
													item.content_type == '图片'?
													(item.content.substr(0,4)==="file"?
													React.createElement(Img, {src: item.content, folder: "chat", placeholder: item.content, "data-loaded": "true"})
													:
													React.createElement(Img, {src: item.content, folder: "chat", placeholder: "./js/containers/img/120_90.png"})
													)
													
													:
													React.createElement("span", null, 
														React.createElement("span", {className: "mui-icon mui-icon-mic", style: {fontSize: "18px", fontWeight: "bold"}}), 
														React.createElement("span", {className: "play-state"}, "点击播放")
													)
												)
											
										), 
										React.createElement("div", {className: "msg-content-arrow"})
									), 
									React.createElement("div", {className: "mui-item-clear"})
								)	
								)
							}.bind(this))
							)
						)
					}.bind(this))
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
	  	list: state.chat.chatlog_list,
	  	refresh_flg: state.chat.refresh_flg
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(ChatBox);
})