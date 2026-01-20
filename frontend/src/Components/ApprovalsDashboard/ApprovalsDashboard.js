import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import useLogout from '../../Hooks/useLogout';

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
        <h1 className="text-4xl font-bold text-slate-700 mb-2">My Approvals</h1>
        <p className="text-lg text-gray-500">Name change forms requiring your approval</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {nameChanges.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">No name change forms found requiring your approval.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {nameChanges.map((form) => {
            const approvalLevel = getApprovalLevel(form);
            const canApproveForm = canApprove(form);
            
            return (
              <div key={form._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-5 flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Connection: {form.connectionAccountNumber}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                    approvalLevel === 1 ? 'bg-green-500/30' :
                    approvalLevel === 2 ? 'bg-yellow-500/30' :
                    'bg-red-500/30'
                  }`}>
                    Level {approvalLevel} Approver
                  </span>
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

                  <div className="mb-6 p-5 bg-gray-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Approval Status</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <span className="text-sm text-gray-600">Level 1 ({form.formApproval1Position}):</span>
                        <span className={getStatusBadgeClass(form.formApproval1Status)}>
                          {form.formApproval1Status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <span className="text-sm text-gray-600">Level 2 ({form.formApproval2Position}):</span>
                        <span className={getStatusBadgeClass(form.formApproval2Status)}>
                          {form.formApproval2Status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <span className="text-sm text-gray-600">Level 3 ({form.formApproval3Position}):</span>
                        <span className={getStatusBadgeClass(form.formApproval3Status)}>
                          {form.formApproval3Status}
                        </span>
                      </div>
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

                  {canApproveForm && (
                    <div className="p-5 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg text-white">
                      <h4 className="text-lg font-semibold mb-4">Your Action Required</h4>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApproval(form._id, `approval${approvalLevel}`, 'Approved')}
                          className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors transform hover:-translate-y-0.5"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproval(form._id, `approval${approvalLevel}`, 'Rejected')}
                          className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors transform hover:-translate-y-0.5"
                        >
                          Reject
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