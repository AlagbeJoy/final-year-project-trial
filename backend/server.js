const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/elearning")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Auto-port selection
const startServer = (port) => {
  const server = app
    .listen(port)
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`⚠️ Port ${port} is busy, trying ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error("Server error:", err);
      }
    })
    .on("listening", () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📝 API URL: http://localhost:${port}/api`);
      console.log(`🔧 Test endpoint: http://localhost:${port}/api/test`);
    });
};

// Get desired port from .env or default to 5000
const desiredPort = parseInt(process.env.PORT) || 5000;
startServer(desiredPort);
