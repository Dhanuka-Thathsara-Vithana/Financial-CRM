// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { verifySignUp } = require("../Middleware");
const authController = require("../Controllers/authController");

// Apply middleware to specific routes
router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRoleExists],
  authController.signup
);

router.post("/signin", authController.signin);
router.post("/refreshtoken", authController.refreshToken);
router.post("/signout", authController.signout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);


// Health check route
router.get("/health", (req, res) => {
  res.send("Auth service is running");
});

module.exports = router;





