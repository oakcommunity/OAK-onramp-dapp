const Helper = require('../../helpers/commonHelper');
const SQUser = require('../../models/SQUser');
const SQAddress = require('../../models/SQAddress');
const SQUserWallet = require('../../models/SQUserWallet');
const Bridge = require('../third_party/Bridge');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {

    addBankAccount: async (req, res) => {
        var body = Helper.sanitizeInput(req.body);
        var userUid = await Helper.getUserUidByJWT(req.header('authorization'));
        body.user_uid = '899eddf2-c92e-4538-81cc-6680ca981298';
        await Bridge.createExternalBankAccount(body , (response, error) => {
            res.send(response);
        });
    },

    buyCrypto: async (req, res) => {
        var body = Helper.sanitizeInput(req.body);
        var userUid = await Helper.getUserUidByJWT(req.header('authorization'));
        body.user_uid = '899eddf2-c92e-4538-81cc-6680ca981298';
        await Bridge.buyCrypto(body , (response, error) => {
            res.send(response);
        });
    },
}