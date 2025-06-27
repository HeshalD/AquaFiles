import express from 'express';
import User from '../Models/UserModel.js'; 
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/create-user', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!['data_entry', 'data_viewing'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'Username taken' });

    const user = new User({ username, password, role });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
