'use strict'

define(["config/index"], function(config){
	var socketio = {}; 
	
	socketio.SETUSERINFO = 'socketio_setuserinfo';
	socketio.SETRECENTCHAT = 'socketio_setrecentchat';
	socketio.SETCHATLOG = 'socketio_setchatlog';
	socketio.ADDCHAT = 'socketio_addchat';
	
	socketio.addchat = function(uid,token,uuid,touid,content,content_type){
		var send = function(content){
			mui.fire(plus.webview.getWebviewById("index.html/chat"), 'postMsg', {
				touid: touid,
				content:content,
				content_type: content_type,
			});
			mui.ajax({
			    url: config.server + "addchat.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
			    type:"POST",
			    data:{touid: touid.toString(), content: content, content_type: content_type},
			    success:function(status, info, data){

			    }
			});
		}
		var upload_server = config.server+'addchatfile.jsp?uid='+uid+'&token='+token+'&uuid='+uuid;
		if(content_type == "语音" || content_type == "图片"){
			var task = plus.uploader.createUpload( upload_server, {}, function ( t, status ) {
				// 上传完成
				if ( status == 200 ) {
					var imgUrl = JSON.parse(t.responseText).data;
					send(imgUrl);
				} else {
					console.log( "Upload failed: " + status );
				}
			});
			task.addFile( content, {key:"file"} );
			task.start();
		}else{
			send(content);
		}
	}
	
	socketio.getchatlog = function(uid,token,uuid,touid,page,pagenum,dispatch,cb){
		var table = window.db.instance('chatlog');
		window.db.query('select * from chatlog where (fuid = '+uid+' and tuid = '+touid+') or (tuid = '+uid+' and fuid = '+touid+') limit '+(page-1)*pagenum+','+pagenum, function(r){
		    if((page == 1 || r.length == 0) && mui.network_flg()){
			  	mui.ajax({
				    url: config.server + "getchatlog.jsp?uid="+uid+"&token="+token+"&uuid="+uuid+"&p="+page.toString()+"&pnum="+pagenum.toString(),
				    type:"POST",
				    data:{touid: touid.toString()},
				    success:function(status, info, data){
				    	if(status == 200){
					    	for(var i=0; i<data.length; i++){
					    		table.save({id: data[i].id, fuid: data[i].fuid, tuid: data[i].tuid, content: data[i].content, content_type: data[i].content_type, create_time: data[i].create_time}, 'id');
					    	}
					    	dispatch({
					    		type: socketio.SETCHATLOG,
					    		list: data,
					    		page: page
					    	});
					    	cb(status,info,data);
				    	}
				    }
			  	});
		    }else{
			    dispatch({
		    		type: socketio.SETCHATLOG,
		    		list: r,
		    		page: page
		    	});
		    	cb(200,'success',r);
	    	}
		})
	}
	
	socketio.rmrecentchat = function(uid,token,uuid,touid){
	  mui.ajax({
	    url: config.server + "delrecentchater.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
	    type:"POST",
	    data:{touid: touid.toString()},
	    success:function(status, info, data){
	    }
	  });
	}
	
	socketio.getrecentchat = function(uid,token,uuid,page,pagenum, dispatch, cb){
	  	mui.ajax({
		    url: config.server + "getrecentchater.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
		    type:"POST",
		    data:{p: page.toString(), pnum: pagenum.toString()},
		    success:function(status, info, data){
		    	if(status == 200){
			    	dispatch({
			    		type: socketio.SETRECENTCHAT,
			    		list: data
			    	});
			    	cb(status,info,data);
		    	}
		    }
	  	});
	}
	
	socketio.connect = function(uid,token,uuid,dispatch,cb){
	  mui.ajax({
	    url: config.server + "/getchatcfg.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
	    type:"GET",
	    success:function(status, info, data){
	        if(status == 200){
	            RL_YTX.init(data.appid);
	            RL_YTX.setLogClose()
	            var loginBuilder = new RL_YTX.LoginBuilder();
	            loginBuilder.setType(1);//登录类型 1账号登录，2voip账号密码登录
	            loginBuilder.setUserName(data.username);//设置用户名
	            loginBuilder.setPwd();//type值为1时，密码可以不赋值
	            loginBuilder.setSig(data.sig.toLowerCase());//设置sig
	            loginBuilder.setTimestamp(data.timestamp);//设置时间戳
	            //执行用户登录
	            RL_YTX.login(loginBuilder, function(obj){
	                //登录成功回调
	                cb();
	            })
	        }   
	    }   
	  }); 
	}
	
	return socketio;
})