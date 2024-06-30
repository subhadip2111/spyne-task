const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateEmail, validatePassword } = require('../utils/validators');
const gravatar = require('gravatar');

// User signup
exports.signup = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ errors: [{ msg: 'Invalid email format' }] });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ errors: [{ msg: 'Password must be at least 6 characters and contain a number' }] });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

    user = new User({
      name,
      email,
      password,
      mobile,
      avatar
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ errors: [{ msg: 'Invalid email format' }] });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { name, email, mobile } = req.body;

  const userFields = {};
  if (name) userFields.name = name;
  if (email) userFields.email = email;
  if (mobile) userFields.mobile = mobile;

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await user.remove();

    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Search users by name
exports.searchUsersByName = async (req, res) => {
  try {
    const users = await User.find({
      name: new RegExp(req.params.name, 'i')
    }).select('-password');

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Follow user
exports.followUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const followUser = await User.findById(req.params.id);

    if (!followUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.following.includes(req.params.id)) {
      return res.status(400).json({ msg: 'User already followed' });
    }

    user.following.push(req.params.id);
    followUser.followers.push(req.user.id);

    await user.save();
    await followUser.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Unfollow user
exports.unfollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const followUser = await User.findById(req.params.id);

    if (!followUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.following = user.following.filter(
      (userId) => userId.toString() !== req.params.id
    );

    followUser.followers = followUser.followers.filter(
      (userId) => userId.toString() !== req.user.id
    );

    await user.save();
    await followUser.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
