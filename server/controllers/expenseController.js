// Import Expense model (used to interact with MongoDB)
const Expense = require("../models/Expense");

// Import createActivity helper to record user actions
const { createActivity } = require("./activityController");


// Create a new expense (POST request)
const createExpense = async (req, res) => {
  try {
    // Extract data sent from frontend
    const { title, category, amount, date, description } = req.body;

    // Basic validation: check required fields
    if (!title || !category || amount === undefined || !date) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    // Create a new Expense document and link it to the logged-in user
    const newExpense = new Expense({
      user: req.user._id,
      title,
      category,
      amount,
      date,
      description,
    });

    // Save the new expense into database
    const savedExpense = await newExpense.save();

    // Record user activity
    await createActivity(req.user, "CREATE_EXPENSE", `Created expense: ${savedExpense.title}`);

    // Send back created data with 201 (created)
    res.status(201).json(savedExpense);
  } catch (error) {
    // If something goes wrong on server
    res.status(500).json({ message: "Failed to create expense." });
  }
};


// Get all expenses (GET request)
const getAllExpenses = async (req, res) => {
  try {
    // Find expenses that belong to the logged-in user and sort by newest first
    const expenses = await Expense.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Return data to frontend
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses." });
  }
};


// Update an existing expense (PUT request)
const updateExpense = async (req, res) => {
  try {
    // Get id from URL (e.g. /expenses/:id)
    const { id } = req.params;

    // Find the document by id and user, then update it
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // If no matching document found
    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    // Record user activity
    await createActivity(req.user, "UPDATE_EXPENSE", `Updated expense: ${updatedExpense.title}`);

    // Send updated data back
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: "Failed to update expense." });
  }
};


// Delete an expense (DELETE request)
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Remove the document from database only if it belongs to the logged-in user
    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    // If no matching document found
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    // Record user activity
    await createActivity(req.user, "DELETE_EXPENSE", `Deleted expense: ${deletedExpense.title}`);

    // Send success message
    res.status(200).json({ message: "Expense deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete expense." });
  }
};


// Get summary grouped by category (Aggregation)
const getCategorySummary = async (req, res) => {
  try {
    // Use MongoDB aggregation pipeline
    const summary = await Expense.aggregate([
      {
        // Only include expenses from the logged-in user
        $match: { user: req.user._id },
      },
      {
        // Group expenses by category
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      // Sort from highest total to lowest total
      { $sort: { total: -1 } },
    ]);

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category summary." });
  }
};


// Get summary grouped by month (Manual processing)
const getMonthlySummary = async (req, res) => {
  try {
    // Fetch expenses that belong to the logged-in user
    const expenses = await Expense.find({ user: req.user._id });

    const monthlyMap = {}; // Object to store month -> total

    // Loop through each expense
    expenses.forEach((expense) => {
      // Extract month (YYYY-MM)
      const month = expense.date.slice(0, 7);

      // Initialize month if not exists
      if (!monthlyMap[month]) {
        monthlyMap[month] = 0;
      }

      // Add amount to corresponding month
      monthlyMap[month] += expense.amount;
    });

    // Convert object into sorted array for frontend
    const result = Object.keys(monthlyMap)
      .sort()
      .map((month) => ({
        month,
        total: monthlyMap[month],
      }));

    // Send formatted result
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch monthly summary." });
  }
};


// Export all controller functions so routes can use them
module.exports = {
  createExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  getCategorySummary,
  getMonthlySummary,
};