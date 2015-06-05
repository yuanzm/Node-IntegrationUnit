var url = require('./urls');
var utils = require('./utils');
var request = require('./request');

var doUnit = function*(pathname){

  var read = yield utils.read('user.json');
  var doc = yield utils.yaml(pathname);
  var result_group = [];

  // 遍历多个测试用例
  for(var i in doc.test){

    var params = {};

    // 先解决依赖
    if (!!doc.test[i].dependence) {

        var _url = doc.test[i].dependence.url,
            _method = doc.test[i].dependence.method,
            _params = doc.test[i].dependence.params
            ;

        // 判断依赖是否 有 url , request method ,params
        if ( !!_url && !!_method && !!_params) {

            //如果有，取出url , 读取对应的yml
            var path_arr = _url.split('/');

            // path_arr[0] => dir [1] => filename
            try{
              var doc_path = __dirname +'/doc/'+path_arr[0]+'/'+path_arr[1]+'.yml';

              var dependence_doc = yield utils.yaml(doc_path);

            }catch(e){
                return '依赖文件不存在,请检查测试用例的依赖是否有误';
            }

            var dependence_form = {};
            var req = dependence_doc.test[path_arr[1]].req;

            for(var r in req){
                dependence_form[r] = typeof req[r] === 'object' ? JSON.stringify(req[r]) : req[r];
            }

            // 获取最终请求的参数
            var Params =  utils.common(dependence_form , read, dependence_doc);

            var _result = _method === 'post' ? yield request.Post(Params) : yield request.Get(Params);

            // Important 解决依赖中我们需要的参数
            for(var p in _params){
              params[p] = JSON.parse(_result).data[_params[p]];
            }
        }
    }

    // 解决params
    for(var j in doc.test[i].req){
        // 如果j是对象的话
        // console.log(doc.test[i].req[j]);
        var isObject = typeof doc.test[i].req[j] === 'object';
        params[j] = isObject ? JSON.stringify(doc.test[i].req[j]) : doc.test[i].req[j];
    }

    // console.log(params);
    // params 转换为最终请求的参数
    var Obj =  utils.common(params, read, doc);

    // 判断是post 还是get
    var result = doc.method === 'post' ? yield request.Post(Obj) : yield request.Get(Obj);

    // console.log(Obj);
    utils.compare(result,doc.test[i]);

    result_group.push(result);
  }

  return result_group;
}

module.exports = doUnit;
