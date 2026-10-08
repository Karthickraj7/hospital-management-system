import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Button from "@mui/material/Button";
// import "../IPNurseflow/IpNurseVitals.css";
import EditIcon from "@mui/icons-material/Edit";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";

export default function FrequencyMaster() {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log("userRecord", userRecord);

  const [page, setPage] = useState(0);
  const [summa, setSumma] = useState([]);
  const [getdatastate, setGetDataState] = useState(false);
  const [editrow, seteditrow] = useState(null);
  const [VitalFormData, setVitalFormData] = useState({
    FrequencyType: "",
    Frequency: "",
    FrequencyTime: "",
    FrequencyName: "",
  });
  const [selectedTimes, setSelectedTimes] = useState([]);


  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  setVitalFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  if (name === "FrequencyTime") {
    const times = value.split(",").map((t) => t.trim()).filter(Boolean);
    setSelectedTimes(times);
  }
};



  const blockInvalidChar = (e) =>
    ["e", "E", "+"].includes(e.key) && e.preventDefault();
 // Automatically calculate time ranges based on frequency pattern



  // Automatically calculate time ranges based on frequency pattern
  const getTimeRanges = (frequency) => {
    const timeOptions = 24; // Total time slots (1 to 28)
    const frequencySegments = frequency.split("-");
    const segmentLength = Math.ceil(timeOptions / frequencySegments.length);

    return frequencySegments.map((_, index) => ({
      start: index * segmentLength + 1,
      end: Math.min((index + 1) * segmentLength, timeOptions),
    }));
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => i + 1); // Time slots from 1 to 28

  // Define colors for each range
  const rangeColors = [
    { start: 1, end: 7, color: "lightgreen" }, // Color for range 1-7
    { start: 8, end: 14, color: "lightblue" }, // Color for range 8-14
    { start: 15, end: 19, color: "lightcoral" }, // Color for range 15-21
    { start: 19, end: 24, color: "chocolate" }, // Color for range 22-28
  ];

  const toggleTimeSelection = (time) => {
    if (!VitalFormData.Frequency) return;

    // Split the Frequency string into segments (e.g., "1-0-1-1" => [1, 0, 1, 1])
    const frequencySegments = VitalFormData.Frequency.split("-").map((seg) => parseInt(seg));

    const isRangeSelectable = (index) => frequencySegments[index] === 1;

    const timeRanges = getTimeRanges(VitalFormData.Frequency);

    const getRangeIndex = (time) => {
      return timeRanges.findIndex(range => time >= range.start && time <= range.end);
    };

    const rangeIndex = getRangeIndex(time);

    if (selectedTimes.includes(time)) {
      const updatedTimes = selectedTimes.filter((t) => t !== time);
      setSelectedTimes(updatedTimes);
      setVitalFormData((prev) => ({
        ...prev,
        FrequencyTime: updatedTimes.sort((a, b) => +a - +b).join(","),
      }));
    } else {
      // Check if the time belongs to a valid range and is selectable
      if (rangeIndex !== -1 && isRangeSelectable(rangeIndex)) {
        const selectedInThisRange = selectedTimes.filter(
          (t) => getRangeIndex(t) === rangeIndex
        ).length;

        if (selectedInThisRange < frequencySegments[rangeIndex]) {
          const updatedTimes = [...selectedTimes, time];
          setSelectedTimes(updatedTimes);
          setVitalFormData((prev) => ({
            ...prev,
            FrequencyTime: updatedTimes.sort((a, b) => +a - +b).join(","),
          }));
        }
      }
    }
  };


  const handleeditrow = (params) => {
    const dataaa = params.row;
    setSelectedTimes([]);
    setVitalFormData({
      FrequencyType: dataaa.FrequencyType,
      Frequency: dataaa.Frequency,
      FrequencyTime: dataaa.FrequencyTime,
      FrequencyName: dataaa.FrequencyName,
    });
    seteditrow(dataaa.id);
    const splitedtime = dataaa.FrequencyTime.split(",");

    setSelectedTimes(splitedtime);
  };

  const handleeditstatus = (params) => {
    const AllSendData = {
      FrequencyName: params.row.FrequencyName,
      FrequencyType: params.row.FrequencyType,
      Frequency: params.row.Frequency,
      FrequencyTime: params.row.FrequencyTime,
      Frequency_Id: params.row.Frequency_Id,
      Status: params.row.Status === "Active" ? "InActive" : "Active",
      Location: userRecord?.location,
      CapturedBy: userRecord?.username,
    };
    console.log("AllSendData", AllSendData);
    axios
      .post(`${UrlLink}Masters/insert_frequency_masters`, AllSendData)
      .then((response) => {
        console.log(response);
        if (response.data?.message) {
          alert(response.data?.message);
        }
        cleardata();
        setSelectedTimes([]);
        setGetDataState(!getdatastate);
        seteditrow(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };
  const getTextWidth = (text) => {
    const dummyElement = document.createElement("span");
    dummyElement.textContent = text;
    dummyElement.style.visibility = "hidden";
    dummyElement.style.whiteSpace = "nowrap";
    document.body.appendChild(dummyElement);

    const width = dummyElement.offsetWidth;

    document.body.removeChild(dummyElement);

    return width;
  };
  const dynamicColumns = [
    {
      key: "Frequency_Id",
      name: "S No",
    },
    ...Object.keys(VitalFormData).map((labelname) => {
      const formattedLabel = formatLabel(labelname);
      const labelWidth = getTextWidth(formattedLabel);

      return {
        key: labelname,
        name: formattedLabel,
      };
    }),
    {
      key: "Status",
      name: "Status",
      renderCell: (params) => (
        <Button className="cell_btn" onClick={() => handleeditstatus(params)}>
          {params.row.Status}{" "}
          {/* Ensure you're accessing the value correctly */}
        </Button>
      ),
    },
    {
      key: "actions",
      name: "Actions",
      renderCell: (params) => (
        <Button className="cell_btn" onClick={() => handleeditrow(params)}>
          <EditIcon />
        </Button>
      ),
    },
  ];

  const cleardata = () => {
    setVitalFormData({
      FrequencyType: "",
      Frequency: "",
      FrequencyTime: "",
      FrequencyName: "",
    });
  };
  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/insert_frequency_masters`)
      .then((response) => {
        const data = response.data.map((p, index) => ({
          ...p,
          id: p.Frequency_Id,
        }));
        setSumma(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [getdatastate]);

  const PostVitalData = () => {
    const requiredFields = ["FrequencyType", "Frequency", "FrequencyTime"];
    const existing = requiredFields.filter((field) => !VitalFormData[field]);

    if (existing.length > 0) {
      alert("Please fill empty fields: " + existing.join(","));
    } else {
      const maxSelections = VitalFormData.Frequency.split("-").reduce(
        (acc, val) => acc + parseInt(val),
        0
      );
      const maxtime = VitalFormData.FrequencyTime.split(",").length;
      if (maxSelections > maxtime) {
        alert(
          `The selected frequency is ${maxSelections} but the selected time is ${maxtime}`
        );
      } else {
        const AllSendData = {
          ...VitalFormData,
          Frequency_Id: editrow,
          Status: "Active",
          Location: userRecord?.location,
          CapturedBy: userRecord?.username,
        };
        console.log("AllSendData", AllSendData);
        axios
          .post(
            `${UrlLink}Masters/${
              editrow ? "insert_frequency_masters" : "insert_frequency_masters"
            }`,
            AllSendData
          )
          .then((response) => {
            console.log(response);
            if (response.data?.message) {
              alert(response.data?.message);
            }
            cleardata();
            setSelectedTimes([]);
            setGetDataState(!getdatastate);
            seteditrow(null);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  return (
    <>
      <div className="common_center_tag">
        <span> Frequency Master</span>
      </div>
      <br />
      <div className="RegisFormcon">
        {Object.keys(VitalFormData).map((labelname, index) => (
          <div className="RegisForm_1" key={index}>
            <label>
              {formatLabel(labelname)} <span>:</span>
            </label>
            {labelname === "FrequencyType" ? (
              <select
                name={labelname}
                value={VitalFormData[labelname]}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="BeforeFood">BeforeFood</option>
                <option value="AfterFood">AfterFood</option>
              </select>
            ) : (
              <>
               <input
  type="text"
  name={labelname}
  onKeyDown={blockInvalidChar}
  value={VitalFormData[labelname]}
  onChange={handleInputChange}
/>

                {/* {labelname === "Frequency" && (
                    <datalist id="frequencyList">
                      <option value="1-0-1"/>
                    </datalist>
                  )} */}
              </>
            )}
          </div>
        ))}
      </div>
      <br />
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: "100%",
          gap: "10px",
        }}
      >
        <span style={{ color: "grey", fontSize: "16px", fontWeight: "600" }}>
          Time Frequency
        </span>
        <div className="Timeselectorr">
          {timeOptions.map((time) => {
            const timeRanges = getTimeRanges(VitalFormData.Frequency);
            const rangeIndex = timeRanges.findIndex(
              (range) => time >= range.start && time <= range.end
            );

            const isSelectable =
              rangeIndex !== -1 && VitalFormData.Frequency && VitalFormData.Frequency.split("-")[rangeIndex] === "1";

            // Determine the background color
            let backgroundColor;
            if (selectedTimes.includes(time)) {
              backgroundColor = "purple"; // Color when selected
            } else if (isSelectable) {
              backgroundColor = rangeColors[rangeIndex]?.color; // Color based on range
            } else {
              backgroundColor = "lightgray"; // Color when disabled
            }

            const timeStyle = {
              backgroundColor: backgroundColor,
              padding: "5px",
              margin: "3px",
              cursor: isSelectable ? "pointer" : "not-allowed",
              borderRadius: "5px",
              color: "white", // Text color for better contrast with brown
            };

            return (
              <span
                key={time}
                style={timeStyle}
                onClick={() => (isSelectable ? toggleTimeSelection(time) : null)}
              >
                {time}
              </span>
            );
          })}
        </div>
      </div>
      <br />
      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={PostVitalData}>
          {editrow ? "Update" : "Add"}
        </button>
      </div>
      {summa.length > 0 && (
        <ReactGrid columns={dynamicColumns} RowData={summa} />
      )}

      <ToastContainer />
    </>
  );
}
