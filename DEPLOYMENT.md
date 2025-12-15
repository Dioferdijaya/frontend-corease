# Vercel Deployment - Frontend Only

## 🚀 **Deploy Frontend ke Vercel:**

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Login ke Vercel**
```bash
vercel login
```

### **Step 3: Deploy**
```bash
vercel
```

Ikuti prompt:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → coursease-frontend
- **Directory?** → `./` (root)
- **Override settings?** → Yes
  - **Build Command:** `cd booking-frontend && npm install && npm run build`
  - **Output Directory:** `booking-frontend/build`
  - **Install Command:** `npm install`

### **Step 4: Production Deploy**
```bash
vercel --prod
```

---

## 🌐 **Atau Deploy via Website (Lebih Mudah):**

1. **Buka** https://vercel.com
2. **Sign up** dengan GitHub
3. **Import Git Repository**
4. **Pilih repo:** Coursease-Boking-Lapangan-Futsal
5. **Framework Preset:** Create React App
6. **Root Directory:** booking-frontend
7. **Build Command:** `npm run build`
8. **Output Directory:** `build`
9. **Environment Variables:** (kosongkan dulu)
10. **Deploy!**

---

## 🔧 **Update Frontend API URL:**

Setelah deploy, update `booking-frontend/src/App.js` atau file config dengan backend URL:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend.railway.app';
```

Tambahkan di Vercel Environment Variables:
```
REACT_APP_API_URL=https://your-backend.railway.app
```

---

## 🚂 **Deploy Backend ke Railway (GRATIS):**

### **Step 1: Create Railway Account**
1. Buka https://railway.app
2. Sign up dengan GitHub

### **Step 2: New Project**
1. Klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Pilih **Coursease-Boking-Lapangan-Futsal**
4. Railway auto-detect Node.js

### **Step 3: Environment Variables**
Tambahkan semua dari `.env`:
```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
JWT_SECRET=...
PORT=5000
MAYAR_API_KEY=...
FRONTEND_URL=https://your-frontend.vercel.app
LOKI_HOST=...
LOKI_USERNAME=...
LOKI_PASSWORD=...
```

### **Step 4: Deploy**
Railway auto-deploy! Get URL: `https://your-app.up.railway.app`

---

## 📝 **Checklist Deploy:**

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] Update CORS di backend dengan Frontend URL Vercel
- [ ] Update FRONTEND_URL di backend .env
- [ ] Update API_URL di frontend .env
- [ ] Test payment flow
- [ ] Test Socket.IO chat
- [ ] Monitor logs di Railway + Grafana

---

## 🆓 **Free Tier Limits:**

| Service | Free Tier |
|---------|-----------|
| **Vercel** | Unlimited bandwidth, 100 GB/month |
| **Railway** | $5 credit/month (~500 hours) |
| **Render** | 750 hours/month |

---

## ⚡ **Quick Deploy Commands:**

```bash
# Frontend to Vercel
cd booking-frontend
vercel --prod

# Backend stays local or deploy to Railway via web UI
```

---

**Mau saya bantu deploy sekarang? Pilih:**
1. Deploy frontend ke Vercel dulu
2. Deploy backend ke Railway dulu
3. Deploy keduanya sekaligus
