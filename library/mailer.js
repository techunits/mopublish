var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

if('ssl' == siteConfigObj.smtp.mode.toLower()) {
	var securedFlag = true;
	var ignoreTLSFlag = true;
}
else if('tls' == siteConfigObj.smtp.mode.toLower()) {
	var securedFlag = true;
	var ignoreTLSFlag = false;
}
else {
	var securedFlag = false;
	var ignoreTLSFlag = true;
}

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport(smtpTransport({
    host: siteConfigObj.smtp.host,
    port: siteConfigObj.smtp.port,
    secure: securedFlag,
    ignoreTLS: ignoreTLSFlag,
    auth: {
        user: siteConfigObj.smtp.auth.username,
        pass: siteConfigObj.smtp.auth.password
    }
}));
exports.transporter = transporter;