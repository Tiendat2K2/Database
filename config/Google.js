const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const GOOGLE_API_FOLDER_ID = process.env.GOOGLE_API_FOLDER_ID;
// Hàm xác định MIME type
function getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png'
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

async function uploadToDrive(filePath) {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                client_email: process.env.GOOGLE_CLIENT_EMAIL
            },
            scopes: ['https://www.googleapis.com/auth/drive']
        });
        const driveService = google.drive({ version: 'v3', auth });
        const fileMetadata = {
            name: path.basename(filePath),
            parents: [GOOGLE_API_FOLDER_ID]
        };
        const media = {
            mimeType: getMimeType(filePath),
            body: fs.createReadStream(filePath)
        };
        const response = await driveService.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink',
        });
        if (response.data.id) {
            console.log(`✅ Tải lên file thành công! ID file: ${response.data.id}`);
            console.log(`Xem file tại: ${response.data.webViewLink}`);
        } else {
            console.log('❌ Tải lên file thất bại: Không có ID file trả về');
        }
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi tải lên Google Drive:', error.message);
        throw error;
    }
}

async function getFileFromDrive(fileId) {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                client_email: process.env.GOOGLE_CLIENT_EMAIL
            },
            scopes: ['https://www.googleapis.com/auth/drive']
        });

        const driveService = google.drive({ version: 'v3', auth });
        const response = await driveService.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
        });

        return response.data;
    } catch (error) {
        console.error('❌ Lỗi lấy file từ Drive:', error.message);
        throw error;
    }
}

module.exports = { uploadToDrive, getFileFromDrive };
