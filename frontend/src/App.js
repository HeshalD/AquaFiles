import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import DataEntryDashboard from './Components/DataEntryDashboard/DataEntryDashboard';
import DataViewingDashboard from './Components/DataViewingDashboard/DataViewingDashboard';
import ProtectedRoute from './Components/ProtectedRoutes/ProtectedRoutes';
import UploadDocuments from './Components/UploadDocuments/UploadDocuments.js.js';
import ConnectionForm from './Components/ConnectionForm/ConnectionForm';
import ConnectionDetail from './Components/ConnectionDetails/ConnectionDetails.js';
import EditConnection from './Components/EditConnetions/EditConnections.js';
import NameChangeForm from './Components/NameChangeForm/NameChangeForm';
import ApprovalsDashboard from './Components/ApprovalsDashboard/ApprovalsDashboard';

function App() {
  return (
    <div className="App">
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/data-entry"
            element={
              <ProtectedRoute allowedRole="data_entry">
                <DataEntryDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="data_viewing">
                <DataViewingDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connection-form"
            element={
              <ProtectedRoute allowedRole="data_entry">
                <ConnectionForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/name-change"
            element={
              <ProtectedRoute allowedRole="data_entry">
                <NameChangeForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/approvals"
            element={
              <ProtectedRoute allowedRole="data_viewing">
                <ApprovalsDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/addConnection"
            element={
              <ProtectedRoute allowedRole="data_entry">
                <UploadDocuments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/connections/:connectionAccountNumber"
            element={
              <ProtectedRoute allowedRole="data_viewing">
                <ConnectionDetail />
              </ProtectedRoute>
            }
          />

          <Route path="/data-entry/connections/:connectionAccountNumber/edit" element={<EditConnection />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
