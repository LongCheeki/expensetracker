// Import mongoose (library used to interact with MongoDB)
const mongoose = require("mongoose");

// Define schema (structure of each expense document in the database)
const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Expense title (e.g. Lunch, Taxi)
    title: {
      type: String,   // Must be a string
      required: true, // This field is required
      trim: true,     // Remove extra spaces from input
    },

    // Expense category (e.g. food, transport)
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Amount spent
    amount: {
      type: Number,   // Must be a number
      required: true, // Required field
      min: 0,         // Cannot be negative
    },

    // Date of the expense (stored as string, e.g. "2026-04-20")
    date: {
      type: String,
      required: true,
    },

    // Optional description (extra notes)
    description: {
      type: String,
      default: "",    // Default value if not provided
      trim: true,
    },
  },

  // Automatically add createdAt and updatedAt fields
  { timestamps: true }
);

// Export model so it can be used in controllers
// "Expense" will be the collection name in MongoDB
module.exports = mongoose.model("Expense", expenseSchema);