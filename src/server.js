var express = require('express');
var compress = require('compression');
var bodyParser = require('body-parser');
var FoodDao = require('./js/foodDao');
var EmailManager = require('./js/emailManager');
var SiteMapGenerator = require('./js/sitemapCrawler');
var oauthserver = require('oauth2-server');
var oAuthService = require('./js/OAuthService')

var app = express();
app.use(compress());
app.use(express.static('static', { maxAge: 604800000,	
		setHeaders: function(res, path) {
		    res.setHeader("Expires", new Date(Date.now() + 604800000).toUTCString());
		}}
        ));
app.use(bodyParser.urlencoded({
	extended : false
}));

app.oauth = oauthserver({
	model : oAuthService,
	grants : [ 'password' ],
	debug : true
});

app.all('/oauth/token', app.oauth.grant());

app.get('/api/admin', app.oauth.authorise(), function(req, res) {
	res.send('Secret area');
});

app.use(app.oauth.errorHandler());

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
