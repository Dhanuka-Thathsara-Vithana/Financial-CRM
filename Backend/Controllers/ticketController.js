const db = require("../Models");
const Ticket = db.ticket;
const User = db.user;
const { v4: uuidv4 } = require('uuid');

exports.createTicket = async (req, res) => {
  try {
    // Generate a unique serial number
    const serialNumber = `TKT-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    const ticket = await Ticket.create({
      serialNumber: serialNumber,
      clientName: req.body.clientName,
      clientAddress: req.body.clientAddress,
      clientPhone: req.body.clientPhone,
      clientEmail: req.body.clientEmail,
      amount: req.body.amount,
      status: 'open',
      notes: req.body.notes,
      createdBy: req.userId
    });
    
    res.status(201).send({
      message: "Ticket created successfully!",
      ticket: ticket
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'email', 'role']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'username', 'email', 'role']
        }
      ]
    });
    
    res.status(200).send(tickets);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'email', 'role']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'username', 'email', 'role']
        }
      ]
    });
    
    if (!ticket) {
      return res.status(404).send({ message: "Ticket not found." });
    }
    
    res.status(200).send(ticket);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { createdBy: req.userId },
          { assignedTo: req.userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'email', 'role']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'username', 'email', 'role']
        }
      ]
    });
    
    res.status(200).send(tickets);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    
    if (!ticket) {
      return res.status(404).send({ message: "Ticket not found." });
    }
    
    // Update the ticket
    await ticket.update({
      clientName: req.body.clientName || ticket.clientName,
      clientAddress: req.body.clientAddress || ticket.clientAddress,
      clientPhone: req.body.clientPhone || ticket.clientPhone,
      clientEmail: req.body.clientEmail || ticket.clientEmail,
      amount: req.body.amount || ticket.amount,
      status: req.body.status || ticket.status,
      notes: req.body.notes || ticket.notes
    });
    
    res.status(200).send({
      message: "Ticket updated successfully!",
      ticket: ticket
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.assignTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    
    if (!ticket) {
      return res.status(404).send({ message: "Ticket not found." });
    }
    
    // Check if the target user exists
    const assignee = await User.findByPk(req.body.assignedTo);
    
    if (!assignee) {
      return res.status(404).send({ message: "Assignee user not found." });
    }
    
    // Update ticket assignment
    await ticket.update({
      assignedTo: req.body.assignedTo,
      status: 'in_progress'
    });
    
    const updatedTicket = await Ticket.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'email', 'role']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'username', 'email', 'role']
        }
      ]
    });
    
    res.status(200).send({
      message: "Ticket assigned successfully!",
      ticket: updatedTicket
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    
    if (!ticket) {
      return res.status(404).send({ message: "Ticket not found." });
    }
    
    await ticket.destroy();
    
    res.status(200).send({ message: "Ticket deleted successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};