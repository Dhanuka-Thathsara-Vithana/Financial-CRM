// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { authJwt } = require("../Middleware");
const userController = require("../Controllers/userController");

// All routes require authentication
router.use(authJwt.verifyToken);

// Get all users (admin only)
router.get("/", authJwt.isAdmin, userController.getAllUsers);

// Get current user - MUST come before the /:id route
router.get("/me", userController.getCurrentUser);

// Get user by ID
router.get("/:id", userController.getUserById);

// Update user
router.put("/:id", userController.updateUser);

// Delete user (admin only)
router.delete("/:id", authJwt.isAdmin, userController.deleteUser);

// Health check route
router.get("/health", (req, res) => {
  res.send("User service is running");
});

module.exports = router;
