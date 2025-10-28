import React, { useState, useEffect } from 'react';
import { deviceAPI } from '../services/api';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';

const DevicesPage = () => {
  const [pendingDevices, setPendingDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingDevices();
  }, []);

  const fetchPendingDevices = async () => {
    try {
      const response = await deviceAPI.getPendingVerifications();
      setPendingDevices(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch pending devices');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDevice = async (userId, deviceId) => {
    try {
      await deviceAPI.verifyDevice(userId, deviceId);
      toast.success('Device verified successfully');
      fetchPendingDevices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify device');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-RW');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Device Verification</h1>
            <p className="text-sm text-gray-600">Manage pending device verifications</p>
          </div>
        </header>

        <main className="p-6">
          {pendingDevices.length > 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ You have <strong>{pendingDevices.length}</strong> pending device verification(s)
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : pendingDevices.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 text-5xl mb-4">✅</div>
                <p className="text-gray-600">No pending device verifications</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingDevices.map((device, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{device.userFullName}</div>
                        <div className="text-sm text-gray-500">{device.userEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{device.deviceName}</div>
                        <div className="text-xs text-gray-500 font-mono">{device.deviceId}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(device.registeredAt)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleVerifyDevice(device.userId, device.deviceId)}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                        >
                          Verify Device
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DevicesPage;