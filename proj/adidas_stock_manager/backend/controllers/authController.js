const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register user
exports.register = async (req, res) => {
  const { fullname, email, password } = req.body;
  console.log('Registering user:', { fullname, email }); // Log registration attempt

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email); // Log if user exists
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }

    user = new User({
      fullname,
      email,
      password,
    });

    await user.save();
    console.log('User registered successfully:', user); // Log successful registration

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
        if (err) throw err;
        res.json({ status: 'success', token });
      }
    );
  } catch (err) {
    console.error('Registration error:', err.message); // Log registration error
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Logging in user:', { email }); // Log login attempt

  try {
    let user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid credentials: User not found', email); // Log if user not found
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials: Password mismatch'); // Log if password does not match
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

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
        if (err) throw err;
        res.json({ status: 'success', token });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message); // Log login error
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
