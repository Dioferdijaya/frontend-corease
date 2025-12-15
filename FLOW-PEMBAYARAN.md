# 🔄 Flow Pembayaran Coursease (UPDATED)

## ❌ Masalah Sebelumnya:
- User booking → status "pending" → admin konfirmasi → langsung "confirmed" (PADAHAL BELUM BAYAR!)
- Admin bisa konfirmasi booking sebelum user bayar
- User tidak melakukan transaksi tapi sudah dianggap sukses

## ✅ Flow yang Benar (SEKARANG):

### 1️⃣ User Melakukan Booking
```
User pilih lapangan → Isi form booking → Lihat total harga → Klik "Lanjut ke Pembayaran"
```
**Status Booking:** `waiting_payment`  
**Status Pembayaran:** `unpaid`

### 2️⃣ User Melakukan Pembayaran
```
User klik "Bayar Sekarang" → Redirect ke Mayar.id → Lakukan pembayaran
```
**Status Booking:** `waiting_payment`  
**Status Pembayaran:** `pending` (sedang diproses)

### 3️⃣ Pembayaran Berhasil (Callback dari Mayar.id)
```
Mayar.id kirim callback → Backend update status otomatis
```
**Status Booking:** `confirmed` ✅ (OTOMATIS)  
**Status Pembayaran:** `paid` ✅ (OTOMATIS)  
**Waktu Bayar:** Tercatat di database

### 4️⃣ Admin Melihat Booking
```
Admin login → Lihat semua booking → Filter yang sudah dibayar
```
**Yang Ditampilkan:**
- ✅ Booking yang sudah dibayar → Admin bisa "Tandai Selesai" atau "Batalkan"
- ⚠️ Booking belum dibayar → Tampil peringatan "Menunggu pembayaran dari user"

### 5️⃣ Admin Update Status (HANYA YANG SUDAH BAYAR)
```
Booking sudah paid → Admin bisa update status:
- "Completed" (selesai)
- "Cancelled" (dibatalkan)
```

## 🚫 Validasi Penting:

### Backend Validation:
```javascript
// Admin TIDAK BISA konfirmasi jika belum bayar
if (booking.payment_status !== 'paid') {
  return res.status(400).json({ 
    message: 'Booking belum dibayar! User harus membayar terlebih dahulu.' 
  });
}
```

## 📊 Status yang Digunakan:

### Status Booking:
- `waiting_payment` - Menunggu pembayaran user
- `confirmed` - Sudah dibayar & dikonfirmasi
- `completed` - Booking selesai
- `cancelled` - Dibatalkan

### Status Pembayaran:
- `unpaid` - Belum bayar
- `pending` - Sedang proses pembayaran
- `paid` - Sudah lunas
- `expired` - Pembayaran kadaluarsa
- `failed` - Pembayaran gagal

## 🎯 Kelebihan Flow Baru:

✅ User HARUS bayar dulu sebelum booking dikonfirmasi  
✅ Admin tidak bisa konfirmasi booking yang belum dibayar  
✅ Status otomatis update setelah pembayaran berhasil  
✅ Tidak ada booking "sukses" tanpa pembayaran  
✅ Admin hanya mengelola booking yang sudah valid (sudah dibayar)  

## 🔍 Tampilan untuk User:

### Di Halaman Profile:
```
╔════════════════════════════════════════╗
║ Lapangan A (Indoor)                    ║
║ 27 November 2025 | 08:00 - 10:00      ║
║ Rp 200.000                             ║
║                                        ║
║ Status: Menunggu Pembayaran            ║
║ [Bayar Sekarang]                       ║
╚════════════════════════════════════════╝
```

Setelah bayar:
```
╔════════════════════════════════════════╗
║ Lapangan A (Indoor)                    ║
║ 27 November 2025 | 08:00 - 10:00      ║
║ Rp 200.000                             ║
║                                        ║
║ Status: Terkonfirmasi                  ║
║ Pembayaran: ✓ Lunas                    ║
╚════════════════════════════════════════╝
```

## 🔍 Tampilan untuk Admin:

### Booking Belum Dibayar:
```
╔════════════════════════════════════════╗
║ Lapangan A (Indoor)                    ║
║ User: John Doe (john@email.com)        ║
║ Pembayaran: ✗ Belum Bayar              ║
║ Status Booking: Menunggu Pembayaran    ║
║                                        ║
║ ⚠️ Menunggu pembayaran dari user       ║
╚════════════════════════════════════════╝
```

### Booking Sudah Dibayar:
```
╔════════════════════════════════════════╗
║ Lapangan A (Indoor)                    ║
║ User: John Doe (john@email.com)        ║
║ Pembayaran: ✓ Lunas                    ║
║ Status Booking: Terkonfirmasi          ║
║                                        ║
║ [Tandai Selesai] [Batalkan]            ║
╚════════════════════════════════════════╝
```

## 📝 Testing Checklist:

- [ ] User buat booking → Status awal "waiting_payment"
- [ ] User klik "Bayar Sekarang" → Redirect ke Mayar.id
- [ ] Setelah bayar → Status otomatis "confirmed" & "paid"
- [ ] Admin coba konfirmasi booking belum bayar → Muncul error
- [ ] Admin bisa update status hanya untuk booking yang sudah bayar
- [ ] User batal bayar → Status tetap "waiting_payment" & "unpaid"

---

**Dengan flow ini, sistem pembayaran Anda sudah aman dan tidak ada lagi booking "sukses" tanpa pembayaran! 🎉**
