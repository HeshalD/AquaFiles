import express from 'express';
import Connection from '../Models/ConnectionsModel.js';

const connectionsRouter = express.Router();

// Route to insert a new connection
connectionsRouter.post('/add', async (req, res) => {
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

        await newConnection.save();
        res.status(201).json({ message: 'Connection added successfully', connection: newConnection });
    } catch (error) {
        res.status(400).json({ message: 'Error adding connection', error: error.message });
    }
});

// Route to get all connections
connectionsRouter.get('/', async (req, res) => {
    try {
        const connections = await Connection.find();
        res.status(200).json(connections);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching connections', error: error.message });
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
