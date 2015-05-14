/**
 * iPac
 * @authors Jack.Chan (fulicat@qq.com)
 * @date    2015-05-05 12:33:22
 * @update  2015-05-14 16:32:28
 * @version 1.2
 */

/*
function FindProxyForURL(url, host){
   var d = 'DIRECT';
   if(shExpMatch(host, '10.[0-9]+.[0-9]+.[0-9]+')) return d;
   if(shExpMatch(host, '172.[0-9]+.[0-9]+.[0-9]+')) return d;
   if(shExpMatch(host, '192.168.[0-9]+.[0-9]+')) return d;
   if(shExpMatch(host, '127.0.0.1')) return d;
   if(shExpMatch(host, 'localhost')) return d;
}
 */

chrome.browserAction.setPopup({
	popup:'popup.html'
});


window.iPac = {};
iPac.mode = 'system';
iPac.data = {
	pac_url: '',
	pac_script: ''
};
iPac.db = {
	get: function(k){
		return localStorage.getItem(k);
	},
	set: function(k, v){
		localStorage.setItem(k, v);
	},
	remove: function(k){
		localStorage.removeItem(k);
	},
	clear: function(){
		localStorage.clear();
	}
};
iPac.setIcon = function(mode){
	chrome.browserAction.setIcon({
		path:{
			'19': 'images/s28/ipac_'+ mode +'-s28.png',
			'38': 'images/s38/ipac_'+ mode +'-s38.png'
		}
	});
};
iPac.refresh = function(){
	chrome.tabs.getSelected(null, function(tab){
		chrome.tabs.reload(tab.id);
	});
};
iPac.clear = function(){
	chrome.proxy.settings.clear({});
};
iPac.setPac = function(pac){

};
iPac.switch = function(mode, data){
	mode = mode || this.mode;
	data = data || '';

	console.log('switch');
	console.log('mode:'+ mode);
	console.log('data:');
	console.log(data);

	this.setIcon(mode);
	this.mode = mode;
	this.db.set('mode', mode);

	var config = {
		mode: (mode=='pac_url') ? 'pac_script' : mode
	};
	switch(mode){
		case 'pac_url':
			this.data.pac_url = data || this.data.pac_url;
			this.db.set(mode, this.data.pac_url);
			config.pacScript = {url: this.data.pac_url};
			break;
		case 'pac_script':
			this.data.pac_script = data || this.data.pac_script;
			this.db.set(mode, this.data.pac_script);
			config.pacScript = {data: this.data.pac_script};
			break;
		default:
			break;
	};
	chrome.proxy.settings.set(
		{
			value: config,
			scope: 'regular'
		},
		function(msg){
			if(msg)console.log(msg);
		}
	);
};
iPac.init = function(){
	console.clear();
	console.log('init');

	this.mode = this.db.get('mode') || this.mode;
	this.data.pac_url = this.db.get('pac_url');
	this.data.pac_script = this.db.get('pac_script');

	if(this.mode=='pac_url' && !this.data.pac_url)this.mode = 'system';
	if(this.mode=='pac_script' && !this.data.pac_script)this.mode = 'system';
	this.switch();
};

iPac.init();
