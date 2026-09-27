import "dotenv/config";
import mongoose from "mongoose";
import Competition from "../models/Competition.js";

const seedCompetition = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected.");

    await Competition.deleteMany({});

    const competition = await Competition.create({
      name: "Gyanexia Talent Hunt",

      tagline: "Discover the Best Young Minds!",

      description:
        "An academic competition organized by Gyanexia to discover and encourage talented young students.",

      eligibleClasses: [
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
      ],

      mode: "Offline",

      examDate: "December 2026",

      prizeDetails:
        "Prize details will be announced soon.",

      subjectsAndTopics:
        "Subjects and topics will be notified soon. Stay tuned for updates!",

      registrationOpen: false,

      status: "upcoming",
    });

    console.log("Competition created:");
    console.log(competition);

    await mongoose.disconnect();

    console.log("Done.");
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedCompetition();