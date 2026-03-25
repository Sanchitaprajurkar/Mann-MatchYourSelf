const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/assignment4_db";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully for Assignment 4'))
.catch((err) => console.error('❌ MongoDB connection error:', err.message));

// Routes
const formRoutes = require('./routes/formRoutes');
app.use('/api/form', formRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Assignment 4 Backend API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
