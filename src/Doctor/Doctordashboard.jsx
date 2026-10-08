import * as React from "react";
import "./DrDashStyle.css";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Doughnut, Pie, PolarArea } from "react-chartjs-2";

import { BarChart } from "@mui/x-charts/BarChart";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const Doctordashboard = () => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  const BorderLinearProgress = styled(LinearProgress)(
    ({ theme, barColor }) => ({
      height: 10,
      borderRadius: 5,
      [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[200],
        ...theme.applyStyles("dark", {
          backgroundColor: theme.palette.grey[800],
        }),
      },
      [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: barColor || "#1a90ff", // Default bar color if not provided
        ...theme.applyStyles("dark", {
          backgroundColor: barColor || "#308fe8", // Dark theme bar color
        }),
      },
    })
  );
  const doughnutData = {
    labels: ["OP", "IP", "ICU", "CCU"],
    datasets: [
      {
        data: [300, 200, 150],
        backgroundColor: ["#FFCE56", "#E7E9ED", "#4BC0C0", "#F7464A"],
      },
    ],
  };
  const pieData5 = {
    labels: ["New", "FollowUP"],
    datasets: [
      {
        data: [12, 78],
        backgroundColor: ["#58A399", "#496989"],
      },
    ],
  };
  return (
    <div className="dashboard_v_con">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} style={{ padding: "16px" }}>
          <Grid item xs={12} md={6} lg={6}>
            <Item style={{ height: "280px" }}>
              <h6
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  margin: "16px",
                }}
              >
                Total Appointments
              </h6>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} justifyContent="center" alignItems="center" >
                  <Grid item xs={8}>
                    <Item
                      style={{
                        height: "160px",
                        backgroundColor: "rgb(247 156 240 / 74%)",
                        gap: "10px",
                        textAlign: "left",
                        borderRadius: "20px",
                        marginTop: "10px",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Item
                            style={{
                              backgroundColor: "transparent",
                              boxShadow: "none",
                              textAlign: "left",
                            }}
                          >
                            <span
                              style={{
                                textAlign: "left",
                                fontSize: "18px",
                                fontWeight: "bold",
                                marginBottom: "16px",
                                display: "block",
                              }}
                            >
                              Appointments
                            </span>
                            <AccessibleForwardIcon
                              style={{ fontSize: "50px" }}
                            />
                            <span
                              style={{
                                textAlign: "left",
                                fontSize: "20px",
                                fontWeight: "bold",
                                marginBottom: "8px",
                                display: "block",
                              }}
                            >
                              56
                            </span>
                          </Item>
                        </Grid>
                        <Grid item xs={8}>
                          <Item
                            style={{
                              textAlign: "left",
                              backgroundColor: "transparent",
                              boxShadow: "none",
                            }}
                          >
                            <span
                              style={{
                                display: "block",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              Request
                            </span>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <BorderLinearProgress
                                variant="determinate"
                                value={40}
                                style={{ width: "80%" }}
                              />
                              <span
                                style={{
                                  display: "inline-block",
                                  fontSize: "12px",
                                  color: "#C7253E",
                                }}
                              >
                                40%
                              </span>
                            </div>
                            <span
                              style={{
                                display: "block",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              Confirm
                            </span>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <BorderLinearProgress
                                variant="determinate"
                                value={10}
                                style={{ width: "80%", color: "#347928" }}
                                // color="#347928"
                              />
                              <span
                                style={{
                                  display: "inline-block",
                                  fontSize: "12px",
                                  color: "#347928",
                                }}
                              >
                                10%
                              </span>
                            </div>
                            <span
                              style={{
                                display: "block",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              Pending
                            </span>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <BorderLinearProgress
                                variant="determinate"
                                value={35}
                                style={{ width: "80%" }}
                                barColor="#F87A53"
                              />
                              <span
                                style={{
                                  display: "inline-block",
                                  fontSize: "12px",
                                  color: "#347928",
                                }}
                              >
                                35%
                              </span>
                            </div>
                            <span
                              style={{
                                display: "block",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              Complete
                            </span>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <BorderLinearProgress
                                variant="determinate"
                                value={33}
                                style={{ width: "80%" }}
                                barColor="#41B06E" //  color
                              />
                              <span
                                style={{
                                  display: "inline-block",
                                  fontSize: "12px",
                                  color: "#347928",
                                }}
                              >
                                33%
                              </span>
                            </div>
                          </Item>
                        </Grid>
                      </Grid>
                    </Item>
                  </Grid>
                </Grid>
              </Box>
            </Item>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Item style={{ height: "280px" }}>
              <h3>Department Wise</h3>
              <div className="customers_p93_Doughnt">
                <Doughnut
                  data={doughnutData}
                  options={{
                    responsive: true, // Chart will resize based on screen size
                    maintainAspectRatio: false, // Allow dynamic resizing based on the defined width/height
                  }}
                  width={200} // Fixed width (you can adjust this)
                  height={220} // Fixed height (you can adjust this)
                />
              </div>
            </Item>
          </Grid>
        </Grid>
        <Grid container spacing={3} justifyContent="center" alignItems="center" style={{ padding: "16px" }}>
          <Grid item xs={12} md={3} lg={3}>
            <Item style={{ height: "280px" }}>
              <div className="patient-details">
                <h3>Out Patiemnts</h3>
                <div className="pie-chart">
                  <Pie data={pieData5} />
                </div>
              </div>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Doctordashboard;
