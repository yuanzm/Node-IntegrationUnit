var url = require('./urls');
var utils = require('./utils');
var request = require('./request');

var doUnit = function*(pathname){

  var read = yield utils.read('user.json');
  var doc = yield utils.yaml(pathname);

  for(var i in doc.test){

    var params = {
      userId: read.data.id,
      oldName: read.data.userName
    }

    //遍历添加属性
    for(var j in doc.test[i].req){
        // console.log('key:'+ j + ' value: '+doc.test[i].req[j]);
        params[j] = doc.test[i].req[j];
    }

    // console.log(params);
    // params 转换为最终请求的参数
    var Obj =  utils.common(params, read, doc);

    var result = yield request.Post(Obj.info , Obj.token);
  }

  return result;
}

module.exports = doUnit;
