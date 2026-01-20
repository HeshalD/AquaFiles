import jwt from 'jsonwebtoken';
import User from '../Models/UserModel.js';

export const protect = async (req, res, next) => {
  try {
    console.log('Protect middleware - Session:', req.session);
    console.log('Protect middleware - Session userId:', req.session?.userId);
    
    if (!req.session || !req.session.userId) {
      console.log('Authentication failed: Session missing or userId not found');
      return res.status(401).json({ message: 'Not authorized (session missing)' });
    }
    
    // Populate req.user with user data from database
    const user = await User.findById(req.session.userId);
    if (!user) {
      console.log('Authentication failed: User not found for userId:', req.session.userId);
      return res.status(401).json({ message: 'User not found' });
    }
    
    console.log('Authentication successful - User:', user);
    req.user = user;
    next();
  } catch (error) {
    console.error('Protect middleware error:', error);
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
