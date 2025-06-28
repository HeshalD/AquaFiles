import express from 'express';
import Connection from '../Models/ConnectionsModel.js';
import Documents from '../Models/DocumentsModel.js';
import { uploadDocuments } from '../middleware/uploadDocuments.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import path from 'path';
import archiver from 'archiver';
import fs from 'fs';

const router = express.Router();

// POST /documents/upload
router.post('/upload', protect, authorize('data_entry'), uploadDocuments, async (req, res) => {
    try {
      const { connectionAccountNumber } = req.body;
      if (!connectionAccountNumber) {
        return res.status(400).json({ message: 'Missing connectionAccountNumber in form data' });
      }
  
      const connection = await Connection.findOne({ connectionAccountNumber });
      if (!connection) {
        return res.status(404).json({ message: 'Connection not found' });
      }
  
      const existingDocs = await Documents.findOne({ connectionAccountNumber });
      if (existingDocs) {
        return res.status(409).json({ message: 'Documents already uploaded for this connection' });
      }
  
      const requiredFields = [
        'Deed', 'NICCopy', 'ConnectionForm', 'PayInVoucher', 'DepositSlip',
        'RequestLetter', 'ApprovalLetter', 'ConsumerAgreement', 'Estimate',
        'BoardAgreement', 'TechnicalReport', 'ConsumerReport', 'MeterReaderReport', 'CompletionReport'
      ];
  
      const files = req.files || {};
      const missingFields = requiredFields.filter(field => !files[field] || files[field].length === 0);
      if (missingFields.length > 0) {
        return res.status(400).json({ message: `Missing required documents: ${missingFields.join(', ')}` });
      }
  
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
      await newDocs.save();
  
      res.status(201).json({ message: 'Documents uploaded successfully', documents: newDocs });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading documents', error: error.message });
    }
  });

// GET /documents - Get all documents
router.get('/', protect, authorize('data_viewing'), async (req, res) => {
    try {
        const documents = await Documents.find();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching documents', error: error.message });
    }
});

// GET /documents/:connectionAccountNumber - Get documents by connectionAccountNumber
router.get('/:connectionAccountNumber', protect, authorize('data_viewing','data_entry'), async (req, res) => {
    try {
        const { connectionAccountNumber } = req.params;
        const document = await Documents.findOne({ connectionAccountNumber });
        if (!document) {
            return res.status(404).json({ message: 'Documents not found for this connectionAccountNumber' });
        }
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching document', error: error.message });
    }
});

// PUT /documents/:connectionAccountNumber - Update documents by connectionAccountNumber
router.put('/:connectionAccountNumber', protect, authorize('data_entry'), uploadDocuments, async (req, res) => {
    try {
        const { connectionAccountNumber } = req.params;
        const document = await Documents.findOne({ connectionAccountNumber });
        if (!document) {
            return res.status(404).json({ message: 'Documents not found for this connectionAccountNumber' });
        }

        // Update document fields if new files are uploaded
        const files = req.files || {};
        const updateData = {};
        const fields = [
            'Deed', 'NICCopy', 'ConnectionForm', 'PayInVoucher', 'DepositSlip',
            'RequestLetter', 'ApprovalLetter', 'ConsumerAgreement', 'Estimate',
            'BoardAgreement', 'TechnicalReport', 'ConsumerReport', 'MeterReaderReport', 'CompletionReport', 'Other'
        ];
        fields.forEach(field => {
            if (files[field] && files[field][0]) {
                updateData[field] = {
                    filename: files[field][0].filename,
                    url: path.posix.join('uploads', connectionAccountNumber, files[field][0].filename),
                    uploadedAt: new Date()
                };
            }
        });
        // Optionally update other fields from req.body if needed
        // Object.assign(updateData, req.body);

        const updatedDocument = await Documents.findOneAndUpdate(
            { connectionAccountNumber },
            { $set: updateData },
            { new: true, runValidators: true }
        );
        res.status(200).json({ message: 'Documents updated successfully', documents: updatedDocument });
    } catch (error) {
        res.status(400).json({ message: 'Error updating documents', error: error.message });
    }
});

// DELETE /documents/:connectionAccountNumber - Delete documents by connectionAccountNumber
router.delete('/:connectionAccountNumber', protect, authorize('data_entry'), async (req, res) => {
    try {
        const { connectionAccountNumber } = req.params;
        const deletedDocument = await Documents.findOneAndDelete({ connectionAccountNumber });
        if (!deletedDocument) {
            return res.status(404).json({ message: 'Documents not found for this connectionAccountNumber' });
        }
        res.status(200).json({ message: 'Documents deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting documents', error: error.message });
    }
});

//Download all documents
router.get('/:connectionAccountNumber/download', protect, authorize('data_viewing'), async (req, res) => {
  const { connectionAccountNumber } = req.params;

  try {
    const documents = await Documents.findOne({ connectionAccountNumber });
    if (!documents) {
      return res.status(404).json({ message: 'Documents not found' });
    }

    const archive = archiver('zip', { zlib: { level: 9 } });
    const zipFileName = `${connectionAccountNumber}_documents.zip`;

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${zipFileName}"`,
    });

    archive.pipe(res);

    // Add each file to the archive
    for (const [key, value] of Object.entries(documents.toObject())) {
      if (typeof value === 'object' && value.url) {
        const filePath = path.join('uploads', connectionAccountNumber, value.filename);
        if (fs.existsSync(filePath)) {
          archive.file(filePath, { name: value.filename });
        }
      }
    }

    // Add "Other" files (if available)
    if (Array.isArray(documents.Other)) {
      for (const file of documents.Other) {
        const filePath = path.join('uploads', connectionAccountNumber, file.filename);
        if (fs.existsSync(filePath)) {
          archive.file(filePath, { name: file.filename });
        }
      }
    }

    await archive.finalize();
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ message: 'Failed to create zip', error: err.message });
  }
});

export default router;
