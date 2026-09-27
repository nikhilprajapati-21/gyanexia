import Competition from "../models/Competition.js";


/*
 * ==========================================
 * GET COMPETITIONS FOR LOGGED-IN STUDENT
 * ==========================================
 *
 * Student only.
 *
 * Returns competitions where:
 * - status is upcoming OR open
 * - student's class is eligible
 *
 */

export const getStudentCompetitions = async (
  request,
  response,
  next
) => {
  try {
    const studentClass = String(
      request.user.class || ""
    ).trim();

    if (!studentClass) {
      return response.status(200).json({
        competitions: [],
      });
    }

    const competitions =
      await Competition.find({
        status: {
          $in: [
            "upcoming",
            "open",
            "completed",
          ],
        },

        eligibleClasses: studentClass,
      }).sort({
        examDate: 1,
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
 * GET ALL COMPETITIONS
 * Admin + Superadmin
 * ==========================================
 */

export const getCompetitions = async (
  request,
  response,
  next
) => {
  try {
    const competitions =
      await Competition.find({})
        .sort({
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
 * Admin + Superadmin
 * ==========================================
 */

export const getCompetition = async (
  request,
  response,
  next
) => {
  try {
    const { id } =
      request.params;

    const competition =
      await Competition.findById(id);

    if (!competition) {
      return response.status(404).json({
        message:
          "Competition not found.",
      });
    }

    return response.status(200).json({
      competition,
    });
  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * CREATE COMPETITION
 * SUPERADMIN ONLY
 * ==========================================
 */

export const createCompetition = async (
  request,
  response,
  next
) => {
  try {
    const {
  name,
  tagline,
  description,
  eligibleClasses,
  mode,
  examDate,
  prizeDetails,
  subjectsAndTopics,
  totalMarks,
  registrationOpen,
  registrationFee,
  registrationCode,
  status,
} = request.body;

    if (!name?.trim()) {
      return response.status(400).json({
        message:
          "Competition name is required.",
      });
    }

    if (
      !Array.isArray(
        eligibleClasses
      ) ||
      eligibleClasses.length === 0
    ) {
      return response.status(400).json({
        message:
          "At least one eligible class is required.",
      });
    }

    const cleanedClasses =
      eligibleClasses.map((item) =>
        String(item).trim()
      );

    const validClasses =
      cleanedClasses.every((item) =>
        [
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
        ].includes(item)
      );

    if (!validClasses) {
      return response.status(400).json({
        message:
          "Eligible classes must be between 5 and 12.",
      });
    }

    const parsedTotalMarks =
      Number(totalMarks);

    if (
      !Number.isFinite(
        parsedTotalMarks
      ) ||
      parsedTotalMarks <= 0
    ) {
      return response.status(400).json({
        message:
          "Total marks must be greater than 0.",
      });
    }

   const competition =
  await Competition.create({
    name: name.trim(),

    tagline:
      tagline?.trim() || "",

    description:
      description?.trim() || "",

    eligibleClasses:
      cleanedClasses,

    mode:
      mode || "Offline",

    examDate:
      examDate?.trim() || "",

    prizeDetails:
      prizeDetails?.trim() || "",

    subjectsAndTopics:
      subjectsAndTopics?.trim() || "",

    totalMarks:
      parsedTotalMarks,

    registrationOpen:
      Boolean(registrationOpen),

    registrationFee:
      Number(registrationFee || 0),

    registrationCode:
      String(
        registrationCode || "COMP"
      )
        .trim()
        .toUpperCase(),

    status:
      status || "upcoming",

    resultsPublished:
      false,
  });

    return response.status(201).json({
      message:
        "Competition created successfully.",

      competition,
    });
  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * UPDATE COMPETITION
 * SUPERADMIN ONLY
 * ==========================================
 */

export const updateCompetition = async (
  request,
  response,
  next
) => {
  try {
    const { id } =
      request.params;

    const competition =
      await Competition.findById(id);

    if (!competition) {
      return response.status(404).json({
        message:
          "Competition not found.",
      });
    }

    const allowedFields = [
  "name",
  "tagline",
  "description",
  "eligibleClasses",
  "mode",
  "examDate",
  "prizeDetails",
  "subjectsAndTopics",
  "totalMarks",
  "registrationOpen",
  "registrationFee",
  "registrationCode",
  "status",
];

competition.registrationFee =
  Number(
    competition.registrationFee || 0
  );

if (
  !Number.isFinite(
    competition.registrationFee
  ) ||
  competition.registrationFee < 0
) {
  return response.status(400).json({
    message:
      "Registration fee cannot be negative.",
  });
}

competition.registrationCode =
  String(
    competition.registrationCode ||
      "COMP"
  )
    .trim()
    .toUpperCase();



    allowedFields.forEach(
      (field) => {
        if (
          request.body[field] !==
          undefined
        ) {
          competition[field] =
            request.body[field];
        }
      }
    );

    if (!competition.name?.trim()) {
      return response.status(400).json({
        message:
          "Competition name is required.",
      });
    }

    if (
      !Array.isArray(
        competition.eligibleClasses
      ) ||
      competition.eligibleClasses.length ===
        0
    ) {
      return response.status(400).json({
        message:
          "At least one eligible class is required.",
      });
    }

    const cleanedClasses =
      competition.eligibleClasses.map(
        (item) => String(item).trim()
      );

    const validClasses =
      cleanedClasses.every((item) =>
        [
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
        ].includes(item)
      );

    if (!validClasses) {
      return response.status(400).json({
        message:
          "Eligible classes must be between 5 and 12.",
      });
    }

    competition.eligibleClasses =
      cleanedClasses;

    if (
      !Number.isFinite(
        Number(
          competition.totalMarks
        )
      ) ||
      Number(
        competition.totalMarks
      ) <= 0
    ) {
      return response.status(400).json({
        message:
          "Total marks must be greater than 0.",
      });
    }

    await competition.save();

    return response.status(200).json({
      message:
        "Competition updated successfully.",

      competition,
    });
  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * DELETE COMPETITION
 * SUPERADMIN ONLY
 * ==========================================
 */

export const deleteCompetition = async (
  request,
  response,
  next
) => {
  try {
    const { id } =
      request.params;

    const competition =
      await Competition.findById(id);

    if (!competition) {
      return response.status(404).json({
        message:
          "Competition not found.",
      });
    }

    if (
      competition.resultsPublished
    ) {
      return response.status(400).json({
        message:
          "This competition cannot be deleted because its results have already been published.",
      });
    }

    await competition.deleteOne();

    return response.status(200).json({
      message:
        "Competition deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * OPEN REGISTRATION
 * SUPERADMIN ONLY
 * ==========================================
 */

export const openRegistration = async (
  request,
  response,
  next
) => {
  try {
    const { id } =
      request.params;

    const competition =
      await Competition.findById(id);

    if (!competition) {
      return response.status(404).json({
        message:
          "Competition not found.",
      });
    }

    if (
      competition.status ===
      "completed"
    ) {
      return response.status(400).json({
        message:
          "A completed competition cannot be reopened.",
      });
    }

    competition.registrationOpen =
      true;

    competition.status =
      "open";

    await competition.save();

    return response.status(200).json({
      message:
        "Competition registration is now open.",

      competition,
    });
  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * CLOSE REGISTRATION
 * SUPERADMIN ONLY
 * ==========================================
 */

export const closeRegistration = async (
  request,
  response,
  next
) => {
  try {
    const { id } =
      request.params;

    const competition =
      await Competition.findById(id);

    if (!competition) {
      return response.status(404).json({
        message:
          "Competition not found.",
      });
    }

    competition.registrationOpen =
      false;

    if (
      competition.status ===
      "open"
    ) {
      competition.status =
        "closed";
    }

    await competition.save();

    return response.status(200).json({
      message:
        "Competition registration has been closed.",

      competition,
    });
  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * MARK COMPETITION COMPLETED
 * SUPERADMIN ONLY
 * ==========================================
 */

export const completeCompetition = async (
  request,
  response,
  next
) => {
  try {
    const { id } =
      request.params;

    const competition =
      await Competition.findById(id);

    if (!competition) {
      return response.status(404).json({
        message:
          "Competition not found.",
      });
    }

    competition.registrationOpen =
      false;

    competition.status =
      "completed";

    await competition.save();

    return response.status(200).json({
      message:
        "Competition marked as completed.",

      competition,
    });
  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * PUBLISH RESULTS
 * SUPERADMIN ONLY
 * ==========================================
 */

export const publishCompetitionResults =
  async (
    request,
    response,
    next
  ) => {

    try {

      const { id } =
        request.params;

      const competition =
        await Competition.findById(id);

      if (!competition) {

        return response
          .status(404)
          .json({
            message:
              "Competition not found.",
          });

      }


      if (
        competition.resultsPublished
      ) {

        return response
          .status(400)
          .json({
            message:
              "Results for this competition are already published.",
          });

      }


      /*
       * Get all results
       * and sort by marks.
       */

      const results =
        await Result.find({
          competition: id,
        }).sort({
          marksObtained: -1,
        });


      /*
       * Calculate rank and publish
       */

      for (
        let index = 0;
        index < results.length;
        index++
      ) {

        results[index].rank =
          index + 1;

        results[index].published =
          true;

        await results[index].save();

      }


      /*
       * Mark competition completed
       */

      competition.resultsPublished =
        true;

      competition.registrationOpen =
        false;

      competition.status =
        "completed";


      await competition.save();


      return response
        .status(200)
        .json({

          message:
            "Competition results published successfully.",

          competition,

        });

    } catch (error) {

      return next(error);

    }

  };