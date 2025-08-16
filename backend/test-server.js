const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001; // Using different port for test

app.use(express.json());
app.use(cors());

// Simple test endpoint
app.post('/api/contact', (req, res) => {
  console.log('✅ CONTACT FORM DATA RECEIVED:', req.body);
  res.json({ success: true, message: 'Data received successfully!' });
});

app.listen(PORT, () => {
  console.log(`🚀 TEST SERVER running on http://localhost:${PORT}`);
  console.log(`📧 Test this URL: http://localhost:3001/api/contact`);
});