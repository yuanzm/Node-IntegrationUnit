var url = require('../urls');
var user = require('../user');
var request = require('../request');

var getNewName = function*(){
  var read = yield user.read('user.json');
  var doc = yield user.yaml('./doc/getNewName.yml');

  for(var i in doc.test){

    var params = {
        userId: read.data.id,
        changeType: doc.test[i].req.changeType,
    };

    var Obj =  user.common(params, read, doc );

    var result = yield request.Get(Obj); //Get is promise

    user.compare(result, doc.test[i]);
  }

  return result;
}

module.exports = getNewName;
