# Supabase Connection Fix for Render

## The Problem
You're getting `ENETUNREACH` error when connecting to Supabase from Render. This can happen for several reasons:

## Solution 1: Use Supabase Connection Pooler (Recommended)

Supabase provides a connection pooler that's more reliable for serverless/cloud deployments.

### Steps:

1. **Go to Supabase Dashboard**
   - Open your project
   - Go to **Settings** → **Database**

2. **Get Connection Pooler Details**
   - Scroll to **Connection Pooling**
   - Copy the **Connection string** (Session mode)
   - It looks like: `postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres`

3. **Update Render Environment Variables**
   - In Render dashboard, go to your service
   - Edit environment variables:
   - **DB_HOST:** `aws-0-us-west-1.pooler.supabase.com` (from connection string)
   - **DB_PORT:** `6543` (pooler port, NOT 5432)
   - **DB_NAME:** `postgres`
   - **DB_USER:** `postgres.xxxxx` (includes project ref)
   - **DB_PASSWORD:** (your password)

4. **Save and Redeploy**
   - Render will automatically redeploy
   - Check logs for connection success

## Solution 2: Check Supabase Project Status

1. **Verify Project is Active**
   - Go to Supabase dashboard
   - Check if project shows "Paused" or "Active"
   - If paused, click **"Resume project"**
   - Free tier projects pause after 1 week of inactivity

2. **Check Project Region**
   - Ensure your Supabase region matches your Render region (or is close)
   - This can affect connection reliability

## Solution 3: Use Direct Connection with IPv4

If pooler doesn't work, try forcing IPv4:

1. **In Supabase Dashboard**
   - Go to **Settings** → **Database**
   - Get the **Connection string** (Direct connection)
   - Note the host (should be `db.xxxxx.supabase.co`)

2. **Update Render Environment Variables**
   - **DB_HOST:** `db.xxxxx.supabase.co`
   - **DB_PORT:** `5432`
   - **DB_NAME:** `postgres`
   - **DB_USER:** `postgres`
   - **DB_PASSWORD:** (your password)

3. **Verify SSL is Enabled**
   - The code automatically enables SSL for Supabase
   - No additional configuration needed

## Solution 4: Alternative - Use Render PostgreSQL

If Supabase continues to have issues, you can use Render's PostgreSQL:

1. **In Render Dashboard**
   - Click **"New +"** → **"PostgreSQL"**
   - Name it: `saas-dashboard-db`
   - Choose region
   - Click **"Create Database"**

2. **Get Connection Details**
   - Render will show connection details
   - Copy the **Internal Database URL**

3. **Update Environment Variables**
   - **DB_HOST:** (from Render database)
   - **DB_PORT:** `5432`
   - **DB_NAME:** (from Render database)
   - **DB_USER:** (from Render database)
   - **DB_PASSWORD:** (from Render database)

4. **No SSL Required**
   - Render PostgreSQL doesn't require SSL for internal connections

## Quick Checklist

- [ ] Supabase project is active (not paused)
- [ ] Using correct connection details from Supabase dashboard
- [ ] DB_NAME is `postgres` (not `saas_dashboard`)
- [ ] DB_PORT is correct (6543 for pooler, 5432 for direct)
- [ ] DB_USER includes project ref if using pooler (e.g., `postgres.xxxxx`)
- [ ] Password is correct (copy from Supabase connection string)
- [ ] SSL is enabled (handled automatically by code)

## Still Having Issues?

1. **Check Render Logs**
   - Look for specific error messages
   - Check if connection is timing out

2. **Test Connection Locally**
   - Try connecting from your local machine using the same credentials
   - Use a PostgreSQL client (pgAdmin, DBeaver, etc.)

3. **Contact Support**
   - Supabase: Check their status page or Discord
   - Render: Check Render status or support

## Recommended: Use Connection Pooler

**The connection pooler (port 6543) is recommended for production deployments** because:
- Better connection management
- More reliable for serverless/cloud environments
- Handles connection limits better
- Designed for external connections

