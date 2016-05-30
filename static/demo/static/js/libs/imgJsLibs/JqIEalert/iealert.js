/*
 * IE Alert! jQuery plugin
 * version 1
 * author: David Nemes http://nmsdvid.com
 * http://nmsdvid.com/iealert/
 */

(function($){
$("#goon").on("click", function(){
		$("#ie-alert-overlay").hide();	
		$("#ie-alert-panel").hide();						  
});
function initialize($obj, support, title, text){

		var panel = "<span>"+ title +"</span>"
				  + "<p> "+ text +"</p>"
			      + "<div class='browser'>"
			      + "<ul>"
			      + "<li><a class='chrome' href='http://pan.baidu.com/s/1o6iQj6y?qq-pf-to=pcqq.c2c' target='_blank'>&nbsp;</a></li>"
			      + "<li><a class='firefox' href='http://ie.sogou.com/' target='_blank'>&nbsp;</a></li>"
			      + "<li><a class='ie9' href='http://chrome.360.cn/' target='_blank'>&nbsp;</a></li>"
			      + "<li><a class='safari' href='http://www.apple.com/safari/download/' target='_blank'>&nbsp;</a></li>"
			      + "<li><a class='opera' href='http://browser.qq.com/' target='_blank'>&nbsp;</a></li>"
			      + "<ul>"
			      + "</div>"; 

		var overlay = $("<div id='ie-alert-overlay'></div>");
		var iepanel = $("<div id='ie-alert-panel'>"+ panel +"</div>");

		var docHeight = $(document).height();

		overlay.css("height", docHeight + "px");

		$obj.prepend(iepanel);
		$obj.prepend(overlay);

		$("#ie-alert-panel").css("background-position","-626px -116px");
		$obj.css("margin","0");

};


$.fn.iealert = function(options){
	var defaults = {
		support: "ie7",  // ie8 (ie6,ie7,ie8), ie7 (ie6,ie7), ie6 (ie6)
		title: "\u4F60\u77E5\u9053\u4F60\u7684Internet Explorer\u662F\u8FC7\u65F6\u4E86\u5417?", // title text
		text: "\u4E3A\u4E86\u5F97\u5230\u6211\u4EEC\u7F51\u7AD9\u6700\u597D\u7684\u4F53\u9A8C\u6548\u679C,\u6211\u4EEC\u5EFA\u8BAE\u60A8\u5347\u7EA7\u5230\u6700\u65B0\u7248\u672C\u7684Internet Explorer\u6216\u9009\u62E9\u53E6\u4E00\u4E2Aweb\u6D4F\u89C8\u5668.\u4E00\u4E2A\u5217\u8868\u6700\u6D41\u884C\u7684web\u6D4F\u89C8\u5668\u5728\u4E0B\u9762\u53EF\u4EE5\u627E\u5230.<br /><br />"
	};
	var isIE=!!window.ActiveXObject;
	var isIE6=isIE&&!window.XMLHttpRequest;
	var isIE8=isIE&&!!document.documentMode;
	var isIE7=isIE&&!isIE6&&!isIE8;

	var option = $.extend(defaults, options);

		return this.each(function(){
			if (isIE && (isIE6 || isIE7 || isIE8)) {
				var $this = $(this);
				initialize($this, option.support, option.title, option.text);
			} //if ie
		});

};
})(jQuery);
