import React from 'react';
import { deviceAPI } from '../services/api';
import { toast } from 'react-toastify';

const UserModal = ({ user, onClose, onUpdate }) => {
  const handleRevokeDevice = async (deviceId) => {
    if (!window.confirm('Are you sure you want to revoke this device verification?')) return;

    try {
      await deviceAPI.revokeDevice(user._id, deviceId);
      toast.success('Device verification revoked');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to revoke device');
    }
  };

  const handleVerifyDevice = async (deviceId) => {
    try {
      await deviceAPI.verifyDevice(user._id, deviceId);
      toast.success('Device verified successfully');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to verify device');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-RW');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* User Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-900">{user.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-medium text-gray-900">{user.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Balance</p>
                <p className="font-medium text-green-600">
                  RWF {user.balance.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  user.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-gray-900">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Devices */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Registered Devices</h3>
            {user.devices && user.devices.length > 0 ? (
              <div className="space-y-3">
                {user.devices.map((device, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{device.deviceName}</p>
                        <p className="text-xs text-gray-500 font-mono mt-1">{device.deviceId}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          Registered: {formatDate(device.registeredAt)}
                        </p>
                        {device.verifiedAt && (
                          <p className="text-sm text-gray-600">
                            Verified: {formatDate(device.verifiedAt)}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          device.isVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {device.isVerified ? 'Verified' : 'Pending'}
                        </span>
                        {device.isVerified ? (
                          <button
                            onClick={() => handleRevokeDevice(device.deviceId)}
                            className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                          >
                            Revoke
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifyDevice(device.deviceId)}
                            className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded hover:bg-green-200"
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No devices registered</p>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;