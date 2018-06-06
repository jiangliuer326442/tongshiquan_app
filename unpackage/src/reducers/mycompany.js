'use strict'

define(['actions/company'],function(company){
	return function(state, action){
		var state = arguments[0] ? arguments[0] : {
			  name: mui.getItem("company_name"),
			  no: mui.getItem("company_no"),
			  opername: mui.getItem("company_opername"),
			  startdate: mui.getItem("company_startdate"),
			  logo: "",
			  allow_visit_time: "0||23",
			  is_allow_register: true,
			  is_allowvisit: false,
			  is_postbar_audit: true,
			  qrcode_img: "",
			  qrcode_url: "",
		};
		switch (action.type) {
			case company.SETQRCODE:
		      	return Object.assign({},state, {
					  qrcode_img: action.qrcode_img,
					  qrcode_url: action.qrcode_url,
		              });
			case company.GETCOMPANYCFG:
		      	return Object.assign({},state, {
					  allow_visit_time: action.allow_visit_time,
					  is_allow_register: action.is_allow_register,
					  is_allowvisit: action.is_allowvisit,
					  is_postbar_audit: action.is_postbar_audit
		              });
			case company.SETCOMPANYINFO:
				mui.setItem("company_name", action.Name);
				mui.setItem("company_no", action.No);
				mui.setItem("company_opername", action.OperName);
				mui.setItem("company_startdate", action.StartDate);
		      	return Object.assign({},state, {
					  name: action.Name,
					  no: action.No,
					  opername: action.OperName,
					  startdate: action.StartDate,
					  logo: action.logo
		              });
		    default:
		      	return state
		}
	}
})