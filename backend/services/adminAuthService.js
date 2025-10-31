const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

class AdminAuthService {
  // Generate JWT token
  generateToken(adminId) {
    return jwt.sign({ id: adminId, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '8h'
    });
  }

  // Login admin
  async login(email, password) {
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      throw new Error('Invalid credentials');
    }

    if (!admin.isActive) {
      throw new Error('Account is deactivated');
    }

    const isPasswordCorrect = admin.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Remove password from response
    admin.password = undefined;
    
    return admin;
  }

  // Get admin profile
  async getProfile(adminId) {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new Error('Admin not found');
    }
    return admin;
  }

  // Create default admin if doesn't exist
  async createDefaultAdmin() {
    const adminExists = await Admin.findOne({ email: process.env.DEFAULT_ADMIN_EMAIL });
    
    if (!adminExists) {
      const admin = await Admin.create({
        fullName: 'System Administrator',
        email: process.env.DEFAULT_ADMIN_EMAIL || 'dieudonne@code.com',
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@test',
        role: 'superadmin'
      });
      
      console.log('✅ Default admin created:', admin.email);
      return admin;
    }
    
    return adminExists;
  }
}

module.exports = new AdminAuthService();