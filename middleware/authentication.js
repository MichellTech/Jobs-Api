const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/index");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(new UnauthenticatedError("Authentication Invalid"));
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    console.error("Authentication Error:", error); // Log the error
    return next(new UnauthenticatedError("Authentication Invalid"));
  }
};

module.exports = auth;
