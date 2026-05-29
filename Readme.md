 My Expense Tracker


Teammate

Longfei Du 24670503

Lingxiao Wang 25466044

Wenxin Liu 24604555

 Project Overview

My Expense Tracker is a full-stack Single Page Application (SPA) that allows users to record, manage, search, and analyze personal expenses.

The project was developed using React, Node.js, Express, and MongoDB. It provides a modern dashboard for expense management while also supporting user authentication, activity tracking, and administrator monitoring features.

The system allows different users to maintain their own expense records securely and provides administrators with tools to monitor system activities.



 Problem Statement

Managing daily expenses manually can be difficult and time-consuming. Many users struggle to keep track of spending habits and identify where money is being spent.

This application provides a centralized platform where users can:

- Record expenses
- Manage expense records
- Analyze spending habits
- Search expenses instantly
- Visualize financial data
- Securely manage personal accounts

The goal is to make personal finance management easier, more organized, and more accessible.



 Technologies Used

 Frontend

- React
- Vite
- Axios
- Recharts

 Backend

- Node.js
- Express.js

 Database

- MongoDB
- Mongoose

 Authentication & Security

- JSON Web Token (JWT)
- bcryptjs Password Hashing



 Features

 Authentication

- User Registration
- User Login
- Password Hashing with bcrypt
- JWT Authentication
- Protected API Routes

 User Management

 Standard User

Regular users can:

- Register an account
- Login securely
- Create expenses
- View their own expenses
- Update expenses
- Delete expenses
- Search expenses in real time
- View financial summaries and charts

 Administrator

Administrators can:

- Access the Admin Dashboard
- View user activity logs
- Monitor system usage
- Review login history
- Monitor CRUD operations

 Expense Management

- Create Expense
- Read Expense
- Update Expense
- Delete Expense

 Live Search

Real-time filtering of expenses by:

- Title
- Category
- Amount
- Date
- Description

 Data Visualization

- Total Expense Overview
- Category Summary
- Monthly Expense Summary
- Interactive Charts

 User Activity Tracking

The system automatically records:

- Login Activity
- Expense Creation
- Expense Updates
- Expense Deletion

 Admin Dashboard

The Admin Dashboard provides:

- User activity monitoring
- Activity history tracking
- CRUD operation records
- Login history review

---

 Folder Structure


expense-tracker/

├── client/
│   ├── src/
│   ├── components/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
│
├── sample-data.json
└── README.md




 Database Collections

 Users

Stores user account information.

Fields:

- username
- email
- password (hashed)
- role

Example:


{
  "username": "admin",
  "email": "admin@test.com",
  "password": "hashed_password",
  "role": "admin"
}


 Expenses

Stores expense records.

Fields:

- user
- title
- category
- amount
- date
- description

Example:


{
  "title": "Pizza",
  "category": "Food",
  "amount": 25,
  "date": "2026-05-20",
  "description": "Dinner"
}


 User Activities

Stores activity logs.

Fields:

- username
- action
- detail
- createdAt

Example:


{
  "username": "admin",
  "action": "DELETE_EXPENSE",
  "detail": "Deleted expense: Pizza"
}




 Installation Guide

 1. Clone Repository


git clone <repository-url>


 2. Install Backend Dependencies


cd server
npm install


 3. Install Frontend Dependencies


cd client
npm install


 4. Configure Environment Variables

Create a `.env` file inside the server folder:


PORT=5000

MONGO_URI=mongodb://localhost:27017/expenseTracker

JWT_SECRET=your_secret_key

 5. Start Backend Server


cd server
npm run dev


 6. Start Frontend


cd client
npm run dev


 7. Open Application


http://localhost:5173



 Test Accounts

 Administrator


Email:
admin@test.com

Password:
123456


 Standard User


Email:
test@test.com

Password:
123456




 API Endpoints

 Authentication


POST /api/auth/register


Register a new user.


POST /api/auth/login


Login and receive JWT token.



 Expenses


GET /api/expenses


Get all expenses.


POST /api/expenses


Create a new expense.


PUT /api/expenses/:id


Update an expense.


DELETE /api/expenses/:id


Delete an expense.


 Summaries


GET /api/expenses/summary/category


Get category summary.


GET /api/expenses/summary/monthly


Get monthly summary.



 Activities


GET /api/activities


Get activity logs (Admin only).



 Challenges Faced

During development several challenges were encountered:

- Connecting React, Express, and MongoDB together
- Implementing JWT authentication
- Securing API routes with middleware
- Managing state without page refreshes
- Recording user activities automatically
- Building an Admin Dashboard
- Implementing real-time search functionality
- Maintaining SPA behaviour while updating data dynamically



 Future Improvements

Potential future enhancements include:

- User profile editing
- Password reset functionality
- Budget planning features
- Expense export to PDF
- MongoDB Atlas cloud deployment
- Role-based permission expansion
- Advanced analytics dashboard
- Email verification
- Dark Mode support



 Conclusion

My Expense Tracker demonstrates the development of a modern full-stack web application using React, Express, Node.js, and MongoDB.

The project includes secure authentication, expense management, live searching, activity tracking, and administrative monitoring features while maintaining a responsive and user-friendly interface.

This project showcases both frontend and backend development skills as well as database integration and authentication implementation.
