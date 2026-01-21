import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../Hooks/useLogout';
import { LogOut, FileText, ArrowLeft, Save, X } from 'lucide-react';

const ConnectionForm = () => {
  const navigate = useNavigate();
  const logout = useLogout();
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

  const handleCancel = () => {
    // Clear form data
    setFormData({
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Add New Connection</h1>
          <p className="text-gray-600">Enter connection information to create a new record</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Connection Information</h2>
            <p className="text-sm text-gray-500 mt-1">Please fill in all required fields marked with *</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Account Number *
                </label>
                <input
                  type="text"
                  name="connectionAccountNumber"
                  value={formData.connectionAccountNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Name *
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  placeholder="Enter owner name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Address *
                </label>
                <textarea
                  name="connectionAddress"
                  value={formData.connectionAddress}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                  placeholder="Enter complete address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner NIC *
                </label>
                <input
                  type="text"
                  name="ownerNIC"
                  value={formData.ownerNIC}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  placeholder="Enter NIC number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Phone *
                </label>
                <input
                  type="tel"
                  name="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area *
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  placeholder="Enter area"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose *
                </label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white transition-all"
                >
                  <option value="">Select Purpose</option>
                  <option value="Domestic">Domestic</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Agricultural">Agricultural</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grama Niladhari Division
                </label>
                <input
                  type="text"
                  name="gramaNiladhariDivision"
                  value={formData.gramaNiladhariDivision}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  placeholder="Enter GN division"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Divisional Secretariat
                </label>
                <input
                  type="text"
                  name="divisionalSecretariat"
                  value={formData.divisionalSecretariat}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  placeholder="Enter divisional secretariat"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all hover:shadow-md"
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  <span className="text-red-500">*</span> Required fields
                </span>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 text-white font-medium rounded-lg transition-all hover:shadow-md"
                  style={{ backgroundColor: '#510400' }}
                >
                  <Save size={18} />
                  <span>Next: Upload Documents</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ConnectionForm;