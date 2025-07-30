// src/features/provider/providerSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  getAllProviders,
  approveProvider,
  rejectProvider,
  approveGarageImage,
  rejectGarageImage,
  approveAllGarageImages,
  rejectAllGarageImages,
  approveDocument,
  rejectDocument,
} from "../provider/providerThunks";

const initialState = {
  providers: [],
  pagination: { total: 0, page: 1, pageSize: 10 },
  params: {
    search: "",
    sortBy: "createdAt",
    order: "desc",
    page: 1,
    pageSize: 10,
  },
  loading: false,
  error: null,
};

const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    clearProviderState: (state) => {
      state.providers = [];
      state.loading = false;
      state.error = null;
      state.pagination = { total: 0, page: 1, pageSize: 10 };
      state.params = {
        search: "",
        sortBy: "createdAt",
        order: "desc",
        page: 1,
        pageSize: 10,
      };
    },
    setProviderTableParams: (state, action) => {
      // Only update params if any value is actually changed
      const updates = action.payload || {};
      let isChanged = false;
      for (const key in updates) {
        if (state.params[key] !== updates[key]) {
          isChanged = true;
          break;
        }
      }
      if (isChanged) {
        state.params = { ...state.params, ...updates };
      }
      // If not changed, do nothing (avoids unnecessary API calls)
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL PROVIDERS
      .addCase(getAllProviders.pending, (state) => {
        console.log("FETCH PROVIDERS PENDING"); // <--- add this
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllProviders.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload.providers)) {
          state.providers = action.payload.providers;
        } else if (Array.isArray(action.payload)) {
          state.providers = action.payload;
        } else {
          state.providers = [];
        }
        state.pagination = action.payload.pagination || {
          total: 0,
          page: 1,
          pageSize: 10,
        };
      })
      .addCase(getAllProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch providers";
      })

      // APPROVE PROVIDER
      .addCase(approveProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveProvider.fulfilled, (state, action) => {
        state.loading = false;
        const p = state.providers.find((pr) => pr.id === action.payload.id);
        if (p) {
          p.kycStatus = "verified";
          p.rejectionReason = null;
        }
      })
      .addCase(approveProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REJECT PROVIDER + RESET ONBOARDING
      .addCase(rejectProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectProvider.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const idx = state.providers.findIndex((pr) => pr.id === updated.id);
        if (idx !== -1) {
          state.providers[idx] = updated;
        }
      })
      .addCase(rejectProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GARAGE IMAGE APPROVE/REJECT (SINGLE)
      .addCase(approveGarageImage.fulfilled, (state, action) => {
        const { providerId, imageId, status } = action.payload;
        const provider = state.providers.find((p) => p.id === providerId);
        if (provider?.Documents?.length) {
          const img = provider.Documents.find((d) => d.id === imageId);
          if (img) img.status = status;
        }
      })
      .addCase(rejectGarageImage.fulfilled, (state, action) => {
        const { providerId, imageId, status } = action.payload;
        const provider = state.providers.find((p) => p.id === providerId);
        if (provider?.Documents?.length) {
          const img = provider.Documents.find((d) => d.id === imageId);
          if (img) img.status = status;
        }
      })

      // GARAGE IMAGE APPROVE/REJECT (BULK)
      .addCase(approveAllGarageImages.fulfilled, (state, action) => {
        const { providerId } = action.payload;
        const provider = state.providers.find((p) => p.id === providerId);
        if (provider?.Documents?.length) {
          provider.Documents.forEach((d) => {
            if (d.type === "garage_image") d.status = "approved";
          });
        }
      })
      .addCase(rejectAllGarageImages.fulfilled, (state, action) => {
        const { providerId } = action.payload;
        const provider = state.providers.find((p) => p.id === providerId);
        if (provider?.Documents?.length) {
          provider.Documents.forEach((d) => {
            if (d.type === "garage_image") d.status = "rejected";
          });
        }
      })

      // KYC DOCUMENT APPROVE/REJECT (SINGLE)
      .addCase(approveDocument.fulfilled, (state, action) => {
        const { providerId, documentId, status } = action.payload;
        const provider = state.providers.find((p) => p.id === providerId);
        if (provider?.Documents?.length) {
          const doc = provider.Documents.find((d) => d.id === documentId);
          if (doc) doc.status = status;
        }
      })
      .addCase(rejectDocument.fulfilled, (state, action) => {
        const { providerId, documentId, status } = action.payload;
        const provider = state.providers.find((p) => p.id === providerId);
        if (provider?.Documents?.length) {
          const doc = provider.Documents.find((d) => d.id === documentId);
          if (doc) doc.status = status;
        }
      });
  },
});

export const { clearProviderState, setProviderTableParams } =
  providerSlice.actions;
export default providerSlice.reducer;
