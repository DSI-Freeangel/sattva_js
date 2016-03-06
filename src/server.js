var express = require('express');
var FoodDao = require('./js/foodDao');
var app = express();
app.use(express.static('static'));

app.get("/api/food-list",function(req,res){
	console.log(req.url);
	FoodDao.getActiveFoodItems("true" == req.query.featured, function(responseObject) {
		res.json(responseObject);
	});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
