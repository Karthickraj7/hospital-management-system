// src/OtherComponent/ReactGrid/DonatChat.js
import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 16,
  fontWeight: 600,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function DonatChat({ data, title = "Lab Counts" }) {
  const hasData = Array.isArray(data) && data.some((d) => d.value > 0);
  const chartData = hasData
    ? data.map((d, idx) => ({
        id: idx,
        value: d.value,
        label: d.name,
        color: d.color,
      }))
    : [{ id: 0, value: 100, label: "No Data", color: "#d3d3d3" }];

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div style={{ width: "50%", height: 300 }}>
      <PieChart
        series={[
          {
            data: chartData,
            innerRadius: 70,
            outerRadius: 100,
            arcLabel: (item) => `${item.value}`,
          },
        ]}
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "bottom", horizontal: "middle" },
          },
        }}
      >
        <PieCenterLabel>{hasData ? total : "No Data"}</PieCenterLabel>
      </PieChart>
    </div>
  );
}
