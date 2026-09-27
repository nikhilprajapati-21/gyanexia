import mongoose from "mongoose";

const registrationSchema =
  new mongoose.Schema(
    {
      registrationId: {
        type: String,
        unique: true,
        sparse: true,
        index: true,
        trim: true,
      },

      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      competition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Competition",
        required: true,
        index: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      mobileNumber: {
        type: String,
        required: true,
        trim: true,
      },

      class: {
        type: String,
        required: true,
        trim: true,
      },

      medium: {
        type: String,
        default: "",
        trim: true,
      },

      schoolOrCoaching: {
        type: String,
        default: "",
        trim: true,
      },

      parentName: {
        type: String,
        required: true,
        trim: true,
      },

      parentMobileNumber: {
        type: String,
        required: true,
        trim: true,
      },

      paymentStatus: {
        type: String,
        enum: [
          "pending",
          "paid",
          "failed",
          "refunded",
        ],
        default: "pending",
        index: true,
      },

      paymentAmount: {
        type: Number,
        required: true,
        min: 0,
      },

      razorpayOrderId: {
        type: String,
        default: "",
        index: true,
      },

      razorpayPaymentId: {
        type: String,
        default: "",
        index: true,
      },

      razorpaySignature: {
        type: String,
        default: "",
      },

      registeredAt: {
        type: Date,
        default: null,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );


/*
 * ==========================================
 * ONE REGISTRATION PER STUDENT PER
 * COMPETITION
 * ==========================================
 */

registrationSchema.index(
  {
    student: 1,
    competition: 1,
  },
  {
    unique: true,
  }
);


const Registration =
  mongoose.model(
    "Registration",
    registrationSchema
  );


export default Registration;