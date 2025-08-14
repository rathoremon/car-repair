import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequests } from "../../features/service/serviceThunks";
import {
  selectRequestsList,
  selectListLoading,
} from "../../features/service/serviceSelectors";
import { Link } from "react-router-dom";

export default function ServiceRequests() {
  const dispatch = useDispatch();
  const items = useSelector(selectRequestsList);
  const loading = useSelector(selectListLoading);

  useEffect(() => {
    dispatch(fetchRequests({}));
  }, [dispatch]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">My Service Requests</h1>
        <Link to="/customer/service/create" className="btn btn-primary">
          New Request
        </Link>
      </div>

      {loading && <div>Loading...</div>}

      <div className="grid gap-3">
        {items.map((r) => (
          <Link
            key={r.id}
            to={`/customer/service/${r.id}`}
            className="p-3 rounded border hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {r.breakdownType || "Service Request"}
                </div>
                <div className="text-sm text-gray-500">
                  {r.description?.slice(0, 80)}
                </div>
              </div>
              <div className="text-xs px-2 py-1 rounded bg-gray-100">
                {r.status}
              </div>
            </div>
          </Link>
        ))}
        {!loading && !items.length && (
          <div className="text-gray-500">No requests yet.</div>
        )}
      </div>
    </div>
  );
}
