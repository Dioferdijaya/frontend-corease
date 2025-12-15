# 🚀 CI/CD Quick Reference - Courstease Project

## 📌 Commit Message Format (WAJIB!)
```bash
# Format: <type>: <description>
feat: add new feature
fix: resolve bug
docs: update documentation
refactor: improve code
test: add tests
chore: update dependencies
perf: improve performance
style: format code

# Contoh:
git commit -m "feat: add admin dashboard"
git commit -m "fix: resolve socket connection timeout"
git commit -m "docs: update API documentation"
```

## 🔄 Workflow Triggers

| Workflow | Trigger | Deskripsi |
|----------|---------|-----------|
| **CI/CD Pipeline** | Push ke `main`/`develop` | Test & Build otomatis |
| **PR Checks** | Buat/Update PR | Validasi sebelum merge |
| **Security Scan** | Senin 9 AM / Push | Security audit |
| **Deploy** | Push ke `main` | Auto-deploy production |

## ✅ Status Checks yang Harus Pass

Sebelum merge PR ke `main`, pastikan semua ini HIJAU:
- ✅ Backend CI (install, audit, build)
- ✅ Frontend CI (install, test, build)
- ✅ Code Quality Check
- ✅ PR Title Format Valid
- ✅ No Merge Conflicts

## 🔧 Commands

### Local Testing (sebelum push):
```bash
# Backend
cd backend
npm install
npm audit
npm test    # jika ada tests

# Frontend
cd booking-frontend
npm install
npm test
npm run build
```

### Push dengan CI/CD:
```bash
# 1. Commit dengan format yang benar
git add .
git commit -m "feat: your feature description"

# 2. Push ke branch
git push origin your-branch-name

# 3. Buat PR di GitHub
# 4. Tunggu CI checks pass (hijau semua)
# 5. Merge!
```

## 🚨 Troubleshooting

### ❌ CI Failed - Backend
**Check:** package.json scripts, dependencies, node version
```bash
cd backend
npm ci
npm audit fix
```

### ❌ CI Failed - Frontend
**Check:** Test failures, build errors
```bash
cd booking-frontend
npm ci
npm test -- --passWithNoTests
npm run build
```

### ❌ PR Title Invalid
**Format harus:** `type: description`
```bash
# ❌ Wrong:
git commit -m "updated files"

# ✅ Correct:
git commit -m "feat: add payment feature"
```

### ❌ Security Audit Failed
**Fix vulnerabilities:**
```bash
npm audit fix
npm audit fix --force  # jika masih error
```

## 🎯 Branch Strategy

```
main (protected)
  ↑
  PR + CI checks
  ↑
develop
  ↑
feature/*, bugfix/*
```

### Workflow:
1. Buat branch dari `develop`
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/nama-fitur
   ```

2. Develop & commit
   ```bash
   git add .
   git commit -m "feat: description"
   ```

3. Push & create PR
   ```bash
   git push origin feature/nama-fitur
   # Buka GitHub → Create Pull Request
   ```

4. Tunggu CI checks pass

5. Request review & merge

## 📊 Monitoring

### Lihat Status CI/CD:
1. Buka GitHub repository
2. Klik tab **Actions**
3. Lihat workflow runs & logs

### Check Build Status:
- 🟢 Green = Success
- 🟡 Yellow = In Progress
- 🔴 Red = Failed (lihat logs)

## 🔐 Secrets (untuk Deployment)

**Lokasi:** GitHub → Settings → Secrets and variables → Actions

**Required Secrets:**
```
# Vercel
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID

# Netlify
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID

# API
API_URL=https://your-backend.com
```

## 🎉 Cheat Sheet

```bash
# Check status before push
npm test && npm run build

# Commit dengan format benar
git commit -m "feat: add feature X"

# Push & trigger CI
git push origin your-branch

# View CI logs
# → GitHub Actions tab

# Fix audit issues
npm audit fix

# Force CI re-run
# → GitHub Actions → Re-run jobs
```

## 📚 Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [CI-CD-GUIDE.md](./CI-CD-GUIDE.md) - Full documentation

---

**⚡ Pro Tips:**
- Selalu test locally sebelum push
- Commit messages harus jelas & descriptive
- Review CI logs kalau failed
- Keep PRs small & focused
- Update branch sebelum merge
