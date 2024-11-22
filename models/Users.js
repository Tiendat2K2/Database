const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Users = sequelize.define('Users', {
    UserID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    Username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    Password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Hoten: {
        type: DataTypes.STRING(255),
        allowNull: true 
    },
    Ngaysinh: {
        type: DataTypes.DATE,
        allowNull: true 
    },
    Noisinh: {
        type: DataTypes.STRING(255),
        allowNull: true 
    },
    Chuyenganh: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Sonam: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Gioitinh: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    Std: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    Tendonvi: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Nganh: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Img: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    MGV: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false 
    },
    refreshToken: { // Thêm trường refreshToken
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'Users',
    timestamps: false
});

module.exports = Users;