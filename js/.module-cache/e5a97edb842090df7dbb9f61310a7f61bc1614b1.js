'use strict'

define(["actions/common", "config/index"], function(common, config){
	var cmpnotice = {};
	
	cmpnotice.SETFARTICLE = "setfarticle";
	cmpnotice.SETOARTICLE = "setoarticle";
	cmpnotice.SETSLTMODLE = "setsltmodle";
	
	cmpnotice.setsltmodle = function(selected, dispatch){
		dispatch({
			type: cmpnotice.SETSLTMODLE,
			index: selected
		});
	}
	
	cmpnotice.getfarticle = function(companyid, dispatch, cb){
		var table = window.db.instance('article');
		table.get('category === 1', function(r){
	    	if(mui.network_flg()){
			  	mui.ajax({
				    url: config.server + "getfarticles.jsp?",
				    type:"POST",
				    data:{companyid: companyid},
				    success:function(status, info, data){
				    	mui.setItem("getfarticles_time", Date.parse(new Date()));
				    	var list = data.list;
				    	for(var i=0; i<list.length; i++){
				    		table.save({id: list[i].id, title: list[i].title, desc: list[i].desc, thumb: list[i].thumb, category: 1}, 'id');
				    	}
				    	dispatch({
				    		type: cmpnotice.SETFARTICLE,
				    		list: list,
				    		name: data.model_name
				    	})
				    }
			  	});
	    	}else{
		    	dispatch({
		    		type: cmpnotice.SETFARTICLE,
		    		list: r,
		    		name: "企业通知"
		    	})
	    	}
       });
	}
	
	cmpnotice.getoarticle = function(companyid, size, dispatch, cb){
		var article_table = window.db.instance('article');
		var category_table = window.db.instance('category');
		var list = [];
		category_table.get('', function(r1){
			if(mui.network_flg()){
				mui.ajax({
				    url: config.server + "getoarticles.jsp?",
				    type:"POST",
				    data:{companyid: companyid, size: size.toString()},
				    success:function(status, info, data){
				    	if(status == 200){
					    	mui.setItem("getoarticles_time", Date.parse(new Date()));
					    	for(var i=0; i<data.length; i++){
					    		var func = function(t){
						    		category_table.save({id: data[t].id, name: data[t].name}, 'id');
						    		var list = data[t].list;
						    		for(var j=0; j<list.length; j++){
						    			article_table.save({id: list[j].id, title: list[j].title, desc: list[j].desc, thumb: list[j].thumb, category: data[t].id}, 'id');
						    		}
					    		}
					    		func(i);
					    	}
					    	dispatch({
					    		type: cmpnotice.SETOARTICLE,
					    		list: data
					    	})
				    		cb();
				    	}
				    }
				});
			}else{
				for(var i=0; i<r1.length; i++){
					var func = function(m){
						list[m] = {};
						list[m].id = r1[m].id;
						list[m].name = r1[m].name;
						list[m].list = [];
						article_table.get('category === '+list[m].id, function(r2){
							list[m].list = r2;
							if(list.length == r1.length){
						    	dispatch({
						    		type: cmpnotice.SETOARTICLE,
						    		list: list
						    	})
						    	cb();
						    	return false;
							}
						});
						return true;
					}
					if(!func(i)){
						break;
					}
				}
			}
		});
	}
	
	return cmpnotice;
})