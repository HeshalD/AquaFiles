import mongoose from 'mongoose';
import Connection from './ConnectionsModel.js';

const NameChangeSchema = new mongoose.Schema({
    connectionAccountNumber: {
        type: String,
        required: true,
    },
    connectionAccountName: {
        type: String,
        required: true
    },
    connectionAccountAddress: {
        type: String,
        required: true
    },
    newConnectionAccountName: {
        type: String,
        required: true
    },
    changeMethod: {
        type: String,
        required: true
    },
    formPreparationEmpID: {
        type: String,
        required: true
    },
    formPreparationEmpName:{
        type: String,
        required: true
    },
    formPreparationDate:{
        type: String,
        required: true
    },
    formExamineEmpID: {
        type: String,
        required: true
    },
    formExamineEmpName: {
        type: String,
        required: true
    },
    formExamineDate: {
        type: String,
        required: true
    },
    formApproval1Position: {
        type: String,
        required: true
    },
    formApproval1EmpID: {
        type: String,
        required: true
    },
    formApproval1Status: {
        type: String,
        required: true,
        default: "Not Approved"
    },
    fromApproval1Date: {
        type: String,
    },
    formApproval2Position: {
        type: String,
        required: true
    },
    formApproval2EmpID: {
        type: String,
        required: true
    },
    formApproval2Status: {
        type: String,
        required: true,
        default: "Not Approved"
    },
    fromApproval2Date: {
        type: String,
    },
    formApproval3Position: {
        type: String,
        required: true
    },
    formApproval3EmpID: {
        type: String,
        required: true
    },
    formApproval3Status: {
        type: String,
        required: true,
        default: "Not Approved"
    },
    fromApproval3Date: {
        type: String,
    }
    
});

const NameChange = mongoose.model('NameChange', NameChangeSchema);
export default NameChange;
