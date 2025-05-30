import React from "react";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import Login from "../../components/auth/Login";
import Register from "../../components/auth/Register.jsx";
import {
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineChatAlt2,
  HiOutlineBell,
  HiOutlineCog,
} from "react-icons/hi";

const features = [
  {
    icon: <HiOutlineShieldCheck className="text-green-300 text-lg" />,
    title: "Verified Providers",
    desc: "All mechanics are background-checked and rated by customers.",
  },
  {
    icon: <HiOutlineLightningBolt className="text-yellow-200 text-lg" />,
    title: "Instant Booking",
    desc: "Book repairs and services in just a few taps.",
  },
  {
    icon: <HiOutlineChatAlt2 className="text-blue-200 text-lg" />,
    title: "24/7 Live Chat",
    desc: "Get help anytime with our dedicated support team.",
  },
  {
    icon: <HiOutlineBell className="text-pink-200 text-lg" />,
    title: "Smart Reminders",
    desc: "Never miss a service with intelligent notifications.",
  },
  {
    icon: <HiOutlineCog className="text-indigo-200 text-lg" />,
    title: "Personalized Dashboard",
    desc: "Track your orders, history, and manage your vehicles.",
  },
];

export default function AuthPage({ mode }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine mode from prop or path
  const currentMode =
    mode || (location.pathname === "/register" ? "register" : "login");

  // Switch handler navigates to the other route
  const handleSwitch = () => {
    if (currentMode === "login") {
      navigate("/register");
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative font-sans"
      style={{
        background: `linear-gradient(120deg, ${theme.palette.background.default} 0%, #fff 100%)`,
      }}
    >
      {/* Decorative background */}
      <div
        className="absolute -top-32 -left-32 w-32 sm:w-40 md:w-52 h-32 sm:h-40 md:h-52 rounded-full blur-3xl opacity-30 animate-pulse z-0"
        style={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.light})`,
        }}
      ></div>
      <div
        className="absolute bottom-0 right-0 w-20 sm:w-28 md:w-36 h-20 sm:h-28 md:h-36 rounded-full blur-2xl opacity-20 animate-pulse z-0"
        style={{
          background: `linear-gradient(135deg, ${theme.palette.secondary.light}, ${theme.palette.primary.light}, #bae6fd)`,
        }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-36 sm:w-56 md:w-80 h-36 sm:h-56 md:h-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[30px] sm:blur-[50px] opacity-30 pointer-events-none z-0"
        style={{
          background: `linear-gradient(135deg, ${theme.palette.primary.light}, #fff, ${theme.palette.secondary.light})`,
        }}
      ></div>
      <div className="absolute left-1/3 top-1/4 w-2 h-2 bg-yellow-300 rounded-full opacity-70 animate-sparkle"></div>
      <div className="absolute right-1/4 bottom-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-60 animate-sparkle2"></div>
      <div className="absolute right-1/2 top-1/5 w-1 h-1 bg-blue-400 rounded-full opacity-50 animate-sparkle3"></div>

      <main className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-3xl mx-auto shadow-2xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-lg flex flex-col md:flex-row">
        {/* Feature Panel */}
        <aside
          className="hidden md:flex flex-col justify-between items-start px-6 py-8 text-white w-1/2 min-w-[180px] max-w-[320px] relative overflow-hidden animate-fadeInLeft"
          style={{
            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
          }}
        >
          <div>
            <h2 className="text-xl font-extrabold mb-3 drop-shadow-lg flex items-center gap-2">
              <svg
                width="26"
                height="26"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#fff"
                  d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Zm0 9.5A2.5 2.5 0 1 0 12 6a2.5 2.5 0 0 0 0 5.5Z"
                />
              </svg>
              <span className="tracking-wide">Trasure</span>
            </h2>
            <p className="text-xs md:text-sm font-medium opacity-90 mb-4">
              Your one-stop marketplace for car repair and maintenance.
            </p>
            <ul
              className="grid grid-cols-1 gap-2 mt-2"
              aria-label="Feature list"
            >
              {features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 bg-white/10 rounded-lg px-2 py-2 shadow-sm animate-fadeIn"
                  style={{ animationDelay: `${0.2 + i * 0.12}s` }}
                >
                  <span aria-hidden="true">{f.icon}</span>
                  <div>
                    <div className="font-bold text-xs md:text-sm">
                      {f.title}
                    </div>
                    <div className="text-xs opacity-90">{f.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 text-xs text-gray-400 text-center">
            <span>
              &copy; {new Date().getFullYear()} Trasure. All rights reserved.
            </span>
          </div>
          <div className="absolute bottom-3 right-3 opacity-20 animate-[carMove_4s_ease-in-out_infinite_alternate] text-4xl md:text-5xl pointer-events-none select-none">
            <svg
              width="36"
              height="36"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#fff"
                d="M3 13.5V11a2 2 0 0 1 2-2h1.2l1.6-4A2 2 0 0 1 9.6 3h4.8a2 2 0 0 1 1.8 1l1.6 4H19a2 2 0 0 1 2 2v2.5a2.5 2.5 0 0 1-2.5 2.5H5.5A2.5 2.5 0 0 1 3 13.5Zm2.5 3.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
              />
            </svg>
          </div>
        </aside>
        {/* Auth Forms */}
        <section
          className="flex-1 flex flex-col justify-center items-center py-8 bg-white animate-fadeInRight"
          style={{
            minHeight: "95vh",
            height: "95vh",
            overflow: "visible",
          }}
        >
          {currentMode === "login" ? (
            <Login onSwitch={handleSwitch} />
          ) : (
            <Register onSwitch={handleSwitch} />
          )}
        </section>
      </main>
      {/* Animations */}
      <style>{`
        @keyframes carMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(14px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px);}
          to { opacity: 1; transform: none;}
        }
        .animate-fadeInLeft {
          animation: fadeInLeft 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-14px);}
          to { opacity: 1; transform: none;}
        }
        .animate-fadeInRight {
          animation: fadeInRight 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(14px);}
          to { opacity: 1; transform: none;}
        }
        .animate-bounce-x {
          animation: bounceX 1.2s infinite alternate cubic-bezier(.4,0,.2,1);
        }
        @keyframes bounceX {
          from { transform: translateX(0);}
          to { transform: translateX(4px);}
        }
        .animate-sparkle {
          animation: sparkle 2.2s infinite alternate;
        }
        @keyframes sparkle {
          0% { opacity: 0.7; transform: scale(1) translateY(0);}
          100% { opacity: 1; transform: scale(1.15) translateY(-6px);}
        }
        .animate-sparkle2 {
          animation: sparkle2 2.8s infinite alternate;
        }
        @keyframes sparkle2 {
          0% { opacity: 0.6; transform: scale(1) translateY(0);}
          100% { opacity: 1; transform: scale(1.08) translateY(4px);}
        }
        .animate-sparkle3 {
          animation: sparkle3 3.1s infinite alternate;
        }
        @keyframes sparkle3 {
          0% { opacity: 0.5; transform: scale(1) translateY(0);}
          100% { opacity: 1; transform: scale(1.05) translateY(-3px);}
        }
      `}</style>
    </div>
  );
}
