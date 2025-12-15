# Dockerfile untuk React Vite Application

# Menggunakan Node.js 20 Alpine sebagai base image (required untuk Vite 7+)
FROM node:20-alpine

# Set working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json (jika ada)
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code ke container
COPY . .

# Install serve untuk menjalankan aplikasi
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Jalankan aplikasi menggunakan serve
CMD ["serve", "-s", "dist", "-l", "3000"]