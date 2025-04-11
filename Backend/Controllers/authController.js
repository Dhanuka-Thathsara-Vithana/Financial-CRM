const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../config/authConfig");
const db = require("../Models");
const User = db.user;
const RefreshToken = db.refreshToken;

//Register a new user

exports.signup = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone
    });

    res.status(201).send({ 
      message: "User registered successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).send({ message: error.message });
  }
};

//Authenticate user and provide JWT tokens

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!"
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration
    });

    let refreshToken = await RefreshToken.createToken(user);

    // Set cookies with JWT
    res.cookie('accessToken', token, config.cookieOptions);
    res.cookie('refreshToken', refreshToken, config.cookieOptions);

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error("Error during user signin:", error);
    res.status(500).send({ message: error.message });
  }
};

// Refresh access token using refresh token
 
// Update in Controllers/authController.js

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (!refreshToken) {
      return res.status(403).send({ message: "Refresh Token is required!" });
    }
  
    try {
      const refreshTokenData = await RefreshToken.findOne({ 
        where: { token: refreshToken } 
      });
  
      if (!refreshTokenData) {
        res.status(403).send({
          message: "Refresh token is not in database!"
        });
        return;
      }
  
      if (RefreshToken.verifyExpiration(refreshTokenData)) {
        await RefreshToken.destroy({ where: { id: refreshTokenData.id } });
        
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        
        res.status(403).send({
          message: "Refresh token was expired. Please sign in again!"
        });
        return;
      }
  
      const user = await User.findByPk(refreshTokenData.userId, {
        attributes: ['id', 'username', 'email', 'role', 'firstName', 'lastName', 'phone']
      });
      
      let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });
  
      res.cookie('accessToken', newAccessToken, config.cookieOptions);
  
      return res.status(200).send({
        message: "Token refreshed successfully",
        user: user // Return user data with the response
      });
    } catch (error) {
      console.error("Error refreshing token:", error);
      return res.status(500).send({ message: error.message });
    }
  };
  
// Sign out user and clear tokens

exports.signout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      await RefreshToken.destroy({ 
        where: { token: refreshToken } 
      });
    }
    
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (error) {
    console.error("Error during signout:", error);
    res.status(500).send({ message: error.message });
  }
};

// Generate token for password reset

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    });

    if (!user) {
      return res.status(404).send({ message: "Email not found." });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = Date.now() + 3600000; // 1 hour

    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    });

    // In a real application, you would send an email with the reset link
    // For this example, we'll just return the token
    res.status(200).send({
      message: "Password reset email sent.",
      // In production, don't send the token directly, this is just for demo
      resetToken: resetToken
    });
  } catch (error) {
    console.error("Error during password reset request:", error);
    res.status(500).send({ message: error.message });
  }
};

// Reset password using token

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: req.body.token,
        resetPasswordExpires: { [db.Sequelize.Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).send({
        message: "Password reset token is invalid or has expired."
      });
    }

    user.password = bcrypt.hashSync(req.body.password, 8);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).send({
      message: "Password has been reset successfully."
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).send({ message: error.message });
  }
};