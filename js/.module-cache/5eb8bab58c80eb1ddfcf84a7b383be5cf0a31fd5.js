'use strict'

define(["config/index"], function(config){
	var version = {};
	version.getnewversion = function(cb){
		if(mui.network_flg()){
			plus.runtime.install("_downloads/version/apk_20180222232905.apk", {}, function(){
				plus.runtime.restart();
			}, function(e){
				mui.alert(e.message, "警告");
			});
			
			mui.setItem("ckversion_time", Date.parse(new Date()));
			plus.runtime.getProperty( plus.runtime.appid, function ( wgtinfo ) {
                //version属性
                var current_version = wgtinfo.version;
                cb(1003, "发现新版本", {
                	version: "1.6.1",
                	force: 0,
                	remark: "说点什么呢？",
                	url: "http://static.companyclub.cn/apk_20180222232905.apk"
                });
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
		plus.runtime.install(package_url, {}, function(){
			plus.runtime.restart();
		}, function(e){
			mui.alert(e.message, "警告");
		});
	}
	
	function install(force_flg, remark, title, filename){
		if(force_flg){
			//强制升级
			upgrade(filename);
		}else{
			mui.confirm(remark, title, ["取消","升级"], function(e){
				if (e.index == 1) {
					upgrade(filename);
				}
			});
		}
	}
	
	version.ckversion = function(){
		version.getnewversion(function(status, info, data){
			if(status == 502){
				mui.toast("连接服务器失败，请检查网络连接");
			}else if(status == 1002){
				mui.toast("当前已经是最新版本");
			}else if(status == 1003){
				var filename = mui.getItem("package_"+data.version);
				if(filename){
					install(data.force, data.remark, info, filename);
				}else{
					//下载软件
					var dtask = plus.downloader.createDownload(data.url, {
						filename: "_downloads/version/"
					}, function ( d, status ) {
						// 下载完成
						if ( status == 200 ) { 
							var filename = d.filename;
							mui.setItem("package_"+data.version, filename);
							install(data.force, data.remark, info, filename);
						} else {
							mui.alert( "下载失败!", "警告" ); 
						}  
					});
					dtask.start();	
				}
			}
		});
	}
	
	
	return version;
})