import express from 'express';
import NameChange from '../Models/NameChangeModel.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /namechange/add - Add a new name change form
router.post('/add', protect, authorize('data_entry'), async (req, res) => {
    try {
        const {
            connectionAccountNumber,
            connectionAccountName,
            connectionAccountAddress,
            newConnectionAccountName,
            changeMethod,
            formPreparationEmpID,
            formPreparationEmpName,
            formPreparationDate,
            formApproval1Position,
            formApproval1EmpID,
            formApproval2Position,
            formApproval2EmpID,
            formApproval3Position,
            formApproval3EmpID
        } = req.body;

        const newNameChange = new NameChange({
            connectionAccountNumber,
            connectionAccountName,
            connectionAccountAddress,
            newConnectionAccountName,
            changeMethod,
            formPreparationEmpID,
            formPreparationEmpName,
            formPreparationDate,
            formApproval1Position,
            formApproval1EmpID,
            formApproval2Position,
            formApproval2EmpID,
            formApproval3Position,
            formApproval3EmpID
        });

        await newNameChange.save();
        res.status(201).json({ message: 'Name change form created successfully', nameChange: newNameChange });
    } catch (error) {
        res.status(400).json({ message: 'Error creating name change form', error: error.message });
    }
});

// PUT /namechange/approval1/:id - Change approval 1 status
router.put('/approval1/:id', protect, authorize('data_viewing'), async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status || (status !== 'Approved' && status !== 'Rejected')) {
            return res.status(400).json({ message: 'Invalid status. Must be "Approved" or "Rejected"' });
        }

        const updatedNameChange = await NameChange.findByIdAndUpdate(
            req.params.id,
            { 
                formApproval1Status: status,
                fromApproval1Date: new Date().toISOString()
            },
            { new: true, runValidators: true }
        );

        if (!updatedNameChange) {
            return res.status(404).json({ message: 'Name change form not found' });
        }

        res.status(200).json({ message: 'Approval 1 status updated successfully', nameChange: updatedNameChange });
    } catch (error) {
        res.status(400).json({ message: 'Error updating approval 1 status', error: error.message });
    }
});

// PUT /namechange/approval2/:id - Change approval 2 status
router.put('/approval2/:id', protect, authorize('data_viewing'), async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status || (status !== 'Approved' && status !== 'Rejected')) {
            return res.status(400).json({ message: 'Invalid status. Must be "Approved" or "Rejected"' });
        }

        const updatedNameChange = await NameChange.findByIdAndUpdate(
            req.params.id,
            { 
                formApproval2Status: status,
                fromApproval2Date: new Date().toISOString()
            },
            { new: true, runValidators: true }
        );

        if (!updatedNameChange) {
            return res.status(404).json({ message: 'Name change form not found' });
        }

        res.status(200).json({ message: 'Approval 2 status updated successfully', nameChange: updatedNameChange });
    } catch (error) {
        res.status(400).json({ message: 'Error updating approval 2 status', error: error.message });
    }
});

// PUT /namechange/approval3/:id - Change approval 3 status
router.put('/approval3/:id', protect, authorize('data_viewing'), async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status || (status !== 'Approved' && status !== 'Rejected')) {
            return res.status(400).json({ message: 'Invalid status. Must be "Approved" or "Rejected"' });
        }

        const updatedNameChange = await NameChange.findByIdAndUpdate(
            req.params.id,
            { 
                formApproval3Status: status,
                fromApproval3Date: new Date().toISOString()
            },
            { new: true, runValidators: true }
        );

        if (!updatedNameChange) {
            return res.status(404).json({ message: 'Name change form not found' });
        }

        res.status(200).json({ message: 'Approval 3 status updated successfully', nameChange: updatedNameChange });
    } catch (error) {
        res.status(400).json({ message: 'Error updating approval 3 status', error: error.message });
    }
});

// GET /namechange - Get all name change forms
router.get('/', protect, authorize('data_viewing'), async (req, res) => {
    try {
        const nameChanges = await NameChange.find().sort({ createdAt: -1 });
        res.status(200).json(nameChanges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching name change forms', error: error.message });
    }
});

// GET /namechange/:id - Get a specific name change form
router.get('/:id', protect, authorize('data_viewing'), async (req, res) => {
    try {
        const nameChange = await NameChange.findById(req.params.id);
        if (!nameChange) {
            return res.status(404).json({ message: 'Name change form not found' });
        }
        res.status(200).json(nameChange);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching name change form', error: error.message });
    }
});

// GET /namechange/connection/:connectionAccountNumber - Get name change forms by connection account number
router.get('/connection/:connectionAccountNumber', protect, authorize('data_viewing'), async (req, res) => {
    try {
        const nameChanges = await NameChange.find({ connectionAccountNumber: req.params.connectionAccountNumber });
        if (nameChanges.length === 0) {
            return res.status(404).json({ message: 'No name change forms found for this connection account number' });
        }
        res.status(200).json(nameChanges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching name change forms', error: error.message });
    }
});

// GET /namechange/approval1/:formApproval1EmpID - Get name change forms by formApproval1EmpID
router.get('/approval1/:formApproval1EmpID', protect, authorize('data_viewing'), async (req, res) => {
    try {
        const nameChanges = await NameChange.find({ formApproval1EmpID: req.params.formApproval1EmpID });
        res.status(200).json(nameChanges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching name change forms', error: error.message });
    }
});

// GET /namechange/approval2/:formApproval2EmpID - Get name change forms by formApproval2EmpID
router.get('/approval2/:formApproval2EmpID', protect, authorize('data_viewing'), async (req, res) => {
    try {
        const nameChanges = await NameChange.find({ formApproval2EmpID: req.params.formApproval2EmpID });
        res.status(200).json(nameChanges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching name change forms', error: error.message });
    }
});

// GET /namechange/approval3/:formApproval3EmpID - Get name change forms by formApproval3EmpID
router.get('/approval3/:formApproval3EmpID', protect, authorize('data_viewing'), async (req, res) => {
    try {
        const nameChanges = await NameChange.find({ formApproval3EmpID: req.params.formApproval3EmpID });
        res.status(200).json(nameChanges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching name change forms', error: error.message });
    }
});

// GET /namechange/my-approvals - Get name change forms where logged-in user is an approver
router.get('/my-approvals', protect, authorize('data_viewing'), async (req, res) => {
    try {
        console.log('User in my-approvals:', req.user);
        console.log('EmployeeID:', req.user.employeeID);
        
        const employeeID = req.user.employeeID;
        const nameChanges = await NameChange.find({
            $or: [
                { formApproval1EmpID: employeeID },
                { formApproval2EmpID: employeeID },
                { formApproval3EmpID: employeeID }
            ]
        }).sort({ createdAt: -1 });
        
        console.log('Found name changes:', nameChanges.length);
        res.status(200).json(nameChanges);
    } catch (error) {
        console.error('Error in my-approvals:', error);
        res.status(500).json({ message: 'Error fetching name change forms', error: error.message });
    }
});

export default router;
