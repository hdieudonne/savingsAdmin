const adminAuthService = require('../services/adminAuthService');
const userService = require('../services/userService');

class AdminController {
  // Admin login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      const admin = await adminAuthService.login(email, password);
      const token = adminAuthService.generateToken(admin._id);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          admin: {
            id: admin._id,
            fullName: admin.fullName,
            email: admin.email,
            role: admin.role
          },
          token
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get admin profile
  async getProfile(req, res) {
    try {
      const admin = await adminAuthService.getProfile(req.admin._id);

      res.json({
        success: true,
        data: {
          id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all users
  async getAllUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || '';

      const result = await userService.getAllUsers(page, limit, search);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get single user
  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.userId);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get pending device verifications
  async getPendingVerifications(req, res) {
    try {
      const pending = await userService.getPendingVerifications();

      res.json({
        success: true,
        data: pending
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Verify device
  async verifyDevice(req, res) {
    try {
      const { userId, deviceId } = req.body;

      if (!userId || !deviceId) {
        return res.status(400).json({
          success: false,
          message: 'UserId and deviceId are required'
        });
      }

      const device = await userService.verifyDevice(userId, deviceId);

      res.json({
        success: true,
        message: 'Device verified successfully',
        data: device
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Revoke device
  async revokeDevice(req, res) {
    try {
      const { userId, deviceId } = req.body;

      if (!userId || !deviceId) {
        return res.status(400).json({
          success: false,
          message: 'UserId and deviceId are required'
        });
      }

      const device = await userService.revokeDevice(userId, deviceId);

      res.json({
        success: true,
        message: 'Device verification revoked',
        data: device
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get dashboard statistics
  async getDashboardStats(req, res) {
    try {
      const stats = await userService.getDashboardStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all transactions
  async getAllTransactions(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const filters = {
        type: req.query.type,
        userId: req.query.userId,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const result = await userService.getAllTransactions(page, limit, filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Toggle user status
  async toggleUserStatus(req, res) {
    try {
      const user = await userService.toggleUserStatus(req.params.userId);

      res.json({
        success: true,
        message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AdminController();