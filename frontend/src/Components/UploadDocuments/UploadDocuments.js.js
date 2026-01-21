import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../Hooks/useLogout';
import { LogOut, FileText, Upload, ArrowLeft, Check, X, AlertCircle } from 'lucide-react';

export default function UploadDocuments() {
  const [files, setFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [connectionData, setConnectionData] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const navigate = useNavigate();
  const logout = useLogout();

  const documentFields = [
    'Deed',
    'NIC Copy', 
    'Connection Form',
    'Pay In Voucher',
    'Deposit Slip',
    'Request Letter',
    'Approval Letter',
    'Consumer Agreement',
    'Estimate',
    'Board Agreement',
    'Technical Report',
    'Consumer Report',
    'Meter Reader Report',
    'Completion Report'
  ];

  useEffect(() => {
    const connection = localStorage.getItem('connectionData');
    if (!connection) {
      alert('No connection data found. Please fill the form first.');
      navigate('/data-entry');
    } else {
      setConnectionData(JSON.parse(connection));
    }
  }, []);

  const handleFileChange = e => {
    setFiles({ ...files, [e.target.name]: e.target.files });
  };

  const handleRemoveFile = (fieldName) => {
    const newFiles = { ...files };
    delete newFiles[fieldName];
    setFiles(newFiles);
  };

  const getFileName = (fieldName) => {
    const fieldFiles = files[fieldName];
    if (fieldFiles && fieldFiles.length > 0) {
      return fieldFiles.length === 1 ? fieldFiles[0].name : `${fieldFiles.length} files selected`;
    }
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();

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
      setUploading(true);
      await axios.post('/connections/complete', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Connection and documents saved successfully!');
      localStorage.removeItem('connectionData');
      navigate('/data-entry');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading documents. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    localStorage.removeItem('connectionData');
    navigate('/data-entry');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#510400' }}>
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <h1 className="text-2xl font-semibold" style={{ color: '#510400' }}>RecordRoom</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/data-entry')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-md"
              style={{ backgroundColor: '#510400' }}
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
            
            <button
              onClick={() => navigate('/name-change')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-md"
              style={{ backgroundColor: '#650015' }}
            >
              <FileText size={18} />
              <span className="hidden sm:inline">Name Change</span>
            </button>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Upload Documents</h1>
          <p className="text-gray-600">Upload required documents for connection: {connectionData?.connectionAccountNumber}</p>
        </div>

        {/* Connection Summary */}
        {connectionData && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Connection Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Account Number</p>
                <p className="font-medium text-gray-900">{connectionData.connectionAccountNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Owner Name</p>
                <p className="font-medium text-gray-900">{connectionData.ownerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Purpose</p>
                <p className="font-medium text-gray-900">{connectionData.purpose}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Form */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Required Documents</h2>
                <p className="text-sm text-gray-500 mt-1">Please upload all required documents</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <AlertCircle size={16} />
                <span>Accepted formats: PDF, JPG, PNG</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {documentFields.map(field => {
                const fieldName = field.replace(/\s+/g, '');
                const hasFile = files[fieldName] && files[fieldName].length > 0;
                
                return (
                  <div key={field} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-medium text-gray-800 flex items-center space-x-2">
                        {hasFile && <Check size={16} className="text-green-600" />}
                        <span>{field}</span>
                      </label>
                      {hasFile && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(fieldName)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="relative">
                      <input
                        type="file"
                        name={fieldName}
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      {getFileName(fieldName) && (
                        <p className="mt-2 text-sm text-gray-600">Selected: {getFileName(fieldName)}</p>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Other Documents */}
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-medium text-gray-800 flex items-center space-x-2">
                    {files.Other && files.Other.length > 0 && <Check size={16} className="text-green-600" />}
                    <span>Other Documents (Optional)</span>
                  </label>
                  {files.Other && files.Other.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('Other')}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <input
                    type="file"
                    name="Other"
                    multiple
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {getFileName('Other') && (
                    <p className="mt-2 text-sm text-gray-600">Selected: {getFileName('Other')}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={uploading}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  {Object.keys(files).length} document types selected
                </span>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center space-x-2 px-6 py-3 text-white font-medium rounded-lg transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: uploading ? '#9ca3af' : '#510400' }}
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>Submit All Documents</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Confirmation Dialog */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Cancel Upload</h3>
                <p className="text-sm text-gray-600">Are you sure you want to cancel? All entered data will be lost.</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                No, Continue
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
