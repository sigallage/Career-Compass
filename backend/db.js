require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_CONNECTION_STRING;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;