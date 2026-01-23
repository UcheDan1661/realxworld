# Database Connection Debugging Guide

## Issue: Data not appearing in MongoDB Atlas

### Fixed Issues

1. **Connection Variable Priority** ✅
   - Previously: In development, it only looked for `MONGODB_LOCAL_URL`
   - Now: Uses `MONGODB_ATLAS_URL` if available, otherwise falls back to `MONGODB_LOCAL_URL`

### Steps to Verify Your Setup

#### 1. Check Your `.env.local` File

Make sure you have the correct variable name:

```env
MONGODB_ATLAS_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

**Important Notes:**
- Replace `database_name` with your actual database name (e.g., `realxworld`)
- The database name in the connection string determines where data is stored
- If no database name is specified, MongoDB uses `test` as default

#### 2. Check Your MongoDB Atlas Connection String Format

Your connection string should look like:
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database_name>?retryWrites=true&w=majority
```

**Example:**
```
mongodb+srv://myuser:mypass@cluster0.abc123.mongodb.net/realxworld?retryWrites=true&w=majority
```

#### 3. Verify Database Name

The collection will be created in the database specified in your connection string:
- If your connection string has `/realxworld` → data goes to `realxworld` database
- If your connection string has `/test` → data goes to `test` database
- If no database name → data goes to `test` database

#### 4. Check Collection Name

Mongoose automatically pluralizes model names:
- Model: `User` → Collection: `users` (lowercase, plural)

So look for a collection named **`users`** (not `User` or `user`)

#### 5. Check Server Console Logs

After restarting your dev server, you should see:
```
Connecting to MongoDB...
✅ MongoDB connected successfully
Database name: your_database_name
```

If you see errors, check:
- Connection string format
- Network access in Atlas (IP whitelist)
- Username/password correctness

#### 6. Test the Connection

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Try signing up a new user**

3. **Check the server console** for:
   - Connection success message
   - "✅ User created successfully" message with user details

4. **Check MongoDB Atlas:**
   - Go to your cluster
   - Click "Browse Collections"
   - Look for your database name (from connection string)
   - Look for `users` collection
   - Click on `users` to see documents

#### 7. Common Issues

**Issue: Connection string doesn't include database name**
- **Solution:** Add database name to connection string:
  ```
  mongodb+srv://user:pass@cluster.mongodb.net/realxworld?retryWrites=true&w=majority
  ```

**Issue: Wrong database name in Atlas**
- **Solution:** Check which database name you're looking at in Atlas
- The database name must match what's in your connection string

**Issue: Collection not visible**
- **Solution:** 
  - Collections are created when first document is inserted
  - Refresh the Atlas UI
  - Make sure you're looking at the correct database

**Issue: IP Whitelist**
- **Solution:** In Atlas, go to Network Access
- Add `0.0.0.0/0` to allow all IPs (for development)
- Or add your specific IP address

#### 8. Verify Data is Being Saved

After signing up, check the server console for:
```
✅ User created successfully: { id: '...', email: '...', name: '...', role: '...' }
```

If you see this but no data in Atlas:
- Check the database name in your connection string
- Verify you're looking at the correct database in Atlas
- Check if there are any network/firewall issues

#### 9. Manual Database Check via MongoDB Shell

If you have MongoDB shell installed:

```bash
# Connect to your Atlas cluster
mongosh "your_connection_string"

# List databases
show dbs

# Use your database
use realxworld  # or whatever database name you used

# List collections
show collections

# Find users
db.users.find().pretty()
```

### Quick Fix Checklist

- [ ] `.env.local` has `MONGODB_ATLAS_URL` (not `MONGODB_LOCAL_URL`)
- [ ] Connection string includes database name (e.g., `/realxworld`)
- [ ] Restarted dev server after changes
- [ ] Checked server console for connection messages
- [ ] Looking at correct database in Atlas
- [ ] Looking for `users` collection (plural, lowercase)
- [ ] IP address whitelisted in Atlas Network Access
- [ ] Connection string has correct username/password

### Still Not Working?

1. **Check browser console** for any errors
2. **Check server terminal** for connection errors
3. **Try creating a test user** and watch the server logs
4. **Verify connection string** by testing it in MongoDB Compass
5. **Check Atlas logs** for connection attempts

If data still doesn't appear, the server console logs will show exactly what's happening!
