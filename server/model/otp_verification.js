const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const OTPVerification = sequelize.define('OTPVerification', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: true, 
    tableName: 'otp_verifications', 
})

module.exports = OTPVerification;
