// QQ表情插件
(function($){ 
	$.extend({
		getface:function(i){
			return "./js/lib/jquery-qqface/arclist/"+i+".gif";
		},
		replace_em(str) {
			str = str.replace(/\\"/g,"\"");
//			str = str.replace(/</g, '<；');
//			str = str.replace(/>/g, '>；');
			str = str.replace(/em_([0-9]*)/g, function(word){
				return '<Img src="'+$.getface(word.replace(/[^0-9]/ig,""))+'" border="0" />';
			});
			str = str.replace(/\[/g, '');
			str = str.replace(/]/g, '');
			str = str.replace(new RegExp('\n',"gm"),'<br/>');
			return str;
		}
	});
	$.fn.qqFace = function(options){
	
		var defaults = {
			id : 'facebox',
			display: 'display',
			path : 'face/',
			assign : 'content',
			tip : 'em_',
			total: 60,
			row: 15,
			cb: function(){}
		};
		var option = $.extend(defaults, options);
		var assign = $('#'+option.assign);
		var id = option.id;
		var path = option.path;
		var tip = option.tip;
		
		if(assign.length<=0){
			alert('缺少表情赋值对象。');
			return false;
		}
		mui(".mui-bar-tab").on("tap", "#emotion", function(e){
			var strFace, labFace;
			if($('#'+id).length<=0){
				strFace = '<div id="'+id+'" style="display:none;z-index:1000;" class="qqFace">' +
							  '<table border="0" cellspacing="0" cellpadding="0"><tr>';
				for(var i=1; i<=option.total; i++){
					labFace = '['+tip+i+']';
					strFace += '<td><img src="'+$.getface(i)+'" onclick="$(\'#'+option.assign+'\').setCaret();mui(\'.mui-bar-tab\').removeClass(\'emotion\');mui(\'#'+option.assign+'\').keyboard();$(\'#'+option.assign+'\').insertAtCaret(\'' + labFace + '\');$(\'#'+option.display+'\').display(\'' + labFace + '\');" /></td>';
					if( i % option.row == 0 ) strFace += '</tr><tr>';
				}
				strFace += '</tr></table></div>';
			}
			$(".mui-bar-tab").append(strFace);
			$('#'+id).show();
			option.cb();
			e.stopPropagation();
		});

		$(document).click(function(){
			$('#'+id).hide();
			$('#'+id).remove();
		});
	};

})(jQuery, mui);

jQuery.extend({ 
unselectContents: function(){ 
	if(window.getSelection) 
		window.getSelection().removeAllRanges(); 
	else if(document.selection) 
		document.selection.empty(); 
	} 
}); 
jQuery.fn.extend({ 
	selectContents: function(){ 
		$(this).each(function(i){ 
			var node = this; 
			var selection, range, doc, win; 
			if ((doc = node.ownerDocument) && (win = doc.defaultView) && typeof win.getSelection != 'undefined' && typeof doc.createRange != 'undefined' && (selection = window.getSelection()) && typeof selection.removeAllRanges != 'undefined'){ 
				range = doc.createRange(); 
				range.selectNode(node); 
				if(i == 0){ 
					selection.removeAllRanges(); 
				} 
				selection.addRange(range); 
			} else if (document.body && typeof document.body.createTextRange != 'undefined' && (range = document.body.createTextRange())){ 
				range.moveToElementText(node); 
				range.select(); 
			} 
		}); 
	}, 

	setCaret: function(){ 
		if(!$.browser.msie) return; 
		var initSetCaret = function(){ 
			var textObj = $(this).get(0); 
			textObj.caretPos = document.selection.createRange().duplicate(); 
		}; 
		$(this).click(initSetCaret).select(initSetCaret).keyup(initSetCaret); 
	}, 
	
	display: function(textFeildValue){
		if($(this).length>0){
			var textObj = $(this).get(0);
			textObj.innerHTML = (textObj.innerHTML == "记录我的生活"?"":textObj.innerHTML)+ '<img src="'+$.getface(textFeildValue.replace(/[^0-9]/ig,""))+'" border="0" />';
		}
	},

	insertAtCaret: function(textFeildValue){ 
		var textObj = $(this).get(0); 
		if(document.all && textObj.createTextRange && textObj.caretPos){ 
			var caretPos=textObj.caretPos; 
			caretPos.text = caretPos.text.charAt(caretPos.text.length-1) == '' ? 
			textFeildValue+'' : textFeildValue; 
		} else if(textObj.setSelectionRange){ 
			var rangeStart=textObj.selectionStart; 
			var rangeEnd=textObj.selectionEnd; 
			var tempStr1=textObj.value.substring(0,rangeStart); 
			var tempStr2=textObj.value.substring(rangeEnd); 
			textObj.value=tempStr1+textFeildValue+tempStr2; 
			textObj.focus(); 
			var len=textFeildValue.length; 
			textObj.setSelectionRange(rangeStart+len,rangeStart+len); 
			textObj.blur(); 
		}else{ 
			textObj.value+=textFeildValue; 
		} 
	} 
});