module.exports = {
    registerOtp: function (data) {
        var html = `<html><body> 
                        <p>Hi</p>
                        <p>Welcome to ${process.env.SITE_TITLE}</p>
                        <p>Your registration OTP is ${data.otp}</p>
                        <p>Thank you</p>
                        <p>Team ${process.env.SITE_TITLE}</p>
                    </body></html>`;
        return html;
    },
    forgotPasswordOtp: function (data) {
        var html = `<html><body> 
                        <p>Hi ${data.name}</p>
                        <p>You have requested to reset password.</p>
                        <p>Your forgot password authentication code is ${data.otp}</p>
                        <p><br><small>Contact us if you did not made this request.</small></p>
                        <p>Thank you</p>
                        <p>Team ${process.env.SITE_TITLE}</p>
                    </body></html>`;
        return html;
    }
}