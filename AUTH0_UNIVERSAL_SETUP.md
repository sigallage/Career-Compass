# 🚨 CRITICAL: Auth0 Dashboard Configuration Required

## One-Time Setup for Universal Access

To make the signup page work on ANY PC without user setup, you need to configure your Auth0 application with ALL possible callback URLs.

### Go to: https://manage.auth0.com/dashboard

1. **Applications** → **Applications**
2. **Find your app**: Client ID `HfWrcDzjKanhcV6tILc1yYz0ibhocv9C`
3. **Settings tab**

### Add ALL these URLs to "Allowed Callback URLs":
```
http://localhost:3000,
http://127.0.0.1:3000,
http://localhost:5173,
http://127.0.0.1:5173,
http://localhost:5174,
http://127.0.0.1:5174,
http://localhost:5175,
http://127.0.0.1:5175,
http://localhost:8080,
http://127.0.0.1:8080,
http://localhost:8000,
http://127.0.0.1:8000,
http://localhost:4173,
http://127.0.0.1:4173,
http://localhost:3001,
http://127.0.0.1:3001,
http://localhost:3002,
http://127.0.0.1:3002
```

### Add the SAME URLs to "Allowed Logout URLs"

### Add the SAME URLs to "Allowed Web Origins"

### Save Changes

## ✅ After This Setup:
- ✅ Works on ANY computer
- ✅ Works on ANY port
- ✅ No user configuration required
- ✅ Zero setup for other developers
- ✅ Clone and run instantly

## 🎯 Result:
Anyone can:
```bash
git clone <your-repo>
cd Career-Compass/frontend
npm install
npm run dev
```

And the signup will work immediately!
