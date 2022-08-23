const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");

const getCurrentUser = async (req, res, next) => {
  let token;

  if (req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
    ){
      // Set token from Bearer token in header
      token = req.headers.authorization.split(" ")[1];
  }
  // Set token from cookie
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.locals.currentUser = null;
    next();
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findById(decoded.id);
    res.locals.currentUser = user;
    next();
  } catch (err) {
    res.locals.currentUser = null;
    next();
  }
}

module.exports = getCurrentUser;