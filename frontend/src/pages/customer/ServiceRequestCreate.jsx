import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LocationPicker from "../../components/Service/LocationPicker.jsx";
import { createRequest } from "../../features/service/serviceThunks";
import { selectCreateLoading } from "../../features/service/serviceSelectors";

export default function ServiceRequestCreate() {
  const dispatch = useDispatch();
  const loading = useSelector(selectCreateLoading);

  const [form, setForm] = useState({
    categoryId: null,
    vehicleId: null,
    breakdownType: "",
    description: "",
    attachments: [],
    providerId: null,
    sosFlag: false,
    location: { lat: null, lng: null, address: "" },
  });

  const submit = (e) => {
    e.preventDefault();
    if (
      typeof form.location.lat !== "number" ||
      typeof form.location.lng !== "number"
    ) {
      return alert("Please set latitude & longitude");
    }
    dispatch(createRequest(form));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Create Service Request</h1>
      <form className="space-y-4" onSubmit={submit}>
        <LocationPicker
          value={form.location}
          onChange={(v) => setForm((f) => ({ ...f, location: v }))}
        />

        <input
          type="text"
          value={form.breakdownType}
          onChange={(e) =>
            setForm((f) => ({ ...f, breakdownType: e.target.value }))
          }
          placeholder="Breakdown type (e.g., flat tyre)"
          className="input input-bordered w-full"
        />

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Describe the issue"
          className="textarea textarea-bordered w-full"
          rows={4}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.sosFlag}
            onChange={(e) =>
              setForm((f) => ({ ...f, sosFlag: e.target.checked }))
            }
          />
          <span>SOS (urgent broadcast)</span>
        </label>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
