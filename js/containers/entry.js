'use strict'

define(['react', 'react-redux', "config/index", "actions/common", "actions/nav", 'css!./css/main'], function(React, ReactRedux, config, common, nav){
	class Main extends React.Component {
		componentWillMount(){
			//初始化网络
			common.initNetwork();
			mui.back = function(){
				plus.runtime.quit();
			}
			if(this.props.uid>0 && mui.getItem("companyid") != ""){
				config.history.push("/company/"+mui.getItem("companyid"));
				nav.init();
			}else{
				mui.init({
				  preloadPages:[
				    {
					    url: "index.html#/reg/login",
					    id:"reg_login",
					    event: "loaded",
					    show:{
					    	aniShow: "slide-in-bottom"
					    },
					    waiting: {
					    	autoShow: false
					    }
				    },{
					    url: "index.html#/reg/putcompany",
					    id:"reg_putcompany",
					    event: "loaded",
					    waiting: {
					    	autoShow: false
					    }
				    }
				  ]
				});
			}
			//处理关闭页面
			mui.back = function(event){
				if(mui.os.plus){
    				plus.runtime.quit()
				}
			}
		}
		
		componentDidMount(){
			this.bindEvent();
		}
		
		//绑定事件
		bindEvent(){
			mui(".main").on('tap','.btnregister', this.handleRegister.bind(this));
			mui(".main").on('tap','.btnlogin', this.handleLogin.bind(this));
		}
		
		handleLogin(){
			mui.openWindowWithTitle(plus.webview.getWebviewById("reg_login"),{
			    id:"login",//导航栏ID,默认为title,若不指定将会使用WebviewOptions中指定的 [webviewID+ "_title"] 作为id
			    height:"44px",//导航栏高度值
			    backgroundColor:"#ffffff",//导航栏背景色
			    bottomBorderColor:"#ffffff",//底部边线颜色
			    back:{//左上角返回箭头
			        image:{//图片格式
			            base64Data:'',//加载图片的Base64编码格式数据 base64Data 和 imgSRC 必须指定一个.否则不显示返回箭头
			            imgSrc:'./js/containers/register/img/return.png',//要加载的图片路径
			            sprite:{//图片源的绘制区域，参考：http://www.html5plus.org/doc/zh_cn/nativeobj.html#plus.nativeObj.Rect
			                top:'0px',
			                left:'0px',
			                width:'100%',
			                height:'100%'
			            },
			            position:{//绘制图片的目标区域，参考：http://www.html5plus.org/doc/zh_cn/nativeobj.html#plus.nativeObj.Rect
			                top:"10px",
			                left:"10px",
			                width:"24px",
			                height:"24px"
			            }
			        }
			    }
			});
		}
		
		handleRegister(){
			plus.webview.getWebviewById("reg_putcompany").show("slide-in-right", 300);
			setTimeout(function(){
				mui.fire(plus.webview.getWebviewById("reg_putcompany"), 'show_putcompany', {});
			},500);
		}
		
		render() {
			return ( 
			 	React.createElement("div", {className: "main"}, 
			 		/**登录按钮**/
			 		React.createElement("input", {type: "button", className: "btn btnlogin", value: "登录"}), 
			 		/**注册按钮**/
			 		React.createElement("input", {type: "button", className: "btn btnregister", value: "注册"})
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
	
	return ReactRedux.connect(mapStateToProps)(Main);
})
