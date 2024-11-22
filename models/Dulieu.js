const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dulieu = sequelize.define('Dulieus', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Tieude: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Files: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    NhomTacGia: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Tapchixuatban: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Thongtintamtapchi: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Ghichu: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Tên bảng
            key: 'UserID'   // Khóa chính trong bảng Users
        }
    },
    ChuyenNganhID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ChuyenNganh', // Tên bảng
            key: 'ChuyenNganhID'  // Khóa chính trong bảng ChuyenNganh
        }
    },
    Namhoc: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    FileUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
    
}, {
    tableName: 'Dulieus',
    timestamps: false
});

module.exports = Dulieu;
