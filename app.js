'use strict';
var co = require('co');
var colors = require('colors'); //global
var user = require('./user');
var express = require('express');
var app = express();
var router = express.Router();

var user_register = require('./user/userRegister');
var user_mayChange = require('./user/mayChange');
var user_getNewName = require('./user/getNewName');
var user_doChange = require('./user/doChange');
var user_verify = require('./user/verify');
//all module are promise

co(function*(){

	var register = yield co(user_register);

	var mayChange = yield co(user_mayChange);

	var getNewName = yield co(user_getNewName);

	var doChange = yield co(user_doChange);

	var verify = yield co(user_verify);

	var result = {
			register  : register,
			mayChange : mayChange,
			getNewName: getNewName,
			doChange 	: doChange,
			verify		: verify
	};

	router.param('name', function(req,res,next,name){
			// res.send(name);
			// console.log('nodemon');
			req.name = name;
			next();
	});

	router.get('/user/:name',function(req,res){
				res.send(unescape(result[req.name]));
	})

	app.use('/',router);

	console.log('register: '.green + register);
	console.log('mayChange: '.green + mayChange);
	console.log('getNewName: '.green + getNewName);
	console.log('doChange: '.green + doChange);
	console.log('verify: '.green + verify);

	// log.debug('test');
	// var user = yield {
	// 	register : co(user_register),
	// 	mayChange : co(user_mayChange),
	// 	getNewName : co(user_getNewName),
	// 	doChange : co(user_doChange),
	// 	verify : co(user_verify)
	// };
	//
	// // console.log(user);
	//
	// console.log('register: '.green + user.register);
	// console.log('mayChange: '.green + user.mayChange);
	// console.log('getNewName: '.green + user.getNewName);
	// console.log('doChange: '.green + user.doChange);
	// console.log('verify: '.green + user.verify);
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

console.log('..................[nodemon] starting  '.green+'localhost at 4000'.red);

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
