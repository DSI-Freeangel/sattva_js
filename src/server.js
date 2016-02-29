var express = require('express');
var mysql = require('mysql');
var app = express();
app.use(express.static('static'));

var pool      =    mysql.createPool({
    connectionLimit : 10, //important
    host     : 'mysql32571-env-8331644.mycloud.by',
    user     : 'root',
    password : 'TBPdcm88707',
    database : 'sattva',
    debug    :  false
});

var model = {
	FOOD : {
		"ID": "id",
		"TYPE": {name : "type", value : ["FIRST", "SECOND", "DRINK", "DESSERT"]},
		"NAME": "name",
		"DESCRIPTION": "description",
		"PRICE": "price",
		"IMAGE_URL": "imageUrl",
		"ACTIVE": {name : "active", value : [false, true]}},
	map : function(origin, mapping) {
		var dest = {};
		for(var field in mapping) {
			var fieldMapping = mapping[field];
			if(fieldMapping.value) {
				dest[fieldMapping.name] = fieldMapping.value[origin[field]];
			} else {
				dest[fieldMapping] = origin[field];
			}
		}
		return dest;
	},
	mapList : function(array, mapping){
		var result = [];
		for(var index in array) {
			result[index] = this.map(array[index], mapping);
		}
		return result;
	}
};

function handle_database(req,res) {
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query("SELECT * FROM FOOD WHERE ACTIVE=1",function(err,rows){
            connection.release();
            if(!err) {
                res.json(model.mapList(rows, model.FOOD));
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}

app.get("/api/food-list",function(req,res){-
        handle_database(req,res);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
