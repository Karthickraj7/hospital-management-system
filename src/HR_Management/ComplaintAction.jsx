import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";

const ComplaintAction = () => {
    const dispatchvalue = useDispatch();
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const toast = useSelector((state) => state.userRecord?.toast);
    const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
    const [searchQuery, setsearchQuery] = useState("");
    const [Filterdata, setFilterdata] = useState([]);
    const [page, setPage] = useState(0);
    const pageSize = 10;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const totalPages = Math.ceil(Filterdata.length / pageSize);
    const paginatedData = Array.isArray(Filterdata) && Filterdata?.slice(page * pageSize, (page + 1) * pageSize);
    const [rows, setRows] = useState([]);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [searchOPParams, setsearchOPParams] = useState({
        query: "",
        designation: "",
        location: userRecord?.location,
    });

    const [PatientRegisterData, setPatientRegisterData] = useState([]);
    const handleSearchChange = (e) => {
        setsearchQuery(e.target.value);
    };
    const [status, setStatus] = useState("");
    const [remarks, setRemarks] = useState("");
    const [fromdate, setFromdate] = useState("");
    const [todate, setTodate] = useState("");


    useEffect(() => {
        if (searchQuery !== "") {
            const lowerCaseQuery = searchQuery.toLowerCase();

            const filteredData = PatientRegisterData.filter((row) => {
                const { EmployeeID, EmployeeName } = row;
                return (
                    (EmployeeID && EmployeeID.toLowerCase().includes(lowerCaseQuery)) ||
                    // (PhoneNumber && PhoneNumber.toLowerCase().includes(lowerCaseQuery)) ||
                    (EmployeeName &&
                        EmployeeName.toLowerCase().includes(lowerCaseQuery))
                    // (Designation && Designation.toLowerCase().includes(lowerCaseQuery))
                );
            });

            setFilterdata(filteredData);
        } else {
            setFilterdata(PatientRegisterData);
        }
    }, [searchQuery, PatientRegisterData]);


    useEffect(() => {
        setLoading(true); // Start loading
        axios
            .get(`${UrlLink}HR_Management/All_Complaint_list`, {
                params: searchOPParams, // Ensure `searchOPParams` is included in dependencies
            })
            .then((response) => {
                console.log("Response Data:", response.data);
                const data = response.data;

                if (Array.isArray(data)) {
                    setRows(
                        data.map((row) => ({
                            id: row.employeeid, // Use appropriate unique identifier
                            ...row,
                        }))
                    );
                    setPatientRegisterData(data);
                    setFilterdata(data);
                    setError(null); // Clear any existing error
                } else {
                    setRows([]); // Reset rows if data is not an array
                    setPatientRegisterData([]);
                    setFilterdata([]);
                    setError('No data found'); // Set error message
                }
            })
            .catch((error) => {
                console.error("Fetch Error:", error);
                setError("Failed to fetch complaint data. Please try again.");
                setRows([]); // Reset rows on error
                setPatientRegisterData([]);
                setFilterdata([]);
            })
            .finally(() => {
                setLoading(false); // End loading regardless of success or failure
            });
    }, [UrlLink, userRecord?.location, searchOPParams]);

    const handleEditClick = (params) => {
        console.log("editiconclick", params);
        setOpenModal(true);
        setSelectedRowData(params);
    };

    const handleSubmission = async () => {
        try {
            // Construct the data to submit
            const submissionData = {
                slno: selectedRowData?.slno || "",
                status: status || "",
                fromdate: fromdate,
                todate: todate,
                remarks: remarks || "",
                createdby: userRecord?.username,
                location: userRecord?.location,
            };
            console.log("submissionData", submissionData);

            // Make the API request
            const response = await axios.post(
                `${UrlLink}HR_Management/insert_ComplaintActions`,
                submissionData
            );

            // Extract response data
            const result = response.data;
            const responseType = Object.keys(result)[0]; // Response type (e.g., success/error)
            const responseMessage = Object.values(result)[0]; // Response message

            // Prepare toast notification data
            const toastData = {
                message: responseMessage,
                type: responseType,
            };

            // Dispatch toast notification
            dispatchvalue({ type: "toast", value: toastData });


            setStatus("");
            setFromdate("");
            setTodate("");
            setRemarks("");
            // Close the modal
            setOpenModal(false);
        } catch (error) {
            // Handle submission errors
            dispatchvalue({
                type: "toast",
                value: {
                    message: "Failed to submit attendance. Please try again.",
                    type: "error",
                },
            });
            console.error("Error submitting data:", error);
        }
    };


    return (
        <div className='appointment'>
            <div className='h_head'>
                <h4>Complaint List</h4>
            </div>
            <br />

            <div className="con_1 ">
                <div className="inp_1">
                    <label htmlFor="input">
                        Search by <span>:</span>
                    </label>
                    <input
                        style={{
                            width: "370px",
                        }}
                        type="text"
                        name="employeeName"
                        placeholder="Name or Id or PhoneNo or Designation "
                        value={searchQuery} // Use the correct state variable here
                        onChange={handleSearchChange} // Call the handler on input change
                    />
                </div>
            </div>

            <div className="Selected-table-container">
                {loading ? (
                    <p>Loading complaints...</p> // Show loading message while data is fetching
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p> // Show error message if fetch fails
                ) : rows.length > 0 ? (
                    <table className="selected-medicine-table2">
                        <thead>
                            <tr>
                                <th id="slectbill_ins">Employee ID</th>
                                <th id="slectbill_ins">Employee Name</th>
                                <th id="slectbill_ins">Incident Date</th>
                                <th id="slectbill_ins">Incident Time</th>
                                <th id="slectbill_ins">Complaint</th>
                                <th id="slectbill_ins">Description</th>
                                <th id="slectbill_ins">Remarks</th>
                                <th id="slectbill_ins">Against Employee ID</th>
                                <th id="slectbill_ins">Against Employee Name</th>
                                <th id="slectbill_ins">Employee Department</th>
                                <th id="slectbill_ins">Witness</th>
                                <th id="slectbill_ins">Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((leave, index) => (
                                <tr key={index}>
                                    <td>{leave.employeeid}</td>
                                    <td>{leave.Employeename}</td>
                                    <td>{leave.IncidentDate}</td>
                                    <td>{leave.IncidentTime}</td>
                                    <td>{leave.Complaint}</td>
                                    <td>{leave.Description || 'No Description'}</td>
                                    <td>{leave.Remarks || 'No Remarks'}</td>
                                    <td>{leave.AgainstEmployeeId}</td>
                                    <td>{leave.AgainstEmployeeName}</td>
                                    <td>{leave.AgainstEmployeeDepartment}</td>
                                    <td>{leave.Witness || 'No Witness'}</td>
                                    <td> <Button
                                        variant="contained"
                                        color="warning"
                                        size="small"
                                        onClick={() => handleEditClick(leave)}
                                        startIcon={<EditIcon />}
                                    >
                                        Edit
                                    </Button></td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ textAlign: 'center', color: '#555', fontSize: '18px' }}>
                        No complaints applied.
                    </p>
                )}
            </div>


            {/* openmodal open */}


            {openModal && (
                <div
                    className={
                        isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
                    }
                    onClick={() => {
                        setOpenModal(false);
                    }}
                >
                    <div
                        className="newwProfiles newwPopupforreason"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <br />

                        <div className="RegisFormcon">
                            <div className="RegisForm_1">
                                <label htmlFor="hrActions">
                                    HR Actions<span>:</span>
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                    }}

                                >
                                    <option value="" >
                                        Select
                                    </option>
                                    <option value="Memo">Memo</option>
                                    <option value="OralWarning">Oral Warning</option>
                                    <option value="WrittenWarning">Written Warning</option>
                                    <option value="Suspended">Suspended</option>
                                    <option value="Terminated">Terminated</option>
                                </select>
                            </div>

                            {status === "Suspended" && (
                                <div className="RegisFormcon">
                                    <div className="RegisForm_1">
                                        <label htmlFor="fromdate">
                                            From Date<span>:</span>
                                        </label>
                                        <input
                                            type="date"
                                            id="fromdate"
                                            name="fromdate"
                                            value={fromdate}
                                            onChange={(e) => {
                                                setFromdate(e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className="RegisForm_1">
                                        <label htmlFor="todate">
                                            To Date<span>:</span>
                                        </label>
                                        <input
                                            type="date"
                                            id="todate"
                                            name="todate"
                                            value={todate}
                                            onChange={(e) => {
                                                setTodate(e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="RegisForm_1">
                                <label htmlFor="Description">Remarks:</label>
                                <textarea
                                    id="remarks"
                                    name="remarks"
                                    rows="4"
                                    value={remarks}
                                    onChange={(e) => {
                                        setRemarks(e.target.value);
                                    }}

                                ></textarea>
                            </div>
                        </div>


                        <div className="Register_btn_con">
                            <button
                                className="RegisterForm_1_btns"
                                onClick={handleSubmission}
                            >
                                Submit
                            </button>
                            <button
                                className="RegisterForm_1_btns"
                                onClick={() => setOpenModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}










            {totalPages > 1 && (
                <div className="grid_foot">
                    <button
                        onClick={() =>
                            setPage((prevPage) => Math.max(prevPage - 1, 0))
                        }
                        disabled={page === 0}
                    >
                        Previous
                    </button>
                    Page {page + 1} of {totalPages}
                    <button
                        onClick={() =>
                            setPage((prevPage) =>
                                Math.min(prevPage + 1, totalPages - 1)
                            )
                        }
                        disabled={page === totalPages - 1}
                    >
                        Next
                    </button>
                </div>
            )}
            <ToastAlert Message={toast.message} Type={toast.type} />
        </div>
    )
}

export default ComplaintAction