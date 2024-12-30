import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
