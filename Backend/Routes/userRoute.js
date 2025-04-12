const express = require("express");
const router = express.Router();
const { authJwt } = require("../Middleware");
const userController = require("../Controllers/userController");

// All routes require authentication
router.use(authJwt.verifyToken);

// Get all users (admin only)
router.get("/", authJwt.isAdmin, userController.getAllUsers);

// Get current user
router.get("/me", userController.getCurrentUser);

// Get all users except admins
router.get("/users", userController.getUsersWithoutAdmins);

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
