const User = require('../Models/userSchema');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

const userMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);

    const user = await User.findOne({
      emailId: payload.emailId
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    const isBlocked = await redisClient.exists(`token:${token}`);

    if (isBlocked) {
      return res.status(401).json({
        message: "Session expired. Please login again."
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    return res.status(401).json({
      message: "Authentication failed. Please login again."
    });
  }
};

module.exports = userMiddleware;