'use strict'

define(['actions/reglog'], function(reglog){
	
	var util = {
		options: {
			ACTIVE_COLOR: "#FFAC38",
			NORMAL_COLOR: "#929292",
			subpages: [
				"index.html#/chat",
				"index.html#/discuz/"+mui.getItem("companyid"), 
				"index.html#/club",
				"index.html#/ucenter"
			]
		},
		/**
		 *  简单封装了绘制原生view控件的方法
		 *  绘制内容支持font（文本，字体图标）,图片img , 矩形区域rect
		 */
		drawNative: function(id, styles, tags) {
			var view = new plus.nativeObj.View(id, styles, tags);
			return view;
		},
		/**
		 * 初始化首个tab窗口 和 创建子webview窗口 
		 */
		initSubpage: function(aniShow) {
			var subpage_style = {
					top: 0,
					bottom: 51
				},
				subpages = util.options.subpages,
				self = plus.webview.currentWebview(),
				temp = {};
				
			//兼容安卓上添加titleNView 和 设置沉浸式模式会遮盖子webview内容
			if(mui.os.android) {
				if(plus.navigator.isImmersedStatusbar()) {
					subpage_style.top += plus.navigator.getStatusbarHeight();
				}
				if(self.getTitleNView()) {
					subpage_style.top += 40;
				}
				
			}
	
			// 初始化第一个tab项为首次显示
			temp[self.id] = "true";
			mui.extend(aniShow, temp);
	
			for(var i = 0, len = subpages.length; i < len; i++) {
	
				if(!plus.webview.getWebviewById(subpages[i].replace("#",""))) {
					var sub = plus.webview.create(subpages[i], subpages[i].replace("#",""), subpage_style);
					//初始化隐藏
					sub.hide();
					// append到当前父webview
					self.append(sub);
				}
			}
		},
		/**	
		 * 点击切换tab窗口 
		 */
		changeSubpage: function(targetPage, activePage, aniShow) {
			if(aniShow[targetPage]){
				plus.webview.show(targetPage);
				mui.fire(targetPage, 'onShow');
			}else{
				mui.fire(targetPage, 'onShow');
				mui.fire(targetPage, 'onLoad');
				//否则，使用fade-in动画，且保存变量
				var temp = {};
				temp[targetPage] = "true";
				mui.extend(aniShow, temp);
				mui.later(function(){
					if(mui.os.ios){
						plus.webview.show(targetPage);
					}else{
						plus.webview.show(targetPage, "fade-in", 300);
					}
				}, 500);
			}
			//隐藏当前 除了第一个父窗口
			if(activePage !== plus.webview.getLaunchWebview()) {
				plus.webview.hide(activePage);
			}
		},
		/**
		 * 点击重绘底部tab （view控件）
		 */
		toggleNview: function(currIndex) {
			for(var i=0; i<nav_array.length-1; i++){
				var index = Math.floor(i/2);
				var obj = nav_array[i];
				if(index == currIndex){
					obj.textStyles.color = util.options.ACTIVE_COLOR;
				}else{
					obj.textStyles.color = util.options.NORMAL_COLOR;
				}
				nav_array[i] = obj;
			}
			var self = plus.webview.currentWebview();
			self.updateSubNViews([{
				id: "tabBar",
				tags: nav_array
			}]);
		},
	};
	
	var nav_array = [{
		tag: "font",
		id: "indexIcon",
		text: "\ue613",
		position: {
			top: "4px",
			left: "0",
			width: "25%",
			height: "24px"
		},
		textStyles: {
			family: "clubfriends",
			fontSrc: "_www/fonts/iconfont.ttf",
			align: "center",
			size: "24px",
			color: util.options.NORMAL_COLOR
		}
	}, {
		"tag": "font",
		"id": "indexText",
		"text": "聊天",
		"position": {
			"top": "23px",
			left: "0",
			width: "25%",
			"height": "24px"
		},
		"textStyles": {
			align: "center",
			size: "10px",
			color: util.options.NORMAL_COLOR
		}
	},{
		"tag": "font",
		"id": "newsIcon",
		"text": "\ue68a",
		"position": {
			"top": "4px",
			left: "20%",
			width: "25%",
			"height": "24px"
		},
		"textStyles": {
			family: "clubfriends",
			fontSrc: "_www/fonts/iconfont.ttf",
			align: "center",
			size: "24px",
			color: util.options.NORMAL_COLOR
		}
	}, {
		"tag": "font",
		"id": "newsText",
		"text": "贴吧",
		"position": {
			"top": "23px",
			left: "20%",
			width: "25%",
			"height": "24px"
		},
		"textStyles": {
			align: "center",
			size: "10px",
			color: util.options.NORMAL_COLOR
		}
	},{
		"tag": "font",
		"id": "contactIcon",
		"text": "\ue60a",
		"position": {
			top: "4px",
			left: "55%",
			width: "25%",
			height: "24px"
		},
		"textStyles": {
			family: "clubfriends",
			fontSrc: "_www/fonts/iconfont.ttf",
			align: "center",
			size: "24px",
			color: util.options.NORMAL_COLOR
		}
	}, {
		"tag": "font",
		"id": "contactText",
		"text": "圈子",
		"position": {
			top: "24px",
			left: "55%",
			width: "25%",
			height: "24px"
		},
		"textStyles": {
			align: "center",
			size: "10px",
			color: util.options.NORMAL_COLOR
		}
	},{
		"tag": "font",
		"id": "newwindowIcon",
		"text": "\ue101",
		"position": {
			top: "4px",
			left: "75%",
			width: "25%",
			height: "24px"
		},
		"textStyles": {
			family: "clubfriends",
			fontSrc: "_www/fonts/mui.ttf",
			align: "center",
			size: "24px",
			color: util.options.NORMAL_COLOR
		}
	}, {
		"tag": "font",
		"id": "newwindowText",
		"text": "用户",
		"position": {
			top: "24px",
			left: "75%",
			width: "25%",
			height: "24px"
		},
		"textStyles": {
			align: "center",
			size: "10px",
			color: util.options.NORMAL_COLOR
		}
	},
	{
		"tag": "rect",
		"id": "tabBorder",
		"position": {
			"top": "0",
			"left": "0",
			width: "100%",
			"height": "1px"
		},
		"rectStyles": {
			"color": "#ccc"
		}
	}]
	
	var nav = {};
	nav.init = function(){
		var self = plus.webview.currentWebview(),
			leftPos = Math.ceil((window.innerWidth - 60) / 2); // 设置凸起大图标为水平居中
		//底部导航
		var launchwebview = util.drawNative('tabBar', {
			bottom: "0px",
			left: "0",
			height: "50px",
			width: "100%",
			backgroundColor: "#fff"
		}, nav_array);

		/**	
		 * drawNativeIcon 绘制带边框的半圆，
		 * 实现原理：
		 *   id为bg的tag 创建带边框的圆
		 *   id为bg2的tag 创建白色矩形遮住圆下半部分，只显示凸起带边框部分
		 * 	 id为iconBg的红色背景图
		 *   id为icon的字体图标
		 *   注意创建先后顺序，创建越晚的层级越高
		 */
		var drawNativeIcon = util.drawNative('icon', {
			bottom: '5px',
			left: leftPos + 'px',
			width: '60px',
			height: '60px'
		}, [{
			tag: 'rect',
			id: 'bg',
			position: {
				top: '1px',
				left: '0px',
				width: '100%',
				height: '100%'
			},
			rectStyles: {
				color: '#fff',
				radius: '50%',
				borderColor: '#ccc',
				borderWidth: '1px'
			}
		}, {
			tag: 'rect',
			id: 'bg2',
			position: {
				bottom: '-0.5px',
				left: '0px',
				width: '100%',
				height: '45px'
			},
			rectStyles: {
				color: '#fff'
			}
		}, {
			tag: 'rect',
			id: 'iconBg',
			position: {
				top: '5px',
				left: '5px',
				width: '50px',
				height: '50px'
			},
			rectStyles: {
				color: util.options.ACTIVE_COLOR,
				radius: '50%'
			}
		}, {
			tag: 'font',
			id: 'icon',
			text: '\ue60e', //此为字体图标Unicode码'\e600'转换为'\ue600'
			position: {
				top: '0px',
				left: '5px',
				width: '50px',
				height: '100%'
			},
			textStyles: {
				family: "clubfriends",
				fontSrc: "_www/fonts/iconfont.ttf",
				align: 'center',
				color: '#fff',
				size: '30px'
			}
		}]);
		// append 到父webview中
		self.append(launchwebview);
		self.append(drawNativeIcon);
		
		// 创建子webview窗口 并初始化
		var aniShow = {};
		util.initSubpage(aniShow);
		
		var nview = plus.nativeObj.View.getViewById('tabBar'),
			activePage = plus.webview.currentWebview(),
			targetPage,
			subpages = util.options.subpages,
			pageW = window.innerWidth,
			currIndex = 0;
			
		mui.back = function(){
			reglog.quit();
		}
			
		
		drawNativeIcon.addEventListener('click', function(e) {
			targetPage = plus.webview.currentWebview();
			
			if(targetPage == activePage) {
				return;
			}

			//底部选项卡切换
			//util.toggleNview(currIndex);
			// 子页面切换
			util.changeSubpage(targetPage, activePage, aniShow);
			//更新当前活跃的页面
			activePage = targetPage;
		});
			
		/**
		 * 根据判断view控件点击位置判断切换的tab
		 */
		nview.addEventListener('click', function(e) {
			var clientX = e.clientX;
			if(clientX > 0 && clientX <= parseInt(pageW * 0.25)) {
				currIndex = 0;
			} else if(clientX > parseInt(pageW * 0.25) && clientX <= parseInt(pageW * 0.45)) {
				currIndex = 1;
			} else if(clientX > parseInt(pageW * 0.45) && clientX <= parseInt(pageW * 0.8)) {
				currIndex = 2;
			} else {
				currIndex = 3;
			}
			// 匹配对应tab窗口	
			targetPage = plus.webview.getWebviewById(subpages[currIndex].replace("#",""));

			if(targetPage == activePage) {
				return;
			}

			//底部选项卡切换
			util.toggleNview(currIndex);
			// 子页面切换
			util.changeSubpage(targetPage, activePage, aniShow);
			//更新当前活跃的页面
			activePage = targetPage;
		});
	}
	
	return nav;
})