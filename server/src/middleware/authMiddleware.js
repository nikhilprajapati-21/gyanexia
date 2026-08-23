import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (request, response, next) => {
  try {
    const authorization = request.headers.authorization;
    const bearerToken = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : undefined;
    const token = request.cookies.token || bearerToken;

    if (!token) {
      return response.status(401).json({ message: "Authentication is required." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return response.status(401).json({ message: "User account no longer exists." });
    }

    request.user = user;
    return next();
  } catch (_error) {
    return response.status(401).json({ message: "Invalid or expired authentication token." });
  }
};
