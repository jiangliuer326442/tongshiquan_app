'use strict'

define(['react','react-redux',"components/header","./postbars","actions/common","config/index"], function(React, ReactRedux, Header, PostBars, common, config){
	class DisHeader extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				addpost_page: null
			};
		}
		
		componentDidMount(){
			//打开贴吧列表
			mui(".company").on('tap','.post-bar-trigger',function(){
				this.state.addpost_page = mui.preload({
			    	url:"index.html#/discuz/addpost",
			    	id:"discuz_addpost",
				})
				mui(".discuz_postbars")[0].style.visibility = "visible";
				mui(".discuz_postbars .bars").addClass("show")
				mui(".discuz_postbars .bars").removeClass("hide")
			}.bind(this))
		}
		
		sendpost(){
		  	//触发详情页面的newsId事件
		  	mui.fire(this.state.addpost_page,'init',{
		    	companyid: this.props.companyid,
		    	barid: this.props.postbars[this.props.selected_bar].id
		  	});
			//打开详情页面          
		  	mui.openWindow({
		    	id:'discuz_addpost'
		  	});
		}
		
		render(){
			return (
				<div className="company">
					<Header>
						<a className="post-bar-trigger mui-action-menu mui-icon mui-pull-left">贴吧</a>
					{this.props.selected_bar == -1 ?
						<a className="mui-action-menu mui-icon mui-icon-plusempty mui-pull-right" href="#topPopover"></a>
						:
					( this.props.postbars[this.props.selected_bar].can_post_flg || this.props.postbars[this.props.selected_bar].leaderid==this.props.uid?
						<a className="mui-action-menu mui-icon mui-pull-right" onClick={this.sendpost.bind(this)}>发帖</a>
					:null)
					}
						<h1 className="mui-title">
						{this.props.selected_bar == -1 ?
							<span>企业贴吧</span>
							:
							<span>{this.props.postbars[this.props.selected_bar].name}</span>
						}
						</h1>
					</Header>
					<PostBars companyid={this.props.companyid} />
					<div id="topPopover" className="mui-popover">
						<div className="mui-popover-arrow"></div>
						<div className="mui-scroll-wrapper">
							<div className="mui-scroll">
								<ul className="mui-table-view">
									<li className="mui-table-view-cell">
										<a href="#">发表的帖子</a>
									</li>
									<li className="mui-table-view-cell"><a href="#">参与的评论</a>
									</li>
									<li className="mui-table-view-cell"><a href="#">收到的回复</a>
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
	  	postbars: state.cmpdiscuz.postbars,
	  	selected_bar: state.cmpdiscuz.current,
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(DisHeader);
})