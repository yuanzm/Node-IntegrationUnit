var url = require('../urls');
var user = require('../user');
var request = require('../request');

var verify = function*(){
  var read = yield user.read('user.json');
  var accessToken =  read.data.accessToken;
  var userId = read.data.id;

  var common = {
      accessToken : accessToken,
      userId : userId
  };

  try{
    var form = {
      userId: userId,
      longitude: 30.2700670000,
  		latitude: 120.1296490000
    }

    var postObj = {
      url : url.postUrl('user/verify'),
      form : form
    };

  }catch(err){

    console.log('verify fail'+err);
  }

    var result = yield request.Post(postObj,common);

    return result;
}

module.exports = verify;
