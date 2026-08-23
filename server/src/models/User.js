import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long."],
      maxlength: [80, "Name cannot exceed 80 characters."],
    },
    class: {
      type: String,
      required: [true, "Class is required."],
      trim: true,
      enum: {
        values: ["5", "6", "7", "8", "9", "10", "11", "12"],
        message: "Class must be between 5 and 12.",
      },
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required."],
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."],
      select: false,
    },
    medium: {
      type: String,
      required: [true, "Medium is required."],
      enum: ["Hindi", "English"],
    },
    schoolOrCoaching: {
      type: String,
      required: [true, "School or coaching is required."],
      trim: true,
      maxlength: [150, "School or coaching cannot exceed 150 characters."],
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
      immutable: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
