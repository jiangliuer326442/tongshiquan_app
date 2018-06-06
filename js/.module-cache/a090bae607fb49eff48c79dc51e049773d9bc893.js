'use strict'

define(["config/index","socket-io"], function(config, io){
	var socketio = {}; 
	socketio.socket = null;
	
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
		var table = window.db.instance('chaters');
		window.db.query('select * from chaters limit '+(page-1)*pagenum+','+pagenum, function(r){
	    	dispatch({
	    		type: socketio.SETRECENTCHAT,
	    		list: r
	    	});
	    	cb(200,"成功",r);
	    	if((r.length == 0 || !mui.getItem("getrecentchater_time") || (mui.getItem("getrecentchater_time")<(Date.parse(new Date())-300*1000)) && mui.network_flg())){
			  	mui.ajax({
				    url: config.server + "getrecentchater.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
				    type:"POST",
				    data:{p: page.toString(), pnum: pagenum.toString()},
				    success:function(status, info, data){
				    	if(status == 200){
				    		mui.setItem("getrecentchater_time", Date.parse(new Date()));
					    	for(var i=0; i<data.length; i++){
					    		table.save({touid: data[i].touid, username: data[i].username, avatar: data[i].avatar, content: data[i].content, content_type: data[i].content_type}, 'touid');
					    	}
					    	dispatch({
					    		type: socketio.SETRECENTCHAT,
					    		list: data
					    	});
					    	cb(status,info,data);
				    	}
				    }
			  	});
		  	}
		});
	}
	
	socketio.connect = function(uid,token,uuid,dispatch,cb){
		if(socketio.socket == null){
			socketio.socket = io.connect(config.chat_server);
			socketio.socket.on('connect', function() {
				//发起登录请求
				socketio.socket.emit('login', uid, token, uuid);
			});
			//接收到登陆失败事件
			socketio.socket.on('loginFail', function(status,msg) {
				socketio.socket = null;
				 cb(new Error(status,msg));
			});
			socketio.socket.on('loginSuccess', function(userinfo) {
				console.log("连接成功");
				dispatch({
					type: socketio.SETUSERINFO,
					avatar: userinfo.avatar1,
					nick: userinfo.nickname,
					phone: userinfo.phone
				});
				cb(null, userinfo);
			});
			//从服务器断开
			socketio.socket.on('close', function(){
				console.log("断开连接");
				socketio.socket = null;
			})
		}
		return socketio.socket;
	}
	
	return socketio;
})