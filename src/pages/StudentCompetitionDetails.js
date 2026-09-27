import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "./StudentCompetitionDetails.css";
import { API_BASE_URL } from "../services/api";


const API_URL =
  `${API_BASE_URL}/student/competitions`;

const REGISTRATION_API =
  `${API_BASE_URL}/registrations`;


/*
 * ==========================================
 * LOAD RAZORPAY SCRIPT
 * ==========================================
 */

const loadRazorpayScript = () => {
  return new Promise((resolve) => {

    if (
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      )
    ) {
      resolve(true);
      return;
    }

    const script =
      document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};


export default function StudentCompetitionDetails() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();


  const [
    competition,
    setCompetition,
  ] = useState(null);


  const [
    isRegistered,
    setIsRegistered,
  ] = useState(false);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    registering,
    setRegistering,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  /*
   * ==========================================
   * LOAD COMPETITION
   * ==========================================
   */

  useEffect(() => {

    const loadCompetition =
      async () => {

        try {

          setLoading(true);

          setError("");


          const response =
            await fetch(
              `${API_URL}/${id}`,
              {
                credentials:
                  "include",
              }
            );


          const data =
            await response.json();


          if (!response.ok) {
            throw new Error(
              data?.message ||
                "Unable to load competition."
            );
          }


          setCompetition(
            data.competition
          );


          /*
           * Do NOT rely only on this
           * value because pending
           * registrations still need
           * payment.
           */

          setIsRegistered(
            data.isRegistered
          );

        } catch (
          requestError
        ) {

          console.error(
            requestError
          );


          if (
            requestError.message
              ?.toLowerCase()
              .includes(
                "authentication"
              )
          ) {
            navigate(
              "/login"
            );

            return;
          }


          setError(
            requestError.message ||
              "Unable to load competition."
          );

        } finally {

          setLoading(false);
        }
      };


    loadCompetition();

  }, [
    id,
    navigate,
  ]);


  /*
   * ==========================================
   * REGISTER + PAYMENT
   * ==========================================
   */

  const handleRegister =
    async () => {

      if (
        registering ||
        !competition
      ) {
        return;
      }


      try {

        setRegistering(true);

        setError("");

        setSuccess("");


        /*
         * --------------------------------------
         * LOAD RAZORPAY
         * --------------------------------------
         */

        const razorpayLoaded =
          await loadRazorpayScript();


        if (!razorpayLoaded) {
          throw new Error(
            "Unable to load Razorpay. Please check your internet connection and try again."
          );
        }


        /*
         * --------------------------------------
         * CREATE REGISTRATION + ORDER
         * --------------------------------------
         */

        const response =
          await fetch(
            REGISTRATION_API,
            {
              method:
                "POST",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  competitionId:
                    competition._id,

                  /*
                   * These two values will be
                   * replaced by the registration
                   * form if your form collects
                   * them.
                   *
                   * For now ask the user.
                   */

                  parentName:
                    window.prompt(
                      "Enter Parent/Guardian Name"
                    ) || "",

                  parentMobileNumber:
                    window.prompt(
                      "Enter Parent/Guardian Mobile Number"
                    ) || "",
                }),
            }
          );


        const data =
          await response.json();


        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to create registration."
          );
        }


        /*
         * --------------------------------------
         * GET RAZORPAY DATA
         * --------------------------------------
         */

        const razorpayData =
          data?.razorpay;


        if (
          !razorpayData?.key ||
          !razorpayData?.orderId
        ) {
          throw new Error(
            "Razorpay order was not created correctly."
          );
        }


        /*
         * --------------------------------------
         * OPEN RAZORPAY
         * --------------------------------------
         */

        const options = {

          key:
            razorpayData.key,

          amount:
            razorpayData.amount,

          currency:
            razorpayData.currency ||
            "INR",

          name:
            "Gyanexia",

          description:
            razorpayData.description ||
            competition.name,

          order_id:
            razorpayData.orderId,


          prefill:
            razorpayData.prefill || {},


          theme: {
            color:
              "#4f46e5",
          },


          handler:
            async function (
              paymentResponse
            ) {

              try {

                setSuccess(
                  "Payment successful. Verifying payment..."
                );


                /*
                 * --------------------------------
                 * VERIFY PAYMENT ON SERVER
                 * --------------------------------
                 */

                const verifyResponse =
                  await fetch(
                    `${REGISTRATION_API}/verify-payment`,
                    {
                      method:
                        "POST",

                      credentials:
                        "include",

                      headers: {
                        "Content-Type":
                          "application/json",
                      },

                      body:
                        JSON.stringify(
                          paymentResponse
                        ),
                    }
                  );


                const verifyData =
                  await verifyResponse.json();


                if (
                  !verifyResponse.ok
                ) {
                  throw new Error(
                    verifyData?.message ||
                      "Payment verification failed."
                  );
                }


                /*
                 * --------------------------------
                 * SUCCESS
                 * --------------------------------
                 */

                setIsRegistered(
                  true
                );


                setSuccess(
                  `Payment successful! Your registration ID is ${verifyData.registration?.registrationId || "generated successfully"}.`
                );


              } catch (
                verificationError
              ) {

                console.error(
                  "Payment verification error:",
                  verificationError
                );


                setError(
                  verificationError.message ||
                    "Payment verification failed."
                );

              } finally {

                setRegistering(false);
              }
            },


          modal: {

            ondismiss:
              function () {

                setRegistering(
                  false
                );

                setSuccess(
                  "Payment window closed. Your registration is still pending."
                );
              },
          },
        };


        const paymentObject =
          new window.Razorpay(
            options
          );


        paymentObject.on(
          "payment.failed",
          function (
            paymentFailure
          ) {

            console.error(
              "Razorpay payment failed:",
              paymentFailure
            );


            setError(
              paymentFailure?.error
                ?.description ||
                "Payment failed. Please try again."
            );


            setRegistering(
              false
            );
          }
        );


        paymentObject.open();


      } catch (
        requestError
      ) {

        console.error(
          "Registration/payment error:",
          requestError
        );


        setError(
          requestError.message ||
            "Unable to start payment."
        );


        setRegistering(false);
      }
    };


  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {

    return (
      <section className="competition-details-loading">
        Loading competition...
      </section>
    );
  }


  /*
   * ==========================================
   * ERROR
   * ==========================================
   */

  if (
    error &&
    !competition
  ) {

    return (
      <section className="competition-details-page">

        <div className="competition-details-error">

          <h2>
            Unable to load competition
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              navigate(
                "/student/dashboard"
              )
            }
          >
            Back to Dashboard
          </button>

        </div>

      </section>
    );
  }


  if (!competition) {
    return null;
  }


  const registrationClosed =
    !competition.registrationOpen ||
    competition.status ===
      "completed";


  /*
   * ==========================================
   * RENDER
   * ==========================================
   */

  return (

    <section className="competition-details-page">

      <div className="competition-details-container">


        <button
          className="back-dashboard-btn"
          onClick={() =>
            navigate(
              "/student/dashboard"
            )
          }
        >
          ← Back to Dashboard
        </button>


        <div className="competition-details-card">


          <div className="competition-details-top">

            <div>

              <span
                className={`competition-status status-${competition.status}`}
              >
                {competition.status}
              </span>


              <h1>
                {competition.name}
              </h1>


              {competition.tagline && (

                <p className="competition-tagline">
                  {competition.tagline}
                </p>

              )}

            </div>

          </div>


          {competition.description && (

            <div className="competition-description">

              <h2>
                About the Competition
              </h2>

              <p>
                {competition.description}
              </p>

            </div>

          )}


          <div className="competition-information">


            <div className="competition-info-item">

              <span>📅</span>

              <div>

                <small>
                  Exam Date
                </small>

                <strong>
                  {competition.examDate ||
                    "To be announced"}
                </strong>

              </div>

            </div>


            <div className="competition-info-item">

              <span>🎓</span>

              <div>

                <small>
                  Eligible Classes
                </small>

                <strong>

                  {competition.eligibleClasses
                    ?.map(
                      (item) =>
                        `Class ${item}`
                    )
                    .join(", ")}

                </strong>

              </div>

            </div>


            <div className="competition-info-item">

              <span>📝</span>

              <div>

                <small>
                  Mode
                </small>

                <strong>
                  {competition.mode}
                </strong>

              </div>

            </div>


            <div className="competition-info-item">

              <span>🎯</span>

              <div>

                <small>
                  Total Marks
                </small>

                <strong>
                  {competition.totalMarks}
                </strong>

              </div>

            </div>


          </div>


          {competition.subjectsAndTopics && (

            <div className="competition-extra-section">

              <h2>
                Subjects & Topics
              </h2>

              <p>
                {competition.subjectsAndTopics}
              </p>

            </div>

          )}


          {competition.prizeDetails && (

            <div className="competition-prize-section">

              <span>🏆</span>

              <div>

                <strong>
                  Prizes
                </strong>

                <p>
                  {competition.prizeDetails}
                </p>

              </div>

            </div>

          )}


          {error && (

            <div className="competition-inline-error">
              {error}
            </div>

          )}


          {success && (

            <div className="competition-success">
              {success}
            </div>

          )}


          <div className="competition-registration-area">


            {isRegistered ? (

              <>

                <div className="registered-message">

                  ✓ You are registered for this competition.

                </div>


                <button
                  className="registered-button"
                  onClick={() =>
                    navigate(
                      "/student/dashboard"
                    )
                  }
                >
                  Go to My Dashboard
                </button>

              </>

            ) : registrationClosed ? (

              <div className="registration-closed">

                Registration is currently closed.

              </div>

            ) : (

              <button
                className="register-button"
                onClick={
                  handleRegister
                }
                disabled={
                  registering
                }
              >

                {registering
                  ? "Opening Payment..."
                  : `Register & Pay ₹${competition.registrationFee || 0}`}

              </button>

            )}

          </div>


        </div>

      </div>

    </section>

  );
}
