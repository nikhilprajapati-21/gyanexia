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
  stream: user.stream || "",
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
    (field) => !String(payload[field] || "").trim()
  );

  if (missingField) {
    return `${missingField} is required.`;
  }

  // Validate name.
  const name = String(payload.name).trim();

  if (name.length < 2 || name.length > 80) {
    return "Name must be between 2 and 80 characters.";
  }

  // Validate class.
  const studentClass = String(payload.class).trim();

  if (
    !["5", "6", "7", "8", "9", "10", "11", "12"].includes(
      studentClass
    )
  ) {
    return "Class must be between 5 and 12.";
  }

  // Validate stream.
  const stream = String(payload.stream || "").trim();

  if (["11", "12"].includes(studentClass)) {
    if (!stream) {
      return "Please select Mathematics or Biology.";
    }

    if (!["Mathematics", "Biology"].includes(stream)) {
      return "Stream must be Mathematics or Biology.";
    }
  } else if (stream) {
    return "Stream is only applicable to Classes 11 and 12.";
  }

  // Validate mobile number.
  if (
    !/^[6-9]\d{9}$/.test(
      String(payload.mobileNumber).trim()
    )
  ) {
    return "Enter a valid 10-digit Indian mobile number.";
  }

  // Validate password.
  if (String(payload.password).length < 8) {
    return "Password must be at least 8 characters long.";
  }

  // Validate medium.
  if (!["Hindi", "English"].includes(payload.medium)) {
    return "Medium must be Hindi or English.";
  }

  // Validate school/coaching name.
  if (String(payload.schoolOrCoaching).trim().length > 150) {
    return "School or coaching name cannot exceed 150 characters.";
  }

  return null;
};

/*
 * ==========================================
 * REGISTER STUDENT
 * ==========================================
 */

export const register = async (request, response, next) => {
  try {
    const validationError = validateRegistration(request.body);

    if (validationError) {
      return response.status(400).json({
        message: validationError,
      });
    }

    const {
      name,
      class: studentClass,
      stream,
      mobileNumber,
      password,
      medium,
      schoolOrCoaching,
    } = request.body;

    const normalizedMobileNumber = String(mobileNumber).trim();

    // Check for an existing account.
    const existingUser = await User.findOne({
      mobileNumber: normalizedMobileNumber,
    });

    if (existingUser) {
      return response.status(409).json({
        message:
          "An account with this mobile number already exists.",
      });
    }

    // Create the student account.
    const user = await User.create({
      name: String(name).trim(),
      class: String(studentClass),
      stream: ["11", "12"].includes(String(studentClass))
        ? stream
        : undefined,
      mobileNumber: normalizedMobileNumber,
      password,
      medium,
      schoolOrCoaching: String(schoolOrCoaching).trim(),
      role: "student",
    });

    // Create the login token.
    const token = generateToken(user._id.toString());

    response.cookie("token", token, cookieOptions);

    return response.status(201).json({
      message: "Student account created successfully.",
      user: userResponse(user),
    });
  } catch (error) {
    // Handle duplicate mobile number in case two
    // requests attempt registration simultaneously.
    if (error.code === 11000) {
      return response.status(409).json({
        message:
          "An account with this mobile number already exists.",
      });
    }

    return next(error);
  }
};

/*
 * ==========================================
 * LOGIN
 * ==========================================
 */

export const login = async (request, response, next) => {
  try {
    const {
      mobileNumber,
      password,
    } = request.body;

    const normalizedMobileNumber = String(
      mobileNumber || ""
    ).trim();

    if (
      !/^[6-9]\d{9}$/.test(normalizedMobileNumber) ||
      !password
    ) {
      return response.status(400).json({
        message:
          "A valid mobile number and password are required.",
      });
    }

    const user = await User.findOne({
      mobileNumber: normalizedMobileNumber,
    }).select("+password");

    if (
      !user ||
      !(await user.comparePassword(password))
    ) {
      return response.status(401).json({
        message: "Invalid mobile number or password.",
      });
    }

    // Create the login token.
    const token = generateToken(user._id.toString());

    response.cookie("token", token, cookieOptions);

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

export const logout = (_request, response) => {
  response.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
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

export const getMe = (request, response) => {
  return response.status(200).json({
    user: userResponse(request.user),
  });
};