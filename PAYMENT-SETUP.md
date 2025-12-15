# 💰 Panduan Setup Pembayaran Mayar.id

## 📋 Daftar Isi
1. [Pendaftaran Akun Mayar.id](#1-pendaftaran-akun-mayarid)
2. [Mendapatkan API Key](#2-mendapatkan-api-key)
3. [Konfigurasi Backend](#3-konfigurasi-backend)
4. [Update Database](#4-update-database)
5. [Testing Pembayaran](#5-testing-pembayaran)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Pendaftaran Akun Mayar.id

### Langkah-langkah:
1. Kunjungi [https://mayar.id](https://mayar.id)
2. Klik tombol **"Daftar"** atau **"Sign Up"**
3. Isi form pendaftaran:
   - Nama lengkap
   - Email aktif
   - Password
   - Nomor telepon
4. Verifikasi email Anda
5. Login ke dashboard Mayar.id

---

## 2. Mendapatkan API Key

### Langkah-langkah:
1. Login ke dashboard Mayar.id: [https://mayar.id/dashboard](https://mayar.id/dashboard)
2. Navigasi ke menu **Settings** atau **Pengaturan**
3. Klik submenu **API Keys** atau **Developer**
4. Anda akan melihat dua jenis key:
   - **Test API Key** (untuk development/testing)
   - **Live API Key** (untuk production)
5. Copy **Test API Key** untuk development
6. Simpan key ini dengan aman

### Contoh API Key:
```
Test: test_sk_xxxxxxxxxxxxxxxxxxxx
Live: live_sk_xxxxxxxxxxxxxxxxxxxx
```

⚠️ **PENTING**: Jangan pernah commit API Key ke repository Git!

---

## 3. Konfigurasi Backend

### A. Install Dependencies
```bash
cd backend
npm install
```

### B. Setup Environment Variables

1. Copy file `.env.example` menjadi `.env`:
```bash
copy .env.example .env
```

2. Edit file `.env` dan tambahkan Mayar.id API Key:

```env
# Supabase Configuration (sudah ada)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# JWT Configuration (sudah ada)
JWT_SECRET=secretkey

# Server Configuration
PORT=5000

# ========== MAYAR.ID CONFIGURATION ==========
# Paste API Key dari dashboard Mayar.id di sini
MAYAR_API_KEY=test_sk_xxxxxxxxxxxxxxxxxxxx

# URL Frontend untuk redirect setelah pembayaran
FRONTEND_URL=http://localhost:3000

# URL Backend untuk callback
BACKEND_URL=http://localhost:5000
```

### C. Struktur Endpoint yang Dibuat

Backend sudah dilengkapi dengan 3 endpoint pembayaran:

1. **POST** `/payment/create` - Membuat payment link
   - Input: `booking_id`, `user_email`, `user_name`
   - Output: `payment_url`, `payment_id`

2. **POST** `/payment/callback` - Menerima notifikasi dari Mayar.id
   - Otomatis update status pembayaran

3. **GET** `/payment/status/:booking_id` - Cek status pembayaran
   - Output: `payment_status`, `payment_url`, `total_price`

---

## 4. Update Database

### Jalankan SQL Script di Supabase

1. Login ke dashboard Supabase
2. Buka **SQL Editor**
3. Copy dan jalankan script dari file `update-bookings-payment.sql`:

```sql
-- Update tabel bookings untuk menambahkan kolom pembayaran
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'unpaid',
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_url TEXT,
ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP;

-- Menambahkan index untuk performa lebih baik
CREATE INDEX IF NOT EXISTS idx_bookings_payment_id ON bookings(payment_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
```

### Status Pembayaran yang Digunakan:
- `unpaid` - Belum bayar
- `pending` - Menunggu pembayaran
- `paid` - Sudah bayar
- `expired` - Pembayaran kadaluarsa
- `failed` - Pembayaran gagal

---

## 5. Testing Pembayaran

### A. Jalankan Backend
```bash
cd backend
npm start
```

Server akan berjalan di `http://localhost:5000`

### B. Jalankan Frontend
```bash
cd booking-frontend
npm start
```

Frontend akan berjalan di `http://localhost:3000`

### C. Flow Pembayaran

1. **User membuat booking** di halaman utama
2. **Lihat booking** di halaman Profile
3. **Klik tombol "Bayar Sekarang"**
4. User akan redirect ke halaman pembayaran Mayar.id
5. **Lakukan pembayaran test**:
   - Gunakan metode pembayaran test yang disediakan Mayar.id
   - Untuk testing, biasanya ada opsi "Test Payment"
6. Setelah pembayaran berhasil, user akan redirect ke halaman success
7. Status booking otomatis berubah menjadi "confirmed" dan payment_status "paid"

### D. Callback Testing

Mayar.id akan mengirim callback ke endpoint:
```
http://localhost:5000/payment/callback
```

⚠️ **Catatan**: Untuk development local, Mayar.id tidak bisa mengirim callback ke localhost. Anda memerlukan:
- **Ngrok** untuk expose localhost ke internet
- Atau deploy ke server dengan domain publik

### Setup Ngrok (Opsional untuk testing callback):
```bash
# Install ngrok
npm install -g ngrok

# Expose port 5000
ngrok http 5000
```

Kemudian update `BACKEND_URL` di `.env` dengan URL ngrok:
```env
BACKEND_URL=https://xxxx-xx-xxx-xxx-xx.ngrok.io
```

---

## 6. Troubleshooting

### ❌ Error: "Gagal membuat payment link"

**Solusi**:
1. Cek apakah API Key sudah benar di `.env`
2. Pastikan menggunakan `test_sk_` untuk development
3. Cek koneksi internet
4. Lihat console log di backend untuk detail error

### ❌ Callback tidak diterima

**Solusi**:
1. Pastikan menggunakan ngrok atau domain publik
2. Update URL callback di dashboard Mayar.id (jika tersedia)
3. Cek firewall tidak memblokir incoming request

### ❌ Status pembayaran tidak update

**Solusi**:
1. Cek endpoint `/payment/callback` berfungsi dengan baik
2. Periksa log di console backend
3. Manual update status via endpoint `/payment/status/:booking_id`

### ❌ Total harga tidak sesuai

**Solusi**:
1. Cek kolom `price_per_hour` di tabel `fields`
2. Pastikan perhitungan durasi booking benar
3. Mayar.id menggunakan integer (Rupiah), bukan desimal

---

## 📝 Checklist Setup

- [ ] Daftar akun Mayar.id
- [ ] Dapatkan Test API Key
- [ ] Copy `.env.example` menjadi `.env`
- [ ] Masukkan API Key ke `.env`
- [ ] Install dependencies: `npm install`
- [ ] Jalankan SQL script untuk update database
- [ ] Jalankan backend: `npm start`
- [ ] Jalankan frontend: `npm start`
- [ ] Test membuat booking
- [ ] Test pembayaran
- [ ] Verifikasi status berubah menjadi "paid"

---

## 🚀 Production Deployment

Untuk production:

1. Ganti `MAYAR_API_KEY` dengan **Live API Key**
2. Update `FRONTEND_URL` dengan domain production Anda
3. Update `BACKEND_URL` dengan URL backend production
4. Setup SSL/HTTPS untuk backend (wajib untuk callback)
5. Daftarkan callback URL di dashboard Mayar.id

---

## 📞 Support

Jika ada masalah:
- Dokumentasi Mayar.id: [https://docs.mayar.id](https://docs.mayar.id)
- Support Mayar.id: support@mayar.id
- Check file `server.js` untuk melihat implementasi endpoint

---

**Selamat mencoba! 🎉**
