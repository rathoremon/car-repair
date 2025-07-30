// src/components/provider/Dashboard/SupportBox.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  Collapse,
  Tooltip,
  useTheme,
  useMediaQuery,
  Link,
  IconButton,
} from "@mui/material";
import {
  SupportAgent,
  Chat,
  ExpandLess,
  ExpandMore,
  Phone,
  Article,
  HelpOutline,
  MailOutline,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const FAQS = [
  {
    q: "How do I get more bookings?",
    a: "Complete your profile, upload clear garage images, and keep your availability toggled on. Respond to requests quickly to earn higher rankings.",
  },
  {
    q: "How can I track payouts?",
    a: "Visit the Payouts section in your dashboard to see payment status and history.",
  },
  {
    q: "Where do I find onboarding or training?",
    a: "Click the Training Guide button below for quick-start videos and checklists.",
  },
];

const onboardingUrl = "https://trasure.com/onboarding-guide";
const supportPhone = "+91-9876543210";
const whatsAppLink = "https://wa.me/919876543210";
const supportMail = "support@trasure.com";

export default function SupportBox() {
  const [faqOpen, setFaqOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const agentOnline = true;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100vw",
        px: { xs: 0, md: 0 },
        mb: { xs: 2, md: 3 },
        borderRadius: 1.5,
        boxShadow: "0 4px 28px rgba(40, 60, 120, 0.25)",
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
      }}
      component={motion.section}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.38 } }}
    >
      <Paper
        elevation={5}
        sx={{
          borderRadius: { xs: 1.5, sm: 1.5 },
          width: "100%",
          boxShadow: "0 4px 32px rgba(38, 60, 120, 0.08)",
          bgcolor: "background.paper",
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 2.5, sm: 3.5 },
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          background: `linear-gradient(120deg, ${
            theme.palette.primary[50] || "#f5f6fd"
          } 65%, transparent 120%)`,
        }}
      >
        {/* HERO: Friendly support and quick actions */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="left"
          spacing={2}
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Stack direction="row" alignItems="center" spacing={1.4}>
            <SupportAgent
              sx={{
                fontSize: 34,
                color: agentOnline ? theme.palette.primary.main : "grey.400",
                mb: { xs: 0, sm: 0 },
              }}
            />
            <Box>
              <Typography
                variant="h6"
                fontWeight={900}
                fontFamily="'Inter','Roboto','Segoe UI',Arial,sans-serif"
                sx={{
                  color: theme.palette.primary.main,
                  letterSpacing: 0.7,
                  mb: 0.1,
                }}
              >
                Trasure Provider Support
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    bgcolor: agentOnline ? "success.main" : "grey.400",
                    boxShadow: agentOnline ? "0 0 7px #2ae38299" : "none",
                    mr: 0.5,
                  }}
                />
                <Typography
                  variant="body2"
                  color={agentOnline ? "success.main" : "text.secondary"}
                  fontWeight={600}
                >
                  {agentOnline
                    ? "Live now • 9am–7pm"
                    : "Offline • Reply in 1 hr"}
                </Typography>
              </Stack>
            </Box>
          </Stack>
          {/* Quick actions */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mt: { xs: 2, sm: 0 } }}
          >
            <Tooltip title="Chat with Support (WhatsApp)" arrow>
              <Button
                variant="contained"
                startIcon={<Chat />}
                href={whatsAppLink}
                target="_blank"
                sx={{
                  borderRadius: 1,
                  minWidth: 0,
                  fontWeight: 700,
                  fontSize: 15,
                  px: 2.3,
                  bgcolor: "#25d366",
                  color: "#fff",
                  boxShadow: "0 2px 12px #25d36633",
                  "&:hover": { bgcolor: "#21b857" },
                  textTransform: "none",
                }}
              >
                WhatsApp
              </Button>
            </Tooltip>
            <Tooltip title="Call Support" arrow>
              <Button
                variant="outlined"
                startIcon={<Phone />}
                href={`tel:${supportPhone}`}
                sx={{
                  borderRadius: 1,
                  minWidth: 0,
                  fontWeight: 700,
                  fontSize: 15,
                  px: 2.3,
                  color: "primary.main",
                  borderColor: "primary.light",
                  "&:hover": {
                    bgcolor: theme.palette.primary[50],
                  },
                  textTransform: "none",
                }}
              >
                Call
              </Button>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Divider */}
        <Divider sx={{ my: 0.5 }} />

        {/* FAQ */}
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ cursor: "pointer", userSelect: "none" }}
            onClick={() => setFaqOpen((v) => !v)}
            role="button"
            aria-expanded={faqOpen}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setFaqOpen((v) => !v);
            }}
          >
            <HelpOutline sx={{ color: theme.palette.info.main }} />
            <Typography
              variant="subtitle1"
              fontWeight={700}
              fontFamily="'Inter','Roboto','Segoe UI',Arial,sans-serif"
              sx={{ color: "inherit" }}
            >
              Quick FAQ
            </Typography>
            <Box flexGrow={1} />
            {faqOpen ? <ExpandLess /> : <ExpandMore />}
          </Stack>
          <Collapse in={faqOpen} timeout="auto">
            <Box sx={{ mt: 1 }}>
              {FAQS.map((item, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    bgcolor: "grey.50",
                    p: 1.4,
                    mb: 1,
                    borderRadius: 1,
                    borderLeft: `3px solid ${theme.palette.primary.light}`,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="text.primary"
                  >
                    {item.q}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {item.a}
                  </Typography>
                </Paper>
              ))}
              <Box sx={{ textAlign: "right", mt: 1 }}>
                <Link
                  href={onboardingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.info.main,
                    fontSize: 15,
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <Article sx={{ fontSize: 18, mr: 0.7 }} />
                  Onboarding & Training Guide
                </Link>
              </Box>
            </Box>
          </Collapse>
          {!faqOpen && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, fontWeight: 500, opacity: 0.85 }}
            >
              Tap to view answers to the most common provider questions.
            </Typography>
          )}
        </Box>

        {/* Subtle email below actions for desktop */}
        <Box
          sx={{
            mt: { xs: 1, sm: 1 },
            textAlign: "right",
            opacity: 0.93,
          }}
        >
          <Tooltip title="Email Support" arrow>
            <Link
              href={`mailto:${supportMail}`}
              underline="hover"
              color="error"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              <MailOutline sx={{ fontSize: 18, mr: 0.5 }} />
              {supportMail}
            </Link>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  );
}
