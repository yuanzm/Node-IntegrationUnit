var request = require('request');
var md5 = require('md5');


// var r = request.defaults({'proxy':'http://192.168.1.103:8888'});

var r = request;

//when module is post request ,use post
// options
var Post = function(postObj , common){
	return new Promise(function(resolve, reject){

		var headers = getHeaders(common);

		var obj = {
			url : postObj.url,
			form : postObj.form,
			headers : headers
		}
		r.post(obj,function(err,response,body){
			if(err) reject(err);
			resolve(body);
		})
	})
}

//when module is get request
var Get = function(e){
	return new Promise(function(resolve, reject){

		var headers = getHeaders(e.token);

		var obj = {
				url : e.info.url,
				headers : headers
		}

		r.get(obj,function(err,r,body){
			if(err) reject(err);
			// console.log('请求的header: '+r.req._header);
			resolve(body);
		})
	})
}

function getHeaders(common){
	//header && token

	if(common === undefined) return;

	var timeStamp = new Date().getTime(); //current time use millisecond
	// console.log('result'+accessToken + timeStamp);
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
