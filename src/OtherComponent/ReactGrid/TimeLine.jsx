import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";


const TimeLine = ({ data = [] }) => {
  return (
    <Timeline position="alternate">
      {data.map((item, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent color="text.secondary">
            {item.date}
          </TimelineOppositeContent>

          <TimelineSeparator>
            <TimelineDot color={item.status || "grey"} />
            {index !== data.length - 1 && <TimelineConnector />}
          </TimelineSeparator>

          <TimelineContent>{item.title}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default TimeLine;
