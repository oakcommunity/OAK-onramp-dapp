const SQUser = require('../../models/SQUser');
const SQAddress = require('../../models/SQAddress');
const Helper = require('../../helpers/commonHelper');
const axios = require('axios');

const appEnvt = process.env.APP_ENVT;
var apiKey = process.env.SANDBOX_BRIDGE_ENDPOINT_API_KEY;
var apiUrl = process.env.SANDBOX_BRIDGE_ENDPOINT;
if (appEnvt == 'production') {
    var apiKey = process.env.LIVE_BRIDGE_ENDPOINT_API_KEY;
    var apiUrl = process.env.LIVE_BRIDGE_ENDPOINT;
}

module.exports = {
    createTermsLink: async (req, res) => {
        var data = req.body;

        var idmpkey = Helper.generateString(10);
        await axios.request({
            method: 'POST',
            maxBodyLength: Infinity,
            url: apiUrl + '/customers/tos_links',
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': apiKey,
                'Idempotency-Key': idmpkey
            }
        }).then(async (apiRes) => {
            res.send({
                status: 1,
                data: apiRes.data
            });
        }).catch(e => {
            console.log('apiRes: ', e.response.data);
            res.send({
                status: 0,
                data: e
            });
        });
    },

    createUser: async (req, callback) => {
        var userUid = req.user_uid;
        var signedAgreementId = req.signed_agreement_id;
        var ud = await SQUser.findOne({ where: { user_uid: userUid, user_status: 1 } });
        ud = ud ? ud.dataValues : '';
        var userId = ud ? ud.user_id : '';

        var address = await SQAddress.findOne({ where: { user_id: userId, status: 1 } });
        address = address ? address.dataValues : '';
        console.log('ud: ', ud);
        console.log('address: ', address);

        if (ud && address && ud.fname && ud.lname && ud.email && ud.phone && address.street_1 && address.city && address.state && address.zip && ud.dob && ud.ssn_number && signedAgreementId) {

            var userData = {
                "type": "individual",
                "first_name": ud.fname,
                "last_name": ud.lname,
                "email": ud.email,
                "phone": "+1" + ud.phone,
                "address": {
                    "street_line_1": address.street_1,
                    "street_line_2": address.street_2,
                    "city": address.city,
                    "state": address.state,
                    "postal_code": address.zip,
                    "country": "USA"
                },
                "signed_agreement_id": signedAgreementId,
                "dob": ud.dob,
                "ssn": Helper.formatSSNNumber(Helper.decrypto(ud.ssn_number))
            };
            console.log('userData: ', userData);

            var idmpkey = Helper.generateString(10);
            await axios.request({
                method: 'POST',
                maxBodyLength: Infinity,
                url: apiUrl + '/customers',
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': apiKey,
                    'Idempotency-Key': idmpkey
                },
                data: JSON.stringify(userData)
            }).then(async (apiRes) => {
                console.log('apiResuserData: ', apiRes);
                if (apiRes.data.id) {
                    SQUser.update(
                        {
                            bridge_user_id: apiRes.data.id,
                            bridge_status: apiRes.data.future_requirements_due[0]
                        },
                        { where: { user_id: userId } },
                    );
                }
                callback({
                    status: 1,
                    data: apiRes.data
                });
            }).catch(e => {
                console.log('apiRes: ', e.response.data.source.key);
                var errMsg = Object.values(e.response.data.source.key);
                callback({
                    status: 0,
                    data: errMsg
                });
            });
        }
        else {
            callback({
                status: 0,
                message: 'User profile details or address information is missing.'
            });
        }
    },

    createExternalBankAccount: async (req, callback) => {
        var userUid = req.user_uid;

        var ud = await SQUser.findOne({ where: { user_uid: userUid, user_status: 1 } });
        ud = ud ? ud.dataValues : '';
        var userId = ud ? ud.user_id : '';
        var name = ud ? ud.fname + ' ' + ud.lname : '';

        var address = await SQAddress.findOne({ where: { user_id: userId, status: 1 } });
        address = address ? address.dataValues : '';

        if (ud && address && ud.bridge_user_id) {

            var userData = {
                "type": "wire",
                "bank_name": "Chase",
                "account_name": "Checking",
                "account_number": "123456789",
                "routing_number": "123456789",
                "account_owner_name": name,
                "address": {
                    "street_line_1": address.street_1,
                    "street_line_2": address.street_2,
                    "city": address.city,
                    "state": address.state,
                    "postal_code": address.zip,
                    "country": "USA"
                }
            };

            var idmpkey = Helper.generateString(10);
            await axios.request({
                method: 'POST',
                maxBodyLength: Infinity,
                url: apiUrl + `/customers/${ud.bridge_user_id}/external_accounts`,
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': apiKey,
                    'Idempotency-Key': idmpkey
                },
                data: JSON.stringify(userData)
            }).then(async (apiRes) => {
                console.log('apiResuserData: ', apiRes);
                callback({
                    status: 1,
                    data: apiRes.data
                });
            }).catch(e => {
                if (e.response) {
                    if (e.response.data.hasOwnProperty('source')) {
                        var errMsg = Object.values(e.response.data.source.key);
                        callback({
                            status: 0,
                            data: errMsg
                        });
                    }
                    else if (e.hasOwnProperty('message')) {
                        callback({
                            status: 0,
                            data: e.response.data.message
                        });
                    }
                    else {
                        callback({
                            status: 0,
                            data: 'Try again'
                        });
                    }
                }
            });
        }
        else {
            callback({
                status: 0,
                message: 'User profile details or address information is missing.'
            });
        }
    },

    buyCrypto: async (req, callback) => {
        var userUid = req.user_uid;

        var ud = await SQUser.findOne({ where: { user_uid: userUid, user_status: 1 } });
        ud = ud ? ud.dataValues : '';
        var userId = ud ? ud.user_id : '';
        var name = ud ? ud.fname + ' ' + ud.lname : '';

        if (ud && ud.bridge_user_id) {

            var userData = {
                "amount": "10.0",
                "on_behalf_of": name,
                "developer_fee": "0.0",
                "source": {
                    "payment_rail": "wire",
                    "currency": "usd",
                    "external_account_id": "dbc0ccc5-eff7-46ca-8efb-ceae636d00fb",
                },
                "destination": {
                    "payment_rail": "ethereum",
                    "currency": "usdc",
                    "to_address": "0xdeadbeef",
                },
            };

            var idmpkey = Helper.generateString(10);
            await axios.request({
                method: 'POST',
                maxBodyLength: Infinity,
                url: apiUrl + `/transfers`,
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': apiKey,
                    'Idempotency-Key': idmpkey
                },
                data: JSON.stringify(userData)
            }).then(async (apiRes) => {
                console.log('apiResuserData: ', apiRes);
                callback({
                    status: 1,
                    data: apiRes.data
                });
            }).catch(e => {
                console.log('err: ', e.response)
                if (e.response) {
                    if (e.response.data.hasOwnProperty('source')) {
                        var errMsg = Object.values(e.response.data.source.key);
                        callback({
                            status: 0,
                            data: errMsg
                        });
                    }
                    else if (e.hasOwnProperty('message')) {
                        callback({
                            status: 0,
                            data: e.response.data.message
                        });
                    }
                    else {
                        callback({
                            status: 0,
                            data: 'Try again'
                        });
                    }
                }
            });
        }
        else {
            callback({
                status: 0,
                message: 'User profile details or address information is missing.'
            });
        }
    },
}

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};