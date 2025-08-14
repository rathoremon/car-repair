// src/hooks/useRole.jsx - placeholder for implementation
// src/hooks/useRole.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";

/**
 * Canonical role strings used across the app.
 */
export const ROLES = {
  CUSTOMER: "customer",
  PROVIDER: "provider",
  MECHANIC: "mechanic",
  ADMIN: "admin",
};

/**
 * Derive a role from the auth slice robustly.
 * Priority:
 *   1) state.auth.role (explicit)
 *   2) state.auth.user.role (if present)
 *   3) infer from user sub-objects (adminUser/provider/mechanic)
 *   4) default -> "customer"
 */
function deriveRole(auth) {
  if (!auth) return ROLES.CUSTOMER;

  // 1) explicit role on slice
  if (auth.role) return auth.role;

  // 2) explicit role on user
  if (auth.user?.role) return auth.user.role;

  // 3) infer from user sub-objects
  if (auth.user?.adminUser) return ROLES.ADMIN;
  if (auth.user?.provider) return ROLES.PROVIDER;
  if (auth.user?.mechanic) return ROLES.MECHANIC;

  // 4) default
  return ROLES.CUSTOMER;
}

/**
 * Hook: returns the current user's role as a lowercase string:
 * "customer" | "provider" | "mechanic" | "admin"
 */
export function useRole() {
  const auth = useSelector((s) => s.auth);
  return useMemo(() => deriveRole(auth), [auth]);
}

/**
 * Hook: returns true if the current user's role is in `allowed`.
 * `allowed` can be a string or an array of strings.
 */
export function useHasRole(allowed) {
  const role = useRole();
  const list = Array.isArray(allowed) ? allowed : [allowed];
  return useMemo(() => list.includes(role), [list, role]);
}

/**
 * Optional helper: returns useful ids for room joins or scoping.
 * { userId, providerId, mechanicId, isAdmin }
 */
export function useIdentity() {
  const { user } = useSelector((s) => s.auth);
  return useMemo(
    () => ({
      userId: user?.id || null,
      providerId: user?.provider?.id || null,
      mechanicId: user?.mechanic?.id || null,
      isAdmin: !!user?.adminUser,
    }),
    [user]
  );
}
