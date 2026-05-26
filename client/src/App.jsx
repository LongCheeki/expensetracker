// Import React hooks:
// useState is used to store and update component state
// useEffect is used to run code when the component loads
// useMemo is used to memoize values that do not need recalculating on every render
import { useEffect, useMemo, useState } from "react";

// Import chart components from Recharts library
// These are used to display the monthly spending chart
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Import the pre-configured API helper (axios instance)
import api from "./services/api";

// Import global styles for this page
import "./index.css";

function App() {
  // Store all expense records returned from the backend
  const [expenses, setExpenses] = useState([]);

  // Store grouped summary data by category
  const [categorySummary, setCategorySummary] = useState([]);

  // Store grouped summary data by month
  const [monthlySummary, setMonthlySummary] = useState([]);


 // Store the current live search keyword
  const [searchTerm, setSearchTerm] = useState("");


  // Store the id of the expense currently being edited
  // If null, the form is in "add" mode
  const [editingId, setEditingId] = useState(null);

  // Store any error message that should be shown on the page
  const [error, setError] = useState("");

  // Store all form input values
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
    description: "",
  });

  // Store preset colors for chart bars
  // useMemo keeps this array stable between renders
  const chartColors = useMemo(
    () => ["#4f46e5", "#7c3aed", "#06b6d4", "#0ea5e9", "#8b5cf6", "#14b8a6"],
    []
  );

  // Define custom colors for known categories
  const categoryColorMap = {
    food: "#f59e0b",
    transport: "#0ea5e9",
    entertainment: "#8b5cf6",
    shopping: "#ec4899",
    study: "#10b981",
    bills: "#ef4444",
    health: "#14b8a6",
    travel: "#6366f1",
    gaming: "#7c3aed",
  };

  // Return a category color based on its name
  // If category is empty, return a default grey
  // If category is not in the predefined map, return another fallback grey
  const getCategoryColor = (category) => {
    if (!category) return "#6b7280";
    return categoryColorMap[category.toLowerCase()] || "#64748b";
  };

  // Convert a date string from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Convert a month string from YYYY-MM to MM/YYYY
  const formatMonth = (monthString) => {
    if (!monthString) return "";
    const [year, month] = monthString.split("-");
    return `${month}/${year}`;
  };

  // Calculate the total amount spent across all expenses
  // Number(...) ensures the amount is treated as a number
  const totalSpent = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);


  const filteredExpenses = useMemo(() => {
  const keyword = searchTerm.trim().toLowerCase();

  if (!keyword) {
    return expenses;
  }

  return expenses.filter((expense) => {
    return (
      expense.title?.toLowerCase().includes(keyword) ||
      expense.category?.toLowerCase().includes(keyword) ||
      expense.description?.toLowerCase().includes(keyword) ||
      expense.date?.toLowerCase().includes(keyword) ||
      String(expense.amount).includes(keyword)
    );
  });
}, [expenses, searchTerm]);


  // Fetch all expense records from backend
  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch {
      setError("Failed to load expenses.");
    }
  };

  // Fetch grouped category summary data from backend
  const fetchCategorySummary = async () => {
    try {
      const res = await api.get("/expenses/summary/category");
      setCategorySummary(res.data);
    } catch {
      // If request fails, show empty summary instead of crashing
      setCategorySummary([]);
    }
  };

  // Fetch grouped monthly summary data from backend
  const fetchMonthlySummary = async () => {
    try {
      const res = await api.get("/expenses/summary/monthly");
      setMonthlySummary(res.data);
    } catch {
      // If request fails, show empty chart data instead of crashing
      setMonthlySummary([]);
    }
  };

  // Refresh all displayed data at once
  // This is called after page load and after add/edit/delete actions
  const refreshData = () => {
    fetchExpenses();
    fetchCategorySummary();
    fetchMonthlySummary();
  };

  // Run once when the component first loads
  // This loads the latest data from the backend
  useEffect(() => {
    refreshData();
  }, []);

  // Handle input changes in the form
  // e.target.name identifies which input changed
  // e.target.value is the new value entered by the user
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Reset form back to default empty state
  // Also exit edit mode and clear any error message
  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      amount: "",
      date: "",
      description: "",
    });
    setEditingId(null);
    setError("");
  };

  // Handle form submission
  // This function either creates a new expense or updates an existing one
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic front-end validation for required fields
    if (!formData.title || !formData.category || !formData.amount || !formData.date) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      // Create a payload object to send to backend
      // Convert amount from string to number
      const payload = {
        ...formData,
        amount: Number(formData.amount),
      };

      // If editingId exists, update an existing record
      // Otherwise, create a new record
      if (editingId) {
        await api.put(`/expenses/${editingId}`, payload);
      } else {
        await api.post("/expenses", payload);
      }

      // Reset form and reload the latest data
      resetForm();
      refreshData();
    } catch {
      setError("Failed to save expense.");
    }
  };

  // Load selected expense into the form for editing
  const handleEdit = (expense) => {
    setFormData({
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      description: expense.description || "",
    });

    // Save the id so the form knows it is editing an existing record
    setEditingId(expense._id);

    // Scroll to the top so the user can immediately see the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete an expense by id
  const handleDelete = async (id) => {
    // Ask user for confirmation before deleting
    const confirmed = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmed) return;

    try {
      await api.delete(`/expenses/${id}`);
      refreshData();
    } catch {
      setError("Failed to delete expense.");
    }
  };

  return (
    <div className="app">
      {/* Page header */}
      <header className="header">
        <div className="header-badge">My Finance Dashboard</div>
        <h1>My Expense Tracker</h1>
        <p>A simple way to track and understand your spending.</p>
      </header>

      {/* Top summary cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Expenses</span>
          <strong className="stat-value">${totalSpent.toFixed(2)}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Entries</span>
          <strong className="stat-value">{expenses.length}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Categories</span>
          <strong className="stat-value">{categorySummary.length}</strong>
        </div>
      </section>

      {/* Main content area */}
      <main className="main-grid">
        {/* Expense form card */}
        <section className="card form-card">
          <h2>{editingId ? "Edit Expense" : "Add Expense"}</h2>

          {/* Form for creating or updating an expense */}
          <form onSubmit={handleSubmit} className="expense-form">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
            />

            <input type="date" name="date" value={formData.date} onChange={handleChange} />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />

            {/* Form buttons */}
            <div className="button-row">
              <button type="submit" className="primary-btn">
                {editingId ? "Update Expense" : "Add New Expense"}
              </button>

              {/* Only show Cancel button while editing */}
              {editingId && (
                <button type="button" className="secondary-btn" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Display error message if something goes wrong */}
          {error && <p className="error-text">{error}</p>}
        </section>

        {/* Expense list card */}
        <section className="card">
          <div className="section-head">
            <h2>Expense List</h2>
            <span className="section-count">
              {filteredExpenses.length} item{filteredExpenses.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by title, category, amount, date, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Show empty state if there are no expenses */}
          {filteredExpenses.length === 0 ? (
            <div className="empty-state">
              {expenses.length === 0 ? "No expenses yet." : "No matching expenses found."}
            </div>
          ) : (
            <div className="expense-list">
              {/* Loop through all expenses and render each item */}
              {filteredExpenses.map((expense) => (
                <div className="expense-item" key={expense._id}>
                  <div className="expense-content">
                    <div className="expense-top">
                      <h3>{expense.title}</h3>

                      {/* Category label with dynamic color */}
                      <span
                        className="category-pill"
                        style={{
                          backgroundColor: `${getCategoryColor(expense.category)}1a`,
                          color: getCategoryColor(expense.category),
                        }}
                      >
                        {expense.category}
                      </span>
                    </div>

                    <p className="expense-amount">${Number(expense.amount).toFixed(2)}</p>
                    <p>Date: {formatDate(expense.date)}</p>
                    <p>{expense.description}</p>
                  </div>

                  {/* Edit and delete buttons */}
                  <div className="button-column">
                    <button className="edit-btn" onClick={() => handleEdit(expense)}>
                      Edit
                    </button>
                    <button className="danger-btn" onClick={() => handleDelete(expense._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Category summary card */}
        <section className="card">
          <div className="section-head">
            <h2>Category Summary</h2>
          </div>

          {/* Show empty state if there is no summary data */}
          {categorySummary.length === 0 ? (
            <div className="empty-state">No data available.</div>
          ) : (
            <div className="summary-list">
              {/* Render each category summary row */}
              {categorySummary.map((item) => (
                <div className="summary-row" key={item._id}>
                  <div className="summary-left">
                    {/* Small colored dot for category */}
                    <span
                      className="summary-dot"
                      style={{ backgroundColor: getCategoryColor(item._id) }}
                    />
                    <span>{item._id}</span>
                  </div>
                  <strong>${item.total.toFixed(2)}</strong>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Monthly summary chart card */}
        <section className="card chart-card">
          <div className="section-head">
            <h2>Monthly Summary</h2>
          </div>

          {/* Show empty state if there is no chart data */}
          {monthlySummary.length === 0 ? (
            <div className="empty-state">No data available.</div>
          ) : (
            <div className="chart-wrapper">
              {/* ResponsiveContainer makes the chart fit the available space */}
              <ResponsiveContainer>
                <BarChart data={monthlySummary}>
                  {/* Background grid lines */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  {/* X axis shows month labels */}
                  <XAxis dataKey="month" tickFormatter={formatMonth} />

                  {/* Y axis shows total spending values */}
                  <YAxis />

                  {/* Tooltip shown when hovering over bars */}
                  <Tooltip
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, "Total"]}
                    labelFormatter={(label) => formatMonth(label)}
                  />

                  {/* Bar chart using total field */}
                  <Bar dataKey="total" radius={[10, 10, 0, 0]}>
                    {/* Assign a different color to each bar */}
                    {monthlySummary.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.month}`}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;