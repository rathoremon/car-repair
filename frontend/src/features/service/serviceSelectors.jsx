// src/features/service/serviceSelectors.js
import { createSelector } from "@reduxjs/toolkit";

// base slice
export const selectService = (s) => s.service;

// primitive pieces
const selectById = createSelector([selectService], (svc) => svc.byId);
const selectListIds = createSelector([selectService], (svc) => svc.list.ids);

// memoized list of request objects
export const selectRequestsList = createSelector(
  [selectListIds, selectById],
  (ids, byId) => ids.map((id) => byId[id]).filter(Boolean)
);

// factory selector for a single request
export const makeSelectRequestById = (id) =>
  createSelector([selectById], (byId) => byId[id]);

// timelines (factory)
export const makeSelectTimeline = (id) =>
  createSelector([selectService], (svc) => svc.timelines[id]?.items || []);

// loadings
export const selectListLoading = createSelector(
  [selectService],
  (svc) => svc.list.loading
);
export const selectDetailsLoading = createSelector(
  [selectService],
  (svc) => svc.details.loading
);
export const selectCreateLoading = createSelector(
  [selectService],
  (svc) => svc.create.loading
);

// optional: by status
export const makeSelectRequestsByStatus = (status) =>
  createSelector([selectRequestsList], (list) =>
    list.filter((r) => r?.status === status)
  );

/* ===== Compatibility wrappers (match your current imports) =====
   These return memoized selectors, but you should memoize the selector
   instance with useMemo(id) inside components to keep the same instance
   across renders.
*/
export const selectRequestById = (id) => makeSelectRequestById(id);
export const selectTimeline = (id) => makeSelectTimeline(id);
