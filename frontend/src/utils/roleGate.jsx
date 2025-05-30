import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function RoleGate({ allowed, children, redirect = "/login" }) {
  const role = useSelector((state) => state.auth.role);
  if (!allowed.includes(role)) {
    return <Navigate to={redirect} replace />;
  }
  return children;
}
