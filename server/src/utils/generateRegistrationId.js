import RegistrationCounter from "../models/RegistrationCounter.js";

/*
 * ==========================================
 * GENERATE REGISTRATION ID
 * ==========================================
 *
 * Example:
 *
 * GY-TH-26-00001
 *
 * GY  = Gyanexia
 * TH  = Competition registration code
 * 26  = Year
 * 00001 = Sequential number
 *
 * The counter is atomic, so two students
 * registering at exactly the same time will
 * never receive the same sequence number.
 */

const generateRegistrationId = async (
  competition
) => {
  const competitionId =
    competition._id.toString();

  const registrationCode =
    String(
      competition.registrationCode || "COMP"
    )
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 8) || "COMP";

  const year = String(
    new Date().getFullYear()
  ).slice(-2);

  const counterKey =
    `registration:${competitionId}`;

  const counter =
    await RegistrationCounter.findOneAndUpdate(
      {
        key: counterKey,
      },
      {
        $inc: {
          sequence: 1,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

  const sequence =
    String(counter.sequence).padStart(
      5,
      "0"
    );

  return `GY-${registrationCode}-${year}-${sequence}`;
};

export default generateRegistrationId;