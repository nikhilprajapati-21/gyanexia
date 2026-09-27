import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/*
 * ==========================================
 * COOKIE OPTIONS
 * ==========================================
 */

const cookieOptions = {
  httpOnly: true,

  secure: process.env.NODE_ENV === "production",

  // Vercel frontend + Render backend are cross-site.
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",

  maxAge: 7 * 24 * 60 * 60 * 1000,

  path: "/",
};


/*
 * ==========================================
 * USER RESPONSE
 * ==========================================
 */

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  class: user.class,
  mobileNumber: user.mobileNumber,
  medium: user.medium,
  schoolOrCoaching: user.schoolOrCoaching,
  role: user.role,
});


/*
 * ==========================================
 * VALIDATE REGISTRATION
 * ==========================================
 */

const validateRegistration = (body) => {
  const payload = body || {};

  const requiredFields = [
    "name",
    "class",
    "mobileNumber",
    "password",
    "medium",
    "schoolOrCoaching",
  ];

  const missingField = requiredFields.find(
    (field) =>
      !String(payload[field] || "").trim()
  );

  if (missingField) {
    return `${missingField} is required.`;
  }

  if (
    !/^[6-9]\d{9}$/.test(
      String(payload.mobileNumber)
    )
  ) {
    return "Enter a valid 10-digit Indian mobile number.";
  }

  if (
    String(payload.password).length < 8
  ) {
    return "Password must be at least 8 characters long.";
  }

  if (
    !["Hindi", "English"].includes(
      payload.medium
    )
  ) {
    return "Medium must be Hindi or English.";
  }

  if (
    ![
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ].includes(String(payload.class))
  ) {
    return "Class must be between 5 and 12.";
  }

  return null;
};


/*
 * ==========================================
 * REGISTER STUDENT
 * ==========================================
 */

export const register = async (
  request,
  response,
  next
) => {
  try {
    const validationError =
      validateRegistration(request.body);

    if (validationError) {
      return response.status(400).json({
        message: validationError,
      });
    }

    const {
      name,
      class: studentClass,
      mobileNumber,
      password,
      medium,
      schoolOrCoaching,
    } = request.body;

    const existingUser =
      await User.findOne({ mobileNumber });

    if (existingUser) {
      return response.status(409).json({
        message:
          "An account with this mobile number already exists.",
      });
    }

    const user = await User.create({
      name,
      class: String(studentClass),
      mobileNumber,
      password,
      medium,
      schoolOrCoaching,
      role: "student",
    });

    /*
     * CREATE LOGIN COOKIE
     */

    const token = generateToken(
      user._id.toString()
    );

    response.cookie(
      "token",
      token,
      cookieOptions
    );

    return response.status(201).json({
      message:
        "Student account created successfully.",
      user: userResponse(user),
    });
  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * LOGIN
 * ==========================================
 */

export const login = async (
  request,
  response,
  next
) => {
  try {
    const {
      mobileNumber,
      password,
    } = request.body;

    if (
      !/^[6-9]\d{9}$/.test(
        String(mobileNumber || "")
      ) ||
      !password
    ) {
      return response.status(400).json({
        message:
          "A valid mobile number and password are required.",
      });
    }

    const user =
      await User.findOne({
        mobileNumber,
      }).select("+password");

    if (
      !user ||
      !(await user.comparePassword(password))
    ) {
      return response.status(401).json({
        message:
          "Invalid mobile number or password.",
      });
    }

    /*
     * CREATE LOGIN COOKIE
     */

    const token = generateToken(
      user._id.toString()
    );

    response.cookie(
      "token",
      token,
      cookieOptions
    );

    return response.status(200).json({
      message: "Logged in successfully.",
      user: userResponse(user),
    });
  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * LOGOUT
 * ==========================================
 */

export const logout = (
  _request,
  response
) => {
  response.clearCookie("token", {
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production",

    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",

    path: "/",
  });

  return response.status(200).json({
    message: "Logged out successfully.",
  });
};


/*
 * ==========================================
 * GET CURRENT USER
 * ==========================================
 */

export const getMe = (
  request,
  response
) => {
  return response.status(200).json({
    user: userResponse(request.user),
  });
};