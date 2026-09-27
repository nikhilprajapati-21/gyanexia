import React, { useEffect, useState } from "react";
import { queryApi } from "../services/api";
import "./AdminQueries.css";

export default function AdminQueries() {

  const [queries, setQueries] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedQuery, setSelectedQuery] =
    useState(null);

  const [status, setStatus] =
    useState("pending");

  const [adminReply, setAdminReply] =
    useState("");

  const [saving, setSaving] =
    useState(false);


  /*
   * ==========================================
   * LOAD QUERIES
   * ==========================================
   */

  const loadQueries = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await queryApi.getAll();

      setQueries(
        data.queries || []
      );

    } catch (requestError) {

      console.error(
        "Error loading queries:",
        requestError
      );

      setError(
        requestError.message ||
        "Unable to load queries."
      );

    } finally {

      setLoading(false);

    }
  };


  /*
   * ==========================================
   * INITIAL LOAD
   * ==========================================
   */

  useEffect(() => {

    loadQueries();

  }, []);


  /*
   * ==========================================
   * OPEN QUERY
   * ==========================================
   */

  const openQuery = (query) => {

    setSelectedQuery(query);

    setStatus(
      query.status || "pending"
    );

    setAdminReply(
      query.adminReply || ""
    );

    setError("");

  };


  /*
   * ==========================================
   * CLOSE QUERY
   * ==========================================
   */

  const closeQuery = () => {

    setSelectedQuery(null);

    setStatus("pending");

    setAdminReply("");

    setError("");

  };


  /*
   * ==========================================
   * UPDATE QUERY
   * ==========================================
   */

  const handleUpdate = async () => {

    if (!selectedQuery) {
      return;
    }

    try {

      setSaving(true);
      setError("");

      const data =
        await queryApi.update(
          selectedQuery._id,
          {
            status,
            adminReply,
          }
        );

      /*
       * Update query in local list
       */

      setQueries((previousQueries) =>
        previousQueries.map((query) =>
          query._id === selectedQuery._id
            ? data.query
            : query
        )
      );

      /*
       * Update selected query
       */

      setSelectedQuery(data.query);

      alert(
        "Query updated successfully."
      );

    } catch (requestError) {

      console.error(
        "Update query error:",
        requestError
      );

      setError(
        requestError.message ||
        "Unable to update query."
      );

    } finally {

      setSaving(false);

    }
  };


  /*
   * ==========================================
   * DELETE QUERY
   * ==========================================
   */

  const handleDelete = async () => {

    if (!selectedQuery) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this query?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setSaving(true);
      setError("");

      await queryApi.delete(
        selectedQuery._id
      );

      setQueries((previousQueries) =>
        previousQueries.filter(
          (query) =>
            query._id !== selectedQuery._id
        )
      );

      closeQuery();

      alert(
        "Query deleted successfully."
      );

    } catch (requestError) {

      console.error(
        "Delete query error:",
        requestError
      );

      setError(
        requestError.message ||
        "Unable to delete query."
      );

    } finally {

      setSaving(false);

    }
  };


  /*
   * ==========================================
   * STATUS COUNTS
   * ==========================================
   */

  const pendingCount =
    queries.filter(
      (query) =>
        query.status === "pending"
    ).length;

  const inProgressCount =
    queries.filter(
      (query) =>
        query.status === "in-progress"
    ).length;

  const resolvedCount =
    queries.filter(
      (query) =>
        query.status === "resolved"
    ).length;


  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {

    return (
      <div className="admin-queries-page">

        <div className="admin-queries-loading">

          Loading queries...

        </div>

      </div>
    );

  }


  /*
   * ==========================================
   * PAGE
   * ==========================================
   */

  return (

    <div className="admin-queries-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="admin-queries-header">

        <div>

          <p className="admin-queries-eyebrow">
            GYANEXIA ADMINISTRATION
          </p>

          <h1>
            Queries
          </h1>

          <p className="admin-queries-subtitle">
            Manage student and visitor queries
            submitted through the Gyanexia website.
          </p>

        </div>


        <button
          className="queries-refresh-button"
          onClick={loadQueries}
        >
          ↻ Refresh
        </button>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="queries-error">
          {error}
        </div>
      )}


      {/* ======================================
          STATISTICS
      ====================================== */}

      <div className="query-statistics">

        <div className="query-stat-card">

          <div className="query-stat-icon">
            💬
          </div>

          <div>
            <span>
              Total Queries
            </span>

            <strong>
              {queries.length}
            </strong>
          </div>

        </div>


        <div className="query-stat-card pending-card">

          <div className="query-stat-icon">
            ⏳
          </div>

          <div>
            <span>
              Pending
            </span>

            <strong>
              {pendingCount}
            </strong>
          </div>

        </div>


        <div className="query-stat-card progress-card">

          <div className="query-stat-icon">
            🔄
          </div>

          <div>
            <span>
              In Progress
            </span>

            <strong>
              {inProgressCount}
            </strong>
          </div>

        </div>


        <div className="query-stat-card resolved-card">

          <div className="query-stat-icon">
            ✓
          </div>

          <div>
            <span>
              Resolved
            </span>

            <strong>
              {resolvedCount}
            </strong>
          </div>

        </div>

      </div>


      {/* ======================================
          QUERY LIST
      ====================================== */}

      <div className="queries-card">

        <div className="queries-card-header">

          <div>

            <h2>
              All Queries
            </h2>

            <p>
              Latest queries appear first.
            </p>

          </div>

        </div>


        {queries.length === 0 ? (

          <div className="no-queries">

            <div className="no-queries-icon">
              💬
            </div>

            <h3>
              No queries yet
            </h3>

            <p>
              Queries submitted from the
              Contact Us page will appear here.
            </p>

          </div>

        ) : (

          <div className="queries-list">

            {queries.map((query) => (

              <div
                className="query-row"
                key={query._id}
              >

                {/* NAME */}

                <div className="query-person">

                  <div className="query-avatar">
                    {query.name
                      ?.charAt(0)
                      ?.toUpperCase() || "?"}
                  </div>

                  <div>

                    <strong>
                      {query.name}
                    </strong>

                    <span>
                      {query.phone}
                    </span>

                  </div>

                </div>


                {/* MESSAGE */}

                <div className="query-message">

                  <strong>
                    {query.message}
                  </strong>

                  <span>
                    {query.address}
                  </span>

                </div>


                {/* STATUS */}

                <div>

                  <span
                    className={`query-status status-${query.status}`}
                  >
                    {query.status ===
                    "in-progress"
                      ? "In Progress"
                      : query.status
                          ?.charAt(0)
                          ?.toUpperCase() +
                        query.status?.slice(1)}
                  </span>

                </div>


                {/* DATE */}

                <div className="query-date">

                  {query.createdAt
                    ? new Date(
                        query.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "-"}

                </div>


                {/* ACTION */}

                <button
                  className="view-query-button"
                  onClick={() =>
                    openQuery(query)
                  }
                >
                  View
                </button>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* ======================================
          QUERY DETAILS MODAL
      ====================================== */}

      {selectedQuery && (

        <div
          className="query-modal-overlay"
          onClick={closeQuery}
        >

          <div
            className="query-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="query-modal-header">

              <div>

                <p>
                  QUERY DETAILS
                </p>

                <h2>
                  {selectedQuery.name}
                </h2>

              </div>

              <button
                className="query-close-button"
                onClick={closeQuery}
              >
                ×
              </button>

            </div>


            {/* BASIC DETAILS */}

            <div className="query-details-grid">

              <div>

                <span>
                  Name
                </span>

                <strong>
                  {selectedQuery.name}
                </strong>

              </div>


              <div>

                <span>
                  Phone
                </span>

                <strong>
                  {selectedQuery.phone}
                </strong>

              </div>


              <div>

                <span>
                  Address
                </span>

                <strong>
                  {selectedQuery.address}
                </strong>

              </div>


              <div>

                <span>
                  Submitted
                </span>

                <strong>

                  {selectedQuery.createdAt
                    ? new Date(
                        selectedQuery.createdAt
                      ).toLocaleString(
                        "en-IN"
                      )
                    : "-"}

                </strong>

              </div>

            </div>


            {/* QUERY */}

            <div className="query-content-section">

              <h3>
                Query / Message
              </h3>

              <div className="query-message-box">
                {selectedQuery.message}
              </div>

            </div>


            {/* ADMIN REPLY */}

            <div className="query-content-section">

              <h3>
                Admin Reply
              </h3>

              <textarea
                className="admin-reply-input"
                value={adminReply}
                onChange={(event) =>
                  setAdminReply(
                    event.target.value
                  )
                }
                placeholder="Write a reply or resolution note..."
                rows="5"
              />

            </div>


            {/* STATUS */}

            <div className="query-content-section">

              <h3>
                Query Status
              </h3>

              <select
                className="query-status-select"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
              >

                <option value="pending">
                  Pending
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="resolved">
                  Resolved
                </option>

              </select>

            </div>


            {/* ACTIONS */}

            <div className="query-modal-actions">

              <button
                className="query-cancel-button"
                onClick={closeQuery}
                disabled={saving}
              >
                Cancel
              </button>


              <button
                className="query-save-button"
                onClick={handleUpdate}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>


              <button
                className="query-delete-button"
                onClick={handleDelete}
                disabled={saving}
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}