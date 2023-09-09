var { sequelize, Sequelize } = require('../../config/seq_db');

const Bank = sequelize.define(process.env.BANK_ACCOUNTS, {
    bank_id: {type: Sequelize.DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true, allowNull: false},
    bank_uid: Sequelize.DataTypes.STRING,
    user_id: Sequelize.DataTypes.INTEGER,
    plaid_account_id: Sequelize.DataTypes.STRING,
    virtual_account_id: Sequelize.DataTypes.STRING,
    account_name: Sequelize.DataTypes.STRING,
    account_no: Sequelize.DataTypes.STRING,
    routing_no: Sequelize.DataTypes.STRING,
    account_type: Sequelize.DataTypes.STRING,
    status: Sequelize.DataTypes.INTEGER,
    is_primary: Sequelize.DataTypes.INTEGER,
    balance: Sequelize.DataTypes.STRING,
    plaid_access_token: Sequelize.DataTypes.STRING,
    dwolla_fsurl: Sequelize.DataTypes.STRING,
    added_date: Sequelize.DataTypes.DATE,
});
Bank.removeAttribute('id');
// Bank.sync();
module.exports = Bank;