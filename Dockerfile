# Gunakan image Node.js resmi sebagai base image
FROM node:16-slim

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh kode aplikasi ke dalam container
COPY . .

# Expose port 8080 yang digunakan oleh aplikasi
EXPOSE 8080

# Tentukan perintah untuk menjalankan aplikasi
CMD ["npm", "start"]
