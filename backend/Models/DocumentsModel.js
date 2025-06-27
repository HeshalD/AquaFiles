import mongoose from 'mongoose';
import Connection from './ConnectionsModel.js';

const DocumentsSchema = new mongoose.Schema({
    connectionAccountNumber: {
        type: String,
        required: true,
        unique: true
    },
    Deed: { filename: String, url: String, uploadedAt: Date },
    NICCopy: { filename: String, url: String, uploadedAt: Date },
    ConnectionForm: { filename: String, url: String, uploadedAt: Date },
    PayInVoucher: { filename: String, url: String, uploadedAt: Date },
    DepositSlip: { filename: String, url: String, uploadedAt: Date },
    RequestLetter: { filename: String, url: String, uploadedAt: Date },
    ApprovalLetter: { filename: String, url: String, uploadedAt: Date },
    ConsumerAgreement: { filename: String, url: String, uploadedAt: Date },
    Estimate: { filename: String, url: String, uploadedAt: Date },
    BoardAgreement: { filename: String, url: String, uploadedAt: Date },
    TechnicalReport: { filename: String, url: String, uploadedAt: Date },
    ConsumerReport: { filename: String, url: String, uploadedAt: Date },
    MeterReaderReport: { filename: String, url: String, uploadedAt: Date },
    CompletionReport: { filename: String, url: String, uploadedAt: Date },
    Other: { filename: String, url: String, uploadedAt: Date },
    
});

const Documents = mongoose.model('Documents', DocumentsSchema);
export default Documents;
