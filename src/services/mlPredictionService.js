// Simulasi fungsi prediksi
const predictCancer = (imagePath) => {
    // Simulasi: 50% kemungkinan kanker
    const isCancerDetected = Math.random() > 0.5;
    return isCancerDetected ? 'Cancer' : 'Non-cancer';
  };
  
  module.exports = { predictCancer };
  