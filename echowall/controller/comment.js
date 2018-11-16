/**
 * 评论模块 comment.js
 * @authors Carmelo Lcanboom
 */

var express = require('express');
var router = express.Router();
//var database = require('./function/dbconnection');
var database = require('./function/dbPoolConnection');
var wechatCommunicate = require('./function/wechatCommunicate.js');

/*
* 添加评论
*/
router.post('/add',function(req, res, next){
	res.json({
		'fuck': 'you'
	})
})