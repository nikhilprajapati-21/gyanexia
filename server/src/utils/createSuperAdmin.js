import "dotenv/config";
import mongoose from "mongoose";
import readline from "readline";
import User from "../models/User.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected.");

    const name = (await ask("Super Admin name: ")).trim();
    const mobileNumber = (await ask("Mobile number: ")).trim();
    const password = await ask("Password: ");

    if (!name || !mobileNumber || !password) {
      throw new Error("Name, mobile number and password are required.");
    }

    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      throw new Error("Enter a valid 10-digit Indian mobile number.");
    }

    if (password.length < 8) {
      throw new Error(
        "Password must be at least 8 characters long."
      );
    }

    const existingUser = await User.findOne({
      mobileNumber,
    });

    if (existingUser) {
      throw new Error(
        `An account already exists with mobile number ${mobileNumber}.`
      );
    }

    const superAdmin = await User.create({
      name,
      mobileNumber,
      password,
      role: "superadmin",
    });

    console.log("\n=================================");
    console.log("SUPER ADMIN CREATED SUCCESSFULLY");
    console.log("=================================");
    console.log("Name:", superAdmin.name);
    console.log("Mobile:", superAdmin.mobileNumber);
    console.log("Role:", superAdmin.role);
    console.log("=================================\n");

  } catch (error) {
    console.error("Super Admin creation failed:");
    console.error(error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
};

createSuperAdmin();