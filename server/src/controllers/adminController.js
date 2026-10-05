import User from "../models/User.js";
import Competition from "../models/Competition.js";
import Result from "../models/Result.js";
import Certificate from "../models/Certificate.js";
import Registration from "../models/Registration.js";


/*
 * ==========================================
 * USERS
 * ==========================================
 */

export const getUsers = async (request, response, next) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    return response.status(200).json({
      users,
    });
  } catch (error) {
    next(error);
  }
};


/*
 * ==========================================
 * UPDATE STUDENT
 * ADMIN + SUPERADMIN
 * ==========================================
 */

export const updateStudent = async (
  request,
  response,
  next
) => {
  try {
    const { id } = request.params;

    const {
      name,
      class: studentClass,
      mobileNumber,
      medium,
      schoolOrCoaching,
    } = request.body;

    const student = await User.findById(id);

    if (!student) {
      return response.status(404).json({
        message: "Student not found.",
      });
    }

    if (student.role !== "student") {
      return response.status(400).json({
        message: "Only student accounts can be edited here.",
      });
    }

    if (name !== undefined) student.name = name;
    if (studentClass !== undefined)
      student.class = String(studentClass);
    if (mobileNumber !== undefined)
      student.mobileNumber = mobileNumber;
    if (medium !== undefined) student.medium = medium;
    if (schoolOrCoaching !== undefined)
      student.schoolOrCoaching = schoolOrCoaching;

    await student.save();

    return response.status(200).json({
      message: "Student updated successfully.",
      user: student,
    });
  } catch (error) {
    next(error);
  }
};


/*
 * ==========================================
 * DELETE STUDENT
 * SUPERADMIN ONLY
 * ==========================================
 */

export const deleteStudent = async (
  request,
  response,
  next
) => {
  try {
    const { id } = request.params;

    const student = await User.findById(id);

    if (!student) {
      return response.status(404).json({
        message: "Student not found.",
      });
    }

    if (student.role !== "student") {
      return response.status(400).json({
        message: "Only student accounts can be deleted.",
      });
    }

    await Result.deleteMany({
      student: student._id,
    });

    await Certificate.deleteMany({
      student: student._id,
    });

    await Registration.deleteMany({
  student: student._id,
});

    await student.deleteOne();

    return response.status(200).json({
      message: "Student removed successfully.",
    });
  } catch (error) {
    next(error);
  }
};


/*
 * ==========================================
 * MAKE ADMIN
 * SUPERADMIN ONLY
 * ==========================================
 */

export const makeAdmin = async (
  request,
  response,
  next
) => {
  try {
    const { id } = request.params;

    const user = await User.findById(id);

    if (!user) {
      return response.status(404).json({
        message: "User not found.",
      });
    }

    if (user.role === "superadmin") {
      return response.status(400).json({
        message: "Superadmin cannot be changed.",
      });
    }

    if (user.role === "admin") {
      return response.status(400).json({
        message: "User is already an admin.",
      });
    }

    user.role = "admin";

    await user.save();

    return response.status(200).json({
      message: "User promoted to admin successfully.",
      user,
    });
  } catch (error) {
    next(error);
  }
};


/*
 * ==========================================
 * REMOVE ADMIN
 * SUPERADMIN ONLY
 * ==========================================
 */

export const removeAdmin = async (
  request,
  response,
  next
) => {
  try {
    const { id } = request.params;

    const user = await User.findById(id);

    if (!user) {
      return response.status(404).json({
        message: "User not found.",
      });
    }

    if (user.role === "superadmin") {
      return response.status(400).json({
        message: "Superadmin privileges cannot be removed.",
      });
    }

    if (user.role !== "admin") {
      return response.status(400).json({
        message: "User is not an admin.",
      });
    }

    user.role = "student";

    await user.save();

    return response.status(200).json({
      message: "Admin privileges removed successfully.",
      user,
    });
  } catch (error) {
    next(error);
  }
};


/*
 * ==========================================
 * COMPETITIONS
 * SUPERADMIN
 * ==========================================
 */

export const getCompetitions = async (
  request,
  response,
  next
) => {
  try {
    const competitions = await Competition.find({})
      .sort({ createdAt: -1 });

    return response.status(200).json({
      competitions,
    });
  } catch (error) {
    next(error);
  }
};


export const createCompetition = async (
  request,
  response,
  next
) => {
  try {
    const competition = await Competition.create(
      request.body
    );

    return response.status(201).json({
      message: "Competition created successfully.",
      competition,
    });
  } catch (error) {
    next(error);
  }
};


export const updateCompetition = async (
  request,
  response,
  next
) => {
  try {
    const { id } = request.params;

    const competition =
      await Competition.findByIdAndUpdate(
        id,
        request.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!competition) {
      return response.status(404).json({
        message: "Competition not found.",
      });
    }

    return response.status(200).json({
      message: "Competition updated successfully.",
      competition,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteCompetition = async (
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

    await Result.deleteMany({
      competition: id,
    });

    await Certificate.deleteMany({
      competition: id,
    });

    await competition.deleteOne();

    return response.status(200).json({
      message: "Competition deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};


/*
 * ==========================================
 * RESULTS
 * ADMIN + SUPERADMIN
 * ==========================================
 */

export const getResults = async (
  request,
  response,
  next
) => {
  try {
    const results = await Result.find({})
      .populate(
        "student",
        "name mobileNumber class medium"
      )
      .populate(
        "competition",
        "name totalMarks"
      )
      .sort({
        marksObtained: -1,
      });

    return response.status(200).json({
      results,
    });
  } catch (error) {
    next(error);
  }
};


export const addOrUpdateResult = async (
  request,
  response,
  next
) => {
  try {
    const {
      student,
      competition,
      marksObtained,
      remarks,
    } = request.body;

    const competitionData =
      await Competition.findById(competition);

    if (!competitionData) {
      return response.status(404).json({
        message: "Competition not found.",
      });
    }

    const studentData =
      await User.findById(student);

    if (!studentData || studentData.role !== "student") {
      return response.status(404).json({
        message: "Student not found.",
      });
    }

    const marks = Number(marksObtained);

    if (
      Number.isNaN(marks) ||
      marks < 0 ||
      marks > competitionData.totalMarks
    ) {
      return response.status(400).json({
        message: `Marks must be between 0 and ${competitionData.totalMarks}.`,
      });
    }

    const result =
      await Result.findOneAndUpdate(
        {
          student,
          competition,
        },
        {
          student,
          competition,
          marksObtained: marks,
          totalMarks: competitionData.totalMarks,
          remarks: remarks || "",
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    return response.status(200).json({
      message: "Marks saved successfully.",
      result,
    });
  } catch (error) {
    next(error);
  }
};


/*
 * ==========================================
 * PUBLISH RESULTS
 * SUPERADMIN ONLY
 * ==========================================
 */

export const publishResults = async (
  request,
  response,
  next
) => {
  try {
    const { competitionId } = request.params;

    const competition =
      await Competition.findById(
        competitionId
      );

    if (!competition) {
      return response.status(404).json({
        message: "Competition not found.",
      });
    }

    const results =
      await Result.find({
        competition: competitionId,
      }).sort({
        marksObtained: -1,
      });

    for (let index = 0; index < results.length; index++) {
      results[index].rank = index + 1;
      results[index].published = true;

      await results[index].save();
    }

    competition.resultsPublished = true;
    competition.status = "completed";

    await competition.save();

    return response.status(200).json({
      message: "Results published successfully.",
    });
  } catch (error) {
    next(error);
  }
};


/*
 * ==========================================
 * CERTIFICATES
 * ADMIN + SUPERADMIN
 * ==========================================
 */

export const getCertificates = async (
  request,
  response,
  next
) => {
  try {
    const certificates =
      await Certificate.find({})
        .populate(
          "student",
          "name mobileNumber class"
        )
        .populate(
          "competition",
          "name"
        )
        .sort({
          createdAt: -1,
        });

    return response.status(200).json({
      certificates,
    });
  } catch (error) {
    next(error);
  }
};


export const createCertificate = async (
  request,
  response,
  next
) => {
  try {
    const {
      student,
      competition,
      certificateNumber,
      certificateUrl,
    } = request.body;

    const certificate =
      await Certificate.create({
        student,
        competition,
        certificateNumber,
        certificateUrl,
      });

    return response.status(201).json({
      message: "Certificate added successfully.",
      certificate,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteCertificate = async (
  request,
  response,
  next
) => {
  try {
    const { id } = request.params;

    const certificate =
      await Certificate.findById(id);

    if (!certificate) {
      return response.status(404).json({
        message: "Certificate not found.",
      });
    }

    await certificate.deleteOne();

    return response.status(200).json({
      message: "Certificate deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};