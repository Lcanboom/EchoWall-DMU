# -*- encoding: UTF-8 -*-
import redis
import pymysql
pool = redis.ConnectionPool(host='localhost',port=6379,db=0,password='echowall')
r = redis.StrictRedis(connection_pool=pool)
db = pymysql.connect("localhost","root","521Loli","test_echo")

# 使用cursor()方法获取操作游标 
cursor = db.cursor()
 
# SQL 更新语句
sql = "UPDATE echowall SET viewCount = viewCount + ？ WHERE id = '？'" 

try:
   # 执行sql语句
   cursor.execute(sql, (3, "66707131"))
   # 执行sql语句
   db.commit()
except:
	# 发生错误时回滚
	db.rollback()
 
# 关闭数据库连接
db.close()

keys = r.keys()
print(type(keys))
print(keys)
view_last_twoWeek = r.zrange("view_last_twoWeek", 0, -1, withscores=True)
print(type(view_last_twoWeek))
print(view_last_twoWeek) 