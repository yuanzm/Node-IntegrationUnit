'use strict';
var co = require('co');
var colors = require('colors'); //global
var fs = require('fs');
var express = require('express');
var app = express();
var router = express.Router(); // express 4x add Router

var userRegister = require('./userRegister');

var doUnit = require('./doUnit');

router.get('/v2/:dir/:file',function(req,res){
				// res.send(unescape(result[req.name]));
				var pathname = __dirname + '/doc/'+req.params.dir+'/'+req.params.file+'.yml';
				// console.log(pathname);

				fs.exists(pathname,function(result){
						//result type bool
							if (!!!result) {
									res.send('路由错误或测试用例不存在');
							}

				});  
				var result = co(function*(){

						if (req.params.file === 'register') {
							var register = yield co(userRegister);
						}

						var result = yield co(doUnit(pathname));

						res.send(unescape(result));
				}).catch(onerror);
})

app.use('/',router);

function onerror(err) {
  // log any uncaught errors
  // co will not throw any errors you do not handle!!!
  // HANDLE ALL YOUR ERRORS!!!
  console.error(err.stack);
}

app.set('port', process.env.PORT || 4000 );
app.listen(app.get('port'),function(){
	console.log('..................[listen] starting  '.green+'localhost at '.red+app.get('port'));
});
