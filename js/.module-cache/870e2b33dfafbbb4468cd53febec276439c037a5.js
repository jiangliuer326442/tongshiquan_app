'use strict'

define(["config/index"], function(config){
	var club = {};
	club.GETCMPTWITTER = 'get_company_twt';
	club.DELTWT = 'del_twt';
	club.GETTWTVISIBLE = 'get_twt_visible';
	club.ADDCOMMENT = 'add_twt_cmt';
	club.ADDREPLY = 'add_twt_reply';
	club.DELCOMMENT = 'del_twt_cmt';
	
	
	club.addLink = function(url, uid,token,uuid, cb){
		mui.ajax({
			url: config.server + "addtwtlink.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
			type: "POST",
			data: {url: url},
			success: function(status, info, data){
				if(status == 200){
					cb(data);
				}
			}
		});
	}
	
	club.delTwt = function(uid, token, uuid, dispatch, index, twtid, cb){
		mui.ajax({
			url: config.server + "/delmytwt.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
			type: "POST",
			data: {twtid: twtid.toString()},
			success: function(status, info, data){
				if(status == 200){
					cb();
					dispatch({
						type: club.DELTWT,
						index: index
					});
				}
			}
		});
	}
	
	club.uploadImg = function(uid, token, uuid, path, i, cb){
		var upload_server = config.server+'addtwtfile.jsp?uid='+uid+'&token='+token+'&uuid='+uuid;
		var task = plus.uploader.createUpload( upload_server, {}, function ( t, status ) {
			// 上传完成
			if ( status == 200 ) {
				var imgUrl = JSON.parse(t.responseText).data;
				cb(i, imgUrl);
			} else {
				console.log( "Upload failed: " + status );
			}
		});
		task.addFile( path, {key:"file"} );
		task.start();
	}
	
	club.delComment = function(uid, token, uuid, twtindex, cmtindex, cmtid, dispatch, cb){
		mui.ajax({
			url: config.server + "delmytwtcmt.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
			type: "POST",
			data: {cmtid: cmtid.toString()},
			success: function(status, info, data){
				if(status == 200){
					dispatch({
						type: club.DELCOMMENT,
						twtindex: twtindex,
						cmtindex: cmtindex
					})
					cb();
				}
			}
		});
	}
	
	club.addComment = function(uid, token, uuid, twtid, content, dispatch, cb){
		mui.ajax({
			url: config.server + "twtaddcomment.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
			type: "POST",
			data: {content: content, twtid: twtid.toString()},
			success: function(status, info, data){
				if(status == 200){
					dispatch({
						type: club.ADDCOMMENT,
						content: content,
						twtid: twtid
					})
					cb();
				}
			}
		});
	}
	
	club.addReply = function(uid, token, uuid, twtid, commentid, content, dispatch, cb){
		mui.ajax({
			url: config.server + "twtreplycomment.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
			type: "POST",
			data: {content: content, cmtid: commentid.toString(), twtid: twtid.toString()},
			success: function(status, info, data){
				if(status == 200){
					dispatch({
						type: club.ADDREPLY,
						content: content,
						twtid: twtid,
						commentid: commentid
					})
					cb();
				}
			}
		});
	}
	
	club.addTwitter = function(uid, token, uuid, visible, content, images, url, cb){
		mui.ajax({
			url: config.server + "/addtwt.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
			type: "POST",
			data: {content: content, visible: visible.toString(), images: images, url: url},
			success: function(status, info, data){
				if(status == 200){
					cb();
				}
			}
		});
	}
	
	club.gettwtvisibble = function(uid, token, uuid, dispatch,cb){
		mui.ajax({
			url: config.server + "/gettwtvisible.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
			type:"GET",
			success: function(status, info, data){
				if(status == 200){
					cb(data)
					dispatch({
						type: club.GETTWTVISIBLE,
						list: data
					})
				}
			}
		})
	}
	
	club.getCmpTwitter = function(uid, token, uuid, p, pnum, dispatch, cb){
		mui.ajax({
		    url: config.server + "/getcompanytwt.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
		    type:"GET",
		    data:{p: p.toString(), pnum: pnum.toString()},
		    success:function(status, info, data){
		    	if(status == 200){
		    		cb(status, info, data);
		    		dispatch({
		    			type: club.GETCMPTWITTER,
		    			list: data,
		    			page: p
		    		})
		    	}
		    }
	  	});	
	}
	
	return club;
})