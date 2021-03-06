var fs = require('fs');
var md5 = require('md5');
var jsyaml = require('js-yaml');
var Log = require('log');
var url = require('./urls');
var log = new Log('debug', fs.createWriteStream('treehole.log'));

// 将yaml解析成一个json对象
function yaml(fileName, callback){
    fs.readFile(fileName,{encoding: 'utf8'},function(err,data){
        if (err) {
            callback(err);
        } else {
            jsyaml.safeLoadAll(data,function(doc){
                callback(null, doc)
            })
        }
    })
}

function write(fileName,data, callback){
    //这里如果是必须是同步，因为异步无法知道他什么时候写入
    fs.writeFile(fileName,data, function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, 'success');
        }
    });
};

function read(fileName, callback){
    fs.readFile(fileName,{encoding: 'utf8'},function(err,data){
        // console.log('data : '+ data);
        if (err) {
            callback(err);
        }

        var result = JSON.parse(data);
        callback(null, result);
    });
}

//get request obj and form
// 每个请求都必须有accessToken , 把register用户持久化
function common(params , read , doc ) {

    var accessToken =  read.data.accessToken;
    var userId = read.data.id;

    var token = {
        accessToken : accessToken,
        userId : userId
    };

    params['userId'] = userId;

    if(doc.method === 'post'){
        var info = {
            url : url.postUrl(doc.url),
            form : params
        }
    } else if (doc.method === 'get') {
        params.childpath = doc.url;

        // console.log(params);
        var info = {
            url : url.getUrl(params)
        }
    }

    return {
        info : info,
        token : token
    }
}

//obj2 is reponse, obj2 is unit testing
function compare(res,doc){
    try {
        var res = typeof res !== 'object' ? JSON.parse(res).data : res;
    } catch (e) {
        console.log('返回类型匹配失败 error at func:compare');
    }

  //测试文件名
    var name;
    if (!!doc.name) {
        name = doc.name;
    } else {
        name = '......Current Child Object';
    }

    //判断是否是请求

    var doc = !!doc.res ? doc.res.data : doc;

    for (var key1 in res){
        for(var key2 in doc){
            if(key1 === key2){ //将相同的字段拿出来比较
            //测试案例如果要求是数组,例如[0, 1 ,2]
                if(Array.isArray(doc[key2].value)){

                    var index = doc[key2].value.indexOf(res[key1]);

                    if(index > -1){
                        log.info(name +' : '+ key1 +' is in array');
                    } else {
                        log.error(name + ' : %s 不在数组内', key1);
                    }
                }

                //判断类型,排除json
                if(typeof res[key1] ===  doc[key2].type ){
                    log.info(name +' : '+ key2 + ' type equal response '+ key1 +' type');

                    //判断类型完之后,如果有value, 看value是否相等
                    if(!!doc[key2].value && res[key1] === doc[key2].value){
                        log.info(name + ' :  '+key2+' value equal res');

                    }else if(!!doc[key2].value && !Array.isArray(doc[key2].value)){ //有value的情况下才进行下一步判断
                        log.error(name + ' : '+key2+ ' value not equal res');
                    }

                }else{ //防止某些json type抛出异常. else if
                    if(doc[key2].type === 'json'){
                        log.info(name + ' : '+ key2 + ' type is json');
                      // return;
                    } else {
                        log.error(name +' : '+ key2 + ' type error');
                    }

                }

                //如果这里想要改成object ,那还需要加一个判断条件否则doc[key2].value无值
                if(doc[key2].type === 'json'){
                    //递归
                    compare(res[key1],doc[key2].value);
                }
            }
        }
    }
}

module.exports = {
    write : write,
    read : read,
    yaml : yaml,
    compare : compare,
    common : common
};
