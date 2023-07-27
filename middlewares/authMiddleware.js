import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      let token = req.headers.authorization;
      req.user = await User.findById(token).select("-password");
      next();
    } catch (error) {
      console.error(error);
      throw new Error("Not Authorized, token failed");
    }
  } else {
    throw new Error("No token found");
  }
});

export { protect };
