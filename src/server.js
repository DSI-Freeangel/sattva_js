var express = require('express');
var bodyParser = require('body-parser');
var FoodDao = require('./js/foodDao');
var EmailManager = require('./js/emailManager');
var app = express();
app.use(express.static('static'));
app.use(bodyParser.urlencoded({
	extended : false
}));

app.get("/api/food-list", function(req, res) {
	console.log(req.url);
	FoodDao.getActiveFoodItems("true" == req.query.featured, function(
			responseObject) {
		res.json(responseObject);
	});
});

app.post("/api/send-email", function(req, res) {
	console.log(req.url);
	EmailManager.sendEmail({
		name : req.body.name,
		email : req.body.email,
		phone : req.body.phone,
		text : req.body.message
	});
	res.send("success");
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});
