//
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure the 'public/temp' directory exists
const uploadDir = path.join(__dirname, '../public/temp');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = path.basename(file.originalname, ext) + '-' + uniqueSuffix + ext;
        cb(null, filename);
    }
});

const upload = multer({ storage });

module.exports = upload;