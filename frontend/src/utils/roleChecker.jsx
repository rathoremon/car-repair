// src/utils/roleChecker.js - placeholder for implementation
import React from "react";

const RoleChecker = ({ userRole, allowedRoles, children }) => {
  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }
  return null;
};

export default RoleChecker;
