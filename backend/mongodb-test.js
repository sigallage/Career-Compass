// MongoDB Connection Test
// Save this as mongodb-test.js and run: node mongodb-test.js

const mongoose = require('mongoose');
require('dotenv').config();

console.log('🧪 Testing MongoDB Atlas Connection...');
console.log('📍 Connection String:', process.env.MONGODB_URI ? 'Found ✅' : 'Missing ❌');

if (!process.env.MONGODB_URI) {
    console.log('❌ ERROR: MONGODB_URI not found in .env file');
    console.log('💡 Create .env file with:');
    console.log('MONGODB_URI=mongodb+srv://andryagoon:C83TuDZomm6Qj6D7@my-app.5osmbkw.mongodb.net/Career_Compass?retryWrites=true&w=majority&appName=my-app');
    process.exit(1);
}

// Test connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
    console.log('📄 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('⚡ Ready State:', mongoose.connection.readyState);
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ test: String, timestamp: Date });
    const TestModel = mongoose.model('ConnectionTest', testSchema);
    
    return TestModel.create({ test: 'MongoDB working!', timestamp: new Date() });
})
.then((doc) => {
    console.log('✅ SUCCESS: Test document created!', doc._id);
    console.log('🎉 MongoDB Atlas is working perfectly on this PC!');
    process.exit(0);
})
.catch((error) => {
    console.error('❌ MONGODB CONNECTION FAILED:');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
        console.log('🌐 NETWORK ISSUE: Cannot reach MongoDB servers');
        console.log('💡 Check internet connection');
        console.log('💡 Check if firewall is blocking MongoDB');
    }
    
    if (error.message.includes('authentication')) {
        console.log('🔐 AUTHENTICATION ISSUE: Invalid credentials');
        console.log('💡 Check username/password in connection string');
    }
    
    if (error.message.includes('IP')) {
        console.log('🚫 IP ACCESS ISSUE: IP address not whitelisted');
        console.log('💡 Add friend\'s IP to MongoDB Atlas Network Access');
    }
    
    process.exit(1);
});

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
    console.error('🚨 Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from MongoDB Atlas');
});
