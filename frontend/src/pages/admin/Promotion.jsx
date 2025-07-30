import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Stack,
  Button,
  Divider,
  Paper,
  Dialog,
  useMediaQuery,
  CircularProgress,
  Fade,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PromotionForm from "../../components/admin/Promotion/PromotionForm";
import PromotionList from "../../components/admin/Promotion/PromotionList";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPromotions } from "../../features/promotion/promotionThunks";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";

const Promotion = () => {
  const [tab, setTab] = useState("image");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.promotion);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    dispatch(fetchAllPromotions())
      .unwrap()
      .catch((err) => toast.error(err));
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setShowForm(false);
    setEditData(null);
  };

  const handleAddClick = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditData(null);
  };

  return (
    <Fade in>
      <Box
        sx={{
          p: isMobile ? 0.5 : 4,
          background: "linear-gradient(90deg,#f8fafc 0%,#e0e7ff 100%)",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            maxWidth: 1024,
            mx: "auto",
            width: "100%",
            mt: isMobile ? 1 : 4,
            mb: isMobile ? 2 : 5,
            boxShadow: 4,
            borderRadius: 4,
            background: "#fff",
            position: "relative",
          }}
        >
          {/* Top Section with Title & Add Button */}
          <Box
            sx={{
              px: { xs: 2, sm: 4 },
              pt: 3,
              pb: 1.5,
              background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)", // Deep to light blue
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
              boxShadow: "0 2px 20px 0 rgba(37,99,235,0.12)", // blue shadow
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative highlight */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 110,
                height: "100%",
                background:
                  "linear-gradient(120deg, rgba(255,255,255,0.12) 0%, transparent 100%)",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
            <Box sx={{ zIndex: 2 }}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                fontWeight="bold"
                color="#fff"
                letterSpacing={-1}
                sx={{ mb: 0.5 }}
              >
                Banner Management
              </Typography>
              <Typography
                variant="subtitle2"
                color="#dbeafe"
                fontWeight={500}
                sx={{ opacity: 0.93, mt: 0.2, letterSpacing: 0.1 }}
              >
                Manage all banners, promos, and image carousels.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{
                borderRadius: 3,
                px: 2.6,
                py: 1.1,
                fontWeight: 700,
                fontSize: 16,
                color: "#1e293b",
                background: "rgba(255,255,255,0.7)",
                boxShadow: "0 2px 12px 0 rgba(30,34,90,0.09)",
                backdropFilter: "blur(6px)",
                border: "1.5px solid #e0e7ff",
                letterSpacing: 0.07,
                mt: { xs: 1, sm: 0 },
                transition: "background 0.18s, box-shadow 0.17s",
                "&:hover": {
                  background: "rgba(236,245,255,0.9)",
                  boxShadow: "0 4px 18px 0 rgba(30,34,90,0.13)",
                },
              }}
            >
              Add New Banner
            </Button>
          </Box>

          {/* Tabs */}
          <Box
            sx={{
              px: { xs: 1.5, sm: 4 },
              pt: 2.5,
              background: "#fff",
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <Tabs
              value={tab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons={isMobile ? "auto" : false}
              sx={{
                minHeight: 46,
                ".MuiTabs-flexContainer": { gap: 2 },
                mb: 1,
              }}
            >
              <Tab
                value="image"
                label="Image Banners"
                sx={{ fontWeight: 600, px: 3 }}
              />
              <Tab
                value="promotion"
                label="Promotional Banners"
                sx={{ fontWeight: 600, px: 3 }}
              />
            </Tabs>
            <Divider sx={{ my: 2, bgcolor: "#e5e7eb" }} />
          </Box>

          {/* List Section */}
          <Box
            sx={{
              px: { xs: 1, sm: 4 },
              pb: 4,
              pt: 0,
              background: "#fff",
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              minHeight: isMobile ? 360 : 440,
              position: "relative",
            }}
          >
            <Stack
              direction={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems={isMobile ? "flex-start" : "center"}
              mb={2}
              gap={2}
              sx={{
                mt: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#2d3748",
                  letterSpacing: -0.5,
                  mb: { xs: 1, sm: 0 },
                }}
              >
                {tab === "image"
                  ? "All Image Banners"
                  : "All Promotional Banners"}
              </Typography>
            </Stack>
            {loading ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={8}
              >
                <CircularProgress size={38} color="primary" />
              </Box>
            ) : (
              <PromotionList type={tab} onEdit={handleEdit} />
            )}
          </Box>
        </Box>

        {/* Dialog for Create/Edit */}
        <Dialog
          open={showForm}
          onClose={handleFormClose}
          maxWidth="sm"
          fullWidth
          scroll="body"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: 8,
              px: { xs: 0.5, sm: 2 },
              py: { xs: 1, sm: 3 },
              background: "#fff",
            },
          }}
        >
          <PromotionForm
            type={tab}
            key={editData ? editData.id : "new"}
            onClose={handleFormClose}
            editData={editData}
          />
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Promotion;
