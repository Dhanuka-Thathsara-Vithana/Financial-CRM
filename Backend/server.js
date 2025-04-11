// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./Routes/authRoute");
const userRoutes = require("./Routes/userRoute");
const ticketRoutes = require("./Routes/ticketRoute");

const app = express();

// Connect to database
const db = require("./Models");
db.sequelize.sync({ force: process.env.DB_FORCE_SYNC === 'true' })
  .then(() => console.log('Connected to MySQL database...'))
  .catch(err => console.error('Could not connect to database:', err));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// CORS for Secure Cookies
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Root API Test
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Financial CRM API is running",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);

// Server Port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));