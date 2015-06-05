/*
 * app.js
 */ 

// 引入所需模块
var colors = require('colors');
var fs = require('fs');
var express = require('express');
var app = express();
var router = express.Router();
var eventproxy   = require('eventproxy');

// 引入本地模块
var userRegister = require('./userRegister.js');
var doUnit = require('./doUnit.js');
var config = require("./config.js")

router.get('/v2/:dir/:file',function(req,res){
	var ep = new eventproxy();

	var pathname = __dirname + '/doc/'+req.params.dir+'/'+req.params.file+'.yml';

	fs.exists(pathname,function(result){
		if (!!!result) {
			res.send('路由错误或测试用例不存在');
		}
	});
	ep.on("register-success", function() {
		doUnit(pathname, function(err, result) {
			res.send(unescape(result));
		});
	})
	if (req.params.file === 'register') {
		userRegister(function(err, result) {
			if (err) {
				console.log('register failed');
			}
			ep.emit('register-success')
		})
	} else {
		doUnit(pathname, function(err, result) {
			console.log(result)
			res.send(unescape(result));
		});
	}
})

app.use('/',router);

app.set('port', process.env.PORT || config.port );

app.listen(app.get('port'),function(){
	console.log('..................[listen] starting  '.green+'localhost at '.red+app.get('port'));
});
