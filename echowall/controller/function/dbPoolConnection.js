var mysql = require('mysql');
var redis = require('redis');
var config = require('../../config');
/**
 * Use mysql pool
 */
function connection() {
	var pool = mysql.createPool({
	  	host     : config.host,
	  	user     : config.mysql_user,
	  	password : config.mysql_password,
	  	database : config.mysql_database,
	  	port 	 : config.mysql_port		
	});
	return pool;
}

function query(pool, values, sql) {
	return new Promise( function(resolve, reject){
		pool.getConnection(function(err, connection) {
		  	if (err){ // not connected!
		  		error = {
		  			'status': 500,
		  			'error': 'not connected'
		  		}
		  		reject(error); 
		  	} 	  		
		  	// Use the connection
			connection.query(sql, values, function (err, data) {
			    var result;
			    if(err){
			    	result = {
			    		'status': "500",
			    		'message':"query error"
			    	}
			    	reject(result);
			    }
			    else{
			    	result = {
			    		'status': "200",
			    		'message':"query success",
			    		data: data
			    	}
					resolve(data);
			    }
			    // When done with the connection, release it.	    

			    connection.release();
			    
			    // Handle error after the release.

			    if (err) {
			  		error = {
			  			'status': 500,
			  			'error': 'Handle error after the release'
			  		}
			  		reject(error); 
			    }

			    // Don't use the connection here, it has been returned to the pool.	 	    
			});
		});
	})	
}

function redis_connection() {
	var host = config.host;
	var port = config.redis_port;
	var auth = config.redis_auth;
	var client = redis.createClient(port, host, auth);
	return client;
}

function redis_hash_set(client, name, key, values) {
	client.hset(name, key, values, function(err, ret){
		if (err) {
			console.log(err);
			return;
		}
	});
	client.quit();
}

exports.connection = connection;
exports.query = query;
exports.redis_connection = redis_connection;
exports.redis_hash_set = redis_hash_set;