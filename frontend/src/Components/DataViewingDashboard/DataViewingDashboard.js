import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import useLogout from '../../Hooks/useLogout';

const areas = ['Area 1', 'Area 2', 'Area 3']; // replace with your actual area options
const purposes = ['Purpose A', 'Purpose B', 'Purpose C']; // replace with your actual purpose options

const DataViewingDashboard = () => {
  const logout = useLogout();

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

  // When filters or search change, reset to page 1
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
    <div className="p-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Data Viewing Dashboard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 text-white bg-red-500 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-col mb-4 md:flex-row md:space-x-4">
        <input
          type="text"
          placeholder="Search by Account Number, Owner Name, NIC or Phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 mb-2 rounded border md:mb-0"
        />

        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="p-2 mb-2 rounded border md:mb-0"
        >
          <option value="">All Areas</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="p-2 rounded border"
        >
          <option value="">All Purposes</option>
          {purposes.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded shadow">
        {connections.length > 0 ? (
          connections.map((conn) => (
            <Link
              to={`/connections/${conn.connectionAccountNumber}`}
              key={conn.connectionAccountNumber}
              className="block px-4 py-2 border-b hover:bg-gray-100"
            >
              {conn.connectionAccountNumber} - {conn.ownerName}
            </Link>
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">No connections found.</p>
        )}
      </div>

      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${
            page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white'
          }`}
        >
          Previous
        </button>
        <span className="flex items-center">
          Page {page} of {pages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === pages}
          className={`px-4 py-2 rounded ${
            page === pages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataViewingDashboard;
