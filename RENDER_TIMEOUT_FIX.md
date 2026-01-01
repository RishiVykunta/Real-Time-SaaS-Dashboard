# Fix Render Database Connection Timeout

## The Problem
You're getting `ETIMEDOUT` error when connecting to Supabase from Render. This means the connection is timing out.

## Solution 1: Check Supabase Project Status (Most Common)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Open your project

2. **Check if Project is Paused**
   - Free tier projects pause after 1 week of inactivity
   - If you see "Paused" status, click **"Resume project"**
   - Wait 1-2 minutes for it to resume

3. **Verify Project is Active**
   - Status should show "Active"
   - Check the project region

## Solution 2: Try Direct Connection Instead of Pooler

The connection pooler might be having issues. Try using direct connection:

1. **In Supabase Dashboard**
   - Go to **Settings** → **Database**
   - Scroll to **Connection string**
   - Use the **Direct connection** (not pooler)
   - Copy the connection string

2. **Update Render Environment Variables**
   - **DB_HOST:** `db.dkjhlizurknbjbmjrulp.supabase.co` (direct connection)
   - **DB_PORT:** `5432` (not 6543)
   - **DB_NAME:** `postgres`
   - **DB_USER:** `postgres` (not `postgres.xxxxx`)
   - **DB_PASSWORD:** (your password)

3. **Save and Redeploy**
   - Render will automatically redeploy
   - Check logs for connection success

## Solution 3: Check Network Connectivity

1. **Verify Regions Match**
   - Supabase region: Check in Supabase dashboard
   - Render region: Check in Render service settings
   - They should be in the same or nearby regions for better connectivity

2. **Check Supabase Status**
   - Visit: https://status.supabase.com
   - Check if there are any ongoing issues

## Solution 4: Use Render PostgreSQL (Alternative)

If Supabase continues to timeout, use Render's PostgreSQL:

1. **Create Render PostgreSQL**
   - In Render dashboard, click **"New +"** → **"PostgreSQL"**
   - Name: `saas-dashboard-db`
   - Region: Same as your backend service
   - Click **"Create Database"**

2. **Get Connection Details**
   - Render will show connection details
   - Use the **Internal Database URL** (for services in same region)

3. **Update Environment Variables**
   - **DB_HOST:** (from Render database)
   - **DB_PORT:** `5432`
   - **DB_NAME:** (from Render database)
   - **DB_USER:** (from Render database)
   - **DB_PASSWORD:** (from Render database)

4. **No SSL Required**
   - Render PostgreSQL doesn't require SSL for internal connections
   - More reliable for Render deployments

## Solution 5: Add Connection Retry Logic

The code now includes:
- Connection timeout: 10 seconds
- Better error messages
- Connection retry handling

## Quick Checklist

- [ ] Supabase project is **Active** (not paused)
- [ ] Using correct connection details from Supabase
- [ ] Tried both pooler (6543) and direct (5432) connections
- [ ] Regions match between Supabase and Render
- [ ] Connection pooler is enabled in Supabase (if using pooler)
- [ ] Password is correct (copy from Supabase connection string)

## Recommended: Use Direct Connection First

For Render deployments, try **direct connection (port 5432)** first:
- More reliable for persistent connections
- Simpler configuration
- Better for long-running services

If direct connection works, you can switch back to pooler later if needed.

## Still Timing Out?

1. **Check Render Logs**
   - Look for specific timeout messages
   - Check connection attempt details

2. **Test Locally**
   - Try connecting from your local machine
   - Use the same credentials
   - If it works locally, it's a network issue between Render and Supabase

3. **Contact Support**
   - Supabase: Check Discord or support
   - Render: Check status page

## Most Likely Fix

**90% of timeout issues are because the Supabase project is paused.**

1. Go to Supabase dashboard
2. Resume the project if paused
3. Wait 2-3 minutes
4. Redeploy on Render

This usually fixes the issue immediately.

