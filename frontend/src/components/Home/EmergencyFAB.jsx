import { useNavigate } from "react-router-dom";

export default function EmergencyFAB() {
  const navigate = useNavigate();
  return (
    <button
      className="fixed bottom-6 right-6 rounded-full px-4 py-3 shadow-lg bg-red-600 text-white"
      onClick={() => navigate("/customer/service/create?sos=1")}
    >
      SOS
    </button>
  );
}
