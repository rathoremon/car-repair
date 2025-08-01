import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
export function RoleGate({ allowed, children, redirect = "/login" }) {
  const { activeRole, hydrated } = useSelector((state) => state.auth);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress size={50} />
      </div>
    );
  } // Or show loading spinner
  if (!allowed.includes(activeRole)) {
    return <Navigate to={redirect} replace />;
  }

  return children;
}
