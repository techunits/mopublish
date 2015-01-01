var logger = require('elogger');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var getTransporter = function() {
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
		
		return transporter;
	}
	else {
		var transporter = nodemailer.createTransport(smtpTransport({
		    host: appConfigObj.smtp.host,
		    port: appConfigObj.smtp.port,
		    secure: securedFlag,
		    ignoreTLS: ignoreTLSFlag
		}));
		
		return transporter;
	}
};

var sendEmail = function(params, callback) {
	var mailOptions = {
	    from: appConfigObj.smtp.from,
	    to: params.toEmail,
	    subject: params.subject,
	    text: params.textContent,
	    html: params.htmlContent,//	'<p>You have successfully installed Mopublish. New mail template is coming soon.</p>'
	};
	
	//	add CC address to the emails if any.
	if(appConfigObj.smtp.cc.length > 0) {
		mailOptions.cc = appConfigObj.smtp.cc;
	}
	
	//	add BCC address to the emails if any.
	if(appConfigObj.smtp.cc.length > 0) {
		mailOptions.bcc = appConfigObj.smtp.bcc;
	}
	
	//	debug line
	logger.debug('Sedning out email...');
	logger.debug(mailOptions);
	
	//	send the email
	getTransporter().sendMail(mailOptions, function(err, info) {
		if(err)
			logger.error('Failed to send welcome message. Please check SMTP settings on config file.');
		else
			logger.debug('Welcome message sent: ' + info.response);
		
		callback();
	});
};
exports.sendEmail = sendEmail;


var renderTemplate = function(template, params, callback) {
	var html = '';
	callback(html);
};
exports.renderTemplate = renderTemplate;
