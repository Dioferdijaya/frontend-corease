# Courstease – Boking Lapangan Futsal
Sebuah web pemesanan lapangan futsal secara real-time dan digital, Lihat ketersediaan jadwal lapangan secara langsung, Booking Instan, Hanya butuh beberapa langkah mudah untuk mengamankan jadwal. Pilih waktu, lakukan konfirmasi, dan lapangan siap untuk Anda gunakan.

Framework: React.js untuk frontend & Express.js & Node.js Untuk backend

# How to Getting Started
## Installation

## Clone repo:<br>
https://github.com/Dioferdijaya/Coursease-Boking-Lapangan-Futsal.git

## Database
**Note: Aplikasi ini menggunakan Supabase sebagai database**

### Setup Database Supabase

1. **Buat akun Supabase**
   - Kunjungi [https://supabase.com](https://supabase.com)
   - Buat project baru

2. **Buat Table di Supabase SQL Editor**

   **Table users:**
   ```sql
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100),
       email VARCHAR(100) UNIQUE,
       password VARCHAR(255),
       role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin'))
   );
   ```

   **Table fields:**
   ```sql
   CREATE TABLE fields (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100),
       type VARCHAR(50),
       price_per_hour INTEGER
   );
   ```

   **Table bookings:**
   ```sql
   CREATE TABLE bookings (
       id SERIAL PRIMARY KEY,
       user_id INTEGER REFERENCES users(id),
       field_id INTEGER REFERENCES fields(id),
       date DATE,
       start_time TIME,
       end_time TIME,
       status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'canceled')),
       user_name VARCHAR(100),
       user_email VARCHAR(100)
   );
   ```

   **Table messages (untuk fitur chat):**
   ```sql
   CREATE TABLE messages (
       id SERIAL PRIMARY KEY,
       booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
       sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
       sender_role VARCHAR(10) CHECK (sender_role IN ('user', 'admin')),
       message TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT NOW(),
       is_read BOOLEAN DEFAULT FALSE
   );
   ```

3. **Konfigurasi API Keys**
   - Buka file `backend/.env`
   - Ganti `SUPABASE_URL` dengan URL project Supabase Anda
   - Ganti `SUPABASE_ANON_KEY` dengan Anon/Public key dari Supabase
   - Anda bisa menemukan kedua nilai ini di: **Project Settings > API**

## **Fitur Aplikasi**

### 🎯 Fitur User
- ✅ Registrasi dan Login
- ✅ Lihat daftar lapangan futsal
- ✅ Booking lapangan dengan pilihan tanggal dan waktu
- ✅ Integrasi pembayaran online (Mayar.id)
- ✅ Riwayat booking lengkap
- ✅ Edit profil (nama, username, telepon, password)
- ✅ **💬 Real-time Chat dengan Admin** - Tanyakan langsung tentang booking Anda!

### 👨‍💼 Fitur Admin
- ✅ Dashboard admin untuk kelola semua booking
- ✅ Konfirmasi atau tolak booking
- ✅ Lihat detail pembayaran
- ✅ **💬 Panel Chat Real-time** - Balas semua pertanyaan user secara langsung!
- ✅ Notifikasi pesan baru dari user

### 💬 Fitur Chat Real-time
- ✅ Chat antara user dan admin per booking
- ✅ Real-time messaging dengan Socket.IO
- ✅ History chat tersimpan di database
- ✅ Status online/offline
- ✅ Notifikasi pesan belum dibaca
- ✅ UI chat modern dan responsif

##Tampilan
-Landing Page
<img width="1919" height="933" alt="image" src="https://github.com/user-attachments/assets/89b83d76-64ee-4944-9df1-325ff37c51f6" />
<img width="1919" height="933" alt="image" src="https://github.com/user-attachments/assets/d4f35fc9-6eec-4c32-b0af-5148ce4d509d" />
<img width="1919" height="933" alt="image" src="https://github.com/user-attachments/assets/cfbc5ad2-5b08-4400-9a49-0ce994689759" />

-Login Page
<img width="1919" height="933" alt="image" src="https://github.com/user-attachments/assets/43983294-413a-4582-844f-1caed153f4b9" />

-Register Page
<img width="1919" height="932" alt="image" src="https://github.com/user-attachments/assets/85e00503-18cf-42c5-bc09-5a6d59e422ec" />

-Home User Page
<img width="1919" height="934" alt="image" src="https://github.com/user-attachments/assets/34bcb62f-b7da-4ce9-8142-e50ad2045a76" />

-Profile Page
<img width="1376" height="914" alt="image" src="https://github.com/user-attachments/assets/0f2d8610-86b5-415f-b47a-13ed7e4e78e2" />

-Edit Profile Page
![WhatsApp Image 2025-12-09 at 8 48 07 PM](https://github.com/user-attachments/assets/9372d6ac-d94e-44cc-b9d8-e53bc989e82a)

-Chat Admin Page
![WhatsApp Image 2025-12-09 at 8 48 21 PM](https://github.com/user-attachments/assets/7707fbdd-0789-4fea-af29-aa00373cd1c5)



## **Aktifkan atau jalankan server via terminal**
1. **Install dependencies backend:**
   ```bash
   cd backend
   npm install
   ```

2. **Jalankan backend server:**
   ```bash
   node server.js
   ```

3. **Di terminal baru, install dependencies frontend:**
   ```bash
   cd booking-frontend
   npm install
   ```

4. **Jalankan frontend:**
   ```bash
   npm start
   ```

Tunggu browser membuka otomatis atau pakai http://localhost:3000

## **Cara Menggunakan Fitur Chat**

### Untuk User:
1. Login ke akun Anda
2. Buat booking lapangan atau buka halaman **Profile**
3. Di bagian "Riwayat Booking", klik tombol **💬 Chat** pada booking yang ingin ditanyakan
4. Kirim pesan ke admin - admin akan menerima notifikasi real-time!

### Untuk Admin:
1. Login dengan akun admin
2. Klik menu **💬 Chat** di navigation bar
3. Lihat daftar semua chat dari user (dengan notifikasi pesan belum dibaca)
4. Pilih chat dan balas pesan user secara real-time
5. Semua chat otomatis tersimpan di database

## **Teknologi yang Digunakan**

### Frontend:
- React.js
- React Router DOM
- Socket.IO Client (untuk real-time chat)
- Axios (HTTP requests)

### Backend:
- Node.js & Express.js
- Socket.IO (WebSocket real-time)
- Supabase (PostgreSQL database)
- Bcrypt (password hashing)
- JWT (authentication)
- Mayar.id API (payment gateway)

### DevOps & CI/CD:
- GitHub Actions (Automated CI/CD)
- Automated Testing & Build Verification
- Security Scanning (npm audit)
- Code Quality Checks
- Pull Request Validation
- Deployment Automation (Ready for Vercel/Railway/Azure)

## 🚀 **CI/CD Implementation**

Project ini sudah dilengkapi dengan **GitHub Actions workflows** untuk otomasi testing, building, dan deployment!

### ✅ **Workflows yang Tersedia:**

1. **Main CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
   - ✅ Automated testing untuk backend & frontend
   - ✅ Build verification
   - ✅ Security audit (npm audit)
   - ✅ Code linting & quality checks
   - 🔄 Trigger: Push ke `main`/`develop` atau Pull Request

2. **Pull Request Checks** (`.github/workflows/pr-checks.yml`)
   - ✅ Validate PR title (Conventional Commits)
   - ✅ Check merge conflicts
   - ✅ Run all tests before merge
   - ✅ Auto-comment di PR dengan status

3. **Security Scanning** (`.github/workflows/security.yml`)
   - 🔍 Dependency vulnerability scan
   - 🔍 Check for exposed secrets
   - 📊 Generate security reports
   - ⏰ Scheduled: Setiap Senin jam 9 pagi

4. **Deployment** (`.github/workflows/deploy.yml`)
   - 🚀 Auto-deploy ke production (template ready)
   - 🎯 Support: Vercel, Netlify, Railway, Heroku, Azure

### 📖 **Dokumentasi Lengkap:**
Lihat **[CI-CD-GUIDE.md](./CI-CD-GUIDE.md)** untuk:
- Setup instructions lengkap
- Deployment configuration
- Branch protection setup
- Troubleshooting guide
- Best practices

### 🎯 **Status CI/CD:**
![Status](https://img.shields.io/badge/CI%2FCD-Active-brightgreen)
![Build](https://img.shields.io/badge/Build-Passing-success)
![Security](https://img.shields.io/badge/Security-Scanning-blue)

### 🔧 **Quick Start CI/CD:**
```bash
# 1. Push workflows ke GitHub
git add .
git commit -m "feat: add CI/CD workflows"
git push origin main

# 2. Lihat status di GitHub Actions tab
# 3. Configure deployment secrets (optional)
# 4. Enable branch protection (recommended)
```



