'use strict'

define(['react', 'actions/share', 'css!./css/share'], function(React, share){
	class Share extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				share: [],
				thumbs: [],//图片列表
				default_thumb: "http://cdn.companyclub.cn/tongshiquan/tongshiquan.jpg",//默认分享图片,
				onclose: null,
			};
		}
		
		componentWillMount(){
			share.init(function(shareArr){
				this.state.share = shareArr;
			}.bind(this));
		}
		
		componentDidMount(){
			mui(".share").on("tap", ".icon--pengyouquan", this.sharePengyouquan.bind(this));
			mui(".share").on("tap", ".icon--dengluweixin", this.shareFriends.bind(this));
			mui(".share").on("tap", ".icon--hicon1", this.shareQQ.bind(this));
			mui(".share").on("tap", ".icon--hicon2", this.shareWebibo.bind(this));
			//取消分享
			mui(".share").on("tap", ".cancer", this.cancerShare.bind(this));
		}
		
		//唤醒分享弹窗
		handleShare(onclose){
			mui(".share")[0].style.visibility = "visible";
			mui(".share_txt").addClass("show");
			this.state.onclose = onclose;
		}
		
		shareWebibo(){
			share.shareWebibo(this.state.share, this.props.title, this.props.content_text, this.props.thumb!=""?this.props.thumb:this.state.default_thumb, this.props.link, function(){
				this.cancerShare();
			}.bind(this));
		}
		
		//分享到空间
		shareQQ(){
			share.shareQQ(this.state.share, this.props.title, this.props.content_text, this.props.thumb!=""?this.props.thumb:this.state.default_thumb, this.props.link, function(){
				this.cancerShare();
			}.bind(this));
		}
		
		//发送给朋友
		shareFriends(){
			share.shareFriends(this.state.share, this.props.title, this.props.content_text, this.props.thumb!=""?this.props.thumb:this.state.default_thumb, this.props.link, function(){
				this.cancerShare();
			}.bind(this));
		}
		
		//分享到朋友圈
		sharePengyouquan(){
			share.sharePengyouquan(this.state.share, this.props.title, this.props.thumb!=""?this.props.thumb:this.state.default_thumb, this.props.link, function(){
				this.cancerShare();
			}.bind(this));
		}
		
		cancerShare(){
			mui(".share_txt").removeClass("show");
			mui(".share_txt").addClass("hide");
			setTimeout(function(){
				mui(".share")[0].style.visibility = "hidden";
				mui(".share_txt").removeClass("hide");
				if(typeof(this.state.onclose) == 'function'){
					this.state.onclose();
				}
			}.bind(this), 500);
		}
		
		render(){
			return (
				<div className="share">
					<div className="share_txt">
						<div className="icon_text">
							<div className="icon_box">
								<span className="icon clubfriends icon--pengyouquan"></span>
								<span>朋友圈</span>
							</div>
							<div className="icon_box">
								<span className="icon clubfriends icon--dengluweixin"></span>
								<span>微信</span>
							</div>
							<div className="icon_box">
								<span className="icon clubfriends icon--hicon1"></span>
								<span>QQ</span>
							</div>
							<div className="icon_box">
								<span className="icon clubfriends icon--hicon2"></span>
								<span>新浪微博</span>
							</div>
						</div>
						<div className="cancer">取消</div>
					</div>
				</div>
			)
		}
	}
	
	return Share;
})