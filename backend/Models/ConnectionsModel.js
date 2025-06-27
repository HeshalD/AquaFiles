//HELP// Models/ReviewModel.js
import mongoose from 'mongoose';

const connectionsSchema = new mongoose.Schema({
    connectionAccountNumber: {
        type: String,
        required: true,
        unique: true
    },
    ownerName: {
        type: String,
        required: true
    },
    connectionAddress: {
        type: String,
        required: true
    },
    ownerNIC: {
        type: String,
        required: true
    },
    ownerPhone: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    gramaNiladhariDivision: {
        type: String,
        required: false
    },
    divisionalSecretariat: {
        type: String,
        required: false
    },
    purpose: {
        type: String,
        required: true
    }
});

const Connection = mongoose.model('Connection', connectionsSchema);
export default Connection;
