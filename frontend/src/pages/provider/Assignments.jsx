import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRequests,
  acceptRequest,
  rejectRequest,
  assignMechanic,
  setEstimate,
} from "../../features/service/serviceThunks";
import {
  selectRequestsList,
  selectListLoading,
} from "../../features/service/serviceSelectors";

export default function ProviderAssignments() {
  const dispatch = useDispatch();
  const items = useSelector(selectRequestsList);
  const loading = useSelector(selectListLoading);

  const [mechanicId, setMechanicId] = useState("");
  const [estimate, setEstimateAmount] = useState("");

  useEffect(() => {
    // server auto-scopes to provider by token
    dispatch(fetchRequests({}));
  }, [dispatch]);

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Incoming / Active Requests</h1>
      {loading && <div>Loading...</div>}

      {!loading && !items.length && (
        <div className="text-gray-500">No requests.</div>
      )}

      <div className="grid gap-3">
        {items.map((r) => (
          <div key={r.id} className="p-3 border rounded space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-medium">
                {r.breakdownType || "Service Request"}
              </div>
              <div className="text-xs px-2 py-1 rounded bg-gray-100">
                {r.status}
              </div>
            </div>
            <div className="text-sm text-gray-600">{r.description || "-"}</div>
            <div className="text-xs text-gray-500">
              lat: {r.location?.lat}, lng: {r.location?.lng}{" "}
              {r.location?.address ? `— ${r.location.address}` : ""}
            </div>

            {/* Actions by status */}
            <div className="flex flex-wrap gap-2 mt-2">
              {r.status === "NEW" && (
                <>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => dispatch(acceptRequest(r.id))}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => {
                      const reason = prompt("Reason?");
                      if (reason) dispatch(rejectRequest({ id: r.id, reason }));
                    }}
                  >
                    Reject
                  </button>
                </>
              )}

              {r.status === "PROVIDER_ACCEPTED" && (
                <div className="flex gap-2">
                  <input
                    className="input input-bordered input-sm"
                    placeholder="Mechanic ID"
                    value={mechanicId}
                    onChange={(e) => setMechanicId(e.target.value)}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      mechanicId &&
                      dispatch(assignMechanic({ id: r.id, mechanicId }))
                    }
                  >
                    Assign Mechanic
                  </button>
                </div>
              )}

              {["MECHANIC_ASSIGNED", "AWAITING_ESTIMATE_APPROVAL"].includes(
                r.status
              ) && (
                <div className="flex gap-2">
                  <input
                    className="input input-bordered input-sm"
                    placeholder="Estimate amount"
                    value={estimate}
                    onChange={(e) => setEstimateAmount(e.target.value)}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      estimate &&
                      dispatch(
                        setEstimate({ id: r.id, amount: Number(estimate) })
                      )
                    }
                  >
                    Send Estimate
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
