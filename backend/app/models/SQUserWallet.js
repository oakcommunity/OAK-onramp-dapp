var { sequelize, Sequelize } = require('../../config/seq_db');
const USER_WALLET = sequelize.define(process.env.user_wallet, {
    user_wallet_id: { type: Sequelize.DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true, allowNull: false },
    user_wallet_uid: Sequelize.DataTypes.STRING,
    user_id: Sequelize.DataTypes.INTEGER,
    wallet_address: Sequelize.DataTypes.STRING,
    wallet_name: Sequelize.DataTypes.STRING,
    wallet_website: Sequelize.DataTypes.STRING,
    wallet_status: Sequelize.DataTypes.INTEGER,
    wallet_added_date: Sequelize.DataTypes.DATE
},
{
    freezeTableName:true
});
USER_WALLET.removeAttribute('id');
module.exports = USER_WALLET;