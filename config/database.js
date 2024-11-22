require('dotenv').config();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    logging: false, // Tắt logging nếu không cần
    dialectOptions: {
        ssl: {
            require: false, // Tắt SSL để kiểm tra
        }
    }
});
sequelize.authenticate()
    .then(() => {
        console.log('Kết nối đến cơ sở dữ liệu PostgreSQL thành công.');
    })
    .catch(err => {
        console.error('Lỗi kết nối đến cơ sở dữ liệu PostgreSQL:', err);
    });
module.exports = sequelize;
