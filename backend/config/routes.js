require('express-router-group');
var r = require('express').Router();
const { append } = require('express/lib/response');

var controlPath = '.';

var ValidateUserToken = require('../middleware/UserAuthorization');
var Bridge = require('../app/controllers/third_party/Bridge');
var User = require('../app/controllers/user/User');
var Bank = require('../app/controllers/user/Bank');

r.group("/v1", rt => {
    rt.get('/auth/create-terms-link', Bridge.createTermsLink);
    rt.post('/auth/register-user', User.register);
    rt.post('/auth/login', User.login);

    rt.get('/user/details', ValidateUserToken, User.details);
    rt.post('/user/update-wallet-address', ValidateUserToken, User.updateWalletAddress);
    rt.post('/user/update-details', ValidateUserToken, User.updateUserDetails);
    rt.post('/user/update-address', ValidateUserToken, User.updateAddress);
    rt.post('/user/update-password', ValidateUserToken, User.changePassword);

    rt.get('/user/bank/add-manually', ValidateUserToken, Bank.addBankAccount);
    rt.get('/user/bank/buy-crypto', ValidateUserToken, Bank.buyCrypto);
    rt.post('/user/bank/transaction-details', ValidateUserToken, Bank.transactionDetails);

    rt.get('/user/bank/create-link-token', ValidateUserToken, Bank.createLinkToken);
    rt.post('/user/bank/link-external-account', ValidateUserToken, Bank.linkAllExternalAccounts);
    
    rt.get('/user/transfer/eth-eth', ValidateUserToken, Bank.transferCrypto);
});
r.get('*', (req, res) => {
    res.send({
        status: 0,
        message: 'Unknown request'
    });
});
r.post('*', (req, res) => {
    res.send({
        status: 0,
        message: 'Unknown request'
    });
});
module.exports = r;