import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

const stats = [
  { label: "Total Revenue", value: "₹12.5L" },
  { label: "Bookings Today", value: "134" },
  { label: "Avg Response Time", value: "12 min" },
  { label: "Pending Complaints", value: "8" },
];

const Dashboard = () => {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle1" color="textSecondary">
                  {stat.label}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Dashboard;
