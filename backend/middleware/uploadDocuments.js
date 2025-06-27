import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const connectionAccountNumber = req.body.connectionAccountNumber;
      if (!connectionAccountNumber) {
        return cb(new Error('Missing connectionAccountNumber in form data'), false);
      }
  
      // Folder path: uploads/<connectionAccountNumber>
      const uploadDir = path.join('uploads', connectionAccountNumber);
  
      // Check if folder exists, if not create it
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // recursive:true creates nested folders if needed
      }
  
      cb(null, uploadDir);
    },
  
    filename: (req, file, cb) => {
      const connectionAccountNumber = req.body.connectionAccountNumber;
      const sanitizedName = file.originalname.replace(/\s+/g, '_');
      const newName = `${connectionAccountNumber}-${sanitizedName}`;
      cb(null, newName);
    }
  });
  

const fileFilter = (req, file, cb) => {
    if (path.extname(file.originalname) !== '.pdf') {
      return cb(new Error('Only PDF files are allowed'), false);
    }
    cb(null, true);
  };

  const upload = multer({ storage, fileFilter });

  export const uploadDocuments = upload.fields([
    { name: 'Deed', maxCount: 1 },
    { name: 'NICCopy', maxCount: 1 },
    { name: 'ConnectionForm', maxCount: 1 },
    { name: 'PayInVoucher', maxCount: 1 },
    { name: 'DepositSlip', maxCount: 1 },
    { name: 'RequestLetter', maxCount: 1 },
    { name: 'ApprovalLetter', maxCount: 1 },
    { name: 'ConsumerAgreement', maxCount: 1 },
    { name: 'Estimate', maxCount: 1 },
    { name: 'BoardAgreement', maxCount: 1 },
    { name: 'TechnicalReport', maxCount: 1 },
    { name: 'ConsumerReport', maxCount: 1 },
    { name: 'MeterReaderReport', maxCount: 1 },
    { name: 'CompletionReport', maxCount: 1 },
    { name: 'Other', maxCount: 5 }
  ]);