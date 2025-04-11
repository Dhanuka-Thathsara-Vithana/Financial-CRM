module.exports = (sequelize, Sequelize) => {
    const RefreshToken = sequelize.define("refreshToken", {
      token: {
        type: Sequelize.STRING,
      },
      expiryDate: {
        type: Sequelize.DATE,
      }
    });
  
    RefreshToken.createToken = async function(user) {
      const authConfig = require("../config/authConfig");
      const { v4: uuid } = require("uuid");
      
      const expiredAt = new Date();
      expiredAt.setSeconds(expiredAt.getSeconds() + authConfig.jwtRefreshExpiration);
      
      const token = uuid();
      
      const refreshToken = await this.create({
        token: token,
        userId: user.id,
        expiryDate: expiredAt.getTime(),
      });
      
      return refreshToken.token;
    };
    
    RefreshToken.verifyExpiration = (token) => {
      return token.expiryDate.getTime() < new Date().getTime();
    };
    
    return RefreshToken;
  };