const { predictCancer } = require('../services/mlPredictionService');
const { Storage } = require('@google-cloud/storage');
const uuid = require('uuid');
const path = require('path');

// Menyebutkan nama bucket yang digunakan
const bucket = new Storage().bucket('bucket-zilo'); // Nama bucket langsung ditulis di sini

// Fungsi untuk menangani request POST ke /predict
const predict = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'No image file provided',
    });
  }

  try {
    // Membuat ID unik untuk setiap prediksi
    const predictionId = uuid.v4();

    // Mengupload gambar ke Google Cloud Storage
    const file = bucket.file(predictionId + path.extname(req.file.originalname));
    await file.save(req.file.buffer, { contentType: req.file.mimetype });

    // Menjadikan file gambar dapat diakses publik (opsional)
    await file.makePublic();

    // Dapatkan URL publik dari gambar
    const imagePath = file.publicUrl();

    // Lakukan prediksi menggunakan model
    const predictionResult = predictCancer(imagePath);

    // Format respon berdasarkan hasil prediksi
    const responseData = {
      id: predictionId,
      result: predictionResult,
      suggestion: predictionResult === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.',
      createdAt: new Date().toISOString(),
    };

    return res.status(200).json({
      status: 'success',
      message: 'Model is predicted successfully',
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

module.exports = { predict };
