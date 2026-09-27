import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authApi } from "../services/api";

const RoleRoute = ({
  children,
  allowedRoles,
}) => {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;

    authApi
      .me()
      .then(({ user }) => {
        if (!active) return;

        setUser(user);
        setStatus("authenticated");
      })
      .catch(() => {
        if (!active) return;

        setStatus("unauthenticated");
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#7654d8",
          fontWeight: 700,
        }}
      >
        Checking account...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (
      user.role === "admin" ||
      user.role === "superadmin"
    ) {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/student/dashboard"
        replace
      />
    );
  }

  return children;
};

export default RoleRoute;