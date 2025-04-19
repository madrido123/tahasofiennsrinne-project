
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

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

    user = new User({
      fullname,
      email,
      password,
    });

    await user.save();
    console.log('User registered successfully:', email);

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) {
          console.error('JWT sign error:', err);
          return res.status(500).json({ status: 'error', message: 'Token generation failed' });
        }
        res.json({ status: 'success', token });
      }
    );
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Login user
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

    // If password looks like a bcrypt hash, reject login attempt
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

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) {
          console.error('JWT sign error:', err);
          return res.status(500).json({ status: 'error', message: 'Token generation failed' });
        }
        res.json({ status: 'success', token });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Password reset
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
0