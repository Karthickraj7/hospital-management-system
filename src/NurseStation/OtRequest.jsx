import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";

const OtRequest = () => {
    const dispatch = useDispatch();
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const toast = useSelector((state) => state.userRecord?.toast);
    const [rowData, setRowData] = useState([]);
    const [dateOption, setDateOption] = useState("current");
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [particularDate, setParticularDate] = useState("");
    const [searchParams, setSearchParams] = useState({
        query: "",
        status: "Requested",
    });
    const [getDataTrigger, setGetDataTrigger] = useState(false);

    const columnDefs = [
        { key: "Sno", name: "S.No" },
        { key: "RegistrationId", name: "Registration ID" },
        { key: "PatientName", name: "Patient Name" },
        { key: "Age", name: "Age" },
        { key: "Gender", name: "Gender" },
        { key: "Status", name: "Status" },
        { key: "Booking_Id", name: "Booking ID" },
        { key: "ReqDate", name: "Request Date" },
        { key: "ReqTime", name: "Request Time" },
        { key: "BookingType", name: "Booking Type" },
        { key: "Specialization_name", name: "Specialization" },
        { key: "SurgeryName", name: "Surgery Name" },
        { key: "TheatreName", name: "Theatre Name" },
        { key: "theatrerent", name: "Theatre Rent" },
        { key: "DoctorName", name: "Doctor Name" },
        { key: "bookingdate", name: "Booking Date" },
        { key: "BookingTime", name: "Booking Time" },
        { key: "Duration", name: "Duration (hrs)" },
        { key: "OperationType", name: "Operation Type" },
        { key: "OperationMode", name: "Operation Mode" },
        { key: "Priority", name: "Priority" },
        { key: "CreatedBy", name: "Created By" },
    ];

    const fetchData = async () => {
        try {
            let params = {
                PhoneNo: "",
                Fname: "",
            };

            if (dateOption === "current" && currentDate) {
                params.date = currentDate;
            } else if (dateOption === "custom" && fromDate && toDate) {
                params.fromDate = fromDate;
                params.toDate = toDate;
            } else if (dateOption === "particular" && particularDate) {
                params.date = particularDate;
            } else {
                setRowData([]);
                return;
            }

            if (searchParams.query.trim()) {
                params.PhoneNo = searchParams.query;
                params.Fname = searchParams.query;
            }
            if (searchParams.status) {
                params.Status = searchParams.status;
            }

            console.log("API Parameters:", params);

            const res = await axios.get(
                `${UrlLink}OT/Theatre_booking_request_details`,
                { params }
            );

            const data = Array.isArray(res.data) ? res.data : [];
            console.log("API Response:", data);
            setRowData(data);
        } catch (error) {
            console.error("Error fetching OT request data:", error);
            setRowData([]);
            const tdata = {
                message: "Failed to fetch OT request data.",
                type: "error",
            };
            dispatch({ type: "toast", value: tdata });
        }
    };

    useEffect(() => {
        fetchData();
    }, [dateOption, currentDate, fromDate, toDate, particularDate, searchParams, UrlLink, dispatch, getDataTrigger]);

    const handleDateOptionChange = (e) => {
        setDateOption(e.target.value);
        setSearchParams({ ...searchParams, query: "", status: "Requested" });
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
            <h3>OT Request Details</h3>
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
                        <option value="Requested">Requested</option>
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

export default OtRequest;