'use strict'

define(['react', "react-redux","components/header","config/index",'components/article/share','actions/article','actions/share','css!./css/article'], function(React, ReactRedux, Header, config, Share, article, share){
	class Article extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				companyid: "",
				postid: 0,
				title: "",
				thumb: "",
				content_txt: "",
				page: 1,
			};
		}
		
		componentWillMount(){
			document.addEventListener('jump',function(event){
			  //通过event.detail可获得传递过来的参数内容
			  var url = event.detail.url;
			  config.history.push(url);
			});
			
			document.addEventListener('get_detail', function(event){
				var companyid = event.detail.companyid;
				var postid = event.detail.postid;
				var title = event.detail.title;
				article.getarticle(companyid, postid, this.props.uid, this.props.token,this.props.uuid, this.props.dispatch, function(data){
			      	this.setState({
			      		thumb: event.detail.thumb,
			      		content_txt: event.detail.desc.substr(0, 140)
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
				article.getarticles(postid, this.state.page, this.props.pnum, this.props.dispatch, function(list, num){} );
				this.setState({
					companyid: companyid,
					postid: postid,
					title: title
				});
				mui.scrollTo(0,200);
			}.bind(this));
			
			mui.back = function(){
				plus.webview.hide(plus.webview.currentWebview());
			}
		}
		
		componentDidMount(){
			var that = this;
			/**
			that.setState({
				companyid: "02caca650bc3b2d6a5fbbb19b9a76c5d",
				postid: 64,
				title: "123456",
			});
			article.getarticles(64, this.state.page, this.props.pnum, this.props.dispatch, function(list, num){} );
			**/
			mui(".article").on("tap", ".mui-icon-extra-share", function(){
				this.refs.share.handleShare();
			}.bind(this));
			mui(".articlelist").on("tap", "a", function(){
				var aid = this.getAttribute("data-aid");
				var title = this.getAttribute("title");
				mui.fire(plus.webview.currentWebview(), "get_detail", {
					companyid: that.state.companyid,
					postid: aid,
					title: title
				});
			});
		}
		
		render(){
			return (
				<div className="article">
					<div className="company">
						<Header>
							<a className="mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"></a>
							<a className="mui-icon mui-icon-extra mui-icon-extra-share mui-pull-right"></a>
						</Header>
					</div>
					<h2>
					{this.state.title}
					</h2>
					<div className="content" dangerouslySetInnerHTML={{__html: this.props.content}}>
						
					</div>
					<div className="articlelist">
						<h3>相关文章</h3>
						<ul>
					{this.props.alist.map(function(item, index){
						return (
							<li>
								<a title={item.title} data-aid={item.id}>
									{item.title}
								</a>
							</li>
						)
					}.bind(this))}
						</ul>
					</div>
					<Share title={this.state.title} content={this.props.content} content_text={this.state.content_txt} link={share.link+"post/"+this.state.companyid+"/"+this.state.postid} thumb={this.state.thumb.length>7?this.state.thumb:""} ref="share" />
				</div>
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {
	  	uid: state.myuser.uid,
	  	token: state.myuser.token,
	  	uuid: state.myuser.uuid,
	  	commenttimes: state.article.commenttimes, //评论数量
	  	content: state.article.content, //文章内容
	  	content_text: state.article.content_text, //文章内容
	  	comments: state.article.comments,//评论列表
	  	pnum: state.article.pnum, //每页显示评论数
	  	alist: state.article.alist, //相关文章数量
	  	anum: state.article.anum
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Article);
});