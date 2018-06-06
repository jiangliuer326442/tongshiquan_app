'use strict'

define(["config/index"], function(config){
	var admin = {};
	admin.GETMODELLIST = 'admin_getmodel_list';
	admin.GETMODELDETAIL = 'admin_getmodel_detail';
	admin.GETMODELARTICLES = 'admin_getmodel_articles';
	admin.DELMODELARTICLE = 'admin_article_del';
	
	admin.delarticle = function(uid, token, uuid, aid, dispatch, cb){
		mui.ajax({
			url: config.server + "del_article.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
			type:"POST",
			data:{aid: aid.toString()},
			success:function(status, info, data){
				if(status == 200){
					dispatch({
						type: admin.DELMODELARTICLE,
						id: aid
					});
					cb();
				}
			}
		})	
	}
	
	admin.getsectionarticles = function(uid, token, uuid, dispatch, sectionid){
		mui.ajax({
			url: config.server + "getarticles.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
			type:"POST",
			data:{sectionid: sectionid.toString()},
			success:function(status, info, data){
				dispatch({
					type: admin.GETMODELARTICLES,
					list: data,
					sectionid: sectionid,
				})
			}
		})	
	}
	
	admin.getsectiondetail = function(uid, token, uuid, dispatch, sectionid){
		mui.ajax({
			url: config.server + "post_getsectiondetail.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
			type:"POST",
			data:{sectionid: sectionid.toString()},
			success:function(status, info, data){
				dispatch({
					type: admin.GETMODELDETAIL,
					sectionid: sectionid,
					is_allow_comment: data.is_allow_comment,
					is_hide_comment: data.is_hide_comment,
					leaderid: data.leaderid,
					sort: data.sort
				})
			}
		})
	}
	
	admin.getsectionlist = function(uid, token, uuid, dispatch, modelid, admin_flg){
		mui.ajax({
		    url: config.server + "post_getsectionlist.jsp?uid=" + uid + "&token=" + token + "&uuid=" + uuid,
		    type:"POST",
		    data:{modelid: modelid.toString()},
		    success:function(status, info, data){
		    	dispatch({
		    		type: admin.GETMODELLIST,
		    		admin_flg: admin_flg,
		    		list: data,
		    		id: modelid
		    	});
		    }
	  	});	
	}
	
	return admin;
});