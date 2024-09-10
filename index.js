const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('./logger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authenticateToken, authorizeAdmin } = require('./authmiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, ).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

const users = [
    { id: 1, username: 'user', password: bcrypt.hashSync('password', 10), role: 'user' },
    { id: 2, username: 'admin', password: bcrypt.hashSync('adminpass', 10), role: 'admin' }
];

const secretKey = 'your_secret_key';

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, role: user.role }, secretKey);
    res.json({ token });
});

// Protected route for basic users
app.get('/user', authenticateToken, (req, res) => {
    res.send('Welcome, user!');
});

// Protected route for admin users
app.get('/admin', authenticateToken, authorizeAdmin, (req, res) => {
    res.send('Welcome, admin!');
});


app.get('/', (req, res) => {
    logger.info('Hello world requested');
    res.send('Hello, World!');
    
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
