import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";
import { API_BASE_URL } from "../services/api";
import {
  authApi,
  queryApi,
  competitionApi,
  resultApi,
  registrationApi,
} from "../services/api";
const API_BASE = API_BASE_URL;

const emptyCompetition = {
  name: "",
  tagline: "",
  description: "",
  eligibleClasses: [],
  mode: "Offline",
  examDate: "",
  prizeDetails: "",
  subjectsAndTopics: "",
  totalMarks: 100,
  registrationOpen: false,
  status: "upcoming",
};

const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const [activeSection, setActiveSection] =
    useState("overview");

  const [users, setUsers] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [results, setResults] = useState([]);
  const [queries, setQueries] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCompetitionForm, setShowCompetitionForm] =
    useState(false);

  const [editingCompetition, setEditingCompetition] =
    useState(null);

  const [competitionForm, setCompetitionForm] =
    useState(emptyCompetition);

  const [showResultForm, setShowResultForm] =
    useState(false);

  const [resultForm, setResultForm] = useState({
    competitionId: "",
    studentId: "",
    marks: "",
    totalMarks: "",
    remarks: "",
  });

  /*
   * ==========================================
   * API HELPER
   * ==========================================
   */

  const apiRequest = useCallback(async (
    endpoint,
    options = {}
  ) => {
    const response = await fetch(
      `${API_BASE}${endpoint}`,
      {
        credentials: "include",
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      }
    );

    const data = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Something went wrong."
      );
    }

    return data;
  }, []);

  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  /*
   * ==========================================
   * LOAD CURRENT USER
   * ==========================================
   */

  const loadCurrentUser = useCallback(async () => {
    const data = await apiRequest(
      "/auth/me"
    );

    setCurrentUser(data.user);
  }, [apiRequest]);

  /*
   * ==========================================
   * LOAD USERS
   * ==========================================
   */

  const loadUsers = useCallback(async () => {
    const data = await apiRequest(
      "/admin/users"
    );

    setUsers(data.users || []);
  }, [apiRequest]);

  /*
   * ==========================================
   * LOAD COMPETITIONS
   * ==========================================
   */

  const loadCompetitions = useCallback(async () => {
    try {
      const data = await apiRequest(
        "/competitions"
      );

      setCompetitions(
        data.competitions || []
      );
    } catch (error) {
      console.warn(
        "Competition API not available:",
        error.message
      );

      setCompetitions([]);
    }
  }, [apiRequest]);

  /*
   * ==========================================
   * LOAD RESULTS
   * ==========================================
   */

  const loadResults = useCallback(async () => {
    try {
      const data = await apiRequest(
        "/results"
      );

      setResults(data.results || []);
    } catch (error) {
      console.warn(
        "Results API not available:",
        error.message
      );

      setResults([]);
    }
  }, [apiRequest]);

  /*
 * ==========================================
 * LOAD QUERIES
 * ==========================================
 */

const loadQueries = useCallback(async () => {
  try {
    const data = await apiRequest("/queries");

    setQueries(data.queries || []);
  } catch (error) {
    console.warn(
      "Query API not available:",
      error.message
    );

    setQueries([]);
  }
}, [apiRequest]);




/*
 * ==========================================
 * LOAD COMPETITION REGISTRATIONS
 * ==========================================
 */

const loadRegistrations = useCallback(async () => {
  try {
    const data = await apiRequest(
      "/registrations/admin/all"
    );

    console.log(
      "ADMIN REGISTRATIONS:",
      data
    );

    setRegistrations(
      Array.isArray(data?.registrations)
        ? data.registrations
        : []
    );

  } catch (error) {
    console.error(
      "REGISTRATION API ERROR:",
      error
    );

    setRegistrations([]);

    setError(
      error?.message ||
        "Unable to load competition registrations."
    );
  }
}, [apiRequest]);

  /*
   * ==========================================
   * INITIAL LOAD
   * ==========================================
   */

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        clearMessages();

        await loadCurrentUser();
        await loadUsers();
        await loadCompetitions();
        await loadResults();
        await loadQueries();
        await loadRegistrations();

      } catch (error) {
        console.error(error);

        setError(
          error.message ||
            "Unable to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [
    clearMessages,
    loadCompetitions,
    loadCurrentUser,
    loadQueries,
    loadResults,
    loadUsers,
  ]);

  /*
   * ==========================================
   * REFRESH
   * ==========================================
   */

  const refreshDashboard = async () => {
    try {
      clearMessages();
      setActionLoading("refresh");

      await loadUsers();
      await loadCompetitions();
      await loadResults();
      await loadQueries();
      await loadRegistrations();

      setSuccess(
        "Dashboard refreshed successfully."
      );
    } catch (error) {
      setError(
        error.message ||
          "Unable to refresh dashboard."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
   * ==========================================
   * ROLES
   * ==========================================
   */

  const isSuperAdmin =
    currentUser?.role === "superadmin";

  /*
   * ==========================================
   * STATISTICS
   * ==========================================
   */

  const students = useMemo(
    () =>
      users.filter(
        (user) =>
          user.role === "student"
      ),
    [users]
  );

  const admins = useMemo(
    () =>
      users.filter(
        (user) =>
          user.role === "admin"
      ),
    [users]
  );

  /*
   * ==========================================
   * NAVIGATION
   * ==========================================
   */

  const navigation = [
    {
      id: "overview",
      label: "Overview",
      icon: "📊",
      roles: ["admin", "superadmin"],
    },
    {
      id: "students",
      label: "Students",
      icon: "🎓",
      roles: ["admin", "superadmin"],
    },

    {
  id: "registrations",
  label: "Registrations",
  icon: "📋",
  roles: ["admin", "superadmin"],
},
    {
  id: "queries",
  label: "Queries",
  icon: "💬",
  roles: ["admin", "superadmin"],
},
    {
      id: "competitions",
      label: "Competitions",
      icon: "🏆",
      roles: ["superadmin"],
    },
    {
      id: "results",
      label: "Results",
      icon: "📝",
      roles: ["admin", "superadmin"],
    },
    {
      id: "certificates",
      label: "Certificates",
      icon: "📜",
      roles: ["admin", "superadmin"],
    },
    {
      id: "administrators",
      label: "Administrators",
      icon: "🛡️",
      roles: ["superadmin"],
    },
  ];

  /*
   * ==========================================
   * MAKE ADMIN
   * ==========================================
   */

  const handleMakeAdmin = async (
    user
  ) => {
    if (!isSuperAdmin) return;

    const confirmed =
      window.confirm(
        `Make ${user.name} an administrator?`
      );

    if (!confirmed) return;

    try {
      clearMessages();

      setActionLoading(
        `make-admin-${user._id}`
      );

      const data =
        await apiRequest(
          `/admin/users/${user._id}/make-admin`,
          {
            method: "PATCH",
          }
        );

      setSuccess(
        data.message ||
          "User promoted to admin."
      );

      await loadUsers();
    } catch (error) {
      setError(
        error.message ||
          "Unable to promote user."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
   * ==========================================
   * REMOVE ADMIN
   * ==========================================
   */

  const handleRemoveAdmin = async (
    user
  ) => {
    if (!isSuperAdmin) return;

    const confirmed =
      window.confirm(
        `Remove admin privileges from ${user.name}?`
      );

    if (!confirmed) return;

    try {
      clearMessages();

      setActionLoading(
        `remove-admin-${user._id}`
      );

      const data =
        await apiRequest(
          `/admin/users/${user._id}/remove-admin`,
          {
            method: "PATCH",
          }
        );

      setSuccess(
        data.message ||
          "Admin privileges removed."
      );

      await loadUsers();
    } catch (error) {
      setError(
        error.message ||
          "Unable to remove admin."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
   * ==========================================
   * DELETE STUDENT
   * ==========================================
   */

  const handleDeleteStudent = async (
    user
  ) => {
    if (!isSuperAdmin) return;

    const confirmed =
      window.confirm(
        `Delete ${user.name}'s account permanently?`
      );

    if (!confirmed) return;

    try {
      clearMessages();

      setActionLoading(
        `delete-${user._id}`
      );

      const data =
        await apiRequest(
          `/admin/users/${user._id}`,
          {
            method: "DELETE",
          }
        );

      setSuccess(
        data.message ||
          "Student deleted successfully."
      );

      await loadUsers();
    } catch (error) {
      setError(
        error.message ||
          "Unable to delete student."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
   * ==========================================
   * COMPETITION FORM
   * ==========================================
   */

  const handleCompetitionChange = (
    event
  ) => {
    const {
      name,
      value,
      checked,
      type,
    } = event.target;

    setCompetitionForm(
      (previous) => ({
        ...previous,
        [name]:
          type === "checkbox"
            ? checked
            : value,
      })
    );
  };

  const handleClassToggle = (
    classValue
  ) => {
    setCompetitionForm(
      (previous) => {
        const exists =
          previous.eligibleClasses.includes(
            classValue
          );

        return {
          ...previous,
          eligibleClasses: exists
            ? previous.eligibleClasses.filter(
                (item) =>
                  item !== classValue
              )
            : [
                ...previous.eligibleClasses,
                classValue,
              ],
        };
      }
    );
  };

  const openCreateCompetition = () => {
    clearMessages();

    setEditingCompetition(null);

    setCompetitionForm({
      ...emptyCompetition,
      eligibleClasses: [],
    });

    setShowCompetitionForm(true);
  };

  const openEditCompetition = (competition) => {
  clearMessages();

  setEditingCompetition(competition);

  setCompetitionForm({
    name: competition.name || "",
    tagline: competition.tagline || "",
    description: competition.description || "",

    eligibleClasses: Array.isArray(
      competition.eligibleClasses
    )
      ? competition.eligibleClasses
      : [],

    mode: competition.mode || "Offline",

    examDate: competition.examDate || "",

    prizeDetails:
      competition.prizeDetails || "",

    subjectsAndTopics:
      competition.subjectsAndTopics || "",

    totalMarks:
      Number(competition.totalMarks) > 0
        ? Number(competition.totalMarks)
        : 100,

    registrationOpen:
      Boolean(competition.registrationOpen),

    status:
      competition.status || "upcoming",
  });

  setShowCompetitionForm(true);
};

  const closeCompetitionForm =
    () => {
      setShowCompetitionForm(false);
      setEditingCompetition(null);
      setCompetitionForm({
        ...emptyCompetition,
        eligibleClasses: [],
      });
    };

  const saveCompetition = async (event) => {
  event.preventDefault();

  if (!isSuperAdmin) return;

  try {
    clearMessages();

    setActionLoading("competition");

    if (!competitionForm.name.trim()) {
      throw new Error(
        "Competition name is required."
      );
    }

    if (
      !Array.isArray(
        competitionForm.eligibleClasses
      ) ||
      competitionForm.eligibleClasses.length === 0
    ) {
      throw new Error(
        "Select at least one eligible class."
      );
    }

    const totalMarks = Number(
      competitionForm.totalMarks
    );

    if (
      !Number.isFinite(totalMarks) ||
      totalMarks <= 0
    ) {
      throw new Error(
        "Total marks must be greater than 0."
      );
    }

    const competitionData = {
      name: competitionForm.name.trim(),

      tagline:
        competitionForm.tagline?.trim() || "",

      description:
        competitionForm.description?.trim() || "",

      eligibleClasses:
        competitionForm.eligibleClasses.map(
          (item) => String(item)
        ),

      mode:
        competitionForm.mode || "Offline",

      examDate:
        competitionForm.examDate?.trim() || "",

      prizeDetails:
        competitionForm.prizeDetails?.trim() || "",

      subjectsAndTopics:
        competitionForm.subjectsAndTopics?.trim() || "",

      totalMarks,

      registrationOpen:
        Boolean(
          competitionForm.registrationOpen
        ),

      status:
        competitionForm.status || "upcoming",
    };

    const endpoint = editingCompetition
      ? `/admin/competitions/${editingCompetition._id}`
      : "/admin/competitions";

    const method = editingCompetition
      ? "PATCH"
      : "POST";

    const data = await apiRequest(
      endpoint,
      {
        method,
        body: JSON.stringify(
          competitionData
        ),
      }
    );

    setSuccess(
      data.message ||
        "Competition saved successfully."
    );

    closeCompetitionForm();

    await loadCompetitions();

  } catch (error) {

    console.error(
      "Competition save error:",
      error
    );

    setError(
      error.message ||
        "Unable to save competition."
    );

  } finally {

    setActionLoading(null);

  }
};

  /*
   * ==========================================
   * DELETE COMPETITION
   * ==========================================
   */

  const deleteCompetition = async (
    competition
  ) => {
    if (!isSuperAdmin) return;

    const confirmed =
      window.confirm(
        `Delete "${competition.name}"?`
      );

    if (!confirmed) return;

    try {
      clearMessages();

      setActionLoading(
        `competition-delete-${competition._id}`
      );

      const data =
        await apiRequest(
          `/admin/competitions/${competition._id}`,
          {
            method: "DELETE",
          }
        );

      setSuccess(
        data.message ||
          "Competition deleted."
      );

      await loadCompetitions();
    } catch (error) {
      setError(
        error.message ||
          "Unable to delete competition."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
   * ==========================================
   * RESULT FORM
   * ==========================================
   */

  const openResultForm = () => {
    clearMessages();

    setResultForm({
      competitionId:
        competitions[0]?._id || "",
      studentId:
        students[0]?._id || "",
      marks: "",
      totalMarks: "",
      remarks: "",
    });

    setShowResultForm(true);
  };

  const closeResultForm = () => {
    setShowResultForm(false);
  };

  const handleResultChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    if (name === "competitionId") {
      const selectedCompetition =
        competitions.find(
          (competition) =>
            competition._id === value
        );

      setResultForm(
        (previous) => ({
          ...previous,
          competitionId: value,
          totalMarks:
            selectedCompetition?.totalMarks
              ? String(
                  selectedCompetition.totalMarks
                )
              : previous.totalMarks,
        })
      );

      return;
    }

    setResultForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const saveResult = async (event) => {
  event.preventDefault();

  try {
    clearMessages();
    setActionLoading("result");

    /*
     * Validate competition
     */
    if (!resultForm.competitionId) {
      throw new Error("Select a competition.");
    }

    /*
     * Validate student
     */
    if (!resultForm.studentId) {
      throw new Error("Select a student.");
    }

    /*
     * Validate marks
     */
    if (
      resultForm.marks === "" ||
      resultForm.marks === null ||
      resultForm.marks === undefined
    ) {
      throw new Error("Enter marks.");
    }

    /*
     * Validate total marks
     */
    if (
      resultForm.totalMarks === "" ||
      resultForm.totalMarks === null ||
      resultForm.totalMarks === undefined
    ) {
      throw new Error("Enter total marks.");
    }

    const marks = Number(resultForm.marks);
    const totalMarks = Number(resultForm.totalMarks);

    /*
     * Validate numeric values
     */
    if (!Number.isFinite(marks) || marks < 0) {
      throw new Error("Marks must be 0 or greater.");
    }

    if (!Number.isFinite(totalMarks) || totalMarks <= 0) {
      throw new Error(
        "Total marks must be greater than 0."
      );
    }

    /*
     * Marks cannot exceed total marks
     */
    if (marks > totalMarks) {
      throw new Error(
        "Marks cannot be greater than total marks."
      );
    }

    /*
     * Send result to backend
     *
     * IMPORTANT:
     * Backend route is:
     * /api/results
     *
     * NOT:
     * /api/admin/results
     */
    const data = await apiRequest(
      "/results",
      {
        method: "POST",
        body: JSON.stringify({
          competitionId: resultForm.competitionId,
          studentId: resultForm.studentId,
          marks,
          totalMarks,
          remarks: resultForm.remarks?.trim() || "",
        }),
      }
    );

    /*
     * Success
     */
    setSuccess(
      data.message ||
        "Marks saved successfully."
    );

    /*
     * Close modal
     */
    closeResultForm();

    /*
     * Reload results
     */
    await loadResults();

  } catch (error) {
    console.error(
      "Result save error:",
      error
    );

    setError(
      error.message ||
        "Unable to save result."
    );

  } finally {
    setActionLoading(null);
  }
};

/*
 * ==========================================
 * PUBLISH RESULTS
 * SUPERADMIN ONLY
 * ==========================================
 */

const publishCompetitionResults = async (
  competitionId,
  competitionName
) => {
  if (!isSuperAdmin) return;

  const confirmed = window.confirm(
    `Publish results for "${competitionName}"?\n\nThis will calculate ranks and make the results visible to students.`
  );

  if (!confirmed) return;

  try {
    clearMessages();

    setActionLoading(
      `publish-results-${competitionId}`
    );

    const data = await apiRequest(
      `/results/competition/${competitionId}/publish`,
      {
        method: "POST",
      }
    );

    setSuccess(
      data.message ||
        "Results published successfully."
    );

    await loadResults();
    await loadCompetitions();

  } catch (error) {
    console.error(
      "Publish results error:",
      error
    );

    setError(
      error.message ||
        "Unable to publish results."
    );

  } finally {
    setActionLoading(null);
  }
};


  /*
   * ==========================================
   * RENDER OVERVIEW
   * ==========================================
   */

  const renderOverview = () => (
    <>
      <div className="admin-stats">

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            🎓
          </div>

          <div>
            <span>Students</span>
            <strong>
              {students.length}
            </strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            🏆
          </div>

          <div>
            <span>Competitions</span>
            <strong>
              {competitions.length}
            </strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            📝
          </div>

          <div>
            <span>Results</span>
            <strong>
              {results.length}
            </strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            🛡️
          </div>

          <div>
            <span>
              {isSuperAdmin
                ? "Admins"
                : "Access"}
            </span>

            <strong>
              {isSuperAdmin
                ? admins.length
                : "Admin"}
            </strong>
          </div>
        </div>

      </div>


      <section className="admin-panel">

        <div className="admin-panel-header">
          <div>
            <p className="admin-eyebrow">
              WELCOME
            </p>

            <h2>
              Hello,{" "}
              {currentUser?.name ||
                "Administrator"}
            </h2>

            <p>
              Manage Gyanexia from your
              administration panel.
            </p>
          </div>
        </div>


        <div className="quick-actions">

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                "students"
              )
            }
          >
            <span>🎓</span>
            Manage Students
          </button>

          {isSuperAdmin && (
            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "competitions"
                )
              }
            >
              <span>🏆</span>
              Manage Competitions
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                "results"
              )
            }
          >
            <span>📝</span>
            Manage Results
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                "certificates"
              )
            }
          >
            <span>📜</span>
            Certificates
          </button>

        </div>

      </section>
    </>
  );


/*
 * ==========================================
 * REGISTRATIONS
 * ==========================================
 */

const renderRegistrations = () => (
  <section className="admin-panel">

    <div className="admin-panel-header">
      <div>
        <p className="admin-eyebrow">
          COMPETITION MANAGEMENT
        </p>

        <h2>
          Competition Registrations
        </h2>

        <p>
          View students who have successfully
          registered for competitions.
        </p>
      </div>

      <div>
        <strong>
          {registrations.length}
        </strong>

        <span>
          {" "}Registered
        </span>
      </div>
    </div>


    {registrations.length === 0 ? (
      <div className="admin-empty">

        <div
          style={{
            fontSize: "48px",
            marginBottom: "12px",
          }}
        >
          📋
        </div>

        <h3>
          No competition registrations yet.
        </h3>

        <p>
          Students who successfully complete
          competition registration will appear here.
        </p>

      </div>
    ) : (

      <div className="admin-table-wrapper">

        <table className="admin-table">

          <thead>
            <tr>
              <th>Registration ID</th>
              <th>Student</th>
              <th>Mobile</th>
              <th>Class</th>
              <th>School / Coaching</th>
              <th>Competition</th>
              <th>Parent Name</th>
              <th>Parent Mobile</th>
              <th>Payment</th>
              <th>Registered At</th>
            </tr>
          </thead>


          <tbody>

            {registrations.map(
              (registration) => (

                <tr
                  key={registration._id}
                >

                  <td>
                    <strong>
                      {registration.registrationId ||
                        "—"}
                    </strong>
                  </td>


                  <td>
                    <strong>
                      {registration.student?.name ||
                        registration.name ||
                        "Unknown"}
                    </strong>
                  </td>


                  <td>
                    {registration.student?.mobileNumber ||
                      registration.mobileNumber ||
                      "—"}
                  </td>


                  <td>
                    {registration.student?.class ||
                      registration.class ||
                      "—"}
                  </td>


                  <td>
                    {registration.student?.schoolOrCoaching ||
                      registration.schoolOrCoaching ||
                      "—"}
                  </td>


                  <td>
                    <strong>
                      {registration.competition?.name ||
                        "Unknown Competition"}
                    </strong>
                  </td>


                  <td>
                    {registration.parentName ||
                      "—"}
                  </td>


                  <td>
                    {registration.parentMobileNumber ||
                      "—"}
                  </td>


                  <td>
                    <span className="published-badge">
                      Paid
                    </span>
                  </td>


                  <td>
                    {registration.registeredAt
                      ? new Date(
                          registration.registeredAt
                        ).toLocaleString()
                      : "—"}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    )}

  </section>
);




  /*
   * ==========================================
   * STUDENTS
   * ==========================================
   */

  const renderStudents = () => (
    <section className="admin-panel">

      <div className="admin-panel-header">

        <div>
          <p className="admin-eyebrow">
            STUDENT MANAGEMENT
          </p>

          <h2>
            Students
          </h2>

          <p>
            View registered students.
          </p>
        </div>

      </div>


      {students.length === 0 ? (
        <div className="admin-empty">
          No students found.
        </div>
      ) : (
        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Class</th>
                <th>Medium</th>
                <th>School / Coaching</th>

                {isSuperAdmin && (
                  <th>Action</th>
                )}
              </tr>
            </thead>


            <tbody>

              {students.map(
                (student) => (
                  <tr
                    key={student._id}
                  >

                    <td>
                      <strong>
                        {student.name}
                      </strong>
                    </td>

                    <td>
                      {
                        student.mobileNumber
                      }
                    </td>

                    <td>
                      {student.class ||
                        "—"}
                    </td>

                    <td>
                      {student.medium ||
                        "—"}
                    </td>

                    <td>
                      {
                        student.schoolOrCoaching ||
                        "—"
                      }
                    </td>

                    {isSuperAdmin && (
                      <td>
                        <button
                          type="button"
                          className="danger-small-btn"
                          disabled={
                            actionLoading ===
                            `delete-${student._id}`
                          }
                          onClick={() =>
                            handleDeleteStudent(
                              student
                            )
                          }
                        >
                          {actionLoading ===
                          `delete-${student._id}`
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    )}

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      )}

    </section>
  );

  /*
   * ==========================================
   * COMPETITIONS
   * ==========================================
   */

  const renderCompetitions = () => (
    <section className="admin-panel">

      <div className="admin-panel-header">

        <div>
          <p className="admin-eyebrow">
            SUPERADMIN ONLY
          </p>

          <h2>
            Competitions
          </h2>

          <p>
            Create, edit and remove
            competitions.
          </p>
        </div>


        <button
          type="button"
          className="primary-btn"
          onClick={
            openCreateCompetition
          }
        >
          + Add Competition
        </button>

      </div>


      {competitions.length === 0 ? (
        <div className="admin-empty">

          <h3>
            No competitions found.
          </h3>

          <p>
            Add your first competition.
          </p>

        </div>
      ) : (
        <div className="competition-grid">

          {competitions.map(
            (competition) => (
              <article
                className="competition-card"
                key={
                  competition._id
                }
              >

                <div className="competition-card-header">

                  <span
                    className={`status-badge status-${competition.status}`}
                  >
                    {
                      competition.status
                    }
                  </span>

                  <h3>
                    {competition.name}
                  </h3>

                  <p>
                    {
                      competition.tagline ||
                      "No tagline"
                    }
                  </p>

                </div>


                <div className="competition-details">

                  <div>
                    <span>
                      Classes
                    </span>

                    <strong>
                      {(
                        competition.eligibleClasses ||
                        []
                      ).join(", ") ||
                        "—"}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Mode
                    </span>

                    <strong>
                      {
                        competition.mode
                      }
                    </strong>
                  </div>


                  <div>
                    <span>
                      Exam Date
                    </span>

                    <strong>
                      {
                        competition.examDate ||
                        "—"
                      }
                    </strong>
                  </div>


                  <div>
                    <span>
                      Registration
                    </span>

                    <strong>
                      {competition.registrationOpen
                        ? "Open"
                        : "Closed"}
                    </strong>
                  </div>

                </div>


                <div className="competition-actions">

                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() =>
                      openEditCompetition(
                        competition
                      )
                    }
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    className="danger-small-btn"
                    disabled={
                      actionLoading ===
                      `competition-delete-${competition._id}`
                    }
                    onClick={() =>
                      deleteCompetition(
                        competition
                      )
                    }
                  >
                    {actionLoading ===
                    `competition-delete-${competition._id}`
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </article>
            )
          )}

        </div>
      )}

    </section>
  );

  /*
 * ==========================================
 * RESULTS
 * ==========================================
 */

const renderResults = () => {
  const competitionGroups = {};

  results.forEach((result) => {
    const competitionId =
      result.competition?._id ||
      result.competition;

    if (!competitionId) return;

    if (!competitionGroups[competitionId]) {
      const competitionFromList =
        competitions.find(
          (competition) =>
            competition._id === competitionId
        );

      competitionGroups[competitionId] = {
        id: competitionId,

        name:
          result.competition?.name ||
          competitionFromList?.name ||
          "Unknown Competition",

        results: [],

        resultsPublished:
          Boolean(
            competitionFromList?.resultsPublished
          ),
      };
    }

    competitionGroups[
      competitionId
    ].results.push(result);
  });

  const groups = Object.values(
    competitionGroups
  );

  return (
    <section className="admin-panel">

      {/* =================================
          HEADER
      ================================= */}

      <div className="admin-panel-header">

        <div>

          <p className="admin-eyebrow">
            MARKS MANAGEMENT
          </p>

          <h2>
            Results
          </h2>

          <p>
            Add, review and publish student marks.
          </p>

        </div>


        <button
          type="button"
          className="primary-btn"
          onClick={openResultForm}
        >
          + Add Marks
        </button>

      </div>


      {/* =================================
          EMPTY STATE
      ================================= */}

      {results.length === 0 ? (

        <div className="admin-empty">

          <h3>
            No results yet.
          </h3>

          <p>
            Add marks for students
            using the button above.
          </p>

        </div>

      ) : (

        <div className="results-groups">

          {groups.map((group) => {

            const hasUnpublishedResults =
              group.results.some(
                (result) =>
                  !result.published
              );

            const isPublishing =
              actionLoading ===
              `publish-results-${group.id}`;

            return (

              <div
                className="result-competition-group"
                key={group.id}
              >

                {/* =================================
                    COMPETITION HEADER
                ================================= */}

                <div className="result-group-header">

                  <div>

                    <p className="admin-eyebrow">
                      COMPETITION
                    </p>

                    <h3>
                      {group.name}
                    </h3>

                    <p>
                      {group.results.length}{" "}
                      {group.results.length === 1
                        ? "student result"
                        : "student results"}
                    </p>

                  </div>


                  {/* =================================
                      PUBLISH BUTTON
                  ================================= */}

                  {isSuperAdmin && (

                    <div>

                      {group.resultsPublished ||
                      !hasUnpublishedResults ? (

                        <span className="published-badge">
                          ✓ Published
                        </span>

                      ) : (

                        <button
                          type="button"
                          className="publish-results-btn"
                          disabled={isPublishing}
                          onClick={() =>
                            publishCompetitionResults(
                              group.id,
                              group.name
                            )
                          }
                        >
                          {isPublishing
                            ? "Publishing..."
                            : "🚀 Publish Results"}
                        </button>

                      )}

                    </div>

                  )}

                </div>


                {/* =================================
                    RESULTS TABLE
                ================================= */}

                <div className="admin-table-wrapper">

                  <table className="admin-table">

                    <thead>

                      <tr>

                        <th>
                          Student
                        </th>

                        <th>
                          Marks
                        </th>

                        <th>
                          Rank
                        </th>

                        <th>
                          Status
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {group.results.map(
                        (result) => {

                          const marks =
                            result.marks ??
                            result.marksObtained;

                          return (

                            <tr
                              key={result._id}
                            >

                              <td>

                                <strong>
                                  {result.student?.name ||
                                    "Unknown"}
                                </strong>

                              </td>


                              <td>

                                {marks ?? "—"} /{" "}

                                {result.totalMarks ??
                                  result.competition
                                    ?.totalMarks ??
                                  "—"}

                              </td>


                              <td>

                                {result.rank
                                  ? `#${result.rank}`
                                  : "—"}

                              </td>


                              <td>

                                <span
                                  className={
                                    result.published
                                      ? "published-badge"
                                      : "draft-badge"
                                  }
                                >

                                  {result.published
                                    ? "Published"
                                    : "Draft"}

                                </span>

                              </td>

                            </tr>

                          );

                        }
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </section>
  );
};

  /*
   * ==========================================
   * ADMINISTRATORS
   * ==========================================
   */

  const renderAdministrators =
    () => (
      <section className="admin-panel">

        <div className="admin-panel-header">

          <div>
            <p className="admin-eyebrow">
              SUPERADMIN ONLY
            </p>

            <h2>
              Administrators
            </h2>

            <p>
              Control who has administrator
              access.
            </p>
          </div>

        </div>


        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>


            <tbody>

              {users.map(
                (user) => (
                  <tr
                    key={user._id}
                  >

                    <td>
                      <strong>
                        {user.name}
                      </strong>
                    </td>

                    <td>
                      {
                        user.mobileNumber
                      }
                    </td>

                    <td>
                      <span
                        className={`role-badge role-${user.role}`}
                      >
                        {
                          user.role
                        }
                      </span>
                    </td>

                    <td>

                      {user.role ===
                        "student" && (
                        <button
                          type="button"
                          className="make-admin-btn"
                          disabled={
                            actionLoading ===
                            `make-admin-${user._id}`
                          }
                          onClick={() =>
                            handleMakeAdmin(
                              user
                            )
                          }
                        >
                          {actionLoading ===
                          `make-admin-${user._id}`
                            ? "Updating..."
                            : "Make Admin"}
                        </button>
                      )}


                      {user.role ===
                        "admin" && (
                        <button
                          type="button"
                          className="remove-admin-btn"
                          disabled={
                            actionLoading ===
                            `remove-admin-${user._id}`
                          }
                          onClick={() =>
                            handleRemoveAdmin(
                              user
                            )
                          }
                        >
                          {actionLoading ===
                          `remove-admin-${user._id}`
                            ? "Updating..."
                            : "Remove Admin"}
                        </button>
                      )}


                      {user.role ===
                        "superadmin" && (
                        <span className="protected-label">
                          👑 Protected
                        </span>
                      )}

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </section>
    );


/*
 * ==========================================
 * QUERIES
 * ==========================================
 */

const renderQueries = () => (
  <section className="admin-panel">

    <div className="admin-panel-header">
      <div>
        <p className="admin-eyebrow">
          STUDENT SUPPORT
        </p>

        <h2>
          Student Queries
        </h2>

        <p>
          View and resolve queries submitted
          by students.
        </p>
      </div>

      <div>
        <strong>
          {queries.filter(
            (query) =>
              query.status === "pending"
          ).length}
        </strong>

        <span>
          {" "}Pending
        </span>
      </div>
    </div>


    {queries.length === 0 ? (

      <div className="admin-empty">

        <div
          style={{
            fontSize: "40px",
            marginBottom: "10px",
          }}
        >
          💬
        </div>

        <h3>
          No queries yet
        </h3>

        <p>
          Student support queries will
          appear here.
        </p>

      </div>

    ) : (

      <div className="admin-query-list">

        {queries.map((query) => (

          <article
            key={query._id}
            className="admin-query-card"
          >

            {/* HEADER */}

            <div className="admin-query-header">

              <div>

                <h3>
                  {query.name}
                </h3>

                <p>
                  📱 {query.phone}
                </p>

              </div>


              <span
                className={`query-status query-status-${query.status}`}
              >
                {query.status === "pending"
                  ? "Pending"
                  : query.status === "in-progress"
                  ? "In Progress"
                  : "Resolved"}
              </span>

            </div>


            {/* ADDRESS */}

            <div className="admin-query-field">

              <strong>
                Address
              </strong>

              <p>
                {query.address}
              </p>

            </div>


            {/* QUERY */}

            <div className="admin-query-field">

              <strong>
                Query
              </strong>

              <p>
                {query.message}
              </p>

            </div>


            {/* ADMIN REPLY */}

            {query.adminReply && (

              <div className="admin-query-reply">

                <strong>
                  Admin Reply
                </strong>

                <p>
                  {query.adminReply}
                </p>

              </div>

            )}


            {/* DATE */}

            <div className="admin-query-date">

              Submitted:

              {" "}

              {new Date(
                query.createdAt
              ).toLocaleString()}

            </div>


            {/* ACTIONS */}

            <div className="admin-query-actions">

              <button
                type="button"
                className="query-action-btn"
                disabled={
                  actionLoading ===
                  `query-progress-${query._id}`
                }
                onClick={async () => {

                  try {

                    clearMessages();

                    setActionLoading(
                      `query-progress-${query._id}`
                    );

                    await apiRequest(
                      `/queries/${query._id}`,
                      {
                        method: "PATCH",

                        body: JSON.stringify({
                          status:
                            "in-progress",
                        }),
                      }
                    );

                    await loadQueries();

                    setSuccess(
                      "Query marked as in progress."
                    );

                  } catch (error) {

                    setError(
                      error.message ||
                        "Unable to update query."
                    );

                  } finally {

                    setActionLoading(null);

                  }

                }}
              >
                {actionLoading ===
                `query-progress-${query._id}`
                  ? "Updating..."
                  : "Mark In Progress"}
              </button>


              <button
                type="button"
                className="query-resolve-btn"
                disabled={
                  actionLoading ===
                  `query-resolve-${query._id}`
                }
                onClick={async () => {

                  const reply =
                    window.prompt(
                      "Enter your reply to the student:",
                      query.adminReply || ""
                    );

                  if (
                    reply === null
                  ) {
                    return;
                  }

                  if (
                    !reply.trim()
                  ) {
                    alert(
                      "Please enter a reply."
                    );

                    return;
                  }

                  try {

                    clearMessages();

                    setActionLoading(
                      `query-resolve-${query._id}`
                    );

                    await apiRequest(
                      `/queries/${query._id}`,
                      {
                        method: "PATCH",

                        body: JSON.stringify({
                          status:
                            "resolved",

                          adminReply:
                            reply.trim(),
                        }),
                      }
                    );

                    await loadQueries();

                    setSuccess(
                      "Query resolved successfully."
                    );

                  } catch (error) {

                    setError(
                      error.message ||
                        "Unable to resolve query."
                    );

                  } finally {

                    setActionLoading(null);

                  }

                }}
              >
                {actionLoading ===
                `query-resolve-${query._id}`
                  ? "Resolving..."
                  : "✓ Resolve Query"}
              </button>

            </div>

          </article>

        ))}

      </div>

    )}

  </section>
);


  /*
   * ==========================================
   * CERTIFICATES
   * ==========================================
   */

  const renderCertificates =
    () => (
      <section className="admin-panel">

        <div className="admin-panel-header">

          <div>
            <p className="admin-eyebrow">
              CERTIFICATES
            </p>

            <h2>
              Certificates
            </h2>

            <p>
              Manage certificates issued
              to students.
            </p>
          </div>

        </div>


        <div className="coming-soon-panel">

          <div className="coming-soon-icon">
            📜
          </div>

          <h3>
            Certificate Management
          </h3>

          <p>
            Certificate upload will be
            connected after the certificate
            storage endpoint is finalized.
          </p>

        </div>

      </section>
    );

  /*
   * ==========================================
   * COMPETITION MODAL
   * ==========================================
   */

  const renderCompetitionModal =
    () => {
      if (!showCompetitionForm) {
        return null;
      }

      return (
        <div className="modal-overlay">

          <div className="modal-card">

            <div className="modal-header">

              <div>
                <p className="admin-eyebrow">
                  COMPETITION
                </p>

                <h2>
                  {editingCompetition
                    ? "Edit Competition"
                    : "Add Competition"}
                </h2>
              </div>


              <button
                type="button"
                className="modal-close"
                onClick={
                  closeCompetitionForm
                }
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                saveCompetition
              }
              className="admin-form"
            >

              <div className="form-group">
                <label>
                  Competition Name
                </label>

                <input
                  name="name"
                  value={
                    competitionForm.name
                  }
                  onChange={
                    handleCompetitionChange
                  }
                  placeholder="Gyanexia Talent Hunt"
                />
              </div>


              <div className="form-group">
                <label>
                  Tagline
                </label>

                <input
                  name="tagline"
                  value={
                    competitionForm.tagline
                  }
                  onChange={
                    handleCompetitionChange
                  }
                  placeholder="Competition tagline"
                />
              </div>


              <div className="form-group">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    competitionForm.description
                  }
                  onChange={
                    handleCompetitionChange
                  }
                  rows="3"
                  placeholder="Competition description"
                />
              </div>


              <div className="form-row">

                <div className="form-group">
                  <label>
                    Mode
                  </label>

                  <select
                    name="mode"
                    value={
                      competitionForm.mode
                    }
                    onChange={
                      handleCompetitionChange
                    }
                  >
                    <option value="Offline">
                      Offline
                    </option>

                    <option value="Online">
                      Online
                    </option>

                    <option value="Hybrid">
                      Hybrid
                    </option>
                  </select>
                </div>


                <div className="form-group">
                  <label>
                    Exam Date
                  </label>

                  <input
                    name="examDate"
                    value={
                      competitionForm.examDate
                    }
                    onChange={
                      handleCompetitionChange
                    }
                    placeholder="14 December 2026"
                  />
                </div>

              </div>


              <div className="form-group">

                <label>
                  Eligible Classes
                </label>

                <div className="class-chips">

                  {[
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "12",
                  ].map(
                    (classValue) => (
                      <button
                        type="button"
                        key={
                          classValue
                        }
                        className={
                          competitionForm
                            .eligibleClasses
                            .includes(
                              classValue
                            )
                            ? "class-chip active"
                            : "class-chip"
                        }
                        onClick={() =>
                          handleClassToggle(
                            classValue
                          )
                        }
                      >
                        {classValue}
                      </button>
                    )
                  )}

                </div>

              </div>


              <div className="form-group">
                <label>
                  Prize Details
                </label>

                <textarea
                  name="prizeDetails"
                  value={
                    competitionForm.prizeDetails
                  }
                  onChange={
                    handleCompetitionChange
                  }
                  rows="2"
                  placeholder="Prize details"
                />
              </div>


              <div className="form-group">
                <label>
                  Subjects & Topics
                </label>

                <textarea
                  name="subjectsAndTopics"
                  value={
                    competitionForm.subjectsAndTopics
                  }
                  onChange={
                    handleCompetitionChange
                  }
                  rows="2"
                  placeholder="Subjects and topics"
                />
              </div>


              <div className="form-group">
                <label>
                  Total Marks
                </label>

                <input
                  type="number"
                  name="totalMarks"
                  min="1"
                  step="1"
                  value={
                    competitionForm.totalMarks
                  }
                  onChange={
                    handleCompetitionChange
                  }
                  placeholder="100"
                  required
                />
              </div>


              <label className="checkbox-row">

                <input
                  type="checkbox"
                  name="registrationOpen"
                  checked={
                    competitionForm.registrationOpen
                  }
                  onChange={
                    handleCompetitionChange
                  }
                />

                Open registration

              </label>


              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={
                    closeCompetitionForm
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="primary-btn"
                  disabled={
                    actionLoading ===
                    "competition"
                  }
                >
                  {actionLoading ===
                  "competition"
                    ? "Saving..."
                    : editingCompetition
                    ? "Save Changes"
                    : "Create Competition"}
                </button>

              </div>

            </form>

          </div>

        </div>
      );
    };

  /*
   * ==========================================
   * RESULT MODAL
   * ==========================================
   */

  const renderResultModal = () => {
    if (!showResultForm) {
      return null;
    }

    return (
      <div className="modal-overlay">

        <div className="modal-card">

          <div className="modal-header">

            <div>
              <p className="admin-eyebrow">
                RESULT MANAGEMENT
              </p>

              <h2>
                Add Student Marks
              </h2>
            </div>


            <button
              type="button"
              className="modal-close"
              onClick={
                closeResultForm
              }
            >
              ×
            </button>

          </div>


          <form
            className="admin-form"
            onSubmit={saveResult}
          >

            <div className="form-group">
              <label>
                Competition
              </label>

              <select
                name="competitionId"
                value={
                  resultForm.competitionId
                }
                onChange={
                  handleResultChange
                }
              >

                <option value="">
                  Select competition
                </option>

                {competitions.map(
                  (competition) => (
                    <option
                      key={
                        competition._id
                      }
                      value={
                        competition._id
                      }
                    >
                      {
                        competition.name
                      }
                    </option>
                  )
                )}

              </select>
            </div>


            <div className="form-group">
              <label>
                Student
              </label>

              <select
                name="studentId"
                value={
                  resultForm.studentId
                }
                onChange={
                  handleResultChange
                }
              >

                <option value="">
                  Select student
                </option>

                {students.map(
                  (student) => (
                    <option
                      key={
                        student._id
                      }
                      value={
                        student._id
                      }
                    >
                      {student.name} —{" "}
                      {
                        student.mobileNumber
                      }
                    </option>
                  )
                )}

              </select>
            </div>


            <div className="form-row">

              <div className="form-group">
                <label>
                  Marks
                </label>

                <input
                  type="number"
                  min="0"
                  name="marks"
                  value={
                    resultForm.marks
                  }
                  onChange={
                    handleResultChange
                  }
                  placeholder="80"
                />
              </div>


              <div className="form-group">
                <label>
                  Total Marks
                </label>

                <input
                  type="number"
                  min="1"
                  name="totalMarks"
                  value={
                    resultForm.totalMarks
                  }
                  onChange={
                    handleResultChange
                  }
                  placeholder="100"
                />
              </div>

            </div>


            <div className="form-group">
              <label>
                Remarks
              </label>

              <textarea
                name="remarks"
                value={
                  resultForm.remarks
                }
                onChange={
                  handleResultChange
                }
                rows="3"
                placeholder="Optional remarks"
              />
            </div>


            <div className="modal-actions">

              <button
                type="button"
                className="secondary-btn"
                onClick={
                  closeResultForm
                }
              >
                Cancel
              </button>


              <button
                type="submit"
                className="primary-btn"
                disabled={
                  actionLoading ===
                  "result"
                }
              >
                {actionLoading ===
                "result"
                  ? "Saving..."
                  : "Save Marks"}
              </button>

            </div>

          </form>

        </div>

      </div>
    );
  };

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {
    return (
      <div className="admin-dashboard">

        <div className="admin-loading-page">
          <div className="admin-spinner"></div>

          <p>
            Loading admin dashboard...
          </p>
        </div>

      </div>
    );
  }

  /*
   * ==========================================
   * MAIN
   * ==========================================
   */

  return (
    <div className="admin-dashboard">

      <div className="admin-layout">

        {/* SIDEBAR */}

        <aside className="admin-sidebar">

          <div className="admin-brand">

            <div className="admin-brand-icon">
              ✦
            </div>

            <div>
              <strong>
                Gyanexia
              </strong>

              <span>
                {isSuperAdmin
                  ? "Super Admin"
                  : "Administrator"}
              </span>
            </div>

          </div>


          <nav className="admin-sidebar-nav">

            {navigation
              .filter(
                (item) =>
                  item.roles.includes(
                    currentUser?.role
                  )
              )
              .map(
                (item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={
                      activeSection ===
                      item.id
                        ? "admin-nav-item active"
                        : "admin-nav-item"
                    }
                    onClick={() => {
                      clearMessages();

                      setActiveSection(
                        item.id
                      );
                    }}
                  >
                    <span>
                      {item.icon}
                    </span>

                    {item.label}
                  </button>
                )
              )}

          </nav>


          <div className="admin-sidebar-user">

            <div className="admin-avatar">
              {currentUser?.name
                ?.charAt(0)
                ?.toUpperCase() ||
                "G"}
            </div>

            <div>
              <strong>
                {currentUser?.name}
              </strong>

              <span>
                {currentUser?.role}
              </span>
            </div>

          </div>

        </aside>


        {/* MAIN */}

        <main className="admin-main">

          <header className="admin-main-header">

            <div>

              <p className="admin-eyebrow">
                GYANEXIA ADMINISTRATION
              </p>

              <h1>
                {navigation.find(
                  (item) =>
                    item.id ===
                    activeSection
                )?.label ||
                  "Dashboard"}
              </h1>

            </div>


            <button
              type="button"
              className="admin-refresh-btn"
              onClick={
                refreshDashboard
              }
              disabled={
                actionLoading ===
                "refresh"
              }
            >
              {actionLoading ===
              "refresh"
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>

          </header>


          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}


          {success && (
            <div className="admin-success">
              {success}
            </div>
          )}


          {activeSection ===
            "overview" &&
            renderOverview()}

          {activeSection ===
            "students" &&
            renderStudents()}

          {activeSection ===
            "competitions" &&
            isSuperAdmin &&
            renderCompetitions()}

          {activeSection ===
            "results" &&
            renderResults()}

          {activeSection ===
            "certificates" &&
            renderCertificates()}
            {activeSection ===
             "queries" &&
               renderQueries()}

          {activeSection ===
            "administrators" &&
            isSuperAdmin &&
            renderAdministrators()}

        </main>

      </div>


      {renderCompetitionModal()}

      {renderResultModal()}

    </div>
  );
};

export default AdminDashboard;
