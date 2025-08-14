import { useEffect, useState } from "react";

export default function LocationPicker({ value, onChange }) {
  const [loc, setLoc] = useState(
    value || { lat: null, lng: null, address: "" }
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoc(value || { lat: null, lng: null, address: "" });
  }, [value]);

  const useMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const next = { ...loc, lat: latitude, lng: longitude };
        setLoc(next);
        onChange?.(next);
        setLoading(false);
      },
      () => setLoading(false),
      { enableHighAccuracy: true }
    );
  };

  const handleField = (k) => (e) => {
    const next = {
      ...loc,
      [k]:
        k === "lat" || k === "lng"
          ? parseFloat(e.target.value)
          : e.target.value,
    };
    setLoc(next);
    onChange?.(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="number"
          step="0.000001"
          value={loc.lat ?? ""}
          onChange={handleField("lat")}
          placeholder="Latitude"
          className="input input-bordered w-full"
        />
        <input
          type="number"
          step="0.000001"
          value={loc.lng ?? ""}
          onChange={handleField("lng")}
          placeholder="Longitude"
          className="input input-bordered w-full"
        />
      </div>
      <input
        type="text"
        value={loc.address || ""}
        onChange={handleField("address")}
        placeholder="Address (optional)"
        className="input input-bordered w-full"
      />
      <button
        type="button"
        onClick={useMyLocation}
        className="btn btn-outline"
        disabled={loading}
      >
        {loading ? "Detecting..." : "Use my location"}
      </button>
    </div>
  );
}
