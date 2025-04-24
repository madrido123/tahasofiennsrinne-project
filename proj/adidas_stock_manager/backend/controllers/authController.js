const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

console.log('JWT Secret:', process.env.JWT_SECRET ? 'Loaded' : 'Not Loaded');

const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';

exports.register = async (req, res) => {
  const { fullname, email, password } = req.body;
  console.log('Register attempt:', { fullname, email });
  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('Registration failed: user already exists:', email);
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }

    if (!fullname || !email || !password) {
      console.log('Registration failed: missing fields');
      return res.status(400).json({ status: 'error', message: 'Please fill all fields' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    await user.save();
    console.log('User registered successfully:', email);

    const payload = {
      user: {
        id: user.id,
      },
    };

    try {
      console.log('Using JWT secret of length:', jwtSecret.length);
      console.log('JWT secret (masked):', jwtSecret.substring(0, 4) + '...' + jwtSecret.substring(jwtSecret.length - 4));
      const token = jwt.sign(payload, jwtSecret, { expiresIn: '5h' });
      res.json({ status: 'success', token });
    } catch (error) {
      console.error('JWT sign synchronous error:', error);
      return res.status(500).json({ status: 'error', message: 'Token generation failed' });
    }
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email });
  try {
    let user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: user not found:', email);
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    if (!password) {
      console.log('Login failed: missing password');
      return res.status(400).json({ status: 'error', message: 'Password is required' });
    }

    if (password.startsWith('$2b$10$')) {
      console.log('Login failed: password appears to be hashed in request');
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Login failed: password mismatch');
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    console.log('User logged in successfully:', email);

    const payload = {
      user: {
        id: user.id,
      },
    };

    try {
      console.log('JWT Payload:', payload);
      console.log('Using JWT secret of length:', jwtSecret.length);
      console.log('JWT secret (masked):', jwtSecret.substring(0, 4) + '...' + jwtSecret.substring(jwtSecret.length - 4));
      if (!jwtSecret || jwtSecret.length < 10) {
        console.error('JWT secret is missing or too short');
        return res.status(500).json({ status: 'error', message: 'Token generation failed: invalid secret' });
      }
      const token = jwt.sign(payload, jwtSecret, { expiresIn: '5h' });
      res.json({ status: 'success', token, user: { id: user.id, fullname: user.fullname, email: user.email } });
    } catch (error) {
      console.error('JWT sign synchronous error:', error);
      return res.status(500).json({ status: 'error', message: 'Token generation failed' });
    }
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};


exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  console.log('Password reset attempt:', { email });
  try {
    let user = await User.findOne({ email });
    if (!user) {
      console.log('Password reset failed: user not found:', email);
      return res.status(400).json({ status: 'error', message: 'User not found' });
    }

    if (!newPassword) {
      console.log('Password reset failed: missing new password');
      return res.status(400).json({ status: 'error', message: 'New password is required' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    console.log('Password reset successful for:', email);
    res.json({ status: 'success', message: 'Password reset successful' });
  } catch (err) {
    console.error('Password reset error:', err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('fullname');
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.json({ status: 'success', user });
  } catch (err) {
    console.error('Get current user error:', err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
