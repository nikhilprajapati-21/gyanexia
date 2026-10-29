import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // STUDENT NAME
    // ==========================================
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long."],
      maxlength: [80, "Name cannot exceed 80 characters."],
    },

    // ==========================================
    // STUDENT CLASS
    // ==========================================
    class: {
      type: String,
      required: function () {
        return this.role === "student";
      },
      trim: true,
      enum: {
        values: ["5", "6", "7", "8", "9", "10", "11", "12"],
        message: "Class must be between 5 and 12.",
      },
    },

    // ==========================================
    // STREAM — ONLY FOR CLASSES 11 AND 12
    // ==========================================
    stream: {
      type: String,
      enum: {
        values: ["Mathematics", "Biology"],
        message: "Stream must be Mathematics or Biology.",
      },
      required: function () {
        return (
          this.role === "student" &&
          ["11", "12"].includes(this.class)
        );
      },
      validate: {
        validator: function (value) {
          // Classes 11 and 12 must have a valid stream.
          if (
            this.role === "student" &&
            ["11", "12"].includes(this.class)
          ) {
            return ["Mathematics", "Biology"].includes(value);
          }

          // Other classes must not have a stream.
          return !value;
        },
        message:
          "Select Mathematics or Biology for Class 11 or 12. Other classes must not have a stream.",
      },
    },

    // ==========================================
    // MOBILE NUMBER
    // ==========================================
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required."],
      unique: true,
      trim: true,
      match: [
        /^[6-9]\d{9}$/,
        "Enter a valid 10-digit Indian mobile number.",
      ],
    },

    // ==========================================
    // PASSWORD
    // ==========================================
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."],
      select: false,
    },

    // ==========================================
    // MEDIUM
    // ==========================================
    medium: {
      type: String,
      required: function () {
        return this.role === "student";
      },
      enum: ["Hindi", "English"],
    },

    // ==========================================
    // SCHOOL / COACHING
    // ==========================================
    schoolOrCoaching: {
      type: String,
      required: function () {
        return this.role === "student";
      },
      trim: true,
      maxlength: [
        150,
        "School or coaching cannot exceed 150 characters.",
      ],
    },

    // ==========================================
    // USER ROLE
    // ==========================================
    role: {
      type: String,
      enum: ["student", "admin", "superadmin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// HASH PASSWORD
// ==========================================
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// ==========================================
// COMPARE PASSWORD
// ==========================================
userSchema.methods.comparePassword = function comparePassword(
  candidatePassword
) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;