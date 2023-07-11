var { sequelize, Sequelize } = require('../../config/seq_db');
const User = sequelize.define(process.env.USERS, {
    user_id: { type: Sequelize.DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true, allowNull: false },
    user_uid: Sequelize.DataTypes.STRING,
    bridge_user_id: Sequelize.DataTypes.STRING,
    email: Sequelize.DataTypes.STRING,
    phone: Sequelize.DataTypes.STRING,
    fname: Sequelize.DataTypes.STRING,
    lname: Sequelize.DataTypes.STRING,
    ssn_number: Sequelize.DataTypes.STRING,
    bridge_status: Sequelize.DataTypes.STRING,  
    password: Sequelize.DataTypes.STRING,  
    dob: Sequelize.DataTypes.DATEONLY,
    user_status: Sequelize.DataTypes.INTEGER,
    added_date: Sequelize.DataTypes.DATE,
    login_datetime: Sequelize.DataTypes.DATE,
});
User.removeAttribute('id');
// User.sync();
module.exports = User;