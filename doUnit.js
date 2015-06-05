var url = require('./common/urls.js');
var utils = require('./common/utils.js');
var request = require('./common/request.js');

var eventproxy   = require('eventproxy');

var doUnit = function(pathname, callback) {
    var ep = new eventproxy();
    times = 0;

    utils.read('user.json', function(err, result) {
        if (err) {
            console.log('something wrong in read');
        }
        ep.emit('read-success', result);
    });

    utils.yaml(pathname, function(err, doc) {
        if (err) {
            console.log("something wrong in load doc");
        }
        // times = doc.test.length;
        for (var i in doc.test) {
            times++;
        }
        console.log(times);
        ep.emit('yaml-doc-success', doc);
    });

    var result_group = [];

    ep.all("read-success", "yaml-doc-success", function(read, doc) {
        var proxy = new eventproxy();

        // 遍历多个测试用例
        for(var i in doc.test){
            var params = {};
            // 先解决依赖
            // --------------------------事件监听-------------------------------
            proxy.after('unit-done',times, function() {
                console.log("完成")
                return callback(null, result_group);
            })
            proxy.on("parse-param-success", function() {
                // console.log('doc is', doc);
                // 解决params
                for(var j in doc.test[i].req){
                    var isObject = typeof doc.test[i].req[j] === 'object';
                    params[j] = isObject ? JSON.stringify(doc.test[i].req[j]) : doc.test[i].req[j];
                }

                proxy.emit("let-us-test");
            })

            proxy.on("let-us-test", function() {
                proxy.on("last-request-success", function(body) {
                    result = body;
                    utils.compare(result,doc.test[i]);
                    result_group.push(result);

                    proxy.emit("unit-done")
                })
                // console.log(params);
                // params 转换为最终请求的参数
                var Obj =  utils.common(params, read, doc);
                // 判断是post 还是get
                var flag = doc.method === 'post' ? true: false;
                if (flag === true) {
                    request.Post(Obj, function(err, body) {
                        // console.log(body);
                        proxy.emit("last-request-success", body);
                    })  
                } else {
                    request.Get(Obj, function(err, body) {
                        proxy.emit("last-request-success", body);
                    })
                }

            })
            // --------------------------事件监听-------------------------------
            if (!!doc.test[i].dependence) {
                console.log('has dep')
                var _url = doc.test[i].dependence.url,
                    _method = doc.test[i].dependence.method,
                    _params = doc.test[i].dependence.params;

                // 判断依赖是否 有 url , request method ,params
                if ( !!_url && !!_method && !!_params) {
                    //如果有，取出url , 读取对应的yml
                    var path_arr = _url.split('/');
                    try{
                        var doc_path = __dirname +'/doc/'+path_arr[0]+'/'+path_arr[1]+'.yml';

                        utils.yaml(doc_path, function(err, doc) {
                            proxy.emit('load-json-success', doc);
                        });
                    } catch(e) {
                        return '依赖文件不存在,请检查测试用例的依赖是否有误';
                    }

                    proxy.on('load-json-success', function(doc) {
                        var dependence_doc = doc; 
                        var dependence_form = {};
                        var req = dependence_doc.test[path_arr[1]].req;

                        for(var r in req){
                            dependence_form[r] = typeof req[r] === 'object' ? JSON.stringify(req[r]) : req[r];
                        }
                        
                        // 获取最终请求的参数
                        var Params =  utils.common(dependence_form , read, dependence_doc);
                        var flag = _method === 'post'? true: false;
                        if (flag === true) {
                            request.Post(Params, function(err, body) {
                                ep.emit("request-success", body);
                            })  
                        } else {
                            request.Get(Params, function(err, body) {
                                ep.emit("request-success", body);
                            })
                        }

                        proxy.on("request-success", function(body) {
                            _result = body;
                            for(var p in _params){
                                params[p] = JSON.parse(_result).data[_params[p]];
                                ep.emit("parse-param-success");
                            }
                        }); 
                        // Important 解决依赖中我们需要的参数
                    });
                }
            } else {
                proxy.emit("parse-param-success");
            }
        }
    });
}

module.exports = doUnit;
