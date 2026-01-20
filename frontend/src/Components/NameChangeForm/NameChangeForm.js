import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../api/axios';
import { debounce } from 'lodash';

function NameChangeForm() {
  const [formData, setFormData] = useState({
    connectionAccountNumber: '',
    connectionAccountName: '',
    connectionAccountAddress: '',
    newConnectionAccountName: '',
    changeMethod: '',
    formPreparationEmpID: '',
    formPreparationEmpName: '',
    formPreparationDate: '',
    formExamineEmpID: '',
    formExamineEmpName: '',
    formExamineDate: '',
    formApproval1Position: '',
    formApproval1EmpID: '',
    formApproval2Position: '',
    formApproval2EmpID: '',
    formApproval3Position: '',
    formApproval3EmpID: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fetchingConnection, setFetchingConnection] = useState(false);
  const [connectionFound, setConnectionFound] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [users, setUsers] = useState({
    approval1: [],
    approval2: [],
    approval3: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fetch users based on position
  const fetchUsersByPosition = async (position, approvalLevel) => {
    try {
      let endpoint;
      switch (position) {
        case 'Commercial Officer':
          endpoint = '/users/commercial-officers';
          break;
        case 'Area Engineer':
          endpoint = '/users/area-engineers';
          break;
        case 'ONM Engineer':
          endpoint = '/users/ONM-engineers';
          break;
        default:
          return;
      }
      
      const response = await axios.get(endpoint);
      setUsers(prev => ({
        ...prev,
        [approvalLevel]: response.data
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Handle position change for approval levels
  const handlePositionChange = (approvalLevel, position) => {
    const fieldName = `form${approvalLevel.charAt(0).toUpperCase() + approvalLevel.slice(1)}Position`;
    const empIdField = `form${approvalLevel.charAt(0).toUpperCase() + approvalLevel.slice(1)}EmpID`;
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: position,
      [empIdField]: '' // Reset employee ID when position changes
    }));
    
    if (position) {
      fetchUsersByPosition(position, approvalLevel);
    } else {
      setUsers(prev => ({
        ...prev,
        [approvalLevel]: []
      }));
    }
  };

  // Handle user selection
  const handleUserSelection = (approvalLevel, user) => {
    const empIdField = `form${approvalLevel.charAt(0).toUpperCase() + approvalLevel.slice(1)}EmpID`;
    setFormData(prev => ({
      ...prev,
      [empIdField]: user.employeeID
    }));
  };

  // Fetch connection details by account number with debouncing
  const debouncedFetchConnection = useCallback(
    debounce(async (accountNumber) => {
      if (!accountNumber) {
        setConnectionFound(null);
        setFormData(prev => ({
          ...prev,
          connectionAccountName: '',
          connectionAccountAddress: ''
        }));
        return;
      }
      
      setFetchingConnection(true);
      setConnectionFound(null);
      
      try {
        const response = await axios.get(`/connections/${accountNumber}`);
        const connection = response.data;
        
        setFormData(prev => ({
          ...prev,
          connectionAccountName: connection.ownerName || '',
          connectionAccountAddress: connection.connectionAddress || ''
        }));
        setConnectionFound(true);
      } catch (error) {
        console.error('Error fetching connection details:', error);
        // Clear fields if connection not found
        setFormData(prev => ({
          ...prev,
          connectionAccountName: '',
          connectionAccountAddress: ''
        }));
        setConnectionFound(false);
      } finally {
        setFetchingConnection(false);
      }
    }, 500),
    []
  );

  // Handle connection account number change
  const handleAccountNumberChange = (e) => {
    const accountNumber = e.target.value;
    setFormData(prev => ({
      ...prev,
      connectionAccountNumber: accountNumber
    }));
    
    // Trigger debounced fetch
    debouncedFetchConnection(accountNumber);
  };

  // Auto-populate preparation employee details from logged-in user
  useEffect(() => {
    const employeeID = localStorage.getItem('employeeID');
    const fullname = localStorage.getItem('fullname');
    
    if (employeeID && fullname) {
      setFormData(prev => ({
        ...prev,
        formPreparationEmpID: employeeID,
        formPreparationEmpName: fullname,
        formPreparationDate: new Date().toISOString().split('T')[0] // Today's date
      }));
    }
  }, []);

  // Navigation functions
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/namechange/add', formData);
      setMessage(response.data.message);
      setFormData({
        connectionAccountNumber: '',
        connectionAccountName: '',
        connectionAccountAddress: '',
        newConnectionAccountName: '',
        changeMethod: '',
        formPreparationEmpID: '',
        formPreparationEmpName: '',
        formPreparationDate: '',
        formExamineEmpID: '',
        formExamineEmpName: '',
        formExamineDate: '',
        formApproval1Position: '',
        formApproval1EmpID: '',
        formApproval2Position: '',
        formApproval2EmpID: '',
        formApproval3Position: '',
        formApproval3EmpID: ''
      });
      setCurrentStep(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating name change form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Name Change Form</h2>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            1
          </div>
          <span className={`ml-2 text-sm font-medium ${
            currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'
          }`}>
            Form Details
          </span>
        </div>
        <div className="w-16 h-1 mx-4 bg-gray-300"></div>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            2
          </div>
          <span className={`ml-2 text-sm font-medium ${
            currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'
          }`}>
            Review & Submit
          </span>
        </div>
      </div>
      
      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Step 1: Form Details */}
      {currentStep === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
          {/* Connection Details Section */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">Connection Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Account Number *
                  {fetchingConnection && (
                    <span className="ml-2 text-xs text-blue-600 animate-pulse">Searching...</span>
                  )}
                  {connectionFound === true && (
                    <span className="ml-2 text-xs text-green-600"> Found</span>
                  )}
                  {connectionFound === false && (
                    <span className="ml-2 text-xs text-red-600"> Not Found</span>
                  )}
                </label>
                <input
                  type="text"
                  name="connectionAccountNumber"
                  value={formData.connectionAccountNumber}
                  onChange={handleAccountNumberChange}
                  required
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fetchingConnection 
                      ? 'border-blue-400 bg-blue-50' 
                      : connectionFound === true 
                        ? 'border-green-400 bg-green-50'
                        : connectionFound === false
                          ? 'border-red-400 bg-red-50'
                          : 'border-gray-300'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Account Name *
                  {fetchingConnection && (
                    <span className="ml-2 text-xs text-gray-500 animate-pulse">Loading...</span>
                  )}
                </label>
                <input
                  type="text"
                  name="connectionAccountName"
                  value={formData.connectionAccountName}
                  onChange={handleChange}
                  required
                  readOnly
                  placeholder={fetchingConnection ? "Fetching..." : ""}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fetchingConnection 
                      ? 'border-blue-400 bg-blue-100 animate-pulse' 
                      : connectionFound === true 
                        ? 'border-green-400 bg-green-100'
                        : connectionFound === false
                          ? 'border-red-400 bg-red-100'
                          : 'bg-gray-100 border-gray-300'
                  }`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Account Address *
                  {fetchingConnection && (
                    <span className="ml-2 text-xs text-gray-500 animate-pulse">Loading...</span>
                  )}
                </label>
                <textarea
                  name="connectionAccountAddress"
                  value={formData.connectionAccountAddress}
                  onChange={handleChange}
                  required
                  readOnly
                  rows="3"
                  placeholder={fetchingConnection ? "Fetching address..." : ""}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fetchingConnection 
                      ? 'border-blue-400 bg-blue-100 animate-pulse' 
                      : connectionFound === true 
                        ? 'border-green-400 bg-green-100'
                        : connectionFound === false
                          ? 'border-red-400 bg-red-100'
                          : 'bg-gray-100 border-gray-300'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Connection Account Name *
                </label>
                <input
                  type="text"
                  name="newConnectionAccountName"
                  value={formData.newConnectionAccountName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Change Method *
                </label>
                <select
                  name="changeMethod"
                  value={formData.changeMethod}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Change Method</option>
                  <option value="Marriage">Marriage</option>
                  <option value="Divorce">Divorce</option>
                  <option value="Legal Name Change">Legal Name Change</option>
                  <option value="Correction">Correction</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Preparation Section */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">Form Preparation Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preparation Employee ID *
                </label>
                <input
                  type="text"
                  name="formPreparationEmpID"
                  value={formData.formPreparationEmpID}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preparation Employee Name *
                </label>
                <input
                  type="text"
                  name="formPreparationEmpName"
                  value={formData.formPreparationEmpName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preparation Date *
                </label>
                <input
                  type="date"
                  name="formPreparationDate"
                  value={formData.formPreparationDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Approval Details Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Approval Details</h3>
            <div className="space-y-4">
              {/* Approval 1 */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-3">Approval Level 1</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Approval 1 Position *
                    </label>
                    <select
                      value={formData.formApproval1Position}
                      onChange={(e) => handlePositionChange('approval1', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Position</option>
                      <option value="Commercial Officer">Commercial Officer</option>
                      <option value="Area Engineer">Area Engineer</option>
                      <option value="ONM Engineer">ONM Engineer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Employee *
                    </label>
                    <select
                      value={formData.formApproval1EmpID}
                      onChange={(e) => {
                        const selectedUser = users.approval1.find(user => user.employeeID === e.target.value);
                        if (selectedUser) {
                          handleUserSelection('approval1', selectedUser);
                        }
                      }}
                      required
                      disabled={!formData.formApproval1Position || users.approval1.length === 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Select Employee</option>
                      {users.approval1.map(user => (
                        <option key={user.employeeID} value={user.employeeID}>
                          {user.fullname} ({user.employeeID})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Approval 2 */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-3">Approval Level 2</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Approval 2 Position *
                    </label>
                    <select
                      value={formData.formApproval2Position}
                      onChange={(e) => handlePositionChange('approval2', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Position</option>
                      <option value="Commercial Officer">Commercial Officer</option>
                      <option value="Area Engineer">Area Engineer</option>
                      <option value="ONM Engineer">ONM Engineer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Employee *
                    </label>
                    <select
                      value={formData.formApproval2EmpID}
                      onChange={(e) => {
                        const selectedUser = users.approval2.find(user => user.employeeID === e.target.value);
                        if (selectedUser) {
                          handleUserSelection('approval2', selectedUser);
                        }
                      }}
                      required
                      disabled={!formData.formApproval2Position || users.approval2.length === 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Select Employee</option>
                      {users.approval2.map(user => (
                        <option key={user.employeeID} value={user.employeeID}>
                          {user.fullname} ({user.employeeID})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Approval 3 */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-3">Approval Level 3</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Approval 3 Position *
                    </label>
                    <select
                      value={formData.formApproval3Position}
                      onChange={(e) => handlePositionChange('approval3', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Position</option>
                      <option value="Commercial Officer">Commercial Officer</option>
                      <option value="Area Engineer">Area Engineer</option>
                      <option value="ONM Engineer">ONM Engineer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Employee *
                    </label>
                    <select
                      value={formData.formApproval3EmpID}
                      onChange={(e) => {
                        const selectedUser = users.approval3.find(user => user.employeeID === e.target.value);
                        if (selectedUser) {
                          handleUserSelection('approval3', selectedUser);
                        }
                      }}
                      required
                      disabled={!formData.formApproval3Position || users.approval3.length === 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Select Employee</option>
                      {users.approval3.map(user => (
                        <option key={user.employeeID} value={user.employeeID}>
                          {user.fullname} ({user.employeeID})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next: Review & Submit
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Review & Submit */}
      {currentStep === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Review Name Change Details</h3>
            
            {/* Connection Details Review */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Connection Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Account Number:</span>
                  <p className="text-gray-900">{formData.connectionAccountNumber}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Current Account Name:</span>
                  <p className="text-gray-900">{formData.connectionAccountName}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-600">Current Address:</span>
                  <p className="text-gray-900">{formData.connectionAccountAddress}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">New Account Name:</span>
                  <p className="text-gray-900">{formData.newConnectionAccountName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Change Method:</span>
                  <p className="text-gray-900">{formData.changeMethod}</p>
                </div>
              </div>
            </div>

            {/* Preparation Details Review */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Form Preparation Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Prepared By (ID):</span>
                  <p className="text-gray-900">{formData.formPreparationEmpID}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Prepared By (Name):</span>
                  <p className="text-gray-900">{formData.formPreparationEmpName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Preparation Date:</span>
                  <p className="text-gray-900">{formData.formPreparationDate}</p>
                </div>
              </div>
            </div>

            {/* Approval Details Review */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Approval Details</h4>
              <div className="space-y-3 text-sm">
                <div className="border-l-4 border-blue-500 pl-4">
                  <span className="font-medium text-gray-600">Approval Level 1:</span>
                  <p className="text-gray-900">{formData.formApproval1Position} - {formData.formApproval1EmpID}</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <span className="font-medium text-gray-600">Approval Level 2:</span>
                  <p className="text-gray-900">{formData.formApproval2Position} - {formData.formApproval2EmpID}</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <span className="font-medium text-gray-600">Approval Level 3:</span>
                  <p className="text-gray-900">{formData.formApproval3Position} - {formData.formApproval3EmpID}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Form examination details will be filled by the examiner in a later step.
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Previous Step
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Name Change Form'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default NameChangeForm;