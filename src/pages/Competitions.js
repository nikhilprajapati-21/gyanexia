import React, {
  useEffect,
  useState,
} from "react";

import "./Competitions.css";
import { API_BASE_URL } from "../services/api";

const API_URL = API_BASE_URL;

export default function Competitions() {
  /*
   * ==========================================
   * COMPETITIONS
   * ==========================================
   */

  const [competitions, setCompetitions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * ==========================================
   * REGISTRATION MODAL
   * ==========================================
   */

  const [
    selectedCompetition,
    setSelectedCompetition,
  ] = useState(null);

  const [
    parentName,
    setParentName,
  ] = useState("");

  const [
    parentMobileNumber,
    setParentMobileNumber,
  ] = useState("");

  const [
    registrationLoading,
    setRegistrationLoading,
  ] = useState(false);

  const [
    registrationError,
    setRegistrationError,
  ] = useState("");

  const [
    registrationSuccess,
    setRegistrationSuccess,
  ] = useState("");

  /*
   * ==========================================
   * REGISTRATION / PAYMENT DATA
   * ==========================================
   */

  const [
    registration,
    setRegistration,
  ] = useState(null);

  const [
    razorpayData,
    setRazorpayData,
  ] = useState(null);

  const [
    paymentLoading,
    setPaymentLoading,
  ] = useState(false);

  const [
    paymentError,
    setPaymentError,
  ] = useState("");

  const [
    paymentSuccess,
    setPaymentSuccess,
  ] = useState(false);

  /*
   * ==========================================
   * FETCH COMPETITIONS
   * ==========================================
   */

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/competitions`,
            {
              method: "GET",
              credentials: "include",

              headers: {
                "Content-Type":
                  "application/json",
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load competitions."
          );
        }

        let competitionData = [];

        if (
          Array.isArray(
            data?.competitions
          )
        ) {
          competitionData =
            data.competitions;
        } else if (
          Array.isArray(data)
        ) {
          competitionData = data;
        } else if (
          data?.competition
        ) {
          competitionData = [
            data.competition,
          ];
        }

        setCompetitions(
          competitionData
        );
      } catch (error) {
        console.error(
          "Competition loading error:",
          error
        );

        setError(
          error?.message ||
            "Unable to load competitions."
        );
      } finally {
        setLoading(false);
      }
    };

  /*
   * ==========================================
   * FORMAT DATE
   * ==========================================
   */

  const formatDate = (date) => {
    if (!date) {
      return "To be announced";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  /*
   * ==========================================
   * OPEN REGISTRATION
   * ==========================================
   */

  const openRegistration =
    (competition) => {
      setSelectedCompetition(
        competition
      );

      setParentName("");
      setParentMobileNumber("");

      setRegistration(null);
      setRazorpayData(null);

      setRegistrationError("");
      setRegistrationSuccess("");

      setPaymentError("");
      setPaymentSuccess(false);
    };

  /*
   * ==========================================
   * CLOSE REGISTRATION
   * ==========================================
   */

  const closeRegistration =
    () => {
      if (
        registrationLoading ||
        paymentLoading
      ) {
        return;
      }

      setSelectedCompetition(null);

      setParentName("");
      setParentMobileNumber("");

      setRegistration(null);
      setRazorpayData(null);

      setRegistrationError("");
      setRegistrationSuccess("");

      setPaymentError("");
      setPaymentSuccess(false);
    };

  /*
   * ==========================================
   * SUBMIT REGISTRATION
   * ==========================================
   */

  const handleRegistration =
    async (event) => {
      event.preventDefault();

      if (!selectedCompetition) {
        return;
      }

      setRegistrationError("");
      setRegistrationSuccess("");
      setPaymentError("");
      setPaymentSuccess(false);

      /*
       * BASIC VALIDATION
       */

      if (!parentName.trim()) {
        setRegistrationError(
          "Parent/Guardian name is required."
        );

        return;
      }

      if (
        !parentMobileNumber.trim()
      ) {
        setRegistrationError(
          "Parent/Guardian mobile number is required."
        );

        return;
      }

      /*
       * CLEAN MOBILE
       */

      const cleanMobile =
        parentMobileNumber.replace(
          /\D/g,
          ""
        );

      if (
        cleanMobile.length !== 10
      ) {
        setRegistrationError(
          "Please enter a valid 10-digit mobile number."
        );

        return;
      }

      try {
        setRegistrationLoading(true);

        /*
         * ======================================
         * CREATE REGISTRATION
         * ======================================
         */

        const response =
          await fetch(
            `${API_URL}/registrations`,
            {
              method: "POST",

              credentials: "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                competitionId:
                  selectedCompetition._id,

                parentName:
                  parentName.trim(),

                parentMobileNumber:
                  cleanMobile,
              }),
            }
          );

        const data =
          await response.json();

        /*
         * ======================================
         * ERROR
         * ======================================
         */

        if (!response.ok) {
          if (
            response.status === 401
          ) {
            throw new Error(
              "Please login as a student before registering."
            );
          }

          throw new Error(
            data?.message ||
              "Unable to complete registration."
          );
        }

        /*
         * ======================================
         * SAVE REGISTRATION
         * ======================================
         */

        setRegistration(
          data?.registration ||
            null
        );

        /*
         * SAVE RAZORPAY DETAILS
         */

        setRazorpayData(
          data?.razorpay ||
            null
        );

        /*
         * SUCCESS MESSAGE
         */

        setRegistrationSuccess(
          data?.message ||
            "Registration created successfully. Please complete payment."
        );

        /*
         * CLEAR FORM
         */

        setParentName("");
        setParentMobileNumber("");
      } catch (error) {
        console.error(
          "Registration error:",
          error
        );

        setRegistrationError(
          error?.message ||
            "Unable to complete registration."
        );
      } finally {
        setRegistrationLoading(
          false
        );
      }
    };

  /*
   * ==========================================
   * PAY REGISTRATION FEE
   * ==========================================
   */

  const handlePayment = () => {
    setPaymentError("");

    /*
     * Make sure registration exists
     */

    if (!registration?._id) {
      setPaymentError(
        "Registration information is missing. Please try registering again."
      );

      return;
    }

    /*
     * Make sure Razorpay order exists
     */

    if (
      !razorpayData?.orderId
    ) {
      setPaymentError(
        "Payment order was not created. Please try again."
      );

      return;
    }

    /*
     * Check Razorpay script
     */

    if (
      typeof window.Razorpay !==
      "function"
    ) {
      setPaymentError(
        "Razorpay could not be loaded. Please refresh the page and try again."
      );

      return;
    }

    const amount =
      Number(
        razorpayData.amount
      ) ||
      Number(
        selectedCompetition?.registrationFee
      ) *
        100;

    const options = {
      key:
        razorpayData.keyId,

      amount: amount,

      currency:
        razorpayData.currency ||
        "INR",

      name: "Gyanexia",

      description:
        selectedCompetition?.name ||
        "Competition Registration",

      order_id:
        razorpayData.orderId,

      prefill: {
        name:
          registration?.name ||
          "",

        contact:
          registration?.parentMobileNumber ||
          "",
      },

      notes: {
        registrationId:
          registration?._id,

        competitionId:
          selectedCompetition?._id,
      },

      theme: {
        color: "#4f46e5",
      },

      /*
       * ======================================
       * PAYMENT SUCCESS
       * ======================================
       */

      handler: async function (
        paymentResponse
      ) {
        try {
          setPaymentLoading(
            true
          );

          setPaymentError("");

          /*
           * VERIFY PAYMENT
           */

          const verifyResponse =
            await fetch(
              `${API_URL}/registrations/verify-payment`,
              {
                method: "POST",

                credentials: "include",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  registrationId:
                    registration._id,

                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,
                }),
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
           * SAVE VERIFIED REGISTRATION
           */

          setRegistration(
            verifyData?.registration ||
              registration
          );

          /*
           * PAYMENT SUCCESS
           */

          setPaymentSuccess(
            true
          );

          setRegistrationSuccess(
            verifyData?.message ||
              "Payment successful! Your registration is confirmed."
          );

          /*
           * CLEAR PAYMENT ERROR
           */

          setPaymentError("");
        } catch (error) {
          console.error(
            "Payment verification error:",
            error
          );

          setPaymentError(
            error?.message ||
              "Payment verification failed. Please contact Gyanexia support."
          );
        } finally {
          setPaymentLoading(
            false
          );
        }
      },

      /*
       * ======================================
       * PAYMENT FAILED / CLOSED
       * ======================================
       */

      modal: {
        ondismiss: function () {
          setPaymentLoading(
            false
          );
        },
      },
    };

    try {
      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.on(
        "payment.failed",
        function (
          paymentFailure
        ) {
          console.error(
            "Razorpay payment failed:",
            paymentFailure
          );

          setPaymentError(
            paymentFailure?.error
              ?.description ||
              "Payment failed. Your registration is still pending."
          );
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Razorpay opening error:",
        error
      );

      setPaymentError(
        "Unable to open payment window. Please try again."
      );
    }
  };

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {
    return (
      <div className="competition-page">
        <div className="competition-loading-card">
          <div className="competition-spinner"></div>

          <h2>
            Loading competitions...
          </h2>

          <p>
            Please wait while we
            load the latest
            competitions.
          </p>
        </div>
      </div>
    );
  }

  /*
   * ==========================================
   * ERROR
   * ==========================================
   */

  if (error) {
    return (
      <div className="competition-page">
        <div className="competition-error-card">
          <div className="competition-error-icon">
            ⚠️
          </div>

          <h2>
            Unable to load
            competitions
          </h2>

          <p>{error}</p>

          <button
            className="competition-retry-btn"
            onClick={
              fetchCompetitions
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /*
   * ==========================================
   * EMPTY
   * ==========================================
   */

  if (
    !competitions ||
    competitions.length === 0
  ) {
    return (
      <div className="competition-page">
        <div className="competition-empty-card">
          <div className="competition-empty-icon">
            🏆
          </div>

          <h1>
            No Upcoming
            Competitions
          </h1>

          <p>
            There are no
            competitions available
            at the moment. Please
            check back soon!
          </p>
        </div>
      </div>
    );
  }

  /*
   * ==========================================
   * GRID CLASS
   * ==========================================
   */

  const gridClass =
    competitions.length === 1
      ? "competition-grid single-competition"
      : "competition-grid";

  /*
   * ==========================================
   * PAGE
   * ==========================================
   */

  return (
    <div className="competition-page">

      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <div className="competition-page-header">

        <span className="competition-eyebrow">
          GYANEXIA
        </span>

        <h1>
          Upcoming Competitions
        </h1>

        <p>
          Challenge yourself,
          showcase your talent and
          win exciting prizes!
        </p>

      </div>


      {/* ========================================
          COMPETITION GRID
      ======================================== */}

      <div className={gridClass}>

        {competitions.map(
          (
            competition,
            index
          ) => {

            /*
             * ELIGIBLE CLASSES
             */

            const classes =
              Array.isArray(
                competition.eligibleClasses
              )
                ? competition.eligibleClasses
                    .map(
                      (item) =>
                        `Class ${item}`
                    )
                    .join(", ")
                : "Class 5 – Class 12";

            /*
             * STATUS
             */

            let statusText =
              "Registration Closed";

            let statusClass =
              "closed";

            if (
              competition.status ===
                "open" &&
              competition.registrationOpen
            ) {
              statusText =
                "Registration Open";

              statusClass =
                "open";
            } else if (
              competition.status ===
              "open"
            ) {
              statusText =
                "Registration Open";

              statusClass =
                "open";
            } else if (
              competition.registrationOpen
            ) {
              statusText =
                "Registration Open";

              statusClass =
                "open";
            }

            if (
              competition.status ===
              "completed"
            ) {
              statusText =
                "Completed";

              statusClass =
                "completed";
            }

            /*
             * CARD
             */

            return (
              <div
                className="competition-card"
                key={
                  competition._id ||
                  index
                }
              >

                {/* CARD TOP */}

                <div className="competition-card-top">

                  <span
                    className={`competition-status ${statusClass}`}
                  >
                    {statusText}
                  </span>

                  <div className="competition-trophy">
                    🏆
                  </div>

                  <h2 className="competition-title">
                    {
                      competition.name
                    }
                  </h2>

                  {competition.tagline && (
                    <p className="competition-tagline">
                      {
                        competition.tagline
                      }
                    </p>
                  )}

                </div>


                {/* DESCRIPTION */}

                {competition.description && (
                  <div className="competition-description">
                    <p>
                      {
                        competition.description
                      }
                    </p>
                  </div>
                )}


                {/* DETAILS */}

                <div className="competition-details">

                  {/* CLASSES */}

                  <div className="competition-detail-item">

                    <div className="detail-icon">
                      🎯
                    </div>

                    <div className="detail-content">

                      <span>
                        Eligible Classes
                      </span>

                      <strong>
                        {classes}
                      </strong>

                    </div>

                  </div>


                  {/* MODE */}

                  <div className="competition-detail-item">

                    <div className="detail-icon">
                      📍
                    </div>

                    <div className="detail-content">

                      <span>
                        Mode
                      </span>

                      <strong>
                        {
                          competition.mode ||
                          "To be announced"
                        }
                      </strong>

                    </div>

                  </div>


                  {/* EXAM DATE */}

                  <div className="competition-detail-item">

                    <div className="detail-icon">
                      📅
                    </div>

                    <div className="detail-content">

                      <span>
                        Exam Date
                      </span>

                      <strong>
                        {formatDate(
                          competition.examDate
                        )}
                      </strong>

                    </div>

                  </div>


                  {/* TOTAL MARKS */}

                  {Number(
                    competition.totalMarks
                  ) > 0 && (
                    <div className="competition-detail-item">

                      <div className="detail-icon">
                        📝
                      </div>

                      <div className="detail-content">

                        <span>
                          Total Marks
                        </span>

                        <strong>
                          {
                            competition.totalMarks
                          }
                        </strong>

                      </div>

                    </div>
                  )}

                </div>


                {/* PRIZE */}

                {competition.prizeDetails && (
                  <div className="competition-prize">

                    <div className="prize-icon">
                      🏅
                    </div>

                    <div>

                      <span>
                        Prizes
                      </span>

                      <strong>
                        {
                          competition.prizeDetails
                        }
                      </strong>

                    </div>

                  </div>
                )}


                {/* SUBJECTS */}

                {competition.subjectsAndTopics && (
                  <div className="competition-subjects">

                    <div className="subjects-icon">
                      📚
                    </div>

                    <div>

                      <span>
                        Subjects & Topics
                      </span>

                      <p>
                        {
                          competition.subjectsAndTopics
                        }
                      </p>

                    </div>

                  </div>
                )}


                {/* REGISTRATION */}

                <div className="competition-registration">

                  {(
                    competition.registrationOpen &&
                    (
                      competition.status ===
                        "open" ||
                      competition.status ===
                        "upcoming"
                    )
                  ) ? (

                    <button
                      type="button"
                      className="notify-btn"
                      onClick={() =>
                        openRegistration(
                          competition
                        )
                      }
                    >
                      Register Now
                    </button>

                  ) : (

                    <div className="registration-closed">
                      🔒 Registration is
                      currently closed
                    </div>

                  )}

                </div>

              </div>
            );
          }
        )}

      </div>


      {/* ==========================================
          REGISTRATION MODAL
      ========================================== */}

      {selectedCompetition && (

        <div
          onClick={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              closeRegistration();
            }

          }}

          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0, 0, 0, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            padding: "20px",
            zIndex: 9999,
          }}
        >

          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "#ffffff",
              borderRadius: "20px",
              padding: "30px",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.25)",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={
                closeRegistration
              }
              disabled={
                registrationLoading ||
                paymentLoading
              }
              style={{
                position:
                  "absolute",
                right: "18px",
                top: "15px",
                border: "none",
                background:
                  "transparent",
                fontSize: "25px",
                cursor:
                  registrationLoading ||
                  paymentLoading
                    ? "not-allowed"
                    : "pointer",
                color: "#555",
              }}
            >
              ×
            </button>


            {/* HEADER */}

            <div
              style={{
                textAlign: "center",
                marginBottom:
                  "25px",
              }}
            >

              <div
                style={{
                  fontSize: "42px",
                  marginBottom:
                    "8px",
                }}
              >
                🏆
              </div>

              <h2
                style={{
                  margin:
                    "0 0 8px",
                  fontSize: "26px",
                  color:
                    "#1f2937",
                }}
              >
                Register for
              </h2>

              <h3
                style={{
                  margin: 0,
                  fontSize: "20px",
                  color:
                    "#4f46e5",
                }}
              >
                {
                  selectedCompetition.name
                }
              </h3>

            </div>


            {/* REGISTRATION FEE */}

            <div
              style={{
                background:
                  "#f5f7ff",
                borderRadius:
                  "12px",
                padding:
                  "14px 16px",
                marginBottom:
                  "22px",
                textAlign:
                  "center",
              }}
            >

              <span
                style={{
                  display: "block",
                  fontSize:
                    "13px",
                  color:
                    "#6b7280",
                  marginBottom:
                    "4px",
                }}
              >
                Registration Fee
              </span>

              <strong
                style={{
                  fontSize: "22px",
                  color:
                    "#111827",
                }}
              >
                ₹
                {Number(
                  selectedCompetition.registrationFee ||
                    0
                )}
              </strong>

            </div>


            {/* ======================================
                REGISTRATION SUCCESS
            ====================================== */}

            {registrationSuccess && (

              <div
                style={{
                  background:
                    paymentSuccess
                      ? "#ecfdf5"
                      : "#ecfdf5",
                  border:
                    "1px solid #10b981",
                  color:
                    "#047857",
                  borderRadius:
                    "10px",
                  padding:
                    "14px",
                  marginBottom:
                    "18px",
                  lineHeight:
                    "1.5",
                }}
              >

                <strong>
                  {paymentSuccess
                    ? "Payment successful! ✅"
                    : "Please pay fees to complete your registration "}
                </strong>

                <br />

                {registrationSuccess}

                {!paymentSuccess && (
                  <>
                    <br />
                    <br />

                    <small>
                      Your registration
                      has been created
                      and payment is
                      still pending.
                      Please complete
                      the payment below.
                    </small>
                  </>
                )}

                {paymentSuccess &&
                  registration?.registrationId && (
                    <>
                      <br />
                      <br />

                      <strong>
                        Registration ID:
                      </strong>

                      <br />

                      <span
                        style={{
                          fontSize:
                            "20px",
                          fontWeight:
                            "800",
                          letterSpacing:
                            "1px",
                        }}
                      >
                        {
                          registration.registrationId
                        }
                      </span>
                    </>
                  )}

              </div>
            )}


            {/* ======================================
                PAYMENT ERROR
            ====================================== */}

            {paymentError && (

              <div
                style={{
                  background:
                    "#fef2f2",
                  border:
                    "1px solid #ef4444",
                  color:
                    "#b91c1c",
                  borderRadius:
                    "10px",
                  padding:
                    "14px",
                  marginBottom:
                    "18px",
                  lineHeight:
                    "1.5",
                }}
              >
                {paymentError}
              </div>

            )}


            {/* ======================================
                REGISTRATION ERROR
            ====================================== */}

            {registrationError && (

              <div
                style={{
                  background:
                    "#fef2f2",
                  border:
                    "1px solid #ef4444",
                  color:
                    "#b91c1c",
                  borderRadius:
                    "10px",
                  padding:
                    "14px",
                  marginBottom:
                    "18px",
                  lineHeight:
                    "1.5",
                }}
              >
                {registrationError}
              </div>

            )}


            {/* ======================================
                REGISTRATION FORM
            ====================================== */}

            {!registrationSuccess && (

              <form
                onSubmit={
                  handleRegistration
                }
              >

                {/* PARENT NAME */}

                <div
                  style={{
                    marginBottom:
                      "18px",
                  }}
                >

                  <label
                    style={{
                      display:
                        "block",
                      fontWeight:
                        "600",
                      marginBottom:
                        "7px",
                      color:
                        "#374151",
                    }}
                  >
                    Parent / Guardian
                    Name
                  </label>

                  <input
                    type="text"
                    value={
                      parentName
                    }
                    onChange={(
                      event
                    ) =>
                      setParentName(
                        event.target
                          .value
                      )
                    }
                    placeholder="Enter parent/guardian name"
                    disabled={
                      registrationLoading
                    }
                    required
                    style={{
                      width:
                        "100%",
                      boxSizing:
                        "border-box",
                      padding:
                        "12px 14px",
                      border:
                        "1px solid #d1d5db",
                      borderRadius:
                        "10px",
                      fontSize:
                        "15px",
                      outline:
                        "none",
                    }}
                  />

                </div>


                {/* PARENT MOBILE */}

                <div
                  style={{
                    marginBottom:
                      "22px",
                  }}
                >

                  <label
                    style={{
                      display:
                        "block",
                      fontWeight:
                        "600",
                      marginBottom:
                        "7px",
                      color:
                        "#374151",
                    }}
                  >
                    Parent / Guardian
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    value={
                      parentMobileNumber
                    }
                    onChange={(
                      event
                    ) =>
                      setParentMobileNumber(
                        event.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(
                            0,
                            10
                          )
                      )
                    }
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                    disabled={
                      registrationLoading
                    }
                    required
                    style={{
                      width:
                        "100%",
                      boxSizing:
                        "border-box",
                      padding:
                        "12px 14px",
                      border:
                        "1px solid #d1d5db",
                      borderRadius:
                        "10px",
                      fontSize:
                        "15px",
                      outline:
                        "none",
                    }}
                  />

                </div>


                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={
                    registrationLoading
                  }
                  style={{
                    width:
                      "100%",
                    border: "none",
                    borderRadius:
                      "10px",
                    padding:
                      "13px 18px",
                    fontSize:
                      "16px",
                    fontWeight:
                      "700",
                    cursor:
                      registrationLoading
                        ? "not-allowed"
                        : "pointer",
                    background:
                      registrationLoading
                        ? "#9ca3af"
                        : "#4f46e5",
                    color:
                      "#ffffff",
                  }}
                >
                  {registrationLoading
                    ? "Creating Registration..."
                    : "Continue Registration"}
                </button>

              </form>
            )}


            {/* ======================================
                PAYMENT BUTTON
            ====================================== */}

            {registrationSuccess &&
              !paymentSuccess && (

                <div
                  style={{
                    marginBottom:
                      "12px",
                  }}
                >

                  <button
                    type="button"
                    onClick={
                      handlePayment
                    }
                    disabled={
                      paymentLoading
                    }
                    style={{
                      width:
                        "100%",
                      border: "none",
                      borderRadius:
                        "10px",
                      padding:
                        "14px 18px",
                      fontSize:
                        "17px",
                      fontWeight:
                        "800",
                      cursor:
                        paymentLoading
                          ? "not-allowed"
                          : "pointer",
                      background:
                        paymentLoading
                          ? "#9ca3af"
                          : "#16a34a",
                      color:
                        "#ffffff",
                      marginBottom:
                        "10px",
                    }}
                  >

                    {paymentLoading
                      ? "Processing Payment..."
                      : `Pay ₹${Number(
                          selectedCompetition.registrationFee ||
                            0
                        )} Fees`}

                  </button>


                  <p
                    style={{
                      textAlign:
                        "center",
                      margin:
                        "6px 0 0",
                      fontSize:
                        "13px",
                      color:
                        "#6b7280",
                    }}
                  >
                    Your registration
                    will be confirmed
                    after successful
                    payment.
                  </p>

                </div>
              )}


            {/* ======================================
                PAYMENT COMPLETED
            ====================================== */}

            {paymentSuccess && (

              <div
                style={{
                  background:
                    "#f0fdf4",
                  border:
                    "1px solid #22c55e",
                  borderRadius:
                    "10px",
                  padding:
                    "12px",
                  marginBottom:
                    "12px",
                  textAlign:
                    "center",
                  color:
                    "#166534",
                  fontWeight:
                    "600",
                }}
              >
                ✓ Payment verified
                successfully
              </div>

            )}


            {/* ======================================
                CLOSE BUTTON
            ====================================== */}

            {(registrationSuccess ||
              paymentSuccess) && (

              <button
                type="button"
                onClick={
                  closeRegistration
                }
                disabled={
                  paymentLoading
                }
                style={{
                  width:
                    "100%",
                  border: "none",
                  borderRadius:
                    "10px",
                  padding:
                    "13px 18px",
                  fontSize:
                    "16px",
                  fontWeight:
                    "700",
                  cursor:
                    paymentLoading
                      ? "not-allowed"
                      : "pointer",
                  background:
                    "#4f46e5",
                  color:
                    "#ffffff",
                }}
              >
                Close
              </button>

            )}

          </div>

        </div>

      )}

    </div>
  );
}
