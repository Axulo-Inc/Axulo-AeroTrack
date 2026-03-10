const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    console.log('📝 Registration attempt:', req.body);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;
    console.log('📧 Email:', email);
    console.log('👤 Name:', name);
    console.log('📱 Phone:', phone);

    // Check if user already exists
    console.log('🔍 Checking if user exists...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }
    console.log('✅ No existing user found');

    console.log('👤 Creating new user...');
    console.log('User data to create:', { name, email, phone, role: 'viewer' });
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'viewer' // Default role
    });
    
    console.log('✅ User created successfully!');
    console.log('📊 User ID:', user._id);
    console.log('📊 User role:', user.role);
    console.log('📊 Created at:', user.createdAt);

    // Generate token
    console.log('🔑 Generating token...');
    const token = generateToken(user._id);
    console.log('✅ Token generated successfully');

    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error('❌❌❌ REGISTRATION ERROR ❌❌❌');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    console.error('Full error object:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email and include password field
    console.log('🔍 Finding user...');
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('✅ User found:', user._id);

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User account deactivated:', email);
      return res.status(401).json({ message: 'Account has been deactivated' });
    }

    // Verify password
    console.log('🔑 Verifying password...');
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('✅ Password verified');

    // Update last login
    user.lastLogin = new Date();
    await user.save();
    console.log('✅ Last login updated');

    // Generate token
    console.log('🔑 Generating token...');
    const token = generateToken(user._id);
    console.log('✅ Token generated');

    res.json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error('❌❌❌ LOGIN ERROR ❌❌❌');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    console.log('👤 Getting profile for user:', req.user._id);
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    console.log('📝 Updating profile for user:', req.user._id);
    const { name, phone, preferences } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();
    console.log('✅ Profile updated');

    res.json({ success: true, user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    console.log('🔐 Changing password for user:', req.user._id);
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      console.log('❌ Current password incorrect');
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();
    console.log('✅ Password changed successfully');

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
};
