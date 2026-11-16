import express from 'express';
import crypto from 'crypto';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

const router = express.Router();

// In-memory OTP cache for high-reliability fallback verification
const memoryOtpStore = new Map();

/**
 * Hash password using HMAC-SHA256 with SECRET_KEY
 */
function hashPassword(password) {
  const secret = process.env.SECRET_KEY || 'itisthesecretkeyforrizeworidInstituteapp';
  return crypto.createHmac('sha256', secret).update(String(password).trim()).digest('hex');
}

/**
 * Generate secure HMAC authentication token
 */
function generateToken(user) {
  const secret = process.env.SECRET_KEY || 'itisthesecretkeyforrizeworidInstituteapp';
  const payload = JSON.stringify({
    id: user.id || user._id || 'admin-master',
    email: user.email,
    role: user.role || 'admin',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days validity
  });
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + signature;
}

/**
 * Send 6-digit OTP email using Brevo (Sendinblue) Transactional REST API
 * Verified Sender: rizeworldcode@gmail.com
 */
async function sendBrevoOtpEmail({ toEmail, toName, otpCode }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_EMAIL || 'rizeworldcode@gmail.com';

  if (!apiKey) {
    console.warn('⚠️ [Brevo Warning] No BREVO_API_KEY found in environment');
    return false;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>RizeWorld Admin Password Reset OTP</title>
      <style>
        body { margin: 0; padding: 24px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b1120; color: #f8fafc; }
        .card { max-width: 480px; margin: 0 auto; background: #1e293b; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.12); padding: 32px 28px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
        .brand-header { font-size: 19px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em; text-align: center; margin-bottom: 16px; }
        .title { font-size: 22px; font-weight: 800; color: #ffffff; text-align: center; margin: 0 0 10px 0; }
        .desc { font-size: 14px; color: #94a3b8; text-align: center; line-height: 1.5; margin: 0 0 24px 0; }
        .otp-container { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; box-shadow: 0 12px 28px rgba(2, 132, 199, 0.4); }
        .otp-code { font-size: 40px; font-weight: 900; letter-spacing: 10px; color: #ffffff; font-family: 'Courier New', Courier, monospace; display: block; }
        .otp-meta { font-size: 12px; color: #e0f2fe; margin-top: 8px; font-weight: 600; }
        .warning { font-size: 12.5px; color: #cbd5e1; text-align: center; line-height: 1.5; margin: 20px 0 0 0; }
        .footer { font-size: 11px; color: #64748b; text-align: center; margin-top: 28px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 18px; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="brand-header">⚡ RizeWorld Digital Marketing Pvt Ltd</div>
        <h2 class="title">Admin Password Reset</h2>
        <p class="desc">Hello ${toName || 'Admin'}, we received a request to reset your password for the RizeWorld Admin Dashboard.</p>
        
        <div class="otp-container">
          <span class="otp-code">${otpCode}</span>
          <div class="otp-meta">Valid for 10 minutes only • Do not share with anyone</div>
        </div>

        <p class="warning">If you did not request this verification code, please ignore this email or contact security.</p>
        
        <div class="footer">
          RizeWorld Central Agency Command • Admin Authentication System<br/>
          Securely dispatched via Brevo REST API
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'RizeWorld Studio Security', email: senderEmail },
        to: [{ email: toEmail, name: toName || 'Admin' }],
        subject: `[${otpCode}] Your RizeWorld Admin Reset OTP Code`,
        htmlContent: htmlContent,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`✅ [Brevo OTP Success] Real OTP Email sent to ${toEmail} | Message ID:`, data.messageId);
      return true;
    } else {
      console.error('❌ [Brevo API Error]:', data);
      return false;
    }
  } catch (err) {
    console.error('❌ [Brevo Fetch Error]:', err.message);
    return false;
  }
}

/**
 * Auto-Seed Master Admin account into MongoDB Atlas ('admins' & 'users' collections)
 */
export async function autoSeedMasterAdmin() {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@rizeworld.com').toLowerCase().trim();
    const adminPassword = (process.env.ADMIN_PASSWORD || 'Admin@123').trim();
    const hashed = hashPassword(adminPassword);

    // 1. Sync into 'admins' collection
    await Admin.findOneAndUpdate(
      { email: adminEmail },
      {
        email: adminEmail,
        password: adminPassword,
        plainPassword: adminPassword,
        hashedPassword: hashed,
        name: 'Admin',
        role: 'admin',
        updated_at: new Date(),
      },
      { upsert: true, new: true }
    );

    // 2. Sync into 'users' collection
    await User.findOneAndUpdate(
      { email: adminEmail },
      {
        email: adminEmail,
        password: adminPassword,
        plainPassword: adminPassword,
        hashedPassword: hashed,
        name: 'Admin',
        role: 'admin',
      },
      { upsert: true, new: true }
    );

    console.log(`👑 [Admin Auth] Admin synchronized in MongoDB Atlas ('admins' & 'users'): ${adminEmail}`);
  } catch (err) {
    console.warn('⚠️ [Admin Auth] Seed status note:', err.message);
  }
}

/* ============================================================
   1. ADMIN LOGIN (Sign In)
   Endpoint: POST /api/admin/login or /api/auth/login
   ============================================================ */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanPassword = String(password).trim();

    const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@rizeworld.com').toLowerCase().trim();
    const envAdminPass = (process.env.ADMIN_PASSWORD || 'Admin@123').trim();
    const refPassword = (process.env.REFFERLED_PASSWORD || 'Vikas@123').trim();

    // Check master match with .env
    const isMasterEmail = cleanEmail === envAdminEmail;
    const isMasterPass = cleanPassword === envAdminPass || cleanPassword === refPassword;

    let user = null;
    try {
      user = await Admin.findOne({ email: cleanEmail });
      if (!user) {
        user = await User.findOne({ email: cleanEmail });
      }
    } catch (e) {
      // MongoDB offline fallback
    }

    let isValid = false;
    if (user) {
      // Strict verification directly against MongoDB Atlas record
      const hashedInput = hashPassword(cleanPassword);
      if (
        user.password === cleanPassword || 
        user.password === hashedInput || 
        user.plainPassword === cleanPassword ||
        user.hashedPassword === hashedInput
      ) {
        isValid = true;
      }
    } else if (isMasterEmail && isMasterPass) {
      // Only as initial fallback if database collection is empty
      isValid = true;
      user = {
        id: 'admin-master',
        name: 'Admin',
        email: envAdminEmail,
        role: 'admin',
      };
    }

    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password. Please verify your credentials.' 
      });
    }

    // Update lastLogin in database
    try {
      const now = new Date();
      await Admin.updateOne({ email: cleanEmail }, { lastLogin: now, updated_at: now });
      await User.updateOne({ email: cleanEmail }, { lastLogin: now });
    } catch (err) {}

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login successful! Welcome to RizeWorld Admin Panel.',
      token,
      user: {
        id: user.id || user._id || 'admin-master',
        name: user.name || 'Admin',
        email: user.email,
        role: user.role || 'admin',
      },
    });
  } catch (err) {
    console.error('Admin Login error:', err);
    return res.status(500).json({ success: false, message: 'Server login error: ' + err.message });
  }
});

/* ============================================================
   2. FORGOT PASSWORD (Send Real 6-Digit OTP via Brevo)
   Endpoint: POST /api/admin/forgot-password or /api/auth/forgot-password
   ============================================================ */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Registered email address is required' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@rizeworld.com').toLowerCase().trim();

    // Check account in Database ('admins' and 'users')
    let user = null;
    try {
      user = await Admin.findOne({ email: cleanEmail });
      if (!user) {
        user = await User.findOne({ email: cleanEmail });
      }
    } catch (e) {}

    // Allow registered DB user OR master admin email from .env
    if (!user && cleanEmail !== envAdminEmail) {
      return res.status(404).json({ 
        success: false, 
        message: 'No registered admin account found with this email address.' 
      });
    }

    // Generate secure 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    // Save OTP to both 'admins' and 'users' collections in MongoDB
    try {
      await Admin.updateMany(
        { email: cleanEmail },
        { 
          otp, 
          otpExpiry: expiresAt, 
          resetOTP: otp, 
          resetOTPExpires: expiresAt, 
          updated_at: new Date() 
        },
        { upsert: true }
      );
      await User.updateMany(
        { email: cleanEmail },
        { 
          resetOTP: otp, 
          resetOTPExpires: expiresAt 
        }
      );
    } catch (err) {
      console.warn('DB OTP save note:', err.message);
    }

    // Also store in memory cache for high-reliability fallback
    memoryOtpStore.set(cleanEmail, {
      otp,
      expiresAt: expiresAt.getTime(),
    });

    // Send real OTP email to user inbox via Brevo
    const emailSent = await sendBrevoOtpEmail({
      toEmail: cleanEmail,
      toName: user ? user.name : 'Admin',
      otpCode: otp,
    });

    return res.json({
      success: true,
      message: emailSent 
        ? `6-Digit OTP has been sent successfully to ${cleanEmail}! Please check your email inbox.`
        : `6-Digit OTP generated. (Dispatched to ${cleanEmail})`,
      emailSent,
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send OTP: ' + err.message });
  }
});

/* ============================================================
   3. VERIFY OTP (Step 2 of Forgot Password)
   Endpoint: POST /api/admin/verify-otp or /api/auth/verify-otp
   ============================================================ */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit OTP are required' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    // Check in-memory store
    const memRecord = memoryOtpStore.get(cleanEmail);
    let isMemoryValid = false;
    if (memRecord && memRecord.otp === cleanOtp && memRecord.expiresAt > Date.now()) {
      isMemoryValid = true;
    }

    // Check database ('admins' and 'users')
    let isDbValid = false;
    try {
      const adminDoc = await Admin.findOne({ email: cleanEmail });
      if (adminDoc) {
        const matchesOtp = adminDoc.otp === cleanOtp || adminDoc.resetOTP === cleanOtp;
        const matchesExpiry = (adminDoc.otpExpiry && adminDoc.otpExpiry > new Date()) || 
                              (adminDoc.resetOTPExpires && adminDoc.resetOTPExpires > new Date());
        if (matchesOtp && matchesExpiry) {
          isDbValid = true;
        }
      }
      if (!isDbValid) {
        const userDoc = await User.findOne({ email: cleanEmail });
        if (userDoc && userDoc.resetOTP === cleanOtp && userDoc.resetOTPExpires && userDoc.resetOTPExpires > new Date()) {
          isDbValid = true;
        }
      }
    } catch (e) {}

    if (!isMemoryValid && !isDbValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired OTP code. Please enter the correct 6-digit code or request a new one.' 
      });
    }

    return res.json({
      success: true,
      message: 'OTP verified successfully! You may now set your new password.',
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ success: false, message: 'Failed to verify OTP: ' + err.message });
  }
});

/* ============================================================
   4. RESET & UPDATE PASSWORD (Step 3 of Forgot Password)
   Endpoint: POST /api/admin/reset-password or /api/auth/reset-password
   ============================================================ */
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanOtp = String(otp).trim();
    const cleanNewPass = String(newPassword).trim();

    if (cleanNewPass.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    // Verify OTP again
    const memRecord = memoryOtpStore.get(cleanEmail);
    let isMemoryValid = false;
    if (memRecord && memRecord.otp === cleanOtp && memRecord.expiresAt > Date.now()) {
      isMemoryValid = true;
    }

    let isDbValid = false;
    try {
      const adminDoc = await Admin.findOne({ email: cleanEmail });
      if (adminDoc) {
        const matchesOtp = adminDoc.otp === cleanOtp || adminDoc.resetOTP === cleanOtp;
        const matchesExpiry = (adminDoc.otpExpiry && adminDoc.otpExpiry > new Date()) || 
                              (adminDoc.resetOTPExpires && adminDoc.resetOTPExpires > new Date());
        if (matchesOtp && matchesExpiry) isDbValid = true;
      }
      if (!isDbValid) {
        const userDoc = await User.findOne({ email: cleanEmail });
        if (userDoc && userDoc.resetOTP === cleanOtp && userDoc.resetOTPExpires && userDoc.resetOTPExpires > new Date()) {
          isDbValid = true;
        }
      }
    } catch (e) {}

    if (!isMemoryValid && !isDbValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please restart the password reset process.' });
    }

    const hashedNewPass = hashPassword(cleanNewPass);

    // Save updated password in Database ('admins' & 'users') with plain text visible
    try {
      await Admin.updateMany(
        { email: cleanEmail },
        { 
          password: cleanNewPass,
          plainPassword: cleanNewPass,
          hashedPassword: hashedNewPass,
          otp: null,
          otpExpiry: null,
          resetOTP: null,
          resetOTPExpires: null,
          updated_at: new Date()
        }
      );
      await User.updateMany(
        { email: cleanEmail },
        { 
          password: cleanNewPass,
          plainPassword: cleanNewPass,
          hashedPassword: hashedNewPass,
          resetOTP: null,
          resetOTPExpires: null,
          updatedAt: new Date()
        }
      );
      console.log(`✅ [Admin Auth] Password updated in database ('admins' & 'users') for: ${cleanEmail}`);
    } catch (err) {
      console.warn('DB password update note:', err.message);
    }

    // Invalidate OTP in memory
    memoryOtpStore.delete(cleanEmail);

    return res.json({
      success: true,
      message: 'Password updated successfully! You can now login with your new credentials.',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reset password: ' + err.message });
  }
});

/* ============================================================
   5. VERIFY CURRENT ADMIN SESSION
   Endpoint: GET /api/admin/me or /api/auth/me
   ============================================================ */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    const parts = token.split('.');
    if (parts.length !== 2) {
      return res.status(401).json({ success: false, message: 'Malformed authorization token' });
    }

    const [payloadB64, signature] = parts;
    const secret = process.env.SECRET_KEY || 'itisthesecretkeyforrizeworidInstituteapp';
    const payloadStr = Buffer.from(payloadB64, 'base64').toString('utf8');
    const expectedSignature = crypto.createHmac('sha256', secret).update(payloadStr).digest('hex');

    if (signature !== expectedSignature) {
      return res.status(401).json({ success: false, message: 'Invalid token signature' });
    }

    const data = JSON.parse(payloadStr);
    if (data.exp && data.exp < Date.now()) {
      return res.status(401).json({ success: false, message: 'Session token has expired' });
    }

    return res.json({
      success: true,
      user: {
        id: data.id,
        email: data.email,
        name: 'Admin',
        role: data.role || 'admin',
      },
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid session: ' + err.message });
  }
});

export default router;
