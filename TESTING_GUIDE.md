# Testing Guide for Authentication System

This guide will help you test the sign-up and sign-in functionality with MongoDB.

## Prerequisites

### 1. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_LOCAL_URL=mongodb://localhost:27017/realxworld
# OR for MongoDB Atlas:
# MONGODB_ATLAS_URL=mongodb+srv://username:password@cluster.mongodb.net/realxworld

# NextAuth Secret (generate a random string)
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# Node Environment
NODE_ENV=development
```

**To generate a secure NEXTAUTH_SECRET:**
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 2. Start MongoDB

**Option A: Local MongoDB**
```bash
# If MongoDB is installed locally, start the service:
# Windows:
net start MongoDB

# Mac/Linux:
sudo systemctl start mongod
# or
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string
- Update `MONGODB_ATLAS_URL` in `.env.local`

### 3. Install Dependencies & Start Dev Server

```bash
npm install
npm run dev
```

The app should start at `http://localhost:3000`

## Testing Steps

### Test 1: Sign Up (Create New User)

1. **Navigate to Sign Up Page**
   - Go to `http://localhost:3000/signup`
   - Or click "Sign up" link from the home page

2. **Test Form Validation**
   - Try submitting empty form → Should show validation errors
   - Enter invalid email (e.g., "test") → Should show email error
   - Enter short password (< 8 chars) → Should show password error
   - Enter password without uppercase → Should show error
   - Enter password without number → Should show error
   - Enter mismatched passwords → Should show error

3. **Create a Valid User**
   - **Full Name:** John Doe
   - **Email:** john.doe@example.com
   - **Role:** Buyer (or select Seller/Agent)
   - **Password:** Test1234 (must have uppercase, lowercase, and number)
   - **Confirm Password:** Test1234
   - Click "Create Account"

4. **Expected Result:**
   - Should redirect to home page (`/`)
   - User should be logged in automatically
   - Check browser console for any errors

5. **Test Duplicate Email**
   - Try signing up with the same email again
   - Should show "User already exists" error

### Test 2: Sign In

1. **Sign Out First** (if logged in)
   - Click sign out or navigate to `/signin`

2. **Navigate to Sign In Page**
   - Go to `http://localhost:3000/signin`
   - Or click "Sign in" link

3. **Test Form Validation**
   - Try submitting empty form → Should show validation errors
   - Enter invalid email → Should show email error
   - Enter short password (< 6 chars) → Should show password error

4. **Sign In with Valid Credentials**
   - **Email:** john.doe@example.com
   - **Password:** Test1234
   - Click "Sign In"

5. **Expected Result:**
   - Should redirect to home page
   - User should be logged in
   - Check browser console for any errors

6. **Test Invalid Credentials**
   - Try wrong password → Should show "Invalid email or password"
   - Try non-existent email → Should show "Invalid email or password"

### Test 3: Verify Database

**Option A: MongoDB Compass (GUI)**
1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Connect using your connection string
3. Navigate to `realxworld` database → `users` collection
4. Verify user document exists with:
   - `email`: john.doe@example.com
   - `name`: John Doe
   - `role`: buyer
   - `password`: (hashed, not plain text)
   - `createdAt` and `updatedAt` timestamps

**Option B: MongoDB Shell**
```bash
# Connect to MongoDB
mongosh

# Or with connection string:
mongosh "mongodb://localhost:27017/realxworld"

# Switch to database
use realxworld

# View all users
db.users.find().pretty()

# View specific user
db.users.findOne({ email: "john.doe@example.com" })

# Count users
db.users.countDocuments()
```

**Option C: VS Code MongoDB Extension**
- Install "MongoDB for VS Code" extension
- Connect to your database
- Browse collections visually

## Testing Different User Roles

### Test Buyer Account
```json
{
  "name": "Jane Buyer",
  "email": "jane.buyer@example.com",
  "password": "Buyer1234",
  "role": "buyer"
}
```

### Test Seller Account
```json
{
  "name": "Bob Seller",
  "email": "bob.seller@example.com",
  "password": "Seller1234",
  "role": "seller"
}
```

### Test Agent Account
```json
{
  "name": "Alice Agent",
  "email": "alice.agent@example.com",
  "password": "Agent1234",
  "role": "agent"
}
```

## Testing Edge Cases

1. **Email Case Sensitivity**
   - Sign up with: `John.Doe@Example.com`
   - Sign in with: `john.doe@example.com`
   - Should work (emails are normalized to lowercase)

2. **Password Security**
   - Verify passwords are hashed in database (not plain text)
   - Try signing in with wrong password → Should fail

3. **Special Characters in Name**
   - Try: `Mary-Jane O'Brien`
   - Should work (valid characters: letters, spaces, hyphens, apostrophes)

4. **Long Inputs**
   - Try very long email (> 254 chars) → Should validate
   - Try very long name (> 50 chars) → Should show error

## Troubleshooting

### Database Connection Issues

**Error: "Please define the MONGODB_URI environment variable"**
- Check `.env.local` file exists
- Verify variable names match exactly
- Restart dev server after adding env variables

**Error: "MongoNetworkError"**
- Check MongoDB is running
- Verify connection string is correct
- Check firewall/network settings

### Authentication Issues

**Error: "Invalid email or password" (but credentials are correct)**
- Check database connection
- Verify user exists in database
- Check password hashing is working

**Error: "User already exists"**
- Check email uniqueness constraint
- Verify MongoDB indexes are created
- Try with different email

### Form Validation Issues

**Validation not working**
- Check browser console for errors
- Verify form fields have correct `name` attributes
- Check validation functions are called

## Quick Test Script

You can also test the API directly using curl or Postman:

**Sign Up:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test1234",
    "role": "buyer"
  }'
```

**Expected Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    "role": "buyer"
  }
}
```

## Next Steps

After successful testing:
1. ✅ Users can sign up with validation
2. ✅ Users can sign in securely
3. ✅ Passwords are hashed in database
4. ✅ Duplicate emails are prevented
5. ✅ User roles are stored correctly

You're ready to build more features on top of this authentication system!
