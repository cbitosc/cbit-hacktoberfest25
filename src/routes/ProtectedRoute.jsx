// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to sign-in if no user
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Allow access if signed in
  return children;
}
