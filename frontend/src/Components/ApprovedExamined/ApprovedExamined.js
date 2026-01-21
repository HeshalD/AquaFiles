import React, { useState, useEffect } from 'react'
import axios from '../../api/axios'

function ApprovedExamined() {
  const [nameChanges, setNameChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApprovedExamined = async () => {
      try {
        const response = await axios.get('/namechange/approved-examined');
        setNameChanges(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
        setLoading(false);
      }
    };

    fetchApprovedExamined();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Approved & Examined Name Changes</h2>
      {nameChanges.length === 0 ? (
        <p>No approved and examined name change forms found.</p>
      ) : (
        <div>
          <p>Total: {nameChanges.length} forms</p>
          {nameChanges.map((form) => (
            <div key={form._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h3>Connection Account: {form.connectionAccountNumber}</h3>
              <p><strong>Current Name:</strong> {form.connectionAccountName}</p>
              <p><strong>New Name:</strong> {form.newConnectionAccountName}</p>
              <p><strong>Address:</strong> {form.connectionAccountAddress}</p>
              <p><strong>Change Method:</strong> {form.changeMethod}</p>
              <p><strong>Complaint Number:</strong> {form.complaintNumber || 'N/A'}</p>
              <p><strong>Examined By:</strong> {form.formExamineEmpName} ({form.formExamineEmpID})</p>
              <p><strong>Form Prepared By:</strong> {form.formPreparationEmpName} ({form.formPreparationEmpID})</p>
              <p><strong>Preparation Date:</strong> {new Date(form.formPreparationDate).toLocaleDateString()}</p>
              <div style={{ marginTop: '10px' }}>
                <strong>Approval Status:</strong>
                <ul>
                  <li>Approval 1: {form.formApproval1Status} {form.fromApproval1Date && `- ${new Date(form.fromApproval1Date).toLocaleDateString()}`}</li>
                  <li>Approval 2: {form.formApproval2Status} {form.fromApproval2Date && `- ${new Date(form.fromApproval2Date).toLocaleDateString()}`}</li>
                  <li>Approval 3: {form.formApproval3Status} {form.fromApproval3Date && `- ${new Date(form.fromApproval3Date).toLocaleDateString()}`}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ApprovedExamined;