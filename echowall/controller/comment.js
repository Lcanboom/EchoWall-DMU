/**
 * 评论模块 comment.js
 * @authors Carmelo Lcanboom
 */

var express = require('express');
var router = express.Router();
//var database = require('./function/dbconnection');
var database = require('./function/dbPoolConnection');
var wechatCommunicate = require('./function/wechatCommunicate.js');
var param

/*
* 添加评论
*/
router.post('/add',function(req, res, next){
	var openid = req.body.openid;
	var sk = req.body.sk;
	var echoid = req.body.echoid;
	var content = req.body.content;
	var time = req.body.time;
	var sqlArray = [];
	wechatCommunicate.verifySk(sk).then(isVerified => {
		if (isVerified) {
			wechatCommunicate.getUserInfo(openid).then(result => {
				if (Array.isArray(result['data']) && result['data'].length === 0){
					error = {
				    	'status': 500,
				    	'error': 'openid is not exits',						
					}
					res.json(error);
				}					
				else {
					// 事件的事务组成
					var sql_add_comment = "insert comment set ?";
					param = {
						'userId': openid, 
						'echoId': echoid,
						'content': content,
						'time': time
					};
					sqlArray.push(database.getSqlParamEntity(sql_add_comment, param));
					
					var sql_add_userAction = "insert userAction set ?";
					param = {
						'userId': openid, 
						'echoId': echoid,
						'actionType': 'commit',
						'time': time
					};
					sqlArray.push(database.getSqlParamEntity(sql_add_userAction, param));
					
					var	sql_add_echoCommentCount = "update echowall set commentCount = commentCount + 1 where id = ?"
					param = {'id': echoid};
					sqlArray.push(database.getSqlParamEntity(sql_add_echoCommentCount, param));

					database.transaction(pool, sqlArray).then( (err, result) => {
						if (err) 
							res.json(err);
						else
							res.json(result);
					}, (err) => {
						res.json({
							'status': 500,
							'message': 'rollback errorr'
						})
					})
				}
			}, (error) => {
				res.json(error);
			})
		}
		else {
				error = {
			    	'status': 500,
			    	'error': 'sk is not exits',						
				}
				res.json(error);
		}
	}, (error) => {
		res.json(error);
	})
})

module.exports = router;