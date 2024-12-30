import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import axios from "axios";
// custom route component to make sure private routes work based on roles
// is used in App for UserDashboard and AdminDashboard
function RequireAuth({ children, allowedRoles }) {
  const { authState, setAuthState } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:8080/auth/check", {
          withCredentials: true,
          // using withCredentials is crutial for and request that needs to check authorization!
          // so remember to user this if needed
        });
        setAuthState({
          isAuthenticated: true,
          user: response.data.username,
          roles: response.data.roles,
        });
        setLoading(false);
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          roles: [],
        });
        setLoading(false);
      }
    };

    if (!authState.isAuthenticated) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [authState.isAuthenticated, setAuthState]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.some((role) => authState.roles.includes(role))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default RequireAuth;
