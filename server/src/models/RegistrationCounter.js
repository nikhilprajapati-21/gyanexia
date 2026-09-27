import mongoose from "mongoose";

const registrationCounterSchema =
  new mongoose.Schema(
    {
      /*
       * One counter per competition.
       *
       * Example key:
       * registration:competitionId
       */
      key: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      /*
       * Current registration sequence.
       */
      sequence: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    {
      timestamps: true,
    }
  );

const RegistrationCounter =
  mongoose.model(
    "RegistrationCounter",
    registrationCounterSchema
  );

export default RegistrationCounter;