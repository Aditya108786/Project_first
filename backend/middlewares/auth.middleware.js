//const jwt = require('jsonwebtoken')
const jwt = require('jsonwebtoken');
const usermodel = require('../models/user.model');

const isloggedin = async function (req, res, next) {
  try {
    const token = req.cookies?.accesstoken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized request: token missing" });
    }

    const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await usermodel.findById(decodedtoken?._id).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = isloggedin;
