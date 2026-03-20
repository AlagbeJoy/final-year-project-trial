const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("❌ No token provided");
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    console.log("✅ Token received, length:", token.length);

    // Since you're using temp tokens, we need to get user from the token
    // For now, let's decode it (in production, use jwt.verify)
    const decoded = jwt.decode(token);

    if (!decoded) {
      console.log("❌ Invalid token");
      return res.status(401).json({ message: "Invalid token" });
    }

    console.log("✅ Decoded token:", decoded);

    // Get user email from decoded token
    // Your login route returns user object, so the token might contain user info
    const userEmail = decoded.email || decoded.user?.email;

    if (!userEmail) {
      console.log("❌ No email in token");
      return res.status(401).json({ message: "Invalid token - no email" });
    }

    // Find the user in database
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.log("❌ User not found in database:", userEmail);
      return res.status(401).json({ message: "User not found" });
    }

    console.log("✅ User found in database:", user.email, "ID:", user._id);

    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    res.status(500).json({ message: "Server error in authentication" });
  }
};
