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
	// 获取缓存中有序集合的 id 列表
	var connection = database.connection();
	var redis_client = database.redis_connection();
	database.redis_zrevrangebyscore(redis_client, zset).then((result) => {
		result = arrayToString(array);
		console.log(result);
		res.jsonp(result);
	})
	redis_client.quit();
});


module.exports = router;