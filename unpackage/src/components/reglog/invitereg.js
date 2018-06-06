'use strict'

define(['react', "react-redux","components/common/img",
	'actions/share',
	'css!./css/invitereg'], function(React, ReactRedux, Img,
	share){
	class InviteReg extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				share: [],
				default_thumb: "http://cdn.companyclub.cn/tongshiquan/tongshiquan.jpg",//默认分享图片,
			};
		}
		
		componentWillMount(){
			share.init(function(shareArr){
				this.state.share = shareArr;
			}.bind(this));
		}
		
		componentDidMount(){
			mui(".company").on('tap','.invite_reg', function(){
				if(mui(event.target).hasClass("invite_reg")){
					this.hide();
				}
			}.bind(this));
			
			mui(".invite_reg").on('longtap','.qrcode', function(){
				plus.gallery.save(this.props.company_qrcode, function(event){
					mui.toast("二维码已保存到相册");
				}, function(event){
					
				});
			}.bind(this));
			
			mui(".invite_reg").on('tap','.icon--dengluweixin', function(){
				share.shareFriends(this.state.share, this.props.uname + "邀请你加入" + this.props.company_name, "一起建设我们的企业小家吧，在这里发布通知，发表帖子，表达自己的想法...", this.state.default_thumb, this.props.invite_url, function(){
					this.hide();
				}.bind(this));
			}.bind(this));
			
			mui(".invite_reg").on('tap','.icon--hicon1', function(){
				share.shareQQ(this.state.share, this.props.uname + "邀请你加入" + this.props.company_name, "一起建设我们的企业小家吧，在这里发布通知，发表帖子，表达自己的想法...", this.state.default_thumb, this.props.invite_url, function(){
					this.hide();
				}.bind(this));
			}.bind(this));
		}
		
		hide(event){
			plus.nativeObj.View.getViewById('tabBar').show();
			plus.nativeObj.View.getViewById('icon').show();
			plus.webview.currentWebview().setStyle({bottom: "50px"})
			mui(".invite_reg .box").removeClass("show")
			mui(".invite_reg .box").addClass("show")
			mui.later(function(){
				mui(".invite_reg")[0].style.visibility = "hidden";
			},300);
		}
		
		render(){
			return (
				<div className="invite_reg">
					<div className="box">
						<h4>长按图片保存,邀请同事加入</h4>
					{/*
						<Img src={this.props.qrcode} placeholder="./js/containers/img/60x60.gif" folder="company" />
					*/}
						<img className="qrcode" src={this.props.company_qrcode} />
						<h4>或通过以下途径邀请同事注册</h4>
						<div className="share-box">
							<div className="icon_box">
								<span className="icon clubfriends icon--dengluweixin"></span>
								<span>微信好友</span>
							</div>
							<div className="icon_box">
								<span className="icon clubfriends icon--hicon1"></span>
								<span>QQ</span>
							</div>
						</div>
					</div>
				</div>
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {
		company_qrcode: state.mycompany.qrcode_img,
		invite_url: state.mycompany.qrcode_url,
		company_name: state.mycompany.name,
		uname: state.myuser.uname
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(InviteReg);
})