import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

function DutyRoster() {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const [Branch, setBranch] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const DeptShiftMasterEdit = useSelector(
    (state) => state.Frontoffice?.DeptShiftMasterEdit
  );
  console.log(DeptShiftMasterEdit);

  // Initialize DayOff in state (false by default)
  const [dutyMasterData, setDutyMasterData] = useState({
    ShiftId: "",
    Branch: "",
    BranchID: "",
    ShiftName: "",
    DayOff: false,
    StartTime: "",
    EndTime: "",
    ShiftHours: "",
    ShiftOrder: "",
  });
  console.log(dutyMasterData);
  const [IsdutyGet, setIsDutyGet] = useState(false);
  const [dutyData, setDutyData] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [shiftCounter, setShiftCounter] = useState(1);

  const [is_edit, setis_edit] = useState(false);
  const [Statusedit, setStatusedit] = useState(false);

  useEffect(() => {
    if (DeptShiftMasterEdit && Object.keys(DeptShiftMasterEdit).length > 0) {
      setDutyMasterData((prev) => ({
        ...prev,
        Branch: DeptShiftMasterEdit?.department_name,
        BranchID: DeptShiftMasterEdit?.BranchID,
      }));
      setis_edit(true);
      setShifts(DeptShiftMasterEdit?.shifts);
    }
  }, [DeptShiftMasterEdit]);

  const generateTimeOptions = () => {
    const times = [];
    const periods = ["AM", "PM"];

    for (let hour = 1; hour <= 12; hour++) {
      for (let min = 0; min < 60; min += 30) {
        for (let period of periods) {
          const formattedTime = `${hour}:${min === 0 ? "00" : min} ${period}`;
          times.push(formattedTime);
        }
      }
    }
    return times;
  };

  const calculateShiftHours = (fromTime, toTime) => {
    // If either time is missing or set to "None", return an empty string
    if (!fromTime || !toTime || fromTime === "None" || toTime === "None")
      return "";

    // Here, adjust the parsing if your time strings are in AM/PM format.
    // For simplicity, assuming 24-hour format "HH:MM"
    const [fromHour, fromMinute] = fromTime.split(":").map(Number);
    const [toHour, toMinute] = toTime.split(":").map(Number);

    let fromDate = new Date(0, 0, 0, fromHour, fromMinute);
    let toDate = new Date(0, 0, 0, toHour, toMinute);

    // If shift ends the next day
    if (toDate < fromDate) {
      toDate.setDate(toDate.getDate() + 1);
    }

    let diff = (toDate - fromDate) / 1000 / 60; // Difference in minutes
    let hours = Math.floor(diff / 60);
    let minutes = diff % 60;

    return `${hours} hr ${minutes} min`;
  };

  const handleChange = (e) => {
    const { name, type } = e.target;
    // For checkboxes, use checked value
    const value = type === "checkbox" ? e.target.checked : e.target.value;

    setDutyMasterData((prevData) => {
      let newData = { ...prevData, [name]: value };

      if (name === "Branch") {
        const selectedBranch = Branch.find((dpt) => dpt.locationName === value);
        newData.BranchID = selectedBranch?.id || "";
      }

      if ((name === "StartTime" || name === "EndTime") && !prevData.DayOff) {
        newData.ShiftHours = calculateShiftHours(
          name === "StartTime" ? value : prevData.StartTime,
          name === "EndTime" ? value : prevData.EndTime
        );
      }

      if (name === "DayOff") {
        if (value) {
          // When DayOff is checked, set time values to "None"
          newData.StartTime = null;
          newData.EndTime = null;
          newData.ShiftHours = null;
        } else {
          // When unchecked, clear time values so the user can enter them
          newData.StartTime = "";
          newData.EndTime = "";
          newData.ShiftHours = "";
        }
      }

      return newData;
    });
  };

  const addShift = () => {
    // When DayOff is checked, time fields are not required.
    if (
      dutyMasterData.ShiftName &&
      (dutyMasterData.DayOff ||
        (dutyMasterData.StartTime && dutyMasterData.EndTime)) &&
      dutyMasterData.BranchID
    ) {
      if (dutyMasterData.ShiftId) {
        setShifts((prevShifts) =>
          prevShifts.map((shift) =>
            shift.ShiftId === dutyMasterData.ShiftId ? dutyMasterData : shift
          )
        );
      } else {
        setShifts((prevShifts) => [
          ...prevShifts,
          { ...dutyMasterData, ShiftId: shiftCounter },
        ]);
        setShiftCounter((prevCounter) => prevCounter + 1);
      }

      setDutyMasterData({
        ShiftId: "",
        Branch: dutyMasterData.Branch,
        BranchID: dutyMasterData.BranchID,
        ShiftName: "",
        DayOff: false,
        StartTime: "",
        EndTime: "",
        ShiftHours: "",
        ShiftOrder: "",
      });
    } else {
      const mess = "Please add at least one shift.";
      const type = "warn";
      dispatch({ type: "toast", value: { message: mess, type } });
    }
  };

  const handleDutyMasterSubmit = async () => {
    console.log(shifts);
    if (shifts.length > 0) {
      const dataToSend = shifts.map((shift) => ({
        ...shift,
        Location: userRecord?.location || "",
        Created_by: userRecord?.username || "",
        is_edit: is_edit,
        Statusedit: Statusedit,
       
      }));
      console.log(dataToSend);

      try {
        const res = await axios.post(
          `${UrlLink}HR_Management/DutyRosterMasters`,
          dataToSend
        );
        console.log(res.data);
        const rest = res.data;
        console.log(rest);
        const type = Object.keys(rest)[0];
        const mess = Object.values(rest)[0];

        dispatch({ type: "toast", value: { message: mess, type } });

        setIsDutyGet((prev) => !prev);
        setShifts([]);
        setDutyMasterData({
          ShiftId: "",
          Branch: "",
          BranchID: "",
          ShiftName: "",
          DayOff: false,
          StartTime: "",
          EndTime: "",
          ShiftHours: "",
          ShiftOrder: "",
        });
        setShiftCounter(1);
        navigate("/Home/HR");
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      dispatch({
        type: "toast",
        value: { message: "Please add at least one shift.", type: "warn" },
      });
    }
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Location_Detials_link`)
      .then((res) => setBranch(res.data))
      .catch((err) => console.error(err));
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/Duty_Master`)
      .then((response) => setDutyData(response.data))
      .catch((err) => console.error(err));
  }, [IsdutyGet, UrlLink]);

  const handleEditDuty = (params) => {
    setDutyMasterData({
      ShiftId: params.row.ShiftId,
      Branch: params.row.Branch,
      BranchID: params.row.BranchID,
      ShiftName: params.row.ShiftName,
      DayOff: params.row.DayOff || false,
      StartTime: params.row.StartTime,
      EndTime: params.row.EndTime,
      ShiftHours: params.row.ShiftHours,
      ShiftOrder: params.row.ShiftOrder,
    });
  };

  const handleDeleteShift = (shiftId) => {
    setShifts((prevShifts) =>
      prevShifts.filter((shift) => shift.ShiftId !== shiftId)
    );
  };

  const DutyMasterColumn = [
    { key: "ShiftId", name: "ShiftId", frozen: true },
    { key: "Branch", name: "Branch", frozen: true },
    { key: "ShiftName", name: "Shift Name", frozen: true },
    {
      key: "DayOff",
      name: "Day Off",
      renderCell: (params) => (
        <span>{params.row.DayOff === true ? "Yes" : "No"}</span>
      ),
    },
    { key: "StartTime", name: "Start Time" },
    { key: "EndTime", name: "End Time" },
    { key: "ShiftHours", name: "Total Hours" },
    {
      key: "Edit",
      name: "Edit",
      renderCell: (params) => (
        <Button className="cell_btn" onClick={() => handleEditDuty(params)}>
          <EditIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
    {
      key: "Delete",
      name: "Delete",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleDeleteShift(params.row.ShiftId)}
        >
          <DeleteIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];

  const formFields = [
    { key: "Branch", label: "Branch", list: "Branch" },
    { key: "ShiftName", label: "Shift Name" },
    { key: "DayOff", label: "Day/Week  Off", type: "checkbox" },
    { key: "StartTime", label: "From Time", type: "time" },
    { key: "EndTime", label: "To Time", type: "time" },
    { key: "ShiftHours", label: "Shift Hours" },
    // { key: "ShiftOrder", label: "Shift Order" },
  ];

  return (
    <div className="Main_container_app">
      <h3>Duty Roster Master</h3>
      <br />
      <div className="RegisFormcon_1">
        {formFields.map((field) => {
          // Hide time fields if DayOff is checked
          if (
            dutyMasterData.DayOff &&
            (field.key === "StartTime" ||
              field.key === "EndTime" ||
              field.key === "ShiftHours")
          ) {
            return null;
          }
          return (
            <div className="RegisForm_1" key={field.key}>
              <label>
                {field.label} <span>:</span>
              </label>
              {field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  name={field.key}
                  checked={dutyMasterData[field.key] || false}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.key}
                  value={dutyMasterData[field.key] || ""}
                  onChange={handleChange}
                  list={field.list || undefined}
                  autoComplete="off"
                  disabled={field.disabled}
                />
              )}
              {field.list === "Branch" && (
                <datalist id={field.list}>
                  {Branch.map((dpt) => (
                    <option key={dpt.id} value={dpt.locationName} />
                  ))}
                </datalist>
              )}
            </div>
          );
        })}
      </div>
      <br />
      <div className="Main_container_Btn">
        <button onClick={addShift}>
          {dutyMasterData.ShiftId ? "Update Shift" : "Add Shift"}
        </button>
        <button onClick={handleDutyMasterSubmit}>Save</button>
      </div>
      {console.log(shifts)}
      {shifts.length > 0 && (
        <ReactGrid columns={DutyMasterColumn} RowData={shifts} />
      )}
      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
}

export default DutyRoster;
