import mongoose from "mongoose";

const competitionSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: [
          true,
          "Competition name is required.",
        ],
        trim: true,
        maxlength: 150,
      },

      tagline: {
        type: String,
        default: "",
        trim: true,
        maxlength: 250,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      eligibleClasses: {
        type: [String],
        required: [
          true,
          "Eligible classes are required.",
        ],

        validate: {
          validator: (classes) =>
            classes.every((item) =>
              [
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
                "12",
              ].includes(
                String(item)
              )
            ),

          message:
            "Eligible classes must be between 5 and 12.",
        },
      },

      mode: {
        type: String,

        enum: [
          "Online",
          "Offline",
          "Hybrid",
        ],

        default: "Offline",
      },

      examDate: {
        type: String,
        default: "",
        trim: true,
      },

      prizeDetails: {
        type: String,
        default: "",
        trim: true,
      },

      subjectsAndTopics: {
        type: String,
        default: "",
        trim: true,
      },

      totalMarks: {
        type: Number,

        required: [
          true,
          "Total marks are required.",
        ],

        min: [
          1,
          "Total marks must be greater than 0.",
        ],

        default: 100,
      },

      registrationOpen: {
        type: Boolean,
        default: false,
      },

      registrationFee: {
  type: Number,
  default: 0,
  min: 0,
},

registrationCode: {
  type: String,
  default: "COMP",
  trim: true,
  uppercase: true,
},

      status: {
        type: String,

        enum: [
          "upcoming",
          "open",
          "closed",
          "completed",
        ],

        default: "upcoming",
      },

      resultsPublished: {
        type: Boolean,
        default: false,
      },
    },

    {
      timestamps: true,
    }
  );


const Competition =
  mongoose.model(
    "Competition",
    competitionSchema
  );


export default Competition;