import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import useLogout from '../../Hooks/useLogout';
import { Search, LogOut, FileText, CheckCircle } from 'lucide-react';

const areas = ['Area 1', 'Area 2', 'Area 3'];
const purposes = ['Purpose A', 'Purpose B', 'Purpose C'];

const DataViewingDashboard = () => {
  const logout = useLogout();
  const navigate = useNavigate();

  const [connections, setConnections] = useState([]);
  const [search, setSearch] = useState('');
  const [area, setArea] = useState('');
  const [purpose, setPurpose] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get('/connections', {
          params: {
            page,
            limit: 10,
            search,
            area,
            purpose,
          },
        });
        setConnections(res.data.connections);
        setPages(res.data.pages);
      } catch (err) {
        console.error('Error fetching connections:', err);
      }
    };

    fetchConnections();
  }, [page, search, area, purpose]);

  useEffect(() => {
    setPage(1);
  }, [search, area, purpose]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < pages) setPage(page + 1);
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
              onClick={() => navigate('/examine')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-md"
              style={{ backgroundColor: '#650015' }}
            >
              <FileText size={18} />
              <span className="hidden sm:inline">Examine Form</span>
            </button>
            
            <button
              onClick={() => navigate('/approved-examined')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-md"
              style={{ backgroundColor: '#660033' }}
            >
              <CheckCircle size={18} />
              <span className="hidden sm:inline">Approved Forms</span>
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
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Search & Filter</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative col-span-1 md:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Account, Name, NIC or Phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ focusRing: '#510400' }}
              />
            </div>

            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white transition-all"
            >
              <option value="">All Areas</option>
              {areas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white transition-all"
            >
              <option value="">All Purposes</option>
              {purposes.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Connections List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Connections</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {connections.length > 0 ? (
              connections.map((conn) => (
                <Link
                  to={`/connections/${conn.connectionAccountNumber}`}
                  key={conn.connectionAccountNumber}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-opacity-80" style={{ color: '#510400' }}>
                        {conn.connectionAccountNumber}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{conn.ownerName}</p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">No connections found.</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {connections.length > 0 && (
          <div className="flex items-center justify-center mt-6 space-x-4">
            <button
              onClick={handlePrev}
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
              onClick={handleNext}
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
  );
};

export default DataViewingDashboard;