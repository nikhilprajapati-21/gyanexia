import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },

    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    certificateUrl: {
      type: String,
      required: true,
      trim: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model(
  "Certificate",
  certificateSchema
);

export default Certificate;