import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import "./StudentDashboard.css";

const dashboardItems = [
  "My Competitions",
  "Upcoming Competitions",
  "My Results",
  "Certificates",
  "Announcements",
  "My Queries",
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
        if (requestError.status === 401) {
          navigate("/login", {
            replace: true,
            state: {
              message: "Please log in to access your dashboard.",
            },
          });
        } else if (isActive) {
          setError(requestError.message);
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

  if (isLoading) {
    return (
      <section className="dashboard-loading">
        Loading your student dashboard…
      </section>
    );
  }

  if (error) {
    return (
      <section className="dashboard-loading">
        {error}
      </section>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <section className="student-dashboard">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-kicker">STUDENT DASHBOARD</p>

          <h1>Welcome, {student.name}</h1>

          <p>Here is your Gyanexia learning space.</p>
        </div>
      </div>

      {location.state?.message && (
        <p className="dashboard-notice">
          {location.state.message}
        </p>
      )}

      <div className="student-info-card">
        <h2>My Profile</h2>

        <dl>
          <div>
            <dt>Name</dt>
            <dd>{student.name}</dd>
          </div>

          <div>
            <dt>Class</dt>
            <dd>Class {student.class}</dd>
          </div>

          <div>
            <dt>Mobile Number</dt>
            <dd>{student.mobileNumber}</dd>
          </div>

          <div>
            <dt>Medium</dt>
            <dd>{student.medium}</dd>
          </div>

          <div>
            <dt>School / Coaching</dt>
            <dd>{student.schoolOrCoaching}</dd>
          </div>
        </dl>
      </div>

      <div className="dashboard-grid">
        {dashboardItems.map((item) => (
          <article className="dashboard-placeholder" key={item}>
            <span>✦</span>
            <h2>{item}</h2>
            <p>Coming soon—your updates will appear here.</p>
          </article>
        ))}
      </div>
    </section>
  );
}