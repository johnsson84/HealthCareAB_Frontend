import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
// custom hook to check authentication
// if the user does not have the correct role it gets redirected to /unauthorized
// i App allowed roles are specified
export const useRequireAuth = (allowedRoles) => {
  const {
    authState: { isAuthenticated, roles },
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    } else if (
      allowedRoles &&
      !allowedRoles.some((role) => roles.includes(role))
    ) {
      navigate("/unauthorized", { replace: true });
    }
  }, [isAuthenticated, roles, allowedRoles, navigate]);

  return { isAuthenticated, roles };
};
