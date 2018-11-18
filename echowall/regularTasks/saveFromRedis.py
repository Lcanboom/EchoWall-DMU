# -*- encoding: UTF-8 -*-
import redis
import pymysql
import time

db = pymysql.connect("localhost","root","521Loli","test_echo")
pool = redis.ConnectionPool(host='localhost',port=6379,db=0,password='echowall')
r = redis.StrictRedis(connection_pool=pool)
 
def write_to_file(content):
	time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) 
    with open('/home/Carmelo/Lcanboom/echowall/regularTasks/insertlog/{time}.txt'.format(time=time), 'a', encoding='utf-8') as f:
        f.write(content + '\n')

def save_to_mysql(db, parms):
	# 使用cursor()方法获取操作游标 
	cursor = db.cursor()
	sql = "UPDATE echowall SET viewCount = viewCount + %s WHERE id = %s" 
	try:
		# 执行sql语句
		reCount = cursor.execute(sql, parms)
		print(reCount)
		# 执行sql语句
		db.commit()
		result = "共更新mysql条数：" + str(reCount) + "  " + time.asctime(time.localtime(time.time()));
		print(result)
		write_to_file(result)
	except:
		# 发生错误时回滚
		db.rollback()

def get_from_redis(client):
	view_last_twoWeek = client.zrange("view_last_twoWeek", 0, -1, withscores=True)
	for item in view_last_twoWeek:
		print(item)
		id = str(item[0], encoding="utf-8")
		increase = item[1]
		save_to_mysql(db, (increase, id))

def main():
	get_from_redis(r)
	db.close()

main()