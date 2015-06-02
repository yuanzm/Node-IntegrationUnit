var url = require('../urls');
var request = require('../request');
var utils = require('../utils');

var user_register = function*(){
	//device
	var doc = yield utils.yaml('./doc/user/register.yml');

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

	var write = yield utils.write('user.json', result);

	utils.compare(result,register);

	return result;
}

module.exports = user_register;
