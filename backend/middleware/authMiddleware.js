import jwt from 'jsonwebtoken';
import User from '../Models/UserModel.js';

export const protect = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: 'Not authorized (session missing)' });
    }
    
    // Populate req.user with user data from database
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized (invalid session)' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.session || !roles.includes(req.session.role)) {
      return res.status(403).json({ message: 'Access denied (role mismatch)' });
    }
    next();
  };
};
