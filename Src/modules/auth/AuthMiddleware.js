// Require :
const jwt = require('jsonwebtoken');
const User = require('../../../Src/modules/auth/Model');

// Function :
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get Token From Headers :
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "Not authorized, token missing !",
      });
    }

    // Verify And Get User Id from Payload :
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "Invalid token",
    });
  }
};