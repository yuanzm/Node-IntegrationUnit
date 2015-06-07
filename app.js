/*
 * app.js
 */ 

// 引入所需模块
var colors = require('colors');
var express = require('express');
var app = express();

// 引入本地模块
var router = require('./router.js');
var userRegister = require('./userRegister.js');
var config = require("./config.js")

app.use('/',router);

app.set('port', process.env.PORT || config.port );

app.listen(app.get('port'),function(){
	console.log('..................[listen] starting  '.green+'localhost at '.red+app.get('port'));
});
