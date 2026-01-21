import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import useLogout from '../../Hooks/useLogout'
import { Search, LogOut, FileEdit, Calendar, User, CheckCircle } from 'lucide-react'

function ApprovedExamined() {
  const [nameChanges, setNameChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovedExamined = async () => {
      try {
        const response = await axios.get('/namechange/approved-examined', {
          params: { page, limit: 10, search }
        });
        setNameChanges(response.data.nameChanges || response.data);
        setPages(response.data.pages || 1);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
        setLoading(false);
      }
    };

    fetchApprovedExamined();
  }, [page, search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading approved forms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-800">Error: {error}</p>
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
              onClick={() => navigate('/data-entry')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-md"
              style={{ backgroundColor: '#510400' }}
            >
              <FileEdit size={18} />
              <span className="hidden sm:inline">Data Entry</span>
            </button>
            
            <button
              onClick={() => navigate('/examine')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-md"
              style={{ backgroundColor: '#650015' }}
            >
              <FileEdit size={18} />
              <span className="hidden sm:inline">Examine Form</span>
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
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Search Approved Forms</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by account number, name, or complaint number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Forms List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Approved & Examined Name Changes</h2>
            <div className="flex items-center space-x-2">
              <CheckCircle size={20} className="text-green-500" />
              <span className="text-sm text-gray-600">Total: {nameChanges.length} forms</span>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {nameChanges.length > 0 ? (
              nameChanges.map((form) => (
                <div
                  key={form._id}
                  className="px-6 py-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ color: '#510400' }}>
                          Connection Account: {form.connectionAccountNumber}
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <User size={18} className="text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Current Name</p>
                              <p className="font-medium text-gray-900">{form.connectionAccountName}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <User size={18} className="text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">New Name</p>
                              <p className="font-medium text-gray-900">{form.newConnectionAccountName}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <Calendar size={18} className="text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Preparation Date</p>
                              <p className="font-medium text-gray-900">
                                {new Date(form.formPreparationDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Status & Approvals */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Form Details</h4>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Address:</span>
                            <span className="font-medium text-gray-900">{form.connectionAccountAddress}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Change Method:</span>
                            <span className="font-medium text-gray-900">{form.changeMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Complaint Number:</span>
                            <span className="font-medium text-gray-900">{form.complaintNumber || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Examined By:</span>
                            <span className="font-medium text-gray-900">
                              {form.formExamineEmpName} ({form.formExamineEmpID})
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Prepared By:</span>
                            <span className="font-medium text-gray-900">
                              {form.formPreparationEmpName} ({form.formPreparationEmpID})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Approval Status</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Approval 1:</span>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                form.formApproval1Status === 'Approved' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {form.formApproval1Status}
                              </span>
                              {form.fromApproval1Date && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(form.fromApproval1Date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Approval 2:</span>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                form.formApproval2Status === 'Approved' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {form.formApproval2Status}
                              </span>
                              {form.fromApproval2Date && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(form.fromApproval2Date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Approval 3:</span>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                form.formApproval3Status === 'Approved' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {form.formApproval3Status}
                              </span>
                              {form.fromApproval3Date && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(form.fromApproval3Date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <CheckCircle size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No approved and examined name change forms found.</p>
                <p className="text-sm text-gray-400 mt-1">Forms will appear here once they are approved and examined</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {nameChanges.length > 0 && (
          <div className="flex items-center justify-center mt-6 space-x-4">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                page === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'text-white hover:shadow-md'
              }`}
              style={page !== 1 ? { backgroundColor: '#510400' } : {}}
            >
              Previous
            </button>
            
            <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Page <span style={{ color: '#510400' }}>{page}</span> of {pages}
              </span>
            </div>
            
            <button
              onClick={() => setPage(p => Math.min(p + 1, pages))}
              disabled={page === pages}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                page === pages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'text-white hover:shadow-md'
              }`}
              style={page !== pages ? { backgroundColor: '#510400' } : {}}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default ApprovedExamined;