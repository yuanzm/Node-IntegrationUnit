'use strict';
var co = require('co');
var colors = require('colors'); //global
var user = require('./user');
var express = require('express');
var app = express();
var router = express.Router();

var user_register = require('./userRegister');

var doUnit = require('./doUnit');


co(function*(){

	var register = yield co(user_register);

	router.get('/:dir/:file',function(req,res){
				// res.send(unescape(result[req.name]));
				var pathname = __dirname + '/doc/'+req.params.dir+'/'+req.params.file+'.yml';

				console.log(pathname);

				//通过路由读取yml用例
				var result = co(doTest(pathname)).then(function(data){

						console.log(data);
						//将结果返回
						res.send(data);
				});
	})

	app.use('/',router);

	console.log('register: '.green + register);
	// console.log('mayChange: '.green + mayChange);
	// console.log('getNewName: '.green + getNewName);
	// console.log('doChange: '.green + doChange);
	// console.log('verify: '.green + verify);

}).catch(onerror);


function jsonToObj(data){
	var result;

	if(!(result=JSON.parse(data)))console.error('can not instance json');
	return result;
}

function onerror(err) {
  // log any uncaught errors
  // co will not throw any errors you do not handle!!!
  // HANDLE ALL YOUR ERRORS!!!
  console.error(err.stack);
}

app.listen(4000);

console.log('..................[listen] starting  '.green+'localhost at 4000'.red);

// co(user_register).then(function(data){
// 		console.log(data);
// 		user.write(data);
// 		co(user_mayChange).then(function(data){
// 				console.log(data);
// 		})
// });
//



// co(user_register).then(function(data){
// 		var userID = JSON.parse(data).data.id;
// 		console.log(userID);
// 		user.setID(userID);
// 	//	console.log(user);
// });

//console.log(user);
