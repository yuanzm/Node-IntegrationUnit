var url = require('./urls');
var request = require('./request');
var utils = require('./utils');

var user_register = function*(){
	//device

		console.log('register');
	var doc = yield utils.yaml('./doc/user/register.yml');

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

	var result = yield request.Post(Obj);
	var write = yield utils.write('user.json', result);

	utils.compare(result,register);

	return result;
}

module.exports = user_register;
