var nodemailer = require('nodemailer');
module.exports = {
	sendEmail : function(params) {
		return EmailManagerImpl.sendEmail(params);
	}
};

var EmailManagerImpl = new EmailManagerClass();
function EmailManagerClass() {
	
	var transporter = nodemailer.createTransport('smtps://sattva.ck%40ukr.net:v1c2x3z4@smtp.ukr.net');
	
	this.sendEmail = function(params) {
		// send mail with defined transport object
		console.log(params);
		transporter.sendMail(buildEmailParams(params), function(error, info){
		    if(error){
		        console.log(error);
		        return;
		    }
		    console.log('Message sent: ' + info.response);
		});
	};
	
	var buildEmailParams = function(params) {
		return {
			from : 'sattva.ck@ukr.net',
			to : 'sattva.ck@gmail.com',
			subject : 'Контакт з сайту',
			text : params.text + '\n \n Ім’я: ' + params.name + '\n Електронна пошта: ' + params.email + '\n Телефон: ' + params.phone
		};
	};
		
}