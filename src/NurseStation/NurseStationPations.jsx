import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";

const NurseStationPations = () => {
    const dispatch = useDispatch();
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const toast = useSelector((state) => state.userRecord?.toast);
    const UserData = useSelector((state) => state.userRecord?.UserData);

    // State for grid data
    const [patientRegisterData, setPatientRegisterData] = useState([]);
    const [billingData, setBillingData] = useState([]);
    const [getDataTrigger, setGetDataTrigger] = useState(false);

    // Filter states
    const [dateOption, setDateOption] = useState("current");
    const [CurrentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [ParticularDate, setParticularDate] = useState("");
    const [searchIPParams, setSearchIPParams] = useState({
        query: "",
        status: "Admitted",
    });
    const [SelectedWard, setSelectedWard] = useState("");
    const [WardGet, setWardGet] = useState([]);

    // Current date for calculation (June 13, 2025, 01:34 PM IST)
    const currentDate = new Date();

    // Grid column definitions
    const pationsColumn = [
        {
            key: "PatientId",
            name: "Patient ID",
        },
        {
            key: "PatientName",
            name: "Patient Name",
            width: 150,
        },
        {
            key: "PatientCategory",
            name: "Patient Category",
        },
        {
            key: "AdmissionPurpose",
            name: "Admission Purpose",
        },
        {
            key: "DoctorName",
            name: "Primary Doctor",
            width: 150,
        },
        {
            key: "AdmissionDate",
            name: "Admission Date",
        },
        {
            key: "DaysSinceAdmission",
            name: "Days Since Admission",
        },
        {
            key: "BedNo",
            name: "Bed No",
        },
        {
            key: "Total_Cumulative_Amount",
            name: "Total Billed Amount",
        },
    ];

    // Fetch ward details
    useEffect(() => {
        axios
            .get(`${UrlLink}Masters/Ward_Detials_link`)
            .then((res) => {
                const ress = res.data;
                console.log("Ward Data:", ress);
                if (Array.isArray(ress)) {
                    setWardGet(ress);
                } else {
                    setWardGet([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching ward data:", err);
                const tdata = {
                    message: "Failed to fetch ward data.",
                    type: "error",
                };
                dispatch({ type: "toast", value: tdata });
            });
    }, [UrlLink, dispatch]);

    // Fetch billing data from risk_management_list
    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                const params = {
                    searchBy: searchIPParams.query,
                    Status: searchIPParams.status,
                    location: UserData?.location || 1,
                };

                const response = await axios.get(
                    `${UrlLink}Frontoffice/risk_management_list`,
                    { params }
                );

                const billingData = Array.isArray(response.data) ? response.data : [];
                console.log("Billing Data:", billingData);
                setBillingData(billingData);
            } catch (error) {
                console.error("Error fetching billing data:", error);
                setBillingData([]);
                const tdata = {
                    message: "Failed to fetch billing data.",
                    type: "error",
                };
                dispatch({ type: "toast", value: tdata });
            }
        };

        fetchBillingData();
    }, [UrlLink, searchIPParams, UserData?.location, dispatch]);

    // Fetch patient data and merge with billing data
    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const params = {};
                if (searchIPParams.query.trim()) {
                    params.query = searchIPParams.query;
                }
                if (searchIPParams.status) {
                    params.status = searchIPParams.status;
                }
                if (SelectedWard) {
                    params.WardName = SelectedWard;
                }
                if (dateOption === "current" && CurrentDate) {
                    params.CurrentDate = CurrentDate;
                } else if (dateOption === "custom" && fromDate && toDate) {
                    params.fromDate = fromDate;
                    params.toDate = toDate;
                } else if (dateOption === "particular" && ParticularDate) {
                    params.ParticularDate = ParticularDate;
                } else {
                    setPatientRegisterData([]);
                    return;
                }

                console.log("Patient API Parameters:", params);

                const patientResponse = await axios.get(
                    `${UrlLink}NurseStation/get_nurse_station_patients`,
                    { params }
                );

                const patientsData = Array.isArray(patientResponse.data.patients)
                    ? patientResponse.data.patients
                    : [];
                console.log("Patient Data:", patientsData);

                // Merge billing data with patient data and calculate days since admission
                // Merge billing data with patient data and calculate days since admission
                const enrichedData = patientsData.map((patient) => {
                    const billing = billingData.find(
                        (bill) => bill.Patient_data.RegistrationId === patient.RegistrationId
                    );

                    // Calculate days since admission (counting admission day as day 1)
                    let daysSinceAdmission = "N/A";
                    if (patient.AdmissionDate && patient.AdmissionDate !== "N/A") {
                        const admissionDate = new Date(patient.AdmissionDate);
                        // Reset time part to midnight for both dates to compare calendar days
                        const admissionDateOnly = new Date(admissionDate.getFullYear(), admissionDate.getMonth(), admissionDate.getDate());
                        const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

                        // Calculate the difference in calendar days
                        const timeDiff = currentDateOnly - admissionDateOnly;
                        const daysDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));
                        // Add 1 to count the admission day as day 1
                        daysSinceAdmission = daysDiff >= 0 ? daysDiff + 1 : "Invalid";
                    }

                    return {
                        ...patient,
                        Total_Cumulative_Amount: billing
                            ? billing.Total_Cumulative_Amount
                            : "N/A",
                        DaysSinceAdmission: daysSinceAdmission,
                    };
                });

                setPatientRegisterData(enrichedData);
            } catch (error) {
                console.error("Error fetching patient data:", error);
                setPatientRegisterData([]);
                const tdata = {
                    message: "Failed to fetch patient data.",
                    type: "error",
                };
                dispatch({ type: "toast", value: tdata });
            }
        };

        fetchPatientData();
    }, [
        UrlLink,
        getDataTrigger,
        dispatch,
        dateOption,
        CurrentDate,
        fromDate,
        toDate,
        ParticularDate,
        searchIPParams,
        SelectedWard,
        billingData,
    ]);

    // Handle date option change
    const handleDateOptionChange = (e) => {
        setDateOption(e.target.value);
        setSearchIPParams({ ...searchIPParams, query: "", status: "Admitted" });
        setSelectedWard("");
        setFromDate("");
        setToDate("");
        setParticularDate("");
        if (e.target.value === "current") {
            setCurrentDate(new Date().toISOString().split("T")[0]);
        } else {
            setCurrentDate("");
        }
    };

    // Handle date changes
    const handleCurrentDateChange = (e) => {
        setCurrentDate(e.target.value);
    };

    const handleFromDateChange = (e) => {
        setFromDate(e.target.value);
    };

    const handleToDateChange = (e) => {
        setToDate(e.target.value);
    };

    const handleParticularDateChange = (e) => {
        setParticularDate(e.target.value);
    };

    // Handle search and filter changes
    const handleIPSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchIPParams({ ...searchIPParams, [name]: value });
        if (name === "Ward") {
            setSelectedWard(value);
        }
    };

    return (
        <div className="Main_container_app">
            <h3>Nurse Station Patients</h3>
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
                            value={CurrentDate}
                            disabled
                            onChange={handleCurrentDateChange}
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
                                placeholder="From Date"
                                value={fromDate}
                                onChange={handleFromDateChange}
                            />
                        </div>
                        <div className="search_div_bar_inp_1">
                            <label>
                                To <span>:</span>
                            </label>
                            <input
                                type="date"
                                placeholder="To Date"
                                value={toDate}
                                onChange={handleToDateChange}
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
                            value={ParticularDate}
                            onChange={handleParticularDateChange}
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
                        value={searchIPParams.query}
                        placeholder="Search here ..."
                        onChange={handleIPSearchChange}
                    />
                </div>

                <div className="search_div_bar_inp_1">
                    <label>
                        Status <span>:</span>
                    </label>
                    <select
                        name="status"
                        value={searchIPParams.status}
                        onChange={handleIPSearchChange}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Admitted">Admitted</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="search_div_bar_inp_1">
                    <label>
                        Ward Type <span>:</span>
                    </label>
                    <select
                        name="Ward"
                        required
                        value={SelectedWard}
                        onChange={handleIPSearchChange}
                    >
                        <option value="">Select Ward</option>
                        {WardGet.filter(
                            (ward) =>
                                ward.Status === "Active" &&
                                ward.WardName !== "ICU" &&
                                ward.WardName !== "CCU" &&
                                ward.WardName !== "CASUALITY"
                        ).map((ward, idx) => (
                            <option key={idx} value={ward.WardName}>
                                {ward.WardName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <ReactGrid
                columns={pationsColumn}
                RowData={patientRegisterData.filter(
                    (patient) =>
                        (SelectedWard ? patient.WardName === SelectedWard : true) &&
                        patient.WardName !== "ICU" &&
                        patient.WardName !== "CCU"
                )}
            />
            <ToastAlert Message={toast.message} Type={toast.type} />
        </div>
    );
};

export default NurseStationPations;