const express = require("express");
const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes working!" });
});

// Register route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Simple response for now
    res.status(201).json({
      message: "Registration successful",
      user: {
        name,
        email,
        role: role || "student",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user in database
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // In production, you'd check hashed password here
    // For now, simple comparison (temporary)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Create token (you'll need to add JWT)
    const token = 'temp-token-' + Date.now(); // Temporary
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboarded: user.onboarded,
        xp: user.xp,
        level: user.level,
        profile: user.profile
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
