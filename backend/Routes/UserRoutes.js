import express from 'express';
import User from '../Models/UserModel.js'; 
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/create-user', async (req, res) => {
  try {
    const { fullname,position,employeeID,username, password, role } = req.body;

    if (!['data_entry', 'data_viewing'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'Username taken' });

    const user = new User({ fullname,position,employeeID,username, password, role });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/commercial-officers', async (req, res) => {
  try {
    const commercialOfficers = await User.find({ position: 'Commercial Officer' });
    res.status(200).json(commercialOfficers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/area-engineers', async (req, res) => {
  try {
    const areaEngineers = await User.find({ position: 'Area Engineer' });
    res.status(200).json(areaEngineers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/ONM-engineers', async (req, res) => {
  try {
    const ONMEngineers = await User.find({ position: 'ONM Engineer' });
    res.status(200).json(ONMEngineers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
export default router;
