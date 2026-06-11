# Vercel Build Fixes for CuraGenie

## Changes Made

### 1. Fixed vercel.json Configuration
- ✅ Removed `outputDirectory` (Vercel auto-detects Next.js builds)
- ✅ Removed problematic API rewrite with `$NEXT_PUBLIC_API_URL` variable

### 2. Environment Variables (Already Set ✓)
All required environment variables are configured in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`

## Common Vercel Build Issues & Solutions

### Issue 1: Build Timeout
**Symptom:** Build exceeds Vercel's time limit
**Solution:**
- Upgrade to Pro plan (longer build time)
- Optimize dependencies
- Enable caching

### Issue 2: Memory Errors
**Symptom:** "JavaScript heap out of memory"
**Solution:**
Add to `package.json`:
```json
"scripts": {
  "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
}
```

### Issue 3: Module Resolution Issues
**Symptom:** "Cannot find module '@/components/...'"
**Check:**
- Ensure `tsconfig.json` has correct paths (✓ Already configured)
- Case-sensitive file imports
- All imported files exist

### Issue 4: Next.js 15 Compatibility
**Symptom:** React 19 or Next.js 15 related errors
**Current Setup:**
- Next.js 15.4.10 ✓
- React 19.1.0 ✓
- Should work, but ensure Vercel is using correct Node version

### Issue 5: Standalone Output Issues
**Current Config:**
```javascript
output: 'standalone'
```
This should work with Vercel, but if issues arise, try removing it.

## Debugging Steps

### 1. Check Vercel Build Logs
Look for specific error messages:
- TypeScript errors (currently ignored with `ignoreBuildErrors: true`)
- ESLint errors (currently ignored with `ignoreDuringBuilds: true`)
- Missing dependencies
- Module resolution failures
- Memory/timeout issues

### 2. Test Local Build
Run locally to verify:
```bash
cd frontend
npm install
npm run build
```

### 3. Check Node Version
Ensure Vercel uses Node 18+ (Next.js 15 requirement)
Add to `package.json`:
```json
"engines": {
  "node": ">=18.17.0"
}
```

### 4. Verify Environment Variables
All env vars must be available at build time:
- Go to Vercel → Settings → Environment Variables
- Ensure they're set for "Production" environment

### 5. Check for File Case Sensitivity
Vercel uses Linux (case-sensitive), Windows is not:
- `LandingPage.tsx` vs `landing-page.tsx`
- Check all import statements match actual file names

## Next Steps

1. **Get the actual build log from Vercel**
   - Go to your Vercel project
   - Click on the failed deployment
   - Copy the full build log
   
2. **Share the error message** so we can diagnose the specific issue

3. **Common quick fixes to try:**
   - Redeploy after the `vercel.json` fix
   - Clear Vercel build cache
   - Check if backend URL is reachable from Vercel

## Additional Notes

- The project uses Next.js App Router (Next.js 15)
- React 19 is still quite new, might have compatibility issues
- Supabase client properly handles missing env vars with warnings
- TypeScript and ESLint errors are suppressed for builds
