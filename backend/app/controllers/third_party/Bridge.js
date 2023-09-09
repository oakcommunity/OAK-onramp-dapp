const SQUser = require('../../models/SQUser');
const SQAddress = require('../../models/SQAddress');
const SQUserWallet = require('../../models/SQUserWallet');
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
        name = '07ef28db-d544-4ea0-a092-bd2208932576';

        if (ud && ud.bridge_user_id) {

            var userData = {
                "amount": "1.0",
                "on_behalf_of": name,
                "developer_fee": "0.0",
                "source": {
                    "payment_rail": "wire",
                    "currency": "usd",
                    "external_account_id": "e42e59ad-c7ac-4a16-8931-1e5b90bf4599",
                },
                "destination": {
                    "payment_rail": "ethereum",
                    "currency": "usdc",
                    "to_address": "0x25520a62370d4fC47e9512743eC0a23A27b50cC8",
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

    createPlaidLinkToken: async (req, callback) => {
        var userUid = req.user_uid;

        var ud = await SQUser.findOne({ where: { user_uid: userUid, user_status: 1 } });
        ud = ud ? ud.dataValues : '';
        var userId = ud ? ud.user_id : '';
        var name = ud ? ud.fname + ' ' + ud.lname : '';

        if (ud && ud.bridge_user_id) {
            console.log('apiUrl: ', apiUrl);
            var idmpkey = Helper.generateString(10);
            await axios.request({
                method: 'POST',
                maxBodyLength: Infinity,
                url: apiUrl + `/customers/${ud.bridge_user_id}/plaid_link_requests`,
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': apiKey,
                    'Idempotency-Key': idmpkey
                }
            }).then(async (apiRes) => {
                console.log('apiResuserData: ', apiRes);
                callback({
                    status: 1,
                    link_token: apiRes.data.link_token
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

    exchangePlaidPublicToken: async (req, callback) => {
        var userUid = req.user_uid;
        var linkToken = req.link_token;
        var publicToken = req.public_token;

        var ud = await SQUser.findOne({ where: { user_uid: userUid, user_status: 1 } });
        ud = ud ? ud.dataValues : '';
        var userId = ud ? ud.user_id : '';
        var name = ud ? ud.fname + ' ' + ud.lname : '';

        if (ud && ud.bridge_user_id) {

            var dataString = {
                public_token: publicToken,
            };
            await axios.request({
                method: 'POST',
                maxBodyLength: Infinity,
                url: apiUrl + `/plaid_exchange_public_token/${linkToken}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': apiKey
                },
                data: JSON.stringify(dataString)
            }).then(async (apiRes) => {
                console.log('publictokenres: ', apiRes);
                callback({
                    status: 1
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

    getExternalAccounts: async (req, callback) => {
        var userUid = req.user_uid;
        var ud = await SQUser.findOne({ where: { user_uid: userUid, user_status: 1 } });
        ud = ud ? ud.dataValues : '';

        if (ud && ud.bridge_user_id) {
            console.log('userUid: ', ud.bridge_user_id);

            await axios.request({
                method: 'GET',
                maxBodyLength: Infinity,
                url: apiUrl + `/customers/${ud.bridge_user_id}/external_accounts`,
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': apiKey
                }
            }).then(async (apiRes) => {
                console.log('publictokenres: ', apiRes);
                callback({
                    status: 1,
                    data: apiRes.data
                });
            }).catch(e => {
                console.log('err: ', e.response.data)
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

    getTransferDetails: async (req, callback) => {
        var userUid = req.user_uid;
        var transferUid = req.transfer_uid;
        var ud = await SQUser.findOne({ where: { user_uid: userUid, user_status: 1 } });
        ud = ud ? ud.dataValues : '';

        if (ud && ud.bridge_user_id) {
            console.log('userUid: ', ud.bridge_user_id);

            await axios.request({
                method: 'GET',
                maxBodyLength: Infinity,
                url: apiUrl + `/transfers/${transferUid}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': apiKey
                }
            }).then(async (apiRes) => {
                console.log('publictokenres: ', apiRes);
                callback({
                    status: 1,
                    data: apiRes.data
                });
            }).catch(e => {
                console.log('err: ', e.response.data)
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

    transferCrytoTocrypto: async (req, callback) => {
        var amount = req.amount;
        var bridgeUserId = req.bridge_user_id;
        var sourceCryptoType = req.source_crypto_type;
        var sourceCryptoAddress = req.source_crypto_address;
        var destinationCryptoType = req.destination_crypto_type;
        var destinationCryptoAddress = req.destination_crypto_address;

        if(amount == '' || amount <= 0 || amount == null || amount === undefined){
            callback({
                status: 0,
                message: 'Amount should be greater than zero'
            });
        }
        else if(bridgeUserId == '' || bridgeUserId == null || bridgeUserId === undefined){
            callback({
                status: 0,
                message: 'User not found'
            });
        }
        else if(sourceCryptoType == '' || sourceCryptoType == null || sourceCryptoType === undefined || destinationCryptoType == '' || destinationCryptoType == null || destinationCryptoType === undefined){
            callback({
                status: 0,
                message: 'Source & Destination crypto address type are required'
            });
        }
        else if(sourceCryptoAddress == '' || sourceCryptoAddress == null || sourceCryptoAddress === undefined || destinationCryptoAddress == '' || destinationCryptoAddress == null || destinationCryptoAddress === undefined){
            callback({
                status: 0,
                message: 'Source & Destination crypto address are required'
            });
        }
        else{
            var transferJson = {
                "amount": "10.0",
                "developer_fee": "0.0",
                "on_behalf_of": "cust_alice",
                "source": {
                    "payment_rail": sourceCryptoType,
                    "currency": "usdc",
                    "from_address": sourceCryptoAddress
                },
                "destination": {
                    "payment_rail": destinationCryptoType,
                    "currency": "usdc",
                    "to_address": destinationCryptoAddress
                }
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
                data: JSON.stringify(transferJson)
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