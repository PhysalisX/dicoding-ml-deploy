const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { predict } = require('./controllers/predictController');

// Inisialisasi Express dan Google Cloud Storage
const app = express();
const storage = new Storage();
const bucket = storage.bucket('bucket-zilo'); // Nama bucket langsung ditulis di sini

// Konfigurasi multer untuk upload file
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

// Endpoint POST untuk prediksi
app.post('/predict', upload.single('image'), predict);

// Menjalankan server pada port 8080
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
