'use strict'

define(["config/index"], function(config){
	var version = {};
	version.getnewversion = function(cb){
		if(mui.network_flg()){
			mui.setItem("ckversion_time", Date.parse(new Date()));
			plus.runtime.getProperty( plus.runtime.appid, function ( wgtinfo ) {
                //version属性
                var current_version = wgtinfo.version;
			  	mui.ajax({
				    url: config.server + "ckversion.jsp?",
				    type: "POST",
				    data: {version: current_version},
				    success:function(status, info, data){
				    	cb(status, info, data);
				    }
			  	});
          	})
		}else{
			cb(502);
		}
	}
	
	function upgrade(package_url){
		var dtask = plus.downloader.createDownload(package_url, {
			filename: "_downloads/version/"
		}, function ( d, status ) {
			// 下载完成
			if ( status == 200 ) { 
				plus.runtime.install(d.filename, {}, function(){
					plus.runtime.restart();
				}, function(e){
					mui.alert(e.message, "警告");
				});
			} else {
				mui.alert( "下载失败!", "警告" ); 
			}  
		});
		dtask.start();
	}
	
	version.ckversion = function(){
		version.getnewversion(function(status, info, data){
			if(status == 502){
				mui.toast("连接服务器失败，请检查网络连接");
			}else if(status == 1002){
				mui.toast("当前已经是最新版本");
			}else if(status == 1003){
				if(data.force){
					//强制升级
					upgrade(data.url);
				}else{
					mui.confirm(data.remark, info, ["取消","升级"], function(e){
						if (e.index == 1) {
							upgrade(data.url);
						}
					});
				}
			}
		});
	}
	
	
	return version;
})