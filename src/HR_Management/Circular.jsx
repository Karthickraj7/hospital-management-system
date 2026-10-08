import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { FaTrash } from "react-icons/fa";
import Button from "@mui/material/Button";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";

const Circular = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const toast = useSelector((state) => state.userRecord?.toast);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const dispatch = useDispatch();
        const pagewidth = useSelector(state => state.userRecord?.pagewidth);

    const [circular, setCircular] = useState({
        EmployeeId: userRecord?.Employeeid || "",
        Subject: "",
        Remarks: "",
        Date: "",
        Time: "",
        Venue: "",
        Department: "",
        CircularType: "",
        CircularEmployeeDesignation: "",
        CircularEmployee: "",
        location: userRecord?.location || "",
        createdby: userRecord?.username || "",

    })
    const [addedDepartments, setAddedDepartments] = useState([]);

    const [department, setDepartment] = useState([]);
    const [venueData, setVenueData] = useState([]);
    const [DesignationData, setDesignationData] = useState([]);
    const [Employees, setEmployees] = useState([]);
    console.log("Employees", Employees);
    const [SelectedEmployees, setSelectedEmployees] = useState([]);
    console.log("SelectedEmployees", SelectedEmployees);

    const handleClear = useCallback(() => {
        setCircular({
            EmployeeId: userRecord?.Employeeid || "",
            Subject: "",
            Remarks: "",
            Date: "",
            Time: "",
            Venue: "",
            Department: "",
            CircularType: "",
            CircularEmployee: "",
            CircularEmployeeDesignation: "",
            location: userRecord?.location || "",
            createdby: userRecord?.username || "",
        });
        setEmployees([]);
        setSelectedEmployees([]);
        setAddedDepartments([]);
    }, [userRecord]);

    const handleonChange = useCallback((e) => {
        const { name, value } = e.target;


        setCircular((prev) => {
            if (name === 'CircularType') {
                // Reset dependent fields based on CircularType
                if (value === 'Department') {
                    setSelectedEmployees([]);
                    return {
                        ...prev,
                        CircularType: value,
                        CircularEmployeeDesignation: '',
                        CircularEmployee: '',
                        Department: prev.Department, // Retain Department
                    };
                } else if (value === 'Employee') {
                    setAddedDepartments([]);
                    return {
                        ...prev,
                        CircularType: value,
                        Department: '', // Clear Department when Employee is selected
                        CircularEmployeeDesignation: prev.CircularEmployeeDesignation,
                        CircularEmployee: prev.CircularEmployee, // Retain CircularEmployeeDesignation
                    };
                }
                return {
                    ...prev,
                    CircularType: value,
                };
            }
            if (name === 'Department') {
                if (value === 'All') {
                    // If "All" is selected, empty the addedDepartments array
                    setAddedDepartments([]);
                }
            }


            if (name === 'CircularEmployeeDesignation') {
                if (value === 'All') {
                    setEmployees([]);
                    setCircular((prev) => ({
                        ...prev,
                        CircularEmployee: "",
                    }));
                }
                else if (value) {

                    setCircular((prev) => ({
                        ...prev,
                        CircularEmployee: value
                    }));
                }
            }

            if (['Subject', 'Remarks'].includes(name)) {
                setCircular((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }

            // Handle other fields
            return {
                ...prev,
                [name]: value.trim(), // Trim whitespace for other inputs
            };
        });
    }, []);


    const validateForm = () => {
        if (!circular.Subject) {
            dispatch({
                type: "toast",
                value: { message: "Subject field is required", type: "warn" },
            });
            return false;
        }

        if (!circular.CircularType) {
            dispatch({
                type: "toast",
                value: { message: "Circular To field is required", type: "warn" },
            });
            return false;
        }

        // If all validations pass
        return true;
    };

    useEffect(() => {
        axios
            .get(`${UrlLink}Masters/Department_Detials_link`)
            .then((response) => {
                // Destructuring response data directly
                const data = response.data;


                setDepartment(data);
            })
            .catch((err) => {
                console.error("Error fetching department details:", err);
            });
    }, [UrlLink]);

    useEffect(() => {
        axios
            .get(`${UrlLink}Masters/Administration_Details_link`)
            .then((response) => {
                // Destructuring response data directly
                const data = response.data;


                setVenueData(data);
            })
            .catch((err) => {
                console.error("Error fetching department details:", err);
            });
    }, [UrlLink]);

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Designation_Detials_link`)
            .then((response) => {
                const data = response.data;

                setDesignationData(data);
            })
            .catch((err) => {
                console.error("Error fetching department details:", err);
            });

    }, [UrlLink])


    useEffect(() => {
        if (circular.CircularEmployeeDesignation !== "") {
            axios.get(`${UrlLink}HR_Management/Employee_Details_by_Designation?Designation=${circular.CircularEmployeeDesignation}`)
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setEmployees(res.data);  // Set the employee data if response is an array
                    } else {
                        setEmployees([]);  // If response is not an array, set employees to an empty array
                    }
                })
                .catch(err => {
                    setEmployees([]);  // If there is an error, clear the employees
                    console.log(err);   // Log the error to the console
                });
        }
    }, [circular.CircularEmployeeDesignation, UrlLink]);  // Dependencies: circular.CircularEmployeeDesignation, UrlLink





    const handlePlusDepartment = useCallback(() => {
        if (circular.Department !== "") {


            // Ensure departmentId is correctly parsed
            const departmentId = Number(circular.Department); // Use Number() to ensure proper conversion


            // Locate the selected department
            const selectedDepartment = department.find((d) => d.id === departmentId);


            if (selectedDepartment) {
                // Prevent duplicate additions
                if (addedDepartments.some((dept) => dept.id === selectedDepartment.id)) {
                    dispatch({
                        type: "toast",
                        value: {
                            message: `Department "${selectedDepartment.DepartmentName}" is already added.`,
                            type: "warn",
                        },
                    });
                    return;
                }

                // Add the department
                setAddedDepartments((prev) => [...prev, selectedDepartment]);
                dispatch({
                    type: "toast",
                    value: {
                        message: `Department "${selectedDepartment.DepartmentName}" added successfully!`,
                        type: "success",
                    },
                });

                // Clear the selected department
                setCircular((prev) => ({
                    ...prev,
                    Department: "",
                }));
            } else {
                // Invalid department selection
                dispatch({
                    type: "toast",
                    value: {
                        message: "Invalid department selected.",
                        type: "warn",
                    },
                });
            }
        } else {
            // Empty department field
            dispatch({
                type: "toast",
                value: {
                    message: "Please Fill All Required Fields.",
                    type: "warn",
                },
            });
        }
    }, [circular.Department, department, addedDepartments, dispatch]);
    const handleVisibilityClick = (departmentToDelete) => {
        // Remove the department from the addedDepartments array
        setAddedDepartments((prevDepartments) =>
            prevDepartments.filter((department) => department.id !== departmentToDelete.id)
        );

        // Optional: Show a success message
        const tdata = {
            message: `Department "${departmentToDelete.DepartmentName}" deleted successfully.`,
            type: "success",
        };
        dispatch({ type: "toast", value: tdata });
    };



    const handlePlusEmployee = useCallback(() => {
        // Validate required fields
        if (!circular.CircularEmployee || !circular.CircularEmployeeDesignation) {
            dispatch({
                type: "toast",
                value: {
                    message: "Please fill both Designation and Employee Name.",
                    type: "warn",
                },
            });
            return;
        }

        const EmployeeId = circular.CircularEmployee;
        const designationId = Number(circular.CircularEmployeeDesignation);

        // Handle the 'All' case
        if (EmployeeId === "All") {
            const matchedEmployees = Employees.filter(
                (emp) => emp.Designationid === designationId
            );

            if (matchedEmployees.length === 0) {
                dispatch({
                    type: "toast",
                    value: {
                        message: "No employees found for the selected designation.",
                        type: "error",
                    },
                });
                return;
            }

            // Filter out duplicates
            const newEmployees = matchedEmployees.filter(
                (emp) => !SelectedEmployees.some((selectedEmp) => selectedEmp.id === emp.id)
            );

            if (newEmployees.length === 0) {
                dispatch({
                    type: "toast",
                    value: {
                        message: "All matching employees are already added.",
                        type: "warn",
                    },
                });
                return;
            }

            // Add new employees to the list
            setSelectedEmployees((prev) => [...prev, ...newEmployees]);

            // Success notification
            dispatch({
                type: "toast",
                value: {
                    message: `${newEmployees.length} employees added successfully for the designation.`,
                    type: "success",
                },
            });

            // Reset circular state
            setCircular((prev) => ({
                ...prev,
                CircularEmployee: "",
                CircularEmployeeDesignation: "",
            }));

            return;
        }

        // Handle individual employee case
        const selectedEmployee = Employees.find(
            (emp) => emp.id === EmployeeId && emp.Designationid === designationId
        );

        if (!selectedEmployee) {
            dispatch({
                type: "toast",
                value: {
                    message: "No matching employee found for the selected designation.",
                    type: "error",
                },
            });
            return;
        }

        // Check for duplicates in the selected list
        if (SelectedEmployees.some((emp) => emp.id === selectedEmployee.id)) {
            dispatch({
                type: "toast",
                value: {
                    message: `Designation "${selectedEmployee.designation}" and Employee "${selectedEmployee.EmployeeName}" are already added.`,
                    type: "warn",
                },
            });
            return;
        }

        // Add the selected employee to the list
        setSelectedEmployees((prev) => [...prev, selectedEmployee]);

        // Success notification
        dispatch({
            type: "toast",
            value: {
                message: `Designation "${selectedEmployee.designation}" and Employee "${selectedEmployee.EmployeeName}" added successfully.`,
                type: "success",
            },
        });

        // Reset circular state
        setCircular((prev) => ({
            ...prev,
            CircularEmployee: "",
            CircularEmployeeDesignation: "",
        }));
    }, [
        circular.CircularEmployee,
        circular.CircularEmployeeDesignation,
        Employees,
        SelectedEmployees,
        dispatch,
    ]);


    const handleDeleteEmployee = (employeeToDelete) => {
        if (!employeeToDelete) {
            dispatch({
                type: "toast",
                value: {
                    message: "Invalid employee selected for deletion.",
                    type: "error",
                },
            });
            return;
        }

        // Remove the employee from the SelectedEmployees list
        setSelectedEmployees((prevEmployees) =>
            prevEmployees.filter((emp) => emp.id !== employeeToDelete.id)
        );

        // Success toast notification
        dispatch({
            type: "toast",
            value: {
                message: `Designation "${employeeToDelete.designation}" and Employee "${employeeToDelete.EmployeeName}" deleted successfully.`,
                type: "success",
            },
        });
    };



    const handleSubmit = async () => {
        if (!validateForm()) return;

        let sentdata = {}; // Initialize sentdata outside condition blocks

        if (circular.CircularType === 'Department') {
            if (circular.Department === 'All') {
                const activeDepartments = department.filter(dep => dep.Status === "Active");
                sentdata = {
                    ...circular,
                    selectedDepartment: activeDepartments || [], // Use default value or empty array
                };
            } else {
                sentdata = {
                    ...circular,
                    selectedDepartment: addedDepartments || [], // Use added departments or empty array
                };
            }
        } else if (circular.CircularType === 'Employee') {
            if (circular.CircularEmployeeDesignation === 'All') {
                sentdata = {
                    ...circular,
                    SelectedEmployee: Employees || [], // Use all employees or empty array
                };
            } else {
                sentdata = {
                    ...circular,
                    SelectedEmployee: SelectedEmployees || [], // Use selected employees or empty array
                };
            }
        }
        console.log('senddata', sentdata);
        try {
            const response = await axios.post(`${UrlLink}HR_Management/Add_Circular`, sentdata);
            const resres = response.data;
            const typp = Object.keys(resres)[0];
            const mess = Object.values(resres)[0];

            const tdata = {
                message: mess,
                type: typp,
            };

            dispatch({ type: "toast", value: tdata });
            fetchcircular()
            // Clear the form only if the response indicates success
            // if (typp.toLowerCase() === "success") {
            //     handleClear();
            // }
        } catch (error) {
            console.error("Error submitting the circular:", error);
            dispatch({
                type: "toast",
                value: { message: "Failed to submit circular. Please try again.", type: "error" },
            });
        }
    };


    const [searchOPParams, setsearchOPParams] = useState({ query: '', status: 'Pending'});

    const handleSearchChange = (e) => {
        const { name, value } = e.target
    
        setsearchOPParams({ ...searchOPParams, [name]: value });
    
    
    };

const [CircularRegisterData, setCircularRegisterData] = useState([]);

const fetchcircular = useCallback(() =>{
    axios.get(`${UrlLink}HR_Management/get_circular_Details`, { params: searchOPParams })
    .then((res) =>{
        const ress = res.data;
        if(Array.isArray(ress)){
            setCircularRegisterData(ress);
        }
        else{
            setCircularRegisterData([]);
        }
    })
    .catch((err) =>{
        console.log(err);
    });
},[UrlLink, searchOPParams])



    useEffect(() =>{
        fetchcircular()
    },[fetchcircular])

const CircularColumns = [
    {
        key: "id",
        name: "S.No",
        frozen: pagewidth > 500 ? true : false
    },
    {
        key: "Date",
        name: "Circular Date",
    },
    {
        key: "Time",
        name: "Circular Time",
    },
    {
        key: "Subject",
        name: "Subject",
    },
    {
        key: "Remarks",
        name: "Remarks",
    },
    {
        key: "Status",
        name: "Status",
    }



    
]

    return (
        <div className="Main_container_app">
            <h3>Circular</h3>
            <br></br>
            <div className="RegisFormcon">
                <div className="RegisForm_1">
                    <label htmlFor="Date">Date<sapn>:</sapn></label>
                    <input
                        type="date"
                        id="Date"
                        name="Date"
                        value={circular.Date}
                        onChange={handleonChange}
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="Time">Time<sapn>:</sapn></label>
                    <input
                        type="time"
                        id="Time"
                        name="Time"
                        value={circular.Time}
                        onChange={handleonChange}
                    />
                </div>
                <div className="RegisForm_1">
                    <label>
                        Venue <span>:</span>
                    </label>

                    <select
                        name="Venue"
                        value={circular.Venue}
                        onChange={handleonChange}
                    >
                        <option value="">Select Venue</option>

                        {Array.isArray(venueData) &&
                            venueData
                                .filter((p) => p.Status === 'Active')
                                .map((Catg, indx) => (
                                    <option key={indx} value={Catg.id}>
                                        {Catg.AdministrationName}
                                    </option>
                                ))}
                    </select>
                </div>

                <div className="RegisForm_1">
                    <label htmlFor="Subject">Subject<sapn>:</sapn></label>
                    <textarea
                        id="Subject"
                        name="Subject"
                        rows="4"
                        value={circular.Subject}
                        onChange={handleonChange}
                    ></textarea>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="Subject">Remarks<sapn>:</sapn></label>
                    <textarea
                        id="Remarks"
                        name="Remarks"
                        rows="4"
                        value={circular.Remarks}
                        onChange={handleonChange}
                    ></textarea>
                </div>

                <div className="RegisForm_1">
                    <label>
                        Circular To <span>:</span>
                    </label>

                    <select
                        name="CircularType"
                        value={circular.CircularType}
                        onChange={handleonChange}
                    >
                        <option value="">Select</option>
                        <option value="Department">Department</option>
                        <option value="Employee">Employee</option>
                    </select>
                </div>

                {circular.CircularType === 'Department' && (
                    <>
                        <div className="RegisForm_1">
                            <label>
                                Department <span>:</span>
                            </label>

                            <select
                                name="Department"
                                value={circular.Department}
                                onChange={handleonChange}
                            >
                                <option value="">Select Department</option>
                                <option value="All">All</option>
                                {Array.isArray(department) &&
                                    department
                                        .filter((p) => p.Status === 'Active')
                                        .map((Catg, indx) => (
                                            <option key={indx} value={Catg.id}>
                                                {Catg.DepartmentName}
                                            </option>
                                        ))}
                            </select>
                        </div>

                        {/* AddBox Icon, only show if department is selected and not "All" */}
                        {circular.Department !== 'All' && circular.Department !== '' && (
                            <div className="Search_patient_icons">
                                <AddBoxIcon onClick={handlePlusDepartment} />
                            </div>
                        )}
                    </>
                )}

                {
                    circular.CircularType === 'Employee' && (
                        <>
                            <div className="RegisForm_1">
                                <label>
                                    Designation <span>:</span>
                                </label>
                                <select
                                    name="CircularEmployeeDesignation"
                                    value={circular.CircularEmployeeDesignation}
                                    onChange={handleonChange}

                                >
                                    <option value="">Select Designation</option>
                                    <option value="All">All</option>
                                    {Array.isArray(DesignationData) &&
                                        DesignationData
                                            .filter((p) => p.Status === 'Active')
                                            .map((Desig, indx) => (
                                                <option key={indx} value={Desig.id}>
                                                    {Desig.Designation}
                                                </option>
                                            ))}

                                </select>
                            </div>
                            {
                                circular.CircularEmployeeDesignation !== 'All' && circular.CircularEmployeeDesignation !== '' && (
                                    <div className="RegisForm_1">

                                        <label>Employee Name<span>:</span></label>
                                        <select
                                            name="CircularEmployee"
                                            value={circular.CircularEmployee}
                                            onChange={handleonChange}
                                        >
                                            <option value="">Select Employee</option>
                                            <option value="All">All</option>
                                            {Array.isArray(Employees) &&
                                                Employees

                                                    .map((emp, indx) => (
                                                        <option key={indx} value={emp.id}>
                                                            {emp.EmployeeName}
                                                        </option>
                                                    ))}

                                        </select>
                                    </div>
                                )
                            }

                            {circular.CircularEmployeeDesignation !== 'All' && circular.CircularEmployeeDesignation !== '' && (
                                <div className="Search_patient_icons">
                                    <AddBoxIcon onClick={handlePlusEmployee} />
                                </div>
                            )}
                        </>
                    )
                }






            </div>

            <br></br>
            <div className="Register_btn_con">
                <button className="RegisterForm_1_btns" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
            {addedDepartments && addedDepartments.length > 0 && (
                <div className="appointment">
                    <div className="Selected-table-container">
                        <table className="selected-medicine-table2">
                            <thead>
                                <tr>
                                    <th id="slectbill_ins">Sl. No</th>
                                    <th id="slectbill_ins">Department</th>
                                    <th id="slectbill_ins">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {addedDepartments.map((row, index) => (
                                    <tr key={row.id}>
                                        <td>{index + 1}</td> {/* Display row number starting from 1 */}
                                        <td>{row.DepartmentName}</td>
                                        <td>
                                            <Button
                                                onClick={() => handleVisibilityClick(row)} // Call your function to handle delete
                                                startIcon={<FaTrash />}
                                            >

                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            {SelectedEmployees && SelectedEmployees.length > 0 && (
                <div className="appointment">
                    <div className="Selected-table-container">
                        <table className="selected-medicine-table2">
                            <thead>
                                <tr>
                                    <th id="slectbill_ins">Sl. No</th>
                                    <th id="slectbill_ins">Designation</th>
                                    <th id="slectbill_ins">Employee Name</th>
                                    <th id="slectbill_ins">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SelectedEmployees.map((row, index) => (
                                    <tr key={row.id}>
                                        <td>{index + 1}</td> {/* Display row number starting from 1 */}
                                        <td>{row.designation}</td>
                                        <td>{row.EmployeeName}</td>
                                        <td>
                                            <Button
                                                onClick={() => handleDeleteEmployee(row)} // Call your function to handle delete
                                                startIcon={<FaTrash />}
                                            >
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            <div className="RegisFormcon">
                <label>Status <span>:</span></label>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "150px",
                    }}
                >
                    <label style={{ width: "auto" }} htmlFor="status_yes">
                        <input
                            required
                            id="status_yes"
                            type="radio"
                            name="status"
                            value="Registered"
                            style={{ width: "15px" }}
                            checked={searchOPParams.status === "Registered"}
                            onChange={handleSearchChange}
                        />
                        Pending
                    </label>
                    <label style={{ width: "auto" }} htmlFor="status_no">
                        <input
                            required
                            id="status_no"
                            type="radio"
                            name="status"
                            value="Completed"
                            style={{ width: "15px" }}
                            checked={searchOPParams.status === "Completed"}
                            onChange={handleSearchChange}
                        />
                        Completed
                    </label>
                </div>
            </div>

            <ReactGrid columns={CircularColumns} RowData={CircularRegisterData} />
            <ToastAlert Message={toast.message} Type={toast.type} />
        </div>
    )
}

export default Circular


