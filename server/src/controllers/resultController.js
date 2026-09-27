import Result from "../models/Result.js";
import User from "../models/User.js";
import Competition from "../models/Competition.js";

/*
 * ==========================================
 * GET RESULTS
 * ADMIN + SUPERADMIN
 *
 * Admins only see student results.
 * Superadmins can see everything.
 * ==========================================
 */

export const getResults = async (request, response, next) => {
  try {
    const filter =
      request.user.role === "superadmin"
        ? {}
        : {
            student: {
              $exists: true,
            },
          };

    const results = await Result.find(filter)
      .populate(
        "student",
        "name mobileNumber class medium schoolOrCoaching role"
      )
      .populate(
        "competition",
        "name examDate status"
      )
      .sort({
        createdAt: -1,
      });

    return response.status(200).json({
      results,
    });
  } catch (error) {
    return next(error);
  }
};

/*
 * ==========================================
 * GET PUBLISHED RESULTS FOR LOGGED-IN STUDENT
 * ==========================================
 *
 * Student only.
 *
 * Returns only results belonging to the
 * logged-in student and only after publishing.
 */

export const getStudentResults = async (
  request,
  response,
  next
) => {
  try {
    const studentId = request.user._id;

    const results = await Result.find({
      student: studentId,
      published: true,
    })
      .populate(
        "competition",
        "name totalMarks examDate"
      )
      .sort({
        createdAt: -1,
      });

    return response.status(200).json({
      results,
    });

  } catch (error) {
    return next(error);
  }
};
/*
 * ==========================================
 * GET RESULTS FOR ONE COMPETITION
 * ADMIN + SUPERADMIN
 * ==========================================
 */

export const getCompetitionResults = async (
  request,
  response,
  next
) => {
  try {
    const { competitionId } = request.params;

    const competition = await Competition.findById(
      competitionId
    );

    if (!competition) {
      return response.status(404).json({
        message: "Competition not found.",
      });
    }

    const results = await Result.find({
      competition: competitionId,
    })
      .populate(
        "student",
        "name mobileNumber class medium schoolOrCoaching"
      )
      .populate(
        "competition",
        "name examDate status"
      )
      .sort({
        marks: -1,
      });

    return response.status(200).json({
      competition,
      results,
    });
  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * ADD OR UPDATE RESULT
 *
 * ADMIN + SUPERADMIN
 * ==========================================
 */

export const addOrUpdateResult = async (
  request,
  response,
  next
) => {
  try {
    const {
      competitionId,
      studentId,
      marks,
      totalMarks,
      remarks,
    } = request.body;

    /*
     * Validate required fields
     */

    if (!competitionId) {
      return response.status(400).json({
        message: "Competition is required.",
      });
    }

    if (!studentId) {
      return response.status(400).json({
        message: "Student is required.",
      });
    }

    if (
      marks === undefined ||
      marks === null ||
      marks === ""
    ) {
      return response.status(400).json({
        message: "Marks are required.",
      });
    }

    if (
      totalMarks === undefined ||
      totalMarks === null ||
      totalMarks === ""
    ) {
      return response.status(400).json({
        message: "Total marks are required.",
      });
    }

    /*
     * Convert numbers
     */

    const obtainedMarks = Number(marks);
    const maximumMarks = Number(totalMarks);

    if (
      !Number.isFinite(obtainedMarks) ||
      !Number.isFinite(maximumMarks)
    ) {
      return response.status(400).json({
        message: "Marks must be valid numbers.",
      });
    }

    if (maximumMarks <= 0) {
      return response.status(400).json({
        message: "Total marks must be greater than zero.",
      });
    }

    if (obtainedMarks < 0) {
      return response.status(400).json({
        message: "Marks cannot be negative.",
      });
    }

    if (obtainedMarks > maximumMarks) {
      return response.status(400).json({
        message:
          "Obtained marks cannot be greater than total marks.",
      });
    }

    /*
     * Check competition
     */

    const competition = await Competition.findById(
      competitionId
    );

    if (!competition) {
      return response.status(404).json({
        message: "Competition not found.",
      });
    }

    /*
     * Check student
     */

    const student = await User.findById(studentId);

    if (!student) {
      return response.status(404).json({
        message: "Student not found.",
      });
    }

    if (student.role !== "student") {
      return response.status(400).json({
        message:
          "Results can only be assigned to student accounts.",
      });
    }

    /*
     * Check whether result already exists
     */

    let result = await Result.findOne({
      competition: competitionId,
      student: studentId,
    });

    if (result) {
      /*
       * Do not automatically unpublish an already
       * published result.
       */

      if (result.published) {
        return response.status(400).json({
          message:
            "This result has already been published. Unpublish it before making changes.",
        });
      }

      result.marks = obtainedMarks;
      result.totalMarks = maximumMarks;
      result.remarks = remarks?.trim() || "";

      await result.save();

      return response.status(200).json({
        message: "Result updated successfully.",
        result,
      });
    }

    /*
     * Create new result
     */

    result = await Result.create({
      competition: competitionId,
      student: studentId,
      marks: obtainedMarks,
      totalMarks: maximumMarks,
      remarks: remarks?.trim() || "",
      published: false,
    });

    return response.status(201).json({
      message: "Result added successfully.",
      result,
    });
  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * PUBLISH RESULTS
 * SUPERADMIN ONLY
 *
 * Automatically calculates ranks.
 * ==========================================
 */

export const publishResults = async (
  request,
  response,
  next
) => {
  try {
    const { competitionId } = request.params;

    /*
     * Check competition
     */

    const competition = await Competition.findById(
      competitionId
    );

    if (!competition) {
      return response.status(404).json({
        message: "Competition not found.",
      });
    }

    /*
     * Get all unpublished/published results
     */

    const results = await Result.find({
      competition: competitionId,
    }).sort({
      marks: -1,
      createdAt: 1,
    });

    if (results.length === 0) {
      return response.status(400).json({
        message:
          "No results have been entered for this competition.",
      });
    }

    /*
     * Calculate ranks.
     *
     * Same marks = same rank.
     *
     * Example:
     *
     * 95 → Rank 1
     * 90 → Rank 2
     * 90 → Rank 2
     * 85 → Rank 4
     */

    let currentRank = 0;
    let previousMarks = null;

    for (let index = 0; index < results.length; index++) {
      const result = results[index];

      if (result.marks !== previousMarks) {
        currentRank = index + 1;
        previousMarks = result.marks;
      }

      result.rank = currentRank;
      result.published = true;
      result.publishedAt = new Date();

      await result.save();
    }

    /*
     * Mark competition as completed
     */

    competition.status = "completed";
    competition.registrationOpen = false;

    await competition.save();

    return response.status(200).json({
      message:
        "Results published successfully.",
      resultsCount: results.length,
    });
  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * UNPUBLISH RESULTS
 *
 * SUPERADMIN ONLY
 *
 * Useful if you need to correct marks.
 * ==========================================
 */

export const unpublishResults = async (
  request,
  response,
  next
) => {
  try {
    const { competitionId } = request.params;

    const competition = await Competition.findById(
      competitionId
    );

    if (!competition) {
      return response.status(404).json({
        message: "Competition not found.",
      });
    }

    const resultUpdate = await Result.updateMany(
      {
        competition: competitionId,
      },
      {
        $set: {
          published: false,
          publishedAt: null,
          rank: null,
        },
      }
    );

    /*
     * Do not automatically change competition status.
     * Superadmin can decide what to do with it.
     */

    return response.status(200).json({
      message:
        "Results unpublished successfully.",
      modifiedCount:
        resultUpdate.modifiedCount,
    });
  } catch (error) {
    return next(error);
  }
};