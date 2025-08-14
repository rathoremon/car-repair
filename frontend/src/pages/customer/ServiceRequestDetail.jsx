import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRequestById,
  approveEstimate,
  acceptRequest,
  rejectRequest,
  assignMechanic,
  setEstimate,
  updateStatus,
  fetchTimeline,
} from "../../features/service/serviceThunks";
import {
  selectRequestById,
  selectTimeline,
  selectDetailsLoading,
} from "../../features/service/serviceSelectors";
import { useParams } from "react-router-dom";
import { useRole } from "../../hooks/useRole.jsx";

export default function ServiceRequestDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const role = useRole(); // should return 'customer' | 'provider' | 'mechanic' | 'admin'
  const request = useSelector(selectRequestById(id));
  const timeline = useSelector(selectTimeline(id));
  const loading = useSelector(selectDetailsLoading);

  const [mechanicId, setMechanicId] = useState("");
  const [estimate, setEstimateAmount] = useState("");
  const [toStatus, setToStatus] = useState("EN_ROUTE");
  const [note, setNote] = useState("");

  useEffect(() => {
    dispatch(fetchRequestById(id));
    dispatch(fetchTimeline(id));
  }, [dispatch, id]);

  if (loading || !request) return <div className="p-4">Loading...</div>;

  const actions = [];
  if (role === "provider" && request.status === "NEW") {
    actions.push(
      <button
        key="accept"
        className="btn btn-success"
        onClick={() => dispatch(acceptRequest(id))}
      >
        Accept
      </button>,
      <button
        key="reject"
        className="btn btn-error"
        onClick={() => {
          const reason = prompt("Reason?");
          if (reason) dispatch(rejectRequest({ id, reason }));
        }}
      >
        Reject
      </button>
    );
  }
  if (role === "provider" && request.status === "PROVIDER_ACCEPTED") {
    actions.push(
      <div key="assign" className="flex gap-2">
        <input
          className="input input-bordered"
          placeholder="Mechanic ID"
          value={mechanicId}
          onChange={(e) => setMechanicId(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={() =>
            mechanicId && dispatch(assignMechanic({ id, mechanicId }))
          }
        >
          Assign
        </button>
      </div>
    );
  }
  if (
    role === "provider" &&
    ["MECHANIC_ASSIGNED", "AWAITING_ESTIMATE_APPROVAL"].includes(request.status)
  ) {
    actions.push(
      <div key="estimate" className="flex gap-2">
        <input
          className="input input-bordered"
          placeholder="Estimate amount"
          value={estimate}
          onChange={(e) => setEstimateAmount(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={() =>
            estimate && dispatch(setEstimate({ id, amount: Number(estimate) }))
          }
        >
          Send Estimate
        </button>
      </div>
    );
  }
  if (role === "customer" && request.status === "AWAITING_ESTIMATE_APPROVAL") {
    actions.push(
      <button
        key="approve"
        className="btn btn-primary"
        onClick={() => dispatch(approveEstimate(id))}
      >
        Approve Estimate
      </button>
    );
  }
  if (
    (role === "mechanic" || role === "admin") &&
    ["ESTIMATE_APPROVED", "EN_ROUTE", "IN_PROGRESS"].includes(request.status)
  ) {
    actions.push(
      <div key="status" className="flex gap-2">
        <select
          className="select select-bordered"
          value={toStatus}
          onChange={(e) => setToStatus(e.target.value)}
        >
          <option value="EN_ROUTE">EN_ROUTE</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
        <button
          className="btn btn-primary"
          onClick={() => dispatch(updateStatus({ id, toStatus }))}
        >
          Update
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Request Detail</h1>
        <span className="text-xs px-2 py-1 rounded bg-gray-100">
          {request.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="p-3 border rounded">
            <div className="font-medium mb-1">
              {request.breakdownType || "Service Request"}
            </div>
            <div className="text-sm text-gray-600">
              {request.description || "-"}
            </div>
          </div>

          <div className="p-3 border rounded">
            <div className="font-medium mb-1">Location</div>
            <div className="text-sm text-gray-600">
              lat: {request.location?.lat}, lng: {request.location?.lng}
              <br />
              {request.location?.address}
            </div>
          </div>

          <div className="p-3 border rounded">
            <div className="font-medium mb-1">Estimate</div>
            <div className="text-sm text-gray-600">
              {request.estimateAmount ? `₹ ${request.estimateAmount}` : "—"}
              {request.estimateApprovedAt && (
                <div className="text-xs text-green-600">Approved</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">{actions}</div>

          <div className="p-3 border rounded">
            <div className="font-medium mb-2">Add Note</div>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Internal note or comment"
            />
            {/* For brevity: note submit via fetchTimeline not included; you can wire addNote same way */}
          </div>
        </div>
      </div>

      <div className="p-3 border rounded">
        <div className="font-medium mb-2">Timeline</div>
        <ol className="space-y-2">
          {timeline.map((t) => (
            <li key={t.id} className="text-sm">
              <span className="font-mono text-xs text-gray-400">
                {new Date(t.createdAt).toLocaleString()}
              </span>{" "}
              <span className="font-semibold">{t.event}</span>{" "}
              {t.note && <span className="text-gray-600">— {t.note}</span>}
            </li>
          ))}
          {!timeline.length && (
            <div className="text-gray-500 text-sm">No timeline entries.</div>
          )}
        </ol>
      </div>
    </div>
  );
}
