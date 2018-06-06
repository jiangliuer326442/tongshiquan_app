'use strict'

define([], function(){
	
	var share = {
		init: function(cb){
			if(mui.os.plus){
				// 扩展API加载完毕，现在可以正常调用扩展API
				plus.share.getServices( function(s){
					var shareArr = [];
					for(var i=0; i<s.length; i++){
						shareArr[s[i].id] = s[i];
					}
					typeof(cb) == "function" && cb(shareArr);
				}.bind(this), function(e){
					alert( "获取分享服务列表失败："+e.message );
				} );
			}
		},
		shareWebibo(shareArr, title, desc, thumb, link, cb){
			var s = shareArr.sinaweibo;
			var shareMessage = function(s){
				typeof(cb)=="function" && cb();
				var dtask = plus.downloader.createDownload( thumb, {
					filename: "_downloads/",
				}, function( d, status){
					// 下载完成
					if ( status == 200 ) { 
						s.send({content:"【"+title+"】"+desc+link, pictures: [d.filename]}, function(){
							mui.alert( "分享成功！" );
						}, function(e){
							mui.alert( "分享失败："+e.message );
						} );
					} else {
						alert( "Download failed: " + status ); 
					}  
				}.bind(this));
				//dtask.addEventListener( "statechanged", onStateChanged, false );
				dtask.start();
			}
			if (!s.authenticated){
				s.authorize( function(){
					shareMessage(s);
				},function(e){
					console.log("未进行认证");
				})
			}else{
				shareMessage(s);
			}
		},
		shareQQ(shareArr, title, desc, thumb, link, cb){
			var s = shareArr.share.qq;
			var shareMessage = function(s){
				typeof(cb)=="function" && cb();
				s.send({title:title, content: desc, thumbs: thumb,href:link}, function(){
					mui.alert( "分享成功！" );
				}, function(e){
					mui.alert( "分享失败："+e.message );
				} );
			}
			if (!s.authenticated){
				s.authorize( function(){
					shareMessage(s);
				}, function(e){
					console.log("未进行认证");
				} )
			}else{
				shareMessage(s);
			}
		},
		shareFriends(shareArr, title, desc, thumb, link, cb){
			//分享到朋友圈
			var s = shareArr.weixin;
			var shareMessage = function(s){
				typeof(cb)=="function" && cb();
				s.send({title:title, content: desc, thumbs: thumb,href:link,extra:{scene:"WXSceneSession"}}, function(){
					mui.alert( "分享成功！" );
				}, function(e){
					mui.alert( "分享失败："+e.message );
				} );
			}
			if ( !s.authenticated ) {
				s.authorize( function(){
					shareMessage(s);
				}, function(e){
					console.log("未进行认证");
				} )
			}else{
				shareMessage(s);
			}
		},
		sharePengyouquan: function(shareArr, title, thumb, link, cb){
			//分享到朋友圈
			var s = shareArr.weixin;
			var shareMessage = function(s){
				typeof(cb)=="function" && cb();
				s.send({title:title, thumbs: [thumb],href:link,extra:{scene:"WXSceneTimeline"}}, function(){
					mui.alert( "分享成功！" );
				}, function(e){
					mui.alert( "分享失败："+e.message );
				} );
			}
			if ( !s.authenticated ) {
				s.authorize( function(){
					shareMessage(s);
				}, function(e){
					console.log("未进行认证");
				} )
			}else{
				shareMessage(s);
			}
		}
	}
	
	share.link = "http://www.companyclub.cn/";
	
	return share;
});