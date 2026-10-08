import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Button from '@mui/material/Button';
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";




function EmployeeAppraisalList() {
    const dispatchvalue = useDispatch();
    const toast = useSelector((state) => state.userRecord?.toast);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const [searchQuery1, setSearchQuery1] = useState("");
    const [searchQuery2, setSearchQuery2] = useState("");
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [rolename, setRolename] = useState([]);
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const [searchquery,setsearchquery] = useState({

        'is_Employee': userRecord?.is_Employee,
        'is_HOD': userRecord?.is_HOD,
        'is_HR': userRecord?.is_HR,
        'is_admin': userRecord?.is_admin,
        'Employeeid' : userRecord?.Employeeid,

    })


    const totalPages = Math.ceil(filteredRows.length / pageSize);

    const paginatedData = filteredRows.slice(page * pageSize, (page + 1) * pageSize);



    const [performanceformdata, setperformanceformdata] = useState({
        employeeId: "",
        employeeName: "",
        date: "",
        performance: "",
        hiketype: "",
        allowancename: "",
        preallowance: "",
        preallowanceamount: "",
        newallowance: "",
        newallowanceamount: "",
        finalallowanceamount: "",
        hike: "",
        amount: "",
        remarks: "",
        current: "",
        newpay: "",
        approvedby: userRecord?.username,
        location: userRecord?.location,
        createdby: userRecord?.username,
    })


    const resettheformdata = () => {
        setperformanceformdata({
            employeeId: "",
            employeeName: "",
            date: "",
            performance: "",
            hiketype: "",
            allowancename: "",
            preallowance: "",
            preallowanceamount: "",
            newallowance: "",
            newallowanceamount: "",
            finalallowanceamount: "",
            hike: "",
            amount: "",
            remarks: "",
            current: "",
            newpay: "",
            approvedby: '',
            location: userRecord?.location,
            createdby: userRecord?.username,
        });
    };

    console.log(performanceformdata)


    useEffect(() => {
        axios
            .get(`${UrlLink}HR_Management/Employee_Designation_Details`)
            .then((response) => {
                console.log(response.data);
                setRolename(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [UrlLink]);


    const fetchappraisallist = () => {
        axios
        .get(`${UrlLink}HR_Management/getemployeelistforappraisal?location=${userRecord?.location}`, {
            params: searchquery
          })
            .then((response) => {
                console.log("responseemployee personal details get", response)
                setRows(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        fetchappraisallist()
    }, [UrlLink])


    useEffect(() => {
        const filteredData = rows.filter((row) => {
            const lowerCaseDesignation = row.Designation?.toLowerCase() || "";
            const lowerCaseEmployeeID = row.Employee_Id?.toLowerCase() || "";

            const matchesemployeeid = lowerCaseEmployeeID.includes(
                searchQuery2.toLowerCase()
            );
            const matchesdesignation = lowerCaseDesignation.includes(
                searchQuery1.toLowerCase()
            );

            return (
                (matchesemployeeid || !searchQuery2) &&
                (matchesdesignation || !searchQuery1)
            );
        });

        setFilteredRows(filteredData);
    }, [searchQuery1, searchQuery2, rows]);


    const handleEditClick = (params) => {

        setperformanceformdata((prevState) => ({
            ...prevState,
            employeeId: params.EmployeeID,
            employeeName: params.EmployeeName + ' ' + params.FatherName,
            current: params.Salary,

        }));

    }


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "hiketype") {
            if (value === "Increment") {
                // Reset fields for Allowance when Increment is selected
                setperformanceformdata((prevState) => ({
                    ...prevState,
                    hiketype: value,
                    allowancename: "",
                    preallowance: "",
                    preallowanceamount: "",
                    newallowance: "",
                    newallowanceamount: "",
                    finalallowanceamount: "",
                }));
            } else if (value === "Allowance") {
                // Reset fields for Increment when Allowance is selected
                setperformanceformdata((prevState) => ({
                    ...prevState,
                    hiketype: value,
                    current: "",
                    hike: "",
                    amount: "",
                    newpay: "",
                }));
            }
        } else if (name === "newallowance") {
            // Calculate new allowance amount
            const { preallowanceamount } = performanceformdata;
            console.log("preallowanceamount", preallowanceamount);
            const newallowance = parseFloat(value);
            console.log("newallowance", newallowance);

            if (!isNaN(preallowanceamount) && !isNaN(newallowance)) {
                const calculatedAmount = (preallowanceamount * newallowance) / 100;
                console.log("calculatedAmount", calculatedAmount);
                setperformanceformdata((prevState) => ({
                    ...prevState,
                    newallowanceamount: calculatedAmount,
                }));
            }
        }

        // Update the field value
        setperformanceformdata((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    useEffect(() => {
        const employeeId = performanceformdata.employeeId;
        const hikepercentage = performanceformdata.hike;
        if (hikepercentage && hikepercentage >= 1) {
            axios
                .get(
                    `${UrlLink}HR_Management/employee_performanceamount?employeeid=${employeeId}&location=${userRecord?.location}&hikepercentage=${hikepercentage}`
                )
                .then((response) => {
                    console.log(response.data);
                    if (response.data.error) {
                        alert(response.data.error);
                        setperformanceformdata((prevState) => ({
                            ...prevState,
                            amount: "",
                            newpay: "",
                        }));
                    } else {
                        setperformanceformdata((prevState) => ({
                            ...prevState,
                            amount: response.data[0]?.amount || "",
                            newpay: response.data[0]?.newpay || "",
                        }));
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log("EmployeeId must be 9 characters in length");
        }
    }, [performanceformdata.employeeId, performanceformdata.hike, userRecord, UrlLink]);


    useEffect(() => {
        const employeeId = performanceformdata.employeeId;
        const allowancename = performanceformdata.allowancename;

        if (allowancename && employeeId) {
            axios
                .get(
                    `${UrlLink}HR_Management/employee_allowance?employeeid=${employeeId}&location=${userRecord?.location}&allowancename=${allowancename}`
                )
                .then((response) => {
                    console.log("Response data:", response.data);

                    if (response.data.error) {
                        setperformanceformdata((prev) => ({
                            ...prev,
                            preallowance: "",
                            preallowanceamount: "",
                        }));
                    } else {
                        const allowanceAmount = parseFloat(response.data?.amount) || 0;
                        const newAllowanceAmount = parseFloat(performanceformdata.newallowanceamount) || 0;

                        console.log(allowanceAmount,'allowanceAmount');
                        console.log(newAllowanceAmount,'newAllowanceAmount');
                        console.log(response.data?.percentage,'response.data?.percentage');
                        if (newAllowanceAmount) {
                            setperformanceformdata((prev) => ({
                                ...prev,
                                preallowance: response.data?.percentage || "",
                                preallowanceamount: allowanceAmount,
                                finalallowanceamount: allowanceAmount + newAllowanceAmount,
                            }));
                        }
                        else {
                            setperformanceformdata((prev) => ({
                                ...prev,
                                preallowance: response.data?.percentage || "",
                                preallowanceamount: allowanceAmount,
                                finalallowanceamount: allowanceAmount,
                            }));
                        }

                    }
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        } else {
            console.log("Missing employeeId and allowancename");
        }
    }, [performanceformdata.employeeId, performanceformdata.newallowance, performanceformdata.allowancename, userRecord, UrlLink]);


    const handleSubmit = (e) => {
        e.preventDefault();  // Prevent form submission
        console.log("Form data:", performanceformdata);  // Log the current form data for debugging

        // Start the request and handle potential errors properly
        axios
            .post(`${UrlLink}HR_Management/insert_employee_performance`, performanceformdata)
            .then((response) => {
                console.log("Response:", response);

                // Ensure the response has data
                if (response && response.data) {
                    const responseData = response.data;

                    // Check if response contains at least one key-value pair
                    if (Object.keys(responseData).length > 0) {
                        const type = Object.keys(responseData)[0];
                        const message = Object.values(responseData)[0];

                        // Prepare the data for the toast notification
                        const toastData = {
                            message,
                            type,
                        };

                        // Dispatch the toast notification to the global state (or context)
                        dispatchvalue({ type: "toast", value: toastData });

                        // Fetch the updated appraisals list (optional: can add a loading state)
                        fetchappraisallist();
                        setperformanceformdata({
                            employeeId: "",
                            employeeName: "",
                            date: "",
                            performance: "",
                            hike: "",
                            amount: "",
                            remarks: "",
                            current: "",
                            newpay: "",
                            approvedby: '',
                            location: userRecord?.location,
                            createdby: userRecord?.username,
                        });
                        // Reset the form data
                        resettheformdata();
                    } else {
                        // Handle unexpected empty response
                        console.error("Unexpected response structure:", responseData);
                    }
                } else {
                    // Handle cases where the response does not contain data
                    console.error("Response does not contain data:", response);
                }
            })
            .catch((error) => {


                // You can dispatch an error message to the toast or set a loading state error here
                dispatchvalue({
                    type: "toast",
                    value: { message: "An error occurred. Please try again later.", type: "warn" },
                });
            });
    };


    const [allowancelist,Setallowancelist] = useState([]);


    useEffect(() => {
        axios
          .get(
            `${UrlLink}HR_Management/allowance-master`
          )
          .then((res) => Setallowancelist(res.data))
          .catch((err) => console.log(err));
      }, [UrlLink]);

    return (
        <div className="appointment">
                    <br />
            <div className="RegisFormcon">
                <div className="RegisForm_1">
                    <label htmlFor="employeeId">
                        Employee ID <span>:</span>{" "}
                    </label>
                    <input
                        type="text"
                        id="employeeId"
                        name="employeeId"
                        value={performanceformdata.employeeId}
                        onChange={handleChange}
                    />
                </div>

                <div className="RegisForm_1">
                    <label htmlFor="employeeName">
                        Employee Name <span>:</span>{" "}
                    </label>
                    <input
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value={performanceformdata.employeeName}
                        onChange={handleChange}
                        readOnly
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="employeeName">
                        Hike Type<span>:</span>{" "}
                    </label>
                    <select
                        id="hiketype"
                        name="hiketype"
                        value={performanceformdata.hiketype}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="Increment">Increment</option>
                        <option value="Allowance">Allowance</option>
                    </select>
                </div>
                {performanceformdata.hiketype === "Allowance" && (
                    <>
                        <div className="RegisForm_1">
                            <label htmlFor="employeeName">
                                Allowance Name<span>:</span>{" "}
                            </label>
                            <select
                                id="allowancename"
                                name="allowancename"
                                value={performanceformdata.allowancename}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                {Array.isArray(allowancelist) &&
                                allowancelist.map((val,idx) =>(
                                <option key={idx} value={val.allowance_name}>{val.allowance_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="RegisForm_1">
                            <label htmlFor="date">
                                Previous Allowance(%) <span>:</span>{" "}
                            </label>
                            <input
                                type="number"
                                id="preallowance"
                                name="preallowance"
                                onKeyDown={(e) =>
                                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                                }
                                value={performanceformdata.preallowance}
                                readOnly
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label htmlFor="date">
                                New Allowance(%) <span>:</span>{" "}
                            </label>
                            <input
                                type="number"
                                id="newallowance"
                                name="newallowance"
                                onKeyDown={(e) =>
                                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                                }
                                value={performanceformdata.newallowance}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label htmlFor="date">
                                New Allowance Amount <span>:</span>{" "}
                            </label>
                            <input
                                type="number"
                                id="newallowanceamount"
                                name="newallowanceamount"
                                onKeyDown={(e) =>
                                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                                }
                                value={performanceformdata.newallowanceamount}
                                readOnly
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label htmlFor="date">
                                Final Allowance Amount <span>:</span>{" "}
                            </label>
                            <input
                                type="number"
                                id="finalallowanceamount"
                                name="finalallowanceamount"
                                onKeyDown={(e) =>
                                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                                }
                                value={performanceformdata.finalallowanceamount}
                                readOnly
                            />
                        </div>
                    </>
                )}

                <div className="RegisForm_1">
                    <label htmlFor="date">
                        Date <span>:</span>{" "}
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={performanceformdata.date}
                        onChange={handleChange}
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="performance">
                        Performance Rate <span>:</span>
                    </label>
                    <select
                        id="performance"
                        name="performance"
                        value={performanceformdata.performance}  // Ensure this is controlled by state
                        onChange={handleChange}
                    >
                        {[...Array(11)].map((_, index) => (
                            <option key={index} value={index}>
                                {index}/10
                            </option>
                        ))}
                    </select>
                </div>





                {performanceformdata.hiketype === "Increment" && (
                    <>
                        <div className="RegisForm_1">
                            <label htmlFor="current">
                                Current Pay <span>:</span>
                            </label>
                            <input
                                type="text"
                                name="current"
                                onChange={handleChange}
                                value={performanceformdata.current}
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label htmlFor="hike">
                                Hike Percentage <span>:</span>
                            </label>
                            <input
                                type="text"
                                name="hike"
                                value={performanceformdata.hike}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label htmlFor="amount">
                                Hike Amount <span>:</span>
                            </label>
                            <input
                                type="text"
                                name="amount"
                                value={performanceformdata.amount}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label htmlFor="newpay">
                                New Pay <span>:</span>
                            </label>
                            <input
                                type="text"
                                name="newpay"
                                onChange={handleChange}
                                value={performanceformdata.newpay}
                            />
                        </div>
                    </>
                )}




                <div className="RegisForm_1">
                    <label htmlFor="remarks">
                        Remarks <span>:</span>
                    </label>
                    <textarea
                        name="remarks"
                        id="remarks"
                        cols="15"
                        rows="3"
                        value={performanceformdata.remarks}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="approvedby">
                        Approved By <span>:</span>{" "}
                    </label>
                    <input
                        type="text"
                        id="approvedby"
                        name="approvedby"
                        value={performanceformdata.approvedby}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="Register_btn_con">
                <button className="RegisterForm_1_btns" onClick={handleSubmit}>
                    Save
                </button>
            </div>
            <br />
            <div className="con_1 ">
                <div className="inp_1">
                    <label htmlFor="input">Employee ID<span>:</span></label>
                    <input
                        type="text"
                        id="employeeID"
                        name="employeeID"
                        placeholder="Enter Employee ID"
                        value={searchQuery2}
                        onChange={(e) => setSearchQuery2(e.target.value)}
                    />
                </div>

                <div className="inp_1">
                    <label htmlFor="input">Designation <span>:</span></label>
                    <select
                        name="designation"
                        value={searchQuery1}
                        onChange={(e) => setSearchQuery1(e.target.value)}
                        className="new-custom-input-phone vital_select"
                        required
                    >
                        <option value="">Select</option>
                        {Array.isArray(rolename) && rolename.length > 0 ? (
                            rolename.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.Designation}
                                </option>
                            ))
                        ) : (
                            <option disabled>No Option</option>
                        )}
                    </select>
                </div>
            </div>
            <div className="Selected-table-container">
                <table className="selected-medicine-table2">
                    <thead>
                        <tr>
                            <th id="slectbill_ins">Employee ID</th>
                            <th id="slectbill_ins">Employee Name</th>
                            <th id="slectbill_ins">Designation</th>
                            <th id="slectbill_ins">Date of Joining</th>
                            <th id="slectbill_ins">Current Salary</th>
                            <th id="slectbill_ins">Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData?.length > 0 && paginatedData?.map((leave, index) => (
                            <tr key={index}>
                                <td>{leave.EmployeeID}</td>
                                <td>{leave.EmployeeName}</td>
                                <td>{leave.Designation}</td>
                                <td>{leave.DateofJoining}</td>
                                <td>{leave.Designation === 'TRAINEE' ? leave.StipendAmount : leave.Salary}</td>
                                <td>
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        size="small"
                                        onClick={() => handleEditClick(leave)}
                                        startIcon={<EditIcon />}
                                    >
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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

                        style={{padding:'8px',borderRadius:'9px'}}
                    >
                        Next
                    </button>
                </div>
            )}
            <ToastAlert Message={toast.message} Type={toast.type} />
        </div>
    )
}

export default EmployeeAppraisalList;

