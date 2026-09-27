import { useEffect, useState } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  authApi,
  queryApi,
  API_BASE_URL,
} from "../services/api";

import "./StudentDashboard.css";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * ==========================================
   * STATE
   * ==========================================
   */

  const [student, setStudent] = useState(null);

  const [registrations, setRegistrations] =
    useState([]);

  const [queries, setQueries] = useState([]);

  const [results, setResults] = useState([]);

  const [error, setError] = useState("");

  const [registrationError, setRegistrationError] =
    useState("");

  const [queryError, setQueryError] =
    useState("");

  const [resultsError, setResultsError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [registrationLoading, setRegistrationLoading] =
    useState(true);

  const [queryLoading, setQueryLoading] =
    useState(true);

  const [resultsLoading, setResultsLoading] =
    useState(true);


  /*
   * ==========================================
   * LOAD MY REGISTRATIONS
   * ==========================================
   */

  const loadMyRegistrations = async () => {
    try {
      setRegistrationLoading(true);
      setRegistrationError("");

      const response = await fetch(
        `${API_BASE_URL}/registrations/my`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to load your registrations."
        );
      }

      console.log(
        "My registrations:",
        data
      );

      setRegistrations(
        Array.isArray(data?.registrations)
          ? data.registrations
          : []
      );
    } catch (requestError) {
      console.error(
        "Registration loading error:",
        requestError
      );

      setRegistrationError(
        requestError.message ||
          "Unable to load your registrations."
      );
    } finally {
      setRegistrationLoading(false);
    }
  };


  /*
   * ==========================================
   * LOAD PUBLISHED RESULTS
   * ==========================================
   */

  const loadStudentResults = async () => {
    try {
      setResultsLoading(true);
      setResultsError("");

      const response = await fetch(
        `${API_BASE_URL}/results/student`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to load your results."
        );
      }

      setResults(
        Array.isArray(data?.results)
          ? data.results
          : []
      );
    } catch (requestError) {
      console.error(
        "Results loading error:",
        requestError
      );

      setResultsError(
        requestError.message ||
          "Unable to load your results."
      );
    } finally {
      setResultsLoading(false);
    }
  };


  /*
   * ==========================================
   * LOAD STUDENT QUERIES
   * ==========================================
   */

  const loadQueries = async () => {
    try {
      setQueryLoading(true);
      setQueryError("");

      const data = await queryApi.mine();

      console.log(
        "Student queries:",
        data
      );

      setQueries(
        Array.isArray(data?.queries)
          ? data.queries
          : []
      );
    } catch (requestError) {
      console.error(
        "Query loading error:",
        requestError
      );

      setQueryError(
        requestError.message ||
          "Unable to load your queries."
      );
    } finally {
      setQueryLoading(false);
    }
  };


  /*
   * ==========================================
   * LOAD STUDENT
   * ==========================================
   */

  useEffect(() => {
    let isActive = true;

    authApi
      .me()
      .then(({ user }) => {
        if (isActive) {
          setStudent(user);
        }
      })
      .catch((requestError) => {
        if (
          requestError.status === 401
        ) {
          navigate(
            "/login",
            {
              replace: true,
              state: {
                message:
                  "Please log in to access your dashboard.",
              },
            }
          );
        } else if (isActive) {
          setError(
            requestError.message ||
              "Unable to load your profile."
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [navigate]);


  /*
   * ==========================================
   * LOAD DASHBOARD DATA
   * ==========================================
   */

  useEffect(() => {
    if (!student) {
      return;
    }

    loadMyRegistrations();
    loadStudentResults();
    loadQueries();
  }, [student]);


  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (isLoading) {
    return (
      <section className="dashboard-loading">
        <div className="dashboard-loading-card">
          <div className="dashboard-spinner"></div>

          <h2>
            Loading your dashboard...
          </h2>

          <p>
            Please wait while we load your
            Gyanexia learning space.
          </p>
        </div>
      </section>
    );
  }


  /*
   * ==========================================
   * ERROR
   * ==========================================
   */

  if (error) {
    return (
      <section className="dashboard-loading">
        <div className="dashboard-error-card">
          <div className="dashboard-error-icon">
            ⚠️
          </div>

          <h2>
            Unable to load dashboard
          </h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }


  if (!student) {
    return null;
  }


  /*
   * ==========================================
   * RENDER
   * ==========================================
   */

  return (
    <section className="student-dashboard">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="dashboard-header">

        <div>
          <p className="dashboard-kicker">
            STUDENT DASHBOARD
          </p>

          <h1>
            Welcome, {student.name}
          </h1>

          <p className="dashboard-subtitle">
            Here is your Gyanexia learning space.
          </p>
        </div>

      </div>


      {/* ======================================
          NOTICE
      ====================================== */}

      {location.state?.message && (
        <p className="dashboard-notice">
          ✓ {location.state.message}
        </p>
      )}


      {/* ======================================
          PROFILE
      ====================================== */}

      <div className="student-info-card">

        <h2>
          My Profile
        </h2>

        <dl>

          <div>
            <dt>Name</dt>
            <dd>
              {student.name}
            </dd>
          </div>


          <div>
            <dt>Class</dt>
            <dd>
              Class {student.class}
            </dd>
          </div>


          <div>
            <dt>Mobile Number</dt>
            <dd>
              {student.mobileNumber}
            </dd>
          </div>


          <div>
            <dt>Medium</dt>
            <dd>
              {student.medium || "—"}
            </dd>
          </div>


          <div>
            <dt>School / Coaching</dt>
            <dd>
              {student.schoolOrCoaching || "—"}
            </dd>
          </div>

        </dl>

      </div>


      {/* ======================================
          DASHBOARD GRID
      ====================================== */}

      <div className="dashboard-grid">


        {/* ======================================
            MY COMPETITIONS
        ====================================== */}

        <article className="dashboard-card student-my-competitions-card">

          <div className="dashboard-card-icon">
            ✦
          </div>

          <h2>
            My Competitions
          </h2>

          <p className="dashboard-card-description">
            Your registered competitions will
            appear here.
          </p>


          {/* LOADING */}

          {registrationLoading && (
            <div className="dashboard-card-loading">
              <div className="small-spinner"></div>
              <span>
                Loading your registrations...
              </span>
            </div>
          )}


          {/* ERROR */}

          {!registrationLoading &&
            registrationError && (
              <div className="dashboard-inline-error">

                <p>
                  {registrationError}
                </p>

                <button
                  type="button"
                  onClick={
                    loadMyRegistrations
                  }
                >
                  Try Again
                </button>

              </div>
            )}


          {/* EMPTY */}

          {!registrationLoading &&
            !registrationError &&
            registrations.length === 0 && (
              <div className="dashboard-empty-state">

                <div className="empty-state-icon">
                  ✦
                </div>

                <h3>
                  No registrations yet
                </h3>

                <p>
                  Your registered competitions
                  will appear here.
                </p>

              </div>
            )}


          {/* REGISTERED COMPETITIONS */}

          {!registrationLoading &&
            !registrationError &&
            registrations.length > 0 && (

              <div className="student-registration-list">

                {registrations.map(
                  (registration) => {

                    const competition =
                      registration.competition;

                    const isPaid =
                      registration.paymentStatus ===
                      "paid";

                    return (

                      <div
                        className="student-registration-item"
                        key={registration._id}
                      >

                        {/* Competition Name */}

                        <div className="registration-competition-info">

                          <h3>
                            {competition?.name ||
                              "Competition"}
                          </h3>

                          {competition?.examDate && (
                            <p>
                              Exam:{" "}
                              {competition.examDate}
                            </p>
                          )}

                        </div>


                        {/* PAYMENT / REGISTRATION INFO */}

                        {isPaid ? (

                          <div className="registration-meta">

                            <span className="registered-badge">
                              <span className="registered-check">
                                ✓
                              </span>

                              Registered
                            </span>


                            {registration.registrationId && (
                              <div className="registration-id">

                                <span>
                                  Registration ID
                                </span>

                                <strong>
                                  {
                                    registration.registrationId
                                  }
                                </strong>

                              </div>
                            )}

                          </div>

                        ) : (

                          <div className="registration-meta">

                            <span className="pending-badge">
                              <span>
                                ⏳
                              </span>

                              Payment Pending
                            </span>

                          </div>

                        )}

                      </div>
                    );
                  }
                )}

              </div>
            )}

        </article>


        {/* ======================================
            MY RESULTS
        ====================================== */}

        <article className="dashboard-results-card">

          <div className="dashboard-results-icon">
            🏆
          </div>

          <div className="dashboard-results-header">

            <p className="student-section-eyebrow">
              PERFORMANCE
            </p>

            <h2>
              My Results
            </h2>

            <p>
              Your published competition results.
            </p>

          </div>


          {/* LOADING */}

          {resultsLoading && (
            <div className="student-results-message">
              <div className="small-spinner"></div>

              <p>
                Loading your results...
              </p>
            </div>
          )}


          {/* ERROR */}

          {!resultsLoading &&
            resultsError && (

              <div className="student-results-error">

                <p>
                  {resultsError}
                </p>

                <button
                  type="button"
                  onClick={
                    loadStudentResults
                  }
                >
                  Try Again
                </button>

              </div>
            )}


          {/* EMPTY */}

          {!resultsLoading &&
            !resultsError &&
            results.length === 0 && (

              <div className="student-results-message">

                <div className="student-results-empty-icon">
                  🏆
                </div>

                <h3>
                  No published results yet
                </h3>

                <p>
                  Your results will appear here
                  once they are published.
                </p>

              </div>
            )}


          {/* RESULTS */}

          {!resultsLoading &&
            !resultsError &&
            results.length > 0 && (

              <div className="student-results-list">

                {results.map(
                  (result) => (

                    <div
                      className="student-result-item"
                      key={result._id}
                    >

                      <div className="student-result-main">

                        <h3>
                          {result.competition?.name ||
                            "Competition"}
                        </h3>

                        <p>
                          Published Result
                        </p>

                      </div>


                      <div className="student-result-stat">

                        <span>
                          Marks
                        </span>

                        <strong>
                          {result.marks ?? 0}
                          {" / "}
                          {result.totalMarks ||
                            result.competition?.totalMarks ||
                            "—"}
                        </strong>

                      </div>


                      <div className="student-result-stat">

                        <span>
                          Rank
                        </span>

                        <strong>
                          {result.rank
                            ? `#${result.rank}`
                            : "—"}
                        </strong>

                      </div>


                      <span className="student-result-published">
                        ✓ Published
                      </span>

                    </div>
                  )
                )}

              </div>
            )}

        </article>


        {/* ======================================
            CERTIFICATES
        ====================================== */}

        <article className="dashboard-card">

          <div className="dashboard-card-icon">
            📜
          </div>

          <h2>
            Certificates
          </h2>

          <p className="dashboard-card-description">
            Your certificates will appear here.
          </p>

          <div className="dashboard-coming-soon">
            Coming soon
          </div>

        </article>


        {/* ======================================
            ANNOUNCEMENTS
        ====================================== */}

        <article className="dashboard-card">

          <div className="dashboard-card-icon">
            📢
          </div>

          <h2>
            Announcements
          </h2>

          <p className="dashboard-card-description">
            Important Gyanexia announcements
            will appear here.
          </p>

          <div className="dashboard-coming-soon">
            No new announcements
          </div>

        </article>


        {/* ======================================
            MY QUERIES
        ====================================== */}

        <article className="dashboard-card student-queries-card">

          <div className="dashboard-card-icon">
            💬
          </div>

          <h2>
            My Queries
          </h2>

          <p className="dashboard-card-description">
            Track your submitted queries and
            admin responses.
          </p>


          {/* LOADING */}

          {queryLoading && (
            <div className="dashboard-card-loading">

              <div className="small-spinner"></div>

              <span>
                Loading your queries...
              </span>

            </div>
          )}


          {/* ERROR */}

          {!queryLoading &&
            queryError && (
              <div className="dashboard-inline-error">

                <p>
                  {queryError}
                </p>

                <button
                  type="button"
                  onClick={loadQueries}
                >
                  Try Again
                </button>

              </div>
            )}


          {/* NO QUERIES */}

          {!queryLoading &&
            !queryError &&
            queries.length === 0 && (

              <div className="dashboard-empty-state">

                <div className="empty-state-icon">
                  💬
                </div>

                <h3>
                  No queries yet
                </h3>

                <p>
                  You have not submitted
                  any queries yet.
                </p>

              </div>
            )}


          {/* QUERIES */}

          {!queryLoading &&
            !queryError &&
            queries.length > 0 && (

              <div className="student-query-list">

                {queries.map(
                  (query) => (

                    <div
                      className="student-query-item"
                      key={query._id}
                    >

                      <div className="student-query-header">

                        <strong>
                          Your Query
                        </strong>

                        <span
                          className={`student-query-status ${
                            query.status ||
                            "pending"
                          }`}
                        >
                          {query.status ||
                            "Pending"}
                        </span>

                      </div>


                      <p className="student-query-text">

                        {query.message ||
                          query.query ||
                          "No query text available."}

                      </p>


                      {query.adminReply ? (

                        <div className="student-query-reply">

                          <strong>
                            Admin Reply
                          </strong>

                          <p>
                            {query.adminReply}
                          </p>

                        </div>

                      ) : (

                        <div className="student-query-pending">

                          <strong>
                            Admin Reply
                          </strong>

                          <p>
                            Waiting for admin
                            response...
                          </p>

                        </div>

                      )}


                      {query.createdAt && (

                        <small className="student-query-date">

                          Submitted:{" "}

                          {new Date(
                            query.createdAt
                          ).toLocaleString()}

                        </small>

                      )}

                    </div>
                  )
                )}

              </div>
            )}

        </article>

      </div>

    </section>
  );
}
