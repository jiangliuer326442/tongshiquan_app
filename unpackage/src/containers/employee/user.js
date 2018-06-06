'use strict'

define(['react', "react-redux","components/header","actions/user","css!./css/userinfo"], function(React, ReactRedux, Header, user){
	class UserInfo extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				uid: 0,
				avatar: "",
				nick: "",
				add_person_flg: false
			};
		}
		
		componentWillMount(){
			var that = this;
			document.addEventListener('setuserinfo', function(event){
				var uid = event.detail.talk_uid;
				var avatar = event.detail.talk_avatar;
				var nick = event.detail.talk_nick;
				user.getuserinfo(that.props.uid, that.props.token, that.props.uuid, uid, that.props.dispatch, function(status, info, data){
				});
				this.setState({
					uid: uid,
					avatar: avatar,
					nick: nick,
				});
			}.bind(this))
		}
		
		componentDidMount(){
			var that = this;
			mui('.mui-switch')['switch']();
			mui(".userinfo").on("toggle",".mui-switch", function(event){
				console.log(event.detail.isActive);
			});
			mui(".userinfo").on("tap",".mui-icon-personadd", function(event){
				if(!this.state.add_person_flg){
					var phone = that.props.employee_uphone;
					plus.contacts.getAddressBook( plus.contacts.ADDRESSBOOK_PHONE, function( addressbook ) {
						var dtask = plus.downloader.createDownload( that.state.avatar, {
							filename: "_doc/",
						}, function( d, status){
							// 下载完成
							if ( status == 200 ) {
								var addContact = function(){
									// 向通讯录中添加联系人
									var contact = addressbook.create();
									contact.name = {givenName:that.props.employee_markedname?that.props.employee_markedname:that.state.nick};
									contact.phoneNumbers = [{type:"手机",value:phone,preferred:true}];
									contact.emails = [{type:"公司",value: that.props.employee_umail, preferred:false}];
									contact.photos = [{type:"公司",value: d.filename, preferred:false}];
									contact.save( function () {
										mui.toast( "保存联系人成功" );
									}, function ( e ) {
										mui.toast( "保存联系人失败：" + e.message );
									} );
								}
								// 可通过addressbook进行通讯录操作
								addressbook.find( null, function ( contacts ) {
									if ( contacts.length> 0 ) {
										var dc = contacts[0];
										dc.remove( function () {
											addContact();
										});
									}else{
										addContact();
									}
								}, function ( e ) {
										mui.toast( "Find contact error: "+ e.message );
								}, {filter:[{logic:"or",field:"phoneNumbers",value:phone}],multi:false} );
							} else {
								mui.toast( "Download failed: " + status ); 
							}  
						});
						//dtask.addEventListener( "statechanged", onStateChanged, false );
						dtask.start();
					}, function ( e ) {
						alert( "Get address book failed: " + e.message );
					} );
				}
			}.bind(this));
			mui(".userinfo").on("tap",".contact-call", function(event){
				var phone = that.props.employee_uphone;
				plus.device.dial(phone);
			});
			mui(".userinfo").on("tap",".mui-icon-extra-heart-filled", function(){
				user.toggleCare(that.props.uid, that.props.token, that.props.uuid, that.state.uid, that.props.dispatch);
			});
			mui(".userinfo").on("tap",".contact-msg", function(event){
				var phone = that.props.employee_uphone;
				var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
				msg.to = [phone];
				//msg.body = 'This is HTML5 Plus example test message';
				plus.messaging.sendMessage( msg );
			});
		}
		
		render() {
			return ( 
				<div className="userinfo">
					<Header>
						<a className="mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"></a>
						<a className="mui-icon mui-icon-personadd mui-pull-right"></a>
						<a className={"mui-icon mui-icon-extra mui-icon-extra-heart-filled mui-pull-right"+(this.props.employee_care_flg || this.props.employee_friend_flg ? " on":"")}></a>
					</Header>
					<div className="mui-content">
						<div className="headerbox" style={{backgroundImage:"url("+this.state.avatar+")"}}></div>
						<div className="headerbox-content">
							<img className="avatar" src={this.state.avatar} />
							<h4 className="nick">{this.state.nick}</h4>
						{this.props.employee_umail?
							<p className="mail">{this.props.employee_umail}</p>
						:null}
							<div className="contact-box">
								<span className="contact-call"><i className="mui-icon mui-icon-phone"></i>电话</span>
								<span className="contact-msg"><i className="mui-icon mui-icon-chatbubble"></i>短信</span>
							</div>
						</div>
						<ul className="mui-table-view">
							<li className="mui-table-view-cell">
								<span>设置备注和标签</span>
							</li>
						</ul>
						<ul className="mui-table-view">
							<li className="mui-table-view-cell">
								<span>不让Ta看我的同事圈</span>
								<div className={"mui-switch"+(this.props.employee_allowhim_flg?" mui-active":"")}>
									<div className="mui-switch-handle"></div>
								</div>
							</li>
							<li className="mui-table-view-cell">
								<span>不看Ta的同事圈</span>
								<div className={"mui-switch"+(this.props.employee_watchhim_flg?" mui-active":"")}>
									<div className="mui-switch-handle"></div>
								</div>
							</li>
						</ul>
						<button type="button" className="chat-btn mui-btn mui-btn-block mui-btn-success">发起聊天</button>
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
		employee_allowhim_flg: state.user.employee_allowhim_flg,
		employee_care_flg: state.user.employee_care_flg,
		employee_friend_flg: state.user.employee_friend_flg,
		employee_markedname: state.user.employee_markedname,
		employee_umail: state.user.employee_umail,
		employee_uphone: state.user.employee_uphone,
		employee_watchhim_flg: state.user.employee_watchhim_flg
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(UserInfo);
})