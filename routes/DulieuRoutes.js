const express = require('express');
const router = express.Router();
const dulieuController = require('../controllers/DulieuController');
const authMiddleware = require('../middleware/authMiddleware');
/**
 * @swagger
 * tags:
 *   name: Dulieu
 *   description: Quản lý dữ liệu
 */

/**
 * @swagger
 * /api/auth/getDulieu:
 *   get:
 *     summary: Lấy danh sách dữ liệu
 *     tags: [Dulieu]
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/getDulieu', authMiddleware.authMiddleware, dulieuController.getDulieu);

/**
 * @swagger
 * /api/auth/getDulieucount:
 *   get:
 *     summary: Lấy số lượng dữ liệu
 *     tags: [Dulieu]
 *     responses:
 *       200:
 *         description: Trả về số lượng dữ liệu
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/getDulieucount', authMiddleware.authMiddleware, dulieuController.getDulieucount);

/**
 * @swagger
 * /api/auth/getDulieuByUserID:
 *   get:
 *     summary: Lấy dữ liệu theo UserID
 *     tags: [Dulieu]
 *     parameters:
 *       - in: query
 *         name: UserID
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của người dùng để tìm dữ liệu
 *     responses:
 *       200:
 *         description: Trả về dữ liệu theo UserID
 *       400:
 *         description: Không có UserID được cung cấp
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/getDulieuByUserID', authMiddleware.authMiddleware, dulieuController.getDulieuByUserID);

/**
 * @swagger
 * /api/auth/viewFile:
 *   get:
 *     summary: Xem file
 *     tags: [Dulieu]
 *     parameters:
 *       - in: query
 *         name: ID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của dữ liệu để xem file
 *     responses:
 *       200:
 *         description: Xem file thành công
 *       404:
 *         description: File không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/viewFile', authMiddleware.authMiddleware, dulieuController.viewFile);


/**
 * @swagger
 * /api/auth/addDulieu:
 *   post:
 *     summary: Thêm dữ liệu mới
 *     tags: [Dulieu]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               Files:
 *                 type: string
 *                 format: binary
 *               Tieude:
 *                 type: string
 *               NhomTacGia:
 *                 type: string
 *               Tapchixuatban:
 *                 type: string
 *               Thongtintamtapchi:
 *                 type: string
 *               Ghichu:
 *                 type: string
 *               UserID:
 *                 type: integer
 *               ChuyenNganhID:
 *                 type: integer
 *               Namhoc:
 *                 type: string
 *     responses:
 *       201:
 *         description: Thêm dữ liệu thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/addDulieu', authMiddleware.authMiddleware, dulieuController.addDulieu);

/**
 * @swagger
 * /api/auth/updateDulieu:
 *   put:
 *     summary: Cập nhật dữ liệu
 *     tags: [Dulieu]
 *     parameters:
 *       - in: query
 *         name: ID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của dữ liệu cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               Files:
 *                 type: string
 *                 format: binary
 *               Tieude:
 *                 type: string
 *               NhomTacGia:
 *                 type: string
 *               Tapchixuatban:
 *                 type: string
 *               Thongtintamtapchi:
 *                 type: string
 *               Ghichu:
 *                 type: string
 *               UserID:
 *                 type: integer
 *               ChuyenNganhID:
 *                 type: integer
 *               Namhoc:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/updateDulieu', authMiddleware.authMiddleware, dulieuController.updateDulieu);

/**
 * @swagger
 * /api/auth/deleteDulieu:
 *   delete:
 *     summary: Xóa dữ liệu
 *     tags: [Dulieu]
 *     parameters:
 *       - in: query
 *         name: ID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của dữ liệu cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/deleteDulieu', authMiddleware.authMiddleware, dulieuController.deleteDulieu);

module.exports = router;