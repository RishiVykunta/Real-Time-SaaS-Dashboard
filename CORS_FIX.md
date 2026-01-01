# CORS Error Fix - Quick Guide

## Problem
You're seeing this error:
```
Access to XMLHttpRequest at 'https://real-time-saas-dashboard.onrender.com/api/auth/login' 
from origin 'https://real-time-saa-s-dashboard.vercel.app' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' 
header is present on the requested resource.
```

## Solution - Fix CORS in 3 Steps

### Step 1: Get Your Exact Frontend URL
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project: `real-time-saa-s-dashboard`
3. Copy the **exact** URL shown (should be something like: `https://real-time-saa-s-dashboard.vercel.app`)
4. **Important:** Copy it exactly as shown, including `https://`

### Step 2: Update Backend CORS_ORIGIN
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service: `real-time-saas-dashboard`
3. Go to **"Environment"** tab (left sidebar)
4. Find the `CORS_ORIGIN` variable
5. Click **"Edit"** or **"Add"** if it doesn't exist
6. Set the value to your **exact** Vercel URL:
   ```
   https://real-time-saa-s-dashboard.vercel.app
   ```
   ⚠️ **Critical:** 
   - Must match your Vercel URL **exactly**
   - Include `https://`
   - No trailing slash
   - No spaces

### Step 3: Save and Wait
1. Click **"Save Changes"**
2. Render will automatically redeploy
3. Wait 2-5 minutes for deployment to complete
4. Check the logs - you should see: `🌐 CORS Configuration: Allowed Origins: [...]`

### Step 4: Verify It's Fixed
1. Go back to your frontend: `https://real-time-saa-s-dashboard.vercel.app`
2. Try logging in again
3. The CORS error should be gone!

## Common Mistakes

❌ **Wrong:**
```
CORS_ORIGIN=http://real-time-saa-s-dashboard.vercel.app
CORS_ORIGIN=https://real-time-saa-s-dashboard.vercel.app/
CORS_ORIGIN=real-time-saa-s-dashboard.vercel.app
```

✅ **Correct:**
```
CORS_ORIGIN=https://real-time-saa-s-dashboard.vercel.app
```

## Still Not Working?

1. **Check Render Logs:**
   - Go to Render dashboard → Your service → Logs
   - Look for: `🌐 CORS Configuration: Allowed Origins: [...]`
   - Verify your frontend URL is in the list

2. **Double-Check URLs:**
   - Frontend URL in Vercel: `https://real-time-saa-s-dashboard.vercel.app`
   - CORS_ORIGIN in Render: `https://real-time-saa-s-dashboard.vercel.app`
   - They must match **exactly**

3. **Clear Browser Cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in incognito/private window

4. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for any other errors

5. **Verify Backend is Running:**
   - Visit: `https://real-time-saas-dashboard.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

## Multiple Frontend URLs

If you have multiple frontend URLs (e.g., preview deployments), separate them with commas:

```
CORS_ORIGIN=https://real-time-saa-s-dashboard.vercel.app,https://real-time-saa-s-dashboard-git-main.vercel.app
```

---

**After fixing CORS, your login and registration should work! 🎉**

