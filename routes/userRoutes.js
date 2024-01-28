const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({ storage });
const jwt = require('jsonwebtoken'); 
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || password !== user.password) {
      return res.status(401).json({ status: false, message: 'Invalid email or password' });
    }

    // Generate a token
    const token = jwt.sign({ userId: user._id }, 'Gf9$2!eKoPq6R#uA8lCpYz3Xt5Vb*1^7', { expiresIn: '7d' });

    // Store the token in the user's authToken field
    user.authToken = token;
    await user.save();

    return res.status(200).json({ status: true, userId: user._id, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
});

  
router.post('/users', upload.single('profileImage'), async (req, res) => {
  try {
    const { username, email, password,profileImage } = req.body;
    const newUser = await User.create({ username, email, password, profileImage });
    
    const token = jwt.sign({ userId: newUser._id }, 'Gf9$2!eKoPq6R#uA8lCpYz3Xt5Vb*1^7', { expiresIn: null });

    // Store the token in the user's authToken field
    newUser.authToken = token;
    await newUser.save();

    return res.status(201).json({ status: true, userId: newUser._id, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
});

router.get('/users/:userId', async (req, res) => {
    try {
      let userId = req.params.userId;
      userId = userId.trim();
      if (!userId) {
        return res.status(400).json({ status: false, message: 'Invalid User ID' });
      }
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ status: false, message: 'User not found' });
      }
      return res.status(200).json({ status: true, user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
});

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ status: false, message: 'Unauthorized: Missing token' });
  }

  try {
const tokenWithoutBearer = token.replace(/^Bearer\s/, '');
const decoded = jwt.verify(tokenWithoutBearer, 'Gf9$2!eKoPq6R#uA8lCpYz3Xt5Vb*1^7');

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ status: false, message: 'Unauthorized: Invalid token' });
  }
};

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    return res.status(200).json({ status: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
