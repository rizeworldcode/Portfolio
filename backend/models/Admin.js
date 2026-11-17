import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
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
  plainPassword: {
    type: String,
    default: 'Admin@123',
  },
  hashedPassword: {
    type: String,
  },
  name: {
    type: String,
    default: 'Admin',
  },
  role: {
    type: String,
    default: 'admin',
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
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
  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'admins' });

adminSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
adminSchema.set('toJSON', { virtuals: true });
adminSchema.set('toObject', { virtuals: true });

// ==========================================
// WORK 1: MONGODB INDEXING (PERFORMANCE)
// ==========================================
// Fast OTP verification lookups
adminSchema.index({ resetOTP: 1, resetOTPExpires: 1 });
adminSchema.index({ otp: 1, otpExpiry: 1 });

export default mongoose.models.Admin || mongoose.model('Admin', adminSchema);
