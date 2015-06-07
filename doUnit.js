// 引入所需模块
var url = require('./common/urls.js');
var utils = require('./common/utils.js');
var request = require('./common/request.js');
var eventproxy   = require('eventproxy');
var tools = require('./common/tools.js')

// 一个测试用例
function DoUnit(pathname, callback) {
    this.pathname = pathname;
    this.callback = callback;
    // 如果有依赖
    this.times = 1;
    this.ep = new eventproxy();
    this.result_group = [];
}

DoUnit.prototype = {
    constructor: DoUnit,
    // 初始化测试
    init: function() {
        this.eventDataBus();
        this.readJson();
        this.loadYaml();
    },
    // 事件监听注册
    eventDataBus: function() {
        var self = this;
        this.ep.all('read-success', 'yaml-doc-success', function(read, doc) {
            self.Test(read, doc);
        });

        this.ep.on('unit-done', function(result) {
            self.callback(null, result);
        });
    },
    // 读取`user.json`文件
    readJson: function() {
        var self = this;
        utils.read('user.json', function(err, result) {
            if (err) {
                console.log('something wrong in read');
            }
            self.ep.emit('read-success', result);
        });
    },
    // 加载测试文档
    loadYaml: function() {
        var self = this;
        utils.yaml(self.pathname, function(err, doc) {
            if (err) {
                console.log("something wrong in load doc");
            }
            self.ep.emit('yaml-doc-success', doc);
        });
    },
    // 没有依赖的测试
    Test: function(read, doc) {
        for(var i in doc.test) {
            this.oneTest(doc.test[i], read, doc);
        }
    },
    // 判断是否有依赖
    hasDep: function(testObj) {
        return !!testObj.dependence;
    },
    // 一个测试用例
    oneTest: function(testObj, read, doc) {
        var dep = this.hasDep(testObj);
        if (dep) {
            this.depTest(testObj, read, doc);
        } else {
            this.noDepTest(testObj, read, doc);
        }
    },
    // 没有依赖的测试
    noDepTest: function(testObj, read, doc) {
        var self = this;
        var params = {};
        // 首先解析测试用例的请求对象
        for(var j in testObj.req) {
            var isObject = tools.is(testObj.req[j], "Object");
            params[j] = isObject ? JSON.stringify(testObj.req[j]) : testObj.req[j];
        }

        this.childTest(params, read, doc, function(err, result) {
            console.log(result);
            self.callback(null, result);
        });
    },
    // 有依赖的测试
    depTest: function(testObj, read, doc) {
        // ...
    },
    // 一个子测试用例
    childTest: function(params, read, doc, callback) {
        // console.log('child')
        var proxy = new eventproxy();
        var self = this;

        proxy.on("last-request-success", function(body) {
            var result = body;
            callback(null, result);
        });

        var Obj =  utils.common(params, read, doc);
        var flag = doc.method === 'post' ? true: false;
        if (flag === true) {
            request.Post(Obj, function(err, body) {
                proxy.emit("last-request-success", body);
            })  
        } else {
            request.Get(Obj, function(err, body) {
                proxy.emit("last-request-success", body);
            })
        }
    }   
}

module.exports = DoUnit;
