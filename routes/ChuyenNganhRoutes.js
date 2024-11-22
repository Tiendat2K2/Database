const express = require('express');
const router = express.Router();
const chuyenNganhController = require('../controllers/ChuyenNganhController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: ChuyenNganh
 *   description: Quản lý chuyên ngành
 */

// Lấy tất cả chuyên ngành
/**
 * @swagger
 * /api/auth/getChuyenNganh:
 *   get:
 *     summary: Lấy danh sách chuyên ngành
 *     tags: [ChuyenNganh]
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get('/getChuyenNganh', authMiddleware.authMiddleware, chuyenNganhController.getChuyenNganh);
/**
 * @swagger
 * /api/auth/getChuyenNganhCount:
 *   get:
 *     summary: Lấy số lượng chuyên ngành
 *     tags: [ChuyenNganh]
 *     responses:
 *       200:
 *         description: Lấy số lượng chuyên ngành thành công
 *         content:
 */
router.get('/getChuyenNganhCount', authMiddleware.authMiddleware, chuyenNganhController.getChuyenNganhCount);
// Thêm chuyên ngành
/**
 * @swagger
 * /api/auth/addChuyenNganh:
 *   post:
 *     summary: Tạo chuyên ngành
 *     tags: [ChuyenNganh]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TenChuyenNganh:
 *                 type: string
 *                 example: CNTT
 *               UserID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Tạo chuyên ngành thành công
 *         content:
 */
router.post('/addChuyenNganh', authMiddleware.authMiddleware, chuyenNganhController.addChuyenNganh);

// Cập nhật chuyên ngành
/**
 * @swagger
 * /api/auth/updateChuyenNganh:
 *   put:
 *     summary: Cập nhật chuyên ngành
 *     tags: [ChuyenNganh]
 *     parameters:
 *       - in: query
 *         name: ChuyenNganhID
 *         required: true
 *         description: ID của chuyên ngành cần cập nhật
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TenChuyenNganh:
 *                 type: string
 *                 example: "Chuyên ngành mới"
 *               UserID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cập nhật chuyên ngành thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       404:
 *         description: Chuyên ngành không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/updateChuyenNganh', authMiddleware.authMiddleware, chuyenNganhController.updateChuyenNganh);

/**
 * @swagger
 * /api/auth/deleteChuyenNganh:
 *   delete:
 *     summary: Xóa chuyên ngành
 *     tags: [ChuyenNganh]
 *     parameters:
 *       - in: query
 *         name: ChuyenNganhID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của chuyên ngành cần xóa
 *     responses:
 *       200:
 *         description: Xóa chuyên ngành thành công
 *       400:
 *         description: Thiếu Chuyên ngành ID
 *       404:
 *         description: Không tìm thấy Chuyên ngành
 *       500:
 *         description: Lỗi khi xử lý yêu cầu
 */

router.delete('/deleteChuyenNganh', authMiddleware.authMiddleware, chuyenNganhController.deleteChuyenNganh);


module.exports = router;
