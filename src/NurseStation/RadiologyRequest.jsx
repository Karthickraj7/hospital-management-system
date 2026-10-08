import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";

const RadiologyRequest = () => {
  const dispatch = useDispatch();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const [rowData, setRowData] = useState([]);
  const [dateOption, setDateOption] = useState("current");
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [particularDate, setParticularDate] = useState("");
  const [searchParams, setSearchParams] = useState({
    query: "",
    status: "Request",
  });
  const [getDataTrigger, setGetDataTrigger] = useState(false);

  // Column definitions with safeguard for row.tests
  const columnDefs = [
    { key: "id", name: "S.No" },
    { key: "PatientId", name: "Patient ID" },
    { key: "PatientName", name: "Patient Name" },
    { key: "PhoneNumber", name: "Phone Number" },
    { key: "RegisterType", name: "Register Type" },
    { key: "DoctorId", name: "Doctor ID" },
    { key: "DoctorName", name: "Doctor Name" },
    {
      key: "tests",
      name: "Radiology Name",
      renderCell: ({ row }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {(row.tests || []).map((test, index) => (
            <div key={index}>{test.RadiologyName || "N/A"}</div>
          ))}
        </div>
      ),
    },
    {
      key: "tests",
      name: "Test Code",
      renderCell: ({ row }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {(row.tests || []).map((test, index) => (
            <div key={index}>{test.TestCode || "N/A"}</div>
          ))}
        </div>
      ),
    },
    {
      key: "tests",
      name: "Test Name",
      renderCell: ({ row }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {(row.tests || []).map((test, index) => (
            <div key={index}>{test.TestName || "N/A"}</div>
          ))}
        </div>
      ),
    },
    {
      key: "tests",
      name: "Status",
      renderCell: ({ row }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {(row.tests || []).map((test, index) => (
            <div key={index}>{test.Status || "N/A"}</div>
          ))}
        </div>
      ),
    },
    {
      key: "tests",
      name: "Amount",
      renderCell: ({ row }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {(row.tests || []).map((test, index) => (
            <div key={index}>{test.Amount || "N/A"}</div>
          ))}
        </div>
      ),
    },
    {
      key: "tests",
      name: "Booking Fees",
      renderCell: ({ row }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {(row.tests || []).map((test, index) => (
            <div key={index}>{test.BookingFees || "N/A"}</div>
          ))}
        </div>
      ),
    },
    {
      key: "tests",
      name: "Report File",
      renderCell: ({ row }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {(row.tests || []).map((test, index) => (
            <div key={index}>
              {test.ChooseFile ? (
                <a href={test.ChooseFile} target="_blank" rel="noopener noreferrer">
                  View Report
                </a>
              ) : (
                "No File"
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "tests",
      name: "Created At",
      renderCell: ({ row }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {(row.tests || []).map((test, index) => (
            <div key={index}>{test.created_at || "N/A"}</div>
          ))}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        let params = {
          dateOption,
          status: searchParams.status, // Use the status from searchParams
        };

        if (dateOption === "current" && currentDate) {
          params.date = currentDate;
        } else if (dateOption === "custom" && fromDate && toDate) {
          params.fromDate = fromDate;
          params.toDate = toDate;
        } else if (dateOption === "particular" && particularDate) {
          params.particularDate = particularDate;
        } else {
          console.warn("No valid date parameters provided");
          setRowData([]);
          return;
        }

        // Add query parameters for search by name or phone
        if (searchParams.query.trim()) {
          params.query = searchParams.query;
        }

        console.log("API Parameters:", params);

        const res = await axios.get(
          `${UrlLink}NurseStation/Radiology_RequestDetails`,
          { params }
        );

        const data = Array.isArray(res.data.IsSubTestNo)
          ? res.data.IsSubTestNo
          : [];
        console.log("API Response:", data);

        // Group data by PatientId
        const groupedData = data.reduce((acc, item, index) => {
          const existingPatient = acc.find(
            (patient) => patient.PatientId === item.PatientId
          );

          const testDetails = {
            RadiologyRequestId: item.RadiologyRequestId,
            RadiologyName: item.RadiologyName,
            TestCode: item.TestCode,
            TestName: item.TestName,
            Status: item.Status,
            Amount: item.Amount,
            BookingFees: item.BookingFees,
            ChooseFile: item.ChooseFile,
            created_at: item.created_at,
          };

          if (existingPatient) {
            existingPatient.tests.push(testDetails);
          } else {
            acc.push({
              id: acc.length + 1, // S.No based on grouped data
              PatientId: item.PatientId,
              PatientName: item.PatientName,
              PhoneNumber: item.PhoneNumber,
              RegisterType: item.RegisterType,
              DoctorId: item.DoctorId,
              DoctorName: item.DoctorName,
              tests: [testDetails],
            });
          }

          return acc;
        }, []);

        console.log("Grouped Data:", groupedData);
        setRowData(groupedData);
      } catch (error) {
        console.error("Error fetching radiology request data:", error);
        setRowData([]);
        const tdata = {
          message:
            error.response?.data?.warn ||
            error.response?.data?.error ||
            "Failed to fetch radiology request data.",
          type: "error",
        };
        dispatch({ type: "toast", value: tdata });
      }
    };

    fetchData();
  }, [dateOption, currentDate, fromDate, toDate, particularDate, searchParams, UrlLink, dispatch, getDataTrigger]);

  const handleDateOptionChange = (e) => {
    setDateOption(e.target.value);
    setSearchParams({ ...searchParams, query: "", status: "Request" }); // Reset filters
    setFromDate("");
    setToDate("");
    setParticularDate("");
    if (e.target.value === "current") {
      setCurrentDate(new Date().toISOString().split("T")[0]);
    } else {
      setCurrentDate("");
    }
    setGetDataTrigger((prev) => !prev);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
    setGetDataTrigger((prev) => !prev);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "currentDate") setCurrentDate(value);
    if (name === "fromDate") setFromDate(value);
    if (name === "toDate") setToDate(value);
    if (name === "particularDate") setParticularDate(value);
    setGetDataTrigger((prev) => !prev);
  };

  return (
    <div className="Main_container_app">
      <h3>Radiology Request Details</h3>
      <br />

      <div className="search_div_bar">
        <div className="search_div_bar_inp_1">
          <label>
            Date <span>:</span>
          </label>
          <select value={dateOption} onChange={handleDateOptionChange}>
            <option value="current">Current Date</option>
            <option value="custom">Custom Date</option>
            <option value="particular">Particular Date</option>
          </select>
        </div>

        {dateOption === "current" && (
          <div className="search_div_bar_inp_1">
            <label>
              Current Date <span>:</span>
            </label>
            <input
              type="date"
              name="currentDate"
              value={currentDate}
              onChange={handleDateChange}
              disabled
            />
          </div>
        )}

        {dateOption === "custom" && (
          <>
            <div className="search_div_bar_inp_1">
              <label>
                From <span>:</span>
              </label>
              <input
                type="date"
                name="fromDate"
                value={fromDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="search_div_bar_inp_1">
              <label>
                To <span>:</span>
              </label>
              <input
                type="date"
                name="toDate"
                value={toDate}
                onChange={handleDateChange}
              />
            </div>
          </>
        )}

        {dateOption === "particular" && (
          <div className="search_div_bar_inp_1">
            <label>
              Select Date <span>:</span>
            </label>
            <input
              type="date"
              name="particularDate"
              value={particularDate}
              onChange={handleDateChange}
            />
          </div>
        )}

        <div className="search_div_bar_inp_1">
          <label>
            Search by <span>:</span>
          </label>
          <input
            type="text"
            name="query"
            value={searchParams.query}
            placeholder="Search by name or phone..."
            onChange={handleSearchChange}
          />
        </div>

        <div className="search_div_bar_inp_1">
          <label>
            Status <span>:</span>
          </label>
          <select
            name="status"
            value={searchParams.status}
            onChange={handleSearchChange}
          >
            <option value="Request">Request</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <ReactGrid columns={columnDefs} RowData={rowData} />

      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
};

export default RadiologyRequest;