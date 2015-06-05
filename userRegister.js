var eventproxy   = require('eventproxy');

// 引入自己的模块
var url = require('./common/urls.js');
var request = require('./common/request');
var utils = require('./common/utils');

/*
 * @param {Function} callback: 回调函数
 */
var userRegister = function(callback){
	var ep = new eventproxy();

	// 异常处理
	ep.fail(callback);

	utils.yaml('./doc/user/register.yml', function(err, doc) {
		ep.emit("load-yaml", doc);
	});

	ep.on("load-yaml", function(doc) {
		var register = doc.test.register;
		var deviceId = new Date().getTime();

		var form = {
			deviceId: deviceId,
			cid: register.req.cid,
			osType: register.req.osType,
			longitude: register.req.longitude,
			latitude: register.req.latitude
		}

		var Obj = {
			info : { url : url.postUrl('user/register'),
			form : form}
		};
		
		request.Post(Obj, function(err, body) {
			ep.emit("post-success", body);
		});

		ep.on("post-success", function(err, body) {
			utils.write('user.json', body, function(err, status) {
				ep.emit('write-success');
			});
		});

		ep.on("write-success", function() {
			utils.compare(result,register);
			callback(null, result);	
		})
	});
}

module.exports = userRegister;
