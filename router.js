// 引入所需模块
var express     = require('express');
var router      = express.Router();
var doUnit 		= require('./controllers/doUnit.js')

router.get('/v2/:dir/:file', doUnit.index);

module.exports = router;
