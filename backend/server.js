const express = require('express'); 
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const authMiddleware = require('./auth');
const Fundraiser = require('./models/Fundraiser');
require('dotenv').config();

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
        // Hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// route for logins
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Protected route
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route. Only accessible with a valid token!', user: req.user });
});

// CREATE a new fundraiser
app.post('/api/fundraisers', authMiddleware, async (req, res) => {
    const { title, description, goalAmount } = req.body;

    try {
        const newFundraiser = new Fundraiser({
            title,
            description,
            goalAmount,
            creator: req.user.id // Attach the user's ID if I decide to keep the creator field
        });
        await newFundraiser.save();
        res.status(201).json({ message: 'Fundraiser created successfully!', fundraiser: newFundraiser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating fundraiser', error });
    }
});

// Starts the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});