## 准备

```js
npm install & npm update

npm install iojs  nodemon -g
```

## 使用

文档目录如下：

```js
├── app.js
├── doc
│   ├── doChange.yml
│   ├── getNewName.yml
│   ├── mayChange.yml
│   └── register.yml
├── package.json
├── request.js
├── treehole.log
├── urls.js
├── user
│   ├── doChange.js
│   ├── getNewName.js
│   ├── mayChange.js
│   ├── userRegister.js
│   └── verify.js
├── user.js
└── user.json
```

doc目录下一个yml测试用例对应user目录下的一个测试脚本。


doChange.yml
```yml
method: post
url: user/doChange
test:
  doChange:
    name: doChange
    req:
      isChange: 0
    res:
      rs:
      data:
        score:
          type: number
      error:
  doChange1:    # 这里继续添加一个测试用例
    name: doChange1
    req:
      isChange: 1
    res:  # res 为响应的数据，这里写上限定类型或者指定值，可以参照其他yml文件
      rs:
      data:
        score:
          type: number
      error:

```

下面是一个测试脚本

doChange.js
```js
var url = require('../urls');
var user = require('../user');
var request = require('../request');

var doChange = function*(){

  var read = yield user.read('user.json');
  var doc = yield user.yaml('./doc/doChange.yml');
  for(var i in doc.test){

    var params = {
      userId: read.data.userId,
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
```

写完一个测试脚本，还需要在app.js 中引入

```js
var user_doChange = require('./user/doChange');

...
var doChange = yield co(user_doChange);

console.log(doChange);

```


## 运行测试

```js
nodemon app.js
```

在浏览器中输入相对应的url如下
```js
http://localhost:4000/user/doChange
```
返回相对应的信息
```js
{"data":{"id":"5563e4b6e4b004f5e6035f70","createdAt":1432609974522,"userName":"某人的新名字","deviceId":"1432609972461","clientId":null,"address":null,"verification":0,"schoolAlias":"","channelId":"weixin","accessToken":"D8F9A79626CBF855B23433C49F6B7772","validTime":1435288374522,"inScope":null,"switchs":{},"fisrtChanged":true,"versionCode":0,"names":{"subNames":["某人的新名字"],"mainName":null,"mayMainName":"新名字"},"school":"","score":0},"rc":"1"}
```

## 补充:

1. 测试用例所对应的`type` `value` 对比log在 `treehole.log`
2. 每次修改文件都会自动重新运行一个脚本，每次注册的用户信息在`user.json`
3. 如果要抓包，可以修改 `request.js` ，如下

```js
//使用时，将第一段注释去掉，第二段注释

// var r = request.defaults({'proxy':'http://192.168.1.103:8888'});
var r = request;
```

### 待完善

每个脚本之间存在冗余，可以将多个测试用例对应多个测试脚本这个改成多个测试用例对应一个测试脚本，
脚本所对应的测试用例由路由控制。



##下面请无视

### 文档补充
1. Header 里面要加入 userId
2. doChange 换名返回的接口的是user json , score 有减去100
3. 超级名是[ ]

接口待完善地方:

1. 匹配yml和res的字段,如果没有就抛出异常.
2. 测试用例如果多个，只能返回最后一个测试用例的结果，但比较结果是有打印在日志的可以用array.push解决

代码重构中...
