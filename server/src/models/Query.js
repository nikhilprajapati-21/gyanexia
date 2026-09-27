import mongoose from "mongoose";

const querySchema = new mongoose.Schema(
  {
    /*
     * ==========================================
     * STUDENT / USER
     * ==========================================
     */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    /*
     * ==========================================
     * BASIC INFORMATION
     * ==========================================
     */

    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required."],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Address is required."],
      trim: true,
    },

    message: {
      type: String,
      required: [true, "Query message is required."],
      trim: true,
    },

    /*
     * ==========================================
     * QUERY STATUS
     * ==========================================
     */

    status: {
      type: String,
      enum: [
        "pending",
        "in-progress",
        "resolved",
      ],
      default: "pending",
    },

    /*
     * ==========================================
     * ADMIN REPLY
     * ==========================================
     */

    adminReply: {
      type: String,
      default: "",
      trim: true,
    },

    /*
     * ==========================================
     * RESOLVED INFORMATION
     * ==========================================
     */

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Query = mongoose.model("Query", querySchema);

export default Query;