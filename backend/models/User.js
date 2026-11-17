import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'Admin',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'superadmin', 'editor'],
  },
  resetOTP: {
    type: String,
    default: null,
  },
  resetOTPExpires: {
    type: Date,
    default: null,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual id field for frontend compatibility
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// ==========================================
// WORK 1: MONGODB INDEXING (PERFORMANCE)
// ==========================================
// 1. Role-based query optimization
userSchema.index({ role: 1 });

// 2. Fast OTP verification lookups
userSchema.index({ resetOTP: 1, resetOTPExpires: 1 });

const User = mongoose.model('User', userSchema);
export default User;
