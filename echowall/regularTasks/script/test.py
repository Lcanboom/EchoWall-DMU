# -*- encoding: UTF-8 -*-
import redis
import pymysql
import time
import datetime
import csv


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
	sql_id = "select viewCount from echowall WHERE id = %s"
	sql_add = "UPDATE echowall SET viewCount = viewCount + %s WHERE id = %s"
	try:
		# 事务开始
		db.begin()
		cursor.execute(sql_id, parms[1]) 
		data = cursor.fetchone()
		increase_viewCount = parms[0] - data[0]
		# 更新
		reCount = cursor.execute(sql_add, (increase_viewCount, parms[1]))
		result = "id：" + str(parms[1]) + "  " + "新增浏览数：" + str(increase_viewCount) + "  " + time.asctime(time.localtime(time.time()));
		print(result)
		write_to_file(result)
	except Exception as e:
		db.rollback()  # 事务回滚
		print('事务处理失败', e)
	else:
		db.commit()  # 事务提交
		print('-------事务处理成功---------')

def get_from_redis(client, name):
	view_last_twoWeek = client.zrange(name, 0, -1, withscores=True)
	for item in view_last_twoWeek:
		print(item)
		id = str(item[0], encoding="utf-8")
		increase = item[1]
		write_yesterday_toCsv([id, increase])
		#save_to_mysql(db, (increase, id))

def write_yesterday_toCsv(parms):
	# 文件头，一般就是数据名
	#fileHeader = ["echoid", "viewCount"]
	# 写入数据

	csvFile = open("yesterday.csv", "a")
	writer = csv.writer(csvFile)

	# 写入的内容都是以列表的形式传入函数
	#writer.writerow(fileHeader)
	writer.writerow(parms)
	csvFile.close()

def read_yesterday_csv(fileName):
	# 读取csv至字典
	csvFile = open(fileName, "r")
	reader = csv.reader(csvFile)

	# 建立空字典
	result = {}
	for item in reader:
	    # 忽略第一行
	    #if reader.line_num == 1:
	        #continue
	    print(type(item))
	    result[item[0]] = item[1]
	csvFile.close()
	return result



def main():
	get_from_redis(r, "view_last_twoWeek_forTest")
	db.close()
	data = read_yesterday_csv("yesterday.csv")
	print(data['68377513'])
	print(type(data['68377513']))
	if '675432' in data.keys():
		print("yes")
	else:
		print("no")
main()