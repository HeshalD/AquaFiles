import express from 'express';
import mongoose from 'mongoose';
import Connection from '../Models/ConnectionsModel.js';
import Documents from '../Models/DocumentsModel.js';
import User from '../Models/UserModel.js';
import { uploadDocuments } from '../middleware/uploadDocuments.js';
import path from 'path';
import fsPromises from 'fs/promises';
import fs from 'fs';
import { protect,authorize } from '../middleware/authMiddleware.js';
import bcrypt from 'bcryptjs';


const connectionsRouter = express.Router();

// Route to insert a new connection
connectionsRouter.post('/complete', uploadDocuments, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const {
        connectionAccountNumber,
        ownerName,
        connectionAddress,
        ownerNIC,
        ownerPhone,
        area,
        gramaNiladhariDivision,
        divisionalSecretariat,
        purpose
      } = req.body;
  
      const files = req.files || {};
      const requiredFields = [
        'Deed', 'NICCopy', 'ConnectionForm', 'PayInVoucher', 'DepositSlip',
        'RequestLetter', 'ApprovalLetter', 'ConsumerAgreement', 'Estimate',
        'BoardAgreement', 'TechnicalReport', 'ConsumerReport', 'MeterReaderReport', 'CompletionReport'
      ];
  
      const missingFields = requiredFields.filter(field => !files[field] || files[field].length === 0);
      if (missingFields.length > 0) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Missing required documents: ${missingFields.join(', ')}` });
      }
  
      // Create connection document
      const newConnection = new Connection({
        connectionAccountNumber,
        ownerName,
        connectionAddress,
        ownerNIC,
        ownerPhone,
        area,
        gramaNiladhariDivision,
        divisionalSecretariat,
        purpose
      });
  
      await newConnection.save({ session });
  
      // Prepare document data
      const docData = { connectionAccountNumber };
      requiredFields.forEach(field => {
        const file = files[field][0];
        docData[field] = {
          filename: file.filename,
          url: path.posix.join('uploads', connectionAccountNumber, file.filename),
          uploadedAt: new Date()
        };
      });
  
      if (files['Other']) {
        docData['Other'] = files['Other'].map(file => ({
          filename: file.filename,
          url: path.posix.join('uploads', connectionAccountNumber, file.filename),
          uploadedAt: new Date()
        }));
      }
  
      const newDocs = new Documents(docData);
      await newDocs.save({ session });
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(201).json({ message: 'Connection and documents uploaded successfully' });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: 'Error saving data', error: error.message });
    }
  });
  
// Route to get all connections
// GET /connections?page=1&limit=10&search=&area=&purpose=
connectionsRouter.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search = '', area = '', purpose = '' } = req.query;

    // Build a dynamic filter object
    const filter = {};

    // If search term is provided, check multiple fields (case-insensitive regex)
    if (search.trim() !== '') {
      filter.$or = [
        { connectionAccountNumber: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { ownerNIC: { $regex: search, $options: 'i' } },
        { ownerPhone: { $regex: search, $options: 'i' } },
      ];
    }

    // Apply area filter if provided
    if (area.trim() !== '') {
      filter.area = area;
    }

    // Apply purpose filter if provided
    if (purpose.trim() !== '') {
      filter.purpose = purpose;
    }

    const total = await Connection.countDocuments(filter);
    const connections = await Connection.find(filter)
      .sort({ connectionAccountNumber: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      connections,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching connections', error: error.message });
  }
});


// Route to get a connection by connectionAccountNumber
connectionsRouter.get('/:connectionAccountNumber', async (req, res) => {
    try {
        const connection = await Connection.findOne({ connectionAccountNumber: req.params.connectionAccountNumber });
        if (!connection) {
            return res.status(404).json({ message: 'Connection not found' });
        }
        res.status(200).json(connection);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching connection', error: error.message });
    }
});

// Route to get a connection by id
connectionsRouter.get('/:id', async (req, res) => {
    try {
        const connection = await Connection.findById(req.params.id);
        if (!connection) {
            return res.status(404).json({ message: 'Connection not found' });
        }
        res.status(200).json(connection);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching connection', error: error.message });
    }
});

// Route to update a connection by id
connectionsRouter.put('/:id', async (req, res) => {
    try {
        const updatedConnection = await Connection.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedConnection) {
            return res.status(404).json({ message: 'Connection not found' });
        }
        res.status(200).json({ message: 'Connection updated successfully', connection: updatedConnection });
    } catch (error) {
        res.status(400).json({ message: 'Error updating connection', error: error.message });
    }
});

// PUT /connections/account/:connectionAccountNumber
connectionsRouter.put('/account/:connectionAccountNumber', async (req, res) => {
  try {
    const { connectionAccountNumber } = req.params;

    // Prevent updating connectionAccountNumber itself:
    if (req.body.connectionAccountNumber) {
      delete req.body.connectionAccountNumber;
    }

    const updatedConnection = await Connection.findOneAndUpdate(
      { connectionAccountNumber },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedConnection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    res.status(200).json({ message: 'Connection updated successfully', connection: updatedConnection });
  } catch (error) {
    res.status(400).json({ message: 'Error updating connection', error: error.message });
  }
});

// Route to delete a connection by connectionAccountNumber (MUST come before /:id route)
connectionsRouter.delete('/:connectionAccountNumber', protect, authorize('data_entry'), async (req, res) => {
  try {
    const { connectionAccountNumber } = req.params;
    const { password } = req.body;

    console.log('User ID:', req.user._id);
    console.log('Password:', password);

    if (!password) {
      return res.status(400).json({ message: 'Password is required for deletion' });
    }

    // Find user who is requesting deletion
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Delete connection and documents (make sure to remove files as before)
    const connection = await Connection.findOneAndDelete({ connectionAccountNumber });
    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    const documents = await Documents.findOneAndDelete({ connectionAccountNumber });
    if (documents) {
      // Remove files from local storage (like you did before)
      const uploadDir = path.join('uploads', connectionAccountNumber);
      if (fs.existsSync(uploadDir)) {
        await fsPromises.rm(uploadDir, { recursive: true, force: true });
      }
    }

    res.status(200).json({ message: 'Connection and documents deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting connection', error: error.message });
  }
});

// Route to delete a connection by id
connectionsRouter.delete('/:id', async (req, res) => {
    try {
        const deletedConnection = await Connection.findByIdAndDelete(req.params.id);
        if (!deletedConnection) {
            return res.status(404).json({ message: 'Connection not found' });
        }
        res.status(200).json({ message: 'Connection deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting connection', error: error.message });
    }
});

export default connectionsRouter;
