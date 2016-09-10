var express = require('express');
var compress = require('compression');
var bodyParser = require('body-parser');
var cacheControl = require('express-cache-ctrl');
var FoodDao = require('./js/foodDao');
var EmailManager = require('./js/emailManager');
var SiteMapGenerator = require('./js/sitemapCrawler');

var app = express();
app.use(compress());
app.use(cacheControl.public(604800));//7 days
app.use(express.static('static'));
app.use(bodyParser.urlencoded({
	extended : false
}));


app.get("/api/food-list", cacheControl.public(1800)/*30 minutes*/, function(req, res) {
	console.log(req.url);
	FoodDao.getActiveFoodItems("true" == req.query.featured, function(
			responseObject) {
		res.json(responseObject);
	});
});

app.post("/api/send-email", cacheControl.secure(), function(req, res) {
	console.log(req.url);
	EmailManager.sendEmail({
		name : req.body.name,
		email : req.body.email,
		phone : req.body.phone,
		text : req.body.message
	});
	res.send("success");
});

//for bots
app.get("/m/",function(req, res) {
	res.redirect("/");
});
app.get("/mobile/",function(req, res) {
	res.redirect("/");
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
	SiteMapGenerator.createSiteMap({baseURL : "http://sattva.ck.ua", fileBasePath: "./static/", priority: 0.8});
});
