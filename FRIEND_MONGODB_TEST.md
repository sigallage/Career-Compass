# Career Compass - Setup Instructions for Project Evaluator/Friend

## Prerequisites
- Node.js (v16 or higher)
- npm
- Internet connection

## Step 1: Create .env file
Create a file called `.env` in the backend folder with this exact content:

```
MONGODB_URI=mongodb+srv://andryagoon:C83TuDZomm6Qj6D7@my-app.5osmbkw.mongodb.net/Career_Compass?retryWrites=true&w=majority&appName=my-app
PORT=3000
```

## Step 2: Install Dependencies
```bash
cd backend
npm install
```

## Step 3: Run MongoDB Connection Test
```bash
node mongodb-test.js
```

## Expected Results:

### ✅ If SUCCESS:
```
✅ SUCCESS: Connected to MongoDB Atlas!
📄 Database: Career_Compass
🎉 MongoDB Atlas is working perfectly on this PC!
```
**→ Proceed to Step 4**

### ❌ If NETWORK ERROR:
```
❌ MONGODB CONNECTION FAILED
🌐 NETWORK ISSUE: Cannot reach MongoDB servers
```
**Solutions:**
- Check internet connection
- Try disabling firewall temporarily
- Contact network administrator

### ❌ If IP BLOCKED:
```
❌ MONGODB CONNECTION FAILED
🚫 IP ACCESS ISSUE: IP address not whitelisted
```
**Solutions:**
- Check your IP at: https://whatismyipaddress.com/
- Send your IP to project owner to whitelist
- Or use mobile hotspot (different IP)

### ❌ If AUTHENTICATION ERROR:
```
❌ MONGODB CONNECTION FAILED
🔐 AUTHENTICATION ISSUE: Invalid credentials
```
**Solution:** Double-check the .env file content (copy-paste exactly)

## Step 4: Start Backend Server
```bash
node app.js
```

**Expected output:**
```
🚀 Server running on port 3000
📧 Contact API: http://localhost:3000/api/contact
❤ Health check: http://localhost:3000/api/health
🔗 Mongoose connected to MongoDB
connected to the database.
📄 Database: Career_Compass
```

## Step 5: Start Frontend (New Terminal)
```bash
cd ../frontend
npm install
npm run dev
```

## Step 6: Test the Application
1. Open browser: http://localhost:5173
2. Navigate to Contact page
3. Fill out the form and submit
4. Should see success message (no errors)

## Troubleshooting

### Backend Won't Start (Port 3000 in use):
```bash
# Windows:
taskkill /F /IM node.exe
# Mac/Linux:
pkill node
```

### Frontend API Errors:
- Make sure backend is running first
- Check http://localhost:3000/api/health shows: `{"status":"Backend server is running"}`

### Still Not Working?
- Run the MongoDB test again: `node mongodb-test.js`
- Check all terminal outputs for error messages
- Ensure both frontend and backend are running simultaneously
