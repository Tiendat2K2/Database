const ChuyenNganh = require('../models/ChuyenNganh');
const { Op } = require('sequelize');
// LẤY TẤT CẢ CHUYÊN NGÀNH
exports.getChuyenNganh = async (req, res) => {
    try {
        const chuyenNganh = await ChuyenNganh.findAll();
        res.status(200).json(chuyenNganh);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// THÊM CHUYÊN NGÀNH
exports.addChuyenNganh = async (req, res) => {
    try {
        let { TenChuyenNganh, UserID } = req.body;
        // Xóa khoảng trắng thừa ở đầu và cuối của TenChuyenNganh
        TenChuyenNganh = TenChuyenNganh.trim();
        if (!UserID) {
            return res.status(400).json({ message: "UserID là bắt buộc" });
        }
        // Kiểm tra nếu TenChuyenNganh đã tồn tại
        const existingChuyenNganh = await ChuyenNganh.findOne({ where: { TenChuyenNganh } });
        if (existingChuyenNganh) {
            return res.status(400).json({ status: 0, message: "Tên chuyên ngành đã tồn tại" });
        }
        // Tạo ChuyenNganh mới nếu chưa tồn tại
        const chuyenNganh = await ChuyenNganh.create({ TenChuyenNganh, UserID });
        res.status(200).json({ status: 1, message: "Thêm chuyên ngành thành công", chuyenNganh });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CẬP NHẬT CHUYÊN NGÀNH
exports.updateChuyenNganh = async (req, res) => {
    try {
        const { ChuyenNganhID } = req.query; // Lấy ChuyenNganhID từ query
        let { TenChuyenNganh, UserID } = req.body;

        // Xóa khoảng trắng thừa ở đầu và cuối của TenChuyenNganh
        TenChuyenNganh = TenChuyenNganh.trim();

        if (!UserID) {
            return res.status(400).json({ message: "UserID là bắt buộc" });
        }

        // Kiểm tra nếu Chuyên ngành có tồn tại
        const existingChuyenNganh = await ChuyenNganh.findByPk(ChuyenNganhID);
        if (!existingChuyenNganh) {
            return res.status(404).json({ status: 0, message: "Chuyên ngành không tồn tại" });
        }

        // Kiểm tra nếu tên chuyên ngành đã tồn tại
        const duplicateChuyenNganh = await ChuyenNganh.findOne({
            where: { TenChuyenNganh, ChuyenNganhID: { [Op.ne]: ChuyenNganhID } }
        });
        if (duplicateChuyenNganh) {
            return res.status(400).json({ status: 0, message: "Tên chuyên ngành đã tồn tại" });
        }
        // Cập nhật chuyên ngành nếu hợp lệ
        await ChuyenNganh.update(
            { TenChuyenNganh, UserID },
            { where: { ChuyenNganhID } }
        );

        res.status(200).json({ status: 1, message: "Cập nhật chuyên ngành thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// XÓA CHUYÊN NGÀNH
exports.deleteChuyenNganh = async (req, res) => {
    try {
        const { ChuyenNganhID } = req.query;

        const chuyenNganh = await ChuyenNganh.destroy({ where: { ChuyenNganhID } });
        
        if (!chuyenNganh) {
            return res.status(404).json({ status: 0,message: "Chuyên ngành không tồn tại" });
        }

        res.status(200).json({ status: 1,message: "Xóa chuyên ngành thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.getChuyenNganhCount = async (req, res) => {
    try {
        // Sử dụng Sequelize để đếm số lượng chuyên ngành
        const chuyenNganhCount = await ChuyenNganh.count();
        // Kiểm tra nếu không có chuyên ngành nào
        
        // Trả về số lượng chuyên ngành
        res.status(200).json({
            status: 1,
            message: 'Số lượng chuyên ngành',
            chuyenNganhCount: chuyenNganhCount // Số lượng chuyên ngành được trả về
        });
    } catch (err) {
        console.error('Lỗi lấy số lượng chuyên ngành:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};
