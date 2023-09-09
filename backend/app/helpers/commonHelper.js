const moment = require('moment');
const bcrypt = require('bcrypt');

module.exports = {
    generateUid: function (uid) {
        const uuid = require('uuid');
        uid = uuid.v4();
        return uid;
    },
    currentDatetime() {
        var d = moment().format("YYYY-MM-DD HH:mm:ss");
        return d;
    },
    currentDate() {
        var d = moment().format("YYYY-MM-DD");
        return d;
    },
    datetimeFormat(datetime) {
        return moment(datetime).format("MM-DD-YYYY h:mm a");
    },
    standardDatetime(datetime) {
        return moment(datetime).format("YYYY-MM-DD HH:mm:ss");
    },
    dateFormat(datetime, format = "MM-DD-YYYY") {
        return moment(datetime).format(format);
    },
    encryptPassword(password) {
        const salt = bcrypt.genSaltSync(10);
        const pass = bcrypt.hashSync(password, salt);
        return pass;
    },
    comparePassword(password, hash) {
        if (bcrypt.compareSync(password, hash)) {
            return true;
        } else {
            return false;
        }
    },
    createJwtToken(uid) {
        var jwt = require('jsonwebtoken');
        var token = jwt.sign({ uid: uid }, process.env.JWT_TOKEN);
        return token;
    },
    verifyJWT(token) {
        var jwt = require('jsonwebtoken');
        if (jwt.verify(token, process.env.JWT_TOKEN)) {
            return true;
        }
        else {
            return false;
        }
    },
    generateOTP(length) {
        const otpGenerator = require('otp-generator');
        return 123456;
        // return otpGenerator.generate(length, { upperCaseAlphabets: false,lowerCaseAlphabets: false, specialChars: false });
    },
    apiResponse(array) {
        var json = Object.assign({}, array);
        return json;
    },
    date_diff(d1, d2, get_item) {
        var date1 = new Date(d1)
        var date2 = new Date(d2)
        var Difference_In_Time = date1.getTime() - date2.getTime();
        switch (get_item) {
            case 'month':
                return Math.round(Difference_In_Time / (1000 * 3600 * 24 * 30));
            case 'day':
                return Math.round(Difference_In_Time / (1000 * 3600 * 24));
            case 'hour':
                return Math.round(Difference_In_Time / (1000 * 3600));
            case 'minute':
                return Math.round(Difference_In_Time / (1000 * 60));
            case 'second':
                return Math.round(Difference_In_Time / 1000);
            default:
                break;
        }
    },
    addLog(data) {
        const fs = require('fs');
        var d = moment().format("YYYY-MM-DD");
        var dt = moment().format("YYYY-MM-DD H:i:s");
        data = dt + ': ' + data;
        var filename = './logs/' + d + '_log.txt';
        fs.appendFile(filename, "\n\n" + data, function (err) {
            if (err) throw console.log(err);
        });
    },
    encrypto(text) {
        var key = process.env.ENCRYPTION_KEY;
        const crypto = require("crypto");
        const ENCRYPTION_KEY = key.substr(0, 32);
        const IV_LENGTH = 16;
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(
            "aes-256-cbc",
            Buffer.from(ENCRYPTION_KEY),
            Buffer.from(iv)
        );
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return iv.toString("hex") + ":" + encrypted.toString("hex");
    },
    decrypto(text) {
        var key = process.env.ENCRYPTION_KEY;
        const crypto = require("crypto");
        const ENCRYPTION_KEY = key.substr(0, 32);
        const IV_LENGTH = 16;
        const textParts = text.split(":");
        const iv = Buffer.from(textParts.shift(), "hex");
        const encryptedText = Buffer.from(textParts.join(":"), "hex");
        const decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            Buffer.from(ENCRYPTION_KEY),
            iv
        );
        const decrypted = Buffer.concat([
            decipher.update(encryptedText),
            decipher.final(),
        ]);

        return decrypted.toString();
    },
    validateEmail(email) {
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegexp.test(email);
    },
    removeTZFromDate(datetime) {
        return datetime.toISOString().replace('T', ' ')
            .replace('Z', '');
    },
    generateString(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    addLeadingZeros(num, size) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    },
    addCronLog(data) {
        const fs = require('fs');
        var d = moment().format("YYYY-MM-DD");
        var dt = moment().format("YYYY-MM-DD H:i:s");
        data = dt + ': ' + data;
        var filename = './logs/cron/' + d + '_log.txt';
        fs.appendFile(filename, "\n\n" + data, function (err) {
            if (err) throw console.log(err);
        });
    },
    calculateFeeAmount(num) {
        var per = process.env.FEE_PERCENTAGE;
        return ((num / 100) * per).toFixed(2);
    },
    sanitizeInput(array) {
        return array;
    },
    hideEmailPartial(email) {
        return email.replace(/(.{2})(.*)(?=@)/,
            function (gp1, gp2, gp3) {
                for (let i = 0; i < gp3.length; i++) {
                    gp2 += "*";
                } return gp2;
            });
    },
    hidePhonePartial(phone) {
        return replaced = phone.slice(0, 2) + phone.slice(2).replace(/.(?=...)/g, '*');
    },
    isEmpty(object) {
        return Object.keys(object).length === 0
    },
    getCurrentWeek() {
        return moment().format('W');
    },
    addSilaLogs(data) {
        const fs = require('fs');
        var d = moment().format("YYYY-MM-DD");
        var dt = moment().format("YYYY-MM-DD H:i:s");
        data = dt + ': ' + data;
        var filename = './logs/sila/' + d + '_log.txt';
        fs.appendFile(filename, "\n\n" + data, function (err) {
            if (err) throw console.log(err);
        });
    },
    addPlaidLogs(data) {
        const fs = require('fs');
        var d = moment().format("YYYY-MM-DD");
        var dt = moment().format("YYYY-MM-DD H:i:s");
        data = dt + ': ' + data;
        var filename = './logs/plaid/' + d + '_log.txt';
        fs.appendFile(filename, "\n\n" + data, function (err) {
            if (err) throw console.log(err);
        });
    },
    addDwollaLogs(data) {
        const fs = require('fs');
        var d = moment().format("YYYY-MM-DD");
        var dt = moment().format("YYYY-MM-DD H:i:s");
        data = dt + ': ' + data;
        var filename = './logs/dwolla/' + d + '_log.txt';
        fs.appendFile(filename, "\n\n" + data, function (err) {
            if (err) throw console.log(err);
        });
    },
    addApiLogs(apiname, data) {
        const fs = require('fs');
        var d = moment().format("YYYY-MM-DD");
        var dt = moment().format("YYYY-MM-DD H:i:s");
        data = dt + ': ' + data;
        var filename = './logs/' + apiname + '/' + d + '_log.txt';
        fs.appendFile(filename, "\n\n" + data, function (err) {
            if (err) throw console.log(err);
        });
    },
    secureString(str) {
        var trailingCharsIntactCount = 4;
        str = new Array(str.length - trailingCharsIntactCount + 1).join('x') + str.slice(-trailingCharsIntactCount);
        return str;
    },
    simpleEncryptString(plainText) {
        return Buffer.from(plainText).toString('base64');

        /* const crypto = require("crypto");
        var secretKey = process.env.ENCRYPTION_KEY;
        const cipher = crypto.createCipher('aes-256-cbc', secretKey);
        let encrypted = cipher.update(plainText, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted; */
    },

    formatSSNNumber(ssn) {
        return ssn.slice(0, 3) + "-" + ssn.slice(3, 5) + "-" + ssn.slice(5, 9);
    },

    async getUserUidByJWT(bearerHeader) {
        bearerHeader = bearerHeader.replace('Bearer ', '');
        var jwt = require('jsonwebtoken');
        return new Promise((resolve) => {
            jwt.verify(bearerHeader, process.env.JWT_TOKEN, (err, decode) => {
                resolve(decode.uid);
            })
        })
    }
}