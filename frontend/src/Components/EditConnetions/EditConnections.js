import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import useLogout from '../../Hooks/useLogout';
import { LogOut, Save, Upload, FileText, ArrowLeft, User, MapPin, Phone, IdCard, Edit } from 'lucide-react';

const EditConnection = () => {
  const { connectionAccountNumber } = useParams();
  const navigate = useNavigate();
  const logout = useLogout();

  const [connection, setConnection] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    ownerName: '',
    connectionAddress: '',
    ownerNIC: '',
    ownerPhone: '',
    area: '',
    gramaNiladhariDivision: '',
    divisionalSecretariat: '',
    purpose: ''
  });

  const [files, setFiles] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const connRes = await axios.get(`/connections/${connectionAccountNumber}`);
        setConnection(connRes.data);
        setForm({
          ownerName: connRes.data.ownerName || '',
          connectionAddress: connRes.data.connectionAddress || '',
          ownerNIC: connRes.data.ownerNIC || '',
          ownerPhone: connRes.data.ownerPhone || '',
          area: connRes.data.area || '',
          gramaNiladhariDivision: connRes.data.gramaNiladhariDivision || '',
          divisionalSecretariat: connRes.data.divisionalSecretariat || '',
          purpose: connRes.data.purpose || '',
        });

        const docRes = await axios.get(`/documents/${connectionAccountNumber}`);
        setDocuments(docRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [connectionAccountNumber]);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = e => {
    setFiles(prev => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      // Update connection by connectionAccountNumber
      await axios.put(`/connections/account/${connectionAccountNumber}`, form);

      const formData = new FormData();
      formData.append('connectionAccountNumber', connectionAccountNumber);

      for (const key in files) {
        formData.append(key, files[key]);
      }

      if (Object.keys(files).length > 0) {
        await axios.put(`/documents/${connectionAccountNumber}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      alert('Update successful');
      navigate('/data-entry');
    } catch (err) {
      alert('Update failed');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading connection details...</p>
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
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back to Dashboard</span>
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
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Form Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#510400' }}>
                <Edit size={16} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Connection</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Account Number - Read Only */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Connection Account Number
              </label>
              <div className="flex items-center space-x-3">
                <IdCard size={20} className="text-gray-400" />
                <input
                  type="text"
                  value={connectionAccountNumber}
                  disabled
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">This field cannot be changed</p>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="ownerName"
                    value={form.ownerName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    placeholder="Enter owner name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner NIC
                </label>
                <div className="relative">
                  <IdCard size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="ownerNIC"
                    value={form.ownerNIC}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    placeholder="Enter NIC number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Phone
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="ownerPhone"
                    value={form.ownerPhone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    placeholder="Enter area"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grama Niladhari Division
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="gramaNiladhariDivision"
                    value={form.gramaNiladhariDivision}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    placeholder="Enter GN division"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Divisional Secretariat
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="divisionalSecretariat"
                    value={form.divisionalSecretariat}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    placeholder="Enter divisional secretariat"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose
                </label>
                <div className="relative">
                  <FileText size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="purpose"
                    value={form.purpose}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    placeholder="Enter purpose"
                  />
                </div>
              </div>
            </div>

            {/* Address Field - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Connection Address
              </label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="connectionAddress"
                  value={form.connectionAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                  placeholder="Enter connection address"
                />
              </div>
            </div>

            {/* Documents Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-3 mb-4">
                <Upload size={20} className="text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                <span className="text-sm text-gray-500">(upload to replace existing)</span>
              </div>
              
              <div className="space-y-4">
                {documents && Object.entries(documents).map(([key, value]) => {
                  if (key === '_id' || key === '__v' || key === 'connectionAccountNumber') return null;
                  if (key === 'Other' && Array.isArray(value)) {
                    return (
                      <div key={key} className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {key}
                        </label>
                        <div className="flex items-center space-x-3 mb-3">
                          <FileText size={18} className="text-gray-400" />
                          <input
                            type="file"
                            name={key}
                            onChange={handleFileChange}
                            multiple
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500">Current files:</p>
                          <ul className="space-y-1">
                            {value.map((file, idx) => (
                              <li key={idx} className="flex items-center space-x-2">
                                <FileText size={14} className="text-gray-400" />
                                <a
                                  href={`/${file.url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                                >
                                  {file.filename}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  }
                  if (value && value.url) {
                    return (
                      <div key={key} className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {key}
                        </label>
                        <div className="flex items-center space-x-3 mb-3">
                          <FileText size={18} className="text-gray-400" />
                          <input
                            type="file"
                            name={key}
                            onChange={handleFileChange}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Current file:</span>
                          <a
                            href={`/${value.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                          >
                            {value.filename}
                          </a>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/data-entry')}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2.5 text-white rounded-lg transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#510400' }}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Update Connection</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditConnection;
