# 💼 Financial CRM System

A comprehensive Customer Relationship Management (CRM) system tailored for a financial services company based in Melbourne, Australia. This system streamlines client management, ticket tracking, and communication between financial planners and mortgage brokers.

---

## 📑 Table of Contents

- [Features](#features)
- [Technical Stack](#technical-stack)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)

---

## 🚀 Features

### 🔐 User Authentication & Authorization

- Secure JWT-based authentication using HTTP-only cookies
- Three user roles:
  - **Admin**
  - **Financial Planner**
  - **Mortgage Broker**
- Email-based password reset functionality
- Token refresh mechanism

### 👥 User Management (Admin)

- Create and manage user accounts with various roles
- View and update user profiles and contact information

### 🎫 Ticket Management System

- Create and track client tickets with detailed personal and financial info
- Assign and reassign tickets between Financial Planners and Mortgage Brokers
- Monitor ticket progress across multiple statuses (e.g., New, In Progress, Closed)

### 💬 Communication System

- Seamless ticket sharing and role-based collaboration
- Email notifications for important updates
- Notes and comments for each ticket to improve communication

---

## 🛠️ Technical Stack

### Frontend

- React with TypeScript
- Redux for state management
- Material UI component library
- Axios for API communication

### Backend

- Node.js with Express
- Sequelize ORM with MySQL
- JWT for authentication
- Nodemailer for email services

---

## ⚙️ Installation

### 🔧 Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/)
- Access to an SMTP server for sending emails

---

### 📦 Backend Setup

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database and SMTP credentials

# Initialize the database
npm run db:migrate
npm run db:seed

# Start the server
npm run dev

```

### 🌐 Frontend Setup

```bash
# Navigate to frontend directory
cd ../Frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Set the REACT_APP_API_BASE_URL and other config values

# Start the frontend app
npm run dev

```

### Create User Role

first load the postman collection

send post request to create new Admin

then login to the system


Enjoy 
