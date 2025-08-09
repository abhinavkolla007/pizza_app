// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const User = require('../models/User');
// const { protect } = require('../middleware/authMiddleware');
// const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '1h',
//   });
// };

// router.post('/register', async (req, res) => {
//   const { name, email, password, role } = req.body;
//   console.log(`[Registration] New registration attempt for: ${email}`);
//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       console.log(`[Registration] User already exists: ${email}`);
//       return res.status(400).json({ message: 'User already exists' });
//     }
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const verificationToken = crypto.randomBytes(32).toString('hex');
//     user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role: role || 'user',
//       verificationToken,
//     });
//     await user.save();
//     console.log(`[Registration] New user created: ${user.email} with token ${user.verificationToken}`);
//     await sendVerificationEmail(user.email, user.verificationToken);
//     res.status(201).json({ message: 'Registration successful! Please verify your email.' });
//   } catch (error) {
//     console.error("[Registration] Server error:", error);
//     res.status(500).json({ message: 'Server error during registration' });
//   }
// });

// router.get('/verify-email', async (req, res) => {
//   const { token } = req.query;
//   console.log(`[Verification] Attempting to verify user with token: ${token}`);

//   try {
//     const updatedUser = await User.findOneAndUpdate(
//       { verificationToken: token, isVerified: false },
//       { isVerified: true, verificationToken: undefined },
//       { new: true, runValidators: true }
//     );

//     if (!updatedUser) {
//       console.log(`[Verification] FAILURE: Token ${token} is invalid, expired, or user already verified.`);
//       return res.redirect(`${process.env.CLIENT_URL}/?verified=false`);
//     }

//     console.log(`[Verification] SUCCESS: User ${updatedUser.email} successfully verified!`);

//     res.redirect(`${process.env.CLIENT_URL}/?verified=true`);

//   } catch (error) {
//     console.error(`[Verification] FATAL ERROR during email verification for token ${token}:`, error);
//     res.status(500).json({ message: 'Server error during email verification' });
//   }
// });


// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   console.log(`[Login] Login attempt for: ${email}`);
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }
//     if (!user.isVerified) {
//       console.log(`[Login] FAILED: User ${email} is not verified.`);
//       return res.status(401).json({ message: 'Please verify your email address first.' });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log(`[Login] FAILED: Invalid password for user ${email}.`);
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }
//     const token = generateToken(user._id);
//     console.log(`[Login] SUCCESS: User ${email} logged in.`);
//     res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
//   } catch (error) {
//     console.error("[Login] Server error:", error);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// });

// router.post('/forgot-password', async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User with that email does not exist.' });
//     }
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     user.passwordResetToken = resetToken;
//     user.passwordResetExpires = Date.now() + 3600000;
//     await user.save();
//     await sendPasswordResetEmail(user.email, resetToken);
//     res.status(200).json({ message: 'Password reset link sent to your email.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error during forgot password request' });
//   }
// });
// router.post('/reset-password', async (req, res) => {
//   const { token, newPassword } = req.body;
//   try {
//     const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });
//     if (!user) {
//       return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
//     }
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save();
//     res.status(200).json({ message: 'Password has been reset successfully.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error during password reset' });
//   }
// });
// router.get('/me', protect, async (req, res) => {
//   res.status(200).json({
//     user: {
//       id: req.user._id,
//       name: req.user.name,
//       email: req.user.email,
//       role: req.user.role,
//       isVerified: req.user.isVerified,
//     },
//   });
// });

// module.exports = router;


// pizza-app/server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require('path'); // Import path module
const User = require(path.join(__dirname, '../models/User')); // Use absolute path
const { protect } = require('../middleware/authMiddleware');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(`[Registration] New registration attempt for: ${email}`);
  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log(`[Registration] User already exists: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      verificationToken,
    });
    await user.save();
    console.log(`[Registration] New user created: ${user.email} with token ${user.verificationToken}`);
    await sendVerificationEmail(user.email, user.verificationToken);
    res.status(201).json({ message: 'Registration successful! Please verify your email.' });
  } catch (error) {
    console.error("[Registration] Server error:", error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  console.log(`[Verification] Attempting to verify user with token: ${token}`);
  
  try {
    const updatedUser = await User.findOneAndUpdate(
      { verificationToken: token, isVerified: false },
      { isVerified: true, verificationToken: undefined },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.log(`[Verification] FAILURE: Token ${token} is invalid, expired, or user already verified.`);
      return res.redirect(`http://localhost:3000/?verified=false`);
    }

    console.log(`[Verification] SUCCESS: User ${updatedUser.email} successfully verified!`);
    
    res.redirect(`http://localhost:3000/?verified=true`);

  } catch (error) {
    console.error(`[Verification] FATAL ERROR during email verification for token ${token}:`, error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`[Login] Login attempt for: ${email}`);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (!user.isVerified) {
      console.log(`[Login] FAILED: User ${email} is not verified.`);
      return res.status(401).json({ message: 'Please verify your email address first.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`[Login] FAILED: Invalid password for user ${email}.`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    console.log(`[Login] SUCCESS: User ${email} logged in.`);
    res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("[Login] Server error:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User with that email does not exist.' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000;
    await user.save();
    await sendPasswordResetEmail(user.email, resetToken);
    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during forgot password request' });
  }
});
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});
router.get('/me', protect, async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isVerified: req.user.isVerified,
    },
  });
});

module.exports = router;