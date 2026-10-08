import React from "react";
import "./HRDashBoardNew.css";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaUsers,
  FaUser,
  FaUserCheck,
  FaChartPie,
  FaChartBar,
  FaBuilding,
  FaDollarSign,
  FaTransgender,
  FaBriefcase,
  FaPlane,
} from "react-icons/fa";

const HRDashBBoardNew = () => {
  // Data for employee ratings
  const ratingData = [
    { rating: "1", count: 209 },
    { rating: "2", count: 189 },
    { rating: "3", count: 206 },
    { rating: "4", count: 225 },
  ];

  const travelData = [
    { name: "Travel", value: 275 },
    { name: "Non-Travel", value: 554 },
  ];

  const departmentData = [
    { department: "HR", count: 120 },
    { department: "R&D", count: 829 },
    { department: "Sales", count: 300 },
    { department: "Software", count: 450 },
    { department: "Support", count: 200 },
  ];

  const salaryData = [
    { name: "0-5000", value: 82 },
    { name: "5000-10000", value: 67 },
    { name: "10000-20000", value: 138 },
    { name: "20000-30000", value: 171 },
    { name: "30000+", value: 369 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

  // Custom tooltip for all charts with black text color
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <p style={{ margin: 0, color: "black" }}>{`${
            payload[0].name || label
          }: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
    value,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="hr-dashboard">
      <div className="">
        <h3>HR Dashboard - Mr Excel Tamil</h3>
      </div>

      <div className="dashboard-griddsd">
        <div className="wdwed_wdi98">
          <div className="eddhyw_ucc3">
            <div className="metric-card">
              <h2>829</h2>
              <p>Employee</p>
            </div>

            <div className="metric-card">
              <h2>38</h2>
              <p>Avg. Age</p>
            </div>
          </div>

          <div className="eddhyw_ucc3">
            <div className="metric-card">
              <h2>113</h2>
              <p>Avg. Hour Rate</p>
            </div>

            <div className="metric-card">
              <h2>798</h2>
              <p>Avg. Daily Rate</p>
            </div>
          </div>
        </div>

        <div className="gender-card">
          <div className="gender-stats">
            <div className="gender-item">
              <div className="gender-iconss">
                <p>424</p>
                <WomanIcon className="gender-iconssedd female" />

                <p>Female</p>
              </div>
            </div>
            <div className="gender-item ">
              <div className="gender-iconss">
                <p>405</p>
                <ManIcon className="gender-iconssedd male" />

                <p>Male</p>
              </div>
            </div>
          </div>
        </div>

        <div className="department-card">
          <h3>Department</h3>
          <br />

          <ul className="department-list">
            <li>Hardware</li>
            <li>HR</li>
            <li>R&D</li>
            <li>Sales</li>
            <li>Software</li>
            <li>Support</li>
          </ul>
        </div>

        <div className="department-chart-card">
          <h3>Employee Count by Department</h3>
          <br />
          <BarChart
            width={290}
            height={190}
            fontSize={12}
            data={departmentData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#FFBB28" />
          </BarChart>
        </div>

        <div className="travel-chart-card">
          <h3>Travel Vs Non-Travel</h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <PieChart width={150} height={200}>
              <Pie
                data={travelData}
                cx={75}
                cy={100}
                innerRadius={45}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                labelLine={false}
              >
                {travelData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>

            <div style={{ marginRight: "10px" }}>
              {travelData.map((entry, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "8px 0",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: COLORS[index % COLORS.length],
                      marginRight: "8px",
                    }}
                  />
                  <span style={{ fontSize: "12px" }}>
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ratings-chart-card">
          <h3>Employee by Ratings</h3>
          <BarChart width={290} height={190} fontSize={12} data={ratingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </div>

        <div className="department-card">
          <h3>Salary Range</h3>
          <br />

          <ul className="department-list">
            <li>0-5000</li>
            <li>5000-10000</li>
            <li>10000-20000</li>
            <li>20000-30000</li>
            <li>30000-40000</li>
            <li>40000-50000</li>
          </ul>
        </div>

        <div
          className="salary-chart-card"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px",
          }}
        >
          <h3>As per Salary Range</h3>

          <PieChart
            width={300}
            height={200}
            fontSize={12}
            className="evfjke_c2"
          >
            <Pie
              data={salaryData}
              cx={120}
              cy={100}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {salaryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              width={155}
              height={120}
              className="hgfyt_fy"
              layout="vertical"
              align="right"
              verticalAlign="middle"
            />
          </PieChart>
        </div>
      </div>
    </div>
  );
};


export default HRDashBBoardNew;

