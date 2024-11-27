const Dulieu = require('../models/Dulieu');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadToDrive, getFileFromDrive } = require('../config/Google');
// Cấu hình multer với kiểm tra loại file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file PDF hoặc Word'));
    }
};
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});
// Các hàm hiện có giữ nguyên...
exports.getDulieu = async (req, res) => {
    try {
        const dulieu = await Dulieu.findAll();
        res.status(200).json({
            status: 1,
            message: 'Danh sách dữ liệu',
            dulieu
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Cập nhật hàm addDulieu để sử dụng Google Drive
exports.addDulieu = [
    upload.single('Files'),
    async (req, res) => {
        try {
            const { Tieude, NhomTacGia, Tapchixuatban, Thongtintamtapchi, Ghichu, UserID, ChuyenNganhID, Namhoc } = req.body;

            if (!UserID || !ChuyenNganhID) {
                return res.status(400).json({ message: "UserID và ChuyenNganhID là bắt buộc" });
            }

            let driveFileId = null;
            let driveFileUrl = null;

            if (req.file) {
                // Upload file lên Google Drive
                const driveResponse = await uploadToDrive(req.file.path);
                driveFileId = driveResponse.id;
                driveFileUrl = driveResponse.webViewLink;
                
                // Xóa file tạm sau khi upload lên Drive
                fs.unlinkSync(req.file.path);
            }

            const dulieu = await Dulieu.create({
                Tieude,
                Files: driveFileId,
                FileUrl: driveFileUrl,
                NhomTacGia,
                Tapchixuatban,
                Thongtintamtapchi,
                Ghichu,
                UserID,
                ChuyenNganhID,
                Namhoc
            });

            res.status(201).json({ 
                status: 1, 
                message: "Thêm dữ liệu thành công", 
                dulieu 
            });
        } catch (error) {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ message: error.message });
        }
    }
];
// Cập nhật hàm updateDulieu để sử dụng Google Drive
exports.updateDulieu = [
    upload.single('Files'),
    async (req, res) => {
        try {
            const { ID } = req.query;
            const dulieu = await Dulieu.findByPk(ID);
            
            if (!dulieu) {
                return res.status(404).json({ message: "Dữ liệu không tồn tại" });
            }
            const { Tieude, NhomTacGia, Tapchixuatban, Thongtintamtapchi, Ghichu, UserID, ChuyenNganhID, Namhoc } = req.body;// Assuming `id` is the current user's ID
            if ( !ChuyenNganhID || !UserID) {
                return res.status(400).json({ message: "Các trường UserID và ChuyenNganhID là bắt buộc" });
            }
            let driveFileId = dulieu.Files;
            let driveFileUrl = dulieu.FileUrl;

            if (req.file) {
                // Upload file mới lên Google Drive
                const driveResponse = await uploadToDrive(req.file.path);
                driveFileId = driveResponse.id;
                driveFileUrl = driveResponse.webViewLink;
                // Xóa file tạm
                fs.unlinkSync(req.file.path);
            }

            dulieu.Tieude = Tieude;
            dulieu.Files = driveFileId;
            dulieu.FileUrl = driveFileUrl;
            dulieu.NhomTacGia = NhomTacGia;
            dulieu.Tapchixuatban = Tapchixuatban;
            dulieu.Thongtintamtapchi = Thongtintamtapchi;
            dulieu.Ghichu = Ghichu;
            dulieu.ChuyenNganhID = ChuyenNganhID;
            dulieu.Namhoc = Namhoc;

            await dulieu.save();

            res.status(200).json({ 
                status: 1, 
                message: "Cập nhật dữ liệu thành công", 
                dulieu 
            });
        } catch (error) {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ message: error.message });
        }
    }
];
// Cập nhật hàm viewFile để sử dụng Google Drive
exports.viewFile = async (req, res) => {
    try {
        const { ID } = req.query;
        const dulieu = await Dulieu.findByPk(ID);
        
        if (!dulieu || !dulieu.Files) {
            return res.status(404).json({ message: "File không tồn tại" });
        }

        const fileInfo = await getFileFromDrive(dulieu.Files);
        
        if (!fileInfo || !fileInfo.webViewLink) {
            return res.status(404).json({ message: "Không thể lấy link xem file" });
        }

        // Trả về link Google Drive để frontend có thể mở
        res.status(200).json({
            status: 1,
            message: "Lấy link xem file thành công",
            data: {
                viewUrl: fileInfo.webViewLink
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Các hàm khác giữ nguyên...
exports.getDulieuByUserID = async (req, res) => {
    try {
        const { UserID } = req.query;
        if (!UserID) {
            return res.status(400).json({ message: "Vui lòng nhập UserID" });
        }
        const dulieu = await Dulieu.findAll({ where: { UserID: UserID } });
        res.status(200).json({
            status: 1,
            message: 'Dữ liệu',
            dulieu: dulieu
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDulieucount = async (req, res) => {
    try {
        const count = await Dulieu.count();
        res.status(200).json({
            status: 1,
            message: 'Số lượng dữ liệu',
            count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Thêm hàm deleteDulieu nếu chưa có
exports.deleteDulieu = async (req, res) => {
    try {
        const { ID } = req.query;
        const dulieu = await Dulieu.findByPk(ID);
        
        if (!dulieu) {
            return res.status(404).json({ 
                status: 0,
                message: "Dữ liệu không tồn tại" 
            });
        }

        await dulieu.destroy();
        
        res.status(200).json({
            status: 1,
            message: "Xóa dữ liệu thành công"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
