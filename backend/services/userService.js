const User = require('../models/User');
const Transaction = require('../models/Transaction');

class UserService {
  // Get all users with pagination
  async getAllUsers(page = 1, limit = 20, search = '') {
    const skip = (page - 1) * limit;
    
    const query = search ? {
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get single user by ID
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Get user's devices
  async getUserDevices(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.devices;
  }

  // Verify device
  async verifyDevice(userId, deviceId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const device = user.devices.find(d => d.deviceId === deviceId);
    if (!device) {
      throw new Error('Device not found');
    }

    if (device.isVerified) {
      throw new Error('Device already verified');
    }

    device.isVerified = true;
    device.verifiedAt = new Date();
    
    await user.save();
    return device;
  }

  // Revoke device verification
  async revokeDevice(userId, deviceId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const device = user.devices.find(d => d.deviceId === deviceId);
    if (!device) {
      throw new Error('Device not found');
    }

    device.isVerified = false;
    device.verifiedAt = null;
    
    await user.save();
    return device;
  }

  // Get all pending device verifications
  async getPendingVerifications() {
    const users = await User.find({
      'devices.isVerified': false
    });

    const pending = [];
    users.forEach(user => {
      user.devices.forEach(device => {
        if (!device.isVerified) {
          pending.push({
            userId: user._id,
            userEmail: user.email,
            userFullName: user.fullName,
            deviceId: device.deviceId,
            deviceName: device.deviceName,
            registeredAt: device.registeredAt
          });
        }
      });
    });

    return pending;
  }

  // Get dashboard statistics
  async getDashboardStats() {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalTransactions = await Transaction.countDocuments();
    
    const balanceStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalBalance: { $sum: '$balance' },
          avgBalance: { $avg: '$balance' }
        }
      }
    ]);

    const depositStats = await Transaction.aggregate([
      { $match: { type: 'deposit' } },
      {
        $group: {
          _id: null,
          totalDeposits: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const withdrawStats = await Transaction.aggregate([
      { $match: { type: 'withdraw' } },
      {
        $group: {
          _id: null,
          totalWithdrawals: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const pendingDevices = await User.aggregate([
      { $unwind: '$devices' },
      { $match: { 'devices.isVerified': false } },
      { $count: 'total' }
    ]);

    return {
      totalUsers,
      activeUsers,
      totalTransactions,
      totalBalance: balanceStats[0]?.totalBalance || 0,
      avgBalance: balanceStats[0]?.avgBalance || 0,
      totalDeposits: depositStats[0]?.totalDeposits || 0,
      depositCount: depositStats[0]?.count || 0,
      totalWithdrawals: withdrawStats[0]?.totalWithdrawals || 0,
      withdrawalCount: withdrawStats[0]?.count || 0,
      pendingDeviceVerifications: pendingDevices[0]?.total || 0
    };
  }

  // Get all transactions (admin view)
  async getAllTransactions(page = 1, limit = 20, filters = {}) {
    const skip = (page - 1) * limit;
    
    const query = {};
    if (filters.type) query.type = filters.type;
    if (filters.userId) query.userId = filters.userId;
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('userId', 'fullName email phoneNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(query);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Toggle user active status
  async toggleUserStatus(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = !user.isActive;
    await user.save();
    
    return user;
  }
}

module.exports = new UserService();