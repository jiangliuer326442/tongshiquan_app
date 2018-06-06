'use strict'

define(["actions/common", "config/index"], function(common, config){
	var company = {};
	
	company.SETCOMPANYINFO = 'setcompanyinfo';
	company.GETCOMPANYCFG = 'setcompanycfg';
	company.SETQRCODE = 'setcompanyqrcode';
	
	//获取企业二维码
	company.getqrcode = function(uid, token, uuid, companyid, dispatch){
		mui.ajax({
		    url: config.server + "company_getqrcode.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
		    type:"POST",
		    data: {companyid: companyid},
		    success:function(status, info, data){
		    	if(status == 200){
		    		dispatch({
		    			type: company.SETQRCODE,
		    			qrcode_img: data.img,
		    			qrcode_url: data.url,
		    		});
		    	}
		    }
		});
	}
	
	//获取企业配置信息
	company.getcfg = function(uid, token, uuid, dispatch){
		mui.ajax({
		    url: config.server + "company_getcfginfo.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
		    type:"POST",
		    success:function(status, info, data){
		    	if(status == 200){
		    		dispatch({
		    			type: company.GETCOMPANYCFG,
		    			allow_visit_time: data.allow_visit_time,
		    			is_allow_register: data.is_allow_register,
		    			is_allowvisit: data.is_allowvisit,
		    			is_postbar_audit: data.is_postbar_audit
		    		});
		    	}
		    }
		});
	}
	
	//解除绑定企业
	company.unbind = function(uid, token, uuid, cb){
		mui.ajax({
			url: config.server + "company_unbind.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
			type:"POST",
			success:function(status, info, data){
				if(status == 200){
					cb();
				}
			}
		})
	}
	
	//获取企业信息
	company.getinfo = function(companyid, uid, token, uuid, dispatch){
		var table = window.db.instance('company');
		table.get("id == '"+companyid+"'", function(r){
			if(r.length>0){
		    	dispatch({
		    		type: company.SETCOMPANYINFO,
		    		Name: r[0].name,
		    		No: r[0].no,
		    		OperName: r[0].opername,
		    		StartDate: r[0].startdate,
		    		logo: r[0].logo
		    	})
	    	}
			if((r.length == 0 || !mui.getItem("company_getname_time") || (mui.getItem("company_getname_time")<(Date.parse(new Date())-7*24*3600*1000)) && mui.network_flg())){
			  mui.ajax({
			    url: config.server + "company_getname.jsp?uid="+uid+"&token="+token+"&uuid="+uuid,
			    type:"POST",
			    data:{companyid: companyid},
			    success:function(status, info, data){
			    	mui.setItem("company_getname_time", Date.parse(new Date()));
			    	table.save({id: companyid, name: data.Name, no: data.No, opername: data.OperName, startdate: data.StartDate, logo: data.logo}, 'id');
			    	dispatch({
			    		type: company.SETCOMPANYINFO,
			    		Name: data.Name,
			    		No: data.No,
			    		OperName: data.OperName,
			    		StartDate: data.StartDate,
			    		logo: data.logo
			    	})
			    }
			  });
			}
	  })
	}
	
	return company;
})