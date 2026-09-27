import Competition from "../models/Competition.js";
import Registration from "../models/Registration.js";


/*
 * ==========================================
 * GET UPCOMING COMPETITIONS
 * STUDENT ONLY
 * ==========================================
 *
 * Only competitions eligible for the
 * student's class are returned.
 */

export const getUpcomingCompetitions = async (
  request,
  response,
  next
) => {
  try {
    const studentClass = String(request.user.class);

    const competitions = await Competition.find({
      eligibleClasses: studentClass,

      status: {
        $in: ["upcoming", "open"],
      },
    }).sort({
      createdAt: -1,
    });

    return response.status(200).json({
      competitions,
    });
  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * GET SINGLE COMPETITION
 * STUDENT ONLY
 * ==========================================
 */

export const getStudentCompetition = async (
  request,
  response,
  next
) => {
  try {
    const { id } = request.params;

    const competition =
      await Competition.findById(id);

    if (!competition) {
      return response.status(404).json({
        message: "Competition not found.",
      });
    }

    const studentClass =
      String(request.user.class);

    if (
      !competition.eligibleClasses.includes(
        studentClass
      )
    ) {
      return response.status(403).json({
        message:
          "You are not eligible for this competition.",
      });
    }

    const registration =
      await Registration.findOne({
        student: request.user._id,
        competition: competition._id,
      });

    return response.status(200).json({
      competition,
      isRegistered:
        registration?.status === "registered",
      registration: registration || null,
    });
  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * REGISTER FOR COMPETITION
 * STUDENT ONLY
 * ==========================================
 */

export const registerForCompetition = async (
  request,
  response,
  next
) => {
  try {
    const { id } = request.params;

    const competition =
      await Competition.findById(id);

    if (!competition) {
      return response.status(404).json({
        message: "Competition not found.",
      });
    }

    /*
     * Check student's class
     */

    const studentClass =
      String(request.user.class);

    if (
      !competition.eligibleClasses.includes(
        studentClass
      )
    ) {
      return response.status(403).json({
        message:
          "You are not eligible for this competition.",
      });
    }

    /*
     * Registration must be open
     */

    if (!competition.registrationOpen) {
      return response.status(400).json({
        message:
          "Registration for this competition is currently closed.",
      });
    }

    /*
     * Completed competitions cannot accept
     * new registrations.
     */

    if (competition.status === "completed") {
      return response.status(400).json({
        message:
          "This competition has already been completed.",
      });
    }

    /*
     * Check existing registration
     */

    const existingRegistration =
      await Registration.findOne({
        student: request.user._id,
        competition: competition._id,
      });

    if (
      existingRegistration &&
      existingRegistration.status === "registered"
    ) {
      return response.status(400).json({
        message:
          "You are already registered for this competition.",
        registration: existingRegistration,
      });
    }

    /*
     * If previous registration was cancelled,
     * reactivate it.
     */

    if (
      existingRegistration &&
      existingRegistration.status === "cancelled"
    ) {
      existingRegistration.status =
        "registered";

      existingRegistration.registeredAt =
        new Date();

      await existingRegistration.save();

      return response.status(200).json({
        message:
          "You have been registered successfully.",
        registration:
          existingRegistration,
      });
    }

    /*
     * Create new registration
     */

    const registration =
      await Registration.create({
        student: request.user._id,
        competition: competition._id,
        status: "registered",
      });

    return response.status(201).json({
      message:
        "You have been registered successfully.",
      registration,
    });
  } catch (error) {
    /*
     * Handle duplicate registration
     */

    if (error?.code === 11000) {
      return response.status(400).json({
        message:
          "You are already registered for this competition.",
      });
    }

    return next(error);
  }
};


/*
 * ==========================================
 * GET MY COMPETITIONS
 * STUDENT ONLY
 * ==========================================
 */

export const getMyCompetitions = async (
  request,
  response,
  next
) => {
  try {
    const registrations =
      await Registration.find({
        student: request.user._id,
        status: "registered",
      })
        .populate("competition")
        .sort({
          registeredAt: -1,
        });

    return response.status(200).json({
      registrations,
    });
  } catch (error) {
    return next(error);
  }
};