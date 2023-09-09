var { sequelize, Sequelize } = require('../../config/seq_db');
const Address = sequelize.define(process.env.ADDRESS, {
    address_id: { type: Sequelize.DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true, allowNull: false },
    address_uid: Sequelize.DataTypes.STRING,
    user_id: Sequelize.DataTypes.INTEGER,
    city: Sequelize.DataTypes.STRING,
    state: Sequelize.DataTypes.STRING,
    state: Sequelize.DataTypes.STRING,
    country: Sequelize.DataTypes.STRING,
    zip: Sequelize.DataTypes.STRING,
    street_1: Sequelize.DataTypes.STRING,
    street_2: Sequelize.DataTypes.STRING,
    modified_date: Sequelize.DataTypes.DATE,
    status: Sequelize.DataTypes.INTEGER,
    is_primary: Sequelize.DataTypes.INTEGER
},
{
    freezeTableName:true
});
Address.removeAttribute('id');
module.exports = Address;