const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadCloud = require('../config/Cloudinary');
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Các chức năng xác thực
 */
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *                 example: user@gmail.com
 *               Username:
 *                 type: string
 *                 example: user123
 *               Password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *       400:
 *         description: Thông tin không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
// Đăng ký
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *                 example: user123
 *               Password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Thông tin không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 * 
 * */
// Đăng nhập
router.post('/login', authController.login);
/**
 * @swagger
 * /api/auth/sendVerificationEmail:
 *   post:
 *     summary: Gửi email xác minh cho người dùng
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *                 example: user@gmail.com
 *     responses:
 *       200:
 *         description: Email xác minh đã được gửi thành công
 *       400:
 *         description: Email không hợp lệ hoặc không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
// Gửi email xác minh
router.post('/sendVerificationEmail', authController.sendVerificationEmail);
/**
 * @swagger
 * /api/auth/resetTeacherPassword:
 *   post:
 *     summary: Đặt lại mật khẩu giáo viên về mặc định
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: UserID
 *         required: true
 *         description: ID của giáo viên cần đặt lại mật khẩu
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *         content:
 */

// Updated route definition
router.post('/resetTeacherPassword', authController.resetTeacherPassword);
// REFRESH TOKEN
/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Tạo lại token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 example: refresh_token_value
 *     responses:
 *       200:
 *         description: Tạo lại token thành công
 *       400:
 *         description: Thông tin không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/refresh-token',authController.refreshToken);
// getAllUsers
/**
 * @swagger
 * /api/auth/getAllUsers:
 *   get:
 *     summary: Lớp học
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Lớp học
 *       400:
 *         description: Lớp học không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/getAllUsers', authMiddleware.authMiddleware,authController.getAllUsers);
//getTeachers
/**
 * @swagger
 * /api/auth/getTeachers:
 *   get:
 *     summary: Lớp học
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Lớp học
 */
router.get('/getTeachers', authMiddleware.authMiddleware,authController.getTeachers);
//getUserCount
/**
 * @swagger
 * /api/auth/user-count:
 *   get:
 *     summary: Lớp học
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Lớp học
 *       400:
 *         description: Lớp học không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/user-count', authMiddleware.authMiddleware,authController.getUserCount);
/**
 * @swagger
 * /api/auth/getUserById:
 *   get:
 *     summary: Lấy thông tin người dùng theo UserID
 *     description: Lấy thông tin chi tiết của người dùng bằng cách sử dụng UserID.
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: UserID
 *         required: true
 *         description: ID của người dùng cần lấy thông tin
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 */
router.get('/getUserById', authMiddleware.authMiddleware,authController.getUserById);
//updateUser
/**
 * @swagger
 * /api/auth/updateUser:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     description: Cập nhật thông tin của người dùng đã tồn tại bằng UserID, ngoại trừ email và tên đăng nhập. Một số trường là tùy chọn và có thể được cập nhật riêng biệt.
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: UserID
 *         required: true
 *         description: ID của người dùng cần cập nhật thông tin
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               Std:
 *                 type: string
 *                 description: Số điện thoại của người dùng (tùy chọn)
 *               Img:
 *                 type: string
 *                 description: Ảnh đại diện của người dùng (tùy chọn, có thể là file hình ảnh được upload)
 *                 format: binary
 *               Hoten:
 *                 type: string
 *                 description: Họ và tên của người dùng (tùy chọn)
 *               Ngaysinh:
 *                 type: string
 *                 format: date
 *                 description: Ngày sinh của người dùng (tùy chọn)
 *               Noisinh:
 *                 type: string
 *                 description: Nơi sinh của người dùng (tùy chọn)
 *               Chuyenganh:
 *                 type: string
 *                 description: Chuyên ngành của người dùng (tùy chọn)
 *               Gioitinh:
 *                 type: string
 *                 description: Giới tính của người dùng (tùy chọn)
 *               Tendonvi:
 *                 type: string
 *                 description: Tên đơn vị công tác của người dùng (tùy chọn)
 *               Nganh:
 *                 type: string
 *                 description: Ngành của người dùng (tùy chọn)
 *               MGV:
 *                 type: string
 *                 description: Mã giảng viên của người dùng (tùy chọn)
 *               Sonam:
 *                 type: integer
 *                 description: Năm tốt nghiệp của người dùng (tùy chọn)
 *     responses:
 *       200:
 *         description: Cập nhật thông tin người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: 'Cập nhật thông tin người dùng thành công!'
 *                 data:
 *                   type: object
 *                   properties:
 *                     UserID:
 *                       type: integer
 *                     Hoten:
 *                       type: string
 *                     Ngaysinh:
 *                       type: string
 *                       format: date
 *                     Noisinh:
 *                       type: string
 *                     Chuyenganh:
 *                       type: string
 *                     Gioitinh:
 *                       type: string
 *                     Tendonvi:
 *                       type: string
 *                     Nganh:
 *                       type: string
 *                     Img:
 *                       type: string
 *                     MGV:
 *                       type: string
 *                     Sonam:
 *                       type: integer
 *       400:
 *         description: Thông tin đầu vào không hợp lệ
 *       404:
 *         description: Người dùng không tìm thấy
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/updateUser', uploadCloud.single('Img'), authMiddleware.authMiddleware, authController.updateUser);
// updateTeacher
/**
 * @swagger
 * /api/auth/updateTeacher:
 *   put:
 *     summary: Cập nhật thông tin giáo viên
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: UserID
 *         required: true
 *         description: ID của giáo viên cần cập nhật
 *         schema:
 *           type: integer
 *       - in: body
 *         name: teacher
 *         required: true
 *         description: Thông tin giáo viên cần cập nhật
 *         schema:
 *           type: object
 *           properties:
 *             Email:
 *               type: string
 *               example: "newemail@gmail.com"
 *             Username:
 *               type: string
 *               example: "newUsername"
 *             Std:
 *               type: string
 *               example: "123456789"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin giáo viên thành công
 *         content:
 */
router.put('/updateTeacher', authMiddleware.authMiddleware, authController.updateTeacher);
// updatePassword
/**
 * @swagger
 * /api/auth/updatePassword:
 *   put:
 *     summary: Update user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - UserID
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               UserID:
 *                 type: integer
 *                 description: ID of the user
 *                 example: 11
 *               oldPassword:
 *                 type: string
 *                 description: The current password of the user
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Cập nhật mật khẩu thành công!
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/updatePassword', authMiddleware.authMiddleware,authController.updatePassword);
//DELETE
/**
 * @swagger
 * /api/auth/deleteTeacher:
 *   delete:
 *     summary: Xóa giáo viên theo UserID
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: UserID
 *         required: true
 *         description: ID của giáo viên cần xóa
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa giáo viên thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: "Xóa giáo viên thành công"
 *       404:
 *         description: Không tìm thấy giáo viên
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy giáo viên"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi server"
 */
router.delete('/deleteTeacher', authController.deleteTeacher);
//updateTeacher
module.exports = router;
