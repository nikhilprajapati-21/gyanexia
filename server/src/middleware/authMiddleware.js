import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*
 * ==========================================
 * PROTECT
 *
 * LOGIN REQUIRED
 * ==========================================
 */

export const protect = async (
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

    const token =
      request.cookies?.token ||
      bearerToken;

    if (!token) {
      return response.status(401).json({
        message: "Authentication is required.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.userId
    );

    if (!user) {
      return response.status(401).json({
        message:
          "User account no longer exists.",
      });
    }

    request.user = user;

    next();
  } catch (error) {
    return response.status(401).json({
      message:
        "Invalid or expired authentication token.",
    });
  }
};


/*
 * ==========================================
 * OPTIONAL PROTECT
 *
 * LOGIN NOT REQUIRED
 * ==========================================
 *
 * If the user is logged in:
 *     request.user = user
 *
 * If the user is NOT logged in:
 *     request.user = undefined
 *
 * This is useful for public pages such
 * as Contact Us.
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

    const token =
      request.cookies?.token ||
      bearerToken;

    /*
     * No token is completely fine.
     * Continue as a public user.
     */

    if (!token) {
      request.user = undefined;
      return next();
    }

    /*
     * Token exists, so try to identify
     * the logged-in user.
     */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.userId
    );

    /*
     * If token is valid and user exists,
     * attach user to request.
     */

    if (user) {
      request.user = user;
    } else {
      request.user = undefined;
    }

    next();
  } catch (error) {
    /*
     * If token is expired/invalid, we don't
     * block the public Contact Us form.
     */

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
  if (request.user.role !== "superadmin") {
    return response.status(403).json({
      message:
        "Super administrator access required.",
    });
  }

  next();
};