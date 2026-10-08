import React, { useState } from "react";
import "./Card.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimateSharedLayout } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";

import Treatments from "../../Assets/Treatments.avif";
import InputOutput from "../../Assets/InputOutput.avif";
import Radiology from "../../Assets/Radiology.jpg";
import Drug from "../../Assets/Drug.webp";
import OTBooking from "../../Assets/OTBooking.jpg";
import NurseProgress from "../../Assets/NurseProgress.jpg";
import ConsentForm from "../../Assets/ConsentForm.webp";
import Billing from "../../Assets/Billing.jpg";
import DischargeSum from "../../Assets/DischargeSum.jpg";
import OperationPro from "../../Assets/OperationPro.jpg";
import Vitalss from "../../Assets/Vitalss.webp";
import LabReport from "../../Assets/LabReport.jpg";

const Data = [
  {
    title: "Treatment",
    color: {
      backgroundImage: Treatments,
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "2px 10px 15px -6px",
    },
    series: [
      {
        name: "Treatment",
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
  {
    title: "Operation Procedure",
    color: {
      backgroundImage: OperationPro,
      backGround:
        "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
      boxShadow: "2px 10px 15px -6px",
    },
    barValue: 60,
    value: "4,270",
    series: [
      {
        name: "Operation Procedure",
        data: [10, 25, 15, 30, 12, 15, 20],
      },
    ],
  },
  {
    title: "Vitals",
    color: {
      backgroundImage: Vitalss,
      backGround:
        "linear-gradient(rgb(142 152 225) -146.42%, rgb(135 144 255) -46.42%)",
      boxShadow: "2px 10px 15px -6px",
    },
    barValue: 60,
    value: "4,270",
    series: [
      {
        name: "Vitals",
        data: [10, 25, 15, 30, 12, 15, 20],
      },
    ],
  },
  {
    title: "Lab Request & Report",
    color: {
      backgroundImage: LabReport,
      backGround:
        "linear-gradient(rgb(173 240 215) -146.42%, rgb(110 222 156) -46.42%)",
      boxShadow: "2px 10px 15px -6px",
    },
    barValue: 60,
    value: "4,270",
    series: [
      {
        name: "Lab Request & Report",
        data: [10, 25, 15, 30, 12, 15, 20],
      },
    ],
  },
  {
    title: "Radiology Request & Report",
    color: {
      backgroundImage: Radiology,
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "2px 10px 15px -6px",
    },
    series: [
      {
        name: "Radiology Request & Report",
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
  {
    title: "Drug Administration",
    color: {
      backgroundImage: Drug,
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "2px 10px 15px -6px",
    },
    series: [
      {
        name: "Drug Administration",
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
  {
    title: "Input Output Chart",
    color: {
      backgroundImage: InputOutput,
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "2px 10px 15px -6px",
    },
    series: [
      {
        name: "Input Output Chart",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
  },
  {
    title: "OT Booking Details",
    color: {
      backgroundImage: OTBooking,
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "2px 10px 15px -6px",
    },
    series: [
      {
        name: "OT Booking Details",
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
  {
    title: "Consent Forms",
    color: {
      backgroundImage: ConsentForm,
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "2px 10px 15px -6px",
    },
    series: [
      {
        name: "Consent Forms",
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
  {
    title: "Nurse Progress Notes",
    color: {
      backgroundImage: NurseProgress,
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "2px 10px 15px -6px",
    },
    series: [
      {
        name: "Nurse Progress Notes",
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
  {
    title: "Billing",
    color: {
      backgroundImage: Billing,
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "2px 10px 15px -6px",
    },
    series: [
      {
        name: "Billing",
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
  {
    title: "Discharge Summary",
    color: {
      backgroundImage: DischargeSum,
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "2px 10px 15px -6px",
    },
    series: [
      {
        name: "Discharge Summary",
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
];

const Card = () => {
  
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <AnimateSharedLayout>
      {Data.map((item, index) => (
        expandedIndex === index ? (
          <ExpandedCard key={index} param={item} setExpanded={() => setExpandedIndex(null)} />
        ) : (
          <CompactCard key={index} param={item} setExpanded={() => setExpandedIndex(index)} />
        )
      ))}
    </AnimateSharedLayout>
  );
};

// Compact Card
function CompactCard({ param, setExpanded }) {
  // Define the style with the appropriate background handling
  const cardStyle = {
    backgroundImage: param.color.backgroundImage
      ? `url(${param.color.backgroundImage})`
      : param.color.backGround,
    boxShadow: param.color.boxShadow,
  };

  return (
    <motion.div
      className="CompactCard"
      style={cardStyle}
      layoutId="expandableCard"
      onClick={setExpanded}
    >
      <div className="content_pp">
        <span className="title_pl">{param.title}</span>
        <div className="detail">
          {/* You can put any content here, e.g., icons */}
        </div>
      </div>
    </motion.div>
  );
}

// Expanded Card
function ExpandedCard({ param, setExpanded }) {
  const data = {
    options: {
      chart: {
        type: "area",
        height: "auto",
      },
      dropShadow: {
        enabled: false,
        enabledOnSeries: undefined,
        top: 0,
        left: 0,
        blur: 3,
        color: "#000",
        opacity: 0.35,
      },
      fill: {
        colors: ["#fff"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["white"],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      grid: {
        show: true,
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
      },
    },
  };

  // Define the style with the appropriate background handling
  const expandedCardStyle = {
    backgroundImage: param.color.backgroundImage
      ? `url(${param.color.backgroundImage})`
      : param.color.backGround,
    boxShadow: param.color.boxShadow,
  };

  return (
    <motion.div
      className="ExpandedCard"
      style={expandedCardStyle}
      layoutId="expandableCard"
    >
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <UilTimes onClick={setExpanded} />
   

      </div>

      <span>{param.title}</span>

      <div className="chartContainer">
        <Chart options={data.options} series={param.series} type="area" />
      </div>

    </motion.div>
  );
}

export default Card;

