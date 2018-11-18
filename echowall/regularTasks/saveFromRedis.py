# -*- encoding: UTF-8 -*-
import redis
import pymysql
pool = redis.ConnectionPool(host='localhost',port=6379,db=0,password='echowall')
r = redis.StrictRedis(connection_pool=pool)
db = pymysql.connect("localhost","root","521Loli","test_echo")
cursor = db.cursor()

# 使用 execute()  方法执行 SQL 查询 
cursor.execute("SELECT VERSION()")
 
# 使用 fetchone() 方法获取单条数据.
data = cursor.fetchone()
 
print ("Database version : %s " % data)
 
# 关闭数据库连接
db.close()

keys = r.keys()
print(type(keys))
print(keys)
view_last_twoWeek = r.zrange("view_last_twoWeek", 0, -1, withscores=True)
print(type(view_last_twoWeek))
print(view_last_twoWeek) 