var getPageTitle = function(pagename) {
	var titlePattern = '{{PAGENAME}} - {{SITENAME}} - {{TAGLINE}}';
	if(appConfigObj.pagetitlePattern) {
		titlePattern = appConfigObj.pagetitlePattern;
	}
	
	var toReplace = ['{{PAGENAME}}', '{{SITENAME}}', '{{TAGLINE}}'];
	toReplace.forEach(function(exp) {
		switch(exp) {
			case '{{PAGENAME}}':
				console.log(pagename);
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
	Object.keys(ogList).forEach(function(key) {
		html += '<meta property="og:'+key+'" content="'+ogList[key]+'" />';
	});	
	return html;
};
exports.getOpengraphHTML = getOpengraphHTML;

/**
 * get SEO Meta HTML strings w.r.t. input
 */
var getSeoMetaHTML = function(seometaList) {
	var html = '';
	Object.keys(seometaList).forEach(function(key) {
		html += '<meta name="'+key+'" content="'+seometaList[key]+'">';
	});	
	return html;
};
exports.getSeoMetaHTML = getSeoMetaHTML;


/**
 * execute actions for Footer
 * Default Action Hook: "mpHeader"
 */
exports.getHeader = function() {
	var htmlStr = '';
	
	/**
	 * Perform Action "seometa"
	 */
	require(ROOT_PATH + '/library/util').doAction('seometa', function(htmlStr) {
		htmlStr += getOpengraphHTML(siteConfigObj.seometa);
	});
	
	/**
	 * Perform Action "opengraph"
	 */
	require(ROOT_PATH + '/library/util').doAction('opengraph', function(htmlStr) {
		htmlStr += getOpengraphHTML(siteConfigObj.opengraph);
	});
	
	return htmlStr;
};


/**
 * execute actions for Footer
 * Default Action Hook: "mpFooter"
 */
exports.getFooter = function() {
	var htmlStr = '';
	
	/**
	 * Perform Action "seometa"
	 */
	require(ROOT_PATH + '/library/util').doAction('mpFooter', function(htmlStr) {
		httpResponse.locals.seometa = htmlStr;
		//	httpResponse.locals.seometa = require(ROOT_PATH + '/library/template').getSeoMetaHTML(siteConfigObj.seometa);
	});
};