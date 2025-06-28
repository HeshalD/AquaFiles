import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConnectionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    connectionAccountNumber: '',
    ownerName: '',
    connectionAddress: '',
    ownerNIC: '',
    ownerPhone: '',
    area: '',
    gramaNiladhariDivision: '',
    divisionalSecretariat: '',
    purpose: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store connection data in localStorage
    localStorage.setItem('connectionData', JSON.stringify(formData));
    
    // Navigate to document upload form
    navigate('/addConnection');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 w-full max-w-lg bg-white rounded shadow-md">
        <h2 className="mb-6 text-xl font-bold text-center">Connection Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Connection Account Number *</label>
            <input
              type="text"
              name="connectionAccountNumber"
              value={formData.connectionAccountNumber}
              onChange={handleChange}
              required
              className="p-2 mt-1 w-full rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Owner Name *</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              required
              className="p-2 mt-1 w-full rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Connection Address *</label>
            <textarea
              name="connectionAddress"
              value={formData.connectionAddress}
              onChange={handleChange}
              required
              rows="3"
              className="p-2 mt-1 w-full rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Owner NIC *</label>
            <input
              type="text"
              name="ownerNIC"
              value={formData.ownerNIC}
              onChange={handleChange}
              required
              className="p-2 mt-1 w-full rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Owner Phone *</label>
            <input
              type="tel"
              name="ownerPhone"
              value={formData.ownerPhone}
              onChange={handleChange}
              required
              className="p-2 mt-1 w-full rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Area *</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              className="p-2 mt-1 w-full rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Grama Niladhari Division</label>
            <input
              type="text"
              name="gramaNiladhariDivision"
              value={formData.gramaNiladhariDivision}
              onChange={handleChange}
              className="p-2 mt-1 w-full rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Divisional Secretariat</label>
            <input
              type="text"
              name="divisionalSecretariat"
              value={formData.divisionalSecretariat}
              onChange={handleChange}
              className="p-2 mt-1 w-full rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Purpose *</label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              className="p-2 mt-1 w-full rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Purpose</option>
              <option value="Domestic">Domestic</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="flex mt-6 space-x-4">
          <button
            type="button"
            onClick={() => navigate('/data-entry')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Next: Upload Documents
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConnectionForm; 