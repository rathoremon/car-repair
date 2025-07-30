import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Rating,
  Stack,
  Divider,
  Chip,
  Tooltip,
  useTheme,
  Button,
  IconButton,
  Skeleton,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import AddCommentIcon from "@mui/icons-material/AddComment";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Keyboard, A11y } from "swiper/modules";
import { motion } from "framer-motion";

// --------- MOCKS: replace with props, API or Redux --------
const mockReviews = [
  {
    id: 1,
    customer: "Kunal Shah",
    rating: 5,
    comment:
      "Quick & professional service! Highly recommend. My car broke down on the highway and help arrived within 25 minutes. The mechanic was very polite and knowledgeable.",
    date: "2025-07-03T14:12:00",
    verified: true,
    customerType: "Returning",
    avatar: "",
    location: "Mumbai",
  },
  {
    id: 2,
    customer: "Sneha Arora",
    rating: 4,
    comment: "Very good, but a bit late. Would still use the service again.",
    date: "2025-07-02T10:41:00",
    verified: false,
    customerType: "First-Time",
    avatar: "",
    location: "Delhi",
  },
];

// ------------- Utility functions ---------------
function getInitials(name) {
  return name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ----------- Review Card Component ------------
const ReviewCard = ({ review }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{
        boxShadow:
          "0 6px 24px 0 rgba(30,40,70,0.11),0 0.5px 1.5px 0 rgba(40,50,60,0.07)",
        background: theme.palette.action.hover,
      }}
      style={{
        borderRadius: 12,
        cursor: "pointer",
        minHeight: 160,
        padding: "0.7rem 0.5rem",
        transition: "background 0.2s, box-shadow 0.2s",
        outline: "none",
      }}
      tabIndex={0}
    >
      <Stack direction="row" alignItems="flex-start" spacing={2}>
        <Avatar
          src={review.avatar || ""}
          alt={review.customer}
          sx={{
            width: { xs: 44, sm: 52 },
            height: { xs: 44, sm: 52 },
            fontWeight: 700,
            fontSize: { xs: "1.1rem", sm: "1.2rem" },
            bgcolor: review.avatar ? undefined : theme.palette.grey[200],
            color: theme.palette.primary.main,
            border: review.verified
              ? `2px solid ${theme.palette.primary.light}`
              : undefined,
            boxShadow: review.verified
              ? "0 2px 8px 0 rgba(0,128,255,0.10)"
              : undefined,
            mr: 1.2,
          }}
        >
          {review.avatar ? null : getInitials(review.customer)}
        </Avatar>
        <Box flexGrow={1} minWidth={0}>
          <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{
                fontSize: { xs: "1rem", sm: "1.09rem" },
                maxWidth: 120,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {review.customer}
            </Typography>
            {review.verified && (
              <Tooltip title="Verified customer">
                <VerifiedIcon
                  fontSize="small"
                  color="primary"
                  sx={{ ml: -0.5 }}
                />
              </Tooltip>
            )}
            <Chip
              label={review.customerType}
              size="small"
              sx={{
                fontSize: "0.75rem",
                height: 20,
                bgcolor: "grey.100",
                color: "grey.700",
                fontWeight: 500,
                letterSpacing: 0.01,
                ml: 0.5,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "grey.600",
                fontWeight: 400,
                fontSize: "0.93em",
                ml: 1,
              }}
            >
              {review.location}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} my={0.2}>
            <Rating
              value={review.rating}
              readOnly
              size="small"
              precision={0.5}
              aria-label={`Rated ${review.rating} stars`}
            />
            <Typography
              variant="caption"
              sx={{
                color: "grey.700",
                fontWeight: 500,
                letterSpacing: 0.06,
              }}
            >
              {review.rating.toFixed(1)}
            </Typography>
          </Box>
          <Box
            mt={0.7}
            mb={0.3}
            maxWidth={{ xs: 210, sm: 320, md: 550 }}
            sx={{
              position: "relative",
              cursor: review.comment.length > 50 ? "pointer" : "default",
              userSelect: "text",
            }}
            onClick={() => review.comment.length > 50 && setExpanded((e) => !e)}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.6,
                fontWeight: 400,
                fontSize: { xs: "0.98rem", sm: "1.05rem" },
                letterSpacing: 0.01,
                display: "-webkit-box",
                WebkitLineClamp: expanded ? "unset" : 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: review.comment.length > 50 ? "pointer" : "default",
                transition: "color 0.18s",
                "&:hover": {
                  color:
                    review.comment.length > 50
                      ? theme.palette.primary.main
                      : "inherit",
                },
              }}
            >
              “{review.comment}”
            </Typography>
            {review.comment.length > 50 && !expanded && (
              <Typography
                variant="caption"
                color="primary"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  cursor: "pointer",
                  fontWeight: 500,
                  px: 0.4,
                }}
              >
                ...more
              </Typography>
            )}
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="caption"
              sx={{ color: "grey.500", fontWeight: 400, pt: 2 }}
            >
              {formatDate(review.date)}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </motion.div>
  );
};

// ----------- Empty State Component ----------
const EmptyState = () => (
  <Box
    height={150}
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    gap={2}
    sx={{
      background:
        "repeating-linear-gradient(-45deg, #f5f6fa, #f5f6fa 10px, #f8fafb 10px, #f8fafb 20px)",
      borderRadius: 2,
    }}
  >
    <StarBorderRoundedIcon sx={{ fontSize: 44, color: "grey.400" }} />
    <Typography variant="body2" color="text.secondary">
      No reviews yet. Encourage your customers to leave the first one!
    </Typography>
    <Button
      startIcon={<AddCommentIcon />}
      variant="outlined"
      size="small"
      sx={{ textTransform: "none" }}
    >
      Request a Review
    </Button>
  </Box>
);

// ---------- Skeleton Placeholder ----------
const ReviewSkeleton = () => (
  <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ py: 1.3 }}>
    <Skeleton variant="circular" width={48} height={48} />
    <Box flexGrow={1}>
      <Skeleton variant="text" width="36%" sx={{ mb: 0.7 }} />
      <Skeleton variant="text" width="22%" sx={{ mb: 0.5 }} />
      <Skeleton variant="rounded" height={20} width="80%" sx={{ my: 0.8 }} />
      <Skeleton variant="text" width="20%" />
    </Box>
  </Stack>
);

// ------------- MAIN COMPONENT ---------------
const RecentReviews = ({
  reviews = mockReviews, // pass prop if loading from API
  loading = false,
  onSeeAll, // callback or link action
  onRequestReview, // for empty state button
}) => {
  const theme = useTheme();
  const [current, setCurrent] = useState(0);

  return (
    <Paper
      elevation={4}
      sx={{
        width: "100%",
        minWidth: 0,
        maxWidth: 715,
        minHeight: { xs: 280, sm: 320, md: 330 },
        height: { xs: "auto", md: 330 },
        borderRadius: 1.5,
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
        boxShadow: "0 4px 28px rgba(40, 60, 120, 0.25)",
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        transition: "box-shadow 0.22s, border 0.2s",
        fontFamily: "'Inter','Roboto',sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 44 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        borderColor: theme.palette.primary.light,
      }}
    >
      <Box display="flex" alignItems="center" mb={1.5}>
        <StarBorderRoundedIcon sx={{ color: "primary.main", mr: 1 }} />
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1rem", sm: "1.08rem" },
            color: "text.primary",
            letterSpacing: 0.08,
          }}
        >
          Recent Reviews
        </Typography>
        <Box flexGrow={1} />
        <Button
          size="small"
          variant="text"
          endIcon={<ArrowForwardIosIcon sx={{ fontSize: 15, ml: -0.7 }} />}
          sx={{
            fontSize: "0.96rem",
            textTransform: "none",
            ml: 2,
            fontWeight: 500,
            color: "primary.dark",
            ":hover": {
              color: "primary.main",
              background: "transparent",
              textDecoration: "underline",
            },
            borderRadius: 1,
            px: 1,
          }}
          onClick={onSeeAll}
        >
          See All
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ flexGrow: 1, minHeight: { xs: 170, md: 180 } }}>
        {loading ? (
          <ReviewSkeleton />
        ) : reviews && reviews.length === 0 ? (
          <EmptyState onClick={onRequestReview} />
        ) : (
          <Swiper
            modules={[Pagination, Keyboard, A11y]}
            slidesPerView={1}
            keyboard={{ enabled: true }}
            pagination={{ clickable: true, dynamicBullets: true }}
            a11y={{
              prevSlideMessage: "Previous review",
              nextSlideMessage: "Next review",
            }}
            onSlideChange={(swiper) => setCurrent(swiper.realIndex)}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            {reviews.map((r) => (
              <SwiperSlide key={r.id}>
                <ReviewCard review={r} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Box>
    </Paper>
  );
};

export default RecentReviews;
