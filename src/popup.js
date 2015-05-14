/**
 * iPac
 * @authors Jack.Chan (fulicat@qq.com)
 * @date    2015-05-05 12:33:22
 * @update  2015-05-14 16:32:28
 * @version 1.2
 */

var bg = chrome.extension.getBackgroundPage();
var iPac = bg.iPac;

document.addEventListener('contextmenu', function(e){
	e.preventDefault();
}, false);

function page(pageid){
	$('.page').removeClass('active');
	if($('#page-'+ pageid).size())$('#page-'+ pageid).addClass('active');
};

function init(){
	$('#switcher li').removeClass('active');
	$('#switcher li.'+ iPac.mode).addClass('active');
	page(iPac.mode);
};

$(function(){
	init();

	$('#switcher li').on('click', function(e){
		var mode = $(this).data('mode');
		$('#switcher li').removeClass('active');
		$('#switcher li.'+ mode).addClass('active');

		page(mode);
		if(mode=='system' || mode=='direct'){
			iPac.switch(mode);
			iPac.refresh();
		};
		//return false;
	});

	$('#btn-reload').on('click', function(e){
		iPac.clear();
		iPac.init();
		return false;
	});

	$('#btn-setting').on('click', function(e){
		page('setting');
		return false;
	});

	$('#form-pac_url').on('submit', function(e){
		var data = $.trim($('#pac_url').removeClass('error').val());
		if(data.length < 10){
			$('#pac_url').addClass('error');
			iPac.switch('system');
		}else{
			iPac.switch('pac_url', data);
		};
		iPac.refresh();
		return false;
	});

	$('#form-pac_script').on('submit', function(e){
		var data = $.trim($('#pac_script').removeClass('error').val());
		if(data.length && data.indexOf('FindProxyForURL')<0){
			$('#pac_script').addClass('error');
			iPac.switch('system');
		}else{
			iPac.switch('pac_script', data);
			
		};
		iPac.refresh();
		return false;
	});

	$('#link-help').on('click', function(){
		var win = window.open('about:blank', '_blank');
		var html = [];
		html.push('<h2>查看浏览器代理状态</h2>');
		html.push('<p>在浏览器地址栏输入：<span style="color:green">chrome://net-internals/#proxy</span>&nbsp;&nbsp;回车</p>');
		html.push('<p><a href="http://fulicat.com">fulicat.com</a></p>');
		win.document.write(html.join(''));
		return false;
	});

	if(iPac.data){
		//page('index');
		$('#pac_url').val(iPac.data.pac_url);
		$('#pac_script').val(iPac.data.pac_script);
	};
});
