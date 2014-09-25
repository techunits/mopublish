global.ROOT_PATH = __dirname;

var cluster = require('cluster');
if (cluster.isMaster) {
	// Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    cpuCount = 1;
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
}
else {
	var appConfigObj = require('./library/config').loadConfig();
	var logger = require('morgan');
	
	//	required express configurations
	var express = require('express'),
		bodyParser = require('body-parser'),
		expressLayouts = require('express-ejs-layouts'),
		session = require('express-session');
	var MongoStore = require('connect-mongo')(session);
	
	var app = express();
	
	app.set('port', (process.env.PORT || appConfigObj.port));
	app.set('view engine', 'ejs');
	
	//	app.use(logger());
	app.use(bodyParser.urlencoded());
	app.use(bodyParser.json());
	app.use(expressLayouts);
	
	/**
	 * Initialize Session
	 */
	app.use(session({
		secret: appConfigObj.session.secret,
		saveUninitialized: true,
		resave: true,
		store: new MongoStore({
			host: appConfigObj.database.host,
			port: appConfigObj.database.port,
			db: appConfigObj.database.db,
			collection: 'sessions'
		})
	}));

	/**
	 * dynamically load all required routes
	 */
	require('./library/routes')(app, express);
	
	/**
	 * start node Express Server
	 */
	app.listen(app.get('port'), function() {
		console.log("Mopublish is running at localhost:" + app.get('port'));
	});
}


//	Listen for dying workers and replace with new.
cluster.on('exit', function (worker) {
    console.log('Worker ' + worker.id + ' died :(');
    cluster.fork();
});