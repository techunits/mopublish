module.exports = function(app) {
	app.get('/sitemap.xml', function(req, res) {
		var sm = require('sitemap');
		sitemap = sm.createSitemap ({
			hostname: 'http://www.mopublish.com',
			cacheTime: 600000,
			urls: [
			       { url: '/',  changefreq: 'daily', priority: 0.3 },
			       { url: '/about-us',  changefreq: 'monthly',  priority: 0.7 }
			]
		});
    	
  		sitemap.toXML( function (xml) {
      		res.header('Content-Type', 'application/xml');
      		res.send( xml );
  		});
	});
};