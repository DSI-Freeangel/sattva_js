var mysql = require('mysql');
module.exports = {
	getList : function(query, callback) {
		return MySQLConnectionImpl.getData(query, callback);
	},
	execute : function(query, callback) {
		return MySQLConnectionImpl.execute(query, callback);
	}
};

var MySQLConnectionImpl = new MySQLConnectionClass();

function MySQLConnectionClass() {
	var pool = mysql.createPool({
		connectionLimit : 10, // important
		host : 'mysql32571-env-8331644.mycloud.by',
//		host : 'localhost',
		user : 'root',
//		password : '1111',
		password : 'TBPdcm88707',
		database : 'sattva',
		debug : false
	});
	
	this.getData = function(query, callback) {
		pool.getConnection(function(err, connection) {
			if (err) {
				if(connection) {
					connection.release();
				}
				callback(null, getConnectionErrorResponse(err));
				return;
			}

			console.log("[MySQLConnection] connected as id " + connection.threadId);
			console.log("[MySQLConnection] query: " + query);
			connection.query(query, function(err,	rows) {
				connection.release();
				if (!err) {
					callback(rows, null);
				} else {
					callback(null, getConnectionErrorResponse(err));
				}
			});
		});
	};
	
	this.execute = function(query, callback) {
		pool.getConnection(function(err, connection) {
			if (err) {
				if(connection) {
					connection.release();
				}
				callback(null, getConnectionErrorResponse(err));
				return;
			}

			console.log("[MySQLConnection] connected as id " + connection.threadId);
			console.log("[MySQLConnection] query: " + query);
			connection.query(query, function(err, resp) {
				connection.release();
				if (err) {
					callback(getConnectionErrorResponse(err));
				} else {
					callback(null);
				}
			});
		});
	};
	
	var getConnectionErrorResponse = function(err) {
		console.log("[MySQLConnection] Connection error: " + err);
		return {
			"code" : 100,
			"status" : "Error in connection database"
		}
	};
}