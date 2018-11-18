# -*- encoding: UTF-8 -*-
import redis
import time
import datetime

'''
每隔两周清空 redis 中的浏览量统计
'''

pool = redis.ConnectionPool(host='localhost',port=6379,db=0,password='echowall')
client = redis.StrictRedis(connection_pool=pool)
 
def write_to_file(content):
	time = datetime.datetime.now().date()
	with open("/home/Carmelo/Lcanboom/echowall/regularTasks/insertlog/{time}.txt".format(time=time), 'a', encoding='utf-8') as f:
		f.write(content + '\n')

def clear_redis(client, name):
	result = client.delete(name)
	print(result)


def main():
	clear_redis(client, "runoobkey")

main()