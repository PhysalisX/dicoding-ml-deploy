const { predictCancer } = require('../services/mlPredictionService');
const { Storage } = require('@google-cloud/storage');
const uuid = require('uuid');
const path = require('path');
const firebaseAdmin = require('firebase-admin');

// Inisialisasi Firebase Admin SDK dengan kredensial
if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(), // Gunakan kredensial yang ada di lingkungan aplikasi
  });
} else {
  firebaseAdmin.app(); // Jika sudah ada, gunakan yang sudah ada
}

const db = firebaseAdmin.firestore(); // Akses Firestore
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

    // Menyimpan hasil prediksi ke Firestore
    const predictionRef = db.collection('predictions').doc(predictionId);
    await predictionRef.set(responseData);

    // Mengirim respon ke pengguna
    return res.status(200).json({
      status: 'success',
      message: 'Model is predicted successfully',
      data: responseData,
    });
  } catch (error) {
    console.error('Error while processing prediction:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing the prediction.',
    });
  }
};

module.exports = { predict };
