exports.renderAdminTemplate = function(app, httpResponseObj, template) {
	app.set('views', __dirname + '/mp-manager/views');
	app.set('layout', __dirname + '/mp-manager/views/layout.ejs');
	
	console.log(__dirname + '/mp-manager/views');
	
	httpResponseObj.render(template);
};

exports.isSystemInstalled = function(success, failed) {
	require('../library/db').connect(function(dbObj) {
		dbObj.collection('settings').findOne({
			key		:	'installed',
			value	:	true
		}, function(err, itemInfo) {
			if(null != itemInfo) {
				success();
			}
			else {
				failed(err);
			}
		});
	});
};

/**
 * generate random string w.r.t supplied length
 */
var randomGenerator = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=:;<>?~";
    for( var i = 1; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};
exports.randomGenerator = randomGenerator;


var getPermalink = function(object) {
	console.log(object);
	if(object.type) {
		return '/' + object.type + '/' + object.slug;
	}
	
	else {
		return '#';
	}
};
exports.getPermalink = getPermalink;

exports.testFunc = function(callback) {
	if(callback)
		callback('uk');
	else {
		console.log('ok');
		return 'ok';
	}
};