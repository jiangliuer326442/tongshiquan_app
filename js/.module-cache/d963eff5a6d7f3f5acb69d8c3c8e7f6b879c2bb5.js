'use strict'

define(['react', "react-redux","wangeditor","config/index","components/header","actions/article","css!./css/createarticle"], function(React, ReactRedux, E, config, Header, article){
	var editor;
	
	class CreateArticle extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				keyboard_flg: false,
				title_flg: false,
				desc_flg: false,
				title: "",
				desc: ""
			}
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
	    		var oglHeight = plus.android.invoke(plus.android.currentWebview(),"getHeight");
	    		window.addEventListener("resize",function(){
					if(document.documentElement.clientHeight<500){
						plus.nativeObj.View.getViewById('tabBar').hide();
						plus.nativeObj.View.getViewById('icon').hide();
						this.setState({"keyboard_flg": true});
					}else{
						plus.nativeObj.View.getViewById('tabBar').show();
						plus.nativeObj.View.getViewById('icon').show();
						this.setState({"keyboard_flg": false});
					}
	    		}.bind(this));
    		}
    		
    		mui(".createarticle-triggler")[0].addEventListener("tap", this.addArticle.bind(this));
		}
		
		addArticle(){
			var title = this.state.title;
			var desc = this.state.desc;
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
		    var date = new Date();
		    var showtime = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
		    article.addarticle(this.props.sectionid, title, desc, content, content_txt, this.props.is_allow_comment ? 1:0, this.props.is_hide_comment ? 1:0, 0, showtime, this.props.uid, this.props.token, this.props.uuid, function(){
		    	mui.toast("发表成功");
		    	mui.fire(plus.webview.getLaunchWebview(), "refresh", {
		    		companyid: this.props.companyid
		    	})
		    	editor.txt.clear();
		    	mui(this.refs.desc)[0].innerHTML = "";
		    	this.setState({
					title: "",
					desc: ""
		    	});
		    	mui.back();
		    }.bind(this));
		}
		
		handleChange1(event){
			this.setState({"title": event.target.value});
		}
		
		handleFocus1(){
			this.state.title_flg = true;
		}
		
		handleBlur1(){
			this.state.title_flg = false;
		}
		
		handleChange2(event){
			this.setState({"desc": event.target.value});
		}
		
		handleFocus2(){
			this.state.desc_flg = true;
		}
		
		handleBlur2(){
			this.state.desc_flg = false;
		}
		
		render(){
			return (
				React.createElement("div", {id: "createarticle", className: "createarticle mui-page"}, 
					React.createElement("header", {className: "mui-navbar-inner mui-bar mui-bar-nav"}, 
						React.createElement("h1", {className: "mui-title"}, 
							"发表文章"
						), 
						React.createElement("a", {className: "mui-icon mui-icon-arrowthinleft mui-action-back mui-pull-left"}), 
						React.createElement("button", {type: "button", className: "createarticle-triggler mui-btn mui-btn-primary  mui-pull-right"}, "发表")
					), 
					React.createElement("div", {className: "mui-content"}, 
						!this.state.keyboard_flg?
						React.createElement("p", null, "文章标题")
						:null, 
						!this.state.keyboard_flg || this.state.title_flg?
						React.createElement("div", {className: "row mui-input-row"}, 
							React.createElement("input", {type: "text", ref: "title", onChange: this.handleChange1.bind(this), onFocus: this.handleFocus1.bind(this), onBlur: this.handleBlur1.bind(this), value: this.state.title, placeholder: "文章标题"})
						)
						:null, 	
						!this.state.keyboard_flg?
					    React.createElement("p", null, "文章简介")
					    :null, 
						!this.state.keyboard_flg || this.state.desc_flg?
					    React.createElement("div", {className: "row mui-input-row desc"}, 
							React.createElement("textarea", {ref: "desc", onChange: this.handleChange2.bind(this), onFocus: this.handleFocus2.bind(this), onBlur: this.handleBlur2.bind(this), placeholder: "简单说明一下文章主旨"}, this.state.desc)
					    )
					    :null, 
						!this.state.keyboard_flg?
					    React.createElement("p", null, "文章内容")
					    :null, 
						React.createElement("div", {className: "editarea"}, 
							React.createElement("div", {className: "toolbar", style: this.state.keyboard_flg && !this.state.title_flg && !this.state.desc_flg?{position: "fixed",top:"50",zIndex:"3"}:{}}), 
							React.createElement("div", {className: "editor", style: this.state.keyboard_flg && !this.state.title_flg && !this.state.desc_flg?{marginTop:"32px",height:(plus.android.invoke(plus.android.currentWebview(),"getHeight")/plus.screen.scale-35)+"px"}:{}}
							)
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
	  	sectionid: state.admin.sectionid,
		is_allow_comment: state.admin.is_allow_comment,
		is_hide_comment: state.admin.is_hide_comment,
		leaderid: state.admin.leaderid,
		sort: state.admin.sort,
		companyid: state.myuser.companyid
	  }
	}
	
	return ReactRedux.connect(mapStateToProps)(CreateArticle);
})