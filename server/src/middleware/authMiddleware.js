import jwt from "jsonwebtoken";
import User from "../models/User.js";


/*
 * ==========================================
 * PROTECT
 * ==========================================
 */

export const protect = async (
  request,
  response,
  next
) => {
  try {
    /*
     * First check Authorization header
     */

    const authorization =
      request.headers.authorization;

    const bearerToken =
      authorization?.startsWith("Bearer ")
        ? authorization.slice(7)
        : undefined;

    /*
     * Then check cookie
     */

    const cookieToken =
      request.cookies?.token;

    /*
     * Use cookie first, then Bearer token
     */

    const token =
      cookieToken || bearerToken;

    if (!token) {
      return response.status(401).json({
        message: "Authentication is required.",
      });
    }

    /*
     * Verify JWT
     */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /*
     * Find user
     */

    const user = await User.findById(
      decoded.userId
    );

    if (!user) {
      return response.status(401).json({
        message:
          "User account no longer exists.",
      });
    }

    /*
     * Attach user to request
     */

    request.user = user;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    return response.status(401).json({
      message:
        "Invalid or expired authentication token.",
    });
  }
};


/*
 * ==========================================
 * OPTIONAL PROTECT
 * ==========================================
 */

export const optionalProtect = async (
  request,
  response,
  next
) => {
  try {
    const authorization =
      request.headers.authorization;

    const bearerToken =
      authorization?.startsWith("Bearer ")
        ? authorization.slice(7)
        : undefined;

    const cookieToken =
      request.cookies?.token;

    const token =
      cookieToken || bearerToken;

    if (!token) {
      request.user = undefined;
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.userId
    );

    request.user = user || undefined;

    next();
  } catch (error) {
    request.user = undefined;
    next();
  }
};


/*
 * ==========================================
 * STUDENT ONLY
 * ==========================================
 */

export const studentOnly = (
  request,
  response,
  next
) => {
  if (!request.user) {
    return response.status(401).json({
      message: "Authentication is required.",
    });
  }

  if (request.user.role !== "student") {
    return response.status(403).json({
      message: "Student access required.",
    });
  }

  next();
};


/*
 * ==========================================
 * ADMIN OR SUPERADMIN
 * ==========================================
 */

export const adminOrSuperAdmin = (
  request,
  response,
  next
) => {
  if (!request.user) {
    return response.status(401).json({
      message: "Authentication is required.",
    });
  }

  if (
    request.user.role !== "admin" &&
    request.user.role !== "superadmin"
  ) {
    return response.status(403).json({
      message:
        "Administrator access required.",
    });
  }

  next();
};


/*
 * ==========================================
 * SUPERADMIN ONLY
 * ==========================================
 */

export const superAdminOnly = (
  request,
  response,
  next
) => {
  if (!request.user) {
    return response.status(401).json({
      message: "Authentication is required.",
    });
  }

  if (request.user.role !== "superadmin") {
    return response.status(403).json({
      message:
        "Super administrator access required.",
    });
  }

  next();
};