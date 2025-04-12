const db = require("../Models");
const User = db.user;

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'firstName', 'lastName', 'phone']
    });
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'email', 'role', 'firstName', 'lastName', 'phone']
    });
    
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    
    const updatedUser = await user.update({
      firstName: req.body.firstName || user.firstName,
      lastName: req.body.lastName || user.lastName,
      phone: req.body.phone || user.phone,
      email: req.body.email || user.email
    });
    
    res.status(200).send({
      message: "User updated successfully.",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    
    await user.destroy();
    
    res.status(200).send({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  
    try {
      const user = await User.findByPk(req.userId, {
        attributes: ['id', 'username', 'email', 'role', 'firstName', 'lastName', 'phone']
      });
      
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      
      res.status(200).send(user);
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).send({ message: error.message });
    }
  };

  exports.getUsersWithoutAdmins = async (req, res) => {
    try {
      const users = await User.findAll({
        where: {
          role: ['mortgage_broker', 'financial_planner']
        },
        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'phone', 'role']
      });
      res.status(200).send(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send({ message: error.message });
    }
  };
  