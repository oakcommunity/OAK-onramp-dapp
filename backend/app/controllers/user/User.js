const Helper = require('../../helpers/commonHelper');
const SQUser = require('../../models/SQUser');
const SQAddress = require('../../models/SQAddress');
const SQUserWallet = require('../../models/SQUserWallet');
const Bridge = require('../third_party/Bridge');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

SQUser.hasMany(SQAddress, { as: 'location', foreignKey: 'user_id' });

module.exports = {

    register: async (req, res) => {
        var body = Helper.sanitizeInput(req.body);
        if (body.fname && body.lname && body.email && body.phone && body.address_line_1 && body.city && body.state && body.zip && body.dob && body.ssn && body.signed_agreement_id && body.password && body.confirm_password) {

            if (body.password != body.confirm_password) {
                res.send(Helper.apiResponse({
                    status: 0,
                    message: 'Password and confirm password should be same'
                }));
            }
            else {
                var isExist = await SQUser.findOne({
                    attributes: ['user_id'],
                    where: {
                        [Op.or]: [
                            {
                                email: body.email
                            },
                            {
                                phone: body.phone
                            }
                        ]

                    }
                });
                if (isExist) {
                    res.send(Helper.apiResponse({
                        status: 0,
                        message: 'Email or Phone already registered'
                    }));
                }
                else {
                    var userData = {
                        user_uid: Helper.generateUid(),
                        fname: body.fname,
                        lname: body.lname,
                        email: body.email,
                        phone: body.phone,
                        user_status: 1,
                        dob: body.dob,
                        ssn_number: Helper.encrypto(body.ssn),
                        added_date: Helper.currentDatetime(),
                        password: Helper.encryptPassword(body.password),
                    }
                    var user = await SQUser.create(userData);
                    if (user) {
                        var addressData = {
                            address_uid: Helper.generateUid(),
                            user_id: user.dataValues.user_id,
                            city: body.city,
                            state: body.state,
                            zip: body.zip,
                            country: body.country,
                            street_2: body.address_line_2,
                            status: 1,
                            is_primary: 1,
                            street_1: body.address_line_1,
                            modified_date: Helper.currentDatetime(),
                        }
                        await SQAddress.create(addressData);
                        body.user_uid = userData.user_uid;
                        Bridge.createUser(body, (success, error) => { });
                        res.send({
                            status: 1,
                            message: 'Information saved successfully'
                        });
                    }
                    else {
                        res.send({
                            status: 0,
                            message: 'Information not saved, try again'
                        });
                    }
                }
            }

        }
        else {
            res.send({
                status: 0,
                message: 'All the profile information and terms & conditions are required.'
            });
        }

    },

    login: async (req, res) => {
        var body = Helper.sanitizeInput(req.body);
        if (body.username && body.password) {

            var isExist = await SQUser.findOne({
                attributes: ['user_id', 'user_uid', 'password'],
                where: {
                    user_status: 1,
                    [Op.or]: [
                        {
                            email: body.username
                        },
                        {
                            phone: body.username
                        }
                    ]

                }
            });
            if (isExist) {
                isExist = isExist.dataValues;
                if (body.password && Helper.comparePassword(body.password, isExist.password)) {
                    res.send(Helper.apiResponse({
                        status: 1,
                        message: 'Login success',
                        data: { token: Helper.createJwtToken(isExist.user_uid) }
                    }));
                }
                else {
                    res.send(Helper.apiResponse({
                        status: 0,
                        message: 'Incorrect password'
                    }));
                }

            }
            else {
                res.send({
                    status: 0,
                    message: 'Invalid username'
                });
            }
        }


    },

    details: async (req, res) => {

        var userUid = await Helper.getUserUidByJWT(req.header('authorization'));
        if (userUid) {

            var ud = await SQUser.findOne({
                where: {
                    user_status: 1,
                    user_uid: userUid
                }
            });
            if (ud) {
                var userWallet = await SQUserWallet.findAll({
                    where: {
                        wallet_status: 1,
                        user_id: ud.dataValues.user_id
                    }
                });
                ud.dataValues.ssn_number = Helper.decrypto(ud.dataValues.ssn_number);

                ud.dataValues.kyc_status_message = '';
                if (ud.dataValues.bridge_user_id == '' || ud.dataValues.bridge_user_id == null) {
                    ud.dataValues.kyc_status = 'not_done';
                    ud.dataValues.kyc_status_message = 'Start KYC verification';
                }
                else if (ud.dataValues.bridge_status) {
                    var kycStatus = ud.dataValues.bridge_status;
                    kycStatus = kycStatus.replace("_", " ");
                    // kycStatus = kycStatus.toUpperCase();
                    ud.dataValues.kyc_status = 'need_more_details';
                    ud.dataValues.kyc_status_message = kycStatus + ' required';
                }
                else {
                    ud.dataValues.kyc_status = 'approved';
                }

                ud.dataValues.wallet_list = userWallet;

                delete ud.dataValues.user_id;
                delete ud.dataValues.bridge_user_id;
                delete ud.dataValues.bridge_status;
                res.send({
                    status: 1,
                    data: ud
                });
            }
            else {
                res.send({
                    status: 0,
                    message: 'Details not found'
                });
            }
        }
        else {
            res.send({
                status: 0,
                message: 'Details not found'
            });
        }


    },

    updateUserDetails: async (req, res) => {

        var userUid = await Helper.getUserUidByJWT(req.header('authorization'));
        if (userUid) {
            var body = req.body;

            if (body.fname && body.lname && body.email && body.phone && body.dob && body.ssn) {

                var ud = await SQUser.findOne({
                    attributes: ['user_id', 'email', 'phone'],
                    where: {
                        user_status: 1,
                        user_uid: userUid
                    }
                });
                if (ud) {
                    ud = ud.dataValues;
                    var userId = ud.user_id;
                    var phone = ud.phone;
                    var email = ud.email;
                    var allowUpdate = true;

                    if (phone != body.phone) {
                        var isPhoneExist = await SQUser.findOne({
                            attributes: ['user_id'],
                            where: {
                                phone: phone,
                                user_id: { [Op.not]: userId },
                            }
                        });
                        if (isPhoneExist) {
                            allowUpdate = false;
                            res.send({
                                status: 0,
                                message: 'Phone already exist'
                            });
                        }
                    }
                    if (email != body.email) {
                        var isEmailExist = await SQUser.findOne({
                            attributes: ['user_id'],
                            where: {
                                email: email,
                                user_id: { [Op.not]: userId },
                            }
                        });
                        if (isEmailExist) {
                            allowUpdate = false;
                            res.send({
                                status: 0,
                                message: 'Email already exist'
                            });
                        }
                    }

                    if (allowUpdate == true) {
                        var userData = {
                            fname: body.fname,
                            lname: body.lname,
                            email: body.email,
                            phone: body.phone,
                            dob: body.dob,
                            ssn_number: Helper.encrypto(body.ssn)
                        }
                        SQUser.update(
                            userData,
                            { where: { user_id: userId } }
                        );
                        res.send({
                            status: 1,
                            message: 'Updated successfully'
                        });
                    }
                    else {
                        res.send({
                            status: 1,
                            message: 'Try again'
                        });
                    }
                }
                else {
                    res.send({
                        status: 0,
                        message: 'Details not found'
                    });
                }
            }
            else {
                res.send({
                    status: 0,
                    message: 'Profile details missing'
                });
            }
        }
        else {
            res.send({
                status: 0,
                message: 'User not found'
            });
        }
    },

    updateAddress: async (req, res) => {
        var body = req.body;
        var address_1 = body.address_1;
        var address_2 = body.address_2;
        var city = body.city;
        var state = body.state;
        var country = body.country ? body.country : 'USA';
        var zip = body.zip;
        var date = Helper.currentDatetime();
        var userUid = await Helper.getUserUidByJWT(req.header('authorization'));
        if (userUid) {
            if (address_1 == '' || city == '' || state == '' || zip == '') {
                res.send(Helper.apiResponse({
                    status: 0,
                    message: 'Street adress, city, state and postal code are required'
                }));
                res.end();
            }
            else {
                SQUser.findOne({
                    attributes: ['user_id'],
                    where: { user_uid: userUid }
                }).then(async ud => {
                    if (ud) {
                        ud = ud.dataValues;
                        var userID = ud.user_id;
                        var savedAddress = await SQAddress.findOne({
                            attributes: ['address_id', 'address_uid'],
                            where: { user_id: userID }
                        });

                        if (savedAddress) {
                            var uid = savedAddress.address_uid;
                            var addressData = {
                                street_1: address_1,
                                street_2: address_2,
                                city: city,
                                state: state,
                                zip: zip,
                                country: country,
                                status: 1
                            };
                            await SQAddress.update(
                                addressData,
                                { where: { address_id: savedAddress.address_id } }
                            );
                            addressData.address_uid = uid;
                        }
                        else {
                            var uid = Helper.generateUid();
                            var addressData = {
                                address_uid: uid,
                                street_1: address_1,
                                street_2: address_2,
                                city: city,
                                state: state,
                                zip: zip,
                                country: country,
                                user_id: userID,
                                status: 1
                            };
                            await SQAddress.create(addressData);
                            delete addressData.user_id;
                        }
                        res.send(Helper.apiResponse({
                            status: 1,
                            message: 'Updated',
                            data: addressData
                        }));
                        res.end();
                    }
                    else {
                        res.send(Helper.apiResponse({
                            status: 0,
                            message: 'User not found'
                        }));
                        res.end();
                    }
                });
            }
        }
        else {
            res.send({
                status: 0,
                message: 'User not found'
            });
        }
    },

    changePassword: async (req, res) => {
        var body = req.body;
        var oldPassword = body.old_password;
        var password = body.password;
        var newPassword = body.confirm_password;
        var date = Helper.currentDatetime();

        var userUid = await Helper.getUserUidByJWT(req.header('authorization'));
        if (userUid) {

            if (oldPassword == '' || password == '' || newPassword == '') {
                res.send(Helper.apiResponse({
                    status: 0,
                    message: 'Old password, New password and Confirm password are required'
                }));
                res.end();
            }
            else if (password != newPassword) {
                res.send(Helper.apiResponse({
                    status: 0,
                    message: 'New password and confirm password should be same'
                }));
                res.end();
            }
            else if (oldPassword == newPassword) {
                res.send(Helper.apiResponse({
                    status: 0,
                    message: 'Old password and New password should not be same'
                }));
                res.end();
            }
            else {
                SQUser.findOne({
                    attributes: ['user_id', 'password'],
                    where: { user_uid: userUid }
                }).then(async ud => {
                    if (ud) {
                        ud = ud.dataValues;
                        var userID = ud.user_id;
                        if (!Helper.comparePassword(oldPassword, ud.password)) {
                            res.send(Helper.apiResponse({
                                status: 0,
                                message: 'Incorrect old password'
                            }));
                            res.end();
                        }
                        else {
                            await SQUser.update(
                                {
                                    password: Helper.encryptPassword(password),
                                },
                                { where: { user_id: userID } }
                            );
                            res.send(Helper.apiResponse({
                                status: 1,
                                message: 'Password updated'
                            }));
                            res.end();
                        }
                    }
                    else {
                        res.send(Helper.apiResponse({
                            status: 0,
                            message: 'User not found'
                        }));
                        res.end();
                    }
                });
            }
        }
        else {
            res.send({
                status: 0,
                message: 'User not found'
            });
        }
    },

    updateWalletAddress: async (req, res) => {

        var userUid = await Helper.getUserUidByJWT(req.header('authorization'));
        if (userUid) {
            var walletAddress = req.body.wallet_address;
            var walletName = req.body.wallet_name;
            var website = req.body.website;

            if (walletAddress == '' || walletAddress == null) {
                res.send({
                    status: 0,
                    message: 'Wallet address cannot be blank'
                });
            }
            else {

                var ud = await SQUser.findOne({
                    where: {
                        user_status: 1,
                        user_uid: userUid
                    }
                });
                if (ud) {
                    ud = ud.dataValues;
                    var userId = ud.user_id;

                    var isWalletExist = await SQUserWallet.findOne({
                        where: {
                            wallet_address: walletAddress,
                            user_id: userId
                        }
                    });
                    if (isWalletExist) {
                        res.send({
                            status: 0,
                            message: 'Wallet already added'
                        });
                    }
                    else {
                        var walletData = {
                            user_wallet_uid: Helper.generateUid(),
                            user_id: userId,
                            wallet_address: walletAddress,
                            wallet_name: walletName,
                            wallet_website: website,
                            wallet_status: 1,
                            wallet_added_date: Helper.currentDatetime()
                        }
                        SQUserWallet.create(walletData);
                        res.send({
                            status: 1,
                            message: 'User wallet added'
                        });
                    }
                }
                else {
                    res.send({
                        status: 0,
                        message: 'Details not found'
                    });
                }
            }
        }
        else {
            res.send({
                status: 0,
                message: 'Details not found'
            });
        }


    },


}