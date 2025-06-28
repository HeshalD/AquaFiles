import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function UploadDocuments() {
  const [files, setFiles] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const connection = localStorage.getItem('connectionData');
    if (!connection) {
      alert('No connection data found. Please fill the form first.');
      navigate('/data-entry');
    }
  }, []);

  const handleFileChange = e => {
    setFiles({ ...files, [e.target.name]: e.target.files });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const connectionData = JSON.parse(localStorage.getItem('connectionData'));
    if (!connectionData) return alert('Missing connection data');

    const formData = new FormData();
    Object.entries(connectionData).forEach(([key, val]) => formData.append(key, val));

    // Append files
    for (const name in files) {
      for (const file of files[name]) {
        formData.append(name, file);
      }
    }

    try {
      await axios.post('/connections/complete', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Connection and documents saved!');
      localStorage.removeItem('connectionData');
      navigate('/data-entry'); // or success page
    } catch (err) {
      alert('Error uploading documents');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 mx-auto w-full max-w-lg bg-white rounded shadow-md">
      <h2 className="mb-4 text-xl">Upload Required Documents</h2>
      {['Deed', 'NICCopy', 'ConnectionForm', 'PayInVoucher', 'DepositSlip',
        'RequestLetter', 'ApprovalLetter', 'ConsumerAgreement', 'Estimate',
        'BoardAgreement', 'TechnicalReport', 'ConsumerReport', 'MeterReaderReport', 'CompletionReport']
        .map(field => (
          <div key={field}>
            <label>{field}</label>
            <input type="file" name={field} onChange={handleFileChange} className="mb-3 w-full" />
          </div>
        ))
      }
      <label>Other (optional)</label>
      <input type="file" name="Other" multiple onChange={handleFileChange} className="mb-4 w-full" />

      <button type="submit" className="py-2 w-full text-white bg-green-600 rounded">Submit All</button>
    </form>
  );
}
