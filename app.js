global.ROOT_PATH = __dirname;

var cluster = require('cluster');
if (cluster.isMaster) {
	if(process.argv.indexOf('--nocluster') == -1) {
		// Count the machine's CPUs
		var cpuCount = require('os').cpus().length;
		
		// Create a worker for each CPU
	    for (var i = 0; i < cpuCount; i += 1) {
	    	cluster.fork();
	    }
	}
	else {
		cluster.fork();
	}
}
else {
    require('pkginfo')(module);
	var appConfigObj = require('./library/config').loadConfig();
	
	//	required express configurations
	var express = require('express'),
		bodyParser = require('body-parser'),
		expressLayouts = require('express-ejs-layouts');
	
	var app = express();
	app.set('port', (process.env.PORT || appConfigObj.port));
	app.set('view engine', 'ejs');
	
	//	enable required middlewares
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(expressLayouts);
	
	//	enable morgan resource logging if debug is turned on
	if(true === appConfigObj.debug) {
		var elogger = require('elogger');
		app.use(elogger('common'));
	}
	
	/**
	 * dynamically load all required routes
	 */
	require('./library/routes')(app, express);
	
	/**
	 * start node Express Server
	 */
	app.listen(app.get('port'), function() {
		console.log("%s@%s is running at http://localhost:%s", module.exports.name, module.exports.version, app.get('port'));
	});
}

//	Listen for dying workers and replace with new.
cluster.on('exit', function (worker) {
    console.log('Worker ' + worker.id + ' died :(');
    if(process.argv.indexOf('--nocluster') == -1) {
    	cluster.fork();
    }
});
