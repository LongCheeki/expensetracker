// Import Express framework (used to build backend server)
const express = require("express");

// Create a router instance to define API routes
const router = express.Router();

// Import controller functions (these handle the actual logic)
const {
  createExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  getCategorySummary,
  getMonthlySummary,
} = require("../controllers/expenseController");


// Route: Create a new expense
// POST /api/expenses
router.post("/", createExpense);

// Route: Get all expenses
// GET /api/expenses
router.get("/", getAllExpenses);

// Route: Get category summary
// GET /api/expenses/summary/category
router.get("/summary/category", getCategorySummary);

// Route: Get monthly summary
// GET /api/expenses/summary/monthly
router.get("/summary/monthly", getMonthlySummary);

// Route: Update an expense by ID
// PUT /api/expenses/:id
router.put("/:id", updateExpense);

// Route: Delete an expense by ID
// DELETE /api/expenses/:id
router.delete("/:id", deleteExpense);

// Export router so it can be used in server.js
module.exports = router;