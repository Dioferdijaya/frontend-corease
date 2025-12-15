# Profile Update Feature

## ✅ Fitur yang Sudah Ditambahkan:

### 1. **Desain Modern dengan Yellow Card**
- Split layout dengan kartu kuning di sebelah kiri (terinspirasi dari gambar referensi)
- Avatar besar dengan gradient orange-red
- Section form di sebelah kanan

### 2. **Edit Profile Fields**
User dapat mengedit:
- ✏️ **Name** - Nama lengkap
- ✏️ **Username** - Username unik
- ✏️ **Phone** - Nomor telepon
- ✏️ **Password** - Ganti password (dengan validasi password lama)

### 3. **Form Validation**
- Email tidak bisa diubah (readonly)
- Password lama wajib diisi jika ingin mengganti password
- Password baru harus sama dengan konfirmasi password

### 4. **Toggle Edit Mode**
- Tombol "EDIT PROFILE" untuk masuk mode edit
- Tombol "SAVE" dan "CANCEL" saat mode edit aktif
- Field disabled saat tidak dalam mode edit

## 📋 Setup Instructions:

### 1. **Update Database Supabase**
Jalankan SQL berikut di Supabase SQL Editor:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
```

Atau jalankan file: `backend/update-users-table.sql`

### 2. **Restart Backend Server**
```bash
cd backend
node server.js
```

### 3. **Test Fitur**
1. Login ke aplikasi
2. Klik "My Bookings" di navigation bar
3. Klik tombol "EDIT PROFILE"
4. Update data yang diinginkan
5. Klik "SAVE"

## 🎨 Design Features:

- **Yellow Gradient Card**: #ffd700 → #ffed4e
- **Avatar Gradient**: #ff9a56 → #ff6b6b
- **Primary Button**: #2c5530 (tema futsal)
- **Save Button**: #4ecdc4 (turquoise)
- **Smooth transitions** pada semua interactive elements

## 🔐 Security:

- Password di-hash menggunakan bcrypt
- Validasi password lama sebelum mengubah password
- Email tidak bisa diubah untuk keamanan
- LocalStorage di-update setelah profile berhasil diubah

## 📱 Responsive Design:

Layout akan menyesuaikan untuk mobile devices dengan grid yang berubah menjadi single column.
