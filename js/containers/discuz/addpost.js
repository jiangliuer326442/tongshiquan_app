'use strict'

define(['react', "react-redux",
	"actions/common","config/index","wangeditor","components/header",
	"actions/cmpdiscuz",
	'css!./css/addpost'], function(React, ReactRedux, common, config, E, Header,
		cmpdiscuz){
	var oglHeight;
	var editor;
	class AddPost extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				keyboard_flg: false,
				title_flg: false,
				keyboar_size: 0,
				title: "",
				companyid: "",
				barid: 0
			}
		}
		
		componentWillMount(){
			document.addEventListener('init', function(event){
				this.state.companyid = event.detail.companyid;
				this.state.barid = event.detail.barid;
			}.bind(this));
		}
		
		componentDidMount(){
			editor = new E('.toolbar','.editor');
			editor.customConfig.debug = location.href.indexOf('wangeditor_debug_mode=1') > 0;
			editor.customConfig.zIndex = 1;
		    // 自定义菜单配置
		    editor.customConfig.menus = [
			    'head',  // 标题
			    'link',  // 插入链接
			    'list',  // 列表
			    'justify',  // 对齐方式
			    'image',  // 插入图片
			    'undo',  // 撤销
			    'redo'  // 重复
		    ]

		    // 将图片大小限制为 10M
		    editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024;
		    editor.customConfig.uploadImgMaxLength = 3;
			editor.customConfig.customAlert = function (info) {
			    // info 是需要提示的内容
			    mui.alert(info,"上传错误")
			}
			if(mui.os.plus){
				editor.customConfig.customUploadImg = function (files, insert) {
					mui.each(files,function(index,file){
						var task = plus.uploader.createUpload( editor.customConfig.uploadImgServer, {}, function ( t, status ) {
							// 上传完成
							if ( status == 200 ) {
								var imgUrl = JSON.parse(t.responseText).data[0];
							    // files 是 input 中选中的文件列表
							    // insert 是获取图片 url 后，插入到编辑器的方法
							
							    // 上传代码返回结果之后，将图片插入到编辑器中
							    insert(imgUrl);
								console.log( "Upload success: " + imgUrl );
							} else {
								console.log( "Upload failed: " + status );
							}
						});
					  	task.addFile( file, {key:editor.customConfig.uploadFileName} );
						task.start();
					})
				}
			}
			//editor.customConfig.uploadImgShowBase64 = true;	
			editor.customConfig.uploadImgServer = config.server+'imageup.jsp';
			editor.customConfig.uploadFileName = 'upfile';
		    editor.customConfig.showLinkImg = false
    		editor.create();
    		if(mui.os.plus){
	    		oglHeight = plus.android.invoke(plus.android.currentWebview(),"getHeight");
	    		window.addEventListener("resize",function(){
	    			var tempHeight = plus.android.invoke(plus.android.currentWebview(),"getHeight");
				    if(tempHeight == oglHeight) {
				        this.setState({"keyboard_flg": false});
				    } else {
				    	var screen_height = plus.screen.resolutionHeight*plus.screen.scale;
				    	var top_height = plus.navigator.getStatusbarHeight();
				    	var input_height = (screen_height - top_height - tempHeight)/plus.screen.scale;
				        this.setState({"keyboard_flg": true, "keyboar_size": input_height});
				    }
	    		}.bind(this));
    		}
    		mui(".addpost").on("tap",".addpost-triggler", this.addPost.bind(this))
		}
		
		addPost(){
			var companyid = this.state.companyid;
			var barid = this.state.barid;
			var title = this.state.title;
		    if(title.length<4 || title.length>50){
		      mui.alert('标题长度不合规范',"错误提示");
		      return false;
		    }
		    var content = editor.txt.html().replace(/'/g,'\\\'');
		    var content_txt = editor.txt.text();
		    if(content_txt.length<4 || content_txt.length>2000){
		      mui.alert('文章长度不合规范',"错误提示");
		      return false;
		    }
			cmpdiscuz.addpost( barid, title, content, content_txt, this.props.uid, this.props.token, this.props.uuid, function(){
				editor.txt.clear();
				this.setState({"title":""});
				cmpdiscuz.getsectionposts(companyid, barid, 1, 10, this.props.dispatch, function(status, info, data){
					mui.fire(plus.webview.getWebviewById("index.html/discuz/"+companyid), 'getsectionposts', {
						companyid: companyid,
						barid: barid,
					});
					setTimeout(function () {
						plus.webview.getLaunchWebview().show();
					},150);
				});
			}.bind(this));
		}
		
		handleChange(event){
			this.setState({"title": event.target.value});
		}
		
		handleFocus(){
			this.state.title_flg = true;
		}
		
		handleBlur(){
			this.state.title_flg = false;
		}
		
		render() {
			return ( 
				React.createElement("div", {className: "addpost"}, 
				!this.state.keyboard_flg?
					React.createElement(Header, null, 
						React.createElement("a", {className: "mui-icon mui-action-back mui-pull-left"}, "关闭"), 
						React.createElement("h1", {className: "mui-title"}, "发帖"), 
						React.createElement("button", {type: "button", className: "addpost-triggler mui-btn mui-btn-primary  mui-pull-right"}, "发表")
					)
				:null, 
				!this.state.keyboard_flg || this.state.title_flg?
					React.createElement("input", {ref: "title", onChange: this.handleChange.bind(this), onFocus: this.handleFocus.bind(this), style: this.state.keyboard_flg?{marginTop:"10px"}:{}, onBlur: this.handleBlur.bind(this), type: "text", value: this.state.title, className: "post_title", placeholder: "一句话描述一下帖子内容"})
				:null, 	
					React.createElement("div", {className: "editarea"}, 
						React.createElement("div", {className: "toolbar", style: this.state.keyboard_flg && !this.state.title_flg?{position: "fixed",top:"0",zIndex:"3"}:{}}), 
						React.createElement("div", {className: "editor", style: this.state.keyboard_flg && !this.state.title_flg?{marginTop:"32px",height:(plus.android.invoke(plus.android.currentWebview(),"getHeight")/plus.screen.scale-35)+"px"}:{}}
						)
					)
				)
			)
		}
	}
	
	function mapStateToProps(state) {
	  return {
	  	uid: state.myuser.uid,
	  	token: state.myuser.token,
	  	uuid: state.myuser.uuid,
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(AddPost);
})