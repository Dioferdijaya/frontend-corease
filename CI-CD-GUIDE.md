# 🚀 CI/CD Implementation Guide - Courstease Project

## 📋 Apa itu CI/CD?

**CI (Continuous Integration)** adalah praktik otomatis untuk merge code, run tests, dan build aplikasi setiap kali ada perubahan code.

**CD (Continuous Deployment/Delivery)** adalah otomasi untuk deploy aplikasi ke production setelah lulus semua tests.

## ✅ CI/CD Workflows yang Sudah Disetup

### 1. **Main CI/CD Pipeline** (`ci-cd.yml`)
**Trigger:** Push ke branch `main` atau `develop`, atau saat ada Pull Request

**Jobs yang dijalankan:**
- ✅ **Backend CI:**
  - Install dependencies
  - Security audit (npm audit)
  - Code linting
  - Run tests (jika ada)
  - Build verification

- ✅ **Frontend CI:**
  - Install dependencies
  - Security audit
  - Code linting
  - Run tests
  - Build production bundle
  - Upload build artifacts

- ✅ **Code Quality Check:**
  - Validasi commit messages
  - Check file sizes
  - Code quality metrics

### 2. **Pull Request Checks** (`pr-checks.yml`)
**Trigger:** Saat ada Pull Request baru atau update

**Features:**
- ✅ Validate PR title (harus ikuti Conventional Commits)
- ✅ Check merge conflicts
- ✅ Run backend & frontend tests
- ✅ Auto-comment di PR dengan status checks

**PR Title Format:**
```
feat: add new feature
fix: resolve bug
docs: update documentation
refactor: improve code structure
test: add unit tests
chore: update dependencies
perf: improve performance
```

### 3. **Deployment Workflow** (`deploy.yml`)
**Trigger:** Push ke branch `main` atau manual trigger

**Status:** 🟡 Template (perlu dikonfigurasi)

**Supported Platforms:**
- Vercel (Frontend)
- Netlify (Frontend)
- Railway (Backend)
- Heroku (Backend)
- Azure (Full-stack)

### 4. **Security Scanning** (`security.yml`)
**Trigger:** 
- Setiap hari Senin jam 9 pagi (scheduled)
- Push ke main
- Manual trigger

**Checks:**
- 🔍 Dependency vulnerabilities (npm audit)
- 🔍 Exposed secrets in code
- 📊 Generate security report

## 🔧 Setup Instructions

### Step 1: Push ke GitHub
```bash
# Add semua files
git add .

# Commit dengan format conventional commits
git commit -m "feat: add CI/CD workflows with GitHub Actions"

# Push ke GitHub
git push origin main
```

### Step 2: Konfigurasi GitHub Secrets (Untuk Deployment)

Jika mau aktifkan auto-deployment, tambahkan secrets di GitHub:

1. Buka repository di GitHub
2. Settings → Secrets and variables → Actions
3. Tambahkan secrets berikut:

**Untuk Vercel:**
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

**Untuk Netlify:**
```
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
```

**API Configuration:**
```
API_URL=https://your-backend-url.com
```

### Step 3: Enable GitHub Actions

1. Buka repository di GitHub
2. Klik tab **Actions**
3. Actions akan otomatis aktif setelah push workflows

### Step 4: Aktifkan Branch Protection (Recommended)

1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. ✅ Require pull request reviews
4. ✅ Require status checks to pass (pilih CI jobs)
5. ✅ Require branches to be up to date
6. Save changes

## 📊 Monitoring CI/CD

### Melihat Status Workflows:
1. Buka GitHub repository
2. Klik tab **Actions**
3. Lihat history semua workflow runs

### Status Badge (Optional):
Tambahkan badge di README.md:
```markdown
![CI/CD](https://github.com/Dioferdijaya/Coursease-Boking-Lapangan-Futsal/workflows/CI%2FCD%20Pipeline/badge.svg)
```

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)
**Best for:** Quick setup, free tier

**Setup:**
```bash
# Frontend di Vercel
cd booking-frontend
npm install -g vercel
vercel login
vercel

# Backend di Railway
cd backend
npm install -g railway
railway login
railway init
railway up
```

### Option 2: Netlify (Frontend) + Heroku (Backend)
**Best for:** Traditional deployment

**Setup:**
```bash
# Frontend di Netlify
cd booking-frontend
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod

# Backend di Heroku
cd backend
heroku login
heroku create your-app-name
git push heroku main
```

### Option 3: Azure (Full-stack)
**Best for:** Enterprise, complete Azure ecosystem

**Setup:**
```bash
# Install Azure CLI
az login

# Frontend (Static Web App)
az staticwebapp create

# Backend (App Service)
az webapp up --name your-backend
```

## 📝 Workflow Customization

### Menambah Environment Variables:
Edit file workflow, tambahkan di section `env`:
```yaml
env:
  NODE_VERSION: '18.x'
  REACT_APP_API_URL: ${{ secrets.API_URL }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Menambah Job Baru:
```yaml
my-custom-job:
  name: My Custom Job
  runs-on: ubuntu-latest
  steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Run custom script
      run: echo "Hello from custom job"
```

### Mengubah Trigger:
```yaml
on:
  push:
    branches: [ main, develop, staging ]
    paths:
      - 'backend/**'
      - 'booking-frontend/**'
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
```

## 🐛 Troubleshooting

### ❌ Build Failed
**Check:**
1. Lihat error logs di Actions tab
2. Pastikan `package.json` scripts sudah benar
3. Cek dependency conflicts

### ❌ Tests Failed
**Fix:**
```bash
# Local testing dulu
npm test

# Jika no tests, update workflow:
npm test -- --passWithNoTests
```

### ❌ Deployment Failed
**Check:**
1. Verifikasi secrets sudah diset
2. Cek platform documentation
3. Review deployment logs

## 🎯 Best Practices

1. **Commit Messages:** Selalu pakai Conventional Commits
   ```
   feat: add user authentication
   fix: resolve socket connection issue
   docs: update API documentation
   ```

2. **Branch Strategy:**
   - `main` → Production (protected)
   - `develop` → Development (testing)
   - `feature/*` → New features
   - `bugfix/*` → Bug fixes

3. **Pull Requests:**
   - Selalu buat PR untuk merge ke main
   - Wait for CI checks to pass
   - Request code review

4. **Testing:**
   - Write tests untuk new features
   - Maintain test coverage
   - Run tests locally sebelum push

5. **Security:**
   - Never commit secrets/passwords
   - Use GitHub Secrets untuk sensitive data
   - Regular security audits

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Vercel Deployment](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/)

## 🎉 Status

✅ CI/CD workflows configured
✅ Automated testing enabled
✅ Build verification active
✅ Security scanning scheduled
🟡 Deployment ready (needs configuration)

**Next Steps:**
1. Push workflows ke GitHub
2. Verify workflows run successfully
3. Configure deployment platform
4. Enable branch protection
5. Setup monitoring & alerts
