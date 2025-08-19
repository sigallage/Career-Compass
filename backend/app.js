require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Connect to MongoDB
require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  collection: 'contacts' // Explicitly specify the collection name
});

const Contact = mongoose.model('Contact', contactSchema);

// Contact API endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Create new contact
    const newContact = new Contact({
      name,
      email,
      message
    });
    
    await newContact.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      data: newContact 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to save contact form' });
  }
});

// Interview questions endpoint (placeholder)
app.post('/api/interview', async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }
    
    // Simple response for now (you can integrate with OpenAI later)
    const questions = [
      `What are the key skills required for a ${role}?`,
      `Describe a challenging project you worked on as a ${role}.`,
      `How do you stay updated with the latest ${role} technologies?`,
      `What are the common challenges faced by a ${role}?`,
      `How do you approach problem-solving in ${role} projects?`
    ];
    
    const response = `Here are some interview questions for ${role}:\n\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}`;
    
    res.json({ 
      success: true, 
      answer: response,
      role: role
    });
  } catch (error) {
    console.error('Interview endpoint error:', error);
    res.status(500).json({ error: 'Failed to generate interview questions' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend server is running' });
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Contact API: http://localhost:${PORT}/api/contact`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
});