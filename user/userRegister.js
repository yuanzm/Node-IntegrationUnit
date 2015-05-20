var url = require('../urls');
var request = require('../request');
var user = require('../user');

var user_register = function*(){
	//device
	var doc = yield user.yaml('./doc/register.yml');

	var register = doc.register;

	var deviceId = new Date().getTime();

	var form = {
		deviceId: deviceId,
		cid: register.req.cid,
		osType: register.req.osType,
		longitude: register.req.longitude,
		latitude: register.req.latitude
	}

	var postObj = {
		url : url.postUrl('user/register'),
		form : form
	};

	var result = yield request.Post(postObj);

	var write = yield user.write('user.json', result);

	user.compare(result,register);

	return result;
}

module.exports = user_register;
