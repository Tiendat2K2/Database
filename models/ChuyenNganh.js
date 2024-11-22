const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ChuyenNganh = sequelize.define('ChuyenNganh', {
    ChuyenNganhID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    TenChuyenNganh: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Tên bảng
            key: 'UserID'   // Khóa chính trong bảng Users
        }
    }
}, {
    tableName: 'ChuyenNganh',
    timestamps: false
});

module.exports = ChuyenNganh;