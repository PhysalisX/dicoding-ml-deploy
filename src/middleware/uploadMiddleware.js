const multer = require('multer');

// Konfigurasi multer untuk file upload
const upload = multer({
  limits: { fileSize: 1000000 }, // Membatasi ukuran file maksimal 1MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('File is not an image'), false);
    }
  },
});

module.exports = { upload };
