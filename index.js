const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const setupSwagger = require('./swagger/swagger');
const app = express();
const authRoutes = require("./routes/authRoutest");
const ChuyenNganh = require("./routes/ChuyenNganhRoutes");
const Dulieu = require("./routes/DulieuRoutes");
const cookieParser = require('cookie-parser');  
const PORT = process.env.PORT || 3000;
// Cấu hình CORS
const corsOptions = {
    origin: [
        'http://localhost:3000', 
        'http://localhost:3001', 
        'https://www-coral-three.vercel.app', 
        'https://database-imft.onrender.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json()); 
app.use(cookieParser()); 

// Định nghĩa các route
app.use("/api/auth", authRoutes);
app.use("/api/auth", ChuyenNganh); 
app.use("/api/auth", Dulieu); 

// Thiết lập Swagger
setupSwagger(app);

// Kiểm tra kết nối cơ sở dữ liệu
sequelize.authenticate()
    .then(() => {
        console.log('Kết nối cơ sở dữ liệu thành công.');
        return sequelize.sync();
    })
    .then(() => {
        console.log('Cơ sở dữ liệu đã được đồng bộ hóa thành công.');
    })
    .catch(err => {
        console.error('Lỗi kết nối cơ sở dữ liệu:', err);
    });

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy trên localhost:${PORT}`);
});
