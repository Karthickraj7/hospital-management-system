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

const TraineeRegistration = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log(userRecord, "userRecord");
  const navigate = useNavigate();
  const EmployeeListId = useSelector(
    (state) => state.Frontoffice?.EmployeeListId
  );

  const TraineeEditData = useSelector((state) => state.userRecord?.TraineeEditData);


  console.log(TraineeEditData,'TraineeEditData received');
  

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
    console.log("Webcam ref:", webcamRef1.current);
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

  const [Classifications,setClassifications] = useState([]);
  const [Roles,setRoles] = useState([]);


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

  const [TraineeformData, setTraineeformData] = useState({
    Title: "",
    FirstName: "",
    MiddleName: "",
    SurName: "",
    Gender: "",
    Dob: "",
    Age: "",
    BloodGroup: "",
    Phone: "",
    // alternatePhone: "",
    InstitutionalName:"",
    // Address:"",
    InchargePerson:"",
    TraineeStartdate:"",
    TraineeEnddate:"",
    InductionGivenby:"",
    Certifiedby:"",


    Email: "",
    Qualification: "",
    // SkillSet: [],
    IdProofType: "",
    IdProofNo: "",

    MaritalStatus: "",
    // MarriagePlan: "",
    // AnniversaryDate: "",
    FatherName: "",
    FatherContact: "",
    // FatherWorking: "",
    // FatherWorkPlace: "",


    // MotherName: "",
    // MotherContact: "",
    // MotherWorking: "",
    // MotherWorkPlace: "",

    SpouseName: "",
    SpouseContact: "",
    // SpouseWorking: "",
    // SpouseWorkPlace: "",
    // Child: "",
    // TotalNoChild: "",
    // address
    DoorNo: "",
    Street: "",
    Area: "",
    City: "",
    District: "",
    State: "",
    Country: "",
    Pincode: "",
    // PermanentAddressSame: "YES",
    // PERMANENT ADDRESS
    // PermanentdoorNo: "",
    // PermanentStreet: "",
    // PermanentArea: "",
    // PermanentCity: "",
    // PermanentDistrict: "",
    // PermanentState: "",
    // PermanentCountry: "",
    // PermanentPincode: "",



    Residence: "",
    Status:"",

    EmergencyContactName: "",
    // EmergencyContactName2: "",
    EmergencyContactNo: "",
    // EmergencyContactNo2: "",
    // ActiveStatus: "Yes",
    // RequirementSource: "",
    // Source: "",

    Photo: null,
    // CapturedImage1: null,
    // Signature: null,
    Trainee_Id :'',

    // Medical Information..................

    // PsychiatricMedicines: "",
    // PsychiatricMedicinesDetails: "",
    // PreviousOperation: "",
    // SurgeriesDetails: "",
    // VaccinationStatus: "",
    // VaccinationStatusDetails: "",
    // MedicalFitnessCertificate: null,
    // AnnualMedicalCheckup: null,

    // Employeement History..................

    // PreviousWorkExperience: "No",
    // PreviousPfnumber: "No",
    // PreviousESInumber: "No",
    // PFnumber: "",
    // ESInumber: "",
    // NoOfYears: "",
    // WorkStationNameAddress: "",
    // WorkStationPhoneNo: "",
    // ReasonForLeft: "",
    // ConfirmedBy: "",
    // EmployeePaySlip: null,
    // EmployeeOfferLetter: null,
    // EmployeeReliveLetter: null,

    // Current Employment ..................

    // DateOfJoining: "",
    // Category: "",
    // Classification : "",
    // Role : "",
    // Speciality: "",
    // Department: "",
    // DepartmentId: "",
    // Designation: "",
    // Locations: "",

    // EmployeeId: "",
   
    // WorkEmail: "",
    // ReportingManager: "",
    // GovtLeave: "",
    // CasualLeave: "",
    // SickLeave: "",
    // TotalLeave: "",
    // ProbationPeriod: "",
    // months: "",
    // years: "",
    // TrainingGivenBy: "",
    // TrainingVerifiedBy: "",
    // TrainingCompletedDate: "",

    // Financial Information --------------------

    // salaryType: "",
    // payScale: "",
    // Ctc: 0,
    // BasicSalary: 0,
    // GrossSalary: 0,
    // HrAllowance: "",
    // MedicalAllowance: "",
    // SpecialAllowance: "",
    // TravelAllowance: "",
    // PfForEmployee: "",
    // PfForEmployeer: "",
    // EsiAmount: "",
    // Tds: "",
    // HRAfinal: 0,
    // medicalAllowancefinal: 0,
    // specialAllowancefinal: 0,
    // travelAllowancefinal: 0,

    // StipendAmount: "",
    // AccountHolderName: "",
    // AccountNumber: "",
    // BankName: "",
    // Branch: "",
    // IfscCode: "",
    // PanNumber: "",
    // UploadCsvFile: null,

    // Document Checklist --------------------

    // Resume: null,
    // PanCard: null,
    // AadharCard: null,
    // BankPassbook: null,
    TraineeCertificate: null,
    // MedicalFitness: null,
    // Offerletter: null,
  });

  const [MedicalInformation, setMedicalInformation] = useState({
    Fit: false,
    Epilepsy: false,
    Ashthma: false,
    Dm: false,
    Ht: false,
    Ihd: false,
  });
  console.log("TraineeformData", TraineeformData);
  // console.log('EmployeeListId', EmployeeListId)
  // console.log(TraineeformData,'TraineeEditData received');

  const handleCloseModal = () => {
    setShowskil(false);
  };

  const HandleDepartmentSelect = () => {
    console.log("Icon clickedddd");

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
      renderCell: (TraineeEditData) => {
        return (
          <>
            <Button
              className="cell_btn"
              onClick={() => handleDeleteDepartments(TraineeEditData.row)}
            >
              <DeleteIcon className="check_box_clrr_cancell" />
            </Button>
          </>
        );
      },
    },
  ];

  const handleDeleteDepartments = (departmentId) => {
    console.log("Department ID to delete:", departmentId);
    const updatedDepartments = Departments.filter(
      (dep) => dep.id !== departmentId.id
    );
    console.log("Updated Departments after deletion:", updatedDepartments);
    setDepartments(updatedDepartments);

    // Update the DoctorProfessForm state with the remaining departments
    setTraineeformData((prev) => ({
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
  // const handleDepartmentSave = () => {
  //   const selectedDepartment = DepartmentData.find(
  //     (dep) => dep.id === parseInt(selectDepModal.SelectDepartment)
  //   );

  //   if (selectedDepartment) {
  //     const departmentExists = Departments.some(
  //       (dep) => dep.id === selectedDepartment.id
  //     );

  //     if (departmentExists) {
  //       // Dispatch a warning toast
  //       const tdata = {
  //         message: "The Department is already Selected",
  //         type: "warn",
  //       };
  //       dispatchvalue({ type: "toast", value: tdata });
  //     } else {
  //       const updatedDepartments = [
  //         ...Departments,
  //         {
  //           id: selectedDepartment.id,
  //           SelectedDepartment: selectedDepartment.DepartmentName,
  //         },
  //       ];

  //       setDepartments(updatedDepartments);

  //       // Update the DoctorProfessForm state with a comma-separated string
  //       setTraineeformData((prev) => ({
  //         ...prev,
  //         Department: updatedDepartments
  //           .map((dep) => dep.SelectedDepartment)
  //           .join(", "),
  //         DepartmentId: updatedDepartments.map((dep) => dep.id).join(", "),
  //       }));
  //     }
  //   }

  //   setselectDepModal({ SelectDepartment: "" }); // Reset after saving
  // };

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

    console.log(Data, "Data to Submit");

    // setTraineeformData((prevState) => ({
    //   ...prevState,
    //   SkillSet: skills, // Add the skills array to the TraineeformData
    // }));

    setShowskil(false);
  };

  const handleViewClick = () => {
    // Merge saved skills and newly added skills
    const allSkills = [...(TraineeformData.SkillSet || []), ...newSkills];
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

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const handleRecaptureImage1 = () => {
    setTraineeformData((prev) => ({
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
    console.log("Webcam reference:", webcamRef1.current);
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
            setTraineeformData((prev) => ({
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    let GapFormatValue = value.trim();

    // Capitalize the first letter for specific fields
    if (["FirstName", "MiddleName", "SurName", "AliasName","EmergencyContactName","InstitutionalName","InchargePerson","InductionGivenby",
      "Certifiedby"].includes(name)) {
      formattedValue = `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
    }

    if (name === "Dob") {
      const selectedDate = new Date(value);
      const age = differenceInYears(new Date(), selectedDate);
      setTraineeformData((prev) => ({
        ...prev,
        Dob: value,
        Age: age >= 0 && age <= 100 ? age : "",
      }));
      return; // Exit after handling Dob
    }

    if (name === "Age") {
      const intAge = parseInt(value, 10);
      if (!isNaN(intAge) && intAge >= 0 && intAge <= 100) {
        const dobDate = subYears(new Date(), intAge);
        setTraineeformData((prev) => ({
          ...prev,
          Age: intAge,
          Dob: format(dobDate, "yyyy-MM-dd"),
        }));
      } else {
        setTraineeformData((prev) => ({
          ...prev,
          Age: value,
          Dob: "",
        }));
      }
      return; // Exit after handling Age
    }

    if (name === "Title") {
      setTraineeformData((prev) => ({
        ...prev,
        [name]: value, // Assign original dropdown value to Title
        Gender: ["Miss", "Ms", "Mrs"].includes(value)
          ? "Female"
          : ["Mr", "Master"].includes(value)
            ? "Male"
            : ["TransGender", "Baby", "Dr"].includes(value)
              ? "Transgender"
              : prev.Gender, // Retain existing Gender if no match
      }));
      return; // Exit after handling Title
    }
    if (name === "MaritalStatus") {
      setTraineeformData((prev) => ({
        ...prev,
        [name]: value,
        SpouseName: ["Married", "Widowed"].includes(value) ? prev.SpouseName : "",
        AnniversaryDate: value === "Married" ? prev.AnniversaryDate : "",  // Only keep AnniversaryDate if married
      }));
      return;
    }
    if (
      name === "Phone" ||
      name === "alternatePhone" ||
      name === "FatherContact" ||
      name === "MotherContact" ||
      name === "SpouseContact" ||
      name === "EmergencyContactNo1" ||
      name === "EmergencyContactNo2" ||
      name === "WorkStationPhoneNo"
    ) {
      if (GapFormatValue.length <= 10) {
        setTraineeformData((prev) => ({
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

    if (name === "Email") {
      const isGmail = value.endsWith("@gmail.com");
      setTraineeformData((prev) => ({
        ...prev,
        Email: value,
      }));
      setIsEmailValid(isGmail); // Update Email validity
      return; // Exit after handling Email
    }
    if (name === "salaryType") {
      setTraineeformData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    if (name === "payScale") {
      setTraineeformData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    if (name === "Ctc") {
      if (value === "" || parseFloat(value) === 0) {
        // If CTC is empty or zero, reset BasicSalary and GrossSalary
        setTraineeformData((prev) => ({
          ...prev,
          [name]: value, // Clear CTC
          BasicSalary: 0, // Clear BasicSalary
          GrossSalary: 0, // Clear GrossSalary
        }));
      } else {
        // Calculate Basic Salary (assuming 40% of CTC is Basic Salary)
        const ctcValue = parseFloat(value) * 100000;
        const basicSalary = ((ctcValue / 12) * 0.4).toFixed(2);
        setTraineeformData((prev) => ({
          ...prev,
          [name]: value,
          BasicSalary: basicSalary,
        }));
      }
    }
    if (name === "Residence") {

      setTraineeformData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    if (name === "Pincode") {
      setTraineeformData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (name === "PermanentAddressSame" && value === "NO") {
      if (name === "PermanentdoorNo" || name === "PermanentStreet" || name === "PermanentArea" || name === "PermanentCity" || name === "PermanentCountry" || name === "PermanentPincode") {
        setTraineeformData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }



    } else if (name === "PermanentAddressSame" && value === "YES") {
      setTraineeformData((prev) => ({
        ...prev,
        PermanentdoorNo: '',
        PermanentStreet: '',
        PermanentArea: '',
        PermanentCity: '',
        PermanentDistrict: '',
        PermanentState: '',
        PermanentCountry: '',
        PermanentPincode: '',
      }));
    }




    setTraineeformData((prev) => ({
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





  // useEffect(() => {
  //   if (TraineeformData.Pincode.length > 5 && !EmployeeListId?.Employee) {
  //     axios
  //       .get(`${UrlLink}Frontoffice/get_location_by_pincode?pincode=${TraineeformData.Pincode}`)
  //       .then((response) => {
  //         const { country, state, city, district } = response.data;
  //         setTraineeformData((prev) => ({
  //           ...prev,
  //           Country: country || '',
  //           State: state || '',
  //           City: city || '',
  //           District: district || '',
  //         }));
  //       })
  //       .catch((err) => {
  //         console.error('Error fetching pincode details:', err);
  //       });
  //   }
  // }, [TraineeformData.Pincode, EmployeeListId]);

  // // Effect for permanent address Pincode when "PermanentAddressSame" is "NO"
  // useEffect(() => {
  //   if (TraineeformData.PermanentAddressSame === "NO"&& TraineeformData.PermanentPincode.length > 5 &&  !EmployeeListId?.Employee) {
  //     axios
  //       .get(`${UrlLink}Frontoffice/get_location_by_pincode?pincode=${TraineeformData.PermanentPincode}`)
  //       .then((response) => {
  //         const data = response.data;
  //         console.log("Permanent Pincode response:", data);
  //         const { country, state, city, district } = data;
  //         setTraineeformData((prev) => ({
  //           ...prev,
  //           PermanentCountry: country || '',
  //           PermanentState: state || '',
  //           PermanentCity: city || '',
  //           PermanentDistrict: district || '',
  //         }));
  //       })
  //       .catch((err) => {
  //         console.error("Error fetching permanent pincode details:", err);
  //       });
  //   }
  // }, [TraineeformData.PermanentAddressSame, TraineeformData.PermanentPincode,EmployeeListId]); // Dependencies for PermanentAddressSame and PermanentPincode


  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    // Update the form state for the changed field
    setTraineeformData((prev) => ({
      ...prev,
      [name]: value, // Update the specific field (value will be dynamic)
    }));
  };

  // useEffect to handle the calculation of GrossSalary whenever relevant fields change
  useEffect(() => {
    const {
      HrAllowance,
      MedicalAllowance,
      SpecialAllowance,
      TravelAllowance,
      BasicSalary,
    } = TraineeformData;

    // If Basic Salary is not set or is zero, skip further calculations
    const basicSalary = parseFloat(BasicSalary);
    if (isNaN(basicSalary) || basicSalary === 0) return;

    // Check if any allowance field is empty or 0 and treat them as 0
    const HRA = parseFloat(HrAllowance) || 0;
    const medicalAllowance = parseFloat(MedicalAllowance) || 0;
    const specialAllowance = parseFloat(SpecialAllowance) || 0;
    const travelAllowance = parseFloat(TravelAllowance) || 0;

    // Calculate each allowance as a percentage of Basic Salary
    const HRA_value = (basicSalary * (HRA / 100)).toFixed(2);
    const medicalAllowance_value = (
      basicSalary *
      (medicalAllowance / 100)
    ).toFixed(2);
    const specialAllowance_value = (
      basicSalary *
      (specialAllowance / 100)
    ).toFixed(2);
    const travelAllowance_value = (
      basicSalary *
      (travelAllowance / 100)
    ).toFixed(2);

    // Convert them to numbers (if the result is a valid number)
    const HRA_final = isNaN(parseFloat(HRA_value)) ? 0 : parseFloat(HRA_value);
    const medicalAllowance_final = isNaN(parseFloat(medicalAllowance_value))
      ? 0
      : parseFloat(medicalAllowance_value);
    const specialAllowance_final = isNaN(parseFloat(specialAllowance_value))
      ? 0
      : parseFloat(specialAllowance_value);
    const travelAllowance_final = isNaN(parseFloat(travelAllowance_value))
      ? 0
      : parseFloat(travelAllowance_value);

    // Calculate the Gross Salary by summing all components
    const grossSalary =
      basicSalary +
      HRA_final +
      medicalAllowance_final +
      specialAllowance_final +
      travelAllowance_final;

    // Format the Gross Salary to 1 decimal place
    const formattedGrossSalary = isNaN(grossSalary)
      ? 0
      : grossSalary.toFixed(1);

    // Update the form data with the calculated values
    setTraineeformData((prev) => ({
      ...prev,
      HRAfinal: HRA_final,
      medicalAllowancefinal: medicalAllowance_final,
      specialAllowancefinal: specialAllowance_final,
      travelAllowancefinal: travelAllowance_final,
      GrossSalary: formattedGrossSalary, // Set the formatted Gross Salary
    }));
  }, [
    TraineeformData.HrAllowance,
    TraineeformData.MedicalAllowance,
    TraineeformData.SpecialAllowance,
    TraineeformData.TravelAllowance,
    TraineeformData.BasicSalary,
  ]); // Dependency array, only rerun when one of these fields changes

  const handleChangeGovtLeave = (e) => {
    const value = e.target.value;
    setTraineeformData((prevData) => ({
      ...prevData,
      GovtLeave: value,
      TotalLeave: calculateTotalLeave(value, prevData.CasualLeave),
    }));
  };

  const handleChangeCasualLeave = (e) => {
    const value = e.target.value;
    setTraineeformData((prevData) => ({
      ...prevData,
      CasualLeave: value,
      TotalLeave: calculateTotalLeave(prevData.GovtLeave, value),
    }));
  };
  const handleChangeSickLeave = (e) => {
    const value = e.target.value;
    setTraineeformData((prevData) => ({
      ...prevData,
      SickLeave: value,
      TotalLeave: calculateTotalLeave(
        prevData.GovtLeave,
        prevData.CasualLeave,
        value
      ),
    }));
  };

  const calculateTotalLeave = (GovtLeave, CasualLeave, SickLeave) => {
    const GovtLeaveValue = parseInt(GovtLeave) || 0;
    const CasualLeaveValue = parseInt(CasualLeave) || 0;
    const SickLeaveValue = parseInt(SickLeave) || 0;
    return GovtLeaveValue + CasualLeaveValue + SickLeaveValue;
  };

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
          setTraineeformData((prev) => ({
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
    setTraineeformData({});
    setMedicalInformation({});
  };

  useEffect(() => {
    if (TraineeEditData) { 
        console.log("TraineeEditData received", TraineeEditData);

        setTraineeformData((prev) => ({
          ...prev,
          ...TraineeEditData
      }));

        // setTraineeformData((prev) => ({
        //     ...prev,
        //     Trainee_Id: TraineeEditData.Trainee_Id || "",
        //     Title: TraineeEditData.Title || "",
        //     FirstName: TraineeEditData.FirstName || "",
        //     MiddleName: TraineeEditData.MiddleName || "",
        //     SurName: TraineeEditData.SurName || "",
        //     Gender: TraineeEditData.Gender || "",
        //     Dob: TraineeEditData.Dob || "",
        //     Age: TraineeEditData.Age || "",
        //     Bloodgroup: TraineeEditData.Bloodgroup || "",
        //     Phone: TraineeEditData.Phone || "",
        //     Email: TraineeEditData.Email || "",
        //     Qualification: TraineeEditData.Qualification || "",
        //     IdProofType: TraineeEditData.IdProofType || "",
        //     IdProofNo: TraineeEditData.IdProofNo || "",
        //     MaritalStatus: TraineeEditData.MaritalStatus || "",
        //     FatherName: TraineeEditData.FatherName || "",
        //     FatherSpouseName: TraineeEditData.FatherSpouseName || "",
        //     SpouseContact: TraineeEditData.SpouseContact || "",
        //     ContactNo: TraineeEditData.ContactNo || "",
        //     EmergencyContactName: TraineeEditData.EmergencyContactName || "",
        //     EmergencyContactNo: TraineeEditData.EmergencyContactNo || "",
        //     InstitutionalName: TraineeEditData.InstitutionalName || "",
        //     InchargePerson: TraineeEditData.InchargePerson || "",
        //     TraineeStartdate: TraineeEditData.TraineeStartdate || "",
        //     InductionGivenby: TraineeEditData.InductionGivenby || "",
        //     TraineeEnddate: TraineeEditData.TraineeEnddate || "",
        //     Certifiedby: TraineeEditData.Certifiedby || "",
        //     Residence: TraineeEditData.Residence || "",
        //     Photo: TraineeEditData.Photo || null,
        //     TraineeCertificate: TraineeEditData.TraineeCertificate || null,
        //     Status: TraineeEditData.Status || false, 

        //     // Communication Address
        //     Pincode: TraineeEditData.Pincode || "",
        //     DoorNo: TraineeEditData.DoorNo || "",
        //     Street: TraineeEditData.Street || "",
        //     Area: TraineeEditData.Area || "",
        //     City: TraineeEditData.City || "",
        //     District: TraineeEditData.District || "",
        //     State: TraineeEditData.State || "",
        //     Country: TraineeEditData.Country || "",
            
        //     CreatedAt: TraineeEditData.CreatedAt || "",
        //     UpdatedAt: TraineeEditData.UpdatedAt || "",
        //     CreatedBy: TraineeEditData.CreatedBy || "",
        // }));
    }
}, [TraineeEditData, UrlLink]);  


  const handleSubmit = async () => {
    // Combine TraineeformData and other necessary data
    const Data = {
      ...TraineeformData,
      Createdby: userRecord?.username,
      Location: userRecord?.location,
     
      
    };

    console.log(Data, "Data");

    // List of required fields
    const requiredFields = [
      "FirstName",
      "Title",
      "Dob",
      "Age",
      "Gender",
      "Phone",
    ];

    const emptyFields = requiredFields.filter(
      (field) => !TraineeformData[field]
    );

    if (emptyFields.length > 0) {
      alert(`The following fields are required: ${emptyFields.join(", ")}`);
      return;
    }

    try {
      // Send a POST request with the JSON payload
      const response = await axios.post(
        `${UrlLink}HR_Management/Trainee_Registration_Details`,
        Data // Send plain JSON object
      );

      // Handle response
      const [type, message] = [
        Object.keys(response.data)[0],
        Object.values(response.data)[0],
      ];
      dispatch({ type: "toast", value: { message, type } });
      navigate("/Home/TraineeRegistrationList");
      dispatchvalue({ type: "EmployeeListId", value: "" });
      dispatchvalue({ type: "HrFolder", value: "TraineeRegistrationList" });
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <div className="Main_container_app">
      <h3>New Trainee Register</h3>

      {/* PERSONAL DETAILS =============================/ */}
      <div className="DivCenter_container">Personal Details</div>
      <br />

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="Title">
            Title <span>:</span>
          </label>
          <select
            id="Title"
            name="Title"
            value={TraineeformData.Title}
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
            First Name <span>:</span>
          </label>
          <input
            type="text"
            name="FirstName"
            value={TraineeformData.FirstName}
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
            value={TraineeformData.MiddleName}
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
            value={TraineeformData.SurName}
            onChange={handleInputChange}
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Gender <span>:</span>
          </label>
          <select
            name="Gender"
            value={TraineeformData.Gender}
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
            DOB <span>:</span>
          </label>
          <input
            type="date"
            name="Dob"
            value={TraineeformData.Dob}
            onChange={handleInputChange}
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Age <span>:</span>
          </label>
          <input
            type="number"
            name="Age"
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            value={TraineeformData.Age}
            onChange={handleInputChange}
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Blood Group <span>:</span>
          </label>
          <select
            name="BloodGroup"
            id="Bloodgroup"
            value={TraineeformData.BloodGroup}
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
            Phone <span>:</span>
          </label>
          <input
            type="number"
            name="Phone"
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            pattern="[0-9]*"
            className={isPhoneValid.phone ? "valid-label" : "invalid-label"}
            value={TraineeformData.Phone}
            onChange={handleInputChange}
            required
          />
        </div>
    

        <div className="RegisForm_1">
          <label>
            Email <span>:</span>
          </label>
          <input
            type="Email"
            name="Email"
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
            value={TraineeformData.Email}
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
            name="Qualification"
            value={TraineeformData.Qualification}
            onChange={handleInputChange}
            required
          />
        </div>


        
        <div class="RegisForm_1">
          <label>
            Id Proof Type <span>:</span>
          </label>
          <select
            name="IdProofType"
            value={TraineeformData.IdProofType}
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

        {TraineeformData.IdProofType && (
          <div className="RegisForm_1">
            <label>
              Id Proof No <span>:</span>
            </label>
            <input
              type="text"
              name="IdProofNo"
              value={TraineeformData.IdProofNo}
              onChange={handleInputChange}
            />
          </div>
        )}

        <div class="RegisForm_1">
          <label>
            Marital Status <span>:</span>
          </label>
          <select
            name="MaritalStatus"
            value={TraineeformData.MaritalStatus}
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

        {["Married", "Widowed"].includes(TraineeformData.MaritalStatus) && (
          <>
            <div className="RegisForm_1">
              <label>
                Father/Spouse <span>:</span>
              </label>
              <input
                type="text"
                name="SpouseName"
                value={TraineeformData.SpouseName}
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
                value={TraineeformData.SpouseContact}
                className={
                  isPhoneValid.SpouseContact ? "valid-label" : "invalid-label"
                }
                onChange={handleInputChange}
              />
            </div>


          </>
        )}

        {["Married", "Widowed", "Divorced"].includes(TraineeformData.MaritalStatus) && (
          <>
            
          </>
        )}


        {["Single", "Divorced"].includes(TraineeformData.MaritalStatus) && (
          <>

            <div className="RegisForm_1">
              <label>
                Father Name <span>:</span>
              </label>
              <input
                type="text"
                name="FatherName"
                value={TraineeformData.FatherName}
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
                value={TraineeformData.FatherContact}
                className={
                  isPhoneValid.FatherContact ? "valid-label" : "invalid-label"
                }
                onChange={handleInputChange}
              />
            </div>

            

            {TraineeformData.MaritalStatus === "Divorced" && (
              <>
                {/* <div className="RegisForm_1">
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
                        checked={TraineeformData.Child === "Yes"}
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
                        checked={TraineeformData.Child === "No"}
                        onChange={handleInputChange}
                      />
                      No
                    </label>
                  </div>
                </div> */}

                {/* {TraineeformData.Child === "Yes" && (
                  <div className="RegisForm_1">
                    <label>
                      Total No Child <span>:</span>
                    </label>
                    <input
                      type="text"
                      name="TotalNoChild"
                      value={TraineeformData.TotalNoChild}
                      onChange={handleInputChange}
                    />
                  </div>
                )} */}
              </>
            )}
          </>
        )}


        <div className="RegisForm_1">
          <label>
            Emergency ContactName <span>:</span>
          </label>
          <input
            type="text"
            name="EmergencyContactName"
            value={TraineeformData.EmergencyContactName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Emergency ContactNo <span>:</span>
          </label>
          <input
            type="number"
            name="EmergencyContactNo"
            value={TraineeformData.EmergencyContactNo}
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
            Institutional Name<span>:</span>
          </label>
          <input
            type="text"
            name="InstitutionalName"
            value={TraineeformData.InstitutionalName}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* <div className="RegisForm_1">
          <label>
            Address<span>:</span>
          </label>
          <input
            type="text"
            name="Address"
            value={TraineeformData.Address}
            onChange={handleInputChange}
            required
          />
        </div> */}

        <div className="RegisForm_1">
          <label>
            Incharge Person<span>:</span>
          </label>
          <input
            type="text"
            name="InchargePerson"
            value={TraineeformData.InchargePerson}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Trainee Start Date <span>:</span>
          </label>
          <input
            type="date"
            name="TraineeStartdate"
            value={TraineeformData.TraineeStartdate}
            onChange={handleInputChange}
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Induction GivenBy <span>:</span>
          </label>
          <input
            type="text"
            name="InductionGivenby"
            value={TraineeformData.InductionGivenby}
            onChange={handleInputChange}
          />
        </div>
   
        <div className="RegisForm_1">
          <label>
            Trainee End Date <span>:</span>
          </label>
          <input
            type="date"
            name="TraineeEnddate"
            value={TraineeformData.TraineeEnddate}
            onChange={handleInputChange}
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Certified By <span>:</span>
          </label>
          <input
            type="text"
            name="Certifiedby"
            value={TraineeformData.Certifiedby}
            onChange={handleInputChange}
          />
        </div>


        {/* <div className="RegisForm_1">
          <label>
            Emergency ContactName 2<span>:</span>
          </label>
          <input
            type="text"
            name="EmergencyContactName2"
            value={TraineeformData.EmergencyContactName2}
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
            value={TraineeformData.EmergencyContactNo2}
            className={
              isPhoneValid.EmergencyContactNo2 ? "valid-label" : "invalid-label"
            }
            onChange={handleInputChange}
            required
          />
        </div> */}

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
                checked={TraineeformData.Residence === "Day Scholar"}
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
                checked={TraineeformData.Residence === "Hostel"}
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
                  {TraineeformData.Photo ? (
                    <div>
                      <img
                        src={TraineeformData.Photo}
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
                  Selectedfileview(TraineeformData.Photo);
                }}
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>

        {/* <div className="RegisForm_1">
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
                onClick={() => Selectedfileview(TraineeformData.Signature)}
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div> */}

        {/* <div className="RegisForm_1">
          <label>
            {" "}
            RequirementSource <span>:</span>{" "}
          </label>

          <select
            name="RequirementSource"
            required
            value={TraineeformData.RequirementSource}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="Advertisement">Advertisement</option>
            <option value="SocialMedia">Social Media</option>
            <option value="Refferal">Refferal</option>
            <option value="Walkin">Walk in</option>
          </select>
        </div> */}
        {/* {TraineeformData.RequirementSource &&
          TraineeformData.RequirementSource !== "Select" && (
            <div className="RegisForm_1">
              <label>
                Source <span>:</span>
              </label>
              <input
                type="text"
                name="Source"
                value={TraineeformData.Source}
                onChange={handleInputChange}
                placeholder={`details for ${TraineeformData.RequirementSource}`}
              />
            </div>
          )} */}

        {/* <div className="RegisForm_1">
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
                checked={TraineeformData.ActiveStatus === "Yes"}
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
                checked={TraineeformData.ActiveStatus === "No"}
                onChange={handleInputChange}
              />
              No
            </label>
          </div>
        </div> */}

        <div className="RegisForm_1">
          <label>
            Trainee Certificate<span>:</span>
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              name={"TraineeCertificate"}
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
                  Selectedfileview(TraineeformData.TraineeCertificate)
                }
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="RegisForm_1">
          <label>
            Status <span>:</span>
          </label>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "150px",
            }}
          >
            <label style={{ width: "auto" }} htmlFor="status_active">
              <input
                id="status_active"
                type="radio"
                name="Status"
                value="Active"
                style={{ width: "15px" }}
                checked={TraineeformData.Status === "Active"}
                onChange={handleInputChange}
              />
              Active
            </label>
            <label style={{ width: "auto" }} htmlFor="status_inactive">
              <input
                id="status_inactive"
                type="radio"
                name="Status"
                value="Inactive"
                style={{ width: "15px" }}
                checked={TraineeformData.Status === "Inactive"}
                onChange={handleInputChange}
              />
              Inactive
            </label>
          </div>
        </div>

      </div>
      {/* personal details End =========== */}
      <br />
        
      <div className="DivCenter_container">Communication Address</div>
      <br></br>
      <div className="RegisFormcon">

        <div className="RegisForm_1">
          <label>
            Pincode <span>:</span>
          </label>
          <input
            type="number"
            name="Pincode"
            pattern="\d{6,7}"  // Direct pattern for 6 to 7 digits
            autoComplete="off"
            onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
            value={TraineeformData.Pincode}
            onChange={handleInputChange}
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Door No<span>:</span>
          </label>
          <input
            type="text"
            name="DoorNo"
            value={TraineeformData.DoorNo}
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
            value={TraineeformData.Street}
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
            value={TraineeformData.Area}
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
            value={TraineeformData.City}
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
            value={TraineeformData.District}
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
            value={TraineeformData.State}
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
            value={TraineeformData.Country}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* <div className="RegisForm_1">
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
                checked={TraineeformData.PermanentAddressSame === "YES"}
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
                checked={TraineeformData.PermanentAddressSame === "NO"}
                onChange={handleInputChange}
              />
              No
            </label>
          </div>
        </div> */}



      </div>

      {/* Document checklist ========== */}

      {/* <div className="DivCenter_container">Document Checklist</div> */}
      <br />
      {/* <div className="RegisFormcon" style={{justifyContent:'flex-start',width:'100%'}}>
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
                onClick={() => Selectedfileview(TraineeformData.Resume)}
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
                onClick={() => Selectedfileview(TraineeformData.PanCard)}
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="RegisForm_1" >
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
                onClick={() => Selectedfileview(TraineeformData.AadharCard)}
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
                onClick={() => Selectedfileview(TraineeformData.BankPassbook)}
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="RegisForm_1">
          <label>
            Trainee Certificate<span>:</span>
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
                  Selectedfileview(TraineeformData.ExperienceCertificate)
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
                  Selectedfileview(TraineeformData.MedicalFitness)
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
                onClick={() => Selectedfileview(TraineeformData.Offerletter)}
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>
      </div> */}

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
                {/* <div className="Main_container_Btn">
                  <button onClick={handleDepartmentSave}>Save</button>
                </div> */}
              </div>
            </div>
            <ReactGrid columns={SelectDataColumn} RowData={Departments} />
          </div>
        </div>
      )}
      <ModelContainer />

      <div className="Main_container_Btn">
        <button onClick={handleSubmit}>
          {TraineeformData?.Trainee_Id ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default TraineeRegistration;

