# Deployment Guide - Step by Step

This guide will walk you through deploying your Real-Time SaaS Admin Dashboard to production.

## Prerequisites

- GitHub account with your repository pushed
- Vercel account (free tier available)
- Render account (free tier available)
- Supabase account (free tier available)

---

## Step 1: Deploy Database (Supabase)

### 1.1 Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign in"**
3. Sign up/Sign in with GitHub or email

### 1.2 Create New Project
1. Click **"New Project"**
2. Fill in the details:
   - **Name:** `saas-dashboard-db` (or any name)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is fine
3. Click **"Create new project"**
4. Wait 2-3 minutes for database to be created

### 1.3 Get Database Connection Details
1. Once project is ready, go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Copy the **Connection string** (URI format)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
4. Also note:
   - **Host:** `db.xxxxx.supabase.co` (copy from connection string)
   - **Port:** `5432`
   - **Database:** `postgres`
   - **User:** `postgres`
   - **Password:** (the one you created)
5. **Important:** Supabase requires SSL connections. The code is already configured for this.

### 1.4 Test Connection (Optional)
You can test the connection using any PostgreSQL client or keep it for later.

---

## Step 2: Deploy Backend (Render)

### 2.1 Create Render Account
1. Go to [https://render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with GitHub (recommended) or email

### 2.2 Create New Web Service
1. From Render dashboard, click **"New +"**
2. Select **"Web Service"**
3. Click **"Connect account"** if prompted to connect GitHub
4. Select your repository: **`RishiVykunta/Real-Time-SaaS-Dashboard`**

### 2.3 Configure Backend Service
Fill in the configuration:

**Basic Settings:**
- **Name:** `saas-dashboard-backend` (or any name)
- **Region:** Choose closest to your database region
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Advanced Settings:**
- **Auto-Deploy:** `Yes` (deploys on every push to main)

### 2.4 Add Environment Variables
Click **"Add Environment Variable"** and add each one:

```
PORT=5000
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_use_random_string
JWT_EXPIRES_IN=7d
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

**Important Notes:**
- Replace `db.xxxxx.supabase.co` with your actual Supabase host
- Replace `your_supabase_password` with your Supabase database password
- Replace `your_super_secret_jwt_key...` with a long random string (use a password generator)
- For `CORS_ORIGIN`, you'll update this after deploying frontend

### 2.5 Create PostgreSQL Database (Alternative to Supabase)
If you prefer Render's PostgreSQL:
1. Click **"New +"** → **"PostgreSQL"**
2. Name it: `saas-dashboard-db`
3. Use the connection details in environment variables instead of Supabase

### 2.6 Deploy Backend
1. Click **"Create Web Service"**
2. Render will start building your backend
3. Wait 5-10 minutes for deployment
4. Once deployed, you'll get a URL like: `https://saas-dashboard-backend.onrender.com`
5. **Save this URL** - you'll need it for frontend

### 2.7 Verify Backend Deployment
1. Visit: `https://your-backend-url.onrender.com/api/health`
2. You should see: `{"status":"ok","message":"Server is running"}`
3. If you see an error, check the logs in Render dashboard

---

## Step 3: Deploy Frontend (Vercel)

### 3.1 Create Vercel Account
1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended)

### 3.2 Import GitHub Repository
1. After signing in, click **"Add New..."** → **"Project"**
2. Find your repository: **`RishiVykunta/Real-Time-SaaS-Dashboard`**
3. Click **"Import"**

### 3.3 Configure Frontend Project
Fill in the configuration:

**Project Settings:**
- **Project Name:** `saas-dashboard-frontend` (or any name)
- **Framework Preset:** `Vite`
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 3.4 Add Environment Variables
Click **"Environment Variables"** and add:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

**Important:**
- Replace `your-backend-url.onrender.com` with your actual Render backend URL
- Use `https://` not `http://`

### 3.5 Deploy Frontend
1. Click **"Deploy"**
2. Vercel will build and deploy your frontend
3. Wait 2-3 minutes
4. Once deployed, you'll get a URL like: `https://saas-dashboard-frontend.vercel.app`
5. **Save this URL**

### 3.6 Update Backend CORS
1. Go back to Render dashboard
2. Edit your backend service
3. Update the `CORS_ORIGIN` environment variable:
   ```
   CORS_ORIGIN=https://saas-dashboard-frontend.vercel.app
   ```
4. Save and wait for redeployment

### 3.7 Update Frontend Environment Variables (if needed)
1. Go to Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify the URLs are correct
5. Redeploy if you made changes

---

## Step 4: Verify Deployment

### 4.1 Test Frontend
1. Visit your Vercel URL: `https://your-frontend.vercel.app`
2. You should see the login page
3. Try logging in with:
   - **Email:** `admin@example.com`
   - **Password:** `admin123`

### 4.2 Test Backend API
1. Visit: `https://your-backend.onrender.com/api/health`
2. Should return: `{"status":"ok","message":"Server is running"}`

### 4.3 Test Database Connection
1. Check Render logs for backend
2. Look for: `✅ Database connection successful!`
3. Look for: `✅ Database tables initialized successfully`

### 4.4 Test Real-Time Features
1. Open two browser tabs with your frontend URL
2. Login in both tabs
3. Perform actions in one tab
4. Verify real-time updates appear in the other tab

---

## Step 5: Troubleshooting

### Backend Issues

**Problem: Database connection failed**
- Check environment variables in Render
- Verify Supabase database is running
- Check database password is correct
- Ensure database host/port are correct

**Problem: Build failed**
- Check Render build logs
- Verify `package.json` has correct scripts
- Ensure all dependencies are listed

**Problem: CORS errors**
- Verify `CORS_ORIGIN` matches your frontend URL exactly
- Include `https://` in the URL
- Redeploy after changing CORS settings

### Frontend Issues

**Problem: API calls failing**
- Check `VITE_API_URL` environment variable
- Verify backend URL is correct
- Check browser console for errors
- Ensure backend is running

**Problem: Socket.IO not connecting**
- Check `VITE_SOCKET_URL` environment variable
- Verify it matches backend URL
- Check browser console for WebSocket errors

**Problem: Build failed**
- Check Vercel build logs
- Verify all dependencies are in `package.json`
- Check for TypeScript/ESLint errors

### Database Issues

**Problem: Tables not created**
- Check backend logs in Render
- Verify database connection is successful
- Check if `initializeDatabase()` is being called
- Look for error messages in logs

---

## Step 6: Post-Deployment

### 6.1 Update README
Update your GitHub README with:
- Live demo links (frontend and backend)
- Production URLs
- Deployment status badges (optional)

### 6.2 Set Up Custom Domain (Optional)
- **Vercel:** Add custom domain in project settings
- **Render:** Add custom domain in service settings
- Update environment variables with new domains

### 6.3 Monitor Performance
- Check Vercel analytics for frontend
- Monitor Render logs for backend
- Set up error tracking (optional)

### 6.4 Security Checklist
- ✅ Change default admin password
- ✅ Use strong JWT_SECRET
- ✅ Enable HTTPS (automatic on Vercel/Render)
- ✅ Keep dependencies updated
- ✅ Review environment variables

---

## Quick Reference

### Environment Variables Summary

**Backend (Render):**
```
PORT=5000
NODE_ENV=production
JWT_SECRET=your_random_secret_key
JWT_EXPIRES_IN=7d
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
CORS_ORIGIN=https://your-frontend.vercel.app
```

**Frontend (Vercel):**
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
```

### URLs to Save
- **Frontend:** `https://your-frontend.vercel.app`
- **Backend:** `https://your-backend.onrender.com`
- **Database:** Supabase connection string

---

## Support

If you encounter issues:
1. Check the logs in Render/Vercel dashboards
2. Review error messages carefully
3. Verify all environment variables are set correctly
4. Ensure all services are running
5. Check GitHub issues or documentation

---

**Congratulations! Your Real-Time SaaS Admin Dashboard is now live! 🎉**

