const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Configure email transporter (using free Ethereal email for testing)
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.ETHEREAL_EMAIL || "test@ethereal.email",
    pass: process.env.ETHEREAL_PASSWORD || "testpassword",
  },
});

// Store reset codes temporarily (in production, use Redis or database)
const resetCodes = new Map();

// Request password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 3600000; // 1 hour

    resetCodes.set(email, { code, expires });

    // Send email (using Ethereal for testing - shows in console)
    const mailOptions = {
      from: '"E-Learn Platform" <noreply@elearn.com>',
      to: email,
      subject: "Password Reset Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #5a6499;">Password Reset Request</h2>
          <p>You requested to reset your password. Use the code below:</p>
          <div style="background: #f4f5ff; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; border-radius: 8px;">
            <strong>${code}</strong>
          </div>
          <p>This code expires in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">E-Learn Platform</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Reset code for ${email}: ${code}`);

    res.json({ message: "Reset code sent to email" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify reset code
router.post("/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body;
    const record = resetCodes.get(email);

    if (!record) {
      return res.status(400).json({ message: "No reset request found" });
    }

    if (Date.now() > record.expires) {
      resetCodes.delete(email);
      return res
        .status(400)
        .json({ message: "Code expired. Request a new one." });
    }

    if (record.code !== code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    res.json({ message: "Code verified" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const record = resetCodes.get(email);

    if (!record || record.code !== code) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    resetCodes.delete(email);

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
