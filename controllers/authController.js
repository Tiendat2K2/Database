const bcrypt = require('bcrypt');
const Users = require('../models/Users'); 
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Sequelize } = require('sequelize');  
const cloudinary = require('cloudinary').v2;

function generateRandomPassword(length = 10) {
    // Define the character sets
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*';

    let password = '';
    // Add at least one character from each set
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    const allChars = lowercase + uppercase + numbers + special;
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    return password.split('').sort(() => Math.random() - 0.5).join('');
}
// Đăng ký
exports.register = async (req, res) => {
    const { Email, Username, Password } = req.body; // Chỉ lấy Email, Username, Password
    if (!Email || !Username || !Password) {
        return res.status(400).json({ message: 'Vui lòng nhập tất cả các trường!' });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(Email)) {
        return res.status(400).json({ message: 'Địa chỉ email không hợp lệ! Vui lòng kiểm tra định dạng email của bạn.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(Password, 10);
        // Kiểm tra xem email đã tồn tại chưa
        const existingEmail = await Users.findOne({ where: { Email } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email đã được đăng ký!' });
        }
        // Kiểm tra xem username đã tồn tại chưa
        const existingUsername = await Users.findOne({ where: { Username } });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username đã được đăng ký!' });
        }
        // Tạo người dùng mới
        const newUser = await Users.create({
            Username,
            Email,
            Password: hashedPassword,
            isAdmin: false,
        });

        // Tạo refresh token cho người dùng mới
        const refresh_token = jwt.sign(
            { id: newUser.UserID, roleId: newUser.RoleID },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '365h' } // Thời gian sống refresh token
        );

        // Cập nhật refresh token vào cơ sở dữ liệu
        newUser.refreshToken = refresh_token;
        await newUser.save();

        // Trả về thông tin người dùng mới, bao gồm isAdmin và refresh_token
        res.status(201).json({
            status: 1,
            message: 'Đăng ký thành công!',
            isAdmin: newUser.isAdmin, // Trả về refresh token
        });
    } catch (err) {
        console.error('Đăng ký lỗi:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};
// Đăng nhập
exports.login = async (req, res) => {
    const { Username, Password } = req.body;
    if (!Username || !Password) {
        return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu!' });
    }
    try {
        const user = await Users.findOne({ where: { Username } });
        if (!user) {
            return res.status(400).json({ message: 'Sai tên đăng nhập hoặc mật khẩu!' });
        }
        const validPassword = await bcrypt.compare(Password, user.Password);
        if (!validPassword) {
            return res.status(400).json({ status: 0, message: 'Sai tên đăng nhập hoặc mật khẩu!' });
        }

        // Tạo access token
        const access_token = jwt.sign(
            { id: user.UserID, roleId: user.RoleID },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '300d' } // Thời gian sống access token
        );
        // Tạo refresh token
        const refresh_token = jwt.sign(
            { id: user.UserID, roleId: user.RoleID },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '365h' } // Thời gian sống refresh token
        );

        // Cập nhật refresh token vào cơ sở dữ liệu
        user.refreshToken = refresh_token;
        await user.save();

        res.json({
            status: 1,
            message: 'Đăng nhập thành công!',
            access_token,
            refresh_token,
            isAdmin: user.isAdmin,
        });
    } catch (err) {
        console.error('Đăng nhập lỗi:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};
// send verification email
exports.sendVerificationEmail = async (req, res) => {
    const { Email } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(Email)) {
        return res.status(400).json({ message: 'Địa chỉ email không hợp lệ! Vui lòng kiểm tra định dạng email của bạn.' });
    }
    try {
        const user = await Users.findOne({ where: { Email } });
        if (!user) {
            return res.status(400).json({ message: 'Email không tồn tại!' });
        }
        const verificationCode = generateRandomPassword(6);
        const hashedVerificationCode = await bcrypt.hash(verificationCode, 10);
        user.Password = hashedVerificationCode;
        user.isVerified = false; // Cập nhật trạng thái chưa xác minh
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: Email,
            subject: 'Xác nhận tài khoản của bạn',
            text: `Mã xác nhận của bạn là: ${verificationCode}`,
            html: `
                <h2>Mã xác nhận của bạn</h2>
                <p>Mã xác nhận của bạn là: <strong>${verificationCode}</strong></p>
                <p>Vui lòng nhập mã này để xác nhận tài khoản của bạn và thay đổi mật khẩu.</p>
            `
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Gửi email thành công! Mã xác thực đã được gửi đến email của bạn.' });
    } catch (error) {
        console.error('Lỗi gửi email xác thực:', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};
// reset teacher password   
exports.resetTeacherPassword = async (req, res) => {
    const { UserID } = req.query;  // Get UserID from the query parameter
    console.log("UserID:", UserID);  // Log to check if UserID is correctly received
    try {
        // Find the user by UserID in the database
        const user = await Users.findOne({ where: { UserID: UserID } });
        console.log("User found:", user);  // Log the found user for verification
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        // Hash the new default password
        const hashedPassword = await bcrypt.hash('1111', 10);
        console.log("Hashed Password:", hashedPassword);  // Log the hashed password for verification
        // Set the new password
        user.Password = hashedPassword;
        await user.save();  // Save the updated user information
        return res.status(200).json({
            status: 1,
            message: 'Đặt lại mật khẩu giáo viên thành công!',
            data: {
                userId: UserID,
                defaultPassword: '1111'
            }
        });
    } catch (error) {
        console.error("Lỗi khi đặt lại mật khẩu:", error);  // Log detailed error
        return res.status(500).json({ message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
    }
};
// delete teacher
exports.deleteTeacher = async (req, res) => {
    const { UserID } = req.query;  // Get UserID from the query parameter
    try {
        const teacher = await Users.findOne({ where: { UserID } });
        if (!teacher) {
            return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
        }
        await Users.destroy({ where: { UserID } });
        return res.status(200).json({ status: 1, message: 'Xóa giáo viên thành công' });
    } catch (err) {
        console.error(err);  // Log detailed error
        return res.status(500).json({ message: 'Lỗi server' });
    }
};
// update
exports.updatePassword = async (req, res) => {
    const { UserID, oldPassword, newPassword } = req.body;
    // Validate required fields
    if (!UserID || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập tất cả các trường!' });
    }
    try {
        // Find the user by UserID
        const user = await Users.findOne({ where: { UserID: UserID } });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }
        // Validate the old password
        const validPassword = await bcrypt.compare(oldPassword, user.Password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Mật khẩu cũ không chính xác!' });
        }
        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.Password = hashedNewPassword;
        // Save the updated password
        await user.save();
        res.status(200).json({ status: 1, message: 'Cập nhật mật khẩu thành công!' });
    } catch (error) {
        console.error('Lỗi cập nhật mật khẩu:', error);  // Log the detailed error
        res.status(500).json({ message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
    }
};
// update

exports.updateUser = async (req, res) => {
    const { Hoten, Ngaysinh, Noisinh, Chuyenganh, Sonam, Gioitinh, Std, Tendonvi, Nganh, MGV } = req.body;
    const { UserID } = req.query;  // UserID from query parameters

    // Initialize imgPath with existing Img or an empty string if no file
    let imgPath = req.body.Img;

    if (req.file) {
        try {
            // Upload the image to Cloudinary
            const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
                folder: 'users',  // Optional: you can define the folder for the uploaded image
            });
            imgPath = cloudinaryResponse.secure_url;  // Use the secure URL returned by Cloudinary
        } catch (error) {
            return res.status(500).json({ message: 'Lỗi khi tải ảnh lên Cloudinary!', error: error.message });
        }
    }

    // Parse UserID to integer
    const parsedUserID = parseInt(UserID, 10);

    // Check if parsedUserID is valid
    if (isNaN(parsedUserID)) {
        return res.status(400).json({ message: 'UserID không hợp lệ!' });
    }

    try {
        // Find user by UserID
        const user = await Users.findByPk(parsedUserID);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng với UserID đã cho!' });
        }

        // Check if the phone number (Std) already exists for another user
        if (Std) {
            const existingUser = await Users.findOne({
                where: { Std, UserID: { [Sequelize.Op.ne]: parsedUserID } }
            });

            if (existingUser) {
                return res.status(400).json({ message: 'Số điện thoại đã tồn tại!' });
            }
        }

        // Prepare fields for updating, ensuring no undefined or null values are passed
        const fieldsToUpdate = {
            Std: Std || user.Std,
            Img: imgPath || user.Img,  // Use the new Img path if a new image is uploaded
            Hoten: Hoten || user.Hoten,
            Ngaysinh: Ngaysinh || user.Ngaysinh,
            Noisinh: Noisinh || user.Noisinh,
            Chuyenganh: Chuyenganh || user.Chuyenganh,
            Gioitinh: Gioitinh || user.Gioitinh,
            Tendonvi: Tendonvi || user.Tendonvi,
            Nganh: Nganh || user.Nganh,
            MGV: MGV || user.MGV,
            Sonam: (Sonam || Sonam === 0) ? Sonam : user.Sonam,  // Handle Sonam even if it's 0
        };

        // Update the user details in the database
        await user.update(fieldsToUpdate);

        // Retrieve the updated user details
        const updatedUser = await Users.findOne({
            where: { UserID: parsedUserID },
            attributes: [
                'UserID', 'Hoten', 'Ngaysinh', 'Noisinh', 'Chuyenganh', 
                'Sonam', 'Gioitinh', 'Std', 'Tendonvi', 'Nganh', 'Img', 'MGV'
            ]
        });

        // Send a success response with the updated user data
        return res.status(200).json({
            status: 1,
            message: 'Cập nhật thông tin người dùng thành công!',
            data: updatedUser
        });

    } catch (err) {
        console.error('Lỗi cập nhật thông tin người dùng:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};
// update
exports.updateTeacher = async (req, res) => {
    const { Email, Username, Std } = req.body;
    const { UserID } = req.query;  // Capture UserID from the query parameters

    // Check if UserID is provided in the request query
    if (!UserID) {
        return res.status(400).json({
            status: 0,
            message: 'Vui lòng cung cấp UserID trong query string!'
        });
    }

    try {
        // Find the user by UserID (make sure it's a teacher)
        const user = await Users.findOne({
            where: {
                UserID,
                isAdmin: false // Only update teacher users
            }
        });

        if (!user) {
            return res.status(404).json({
                status: 0,
                message: 'Không tìm thấy giáo viên với UserID đã cho hoặc người dùng không phải giáo viên!'
            });
        }

        // Trim the values of the fields provided, and ensure Std is a string
        let updatedEmail = Email ? Email.trim() : user.Email;
        let updatedUsername = Username ? Username.trim() : user.Username;
        let updatedStd = Std ? String(Std).trim() : user.Std;  // Ensure Std is treated as a string

        // Validate the email format if provided
        if (updatedEmail && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(updatedEmail)) {
            return res.status(400).json({
                status: 0,
                message: 'Vui lòng nhập đúng định dạng email Gmail!'
            });
        }

        // Check if email already exists
        if (updatedEmail && updatedEmail !== user.Email) {
            const emailExists = await Users.findOne({ where: { Email: updatedEmail } });
            if (emailExists) {
                return res.status(400).json({
                    status: 0,
                    message: 'Email đã tồn tại!'
                });
            }
        }

        // Check if the username already exists
        if (updatedUsername && updatedUsername !== user.Username) {
            const usernameExists = await Users.findOne({ where: { Username: updatedUsername } });
            if (usernameExists) {
                return res.status(400).json({
                    status: 0,
                    message: 'Username đã tồn tại!'
                });
            }
        }

        // Check if the phone number already exists
        if (updatedStd && updatedStd !== user.Std) {
            const stdExists = await Users.findOne({ where: { Std: updatedStd } });
            if (stdExists) {
                return res.status(400).json({
                    status: 0,
                    message: 'Số điện thoại đã tồn tại!'
                });
            }
        }

        // Update the user if validation passes
        const updatedUser = await user.update({
            Email: updatedEmail,
            Username: updatedUsername,
            Std: updatedStd
        });

        // Respond with the updated user info but exclude sensitive fields like Email, Username, and Password
        const { Password, ...responseData } = updatedUser.toJSON();  // Exclude Password from the response

        res.status(200).json({
            status: 1,
            message: 'Cập nhật thông tin giáo viên thành công!',
            data: responseData
        });

    } catch (error) {
        console.error('Lỗi cập nhật thông tin giáo viên:', error);
        res.status(500).json({
            status: 0,
            message: 'Lỗi máy chủ!'
        });
    }
};
exports.getUserById = async (req, res) => {
    const { UserID } = req.query;  // Get UserID from the query parameter
    try {
        // Find user by UserID with specified attributes
        const user = await Users.findOne({
            attributes: [
                'Hoten', 'Ngaysinh', 'Noisinh', 'Chuyenganh', 'Sonam', 
                'Gioitinh', 'Std', 'Tendonvi', 'Nganh', 'Img', 'MGV'
            ],
            where: { UserID: UserID }
        });
        // Check if user does not exist
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }
        // Return user information
        res.status(200).json({
            status: 1,
            message: 'Thông tin người dùng',
            data: user // Return user data
        });
    } catch (err) {
        console.error('Lỗi lấy người dùng:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};
// getUserCount
exports.getUserCount = async (req, res) => {
    try {
        // Sử dụng Sequelize để đếm số lượng người dùng
        const userCount = await Users.count();
        res.status(200).json({
            status: 1,
            message: 'Số lượng người dùng',
            userCount: userCount // Số lượng người dùng được trả về
        });
    } catch (err) {
        console.error('Lỗi lấy số lượng người dùng:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};
// getTeachers
exports.getTeachers = async (req, res) => {
    try {
        // Truy vấn danh sách giáo viên có isAdmin = false
        const teachers = await Users.findAll({
            attributes: [
                'UserID', 'Email', 'Username', 'Std'
            ],
            where: { isAdmin: false } 
        });

        if (teachers.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy giáo viên nào!' });
        }

        res.status(200).json({
            status: 1,
            message: 'Danh sách giáo viên',
            data: teachers
        });
    } catch (err) {
        console.error('Lỗi lấy danh sách giáo viên:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};
// getAllUsers
exports.getAllUsers = async (req, res) => {
    try {
        // Truy vấn danh sách người dùng có isAdmin = false và không phải admin
        const users = await Users.findAll({
            attributes: [
                'UserID', 'Hoten', 'Ngaysinh', 'Noisinh', 'Chuyenganh', 'Sonam', 'Gioitinh',
                'Std', 'Tendonvi', 'Nganh', 'Img', 'MGV'
            ],
            where: {isAdmin: false } 
        });
        res.status(200).json({
            status: 1, // Trạng thái thành công
            message: 'Danh sách người dùng', // Tin nhắn trả về
            data: users // Dữ liệu người dùng
        });
    } catch (err) {
        console.error('Lỗi lấy danh sách người dùng:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};
// refreshToken
exports.refreshToken = async (req, res) => {
    const { refresh_token } = req.body;
    if (!refresh_token) {
        return res.status(400).json({ message: 'Vui lòng cung cấp refresh token!' });
    }
    try {
        // Verify the refresh token
        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        const user = await Users.findOne({ where: { UserID: decoded.id } });
        if (!user) {
            return res.status(401).json({ message: 'Người dùng không tồn tại!' });
        }
        // Generate new access token and refresh token
        const new_access_token = jwt.sign(
            { id: user.UserID, roleId: user.RoleID },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const new_refresh_token = jwt.sign(
            { id: user.UserID, roleId: user.RoleID },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '365h' }
        );
        res.json({
            status: 1,
            message: 'Tạo lại token thành công!',
            access_token: new_access_token,
            refresh_token: new_refresh_token
        });
    } catch (err) {
        console.error('Refresh token lỗi:', err);
        res.status(401).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn', error: err.message });
    }
};
