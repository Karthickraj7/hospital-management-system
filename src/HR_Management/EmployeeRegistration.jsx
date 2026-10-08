import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  addMonths,
  addYears,
  format,
  startOfYear,
  subYears,
  isBefore,
} from "date-fns";
import { useNavigate } from "react-router-dom";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import male from "../Assets/maledoctor.jpg";
import female from "../Assets/femaledoctor.jpg";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import "../IP_Workbench/Nurse/jeeva.css";
import ModelContainer from "../OtherComponent/ModelContainer/ModelContainer";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import Webcam from "react-webcam";
import Skilset from "./Skilset";
import "./EmployeeRegistration.css";
import { useLocation } from "react-router-dom";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EmployeeRegistrationList from "./EmployeeRegistrationList";

const EmployeeRegistration = () => {
  //  14-2-25

  // 18-2-25

  const [HOD_details, setHOD_details] = useState([]);
  const [HR_details, setHR_details] = useState([]);
  //console.log(HOD_details, "HOD_details");
  const [leaveData, setLeaveData] = useState([]);

  const [allowanceData, setAllowanceData] = useState([]);
  const [selectedAllowance, setSelectedAllowance] = useState("select");
  const [allowancePercentage, setAllowancePercentage] = useState(0);
  const [inputType, setInputType] = useState("amount"); // To track whether the user is entering percentage or fixed amount
  const [allowanceAmount, setAllowanceAmount] = useState(0); // For fixed amount input


  
  // Handle input type selection (percentage or amount)
  const handleInputTypeChange = (e) => {
    setInputType(e.target.value);
  };

  // Handle allowance amount input change for fixed amount
  const handleAllowanceAmountChange = (e) => {
    const amountValue = parseFloat(e.target.value);
    setAllowanceAmount(amountValue); // Set the entered fixed amount
  };

  // Handle allowance selection change
  const handleAllowanceSelection = (e) => {
    const selectedValue = e.target.value;
    const selectedText = e.target.options[e.target.selectedIndex].text;
    setSelectedAllowance(selectedText); // Set the selected allowance name
  };

  // Handle allowance percentage input change
  const handleAllowancePercentageChange = (e) => {
    const percentageValue = parseFloat(e.target.value);
    setAllowancePercentage(percentageValue); // Set the entered percentage
  };
  const addAllowance = () => {
    if (
      selectedAllowance === "select" ||
      (inputType === "percentage" && allowancePercentage <= 0) ||
      (inputType === "amount" && allowanceAmount <= 0)
    )
      return; // Skip invalid input

    const totalSalary = parseFloat(EmployeeformData.Salary) || 0;
    const basicSalaryPercent =
      parseFloat(EmployeeformData.basicSalaryPercent) || 0;

    // Calculate basic and remaining salary
    const basicSalary = (totalSalary * basicSalaryPercent) / 100;
    const remainingSalary = totalSalary - basicSalary;

    // Calculate the allowance amount based on input type (percentage from total salary or fixed amount)
    const newAllowanceAmount =
      inputType === "percentage"
        ? (totalSalary * allowancePercentage) / 100 // Allowance percentage from total salary
        : allowanceAmount;

    // Calculate current total allowance
    const currentTotalAllowance = EmployeeformData.allowances.reduce(
      (total, allowance) => {
        const allowanceAmount =
          allowance.allowance_amount ||
          (totalSalary * allowance.allowance_percentage) / 100;
        return total + allowanceAmount;
      },
      0
    );

    // Validate if total allowance exceeds remaining salary
    if (currentTotalAllowance + newAllowanceAmount > remainingSalary) {
      alert(
        "The total allowance amount exceeds the remaining salary. Please adjust the value."
      );

      // Reset the inputs after the alert
      setSelectedAllowance("select");
      setAllowancePercentage(0);
      setAllowanceAmount(0); // Reset fixed amount if applicable

      return; // Prevent adding the allowance
    }

    // Check if the allowance already exists in the list
    if (
      !EmployeeformData.allowances.find(
        (item) => item.allowance_name === selectedAllowance
      )
    ) {
      setEmployeeformData((prev) => {
        const newAllowances = [
          ...prev.allowances,
          {
            allowance_name: selectedAllowance,
            allowance_percentage:
              inputType === "percentage" ? allowancePercentage : 0, // Set percentage if input type is percentage
            allowance_amount: newAllowanceAmount, // Send calculated amount
          },
        ];

        // Calculate total allowance amount
        const totalAllowance = newAllowances.reduce((total, allowance) => {
          const allowanceAmount =
            allowance.allowance_amount ||
            (totalSalary * allowance.allowance_percentage) / 100;
          return total + allowanceAmount;
        }, 0);

        return {
          ...prev,
          allowances: newAllowances,
          AllowanceAmount: totalAllowance.toFixed(2), // Update total allowance amount
        };
      });

      // Reset selections after adding
      setSelectedAllowance("select");
      setAllowancePercentage(0);
      setAllowanceAmount(0); // Reset fixed amount
    }
  };

  // Handle delete allowance
  const handleDeleteAllowance = (index) => {
    const updatedAllowances = EmployeeformData.allowances.filter(
      (_, i) => i !== index
    );
    setEmployeeformData((prev) => {
      const totalAllowance = updatedAllowances.reduce(
        (total, allowance) =>
          total +
          (parseFloat(prev.Salary - prev.BasicSalary) *
            allowance.allowance_percentage) /
            100,
        0
      );
      return {
        ...prev,
        allowances: updatedAllowances,
        AllowanceAmount: totalAllowance.toFixed(2),
      };
    });
  };

  //deduction

  //deduction const [deductionData, setDeductionData] = useState([]); // Deduction list
  const [deductionData, setdeductionData] = useState([]);
  const [selectedDeduction, setSelectedDeduction] = useState("select"); // Tracks selected deduction
  const [deductionAmount, setDeductionAmount] = useState(0); // Tracks deduction amount

  // Handle deduction selection change
  const handleDeductionSelection = (e) => {
    const selectedText = e.target.options[e.target.selectedIndex].text;
    setSelectedDeduction(selectedText); // Set the selected deduction name
  };

  // Handle deduction amount input change
  const handleDeductionAmountChange = (e) => {
    const amountValue = parseFloat(e.target.value);
    setDeductionAmount(amountValue); // Set the entered deduction amount
  };

  // Add deduction and amount when Add button is clicked
  const addDeduction = () => {
    if (selectedDeduction === "select" || deductionAmount <= 0) return; // Skip invalid input

    // Check if the deduction amount exceeds the Salary
    if (deductionAmount > parseFloat(EmployeeformData.BasicSalary)) {
      alert("Deduction amount cannot exceed the total salary.");

      // Reset the inputs after the alert
      setSelectedAllowance("select");
      setAllowancePercentage(0);
      setAllowanceAmount(0); // Reset fixed amount if applicable
      return;
    }

    // Check if the deduction already exists in the list
    if (
      !EmployeeformData.deductions.find(
        (item) => item.deduction_name === selectedDeduction
      )
    ) {
      setEmployeeformData((prev) => {
        const newDeductions = [
          ...prev.deductions,
          {
            deduction_name: selectedDeduction,
            deduction_amount: deductionAmount,
          },
        ];

        // Calculate total deduction amount based on entered amounts
        const totalDeduction = newDeductions.reduce(
          (total, deduction) => total + parseFloat(deduction.deduction_amount),
          0
        );
        // console.log(
        //   "hbcguthuivyiuobyegnyvytlveiovltlmevlyeo",
        //   totalDeduction,
        //   "gfhdjfhdkfjhbdfjfdfgf",
        //   typeof totalDeduction
       // );
        setDeductionAmount(totalDeduction);
        return {
          ...prev,
          deductions: newDeductions,
          DeductionAmount1: totalDeduction, // Update total deduction amount
        };
      });

      // Reset selections after adding
      setSelectedDeduction("select");
      setDeductionAmount(0);
    }
  };

  // Function to handle deduction deletion
  const handleDeleteDeduction = (index) => {
    // Create a new array excluding the deleted deduction
    const updatedDeductions = EmployeeformData.deductions.filter(
      (_, i) => i !== index
    );

    // Update the form data with the updated deduction list
    setEmployeeformData((prev) => {
      const totalDeduction = updatedDeductions.reduce(
        (total, deduction) => total + parseFloat(deduction.deduction_amount),
        0
      );

      return {
        ...prev,
        deductions: updatedDeductions,
        DeductionAmount1: totalDeduction, // Update total deduction amount
      };
    });
  };

  //console.log(allowanceData);
  // States to handle form data and leave entries
  const [leaveType, setLeaveType] = useState("select");
  const [numLeaves, setNumLeaves] = useState("");
  const [leavesList, setLeavesList] = useState([]);
  const totalleaves = leavesList.reduce(
    (total, leave) => total + Number(leave.numLeaves),
    0
  );

  //  console

  useEffect(() => {
    setEmployeeformData((prevData) => ({
      ...prevData,
      leavesList1: leavesList,
      TotalLeave: leavesList.reduce(
        (total, leave) => total + Number(leave.numLeaves),
        0
      ), // Update leavesList when it changes
    }));
  }, [leavesList]);

  //console.log("leavelist", leavesList);
  //console.log("total lragve ", totalleaves);
  // Handler for adding leave entry
  const handleAddLeave = () => {
    if (leaveType && numLeaves) {
      setLeavesList([...leavesList, { leaveType, numLeaves }]);

      // Reset form inputs
      setLeaveType("");
      setNumLeaves("");
    }
  };
  //console.log("total lragve ", totalleaves);

  // Function to handle leave deletion
  const handleDeleteLeave = (index) => {
    // Create a new array excluding the deleted leave entry
    const updatedLeavesList = leavesList.filter((_, i) => i !== index);

    // Update the leaves list
    setLeavesList(updatedLeavesList);
  };

  const [is_on_probation, setIsEmployeeOnProbation] = useState(false);

  const [ProbationStatus, setProbationStatus] = useState();

  const [requireGratuity, setrequireGratuity] = useState(false);

  const [PF_is_applicable, setPF_is_applicable] = useState(false);

  const [requiresSecurityDeposit, setRequiresSecurityDeposit] = useState();

  //console.log(is_on_probation, "is on probation");

  // 18-2-25
  useEffect(() => {
    setEmployeeformData((prevState) => ({
      ...prevState,
      is_on_probation,
      requireGratuity,
      requiresSecurityDeposit,
      PF_is_applicable,
    }));
  }, [is_on_probation, requireGratuity, requiresSecurityDeposit]);

  const handleCheckboxChange = (e) => {
    // Set state to the checkbox value (true/false)
    setRequiresSecurityDeposit(e.target.checked);
    //console.log("rerwefsdf", requiresSecurityDeposit);
  };

  const userRecord = useSelector((state) => state.userRecord?.UserData);
  //console.log(userRecord, "userRecord");
  const navigate = useNavigate();
  const EmployeeListId = useSelector(
    (state) => state.Frontoffice?.EmployeeListId
  );

  //console.log(EmployeeListId,'EmployeeListIddddddddddddd')
  const location = useLocation();

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const dispatchvalue = useDispatch();
  const dispatch = useDispatch();

  const webcamRef1 = useRef(null);
  const [showFile, setShowFile] = useState({ file1: false });
  const [isImageCaptured1, setIsImageCaptured1] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [deviceInfo, setDeviceInfo] = useState({
    device_type: null,
    os_type: null,
  });

  const [skills, setSkills] = useState([]);
  const [newSkills, setNewSkills] = useState([]);
  const [viewMode, setViewMode] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");

  const videoConstraints = { facingMode: facingMode };

  useEffect(() => {
    //console.log("Webcam ref:", webcamRef1.current);
  }, []);

  const [FilteredFormdataAddress, setFilteredFormdataAddress] = useState(null);

  const [TitleNameData, setTitleNameData] = useState([]);
  const [BloodGroupData, setBloodGroupData] = useState([]);

  const [Category, setCategory] = useState([]);
  const [Speciality, setSpeciality] = useState([]);
  const [Departments, setDepartments] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [selectDepartment, setSelectDepartment] = useState(false);
  const [selectDepModal, setselectDepModal] = useState({
    SelectDepartment: "",
  });
  const [Designations, setDesignations] = useState([]);
  const [Locations, setLocations] = useState([]);

  const [Classifications, setClassifications] = useState([]);
  const [Roles, setRoles] = useState([]);

  const [isPhoneValid, setIsPhoneValid] = useState({
    phone: false,
    alternatePhone: false,
    FatherContact: false,
    MotherContact: false,
    SpouseContact: false,
    EmergencyContactNo1: false,
    EmergencyContactNo2: false,
    WorkStationPhoneNo: false,
  });
  const [isEmailValid, setIsEmailValid] = useState(false);

  const [EmployeeformData, setEmployeeformData] = useState({
    Existing_Employee_ID : "",
    Title: "",
    FirstName: "",
    MiddleName: "",
    SurName: "",
    gender: "",
    dob: "",
    Age: "",
    bloodgroup: "",
    phone: "",
    alternatePhone: "",
    PFNumber: "",
    ESINumber: "",
    email: "",
    qualification: "",
    SkillSet: [],
    IdProofType: "",
    IdProofNo: "",

    maritalStatus: "",
    MarriagePlan: "",
    AnniversaryDate: "",
    FatherName: "",
    FatherContact: "",
    FatherWorking: "",
    FatherWorkPlace: "",

    MotherName: "",
    MotherContact: "",
    MotherWorking: "",
    MotherWorkPlace: "",

    SpouseName: "",
    SpouseContact: "",
    SpouseWorking: "",
    SpouseWorkPlace: "",
    Child: "",
    TotalNoChild: "",
    // address
    doorNo: "",
    Street: "",
    Area: "",
    City: "",
    District: "",
    State: "",
    Country: "",
    Pincode: "",
    PermanentAddressSame: "YES",
    // PERMANENT ADDRESS
    PermanentdoorNo: "",
    PermanentStreet: "",
    PermanentArea: "",
    PermanentCity: "",
    PermanentDistrict: "",
    PermanentState: "",
    PermanentCountry: "",
    PermanentPincode: "",
    Residence: "",
    EmergencyContactName1: "",
    EmergencyContactName2: "",
    EmergencyContactNo1: "",
    EmergencyContactNo2: "",
    ActiveStatus: "Yes",
    RequirementSource: "",
    Source: "",
    Photo: null,
    CapturedImage1: null,
    Signature: null,

    // Medical Information..................

    PsychiatricMedicines: "",
    PsychiatricMedicinesDetails: "",
    PreviousOperation: "",
    SurgeriesDetails: "",
    VaccinationStatus: "",
    VaccinationStatusDetails: "",
    MedicalFitnessCertificate: null,
    AnnualMedicalCheckup: null,

    // Employeement History..................

    PreviousWorkExperience: "No",
    PreviousPfnumber: "No",
    PreviousESInumber: "No",
    PFnumber: "",
    ESInumber: "",
    NoOfYears: "",
    WorkStationNameAddress: "",
    WorkStationPhoneNo: "",
    ReasonForLeft: "",
    ConfirmedBy: "",
    EmployeePaySlip: null,
    EmployeeOfferLetter: null,
    EmployeeReliveLetter: null,

    // Current Employment ..................

    DateOfJoining: "",
    Category: "",
    Classification: "",
    Role: "",
    Speciality: "",
    Department: "",
    DepartmentId: "",
    Designation: "",
    Locations: "",
    // EmployeeId: "",
    WorkEmail: "",
    ReportingManager: "",
    // GovtLeave: "",
    // CasualLeave: "",
    // SickLeave: "",
    TotalLeave: totalleaves,

    // 19-2-25

    allowances: [], // Array of selected allowances
    AllowancePercentage: allowancePercentage,
    AllowanceAmount: 0, // Total calculated allowance
    // BasicSalary: 0, // Assuming this is the basic salary

    deductions: [],
    DeductionAmount1: 0,

    //leavelist

    leavesList1: leavesList,

    // Probation Period : ""
    is_on_probation: false,
    probation_start_date: "",
    probation_end_date: "",
    probation_periods: 0,
    months_completed: 0,
    ProbationStatus: "select",
    ExtendedDate: "",
    ExtendedMonths: 0,
    TerminatedDate: "",
    confirmation_date: "",
    confidential_review_form: null,
    hod_review_form: null,
    hr_review_form: null,
    TrainingGivenBy: "select",
    TrainingVerifiedBy: "select",
    TrainingCompletedDate: "",
    // ProbationPeriod: "",
    // months: "",
    // years: "",

    IsPF_Applicable: false,

    requiresSecurityDeposit: false,
    security_start_date: "",
    total_security_amount: 0,
    Security_pending_months: 0,
    Security_installment_count: 0,
    Security_months_paid: 0,
    Security_months_to_be_scheduled: 0,
    security_end_date: "",

    PF_is_applicable: false,
    ESI_is_applicable: false,
    TDS_is_applicable : false,
    TDS_Percentage : 0,
    Employee_Percentage: 0,
    Employer_Percentage: 0,
    Employer_PF_amount: 0,
    Employee_PF_amount: 0,
    ESI_Percentage: 0,
    ESI_Amount: 0,
    TDS_Amount:0,
    requireGratuity: false,
    gratuity_start_date: "",
    total_gratuity_amount: 0,
    monthly_Gratuity_amount: 0,
    Gratuity_pending_months: 0,
    Gratuity_installment_count: 0,
    Gratuity_months_to_be_scheduled: 0,

    // Financial Information --------------------
    ctc: 0,
    Salary: 0,
    BasicSalary: 0,
    basicSalaryPercent: 0,
    PF_amount: 0,
    net_salary: 0,

    Allowance: "",
    PfForEmployee: 12,
    SecurityDeposite: 0,
    FinalAllowance: 0,

    AccountHolderName: "",
    AccountNumber: "",
    BankName: "",
    Branch: "",
    IfscCode: "",
    PanNumber: "",
    UploadCsvFile: null,

    // Document Checklist --------------------

    Resume: null,
    PanCard: null,
    AadharCard: null,
    BankPassbook: null,
    ExperienceCertificate: null,
    MedicalFitness: null,
    Offerletter: null,
  });

  const [MedicalInformation, setMedicalInformation] = useState({
    Fit: false,
    Epilepsy: false,
    Ashthma: false,
    Dm: false,
    Ht: false,
    Ihd: false,
  });
  //console.log("EmployeeformData", EmployeeformData);
  //console.log("EmployeeListId", EmployeeListId);

  const handleCloseModal = () => {
    setShowskil(false);
  };

  const HandleDepartmentSelect = () => {
    setSelectDepartment(true);
  };

  const SelectDataColumn = [
    {
      key: "id",
      name: "Department Id",
    },
    {
      key: "SelectedDepartment",
      name: "Selected Department",
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => {
        return (
          <>
            <Button
              className="cell_btn"
              onClick={() => handleDeleteDepartments(params.row)}
            >
              <DeleteIcon className="check_box_clrr_cancell" />
            </Button>
          </>
        );
      },
    },
  ];

  const handleDeleteDepartments = (departmentId) => {
    //console.log("Department ID to delete:", departmentId);
    const updatedDepartments = Departments.filter(
      (dep) => dep.id !== departmentId.id
    );
    //console.log("Updated Departments after deletion:", updatedDepartments);
    setDepartments(updatedDepartments);

    // Update the DoctorProfessForm state with the remaining departments
    setEmployeeformData((prev) => ({
      ...prev,
      Department: updatedDepartments
        .map((dep) => dep.SelectedDepartment)
        .join(", "),
      DepartmentId: updatedDepartments.map((dep) => dep.id).join(", "),
    }));
  };

  const handleinpchangeDepartment = (e) => {
    const { name, value } = e.target;
    const formattedValue = value;
    setselectDepModal((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };
  // Save the selected department
  const handleDepartmentSave = () => {
    const selectedDepartment = DepartmentData.find(
      (dep) => dep.id === parseInt(selectDepModal.SelectDepartment)
    );

    if (selectedDepartment) {
      const departmentExists = Departments.some(
        (dep) => dep.id === selectedDepartment.id
      );

      if (departmentExists) {
        // Dispatch a warning toast
        const tdata = {
          message: "The Department is already Selected",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        const updatedDepartments = [
          ...Departments,
          {
            id: selectedDepartment.id,
            SelectedDepartment: selectedDepartment.DepartmentName,
          },
        ];

        setDepartments(updatedDepartments);

        // Update the DoctorProfessForm state with a comma-separated string
        setEmployeeformData((prev) => ({
          ...prev,
          Department: updatedDepartments
            .map((dep) => dep.SelectedDepartment)
            .join(", "),
          DepartmentId: updatedDepartments.map((dep) => dep.id).join(", "),
        }));
      }
    }

    setselectDepModal({ SelectDepartment: "" }); // Reset after saving
  };

  const addSkill = () => {
    const skillName = newSkillName.trim();

    if (!skillName) {
      alert("Please enter a skill name.");
      return;
    }

    const normalizedSkillName = skillName.toLowerCase();
    if (
      skills.some((skill) => skill.name.toLowerCase() === normalizedSkillName)
    ) {
      alert("This skill already exists.");
      return;
    }

    // Add the new skill to the skills list
    setSkills((prevSkills) => [...prevSkills, { name: skillName, level: "" }]);

    // Clear the input field
    setNewSkillName(""); // Reset the input field by updating state
  };

  const deleteSkill = (index) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      const updatedSkills = skills.filter((_, i) => i !== index);
      setSkills(updatedSkills);
    }
  };

  const updateSkillLevel = (index, level) => {
    const updatedSkills = skills.map((skill, i) =>
      i === index ? { ...skill, level } : skill
    );
    setSkills(updatedSkills);
  };

  const saveSkills = () => {
    // Validation: Ensure at least one skill is added
    if (skills.length === 0) {
      dispatch({
        type: "toast",
        value: {
          message: "Please add at least one skill before submitting.",
          type: "warn",
        },
      });
      return;
    }

    // Validation: Check for incomplete skills
    const incompleteSkills = skills.filter((skill) => !skill.level);
    if (incompleteSkills.length > 0) {
      dispatch({
        type: "toast",
        value: {
          message: `Please select a proficiency level for the following skills: ${incompleteSkills
            .map((skill) => skill.name)
            .join(", ")}`,
          type: "warn",
        },
      });
      return;
    }

    // Prepare data for submission
    const Data = { skills };

    //console.log(Data, "Data to Submit");

    setEmployeeformData((prevState) => ({
      ...prevState,
      SkillSet: skills, // Add the skills array to the EmployeeformData
    }));

    setShowskil(false);
  };

  const handleViewClick = () => {
    // Merge saved skills and newly added skills
    const allSkills = [...(EmployeeformData.SkillSet || []), ...newSkills];
    setSkills(allSkills); // Update the skills state with merged data
    setShowskil(true); // Open the skill modal
    setViewMode(true); // Set the view mode to "read-only"
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Title_Master_link`)
      .then((res) => setTitleNameData(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${UrlLink}Masters/BloodGroup_Master_link`)
      .then((res) => setBloodGroupData(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${UrlLink}Masters/Category_Detials_link`)
      .then((res) => setCategory(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${UrlLink}Masters/Speciality_Detials_link`)
      .then((res) => setSpeciality(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${UrlLink}Masters/Department_Detials_link`)
      .then((res) => setDepartmentData(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${UrlLink}Masters/Designation_Detials_link`)
      .then((res) => setDesignations(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${UrlLink}Masters/Classification_Detials_link`)
      .then((res) => setClassifications(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${UrlLink}Masters/UserControl_Role_link`)
      .then((res) => setRoles(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${UrlLink}Masters/Location_Detials_link`)
      .then((res) => setLocations(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}patientmanagement/detect_device`)
      .then((response) => setDeviceInfo(response.data))
      .catch((error) => console.error(error));
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/get_employees_by_role`)
      .then((response) => setHOD_details(response.data))
      .catch((error) => console.error(error));
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/get_employees_by_role1`)
      .then((response) => setHR_details(response.data))
      .catch((error) => console.error(error));
  }, [UrlLink]);

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const handleRecaptureImage1 = () => {
    setEmployeeformData((prev) => ({
      ...prev,
      Photo: null,
    }));
    setIsImageCaptured1(false);
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  //important................

  useEffect(() => {
    //console.log("Webcam reference:", webcamRef1.current);
  }, [webcamRef1.current]);

  const handleCaptureImage1 = () => {
    if (webcamRef1.current && webcamRef1.current.getScreenshot) {
      const file = webcamRef1.current.getScreenshot();

      if (file && file.length > 0) {
        const formattedValue = dataURItoBlob(file);

        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        const maxSize = 5 * 1024 * 1024;

        if (
          !allowedTypes.includes(formattedValue.type) ||
          formattedValue.type === ""
        ) {
          const tdata = {
            message:
              "Invalid file type. Please upload a PDF, JPEG, or PNG file.",
            type: "warn",
          };
          dispatch({ type: "toast", value: tdata });
        } else if (formattedValue.size > maxSize) {
          const tdata = {
            message: "File size exceeds the limit of 5MB.",
            type: "warn",
          };
          dispatch({ type: "toast", value: tdata });
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            setEmployeeformData((prev) => ({
              ...prev,
              Photo: reader.result,
            }));
            setIsImageCaptured1(true);
          };
          reader.readAsDataURL(formattedValue);
        }
      } else {
        const tdata = {
          message:
            "Unable to capture the image. Please make sure the webcam is working.",
          type: "warn",
        };
        dispatch({ type: "toast", value: tdata });
      }
    } else {
      console.error(
        "Webcam reference is null or getScreenshot is not available."
      );
    }
  };

  // Function to calculate months difference
  const getMonthsCompleted = (startDate, endDate) => {
    if (!startDate || !endDate) return;

    const parsedDate = new Date(startDate);
    if (isNaN(parsedDate)) return 0;

    const yearsDiff = endDate.getFullYear() - parsedDate.getFullYear();
    const monthsDiff = endDate.getMonth() - parsedDate.getMonth();
    return yearsDiff * 12 + monthsDiff;
  };

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;

    // Update the form data state
    setEmployeeformData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Calculate the probation end date if probation_start_date or probation_periods changes
    if (name === "probation_start_date" || name === "probation_periods") {
      const todaydate = new Date();
      const probationStartDate =
        name === "probation_start_date"
          ? value
          : EmployeeformData.probation_start_date;
      const probationPeriods =
        name === "probation_periods"
          ? value
          : EmployeeformData.probation_periods;

      // Call the function to calculate the end date if both values are present
      if (probationStartDate && probationPeriods) {
        calculateProbationEndDate(probationStartDate, probationPeriods);

        const monthsCompleted = getMonthsCompleted(
          probationStartDate,
          todaydate
        );
        setEmployeeformData((prev) => ({
          ...prev,
          months_completed: monthsCompleted,
        }));
      }
    }

    // Calculate the number of probation periods if end date is changed
    if (name === "probation_end_date") {
      const probationStartDate = EmployeeformData.probation_start_date;
      const probationEndDate = value;

      if (probationStartDate && probationEndDate) {
        calculateProbationPeriods(probationStartDate, probationEndDate);
      }
    }
  };

  // Function to calculate the probation end date
  const calculateProbationEndDate = (startDate, months) => {
    if (!startDate || !months) return; // Ensure both start date and months are available

    const start = new Date(startDate);
    // Add the number of months to the start date
    const endDate = new Date(
      start.setMonth(start.getMonth() + parseInt(months, 10))
    );

    // Update the form data with the calculated end date
    setEmployeeformData((prevState) => ({
      ...prevState,
      probation_end_date: endDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
    }));
  };

  const calculateExtendedDate = (startDate, months) => {
    if (!startDate || !months) return; // Ensure both start date and months are available

    const start = new Date(startDate);
    // Add the number of months to the start date
    const endDate = new Date(
      start.setMonth(start.getMonth() + parseInt(months, 10))
    );

    // Update the form data with the calculated end date
    setEmployeeformData((prevState) => ({
      ...prevState,
      ExtendedMonths: months,
      probation_periods:
        Number(EmployeeformData.probation_periods) + Number(months),
      probation_end_date: endDate.toISOString().split("T")[0],
      ExtendedDate: endDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
    }));
  };
  // Function to calculate the number of probation periods
  const calculateProbationPeriods = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in months between the start and end dates
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    // Update the form data with the calculated number of periods
    setEmployeeformData((prevState) => ({
      ...prevState,
      probation_periods: months, // Update the probation periods in the state
    }));
  };

  const getCompletedEmi = (depositDate, monthsScheduled) => {
    if (!depositDate) return 0; // Handle empty input

    const deposit = new Date(depositDate);
    const today = new Date();

    // Calculate months difference
    const yearsDiff = today.getFullYear() - deposit.getFullYear();
    const monthsDiff = today.getMonth() - deposit.getMonth();
    let completedEmi = yearsDiff * 12 + monthsDiff;

    // Ensure completed EMI doesn't exceed scheduled EMIs
    return Math.min(completedEmi, monthsScheduled);
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    let formattedValue = value;
    let GapFormatValue = value.trim();

    // Capitalize the first letter for specific fields
    if (["FirstName", "MiddleName", "SurName", "AliasName"].includes(name)) {
      formattedValue = `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
    }

    if (name === "dob") {
      const selectedDate = new Date(value);
      const age = differenceInYears(new Date(), selectedDate);
      setEmployeeformData((prev) => ({
        ...prev,
        dob: value,
        Age: age >= 0 && age <= 100 ? age : "",
      }));

      return; // Exit after handling dob
    }

    if (name === "Age") {
      const intAge = parseInt(value, 10);
      if (!isNaN(intAge) && intAge >= 0 && intAge <= 100) {
        const dobDate = subYears(new Date(), intAge);
        setEmployeeformData((prev) => ({
          ...prev,
          Age: intAge,
          dob: format(dobDate, "yyyy-MM-dd"),
        }));
      } else {
        setEmployeeformData((prev) => ({
          ...prev,
          Age: value,
          dob: "",
        }));
      }
      return; // Exit after handling Age
    }

    if (name === "Title") {
      setEmployeeformData((prev) => ({
        ...prev,
        [name]: value, // Assign original dropdown value to Title
        gender: ["Miss", "Ms", "Mrs"].includes(value)
          ? "Female"
          : ["Mr", "Master"].includes(value)
          ? "Male"
          : ["TransGender", "Baby", "Dr"].includes(value)
          ? "Transgender"
          : prev.gender, // Retain existing gender if no match
      }));
      return; // Exit after handling Title
    }

    if (name === "maritalStatus") {
      setEmployeeformData((prev) => ({
        ...prev,
        [name]: value,
        SpouseName: ["Married", "Widowed"].includes(value)
          ? prev.SpouseName
          : "",
        AnniversaryDate: value === "Married" ? prev.AnniversaryDate : "", // Only keep AnniversaryDate if married
      }));
      return;
    }
    if (
      name === "phone" ||
      name === "alternatePhone" ||
      name === "FatherContact" ||
      name === "MotherContact" ||
      name === "SpouseContact" ||
      name === "EmergencyContactNo1" ||
      name === "EmergencyContactNo2" ||
      name === "WorkStationPhoneNo"
    ) {
      if (GapFormatValue.length <= 10) {
        setEmployeeformData((prev) => ({
          ...prev,
          [name]: GapFormatValue,
        }));

        // Update validity for the specific field
        setIsPhoneValid((prev) => ({
          ...prev,
          [name]: GapFormatValue.length === 10,
        }));
      } else {
        setIsPhoneValid((prev) => ({
          ...prev,
          [name]: false,
        }));
      }
      return;
    }

    if (name === "email") {
      const isGmail = value.endsWith("@gmail.com");
      setEmployeeformData((prev) => ({
        ...prev,
        email: value,
      }));
      setIsEmailValid(isGmail); // Update email validity
      return; // Exit after handling email
    }

    if (name === "Salary") {
      if (value === "" || parseFloat(value) === 0) {
        // If CTC is empty or zero, reset BasicSalary and GrossSalary
        setEmployeeformData((prev) => ({
          ...prev,
          [name]: value, // Clear CTC
          BasicSalary: 0, // Clear BasicSalary
        }));
      } else {
        // Calculate Basic Salary (60% of the salary)
        const salaryValue = parseFloat(value);
        const basicSalary = (salaryValue * 0.6).toFixed(2); // 60% of salary
        setEmployeeformData((prev) => ({
          ...prev,
          [name]: value,
          BasicSalary: basicSalary,
        }));
      }
    }
    if (name === "Residence") {
      setEmployeeformData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    if (name === "Pincode") {
      setEmployeeformData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (name === "PermanentAddressSame" && value === "NO") {
      if (
        name === "PermanentdoorNo" ||
        name === "PermanentStreet" ||
        name === "PermanentArea" ||
        name === "PermanentCity" ||
        name === "PermanentCountry" ||
        name === "PermanentPincode"
      ) {
        setEmployeeformData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === "PermanentAddressSame" && value === "YES") {
      setEmployeeformData((prev) => ({
        ...prev,
        PermanentdoorNo: "",
        PermanentStreet: "",
        PermanentArea: "",
        PermanentCity: "",
        PermanentDistrict: "",
        PermanentState: "",
        PermanentCountry: "",
        PermanentPincode: "",
      }));
    }

    if (type === "checkbox") {
      setEmployeeformData((prev) => ({
        ...prev,
        [name]: checked, // Use `checked` to toggle true/false
      }));
      return;
    }

    if (name === "ProbationPeriod") {
      setEmployeeformData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));

      if (value === "No") {
        // Reset probation-related fields and disable PF

        setEmployeeformData((prev) => ({
          ...prev,
          IsPF_Applicable: true,
          TrainingCompletedDate: "",
          TrainingVerifiedBy: "",
          TrainingGivenBy: "",
          years: "",
          months: "",
        }));
      }

      return;
    }

    if (name === "PfForEmployee" && EmployeeformData.IsPF_Applicable) {
      setEmployeeformData((prev) => ({
        ...prev,
        [name]: value, // Update PfForEmployee only if IsPF_Applicable is checked
      }));


      
    } else if (name === "PfForEmployee" && !EmployeeformData.IsPF_Applicable) {
      setEmployeeformData((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (name === "ExtendedMonths") {
      calculateExtendedDate(
        EmployeeformData.probation_end_date,
        formattedValue
      );
    }

    if (name === "Security_months_to_be_scheduled") {
      const completedEmi = getCompletedEmi(
        EmployeeformData.security_start_date,
        formattedValue
      );

      setEmployeeformData((prev) => ({
        ...prev,
        [name]: formattedValue,
        Security_months_paid:
          value > 0
            ? Number(EmployeeformData.total_security_amount) / Number(value)
            : 0,
        Security_installment_count: completedEmi,
        Security_pending_months: formattedValue - completedEmi,
      }));

     
    }

    // Handle all other fields normally
    setEmployeeformData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    setEmployeeformData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleMedicalInformationInputChange = (event) => {
    const { name, checked } = event.target;
    setMedicalInformation((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  useEffect(() => {
    if (EmployeeformData.PF_is_applicable) {
      const calculatedPF = (EmployeeformData.Salary * 12) / 100;
      setEmployeeformData((prevData) => ({
        ...prevData,
        PF_amount: calculatedPF.toFixed(2),
      }));
    } else {
      setEmployeeformData((prevData) => ({
        ...prevData,
        PF_amount: 0,
      }));
    }
  }, [EmployeeformData.BasicSalary, EmployeeformData.PF_is_applicable]);

  useEffect(() => {
    if (EmployeeformData.Employee_Percentage) {
      const calculatedPF =
        (EmployeeformData.BasicSalary * EmployeeformData.Employee_Percentage) / 100;
      setEmployeeformData((prevData) => ({
        ...prevData,
        Employee_PF_amount: calculatedPF.toFixed(2),
      }));
    } else {
      setEmployeeformData((prevData) => ({
        ...prevData,
        Employee_PF_amount: 0,
      }));
    }
  }, [EmployeeformData.Employee_Percentage]);

  useEffect(() => {
    if (EmployeeformData.Employer_Percentage) {
      const calculatedPF =
        (EmployeeformData.BasicSalary * EmployeeformData.Employer_Percentage) / 100;
      setEmployeeformData((prevData) => ({
        ...prevData,
        Employer_PF_amount: calculatedPF.toFixed(2),
      }));
    } else {
      setEmployeeformData((prevData) => ({
        ...prevData,
        Employer_PF_amount: 0,
      }));
    }
    if (EmployeeformData.ESI_Percentage) {
      const calculatedESI =
        (EmployeeformData.Salary * EmployeeformData.ESI_Percentage) / 100;
      setEmployeeformData((prevData) => ({
        ...prevData,
        ESI_Amount: calculatedESI.toFixed(2),
      }));
    } else {
      setEmployeeformData((prevData) => ({
        ...prevData,
        ESI_Amount: 0,
      }));
    }
  }, [EmployeeformData.Employer_Percentage, EmployeeformData.ESI_Percentage]);

  useEffect(() => {
    if (EmployeeformData.Pincode.length > 5 && !EmployeeListId?.Employee) {
      axios
        .get(
          `${UrlLink}Frontoffice/get_location_by_pincode?pincode=${EmployeeformData.Pincode}`
        )
        .then((response) => {
          const { country, state, city, district } = response.data;
          setEmployeeformData((prev) => ({
            ...prev,
            Country: country || "",
            State: state || "",
            City: city || "",
            District: district || "",
          }));
        })
        .catch((err) => {
          console.error("Error fetching pincode details:", err);
        });
    }
  }, [EmployeeformData.Pincode, EmployeeListId]);

  // 18-2-25
  useEffect(() => {
    // Fetch the leave data from the backend API when the component mounts
    const getLeaveMasterDetails = async () => {
      try {
        const response = await fetch(
          `${UrlLink}HR_Management/get_leave_master_details`
        ); // The URL for the backend endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse the response JSON
        setLeaveData(data); // Store the leave data in state
      } catch (error) {
        //console.log(error.message); // Handle any errors
      }
    };

    getLeaveMasterDetails();
  }, []);

  // 18-2-25

  useEffect(() => {
    // Fetch the leave data from the backend API when the component mounts
    const getAllowanceMasterDetails = async () => {
      try {
        const response = await fetch(
          `${UrlLink}HR_Management/get_allowances_details`
        ); // The URL for the backend endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse the response JSON
        setAllowanceData(data); // Store the leave data in state
      } catch (error) {
        //console.log(error.message); // Handle any errors
      }
    };

    getAllowanceMasterDetails(); // Call the function when the component mounts
  }, [UrlLink]); // Empty dependency array means this will run once when the component mounts

  //20-2-25

  useEffect(() => {
    // Fetch the leave data from the backend API when the component mounts
    const getDeductionMasterDetails = async () => {
      try {
        const response = await fetch(
          `${UrlLink}HR_Management/get_deduction_details`
        ); // The URL for the backend endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse the response JSON
        setdeductionData(data); // Store the leave data in state
      } catch (error) {
        //console.log(error.message); // Handle any errors
      }
    };

    getDeductionMasterDetails(); // Call the function when the component mounts
  }, []); // Empty dependency array means this will run once when the component mounts

  // Effect for permanent address Pincode when "PermanentAddressSame" is "NO"
  useEffect(() => {
    if (
      EmployeeformData.PermanentAddressSame === "NO" &&
      EmployeeformData.PermanentPincode.length > 5 &&
      !EmployeeListId?.Employee
    ) {
      axios
        .get(
          `${UrlLink}Frontoffice/get_location_by_pincode?pincode=${EmployeeformData.PermanentPincode}`
        )
        .then((response) => {
          const data = response.data;

          const { country, state, city, district } = data;
          setEmployeeformData((prev) => ({
            ...prev,
            PermanentCountry: country || "",
            PermanentState: state || "",
            PermanentCity: city || "",
            PermanentDistrict: district || "",
          }));
        })
        .catch((err) => {
          console.error("Error fetching permanent pincode details:", err);
        });
    }
  }, [
    EmployeeformData.PermanentAddressSame,
    EmployeeformData.PermanentPincode,
    EmployeeListId,
  ]); // Dependencies for PermanentAddressSame and PermanentPincode

  const Selectedfileview = (fileval) => {
    if (fileval) {
      let tdata = {
        Isopen: false,
        content: null,
        type: "image/jpg",
      };
      if (
        ["data:image/jpeg;base64", "data:image/jpg;base64"].includes(
          fileval?.split(",")[0]
        )
      ) {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "image/jpeg",
        };
      } else if (fileval?.split(",")[0] === "data:image/png;base64") {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "image/png",
        };
      } else if (fileval?.split(",")[0] === "data:application/pdf;base64") {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "application/pdf",
        };
      }

      dispatch({ type: "modelcon", value: tdata });
    } else {
      const tdata = {
        message: "There is no file to view.",
        type: "warn",
      };
      dispatch({ type: "toast", value: tdata });
    }
  };

  const handleinpchangeDocumentsForm = (e) => {
    const { name, files } = e.target;

    // Ensure that files exist and are not empty
    if (files && files.length > 0) {
      const formattedValue = files[0];

      // Optional: Add validation for file type and size
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"]; // Example allowed types
      const maxSize = 5 * 1024 * 1024; // Example max size of 5MB
      if (
        !allowedTypes.includes(formattedValue.type) ||
        formattedValue.type === ""
      ) {
        // Dispatch a warning toast or handle file type validation
        const tdata = {
          message: "Invalid file type. Please upload a PDF, JPEG, or PNG file.",
          type: "warn",
        };
        dispatch({ type: "toast", value: tdata });
      } else if (formattedValue.size > maxSize) {
        // Dispatch a warning toast or handle file size validation
        const tdata = {
          message: "File size exceeds the limit of 5MB.",
          type: "warn",
        };
        dispatch({ type: "toast", value: tdata });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setEmployeeformData((prev) => ({
            ...prev,
            [name]: reader.result,
          }));
        };
        reader.readAsDataURL(formattedValue);
      }
    } else {
      // Handle case where no file is selected
      const tdata = {
        message: "No file selected. Please choose a file to upload.",
        type: "warn",
      };
      dispatch({ type: "toast", value: tdata });
    }
  };

  const [showskil, setShowskil] = useState(false);

  const handleClear = () => {
    setEmployeeformData({});
    setMedicalInformation({});
  };

  useEffect(() => {
    const Employee = EmployeeListId?.Employee_Id;
    if (Employee) {
      axios
        .get(`${UrlLink}HR_Management/Get_Employee_Registered_Details`, {
          params: { Employee },
        })
        .then((res) => {
          const data = res.data;
          //console.log("get data", data);
          //console.log(data.Department);
          //console.log(data.departments);

          const department = data.Department.split(",") || [];
          const departmentId = data.departments.split(",");
          //console.log("id", departmentId);
          //console.log("name", department);
          // Map each department ID to its corresponding department name
          const departmentData = departmentId.map((id, index) => ({
            id: id.trim(), // Trim to remove any leading/trailing whitespace
            SelectedDepartment: department[index]?.trim(), // Trim department name and ensure it's mapped correctly
          }));

          // Log the mapped department data for verification
          //console.log("Mapped Department Data:", departmentData);

          // Set the mapped department data to the state
          setDepartments(departmentData);

          const EmployeeHistory = data.EmployeeHistory[0] || {};
          const EmployeeSkillset = data.EmployeeSkillset || [];
          const EmployeeMedicalInfo = data.EmployeeMedicalInfo[0] || {};
          const EmployeeCurrentDetails = data.EmployeeCurrentDetails[0] || {};
          const EmployeeProbationDetails =
            data.EmployeeProbationDetails[0] || {};
          const EmployeeSecurityDepositDetails =
            data.EmployeeSecurityDepositDetails[0] || {};
          const EmployeeGratuityDetails = data.EmployeeGratuityDetails[0] || {};
          const EmployeeLeavelist = data.EmployeeLeavelist || [];
          const EmployeeAllowanceDetails = data.EmployeeAllowanceDetails || [];
          const EmployeeDeductionDetails = data.EmployeeDeductioDetails || [];

          //console.log("leave detilas", typeof EmployeeLeavelist);
          //console.log("allowance detilas", typeof EmployeeAllowanceDetails);
          //console.log("deduction detilas", typeof EmployeeDeductionDetails);

          setLeavesList(
            Array.isArray(EmployeeLeavelist)
              ? EmployeeLeavelist
              : [EmployeeLeavelist]
          );
          // setSelectedAllowance(Array.isArray(EmployeeAllowanceDetails)? EmployeeAllowanceDetails : [EmployeeAllowanceDetails]);
          // setLeavesList(EmployeeLeavelist)
          // setLeaveType(EmployeeLeavelist.leave_type)
          // setNumLeaves(EmployeeCurrentDetails.leave_count)
          // //console.log("is on probation", data.EmployeeProbationDetails?.is_on_probation || false )
          const EmployeeFinancialHistory =
            data.EmployeeFinancialHistory[0] || {};
          const EmployeeDocumentChecklist =
            data.EmployeeDocumentChecklist[0] || {};

          //console.log(EmployeeSkillset, "EmployeeSkillset");

          const medicalConditions =
            EmployeeMedicalInfo?.PreExisiting_Medical_Condition?.split(",") ||
            [];
          const mappedMedicalConditions = {
            Fit: medicalConditions.includes("Fit"),
            Epilepsy: medicalConditions.includes("Epilepsy"),
            Ashthma: medicalConditions.includes("Ashthma"),
            Dm: medicalConditions.includes("Dm"),
            Ht: medicalConditions.includes("Ht"),
            Ihd: medicalConditions.includes("Ihd"),
          };

          if (data) {
            //console.log("data", data);
            setEmployeeformData((prev) => ({
              ...prev,
              Existing_Employee_ID : data.Existing_Employee_ID || "",
              Title: data.Title || "",
              FirstName: data.FirstName || "",
              MiddleName: data.MiddleName || "",
              SurName: data.LastName || "",
              gender: data.Gender || "",
              dob: data.DOB || "",
              Age: data.Age || "",
              bloodgroup: data.BloodGroup || "",
              phone: data.Phone || "",
              alternatePhone: data.Alternate_Number || "",
              email: data.Email || "",
              qualification: data.Qualification || "",
              SkillSet: EmployeeSkillset.map((skill) => ({
                name: skill.skill_name,
                level: skill.skill_level,
              })),
              IdProofType: data.IdProofType || "",
              IdProofNo: data.IdProofNo || "",
              maritalStatus: data.Marital_Status || "",
              AnniversaryDate: data.AnniversaryDate || "",
              Residence: data.Residence || "",
              MarriagePlan: data.MarriagePlan || "",
              FatherName: data.FatherName || "",
              FatherContact: data.FatherContact || "",
              FatherWorking: data.FatherWorking || "",
              FatherWorkPlace: data.FatherWorkPlace || "",
              MotherName: data.MotherName || "",
              MotherContact: data.MotherContact || "",
              MotherWorking: data.MotherWorking || "",
              MotherWorkPlace: data.MotherWorkPlace || "",
              SpouseName: data.Spouse_Name || "",
              SpouseContact: data.SpouseContact || "",
              SpouseWorking: data.SpouseWorking || "",
              SpouseWorkPlace: data.SpouseWorkPlace || "",
              Child: data.Child || "",
              TotalNoChild: data.TotalNoChild || "",
              doorNo: data.DoorNo || "",
              Street: data.Street || "",
              Area: data.Area || "",
              City: data.City || "",
              District: data.District || "",
              State: data.State || "",
              Country: data.Country || "",
              Pincode: data.Pincode || "",
              PermanentAddressSame: data.PermanentAddressSameAsAbove || "",
              PermanentdoorNo: data.PermanentDoorNo || "",
              PermanentStreet: data.PermanentStreet || "",
              PermanentArea: data.PermanentArea || "",
              PermanentCity: data.PermanentCity || "",
              PermanentDistrict: data.PermanentDistrict || "",
              PermanentState: data.PermanentState || "",
              PermanentCountry: data.PermanentCountry || "",
              PermanentPincode: data.PermanentPincode || "",
              Category: data?.Category || "",
              Speciality: data?.Speciality || "",
              Department: department || "",
              DepartmentId: data?.departments || "",
              Designation: data?.Designation || "",
              Classification: data?.Classification || "",
              Role: data?.Role || "",
              EmergencyContactName1: data.EmergencyContactName1 || "",
              EmergencyContactName2: data.EmergencyContactName2 || "",
              EmergencyContactNo1: data.EmergencyContactNo1 || "",
              EmergencyContactNo2: data.EmergencyContactNo2 || "",
              ActiveStatus: data.ActiveStatus || "",
              RequirementSource: data.RequirementSource || "",
              Source: data.Source || "",
              Photo: data.Photo || null,
              Signature: data.Signature || null,
              CaptureImage1: data.CaptureImage1 || null,

              PreviousWorkExperience:
                EmployeeHistory?.PreviousWorkExperience || "",
              PreviousPfnumber: EmployeeHistory?.PreviousWorkPFNumber || "",
              PreviousESInumber: EmployeeHistory?.PreviousWorkESINumber || "",
              PFnumber: EmployeeHistory?.PFNumber || "",
              ESInumber: EmployeeHistory?.ESINumber || "",
              NoOfYears: EmployeeHistory?.NoOfYears || "",
              WorkStationNameAddress:
                EmployeeHistory?.WorkStationNameAddress || "",
              ReasonForLeft: EmployeeHistory?.ReasonForLeft || "",
              WorkStationPhoneNo: EmployeeHistory?.WorkStationPhoneNo || "",
              EmployeePaySlip: EmployeeHistory?.EmployeePaySlip || null,
              EmployeeOfferLetter: EmployeeHistory?.EmployeeOfferLetter || null,
              EmployeeReliveLetter:
                EmployeeHistory?.EmployeeReliveLetter || null,
              ConfirmedBy: EmployeeHistory?.ConfirmedBy || "",

              // PreExisiting_Medical_Condition: EmployeeMedicalInfo?.PreExisiting_Medical_Condition || '',

              PsychiatricMedicines:
                EmployeeMedicalInfo?.PsychiatricMedicines || "",
              PsychiatricMedicinesDetails:
                EmployeeMedicalInfo?.PsychiatricMedicinesDetails || "",
              PreviousOperation: EmployeeMedicalInfo?.PreviousOperation || "",
              SurgeriesDetails: EmployeeMedicalInfo?.SurgeriesDetails || "",
              VaccinationStatus: EmployeeMedicalInfo?.VaccinationStatus || "",
              VaccinationStatusDetails:
                EmployeeMedicalInfo?.VaccinationStatusDetails || "",
              MedicalFitnessCertificate:
                EmployeeMedicalInfo?.MedicalFitnessCertificate || "",
              AnnualMedicalCheckup:
                EmployeeMedicalInfo?.AnnualMedicalCheckup || "",

              DateOfJoining: EmployeeCurrentDetails?.DateOfJoining || "",
              Locations:
                EmployeeCurrentDetails?.CurrentEmployeementLocations || "",
              ReportingManager: EmployeeCurrentDetails?.ReportingManager || "",
              GovtLeave: EmployeeCurrentDetails?.GovtLeave || "",
              CasualLeave: EmployeeCurrentDetails?.CasualLeave || "",
              SickLeave: EmployeeCurrentDetails?.SickLeave || "",
              TotalLeave: EmployeeCurrentDetails?.TotalLeave || "",
              WorkEmail: EmployeeCurrentDetails?.WorkEmail || "",
              // ProbationPeriod: EmployeeCurrentDetails?.ProbationPeriod || "",
              // months: EmployeeCurrentDetails?.Months || "",
              // years: EmployeeCurrentDetails?.Years || "",
              // TrainingGivenBy: EmployeeCurrentDetails?.TrainingGivenBy || "",
              // TrainingVerifiedBy:
              //   EmployeeCurrentDetails?.TrainingVerifiedBy || "",
              // TrainingCompletedDate:
              //   EmployeeCurrentDetails?.TrainingCompletedDate || "",
              IsPF_Applicable: EmployeeCurrentDetails?.IsPF_Applicable || "No",
              BasicSalary: EmployeeFinancialHistory?.BasicSalary || 0,
              ctc: EmployeeFinancialHistory?.ctc || 0,
              Salary: EmployeeFinancialHistory?.Salary || "",
              AllowanceAmount: EmployeeFinancialHistory?.AllowanceAmount || 0,
              DeductionAmount: EmployeeFinancialHistory?.DeductionAmount || 0,
              PfForEmployee: EmployeeFinancialHistory?.PfForEmployee || "",
              SecurityDeposite:
                EmployeeFinancialHistory?.SecurityDeposite || "",
              AccountHolderName:
                EmployeeFinancialHistory?.AccountHolderName || "",
              AccountNumber: EmployeeFinancialHistory?.AccountNumber || "",
              BankName: EmployeeFinancialHistory?.BankName || "",
              Branch: EmployeeFinancialHistory?.Branch || "",
              IfscCode: EmployeeFinancialHistory?.IfscCode || "",
              PanNumber: EmployeeFinancialHistory?.PanNumber || "",
              UploadCsvFile: EmployeeFinancialHistory?.UploadCsvFile || null,
              FinalAllowance: EmployeeFinancialHistory?.FinalAllowance || "",
              Resume: EmployeeDocumentChecklist?.Resume || null,
              PanCard: EmployeeDocumentChecklist?.PanCard || null,
              AadharCard: EmployeeDocumentChecklist?.AadharCard || null,
              BankPassbook: EmployeeDocumentChecklist?.BankPassbook || null,
              ExperienceCertificate:
                EmployeeDocumentChecklist?.ExperienceCertificate || null,
              MedicalFitness: EmployeeDocumentChecklist?.MedicalFitness || null,
              Offerletter: EmployeeDocumentChecklist?.Offerletter || null,

              // 18-2-25

              is_on_probation:
                EmployeeProbationDetails?.is_on_probation || false,

              probation_start_date:
                EmployeeProbationDetails?.probation_start_date || "",
              probation_end_date:
                EmployeeProbationDetails?.probation_end_date || "",
              probation_periods:
                EmployeeProbationDetails?.probation_periods || 0,
              months_completed: EmployeeProbationDetails?.months_completed || 0,
              ProbationStatus:
                EmployeeProbationDetails?.ProbationStatus || "select",
              ExtendedDate: EmployeeProbationDetails?.ExtendedDate || "",
              ExtendedMonths: EmployeeProbationDetails?.ExtendedMonths || 0,
              TerminatedDate: EmployeeProbationDetails?.TerminatedDate || "",
              confirmation_date:
                EmployeeProbationDetails?.confirmation_date || "",
              confidential_review_form:
                EmployeeProbationDetails?.confidential_review_form || null,
              hod_review_form:
                EmployeeProbationDetails?.hod_review_form || null,
              hr_review_form: EmployeeProbationDetails?.hr_review_form || null,
              TrainingGivenBy: EmployeeProbationDetails?.TrainingGivenBy || "",
              TrainingVerifiedBy:
                EmployeeProbationDetails?.TrainingVerifiedBy || "",
              TrainingCompletedDate:
                EmployeeProbationDetails?.TrainingCompletedDate || "",
              //

              requiresSecurityDeposit:
                EmployeeSecurityDepositDetails?.requiresSecurityDeposit ||
                false,
              security_start_date:
                EmployeeSecurityDepositDetails?.security_start_date || "",
              total_security_amount:
                EmployeeSecurityDepositDetails?.total_security_amount || 0,
              Security_pending_months:
                EmployeeSecurityDepositDetails?.Security_pending_months || 0,
              Security_installment_count:
                EmployeeSecurityDepositDetails?.Security_installment_count || 0,
              Security_months_paid:
                EmployeeSecurityDepositDetails?.Security_months_paid || 0,
              Security_months_to_be_scheduled:
                EmployeeSecurityDepositDetails?.Security_months_to_be_scheduled ||
                0,
              security_end_date:
                EmployeeSecurityDepositDetails?.security_end_date || "",

              //

              requireGratuity:
                EmployeeGratuityDetails?.requireGratuity || false,
              PF_is_applicable:
                EmployeeFinancialHistory?.PF_is_applicable || false,
              gratuity_start_date:
                EmployeeGratuityDetails?.gratuity_start_date || "",
              total_gratuity_amount:
                EmployeeGratuityDetails?.total_gratuity_amount || 0,
              monthly_Gratuity_amount:
                EmployeeGratuityDetails?.monthly_Gratuity_amount || 0,
              Gratuity_pending_months:
                EmployeeGratuityDetails?.Gratuity_pending_months || 0,
              Gratuity_installment_count:
                EmployeeGratuityDetails?.Gratuity_installment_count || 0,
              Gratuity_months_to_be_scheduled:
                EmployeeGratuityDetails?.Gratuity_months_to_be_scheduled || 0,

                ESI_is_applicable : EmployeeFinancialHistory?.ESI_is_applicable || false,
                TDS_is_applicable : EmployeeFinancialHistory?.TDS_is_applicable || false,
                TDS_Percentage : EmployeeFinancialHistory?.TDS_Percentage || 0,
                TDS_Amount : EmployeeFinancialHistory?.TDS_Amount || 0,
                ESI_Percentage : EmployeeFinancialHistory?.ESI_Percentage || 0,
                ESI_Amount : EmployeeFinancialHistory?.ESI_Amount || 0,
                Employee_Percentage : EmployeeFinancialHistory?.PF_EmployeePercentage || 0,
                Employer_Percentage : EmployeeFinancialHistory?.PF_EmployerPercentage || 0,
                Employer_PF_amount : EmployeeFinancialHistory?.PF_EmployerAmount || 0,
                Employee_PF_amount : EmployeeFinancialHistory?.PF_EmployeeAmount || 0,
                PFNumber : EmployeeFinancialHistory?.PFNumber,
                ESINumber : EmployeeFinancialHistory?.ESINumber,



              allowances: EmployeeAllowanceDetails.map((allowance) => ({
                allowance_name: allowance.allowance_name,
                allowance_percentage: allowance.allowance_percentage,
                allowance_amount: allowance.allowance_amount,
              })),

              deductions: EmployeeDeductionDetails.map((deduction) => ({
                deduction_name: deduction.deduction_name,
                deduction_amount: deduction.deduction_amount,
              })),
              // 19-2-25
              // leavesList1 : EmployeeLeavelist.map((leave)=>{
              //   leaveType:leave.leaveType,
              //   numLeaves : leave.leave_count,

              //  })
            }));
            setMedicalInformation((prev) => ({
              ...prev,
              ...mappedMedicalConditions,
            }));
          }
        });
    }
  }, [UrlLink, EmployeeListId]);

  const handleSubmit = async () => {
    // Combine EmployeeformData and other necessary data
    const Data = {
      ...EmployeeformData,
      Createdby: userRecord?.username,
      Location: userRecord?.location,
      Employee_Id: EmployeeListId?.Employee_Id || "",
      PreExistingMedicalCondition: Object.keys(MedicalInformation)
        .filter((key) => MedicalInformation[key]) // Filter out keys with truthy values
        .join(","), // Join the keys with commas
    };

    //console.log(Data, "Datakkkkkkkkkkkk");

    // List of required fields
    const requiredFields = [
      "FirstName",
      "Title",
      "dob",
      "Age",
      "gender",
      "phone",

      "Designation",
    ];

    const emptyFields = requiredFields.filter(
      (field) => !EmployeeformData[field]
    );

    if (emptyFields.length > 0) {
      alert(`The following fields are required: ${emptyFields.join(", ")}`);
      return;
    }

    try {
      if(Data.Employee_Id){
           const response = await axios.post(
        `${UrlLink}Frontoffice/update_employee`,
        Data // Send plain JSON object
         );

      // Handle response
      const [type, message] = [
        Object.keys(response.data)[0],
        Object.values(response.data)[0],
      ];
      dispatch({ type: "toast", value: { message, type } });
      dispatchvalue({ type: "EmployeeListId", value: {} });
      dispatchvalue({ type: "HrFolder", value: "EmployeeRegistrationList" });
      }

      else{
      // Send a POST request with the JSON payload
      const response = await axios.post(
        `${UrlLink}HR_Management/Employee_Registration_Details`,
        Data // Send plain JSON object
      );

      // Handle response
      const [type, message] = [
        Object.keys(response.data)[0],
        Object.values(response.data)[0],
      ];
      dispatch({ type: "toast", value: { message, type } });
      dispatchvalue({ type: "EmployeeListId", value: {} });
      dispatchvalue({ type: "HrFolder", value: "EmployeeRegistrationList" });
    }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  // 19-2-25
  const handleInputChangef = (e) => {
    const { name, value } = e.target;

    setEmployeeformData((prev) => {
      const newFormData = { ...prev, [name]: value };

      // Calculate Salary based on CTC if CTC is entered
      if (name === "ctc") {
        const ctc = parseFloat(value) || 0;

        // Assume basic salary is 50% of CTC (adjust as per requirement)
        const basicSalary = ctc * 0.5;

        // Calculate the in-hand monthly salary
        const salary = ((ctc * 100000) / 12).toFixed(2);

        newFormData.Salary = salary;
      }

      // Calculate Basic Salary based on Salary and Basic Salary Percentage
      if (
        name === "Salary" ||
        name === "basicSalaryPercent" ||
        name === "ctc"
      ) {
        const salary = parseFloat(newFormData.Salary) || 0;
        const percentage = parseFloat(newFormData.basicSalaryPercent) || 0;
        const basicSalary = ((salary * percentage) / 100).toFixed(2);
        newFormData.BasicSalary = basicSalary;
      }

      return newFormData;
    });
  };


const calculateNetSalary = () => {
  setEmployeeformData((prevData) => {
    // Set ESI amount only if applicable, else set to 0
    const ESI_Amount = prevData.ESI_is_applicable ? prevData.ESI_Amount : 0;

    // Set PF amounts only if PF is applicable, else set to 0
    const Employee_PF_Amount = prevData.PF_is_applicable ? prevData.Employee_PF_amount : 0;
    const Employer_PF_Amount = prevData.PF_is_applicable ? prevData.Employer_PF_amount : 0;

    const Employer_TDS_Amount = prevData.TDS_is_applicable ? prevData.TDS_Amount : 0;

    // Calculate net salary
    const netSalary =
      prevData.Salary -
      prevData.DeductionAmount1 -
      Employee_PF_Amount - // Deduct only employee's PF
      ESI_Amount -
      Employer_TDS_Amount;

      //console.log(netSalary,'netSalary');

    return {
      ...prevData,
      ESI_Amount, // Ensure ESI amount is updated correctly
      net_salary: netSalary, // Update net salary
      Employee_PF_Amount, // Store calculated PF values
      Employer_PF_Amount,
      Employer_TDS_Amount,
      Employee_Percentage: prevData.PF_is_applicable ? prevData.Employee_Percentage : 0,
      Employer_Percentage: prevData.PF_is_applicable ? prevData.Employer_Percentage : 0,
      PFNumber: prevData.PF_is_applicable ? prevData.PFNumber : "",
      ESINumber: prevData.ESI_is_applicable ? prevData.ESINumber : "",
      ESI_Percentage: prevData.ESI_is_applicable ? prevData.ESI_Percentage : 0,

    };
  });
};



  useEffect(() => {
    calculateNetSalary();
  }, [
    EmployeeformData.BasicSalary,
    EmployeeformData.AllowanceAmount,
    EmployeeformData.DeductionAmount1,
    EmployeeformData.Employee_PF_amount, 
    EmployeeformData?.ESI_Amount,
    EmployeeformData?.ESI_is_applicable,// Recalculate when PF_amount changes
    EmployeeformData?.TDS_Amount,
  ]);

  useEffect(() => {
    if (EmployeeformData.TDS_is_applicable && EmployeeformData.TDS_Percentage > 0) {
        const calculatedTDS = (EmployeeformData.TDS_Percentage / 100) * EmployeeformData.Salary;
        setEmployeeformData(prevState => ({
            ...prevState,
            TDS_Amount: calculatedTDS.toFixed(2) // Rounding to 2 decimal places
        }));
    } else {
        setEmployeeformData(prevState => ({
            ...prevState,
            TDS_Amount: 0
        }));
    }
}, [EmployeeformData.TDS_Percentage]);





  return (
    <div className="Main_container_app">
      <h3>New Employee Register</h3>

      {/* PERSONAL DETAILS =============================/ */}
      <div className="DivCenter_container">Personal Details</div>
      <br />

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label>
            Existing Employee ID <span>:</span>
          </label>
          <input
            type="text"
            name="Existing_Employee_ID"
            value={EmployeeformData.Existing_Employee_ID}
            onChange={handleInputChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="Title">
             Title<span className="requirreg12">*</span>:
          </label>
          <select
            id="Title"
            name="Title"
            value={EmployeeformData.Title}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            {TitleNameData.map((row, indx) => (
              <option key={indx} value={row.id}>
                {row.Title}
              </option>
            ))}
          </select>
        </div>
        <div className="RegisForm_1">
          <label>
            First Name <span className="requirreg12">*</span><span>:</span>
          </label>
          <input
            type="text"
            name="FirstName"
            value={EmployeeformData.FirstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Middle Name <span>:</span>
          </label>
          <input
            type="text"
            name="MiddleName"
            value={EmployeeformData.MiddleName}
            onChange={handleInputChange}
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Sur Name <span>:</span>
          </label>
          <input
            type="text"
            name="SurName"
            value={EmployeeformData.SurName}
            onChange={handleInputChange}
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Gender<span className="requirreg12">*</span><span>:</span>
          </label>
          <select
            name="gender"
            value={EmployeeformData.gender}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Transgender">TransGender</option>
          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            DOB <span className="requirreg12">*</span><span>:</span>
          </label>
          <input
            type="date"
            name="dob"
            value={EmployeeformData.dob}
            onChange={handleInputChange}
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Age <span className="requirreg12">*</span><span>:</span>
          </label>
          <input
            type="number"
            name="Age"
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            value={EmployeeformData.Age}
            onChange={handleInputChange}
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Blood Group <span>:</span>
          </label>
          <select
            name="bloodgroup"
            id="bloodgroup"
            value={EmployeeformData.bloodgroup}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            {BloodGroupData.map((row, indx) => (
              <option key={indx} value={row.id}>
                {row.BloodGroup}
              </option>
            ))}
          </select>
        </div>

        <div class="RegisForm_1">
          <label>
            Phone <span className="requirreg12">*</span><span>:</span>
          </label>
          <input
            type="number"
            name="phone"
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            pattern="[0-9]*"
            className={isPhoneValid.phone ? "valid-label" : "invalid-label"}
            value={EmployeeformData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div class="RegisForm_1">
          <label>
            Alternate Phone<span>:</span>
          </label>
          <input
            type="number"
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            name="alternatePhone"
            pattern="[0-9]*"
            value={EmployeeformData.alternatePhone}
            className={
              isPhoneValid.alternatePhone ? "valid-label" : "invalid-label"
            }
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Email <span>:</span>
          </label>
          <input
            type="email"
            name="email"
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
            value={EmployeeformData.email}
            className={isEmailValid ? "valid-label" : "invalid-label"}
            onChange={handleInputChange}
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Qualification <span>:</span>
          </label>
          <input
            type="text"
            name="qualification"
            value={EmployeeformData.qualification}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Skills Set <span>:</span>
          </label>
          <button
            className="fileviewbtn"
            value={EmployeeformData.SkillSet}
            onClick={() => {
              setSkills([]); // Clear current skills for adding new ones
              setShowskil(true);
              setViewMode(false); // Set the mode to Select (editable)
            }}
          >
            Select
          </button>
          <button
            className="RegisterForm_1_btns choose_file_update"
            onClick={handleViewClick} // Use the handleViewClick function to merge and show skills
          >
            <VisibilityIcon />
          </button>
        </div>

        {showskil && (
          <div className="modal-container" onClick={handleCloseModal}>
            <div className="pop_v_up" onClick={(e) => e.stopPropagation()}>
              <div className="table-container_v7">
                {/* View Table - Displays Saved Skills (Read-Only) */}
                {viewMode && (
                  <div>
                    <h2>View Saved Skills</h2>
                    <table className="styled-table">
                      <thead>
                        <tr>
                          <th>Skill</th>
                          <th>Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {skills.length > 0 ? (
                          skills.map((skill, index) => (
                            <tr key={index}>
                              <td>{skill.name}</td>
                              <td>{skill.level}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2">No skills added yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Select Table - Allows Editing and Adding New Skills */}
                {!viewMode && (
                  <div>
                    <h2>Select Skills</h2>
                    <div className="skvinput">
                      <label htmlFor="new-skill">
                        Add Skill:&nbsp;&nbsp;&nbsp;
                      </label>
                      <input
                        type="text"
                        id="new-skill"
                        placeholder="Enter new skill"
                        value={newSkillName} // Bind value to the state
                        onChange={(e) => setNewSkillName(e.target.value)}
                        // onChange={(e) => updateSkillLevel(e.target.value)} // Update new skill state
                      />
                      <button type="button" onClick={addSkill}>
                        Add New
                      </button>
                    </div>

                    <table className="styled-table">
                      <thead>
                        <tr>
                          <th>Skill</th>
                          <th>Beginner</th>
                          <th>Intermediate</th>
                          <th>Expert</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {skills.length > 0 ? (
                          skills.map((skill, index) => (
                            <tr key={index}>
                              <td>{skill.name}</td>
                              <td>
                                <input
                                  type="radio"
                                  name={`level-${index}`}
                                  value="Beginner"
                                  checked={skill.level === "Beginner"}
                                  onChange={() =>
                                    updateSkillLevel(index, "Beginner")
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="radio"
                                  name={`level-${index}`}
                                  value="Intermediate"
                                  checked={skill.level === "Intermediate"}
                                  onChange={() =>
                                    updateSkillLevel(index, "Intermediate")
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="radio"
                                  name={`level-${index}`}
                                  value="Expert"
                                  checked={skill.level === "Expert"}
                                  onChange={() =>
                                    updateSkillLevel(index, "Expert")
                                  }
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  onClick={() => deleteSkill(index)}
                                  style={{
                                    padding: "5px 10px",
                                    backgroundColor: "#f44336",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                  }}
                                >
                                  X
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5">No skills added yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <button
                      onClick={saveSkills}
                      style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Submit
                    </button>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setShowskil(false)}
                  style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div class="RegisForm_1">
          <label>
            Id Proof Type <span>:</span>
          </label>
          <select
            name="IdProofType"
            value={EmployeeformData.IdProofType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="Aadhar">Aadhar</option>
            <option value="VoterId">Voter ID</option>
            <option value="SmartCard">SmartCard</option>
            <option value="PanCard">PanCard</option>
          </select>
        </div>

        {EmployeeformData.IdProofType && (
          <div className="RegisForm_1">
            <label>
              Id Proof No <span>:</span>
            </label>
            <input
              type="text"
              name="IdProofNo"
              value={EmployeeformData.IdProofNo}
              onChange={handleInputChange}
            />
          </div>
        )}

        <div class="RegisForm_1">
          <label>
            Marital Status <span>:</span>
          </label>
          <select
            name="maritalStatus"
            value={EmployeeformData.maritalStatus}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>

        {["Married", "Widowed"].includes(EmployeeformData.maritalStatus) && (
          <>
            <div className="RegisForm_1">
              <label>
                Spouse Name <span>:</span>
              </label>
              <input
                type="text"
                name="SpouseName"
                value={EmployeeformData.SpouseName}
                onChange={handleInputChange}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Contact No <span>:</span>
              </label>
              <input
                type="number"
                name="SpouseContact"
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                value={EmployeeformData.SpouseContact}
                className={
                  isPhoneValid.SpouseContact ? "valid-label" : "invalid-label"
                }
                onChange={handleInputChange}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Working <span>:</span>
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "150px",
                }}
              >
                <label style={{ width: "auto" }} htmlFor="SpouseWorking_yes">
                  <input
                    required
                    id="SpouseWorking_yes"
                    type="radio"
                    name="SpouseWorking"
                    value="Yes"
                    style={{ width: "15px" }}
                    checked={EmployeeformData.SpouseWorking === "Yes"}
                    onChange={handleInputChange}
                  />
                  Yes
                </label>
                <label style={{ width: "auto" }} htmlFor="SpouseWorking_no">
                  <input
                    required
                    id="SpouseWorking_no"
                    type="radio"
                    name="SpouseWorking"
                    value="No"
                    style={{ width: "15px" }}
                    checked={EmployeeformData.SpouseWorking === "No"}
                    onChange={handleInputChange}
                  />
                  No
                </label>
              </div>
            </div>

            {EmployeeformData.SpouseWorking === "Yes" && (
              <div className="RegisForm_1">
                <label>Spouse Working Place :</label>
                <input
                  type="text"
                  name="SpouseWorkPlace"
                  value={EmployeeformData.SpouseWorkPlace}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div className="RegisForm_1">
              <label>
                Child <span>:</span>
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "150px",
                }}
              >
                <label style={{ width: "auto" }} htmlFor="Child_yes">
                  <input
                    required
                    id="Child_yes"
                    type="radio"
                    name="Child"
                    value="Yes"
                    style={{ width: "15px" }}
                    checked={EmployeeformData.Child === "Yes"}
                    onChange={handleInputChange}
                  />
                  Yes
                </label>
                <label style={{ width: "auto" }} htmlFor="Child_no">
                  <input
                    required
                    id="Child_no"
                    type="radio"
                    name="Child"
                    value="No"
                    style={{ width: "15px" }}
                    checked={EmployeeformData.Child === "No"}
                    onChange={handleInputChange}
                  />
                  No
                </label>
              </div>
            </div>

            {EmployeeformData.Child === "Yes" && (
              <div className="RegisForm_1">
                <label>
                  Total No Child <span>:</span>
                </label>
                <input
                  type="text"
                  name="TotalNoChild"
                  value={EmployeeformData.TotalNoChild}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </>
        )}

        {["Married", "Widowed", "Divorced"].includes(
          EmployeeformData.maritalStatus
        ) && (
          <>
            <div className="RegisForm_1">
              <label>
                Anniversary Date <span>:</span>
              </label>
              <input
                type="date"
                name="AnniversaryDate"
                value={EmployeeformData.AnniversaryDate}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        {["Single", "Divorced"].includes(EmployeeformData.maritalStatus) && (
          <>
            {EmployeeformData.maritalStatus === "Single" && (
              <div className="RegisForm_1">
                <label>
                  MarriagePlan <span>:</span>
                </label>
                <input
                  type="text"
                  name="MarriagePlan"
                  value={EmployeeformData.MarriagePlan}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div className="RegisForm_1">
              <label>
                Father Name <span>:</span>
              </label>
              <input
                type="text"
                name="FatherName"
                value={EmployeeformData.FatherName}
                onChange={handleInputChange}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Contact No <span>:</span>
              </label>
              <input
                type="number"
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                name="FatherContact"
                value={EmployeeformData.FatherContact}
                className={
                  isPhoneValid.FatherContact ? "valid-label" : "invalid-label"
                }
                onChange={handleInputChange}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                FatherWorking <span>:</span>
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "150px",
                }}
              >
                <label style={{ width: "auto" }} htmlFor="FatherWorking_yes">
                  <input
                    required
                    id="FatherWorking_yes"
                    type="radio"
                    name="FatherWorking"
                    value="Yes"
                    style={{ width: "15px" }}
                    checked={EmployeeformData.FatherWorking === "Yes"}
                    onChange={handleInputChange}
                  />
                  Yes
                </label>
                <label style={{ width: "auto" }} htmlFor="FatherWorking_no">
                  <input
                    required
                    id="FatherWorking_no"
                    type="radio"
                    name="FatherWorking"
                    value="No"
                    style={{ width: "15px" }}
                    checked={EmployeeformData.FatherWorking === "No"}
                    onChange={handleInputChange}
                  />
                  No
                </label>
              </div>
            </div>

            {EmployeeformData.FatherWorking === "Yes" && (
              <div className="RegisForm_1">
                <label>
                  Father Working Place <span>:</span>
                </label>
                <input
                  type="text"
                  name="FatherWorkPlace"
                  value={EmployeeformData.FatherWorkPlace}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div className="RegisForm_1">
              <label>
                Mother Name <span>:</span>
              </label>
              <input
                type="text"
                name="MotherName"
                value={EmployeeformData.MotherName}
                onChange={handleInputChange}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Contact No <span>:</span>
              </label>
              <input
                type="number"
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                name="MotherContact"
                value={EmployeeformData.MotherContact}
                className={
                  isPhoneValid.MotherContact ? "valid-label" : "invalid-label"
                }
                onChange={handleInputChange}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Mother Working <span>:</span>
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "150px",
                }}
              >
                <label style={{ width: "auto" }} htmlFor="MotherWorking_yes">
                  <input
                    required
                    id="MotherWorking_yes"
                    type="radio"
                    name="MotherWorking"
                    value="Yes"
                    style={{ width: "15px" }}
                    checked={EmployeeformData.MotherWorking === "Yes"}
                    onChange={handleInputChange}
                  />
                  Yes
                </label>
                <label style={{ width: "auto" }} htmlFor="MotherWorking_no">
                  <input
                    required
                    id="MotherWorking_no"
                    type="radio"
                    name="MotherWorking"
                    value="No"
                    style={{ width: "15px" }}
                    checked={EmployeeformData.MotherWorking === "No"}
                    onChange={handleInputChange}
                  />
                  No
                </label>
              </div>
            </div>

            {EmployeeformData.MotherWorking === "Yes" && (
              <div className="RegisForm_1">
                <label>
                  Working Place <span>:</span>
                </label>
                <input
                  type="text"
                  name="MotherWorkPlace"
                  value={EmployeeformData.MotherWorkPlace}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {EmployeeformData.maritalStatus === "Divorced" && (
              <>
                <div className="RegisForm_1">
                  <label>
                    Child <span>:</span>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "150px",
                    }}
                  >
                    <label style={{ width: "auto" }} htmlFor="Child_yes">
                      <input
                        required
                        id="Child_yes"
                        type="radio"
                        name="Child"
                        value="Yes"
                        style={{ width: "15px" }}
                        checked={EmployeeformData.Child === "Yes"}
                        onChange={handleInputChange}
                      />
                      Yes
                    </label>
                    <label style={{ width: "auto" }} htmlFor="Child_no">
                      <input
                        required
                        id="Child_no"
                        type="radio"
                        name="Child"
                        value="No"
                        style={{ width: "15px" }}
                        checked={EmployeeformData.Child === "No"}
                        onChange={handleInputChange}
                      />
                      No
                    </label>
                  </div>
                </div>

                {EmployeeformData.Child === "Yes" && (
                  <div className="RegisForm_1">
                    <label>
                      Total No Child <span>:</span>
                    </label>
                    <input
                      type="text"
                      name="TotalNoChild"
                      value={EmployeeformData.TotalNoChild}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}

        <div className="RegisForm_1">
          <label>
            Emergency ContactName 1<span>:</span>
          </label>
          <input
            type="text"
            name="EmergencyContactName1"
            value={EmployeeformData.EmergencyContactName1}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Emergency ContactNo 1<span>:</span>
          </label>
          <input
            type="number"
            name="EmergencyContactNo1"
            value={EmployeeformData.EmergencyContactNo1}
            className={
              isPhoneValid.EmergencyContactNo1 ? "valid-label" : "invalid-label"
            }
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Emergency ContactName 2<span>:</span>
          </label>
          <input
            type="text"
            name="EmergencyContactName2"
            value={EmployeeformData.EmergencyContactName2}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Emergency ContactNo 2 <span>:</span>
          </label>
          <input
            type="number"
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            name="EmergencyContactNo2"
            value={EmployeeformData.EmergencyContactNo2}
            className={
              isPhoneValid.EmergencyContactNo2 ? "valid-label" : "invalid-label"
            }
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Residence <span>:</span>
          </label>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "150px",
            }}
          >
            <label style={{ width: "auto" }} htmlFor="Residence_dayscholar">
              <input
                required
                id="Residence_dayscholar"
                type="radio"
                name="Residence"
                value="Day Scholar"
                style={{ width: "15px" }}
                checked={EmployeeformData.Residence === "Day Scholar"}
                onChange={handleInputChange}
              />
              Day Scholar
            </label>
            <label style={{ width: "auto" }} htmlFor="Residence_hostel">
              <input
                required
                id="Residence_hostel"
                type="radio"
                name="Residence"
                value="Hostel"
                style={{ width: "15px" }}
                checked={EmployeeformData.Residence === "Hostel"}
                onChange={handleInputChange}
              />
              Hostel
            </label>
          </div>
        </div>

        <div className="RegisForm_1">
          <label>
            Photo <span>:</span>
          </label>

          <div className="RegisterForm_2">
            {/* Button to show the webcam or captured image */}
            <button
              onClick={() => setShowFile({ file1: true })}
              className="RegisterForm_1_btns choose_file_update"
            >
              <CameraAltIcon />
            </button>

            {/* Webcam/captured image interface */}
            {showFile.file1 && (
              <div
                className="showcamera_takepic"
                onClick={() => setShowFile({ file1: false })}
              >
                <div
                  className="showcamera_1_takepic1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {EmployeeformData.Photo ? (
                    <div>
                      <img
                        src={EmployeeformData.Photo}
                        alt="Captured"
                        className="captured-image11"
                      />
                      <div className="web_btn">
                        <button
                          onClick={handleRecaptureImage1}
                          className="btncon_add"
                        >
                          Update Image
                        </button>
                        <button
                          onClick={() => setShowFile({ file1: false })}
                          className="btncon_add"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="camera-container">
                      <div className="web_head">
                        <h3>Image</h3>
                      </div>
                      <div className="RotateButton_canva">
                        <Webcam
                          audio={false}
                          ref={webcamRef1}
                          screenshotFormat="image/jpeg"
                          mirrored={facingMode === "user"}
                          className="web_cam"
                          videoConstraints={videoConstraints}
                        />
                        {deviceInfo.device_type !== "mobile" && (
                          <button onClick={switchCamera}>
                            <CameraswitchIcon />
                          </button>
                        )}
                      </div>
                      <div className="web_btn">
                        <button
                          onClick={handleCaptureImage1}
                          className="btncon_add"
                        >
                          Capture
                        </button>
                        <button
                          onClick={() => setShowFile({ file1: false })}
                          className="btncon_add"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* File input and view controls */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="file"
              name="Photo"
              accept="image/jpeg, image/png, application/pdf"
              required
              id="Photo"
              autoComplete="off"
              onChange={handleinpchangeDocumentsForm}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: "87px",
                display: "flex",
                justifyContent: "flex-start",
                gap: "10px",
              }}
            >
              <label
                htmlFor="Photo"
                className="RegisterForm_1_btns choose_file_update"
              >
                <PhotoCameraBackIcon />
              </label>
              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={() => {
                  Selectedfileview(EmployeeformData.Photo);
                }}
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="RegisForm_1">
          <label>
            Signature<span>:</span>
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              name={"Signature"}
              accept="image/jpeg, image/png, application/pdf"
              required
              id={"Signature"}
              autoComplete="off"
              onChange={handleinpchangeDocumentsForm}
              //   readOnly={IsViewMode}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: "120px",
                display: "flex",
                justifyContent: "flex-start",
                gap: "20px",
              }}
            >
              <label
                htmlFor={"Signature"}
                className="RegisterForm_1_btns choose_file_update"
              >
                <PhotoCameraBackIcon />
              </label>
              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={() => Selectedfileview(EmployeeformData.Signature)}
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="RegisForm_1">
          <label>
            {" "}
            RequirementSource <span>:</span>{" "}
          </label>

          <select
            name="RequirementSource"
            required
            value={EmployeeformData.RequirementSource}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="Advertisement">Advertisement</option>
            <option value="SocialMedia">Social Media</option>
            <option value="Refferal">Refferal</option>
            <option value="Walkin">Walk in</option>
          </select>
        </div>
        {EmployeeformData.RequirementSource &&
          EmployeeformData.RequirementSource !== "Select" && (
            <div className="RegisForm_1">
              <label>
                Source <span>:</span>
              </label>
              <input
                type="text"
                name="Source"
                value={EmployeeformData.Source}
                onChange={handleInputChange}
                placeholder={`details for ${EmployeeformData.RequirementSource}`}
              />
            </div>
          )}

        <div className="RegisForm_1">
          <label>
            Active Status <span>:</span>
          </label>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "120px",
              gap: "10px",
            }}
          >
            <label style={{ width: "auto" }} htmlFor="ActiveStatus_yes">
              <input
                required
                id="ActiveStatus_yes"
                type="radio"
                name="ActiveStatus"
                value="Yes"
                style={{ width: "15px" }}
                checked={EmployeeformData.ActiveStatus === "Yes"}
                onChange={handleInputChange}
              />
              Yes
            </label>
            <label style={{ width: "auto" }} htmlFor="ActiveStatus_no">
              <input
                required
                id="ActiveStatus_no"
                type="radio"
                name="ActiveStatus"
                value="No"
                style={{ width: "15px" }}
                checked={EmployeeformData.ActiveStatus === "No"}
                onChange={handleInputChange}
              />
              No
            </label>
          </div>
        </div>
      </div>
      {/* personal details End =========== */}
      <br />
      {/* {employee communication address} */}
      <div className="DivCenter_container">Communication Address</div>
      <br />
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label>
            Pincode <span>:</span>
          </label>
          <input
            type="number"
            name="Pincode"
            pattern="\d{6,7}" // Direct pattern for 6 to 7 digits
            autoComplete="off"
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            value={EmployeeformData.Pincode}
            onChange={handleInputChange}
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Door No<span>:</span>
          </label>
          <input
            type="text"
            name="doorNo"
            value={EmployeeformData.doorNo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Street<span>:</span>
          </label>
          <input
            type="text"
            name="Street"
            value={EmployeeformData.Street}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Area<span>:</span>
          </label>
          <input
            type="text"
            name="Area"
            value={EmployeeformData.Area}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            City<span>:</span>
          </label>
          <input
            type="text"
            name="City"
            value={EmployeeformData.City}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            District<span>:</span>
          </label>
          <input
            type="text"
            name="District"
            value={EmployeeformData.District}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>
            State<span>:</span>
          </label>
          <input
            type="text"
            name="State"
            value={EmployeeformData.State}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Country<span>:</span>
          </label>
          <input
            type="text"
            name="Country"
            value={EmployeeformData.Country}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Permanent Address Same As Above <span>:</span>
          </label>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "120px",
              gap: "10px",
            }}
          >
            <label style={{ width: "auto" }} htmlFor="Residence_dayscholar">
              <input
                required
                type="radio"
                name="PermanentAddressSame"
                value="YES"
                style={{ width: "15px" }}
                checked={EmployeeformData.PermanentAddressSame === "YES"}
                onChange={handleInputChange}
              />
              Yes
            </label>
            <label style={{ width: "auto" }} htmlFor="Residence_hostel">
              <input
                type="radio"
                name="PermanentAddressSame"
                value="NO"
                style={{ width: "15px" }}
                checked={EmployeeformData.PermanentAddressSame === "NO"}
                onChange={handleInputChange}
              />
              No
            </label>
          </div>
        </div>
      </div>
      <br />

      {/* ==================employee permanent address */}
      {EmployeeformData.PermanentAddressSame === "NO" && (
        <>
          <div className="DivCenter_container">Permanent Address</div>
          <br />
          <div className="RegisFormcon">
            <div className="RegisForm_1">
              <label>
                Pincode <span>:</span>
              </label>
              <input
                type="number"
                name="PermanentPincode"
                pattern="\d{6,7}" // Direct pattern for 6 to 7 digits
                autoComplete="off"
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                value={EmployeeformData.PermanentPincode}
                onChange={handleInputChange}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Door No <span>:</span>
              </label>
              <input
                type="text"
                name="PermanentdoorNo"
                value={EmployeeformData.PermanentdoorNo}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Street <span>:</span>
              </label>
              <input
                type="text"
                name="PermanentStreet"
                value={EmployeeformData.PermanentStreet}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Area <span>:</span>
              </label>
              <input
                type="text"
                name="PermanentArea"
                value={EmployeeformData.PermanentArea}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="RegisForm_1">
              <label>
                City <span>:</span>
              </label>
              <input
                type="text"
                name="PermanentCity"
                value={EmployeeformData.PermanentCity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="RegisForm_1">
              <label>
                District <span>:</span>
              </label>
              <input
                type="text"
                name="PermanentDistrict"
                value={EmployeeformData.PermanentDistrict}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="RegisForm_1">
              <label>
                State <span>:</span>
              </label>
              <input
                type="text"
                name="PermanentState"
                value={EmployeeformData.PermanentState}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Country <span>:</span>
              </label>
              <input
                type="text"
                name="PermanentCountry"
                value={EmployeeformData.PermanentCountry}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <br />
        </>
      )}

      {/* Employeement History  ========================== / */}

      <div className="DivCenter_container">Employeement History</div>
      <br />

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label>
            Previous Work Experience <span>:</span>
          </label>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "120px",
              gap: "10px",
            }}
          >
            <label
              style={{ width: "auto" }}
              htmlFor="PreviousWorkExperience_yes"
            >
              <input
                required
                id="PreviousWorkExperience_yes"
                type="radio"
                name="PreviousWorkExperience"
                value="Yes"
                style={{ width: "15px" }}
                checked={EmployeeformData.PreviousWorkExperience === "Yes"}
                onChange={handleInputChange}
              />
              Yes
            </label>
            <label
              style={{ width: "auto" }}
              htmlFor="PreviousWorkExperience_no"
            >
              <input
                required
                id="PreviousWorkExperience_no"
                type="radio"
                name="PreviousWorkExperience"
                value="No"
                style={{ width: "15px" }}
                checked={EmployeeformData.PreviousWorkExperience === "No"}
                onChange={handleInputChange}
              />
              No
            </label>
          </div>
        </div>

        {EmployeeformData.PreviousWorkExperience === "Yes" && (
          <>
            <div className="RegisForm_1">
              <label>
                No.Of Years<span>:</span>
              </label>
              <input
                type="number"
                name="NoOfYears"
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                value={EmployeeformData.NoOfYears}
                onChange={handleInputChange}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                WorkStation Name & Address<span>:</span>
              </label>
              <input
                type="text"
                name="WorkStationNameAddress"
                value={EmployeeformData.WorkStationNameAddress}
                // placeholder='WorkStationNameAddress'
                onChange={handleInputChange}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Reason For Left<span>:</span>
              </label>
              <select
                name="ReasonForLeft"
                value={EmployeeformData.ReasonForLeft}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="Better Opportunity">Better Opportunity</option>
                <option value="Department/Hospital issue">
                  Department/Hospital issue
                </option>
                <option value="Salary Concern">Salary Concern</option>
                <option value="Personal Reason">Personal Reason</option>
                <option value="Relocation">Relocation</option>
                <option value="Health">Health</option>
                <option value="Further Studies">Further Studies</option>
                <option value="without Notice">without Notice</option>
              </select>
            </div>

            <div className="RegisForm_1">
              <label>
                Company Contact No <span>:</span>
              </label>
              <input
                type="number"
                name="WorkStationPhoneNo"
                value={EmployeeformData.WorkStationPhoneNo}
                className={
                  isPhoneValid.WorkStationPhoneNo
                    ? "valid-label"
                    : "invalid-label"
                }
                onChange={handleInputChange}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Pay Slip CSV <span>:</span>
              </label>
              <div className="RegisterForm_2">
                <input
                  type="file"
                  name={"EmployeePaySlip"}
                  accept="image/jpeg, image/png, application/pdf"
                  required
                  id={"EmployeePaySlip"}
                  autoComplete="off"
                  onChange={handleinpchangeDocumentsForm}
                  //   readOnly={IsViewMode}
                  style={{ display: "none" }}
                />
                <div
                  style={{
                    width: "87px",
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "10px",
                  }}
                >
                  <label
                    htmlFor={"EmployeePaySlip"}
                    className="RegisterForm_1_btns choose_file_update"
                  >
                    <PhotoCameraBackIcon />
                  </label>
                  <button
                    className="RegisterForm_1_btns choose_file_update"
                    onClick={() =>
                      Selectedfileview(EmployeeformData.EmployeePaySlip)
                    }
                  >
                    <VisibilityIcon />
                  </button>
                </div>
              </div>
            </div>

            <div className="RegisForm_1">
              <label>
                Offer Letter<span>:</span>
              </label>
              <div className="RegisterForm_2">
                <input
                  type="file"
                  name={"EmployeeOfferLetter"}
                  accept="image/jpeg, image/png, application/pdf"
                  required
                  id={"EmployeeOfferLetter"}
                  autoComplete="off"
                  onChange={handleinpchangeDocumentsForm}
                  style={{ display: "none" }}
                />
                <div
                  style={{
                    width: "87px",
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "10px",
                  }}
                >
                  <label
                    htmlFor={"EmployeeOfferLetter"}
                    className="RegisterForm_1_btns choose_file_update"
                  >
                    <PhotoCameraBackIcon />
                  </label>
                  <button
                    className="RegisterForm_1_btns choose_file_update"
                    onClick={() =>
                      Selectedfileview(EmployeeformData.EmployeeOfferLetter)
                    }
                  >
                    <VisibilityIcon />
                  </button>
                </div>
              </div>
            </div>

            <div className="RegisForm_1">
              <label>
                {" "}
                Relieve Letter <span>:</span>{" "}
              </label>
              <div className="RegisterForm_2">
                <input
                  type="file"
                  name={"EmployeeReliveLetter"}
                  accept="image/jpeg, image/png, application/pdf"
                  required
                  id={"EmployeeReliveLetter"}
                  autoComplete="off"
                  onChange={handleinpchangeDocumentsForm}
                  style={{ display: "none" }}
                />
                <div
                  style={{
                    width: "87px",
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "10px",
                  }}
                >
                  <label
                    htmlFor={"EmployeeReliveLetter"}
                    className="RegisterForm_1_btns choose_file_update"
                  >
                    <PhotoCameraBackIcon />
                  </label>
                  <button
                    className="RegisterForm_1_btns choose_file_update"
                    onClick={() =>
                      Selectedfileview(EmployeeformData.EmployeeReliveLetter)
                    }
                  >
                    <VisibilityIcon />
                  </button>
                </div>
              </div>
            </div>

            <div className="RegisForm_1">
              <label>
                Confirmed By<span>:</span>
              </label>
              <input
                type="text"
                name="ConfirmedBy"
                value={EmployeeformData.ConfirmedBy}
                onChange={handleInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Do you have PF Number <span>:</span>
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "150px",
                }}
              >
                <label style={{ width: "auto" }} htmlFor="PreviousPfnumber_yes">
                  <input
                    required
                    id="PreviousPfnumber_yes"
                    type="radio"
                    name="PreviousPfnumber"
                    value="Yes"
                    style={{ width: "15px" }}
                    checked={EmployeeformData.PreviousPfnumber === "Yes"}
                    onChange={handleInputChange}
                  />
                  Yes
                </label>
                <label style={{ width: "auto" }} htmlFor="PreviousPfnumber_no">
                  <input
                    required
                    id="PreviousWorkExperience_no"
                    type="radio"
                    name="PreviousPfnumber"
                    value="No"
                    style={{ width: "15px" }}
                    checked={EmployeeformData.PreviousPfnumber === "No"}
                    onChange={handleInputChange}
                  />
                  No
                </label>
              </div>
            </div>
            {EmployeeformData.PreviousPfnumber === "Yes" && (
              <div className="RegisForm_1">
                <label>
                  PF Number<span>:</span>
                </label>
                <input
                  type="text"
                  name="PFnumber"
                  value={EmployeeformData.PFnumber}
                  // placeholder='WorkStationNameAddress'
                  onChange={handleInputChange}
                />
              </div>
            )}
            <div className="RegisForm_1">
              <label>
                Do you have ESI Number <span>:</span>
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "150px",
                }}
              >
                <label
                  style={{ width: "auto" }}
                  htmlFor="PreviousESInumber_yes"
                >
                  <input
                    required
                    id="PreviousESInumber_yes"
                    type="radio"
                    name="PreviousESInumber"
                    value="Yes"
                    style={{ width: "15px" }}
                    checked={EmployeeformData.PreviousESInumber === "Yes"}
                    onChange={handleInputChange}
                  />
                  Yes
                </label>
                <label style={{ width: "auto" }} htmlFor="PreviousESInumber_no">
                  <input
                    required
                    id="PreviousESInumber_no"
                    type="radio"
                    name="PreviousESInumber"
                    value="No"
                    style={{ width: "15px" }}
                    checked={EmployeeformData.PreviousESInumber === "No"}
                    onChange={handleInputChange}
                  />
                  No
                </label>
              </div>
            </div>

            {EmployeeformData.PreviousESInumber === "Yes" && (
              <div className="RegisForm_1">
                <label>
                  ESI Number<span>:</span>
                </label>
                <input
                  type="text"
                  name="ESInumber"
                  value={EmployeeformData.ESInumber}
                  // placeholder='WorkStationNameAddress'
                  onChange={handleInputChange}
                />
              </div>
            )}
          </>
        )}
      </div>
      {/* employment End =================*/}
      <br />
      <br />

      {/* Medical History  ========================== / */}

      <div className="DivCenter_container">Medical Information </div>
      <br />

      <div className="RegisFormcon">
        <div className="div_ckkck_box alcho_tac_drg11">
          <div className="ffdff44">
            <div>
              <label className="checkbox-label_ooo alcho_tac_drg">
                {" "}
                Pre-Existing Medical Condition <span>: </span>
              </label>
            </div>

            <div className="flx_cjk_labl3">
              <label className="checkbox-label_ooo">
                <input
                  type="checkbox"
                  name="Fit"
                  className="checkbox-input ddsfe"
                  checked={MedicalInformation.Fit}
                  onChange={handleMedicalInformationInputChange}
                />
                Fit
              </label>

              <label className="checkbox-label_ooo">
                <input
                  type="checkbox"
                  name="Epilepsy"
                  className="checkbox-input ddsfe"
                  checked={MedicalInformation.Epilepsy}
                  onChange={handleMedicalInformationInputChange}
                />
                Epilepsy
              </label>

              <label className="checkbox-label_ooo">
                <input
                  type="checkbox"
                  name="Ashthma"
                  className="checkbox-input ddsfe"
                  checked={MedicalInformation.Ashthma}
                  onChange={handleMedicalInformationInputChange}
                />
                Ashthma
              </label>

              <label className="checkbox-label_ooo">
                <input
                  type="checkbox"
                  name="Dm"
                  className="checkbox-input ddsfe"
                  checked={MedicalInformation.Dm}
                  onChange={handleMedicalInformationInputChange}
                />
                DM
              </label>

              <label className="checkbox-label_ooo">
                <input
                  type="checkbox"
                  name="Ht"
                  className="checkbox-input ddsfe"
                  checked={MedicalInformation.Ht}
                  onChange={handleMedicalInformationInputChange}
                />
                HT
              </label>

              <label className="checkbox-label_ooo">
                <input
                  type="checkbox"
                  name="Ihd"
                  className="checkbox-input ddsfe"
                  checked={MedicalInformation.Ihd}
                  onChange={handleMedicalInformationInputChange}
                />
                IHD
              </label>
            </div>
          </div>
        </div>

        <div className="RegisForm_1">
          <label>
            Pychitric Medicines<span>:</span>
          </label>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "120px",
              gap: "10px",
            }}
          >
            <label style={{ width: "auto" }} htmlFor="PsychiatricMedicines_yes">
              <input
                required
                id="PsychiatricMedicines_yes"
                type="radio"
                name="PsychiatricMedicines"
                value="Yes"
                style={{ width: "15px" }}
                checked={EmployeeformData.PsychiatricMedicines === "Yes"}
                onChange={handleInputChange}
              />
              Yes
            </label>
            <label style={{ width: "auto" }} htmlFor="PsychiatricMedicines_no">
              <input
                required
                id="PsychiatricMedicines_no"
                type="radio"
                name="PsychiatricMedicines"
                value="No"
                style={{ width: "15px" }}
                checked={EmployeeformData.PsychiatricMedicines === "No"}
                onChange={handleInputChange}
              />
              No
            </label>
          </div>
        </div>
        {EmployeeformData.PsychiatricMedicines === "Yes" && (
          <div className="RegisForm_1">
            <label>
              Psychiatric Medicines Details<span>:</span>
            </label>
            <textarea
              name="PsychiatricMedicinesDetails"
              value={EmployeeformData.PsychiatricMedicinesDetails}
              onChange={handleInputChange}
            />
          </div>
        )}

        <div className="RegisForm_1">
          <label>
            Previous Operation/Surgeries<span>:</span>
          </label>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "120px",
              gap: "10px",
            }}
          >
            <label style={{ width: "auto" }} htmlFor="PreviousOperation_yes">
              <input
                required
                id="PreviousOperation_yes"
                type="radio"
                name="PreviousOperation"
                value="Yes"
                style={{ width: "15px" }}
                checked={EmployeeformData.PreviousOperation === "Yes"}
                onChange={handleInputChange}
              />
              Yes
            </label>
            <label style={{ width: "auto" }} htmlFor="PreviousOperation_no">
              <input
                required
                id="PreviousOperation_no"
                type="radio"
                name="PreviousOperation"
                value="No"
                style={{ width: "15px" }}
                checked={EmployeeformData.PreviousOperation === "No"}
                onChange={handleInputChange}
              />
              No
            </label>
          </div>
        </div>
        {EmployeeformData.PreviousOperation === "Yes" && (
          <div className="RegisForm_1">
            <label>
              Surgeries Details<span>:</span>
            </label>
            <textarea
              name="SurgeriesDetails"
              value={EmployeeformData.SurgeriesDetails}
              onChange={handleInputChange}
            />
          </div>
        )}

        <div className="RegisForm_1">
          <label>
            Vaccination Status<span>:</span>
          </label>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "120px",
              gap: "10px",
            }}
          >
            <label style={{ width: "auto" }} htmlFor="VaccinationStatus_yes">
              <input
                required
                id="VaccinationStatus_yes"
                type="radio"
                name="VaccinationStatus"
                value="Yes"
                style={{ width: "15px" }}
                checked={EmployeeformData.VaccinationStatus === "Yes"}
                onChange={handleInputChange}
              />
              Yes
            </label>
            <label style={{ width: "auto" }} htmlFor="VaccinationStatus_no">
              <input
                required
                id="VaccinationStatus_no"
                type="radio"
                name="VaccinationStatus"
                value="No"
                style={{ width: "15px" }}
                checked={EmployeeformData.VaccinationStatus === "No"}
                onChange={handleInputChange}
              />
              No
            </label>
          </div>
        </div>

        {EmployeeformData.VaccinationStatus === "Yes" && (
          <div className="RegisForm_1">
            <label>
              Vaccination Details<span>:</span>
            </label>
            <textarea
              name="VaccinationStatusDetails"
              value={EmployeeformData.VaccinationStatusDetails}
              onChange={handleInputChange}
            />
          </div>
        )}

        <div className="RegisForm_1">
          <label>
            {" "}
            Medical Fitness Certificate<span>:</span>{" "}
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              name={"MedicalFitnessCertificate"}
              accept="image/jpeg, image/png, application/pdf"
              required
              id={"MedicalFitnessCertificate"}
              autoComplete="off"
              onChange={handleinpchangeDocumentsForm}
              //   readOnly={IsViewMode}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: "120px",
                display: "flex",
                justifyContent: "flex-start",
                gap: "10px",
                gap: "20px",
              }}
            >
              <label
                htmlFor={"MedicalFitnessCertificate"}
                className="RegisterForm_1_btns choose_file_update"
              >
                <PhotoCameraBackIcon />
              </label>
              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={() =>
                  Selectedfileview(EmployeeformData.MedicalFitnessCertificate)
                }
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="RegisForm_1">
          <label>
            {" "}
            Annual Medical Checkup<span>:</span>{" "}
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              name={"AnnualMedicalCheckup"}
              accept="image/jpeg, image/png, application/pdf"
              required
              id={"AnnualMedicalCheckup"}
              autoComplete="off"
              onChange={handleinpchangeDocumentsForm}
              //   readOnly={IsViewMode}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: "120px",
                display: "flex",
                justifyContent: "flex-start",
                gap: "10px",
                gap: "20px",
              }}
            >
              <label
                htmlFor={"AnnualMedicalCheckup"}
                className="RegisterForm_1_btns choose_file_update"
              >
                <PhotoCameraBackIcon />
              </label>
              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={() =>
                  Selectedfileview(EmployeeformData.AnnualMedicalCheckup)
                }
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* medical End */}
      <br />
      <br />

      {/* Current Employment ========================== / */}

      <div className="DivCenter_container">Current Employment </div>
      <br />

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label>
            Date of Joining<span>:</span>
          </label>
          <input
            type="date"
            name="DateOfJoining"
            value={EmployeeformData.DateOfJoining}
            onChange={handleInputChange}
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Locations<span className="requirreg12">*</span><span>:</span>
          </label>
          <select
            name="Locations"
            required
            value={EmployeeformData.Locations}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            {Locations.filter((p) => p.Status === "Active")?.map(
              (Loc, indx) => (
                <option key={indx} value={Loc.id}>
                  {Loc.locationName}
                </option>
              )
            )}
          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            Classification<span className="requirreg12">*</span><span>:</span>
          </label>
          <select
            name="Classification"
            required
            value={EmployeeformData.Classification}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            {Classifications.filter((p) => p.Status === "Active")?.map(
              (Loc, indx) => (
                <option key={indx} value={Loc.id}>
                  {Loc.Classification}
                </option>
              )
            )}
          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            {" "}
            Category<span className="requirreg12">*</span><span>:</span>
          </label>

          <select
            name="Category"
            required
            value={EmployeeformData.Category}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            {Category.filter((p) => p.Status === "Active").map((catg, indx) => (
              <option key={indx} value={catg.id}>
                {catg.CategoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            {" "}
            Speciality <span>:</span>{" "}
          </label>

          <select
            name="Speciality"
            required
            value={EmployeeformData.Speciality}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            {Speciality.filter((p) => p.Status === "Active").map(
              (spec, indx) => (
                <option key={indx} value={spec.id}>
                  {spec.SpecialityName}
                </option>
              )
            )}
          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            {" "}
            Designation<span className="requirreg12">*</span><span>:</span>
          </label>

          <select
            name="Designation"
            required
            value={EmployeeformData.Designation}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            {Designations.filter((p) => p.Status === "Active")?.map(
              (Des, indx) => (
                <option key={indx} value={Des.id}>
                  {Des.Designation}
                </option>
              )
            )}
          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            Department<span className="requirreg12">*</span><span>:</span>
          </label>
          <input
            type="Text"
            name="Department"
            value={EmployeeformData.Department}
            className="forExtrabutton-withInput"
            onChange={handleInputChange}
            required
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AddBoxIcon onClick={HandleDepartmentSelect} />
          </div>
        </div>

        <div className="RegisForm_1">
          <label>
            {" "}
            Role<span className="requirreg12">*</span><span>:</span>
          </label>

          <select
            name="Role"
            required
            value={EmployeeformData.Role}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            {Roles.filter((p) => p.Status === "Active").map((dept, indx) => (
              <option key={indx} value={dept.id}>
                {dept.Role}
              </option>
            ))}
          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            Reporting Manager<span>:</span>
          </label>
          <input
            type="text"
            name="ReportingManager"
            value={EmployeeformData.ReportingManager}
            onChange={handleInputChange}
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Work Email<span>:</span>
          </label>
          <input
            type="text"
            name="WorkEmail"
            value={EmployeeformData.WorkEmail}
            onChange={handleInputChange}
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Is the employee on probation? <span>:</span>
          </label>
          <input
            type="checkbox"
            checked={EmployeeformData.is_on_probation}
            onChange={(e) => setIsEmployeeOnProbation(e.target.checked)}
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Requires Security Deposit? <span>:</span>
          </label>
          <input
            type="checkbox"
            value={true}
            checked={EmployeeformData.requiresSecurityDeposit} // The checkbox is checked if state is true
            onChange={handleCheckboxChange} // This will update the state
          />
        </div>

        <div className="RegisForm_1">
          <label>
            requireGratuity? <span>:</span>
          </label>
          <input
            type="checkbox"
            checked={EmployeeformData.requireGratuity}
            onChange={(e) => setrequireGratuity(e.target.checked)}
          />
        </div>
        <br />
        {/* Current Employment ========================== / */}

        {EmployeeformData.is_on_probation && (
          <>
            <div className="DivCenter_container">Probation Period</div>

            <div className="RegisForm_1">
              <label>
                Probation Start Date <span>:</span>
              </label>
              <input
                type="date"
                name="probation_start_date"
                value={EmployeeformData.probation_start_date}
                onChange={handleInputChange2}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Probation End Date <span>:</span>
              </label>
              <input
                type="date"
                name="probation_end_date"
                value={EmployeeformData.probation_end_date}
                onChange={handleInputChange2}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                No. of Probation Periods <span>:</span>
              </label>
              <input
                type="number"
                name="probation_periods"
                value={EmployeeformData.probation_periods}
                onChange={handleInputChange2}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Months Completed <span>:</span>
              </label>
              <input
                type="number"
                name="months_completed"
                value={EmployeeformData.months_completed}
                onChange={handleInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                TrainingGivenBy <span>:</span>
              </label>
              <select
                type="text"
                name="TrainingGivenBy"
                value={EmployeeformData.TrainingGivenBy}
                onChange={handleInputChange}
              >
                <option value="select">select</option>
                {HOD_details.map((value, index) => (
                  <option value={value.Employee_Id}>{value.First_Name}</option>
                ))}
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                TrainingVerifiedBy <span>:</span>
              </label>
              <select
                type="text"
                name="TrainingVerifiedBy"
                value={EmployeeformData.TrainingVerifiedBy}
                onChange={handleInputChange}
              >
                <option value="select">select</option>
                {HR_details.map((value, index) => (
                  <option value={value.Employee_Id}>{value.First_Name}</option>
                ))}
              </select>
            </div>

            {/* 17-2-25 */}
            <div className="RegisForm_1">
              <></>
              <label>
                Probation Status <span>:</span>
              </label>

              <select
                name="ProbationStatus"
                value={EmployeeformData.ProbationStatus}
                onChange={handleInputChange}
              >
                <option value="select">Select</option>
                <option value="Extended">Extended</option>
                <option value="Terminated">Terminated</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {EmployeeformData.ProbationStatus == "Extended" && (
              <>
                <div className="RegisForm_1">
                  <label>
                    Extended Date <span>:</span>
                  </label>
                  <input
                    type="date"
                    name="ExtendedDate"
                    value={EmployeeformData.ExtendedDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="RegisForm_1">
                  <label>
                    Extended Months <span>:</span>
                  </label>
                  <input
                    type="number"
                    name="ExtendedMonths"
                    value={EmployeeformData.ExtendedMonths}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
            {EmployeeformData.ProbationStatus == "Terminated" && (
              <>
                <div className="RegisForm_1">
                  <label>
                    Terminated Date <span>:</span>
                  </label>
                  <input
                    type="date"
                    name="TerminatedDate"
                    value={EmployeeformData.TerminatedDate}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            {EmployeeformData.ProbationStatus == "Completed" && (
              <>
                <div className="RegisForm_1">
                  <label>
                    Completed Date <span>:</span>
                  </label>
                  <input
                    type="date"
                    name="TrainingCompletedDate"
                    value={EmployeeformData.TrainingCompletedDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="RegisForm_1">
                  <label>
                    Confirmation Date <span>:</span>
                  </label>
                  <input
                    type="date"
                    name="confirmation_date"
                    value={EmployeeformData.confirmation_date}
                    onChange={handleInputChange}
                  />
                </div>
                {/* After completing the review */}
                <br />

                <br />

                <div className="RegisFormcon">
                  <div className="RegisForm_1">
                    <label>
                      CRF Form <span>:</span>
                    </label>

                    <div className="RegisterForm_2">
                      {/* Hidden file input */}
                      <input
                        type="file"
                        name={"confidential_review_form"} // Update the name to CRFForm
                        accept="image/jpeg, image/png, application/pdf"
                        required
                        id={"confidential_review_form"} // Update the id to CRFForm
                        autoComplete="off"
                        onChange={handleinpchangeDocumentsForm} // Event handler for file change
                        style={{ display: "none" }} // Hide the input field
                      />

                      <div
                        style={{
                          width: "120px",
                          display: "flex",
                          justifyContent: "flex-start",
                          gap: "20px",
                        }}
                      >
                        {/* Label for file input */}
                        <label
                          htmlFor={"confidential_review_form"}
                          className="RegisterForm_1_btns choose_file_update"
                        >
                          <PhotoCameraBackIcon />{" "}
                          {/* Icon for uploading a file */}
                        </label>

                        {/* Button to view selected CRF form file */}
                        <button
                          className="RegisterForm_1_btns choose_file_update"
                          onClick={() =>
                            Selectedfileview(
                              EmployeeformData.confidential_review_form
                            )
                          } // Update the key to CRFForm
                        >
                          <VisibilityIcon /> {/* Icon for viewing the file */}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="RegisFormcon">
                  <div className="RegisForm_1">
                    <label>
                      HOD Review Form <span>:</span>
                    </label>

                    <div className="RegisterForm_2">
                      {/* Hidden file input */}
                      <input
                        type="file"
                        name={"hod_review_form"} // Keep the name as 'hod_review_form'
                        accept="image/jpeg, image/png, application/pdf"
                        required
                        id={"hod_review_form"} // Keep the ID as 'hod_review_form'
                        autoComplete="off"
                        onChange={handleinpchangeDocumentsForm} // Handle file change
                        style={{ display: "none" }} // Hide the input field
                      />

                      <div
                        style={{
                          width: "120px",
                          display: "flex",
                          justifyContent: "flex-start",
                          gap: "20px",
                        }}
                      >
                        {/* Label for file input */}
                        <label
                          htmlFor={"hod_review_form"}
                          className="RegisterForm_1_btns choose_file_update"
                        >
                          <PhotoCameraBackIcon />{" "}
                          {/* Icon for uploading a file */}
                        </label>

                        {/* Button to view selected file */}
                        <button
                          className="RegisterForm_1_btns choose_file_update"
                          onClick={() =>
                            Selectedfileview(EmployeeformData.hod_review_form)
                          } // Handle file view
                        >
                          <VisibilityIcon /> {/* Icon for viewing the file */}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="RegisFormcon">
                  <div className="RegisForm_1">
                    <label>
                      HR Review Form <span>:</span>
                    </label>

                    <div className="RegisterForm_2">
                      {/* Hidden file input */}
                      <input
                        type="file"
                        name={"hr_review_form"} // Keep the name as 'hod_review_form'
                        accept="image/jpeg, image/png, application/pdf"
                        required
                        id={"hr_review_form"} // Keep the ID as 'hod_review_form'
                        autoComplete="off"
                        onChange={handleinpchangeDocumentsForm} // Handle file change
                        style={{ display: "none" }} // Hide the input field
                      />

                      <div
                        style={{
                          width: "120px",
                          display: "flex",
                          justifyContent: "flex-start",
                          gap: "20px",
                        }}
                      >
                        {/* Label for file input */}
                        <label
                          htmlFor={"hr_review_form"}
                          className="RegisterForm_1_btns choose_file_update"
                        >
                          <PhotoCameraBackIcon />{" "}
                          {/* Icon for uploading a file */}
                        </label>

                        {/* Button to view selected file */}
                        <button
                          className="RegisterForm_1_btns choose_file_update"
                          onClick={() =>
                            Selectedfileview(EmployeeformData.hr_review_form)
                          } // Handle file view
                        >
                          <VisibilityIcon /> {/* Icon for viewing the file */}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {EmployeeformData.requiresSecurityDeposit && (
          <>
            <br />
            <br />

            <div className="DivCenter_container">
              Security Deposit <span>:</span>
            </div>
            <br />

            <div className="RegisForm_1">
              <label>
                Security Deposite Start Date <span>:</span>
              </label>
              <input
                type="date"
                name="security_start_date"
                value={EmployeeformData.security_start_date}
                onChange={handleInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Total Security Amount <span>:</span>
              </label>
              <input
                type="number"
                name="total_security_amount"
                value={EmployeeformData.total_security_amount}
                onChange={handleInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Months to be Scheduled <span>:</span>
              </label>
              <input
                type="number"
                name="Security_months_to_be_scheduled"
                value={EmployeeformData.Security_months_to_be_scheduled}
                onChange={handleInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Monthly EMI Amount <span>:</span>
              </label>
              <input
                type="number"
                name="Security_months_paid"
                value={EmployeeformData.Security_months_paid}
                onChange={handleInputChange}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Completed EMI <span>:</span>
              </label>
              <input
                type="number"
                name="Security_installment_count"
                value={EmployeeformData.Security_installment_count}
                onChange={handleInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Pending EMI <span>:</span>
              </label>
              <input
                type="number"
                name="Security_pending_months"
                value={EmployeeformData.Security_pending_months}
                onChange={handleInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                End Date <span>:</span>
              </label>
              <input
                type="date"
                name="security_end_date"
                value={EmployeeformData.security_end_date}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        {/* 17-2-25 */}

        {EmployeeformData.requireGratuity && (
          <>
            <br />
            <br />

            <div className="DivCenter_container">
              Gratuity<span>:</span>
            </div>
            <br />
            <div className="RegisForm_1">
              <label>
                Start Date <span>:</span>
              </label>
              <input
                type="date"
                name="gratuity_start_date"
                value={EmployeeformData.gratuity_start_date}
                onChange={handleInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                {" "}
                Total Gratuity Amount <span>:</span>
              </label>
              <input
                type="number"
                name="total_gratuity_amount"
                value={EmployeeformData.total_gratuity_amount}
                onChange={handleInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Months to be Scheduled <span>:</span>
              </label>
              <input
                type="number"
                name="Gratuity_months_to_be_scheduled"
                value={EmployeeformData.Gratuity_months_to_be_scheduled}
                onChange={handleInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Monthly EMI Amount <span>:</span>
              </label>
              <input
                type="number"
                name="monthly_Gratuity_amount"
                value={EmployeeformData.monthly_Gratuity_amount}
                onChange={handleInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Installment Count <span>:</span>
              </label>
              <input
                type="number"
                name="Gratuity_installment_count"
                value={EmployeeformData.Gratuity_installment_count}
                onChange={handleInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Pending Months <span>:</span>
              </label>
              <input
                type="number"
                name="Gratuity_pending_months"
                value={EmployeeformData.Gratuity_pending_months}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
        <br />
        <div className="DivCenter_container">Leave List</div>
        <br />

        <div className="RegisForm_1">
          <label htmlFor="leaveType">
            {" "}
            LeaveType <span>:</span>
          </label>
          <select
            name="leaveType"
            id="leaveType"
            onChange={(e) => setLeaveType(e.target.value)}
          >
            <option value="select">select</option>
            {Array.isArray(leaveData) && leaveData.map((leave) => (
              <option key={leave.code} value={leave.type}>
                {leave.leave_type}
              </option>
            ))}
          </select>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="numleaves">
            {" "}
            No of Leaves <span>:</span>
          </label>
          <input
            type="number"
            min={0}
            placeholder="Number of Leaves"
            value={numLeaves}
            className="forExtrabutton-withInput"
            onChange={(e) => setNumLeaves(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AddBoxIcon onClick={handleAddLeave} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            gap: "20px",
          }}
        >
          {Array.isArray(leavesList) && leavesList.length > 0 && (
            <div
              className="Selected-table-container"
              style={{
                width: "50%",
                backgroundColor: "#ffffff",
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
                Leave Details
              </h3>
              <table
                className="selected-leave-table2"
                style={{
                  tableLayout: "auto",
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: "Nunito",
                  fontSize: "13px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#E0E0E0" }}>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Leave Type
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Number of Leaves
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leavesList.map((leave, index) => (
                    <tr key={index} style={{ backgroundColor: "#F5F5F5" }}>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {leave.leaveType}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {leave.numLeaves}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        <button
                          onClick={() => handleDeleteLeave(index)}
                          style={{ color: "red", cursor: "pointer" }}
                        >
                          <DeleteIcon className="check_box_clrr_cancell" />
                        </button>
                      </td>{" "}
                    </tr>
                  ))}
                </tbody>
                <tfoot style={{ backgroundColor: "#E0E0E0" }}>
                  <tr>
                    <td
                      style={{
                        width: "350px",
                        height: "30px",
                        fontWeight: "bold",
                      }}
                      colSpan="3"
                    >
                      Total Leaves: {totalleaves}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
      <br />
      <div className="DivCenter_container">Salary and Bank Details</div>
      <br />
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label>
            CTC (LPA) <span>:</span>
          </label>
          <input
            type="number"
            name="ctc"
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            value={EmployeeformData.ctc}
            onChange={handleInputChangef}
       
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Salary <span>:</span>
          </label>
          <input
            type="number"
            name="Salary"
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            value={EmployeeformData.Salary}
           
            onChange={handleInputChangef}
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Basic Salary (%) <span>:</span>
          </label>
          <input
            type="number"
            name="basicSalaryPercent"
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            value={EmployeeformData.basicSalaryPercent}
           
            onChange={handleInputChangef}
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Basic Salary <span>:</span>
          </label>
          <input
            type="number"
            name="BasicSalary"
            value={EmployeeformData.BasicSalary}
           
          onChange={(e)=>setEmployeeformData((prev)=>({
            ...prev,
            BasicSalary:e.target.value
          }))}
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Allowances <span>:</span>
          </label>
          <select
            name="Allowances"
            value={selectedAllowance}
            onChange={handleAllowanceSelection}
           
          >
            <option value="select">Select</option>
            {Array.isArray(allowanceData) && allowanceData.map((allowance, index) => (
              <option key={index} value={allowance.value}>
                {allowance.allowance_name}
              </option>
            ))}
          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            Input Type <span>:</span>
          </label>
          <select
            name="inputType"
            value={inputType}
            onChange={handleInputTypeChange}
           
          >
            <option value="percentage">Percentage</option>
            <option value="amount">Amount</option>
          </select>
        </div>

        <div className="RegisForm_1">
          {inputType === "percentage" ? (
            <>
              <label>
                Allowance (%s) <span>:</span>
              </label>
              <input
                type="number"
                name="AllowancePercentage"
                className="forExtrabutton-withInput"
                value={allowancePercentage}
                onChange={handleAllowancePercentageChange}
               
              />
            </>
          ) : (
            <>
              <label>
                Allowance Amount <span>:</span>
              </label>
              <input
                type="number"
                name="allowanceAmount"
                className="forExtrabutton-withInput"
                value={allowanceAmount}
                onChange={handleAllowanceAmountChange}
               
              />
            </>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AddBoxIcon onClick={addAllowance} />
          </div>
        </div>
        <div className="RegisForm_1">
          <label>
            Deductions <span>:</span>
          </label>

          <select
            name="Deductions"
            value={selectedDeduction}
            onChange={handleDeductionSelection}
           
          >
            <option value="select">Select</option>
            {deductionData.map((deduction, index) => (
              <option key={index} value={deduction.deduction_name}>
                {deduction.deduction_name}
              </option>
            ))}
          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            Deduction Amount <span>:</span>
          </label>
          <input
            type="number"
            name="DeductionAmount"
            className="forExtrabutton-withInput"
            value={deductionAmount}
            onChange={handleDeductionAmountChange}
           
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AddBoxIcon onClick={addDeduction} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            gap: "20px",
          }}
        >
          {/* Allowances Table */}
          {Array.isArray(EmployeeformData.allowances) &&
            EmployeeformData.allowances.length > 0 && (
              <div
                className="Selected-table-container"
                style={{
                  width: "50%",
                  backgroundColor: "#ffffff",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                }}
              >
                <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
                  Allowances
                </h3>
                <table
                  className="selected-allowance-table"
                  style={{
                    tableLayout: "auto",
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "Nunito",
                    fontSize: "13px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#E0E0E0" }}>
                      <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                        Allowance Name
                      </th>
                      <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                        Percentage (%)
                      </th>
                      <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                        Amount
                      </th>
                      <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {EmployeeformData.allowances.map((allowance, index) => {
                      const totalSalary =
                        parseFloat(EmployeeformData.Salary) || 0;
                      const basicSalaryPercent =
                        parseFloat(EmployeeformData.basicSalaryPercent) || 0;

                      const basicSalary =
                        (totalSalary * basicSalaryPercent) / 100;
                      const remainingSalary = totalSalary - basicSalary;

                      const amount =
                        allowance.allowance_amount ||
                        (remainingSalary * allowance.allowance_percentage) /
                          100;

                      return (
                        <tr key={index} style={{ backgroundColor: "#F5F5F5" }}>
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {allowance.allowance_name}
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {allowance.allowance_percentage}%
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {/* Ensure amount is a number and provide a fallback */}
                            {typeof amount === "number"
                              ? amount.toFixed(2)
                              : allowance.allowance_amount}
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            <button
                              onClick={() => handleDeleteAllowance(index)}
                              style={{ color: "red", cursor: "pointer" }}
                            >
                              <DeleteIcon className="check_box_clrr_cancell" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot style={{ backgroundColor: "#E0E0E0" }}>
                    <tr>
                      <td
                        style={{ fontWeight: "bold", padding: "8px" }}
                        colSpan="4"
                      >
                        Total Allowance Amount:{" "}
                        {EmployeeformData.AllowanceAmount}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

          {Array.isArray(EmployeeformData.deductions) &&
            EmployeeformData.deductions.length > 0 && (
              <div
                className="Selected-table-container"
                style={{
                  width: "50%",
                  backgroundColor: "#ffffff",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                }}
              >
                <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
                  Deductions
                </h3>
                <table
                  className="selected-deduction-table"
                  style={{
                    tableLayout: "auto",
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "Nunito",
                    fontSize: "13px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#E0E0E0" }}>
                      <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                        Deduction Name
                      </th>
                      <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                        Amount
                      </th>
                      <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {EmployeeformData.deductions.map((deduction, index) => (
                      <tr key={index} style={{ backgroundColor: "#F5F5F5" }}>
                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {deduction.deduction_name}
                        </td>
                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {deduction.deduction_amount}
                        </td>
                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          <button
                            onClick={() => handleDeleteDeduction(index)}
                            style={{ color: "red", cursor: "pointer" }}
                          >
                            <DeleteIcon className="check_box_clrr_cancell" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot style={{ backgroundColor: "#E0E0E0" }}>
                    <tr>
                      <td
                        style={{ fontWeight: "bold", padding: "8px" }}
                        colSpan="3"
                      >
                        Total Deduction Amount:{" "}
                        {EmployeeformData.deductions
                          .reduce(
                            (total, deduction) =>
                              total + parseFloat(deduction.deduction_amount),
                            0
                          )
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
        </div>

        <div className="RegisForm_1">
          <label>
            PF is applicable? <span>:</span>
          </label>
          <input
            type="checkbox"
            checked={EmployeeformData.PF_is_applicable}
            style={{ height: "15px" }}
           
            onChange={(e) =>
              setEmployeeformData((prevData) => ({
                ...prevData,
                PF_is_applicable: e.target.checked,
              }))
            }
          />
        </div>

        {EmployeeformData.PF_is_applicable && (
          <>
            <div className="RegisForm_1">
              <label>
                PF Number<span>:</span>
              </label>
              <input
                type="text"
                name="PFNumber"
                value={EmployeeformData.PFNumber}
               
                onChange={handleInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Employee Percentage <span>:</span>
              </label>
              <input
                type="number"
                name="Employee_Percentage"
                value={EmployeeformData.Employee_Percentage}
               
                onChange={handleInputChange}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Employer Percentage <span>:</span>
              </label>
              <input
                type="number"
                name="Employer_Percentage"
                value={EmployeeformData.Employer_Percentage}
               
                onChange={handleInputChange}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Employer PF amount <span>:</span>
              </label>
              <input
                type="number"
                name="Employer_PF_amount"
                value={EmployeeformData.Employer_PF_amount}
               
                onChange={handleInputChange}
                disabled
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Employee PF amount <span>:</span>
              </label>
              <input
                type="number"
                name="Employee_PF_amount"
                value={EmployeeformData.Employee_PF_amount}
               
                onChange={handleInputChange}
                disabled
              />
            </div>
          </>
        )}

        {/* <div className="RegisForm_1">
          <label>
            PF amount <span>:</span>
          </label>
          <input
            type="number"
            name="PF_amount"
            value={EmployeeformData.PF_amount}
            onChange={handleInputChange}
            disabled
          />
        </div> */}

        <div className="RegisForm_1">
          <label>
            ESI is applicable? <span>:</span>
          </label>
          <input
            type="checkbox"
            checked={EmployeeformData.ESI_is_applicable}
            style={{ height: "15px" }}
           
            onChange={(e) =>
              setEmployeeformData((prevData) => ({
                ...prevData,
                ESI_is_applicable: e.target.checked,
              }))
            }
          />
        </div>

        {EmployeeformData?.ESI_is_applicable && (
          <>
            <div className="RegisForm_1">
              <label>
                ESI Number<span>:</span>
              </label>
              <input
                type="text"
                name="ESINumber"
               
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                value={EmployeeformData.ESINumber}
                onChange={handleInputChange}
              />
            </div>{" "}
            <div className="RegisForm_1">
              <label>
                ESI (%)<span>:</span>
              </label>
              <input
                type="text"
                name="ESI_Percentage"
               
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                value={EmployeeformData.ESI_Percentage}
                onChange={handleInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                ESI Amount<span>:</span>
              </label>
              <input
                type="text"
                name="ESI_Amount"
               
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                value={EmployeeformData.ESI_Amount}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}


        <div className="RegisForm_1">
          <label>
            TDS is applicable? <span>:</span>
          </label>
          <input
            type="checkbox"
            checked={EmployeeformData.TDS_is_applicable}
            style={{ height: "15px" }}
           
            onChange={(e) =>
              setEmployeeformData((prevData) => ({
                ...prevData,
                TDS_is_applicable: e.target.checked,
              }))
            }
          />
        </div>


        {EmployeeformData?.TDS_is_applicable && (
          <>
          
            <div className="RegisForm_1">
              <label>
                TDS (%)<span>:</span>
              </label>
              <input
                type="text"
                name="TDS_Percentage"
               
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                value={EmployeeformData.TDS_Percentage}
                onChange={handleInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                TDS Amount<span>:</span>
              </label>
              <input
                type="text"
                name="TDS_Amount"
               
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                value={EmployeeformData.TDS_Amount}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}






        <div className="RegisForm_1">
          <label>
            Net Salary(TH) <span>:</span>
          </label>
          <input
            type="number"
            name="net_salary"
            value={EmployeeformData.net_salary}
            onChange={handleInputChange}
            disabled
          />
        </div>
      </div>

      <br />

      <div className="DivCenter_container">Bank Details</div>
      <br />
      <div className="RegisFormcon">
        <br />
        <div className="RegisForm_1">
          <label>
            Account Number<span>:</span>
          </label>
          <input
            type="number"
            name="AccountNumber"
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            value={EmployeeformData.AccountNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Bank Name<span>:</span>
          </label>
          <input
            type="text"
            name="BankName"
            value={EmployeeformData.BankName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Branch<span>:</span>
          </label>
          <input
            type="text"
            name="Branch"
            value={EmployeeformData.Branch}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            IFSC Code <span>:</span>
          </label>
          <input
            type="text"
            name="IfscCode"
            value={EmployeeformData.IfscCode}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Pan Number <span>:</span>
          </label>
          <input
            type="text" 
            name="PanNumber"
            maxLength={10}
            value={EmployeeformData.PanNumber}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <br />
      <div className="DivCenter_container">Document Checklist</div>
      <br />
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label>
            Resume<span>:</span>
          </label>

          <div className="RegisterForm_2">
            <input
              type="file"
              name={"Resume"}
              accept="image/jpeg, image/png, application/pdf"
              required
              id={"Resume"}
              autoComplete="off"
              onChange={handleinpchangeDocumentsForm}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: "120px",
                display: "flex",
                justifyContent: "flex-start",
                gap: "20px",
              }}
            >
              <label
                htmlFor={"Resume"}
                className="RegisterForm_1_btns choose_file_update"
              >
                <PhotoCameraBackIcon />
              </label>
              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={() => Selectedfileview(EmployeeformData.Resume)}
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>
        <div className="RegisForm_1">
          <label>
            Govt Id (PAN)<span>:</span>
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              name={"PanCard"}
              accept="image/jpeg, image/png, application/pdf"
              required
              id={"PanCard"}
              autoComplete="off"
              onChange={handleinpchangeDocumentsForm}
              //   readOnly={IsViewMode}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: "120px",
                display: "flex",
                justifyContent: "flex-start",
                gap: "20px",
              }}
            >
              <label
                htmlFor={"PanCard"}
                className="RegisterForm_1_btns choose_file_update"
              >
                <PhotoCameraBackIcon />
              </label>
              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={() => Selectedfileview(EmployeeformData.PanCard)}
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="RegisForm_1">
          <label>
            Aadhar Card<span>:</span>
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              name={"AadharCard"}
              accept="image/jpeg, image/png, application/pdf"
              required
              id={"AadharCard"}
              autoComplete="off"
              onChange={handleinpchangeDocumentsForm}
              //   readOnly={IsViewMode}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: "120px",
                display: "flex",
                justifyContent: "flex-start",
                gap: "20px",
              }}
            >
              <label
                htmlFor={"AadharCard"}
                className="RegisterForm_1_btns choose_file_update"
              >
                <PhotoCameraBackIcon />
              </label>
              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={() => Selectedfileview(EmployeeformData.AadharCard)}
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="RegisForm_1">
          <label>
            Bank Passbook <span>:</span>
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              name={"BankPassbook"}
              accept="image/jpeg, image/png, application/pdf"
              required
              id={"BankPassbook"}
              autoComplete="off"
              onChange={handleinpchangeDocumentsForm}
              //   readOnly={IsViewMode}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: "120px",
                display: "flex",
                justifyContent: "flex-start",
                gap: "20px",
              }}
            >
              <label
                htmlFor={"BankPassbook"}
                className="RegisterForm_1_btns choose_file_update"
              >
                <PhotoCameraBackIcon />
              </label>
              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={() => Selectedfileview(EmployeeformData.BankPassbook)}
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="RegisForm_1">
          <label>
            Experience Certificate<span>:</span>
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              name={"ExperienceCertificate"}
              accept="image/jpeg, image/png, application/pdf"
              required
              id={"ExperienceCertificate"}
              autoComplete="off"
              onChange={handleinpchangeDocumentsForm}
              //   readOnly={IsViewMode}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: "120px",
                display: "flex",
                justifyContent: "flex-start",
                gap: "20px",
              }}
            >
              <label
                htmlFor={"ExperienceCertificate"}
                className="RegisterForm_1_btns choose_file_update"
              >
                <PhotoCameraBackIcon />
              </label>
              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={() =>
                  Selectedfileview(EmployeeformData.ExperienceCertificate)
                }
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>
        <div className="RegisForm_1">
          <label>
            Medical Fitness<span>:</span>
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              name={"MedicalFitness"}
              accept="image/jpeg, image/png, application/pdf"
              required
              id={"MedicalFitness"}
              autoComplete="off"
              onChange={handleinpchangeDocumentsForm}
              //   readOnly={IsViewMode}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: "120px",
                display: "flex",
                justifyContent: "flex-start",
                gap: "20px",
              }}
            >
              <label
                htmlFor={"MedicalFitness"}
                className="RegisterForm_1_btns choose_file_update"
              >
                <PhotoCameraBackIcon />
              </label>
              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={() =>
                  Selectedfileview(EmployeeformData.MedicalFitness)
                }
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="RegisForm_1">
          <label>
            Offer Letter<span>:</span>
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              name={"Offerletter"}
              accept="image/jpeg, image/png, application/pdf"
              required
              id={"Offerletter"}
              autoComplete="off"
              onChange={handleinpchangeDocumentsForm}
              //   readOnly={IsViewMode}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: "120px",
                display: "flex",
                justifyContent: "flex-start",
                gap: "20px",
              }}
            >
              <label
                htmlFor={"Offerletter"}
                className="RegisterForm_1_btns choose_file_update"
              >
                <PhotoCameraBackIcon />
              </label>
              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={() => Selectedfileview(EmployeeformData.Offerletter)}
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Checklist End */}
      <br />
      <br />

      <ToastContainer />
      {selectDepartment && (
        <div className="loader" onClick={() => setSelectDepartment(false)}>
          <div
            className="loader_register_roomshow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="DivCenter_container">Select Department Details</div>
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label htmlFor="selectDepModal.SelectDepartment">
                  Select Department <span>:</span>
                </label>
                <select
                  name="SelectDepartment"
                  required
                  id={selectDepModal.SelectDepartment}
                  value={selectDepModal.SelectDepartment}
                  onChange={handleinpchangeDepartment}
                >
                  <option value="">Select</option>
                  {DepartmentData.filter((p) => p.Status === "Active").map(
                    (p, index) => (
                      <option key={index} value={p.id}>
                        {p.DepartmentName}
                      </option>
                    )
                  )}
                </select>
                <div className="Main_container_Btn">
                  <button onClick={handleDepartmentSave}>Save</button>
                </div>
              </div>
            </div>
            <ReactGrid columns={SelectDataColumn} RowData={Departments} />
          </div>
        </div>
      )}
      <ModelContainer />

      <div className="Main_container_Btn">
        <button onClick={handleSubmit}>
          {EmployeeListId?.Employee_Id ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default EmployeeRegistration;
