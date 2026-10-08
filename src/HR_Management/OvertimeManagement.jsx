import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const OverTimeManagement = () => {
  const [data, setData] = useState({});
  const [selectedDept, setSelectedDept] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [overtimeData, setOvertimeData] = useState({});
  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  

  const fetchShiftDetails = () =>{
      axios
      .get(`${urllink}/HR_Management/get_shift_details`)
      .then((res) => setData(res.data.departments))
      .catch((err) => console.error(err));

  }

  useEffect(() => {
  fetchShiftDetails();
  }, [urllink]);

  // Helper to format date with day
  const formatDateWithDay = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDeptClick = (dept) => setSelectedDept(dept === "All" ? null : dept);

  // Unique rowId for each row (per employee per date)
  const handleTimeChange = (rowId, field, value) => {
    setOvertimeData((prev) => {
      const prevEntry = prev[rowId] || {};
      const updatedEntry = { ...prevEntry, [field]: value };

      // calculate hours
      if (updatedEntry.start && updatedEntry.end) {
        const startTime = new Date(`1970-01-01T${updatedEntry.start}`);
        const endTime = new Date(`1970-01-01T${updatedEntry.end}`);
        let hours = (endTime - startTime) / 1000 / 3600;
        if (hours < 0) hours = 0;
        updatedEntry.hours = hours.toFixed(2);
      }

      return { ...prev, [rowId]: updatedEntry };
    });
  };

  const handleSelectChange = (rowId, checked) => {
    setOvertimeData((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], selected: checked },
    }));
  };

  const handleSubmit = () => {
  const payload = Object.entries(overtimeData)
    .filter(
      ([_, details]) =>
        details.selected && details.date && details.start && details.end
    )
    .map(([rowId, details]) => {
      // Extract Employee_Shift_ID from rowId or from data
      const [empId, shiftDate] = rowId.split("_");
      const empData = Object.values(data)
        .flat()
        .find(
          (emp) => emp.Employee_ID === empId && emp.ShiftDate === shiftDate
        );

      return {
        Employee_Shift_ID: empData?.Employee_Shift_ID,
        Employee_ID: empData?.Employee_ID,
        Employee_Name: empData?.Employee_Name,
        OTDate: details.date,
        StartTime: details.start,
        EndTime: details.end,
        Hours: details.hours,
      };
    });

  if (payload.length === 0)
    return alert("Please select at least one employee with OT details.");

  axios
    .post(`${urllink}/HR_Management/submit_overtime`, payload)
    .then(() => alert("Overtime submitted successfully!"))
    .catch((err) => console.error(err));
};


  const departments = Object.keys(data);

  const getFilteredData = (dept) =>
    data[dept].filter(
      (emp) =>
        emp.Employee_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.Employee_ID.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div style={{ padding: "10px", fontFamily: "Arial, sans-serif" }}>
      {departments.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Department Filter */}
          <div
            style={{
              marginBottom: "15px",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <button
              onClick={() => handleDeptClick("All")}
              style={{
                padding: "8px 16px",
                borderRadius: "5px",
                border: "1px solid #007BFF",
                backgroundColor: selectedDept === null ? "#007BFF" : "#fff",
                color: selectedDept === null ? "#fff" : "#007BFF",
                cursor: "pointer",
                minWidth: "80px",
              }}
            >
              All
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => handleDeptClick(dept)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "5px",
                  border: "1px solid #007BFF",
                  backgroundColor: selectedDept === dept ? "#007BFF" : "#fff",
                  color: selectedDept === dept ? "#fff" : "#007BFF",
                  cursor: "pointer",
                  minWidth: "80px",
                }}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Search by Employee Name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "300px",
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#28a745",
              color: "#fff",
              cursor: "pointer",
              marginBottom: "15px",
            }}
          >
            Submit Overtime
          </button>

          {/* Table */}
          {(selectedDept ? [selectedDept] : departments).map((dept) => {
            const filtered = getFilteredData(dept);
            if (filtered.length === 0) return null;

            return (
              <div key={dept} style={{ marginBottom: "30px", overflowX: "auto" }}>
                <h2
                  style={{
                    marginBottom: "10px",
                    fontSize: "1.2em",
                    color: "#333",
                  }}
                >
                  {dept}
                </h2>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "900px",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <thead style={{ backgroundColor: "#f0f0f0" }}>
                    <tr>
                      {[
                        "Select",
                        "Employee ID",
                        "Name",
                        "Shift",
                        "Shift Date",
                        "Status",
                        "Location",
                        "OT Date",
                        "OT Start",
                        "OT End",
                        "Hours",
                      ].map((header) => (
                        <th
                          key={header}
                          style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: "bold",
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((emp, index) => {
                      const rowId = `${emp.Employee_ID}_${emp.ShiftDate}`;
 // initial single row per employee
                      const rowData = overtimeData[rowId] || {};

                      return (
                        <tr
                          key={rowId}
                          style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}
                        >
                          <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={rowData.selected || false}
                              onChange={(e) => handleSelectChange(rowId, e.target.checked)}
                            />
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                            {emp.Employee_ID}
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                            {emp.Employee_Name}
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                            {emp.Shift_Id}
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                            {formatDateWithDay(emp.ShiftDate)}
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                            {emp.Status}
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                            {emp.Location_Name}
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                            <input
                              type="date"
                              value={rowData.date || ""}
                              onChange={(e) =>
                                handleTimeChange(rowId, "date", e.target.value)
                              }
                            />
                            {rowData.date && (
                              <div style={{ fontSize: "0.8em", color: "#555" }}>
                                {formatDateWithDay(rowData.date)}
                              </div>
                            )}
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                            <input
                              type="time"
                              value={rowData.start || ""}
                              onChange={(e) =>
                                handleTimeChange(rowId, "start", e.target.value)
                              }
                            />
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                            <input
                              type="time"
                              value={rowData.end || ""}
                              onChange={(e) =>
                                handleTimeChange(rowId, "end", e.target.value)
                              }
                            />
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                            {rowData.hours || 0}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default OverTimeManagement;
