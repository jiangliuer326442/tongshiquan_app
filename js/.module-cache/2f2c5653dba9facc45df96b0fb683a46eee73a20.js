'use strict'

define(['react', "react-redux","components/header",'components/article/commentbox','components/article/share',
	'actions/share',
	'actions/article',
	'actions/user',
	'css!./css/post'], function(React, ReactRedux, Header, CommentBox, Share,
	share,
	article,
	user){
	
	var page = 1;
		
	class Post extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				thumb: "",
				thumbs: [],
				companyid: "",
				postid: 0,
				content_txt: "",
				title: "",
				avatar: "",
				uid: 0,
				nick: "",
				time: "",
				end_flg: false,
				load_flg: false,
				reply_nick: "",
				reply_id: 0
			};
		}
		
		componentWillMount(){
			document.addEventListener('get_detail', function(event){
				var companyid = event.detail.companyid;
				var postid = event.detail.postid;
				var title = event.detail.title;
				var avatar = event.detail.avatar;
				var nick = event.detail.nick;
				var time = event.detail.time;
				var uid = event.detail.uid;

				page = 1;
				this.getarticle(companyid, postid);
				this.getcomment(companyid, postid, function(){});
				this.setState({
					companyid: companyid,
					postid: postid,
					title: title,
					avatar: avatar,
					nick: nick,
					time: time,
					uid: uid,
					end_flg: false,
					load_flg: false,
					reply_nick: "",
					reply_id: 0
				});
				mui.scrollTo(0,200);
			}.bind(this))
		}
		
		componentDidMount(){
			/**
			var companyid = '02caca650bc3b2d6a5fbbb19b9a76c5d';
			var postid = 95;
			var title = '我要发一个多图的帖子';
			var avatar = 'http://static.companyclub.cn/employee_201706231445247180.jpg';
			var nick = '赵鑫';
			var time = '2017-12-13';
			var uid = 1;
			
			page = 1;
			this.getarticle(companyid, postid);
			this.getcomment(companyid, postid);
			this.setState({
				companyid: companyid,
				postid: postid,
				title: title,
				avatar: avatar,
				nick: nick,
				time: time,
				uid: uid
			});
			**/
			var deceleration = mui.os.ios?0.003:0.0009;
			$('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: true, //是否显示滚动条
				deceleration:deceleration
			});

			mui(".post_detail").on("tap", ".mui-icon-extra-share", function(){
				this.refs.share.handleShare();
			}.bind(this));
			
			mui(".post_detail").on("tap", ".more", function(){
				this.handleLoadMore();
			}.bind(this));
			
			var that = this;
			mui(".post_detail").on("tap", ".reply", function(ev){
				mui("#saytext").keyboard();
				setTimeout(function(){
					document.getElementById("saytext").focus();
					mui.scrollTo(ev.detail.center.y - document.documentElement.clientHeight + mui(".comment")[0].offsetHeight, 200, function(){
						
					});
				},500);
				var nick = this.getAttribute("data-nick");
				var cid = this.getAttribute("data-cid");
				that.setState({
					reply_nick: nick,
					reply_id: cid
				});
			});
		}
		
		handleLoadMore(){
			if(!this.state.end_flg && !this.state.load_flg){
				this.setState({load_flg: true});
				page = page + 1;
				this.getcomment(this.state.companyid, this.state.postid, function(status, info, data){
					this.setState({
						load_flg: false,
						end_flg: data.length==0?true:false
					});
				}.bind(this));
			}
		}
		
		getcomment(companyid, postid, cb){
			var that = this;
			article.getcomments(that.props.uid, that.props.token,that.props.uuid, page, that.props.pnum, postid, companyid, that.props.dispatch, function(status, info, data){
	      		cb(status, info, data);
			}.bind(that));
		}
		
		getarticle(companyid, postid){
			article.getarticle(companyid, postid, this.props.uid, this.props.token,this.props.uuid, this.props.dispatch, function(data){
				this.bindhandleCare();

				function removeHTMLTag(str) {
		            str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
		            str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
		            //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
		            str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
		            str=str.replace(/\s/g,''); //将空格去掉
		            return str;
				}
		      	var images = [].slice.call(document.querySelectorAll('.content img'));
		      	var urls = [];
		      	images.forEach(function(item) {
		        	urls.push(item.src);
		      	});
		      	this.setState({
		      		thumbs: urls,
		      		thumb: urls[0],
		      		content_txt: removeHTMLTag(this.props.content).substr(0, 140)
		      	});
		      	mui('.content').off('tap', 'img').on('tap', 'img', function() {
		        	var index = images.indexOf(this);
		        	plus.nativeUI.previewImage(urls, {
		        		background: "#333333",
		          		current: index,
		          		loop: false,
		          		indicator: 'number'
		        	});
		      	});
			}.bind(this));
		}
		
		bindhandleCare(){
			var dispatch = this.props.dispatch;
			var uid = this.props.uid;
			var token = this.props.token;
			var uuid = this.props.uuid;
			var article_uid = this.props.article_uid;
			mui(".post_detail").on('tap','.care',function(){
				if(uid!=this.state.uid){
					user.toggleCare(uid,token,uuid,article_uid,dispatch);
				}
			}.bind(this))
		}
		
		handleSubmit(content){
			var dispatch = this.props.dispatch;
			var uid = this.props.uid;
			var token = this.props.token;
			var uuid = this.props.uuid;
			
			var that = this;
			var cb = function(){
				page = 1;
				that.setState({
					end_flg: false,
					load_flg: false,
					reply_nick: "",
					reply_id: 0	
				});
				article.getcomments(uid, token, uuid, 1, that.props.pnum, that.state.postid, that.state.companyid, dispatch, function(){
				}.bind(that));
			}
			
			if(content.length>0){
				if(this.state.reply_id > 0){
					//发表评论
					article.addreply(uid,token,uuid, this.state.postid, content, this.state.reply_id, dispatch, function(){
						cb()
					}.bind(this));
				}else{
					//发表评论
					article.addcomment(uid,token,uuid, this.state.postid, content, dispatch, function(){
						cb()
					}.bind(this));
				}
			}
		}
		
		render() {
			return ( 
				React.createElement("div", {className: "post_detail"}, 
					React.createElement("div", {className: "company"}, 
						React.createElement(Header, null, 
							React.createElement("a", {className: "mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"}), 
							React.createElement("h1", {className: "mui-title"}, "帖子详情"), 
						mui.os.plus?
							React.createElement("a", {className: "mui-icon mui-icon-extra mui-icon-extra-share mui-pull-right"})
						:null
						)
					), 
					React.createElement("h2", null, this.state.title), 
					React.createElement("div", {className: "userinfo"}, 
						React.createElement("div", {className: "avatar"}, 
							React.createElement("img", {src: this.state.avatar})
						), 
						React.createElement("div", {className: "column-box"}, 
							React.createElement("div", {className: "nick"}, 
								this.state.nick
							), 
							React.createElement("div", {className: "time"}, 
								this.state.time.split(" ")[0]
							)
						), 
					this.props.care_flg || this.state.uid == this.props.uid?
						React.createElement("div", {className: "care cared"}, 
							"已关注"
						)
					:
						React.createElement("div", {className: "care"}, 
							"+  关注"
						)
					
					), 
					React.createElement("div", {className: "content", dangerouslySetInnerHTML: {__html: this.props.content}}), 
				!this.props.is_hide_comment?
					React.createElement("div", {className: "comments"}, 
						React.createElement("div", {className: "mui-scroll-wrapper", id: "refreshContainer"}, 
							React.createElement("div", {className: "mui-scroll"}, 
								React.createElement("ul", {className: "mui-table-view"}, 
						this.props.comments.map(function(comment,index){
							return (
									React.createElement("li", {key: comment.id, className: "mui-table-view-cell comment"}, 
										React.createElement("div", {className: "avatar"}, 
											React.createElement("img", {src: comment.avatar})
										), 
										React.createElement("div", {className: "body"}, 
											React.createElement("span", {className: "nick"}, comment.nick), 
											React.createElement("span", {className: "comment_content", dangerouslySetInnerHTML: {__html: $.replace_em(comment.comment+(comment.to?("<br />@"+comment.to+"://"+comment.to_content):""))}}), 
											React.createElement("div", {className: "func"}, 
												React.createElement("span", {className: "time"}, comment.time.split(" ")[0]), 
												React.createElement("i", {"data-cid": comment.id, "data-nick": comment.nick, className: "reply"}, "回复")
											)
										)
									)
							)
						}.bind(this))
								)
							)
						), 
					!this.state.end_flg ?
						(this.state.load_flg ?
						React.createElement("span", {className: "more"}, "努力加载中...")
						:
						React.createElement("span", {className: "more"}, "点击加载更多")
						)
					: null
					)
				:null, 
				this.props.is_allow_comment?
					React.createElement(CommentBox, {handleSubmit: function(content){
						this.handleSubmit(content);
					}.bind(this), on_blur: function(content){
						if(content == ""){
							this.setState({
								reply_nick: "",
								reply_id: 0	
							});
						}
					}.bind(this), placeholder: this.state.reply_id?"回复"+this.state.reply_nick:"评论..."})
				:null, 
					React.createElement(Share, {title: this.state.title, content: this.props.content, content_text: this.state.content_txt, link: share.link+"post/"+this.state.companyid+"/"+this.state.postid, thumb: this.state.thumb, ref: "share"})
				)
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {
	  	uid: state.myuser.uid,
	  	token: state.myuser.token,
	  	uuid: state.myuser.uuid,
	  	commenttimes: state.article.commenttimes, //评论数量
	  	article_uid: state.article.userid, //作者uid
	  	content: state.article.content, //文章内容
	  	content_text: state.article.content_text, //文章内容
	  	comments: state.article.comments,//评论列表
	  	care_flg: state.user.employee_care_flg, //是否关注
	  	is_allow_comment: state.article.is_allow_comment, //是否允许评论
	  	is_hide_comment: state.article.is_hide_comment, //是否隐藏
	  	pnum: state.article.pnum, //每页显示评论数
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Post);
})