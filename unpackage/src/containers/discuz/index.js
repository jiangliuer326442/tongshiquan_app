'use strict'

define(['react', "react-redux", "config/index",
	"components/discuz/disheader",
	"components/common/img",
	"actions/cmpdiscuz",
	'css!./css/discuz'
	], function(React, ReactRedux, config,
		DisHeader,
		Img,
		cmpdiscuz
	){
	var page = 1;
	class Discuz extends React.Component {
		
		componentWillMount(){
			document.addEventListener('onShow', function(){
				mui.fire(plus.webview.getWebviewById("detail_article"), "jump", {
					url: "/post"
				});
			});
			document.addEventListener('getsectionposts', function(event){
				var companyid = event.detail.companyid;
				var barid = event.detail.barid;
				cmpdiscuz.getsectionposts(companyid, barid, 1, 10, this.props.dispatch, function(){});
			}.bind(this));
		}
		
		componentDidMount(){
			this.pullRefresh();
		}
		
		pullRefresh(){
			var refresh_obj = "#refreshContainer";
			mui.init({
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
			      	if(this.props.selected_bar>=0){
						cmpdiscuz.getsectionposts(this.props.params.companyid, this.props.postbars[this.props.selected_bar].id, page, 10, this.props.dispatch, function(status,info,data){
				      		page = page+1;
				      		//重置上拉加载
				      		mui(refresh_obj).pullRefresh().refresh(true);
				      		if(mui.os.plus){
				      			mui(refresh_obj).pullRefresh().endPulldown(data.length==0?true:false);
				      		}else{
				      			mui(refresh_obj+" .mui-pull-top-pocket").removeClass("mui-visibility");
				      		}
						}.bind(this));
			      	}else{
				      	cmpdiscuz.getnewlyposts(this.props.params.companyid, page, 10, this.props.dispatch,function(status, info, data){
				      		if(mui.os.plus){
				      			mui(refresh_obj).pullRefresh().endPulldown(data.length==0?true:false);
				      		}else{
				      			mui(refresh_obj+" .mui-pull-top-pocket").removeClass("mui-visibility");
				      		}
				      	}.bind(this));
			      	}
			      }.bind(this)
			    },
			    up : {
			      height:50,//可选.默认50.触发上拉加载拖动距离
			      auto:true,//可选,默认false.自动上拉加载一次
			      contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
			      contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
			      callback :function(){
			      	if(this.props.selected_bar>=0){
						cmpdiscuz.getsectionposts(this.props.params.companyid, this.props.postbars[this.props.selected_bar].id, page, 10, this.props.dispatch, function(status,info,data){
				      		mui(refresh_obj).pullRefresh().endPullupToRefresh(data.length==0?true:false);
					      	page = page+1;
					      	this.bindJump();
						}.bind(this));
			      	}else{
				      	cmpdiscuz.getnewlyposts(this.props.params.companyid, page, 10, this.props.dispatch,function(status, info, data){
				      		mui(refresh_obj).pullRefresh().endPullupToRefresh(data.length==0?true:false);
					      	page = page+1;
					      	this.bindJump();
					      	mui.setItem("nav_1", "1");
				      	}.bind(this));
			      	}
			      }.bind(this)
			    }
			  }
			});
		}
		
		bindJump(){
			var that = this;
			mui("#refreshContainer").on('tap','.post',function() {
				var postid = this.getAttribute("data-id");
				var title = this.getAttribute("data-title");
				var avatar = this.getAttribute("data-avatar");
				var nick = this.getAttribute("data-nick");
				var time = this.getAttribute("data-time");
				var uid = this.getAttribute("data-uid");

				mui.fire(plus.webview.getWebviewById("detail_article"), 'get_detail', {
					companyid: that.props.params.companyid,
					postid:postid,
					title: title,
					avatar: avatar,
					nick: nick,
					uid: uid,
					time: time
				});
				setTimeout(function () {
					plus.webview.getWebviewById("detail_article").show("slide-in-right", 300);
				},150);
			});
		}
		
		render() {
			return ( 
				<div className="discuz">
					<DisHeader companyid={this.props.params.companyid} />
			{this.props.selected_bar>=0?
					<div className="postbarbox">
						<div className="logo">
							<img src={this.props.postbars[this.props.selected_bar].logo}/>							
						</div>
						<div className="mainbox">
							<p className="desc">
								{this.props.postbars[this.props.selected_bar].descs}				
							</p>
							<span className="author">
								{"版主："+this.props.postbars[this.props.selected_bar].leadername}
							</span>
						</div>
					</div>
			:null}
					<div id="refreshContainer" style={{marginTop: this.props.selected_bar==-1?"40px":"10px"}} className="posts">
						<div className="mui-scroll"></div>
						<div className="mui-content">
				{
					this.props.posts.map(function(item, index){
						return (
							<div data-id={item.id} data-uid={item.userid} data-title={item.title} data-avatar={item.user_avatar} data-nick={this.props.selected_bar>=0?item.user_nick:item.user_name} data-time={item.showtime} className="post mui-card">
								<div className="mui-card-header mui-card-media">
									<Img src={item.user_avatar} placeholder="./js/containers/img/60x60.gif" folder="avatar" />
									<div className="mui-media-body">
										{this.props.selected_bar>=0?item.user_nick:item.user_name}
										<p>{"发表于 "+item.showtime}</p>
									</div>
								</div>
								<div className="mui-card-content">
									<div className="mui-card-content-inner">
										{item.title}
									</div>
								</div>
								<div className="mui-card-footer">
									<span className="readtimes">{"阅读（"+item.readtimes+"）"}</span>
									<span className="commenttimes">{"评论（"+item.commenttimes+"）"}</span>
								</div>
							</div>
						)
					}.bind(this))
				}
						</div>
					</div>
				</div>
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {
	  	posts: state.cmpdiscuz.articles,
	  	postbars: state.cmpdiscuz.postbars,
	  	selected_bar: state.cmpdiscuz.current
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Discuz);
})