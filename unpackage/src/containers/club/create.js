'use strict'

define(['react', "react-redux","components/header",
	'actions/club',
	'jquery','jquery-browser','jquery-qqface',
	'css!./css/club_create'], function(React, ReactRedux, Header,
		club, jQuery){
	class Create extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				focus_flg: false,
				init_content: "记录我的生活",
				content: "",
				picker: null,
				upload_pics: [],
				link_info: {
					content:"",
					keywords:"",
					title:"",
					url: ""
				},
				list: [],
				event_type: -1
			}
		}
		
		componentWillMount(){
			window.addEventListener('show',function(event){
				var event_type = event.detail.event_type;
				this.handleEvent(event_type);
				this.setState({event_type: event_type,list: event.detail.data});
			}.bind(this))
			window.addEventListener('resize', this.onResize.bind(this), false);
		}
		
		handleEvent(event_type){
			if(event_type == 1){
				this.state.focus_flg= false;
				this.state.init_content= "记录我的生活";
				this.state.content= "";
				this.state.upload_pics= [];
				this.state.link_info= {
					content:"",
					keywords:"",
					title:"",
					url: ""
				};
				mui.later(function(){
					this.viewInit();
				}.bind(this), 1000);
			}else if(event_type == 2){
				var cmr = plus.camera.getCamera();
				cmr.captureImage(function(path){
					mui.later(function(){
						this.viewInit();
					}.bind(this), 1000);
					this.state.upload_pics.push({
						path: "file://" + plus.io.convertLocalFileSystemURL(path),
						upload_flg: false,
						url: ""
					});
			    	this.setState({
			    		event_type: 1,
			    		upload_pics: this.state.upload_pics
			    	});
			    	this.uploadFiles();
				}.bind(this), function(err) {
					mui.back();
				});
			}else if(event_type == 3){
			    plus.gallery.pick( function(e){
			    	var upload_pics = [];
			    	for(var i in e.files){
			    		upload_pics[i] = {
							path: e.files[i],
							upload_flg: false,
							url: ""
			    		}
			    	}
					mui.later(function(){
						this.viewInit();
					}.bind(this), 1000);
					
			    	this.setState({
			    		event_type: 1,
			    		upload_pics: upload_pics
			    	});
			    	this.uploadFiles();
			    }.bind(this), function ( e ) {
			    	mui.back();
			    }, {
			    	maximum:9, 
			    	multiple: true, 
			    	onmaxed: function(){
			    		plus.nativeUI.alert('最多选择9张照片');
			    	},
			    	selected: this.state.upload_pics,
			    	system: false
			    });
			}else if(event_type == 4){
				this.setUrl();
			}
		}
		
		onResize(){
			if(document.body.clientHeight<500){
				if(mui(".club_create .tbody .pics").length>0){
					mui(".club_create .tbody .pics")[0].style.display = "none";
				}
				if(mui(".club_create .qaarea").length>0){
					mui(".club_create .qaarea")[0].style.display = "none";
				}
			}else{
				if(mui(".club_create .tbody .pics").length>0){
					mui(".club_create .tbody .pics")[0].style.display = "flex";
				}
				if(mui(".club_create .qaarea").length>0){
					mui(".club_create .qaarea")[0].style.display = "block";
				}
			}
		}
		
		componentDidMount(){
			this.onResize();
		}
		
		viewInit(){
			this.setFace();
			this.setVisible();
			this.setPics();
			this.setCamera();
			this.setSubmit();
			this.state.picker = new mui.PopPicker(); 
			var result = [];
			for(var i=0; i<this.state.list.length; i++){
				var data = this.state.list;
				result[i] = {};
				result[i].value = data[i].id;
				result[i].text = '<i class="clubfriends '+data[i].icon+'"></i>'+data[i].name;
			}
			this.state.picker.setData(result);
		}

		uploadFiles(){
			for(var i=0; i<this.state.upload_pics.length; i++){
				var current_pic = this.state.upload_pics[i];
				if(!current_pic.upload_flg){
					var path = current_pic.path;
					plus.zip.compressImage({
							src:path,
							dst:"_doc/"+i+".jpg",
							overwrite: true,
							format: "jpg",
							quality:20
						},
						function(event) {
							club.uploadImg(this.props.uid, this.props.token, this.props.uuid, event.target, event.target.split("/").pop().split(".")[0], function(i, imgurl){
								this.state.upload_pics[i].url = imgurl;
								this.state.upload_pics[i].upload_flg = true;
								this.setState({
									upload_flg: this.state.upload_pics
								});
							}.bind(this));
						}.bind(this),function(error) {
							alert("Compress error!");
					});
				}	
			}
		}
		
		setUrl(){
			mui(".club_create").on("tap",".seturl", function(){
				mui(this.refs.url_content)[0].blur();
				if(mui(this.refs.url_content)[0].value && mui(this.refs.url_content)[0].value.substr(0, 4)=="http"){
					var url = mui(this.refs.url_content)[0].value;
					club.addLink(url, this.props.uid, this.props.token, this.props.uuid, function(data){
						this.setState({
							link_info: data,
							event_type: 1
						});
						mui.later(function(){
							this.viewInit();
						}.bind(this), 1000);
					}.bind(this));
				}
			}.bind(this));
		}
		
		setSubmit(){
			mui(".club_create").off("tap",".submit").on("tap",".submit", function(){
				mui("#display")[0].blur();
				var content = mui("#saytext")[0].value;
				var images = "";
				var that = this;
				if(content!="" || this.state.upload_pics.length>0){
					plus.nativeUI.showWaiting("正在提交,请耐心等待...");
				}
				var upload = function(content, images){
					if(content != ""){
						var visible = mui(that.refs.visible)[0].value;
						mui("#display")[0].innerHTML = that.state.init_content;
						mui("#display")[0].blur();
						that.setState({
							focus_flg: false,
							upload_pics: []
						});
						club.addTwitter(that.props.uid, that.props.token, that.props.uuid, visible, content, images, that.state.link_info.url, function(){
							plus.nativeUI.closeWaiting();
							mui.fire(plus.webview.getWebviewById("index.html/club"),"getTwitters");
							setTimeout(function () {
								mui.back();
							},150);
						});
					}
				}
				if(this.state.upload_pics.length>0){
					if(content==""){
						content = "上传了"+this.state.upload_pics.length+"张照片";
					}
					var watch_upload=self.setInterval(function(){
						images = "";
						var uploaded_num = 0;
						for(var i=0; i<this.state.upload_pics.length; i++){
							if(this.state.upload_pics[i].upload_flg == true){
								uploaded_num = uploaded_num + 1;
								images += this.state.upload_pics[i].url+",";
								if(uploaded_num == this.state.upload_pics.length){
									window.clearInterval(watch_upload);
									upload(content, images);
								}
							}
						}
					}.bind(this),1000);
				}else{
					upload(content, images);
				}
			}.bind(this));
		}
		
		setFace(){
		    jQuery("#emotion").qqFace({
		        assign:'saytext',
		        display: 'display',
		        path:'./js/lib/jquery-qqFace/arclist/',
		        id:"facebox",
		        total:72,
		        row:8,
		        cb: function(){
		        	jQuery(".mui-bar-tab").addClass("emotion");
		        }
		    });
		}
		
		setCamera(){
			var that = this;
			mui(".club_create").on("tap","#camera", function(){
				var cmr = plus.camera.getCamera();
				cmr.captureImage(function(path){
					that.state.upload_pics.push({
						path: "file://" + plus.io.convertLocalFileSystemURL(path),
						upload_flg: false,
						url: ""
					});
			    	that.setState({
			    		upload_pics: that.state.upload_pics
			    	});
			    	that.uploadFiles();
				}, function(err) {});
			})
		}
		
		setPics(){
			mui(".club_create").on("tap",".image-up", function(){
				plus.gallery.pick(function(path){
					this.state.upload_pics.push({
						path: path,
						upload_flg: false,
						url: ""
					});
			    	this.setState({
			    		upload_pics: this.state.upload_pics
			    	});
			    	this.uploadFiles();
				}.bind(this), function(e){
				},{
					system: false
				})
			}.bind(this));
			mui(".club_create").on("tap","#pics", function(){
			    plus.gallery.pick( function(e){
			    	var upload_pics = [];
			    	for(var i in e.files){
			    		upload_pics[i] = {
							path: e.files[i],
							upload_flg: false,
							url: ""
			    		}
			    	}
			    	this.setState({
			    		upload_pics: upload_pics
			    	});
			    	this.uploadFiles();
			    }.bind(this), function ( e ) {
			    	console.log( "取消选择图片" );
			    }, {
			    	maximum:9, 
			    	multiple: true, 
			    	onmaxed: function(){
			    		plus.nativeUI.alert('最多选择9张照片');
			    	},
			    	selected: this.state.upload_pics,
			    	system: false
			    });
			}.bind(this))
		}
		
		setVisible(){
			mui(".club_create").on("tap",".visible", function(){
 				this.state.picker.show(function (selectItems) {
 					mui(".visible")[0].innerHTML = selectItems[0].text + "<i class='caret'></i>";
    				mui(this.refs.visible)[0].value = selectItems[0].value;
  				}.bind(this))
			}.bind(this))
		}
		
		render(){
			return(
			<div className="club_create">
				{this.state.event_type==4?
				<div className="event_4">
					<Header>
						<h1 className="mui-title">
							分享文章
						</h1>
						<a className="mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"></a>
						<a className="mui-icon mui-pull-right seturl">确认</a>
					</Header>
					<h4 className="desc">请输入需要分享的文章URL</h4>
					<input ref="url_content" type="url" placeholder="完整url，http或https开头" />
					<section className="qaarea">
						<h4 className="question">Q:如何分享微信文章到同事圈?</h4>
						<p className="answer">
							在微信文章的详情页,点击右上角图标,在弹出的界面中,点击复制链接,即可获得文章的地址,粘贴到这里就行啦!^_^
							<img src="./js/containers/club/img/share.jpg" />
						</p>
					</section>
				</div>
				:
				<div>
					<Header>
						<h1 className="mui-title">
							记录生活
						</h1>
						<a className="mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"></a>
						<a className="mui-icon mui-pull-right submit">发送</a>
					</Header>
					<section className="header">
						<div className="avatar">
							<img src={this.props.avatar} />
						</div>
					{this.state.list.length>0?
						<div className="body">
							<input type="hidden" ref="visible" defaultvalue={this.state.list[0].id} />
							<span className="nick">{this.props.uname}</span>
							<span className="visible">
								<i className={"clubfriends "+this.state.list[0].icon}></i>
								{this.state.list[0].name}
								<i className="caret"></i>
							</span>
						</div>
					:null}
					</section>
					<section className="tbody">
						<p id="display"
							className={this.state.focus_flg || this.state.content!=""?"focus":""}
							contentEditable="true" 
							onFocus={()=>{
								this.setState({focus_flg: true});
								if(mui(".tbody p")[0].innerHTML == this.state.init_content){
									mui(".tbody p")[0].innerHTML = "";
								}
							}}
							onBlur={()=>{
								this.setState({focus_flg: false, content: (mui(".tbody p")[0].innerHTML==this.state.init_content?"":mui(".tbody p")[0].innerHTML.replace(/<img src=".\/js\/lib\/jquery-qqface\/arclist\/([0-9]*).gif" border="0">/g,"[em_$1]"))});
								if(mui(".tbody p")[0].innerHTML == ""){
									mui(".tbody p")[0].innerHTML = this.state.init_content;
								}
								mui("#saytext")[0].value = mui(".tbody p")[0].innerHTML==this.state.init_content?"":mui(".tbody p")[0].innerHTML.replace(/<img src=".\/js\/lib\/jquery-qqface\/arclist\/([0-9]*).gif" border="0">/g,"[em_$1]");
							}}>{this.state.init_content}</p>
					{this.state.link_info.title.length>0?
						<div className="link_box">
							<h4>{this.state.link_info.title}</h4>
						</div>
					:null}
					{this.state.upload_pics.length>0?
						<div className="pics">
					{this.state.upload_pics.map(function(item, index){
						return (
							<img src={item.path} className={item.upload_flg?"":"unupload"} />
						)
					}.bind(this))}
							<div className="image-up"></div>
						</div>
					:null}
						<textarea id="saytext">{this.state.content}</textarea>
					</section>
					<section className="footer mui-bar-tab">
						<span id="emotion" className="mui-icon clubfriends icon--biaoqing"></span>
						<span id="camera" className="mui-icon clubfriends icon--xiangjicopy2x" style={this.state.event_type == 1 && this.state.link_info.url.length>0 ? {display: "none"}: {display: "block"}}></span>
						<span id="pics" className="mui-icon clubfriends icon--tupian" style={this.state.event_type == 1 && this.state.link_info.url.length>0 ? {display: "none"}: {display: "block"}}></span>
					</section>
				</div>
				}
			</div>
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {
	  	uid: state.myuser.uid,
	  	token: state.myuser.token,
	  	uuid: state.myuser.uuid,
	  	avatar: state.myuser.avatar,
	  	uname: state.myuser.uname
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(Create);
});