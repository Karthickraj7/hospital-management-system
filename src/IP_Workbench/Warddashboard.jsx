import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import "./Warddash.css";
import { Doughnut, Pie, PolarArea } from "react-chartjs-2";
import Grid from "@mui/material/Grid";
import { BarChart } from "@mui/x-charts/BarChart";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
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

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
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
    backgroundColor: "#1a90ff",
    ...theme.applyStyles("dark", {
      backgroundColor: "#308fe8",
    }),
  },
}));







const Warddashboard = () => {

  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const [patientStats, setPatientStats] = useState({
    totalPatients: 0,
    outPatients: 0,
    ipPatients: 0,
    ccu_patients:0,
    new_consultations : 0,
    follow_ups : 0,
    icu_patients:0,
    general_patients:0,
    cas_Patients:0,
    ot_Patients:0,
    occupied_bed:0,
    vaccany_bed:0,
    Totalcashpatient:0,
    Totalcreditpatient:0,
    TotalclientPatient:0,
    TotalinsurancePatient:0,
    Medical:0,
    surgery:0,
    admission:0,
    discharge:0,
    
    });


// Admission Discharge wise chart
const pieData2 = {
  labels: ["Admission", "Discharge"],
  datasets: [
    {
      data: [patientStats.admission, patientStats.discharge],
      backgroundColor: ["#F29F58", "#AB4459"],
    },
  ],
};


// Medical CHART

const MedicalChart = ({ data }) => {
  return (
    <div className="MedicalChart">
      {data.map((item, index) => (
        <div key={index} className="agev_container">
          <div className="medicalv_label">{item.label}</div>
          <div
            className="agev"
            style={{ width: `${item.value}%`, backgroundColor: item.color }}
          >
            <span className="agev_value">{item.value}%</span>{" "}
            {/* Display value */}
          </div>
        </div>
      ))}
    </div>
  );
};
const Medicaldata = [
  { label: "Medical ", value: patientStats.Medical, color: "#4CAF50" },
  { label: "Surgery", value: patientStats.surgery, color: "#FF9800" },
];
    // BedAccupancy chart
const pieData3 = {
  labels: ["Occupied", "Vaccancy"],
  datasets: [
    {
      data: [patientStats.occupied_bed, patientStats.vaccany_bed],
      backgroundColor: ["#EB8317", "#10375C"],
    },
  ],
};

// Patient Ward Wise
const doughnutData = {
  labels: ["ICU", "CCU", "GENERAL", "OT"],
  datasets: [
    {
      data: [patientStats.icu_patients, patientStats.cas_Patients, patientStats.general_patients, patientStats.ot_Patients],
      backgroundColor: ["#4BC0C0", "#F7464A", "#FFB6C1", "#C2C2C2"],
    },
  ],
};

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    axios.get(`${UrlLink}Ip_Workbench/get_patient_stats_warddashboard`) // Replace with your actual API endpoint
      .then((response) => {
        const data = response.data;
        setPatientStats({
          new_consultations:data.new_consultations,
          follow_ups:data.follow_ups,
          totalPatients:data.totalPatients,
          outPatients:data.outPatients,
          ipPatients:data.ipPatients,
          ccu_patients:data.ccu_patients,
          icu_patients:data.icu_patients,
          cas_Patients:data.cas_Patients,
          general_patients:data.general_patients,
          ot_Patients:data.ot_Patients,
          occupied_bed:data.occupied_bed,
          vaccany_bed:data.vaccany_bed,
          Totalcashpatient:data.Totalcashpatient,
          Totalcreditpatient:data.Totalcreditpatient,
          TotalclientPatient:data.TotalclientPatient,
          TotalinsurancePatient:data.TotalinsurancePatient,
          Medical:data.Medical,
          surgery:data.surgery,
          admission:data.admission,
          discharge:data.discharge,

        });
      })
      .catch((error) => {
        console.error("Error fetching patient stats:", error);
      });
  }, [UrlLink]);
  return (
    <div className="dashboard_v_con">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1} style={{ padding: "5px" , justifyContent:'center' }}>
          <Grid item xs={12} md={6} lg={6}>
            <Item style={{ height: "220px" }} className='wed32e2ed_'>
              <h6
                style={{
                  textAlign: "center",
                  fontSize: "15px",
                  margin: "5px",
                }}
              >
                Patient's List
              </h6>

              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} className='edwede_efki399' >
                  <Grid item xs={6}>
                    <Item
                    style={{
                      height: "140px",
                      backgroundColor: "rgb(247 156 240 / 74%)",
                      gap: "10px",
                      textAlign: "left",
                      borderRadius: "20px",
                      marginTop: "5px",
                    }}
                    className='wedewde_w9'
                  >
                      <Grid container spacing={2}>
                        <Grid item xs={4} style={{ display: "flex" }}>
                          <Item
                            style={{
                              backgroundColor: "transparent",
                              boxShadow: "none",
                              textAlign: "left",
                            }}
                          >
                           
                            <AccessibleForwardIcon
                              style={{ fontSize: "40px" }}
                            />
                            
                            <span
                              style={{
                                textAlign: "left",
                                fontSize: "13px",
                                fontWeight: "bold",
                                marginBottom: "5px",
                                display: "block",
                              }}
                            >
                              {patientStats.totalPatients}
                            </span>
                            <span
                              style={{
                                textAlign: "left",
                                fontSize: "15px",
                                fontWeight: "bold",
                                marginBottom: "5px",
                                display: "block",
                              }}
                            >
                              Total Patient's
                            </span>
                          </Item>
                        </Grid>
                        <Grid item xs={8}>
                          <Item
                            style={{
                              // marginTop: "16px",
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
                              Cash Patients
                            </span>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <BorderLinearProgress
                                variant="determinate"
                                value={patientStats.Totalcashpatient}
                                style={{ width: "80%" }}
                              />
                              <span
                                style={{
                                  display: "inline-block",
                                  fontSize: "12px",
                                  color: "#C7253E",
                                }}
                              >
                                {patientStats.Totalcashpatient}
                              </span>
                            </div>
                            <span
                              style={{
                                display: "block",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              Credit Patients
                            </span>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <BorderLinearProgress
                                variant="determinate"
                                value={patientStats.Totalcreditpatient}
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
                                {patientStats.Totalcreditpatient}
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
                        height: "140px",
                        backgroundColor: "rgb(247 156 240 / 74%)",
                        gap: "10px",
                        textAlign: "left",
                        borderRadius: "20px",
                        marginTop: "5px",
                      }}
                      className='wedewde_w9'

                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Item
                            style={{
                              textAlign: "left",
                              backgroundColor: "transparent",
                              boxShadow: "none",
                            }}
                          >
                            <span
                              style={{
                                textAlign: "left",
                                fontSize: "18px",
                                fontWeight: "bold",
                                marginBottom: "16px",
                                // display: "block",
                              }}
                            >
                              Credit Patient's
                            </span>

                            <span
                              style={{
                                display: "block",
                                marginTop: "10px",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              Insurance
                            </span>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <BorderLinearProgress
                                variant="determinate"
                                value={patientStats.TotalinsurancePatient}
                                style={{ width: "80%" }}
                              />
                              <span
                                style={{
                                  display: "inline-block",
                                  fontSize: "12px",
                                  color: "#000",
                                }}
                              >
                                {patientStats.TotalinsurancePatient}
                              </span>
                            </div>
                            <span
                              style={{
                                display: "block",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              Client
                            </span>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <BorderLinearProgress
                                variant="determinate"
                                value={patientStats.TotalclientPatient}
                                style={{ width: "80%" }}
                              />
                              <span
                                style={{
                                  display: "inline-block",
                                  fontSize: "12px",
                                  color: "#000",
                                }}
                              >
                                {patientStats.TotalclientPatient}
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




          <Grid item xs={12} md={3} lg={3}>
            <Item style={{ height: "220px" }}>
              <div className="patient-details">
                <h3>Total Admit Discharge </h3>
                <div className="pie-chart">
                  <Pie data={pieData2} />
                </div>
              </div>
            </Item>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <Item style={{ height: "220px" }}>
              <h3
                style={{
                  textAlign: "center",
                  fontSize: "15px",
                  marginBottom:'5px',
                }}
              >
                Surgery Medical Manage
              </h3>{" "}
              <MedicalChart data={Medicaldata} />
            </Item>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} style={{ padding: "5px" }}>
          <Grid item xs={12} md={3} lg={3}>
            <Item style={{ height: "260px" }}>
              <div className="patient-details">
                <h3>Bed Accupency </h3>
                <div className="pie-chart">
                  <Pie data={pieData3} />
                </div>             
              </div>
            </Item>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Item style={{ height: "260px" }}>
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
      </Box>
    </div>
  );
};

export default Warddashboard;
