import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { InputLabel } from "@mui/material";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye, FaLocationDot } from "react-icons/fa6";
import { MultiSelect } from "react-multi-select-component";
import { differenceInYears } from "date-fns";


const options = [
    { label: "ClinicMetrics", value: "ClinicMetrics" },
    { label: "FrontOffice", value: "FrontOffice" },
    { label: "Nurse", value: "Nurse" },
    { label: "DoctorWorkbench", value: "DoctorWorkbench" },
    { label: "Counselor", value: "Counselor" },
    { label: "Therapist", value: "Therapist" },
    { label: "Pharmacy", value: "Pharmacy" },
    { label: "Cashier", value: "Cashier" },
    { label: "PettyCash", value: "PettyCash" },
    { label: "StockManagement", value: "StockManagement" },
    { label: "UserControl", value: "UserControl" },
    { label: "HRManagement", value: "HRManagement" },
    { label: "Visiting_Doctor", value: "Visiting_Doctor" },
    { label: "EmployeeRequest", value: "EmployeeRequest" },
];

const suboptions = {
    ClinicMetrics: [{ label: "ClinicMetrics", value: "ClinicMetrics" }],
    FrontOffice: [
        { label: "AppointmentCalendar", value: "AppointmentCalendar" },
        { label: "AppoinmentRequest", value: "AppoinmentRequest" },
        { label: "BookingConfimation", value: "BookingConfimation" },
        { label: "OPRegister", value: "OPRegister" },
        { label: "ConcernForms", value: "ConcernForms" },
        { label: "LabReport", value: "LabReport" },
    ],
    Nurse: [
        { label: "ConcernForms", value: "ConcernForms" },
        { label: "PatientQueueList", value: "PatientQueueList" },
    ],
    DoctorWorkbench: [
        { label: "PatientList", value: "PatientList" },
        { label: "PatientQueueList", value: "PatientQueueList" },
    ],
    Counselor: [
        { label: "PatientList", value: "PatientList" },
        { label: "AppointmentCalendar", value: "AppointmentCalendar" },
        { label: "PatientQueueList", value: "PatientQueueList" },
        { label: "CounselorQueueList", value: "CounselorQueueList" },
    ],
    Therapist: [
        { label: "PatientList", value: "PatientList" },
        { label: "PatientQueueList", value: "PatientQueueList" },
    ],
    Pharmacy: [
        { label: "PharmacyBilling", value: "PharmacyBilling" },
        { label: "BillCancellation/Refund", value: "BillCancellation/Refund" },
        { label: "BillingHistory", value: "BillingHistory" },
        { label: "ShiftClosing", value: "ShiftClosing" },
        { label: "DayClosing", value: "DayClosing" },
        { label: "Report", value: "Report" },
    ],
    Cashier: [
        { label: "Billing", value: "Billing" },
        { label: "DueHistory", value: "DueHistory" },
        { label: "BillCancellation", value: "BillCancellation" },
        { label: "BillingHistory", value: "BillingHistory" },
        { label: "ShiftClosing", value: "ShiftClosing" },
        { label: "DayClosing", value: "DayClosing" },
        { label: "Report", value: "Report" },
    ],
    PettyCash: [
        { label: "ExpenseMaster", value: "ExpenseMaster" },
        { label: "CashExpenses", value: "CashExpenses" },
        { label: "DigitalExpenses", value: "DigitalExpenses" },
        { label: "ExpensesReport", value: "ExpensesReport" },
        { label: "HandOverSummary", value: "HandOverSummary" },
        { label: "DayReport", value: "DayReport" },
    ],
    StockManagement: [
        { label: "QuickStock", value: "QuickStock" },
        { label: "Supplierpay", value: "Supplierpay" },
        { label: "SupplierMaster", value: "SupplierMaster" },
        { label: "ProductMaster", value: "ProductMaster" },
        { label: "PurchaseMaster", value: "PurchaseMaster" },
        { label: "GRN", value: "GRN" },
        { label: "IndentApprove", value: "IndentApprove" },
        { label: "GRNApprove", value: "GRNApprove" },
        { label: "IndentRaise", value: "IndentRaise" },
        { label: "IndentRecieve", value: "IndentRecieve" },
        { label: "IndentIssue", value: "IndentIssue" },
    ],
    UserControl: [
        { label: "RoleManagement", value: "RoleManagement" },
        { label: "EmployeeQueueList", value: "EmployeeQueueList" },
        { label: "UserRegister", value: "UserRegister" },
        { label: "RatecardCharges", value: "RatecardCharges" },
        { label: "AccountSettings", value: "AccountSettings" },
        { label: "ClinicDetails", value: "ClinicDetails" },
        { label: "UserList", value: "UserList" },
        { label: "LeaveManagement", value: "LeaveManagement" },
        { label: "AdvanceManagement", value: "AdvanceManagement" },
        { label: "VisitDoctorBilling", value: "VisitDoctorBilling" },
    ],
    HRManagement: [
        { label: "EmployeeRegister", value: "EmployeeRegister" },
        { label: "EmployeeList", value: "EmployeeList" },
        { label: "Attendance", value: "Attendance" },
        { label: "LeaveApproval", value: "LeaveApproval" },
        { label: "AdvanceApproval", value: "AdvanceApproval" },
        { label: "PerformanceAppraisal", value: "PerformanceAppraisal" },
        { label: "PerformanceManagement", value: "PerformanceManagement" },
        { label: "LeaveManagement", value: "LeaveManagement" },
        { label: "AdvanceManagement", value: "AdvanceManagement" },
        { label: "PayRoll", value: "PayRoll" },
    ],
    VisitingDoctor: [
        { label: "VisitingDoctorPatients", value: "VisitingDoctorPatients" },
    ],
    EmployeeRequest: [
        { label: "LeaveManagement", value: "LeaveManagement" },
        { label: "AdvanceManagement", value: "AdvanceManagement" },
    ],
};

function DoctorRegistration() {

    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
    const urllink = useSelector(state => state.userRecord?.UrlLink);
    const navigate = useNavigate();
    const [editmode, seteditmode] = useState(false)
    const [selection3, setSelection3] = useState("");
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [selected, setSelected] = useState([]);
    const [availableSubOptions, setAvailableSubOptions] = useState([]);
    const [selectedSubOptions, setSelectedSubOptions] = useState([]);
    const DoctorRegisterEditdata = useSelector((state) => state.userRecord?.DoctorRegisterEditdata);

    console.log(DoctorRegisterEditdata)

    const [DoctorRegisterformData, setDoctorRegisterformData] = useState({

        // personal information 
        Title: '',
        DoctorID: '',
        FirstName: '',
        MiddleName: '',
        LastName: '',
        Gender: '',
        MaritalStatus: '',
        DOB: '',
        Age: '',
        FatherName_or_SpouseName: '',
        Nationality: '',
        ContactNumber: '',
        AlternatePhoneNumber: '',
        EmergencyContactNumber1: '',
        EmergencyContactNumber2: '',
        Email: '',
        CurrentAddress: '',
        PermanentAddress: '',
        LanguagesSpoken: '',

        // professional information 
        Qualification: '',
        Specialization: '',
        Department: '',
        Designation: '',
        MCINumber: '',
        StateRegistrationNumber: '',
        LicenseExpiryDate: '',
        YearsofExperience: '',


        // Insurance Details 
        InsuranceDetailsFile: null,
        InsuranceRenewalDate: '',
        MalpracticeInsuranceProviderName: '',
        PolicyNumber: '',
        CoverageAmount: '',
        ExpiryDate: '',



        // Work Details 
        EmployeeStatus: '',
        WorkSchedule: '',
        OPDSchedule: '',
        EmergencyAvailablity: '',
        Affiliations: '',

        // Documents 
        photo: null,
        Signature: null,
        AgreementFile: null,

        AdhaarCard: null,
        PanCard: null,

        // Bank Details 
        BankAccountNumber: '',
        BankName: '',
        BranchName: '',
        IFSCCode: '',
        PanCardNumber: '',

        // Contract Information 
        DateOfJoining: '',
        PreviousEmployeementHistory: '',
        AgreementDetailsCostCentre: '',
        Remarks: '',
        PreferedModeofCommunication: '',
        Username: '',
        Password: '',
        ContractStartDate: '',
        ContractEndDate: '',
        TypeofContract: '',
        ContractRenewalTerms: '',
        ContractForm: null,

        MainDepartment: [],
        SubDepartment: [],


    });

    console.log(DoctorRegisterformData)


    function dataURLtoBlob(dataURL) {
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: mimeString });
    }


    useEffect(() => {
        if (Object.keys(DoctorRegisterEditdata).length > 0) {
            seteditmode(true);

            // Convert data URLs to Blobs
            const convertedData = { ...DoctorRegisterEditdata };

            ['InsuranceDetailsFile', 'Photo', 'Signature', 'AdhaarCard', 'PanCard', 'AgreementFile', 'ContractForm'].forEach(field => {
                if (convertedData[field]) {
                    convertedData[field] = dataURLtoBlob(convertedData[field]);
                }
            });

            setDoctorRegisterformData(convertedData);
            setSelection3(DoctorRegisterEditdata?.EmergencyAvailablity);

             if (DoctorRegisterEditdata?.PreferedModeofCommunication) {
                const modes = DoctorRegisterEditdata.PreferedModeofCommunication.split(',');
                setSelectedOptions(modes);
            }
        } else {
            axios.get(`${urllink}HRmanagement/getDoctorID?location=${userRecord?.location}`)
                .then((response) => {
                    console.log(response.data);

                    setDoctorRegisterformData((prevData) => ({
                        ...prevData,
                        DoctorID: response.data.DoctorID,
                    }));
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [DoctorRegisterEditdata]);



    const handleSelectionChange3 = (e) => {
        setSelection3(e.target.value);
        setDoctorRegisterformData((prevData) => ({
            ...prevData,
            EmergencyAvailablity: e.target.value,
        }));
    };



    const handleSelectionChange4 = (e) => {
        const newval = e.target.value;

        setSelectedOptions((prevSelectedOptions) => {
            let updatedOptions;

            if (prevSelectedOptions.includes(newval)) {

                updatedOptions = prevSelectedOptions.filter(option => option !== newval);
            } else {

                updatedOptions = [...prevSelectedOptions, newval];
            }

            setDoctorRegisterformData((prevData) => ({
                ...prevData,
                PreferedModeofCommunication: updatedOptions.join(','),


            }));

            return updatedOptions;
        });
    };


    const handleChange12 = (e) => {
        const { name, value, files } = e.target;

        if (
            (name === "InsuranceDetailsFile" ||
                name === "photo" ||
                name === "Signature" ||
                name === "AdhaarCard" ||
                name === "PanCard" ||
                name === "AgreementFile" ||
                name === "ContractForm"
            ) &&
            files.length > 0
        ) {
            // Access the file object itself
            const fileObject = files[0];

            setDoctorRegisterformData((prevData) => ({
                ...prevData,
                [name]: fileObject,
            }));
        } else if
            (
            name === "ContactNumber" ||
            name === "AlternatePhoneNumber" ||
            name === "EmergencyContactNumber1" ||
            name === "EmergencyContactNumber2"
        ) {
            const newval = value.length;
            if (newval <= 10) {
                setDoctorRegisterformData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            } else {
                alert("Phone No must contain 10 digits");
            }
        } else if (name === "DOB") {
            const newDate = new Date();
            const oldDate = new Date(value);
            const age = differenceInYears(newDate, oldDate);

            setDoctorRegisterformData((prevData) => ({
                ...prevData,
                [name]: value,
                Age: age,
            }));
        } else {
            setDoctorRegisterformData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    }





    const handleTogglePassword = (e) => {
        e.preventDefault();
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };


    useEffect(() => {
        let newSubOptions = [];
        if (selected.length === options.length) {
            Object.keys(suboptions).forEach((option) => {
                newSubOptions = [...newSubOptions, ...suboptions[option]];
            });
            console.log("newSubOptions", newSubOptions);
            // setSelectedSubOptions(newSubOptions);
            setAvailableSubOptions(newSubOptions);
        } else {
            selected.forEach((selectedOption) => {
                console.log("label", selectedOption);
                console.log("suboptions", suboptions);
                console.log("suboptionslabel", suboptions[selectedOption.label]);
                if (suboptions[selectedOption.label]) {
                    newSubOptions = [
                        ...newSubOptions,
                        ...suboptions[selectedOption.label],
                    ];
                }
            });
            console.log("newSubOptions suboptions", newSubOptions);
            setAvailableSubOptions(newSubOptions);

        }
    }, [selected, suboptions, options.length]);

    const handleChange = (selected) => {
        setSelected(selected);
        if (selected || !selected.length) {
            setSelectedSubOptions([]);
        }

        setDoctorRegisterformData((prevData) => ({
            ...prevData,
            MainDepartment: selected.map((p) => p.value),
        }));



    };

    const handleSubOptionChange = (selectedSubOptions) => {
        setSelectedSubOptions(selectedSubOptions);

        setDoctorRegisterformData((prevData) => ({
            ...prevData,
            SubDepartment: selectedSubOptions.map((p) => p.value),
        }));

    };




    const handleRegister = () => {

        // const requiredFields = [
        //     { name: 'FirstName', label: 'First Name' },
        //     { name: 'LastName', label: 'Last Name' },
        //     { name: 'Gender', label: 'Gender' },
        //     { name: 'ContactNumber', label: 'Contact Number' },
        //     { name: 'Email', label: 'Email' },
        //     { name: 'Qualification', label: 'Qualification' },
        //     { name: 'Specialization', label: 'Specialization' },
        //     { name: 'Department', label: 'Department' },
        //     { name: 'Designation', label: 'Designation' },
        //     { name: 'MCINumber', label: 'MCI Number' },
        //     { name: 'StateRegistrationNumber', label: 'State Registration Number' },
        //     { name: 'LicenseExpiryDate', label: 'License Expiry Date' },
        //     { name: 'YearsofExperience', label: 'Years of Experience' },
        //     { name: 'InsuranceRenewalDate', label: 'Insurance Renewal Date' },
        //     { name: 'MalpracticeInsuranceProviderName', label: 'Malpractice Insurance Provider Name' },
        //     { name: 'PolicyNumber', label: 'Policy Number' },
        //     { name: 'CoverageAmount', label: 'Coverage Amount' },
        //     { name: 'ExpiryDate', label: 'Expiry Date' },
        //     { name: 'EmployeeStatus', label: 'Employee Status' },
        //     { name: 'WorkSchedule', label: 'Work Schedule' },
        //     { name: 'OPDSchedule', label: 'OPD Schedule' },
        //     { name: 'EmergencyAvailablity', label: 'Emergency Availability' },
        //     { name: 'BankAccountNumber', label: 'Bank Account Number' },
        //     { name: 'BankName', label: 'Bank Name' },
        //     { name: 'BranchName', label: 'Branch Name' },
        //     { name: 'IFSCCode', label: 'IFSC Code' },
        //     { name: 'PanCardNumber', label: 'Pan Card Number' },
        //     { name: 'DateOfJoining', label: 'Date of Joining' },
        //     { name: 'PreferedModeofCommunication', label: 'Preferred Mode of Communication' },
        //     { name: 'Username', label: 'Username' },
        //     { name: 'Password', label: 'Password' },
        //     { name: 'ContractStartDate', label: 'Contract Start Date' },
        //     { name: 'ContractEndDate', label: 'Contract End Date' },
        //     { name: 'TypeofContract', label: 'Type of Contract' },
        //     { name: 'ContractRenewalTerms', label: 'Contract Renewal Terms' }
        // ];



        // const missingFields = requiredFields.filter(field => !field.value).map(field => field.name);

        // if (missingFields.length > 0) {
        //     alert(`The following fields are missing: \n` +
        //         `\n` +
        //         `${missingFields.join(`, \n`)}`)
        //     return;
        // }

        const formData1 = new FormData();

        // Append data to FormData object
        Object.keys(DoctorRegisterformData).forEach((key) => {
            formData1.append(key, DoctorRegisterformData[key]);
        });

        formData1.append('createdBy', userRecord?.username)
        formData1.append('Location', userRecord?.location)

        axios.post(`${urllink}HRmanagement/insert_DoctorRegister`, formData1)
            .then((response) => {
                console.log("data", response.data)
                navigate('/Home/Doctor-List')
            })
            .catch((error) => {
                console.error(error)
            })
    }

    return (
        <div className='appointment'>
            <div className='h_head'>
                <h4>Doctor Registration</h4>
            </div>
            <div className="Add_items_Purchase_Master">
                <span>Personal Information</span>
            </div>
            <br />
            <div className="RegisFormcon">
                <div className="RegisForm_1">
                    <label htmlFor="DoctorID">
                        Doctor ID <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="DoctorID"
                        name="DoctorID"
                        value={DoctorRegisterformData?.DoctorID}
                        onChange={handleChange12}
                        disabled={editmode}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="Title">
                        Title <span>:</span>
                    </label>
                    <select
                        id="Title"
                        name="Title"
                        value={DoctorRegisterformData.Title}
                        onChange={handleChange12}
                        disabled={editmode}
                        required
                    >
                        <option className="">Select</option>
                        <option value="Dr">Dr.</option>
                        <option value="Mr">Mr.</option>
                        <option value="Ms">Ms.</option>
                        <option value="Mrs"> Mrs.</option>
                    </select>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="FirstName">
                        First Name <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="FirstName"
                        name="FirstName"
                        value={DoctorRegisterformData?.FirstName}
                        onChange={handleChange12}
                        disabled={editmode}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="MiddleName">
                        Middle Name <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="MiddleName"
                        name="MiddleName"
                        value={DoctorRegisterformData?.MiddleName}
                        onChange={handleChange12}
                        disabled={editmode}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="LastName">
                        Last Name <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="LastName"
                        name="LastName"
                        value={DoctorRegisterformData?.LastName}
                        onChange={handleChange12}
                        disabled={editmode}
                        required
                    />
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="Gender">
                        Gender <span>:</span>
                    </label>
                    <select
                        name="Gender"
                        required
                        id="Gender"
                        value={DoctorRegisterformData.Gender}
                        onChange={handleChange12}
                        disabled={editmode}
                    >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="DOB">
                        D.O.B <span>:</span>
                    </label>
                    <input
                        type="date"
                        name="DOB"
                        id="DOB"
                        disabled={editmode}
                        value={DoctorRegisterformData.DOB}
                        onChange={handleChange12}
                    />
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="Age">
                        Age <span>:</span>
                    </label>
                    <input
                        type="text"
                        name="Age"
                        id="Age"
                        disabled={editmode}
                        value={DoctorRegisterformData.Age}
                        onChange={handleChange12}
                    />
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="MaritalStatus">
                        Marital Status <span>:</span>
                    </label>
                    <select
                        name="MaritalStatus"
                        id="MaritalStatus"
                        value={DoctorRegisterformData.MaritalStatus}
                        onChange={handleChange12}
                        required
                    >
                        <option value="">Select</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                    </select>
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="FatherName_or_SpouseName">
                        Father Name / Spouse Name <span>:</span>
                    </label>
                    <input
                        type="text"
                        name="FatherName_or_SpouseName"
                        id="FatherName_or_SpouseName"
                        value={DoctorRegisterformData.FatherName_or_SpouseName}
                        onChange={handleChange12}
                    />
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="Nationality">
                        Nationality <span>:</span>
                    </label>
                    <input
                        type="text"
                        name="Nationality"
                        id="Nationality"
                        editmode={editmode}
                        value={DoctorRegisterformData.Nationality}
                        onChange={handleChange12}
                    />
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="ContactNumber">
                        Contact Number <span>:</span>
                    </label>
                    <input
                        type="number"
                        name="ContactNumber"
                        id="ContactNumber"
                        pattern="[0-9]*"
                        value={DoctorRegisterformData.ContactNumber}
                        onChange={handleChange12}
                    />
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="AlternatePhoneNumber">
                        Alternate Phone Number <span>:</span>
                    </label>
                    <input
                        type="number"
                        name="AlternatePhoneNumber"
                        id="AlternatePhoneNumber"
                        pattern="[0-9]*"
                        value={DoctorRegisterformData.AlternatePhoneNumber}
                        onChange={handleChange12}
                    />
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="EmergencyContactNumber1">
                        Emergency Contact Num1 <span>:</span>
                    </label>
                    <input
                        type="number"
                        name="EmergencyContactNumber1"
                        id="EmergencyContactNumber1"
                        pattern="[0-9]*"
                        value={DoctorRegisterformData.EmergencyContactNumber1}
                        onChange={handleChange12}
                    />
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="EmergencyContactNumber2">
                        Emergency Contact Num2 <span>:</span>
                    </label>
                    <input
                        type="number"
                        name="EmergencyContactNumber2"
                        id="EmergencyContactNumber2"
                        pattern="[0-9]*"
                        value={DoctorRegisterformData.EmergencyContactNumber2}
                        onChange={handleChange12}
                    />
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="Email">
                        Email <span>:</span>
                    </label>
                    <input
                        type="email"
                        name="Email"
                        id="Email"
                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                        value={DoctorRegisterformData.Email}
                        onChange={handleChange12}
                        required
                    />
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="CurrentAddress">
                        Current Address <span>:</span>
                    </label>
                    <textarea
                        name="CurrentAddress"
                        id="CurrentAddress"
                        value={DoctorRegisterformData.CurrentAddress}
                        onChange={handleChange12}
                        required
                    ></textarea>
                </div>

                <div class="RegisForm_1">
                    <label htmlFor="PermanentAddress">
                        Permanent Address <span>:</span>
                    </label>
                    <textarea
                        name="PermanentAddress"
                        id="PermanentAddress"
                        value={DoctorRegisterformData.PermanentAddress}
                        onChange={handleChange12}
                        required
                    ></textarea>
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="LanguagesSpoken">
                        Languages Spoken <span>:</span>
                    </label>
                    <input
                        type="text"
                        name="LanguagesSpoken"
                        id="LanguagesSpoken"
                        value={DoctorRegisterformData.LanguagesSpoken}
                        onChange={handleChange12}
                        required
                    />
                </div>
            </div>
            <br />
            <div className="Add_items_Purchase_Master">
                <span>Professional Information</span>
            </div>
            <br />
            <div className="RegisFormcon">
                <div className="RegisForm_1">
                    <label htmlFor="Qualification">
                        Qualification <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="Qualification"
                        name="Qualification"
                        value={DoctorRegisterformData?.Qualification}
                        onChange={handleChange12}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="Specialization">
                        Specialization <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="Specialization"
                        name="Specialization"
                        value={DoctorRegisterformData?.Specialization}
                        onChange={handleChange12}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="Department">
                        Department <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="Department"
                        name="Department"
                        value={DoctorRegisterformData?.Department}
                        onChange={handleChange12}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="Designation">
                        Designation <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="Designation"
                        name="Designation"
                        value={DoctorRegisterformData?.Designation}
                        onChange={handleChange12}
                    />
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="MCINumber">
                        MCI Number (Medical Council Registration) <span>:</span>
                    </label>
                    <input
                        type="text"
                        name="MCINumber"
                        id="MCINumber"
                        value={DoctorRegisterformData.MCINumber}
                        onChange={handleChange12}
                    />
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="StateRegistrationNumber">
                        State  Registration Number <span>:</span>
                    </label>
                    <input
                        type="text"
                        name="StateRegistrationNumber"
                        id="StateRegistrationNumber"
                        value={DoctorRegisterformData.StateRegistrationNumber}
                        onChange={handleChange12}
                    />
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="LicenseExpiryDate">
                        License Expiry Date<span>:</span>
                    </label>
                    <input
                        type="date"
                        name="LicenseExpiryDate"
                        id="LicenseExpiryDate"
                        value={DoctorRegisterformData.LicenseExpiryDate}
                        onChange={handleChange12}
                        required
                    />
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="YearsofExperience">
                        Years of Experience <span>:</span>
                    </label>
                    <input
                        type="text"
                        name="YearsofExperience"
                        id="YearsofExperience"
                        value={DoctorRegisterformData.YearsofExperience}
                        onChange={handleChange12}
                    />
                </div>
            </div>
            <br />
            <div className="Add_items_Purchase_Master">
                <span>Insurance Information</span>
            </div>
            <br />
            <div className="RegisFormcon">
                <div class="RegisForm_1">
                    <label htmlFor="InsuranceDetailsFile">
                        Insurance Details File <span>:</span>
                    </label>
                    <div className="RegisterForm_2">
                        <input
                            type="file"
                            id="InsuranceDetailsFile"
                            name="InsuranceDetailsFile"
                            className="hiden-nochse-file"
                            accept="image/*,.pdf"
                            onChange={handleChange12}
                            required
                        />
                        <label
                            htmlFor="InsuranceDetailsFile"
                            className="RegisterForm_1_btns choose_file_update"
                        >
                            Choose File
                        </label>
                    </div>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="InsuranceRenewalDate">
                        Insurance Renewal Date <span>:</span>
                    </label>
                    <input
                        type="date"
                        id="InsuranceRenewalDate"
                        name="InsuranceRenewalDate"
                        value={DoctorRegisterformData.InsuranceRenewalDate}
                        onChange={handleChange12}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="MalpracticeInsuranceProviderName">
                        Malpractice Insurance Provider Name<span>:</span>
                    </label>
                    <input
                        type="text"
                        id="MalpracticeInsuranceProviderName"
                        name="MalpracticeInsuranceProviderName"
                        value={DoctorRegisterformData?.MalpracticeInsuranceProviderName}
                        onChange={handleChange12}
                        disabled={editmode}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="PolicyNumber">
                        Policy Number<span>:</span>
                    </label>
                    <input
                        type="text"
                        id="PolicyNumber"
                        name="PolicyNumber"
                        value={DoctorRegisterformData?.PolicyNumber}
                        onChange={handleChange12}
                        disabled={editmode}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="CoverageAmount">
                        Coverage Amount<span>:</span>
                    </label>
                    <input
                        type="text"
                        id="CoverageAmount"
                        name="CoverageAmount"
                        value={DoctorRegisterformData?.CoverageAmount}
                        onChange={handleChange12}
                        disabled={editmode}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="ExpiryDate">
                        Expiry Date <span>:</span>
                    </label>
                    <input
                        type="date"
                        id="ExpiryDate"
                        name="ExpiryDate"
                        value={DoctorRegisterformData.ExpiryDate}
                        onChange={handleChange12}
                        required
                    />
                </div>

            </div>
            <div className="Add_items_Purchase_Master">
                <span>Work Details</span>
            </div>
            <br />
            <div className="RegisFormcon">
                <div className="RegisForm_1">
                    <label htmlFor="EmployeeStatus">
                        Employee Status <span>:</span>
                    </label>
                    <select
                        type="text"
                        id="EmployeeStatus"
                        name="EmployeeStatus"
                        value={DoctorRegisterformData?.EmployeeStatus}
                        onChange={handleChange12}
                        required
                    >
                        <option value=''>Select</option>
                        <option value='FullTime'>Full Time</option>
                        <option value='PartTime'>Part Time</option>
                        <option value='Visiting'>Visiting</option>

                    </select>
                </div>

                <div className="RegisForm_1">
                    <label htmlFor="WorkSchedule">
                        Work Schedule <span>:</span>
                    </label>
                    <select
                        type="text"
                        id="WorkSchedule"
                        name="WorkSchedule"
                        value={DoctorRegisterformData?.WorkSchedule}
                        onChange={handleChange12}
                        required
                    >
                        <option value=''>Select</option>
                        <option value='Shifts'>Shifts</option>
                        <option value='DaysoftheWeek'>Days of the Week</option>

                    </select>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="OPDSchedule">
                        OPD (Outpatient Department) Schedule <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="OPDSchedule"
                        name="OPDSchedule"
                        value={DoctorRegisterformData?.OPDSchedule}
                        onChange={handleChange12}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label>
                        Emergency Availablity <span>:</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="Yes"
                            checked={selection3 === "Yes"}
                            onChange={handleSelectionChange3}
                        />
                        <span>Yes</span>
                        <input
                            type="radio"
                            value="No"
                            checked={selection3 === "No"}
                            onChange={handleSelectionChange3}
                        />
                        <span>No</span>

                    </label>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="Affiliations">
                        Affiliations (Other Hospital , Clinics) <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="Affiliations"
                        name="Affiliations"
                        value={DoctorRegisterformData?.Affiliations}
                        onChange={handleChange12}
                        required
                    />
                </div>
            </div>
            <br />
            <div className="Add_items_Purchase_Master">
                <span>Digital Informations</span>
            </div>
            <div className="RegisFormcon">
                <div class="RegisForm_1">
                    <label htmlFor="photo">
                        Photo <span>:</span>
                    </label>
                    <div className="RegisterForm_2">
                        <input
                            type="file"
                            id="photo"
                            name="photo"
                            className="hiden-nochse-file"
                            accept="image/*,.pdf"
                            onChange={handleChange12}
                            required
                        />
                        <label
                            htmlFor="photo"
                            className="RegisterForm_1_btns choose_file_update"
                        >
                            Choose File
                        </label>
                    </div>
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="Signature">
                        Signature <span>:</span>
                    </label>
                    <div className="RegisterForm_2">
                        <input
                            type="file"
                            id="Signature"
                            name="Signature"
                            className="hiden-nochse-file"
                            accept="image/*,.pdf"
                            onChange={handleChange12}
                            required
                        />
                        <label
                            htmlFor="Signature"
                            className="RegisterForm_1_btns choose_file_update"
                        >
                            Choose File
                        </label>
                    </div>
                </div>
                <div className="RegisForm_1">
                    <label>
                        Adhaar Card<span>:</span>
                    </label>

                    <div className="RegisterForm_2">
                        <input
                            type="file"
                            id="AdhaarCard"
                            name="AdhaarCard"
                            accept="image/*,.pdf"
                            className="hiden-nochse-file"
                            onChange={handleChange12}
                            required
                        />
                        <label
                            htmlFor="AdhaarCard"
                            className="RegisterForm_1_btns choose_file_update"
                        >
                            Choose File
                        </label>
                    </div>
                </div>
                <div className="RegisForm_1">
                    <label>
                        Pan Card<span>:</span>
                    </label>

                    <div className="RegisterForm_2">
                        <input
                            type="file"
                            id="PanCard"
                            name="PanCard"
                            accept="image/*,.pdf"
                            className="hiden-nochse-file"
                            onChange={handleChange12}
                            required
                        />
                        <label
                            htmlFor="PanCard"
                            className="RegisterForm_1_btns choose_file_update"
                        >
                            Choose File
                        </label>
                    </div>
                </div>
                <div class="RegisForm_1">
                    <label htmlFor="AgreementFile">
                        Agreement File <span>:</span>
                    </label>
                    <div className="RegisterForm_2">
                        <input
                            type="file"
                            id="AgreementFile"
                            name="AgreementFile"
                            className="hiden-nochse-file"
                            accept="image/*,.pdf"
                            onChange={handleChange12}
                            required
                        />
                        <label
                            htmlFor="AgreementFile"
                            className="RegisterForm_1_btns choose_file_update"
                        >
                            Choose File
                        </label>
                    </div>
                </div>

            </div>
            <br />
            <div className="Add_items_Purchase_Master">
                <span>Bank Details</span>
            </div>
            <br />
            <div className="RegisFormcon">
                <div className="RegisForm_1">
                    <label htmlFor="BankAccountNumber">
                        Bank Account Number <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="BankAccountNumber"
                        name="BankAccountNumber"
                        value={DoctorRegisterformData?.BankAccountNumber}
                        onChange={handleChange12}
                        required
                    />
                </div>

                <div className="RegisForm_1">
                    <label htmlFor="BankName">
                        Bank Name <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="BankName"
                        name="BankName"
                        value={DoctorRegisterformData?.BankName}
                        onChange={handleChange12}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="BranchName">
                        Branch Name <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="BranchName"
                        name="BranchName"
                        value={DoctorRegisterformData?.BranchName}
                        onChange={handleChange12}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="IFSCCode">
                        IFSC Code <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="IFSCCode"
                        name="IFSCCode"
                        value={DoctorRegisterformData?.IFSCCode}
                        onChange={handleChange12}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="PanCardNumber">
                        PanCard Number<span>:</span>
                    </label>
                    <input
                        type="text"
                        id="PanCardNumber"
                        name="PanCardNumber"
                        value={DoctorRegisterformData?.PanCardNumber}
                        onChange={handleChange12}
                        required
                    />
                </div>
            </div>
            <br />
            <div className="Add_items_Purchase_Master">
                <span>Contract Details</span>
            </div>
            <div className="RegisFormcon">
                <div className="RegisForm_1">
                    <label htmlFor="DateOfJoining">
                        Date Of Joining <span>:</span>
                    </label>
                    <input
                        type="date"
                        id="DateOfJoining"
                        name="DateOfJoining"
                        value={DoctorRegisterformData?.DateOfJoining}
                        onChange={handleChange12}
                        required
                    />
                </div>

                <div className="RegisForm_1">
                    <label htmlFor="PreviousEmployeementHistory">
                        Previous Employeement History <span>:</span>
                    </label>
                    <textarea
                        type="text"
                        id="PreviousEmployeementHistory"
                        name="PreviousEmployeementHistory"
                        value={DoctorRegisterformData?.PreviousEmployeementHistory}
                        onChange={handleChange12}
                        required
                    ></textarea>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor=" AgreementDetailsCostCentre">
                        Agreement Details (Cost Centre %) <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="AgreementDetailsCostCentre"
                        name="AgreementDetailsCostCentre"
                        value={DoctorRegisterformData?.AgreementDetailsCostCentre}
                        onChange={handleChange12}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="Remarks">
                        Remarks <span>:</span>
                    </label>
                    <textarea
                        type="text"
                        id="Remarks"
                        name="Remarks"
                        value={DoctorRegisterformData?.Remarks}
                        onChange={handleChange12}
                        required
                    ></textarea>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="ContractStartDate">
                        Contract Start Date <span>:</span>
                    </label>
                    <input
                        type="date"
                        id="ContractStartDate"
                        name="ContractStartDate"
                        value={DoctorRegisterformData?.ContractStartDate}
                        onChange={handleChange12}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="ContractEndDate">
                        Contract End Date
                        <span>:</span>
                    </label>
                    <input
                        type="date"
                        id="ContractEndDate"
                        name="ContractEndDate"
                        value={DoctorRegisterformData?.ContractEndDate}
                        onChange={handleChange12}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="TypeofContract">
                        Type of Contract
                        <span>:</span>
                    </label>
                    <select
                        type="date"
                        id="TypeofContract"
                        name="TypeofContract"
                        value={DoctorRegisterformData?.TypeofContract}
                        onChange={handleChange12}
                        required
                    >
                        <option value=''>Select</option>
                        <option value='Fixed'>Fixed</option>
                        <option value='PerDay'>Per Day</option>
                        <option value='Hourly'>Hourly</option>
                        <option value='Salary'>Salary</option>
                    </select>
                </div>
                {/* <div className="RegisForm_1">
                    <label htmlFor="ContractRenewalTerms">
                        Amount For Contract Type
                        <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="ContractRenewalTerms"
                        name="ContractRenewalTerms"
                        value={DoctorRegisterformData?.ContractRenewalTerms}
                        onChange={handleChange12}
                        required
                    />
                </div> */}
                <div className="RegisForm_1">
                    <label htmlFor="ContractRenewalTerms">
                        Contract Renewal Terms
                        <span>:</span>
                    </label>
                    <textarea
                        type="date"
                        id="ContractRenewalTerms"
                        name="ContractRenewalTerms"
                        value={DoctorRegisterformData?.ContractRenewalTerms}
                        onChange={handleChange12}
                        required
                    >
                    </textarea>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="ContractForm">
                        Contract Form<span>:</span>
                    </label>

                    <div className="RegisterForm_2">
                        <input
                            type="file"
                            id="ContractForm"
                            name="ContractForm"
                            accept="image/*,.pdf"
                            className="hiden-nochse-file"
                            onChange={handleChange12}
                            required
                        />
                        <label
                            htmlFor="ContractForm"
                            className="RegisterForm_1_btns choose_file_update"
                        >
                            Choose File
                        </label>
                    </div>
                </div>
                <div className="RegisForm_1">
                    <div >
                        <label>
                            Prefered Mode of Communication <span>:</span>
                        </label>
                    </div>
                    <div className="mkkfloor90">
                        <label>
                            <input
                                type="checkbox"
                                value="Mobile"
                                checked={selectedOptions.includes("Mobile")}
                                onChange={handleSelectionChange4} 
                            />
                            <span>Mobile</span>

                        </label>
                        <label>
                            <input
                                type="checkbox"
                                value="SMS"
                                checked={selectedOptions.includes("SMS")}
                                onChange={handleSelectionChange4}
                            />
                            <span>SMS</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                value="Whatsapp"
                                checked={selectedOptions.includes("Whatsapp")}
                                onChange={handleSelectionChange4}
                            />
                            <span>Whatsapp</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                value="Email"
                                checked={selectedOptions.includes("Email")}
                                onChange={handleSelectionChange4}
                            />
                            <span>Email</span>
                        </label>
                    </div>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="Username">
                        User name <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="Username"
                        name="Username"
                        value={DoctorRegisterformData?.Username}
                        onChange={handleChange12}
                        required
                    />
                </div>
                <div className="RegisForm_1 input-with-icon">
                    <label htmlFor="Password">
                        Password<span>:</span>
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="Password"
                        name="Password"
                        value={DoctorRegisterformData.Password}
                        onChange={handleChange12}
                    />
                    <button
                        className="searching_input_icon3 wertyu312"
                        onClick={handleTogglePassword}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

            </div>
            <br />
            <div className="RegisFormcon flex_acrss_usr_regis3">
                <div className="flex_acrss_usr_regis3_label">
                    <label htmlFor="role">Access For Department<span>:</span></label>
                    <MultiSelect
                        options={options}
                        value={selected}
                        onChange={handleChange}
                        labelledBy="Select"
                        className="customMultiSelect"
                    />
                </div>

                <div className="flex_acrss_usr_regis3_label">
                    <label htmlFor="role">Access For SubDepartment<span>:</span></label>
                    <MultiSelect
                        options={availableSubOptions}
                        value={selectedSubOptions}
                        onChange={handleSubOptionChange}
                        labelledBy="Select"
                        className="customMultiSelect"
                    />
                </div>
                <div className="RegisForm_1" id="hide_div_regg"></div>
            </div>
            <div className="Register_btn_con">
                <button onClick={handleRegister} className="RegisterForm_1_btns">
                    {editmode ? 'Update' : 'Register'}
                </button>
            </div>
        </div >
    )
}

export default DoctorRegistration;





