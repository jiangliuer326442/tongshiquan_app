'use strict'

var page = 1;

define(['react', "react-redux","components/header","components/common/img",
	'components/article/commentbox',
	'jquery',
	'components/common/lazyload',
	'actions/share',
	'actions/club',
	'css!./css/club'], function(React, ReactRedux, Header, Img,
		CommentBox,
		jQuery,
		lazyload,
		share,
		club){
	class Club extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				reply_nick: "",
				reply_id: 0	,
				index: -1,
				visibility_list: [],
				visibility: [],
				share_thumb: "http://cdn.companyclub.cn/tongshiquan/tongshiquan.jpg",//默认分享图片,
				share: []
			}
		}
		
		componentWillMount(){
			document.addEventListener('getTwitters', function(event){
		      	page = 1; 	
		      	var refresh_obj = "#refreshContainer";
				club.getCmpTwitter(this.props.uid, this.props.token, this.props.uuid, page, this.props.pnum, this.props.dispatch, function(status, info, data){
		      		page = page+1;
		      		//重置上拉加载
		      		mui(refresh_obj).pullRefresh().refresh(true);
		      		if(mui.os.plus){
		      			mui(refresh_obj).pullRefresh().endPulldown(data.length==0?true:false);    			
		      		}else{
		      			mui(refresh_obj+" .mui-pull-top-pocket").removeClass("mui-visibility");
		      		}
				}.bind(this));
			}.bind(this));
			document.addEventListener('onLoad', function(event){
				this.initView();
			}.bind(this));
			document.addEventListener('onShow', function(){
				mui.fire(plus.webview.getWebviewById("detail_article"), "jump", {
					url: "/club/create"
				});
			});
			window.addEventListener('resize', function() {
				if(document.documentElement.clientHeight<500){
					mui(".discuss_footer")[0].style.display = "block";
					plus.nativeObj.View.getViewById('tabBar').hide();
					plus.nativeObj.View.getViewById('icon').hide();
					plus.webview.currentWebview().setStyle({bottom: "0px"})
				}else{
					this.initView();
				}
			}.bind(this), false);
			share.init(function(shareArr){
				this.state.share = shareArr;
			}.bind(this));
			var old_back = mui.back;
			mui.back = function(){
				if(plus.webview.getWebviewById("club_article_detail")){
					plus.webview.getWebviewById("club_article_detail").close();
				}else{
					old_back();
				}
			}
		}
		
		componentDidMount(){
			club.gettwtvisibble(this.props.uid, this.props.token, this.props.uuid, this.props.dispatch, function(data){
				var visibility = [];
				for(var i=0; i<data.length; i++){
					visibility[data[i].id] = data[i]
				}
				this.setState({
					visibility: visibility,
					visibility_list: data
				});
			}.bind(this))
			
			var refresh_obj = "#refreshContainer";
			mui.init({
				gestureConfig: {
					longtap: true
				},
			  	pullRefresh : {
				    container:refresh_obj,//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				    down : {
				      style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
				      color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
				      height:'50px',//可选,默认50px.下拉刷新控件的高度,
				      range:'100px', //可选 默认100px,控件可下拉拖拽的范围
				      offset:'0px', //可选 默认0px,下拉刷新控件的起始位置
				      callback :function(){
				      	page = 1; 	
						club.getCmpTwitter(this.props.uid, this.props.token, this.props.uuid, page, this.props.pnum, this.props.dispatch, function(status, info, data){
				      		page = page+1;
				      		//重置上拉加载
				      		mui(refresh_obj).pullRefresh().refresh(true);
				      		if(mui.os.plus){
				      			mui(refresh_obj).pullRefresh().endPulldown(data.length==0?true:false);    			
				      		}else{
				      			mui(refresh_obj+" .mui-pull-top-pocket").removeClass("mui-visibility");
				      		}
						}.bind(this));
				  	  }.bind(this)
				    },
				    up : {
				      height:50,//可选.默认50.触发上拉加载拖动距离
				      auto:true,//可选,默认false.自动上拉加载一次
				      contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
				      contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
				      callback :function(){
						club.getCmpTwitter(this.props.uid, this.props.token, this.props.uuid, page, this.props.pnum, this.props.dispatch, function(status, info ,data){
				      		mui(refresh_obj).pullRefresh().endPullupToRefresh(data.length==0?true:false);
							page = page+1;
							this.bindEvent();
							mui.setItem("nav_3", "1");
						}.bind(this));
				      }.bind(this)
				    }
			  	}
			});
		}
		
		initView(){
			mui.os.plus && plus.nativeObj.View.getViewById('tabBar').show();
			mui.os.plus && plus.nativeObj.View.getViewById('icon').show();
			mui(".discuss_footer")[0].style.display = "none";
			if(mui("#facebox").length>0){
				document.getElementById("facebox").style.display = "none";
			}
			mui.os.plus && plus.webview.currentWebview().setStyle({bottom: "51px"})
			this.setState({
				reply_nick: "",
				reply_id: 0	,
				index: -1
			});
		}
		
		addComment(content){
			var twtid = this.props.list[this.state.index].id;
			var comment_id = this.state.reply_id;
			if(comment_id>0){
				club.addReply(this.props.uid, this.props.token, this.props.uuid, twtid, comment_id, "回复 "+this.state.reply_nick+"："+content, this.props.dispatch, function(){
					mui.fire(plus.webview.currentWebview(), "getTwitters");
				});
			}else{
				club.addComment(this.props.uid, this.props.token, this.props.uuid, twtid, content, this.props.dispatch, function(){
					mui.fire(plus.webview.currentWebview(), "getTwitters");
				});
			}
		}
		
		handleLink(url, title, content){
			var that = this;
			mui.openWindow({
				url: url,
				id: "club_article_detail",
				createNew:true,
				waiting:{
					autoShow:false,
				},
				styles: {                             // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
					titleNView: {                       // 窗口的标题栏控件
						autoBackButton: true,
						titleText:title,                // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
						titleColor:"#F8F8F9",             // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
						titleSize:"17px",                 // 字体大小,默认17px
						backgroundColor:"#3C394B",        // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
						progress:{                        // 标题栏控件的进度条样式
							color:"#00FF00",                // 进度条颜色,默认值为"#00FF00"  
							height:"2px"                    // 进度条高度,默认值为"2px"         
						},
						buttons: [{
							fontSrc: "_www/fonts/mui-icons-extra.ttf",
							text: "\ue200",
							onclick: function(){
								that.handleShare(title, url);
							}
						}]
					}
				}
			});
		}
		
		handleShare(title, url){
			var that = this;
			// 弹出系统选择按钮框
			plus.nativeUI.actionSheet( {title:"分享到",cancel:"取消",buttons:[{title:"微信朋友圈"},{title:"微信好友"},{title:"QQ好友"},{title:"新浪微博"}]}, function(e){
				switch(e.index){
					case 1:
						share.sharePengyouquan(that.state.share, title, that.state.share_thumb, url, function(){});
					  	break;
					case 2:
					  	share.shareFriends(that.state.share, title, "", that.state.share_thumb, url, function(){});
					  	break;
					case 3:
					  	share.shareQQ(that.state.share, title, "", that.state.share_thumb, url, function(){});
					  	break;
					case 4:
						share.shareWebibo(that.state.share, title, "", that.state.share_thumb, url, function(){});
						break;
					default:
				}
			} );
		}
		
		bindEvent(){
			var that = this;
			
			mui(".twt_list").off("longtap", ".twt_item").on("longtap", ".twt_item", function(event){
				var items = [].slice.call(document.querySelectorAll('.twt_item'));
				var index = items.indexOf(this);
				var item = that.props.list[index];
				that.state.index = index;
				if(event.target.className=="comment" || event.target.parentNode.className=="comment"){
					var comments = [].slice.call(items[index].querySelectorAll('.comment'));
					var comment_obj = event.target.className=="comment"?event.target:event.target.parentNode;
					var index2 = comments.indexOf(comment_obj);
					if(item.comment[index2].uid == that.props.uid){
						mui.confirm("删除该评论？","提示", ["否","是"], function(e){
							if (e.index == 1) {
								comments[index2].remove();
								if(comments.length == 1){
									items[index].querySelector(".comment_box").remove();
								}
								club.delComment(that.props.uid, that.props.token, that.props.uuid, index, index2, item.comment[index2].id, that.props.dispatch, function(){
									
								})
							}
						});
					}
				}
			});
			
			mui(".twt_list").off("tap", ".twt_item").on("tap", ".twt_item", function(event){
				var items = [].slice.call(document.querySelectorAll('.twt_item'));
				var index = items.indexOf(this);
				var item = that.props.list[index];
				that.state.index = index;
				if(event.target.className=="comment" || event.target.parentNode.className=="comment"){
					var comments = [].slice.call(items[index].querySelectorAll('.comment'));
					var comment_obj = event.target.className=="comment"?event.target:event.target.parentNode;
					var index2 = comments.indexOf(comment_obj);
					if(item.comment[index2].uid != that.props.uid){
						mui("#saytext").keyboard();
						mui(".discuss_footer")[0].style.display = "block";
						if(mui(".icon--face").length>0){
							mui(".icon--face")[0].style.display = "none";
						}
						jQuery("#comment_content").css({width: jQuery("#saytext").width()+"px"});
						setTimeout(function(){
							document.getElementById("saytext").focus();
							mui.scrollTo(event.detail.center.y - document.documentElement.clientHeight + 150, 200, function(){
								
							});
						},1000);
						var nick = item.comment[index2].nick;
						var cid = item.comment[index2].id;
						that.setState({
							reply_nick: nick,
							reply_id: cid
						});
					}
				}
				if(event.target.className=="delete"){
					mui.confirm("确定删除吗？","提示", ["取消","删除"], function(e){
						if (e.index == 1) {
							items[index].remove();
							club.delTwt(that.props.uid, that.props.token, that.props.uuid, that.props.dispatch, index, item.id, function(){});
						}
					});
				}
				if(event.target.className=="reply"){
					mui("#saytext").keyboard();
					mui(".discuss_footer")[0].style.display = "block";
					if(mui(".icon--face").length>0){
						mui(".icon--face")[0].style.display = "none";
					}
					jQuery("#comment_content").css({width: jQuery("#saytext").width()+"px"});
					setTimeout(function(){
						document.getElementById("saytext").focus();
						mui.scrollTo(event.detail.center.y - document.documentElement.clientHeight + 150, 200, function(){
							
						});
					},1000);
					that.setState({
						reply_nick: "",
						reply_id: 0
					});
				}
				if(event.target.className=="link_box" || event.target.parentNode.className=="link_box"){
					var url = item.link_url;
					var title = item.link_title;
					var content = item.link_content;
					
					that.handleLink(url, title, content);
				}
				if(event.target.nodeName == "IMG"){
		        	plus.nativeUI.previewImage(JSON.parse(item.image), {
		        		background: "#333333",
		          		current: 0,
		          		loop: false,
		          		indicator: 'number'
		        	});
				}
			});
			mui("#createPopover").off("tap", "li").on("tap", "li", function(){
				mui("#createPopover").popover("hide");
				if(this.classList.contains("create_say")){
					mui.fire(plus.webview.getWebviewById("detail_article"), 'show', {
						event_type: 1,
						data: that.state.visibility_list
					});
					plus.webview.getWebviewById("detail_article").show("slide-in-right", 300);
				}
				if(this.classList.contains("choose_galary")){
					mui.fire(plus.webview.getWebviewById("detail_article"), 'show', {
						event_type: 3,
						data: that.state.visibility_list
					});
					plus.webview.getWebviewById("detail_article").show("slide-in-right", 300);
				}
				if(this.classList.contains("take_photo")){
					mui.fire(plus.webview.getWebviewById("detail_article"), 'show', {
						event_type: 2,
						data: that.state.visibility_list
					});
					plus.webview.getWebviewById("detail_article").show("slide-in-right", 300);
				}
				if(this.classList.contains("create_url")){
					mui.fire(plus.webview.getWebviewById("detail_article"), 'show', {
						event_type: 4,
						data: that.state.visibility_list
					});
					plus.webview.getWebviewById("detail_article").show("slide-in-right", 300);
				}
			})
		}
		
		render() {
			return ( 
				<div className="club">
					<Header>
						<h1 className="mui-title">
							同事圈
						</h1>
						<a className="mui-action-menu mui-icon clubfriends icon--xiangjicopy2x mui-pull-right" href="#createPopover"></a>
					</Header>
					<div id="refreshContainer" className="mui-content">
						<div className="mui-scroll"></div>
						<ul className="twt_list">
					{this.props.list.map(function(item, index){
						var img_arr = JSON.parse(item.image);
						return (
							<li className="twt_item" data-index={index}>
								<div className="avatar">
									<Img placeholder="./js/containers/img/60x60.gif" src={item.avatar} folder="avatar" />
								</div>
								<div className="body">
									<h3>
										{item.nick}
									{item.visiblity && this.state.visibility.length>0 ? 
										<i className={"visibility clubfriends "+this.state.visibility[item.visiblity].icon}></i>
									: null}
									</h3>
									<p dangerouslySetInnerHTML={{__html: $.replace_em(item.content)}}></p>
								{img_arr.length>0 && img_arr[0].length>0?
									<div className="img_box">
									{img_arr.map(function(item2, index2){
										if(img_arr.length%2==0){
											var width = '48%';
										}else if(img_arr.length==1){
											var width = '80%';
										}else{
											var width = '31%';
										}
										return (
										<div className="img" style={{width: width}}>
											<Img placeholder="./js/containers/img/60x60.gif" src={item2} folder="twitter" />
										</div>
										)
									}.bind(this))}
									</div>
								:null}
								{item.link_title?
									<div className="link_box">
										<h4>{item.link_title}</h4>
									</div>
								:null}
									<div className="oprate_box">
										<i className="create_ts">{item.create_time}</i>
										<a className="reply">回复</a>
									{item.uid == this.props.uid?
										<a className="delete">删除</a>
									:null}
									</div>
								{item.comment.length>0?
									<div className="comment_box">
								{item.comment.map(function(item2, index2){
									return(
										<div className="comment" data-index={index2}>
											<div className="nick">{item2.uid==this.props.uid?"我":item2.nick}</div>
											<div className="content">{item2.content}</div>
										</div>
									)
								}.bind(this))}
									</div>
								:null}
								</div>
							</li>
						)
					}.bind(this))}
						</ul>
					</div>
					<div id="createPopover" className="mui-popover">
					  <ul className="mui-table-view">
					    <li className="mui-table-view-cell create_say">记录生活</li>
					    <li className="mui-table-view-cell take_photo">拍照</li>
					    <li className="mui-table-view-cell choose_galary">从相册选择</li>
					    <li className="mui-table-view-cell create_url">分享文章</li>
					  </ul>
					</div>
					<CommentBox handleSubmit={function(content){
						this.addComment(content);
					}.bind(this)} on_blur={function(content){
						if(content == ""){
							this.setState({
								reply_nick: "",
								reply_id: 0	
							});
						}
					}.bind(this)} placeholder={this.state.reply_id?"回复"+this.state.reply_nick:"评论..."} />
				</div>
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {
	  	uid: state.myuser.uid,
	  	token: state.myuser.token,
	  	uuid: state.myuser.uuid,
		list: state.twitter.company_twt,
		pnum: state.twitter.pnum
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Club);
})