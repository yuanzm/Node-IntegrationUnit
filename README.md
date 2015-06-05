## Ready

```js
npm install & npm update

npm install iojs-bin -g
```

## Usage


```js
├── Makefile
├── README.md
├── app.js
├── doUnit.js
├── doc
│   └── user
│       ├── doChange.yml
│       ├── getNewName.yml
│       ├── mayChange.yml
│       └── register.yml
├── package.json
├── request.js
├── treehole.log
├── urls.js
├── user.json
├── userRegister.js
└── utils.js
```

one tesing yml file like this:

doChange.yml
```yml
method: post
url: post/comment
test:
  comment:
    name: comment
    req:
        userName: hello
        content:
            text: world
    dependence:
        method: post
        url: post/save
        params:
          postId: id  ## postId is the necessary to post/comment , id is for post/save
    res:
      rs:
      data:
          id:
            type: string ## response type match
      error:

```

## Testing

```js
make start
```

### Browser

```js
// the url is correspond the file of yml path
http://localhost:4000/v2/post/comment

// response
{"data":{"id":"55719082e4b0daed9b2050a5","createdAt":1433505922696,"content":"{\"text\":\"dfdfdaf\"}","userId":"55718ee3e4b0daed9b205098","userName":"树洞君","likes":0,"whisper":0,"hotTag":false},"rc":"1"}
```

### Proxy
```js

//if u want to use proxy(charles),  uncomment the request.js
// var r = request.defaults({'proxy':'http://192.168.1.103:8888'});

//then  delete the line
var r = request;
```
