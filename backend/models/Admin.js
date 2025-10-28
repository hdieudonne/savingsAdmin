const mongoose = require('mongoose');
const crypto = require('crypto');

const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password using SHA-512
adminSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = crypto
    .createHash('sha512')
    .update(this.password)
    .digest('hex');
  
  next();
});

// Compare password
adminSchema.methods.comparePassword = function(candidatePassword) {
  const hashedCandidate = crypto
    .createHash('sha512')
    .update(candidatePassword)
    .digest('hex');
  
  return hashedCandidate === this.password;
};

module.exports = mongoose.model('Admin', adminSchema);