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
	# 获取昨天的数据
	yesterday = getYesterday()
	data = read_yesterday_csv(yesterday)
	if parms[1] in data.keys() and parms[0] > float(data[parms[1]]):	# 排除两周后缓存数据清 0
		increaseCount = parms[0] - float(data[parms[1]])				# 今天 - 昨天 = 增量
	else:
		increaseCount = parms[0]
	# 使用cursor()方法获取操作游标 
	cursor = db.cursor()
	sql_add = "UPDATE echowall SET viewCount = viewCount + %s WHERE id = %s"
	try:
		# 事务开始
		db.begin()
		cursor.execute(sql_add, (increaseCount, parms[1])) 
		result = "id：" + str(parms[1]) + "  " + "新增浏览数：" + str(increaseCount) + "  " + time.asctime(time.localtime(time.time()));
		print(result)
		write_to_file(result)
	except Exception as e:
		db.rollback()  # 事务回滚
		print('事务处理失败', e)
	else:
		db.commit()  # 事务提交
		print('-------事务处理成功---------')


def get_from_redis(client, name, csvFile):
	view_last_twoWeek = client.zrange(name, 0, -1, withscores=True)
	for item in view_last_twoWeek:
		print(item)
		id = str(item[0], encoding="utf-8")
		increase = item[1]
		write_toCsv(csvFile, [id, increase])
		save_to_mysql(db, (increase, id))

def write_toCsv(fileName, parms):
	# 文件头，一般就是数据名
	#fileHeader = ["echoid", "viewCount"]
	# 写入数据
	csvFile = open("/home/Carmelo/Lcanboom/echowall/regularTasks/log/yesterday/{fileName}.txt".format(fileName=fileName), "a+")
	writer = csv.writer(csvFile)

	# 写入的内容都是以列表的形式传入函数
	#writer.writerow(fileHeader) 省略了头信息
	writer.writerow(parms)
	csvFile.close()

def read_yesterday_csv(fileName):
	# 读取csv至字典
	csvFile = open("/home/Carmelo/Lcanboom/echowall/regularTasks/log/yesterday/{fileName}.txt".format(fileName=fileName), "r")
	reader = csv.reader(csvFile)
	# 建立空字典
	result = {}
	for item in reader:
	    print(type(item))
	    result[item[0]] = item[1]
	csvFile.close()
	return result

def getYesterday(): 
    today = datetime.date.today() 
    oneday = datetime.timedelta(days=1) 
    yesterday = today - oneday  
    return yesterday.strftime('%Y-%m-%d')

def getToday():
    today = datetime.date.today() 
    return today.strftime('%Y-%m-%d')	

def main():
	today = getToday()
	# 将当天入库的数据写入 csv 文件
	get_from_redis(r, "view_last_twoWeek_forTest", today)
	db.close()
	#data = read_yesterday_csv(today)
	print(data['68377513'])
	print(type(data['68377513']))

main()