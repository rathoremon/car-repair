import React from "react";
import { Box, Grid, useTheme, Container, IconButton } from "@mui/material";
import ProviderStatsCard from "../../components/provider/Dashboard/ProviderStatsCard";
import TodayBookings from "../../components/provider/Dashboard/TodayBookings";
import RevenueChart from "../../components/provider/Dashboard/RevenueChart";
import RecentReviews from "../../components/provider/Dashboard/RecentReviews";
import GarageImagesCarousel from "../../components/provider/Dashboard/GarageImagesCarousel";
import Announcements from "../../components/provider/Dashboard/Announcements";
import QuickActions from "../../components/provider/Dashboard/QuickActions";
import ProfileCompletion from "../../components/provider/Dashboard/ProfileCompletion";
import SupportBox from "../../components/provider/Dashboard/SupportBox";
import AvailabilityToggle from "../../components/provider/Dashboard/AvailabilityToggle";

const Dashboard = () => {
  const theme = useTheme();

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 2, md: 4 }, minHeight: "100vh" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <ProviderStatsCard />
              </Grid>
              <Grid
                item
                xs={12}
                md={5}
                sx={{
                  width: { xs: "100%", sm: "45%" },
                }}
              >
                <AvailabilityToggle />
                <ProfileCompletion />
              </Grid>
              <Grid
                item
                xs={12}
                md={5}
                sx={{
                  width: { xs: "100%", sm: "53.5%" },
                }}
              >
                <TodayBookings />
              </Grid>

              <Grid item xs={12} md={12} sx={{ width: "100%" }}>
                <RevenueChart />
              </Grid>
              <Grid item xs={12} md={5}>
                <GarageImagesCarousel />
              </Grid>
              <Grid item xs={12} md={5}>
                <RecentReviews />
              </Grid>
              <Grid item xs={12} md={5}>
                <Announcements />
              </Grid>
              <Grid
                item
                xs={12}
                md={5}
                sx={{
                  width: { xs: "100%", md: "38.5%" }, // 100% on mobile, 38% on desktop
                  minWidth: 0, // prevents overflow on small screens
                }}
              >
                <QuickActions />
              </Grid>
            </Grid>
            <Grid item xs={12} md={12} sx={{ marginTop: { xs: 2.5, sm: 0 } }}>
              <SupportBox />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;
// import React from "react";

// const Dashboard = () => {
//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "92vh",
//         width: "100%",
//         fontSize: "2rem",
//       }}
//     >
//       Dashboard
//     </div>
//   );
// };

// export default Dashboard;
