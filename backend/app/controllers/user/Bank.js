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
        body.user_uid = userUid;
        // body.user_uid = '899eddf2-c92e-4538-81cc-6680ca981298';
        await Bridge.createExternalBankAccount(body , (response, error) => {
            res.send(response);
        });
    },

    buyCrypto: async (req, res) => {
        var body = Helper.sanitizeInput(req.body);
        var userUid = await Helper.getUserUidByJWT(req.header('authorization'));
        body.user_uid = userUid;
        // body.user_uid = '899eddf2-c92e-4538-81cc-6680ca981298';
        await Bridge.buyCrypto(body , (response, error) => {
            res.send(response);
        });
    },

    createLinkToken: async (req, res) => {
        var body = Helper.sanitizeInput(req.body);
        var userUid = await Helper.getUserUidByJWT(req.header('authorization'));
        // body.user_uid = '899eddf2-c92e-4538-81cc-6680ca981298';
        body.user_uid = userUid;
        await Bridge.createPlaidLinkToken(body , (response, error) => {
            res.send(response);
        });
    },

    linkAllExternalAccounts: async (req, res) => {
        var body = Helper.sanitizeInput(req.body);
        var userUid = await Helper.getUserUidByJWT(req.header('authorization'));
        // body.user_uid = '899eddf2-c92e-4538-81cc-6680ca981298';
        body.user_uid = userUid;
        await Bridge.getExternalAccounts(body , (response, error) => {
            res.send(response);
        });
    },

    transactionDetails: async (req, res) => {
        var body = Helper.sanitizeInput(req.body);
        var userUid = await Helper.getUserUidByJWT(req.header('authorization'));
        // body.user_uid = '899eddf2-c92e-4538-81cc-6680ca981298';
        body.user_uid = userUid;
        await Bridge.getTransferDetails(body , (response, error) => {
            res.send(response);
        });
    },

    transferCrypto: async (req, res) => {
        var body = Helper.sanitizeInput(req.body);
        var userUid = await Helper.getUserUidByJWT(req.header('authorization'));
        body.user_uid = userUid;
        body.bridge_user_id = '07ef28db-d544-4ea0-a092-bd2208932576';
        body.source_crypto_type = 'ethereum';
        body.source_crypto_address = '0x25520a62370d4fC47e9512743eC0a23A27b50cC8';
        body.destination_crypto_type = 'ethereum';
        body.destination_crypto_address = 'gmonaghan.eth';
        body.amount = 1;
        // body.user_uid = '899eddf2-c92e-4538-81cc-6680ca981298';
        await Bridge.transferCrytoTocrypto(body , (response, error) => {
            res.send(response);
        });
    },
}