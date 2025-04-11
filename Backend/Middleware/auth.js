const jwt = require("jsonwebtoken");
const config = require("../config/authConfig");
const db = require("../Models");
const User = db.user;

verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  
  if (!token) {
    return res.status(401).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (user.role === "admin") {
      next();
      return;
    }

    res.status(403).send({
      message: "Require Admin Role!"
    });
  } catch (error) {
    res.status(500).send({
      message: "Unable to validate user role!"
    });
  }
};

isFinancialPlanner = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (user.role === "financial_planner" || user.role === "admin") {
      next();
      return;
    }

    res.status(403).send({
      message: "Require Financial Planner Role!"
    });
  } catch (error) {
    res.status(500).send({
      message: "Unable to validate user role!"
    });
  }
};

isMortgageBroker = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (user.role === "mortgage_broker" || user.role === "admin") {
      next();
      return;
    }

    res.status(403).send({
      message: "Require Mortgage Broker Role!"
    });
  } catch (error) {
    res.status(500).send({
      message: "Unable to validate user role!"
    });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isFinancialPlanner,
  isMortgageBroker
};

module.exports = authJwt;