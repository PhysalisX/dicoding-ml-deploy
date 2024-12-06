const predictCancer = (imagePath) => {
    // Logika untuk prediksi (gunakan model nyata di sini)
    const isCancerDetected = Math.random() > 0.5; // Simulasi: 50% kemungkinan kanker
    return isCancerDetected ? 'Cancer' : 'Non-cancer';
  };
  
  module.exports = { predictCancer };
  