import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const EditConnection = () => {
  const { connectionAccountNumber } = useParams();
  const navigate = useNavigate();

  const [connection, setConnection] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);

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
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">Edit Connection</h1>
      <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white rounded shadow">
        <label>
          Connection Account Number (cannot change)
          <input
            type="text"
            value={connectionAccountNumber}
            disabled
            className="p-2 w-full bg-gray-100 rounded border"
          />
        </label>

        {Object.entries(form).map(([key, value]) => (
          <label key={key} className="block">
            {key}
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleChange}
              className="p-2 w-full rounded border"
            />
          </label>
        ))}

        <h2 className="mt-6 font-semibold">Documents (upload to replace existing)</h2>
        {documents && Object.entries(documents).map(([key, value]) => {
          if (key === '_id' || key === '__v' || key === 'connectionAccountNumber') return null;
          if (key === 'Other' && Array.isArray(value)) {
            return (
              <div key={key} className="mb-3">
                <strong>{key}</strong>
                <input type="file" name={key} onChange={handleFileChange} multiple />
                <ul>
                  {value.map((file, idx) => (
                    <li key={idx}>
                      <a href={`/${file.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{file.filename}</a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }
          if (value && value.url) {
            return (
              <div key={key} className="mb-3">
                <label>
                  {key}
                  <input type="file" name={key} onChange={handleFileChange} />
                </label>
                <p>
                  Current file: <a href={`/${value.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{value.filename}</a>
                </p>
              </div>
            );
          }
          return null;
        })}

        <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditConnection;
