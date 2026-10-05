import mongoose from "mongoose";
import crypto from "crypto";
import Razorpay from "razorpay";

import Registration from "../models/Registration.js";
import Competition from "../models/Competition.js";
import generateRegistrationId from "../utils/generateRegistrationId.js";

/*
 * ==========================================
 * RAZORPAY CLIENT
 * ==========================================
 */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


/*
 * ==========================================
 * CREATE REGISTRATION + RAZORPAY ORDER
 * ==========================================
 */

export const createRegistration = async (
  request,
  response,
  next
) => {
  try {
    const {
      competitionId,
      parentName,
      parentMobileNumber,
    } = request.body;

    /*
     * ------------------------------------------
     * VALIDATION
     * ------------------------------------------
     */

    if (
      !competitionId ||
      !mongoose.Types.ObjectId.isValid(
        competitionId
      )
    ) {
      return response.status(400).json({
        message:
          "A valid competition is required.",
      });
    }

    if (!parentName?.trim()) {
      return response.status(400).json({
        message:
          "Parent/Guardian name is required.",
      });
    }

    if (!parentMobileNumber?.trim()) {
      return response.status(400).json({
        message:
          "Parent/Guardian mobile number is required.",
      });
    }


    /*
     * ------------------------------------------
     * LOGGED-IN STUDENT
     * ------------------------------------------
     */

    const student = request.user;

    if (!student) {
      return response.status(401).json({
        message:
          "Please login before registering.",
      });
    }

    if (student.role !== "student") {
      return response.status(403).json({
        message:
          "Only student accounts can register for competitions.",
      });
    }


    /*
     * ------------------------------------------
     * FIND COMPETITION
     * ------------------------------------------
     */

    const competition =
      await Competition.findById(
        competitionId
      );

    if (!competition) {
      return response.status(404).json({
        message:
          "Competition not found.",
      });
    }


    /*
     * ------------------------------------------
     * CHECK COMPETITION STATUS
     * ------------------------------------------
     */

    if (
      !competition.registrationOpen ||
      competition.status !== "open"
    ) {
      return response.status(400).json({
        message:
          "Registration is currently closed for this competition.",
      });
    }


    /*
     * ------------------------------------------
     * CHECK CLASS ELIGIBILITY
     * ------------------------------------------
     */

    const studentClass =
      String(student.class || "").trim();

    const eligibleClasses =
      Array.isArray(
        competition.eligibleClasses
      )
        ? competition.eligibleClasses.map(
            (item) =>
              String(item).trim()
          )
        : [];

    if (
      !studentClass ||
      !eligibleClasses.includes(
        studentClass
      )
    ) {
      return response.status(403).json({
        message:
          "You are not eligible for this competition.",
      });
    }


    /*
     * ------------------------------------------
     * CHECK EXISTING REGISTRATION
     * ------------------------------------------
     */

    let registration =
      await Registration.findOne({
        competition:
          competition._id,
        student:
          student._id,
      });


    /*
     * ------------------------------------------
     * ALREADY PAID
     * ------------------------------------------
     */

    if (
      registration &&
      registration.paymentStatus === "paid"
    ) {
      return response.status(409).json({
        message:
          "You are already registered for this competition.",
        registration,
      });
    }


    /*
     * ------------------------------------------
     * PAYMENT AMOUNT
     * ------------------------------------------
     */

    const paymentAmount =
      Number(
        competition.registrationFee
      );

    if (
      !Number.isFinite(
        paymentAmount
      ) ||
      paymentAmount <= 0
    ) {
      return response.status(400).json({
        message:
          "Invalid registration fee. Please contact the administrator.",
      });
    }


    /*
     * ------------------------------------------
     * CREATE / REUSE REGISTRATION
     * ------------------------------------------
     */

    if (!registration) {

      registration =
        await Registration.create({
          competition:
            competition._id,

          student:
            student._id,

          name:
            String(
              student.name || ""
            ).trim(),

          mobileNumber:
            String(
              student.mobileNumber || ""
            ).trim(),

          class:
            studentClass,

          medium:
            String(
              student.medium || ""
            ).trim(),

          schoolOrCoaching:
            String(
              student.schoolOrCoaching || ""
            ).trim(),

          parentName:
            parentName.trim(),

          parentMobileNumber:
            parentMobileNumber.trim(),

          paymentStatus:
            "pending",

          paymentAmount,

          registeredAt:
            null,
        });

    } else {

      /*
       * Existing pending registration.
       * Reuse it for a new payment attempt.
       */

      registration.parentName =
        parentName.trim();

      registration.parentMobileNumber =
        parentMobileNumber.trim();

      registration.paymentAmount =
        paymentAmount;

      registration.paymentStatus =
        "pending";

      registration.razorpayPaymentId =
        "";

      registration.razorpaySignature =
        "";

      await registration.save();
    }


    /*
     * ------------------------------------------
     * CREATE RAZORPAY ORDER
     * ------------------------------------------
     */

    const razorpayOrder =
      await razorpay.orders.create({
        amount:
          Math.round(
            paymentAmount * 100
          ),

        currency:
          "INR",

        receipt:
          `registration_${registration._id}`,

        notes: {
          registrationId:
            registration._id.toString(),

          competitionId:
            competition._id.toString(),

          studentId:
            student._id.toString(),
        },
      });


    /*
     * ------------------------------------------
     * SAVE ORDER ID
     * ------------------------------------------
     */

    registration.razorpayOrderId =
      razorpayOrder.id;

    await registration.save();


    /*
     * ------------------------------------------
     * RESPONSE
     * ------------------------------------------
     */

    return response.status(201).json({

      message:
        "Registration created successfully. Please complete payment.",

      registration: {
        _id:
          registration._id,

        paymentStatus:
          registration.paymentStatus,

        paymentAmount:
          registration.paymentAmount,

        razorpayOrderId:
          registration.razorpayOrderId,
      },

      razorpay: {

        keyId:
          process.env.RAZORPAY_KEY_ID,

        orderId:
          razorpayOrder.id,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency,
      },
    });

  } catch (error) {

    console.error(
      "CREATE REGISTRATION ERROR:",
      error
    );

    if (
      error?.code === 11000
    ) {
      return response.status(409).json({
        message:
          "You already have a registration for this competition.",
      });
    }

    return next(error);
  }
};


/*
 * ==========================================
 * VERIFY RAZORPAY PAYMENT
 * ==========================================
 */

export const verifyPayment = async (
  request,
  response,
  next
) => {

  try {

    const {
      registrationId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = request.body;


    /*
     * ------------------------------------------
     * VALIDATION
     * ------------------------------------------
     */

    if (
      !registrationId ||
      !mongoose.Types.ObjectId.isValid(
        registrationId
      )
    ) {
      return response.status(400).json({
        message:
          "Invalid registration ID.",
      });
    }


    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return response.status(400).json({
        message:
          "Incomplete Razorpay payment details.",
      });
    }


    /*
     * ------------------------------------------
     * FIND REGISTRATION
     * ------------------------------------------
     */

    const registration =
      await Registration.findOne({
        _id:
          registrationId,

        student:
          request.user._id,
      });


    if (!registration) {
      return response.status(404).json({
        message:
          "Registration not found.",
      });
    }



    

    /*
     * ------------------------------------------
     * ALREADY PAID
     * ------------------------------------------
     */

    if (
      registration.paymentStatus ===
      "paid"
    ) {

      return response.status(200).json({

        message:
          "Payment has already been verified.",

        registration,
      });
    }


    /*
     * ------------------------------------------
     * CHECK ORDER ID
     * ------------------------------------------
     */

    if (
      registration.razorpayOrderId !==
      razorpay_order_id
    ) {

      return response.status(400).json({
        message:
          "Razorpay order ID does not match.",
      });
    }


    /*
     * ------------------------------------------
     * VERIFY RAZORPAY SIGNATURE
     * ------------------------------------------
     */

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");


    if (
      generatedSignature !==
      razorpay_signature
    ) {

      return response.status(400).json({
        message:
          "Payment verification failed.",
      });
    }


    /*
     * ------------------------------------------
     * FIND COMPETITION
     * ------------------------------------------
     */

    const competition =
      await Competition.findById(
        registration.competition
      );


    if (!competition) {
      return response.status(404).json({
        message:
          "Competition not found.",
      });
    }


    /*
     * ------------------------------------------
     * MARK PAYMENT AS PAID
     * ------------------------------------------
     */

    registration.razorpayPaymentId =
      razorpay_payment_id;

    registration.razorpaySignature =
      razorpay_signature;

    registration.paymentStatus =
      "paid";


    /*
     * ------------------------------------------
     * GENERATE REGISTRATION ID
     * ------------------------------------------
     */

    if (
      !registration.registrationId
    ) {

      registration.registrationId =
  await generateRegistrationId(
    competition,
    registration.class
  );
    }


    /*
     * ------------------------------------------
     * FINAL REGISTRATION DATE
     * ------------------------------------------
     */

    registration.registeredAt =
      new Date();


    await registration.save();


    /*
     * ------------------------------------------
     * SUCCESS
     * ------------------------------------------
     */

    return response.status(200).json({

      message:
        "Payment verified successfully. Registration completed.",

      registration,
    });

  } catch (error) {

    console.error(
      "VERIFY PAYMENT ERROR:",
      error
    );

    return next(error);
  }
};


/*
 * ==========================================
 * GET MY REGISTRATIONS
 * ==========================================
 */

export const getMyRegistrations =
  async (
    request,
    response,
    next
  ) => {

    try {

      const registrations =
        await Registration.find({
          student:
            request.user._id,

          /*
           * Only completed registrations
           * should appear in "My Competitions".
           */
          paymentStatus:
            "paid",
        })
          .populate(
            "competition",
            "name tagline description examDate mode registrationFee registrationCode status"
          )
          .sort({
            registeredAt: -1,
            createdAt: -1,
          });


      return response.status(200).json({

        registrations,

      });

    } catch (error) {

      console.error(
        "GET MY REGISTRATIONS ERROR:",
        error
      );

      return next(error);
    }
  };


/*
 * ==========================================
 * GET SINGLE MY REGISTRATION
 * ==========================================
 */

export const getMyRegistration =
  async (
    request,
    response,
    next
  ) => {

    try {

      const {
        id
      } = request.params;


      /*
       * Validate ID
       */

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {

        return response.status(400).json({
          message:
            "Invalid registration ID.",
        });
      }


      /*
       * Find only paid registration
       */

      const registration =
        await Registration.findOne({

          _id:
            id,

          student:
            request.user._id,

          paymentStatus:
            "paid",

        }).populate(
          "competition",
          "name tagline description examDate mode registrationFee registrationCode status"
        );


      if (!registration) {

        return response.status(404).json({
          message:
            "Registration not found.",
        });
      }


      return response.status(200).json({

        registration,

      });

    } catch (error) {

      console.error(
        "GET MY REGISTRATION ERROR:",
        error
      );

      return next(error);
    }
  };

  /*
 * ==========================================
 * GET ALL COMPETITION REGISTRATIONS
 * ==========================================
 *
 * ADMIN + SUPERADMIN ONLY
 *
 * Returns completed/paid registrations.
 */
export const getAllRegistrations = async (
  request,
  response,
  next
) => {
  try {
    const registrations = await Registration.find({
      paymentStatus: "paid",
    })
      .populate(
        "competition",
        "name tagline examDate mode registrationFee registrationCode status"
      )
      .populate(
        "student",
        "name mobileNumber class medium schoolOrCoaching role"
      )
      .sort({
        registeredAt: -1,
        createdAt: -1,
      });

    return response.status(200).json({
      registrations,
      count: registrations.length,
    });
  } catch (error) {
    console.error(
      "GET ALL REGISTRATIONS ERROR:",
      error
    );

    return next(error);
  }
};