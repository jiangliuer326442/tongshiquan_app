'use strict'

define(['react', "react-redux", "config/index",
	"components/company/cmpheader",
	"components/common/img",
	"actions/company",
	"actions/cmpnotice",
	"actions/version",
	'css!./css/company'], function(React, ReactRedux, config,
		CmpHeader,
		Img,
		company,
		cmpnotice,
		version){
	
	class Company extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				article_detail: null
			};
		}

		componentWillMount(){
			//预加载详情页
			this.state.article_detail = mui.preload({
				url: 'index.html#/article',
				id: 'detail_article',
			});
			
			document.addEventListener('onShow', function(){
				mui.fire(plus.webview.getWebviewById("detail_article"), "jump", {
					url: "/article"
				});
			});
			
			document.addEventListener('refresh', function(event){
				var companyid = event.detail.companyid;
				var dispatch = this.props.dispatch;
				cmpnotice.getfarticle(companyid, dispatch);
				cmpnotice.getoarticle(companyid, this.props.onotice_size, dispatch, function(){
					mui(".company>.othernotice>.tab_box").off('tap','li').on('tap','li', function(){
						var index = this.getAttribute("data-index");
						cmpnotice.setsltmodle(index, dispatch);
					});
					if(mui.os.plus){
						plus.navigator.closeSplashscreen();
					}
				})
			}.bind(this));
		}
		
		componentDidMount(){
			mui.fire(plus.webview.currentWebview(), 'refresh', {
				companyid: this.props.params.companyid,
			});
			//检查版本更新
			if(mui.network_flg() && (!mui.getItem("last_ckversion_time") || (mui.getItem("last_ckversion_time")<(Date.parse(new Date())-24*3600*1000)))){
				mui.later(function(){
					version.ckversion();
				}, 5000);
				mui.setItem("last_ckversion_time", Date.parse(new Date()));
			}
		}
		
		jumpArticle(articleid, articletitle, thumb, desc){
			mui.fire(this.state.article_detail, 'get_detail', {
				companyid: this.props.params.companyid,
				postid: articleid,
				title: articletitle,
				thumb: 'http:'+thumb,
				desc: desc
			});
			setTimeout(function() {
				this.state.article_detail.show("slide-in-right", 300);
			}.bind(this),300);
		}
		
		render() {
			return ( 
				<div className="company">
					<CmpHeader companyid={this.props.params.companyid} />
					<div className="farticle">
			{this.props.fnotice_list.map(function(item, index){
				return (
					item.thumb.length>10 ?
						<div onClick={this.jumpArticle.bind(this, item.id, item.title, item.thumb, item.desc)} className="article_with_thumb">
							<div className="title">{item.title.substring(0,20)}</div>
							<div className="thumb">
								<Img src={"http:"+item.thumb} folder="notice" placeholder="./js/containers/img/120_90.png" />
							</div>
						</div>
					:
						<div onClick={this.jumpArticle.bind(this, item.id, item.title, "", item.desc)} className="article_without_thumb">
							<div className="title">{item.title.substring(0,20)}</div>
							<p className="desc">
								{item.desc}
							</p>
						</div>
				)
			}.bind(this))}
					</div>
					<div className="othernotice">
						<ul className="tab_box">
				{
					this.props.onotice_list.map(function(item, index){
						return (
							<li data-index={index} className={this.props.onotice_selected==index?"current":""}>{item.name}</li>
						)
					}.bind(this))
				}
						</ul>
						<div className="articlelist">
				{this.props.onotice_list.length>0?
					this.props.onotice_list[this.props.onotice_selected].list.map(function(item, index){
						return (
							<div onClick={this.jumpArticle.bind(this, item.id, item.title, item.thumb, item.desc)} className="article">
								<div className="thumb">
									<img src={"http:"+item.thumb} />
								</div>
								<div className="texts">
									<h3>
										<a>{item.title}</a>
									</h3>
									<article>
										{item.desc}
									</article>
								</div>
							</div>
						)
					}.bind(this))
				:null}
						</div>
					</div>
				</div>
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {
	  	fnotice_list: state.cmpnotice.fmodel.list,
	  	onotice_size: state.cmpnotice.size,
	  	onotice_list: state.cmpnotice.omodel,
	  	onotice_selected: state.cmpnotice.selected
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Company);
})