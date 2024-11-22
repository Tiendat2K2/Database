const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
cloudinary.config({ 
  cloud_name: 'dvqykprsh', 
  api_key: '614742727877254', 
  api_secret: 'cvJp7BjRWifbb_4AfF6mYuZQ_c8'
});
// Check Cloudinary connection
cloudinary.api.resources()
  .then(result => {
    console.log('✅ Kết nối Cloudinary thành công:', result.resources ? 'OK' : 'No resources found');
  })
  .catch(error => {
    console.error('Lỗi kết nối Cloudinary:', error);
  });
const storage = new CloudinaryStorage({ 
  cloudinary: cloudinary, 
  params: {
    folder: 'users', // Define folder for the uploaded images
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    public_id: (req, file) => file.originalname, // Use original name as public ID
  }
});
const uploadCloud = multer({ storage: storage });
module.exports = uploadCloud;
