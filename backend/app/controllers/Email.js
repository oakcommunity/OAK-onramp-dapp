const nodemailer = require("nodemailer");

var fun = {
    mail: async function (data,callback) {
        callback(false,true);
        return;
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: process.env.EMAIL_FROM+' '+process.env.EMAIL_FROM_ADDRESS, // sender address
            to: data.toEmail, // list of receivers
            subject: data.subject, // Subject line
            text: "", // plain text body
            html: data.body, // html body
        });
        if(info.messageId)
        {
            callback(false,true);
        }
        else{
            callback(true,false);
            // callback(false,true);
        }        
    }
}

module.exports = fun