/*
	回音壁信息查询
	@authors Carmel
*/
var express = require('express');
var router = express.Router();
var database = require('./function/dbconnection');

// 处理get请求, 获得所有回音壁信息
router.get('/', function(req, res) {
	var connection = database.connection();
	var  sql = 'SELECT * FROM echowall ORDER BY time DESC';
	database.query(connection, null ,sql, res);
});

// 根据信箱类型，获取回音壁相关信息
router.get('/bybox', function(req, res) {
	var connection = database.connection();
	var box_name = req.query.box;
	var sql = "SELECT * FROM echowall WHERE box = ? ORDER BY time DESC";
	database.query(connection, box_name, sql, res);
});

// 根据时间段（start_time，end_time）获取回音壁信息
router.get('/bytime', function(req, res) {
	var connection = database.connection();
	var start_time = req.query.start_time;
	var end_time = req.query.end_time;
	var sql = "SELECT * FROM echowall WHERE time between ? AND  ? ORDER BY time DESC";
	database.query(connection, [start_time, end_time], sql, res);
});

// 根据 title 关键字进行模糊查询，获取回音壁信息。
router.get('/bykey', function(req, res) {
	var connection = database.connection();
	var title_key = '%' + req.query.key + '%';
	var sql = "SELECT * FROM echowall WHERE title LIKE ? ORDER BY time DESC";
	database.query(connection, title_key, sql, res);
});

module.exports = router;
