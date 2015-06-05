/*
 * 引入所需模块
 */

var request = require('request');
var md5 = require('md5');

var config = require('../config.js');


var r = request.defaults({
	'proxy': config.proxy
});

//when module is post request ,use post
// options
// var Post = function(e, callback){
// 	var headers = getHeaders(e.token);
// 	var obj = {
// 		url : e.info.url,
// 		form : e.info.form,
// 		headers : headers
// 	}
// 	r.post(obj,function(err,response,body){
// 		body = {
// 			errCode: 0
// 		}
// 		callback(null, body);
// 	});
// }

var Post = function(obj, callback){
	body = {
		errCode: 0
	}
	callback(null, body);
}

//when module is get request
var Get = function(e){
	var headers = getHeaders(e.token);

	var obj = {
			url : e.info.url,
			headers : headers
	}

	r.get(obj,function(err,r,body){
		callback(body);
	})
}

function getHeaders(common){
	if(common === undefined) return;

	var timeStamp = new Date().getTime(); 
	var token = md5(common.accessToken + timeStamp);

	var headers = {
		'timeStamp' : timeStamp,
		'requestToken' : token,
		'userId': common.userId
	}

	return headers;
}

module.exports = {
	Post : Post,
	Get : Get
}
