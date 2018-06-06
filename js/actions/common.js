'use strict'

define(['websqlwrapper'], function(WebsqlWrapper){
	var db;
	
	var initDB = function(){
		// 建立数据库 
		// 注意：建立数据库是同步操作
	    db = WebsqlWrapper({
	          name: 'companyClub'
	        , displayName:'卡拉布同事圈'
	        , version:1
	        , debug: false
	    });
	    
	    return db;
	}
	
	var buildTable = function(){
	    //建立表
	    db.define('article', {id:'INTEGER UNIQUE', title:'TEXT NOT NULL', desc:'TEXT', thumb:'TEXT', category: 'INTEGER NOU NULL'});
	    db.define('company', {id:'TEXT UNIQUE', name: 'TEXT NOT NULL', no: 'TEXT NOT NULL', opername: 'TEXT NOT NULL', startdate: 'TEXT NOT NULL', logo: 'TEXT'});
	    db.define('category', {id:'INTEGER UNIQUE', name:'TEXT NOT NULL'});
	    db.define('postbars', {id:'INTEGER UNIQUE', name:'TEXT NOT NULL',  descs:'TEXT', logo:'TEXT NOT NULL', leadername:'TEXT NOT NULL',can_post_flg:'INTEGER NOT NULL' })
	    db.define('posts', {id:'INTEGER UNIQUE', title:'TEXT NOT NULL', sectionid:'INTEGER NOT NULL', showtime:'TEXT NOT NULL', user_name:'TEXT NOT NULL', user_avatar:'TEXT NOT NULL', userid:'INTEGER NOT NULL', readtimes:'INTEGER NOT NULL', commenttimes:'INTEGER NOT NULL'});
	    db.define('chaters', {touid:'INTEGER UNIQUE', username:'TEXT NOT NULL', avatar:'TEXT NOT NULL', content:'TEXT NOT NULL', content_type:'TEXT NOT NULL' });
		db.define('chatlog', {id:'INTEGER UNIQUE', fuid:'INTEGER NOT NULL', tuid:'INTEGER NOT NULL', content:'TEXT NOT NULL', content_type:'TEXT NOT NULL', create_time:'TEXT NOT NULL'});
		db.define('employee', {id:'INTEGER UNIQUE', uid:'INTEGER NOT NULL', avatar:'TEXT NOT NULL', mail:'TEXT', name:'TEXT NOT NULL', nick:'TEXT NOT NULL', phone:'TEXT NOT NULL'});
	}
	
	var initNetwork = function(){
		mui.setItem("network_flg", "1");
		if(mui.os.plus){
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE ){
				mui.setItem("network_flg", "0");
			}
		}
		document.addEventListener("netchange", function(){
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE ){
				mui.setItem("network_flg", "0");
			}else{
				mui.setItem("network_flg", "1");
			}
		}, false);
	}
	
	var common = {
		initNetwork: initNetwork,
		initDB: initDB,
		buildTable: buildTable
	};
	
	return common;
});