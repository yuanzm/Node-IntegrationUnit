var url = require('../urls');
var request = require('../request');
var user = require('../user');

var mayChange = function*(){

  var read = yield user.read('user.json');
  var doc = yield user.yaml('./doc/mayChange.yml');
  //多个测试
  for(var i in doc.test){

    var params = {
        childpath: doc.url,
        userId: read.data.id,
        changeType: doc.test[i].req.changeType
    };

    var Obj = user.common(params,read,doc);

    var result = yield request.Get(Obj); //Get is promise

    // console.log('hello '.red+doc_mayChange.req.changeType+result);
    user.compare(result,doc.test[i]);
  }

  return result;

}

module.exports = mayChange;
