# -*- encoding: UTF-8 -*-
import redis
pool = redis.ConnectionPool(host='localhost',port=6379,db=0,password='echowall')
r = redis.StrictRedis(connection_pool=pool)

keys = r.keys()
print(type(keys))
print(keys)
view_last_twoWeek = r.zrange("view_last_twoWeek", 0, -1, withscores=True)
print(type(view_last_twoWeek))
print(view_last_twoWeek) 