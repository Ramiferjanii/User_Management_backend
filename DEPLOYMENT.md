# Deployment Guide - MongoDB Atlas on Render

## Quick Fix for "bad auth: authentication failed" Error

This error occurs when MongoDB Atlas cannot authenticate your connection string. Follow these steps:

### Step 1: Get Your Connection String from MongoDB Atlas

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (it looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 2: URL-Encode Your Password

**This is the #1 cause of authentication errors!**

If your password contains any special characters, you must URL-encode them:

| Character | URL-Encoded |
|-----------|-------------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `/` | `%2F` |
| `?` | `%3F` |
| `&` | `%26` |
| `=` | `%3D` |

**Example:**
- Original password: `MyP@ssw0rd#123`
- URL-encoded: `MyP%40ssw0rd%23123`
- Final connection string:
  ```
  mongodb+srv://myuser:MyP%40ssw0rd%23123@cluster0.xxxxx.mongodb.net/user-management?retryWrites=true&w=majority
  ```

### Step 3: Verify MongoDB Atlas Settings

#### Network Access (IP Whitelist)

1. Go to **Network Access** in MongoDB Atlas
2. Click **"Add IP Address"**
3. Add `0.0.0.0/0` (allows all IPs) - good for development
4. For production, you can restrict to Render's IP ranges

#### Database User Permissions

1. Go to **Database Access** in MongoDB Atlas
2. Find your user
3. Ensure they have **"Read and write to any database"** or appropriate permissions
4. If user is new, click **"Edit"** → **"Edit"** → **"Built-in Role"** → Select **"Read and write to any database"**

### Step 4: Test Your Connection String Locally

Before deploying to Render, test locally:

1. Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=your_connection_string_here
   JWT_SECRET=test-secret
   JWT_REFRESH_SECRET=test-refresh-secret
   NODE_ENV=development
   PORT=5000
   ```

2. Run the app locally:
   ```bash
   npm run dev
   ```

3. Check for successful connection message

### Step 5: Deploy to Render

1. **Build Command:** (no changes needed - Dockerfile handles this)
2. **Start Command:** (no changes needed - Dockerfile handles this)
3. **Environment Variables:** Add these in Render's dashboard:
   - `MONGODB_URI` - Your fully formatted connection string with URL-encoded password
   - `JWT_SECRET` - Generate using: `openssl rand -base64 32`
   - `JWT_REFRESH_SECRET` - Generate using: `openssl rand -base64 32`
   - `NODE_ENV=production`

### Step 6: Verify Deployment

1. Check Render logs for connection messages
2. Visit `https://your-app.onrender.com/api/health`
3. Should see: `{"status":"OK","message":"Server is running"}`

## Common Issues & Solutions

### Issue: "bad auth: authentication failed"
**Solution:** URL-encode special characters in password (see Step 2)

### Issue: "ECONNREFUSED" or "DNS resolution failed"
**Solution:** 
- Check network access IP whitelist (allow `0.0.0.0/0`)
- Verify connection string is correct

### Issue: "Database exists but can't access"
**Solution:**
- Check user has proper permissions in Database Access
- Verify database name in connection string matches

### Issue: Connection string works locally but not on Render
**Solution:**
- Double-check environment variable is set correctly in Render
- Verify no extra spaces or quotes in the connection string
- Check that special characters are URL-encoded

## Testing Your Connection String

You can test your connection string directly using MongoDB Compass or MongoDB shell:

```bash
# Using mongosh (if installed locally)
mongosh "your_connection_string_here"
```

Or use Node.js to test:
```javascript
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Error:', err));
```

## Need More Help?

Check the Render logs for detailed error messages. The improved error logging in `app.ts` will show:
- Masked connection string (password hidden)
- Specific error details
- Troubleshooting tips

## Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use strong, unique passwords** for database users
3. **Rotate credentials** periodically
4. **Restrict IP whitelist** in production
5. **Use environment-specific secrets** (development vs production)
6. **Monitor connection logs** for suspicious activity

