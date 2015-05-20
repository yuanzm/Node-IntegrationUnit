var url = require('../urls');
var user = require('../user');
var request = require('../request');

var doChange = function*(){

  var read = yield user.read('user.json');

  var form = {
    userId: userId,
    oldName: read.data.userName,
    newName: '某人的新名字',
    isChange: 1
  }

  var postObj = {
    url : url.postUrl('user/doChange'),
    form : form
  };

  var result = yield request.Post(postObj,common);

  return result;
}

module.exports = doChange;
