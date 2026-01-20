import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import useLogout from '../../Hooks/useLogout';

function NameChangeExamine() {
  const [nameChanges, setNameChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [employeeID] = useState(localStorage.getItem('employeeID'));
  const [fullName] = useState(localStorage.getItem('fullname'));
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const logout = useLogout();

  useEffect(() => {
    fetchNameChangesToExamine();
  }, []);

  const fetchNameChangesToExamine = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/namechange');
      
      // Filter forms that have empty examine fields
      const formsToExamine = response.data.filter(form => 
        !form.formExamineEmpID || !form.formExamineEmpName || !form.formExamineDate
      );
      
      setNameChanges(formsToExamine);
      setError('');
    } catch (err) {
      setError('Failed to fetch name change forms');
      console.error('Error fetching name change forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnectionDetails = async (connectionAccountNumber) => {
    try {
      setDetailsLoading(true);
      const response = await axios.get(`/connections/${connectionAccountNumber}`);
      setSelectedConnection(response.data);
      setShowConnectionModal(true);
    } catch (err) {
      alert('Failed to fetch connection details');
      console.error('Error fetching connection details:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const fetchDocuments = async (connectionAccountNumber) => {
    try {
      setDetailsLoading(true);
      const response = await axios.get(`/documents/${connectionAccountNumber}`);
      setSelectedDocuments(response.data);
      setShowDocumentsModal(true);
    } catch (err) {
      alert('Failed to fetch documents');
      console.error('Error fetching documents:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const downloadDocuments = async (connectionAccountNumber) => {
    try {
      window.open(`http://localhost:5000/documents/${connectionAccountNumber}/download`, '_blank');
    } catch (err) {
      alert('Failed to download documents');
      console.error('Error downloading documents:', err);
    }
  };

  const handleExamine = async () => {
    try {
      console.log('EmployeeID:', employeeID);
      console.log('FullName:', fullName);
      
      if (!employeeID || !fullName) {
        alert('Employee ID or Full Name is missing. Please login again.');
        return;
      }

      const response = await axios.put(`/namechange/examine/${employeeID}`, {
        formExamineEmpName: fullName
      });
      
      console.log('Examine response:', response.data);
      
      // Refresh the list to remove the examined forms
      fetchNameChangesToExamine();
    } catch (err) {
      console.error('Error examining forms:', err.response?.data || err.message);
      alert(`Failed to examine name change forms: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <div className="mb-8 text-center">
        <button 
          onClick={logout} 
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors mb-4"
        >
          Logout
        </button>
        <h1 className="text-4xl font-bold text-slate-700 mb-2">Name Change Forms to Examine</h1>
        <p className="text-lg text-gray-500">Forms requiring examination</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {nameChanges.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">No name change forms found requiring examination.</p>
        </div>
      ) : (
        <>
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white text-center">
            <h3 className="text-xl font-semibold mb-3">Examine All Forms</h3>
            <p className="mb-4 opacity-90">You are about to examine all {nameChanges.length} unexamined forms as:</p>
            <p className="font-medium text-lg mb-4">{fullName} ({employeeID})</p>
            <button
              onClick={handleExamine}
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100 transition-colors transform hover:-translate-y-0.5"
            >
              Examine All Forms
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {nameChanges.map((form) => (
              <div key={form._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-5">
                  <h3 className="text-xl font-semibold">Connection: {form.connectionAccountNumber}</h3>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Account Name:</label>
                      <span className="text-gray-900">{form.connectionAccountName}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">New Name:</label>
                      <span className="text-gray-900">{form.newConnectionAccountName}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Address:</label>
                      <span className="text-gray-900 break-words">{form.connectionAccountAddress}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Change Method:</label>
                      <span className="text-gray-900">{form.changeMethod}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Prepared By:</label>
                      <span className="text-gray-900">{form.formPreparationEmpName} ({form.formPreparationEmpID})</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Preparation Date:</label>
                      <span className="text-gray-900">{form.formPreparationDate}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={() => fetchConnectionDetails(form.connectionAccountNumber)}
                      disabled={detailsLoading}
                      className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    >
                      {detailsLoading ? 'Loading...' : 'View Connection Details'}
                    </button>
                    <button
                      onClick={() => fetchDocuments(form.connectionAccountNumber)}
                      disabled={detailsLoading}
                      className="px-4 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                    >
                      {detailsLoading ? 'Loading...' : 'View Documents'}
                    </button>
                  </div>

                  <div className="p-5 bg-yellow-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Examination Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">Examination Status:</span>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          Not Examined
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 italic">
                        This form has not been examined yet
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white">
                    <h4 className="text-lg font-semibold mb-4">Examination Action</h4>
                    <div className="mb-3">
                      <p className="text-sm opacity-90">You are about to examine this form as:</p>
                      <p className="font-medium">{fullName} ({employeeID})</p>
                    </div>
                    <button
                      onClick={() => handleExamine(form._id)}
                      className="px-5 py-2.5 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100 transition-colors transform hover:-translate-y-0.5"
                    >
                      Examine Form
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Connection Details Modal */}
      {showConnectionModal && selectedConnection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Connection Details</h2>
                <button
                  onClick={() => setShowConnectionModal(false)}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">Account Number:</label>
                  <span className="text-gray-900 font-medium">{selectedConnection.connectionAccountNumber}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">Owner Name:</label>
                  <span className="text-gray-900 font-medium">{selectedConnection.ownerName}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">Address:</label>
                  <span className="text-gray-900 font-medium">{selectedConnection.connectionAddress}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">NIC:</label>
                  <span className="text-gray-900 font-medium">{selectedConnection.ownerNIC}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">Phone:</label>
                  <span className="text-gray-900 font-medium">{selectedConnection.ownerPhone}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">Area:</label>
                  <span className="text-gray-900 font-medium">{selectedConnection.area}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">Grama Niladhari Division:</label>
                  <span className="text-gray-900 font-medium">{selectedConnection.gramaNiladhariDivision}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">Divisional Secretariat:</label>
                  <span className="text-gray-900 font-medium">{selectedConnection.divisionalSecretariat}</span>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-600">Purpose:</label>
                  <span className="text-gray-900 font-medium">{selectedConnection.purpose}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {showDocumentsModal && selectedDocuments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Documents - {selectedDocuments.connectionAccountNumber}</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => downloadDocuments(selectedDocuments.connectionAccountNumber)}
                    className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                  >
                    Download All
                  </button>
                  <button
                    onClick={() => setShowDocumentsModal(false)}
                    className="text-white hover:text-gray-200 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(selectedDocuments).map(([key, value]) => {
                  if (key === 'connectionAccountNumber' || key === '_id' || key === '__v') return null;
                  
                  if (Array.isArray(value)) {
                    return value.map((doc, index) => (
                      <div key={`${key}-${index}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-semibold text-gray-800 mb-2">Other Document {index + 1}</h4>
                        <p className="text-sm text-gray-600 mb-3">Filename: {doc.filename}</p>
                        <a
                          href={`http://localhost:5000/${doc.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                        >
                          View Document
                        </a>
                      </div>
                    ));
                  }
                  
                  if (typeof value === 'object' && value !== null) {
                    return (
                      <div key={key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-semibold text-gray-800 mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                        <p className="text-sm text-gray-600 mb-3">Filename: {value.filename}</p>
                        <a
                          href={`http://localhost:5000/${value.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                        >
                          View Document
                        </a>
                      </div>
                    );
                  }
                  
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NameChangeExamine;