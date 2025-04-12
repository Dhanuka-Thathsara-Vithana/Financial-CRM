const express = require("express");
const router = express.Router();
const { authJwt } = require("../Middleware");
const ticketController = require("../Controllers/ticketController");


router.use(authJwt.verifyToken);

// Create a new ticket
router.post("/", ticketController.createTicket);

// Get all tickets 
router.get("/", ticketController.getAllTickets);

// Get tickets belonging to the current user
router.get("/my-tickets", ticketController.getMyTickets);

// Get a specific ticket by ID
router.get("/:id", ticketController.getTicketById);

// Update a ticket
router.put("/:id", ticketController.updateTicket);

// Assign a ticket to a user
router.put("/:id/assign", ticketController.assignTicket);

// Delete a ticket
router.delete("/:id", ticketController.deleteTicket);

// Health check route
router.get("/health", (req, res) => {
  res.send("Ticket service is running");
});

module.exports = router;