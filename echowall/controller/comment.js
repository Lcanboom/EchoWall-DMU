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
var sqlArray = [];
var per_page_count = 10;
var page;
var start;
var sql;

/*
* 添加评论
*/
router.post('/add',function(req, res, next){
	var openid = req.body.openid;
	var sk = req.body.sk;
	var echoid = req.body.echoid;
	var content = req.body.content;
	var time = req.body.time;
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
						sqlArray = [];
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
	console.log(flag);
	var time = req.body.time;
	var pool = database.connection();
	var	sql_Commentlike;
	var actionType;
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
					if (flag) {
						actionType = 'like_do';
						sql_Commentlike = "update comment set likeNum = likeNum + 1 where ?";						
					}
					else{
						actionType = 'like_undo';						
						sql_Commentlike = "update comment set likeNum = likeNum - 1 where ?";												
					}

					var sql_add_userAction = "insert INTO userAction set ?";
					param = {
						'userId': result[0].id, 
						'commentId': commentid,
						'actionType': actionType,
						'time': time
					};
					sqlArray.push(database.getSqlParamEntity(sql_add_userAction, param));
										
					param = { 'id': commentid };
					sqlArray.push(database.getSqlParamEntity(sql_Commentlike, param));

					database.transaction(pool, sqlArray).then( (err, result) => {
						if (err) 
							res.json(err);
						else
							res.json(result);
						sqlArray = [];
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

router.post('/dislike',function(req, res, next){
	var openid = req.body.openid;
	var sk = req.body.sk;
	var commentid = req.body.commentid;
	var time = req.body.time;
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
					var sql_dislike_userAction = "insert INTO userAction set ?";
					param = {
						'userId': result[0].id, 
						'commentId': commentid,
						'actionType': 'dislike',
						'time': time
					};
					sqlArray.push(database.getSqlParamEntity(sql_dislike_userAction, param));
					
					var	sql_commentDislike = "update comment set dislikeNum = dislikeNum + 1 where ?";
					param = { 'id': commentid };
					sqlArray.push(database.getSqlParamEntity(sql_commentDislike, param));

					database.transaction(pool, sqlArray).then( (err, result) => {
						if (err) 
							res.json(err);
						else
							res.json(result);
						sqlArray = [];
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

/*
* 获取某 id 的回音壁信息的评论列表
*/
router.get('/list',function(req, res, next){
	var connection = database.connection();
	var echoId = req.query.echoid;
	page = req.query.page;
	start = (page - 1) * per_page_count;
	sql = "SELECT userId, content, likeNum, dislikeNum, date_format(time, '%Y-%m-%d %H:%i:%s') time FROM comment where ? ORDER BY time DESC limit " + start + ', ' + per_page_count;
	database.query(connection, echoId, sql).then((data) => {
		if (data)
			res.jsonp(data);
		else
			res.jsonp({
		    	'status': "500",
		    	'message':"query error",
			})
	}, (err) => {
			res.jsonp(err);	
	});
})

module.exports = router;