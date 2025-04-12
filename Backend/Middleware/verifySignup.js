const db = require("../Models");
const User = db.user;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Check for duplicate username
    const usernameExists = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (usernameExists) {
      return res.status(400).send({
        message: "Username is already in use!"
      });
    }

    // Check for duplicate email
    const emailExists = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (emailExists) {
      return res.status(400).send({
        message: "Email is already in use!"
      });
    }

    next();
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
};

// Check if the requested role is valid
const checkRoleExists = (req, res, next) => {
  if (req.body.role) {
    const validRoles = ['admin', 'financial_planner', 'mortgage_broker'];
    if (!validRoles.includes(req.body.role)) {
      return res.status(400).send({
        message: `Role ${req.body.role} does not exist!`
      });
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRoleExists
};

module.exports = verifySignUp;