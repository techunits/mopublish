var getPageTitle = function(pagename) {
	var titlePattern = '{{PAGENAME}} - {{SITENAME}} - {{TAGLINE}}';
	if(appConfigObj.pagetitlePattern) {
		titlePattern = appConfigObj.pagetitlePattern;
	}
	
	var toReplace = ['{{PAGENAME}}', '{{SITENAME}}', '{{TAGLINE}}'];
	toReplace.forEach(function(exp) {
		switch(exp) {
			case '{{PAGENAME}}':
				if(pagename)
					titlePattern = titlePattern.replace(exp, pagename);
				else
					titlePattern = titlePattern.replace(exp, '');
			break;
			
			case '{{SITENAME}}':
				titlePattern = titlePattern.replace(exp, siteConfigObj.sitename);
			break;
			
			case '{{TAGLINE}}':
				titlePattern = titlePattern.replace(exp, siteConfigObj.tagline);
			break;
		}
	});
	
	return titlePattern;
};
exports.getPageTitle = getPageTitle;

/**
 * get opengraph HTML strings w.r.t. input
 */
var getOpengraphHTML = function(ogList) {
	var html = '';
	if(ogList) {
		Object.keys(ogList).forEach(function(key) {
			html += '<meta property="og:'+key+'" content="'+ogList[key]+'" />';
		});
	}
	return html;
};
exports.getOpengraphHTML = getOpengraphHTML;

/**
 * get SEO Meta HTML strings w.r.t. input
 */
var getSeoMetaHTML = function(seometaList) {
	var html = '';
	if(seometaList) {
		Object.keys(seometaList).forEach(function(key) {
			html += '<meta name="'+key+'" content="'+seometaList[key]+'">';
		});	
	}
	return html;
};
exports.getSeoMetaHTML = getSeoMetaHTML;


/**
 * execute actions for Footer
 * Default Action Hook: "mpHeader"
 */
exports.getHeader = function() {
	var htmlStr = '';
	return htmlStr;
};


/**
 * execute actions for Footer
 * Default Action Hook: "mpFooter"
 */
exports.getFooter = function() {
	var htmlStr = '';
	return htmlStr;
};