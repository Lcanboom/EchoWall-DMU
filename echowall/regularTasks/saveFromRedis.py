# -*- encoding: UTF-8 -*-
import redis
pool = redis.ConnectionPool(host='localhost',port=6379,db=0)
r = redis.StrictRedis(connection_pool=pool)

keys = r.keys()
print type(keys)
print (keys)