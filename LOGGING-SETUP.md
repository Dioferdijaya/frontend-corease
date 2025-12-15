# 📊 Logging Implementation - Grafana Loki

## ✅ **WHAT WAS IMPLEMENTED**

Project ini sekarang menggunakan **Winston + Grafana Loki** untuk comprehensive logging system.

---

## 🎯 **STACK YANG DIGUNAKAN:**

| Component | Purpose | Status |
|-----------|---------|--------|
| **Winston** | Application logger (Node.js) | ✅ Implemented |
| **Winston-Loki** | Transport logs ke Grafana Cloud | ✅ Implemented |
| **Morgan** | HTTP request logging | ✅ Implemented |
| **Grafana Cloud** | Log visualization & querying | ⏳ Setup required |

---

## 📁 **FILES CREATED:**

```
backend/
├─ logger.js                          # Main logger configuration
├─ middleware/
│  └─ requestLogger.js                # HTTP request logging middleware
└─ logs/
   ├─ combined.log                    # All logs
   ├─ error.log                       # Error logs only
   └─ .gitkeep                        # Keep logs directory in git
```

---

## 🚀 **SETUP GRAFANA CLOUD (FREE)**

### **Step 1: Create Free Account**

1. **Sign up:** https://grafana.com/auth/sign-up/create-user
2. **Email:** Gunakan email Anda
3. **Stack name:** coursease-logs (atau nama project Anda)
4. **Plan:** Pilih **Free** (14-day retention, 50GB logs/month)

### **Step 2: Get Loki Credentials**

1. Login ke Grafana Cloud
2. Klik **My Account** (profil icon)
3. Pilih **Stack** → **Details**
4. Scroll ke **Loki** section
5. Copy:
   - **Loki URL** (e.g., https://logs-prod-us-central1.grafana.net)
   - **Username** (User ID number)
   - **Generate API Key** → Copy password

### **Step 3: Configure Environment Variables**

Update file `.env` di backend:

```env
# Logging (Grafana Loki)
LOG_LEVEL=info
LOKI_HOST=https://logs-prod-us-central1.grafana.net
LOKI_USERNAME=123456
LOKI_PASSWORD=glc_eyJxxxxxxxxxxxxxx
```

### **Step 4: Test Logging**

```bash
cd backend
node server.js
```

**Output yang akan muncul:**
```
23:30:15 info: ✅ Loki transport enabled
23:30:15 info: 🚀 Supabase client initialized
23:30:15 info: 🚀 Server running on port 5000 {"port":5000,"environment":"development"}
```

---

## 📊 **LOGGING FEATURES:**

### **1. Application Logs**

Logger tersedia di seluruh aplikasi:

```javascript
const logger = require('./logger');

// Log levels
logger.error('Error message', { error: err.message });
logger.warn('Warning message');
logger.info('Info message', { userId: 123 });
logger.debug('Debug message');
```

### **2. HTTP Request Logs**

Setiap HTTP request otomatis di-log:

```
23:30:20 info: Incoming POST request {"method":"POST","url":"/login","ip":"::1","userAgent":"Mozilla/5.0...","requestId":"abc123"}
23:30:21 info: POST /login 200 {"method":"POST","url":"/login","statusCode":200,"duration":"125ms","requestId":"abc123"}
```

### **3. Socket.IO Logs**

Socket connections dan messages di-log:

```
23:31:05 info: Socket connected {"socketId":"gxZfn6_nOoGEDiRMAAAC"}
23:31:06 info: User joined chat room {"bookingId":"13","socketId":"gxZfn6_nOoGEDiRMAAAC"}
23:31:10 info: Message sent {"bookingId":"13","senderId":"5","messageId":"42"}
```

### **4. Payment Logs**

Payment transactions di-log:

```
23:32:15 info: Payment successful {"bookingId":"13","paymentStatus":"paid"}
```

### **5. Error Logs**

Semua errors otomatis di-log dengan stack trace:

```
23:33:20 error: Database connection failed {"error":"Connection timeout","stack":"Error: Connection timeout\n    at ..."}
```

---

## 📈 **VIEWING LOGS IN GRAFANA:**

### **Step 1: Access Grafana**

1. Login ke: https://yourstack.grafana.net
2. Klik **Explore** (compass icon)
3. Select data source: **Loki**

### **Step 2: Query Logs**

**Basic queries:**

```logql
# All logs from coursease-backend
{app="coursease-backend"}

# Only error logs
{app="coursease-backend"} |= "error"

# Logs from last 5 minutes
{app="coursease-backend"} [5m]

# Filter by environment
{app="coursease-backend", environment="production"}

# Search for specific text
{app="coursease-backend"} |= "payment"

# Filter by request method
{app="coursease-backend"} | json | method="POST"
```

### **Step 3: Create Dashboards**

1. Klik **Dashboards** → **New** → **New Dashboard**
2. Add panel → Select **Loki** as data source
3. Configure query dan visualization
4. Save dashboard

**Common dashboard panels:**
- Request rate (requests per second)
- Error rate (errors per minute)
- Response time (average response time)
- Top endpoints (most accessed URLs)
- User activity (socket connections)

---

## 🔧 **LOG LEVELS:**

| Level | When to Use | Example |
|-------|-------------|---------|
| **error** | Application errors, exceptions | Database connection failed |
| **warn** | Warning conditions | API rate limit approaching |
| **info** | General information | User logged in, payment processed |
| **debug** | Debugging information | Variable values, function calls |

**Change log level via environment:**
```env
LOG_LEVEL=debug    # Development (verbose)
LOG_LEVEL=info     # Production (default)
LOG_LEVEL=error    # Production (minimal)
```

---

## 📂 **LOG FILES:**

Logs disimpan di 2 tempat:

### **1. Local Files** (backend/logs/)
- **combined.log** - All logs (max 5MB, keep 5 files)
- **error.log** - Errors only (max 5MB, keep 5 files)

### **2. Grafana Loki** (Cloud)
- Centralized log aggregation
- 14-day retention (Free tier)
- Searchable & queryable
- Real-time streaming

---

## 🎨 **LOG FORMAT:**

### **Development (Console):**
```
23:30:15 info: 🚀 Server running on port 5000
23:30:20 error: Database error: Connection timeout
```

### **Production (JSON):**
```json
{
  "timestamp": "2025-12-09T23:30:15.123Z",
  "level": "info",
  "message": "Server running on port 5000",
  "service": "coursease-backend",
  "environment": "production",
  "port": 5000
}
```

---

## 🔍 **TROUBLESHOOTING:**

### **Loki not receiving logs?**

1. **Check credentials:**
   ```bash
   echo $LOKI_HOST
   echo $LOKI_USERNAME
   echo $LOKI_PASSWORD
   ```

2. **Check console output:**
   ```
   ✅ Loki transport enabled  → Good!
   ⚠️ Loki transport disabled → Missing credentials
   ```

3. **Test connection:**
   ```bash
   curl -u $LOKI_USERNAME:$LOKI_PASSWORD $LOKI_HOST/loki/api/v1/labels
   ```

### **Logs not showing in file?**

1. **Check logs directory exists:**
   ```bash
   ls backend/logs/
   ```

2. **Check file permissions:**
   ```bash
   chmod 755 backend/logs/
   ```

3. **Check log level:**
   ```env
   LOG_LEVEL=debug   # Show all logs
   ```

---

## 📊 **MONITORING BEST PRACTICES:**

### **1. Set up Alerts**

Create alerts in Grafana for:
- Error rate > 10 errors/minute
- Response time > 2 seconds
- Payment failures
- Socket connection drops

### **2. Create Dashboards**

Essential dashboards:
- **System Health** - Server uptime, memory, CPU
- **API Performance** - Response times, request rates
- **User Activity** - Logins, bookings, chats
- **Errors** - Error trends, stack traces

### **3. Regular Review**

- Check logs daily for errors
- Review slow endpoints weekly
- Analyze user patterns monthly
- Optimize based on insights

---

## 🎯 **NEXT STEPS:**

1. ✅ **Setup Grafana Cloud account** (FREE)
2. ✅ **Add credentials to .env**
3. ✅ **Restart server**
4. ✅ **View logs in Grafana Explore**
5. ⏳ **Create dashboards**
6. ⏳ **Set up alerts**

---

## 📚 **RESOURCES:**

- **Grafana Cloud:** https://grafana.com/products/cloud/
- **Loki Docs:** https://grafana.com/docs/loki/
- **Winston Docs:** https://github.com/winstonjs/winston
- **LogQL Query Language:** https://grafana.com/docs/loki/latest/logql/

---

## ✨ **EXAMPLE QUERIES FOR YOUR PROJECT:**

```logql
# All booking creations
{app="coursease-backend"} |= "booking" |= "created"

# Payment transactions
{app="coursease-backend"} |= "payment"

# User logins
{app="coursease-backend"} |= "login"

# Chat messages
{app="coursease-backend"} |= "message sent"

# Errors in last hour
{app="coursease-backend"} |= "error" [1h]

# Response time > 1 second
{app="coursease-backend"} | json | duration > "1000ms"
```

---

**🎉 Logging system siap digunakan! Setup Grafana Cloud untuk visualisasi!**
