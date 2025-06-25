import mongoose from 'mongoose';
import Connection from './ConnectionsModel';

const DocumentsSchema = new mongoose.Schema({
    connectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Connection',
        unique: true,
        required: true
    },
    Deed: { filename: String, url: String, uploadedAt: Date },
    NICCopy: { filename: String, url: String, uploadedAt: Date },
    ConnectionForm: { filename: String, url: String, uploadedAt: Date },
    PayInVoucher: { filename: String, url: String, uploadedAt: Date },
    DepositSlip: { filename: String, url: String, uploadedAt: Date },
    PermissionLetter: { filename: String, url: String, uploadedAt: Date },
    ApprovalLetter: { filename: String, url: String, uploadedAt: Date },
    IncomeStatement: { filename: String, url: String, uploadedAt: Date },
    Estimate: { filename: String, url: String, uploadedAt: Date },
    Agreement: { filename: String, url: String, uploadedAt: Date },
    TechnicalReport: { filename: String, url: String, uploadedAt: Date },
    Deed: { filename: String, url: String, uploadedAt: Date },

});

const Documents = mongoose.model('Documents', DocumentsSchema);
export default Documents;
