import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import useLogout from '../../Hooks/useLogout';
import { LogOut, FileText, Edit, Download, Eye, ArrowLeft } from 'lucide-react';

const ConnectionDetail = () => {
    const { connectionAccountNumber } = useParams();
    const [connection, setConnection] = useState(null);
    const [documents, setDocuments] = useState(null);
    const [loading, setLoading] = useState(true);
    const logout = useLogout();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const connRes = await axios.get(`/connections/${connectionAccountNumber}`);
                const docRes = await axios.get(`/documents/${connectionAccountNumber}`);
                setConnection(connRes.data);
                setDocuments(docRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [connectionAccountNumber]);

    if (loading) {
        return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-600">Loading connection details...</p>
            </div>
        </div>;
    }

    if (!connection) {
        return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <FileText size={32} className="text-red-400" />
                </div>
                <p className="text-red-600 mb-2">Connection not found</p>
                <p className="text-sm text-gray-500">The connection you're looking for doesn't exist.</p>
            </div>
        </div>;
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
                            onClick={() => navigate('/data-viewing')}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-md"
                            style={{ backgroundColor: '#510400' }}
                        >
                            <ArrowLeft size={18} />
                            <span className="hidden sm:inline">Back to Dashboard</span>
                        </button>
                        
                        <button
                            onClick={() => navigate('/data-entry')}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-md"
                            style={{ backgroundColor: '#650015' }}
                        >
                            <FileText size={18} />
                            <span className="hidden sm:inline">Data Entry</span>
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
                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Connection Details</h1>
                    <p className="text-gray-600">Account Number: {connectionAccountNumber}</p>
                </div>

                {/* Connection Information */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Connection Information</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Account Number</p>
                                <p className="font-medium text-gray-900">{connection.connectionAccountNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Owner Name</p>
                                <p className="font-medium text-gray-900">{connection.ownerName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Address</p>
                                <p className="font-medium text-gray-900">{connection.connectionAddress}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">NIC</p>
                                <p className="font-medium text-gray-900">{connection.ownerNIC}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Phone</p>
                                <p className="font-medium text-gray-900">{connection.ownerPhone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Area</p>
                                <p className="font-medium text-gray-900">{connection.area}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Grama Niladhari Division</p>
                                <p className="font-medium text-gray-900">{connection.gramaNiladhariDivision}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Divisional Secretariat</p>
                                <p className="font-medium text-gray-900">{connection.divisionalSecretariat}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500 mb-1">Purpose</p>
                                <p className="font-medium text-gray-900">{connection.purpose}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents Section */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Documents</h2>
                        <button
                            onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL}/documents/${connectionAccountNumber}/download`, '_blank')}
                            className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:shadow-md"
                            style={{ backgroundColor: '#0066cc' }}
                        >
                            <Download size={16} />
                            <span>Download All</span>
                        </button>
                    </div>
                    <div className="p-6">
                        {documents ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(documents).map(([key, value]) => {
                                    if (key === 'connectionAccountNumber' || key === '_id' || key === '__v') return null;
                                    
                                    if (Array.isArray(value)) {
                                        return value.map((doc, index) => (
                                            <div key={`${key}-${index}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <h4 className="font-semibold text-gray-800 mb-2">Other Document {index + 1}</h4>
                                                <p className="text-sm text-gray-600 mb-3">Filename: {doc.filename}</p>
                                                <a
                                                    href={`${process.env.REACT_APP_API_BASE_URL}/${doc.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:shadow-md"
                                                    style={{ backgroundColor: '#650015' }}
                                                >
                                                    <Eye size={16} />
                                                    <span>View Document</span>
                                                </a>
                                            </div>
                                        ));
                                    }
                                    
                                    if (typeof value === 'object' && value !== null && value.url) {
                                        return (
                                            <div key={key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <h4 className="font-semibold text-gray-800 mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                                                <p className="text-sm text-gray-600 mb-3">Filename: {value.filename}</p>
                                                <a
                                                    href={`${process.env.REACT_APP_API_BASE_URL}/${value.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:shadow-md"
                                                    style={{ backgroundColor: '#650015' }}
                                                >
                                                    <Eye size={16} />
                                                    <span>View Document</span>
                                                </a>
                                            </div>
                                        );
                                    }
                                    
                                    return null;
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                    <FileText size={32} className="text-gray-400" />
                                </div>
                                <p className="text-gray-600">No documents found</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ConnectionDetail;
