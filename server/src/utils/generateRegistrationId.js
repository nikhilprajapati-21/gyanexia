import RegistrationCounter from "../models/RegistrationCounter.js";

/*
 * ==========================================
 * GENERATE REGISTRATION ID
 * ==========================================
 *
 * FORMAT:
 *
 * YY + CLASS + SERIAL
 *
 * Example:
 *
 * 2608001
 *
 * 26  = Year 2026
 * 08  = Class 8
 * 001 = First Class 8 registration
 *
 * The serial number is separate for each
 * competition + class.
 */

const generateRegistrationId = async (
  competition,
  studentClass
) => {
  /*
   * ==========================================
   * VALIDATE COMPETITION
   * ==========================================
   */

  if (!competition?._id) {
    throw new Error(
      "Competition is required to generate registration ID."
    );
  }


  /*
   * ==========================================
   * YEAR
   * ==========================================
   *
   * 2026 -> 26
   * 2027 -> 27
   */

  const year = String(
    new Date().getFullYear()
  ).slice(-2);


  /*
   * ==========================================
   * VALIDATE CLASS
   * ==========================================
   */

  const classNumber = String(
    studentClass ?? ""
  ).trim();

  const validClasses = [
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  if (!validClasses.includes(classNumber)) {
    throw new Error(
      "Invalid student class for registration ID."
    );
  }


  /*
   * ==========================================
   * FORMAT CLASS
   * ==========================================
   *
   * 5  -> 05
   * 8  -> 08
   * 9  -> 09
   * 10 -> 10
   * 12 -> 12
   */

  const formattedClass =
    classNumber.padStart(2, "0");


  /*
   * ==========================================
   * COUNTER KEY
   * ==========================================
   *
   * Separate counter for every:
   *
   * Competition + Class
   *
   * Example:
   *
   * registration:
   * competitionId:
   * class:8
   *
   * and
   *
   * registration:
   * competitionId:
   * class:9
   *
   * have separate counters.
   */

  const competitionId =
    competition._id.toString();

  const counterKey =
    `registration:${competitionId}:class:${classNumber}`;


  /*
   * ==========================================
   * ATOMIC COUNTER
   * ==========================================
   *
   * First Class 8 registration:
   * sequence = 1
   *
   * Second Class 8 registration:
   * sequence = 2
   */

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


  /*
   * ==========================================
   * SERIAL NUMBER
   * ==========================================
   *
   * 1   -> 001
   * 2   -> 002
   * 10  -> 010
   * 100 -> 100
   */

  const serialNumber =
    String(counter.sequence)
      .padStart(3, "0");


  /*
   * ==========================================
   * FINAL REGISTRATION ID
   * ==========================================
   *
   * Example:
   *
   * Year  = 26
   * Class = 08
   * Serial = 001
   *
   * Result:
   *
   * 2608001
   */

  return `${year}${formattedClass}${serialNumber}`;
};


export default generateRegistrationId;