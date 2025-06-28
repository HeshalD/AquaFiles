import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';

const ConnectionDetail = () => {
    const { connectionAccountNumber } = useParams();
    const [connection, setConnection] = useState(null);
    const [documents, setDocuments] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const connRes = await axios.get(`/connections/${connectionAccountNumber}`);
                const docRes = await axios.get(`/documents/${connectionAccountNumber}`);
                setConnection(connRes.data);
                setDocuments(docRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [connectionAccountNumber]);

    if (!connection || !documents) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8">
            <h1 className="mb-4 text-2xl font-bold">Connection Details</h1>
            <div className="p-4 mb-6 bg-white rounded shadow">
                {Object.entries(connection).map(([key, value]) => (
                    <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
            </div>

            <h2 className="mb-2 text-xl font-semibold">Documents</h2>
            <div className="p-4 bg-white rounded shadow">
                {Object.entries(documents).map(([key, value]) => {
                    if (typeof value === 'object' && value.url) {
                        return (
                            <div key={key} className="mb-2">
                                <strong>{key}</strong>: <a href={`${process.env.REACT_APP_API_BASE_URL}/${value.url}`} target="_blank" rel="noopener noreferrer">
                                    View
                                </a>
                            </div>
                        );
                    }
                    return null;
                })}
                <button
                    onClick={() =>
                        window.open(`${process.env.REACT_APP_API_BASE_URL}/documents/${connectionAccountNumber}/download`, '_blank')
                    }
                    className="px-4 py-2 mb-4 text-white bg-green-600 rounded"
                >
                    Download All Documents
                </button>
            </div>
        </div>
    );
};

export default ConnectionDetail;
