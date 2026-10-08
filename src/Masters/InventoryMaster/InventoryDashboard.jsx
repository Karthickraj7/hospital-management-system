import React, { useEffect, useState } from "react";
import "./Inventorydashstyle.css"
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { BarChart } from "@mui/x-charts/BarChart";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Doughnut, Pie, PolarArea } from "react-chartjs-2";

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

   
  
const InventoryDashboard = () => {
    
  return (
    <div className="dashboard_v_con">
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} style={{ padding: "16px" }}>
      <Grid item xs={12} md={12} lg={12}>
          <Item style={{ height: "300px" }}>
            <h6
              style={{
                textAlign: "center",
                fontSize: "20px",
                margin: "16px",
              }}
            >
            Inventory Dashboard
            </h6>
            {/* <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
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
                          <span
                            style={{
                              textAlign: "left",
                              fontSize: "14px",
                              fontWeight: "bold",
                              marginBottom: "16px",
                              display: "block",
                            }}
                          >
                            Out Patient
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
                            style={{ display: "block", fontSize: "12px", fontWeight:"bold"  }}
                          >
                            New
                          </span>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <BorderLinearProgress
                              variant="determinate"
                              value={80}
                              style={{ width: "80%" }}
                            />
                            <span
                              style={{
                                display: "inline-block",
                                fontSize: "12px",
                                color: "#C7253E",
                              }}
                            >
                              80%
                            </span>
                          </div>
                          <span
                            style={{ display: "block", fontSize: "12px", fontWeight:"bold" }}
                          >
                           Follow UP
                          </span>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <BorderLinearProgress
                              variant="determinate"
                              value={50}
                              style={{ width: "80%", color:"#347928" }}
                              // color="#347928"
                            />
                            <span
                              style={{
                                display: "inline-block",
                                fontSize: "12px",
                                color: "#347928",
                              }}
                            >
                              50%
                            </span>
                          </div>
                        </Item>
                      </Grid>
                    </Grid>
                  </Item>
                </Grid>
                <Grid item xs={6}>
                  <Item
                    style={{
                      height: "160px",
                      backgroundColor: "rgb(145 215 169)",
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
                          <span
                            style={{
                              textAlign: "left",
                              fontSize: "14px",
                              fontWeight: "bold",
                              marginBottom: "16px",
                              display: "block",
                            }}
                          >
                            IN Patient
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
                            style={{ display: "block", fontSize: "12px" , fontWeight:"bold"}}
                          >
                            Admission
                          </span>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <BorderLinearProgress
                              variant="determinate"
                              value={65}
                              style={{ width: "80%" }}
                            />
                            <span
                              style={{
                                display: "inline-block",
                                fontSize: "12px",
                                color: "#000",
                              }}
                            >
                             65%
                            </span>
                          </div>
                          <span
                            style={{ display: "block", fontSize: "12px", fontWeight:"bold" }}
                          >
                           Discharge
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
                                color: "#000",
                              }}
                            >
                             40%
                            </span>
                          </div>
                          <span
                            style={{ display: "block", fontSize: "12px", fontWeight:"bold" }}
                          >
                           Bed Occupency
                          </span>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <BorderLinearProgress
                              variant="determinate"
                              value={70}
                              style={{ width: "80%" }}
                            />
                            <span
                              style={{
                                display: "inline-block",
                                fontSize: "12px",
                                color: "#000",
                              }}
                            >
                              70%
                            </span>
                          </div>
                        </Item>
                      </Grid>
                    </Grid>
                  </Item>
                </Grid>
              </Grid>
            </Box> */}
          </Item>
        </Grid>

        <Grid item xs={12} md={3} lg={12}>
          <Item style={{ height: "300px" }}>
          <h3></h3>
            {/* {" "}
            <AgeChart data={Agedata} /> */}
          </Item>
        </Grid>

      </Grid>
    </Box>
  </div>
  )
}

export default InventoryDashboard