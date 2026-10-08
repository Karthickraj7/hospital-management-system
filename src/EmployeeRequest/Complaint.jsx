import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";

const Complaint = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const toast = useSelector((state) => state.userRecord?.toast);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    
    const dispatch = useDispatch();


    const [complaint, setComplaint] = useState({
        EmployeeId: userRecord?.Employeeid || "",
        EmployeeName: "",
        Complaint: "",
        IncidentDate: "",
        IncidentTime: "",
        ComplaintEmployeeId: "",
        ComplaintEmployeeName: "",
        ComplaintEmployeeDepartment: "",
        Remarks: "",
        Description: "",
        location: userRecord?.location || "",
        witness: "",
        createdby: userRecord?.username || "",
    });
   
    const [department, setDepartment] = useState([]);
    const handleClear = useCallback(() => {
        setComplaint({
            EmployeeId: userRecord?.Employeeid || "",
            EmployeeName: "",
            Complaint: "",
            IncidentDate: "",
            IncidentTime: "",
            ComplaintEmployeeId: "",
            ComplaintEmployeeName: "",
            ComplaintEmployeeDepartment: "",
            Remarks: "",
            Description: "",
            location: userRecord?.location || "",
            witness: "",
            createdby: userRecord?.username || "",
        });
    }, [userRecord]);

    const handleonChange = useCallback((e) => {
        const { name, value } = e.target;
        setComplaint((prev) => ({
            ...prev,
            [name]: value.trim(),
        }));
    }, []);

    const validateForm = () => {
     
        if (!complaint.Complaint) {
            dispatch({
                type: "toast",
                value: { message: "Complaint field is required", type: "warn" },
            });
            return false;
        }
        return true;
    };
 

    useEffect(() => {
        const employeeId = userRecord?.Employeeid;
        if (employeeId) {
            axios
                .get(`${UrlLink}HR_Management/Employee_Details?employeeid=${employeeId}`)
                .then((response) => {
                    const res = response.data[0];
                    if (res) {
                        setComplaint((prev) => ({
                            ...prev,
                            EmployeeName: res?.Employeename || "",
                        }));
                    } else {
                        dispatch({
                            type: "toast",
                            value: { message: "Employee details not found", type: "warn" },
                        });
                    }
                })
                .catch((error) => {
                    console.error(error);
                    dispatch({
                        type: "toast",
                        value: { message: "Failed to fetch employee details", type: "error" },
                    });
                });
        }
    }, [userRecord?.Employeeid, UrlLink, dispatch]);


    useEffect(() => {
        axios
            .get(`${UrlLink}Masters/Department_Detials_link`)
            .then((response) => {
                // Destructuring response data directly
                const data = response.data;
                console.log("data",data);
               
                setDepartment(data);
            })
            .catch((err) => {
                console.error("Error fetching department details:", err);
            });
    }, [UrlLink]);

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const response = await axios.post(`${UrlLink}HR_Management/Add_Complaint`, complaint);
            const resres = response.data;
            const typp = Object.keys(resres)[0];
            const mess = Object.values(resres)[0];

            const tdata = {
                message: mess,
                type: typp,
            };

            dispatch({ type: "toast", value: tdata });
           
            // Clear the form only if the response indicates success
            if (typp.toLowerCase() === "success") {
                handleClear();
            }
        } catch (error) {
            console.error("Error submitting the complaint:", error);
            dispatch({
                type: "toast",
                value: { message: "Failed to submit complaint. Please try again.", type: "error" },
            });
        }
    };

    return (
        <div className="Main_container_app">

            <div className="RegisFormcon">
                <div className="RegisForm_1">
                    <label htmlFor="EmployeeId">Employee ID<sapn>:</sapn></label>
                    <input
                        type="text"
                        id="EmployeeId"
                        name="EmployeeId"
                        value={complaint.EmployeeId}
                        onChange={handleonChange}
                        disabled
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="EmployeeName">Employee Name<sapn>:</sapn></label>
                    <input
                        type="text"
                        id="EmployeeName"
                        name="EmployeeName"
                        value={complaint.EmployeeName}
                        onChange={handleonChange}
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="IncidentDate">Incident Date<sapn>:</sapn></label>
                    <input
                        type="date"
                        id="IncidentDate"
                        name="IncidentDate"
                        value={complaint.IncidentDate}
                        onChange={handleonChange}
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="IncidentTime">Incident Time<sapn>:</sapn></label>
                    <input
                        type="time"
                        id="IncidentTime"
                        name="IncidentTime"
                        value={complaint.IncidentTime}
                        onChange={handleonChange}
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="Complaint">Complaint<sapn>:</sapn></label>
                    <input
                        type="text"
                        id="Complaint"
                        name="Complaint"
                        value={complaint.Complaint}
                        onChange={handleonChange}
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="Description">Description<sapn>:</sapn></label>
                    <textarea
                        id="Description"
                        name="Description"
                        rows="4"
                        value={complaint.Description}
                        onChange={handleonChange}
                    ></textarea>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="ComplaintEmployeeId">Against Employee ID<sapn>:</sapn></label>
                    <input
                        type="text"
                        id="ComplaintEmployeeId"
                        name="ComplaintEmployeeId"
                        value={complaint.ComplaintEmployeeId}
                        onChange={handleonChange}
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="ComplaintEmployeeName">Against Employee Name<sapn>:</sapn></label>
                    <input
                        type="text"
                        id="ComplaintEmployeeName"
                        name="ComplaintEmployeeName"
                        value={complaint.ComplaintEmployeeName}
                        onChange={handleonChange}
                    />
                </div>
       
                <div className="RegisForm_1">
                    <label>
                        Against Employee Department <span>:</span>
                    </label>

                    <select
                        name="ComplaintEmployeeDepartment"
                        value={complaint.ComplaintEmployeeDepartment}
                        onChange={handleonChange}
                    >
                        <option value="">Select Department</option>
                        {Array.isArray(department) &&
                            department.filter((p) => p.Status === 'Active')?.map((Catg, indx) => (
                                <option key={indx} value={Catg.id}>
                                    {Catg.DepartmentName}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="witness">Witness<sapn>:</sapn></label>
                    <input
                        type="text"
                        id="witness"
                        name="witness"
                        value={complaint.witness}
                        onChange={handleonChange}
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="Remarks">Remarks<sapn>:</sapn></label>
                    <textarea
                        id="Remarks"
                        name="Remarks"
                        rows="4"
                        value={complaint.Remarks}
                        onChange={handleonChange}
                    ></textarea>
                </div>
            </div>
            <br></br>
            <div className="Register_btn_con">
                <button className="RegisterForm_1_btns" onClick={handleSubmit}>
                    Submit123
                </button>
            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
        </div>
    );
};

export default Complaint;
