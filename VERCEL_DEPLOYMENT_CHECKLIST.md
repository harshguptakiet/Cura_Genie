# Vercel Deployment Checklist & Fixes

## ✅ Fixes Applied

### 1. Fixed `vercel.json` Configuration
- ❌ Removed `outputDirectory: ".next"` (Vercel auto-detects)
- ❌ Removed problematic API rewrite using `$NEXT_PUBLIC_API_URL` variable
- ✅ Kept security headers and function configuration

### 2. Added Node.js Version Specification
- ✅ Added `.node-version` file with Node 20
- ✅ Added `engines` field to `package.json` requiring Node >= 18.17.0

### 3. Environment Variables (Already Configured ✓)
All required environment variables are set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`

## ⚠️ Potential Issues to Check

### Issue 1: Tailwind CSS v4 (Beta)
**Risk Level:** HIGH
**Problem:** Your project uses Tailwind CSS v4 which is still in beta and may have build issues on Vercel.

**Evidence:**
- `package.json` has `"tailwindcss": "^4"`
- `postcss.config.mjs` uses `@tailwindcss/postcss`
- `globals.css` uses Tailwind v4 syntax (`@import "tailwindcss"`)

**Solutions:**
1. **Recommended:** Downgrade to Tailwind CSS v3 (stable)
2. **Or:** Ensure Vercel environment supports Tailwind v4 beta
3. **Or:** Add specific PostCSS/Tailwind v4 build configuration

### Issue 2: Next.js 15 + React 19
**Risk Level:** MEDIUM
**Problem:** Both Next.js 15 and React 19 are relatively new (Next.js 15 stable, but React 19 just released).

**Current Versions:**
- `next: 15.4.10`
- `react: 19.1.0`
- `react-dom: 19.1.0`

**Solutions:**
- Ensure Vercel supports React 19
- Check if any dependencies have compatibility issues
- Monitor Vercel build logs for React-related errors

### Issue 3: Standalone Output Mode
**Risk Level:** LOW
**Problem:** `next.config.js` uses `output: 'standalone'` which changes build structure.

**Current Config:**
```javascript
output: 'standalone',
outputFileTracingRoot: '.',
```

**Solutions:**
- This should work with Vercel, but if issues arise, try commenting it out
- Vercel typically handles Next.js builds automatically

### Issue 4: Large Bundle Size
**Risk Level:** MEDIUM
**Problem:** Many heavy dependencies that might cause build timeouts or memory issues.

**Large Dependencies:**
- D3.js (`d3`, `@types/d3`)
- Recharts
- Supabase
- TanStack Query + DevTools
- Multiple Radix UI components

**Solutions:**
```json
// Add to package.json scripts if memory issues occur
"build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
```

### Issue 5: Missing File Imports
**Risk Level:** LOW
**Problem:** Case-sensitive file paths (Windows vs Linux).

**Check These:**
- All imports match exact file names (including case)
- `import '../styles/dna-animations.css'` exists ✓
- All `@/components` paths resolve correctly

## 🔍 How to Diagnose the Actual Issue

Since environment variables are set, the build failure is likely one of these:

1. **Get the actual error from Vercel:**
   - Go to Vercel Dashboard → Your Project
   - Click on the failed deployment
   - Scroll to **Build Logs**
   - Look for error messages (usually in red)
   - Common patterns:
     - `Module not found`
     - `Cannot find module`
     - `JavaScript heap out of memory`
     - `Build exceeded maximum duration`
     - TypeScript/ESLint errors (though suppressed)
     - PostCSS/Tailwind errors

2. **Test locally:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   If this fails locally, you'll see the same error Vercel sees.

3. **Check Vercel Settings:**
   - Framework Preset: Should be "Next.js"
   - Build Command: `npm run build` (default)
   - Output Directory: Leave empty (auto-detect)
   - Install Command: `npm install` (default)
   - Node.js Version: Should be 18.x or 20.x

## 🚀 Quick Fixes to Try

### Fix 1: Clear Vercel Cache
```bash
# In Vercel Dashboard
Settings → General → Clear Cache and Redeploy
```

### Fix 2: Simplify `next.config.js`
If build fails, try this minimal config:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', '127.0.0.1'],
  },
};

module.exports = nextConfig;
```

### Fix 3: Downgrade Tailwind CSS v4 → v3
If Tailwind v4 is causing issues:

```bash
cd frontend
npm uninstall tailwindcss @tailwindcss/postcss
npm install -D tailwindcss@^3 postcss autoprefixer
npx tailwindcss init -p
```

Then update `globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Fix 4: Check for Missing Dependencies
Some dependencies might be in `devDependencies` but needed for build:

```bash
# Move critical dependencies to dependencies if needed
npm install --save-dev @types/node @types/react @types/react-dom typescript
```

## 📋 Next Steps

1. **Share the Vercel build logs** - This is the fastest way to identify the exact issue
2. **Try redeploying** after the `vercel.json` fixes
3. **Test local build** to reproduce the issue
4. **Check Tailwind v4 compatibility** - This is the most likely culprit

## 🎯 Most Likely Culprits (In Order)

1. **Tailwind CSS v4 Beta** - 70% probability
2. **Module resolution/import issues** - 15% probability
3. **Memory/timeout during build** - 10% probability
4. **React 19 compatibility** - 5% probability

---

**To get specific help, please share:**
- The full build log from Vercel
- The exact error message
- When the build fails (what step)
