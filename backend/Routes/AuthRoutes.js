import express from 'express';
import User from '../Models/UserModel.js';
import jwt from 'jsonwebtoken';
import session from 'express-session';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  

  req.session.userId = user._id;
  req.session.role = user.role;

  res.status(200).json({ token, role: user.role });
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ message: 'Logout failed' });
      res.clearCookie('connect.sid'); 
      res.json({ message: 'Logged out successfully' });
    });
  });

export default router;
