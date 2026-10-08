import React, { useState, useRef, useEffect } from "react";
import "./TimePicker.css";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const TimePicker = ({ value, onChange }) => {
  const [time, setTime] = useState(
    value || { hours: "", minutes: "", period: "AM" }
  );
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const typingTimeoutRef = useRef({});

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateInput = (key, value) => {
    if (!value) return "";
    let num = parseInt(value, 10);
    if (isNaN(num)) return "";
    if (key === "hours")
      return num > 12 ? "12" : num < 1 ? "1" : num.toString();
    if (key === "minutes")
      return num > 59 ? "59" : num < 0 ? "0" : num.toString();
    return value;
  };

  const handleTimeChange = (key, value) => {
    const updatedTime = { ...time, [key]: validateInput(key, value) };

    setTime(updatedTime);

    if (onChange) {
      onChange(
        `${updatedTime.hours}:${updatedTime.minutes} ${updatedTime.period}`
      );
    }

    if (typingTimeoutRef.current[key])
      clearTimeout(typingTimeoutRef.current[key]);

    typingTimeoutRef.current[key] = setTimeout(() => {
      setTime((prev) => ({
        ...prev,
        [key]: prev[key].length === 1 ? prev[key].padStart(2, "0") : prev[key],
      }));
    }, 1000);
  };

  // Handle Arrow Key Up/Down for Hours & Minutes
  const handleArrowKeys = (key, direction) => {
    setTime((prevTime) => {
      let newValue = parseInt(prevTime[key] || "1", 10);
      if (direction === "up") {
        if (key === "hours") newValue = newValue === 12 ? 1 : newValue + 1;
        if (key === "minutes") newValue = newValue === 59 ? 0 : newValue + 1;
      } else {
        if (key === "hours") newValue = newValue === 1 ? 12 : newValue - 1;
        if (key === "minutes") newValue = newValue === 0 ? 59 : newValue - 1;
      }

      const updatedTime = {
        ...prevTime,
        [key]: newValue.toString().padStart(2, "0"),
      };
      onChange &&
        onChange(
          `${updatedTime.hours}:${updatedTime.minutes} ${updatedTime.period}`
        );
      return updatedTime;
    });
  };

  return (
    <div className="timepicker-container">
      <div className="timepicker-input-container">
        <input
          type="text"
          className="timepicker-input"
          value={
            time.hours && time.minutes
              ? `${time.hours}:${time.minutes} ${time.period}`
              : ""
          }
          placeholder="HH:MM"
          readOnly
          onClick={() => setShowPicker(true)}
        />
      </div>

      {showPicker && (
        <div ref={pickerRef} className="timepicker-popup">
          <input
            type="text"
            className="timepicker-field"
            maxLength="2"
            placeholder="HH"
            value={time.hours}
            onChange={(e) => handleTimeChange("hours", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") handleArrowKeys("hours", "up");
              if (e.key === "ArrowDown") handleArrowKeys("hours", "down");
            }}
          />

          <span className="timepicker-separator">:</span>

          <input
            type="text"
            className="timepicker-field"
            maxLength="2"
            placeholder="MM"
            value={time.minutes}
            onChange={(e) => handleTimeChange("minutes", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") handleArrowKeys("minutes", "up");
              if (e.key === "ArrowDown") handleArrowKeys("minutes", "down");
            }}
          />
 <span className="timepicker-separator">:</span>
          <select
            value={time.period}
            onChange={(e) => {
              const newPeriod = e.target.value;
              setTime((prev) => {
                const updatedTime = { ...prev, period: newPeriod };
                onChange(
                  `${updatedTime.hours}:${updatedTime.minutes} ${updatedTime.period}`
                );
                return updatedTime;
              });
            }}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>

          {/* <button
            className="timepicker-set-button"
            onClick={() => setShowPicker(false)}
          >
            <CheckCircleOutlineIcon />
          </button> */}
        </div>
      )}
    </div>
  );
};

export default TimePicker;
