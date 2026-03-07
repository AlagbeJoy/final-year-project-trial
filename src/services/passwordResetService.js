// src/services/passwordResetService.js
class PasswordResetService {
  constructor() {
    this.tokens = new Map(); // In production, use a database
    this.tokenExpiry = 60 * 60 * 1000; // 1 hour in milliseconds
  }

  /**
   * Generate a reset token for a user
   */
  generateToken(email) {
    // Generate a random 6-digit code
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    // Store with expiry
    this.tokens.set(email, {
      token,
      expires: Date.now() + this.tokenExpiry,
      attempts: 0,
    });

    console.log(`🔐 Reset token for ${email}: ${token}`); // In production, send via email

    return token;
  }

  /**
   * Verify reset token
   */
  verifyToken(email, token) {
    const record = this.tokens.get(email);

    if (!record) {
      return { valid: false, message: "No reset request found" };
    }

    if (Date.now() > record.expires) {
      this.tokens.delete(email);
      return { valid: false, message: "Token has expired" };
    }

    if (record.attempts >= 5) {
      this.tokens.delete(email);
      return { valid: false, message: "Too many failed attempts" };
    }

    if (record.token !== token) {
      record.attempts++;
      this.tokens.set(email, record);
      return { valid: false, message: "Invalid token" };
    }

    // Token is valid - remove it so it can't be used again
    this.tokens.delete(email);
    return { valid: true };
  }

  /**
   * Mock email sending (replace with real email service)
   */
  async sendResetEmail(email, token) {
    // In development, just log to console
    console.log(`
      ==================================
      🔐 PASSWORD RESET REQUEST
      Email: ${email}
      Reset Code: ${token}
      Expires: ${new Date(Date.now() + this.tokenExpiry).toLocaleString()}
      ==================================
    `);

    // For production, integrate with email service
    // Example with SendGrid:
    /*
    const msg = {
      to: email,
      from: 'noreply@yourapp.com',
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>Your reset code is: <strong>${token}</strong></p>
        <p>This code will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };
    await sgMail.send(msg);
    */

    return { success: true };
  }

  /**
   * Reset password
   */
  resetPassword(email, newPassword) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((u) => u.email === email);

    if (userIndex === -1) {
      return { success: false, message: "User not found" };
    }

    // Update password
    users[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));

    // Clear current user if it's the same email
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.email === email) {
      localStorage.removeItem("currentUser");
    }

    return { success: true };
  }
}

export default new PasswordResetService();
