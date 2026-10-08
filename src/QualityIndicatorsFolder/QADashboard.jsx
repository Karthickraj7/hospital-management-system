import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import "./QADashboard.css";

const QADashboard = () => {
  const [counts, setCounts] = useState(null);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  useEffect(() => {
    fetch(`${UrlLink}/QualityIndicators/get_row_count_for_qa_dashboard`)
      .then((res) => res.json())
      .then((data) => setCounts(data))
      .catch((err) => console.error("Error fetching dashboard counts:", err));
  }, []);

  if (!counts) {
    return <div>Loading...</div>;
  }

  // Example chart data using the counts
  const inPatientData = [
    { name: "Admissions", value: counts.Patient_IP_Registration_Detials },
  ];

  const outPatientData = [
    {
      name: "Appointments",
      value: counts.Patient_Appointment_Registration_Detials,
      color: "#0088FE",
    },
  ];

  const hrData = [
    {
      name: "Employees",
      value: counts.Employee_Personal_Form_Detials,
    },
  ];

  const labData = [
    { name: "Lab Requests", value: counts.Lab_Request_Details },
  ];

  const inventory = [
              
    { name: "Stores", value: counts.inventory_details, color : '#afdf20' },
  ];
  const radiologyData = [
    { name: "Radiology", value: counts.Radiology_Request_Detials },
  ];

  const otData = [
    {
      name: "OT Bookings",
      value: counts.Theatre_Booking_Request_Detials,
    },
  ];

  const medicalErrorData = [
    { name: "Errors", value: counts.MedicalErrorReport },
  ];

  return (
    <div className="dashboard-container01" style={{ marginTop: "20px" }}>
      <div className="dashboard-grid01">
        {/* IN PATIENT */}
        <div className="dashboard-card01">
          <h2 className="card-title001">IN PATIENT</h2>
          <div className="chart-container01">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={inPatientData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* OUT PATIENT */}
        <div className="dashboard-card02">
          <h2 className="card-title002">OUT PATIENT</h2>
          <div className="chart-container01">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={outPatientData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                label
              >
                {outPatientData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* HUMAN RESOURCE */}
        <div className="dashboard-card03">
          <h2 className="card-title003">HUMAN RESOURCE</h2>
          <div className="chart-container01">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hrData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* LAB */}
        <div className="dashboard-card04">
          <h2 className="card-title004">LAB</h2>
          <div className="chart-container01">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={labData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* RADIOLOGY */}
        <div className="dashboard-card05">
          <h2 className="card-title005">RADIOLOGY</h2>
          <div className="chart-container01">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={radiologyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* OPERATION THEATRE */}
        <div className="dashboard-card06">
          <h2 className="card-title006">OPERATION THEATRE</h2>
          <div className="chart-container01">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={otData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ff00ff" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* MEDICAL ERRORS */}
        <div className="dashboard-card08">
          <h2 className="card-title008">MEDICAL ERRORS</h2>
          <div className="chart-container01">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={medicalErrorData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#d62728" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>
         {/* INVENTORY */}
         <div className="dashboard-card07">
          <h2 className="card-title002">INVENTORY</h2>
          <div className="chart-container01">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={inventory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                label
              > 
                {inventory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          </div>
        </div>
        
<div className="dashboard-card01">
<h2 className="card-title001">NABHL</h2>
<div className="chart-container01">
<ResponsiveContainer width="100%" height={200}>
            <BarChart data={inPatientData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
</div>
</div>

      </div>
    </div>
  );
};

export default QADashboard;


