import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import useLogout from '../../Hooks/useLogout';

const DataEntryDashboard = () => {
  const [connections, setConnections] = useState([]);
  const [search, setSearch] = useState('');
  const [area, setArea] = useState('');
  const [purpose, setPurpose] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get('/connections', {
          params: { page, limit: 10, search, area, purpose }
        });
        setConnections(res.data.connections);
        setPages(res.data.pages);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConnections();
  }, [page, search, area, purpose]);

  const handleDelete = async (connectionAccountNumber) => {
    const password = window.prompt('Please enter your password to confirm deletion:');
    if (!password) return alert('Deletion cancelled. Password required.');
  
    try {
      await axios.delete(`/connections/${connectionAccountNumber}`, {
        data: { password }, // send password in request body
      });
      alert('Connection deleted successfully');
      // Refresh the connections list
      const res = await axios.get('/connections', {
        params: { page, limit: 10, search, area, purpose }
      });
      setConnections(res.data.connections);
      setPages(res.data.pages);
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting connection');
      console.error('Error deleting connection:', error);
    }
  };
  


  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Data Entry Dashboard</h1>

      <button onClick={logout} className="px-4 py-2 text-white bg-red-500 rounded">Logout</button>
      <button onClick={() => navigate('/connection-form')} className="px-4 py-2 text-white bg-blue-600 rounded">Add Connection</button>
      <button onClick={() => navigate('/name-change')} className="px-4 py-2 text-white bg-green-600 rounded">Name Change Form</button>

      <input
        type="text"
        placeholder="Search by Account Number, Owner Name, NIC, Phone"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="p-2 mb-3 w-full rounded border"
      />

      {/* Example predefined options for area and purpose */}
      <select value={area} onChange={e => setArea(e.target.value)} className="p-2 mb-3 w-full rounded border">
        <option value="">All Areas</option>
        <option value="Area1">Area1</option>
        <option value="Area2">Area2</option>
      </select>

      <select value={purpose} onChange={e => setPurpose(e.target.value)} className="p-2 mb-3 w-full rounded border">
        <option value="">All Purposes</option>
        <option value="Residential">Residential</option>
        <option value="Commercial">Commercial</option>
      </select>

      <div className="bg-white rounded shadow">
        {connections.map(conn => (
          <div key={conn.connectionAccountNumber} className="flex justify-between items-center px-4 py-2 border-b hover:bg-gray-100">
            <Link to={`/data-entry/connections/${conn.connectionAccountNumber}/edit`} className="flex-grow">
              {conn.connectionAccountNumber} - {conn.ownerName}
            </Link>
            <button
              onClick={() => handleDelete(conn.connectionAccountNumber)}
              className="px-3 py-1 ml-4 text-sm text-white bg-red-500 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Pagination buttons */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-300' : 'bg-blue-600 text-white'}`}
        >
          Prev
        </button>
        <span className="flex items-center">Page {page} of {pages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, pages))}
          disabled={page === pages}
          className={`px-4 py-2 rounded ${page === pages ? 'bg-gray-300' : 'bg-blue-600 text-white'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataEntryDashboard;
