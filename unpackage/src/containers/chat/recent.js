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

			document.addEventListener('postMsg', function(event){
				var touid = event.detail.touid;
				var content = event.detail.content;
				var content_type = event.detail.content_type;
			    //新建消息体对象
			    var obj = new RL_YTX.MsgBuilder();//设置自定义消息id
			    //设置发送的文本内容
			    obj.setText(content_type+"_"+content);
			    //设置发送的消息类型 1:文本消息 4:图片消息 6:压缩文件 7:非压缩文件//发送非文本消息时，text字段将被忽略，发送文本消息>时 file字段将被忽略
			    obj.setType(1);//设置接收者
			    obj.setReceiver(touid);
			
			    RL_YTX.sendMsg(obj, function(){
			        //发送消息成功//处理用户逻辑，通知页面}, 
			    }, function(obj){
			        //失败//发送消息失败//处理用户逻辑，通知页面刷新，展现重发按钮}, 
			    }, function(sended, total){
			        //发送图片或附件时的进度条
			        //如果发送文本消息，可以不传该参数
			    });
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
			//链接服务器
			socketio.connect(this.props.uid, this.props.token, this.props.uuid, this.props.dispatch, function(){
                RL_YTX.onMsgReceiveListener(function(obj){
                    //收到push消息或者离线消息或判断输入状态
                    //如果obj.msgType==12  判断obj.msgDomainn的值
                    //obj.msgDomain 0 无输入状态  1 正在输入  2 正在录音
                    var content = obj.msgContent.substr(3);
                    var from = obj.msgSender;
                    var content_type = obj.msgContent.substr(0,2);
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
                RL_YTX.onConnectStateChangeLisenter(function(obj){
                    //连接状态变更
                    // obj.code;//变更状态 1 断开连接 2 重连中 3 重连成功 4 被踢下线 5 断开连接，需重新登录
                // 断线需要人工重连
                }); 
			}.bind(this));
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
				<div className="mui-fullscreen">
					<div id="chatbox" className="mui-views">
						<div className="mui-view">
							<div className="mui-navbar">
							</div>
							<div className="mui-pages">
							</div>
						</div>
					</div>
					<Friends onEmployeeDetail={function(uid,avatar,nick){this.onEmployeeDetail(uid,avatar,nick)}.bind(this)} />
					<Structor onEmployeeDetail={function(uid,avatar,nick){this.onEmployeeDetail(uid,avatar,nick)}.bind(this)} />
					<div id="chat" className="chat mui-page">
						<header className="mui-navbar-inner mui-bar mui-bar-nav">
							<h1 className="mui-title">
								聊天
							</h1>
							<a className="mui-action-menu mui-icon mui-icon-plusempty mui-pull-right" href="#topPopover"></a>
						</header>
						<div className="mui-page-content">
							<div id="refreshContainer" className="recentchats mui-scroll-wrapper">
								<div className="mui-scroll"></div>
								<ul className="mui-table-view mui-table-view-chevron">
						{this.props.list.map(function(chater,index){
							return (
									<li data-uid={chater.touid} data-avatar={chater.avatar} data-nick={chater.username} className="mui-table-view-cell mui-media" style={{paddingRight: "0px"}}>
										<div className="mui-slider-right mui-disabled">
											<a className="mui-btn mui-btn-red">删除</a>
										</div>
										<div className="mui-slider-handle mui-table">
											<div className="mui-table-cell mui-navigate-right">
												<Img class="mui-media-object mui-pull-left" src={chater.avatar} placeholder="./js/containers/img/60x60.gif" folder="avatar" />
												<div className="mui-media-body">
													{chater.username}
												{chater.content_type=="文字"?
												<p className='mui-ellipsis'>{chater.content}</p>
												:(chater.content_type=="语音"?
													<p className='mui-ellipsis'>[收到一条语音]</p>:
													<p className='mui-ellipsis'>[收到一张图片]</p>
												)}
												</div>
											</div>
										</div>
									</li>
							)
						}.bind(this))}
								</ul>
							</div>
							<div id="topPopover" className="mui-popover">
								<ul className="mui-table-view">
									<li className="buildchat mui-table-view-cell myfriends">
										<a href="#friends">我的好友</a>
									</li>
									<li className="buildchat mui-table-view-cell structor">
										<a href="#structor">组织架构</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
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