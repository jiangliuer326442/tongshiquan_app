'use strict'

define(["actions/common", "config/index"], function(common, config){
	var cmpdiscuz = {};
	
	cmpdiscuz.SETNEWLYPOSTS = "setnewlyposts";
	cmpdiscuz.SETBARPOSTS = "setbarposts";
	cmpdiscuz.SETPOSTBARS = "setpostbars";
	cmpdiscuz.SETCURRENT = "setcurrentpostbar";
	
	cmpdiscuz.setpostbar = function(index, img, dispatch){
		dispatch({
			type: cmpdiscuz.SETCURRENT,
			index: index,
			img: img
		});
	}
	
	//添加帖子
	cmpdiscuz.addpost = function(sectionid,title,content,content_txt,uid,token,uuid,cb){
	  mui.ajax({
	    url: config.server + "/addpost.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
	    type:"POST",
	    data:{sectionid: sectionid.toString(), title: title, content: content, content_txt: content_txt},
	    success:function(status, info, data){
	      if(status == 200){
	        cb();
	      }
	    }
	  });
	}
	
	cmpdiscuz.addpostbarimg = function(uid, token, uuid, path, cb){
		var upload_server = config.server+'tieba_addsectionimg.jsp?uid='+uid+'&token='+token+'&uuid='+uuid;
		var task = plus.uploader.createUpload( upload_server, {}, function ( t, status ) {
			// 上传完成
			if ( status == 200 ) {
				var imgUrl = JSON.parse(t.responseText).data;
				cb(imgUrl);
			} else {
				console.log( "Upload failed: " + status );
			}
		});
		task.addFile( path, {key:"logo"} );
		task.start();
	}
	
	cmpdiscuz.addpostbar = function(uid, token, uuid, title, logo, desc, cb){
		mui.ajax({
		    url: config.server + "tieba_addsection.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
		    type:"POST",
		    data:{title: title, logo: logo, desc: desc},
		    success:function(status, info, data){
		    	cb(status, info);
		    }
	  	});
	}
	
	cmpdiscuz.getpostbars = function(companyid, dispatch, cb){
		var table = window.db.instance('postbars');
		table.get('', function(r){
	    	cb();
	    	dispatch({
	    		type: cmpdiscuz.SETPOSTBARS,
	    		list: r
	    	})
	    	if(mui.network_flg() && (r.length == 0 || !mui.getItem("tieba_getsectionlist_time") || (mui.getItem("tieba_getsectionlist_time")<(Date.parse(new Date())-2*3600*1000)))){
			  	mui.ajax({
				    url: config.server + "tieba_getsectionlist.jsp?",
				    type:"POST",
				    data:{companyid: companyid},
				    success:function(status, info, data){
				    	if(status == 200){
				    		mui.setItem("tieba_getsectionlist_time", Date.parse(new Date()));
					    	for(var i=0; i<data.length; i++){
					    		table.save({id: data[i].id, name: data[i].name, descs: data[i].descs, logo: data[i].logo, leadername: data[i].leadername, can_post_flg: data[i].can_post_flg?1:0}, 'id');
					    	}
					    	cb();
					    	dispatch({
					    		type: cmpdiscuz.SETPOSTBARS,
					    		list: data
					    	})
				    	}
				    }
			  	});
	    	}
		});
	}
	
	//获取指定贴吧帖子
	cmpdiscuz.getsectionposts = function(companyid, sectionid, page, pagesize, dispatch, cb){
	  var table = window.db.instance('posts');
	  window.db.query('select * from posts where sectionid = '+sectionid+' limit '+(page-1)*pagesize+','+pagesize, function(r){
	    	if(mui.network_flg() && (r.length < pagesize || !mui.getItem("getsectionposts"+sectionid.toString()+"_time") || (mui.getItem("getsectionposts"+sectionid.toString()+"_time")<(Date.parse(new Date())-300*1000)))){
				mui.ajax({
				    url: config.server + "getsectionposts.jsp?p="+page+"&pnum="+pagesize,
				    type:"POST",
				    data:{companyid: companyid, sectionid: sectionid.toString()},
				    success:function(status, info, data){
				    	if(status == 200){
				    		mui.setItem("getsectionposts"+sectionid.toString()+"_time", Date.parse(new Date()));
					    	for(var i=0; i<data.length; i++){
					    		table.save({id: data[i].id, title: data[i].title, sectionid: data[i].sectionid, showtime: data[i].showtime, user_name: data[i].user_name, user_avatar: data[i].user_avatar, userid: data[i].userid, readtimes: data[i].readtimes, commenttimes: data[i].commenttimes}, 'id');
					    	}
					    	cb(status,info,data);
					    	dispatch({
					    		type: cmpdiscuz.SETBARPOSTS,
					    		list: data,
					    		page: page,
					    	})
				    	}
				    }
			  	});
		  	}else{
				cb(200,"成功",r);
		    	dispatch({
		    		type: cmpdiscuz.SETBARPOSTS,
		    		list: r,
		    		page: page,
		    	})
		  	}
	  })
	}
	
	//获取最新帖子
	cmpdiscuz.getnewlyposts = function(companyid, page, pagesize, dispatch, cb){
	  var table = window.db.instance('posts');
	  window.db.query('select * from posts limit '+(page-1)*pagesize+','+pagesize, function(r){
	    	if(mui.network_flg() && (r.length == 0 || !mui.getItem("getposts_time") || (mui.getItem("getposts_time")<(Date.parse(new Date())-300*1000)))){
			  	mui.ajax({
				    url: config.server + "getposts.jsp?p="+page+"&pnum="+pagesize,
				    type:"POST",
				    data:{companyid: companyid},
				    success:function(status, info, data){
				    	if(status == 200){
				    		mui.setItem("getposts_time", Date.parse(new Date()));
					    	for(var i=0; i<data.length; i++){
					    		table.save({id: data[i].id, title: data[i].title, sectionid: data[i].sectionid, showtime: data[i].showtime, user_name: data[i].user_name, user_avatar: data[i].user_avatar, userid: data[i].userid, readtimes: data[i].readtimes, commenttimes: data[i].commenttimes}, 'id');
					    	}
					    	cb(status,info,data);
					    	dispatch({
					    		type: cmpdiscuz.SETNEWLYPOSTS,
					    		list: data,
					    		page: page,
					    	})
				    	}
				    }
			  	});
	    	}else{
		    	cb(200,"成功",r);
		    	dispatch({
		    		type: cmpdiscuz.SETNEWLYPOSTS,
		    		list: r,
		    		page: page,
		    	})
	    	}
	  })
	}
	
	return cmpdiscuz;
})