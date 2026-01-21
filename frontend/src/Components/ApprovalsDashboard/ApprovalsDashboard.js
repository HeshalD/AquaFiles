import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import useLogout from '../../Hooks/useLogout';
import { Search, LogOut, Eye, FileText, Download, Check, X, User } from 'lucide-react';

export default function ApprovalsDashboard() {
  const [nameChanges, setNameChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [employeeID] = useState(localStorage.getItem('employeeID'));
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const logout = useLogout();

  useEffect(() => {
    fetchMyApprovals();
  }, []);

  const fetchMyApprovals = async () => {
    try {
      setLoading(true);
      
      // Debug: Check if employeeID exists
      console.log('EmployeeID from localStorage:', employeeID);
      console.log('Role from localStorage:', localStorage.getItem('role'));
      
      if (!employeeID) {
        setError('Employee ID not found. Please login again.');
        return;
      }
      
      // Make three separate calls to get forms where user is an approver at any level
      const [approval1Response, approval2Response, approval3Response] = await Promise.all([
        axios.get(`/namechange/approval1/${employeeID}`),
        axios.get(`/namechange/approval2/${employeeID}`),
        axios.get(`/namechange/approval3/${employeeID}`)
      ]);

      // Combine all results and remove duplicates
      const allNameChanges = [
        ...approval1Response.data,
        ...approval2Response.data,
        ...approval3Response.data
      ];

      // Remove duplicates based on _id
      const uniqueNameChanges = allNameChanges.reduce((acc, current) => {
        if (!acc.find(item => item._id === current._id)) {
          acc.push(current);
        }
        return acc;
      }, []);

      // Sort by creation date (newest first)
      uniqueNameChanges.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setNameChanges(uniqueNameChanges);
      setError('');
    } catch (err) {
      setError('Failed to fetch name change forms');
      console.error('Error fetching approvals:', err);
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

  const handleApproval = async (id, approvalLevel, status) => {
    try {
      await axios.put(`/namechange/${approvalLevel}/${id}`, { status });
      fetchMyApprovals(); // Refresh the list
    } catch (err) {
      alert('Failed to update approval status');
      console.error('Error updating approval:', err);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded';
      case 'Rejected':
        return 'bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded';
      default:
        return 'bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded';
    }
  };

  const getApprovalLevel = (form) => {
    if (form.formApproval1EmpID === employeeID) return 1;
    if (form.formApproval2EmpID === employeeID) return 2;
    if (form.formApproval3EmpID === employeeID) return 3;
    return null;
  };

  const canApprove = (form) => {
    const level = getApprovalLevel(form);
    const currentStatus = level === 1 ? form.formApproval1Status : 
                          level === 2 ? form.formApproval2Status : 
                          level === 3 ? form.formApproval3Status : null;
    
    return currentStatus === 'Not Approved';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading approvals...</p>
        </div>
      </div>
    );
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Approvals</h1>
          <p className="text-gray-600">Name change forms requiring your approval</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {nameChanges.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-gray-400" />
            </div>
            <p className="text-lg text-gray-600 mb-2">No approvals pending</p>
            <p className="text-sm text-gray-400">There are no name change forms requiring your approval at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {nameChanges.map((form) => {
              const approvalLevel = getApprovalLevel(form);
              const canApproveForm = canApprove(form);
              
              return (
                <div key={form._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1" style={{ color: '#510400' }}>
                          {form.complaintNumber}
                        </h3>
                        <p className="text-sm text-gray-600">Complaint Number</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        approvalLevel === 1 ? 'bg-green-100 text-green-800' :
                        approvalLevel === 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Level {approvalLevel}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Current Name</p>
                        <p className="text-gray-900 font-medium">{form.connectionAccountName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">New Name</p>
                        <p className="text-gray-900 font-medium">{form.newConnectionAccountName}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-600 mb-1">Address</p>
                        <p className="text-gray-900 text-sm">{form.connectionAccountAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Change Method</p>
                        <p className="text-gray-900 text-sm">{form.changeMethod}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Connection Number</p>
                        <p className="text-gray-900 text-sm">{form.connectionAccountNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Prepared By</p>
                        <p className="text-gray-900 text-sm">{form.formPreparationEmpName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Preparation Date</p>
                        <p className="text-gray-900 text-sm">{form.formPreparationDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Approval Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">Level 1 ({form.formApproval1Position})</span>
                        <span className={getStatusBadgeClass(form.formApproval1Status)}>
                          {form.formApproval1Status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">Level 2 ({form.formApproval2Position})</span>
                        <span className={getStatusBadgeClass(form.formApproval2Status)}>
                          {form.formApproval2Status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">Level 3 ({form.formApproval3Position})</span>
                        <span className={getStatusBadgeClass(form.formApproval3Status)}>
                          {form.formApproval3Status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-gray-100">
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => fetchConnectionDetails(form.connectionAccountNumber)}
                        disabled={detailsLoading}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-md disabled:opacity-50"
                        style={{ backgroundColor: '#510400' }}
                      >
                        <Eye size={16} />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={() => fetchDocuments(form.connectionAccountNumber)}
                        disabled={detailsLoading}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-md disabled:opacity-50"
                        style={{ backgroundColor: '#650015' }}
                      >
                        <FileText size={16} />
                        <span>Documents</span>
                      </button>
                    </div>

                    {canApproveForm && (
                      <div className="p-4 rounded-lg border border-gray-200 bg-white">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Your Action Required</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproval(form._id, `approval${approvalLevel}`, 'Approved')}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all hover:shadow-md"
                          >
                            <Check size={16} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleApproval(form._id, `approval${approvalLevel}`, 'Rejected')}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:shadow-md"
                          >
                            <X size={16} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Connection Details Modal */}
      {showConnectionModal && selectedConnection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Connection Details</h2>
                <button
                  onClick={() => setShowConnectionModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Account Number</p>
                  <p className="text-gray-900 font-medium">{selectedConnection.connectionAccountNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Owner Name</p>
                  <p className="text-gray-900 font-medium">{selectedConnection.ownerName}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-600 mb-1">Address</p>
                  <p className="text-gray-900">{selectedConnection.connectionAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">NIC</p>
                  <p className="text-gray-900">{selectedConnection.ownerNIC}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Phone</p>
                  <p className="text-gray-900">{selectedConnection.ownerPhone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Area</p>
                  <p className="text-gray-900">{selectedConnection.area}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Grama Niladhari Division</p>
                  <p className="text-gray-900">{selectedConnection.gramaNiladhariDivision}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Divisional Secretariat</p>
                  <p className="text-gray-900">{selectedConnection.divisionalSecretariat}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-600 mb-1">Purpose</p>
                  <p className="text-gray-900">{selectedConnection.purpose}</p>
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
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Documents - {selectedDocuments.connectionAccountNumber}</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => downloadDocuments(selectedDocuments.connectionAccountNumber)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-md"
                    style={{ backgroundColor: '#650015' }}
                  >
                    <Download size={16} />
                    <span>Download All</span>
                  </button>
                  <button
                    onClick={() => setShowDocumentsModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
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
                        <h4 className="font-medium text-gray-800 mb-2">Other Document {index + 1}</h4>
                        <p className="text-sm text-gray-600 mb-3 truncate">{doc.filename}</p>
                        <a
                          href={`http://localhost:5000/${doc.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-3 py-2 rounded-lg text-white text-sm transition-all hover:shadow-md"
                          style={{ backgroundColor: '#650015' }}
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </a>
                      </div>
                    ));
                  }
                  
                  if (typeof value === 'object' && value !== null) {
                    return (
                      <div key={key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-gray-800 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                        <p className="text-sm text-gray-600 mb-3 truncate">{value.filename}</p>
                        <a
                          href={`http://localhost:5000/${value.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-3 py-2 rounded-lg text-white text-sm transition-all hover:shadow-md"
                          style={{ backgroundColor: '#650015' }}
                        >
                          <Eye size={14} />
                          <span>View</span>
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