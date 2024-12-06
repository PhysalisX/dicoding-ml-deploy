const express = require('express');
const multer = require('multer');
const { predict } = require('./controllers/predictController');

// Inisialisasi Express
const app = express();

// Konfigurasi multer untuk upload file
const upload = multer({
  limits: { fileSize: 1000000 }, // Batas ukuran file 1MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('File is not an image'), false);
    }
  },
});

// Endpoint untuk prediksi
app.post('/predict', upload.single('image'), predict);

const port = process.env.PORT || 8080;

// Mulai server pada port 8080
app.listen(8080, () => {
  console.log('Server running on port 8080');
});
