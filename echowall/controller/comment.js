/**
 * 评论模块 comment.js
 * @authors Carmelo Lcanboom
 */

var express = require('express');
var router = express.Router();
//var database = require('./function/dbconnection');
var database = require('./function/dbPoolConnection');
var wechatCommunicate = require('./function/wechatCommunicate.js');
var param;

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
	var pool = database.connection();
	wechatCommunicate.verifySk(sk).then(isVerified => {
		if (isVerified) {
			wechatCommunicate.getUserInfo(openid).then(result => {
				console.log(result);
				if (Array.isArray(result) && result.length === 0){
					error = {
				    	'status': 500,
				    	'error': 'openid is not exits',						
					}
					res.json(error);
				}					
				else {
					// 事件的事务组成
					
					var sql_add_comment = "insert INTO comment set ?";
					param = {
						'userId': result[0].id, 
						'echoId': echoid,
						'content': content,
						'time': time
					};
					sqlArray.push(database.getSqlParamEntity(sql_add_comment, param));
					
					var sql_add_userAction = "insert INTO userAction set ?";
					param = {
						'userId': result[0].id, 
						'echoId': echoid,
						'actionType': 'commit',
						'time': time
					};
					sqlArray.push(database.getSqlParamEntity(sql_add_userAction, param));
					
					var	sql_add_echoCommentCount = "update echowall set commentCount = commentCount + 1 where ?";
					param = { 'id': echoid };
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

router.post('/like',function(req, res, next){
	var openid = req.body.openid;
	var sk = req.body.sk;
	var commentid = req.body.commentid;
	var flag = req.body.flag;
	var time = req.body.time;
	var sqlArray = [];
	var pool = database.connection();
	var	sql_add_Commentlike;
	wechatCommunicate.verifySk(sk).then(isVerified => {
		if (isVerified) {
			wechatCommunicate.getUserInfo(openid).then(result => {
				console.log(result);
				if (Array.isArray(result) && result.length === 0){
					error = {
				    	'status': 500,
				    	'error': 'openid is not exits',						
					}
					res.json(error);
				}					
				else {
					// 事件的事务组成
					var sql_add_userAction = "insert INTO userAction set ?";
					param = {
						'userId': result[0].id, 
						'commentId': commentid,
						'actionType': 'like',
						'time': time
					};
					sqlArray.push(database.getSqlParamEntity(sql_add_userAction, param));
					
					if (flag) 
						sql_Commentlike = "update comment set likeNum = likeNum + 1 where ?";
					else
						sql_Commentlike = "update comment set likeNum = likeNum - 1 where ?";						
					param = { 'id': commentid };
					sqlArray.push(database.getSqlParamEntity(sql_Commentlike, param));

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