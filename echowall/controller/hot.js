var express = require('express');
var router = express.Router();
//var database = require('./function/dbconnection');
var database = require('./function/dbPoolConnection');
var zset = "view_last_twoWeek";
var per_page_count = 10;
var page;
var start;
var sql;

function arrayToString(array) {
	return array.reduce((acc, item) => {
			return  acc + "," + '\'' + item + '\'';
			}, '\'' + array[0] + '\'');
}

// 获取热门的回音壁信息（标准：两周时间内的浏览量降序排序）
router.get('/byview', function(req, res){
	var connection = database.connection();
	var redis_client = database.redis_connection();
	page = req.body.page;
	start = (page - 1) * per_page_count;
	// 获取缓存中有序集合的 id 列表
	database.redis_zrevrangebyscore(redis_client, zset).then((hotlist) => {
		hotlist = arrayToString(hotlist);
		console.log(hotlist);
		sql = "select * from echowall where id in (?) order by FIELD(id, ?) LIMIT " + start + ', ' + per_page_count; 
		database.query(connection, hotlist, sql).then((data) => {
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
	}, (err) => {
		res.jsonp(err);	
	})
	redis_client.quit();
});

module.exports = router;