const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Import expense routes
const expenseRoutes = require("./routes/expenses");

// Import auth routes
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

// Enable CORS so frontend can communicate with backend
app.use(cors());

// Parse incoming JSON data
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Expense Tracker API is running.");
});

// Expense API routes
app.use("/api/expenses", expenseRoutes);

// Auth API routes
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully.");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });