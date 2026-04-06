const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect route

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization && // checking authorization header is exists
    req.headers.authorization.startsWith("Bearer") // and header starts with Bearer sting
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; //after the "Bearer" , send the token along with it
      const decoded = jwt.verify(token, process.env.JWT_SECRET); //after extracting the token,  we will verify the token sent from frontend..[verify metjod also require  the jwt secret key]
      req.user = await User.findById(decoded.user.id).select("-password"); // exclude password here
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized token field" });
    }
  } else {
    res.status(401).json({ message: " Not authorozed, no token provided" });
  }
};

// Middleware to check the user is an Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};
module.exports = { protect, admin };
