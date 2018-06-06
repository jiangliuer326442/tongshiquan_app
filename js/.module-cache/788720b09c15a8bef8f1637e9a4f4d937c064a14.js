'use strict'

define(["config/index"], function(config){
	var article = {};
	
	article.SETARTICLE = "setarticle";
	article.SETCOMMENTS = "setcomments";
	article.SETLIST = "setarticlelist";
	article.ADDARTICLE = "addarticle";
	
	article.addreply = function(uid, token, uuid, articleid, content, comment_id, dispatch, cb){
		mui.ajax({
		    url: config.server + "addcommentreply.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
		    type:"POST",
		    data:{aid: articleid.toString(), cid: comment_id.toString(), content: content},
		    success:function(status, info, data){
		    	cb();
		    }
	  	});	
	}
	
	article.addcomment = function(uid,token,uuid,articleid,content,dispatch,cb){
		mui.ajax({
		    url: config.server + "/addcomment.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
		    type:"POST",
		    data:{aid: articleid.toString(), content: content},
		    success:function(status, info, data){
		    	cb();
		    }
	  	});	
	}
	
	//获取评论
	article.getcomments = function(uid, token, uuid, page, pnum, articleid, companyid, dispatch, cb){
	  	mui.ajax({
		    url: config.server + "/getcomments_flat.jsp?p=" + page + "&pnum=" + pnum + "&uid=" + uid + "&token=" + token + "&uuid=" + uuid,
		    type:"POST",
		    data:{aid: articleid.toString(), companyid: companyid},
		    success:function(status, info, data){
		    	dispatch({
		    		type: article.SETCOMMENTS,
		    		list: data,
		    		page: page,
		    	});
		    	cb(status, info, data);
		    }
	  	});
	}
	
	article.addarticle = function(sectionid, title, desc, content, content_txt, is_allow_comment, is_hide_comment, is_top, showtime, uid, token, uuid, cb){
	  	mui.ajax({
		    url: config.server + "add_article.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
		    type:"POST",
		    data:{title: title, desc: desc, content: content, content_txt: content_txt, is_allow_comment: is_allow_comment.toString(), is_hide_comment: is_hide_comment.toString(), is_top: is_top.toString(), showtime: showtime, sectionid: sectionid.toString()},
		    success:function(status, info, data){
		      if(status == 200){
		      	cb();
		      }
		    }
	  	});
	}
	
	//获取文章
	article.getarticle = function(companyid,articleid,uid,token,uuid,dispatch,cb){
	  	mui.ajax({
		    url: config.server + "getarticle.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
		    type:"POST",
		    data:{companyid: companyid, articleid: articleid.toString()},
		    success:function(status, info, data){
		      if(status == 200){
		        dispatch({
		        	type: article.SETARTICLE,
		        	data: data
		        });
		        cb(data);
		      }
		    }
	  	});
	}
	
	//获取文章列表
	article.getarticles = function(articleid, page, pagenum, dispatch, cb){
	  	mui.ajax({
		    url: config.server + "getarticlesbyarticleid.jsp?",
		    type:"GET",
		    data:{aid: articleid, p: page, pnum: pagenum},
		    success:function(status, info, data){
		      if(status == 200){
		        dispatch({
		        	type: article.SETLIST,
		        	list: data.list,
		        	total: data.num,
		        	page: page
		        });
		        cb(data.list, data.total);
		      }
		    }
	  	});
	}
	
	return article;
})