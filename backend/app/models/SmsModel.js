const res = require('express/lib/response');
const twilio = require('twilio');

module.exports = {
    sendSMS: async (data, callback) => {
        var res = [];
        res.status = 1;
        res.sid = '';
        callback('', res);
        return;
        const accountSid = process.env.TWILIO_SID; // Your Account SID from www.twilio.com/console
        const authToken = process.env.TWILIO_TOKEN; // Your Auth Token from www.twilio.com/console
        const client = new twilio(accountSid, authToken);

        await client.messages
            .create({
                body: data.body,
                to: data.phone, // Text this number
                from: process.env.TWILIO_FROM_NO, // From a valid Twilio number
                /* messagingServiceSid: process.env.TWILIO_MESSAGIN_ID */
            })
            .then((message) => {
                var res = [];
                res.status = 1;
                res.sid = message.sid;
                callback('', res);
            }).catch(error => {
                //Helper.addLog(`User register, data: ${JSON.stringify(body)}, error: ${error}`);
                var res = [];
                res.status = 0;
                res.sid = '';
                callback('', res);
            });
    }
}