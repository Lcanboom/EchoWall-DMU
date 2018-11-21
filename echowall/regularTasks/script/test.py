# -*- encoding: UTF-8 -*-
import redis
import pymysql
import time
import datetime


db = pymysql.connect("localhost","root","521Loli","test_echo")
pool = redis.ConnectionPool(host='localhost',port=6379,db=0,password='echowall')
r = redis.StrictRedis(connection_pool=pool)
 
def write_to_file(content):
	time = datetime.datetime.now().date()
	with open("/home/Carmelo/Lcanboom/echowall/regularTasks/log/insertlog/{time}.txt".format(time=time), 'a', encoding='utf-8') as f:
		f.write(content + '\n')

def save_to_mysql(db, parms):
	# 使用cursor()方法获取操作游标 
	cursor = db.cursor()
	sql = "UPDATE echowall SET viewCount = viewCount + %s WHERE id = %s" 
	try:
		# 执行sql语句
		reCount = cursor.execute(sql, parms)
		# 执行sql语句
		db.commit()
		result = "更新的回音壁信息 id：" + str(parms[1]) + "  " + time.asctime(time.localtime(time.time()));
		print(result)
		write_to_file(result)
	except:
		# 发生错误时回滚
		db.rollback()

def query_echo_byId(db, id):
	# 使用cursor()方法获取操作游标 
	cursor = db.cursor()
	sql = "select viewCount from echowall WHERE id = %s" 
	try:
		# 执行sql语句
		reCount = cursor.execute(sql, id)
		data = cursor.fetchone()
		db.commit()
		print(data[0])
		print(type(data[0]))
	except:
		# 发生错误时回滚
		db.rollback()	

def get_from_redis(client, name):
	view_last_twoWeek = client.zrange(name, 0, -1, withscores=True)
	for item in view_last_twoWeek:
		print(item)
		id = str(item[0], encoding="utf-8")
		increase = item[1]
		#save_to_mysql(db, (increase, id))
		query_echo_byId(db, id)

def main():
	get_from_redis(r, "view_last_twoWeek_forTest")
	db.close()

main()