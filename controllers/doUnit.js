// 引入所需模块
var eventproxy = require('eventproxy');
var fs = require('fs');
var DoUnit = require('./../doUnit.js');

exports.index = function (req, res, next) {
	var ep = new eventproxy();
	ep.fail(next);

	var pathname = './doc/' + req.params.dir + '/' + req.params.file + '.yml';

	fs.exists(pathname,function(result){
		if (!!!result) {
			res.send('路由错误或测试用例不存在');
			res.end()
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
		console.log('start')
		new DoUnit(pathname, function(err, result) {
			res.send(unescape(result));
		}).init();
	}
}