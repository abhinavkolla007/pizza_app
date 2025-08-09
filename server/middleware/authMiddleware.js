// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select('-password');
      
//       if (!req.user) {
//         return res.status(401).json({ message: 'Not authorized, user not found' });
//       }

//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }

//   if (!token) {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };

// const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       return res.status(403).json({ message: `User role ${req.user ? req.user.role : 'unauthenticated'} is not authorized to access this route` });
//     }
//     next();
//   };
// };

// module.exports = { protect, authorizeRoles };


// pizza-app/server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // CORRECTED: This path is often problematic in Vercel.

// To make it more robust, you could use an absolute path if needed, but
// for now, let's ensure the relative path is just '../models/User'
// and that User.js is correctly in the models folder.

// If the issue persists, a more advanced solution might be:
// const path = require('path');
// const User = require(path.join(__dirname, '../models/User'));

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role ${req.user ? req.user.role : 'unauthenticated'} is not authorized to access this route` });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };