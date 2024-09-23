const express = require('express'); 
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connects to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// A basic route to check if API is running
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Test the route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Registered users route
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});