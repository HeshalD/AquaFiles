import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import useLogout from '../../Hooks/useLogout';
import { LogOut, Edit, FileText, Download, Eye, Search } from 'lucide-react';

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
              onClick={() => window.location.href = '/data-entry'}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-md"
              style={{ backgroundColor: '#510400' }}
            >
              <FileText size={18} />
              <span className="hidden sm:inline">Data Entry</span>
            </button>
            
            <button
              onClick={() => window.location.href = '/name-change'}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-md"
              style={{ backgroundColor: '#650015' }}
            >
              <Edit size={18} />
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Name Change Forms to Examine</h1>
          <p className="text-gray-600">Forms requiring examination</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {nameChanges.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Edit size={32} className="text-gray-400" />
            </div>
            <p className="text-lg text-gray-600 mb-2">No name change forms found requiring examination.</p>
            <p className="text-sm text-gray-400">All forms have been examined</p>
          </div>
        ) : (
        <>
          {/* Examine All Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Examine All Forms</h3>
                <p className="text-sm text-gray-600">You are about to examine all {nameChanges.length} unexamined forms as: <span className="font-medium">{fullName} ({employeeID})</span></p>
              </div>
              <button
                onClick={handleExamine}
                className="flex items-center space-x-2 px-6 py-3 text-white font-medium rounded-lg transition-all hover:shadow-md"
                style={{ backgroundColor: '#660033' }}
              >
                <Edit size={18} />
                <span>Examine All Forms</span>
              </button>
            </div>
          </div>

          {/* Forms List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Pending Forms ({nameChanges.length})</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {nameChanges.map((form) => (
                <div key={form._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          Pending Examination
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">{form.connectionAccountNumber}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Account Name</p>
                          <p className="font-medium text-gray-900">{form.connectionAccountName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">New Name</p>
                          <p className="font-medium text-gray-900">{form.newConnectionAccountName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Change Method</p>
                          <p className="font-medium text-gray-900">{form.changeMethod}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Complaint Number</p>
                          <p className="font-medium text-gray-900">{form.complaintNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Prepared By</p>
                          <p className="font-medium text-gray-900">{form.formPreparationEmpName} ({form.formPreparationEmpID})</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Preparation Date</p>
                          <p className="font-medium text-gray-900">{form.formPreparationDate}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-500 mb-1">Address</p>
                        <p className="font-medium text-gray-900">{form.connectionAccountAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => fetchConnectionDetails(form.connectionAccountNumber)}
                        disabled={detailsLoading}
                        className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:shadow-md disabled:bg-gray-400"
                        style={{ backgroundColor: '#510400' }}
                      >
                        <Eye size={16} />
                        <span>{detailsLoading ? 'Loading...' : 'View Connection'}</span>
                      </button>
                      <button
                        onClick={() => fetchDocuments(form.connectionAccountNumber)}
                        disabled={detailsLoading}
                        className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:shadow-md disabled:bg-gray-400"
                        style={{ backgroundColor: '#650015' }}
                      >
                        <FileText size={16} />
                        <span>{detailsLoading ? 'Loading...' : 'View Documents'}</span>
                      </button>
                      <button
                        onClick={() => downloadDocuments(form.connectionAccountNumber)}
                        className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:shadow-md"
                        style={{ backgroundColor: '#0066cc' }}
                      >
                        <Download size={16} />
                        <span>Download</span>
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleExamine(form._id)}
                      className="flex items-center space-x-2 px-5 py-2.5 text-white font-medium rounded-lg transition-all hover:shadow-md"
                      style={{ backgroundColor: '#660033' }}
                    >
                      <Edit size={16} />
                      <span>Examine Form</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Connection Details Modal */}
      {showConnectionModal && selectedConnection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Connection Details</h2>
                <button
                  onClick={() => setShowConnectionModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Number</p>
                  <p className="font-medium text-gray-900">{selectedConnection.connectionAccountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Owner Name</p>
                  <p className="font-medium text-gray-900">{selectedConnection.ownerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  <p className="font-medium text-gray-900">{selectedConnection.connectionAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">NIC</p>
                  <p className="font-medium text-gray-900">{selectedConnection.ownerNIC}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-medium text-gray-900">{selectedConnection.ownerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Area</p>
                  <p className="font-medium text-gray-900">{selectedConnection.area}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Grama Niladhari Division</p>
                  <p className="font-medium text-gray-900">{selectedConnection.gramaNiladhariDivision}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Divisional Secretariat</p>
                  <p className="font-medium text-gray-900">{selectedConnection.divisionalSecretariat}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Purpose</p>
                  <p className="font-medium text-gray-900">{selectedConnection.purpose}</p>
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
            <div className="border-b border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Documents - {selectedDocuments.connectionAccountNumber}</h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => downloadDocuments(selectedDocuments.connectionAccountNumber)}
                    className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:shadow-md"
                    style={{ backgroundColor: '#0066cc' }}
                  >
                    <Download size={16} />
                    <span>Download All</span>
                  </button>
                  <button
                    onClick={() => setShowDocumentsModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
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
                          className="inline-flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:shadow-md"
                          style={{ backgroundColor: '#650015' }}
                        >
                          <Eye size={16} />
                          <span>View Document</span>
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
                          className="inline-flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:shadow-md"
                          style={{ backgroundColor: '#650015' }}
                        >
                          <Eye size={16} />
                          <span>View Document</span>
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
    </main>
  </div>
);
}

export default NameChangeExamine;