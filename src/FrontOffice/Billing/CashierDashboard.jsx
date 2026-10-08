import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import "./cashier.css";
import { Doughnut, Pie, PolarArea } from "react-chartjs-2";
import { BarChart } from "@mui/x-charts/BarChart";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
  DoughnutController,
  PieController,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const doughnutData = {
  labels: [
    "Biochemistry",
    "Hematology",
    "Clinical Pathology",
    "Microbiology",
    "Molecular Biology",
    "Virology",
    "Histopathology",
    "Cytopathology",
  ],
  datasets: [
    {
      data: [500, 400, 300, 200, 150, 100, 50, 30],
      backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#E7E9ED",
        "#4BC0C0",
        "#F7464A",
        "#FFB6C1",
        "#C2C2C2",
      ],
    },
  ],
};

const CashierDashboard = () => {
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

  const pieData2 = {
    labels: ["Total Billed", "Collection", "Due"],
    datasets: [
      {
        data: [400, 50, 150],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
      },
    ],
  };
  return (
    <div className="dashboard_vv_con">
        
             <div className="cashchart">
                <div className="cash_pie_chart">

                   <Pie data={pieData2} />
                </div>
                <div className="cash_pie_chart">

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



             </div>





      {/* <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} style={{ padding: "12px" }}>
          <Grid item xs={12} md={12} lg={12}>
            <Item style={{ height: "450px" }}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    
                     
                        <h3>Revenue</h3>
                        <div className="revenue_pie-chart">
                          <Pie data={pieData2} />
                        </div>
                    
                  </Grid>
                  <Grid item xs={6}>
                    <div className="chart_MM customers_p93">
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
                    </div>
                  </Grid>
                </Grid>
              </Box>
            </Item>
          </Grid>
        </Grid>
      </Box> */}
    </div>
  );
};

export default CashierDashboard;
