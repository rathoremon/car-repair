import { createTheme, responsiveFontSizes } from "@mui/material/styles";
// Color palettes
const paletteLight = {
  mode: "light",
  primary: {
    main: "#6366f1", // indigo-500
    light: "#a5b4fc", // indigo-300
    dark: "#3730a3", // indigo-800
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#60a5fa", // blue-400
    light: "#93c5fd", // blue-300
    dark: "#1e40af", // blue-800
    contrastText: "#FFFFFF",
  },
  accent: {
    main: "#F59E0B",
    contrastText: "#fff",
  },
  platinum: {
    main: "#A3A3A3",
    contrastText: "#fff",
  },
  success: {
    main: "#22c55e", // green-500
    contrastText: "#fff",
  },
  warning: {
    main: "#facc15", // yellow-400
    contrastText: "#fff",
  },
  error: {
    main: "#ef4444", // red-500
    contrastText: "#fff",
  },
  info: {
    main: "#38bdf8", // sky-400
    contrastText: "#fff",
  },
  background: {
    default: "#f0f4ff", // matches your bg
    paper: "#FFFFFF",
  },
  text: {
    primary: "#1e293b", // slate-800
    secondary: "#64748b", // slate-500
    disabled: "#94A3B8",
  },
  divider: "#E2E8F0",
  custom: {
    sidebarBg: "#F1F5F9",
    footerText: "#475569",
  },
};

const paletteDark = {
  mode: "dark",
  primary: {
    main: "#6366f1",
    light: "#a5b4fc",
    dark: "#3730a3",
    contrastText: "#fff",
  },
  secondary: {
    main: "#60a5fa",
    light: "#93c5fd",
    dark: "#1e40af",
    contrastText: "#fff",
  },
  accent: {
    main: "#F59E0B",
    contrastText: "#fff",
  },
  platinum: {
    main: "#A3A3A3",
    contrastText: "#fff",
  },
  success: {
    main: "#22c55e",
    contrastText: "#fff",
  },
  warning: {
    main: "#facc15",
    contrastText: "#fff",
  },
  error: {
    main: "#ef4444",
    contrastText: "#fff",
  },
  info: {
    main: "#38bdf8",
    contrastText: "#fff",
  },
  background: {
    default: "#1E293B",
    paper: "#111827",
  },
  text: {
    primary: "#F9FAFB",
    secondary: "#CBD5E1",
    disabled: "#64748B",
  },
  divider: "#334155",
  custom: {
    sidebarBg: "#0F172A",
    footerText: "#CBD5E1",
  },
};

// Typography scale
const typography = {
  fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: { fontWeight: 700, fontSize: "2.5rem", lineHeight: 1.2 },
  h2: { fontWeight: 700, fontSize: "2rem", lineHeight: 1.2 },
  h3: { fontWeight: 600, fontSize: "1.75rem", lineHeight: 1.2 },
  h4: { fontWeight: 600, fontSize: "1.5rem", lineHeight: 1.2 },
  h5: { fontWeight: 500, fontSize: "1.25rem", lineHeight: 1.2 },
  h6: { fontWeight: 500, fontSize: "1rem", lineHeight: 1.2 },
  body1: { fontSize: "1rem", lineHeight: 1.6 },
  body2: { fontSize: "0.875rem", lineHeight: 1.4 },
  subtitle1: { fontSize: "1rem", fontWeight: 500 },
  subtitle2: { fontSize: "0.875rem", fontWeight: 500 },
  button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.01em" },
  caption: { fontSize: "0.75rem", color: "#94A3B8" },
  overline: { fontSize: "0.75rem", fontWeight: 500, letterSpacing: 1 },
};

// Spacing scale
const spacing = 8; // 8px grid

// Breakpoints
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1536,
  },
};

// Shadows
const shadows = [
  "none",
  "0px 1px 4px rgba(0,0,0,0.04)",
  "0px 2px 12px rgba(0,0,0,0.08)",
  "0px 4px 24px rgba(0,0,0,0.12)",
  "0px 4px 20px rgba(0,0,0,0.06)",
  ...Array(20).fill("0px 4px 20px rgba(0,0,0,0.06)"),
];

// Border radii
const shape = {
  borderRadius: 12,
  borderRadiusSm: 4,
  borderRadiusMd: 8,
  borderRadiusLg: 16,
  borderRadiusXl: 20,
  round: "50%",
};

// Transitions
const transitions = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    easeInOut: "cubic-bezier(0.4,0,0.2,1)",
    easeOut: "cubic-bezier(0.0,0,0.2,1)",
    easeIn: "cubic-bezier(0.4,0,1,1)",
    sharp: "cubic-bezier(0.4,0,0.6,1)",
  },
};

// Z-Indices
const zIndex = {
  hide: -1,
  auto: "auto",
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

// Component overrides
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 9999, // pill shape for tabs/buttons
        fontWeight: 600,
        letterSpacing: "0.01em",
        transition:
          transitions.duration.short + "ms " + transitions.easing.easeInOut,
      },
      containedPrimary: {
        background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
        color: "#fff",
        "&:hover": {
          background: "linear-gradient(90deg, #3730a3 0%, #1e40af 100%)",
        },
      },
      containedSecondary: {
        backgroundColor: paletteLight.secondary.main,
        "&:hover": {
          backgroundColor: paletteLight.secondary.dark,
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: paletteLight.primary.main,
        color: "#FFFFFF",
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      elevation1: {
        boxShadow: shadows[2],
      },
      rounded: {
        borderRadius: shape.borderRadiusLg,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: shape.borderRadiusLg,
        boxShadow: shadows[4],
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        borderRadius: shape.borderRadiusMd,
        background: "#f8fafc",
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontSize: "0.8rem",
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: shape.borderRadiusLg,
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        backgroundColor: paletteLight.secondary.main,
        color: "#fff",
      },
    },
  },
};

// Choose palette here: paletteLight or paletteDark
let theme = createTheme({
  palette: paletteLight, // Change to paletteDark for dark mode
  typography,
  spacing,
  breakpoints,
  shape,
  shadows,
  transitions,
  zIndex,
  components,
});

theme = responsiveFontSizes(theme);

export default theme;
