var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

if('ssl' == appConfigObj.smtp.mode) {
	var securedFlag = true;
	var ignoreTLSFlag = true;
}
else if('tls' == appConfigObj.smtp.mode) {
	var securedFlag = true;
	var ignoreTLSFlag = false;
}
else {
	var securedFlag = false;
	var ignoreTLSFlag = true;
}

//	create reusable transporter object using SMTP transport
if('' != appConfigObj.smtp.auth.username && '' != appConfigObj.smtp.auth.password) {
	var transporter = nodemailer.createTransport(smtpTransport({
	    host: appConfigObj.smtp.host,
	    port: appConfigObj.smtp.port,
	    secure: securedFlag,
	    ignoreTLS: ignoreTLSFlag,
	    auth: {
	        user: appConfigObj.smtp.auth.username,
	        pass: appConfigObj.smtp.auth.password
	    }
	}), {debug: true});
}
else {
	var transporter = nodemailer.createTransport(smtpTransport({
	    host: appConfigObj.smtp.host,
	    port: appConfigObj.smtp.port,
	    secure: securedFlag,
	    ignoreTLS: ignoreTLSFlag
	}));
}
exports.transporter = transporter;