import Query from "../models/Query.js";


/*
 * ==========================================
 * CREATE QUERY
 *
 * PUBLIC + LOGGED-IN USER
 * ==========================================
 */

export const createQuery = async (
  request,
  response,
  next
) => {
  try {
    const {
      name,
      phone,
      address,
      message,
    } = request.body;


    /*
     * ==========================================
     * VALIDATION
     * ==========================================
     */

    if (!name?.trim()) {
      return response.status(400).json({
        message: "Name is required.",
      });
    }

    if (!phone?.trim()) {
      return response.status(400).json({
        message: "Phone number is required.",
      });
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      return response.status(400).json({
        message:
          "Please enter a valid 10-digit Indian mobile number.",
      });
    }

    if (!address?.trim()) {
      return response.status(400).json({
        message: "Address is required.",
      });
    }

    if (!message?.trim()) {
      return response.status(400).json({
        message: "Query message is required.",
      });
    }


    /*
     * ==========================================
     * CREATE QUERY
     * ==========================================
     *
     * Logged-in user:
     *     request.user._id
     *
     * Guest:
     *     null
     */

    const query = await Query.create({
      user: request.user?._id || null,

      name: name.trim(),

      phone: phone.trim(),

      address: address.trim(),

      message: message.trim(),

      status: "pending",

      adminReply: "",

      resolvedAt: null,
    });


    /*
     * ==========================================
     * RESPONSE
     * ==========================================
     */

    return response.status(201).json({
      message:
        "Your query has been submitted successfully.",

      query,
    });

  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * GET ALL QUERIES
 *
 * ADMIN + SUPERADMIN
 * ==========================================
 */

export const getQueries = async (
  request,
  response,
  next
) => {
  try {
    const queries = await Query.find({})
      .populate(
        "user",
        "name mobileNumber class medium schoolOrCoaching"
      )
      .sort({
        createdAt: -1,
      });

    return response.status(200).json({
      queries,
    });

  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * GET SINGLE QUERY
 *
 * ADMIN + SUPERADMIN
 * ==========================================
 */

export const getQuery = async (
  request,
  response,
  next
) => {
  try {
    const { id } = request.params;

    const query = await Query.findById(id)
      .populate(
        "user",
        "name mobileNumber class medium schoolOrCoaching"
      );

    if (!query) {
      return response.status(404).json({
        message: "Query not found.",
      });
    }

    return response.status(200).json({
      query,
    });

  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * GET MY QUERIES
 *
 * LOGGED-IN STUDENT
 * ==========================================
 */

export const getMyQueries = async (
  request,
  response,
  next
) => {
  try {

    const queries = await Query.find({
      user: request.user._id,
    }).sort({
      createdAt: -1,
    });

    return response.status(200).json({
      queries,
    });

  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * UPDATE QUERY
 *
 * ADMIN + SUPERADMIN
 * ==========================================
 */

export const updateQuery = async (
  request,
  response,
  next
) => {
  try {
    const { id } = request.params;

    const {
      status,
      adminReply,
    } = request.body;


    /*
     * ==========================================
     * FIND QUERY
     * ==========================================
     */

    const query = await Query.findById(id);

    if (!query) {
      return response.status(404).json({
        message: "Query not found.",
      });
    }


    /*
     * ==========================================
     * UPDATE STATUS
     * ==========================================
     */

    if (status !== undefined) {

      const allowedStatuses = [
        "pending",
        "in-progress",
        "resolved",
      ];

      if (!allowedStatuses.includes(status)) {
        return response.status(400).json({
          message: "Invalid query status.",
        });
      }

      query.status = status;


      /*
       * Store resolution time
       */

      if (status === "resolved") {
        query.resolvedAt = new Date();
      } else {
        query.resolvedAt = null;
      }
    }


    /*
     * ==========================================
     * UPDATE ADMIN REPLY
     * ==========================================
     */

    if (adminReply !== undefined) {

      query.adminReply =
        String(adminReply).trim();

    }


    /*
     * ==========================================
     * SAVE
     * ==========================================
     */

    await query.save();


    /*
     * ==========================================
     * GET UPDATED QUERY
     * ==========================================
     */

    const updatedQuery =
      await Query.findById(query._id)
        .populate(
          "user",
          "name mobileNumber class medium schoolOrCoaching"
        );


    return response.status(200).json({
      message:
        "Query updated successfully.",

      query: updatedQuery,
    });

  } catch (error) {
    return next(error);
  }
};


/*
 * ==========================================
 * DELETE QUERY
 *
 * SUPERADMIN ONLY
 * ==========================================
 */

export const deleteQuery = async (
  request,
  response,
  next
) => {
  try {
    const { id } = request.params;

    const query = await Query.findById(id);

    if (!query) {
      return response.status(404).json({
        message: "Query not found.",
      });
    }

    await query.deleteOne();

    return response.status(200).json({
      message:
        "Query deleted successfully.",
    });

  } catch (error) {
    return next(error);
  }
};