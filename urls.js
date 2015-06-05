'use strict'
var url = require('url');

var protocol = 'http';
var host =  '192.168.1.15:8080';


function getUrl(path){ //notice !! path must be

	//transform pathObj to

	try{
		var childpath,params,total='';
		if(!!path && typeof path === 'object'){

			for(var key in path){
					if(key === 'childpath'){

						 childpath = path[key]
					}else{
						params = key + '='+path[key]+'&';
						total += params;
					}
				}
		}
	}catch(err){
		 throw 'not a obj';
	}

	total = total.substr(0, total.length-1);

	var Obj = {
		protocol : protocol,
		host: host,
		pathname: 'treehole/v2/'+childpath,
		search: '?'+total
	}

//	console.log(Obj);
	// console.log(url.format(Obj));
	return url.format(Obj);
}

function postUrl(path){
	var Obj = {
		protocol : protocol,
		host: host,
		pathname: 'treehole/v2/'+path
	}

	return url.format(Obj);
}

module.exports ={
	getUrl : getUrl,
	postUrl : postUrl
}
