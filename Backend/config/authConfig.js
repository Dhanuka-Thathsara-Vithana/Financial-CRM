module.exports = {
    secret: process.env.JWT_SECRET,
    jwtExpiration: parseInt(process.env.JWT_EXPIRATION, 10),
    jwtRefreshExpiration: parseInt(process.env.JWT_REFRESH_EXPIRATION, 10),
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict"
    }
  };