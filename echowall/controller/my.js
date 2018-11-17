/*
* 关于某位特定用户的信息
*/

var express = require('express');
var router = express.Router();
var database = require('./function/dbconnection');
//var database = require('./function/dbPoolConnection');
var per_page_count = 10;
var page;
var start;
var sql;

/*
* 获取某 user 的评论列表
*/
router.get('/comment',function(req, res, next){
	var connection = database.connection();
	var echoId = req.query.echoid;
	page = req.query.page;
	start = (page - 1) * per_page_count;
	sql = "Select * from comment" + "ORDER BY time DESC limit " + start + ", " + per_page_count;
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
