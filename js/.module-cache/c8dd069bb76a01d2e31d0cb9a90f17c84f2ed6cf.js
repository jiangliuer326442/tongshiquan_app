'use strict'

define(['react', "react-redux", "components/header",
	'actions/socket',
	'css!./css/chat'], function(React, ReactRedux, Header,
		socketio){
	class ChatDetail extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				MIN_SOUND_TIME: 800,
				ui: null,
				talk_uid: 0,
				talk_avatar: "",
				talk_nick: "",
				userinfo_detail: null
			};
		}
		
		componentWillMount(){
			if(mui.os.plus){
				plus.webview.currentWebview().setStyle({
					softinputMode: "adjustResize"
				});
			}
			mui.init({
				gestureConfig: {
					tap: true, //默认为true
					doubletap: true, //默认为false
					longtap: true, //默认为false
					swipe: true, //默认为true
					drag: true, //默认为true
					hold: true, //默认为false，不监听
					release: true //默认为false，不监听
				},
			});
			document.addEventListener('get_chatlog', function(event){
				var uid = event.detail.talk_uid;
				var avatar = event.detail.talk_avatar;
				var nick = event.detail.talk_nick;
				this.state.userinfo_detail = mui.preload({
					url: 'index.html#/structor/userinfo',
					id: 'detail_userinfo',
				});
				mui.fire(plus.webview.getWebviewById("chat_box"), 'get_chatlog2', {
					talk_uid: uid,
					talk_avatar:avatar,
					talk_nick: nick,
				});
				this.setState({
					talk_uid: uid,
					talk_avatar: avatar,
					talk_nick: nick,
				});
			}.bind(this));
			//处理关闭页面
			mui.back = function(){
				mui.fire(plus.webview.getWebviewById("index.html/chat"), 'getrecentchat', {
					uid: this.props.uid,
					token: this.props.token,
					uuid: this.props.uuid,
				});
				setTimeout(function () {
					plus.webview.getLaunchWebview().show("slide-in-right", 300);
				},150);
			}.bind(this)
		}
		
		bindEvent(){
			var that = this;
			mui(".chat").on("tap",".mui-icon-person",function(){
				mui.fire(that.state.userinfo_detail, 'setuserinfo', {
					talk_uid: that.state.talk_uid,
					talk_avatar: that.state.talk_avatar,
					talk_nick: that.state.talk_nick,
				});
				setTimeout(function () {
					that.state.userinfo_detail.show("slide-in-right", 300);
				},150);
			});
		}
		
		componentDidMount(){			
			this.bindEvent();
			this.state.ui = {
				body: document.querySelector('body'),
				footer: document.querySelector('footer'),
				footerRight: document.querySelector('.footer-right'),
				footerLeft: document.querySelector('.footer-left'),
				btnMsgType: document.querySelector('#msg-type'),
				boxMsgText: document.querySelector('#msg-text'),
				boxMsgSound: document.querySelector('#msg-sound'),
				btnMsgImage: document.querySelector('#msg-image'),
				boxSoundAlert: document.querySelector('#sound-alert'),
				h: document.querySelector('#h')
			};
			this.state.ui.h.style.width = this.state.ui.boxMsgText.offsetWidth + 'px';
			var footerPadding = this.state.ui.footer.offsetHeight - this.state.ui.boxMsgText.offsetHeight;
			//解决长按“发送”按钮，导致键盘关闭的问题；
			this.state.ui.footerRight.addEventListener('touchstart', function(event){
				if (this.state.ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
					this.msgTextFocus();
					event.preventDefault();
				}
			}.bind(this));
			//解决长按“发送”按钮，导致键盘关闭的问题；
			this.state.ui.footerRight.addEventListener('touchmove', function(event){
				if (this.state.ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
					this.msgTextFocus();
					event.preventDefault();
				}
			}.bind(this));
			this.state.ui.footerRight.addEventListener('release', function(event){
				if (this.state.ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
					//showKeyboard();
					this.state.ui.boxMsgText.focus();
					setTimeout(function() {
						this.state.ui.boxMsgText.focus();
					}.bind(this), 150);
					//							event.detail.gesture.preventDefault();
					this.send(this.state.ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '<br/>'), "文字");
					this.state.ui.boxMsgText.value = '';
					mui.trigger(this.state.ui.boxMsgText, 'input', null);
				} else if (this.state.ui.btnMsgType.classList.contains('mui-icon-mic')) {
					this.state.ui.btnMsgType.classList.add('mui-icon-compose');
					this.state.ui.btnMsgType.classList.remove('mui-icon-mic');
					this.state.ui.boxMsgText.style.display = 'none';
					this.state.ui.boxMsgSound.style.display = 'block';
					this.state.ui.boxMsgText.blur();
					document.body.focus();
				} else if (this.state.ui.btnMsgType.classList.contains('mui-icon-compose')) {
					this.state.ui.btnMsgType.classList.add('mui-icon-mic');
					this.state.ui.btnMsgType.classList.remove('mui-icon-compose');
					this.state.ui.boxMsgSound.style.display = 'none';
					this.state.ui.boxMsgText.style.display = 'block';
					//--
					//showKeyboard();
					this.state.ui.boxMsgText.focus();
					setTimeout(function() {
						this.state.ui.boxMsgText.focus();
					}.bind(this), 150);
				}
			}.bind(this), false);
			this.state.ui.footerLeft.addEventListener('tap', function(event){
				var btnArray = [{
					title: "拍照"
				}, {
					title: "从相册选择"
				}];
				plus.nativeUI.actionSheet({
					title: "选择照片",
					cancel: "取消",
					buttons: btnArray
				}, function(e){
					var index = e.index;
					switch (index) {
						case 0:
							break;
						case 1:
							var cmr = plus.camera.getCamera();
							cmr.captureImage(function(path){
								this.send("file://" + plus.io.convertLocalFileSystemURL(path), "图片");
							}.bind(this), function(err) {});
							break;
						case 2:
							plus.gallery.pick(function(path){
								this.send(path, "图片");
							}.bind(this), function(err) {}, {
								system: false
							});
							break;
					}
				}.bind(this));
			}.bind(this), false); 
			var recordCancel = false;
			var recorder = null;
			var audio_tips = document.getElementById("audio_tips");
			var startTimestamp = null;
			var stopTimestamp = null;
			var stopTimer = null;
			this.state.ui.boxMsgSound.addEventListener('hold', function(event){
				recordCancel = false;
				if(stopTimer)clearTimeout(stopTimer);
				audio_tips.innerHTML = "手指上划，取消发送";
				this.state.ui.boxSoundAlert.classList.remove('rprogress-sigh');
				this.setSoundAlertVisable(true);
				recorder = plus.audio.getRecorder();
				if (recorder == null) {
					plus.nativeUI.toast("不能获取录音对象");
					return;
				}
				startTimestamp = (new Date()).getTime();
				recorder.record({
					filename: "_doc/audio/"
				}, function(path){
					if (recordCancel) return;
					this.send(path, "语音");
				}.bind(this), function(e) {
					plus.nativeUI.toast("录音时出现异常: " + e.message);
				});
			}.bind(this), false);
			this.state.ui.body.addEventListener('drag', function(event) {
				//console.log('drag');
				if (Math.abs(event.detail.deltaY) > 50) {
					if (!recordCancel) {
						recordCancel = true;
						if (!audio_tips.classList.contains("cancel")) {
							audio_tips.classList.add("cancel");
						}
						audio_tips.innerHTML = "松开手指，取消发送";
					}
				} else {
					if (recordCancel) {
						recordCancel = false;
						if (audio_tips.classList.contains("cancel")) {
							audio_tips.classList.remove("cancel");
						}
						audio_tips.innerHTML = "手指上划，取消发送";
					}
				}
			}.bind(this), false);
			this.state.ui.boxMsgSound.addEventListener('release', function(event){
				//console.log('release');
				if (audio_tips.classList.contains("cancel")) {
					audio_tips.classList.remove("cancel");
					audio_tips.innerHTML = "手指上划，取消发送";
				}
				//
				stopTimestamp = (new Date()).getTime();
				if (stopTimestamp - startTimestamp < this.state.MIN_SOUND_TIME) {
					audio_tips.innerHTML = "录音时间太短";
					this.state.ui.boxSoundAlert.classList.add('rprogress-sigh');
					recordCancel = true;
					stopTimer=setTimeout(function(){
						this.setSoundAlertVisable(false);
					},800);
				}else{
					this.setSoundAlertVisable(false);
				}
				recorder.stop();
			}.bind(this), false);
			this.state.ui.boxMsgSound.addEventListener("touchstart", function(e) {
				//console.log("start....");
				e.preventDefault();
			});
			this.state.ui.boxMsgText.addEventListener('input', function(event){
				this.state.ui.btnMsgType.classList[this.state.ui.boxMsgText.value == '' ? 'remove' : 'add']('mui-icon-paperplane');
				this.state.ui.btnMsgType.setAttribute("for", this.state.ui.boxMsgText.value == '' ? '' : 'msg-text');
				this.state.ui.h.innerText = this.state.ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '\n-') || '-';
				this.state.ui.footer.style.height = (this.state.ui.h.offsetHeight + footerPadding) + 'px';
				//this.state.ui.content.style.paddingBottom = this.state.ui.footer.style.height;
			}.bind(this));
			var focus = false;
			this.state.ui.boxMsgText.addEventListener('click', function(event){
				this.state.ui.boxMsgText.focus();
				setTimeout(function() {
					this.state.ui.boxMsgText.focus();
				}.bind(this), 0);
				focus = true;
				setTimeout(function() {
					focus = false;
				},1000);
			}.bind(this), false);
			//点击消息列表，关闭键盘
			/*
			this.state.ui.areaMsgList.addEventListener('click',function(event){
				if(!focus){
					this.state.ui.boxMsgText.blur();
				}
			}.bind(this))
			*/
		}
		
		setSoundAlertVisable(show){
			if(show){
				this.state.ui.boxSoundAlert.style.display = 'block';
				this.state.ui.boxSoundAlert.style.opacity = 1;
			}else{
				this.state.ui.boxSoundAlert.style.opacity = 0;
				//fadeOut 完成再真正隐藏
				setTimeout(function(){
					this.state.ui.boxSoundAlert.style.display = 'none';
				}.bind(this),200);
			}
		};
		
		msgTextFocus() {
			this.state.ui.boxMsgText.focus();
			setTimeout(function() {
				this.state.ui.boxMsgText.focus();
			}.bind(this), 150);
		}
		
		send(content, content_type){
			mui.fire(plus.webview.getWebviewById("chat_box"), 'append_chat', {
				content: content,
				content_type: content_type
			});
			socketio.addchat(this.props.uid, this.props.token, this.props.uuid, this.state.talk_uid,content,content_type,this.props.dispatch);
		}
		
		render() {
			return ( 
				React.createElement("div", {className: "chat"}, 
					React.createElement(Header, null, 
						React.createElement("a", {className: "mui-action-back mui-icon mui-pull-left"}, "返回"), 
						React.createElement("h1", {className: "mui-title"}, this.state.talk_nick), 
						React.createElement("a", {className: "mui-icon mui-icon-person mui-pull-right"})
					), 
					React.createElement("pre", {id: "h"}), 

					React.createElement("footer", null, 
						React.createElement("div", {className: "footer-left"}, 
							React.createElement("i", {id: "msg-image", className: "mui-icon mui-icon-camera", style: {fontSize: "28px"}})
						), 
						React.createElement("div", {className: "footer-center"}, 
							React.createElement("textarea", {id: "msg-text", type: "text", className: "input-text"}), 
							React.createElement("button", {id: "msg-sound", type: "button", className: "input-sound", style: {display: "none"}}, "按住说话")
						), 
						React.createElement("label", {htmlFor: "", className: "footer-right"}, 
							React.createElement("i", {id: "msg-type", className: "mui-icon mui-icon-mic"})
						)
					), 
					React.createElement("div", {id: "sound-alert", className: "rprogress"}, 
						React.createElement("div", {className: "rschedule"}), 
						React.createElement("div", {className: "r-sigh"}, "!"), 
						React.createElement("div", {id: "audio_tips", className: "rsalert"}, "手指上滑，取消发送")
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
	  	myavatar: state.myuser.avatar,
	  	pnum: state.chat.chatlog_pnum,
	  	refresh_flg: state.chat.refresh_flg
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(ChatDetail);
})