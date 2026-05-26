# My Expense Tracker

## Project Summary
My Expense Tracker is a single-page web application that allows users to record, manage, and analyze their personal expenses. It provides a clean and simple dashboard to help users understand their spending habits.

## Problem Statement
Managing daily expenses manually can be inconvenient and unclear. This application helps users track spending in one place and visualize their financial habits through summaries and charts.

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB (Local)
- HTTP Client: Axios
- Charts: Recharts

## Features
- Single-page application (SPA)
- Add new expenses
- Edit existing expenses
- Delete expenses
- View expense list
- Category summary
- Monthly summary chart
- Total expense overview
- Category color labels
- Responsive UI design

## Folder Structure
expense-tracker/
├── client/ (React frontend)
├── server/ (Express backend)
├── sample-data.json (example data)
└── README.md

## How to Run the Project

1. Install backend dependencies  
cd server  
npm install  

2. Install frontend dependencies  
cd client  
npm install  

3. Start backend server  
cd server  
npm run dev  

4. Start frontend  
cd client  
npm run dev  

5. Open in browser  
http://localhost:5173  

## Database Setup
This project uses a local MongoDB database.

Connection:
mongodb://localhost:27017/expenseTracker

Make sure MongoDB is installed and running before starting the server.

If MongoDB is not available, example data is provided in sample-data.json.

If MongoDB is not running, the application UI can still be viewed, but CRUD functionality will not work. Sample data is provided in sample-data.json for reference.

## Data Format
Date format used in this project:
YYYY-MM-DD

## Challenges Overcome
During development, I found it a bit challenging to connect the frontend, backend, and database properly.
I also needed to figure out how to update data without refreshing the page, so the app behaves like a single-page application.
Besides that, I worked on improving the UI by adding summary cards, charts, and category color labels to make it more clear and user-friendly.

## Notes
This project is designed as a simple and functional expense tracking system. The structure is modular and can be extended with features such as authentication, filtering, or cloud database integration.

