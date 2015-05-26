var url = require('../urls');
var user = require('../user');
var request = require('../request');

var doChange = function*(){

  var read = yield user.read('user.json');
  var doc = yield user.yaml('./doc/doChange.yml');

  for(var i in doc.test){

    var params = {
      userId: read.data.id,
      oldName: read.data.userName,
      newName: '某人的新名字',
      isChange: doc.test[i].req.isChange
    }

    var Obj =  user.common(params, read, doc);

    var result = yield request.Post(Obj.info , Obj.token);

  }

  return result;
}

module.exports = doChange;
