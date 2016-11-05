var connection = require('./mysqlConnection');
module.exports = {
	getActiveFoodItems : function(featured, callback) {
		return FoodDaoImpl.getActiveFoodItems(featured, callback);
	}
};

var FoodDaoImpl = new FoodDaoClass();

function FoodDaoClass() {
	var model = {
		FOOD : {
			"ID" : "id",
			"TYPE" : {
				name : "type",
				value : [ "Перші страви", "Другі страви", "Напої", "Десерти", "Салати"]
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
		return connection.getList("SELECT * FROM FOOD WHERE ACTIVE=1"
				+ (featured ? " AND FEATURED=1" : "") + " ORDER BY TYPE ASC, PRICE DESC", 
				function(rows, error){
					if(error) {
						callback(error);
					} else {
						callback(model.mapList(rows, model.FOOD));
					}
				});
	};

};
