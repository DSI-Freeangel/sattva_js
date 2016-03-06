var mysql = require('mysql');
module.exports = {
	getActiveFoodItems : function(featured, callback) {
		return FoodDaoImpl.getActiveFoodItems(featured, callback);
	}
};

var FoodDaoImpl = new FoodDaoClass();

function FoodDaoClass() {
	var pool = mysql.createPool({
		connectionLimit : 10, // important
		host : 'mysql32571-env-8331644.mycloud.by',
//		host : 'localhost',
		user : 'root',
		password : 'TBPdcm88707',
		database : 'sattva',
		debug : false
	});

	var model = {
		FOOD : {
			"ID" : "id",
			"TYPE" : {
				name : "type",
				value : [ "Перші страви", "Другі страви", "Напої", "Десерти" ]
			},
			"NAME" : "name",
			"DESCRIPTION" : "description",
			"PRICE" : "price",
			"IMAGE_URL" : "imageUrl",
			"ACTIVE" : {
				name : "active",
				value : [ false, true ]
			},
			"FEATURED" : {
				name : "featured",
				value : [ false, true ]
			}
		},
		map : function(origin, mapping) {
			var dest = {};
			for ( var field in mapping) {
				var fieldMapping = mapping[field];
				if (fieldMapping.value) {
					dest[fieldMapping.name] = fieldMapping.value[origin[field]];
				} else {
					dest[fieldMapping] = origin[field];
				}
			}
			return dest;
		},
		mapList : function(array, mapping) {
			var result = [];
			for ( var index in array) {
				result[index] = this.map(array[index], mapping);
			}
			return result;
		}
	};

	this.getActiveFoodItems = function(featured, callback) {
		return getData("SELECT * FROM FOOD WHERE ACTIVE=1"
				+ (featured ? " AND FEATURED=1" : ""), callback);
	}

	var getData = function(sql, callback) {
		pool.getConnection(function(err, connection) {
			if (err) {
				connection.release();
				callback({
					"code" : 100,
					"status" : "Error in connection database"
				});
				return;
			}

			console.log('connected as id ' + connection.threadId);
			console.log(sql);
			connection.query(sql, function(err,
					rows) {
				connection.release();
				if (!err) {
					callback(model.mapList(rows, model.FOOD));
				}
			});

			connection.on('error', function(err) {
				callback({
					"code" : 100,
					"status" : "Error in connection database"
				});
				return;
			});
		});
	};
};
