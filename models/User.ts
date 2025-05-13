// models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  totpSecret: String, // For TOTP 2FA
  is2FAEnabled: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
