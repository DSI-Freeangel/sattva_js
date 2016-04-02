var crawl = require('crawl');
var siteMapGenerator = require('sitemap');
var fileSystem = require('fs');
var zlib = require('zlib');
module.exports = {
	createSiteMap : function(params) {
		return SiteMapCrawlerImpl.createSiteMap(params);
	}
};

var SiteMapCrawlerImpl = new SiteMapCrawlerClass();
function SiteMapCrawlerClass() {
	
	this.createSiteMap = function(params){
		crawlSite(params.baseURL, function(pages){
			var siteMap = generate(pages, params);
			write(params.fileBasePath, siteMap.toString());
		});
	};
	
	var crawlSite = function(baseURL, callback) {
		console.log("running site crawler...");
		crawl.crawl(baseURL, function(err, pages) {
		    if (err) {
		        console.error("An error occured", err);
		        return;
		    }
		    callback(pages);
		    console.log("sitemap generated!");
		});
	};

	var generate = function(pages, params) {
		console.log("sitemap generation ...");
		var sitemap = siteMapGenerator.createSitemap({
			hostname : params.baseURL,
			cacheTime : 600000
		});
		for(var i in pages) {
			var page = pages[i];
			var url = page.url.replace(params.baseURL, "");
			if(page.url.indexOf(".html") > 0 || "/" == url) {
				var lastMod = page.date.slice(0, 10);
				var priority = "/" == url ? 1 : params.priority;
				console.log(url);
				sitemap.add({url: url, changefreq: 'weekly', priority: priority, lastmod: lastMod, lastmodrealtime: true});
			}
		}
		return sitemap;
	};
	
	var write = function(baseFilePath, content) {
		var filename = baseFilePath + "sitemap.xml";
		console.log("writing " + filename);
		fileSystem.writeFileSync(filename, content);
		var gzfilename = filename + ".gz";
		console.log("writing " + gzfilename);
		const gzip = zlib.createGzip();
		var inp = fileSystem.createReadStream(filename);
		var out = fileSystem.createWriteStream(gzfilename);
		inp.pipe(gzip).pipe(out);
		out.close();
		inp.close();
	}
}
