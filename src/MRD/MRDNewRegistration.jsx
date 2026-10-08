import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  addMonths,
  addYears,
  format,
  startOfYear,
  subMonths,
  subDays,
  subYears,
  isBefore,
} from "date-fns";
import axios from "axios";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useDispatch, useSelector } from "react-redux";
import { IoBedOutline } from "react-icons/io5";
// import profile from "../../Assets/profileimg.jpeg";
import "../App.css";
import { handleKeyDownText } from "../OtherComponent/OtherFunctions";
import { handleKeyDownPhoneNo } from "../OtherComponent/OtherFunctions";
import { handleKeyDownTextRegistration } from "../OtherComponent/OtherFunctions";

// import RoomDetialsSelect from "./RoomDetialsSelect";
import Button from "@mui/material/Button";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import DeleteIcon from "@mui/icons-material/Delete";
import Webcam from "react-webcam";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import ModelContainer from "../OtherComponent/ModelContainer/ModelContainer";
import VisibilityIcon from "@mui/icons-material/Visibility";


import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { v4 as uuidv4 } from 'uuid';
// import SmartCard from "./SmartCard";




const MRDNewRegistration = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const Registeredit = useSelector((state) => state.Frontoffice?.Registeredit);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const navigate = useNavigate();
  console.log("Registeredit", Registeredit);

  const dispatchvalue = useDispatch();
  const gridRef = useRef(null);
  const [TitleNameData, setTitleNameData] = useState([]);
  const [BloodGroupData, setBloodGroupData] = useState([]);
  const [DonationData, setDonationData] = useState([]);
  const [InsuranceData, setInsuranceData] = useState([]);
  const [ClientData, setClientData] = useState([]);
  const [ReferralDoctorData, setReferralDoctorData] = useState([]);
  const [EmployeeData, setEmployeeData] = useState([]);
  const [DoctorIdData, setDoctorIdData] = useState([]);
  const [CorporateData, setCorporateData] = useState([]);

  const [ReligionData, setReligionData] = useState([]);
  const [FlaggData, setFlaggData] = useState([]);
  const [SpecializationData, setSpecializationData] = useState([]);
  const [errors, setErrors] = useState({});
  const [PatientRegisterDetails, setPatientRegisterDetails] = useState({});
  console.log(PatientRegisterDetails, "PatientRegisterDetails");

  // ---------------------ABHA----------------------
  const [otpVisible, setOtpvisible] = useState(false);
  const [MobileOtpVisible, setMobileOtpVisible] = useState(false);// To toggle OTP input visibility
  const [otp, setOtp] = useState(""); // To store OTP value
  const [Mobile_Otp, setMobile_Otp] = useState(""); // To store OTP value
  const [abhadd, setAbhaadd] = useState(""); // To store OTP value
  const timestamp = new Date().toISOString();
  const [txnId, setTxnId] = useState('');
  const [accesstoken, setAccesstoken] = useState('');
  const [xToken, setXtoken] = useState("");
  const [responseData, setResponseData] = useState(null); // To store the data
  const [error, setError] = useState(null);
  const [ABHA_Number, setABHA_Number] = useState('');
  const [ABHAData, setABHAData] = useState([]);

  const [selectedrow, setselectedrow] = useState(false);
  const [smartCardDetailes, setSmartCardDetailes] = useState({});


  const SmartCardView = (row) => {
    console.log('zzzzzzzzzz', row);

    if (row) {
      setselectedrow(true);
      setSmartCardDetailes({ ...row, PrintCount: 1 });
    }
  };





  const [loading, setLoading] = useState(false);
  const [PatientData, setPatientData] = useState([]);
  const [IsGetData, setIsGetData] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [Patientidsearch,setPatientidsearch] = useState([]);
  const [Patientnamesearch,setPatientnamesearch] = useState([]);
  const [Patientphonenoserach,setPatientphonenoserach] = useState([]);
  const [filteredPatientData, setFilteredPatientData] = useState([]);

  console.log(PatientData, 'PatientData');

  const [patientsearch, setpatientsearch] = useState({
    Search: "",
  });

  const relationships = [
    "Spouse",
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Father-in-law",
    "Mother-in-law",
    "Grandfather",
    "Grandmother",
    "Son",
    "Daughter",
    "Grandson",
    "Granddaughter",
    "Son-in-law",
    "Daughter-in-law",
    "Uncle",
    "Aunt",
    "Nephew",
    "Niece",
    "Cousin",
    "Step-father",
    "Step-mother",
    "Step-son",
    "Step-daughter",
  ];

  const [FilterbyPatientId, setFilterbyPatientId] = useState([]);
  const [FilteredFormdata, setFilteredFormdata] = useState(null);
  const [UhidNo, setUhidNo] = useState(null);
  const [OtpNumber, setOtpNumber] = useState(null);
  const [MobileOtp, setMobileOtp] = useState(null);
  const [Abhaaddress, setAbhaaddress] = useState(null);

  const [FilteredFormdataAddress, setFilteredFormdataAddress] = useState(null);
  const [FilteredFormdataPermanentAddress, setFilteredFormdataPermanentAddress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  console.log(searchQuery, 'searchQuery');
  console.log(FilteredFormdataPermanentAddress, 'FilteredFormdataPermanentAddress');

  const [filePreviews, setFilePreviews] = useState([]);
  const [showPreviews, setShowPreviews] = useState(false); // Control visibility

  const webcamRef1 = useRef(null);
  const [showFile, setShowFile] = useState({ file1: false });
  const [isImageCaptured1, setIsImageCaptured1] = useState(false);

  const [facingMode, setFacingMode] = useState("user");
  const videoConstraints = { facingMode: facingMode };
  const [deviceInfo, setDeviceInfo] = useState({
    device_type: null,
    os_type: null,
  });

  useEffect(() => {
    console.log("Webcam ref:", webcamRef1.current);
  }, []);

  const [RegisterData, setRegisterData] = useState({
    // PatientId: '',

    ABHA: "",
    ExistingPtNo: "",
    Year : "",
    DateOfReg: "",
    LastVisitDate: "",
    Title: "",
    FirstName: "",
    MiddleName: "",
    SurName: "",
    Gender: "",
    MaritalStatus: "",
    SpouseName: "",
    FatherName: "",
    // AliasName: '',
    DOB: "",
    Age: "",

    Email: "",
    BloodGroup: "",
    Occupation: "",
    Religion: "",
    Nationality: "Indian",
    UHIDType: "",
    UHIDNo: "",
    PhoneNo: "",
    EnterOTP: "",
    AbhaAddress: "",
    EnterMobileOtp: "",

    PatientType: "General",
    // PatientCategory: '',

    // InsuranceName: '',
    // InsuranceType: '',
    // ClientName: '',
    // ClientType: '',
    // ClientEmployeeId: '',
    // ClientEmployeeDesignation: '',
    // ClientEmployeeRelation: '',

    // CorporateName: '',
    // CorporateType: '',
    // CorporateEmployeeId: '',
    // CorporateEmployeeDesignation: '',
    // CorporateEmployeeRelation: '',

    // EmployeeId: '',
    // EmployeeRelation: '',
    // DoctorId: '',
    // DoctorRelation: '',
    // DonationType: '',

    // Flagging: 0,
    Pincode: "",
    DoorNo: "",
    Street: "",
    Area: "",
    City: "",
    District: "",
    State: "",
    Country: "India",

    // PERMANENT ADDRESS
    PermanentPincode: "",
    PermanentdoorNo: "",
    PermanentStreet: "",
    PermanentArea: "",
    PermanentCity: "",
    PermanentDistrict: "",
    PermanentState: "",
    PermanentCountry: "India",
    PermanentAddressSameAsAbove: "Yes",


    // PermanentAddress: "",

    Photo: null,
  });

  // Age dropdown state variables
  const [ageYears, setAgeYears] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [ageDays, setAgeDays] = useState("");
  const [ageUnit, setAgeUnit] = useState("Years");

  const [OldDepartment,setOldDepartment] = useState('');


  console.log(RegisterData,'RegisterData')


  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);





  // Trigger load on PermanentCountry change
  useEffect(() => {
    if (RegisterData.PermanentCountry || RegisterData.Country) {
      axios
        .get(`${UrlLink}Frontoffice/get_states_by_country?country=${RegisterData.PermanentCountry}`)
        .then((response) => {
          setStateList(response.data.states || []);
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
          setStateList([]);
        });
    }
  }, [RegisterData.PermanentCountry, RegisterData.Country]);

  // Trigger load on PermanentState change (to get districts)
  // useEffect(() => {
  //   if (RegisterData.PermanentState || RegisterData.State) {
  //     axios
  //       .get(`${UrlLink}Frontoffice/get_districts_by_state?state=${RegisterData.PermanentState}`)
  //       .then((response) => {
  //         setDistrictList(response.data.districts || []);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching districts:", error);
  //         setDistrictList([]);
  //       });
  //   }
  // }, [RegisterData.PermanentState,RegisterData.State]);

  // Trigger load on PermanentDistrict change (to get cities)
  // useEffect(() => {
  //   if (RegisterData.PermanentDistrict || RegisterData.District) {
  //     axios
  //       .get(`${UrlLink}Frontoffice/get_cities_by_district?district=${RegisterData.PermanentDistrict}`)
  //       .then((response) => {
  //         setCityList(response.data.cities || []);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching cities:", error);
  //         setCityList([]);
  //       });
  //   }
  // }, [RegisterData.PermanentDistrict , RegisterData.District]);


  useEffect(() => {
    if (RegisterData.PermanentState || RegisterData.State) {
      axios
        .get(`${UrlLink}Frontoffice/get_cities_by_state?state=${RegisterData.PermanentState || RegisterData.State}`)
        .then((response) => {
          setCityList(response.data.cities || []);
        })
        .catch((error) => {
          console.error("Error fetching cities:", error);
          setCityList([]);
        });
    }
  }, [RegisterData.PermanentState, RegisterData.State]);

  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

  const handleStopEvent = (event) => {
    document.body.style.pointerEvents = "auto";
    event.preventDefault();
    event.stopPropagation();
  };

  const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      document.body.style.pointerEvents = "none";
      element.scrollIntoView({ behavior: "auto", block: "start" });
      window.addEventListener("scroll", handleStopEvent);
      window.addEventListener("click", handleStopEvent);
    }
  };

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const handleRecaptureImage1 = () => {
    setRegisterData((prev) => ({
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

      dispatchvalue({ type: "modelcon", value: tdata });
    } else {
      const tdata = {
        message: "There is no file to view.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
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
        dispatchvalue({ type: "toast", value: tdata });
      } else if (formattedValue.size > maxSize) {
        // Dispatch a warning toast or handle file size validation
        const tdata = {
          message: "File size exceeds the limit of 5MB.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setRegisterData((prev) => ({
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
      dispatchvalue({ type: "toast", value: tdata });
    }
  };






  // const handleinpchangeDocumentsForm = (e) => {
  //   const { name, files } = e.target;

  //   if (files && files.length > 0) {
  //     console.log("Selected Files:", files);

  //     const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  //     const maxSize = 5 * 1024 * 1024; // 5MB limit

  //     let selectedFiles = [];

  //     Array.from(files).forEach((file) => {
  //       if (!allowedTypes.includes(file.type)) {
  //         dispatchvalue({
  //           type: "toast",
  //           value: { message: "Invalid file type. Upload PDF, JPEG, or PNG.", type: "warn" },
  //         });
  //       } else if (file.size > maxSize) {
  //         dispatchvalue({
  //           type: "toast",
  //           value: { message: "File size exceeds 5MB.", type: "warn" },
  //         });
  //       } else {
  //         const reader = new FileReader();
  //         reader.onload = () => {
  //           selectedFiles.push(reader.result);

  //           if (selectedFiles.length === files.length) {
  //             setRegisterData((prev) => ({
  //               ...prev,
  //               [name]: [...(prev[name] || []), ...selectedFiles], // Store multiple files
  //             }));
  //           }
  //         };
  //         reader.readAsDataURL(file);
  //       }
  //     });
  //   } else {
  //     dispatchvalue({
  //       type: "toast",
  //       value: { message: "No file selected. Please choose a file to upload.", type: "warn" },
  //     });
  //   }
  // };





  // const Selectedfileview = (filevalArray) => {
  //   console.log("Files received for preview:", filevalArray);

  //   if (!filevalArray || filevalArray.length === 0) {
  //     console.warn("No files to view");
  //     dispatchvalue({
  //       type: "toast",
  //       value: { message: "There are no files to view.", type: "warn" },
  //     });
  //     return;
  //   }

  //   const filePreviews = filevalArray.map((fileval, index) => {
  //     if (!fileval) return null;

  //     const fileType = fileval.split(",")[0];
  //     let type = "";

  //     if (fileType.includes("image/jpeg") || fileType.includes("image/jpg")) {
  //       type = "image/jpeg";
  //     } else if (fileType.includes("image/png")) {
  //       type = "image/png";
  //     } else if (fileType.includes("application/pdf")) {
  //       type = "application/pdf";
  //     } else {
  //       console.warn(`Unknown file format for file ${index}:`, fileval);
  //     }

  //     return { Isopen: true, content: fileval, type };
  //   }).filter(Boolean); // Remove null values

  //   console.log("Files to display:", filePreviews);
  //   dispatchvalue({ type: "modelcon", value: filePreviews });
  // };





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
          dispatchvalue({ type: "toast", value: tdata });
        } else if (formattedValue.size > maxSize) {
          const tdata = {
            message: "File size exceeds the limit of 5MB.",
            type: "warn",
          };
          dispatchvalue({ type: "toast", value: tdata });
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            setRegisterData((prev) => ({
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
        dispatchvalue({ type: "toast", value: tdata });
      }
    } else {
      console.error(
        "Webcam reference is null or getScreenshot is not available."
      );
    }
  };



  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const previews = files.map((file) => ({
      content: URL.createObjectURL(file),
      type: file.type,
    }));
    setFilePreviews(previews);


  };


  const handleViewFiles = () => {
    let combinedFiles = [];

    // Include captured image if available
    if (RegisterData.Photo) {
      combinedFiles.push({
        Isopen: true,
        content: RegisterData.Photo,
        type: "image/jpeg",
      });
    }

    // Include selected files
    if (RegisterData.Photo && Array.isArray(RegisterData.Photo)) {
      const selectedFiles = RegisterData.Photo.map((fileval) => ({
        Isopen: true,
        content: fileval,
        type: fileval.startsWith("data:image/") ? "image/jpeg" : "application/pdf",
      }));

      combinedFiles = [...combinedFiles, ...selectedFiles];
    }

    setFilePreviews(combinedFiles);
    setShowPreviews(true); // Show the preview section
  };


  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
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
      .get(`${UrlLink}Masters/Relegion_Master_link`)
      .then((res) => setReligionData(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${UrlLink}Masters/Flagg_color_Detials_link`)
      .then((res) => setFlaggData(res.data))
      .catch((err) => console.log(err));

    axios
      .get(`${UrlLink}Masters/Speciality_Detials_link`)
      .then((res) => setSpecializationData(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);


  useEffect(() => {
    axios
      .get(`${UrlLink}MCI/MCI_Register_Patients_Details`, {
        params: { status: 'Saved' }, // Pass 'status' directly
      })
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          const PIdList = [...new Set(data.map((item) => item.PatientId))];
          const PnameList = [...new Set(data.map((item) => item.PatientName))];
          const PphoneList = [...new Set(data.map((item) => item.PhoneNo))];

          setPatientidsearch(PIdList);
          setPatientphonenoserach(PphoneList);
          setPatientnamesearch(PnameList)

          setPatientData(data);
        } else {
          setPatientData([]);
          setPatientidsearch([]);
          setPatientphonenoserach([]);
          setPatientnamesearch([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching patient data:", err);
          setPatientData([]);
          setPatientidsearch([]);
          setPatientphonenoserach([]);
          setPatientnamesearch([]);
      });
  }, [UrlLink, IsGetData]);

   const [SearchQueryfilter, setSearchQueryfilter] = useState({
      searchpname: '',
      searchmobile:  '',
      searchpid:  '', 
    });

   const handleSearchChangefilter = (e) => {
    const { name, value } = e.target;
    setSearchQueryfilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const { searchpname, searchmobile, searchpid } = SearchQueryfilter;

    const filteredData = PatientData.filter((item) => {
      const matchesPid = searchpid
        ? item.PatientId.toLowerCase().includes(searchpid.toLowerCase())
        : true;
      const matchesPname = searchpname
        ? item.PatientName.toLowerCase().includes(searchpname.toLowerCase())
        : true;
      const matchesMobile = searchmobile
    ? item.PhoneNo.toString().includes(searchmobile)
    : true;

      return matchesPid && matchesPname && matchesMobile;
    });

    setFilteredPatientData(filteredData);
  }, [SearchQueryfilter, PatientData]);



  const PatientRegisterColumns = [
    { key: "id", name: "ID" },
    { key: "PatientId", name: "Patient Id" },
    { key: "FullName", name: "Patient Name" },
    { key: "PhoneNo", name: "PhoneNo" },
    { key: "Gender", name: "Gender" },
    { key: "created_by", name:"created by"},
    // { key: "Email", name: "Email" },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => {
        console.log(params.row, 'params.row');

        return (
          <>

            <Button
              className="cell_btn"
              onClick={() => {
                if (UserData?.Create) {
                  handleNavigateOP(params.row);
                } else {
                  handleRestrictedAction();
                }
              }}
            >
              OP
            </Button>

            {/* <Button
              className="cell_btn"
              onClick={() => {
                if (UserData?.Create) {
                  handleNavigateIP(params.row);
                } else {
                  handleRestrictedAction();
                }
              }}
            >
              IP
            </Button>

            <Button
              className="cell_btn"
              onClick={() => {
                if (UserData?.Create) {
                  handleNavigateRADIOLOGY(params.row);
                } else {
                  handleRestrictedAction();
                }
              }}
            >
              RADIOLOGY
            </Button>

            <Button
              className="cell_btn"
              onClick={() => {
                if (UserData?.Create) {
                  handleNavigateSERVICES(params.row);
                } else {
                  handleRestrictedAction();
                }
              }}
            >
              SERVICES
            </Button>

            <Button
              className="cell_btn"
              onClick={() => {
                if (UserData?.Create) {
                  handleNavigateCasuality(params.row);
                } else {
                  handleRestrictedAction();
                }
              }}
            >
              CASUALITY
            </Button> */}

            {/* <Button
              className="cell_btn"
              onClick={() => SmartCardView(params.row)}
            >
              SmartCard
            </Button> */}


          </>
        );
      },
    },

  ];



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          specializationResponse,
          referralDoctorResponse,
          EmployeeResponse,
          DoctorResponse,
          FlaggData,
          ReligionData,
          AllDoctorData,
          Insurancedata,
          ClientData,
          CorporateData,
          DonationData,
          BloodGroupData,
          TitleNameData,
        ] = await Promise.all([
          axios.get(`${UrlLink}Masters/Speciality_Detials_link`),
          axios.get(`${UrlLink}Masters/get_referral_doctor_Name_Detials`),
          axios.get(`${UrlLink}Frontoffice/get_Employee_by_PatientCategory`),
          axios.get(`${UrlLink}Frontoffice/get_DoctorId_by_PatientCategory`),
          axios.get(`${UrlLink}Masters/Flagg_color_Detials_link`),
          axios.get(`${UrlLink}Masters/Relegion_Master_link`),
          axios.get(`${UrlLink}Masters/get_All_doctor_Name_Detials`),
          axios.get(`${UrlLink}Masters/get_insurance_data_registration`),
          axios.get(`${UrlLink}Masters/get_client_data_registration`),
          axios.get(`${UrlLink}Masters/get_corporate_data_registration`),
          axios.get(`${UrlLink}Masters/get_donation_data_registration`),
          axios.get(`${UrlLink}Masters/BloodGroup_Master_link`),
          axios.get(`${UrlLink}Masters/Title_Master_link`),
        ]);

        setSpecializationData(
          Array.isArray(specializationResponse.data)
            ? specializationResponse.data
            : []
        );
        // setReferralDoctorData(
        //   Array.isArray(referralDoctorResponse.data)
        //     ? referralDoctorResponse.data
        //     : []
        // )
        setEmployeeData(
          Array.isArray(EmployeeResponse.data) ? EmployeeResponse.data : []
        );
        setDoctorIdData(
          Array.isArray(DoctorResponse.data) ? DoctorResponse.data : []
        );
        setFlaggData(Array.isArray(FlaggData.data) ? FlaggData.data : []);
        setReligionData(
          Array.isArray(ReligionData.data) ? ReligionData.data : []
        );
        // setAllDoctorData(
        //   Array.isArray(AllDoctorData.data) ? AllDoctorData.data : []
        // )
        setInsuranceData(
          Array.isArray(Insurancedata.data) ? Insurancedata.data : []
        );
        setClientData(Array.isArray(ClientData.data) ? ClientData.data : []);
        setCorporateData(
          Array.isArray(CorporateData.data) ? CorporateData.data : []
        );
        setDonationData(
          Array.isArray(DonationData.data) ? DonationData.data : []
        );
        setBloodGroupData(
          Array.isArray(BloodGroupData.data) ? BloodGroupData.data : []
        );
        setTitleNameData(
          Array.isArray(TitleNameData.data) ? TitleNameData.data : []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [UrlLink]);

  useEffect(() => {
    if (Object.keys(Registeredit).length === 0) {
      const postdata = {
        PatientId: RegisterData.PatientId,
        PhoneNo: RegisterData.PhoneNo,
        FirstName: RegisterData.FirstName,
      };
      console.log("PosttttDDDD", postdata);

      axios
        .get(`${UrlLink}Frontoffice/Filter_Patient_by_Multiple_Criteria`, {
          params: postdata,
        })
        .then((res) => {
          const data = res.data;
          setFilterbyPatientId(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (Object.keys(Registeredit).length > 0 && Registeredit.appconversion) {
      console.log("1---------j");

      let age = Registeredit.Age;
      console.log(age, 'age--------------1');

      // let formattedDOB = "";

      if (age && !isNaN(age) && age > 0 && age <= 120) {
        const currentDate = new Date();
        const targetYear = subYears(currentDate, age);
        const dob = startOfYear(targetYear)
        const formattedDOB = format(dob, "yyyy-MM-dd");
        setRegisterData((prev) => ({
          ...prev,

          DOB: formattedDOB,
        }));
      }

      setRegisterData((prev) => ({
        ...prev,
        ExistingPtNo: Registeredit.ExistingPtNo || "",
        DateOfReg: Registeredit.DateOfReg || "",
        LastVisitDate: Registeredit.LastVisitDate || "",
        Title: Registeredit.TitleId || "",
        FirstName: Registeredit.FirstName || "",
        MiddleName: Registeredit.MiddleName || "",
        SurName: Registeredit.LastName || "",
        Gender: Registeredit.Gender || "",
        PhoneNo: Registeredit.PhoneNumber || "",
        Email: Registeredit.Email || "",
        Age: Registeredit.Age || "",
      }));
    }
  }, [
    UrlLink,
    Registeredit,
    RegisterData.PatientId,
    RegisterData.PhoneNo,
    RegisterData.FirstName,
  ]);

  // useEffect(() => {

  //   if (RegisterData.ExistingPtNo !== "") {
  //     const postdata ={
  //       ExistingPtNo: RegisterData.ExistingPtNo,
  //       DateOfReg: RegisterData.DateOfReg,
  //       LastVisitDate: RegisterData.LastVisitDate
  //     }
  //     axios
  //       .get(`${UrlLink}Frontoffice/Existing_Patient_Details_Get`, {
  //         params: postdata,
  //       })
  //       .then((res) => {
  //         const {OPNo,FirstName,FatherName,DOB,Age,PhoneNo,PermanentArea,PermanentCity,...rest} = res.data.respp;

  //         console.log(FirstName,'FirstName')
  //         console.log(FatherName,'FirstName')
  //         console.log(DOB,'FirstName')
  //         console.log(Age,'FirstName')
  //         console.log(PhoneNo,'FirstName')
  //         console.log(PermanentArea,'FirstName',PermanentCity)




  //         setRegisterData((prev)=>({
  //           ...prev,
  //           FirstName: FirstName,
  //           DOB : DOB,
  //           Age : Age,
  //           PhoneNo :PhoneNo ,
  //           PermanentArea : PermanentArea,
  //           PermanentCity : PermanentCity
  
  //         }))
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       })
  //   }
  // }, [UrlLink, RegisterData.ExistingPtNo, RegisterData.DateOfReg])



  const [ExistPatientList,setExistPatientList] = useState([]);
  const cancelTokenRef = useRef(null);
  console.log(ExistPatientList,'ExistPatientList')

   useEffect(() => {
  if (RegisterData.ExistingPtNo !== "") {
    // Cancel previous request if still pending
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel("Operation canceled due to new request.");
    }

    const source = axios.CancelToken.source();
    cancelTokenRef.current = source;

    const postdata = {
      ExistingPtNo: RegisterData.ExistingPtNo,
      DateOfReg: RegisterData.DateOfReg,
      LastVisitDate: RegisterData.LastVisitDate,
      Year : RegisterData.Year
    };

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${UrlLink}Frontoffice/Existing_Patient_Details_Get_All`,
          {
            params: postdata,
            cancelToken: source.token,
          }
        );
        const ress = res.data;
        if (Array.isArray(ress)) {
          setExistPatientList(ress);
        } else {
          setExistPatientList([]);
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          console.error(err);
        }
      }
    };

    // Add debounce (e.g., 400ms)
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 400);

    // Cleanup
    return () => clearTimeout(delayDebounce);
  }
}, [RegisterData.ExistingPtNo]);

useEffect(() => {
  if (!RegisterData.ExistingPtNo || !RegisterData.Year) {
    setRegisterData((prev) => ({
      ...prev,
      LastVisitDate: "",
    }));
    return;
  }

  if (cancelTokenRef.current) {
    cancelTokenRef.current.cancel("Operation canceled due to new request.");
  }

  const source = axios.CancelToken.source();
  cancelTokenRef.current = source;

  const postdata = {
    ExistingPtNo: RegisterData.ExistingPtNo,
    Year: RegisterData.Year,
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${UrlLink}Frontoffice/Get_Lastvisitdate`, {
        params: postdata,
        cancelToken: source.token,
      });
      const ress = res.data;

      let formattedVisitDate = "";
      if (ress?.lastvisitdate && typeof ress.lastvisitdate === "string") {
        formattedVisitDate = ress.lastvisitdate.split(" ")[0];
      }

      setRegisterData((prev) => ({
        ...prev,
        LastVisitDate: formattedVisitDate,
      }));

      setOldDepartment(ress.OldDepartment)

    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request canceled:", err.message);
      } else {
        console.error("Error fetching last visit date:", err);
        setRegisterData((prev) => ({
          ...prev,
          LastVisitDate: "",
        }));
      }
    }
  };

  const delayDebounce = setTimeout(() => {
    fetchData();
  }, 400);

  return () => {
    clearTimeout(delayDebounce);
    source.cancel("Operation canceled due to component unmount.");
  };
}, [RegisterData.ExistingPtNo, RegisterData.Year]);


  const HandleOnchangeunique = (e) => {
  const { name, value } = e.target;

  console.log(value, 'value');

  if (value.includes(" | ")) {
    const [firstName, phoneNo] = value.split(" | ").map((v) => v.trim());

    console.log(firstName,phoneNo,'phoneNo')

    const matchedOne = ExistPatientList.find(
      (item) =>
        item.FirstName.trim() === firstName && item.PhoneNo.trim() === phoneNo
    );

    console.log(matchedOne,'matchedOne')

          if (matchedOne) {
        // Convert OPDate string to YYYY-MM-DD format
        let formattedDate = "";
        let formattedDOB = "";
        let Age = matchedOne.Age ? parseInt(matchedOne.Age) : ""
        console.log(Age,'Age')
        if (matchedOne.OPDate) {
          const [day, month, yearTime] = matchedOne.OPDate.split("-");
          const [year] = yearTime.split(" ");
          formattedDate = `${year}-${month}-${day}`;
        }
        if (matchedOne.DOB) {
          const [day, month, yearTime] = matchedOne.DOB.split("-");
          const [year] = yearTime.split(" ");
          formattedDOB = `${year}-${month}-${day}`;
        }
        

        setRegisterData((prev) => ({
          ...prev,
          FirstName: matchedOne.FirstName,
          PhoneNo: matchedOne.PhoneNo,
          Age: String(Age),
          DOB: formattedDOB,
          DateOfReg: formattedDate,
          PermanentArea : matchedOne.PermanentArea,
          PermanentCity : matchedOne.PermanentCity,
          Year : matchedOne.YearNo

        }));
      }
  } else {
    // Fallback for manual input
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};





  

  

  useEffect(() => {
    let fdata = Object.keys(RegisterData).filter(
      (p) =>
        ![
          "PhoneNo",
          "EnterOTP",
          "EnterMobileOtp",
          "AbhaAddress",


          "DoorNo",
          "Street",
          "Area",
          "City",
          "District",
          "State",
          "Country",
          "Pincode",
          "PatientProfile",
          "SpouseName",
          "FatherName",
          "InsuranceName",
          "InsuranceType",
          "ClientName",
          "ClientType",
          "CorporateName",
          "CorporateType",
          // 'VisitType',
          // 'Specialization',
          // 'DoctorName',
          "EmployeeId",
          "EmployeeDesignation",
          "ClientEmployeeId",
          "ClientEmployeeDesignation",
          "ClientEmployeeRelation",
          "CorporateEmployeeId",
          "CorporateEmployeeDesignation",
          "CorporateEmployeeRelation",
          "EmployeeRelation",
          "DoctorId",
          "DoctorRelation",
          "DonationType",
          "UHIDType",
          "UHIDNo",
          "PermanentAddressSameAsAbove",
          "PermanentAddress",

          "PermanentdoorNo",
          "PermanentStreet",
          "PermanentArea",
          "PermanentCity",
          "PermanentDistrict",
          "PermanentState",
          "PermanentCountry",
          "PermanentPincode",

          // 'ReferralSource',
          // 'ReferredBy',
          // 'RouteNo',
          // 'RouteName',
          // 'TehsilName',
          // 'VillageName',
          // 'AdmissionPurpose',
          // 'DrInchargeAtTimeOfAdmission',
          // 'NextToKinName',
          // 'InsuranceType',
          // 'Relation',
          // 'RelativePhoneNo',
          // 'PersonLiableForBillPayment',
          // 'FamilyHead',
          // 'FamilyHeadName',
          // 'IpKitGiven',
          // 'Building',
          // 'Block',
          // 'Floor',
          // 'WardType',
          // 'RoomType',
          // 'RoomNo',
          // 'BedNo',
          // 'RoomId',
          // 'TokenNo'
        ].includes(p)
    );

    // if (RegisterData.Title === 'Mrs' && RegisterData.Gender === 'Female') {
    //   const categoryIndex = fdata.indexOf('Gender')
    //   fdata.splice(categoryIndex + 1, 0, 'AliasName')
    // }

    if (
      RegisterData.MaritalStatus === "Married" ||
      RegisterData.MaritalStatus === "Widowed"
    ) {
      const categoryIndex = fdata.indexOf("MaritalStatus");
      fdata.splice(categoryIndex + 1, 0, "SpouseName");
    }

    if (
      RegisterData.MaritalStatus === "Single" ||
      RegisterData.MaritalStatus === "Divorced"
    ) {
      const categoryIndex = fdata.indexOf("MaritalStatus");
      fdata.splice(categoryIndex + 1, 0, "FatherName");
    }
    // if (RegisterData.PatientCategory === 'Insurance') {
    //   const categoryIndex = fdata.indexOf('PatientCategory')
    //   fdata.splice(categoryIndex + 1, 0, 'InsuranceName', 'InsuranceType')
    // }
    // if (RegisterData.PatientCategory === 'Client') {
    //   const categoryIndex = fdata.indexOf('PatientCategory')
    //   fdata.splice(categoryIndex + 1, 0, 'ClientName', 'ClientType')
    // }
    // if (RegisterData.PatientCategory === 'Corporate') {
    //   const categoryIndex = fdata.indexOf('PatientCategory')
    //   fdata.splice(categoryIndex + 1, 0, 'CorporateName', 'CorporateType')
    // }
    // if (
    //   RegisterData.ClientType === 'Self' &&
    //   RegisterData.PatientCategory === 'Client'
    // ) {
    //   const categoryIndex = fdata.indexOf('ClientType')
    //   fdata.splice(
    //     categoryIndex + 1,
    //     0,
    //     'ClientEmployeeId',
    //     'ClientEmployeeDesignation'
    //   )
    // }
    // if (
    //   RegisterData.CorporateType === 'Self' &&
    //   RegisterData.PatientCategory === 'Corporate'
    // ) {
    //   const categoryIndex = fdata.indexOf('CorporateType')
    //   fdata.splice(
    //     categoryIndex + 1,
    //     0,
    //     'CorporateEmployeeId',
    //     'CorporateEmployeeDesignation'
    //   )
    // }
    // if (
    //   RegisterData.ClientType === 'Relative' &&
    //   RegisterData.PatientCategory === 'Client'
    // ) {
    //   const categoryIndex = fdata.indexOf('ClientType')
    //   fdata.splice(
    //     categoryIndex + 1,
    //     0,
    //     'ClientEmployeeId',
    //     'ClientEmployeeDesignation',
    //     'ClientEmployeeRelation'
    //   )
    // }
    // if (
    //   RegisterData.CorporateType === 'Relative' &&
    //   RegisterData.PatientCategory === 'Corporate'
    // ) {
    //   const categoryIndex = fdata.indexOf('CorporateType')
    //   fdata.splice(
    //     categoryIndex + 1,
    //     0,
    //     'CorporateEmployeeId',
    //     'CorporateEmployeeDesignation',
    //     'CorporateEmployeeRelation'
    //   )
    // }
    // if (RegisterData.PatientCategory === 'Employee') {
    //   const categoryIndex = fdata.indexOf('PatientCategory')
    //   fdata.splice(categoryIndex + 1, 0, 'EmployeeId')
    // }
    // if (RegisterData.PatientCategory === 'EmployeeRelation') {
    //   const categoryIndex = fdata.indexOf('PatientCategory')
    //   fdata.splice(categoryIndex + 1, 0, 'EmployeeId', 'EmployeeRelation')
    // }
    // if (RegisterData.PatientCategory === 'Doctor') {
    //   const categoryIndex = fdata.indexOf('PatientCategory')
    //   fdata.splice(categoryIndex + 1, 0, 'DoctorId')
    // }
    // if (RegisterData.PatientCategory === 'DoctorRelation') {
    //   const categoryIndex = fdata.indexOf('PatientCategory')
    //   fdata.splice(categoryIndex + 1, 0, 'DoctorId', 'DoctorRelation')
    // }
    // if (RegisterData.PatientCategory === 'Donation') {
    //   const categoryIndex = fdata.indexOf('PatientCategory')
    //   fdata.splice(categoryIndex + 1, 0, 'DonationType')
    // }

    setFilteredFormdata(fdata);
    let Uhid = Object.keys(RegisterData).filter((p) => [
      "UHIDType",
      "UHIDNo",
      "PhoneNo",


    ].includes(p)
    );
    setUhidNo(Uhid)

    let EnetrOtp = Object.keys(RegisterData).filter((p) => [
      "EnterOTP"
    ].includes(p)
    );
    setOtpNumber(EnetrOtp)

    let AbhaNo = Object.keys(RegisterData).filter((p) => [
      "AbhaAddress"
    ].includes(p)
    );
    setAbhaaddress(AbhaNo)

    let MobileOtp = Object.keys(RegisterData).filter((p) => [
      "EnterMobileOtp"
    ].includes(p)
    );
    setMobileOtp(MobileOtp)

    let Addressdata = Object.keys(RegisterData).filter((p) =>
      [
        "Pincode",
        "DoorNo",
        "Street",
        "Area",
        "City",
        "District",
        "State",
        "Country",

        // "PermanentAddress",

        // "PermanentdoorNo",
        // "PermanentStreet",
        // "PermanentArea",
        // "PermanentCity",
        // "PermanentDistrict",
        // "PermanentState",
        // "PermanentCountry",
        // "PermanentPincode",

      ].includes(p)
    );
    setFilteredFormdataAddress(Addressdata);

    let PermanentAddressdata = Object.keys(RegisterData).filter((p) =>
      [

        "PermanentdoorNo",
        "PermanentStreet",
        "PermanentArea",
        "PermanentCity",
        "PermanentDistrict",
        "PermanentState",
        "PermanentCountry",
        "PermanentPincode",
        "PermanentAddressSameAsAbove",

      ].includes(p)
    );
    setFilteredFormdataPermanentAddress(PermanentAddressdata);

    //   let routedata = Object.keys(RegisterData).filter(p =>
    //     [
    //       'ReferralSource',
    //       'ReferredBy',
    //       'RouteNo',
    //       'RouteName',
    //       'TehsilName',
    //       'VillageName'
    //     ].includes(p)
    //   )
    //   setFilteredFormdataRoute(routedata)

    //   let roomdata = Object.keys(RegisterData).filter(p =>
    //     [
    //       'Building',
    //       'Block',
    //       'Floor',
    //       'WardType',
    //       'RoomType',
    //       'RoomNo',
    //       'BedNo'
    //     ].includes(p)
    //   )
    //   setFilteredFormdataIpRoomDetials(roomdata)

    //   let Ipdetialdata = Object.keys(RegisterData).filter(p =>
    //     [
    //       'AdmissionPurpose',
    //       'DrInchargeAtTimeOfAdmission',
    //       'NextToKinName',
    //       'Relation',
    //       'RelativePhoneNo',
    //       'PersonLiableForBillPayment',
    //       'FamilyHead',
    //       'IpKitGiven'
    //     ].includes(p)
    //   )

    //   if (RegisterData.FamilyHead === 'No') {
    //     const categoryIndex = Ipdetialdata.indexOf('FamilyHead')
    //     Ipdetialdata.splice(categoryIndex + 1, 0, 'FamilyHeadName')
    //   }
    //   setFilteredFormdataIpDetials(Ipdetialdata)
  }, [
    RegisterData,
    //   RegisterData.FamilyHead,
    RegisterData.Title,
    RegisterData.Gender,
    RegisterData.MaritalStatus,
    RegisterData.Specialization,
    SpecializationData,
  ]);

  const HandleSearchchange = (e) => {
    const { name, value } = e.target;
    setpatientsearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const HandleOnchange1 = async (e) => {
    const { name, value, pattern } = e.target;
    console.log("name", name);
    console.log("value", value);
    const formattedValue = [
      "FirstName",
      "MiddleName",
      "SurName",
      "AliasName",
      "Occupation",
      "NextToKinName",
      "FamilyHeadName",
      "FatherName",
      "SpouseName",
      // "Street",
      // "Area",
      // "City",
      // "District",
      // "State",
      // "Country",

      // "PermanentAddressSameAsAbove",
      // "PermanentStreet",
      // "PermanentArea",
      // "PermanentCity",
      // "PermanentDistrict",
      // "PermanentState",
      // "PermanentCountry",
    ].includes(name)
      ? `${value.charAt(0).toUpperCase()}${value.slice(1)}`
      : value;

    // Check length for specific fields
    if (
      [
        "InsuranceName",
        "ClientName",
        "FirstName",
        "MiddleName",
        "AliasName",
        "SurName",
        "Occupation",
        "NextToKinName",
        "FamilyHeadName",
        "Street",
        "Area",
        "City",
        "District",
        "State",
        "Country",
        "UHIDNo",

        // "PermanentStreet",
        // "PermanentArea",
        // "PermanentCity",
        // "PermanentDistrict",
        // "PermanentState",
        // "PermanentCountry",
      ].includes(name) &&
      value.length > 30
    ) {
      const tdata = {
        message: `${name} should not exceed 30 characters.`,
        type: "warn", // Ensure 'warn' is a valid type for your toast system
      };
      dispatchvalue({ type: "toast", value: tdata });
      return; // Exit early to prevent state update
    }

    if (name === "PatientId") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: value,
        ABHA: prev.ABHA,
        ExistingPtNo: "",
        DateOfReg: "",
        LastVisitDate: "",
        Title: "",
        FirstName: "",
        MiddleName: "",
        SurName: "",
        Gender: "",
        MaritalStatus: "Single",
        SpouseName: "",
        FatherName: "",
        AliasName: "",
        DOB: "",
        Age: "",
        PhoneNo: "",
        Email: "",
        BloodGroup: "",
        Occupation: "",
        Religion: "",
        Nationality: "Indian",
        UHIDType: "",
        UHIDNo: "",
        PatientType: "General",
        // PatientCategory: 'General',
        InsuranceName: "",
        InsuranceType: "",
        ClientName: "",
        ClientType: "Self",
        ClientEmployeeId: "",
        ClientEmployeeDesignation: "",
        ClientEmployeeRelation: "",
        CorporateName: "",
        CorporateType: "Self",
        CorporateEmployeeId: "",
        CorporateEmployeeDesignation: "",
        CorporateEmployeeRelation: "",
        EmployeeId: "",
        EmployeeRelation: "",
        DoctorId: "",
        DoctorRelation: "",
        DonationType: "",
        Flagging: 1,
        Pincode: "",
        DoorNo: "",
        Street: "",
        Area: "",
        City: "",
        District: "",
        State: "",
        Country: "",
        Photo: null,

        // PermanentAddressSameAsAbove: "",
        // PermanentdoorNo: "",
        // PermanentStreet: "",
        // PermanentArea: "",
        // PermanentCity: "",
        // PermanentDistrict: "",
        // PermanentState: "",
        // PermanentCountry: "",
        // PermanentPincode: "",
      }));
    } else if (name === "PhoneNo" || name === "RelativePhoneNo") {
      if (formattedValue.includes("|")) {
        const convert = formattedValue.split(" | ");
        console.log(convert);

        if (convert.length <= 10) {
          setRegisterData((prev) => ({
            ...prev,
            [name]: convert[2].trim(),
            PatientId: convert[0].trim(),
            FirstName: convert[1].trim(),
          }));
        }
      } else {
        if (formattedValue.length <= 10) {
          setRegisterData((prev) => ({
            ...prev,
            [name]: formattedValue,
          }));
        }
      }
    } else if (name === "FirstName") {
      if (formattedValue.includes("|")) {
        const convert = formattedValue.split(" | ");

        setRegisterData((prev) => ({
          ...prev,
          [name]: convert[1].trim(),
          PatientId: convert[0].trim(),
          PhoneNo: convert[2].trim(),
        }));
      } else {
        setRegisterData((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      }
    } else if (name === "ABHA") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    else if (name === "Title") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
        Gender: ["Miss", "Ms", "Mrs"].includes(value)
          ? "Female"
          : ["Mr", "Master"].includes(value)
            ? "Male"
            : ["TransGender", "Baby", "Dr"].includes(value),
      }));
    } else if (name === "DOB") {
      const currentdate = new Date();
      // Calculate the minimum allowed date (100 years before current date)
      const minAllowedDate = subYears(currentdate, 100);
      const selectedDate = new Date(value);

      if (
        isBefore(minAllowedDate, selectedDate) &&
        isBefore(selectedDate, currentdate)
      ) {
        // Calculate the difference in years, months, and days
        const years = differenceInYears(currentdate, selectedDate);
        const months = differenceInMonths(currentdate, selectedDate) % 12;
        const days = differenceInDays(
          currentdate,
          addMonths(addYears(selectedDate, years), months)
        );

        // Format the age as "Years, Months, Days"
        const formattedAge = `${years} Y, ${months} M, ${days} D`;

        setRegisterData((prevFormData) => ({
          ...prevFormData,
          [name]: value, // Update DOB
          Age: formattedAge, // Set formatted age
        }));
      } else {
        setRegisterData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
          Age: "",
        }));
      }
    } else if (name === "Age") {
      if (formattedValue) {
        if (!isNaN(formattedValue) && formattedValue.length <= 3) {
          // Get the current date
          const currentDate = new Date();

          // Calculate the year to subtract
          const targetYear = subYears(currentDate, formattedValue);

          // Create a date for January 1st of the target year
          const dob = startOfYear(targetYear);

          // Format the DOB
          const formattedDOB = format(dob, "yyyy-MM-dd");
          setRegisterData((prev) => ({
            ...prev,
            [name]: formattedValue,
            DOB: formattedDOB,
          }));
        }
      } else {
        setRegisterData((prev) => ({
          ...prev,
          [name]: formattedValue,
          DOB: "",
        }));
      }
    } else if (name === "ReferredBy") {
      try {
        const response = await axios.get(
          `${UrlLink}Masters/get_route_details?DoctorId=${value}`
        );
        const route = response.data;

        if (route) {
          setRegisterData((prevState) => ({
            ...prevState,
            [name]: formattedValue,
            RouteNo: route.RouteNo,
            RouteName: route.RouteName,
            TehsilName: route.TehsilName,
            VillageName: route.VillageName,
          }));
        } else {
          setRegisterData((prevState) => ({
            ...prevState,
            [name]: formattedValue,
            RouteNo: "",
            RouteName: "",
            TehsilName: "",
            VillageName: "",
          }));
        }
      } catch (error) {
        console.error("Error fetching route details:", error);
        setRegisterData((prevState) => ({
          ...prevState,
          [name]: formattedValue,
          RouteNo: "",
          RouteName: "",
          TehsilName: "",
          VillageName: "",
        }));
      }
    } else if (name === "Specialization") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
        DoctorName: "",
      }));
    }


    else if (name === "UHIDNo") {
      if (RegisterData.UHIDType === 'Aadhar') {
        if (formattedValue.length <= 12) {
          setRegisterData((prev) => ({
            ...prev,
            [name]: formattedValue,
          }));

          axios
            .get(
              `${UrlLink}Frontoffice/get_unique_id_no_validation?UniqueIdNo=${formattedValue}`
            )
            .then((reponse) => {
              let data = reponse.data;
              console.log("ressss", data);
              if (data && data.error) {
                // Show a toast if the unique ID already exists
                const tdata = {
                  message: data.error,
                  type: "warn", // Assuming you want to show a warning toast
                };
                dispatchvalue({ type: "toast", value: tdata });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }

      }
      else {
        setRegisterData((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));

        axios
          .get(
            `${UrlLink}Frontoffice/get_unique_id_no_validation?UniqueIdNo=${formattedValue}`
          )
          .then((reponse) => {
            let data = reponse.data;
            console.log("ressss", data);
            if (data && data.error) {
              // Show a toast if the unique ID already exists
              const tdata = {
                message: data.error,
                type: "warn", // Assuming you want to show a warning toast
              };
              dispatchvalue({ type: "toast", value: tdata });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else if (name === "Pincode") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));

    } else if (RegisterData.PermanentAddressSameAsAbove === "No") {
      if (name === "PermanentPincode") {
        setRegisterData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
      if (name === "PermanentdoorNo" || name === "PermanentStreet" || name === "PermanentArea" || name === "PermanentCity" || name === "PermanentCountry" || name === "PermanentPincode") {
        setRegisterData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

    }

    else if (RegisterData.PermanentAddressSameAsAbove === "Yes") {
      console.log(value, 'formattedValue');

      setRegisterData((prev) => ({
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



    const validateField = (value, pattern) => {
      if (!value) {
        return "Required";
      }
      if (pattern && !new RegExp(pattern).test(value)) {
        return "Invalid";
      } else {
        return "Valid";
      }
    };

    const formatABHA = (value) => {
      return value
        .replace(/\D/g, "") // Remove non-numeric characters
        .replace(/(\d{2})(\d{4})?(\d{4})?(\d{4})?/, (match, p1, p2, p3, p4) =>
          [p1, p2, p3, p4].filter(Boolean).join("-")
        );
    };


    if (name === "ABHA") {
      const formattedValue = formatABHA(value);
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    }
    const error = validateField(value, pattern);
    console.log(error, "error");

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };



  const HandleOnchange2 = async (e) => {
    const { name, value, pattern } = e.target;
    console.log("name:", name);
    console.log("value:", value);

    // Helper function to validate fields
    const validateField = (value, pattern) => {
      if (!value) return "Required";
      if (pattern && !new RegExp(pattern).test(value)) return "Invalid";
      return "Valid";
    };

    // Helper function to format ABHA number
    const formatABHA = (value) =>
      value
        .replace(/\D/g, "") // Remove non-numeric characters
        .replace(/(\d{2})(\d{4})?(\d{4})?(\d{4})?/, (match, p1, p2, p3, p4) =>
          [p1, p2, p3, p4].filter(Boolean).join("-")
        );

    // Capitalize the first letter for specific fields
    const formattedValue = [
      "FirstName",
      "MiddleName",
      "SurName",
      "AliasName",
      "Occupation",
      "NextToKinName",
      "FamilyHeadName",
      "FatherName",
      "SpouseName",
      // "Street",
      // "Area",
      // "City",
      // "District",
      // "State",
      // "Country",
    ].includes(name)
      ? `${value.charAt(0).toUpperCase()}${value.slice(1)}`
      : value;

    // Enforce character limit for specific fields
    if (
      [

        "FirstName",
        "MiddleName",
        "AliasName",
        "SurName",
        "Occupation",
        "NextToKinName",

      ].includes(name) &&
      value.length > 30
    ) {
      dispatchvalue({
        type: "toast",
        value: { message: `${name} should not exceed 30 characters.`, type: "warn" },
      });
      return;
    }

    // if (name === "Specialization") {
    //   setRegisterData((prev) => ({
    //     ...prev,
    //     [name]: formattedValue,
    //     DoctorName: "",
    //   }));
    //   return;
    // }

    if (name === "UHIDNo") {
      if (RegisterData.UHIDType === "Aadhar") {
        if (formattedValue.length <= 12) {
          setRegisterData((prev) => ({
            ...prev,
            [name]: formattedValue,
          }));

          axios
            .get(
              `${UrlLink}Frontoffice/get_unique_id_no_validation?UniqueIdNo=${formattedValue}`
            )
            .then((response) => {
              const data = response.data;
              if (data && data.error) {
                const tdata = {
                  message: data.error,
                  type: "warn",
                };
                dispatchvalue({ type: "toast", value: tdata });
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      } else {
        setRegisterData((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));

        axios
          .get(
            `${UrlLink}Frontoffice/get_unique_id_no_validation?UniqueIdNo=${formattedValue}`
          )
          .then((response) => {
            const data = response.data;
            if (data && data.error) {
              const tdata = {
                message: data.error,
                type: "warn",
              };
              dispatchvalue({ type: "toast", value: tdata });
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
      return;
    }

    if (name === "Pincode") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

    if (RegisterData.PermanentAddressSameAsAbove === "No") {
      if (
        name === "PermanentPincode" ||
        name === "PermanentdoorNo" ||
        name === "PermanentStreet" ||
        name === "PermanentArea" ||
        name === "PermanentCity" ||
        name === "PermanentCountry"
      ) {
        setRegisterData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
      return;
    }

    if (RegisterData.PermanentAddressSameAsAbove === "Yes") {
      setRegisterData((prev) => ({
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
      return;
    }

    if (name === "PatientId") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: value,
        ABHA: prev.ABHA,
        ExistingPtNo: "",
        DateOfReg: "",
        LastVisitDate: "",
        Title: "",
        FirstName: "",
        MiddleName: "",
        SurName: "",
        Gender: "",
        MaritalStatus: "Single",
        SpouseName: "",
        FatherName: "",
        AliasName: "",
        DOB: "",
        Age: "",
        PhoneNo: "",
        Email: "",
        BloodGroup: "",
        Occupation: "",
        Religion: "",
        Nationality: "Indian",
        UHIDType: "",
        UHIDNo: "",
        PatientType: "General",
        InsuranceName: "",
        InsuranceType: "",
        ClientName: "",
        ClientType: "Self",
        CorporateName: "",
        CorporateType: "Self",
        EmployeeId: "",
        DonationType: "",
        Flagging: 1,
        Pincode: "",
        DoorNo: "",
        Street: "",
        Area: "",
        City: "",
        District: "",
        State: "",
        Country: "",
        Photo: null,
      }));
      return;
    }

    if (name === "ABHA") {
      const formattedABHA = formatABHA(value);
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedABHA,
      }));
      return;
    }

    if (name === "PhoneNo" || name === "RelativePhoneNo") {
      if (formattedValue.includes("|")) {
        const [patientId, firstName, phone] = formattedValue.split(" | ");
        if (phone.length <= 10) {
          setRegisterData((prev) => ({
            ...prev,
            PatientId: patientId.trim(),
            FirstName: firstName.trim(),
            [name]: phone.trim(),
          }));
        }
      } else if (formattedValue.length <= 10) {
        setRegisterData((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      }
      return;
    }

    if (name === "Title") {
      const gender =
        ["Miss", "Ms", "Mrs"].includes(value) ? "Female" : ["Mr", "Master"].includes(value) ? "Male" : "";
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
        Gender: gender,
      }));
      return;
    }

    if (name === "DOB") {
      const currentdate = new Date();
      const minAllowedDate = subYears(currentdate, 100);
      const selectedDate = new Date(value);

      if (isBefore(minAllowedDate, selectedDate) && isBefore(selectedDate, currentdate)) {
        const years = differenceInYears(currentdate, selectedDate);
        const months = differenceInMonths(currentdate, selectedDate) % 12;
        const days = differenceInDays(currentdate, addMonths(addYears(selectedDate, years), months));

        setRegisterData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
          Age: `${years} Y, ${months} M, ${days} D`,
        }));
      } else {
        setRegisterData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
          Age: "",
        }));
      }
      return;
    }

    if (name === "Age") {
      if (!isNaN(formattedValue) && formattedValue.length <= 3) {
        const dob = format(startOfYear(subYears(new Date(), formattedValue)), "yyyy-MM-dd");
        setRegisterData((prev) => ({
          ...prev,
          [name]: formattedValue,
          DOB: dob,
        }));
      }
      return;
    }

    if (name === "ReferredBy") {
      try {
        const response = await axios.get(`${UrlLink}Masters/get_route_details?DoctorId=${value}`);
        const route = response.data || {};
        setRegisterData((prevState) => ({
          ...prevState,
          [name]: formattedValue,
          RouteNo: route.RouteNo || "",
          RouteName: route.RouteName || "",
          TehsilName: route.TehsilName || "",
          VillageName: route.VillageName || "",
        }));
      } catch (error) {
        console.error("Error fetching route details:", error);
      }
      return;
    }

    // General field update
    setRegisterData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Validate field
    const error = validateField(value, pattern);
    console.log("Validation error:", error);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };






  // const HandleOnchange = async (e) => {
  //   const { name, value, pattern } = e.target;
  //   console.log("name:", name);
  //   console.log("value:", value);


  //   const validateField = (value, pattern) => {
  //     if (!value) {
  //       return "Required";
  //     }
  //     if (pattern && !new RegExp(pattern).test(value)) {
  //       return "Invalid";
  //     } else {
  //       return "Valid";
  //     }
  //   };

  //   const error = validateField(value, pattern);
  //   console.log(error, "error");

  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     [name]: error,
  //   }));

  //   const formatABHA = (value) =>
  //     value
  //       .replace(/\D/g, "") // Remove non-numeric characters
  //       .replace(/(\d{2})(\d{4})?(\d{4})?(\d{4})?/, (match, p1, p2, p3, p4) =>
  //         [p1, p2, p3, p4].filter(Boolean).join("-")
  //   );

  //   if (name === "ABHA") {
  //     const formattedABHA = formatABHA(value);
  //     setRegisterData((prev) => ({
  //       ...prev,
  //       [name]: formattedABHA,
  //     }));
  //     return;
  //   }

  //   const capitalizeFirstLetter = (value) =>
  //     value.charAt(0).toUpperCase() + value.slice(1);

  //   const formattedValue = [
  //     "FirstName",
  //     "MiddleName",
  //     "SurName",
  //     "AliasName",
  //     "Occupation",
  //     "FatherName",
  //     "SpouseName",
  //     "DoorNo",
  //     "Street",
  //     "Area",
  //     "City",
  //     "District",
  //     "State",
  //     "Country",
  //     "PermanentdoorNo",
  //     "PermanentStreet",
  //     "PermanentArea",
  //     "PermanentCity",
  //     "PermanentDistrict",
  //     "PermanentState",
  //     "PermanentCountry",

  //   ].includes(name)
  //     ? capitalizeFirstLetter(value)
  //     : value;

  //   // Check length for specific fields
  //   if (
  //     [

  //       "FirstName",
  //       "MiddleName",
  //       "AliasName",
  //       "SurName",
  //       "Occupation",
  //       // "NextToKinName",
  //       // "FamilyHeadName",
  //       // "Street",
  //       // "Area",
  //       // "City",
  //       // "District",
  //       // "State",
  //       // "Country",
  //       // "UHIDNo",
  //     ].includes(name) &&
  //     value.length > 30
  //   ) {
  //     const tdata = {
  //       message: `${name} should not exceed 30 characters.`,
  //       type: "warn", // Ensure 'warn' is a valid type for your toast system
  //     };
  //     dispatchvalue({ type: "toast", value: tdata });
  //     return; // Exit early to prevent state update
  //   }


  //   if (name === "PhoneNo" || name === "RelativePhoneNo") {
  //     if (formattedValue.includes("|")) {
  //       const convert = formattedValue.split(" | ");
  //       console.log(convert);

  //       if (convert.length <= 10) {
  //         setRegisterData((prev) => ({
  //           ...prev,
  //           [name]: convert[2].trim(),
  //           PatientId: convert[0].trim(),
  //           FirstName: convert[1].trim(),
  //         }));
  //       }
  //     } else {
  //       if (formattedValue.length <= 10) {
  //         setRegisterData((prev) => ({
  //           ...prev,
  //           [name]: formattedValue,
  //         }));
  //       }
  //     }
  //   }
  //   if (name === "FirstName") {
  //     if (formattedValue.includes("|")) {
  //       const convert = formattedValue.split(" | ");

  //       setRegisterData((prev) => ({
  //         ...prev,
  //         [name]: convert[1].trim(),
  //         PatientId: convert[0].trim(),
  //         PhoneNo: convert[2].trim(),
  //       }));
  //     } else {
  //       setRegisterData((prev) => ({
  //         ...prev,
  //         [name]: formattedValue,
  //       }));
  //     }
  //   } 
  //   if (name === "Title") {
  //     setRegisterData((prev) => ({
  //       ...prev,
  //       [name]: formattedValue,
  //       Gender: ["Miss", "Ms", "Mrs"].includes(value)
  //         ? "Female"
  //         : ["Mr", "Master"].includes(value)
  //           ? "Male"
  //           : ["TransGender", "Baby", "Dr"].includes(value),
  //     }));
  //   }
  //   if (name === "DOB") {
  //     const currentdate = new Date();
  //     // Calculate the minimum allowed date (100 years before current date)
  //     const minAllowedDate = subYears(currentdate, 100);
  //     const selectedDate = new Date(value);

  //     if (
  //       isBefore(minAllowedDate, selectedDate) &&
  //       isBefore(selectedDate, currentdate)
  //     ) {
  //       // Calculate the difference in years, months, and days
  //       const years = differenceInYears(currentdate, selectedDate);
  //       const months = differenceInMonths(currentdate, selectedDate) % 12;
  //       const days = differenceInDays(
  //         currentdate,
  //         addMonths(addYears(selectedDate, years), months)
  //       );

  //       // Format the age as "Years, Months, Days"
  //       const formattedAge = `${years} Y, ${months} M, ${days} D`;

  //       setRegisterData((prevFormData) => ({
  //         ...prevFormData,
  //         [name]: value, // Update DOB
  //         Age: formattedAge, // Set formatted age
  //       }));
  //     } else {
  //       setRegisterData((prevFormData) => ({
  //         ...prevFormData,
  //         [name]: value,
  //         Age: "",
  //       }));
  //     }
  //   } 
  //   if (name === "Age") {
  //     if (formattedValue) {
  //       if (!isNaN(formattedValue) && formattedValue.length <= 3) {
  //         // Get the current date
  //         const currentDate = new Date();

  //         // Calculate the year to subtract
  //         const targetYear = subYears(currentDate, formattedValue);

  //         // Create a date for January 1st of the target year
  //         const dob = startOfYear(targetYear);

  //         // Format the DOB
  //         const formattedDOB = format(dob, "yyyy-MM-dd");
  //         setRegisterData((prev) => ({
  //           ...prev,
  //           [name]: formattedValue,
  //           DOB: formattedDOB,
  //         }));
  //       }
  //     } else {
  //       setRegisterData((prev) => ({
  //         ...prev,
  //         [name]: formattedValue,
  //         DOB: "",
  //       }));
  //     }
  //   } 
  //   if (name === "UHIDNo") {
  //     if (RegisterData.UHIDType === 'Aadhar') {
  //       if (formattedValue.length <= 12) {
  //         setRegisterData((prev) => ({
  //           ...prev,
  //           [name]: formattedValue,
  //         }));

  //         axios
  //           .get(
  //             `${UrlLink}Frontoffice/get_unique_id_no_validation?UniqueIdNo=${formattedValue}`
  //           )
  //           .then((reponse) => {
  //             let data = reponse.data;
  //             console.log("ressss", data);
  //             if (data && data.error) {
  //               // Show a toast if the unique ID already exists
  //               const tdata = {
  //                 message: data.error,
  //                 type: "warn", // Assuming you want to show a warning toast
  //               };
  //               dispatchvalue({ type: "toast", value: tdata });
  //             }
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       }

  //     }
  //     else {
  //       setRegisterData((prev) => ({
  //         ...prev,
  //         [name]: formattedValue || value,
  //       }));

  //       axios
  //         .get(
  //           `${UrlLink}Frontoffice/get_unique_id_no_validation?UniqueIdNo=${formattedValue}`
  //         )
  //         .then((reponse) => {
  //           let data = reponse.data;
  //           console.log("ressss", data);
  //           if (data && data.error) {
  //             // Show a toast if the unique ID already exists
  //             const tdata = {
  //               message: data.error,
  //               type: "warn", // Assuming you want to show a warning toast
  //             };
  //             dispatchvalue({ type: "toast", value: tdata });
  //           }
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //   } 
  //   if (name === "Pincode") {
  //     setRegisterData((prev) => ({
  //       ...prev,
  //       [name]: formattedValue,
  //     }));

  //   } 
  //   if (name === "DoorNo" || name === "Street" || name === "Area" || name === "City" || name === "District" || name === "State" || name === "Country" || name === "Pincode") {
  //       setRegisterData((prev) => ({
  //         ...prev,
  //         [name]: formattedValue,
  //       }));
  //   }  
  //   } 


  //    if (RegisterData.PermanentAddressSameAsAbove==="NO"){
  //     if(name==="PermanentPincode"){
  //       setRegisterData((prev) => ({
  //         ...prev,
  //         [name]: formattedValue,
  //       }));
  //     }
  //     if (name === "PermanentdoorNo" || name === "PermanentStreet" || name === "PermanentArea" || name === "PermanentCity" || name === "PermanentDistrict" || name === "PermanentState" || name === "PermanentCountry" || name === "PermanentPincode") {
  //       setRegisterData((prev) => ({
  //         ...prev,
  //         [name]: formattedValue,
  //       }));
  //     }
  //   } else {
  //     setRegisterData((prev) => ({
  //       ...prev,
  //       [name]: formattedValue || value,
  //     }));
  //   }


  // };

  // Age handling functions - defined at component level
  const handleAgeYearsChange = (value) => {
    setAgeYears(value);
    if (value && !isNaN(value)) {
      const years = parseInt(value);
      const months = parseInt(ageMonths) || 0;
      const days = parseInt(ageDays) || 0;
      
      const dob = format(subDays(subMonths(subYears(new Date(), years), months), days), "yyyy-MM-dd");
      const ageLabel = `${years} Y, ${months} M, ${days} D`;
      
      setRegisterData(prev => ({
        ...prev,
        Age: ageLabel,
        DOB: dob
      }));
    }
  };

  const handleAgeMonthsChange = (value) => {
    setAgeMonths(value);
    if (value && !isNaN(value)) {
      const years = parseInt(ageYears) || 0;
      const months = parseInt(value);
      const days = parseInt(ageDays) || 0;
      
      const dob = format(subDays(subMonths(subYears(new Date(), years), months), days), "yyyy-MM-dd");
      const ageLabel = `${years} Y, ${months} M, ${days} D`;
      
      setRegisterData(prev => ({
        ...prev,
        Age: ageLabel,
        DOB: dob
      }));
    }
  };

  const handleAgeDaysChange = (value) => {
    setAgeDays(value);
    if (value && !isNaN(value)) {
      const years = parseInt(ageYears) || 0;
      const months = parseInt(ageMonths) || 0;
      const days = parseInt(value);
      
      const dob = format(subDays(subMonths(subYears(new Date(), years), months), days), "yyyy-MM-dd");
      const ageLabel = `${years} Y, ${months} M, ${days} D`;
      
      setRegisterData(prev => ({
        ...prev,
        Age: ageLabel,
        DOB: dob
      }));
    }
  };

  const handleAgeUnitChange = (value) => {
    setAgeUnit(value);
    // Reset other age fields when unit changes
    if (value === "Years") {
      setAgeMonths("");
      setAgeDays("");
    } else if (value === "Months") {
      setAgeYears("");
      setAgeDays("");
    } else if (value === "Days") {
      setAgeYears("");
      setAgeMonths("");
    }
  };

  const HandleOnchange = async (e) => {
  const { name, value, pattern } = e.target;
  console.log("name:", name);
  console.log("value:", value);

  // ABHA formatting + validation
  if (name === "ABHA") {
    const formatABHA = (val) =>
      val
        .replace(/\D/g, "") // remove non-digits
        .replace(/(\d{2})(\d{4})?(\d{4})?(\d{4})?/, (match, p1, p2, p3, p4) =>
          [p1, p2, p3, p4].filter(Boolean).join("-")
        );

    const formattedABHA = formatABHA(value);

    const isFullABHA = /^\d{2}-\d{4}-\d{4}-\d{4}$/.test(formattedABHA);
    const error = !formattedABHA
      ? "Required"
      : isFullABHA
      ? "Valid"
      : "Invalid";

    setRegisterData((prev) => ({
      ...prev,
      [name]: formattedABHA,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    return;
  }


  const parseAgeYMD = (raw) => {
    const str = String(raw || "").trim().toLowerCase();
    if (!str) return { years: null, months: null, days: null };
 
    const yMatch = str.match(/(\d+)\s*y/);
    const mMatch = str.match(/(\d+)\s*m/);
    const dMatch = str.match(/(\d+)\s*d/);
 
    let years = yMatch ? parseInt(yMatch[1], 10) : null;
    let months = mMatch ? parseInt(mMatch[1], 10) : null;
    let days = dMatch ? parseInt(dMatch[1], 10) : null;
 
    // If only digits are present, treat as years-only
    if (years === null && months === null && days === null) {
      const onlyDigits = str.replace(/\D/g, "");
      if (onlyDigits !== "") {
        years = parseInt(onlyDigits, 10);
        months = 0;
        days = 0;
      }
    }
 
    if (years === null && months === null && days === null) {
      return { years: null, months: null, days: null };
    }
 
    years = Math.max(0, years ?? 0);
    months = Math.max(0, Math.min(11, months ?? 0));
    days = Math.max(0, Math.min(30, days ?? 0));
 
    return { years, months, days };
  };
 
  const formatAgeLabel = ({ years = 0, months = 0, days = 0 }) =>
    `${years} Y, ${months} M, ${days} D`;
 
  const computeDobFromAge = ({ years = 0, months = 0, days = 0 }) =>
    format(subDays(subMonths(subYears(new Date(), years), months), days), "yyyy-MM-dd");



  // Default validation
  // const validateField = (val, pat) => {
  //   if (!val) return "Required";
  //   if (pat && !new RegExp(`^${pat}$`).test(val)) return "Invalid";
  //   return "Valid";
  // };

  // const error = validateField(value, pattern);
  // setErrors((prevErrors) => ({
  //   ...prevErrors,
  //   [name]: error,
  // }));

  // Capitalize specific fields
  const capitalizeFirstLetter = (val) => val.charAt(0).toUpperCase() + val.slice(1);
  const formattedValue = [
    "FirstName", "MiddleName", "SurName", "AliasName", "Occupation", "FatherName", "SpouseName",
    "DoorNo", "Street", "Area", "City", "District", "State", "Country", "PermanentdoorNo",
    "PermanentStreet", "PermanentArea", "PermanentCity", "PermanentDistrict", "PermanentState",
    "PermanentCountry"
  ].includes(name) ? capitalizeFirstLetter(value) : value;

  // Length check
  if (
    ["FirstName", "MiddleName", "AliasName", "SurName", "Occupation"].includes(name) &&
    value.length > 30
  ) {
    dispatchvalue({
      type: "toast",
      value: { message: `${name} should not exceed 30 characters.`, type: "warn" },
    });
    return;
  }

  // Reset on PatientId
  if (name === "PatientId") {
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
      ABHA: "",
      ExistingPtNo: "",
      DateOfReg: "",
      LastVisitDate: "",
      Title: "",
      FirstName: "",
      MiddleName: "",
      SurName: "",
      Gender: "",
      MaritalStatus: "Single",
      SpouseName: "",
      FatherName: "",
      AliasName: "",
      DOB: "",
      Age: "",
      PhoneNo: "",
      Email: "",
      BloodGroup: "",
      Occupation: "",
      Religion: "",
      Nationality: "Indian",
      UHIDType: "",
      UHIDNo: "",
      PatientType: "General",
      InsuranceName: "",
      InsuranceType: "",
      ClientName: "",
      ClientType: "Self",
      ClientEmployeeId: "",
      ClientEmployeeDesignation: "",
      ClientEmployeeRelation: "",
      CorporateName: "",
      CorporateType: "Self",
      CorporateEmployeeId: "",
      CorporateEmployeeDesignation: "",
      CorporateEmployeeRelation: "",
      EmployeeId: "",
      EmployeeRelation: "",
      DoctorId: "",
      DoctorRelation: "",
      DonationType: "",
      Flagging: 1,
      Pincode: "",
      DoorNo: "",
      Street: "",
      Area: "",
      City: "",
      District: "",
      State: "",
      Country: "India",
      Photo: null,
      PermanentAddressSameAsAbove: "",
      PermanentdoorNo: "",
      PermanentStreet: "",
      PermanentArea: "",
      PermanentCity: "",
      PermanentDistrict: "",
      PermanentState: "",
      PermanentCountry: "India",
      PermanentPincode: "",
    }));
  }

  if (name === "PhoneNo") {
    if (formattedValue.length <= 10) {
      setRegisterData((prev) => ({ ...prev, [name]: formattedValue }));
    }
    return;
  }

  if (name === "FirstName") {
    if (formattedValue.includes("|")) {
      const convert = formattedValue.split(" | ");
      setRegisterData((prev) => ({
        ...prev,
        [name]: convert[1]?.trim() || "",
        PatientId: convert[0]?.trim() || "",
        PhoneNo: convert[2]?.trim() || "",
      }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: formattedValue }));
    }
    return;
  }

  if (name === "Title") {
    const selectedTitle = TitleNameData.find((title) => title.id === parseInt(value));
    if (selectedTitle) {
      const titleName = selectedTitle.Title;
      const genderValue = ["Miss", "Ms", "Mrs"].includes(titleName)
        ? "Female"
        : ["Mr", "Master"].includes(titleName)
        ? "Male"
        : ["Dr", "Baby", "Transgender"].includes(titleName)
        ? ""
        : "";

      setRegisterData((prev) => ({
        ...prev,
        [name]: value,
        Gender: genderValue || prev.Gender,
      }));
    }
    return;
  }

  if (name === "Gender") {
    const titleOptions = TitleNameData.filter((title) => {
      if (value === "Female") return ["Miss", "Ms", "Mrs", "Baby", "Dr", "Transgender"].includes(title.Title);
      if (value === "Male") return ["Mr", "Master", "Baby", "Dr", "Transgender"].includes(title.Title);
      if (value === "Transgender") return ["Transgender", "Dr", "Baby"].includes(title.Title);
      return false;
    });

    const selectedTitle = TitleNameData.find((title) => title.id === RegisterData.Title);
    const isTitleValid =
      selectedTitle &&
      (["Dr", "Baby", "Transgender"].includes(selectedTitle.Title) ||
        titleOptions.some((title) => title.id === selectedTitle.id));

    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
      Title: isTitleValid ? prev.Title : prev.Title,
    }));
    return;
  }

  if (name === "DOB") {
    const currentdate = new Date();
    const minAllowedDate = subYears(currentdate, 100);
    const selectedDate = new Date(value);

    if (isBefore(minAllowedDate, selectedDate) && isBefore(selectedDate, currentdate)) {
      const years = differenceInYears(currentdate, selectedDate);
      const months = differenceInMonths(currentdate, selectedDate) % 12;
      const days = differenceInDays(currentdate, addMonths(addYears(selectedDate, years), months));
      const formattedAge = `${years} Y, ${months} M, ${days} D`;

      setRegisterData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        Age: formattedAge,
      }));
    } else {
      setRegisterData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        Age: "",
      }));
    }
    return;
  }

  if (name === "Age") {
    // Handle both dropdown and text input for age
    if (typeof value === 'string' && value.includes('|')) {
      // This is from dropdown selection
      const [ageValue, unit] = value.split('|').map(v => v.trim());
      if (ageValue && !isNaN(ageValue)) {
        const numValue = parseInt(ageValue);
        let years = 0, months = 0, days = 0;
        
        if (unit === "Years") {
          years = numValue;
        } else if (unit === "Months") {
          months = numValue;
        } else if (unit === "Days") {
          days = numValue;
        }
        
        const dob = format(subDays(subMonths(subYears(new Date(), years), months), days), "yyyy-MM-dd");
        const ageLabel = `${years} Y, ${months} M, ${days} D`;
        
        setRegisterData(prev => ({
          ...prev,
          Age: ageLabel,
          DOB: dob
        }));
      }
    } else {
      // Handle text input (existing logic)
      const parts = parseAgeYMD(value);
      if (parts.years === null && parts.months === null && parts.days === null) {
        // Keep the raw input until it becomes parseable
        setRegisterData((prev) => ({ ...prev, Age: value }));
      } else {
        const label = formatAgeLabel(parts);
        const dob = computeDobFromAge(parts);
        setRegisterData((prev) => ({ ...prev, Age: label, DOB: dob }));
        setErrors((prev) => ({ ...prev, Age: "Valid" }));
      }
    }
    return;
  }

  if (name === "UHIDNo") {
    if (RegisterData.UHIDType === "Aadhar") {
      if (formattedValue.length <= 12) {
        setRegisterData((prev) => ({ ...prev, [name]: formattedValue }));
        axios
          .get(`${UrlLink}Frontoffice/get_unique_id_no_validation?UniqueIdNo=${formattedValue}`)
          .then((response) => console.log("res:", response.data))
          .catch((err) => console.log(err));
      }
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: formattedValue || value }));
      axios
        .get(`${UrlLink}Frontoffice/get_unique_id_no_validation?UniqueIdNo=${formattedValue}`)
        .then((response) => {
          if (response.data?.error) {
            dispatchvalue({ type: "toast", value: { message: response.data.error, type: "warn" } });
          }
        })
        .catch((err) => console.log(err));
    }
    return;
  }

  // Generic register data update
  setRegisterData((prev) => ({
    ...prev,
    [name]: formattedValue || value,
  }));

  // Handle special cascading
  if (name === "State") {
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
      District: "",
      City: "",
    }));
    return;
  }

  if (name === "PermanentState") {
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
      PermanentDistrict: "",
      PermanentCity: "",
    }));
    return;
  }

  if (name === "District") {
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
      City: "",
    }));
    return;
  }

  if (name === "PermanentDistrict") {
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
      PermanentCity: "",
    }));
    return;
  }

  // Clear address if SameAsAbove is "Yes"
  if (RegisterData.PermanentAddressSameAsAbove === "Yes") {
    setRegisterData((prev) => ({
      ...prev,
      DoorNo: "",
      Street: "",
      Area: "",
      City: "",
      District: "",
      State: "",
      Country: "",
      Pincode: "",
    }));
  }
};








  // useEffect(() => {
  //   if (RegisterData.Pincode.length > 5) {
  //     axios
  //       .get(`${UrlLink}Frontoffice/get_location_by_pincode?pincode=${RegisterData.Pincode}`)
  //       .then((response) => {
  //         const data = response.data;
  //         console.log("Pincode response:", data);
  //         const { country, state, city, district } = data;
  //         setRegisterData((prev) => ({
  //           ...prev,
  //           Country: country || '',
  //           State: state || '',
  //           City: city || '',
  //           District: district || '',
  //         }));
  //       })
  //       .catch((err) => {
  //         console.error("Error fetching pincode details:", err);
  //       });
  //   }
  // }, [RegisterData.Pincode,UrlLink]); // Dependency on Pincode


  // Effect for permanent address Pincode when "PermanentAddressSame" is "NO"


  // useEffect(() => {
  //   console.log("123")
  //   if (RegisterData.PermanentAddressSameAsAbove === "Yes" && RegisterData.PermanentPincode.length > 5) {
  //     console.log("900000")
  //     axios
  //       .get(`${UrlLink}Frontoffice/get_location_by_pincode?pincode=${RegisterData.PermanentPincode}`)
  //       .then((response) => {
  //         const data = response.data;
  //         console.log("Permanent Pincode response:", data);
  //         const { country, state, city, district } = data;
  //         setRegisterData((prev) => ({
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
  // }, [UrlLink,RegisterData.PermanentAddressSameAsAbove, RegisterData.PermanentPincode]); // Dependencies for PermanentAddressSame and PermanentPincode


  useEffect(() => {
    if (RegisterData.PermanentPincode.length > 5) {
      axios
        .get(`${UrlLink}Frontoffice/get_location_by_pincode?pincode=${RegisterData.PermanentPincode}`)
        .then((response) => {
          const data = response.data;
          console.log("Pincode response:", data);
          const { country, state, city, district } = data;
          setRegisterData((prev) => ({
            ...prev,
            PermanentCountry: country || '',
            PermanentState: state || '',
            PermanentCity: city || '',
            PermanentDistrict: district || '',

            // Country: country || '',
            // State: state || '',
            // City: city || '',
            // District: district || '',
          }));
        })
        .catch((err) => {
          console.error("Error fetching pincode details:", err);
        });
    }
  }, [RegisterData.PermanentPincode, UrlLink]); // Dependency on Pincode




  // Effect for permanent address Pincode when "PermanentAddressSame" is "NO"
  useEffect(() => {
    console.log("123")
    if (RegisterData.PermanentAddressSameAsAbove === "No" && RegisterData.Pincode.length > 5) {
      console.log("900000")
      axios
        .get(`${UrlLink}Frontoffice/get_location_by_pincode?pincode=${RegisterData.Pincode}`)
        .then((response) => {
          const data = response.data;
          console.log("Permanent Pincode response:", data);
          const { country, state, city, district } = data;
          setRegisterData((prev) => ({
            ...prev,

            Country: country || '',
            State: state || '',
            City: city || '',
            District: district || '',


            //   PermanentCountry: country || '',
            //   PermanentState: state || '',
            //   PermanentCity: city || '',
            //   PermanentDistrict: district || '',


          }));
        })
        .catch((err) => {
          console.error("Error fetching permanent pincode details:", err);
        });
    }
  }, [UrlLink, RegisterData.PermanentAddressSameAsAbove, RegisterData.Pincode]); // Dependencies for PermanentAddressSame and PermanentPincode




  const handleRestrictedAction = () => {
    alert("You do not have permission to perform this action.");
  };

  const handleNavigateOP = async (row) => {
    try {
      const response = await axios.get(`${UrlLink}MCI/MCI_Fetch_Register_Patients_Details`, {
        params: { PatientId: row.PatientId }, // Send PatientId as a query parameter
      });
      const patientData = response.data;
      console.log(patientData, "Fetched Patient Data for OP");
      dispatchvalue({ type: "ReferalDocPatient", value: {} });
      dispatchvalue({ type: "HrFolder", value: "OPRegistration" });
      console.log(patientData, "22222222Fetched Patient Data for OP");

      dispatchvalue({ type: "PatientDetails", value: { ...patientData, Department: 'OP' } });
      navigate("/Home/MRDFolder");

      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    } catch (error) {
      console.error("Error fetching patient data for OP:", error);
    }
  };

  const handleNavigateRADIOLOGY = async (row) => {
    try {
      const response = await axios.get(`${UrlLink}Frontoffice/Fetch_Register_Patients_Details`, {
        params: { PatientId: row.PatientId }, // Send PatientId as a query parameter
      });
      const patientData = response.data;
      console.log(patientData, "Fetched Patient Data for OP");
      dispatchvalue({ type: "ReferalDocPatient", value: {} });
      dispatchvalue({ type: "HrFolder", value: "OPVisitEntry" });
      console.log(patientData, "22222222Fetched Patient Data for OP");

      dispatchvalue({ type: "PatientDetails", value: { ...patientData, Department: 'RADIOLOGY' } });
      navigate("/Home/FrontOfficeFolder");

      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    } catch (error) {
      console.error("Error fetching patient data for OP:", error);
    }
  };

  const handleNavigateSERVICES = async (row) => {

    try {
      const response = await axios.get(`${UrlLink}Frontoffice/Fetch_Register_Patients_Details`, {
        params: { PatientId: row.PatientId }, // Send PatientId as a query parameter
      });
      const patientData = response.data;
      console.log(patientData, "Fetched Patient Data for OP");
      dispatchvalue({ type: "ReferalDocPatient", value: {} });
      dispatchvalue({ type: "HrFolder", value: "OPVisitEntry" });
      console.log(patientData, "22222222Fetched Patient Data for OP");

      dispatchvalue({ type: "PatientDetails", value: { ...patientData, Department: 'SERVICES' } });
      navigate("/Home/FrontOfficeFolder");

      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    } catch (error) {
      console.error("Error fetching patient data for OP:", error);
    }

  }
  
  const handleNavigateCasuality = async (row) => {
    try {
      const response = await axios.get(`${UrlLink}Frontoffice/Fetch_Register_Patients_Details`, {
        params: { PatientId: row.PatientId }, // Send PatientId as a query parameter
      });
      const patientData = response.data;
      console.log(patientData, "Fetched Patient Data for CASUALITY");
      dispatchvalue({ type: "HrFolder", value: "OPVisitEntry" });
      console.log(patientData, "22222222Fetched Patient Data for CASUALITY");

      dispatchvalue({ type: "PatientDetails", value: { ...patientData, Department: 'CASUALITY' } });
      navigate("/Home/FrontOfficeFolder");

      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    } catch (error) {
      console.error("Error fetching patient data for CASUALITY:", error);
    }
  };

  const handleNavigateIP = async (row) => {
    try {
      const response = await axios.get(`${UrlLink}Frontoffice/Fetch_Register_Patients_Details`, {
        params: { PatientId: row.PatientId }, // Send PatientId as a query parameter
      });
      const patientData = response.data;
      console.log(patientData, "Fetched Patient Data for IP");
      dispatchvalue({ type: "HrFolder", value: "IPRegistration" });
      dispatchvalue({ type: "PatientDetails", value: { ...patientData, Department: 'IP' } });
      navigate("/Home/FrontOfficeFolder");
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    } catch (error) {
      console.error("Error fetching patient data for IP:", error);
    }
  };



  const handleClear = () => {
    setRegisterData({
      ABHA: "",
      ExistingPtNo: "",
      Year:"",
      DateOfReg: "",
      LastVisitDate: "",
      Title: "",
      FirstName: "",
      MiddleName: "",
      SurName: "",
      Gender: "",
      MaritalStatus: "",
      SpouseName: "",
      FatherName: "",
      DOB: "",
      Age: "",

      Email: "",
      BloodGroup: "",
      Occupation: "",
      Religion: "",
      Nationality: "Indian",
      UHIDType: "",
      UHIDNo: "",
      PhoneNo: "",

      EnterOTP: "",
      AbhaAddress: "",
      EnterMobileOtp: "",

      PatientType: "General",
      Pincode: "",
      DoorNo: "",
      Street: "",
      Area: "",
      City: "",
      District: "",
      State: "",
      Country: "India",

      PermanentPincode: "",
      PermanentdoorNo: "",
      PermanentStreet: "",
      PermanentArea: "",
      PermanentCity: "",
      PermanentDistrict: "",
      PermanentState: "",
      PermanentCountry: "India",
      PermanentAddressSameAsAbove: "",


      Photo: null,
    });
  };

  const handlesubmit = () => {
    setLoading(true);
    scrollToElement("RegisFormcon_11");

    // Define explicitly required fields
    const requiredFields = ["Title", "FirstName", "Gender", "PhoneNo", "Nationality"];

    let missingFields = [];

    // Identify missing fields from the explicitly required list
    requiredFields.forEach((field) => {
      if (!RegisterData[field]) {
        missingFields.push(formatLabel(field)); // Assuming formatLabel formats field names for display
      }
    });

    if (!RegisterData.DOB && !RegisterData.Age) {
      missingFields.push("DOB or Age");
    }

    console.log("missingFields", missingFields);

    // If any required fields are missing, show a warning
    if (missingFields.length > 0) {
      setLoading(false);
      const tdata = {
        message: `Please fill out the required fields: ${missingFields.join(
          ", "
        )}`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {
      const exist = Object.keys(errors).filter((p) => errors[p] === "Invalid");
      if (exist.length > 0) {
        setLoading(false);
        const tdata = {
          message: `please fill the field required pattern  :  ${exist.join(
            ","
          )}`,
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        const submitdata = {
          ...RegisterData,
          // PatientPhoto: patientPhoto,
          Created_by: UserData?.username,
          //   RegisterType: AppointmentRegisType,
          RegisterId: Registeredit?.conversion
            ? null
            : Registeredit?.RegistrationId,
          optoip_id: Registeredit?.conversion
            ? Registeredit?.RegistrationId
            : null,
          Location: UserData?.location,

          AppointmentToRegistrationId: Registeredit?.appconversion ? (Registeredit.id || null) : null || null,
          DoctorID: Registeredit?.appconversion ? (Registeredit.DoctorID || null) : null || null,
          SpecializationId: Registeredit?.appconversion ? (Registeredit.SpecializationId || null) : null || null,
          referdocid: Registeredit?.referaldoctorid ? (Registeredit.referaldoctorid || null) : null || null,
          AppointmentToRegistrationId: Registeredit?.appconversion ? (Registeredit.AppointmentId || null) : null || null,
          OldDepartment : OldDepartment

          // AppointmentToRegistrationId: Registeredit?.appconversion ? Number(Registeredit.id) || null : null,
          // DoctorID: Registeredit?.appconversion ? Number(Registeredit.DoctorID) || null : null,
          // SpecializationId: Registeredit?.appconversion ? Number(Registeredit.SpecializationId) || null : null,

          //   TestNames: FavouriteNamess || [],
          //   addedTests: addedTests || [],
        };
        console.log("datatosend", submitdata);

        axios
          .post(`${UrlLink}MCI/MCI_Patient_Registration`, submitdata)
          .then((res) => {
            setLoading(false);
            
            console.log(res);
            const resData = res.data;
            const message = Object.values(resData)[0];
            const type = Object.keys(resData)[0];
            const tdata = {
              message: message,
              type: type,
            };
            console.log(resData.data, "resData");

            dispatchvalue({ type: "toast", value: tdata });
            setOtpNumber(null);
            setMobileOtp(null);
            setAbhaaddress(null);
            dispatchvalue({ type: "Registeredit", value: {} });
            setIsGetData(prev => !prev);
            setPatientRegisterDetails(resData.data[0]);
            navigate("/Home/MRDFolder");

            dispatchvalue({ type: "setPreviousFolder", value: null });
            dispatchvalue({ type: "showMenu", value: true });

            // dispatchvalue({ type: "HrFolder", value:"PatientManagement"});

            // navigate("/Home/FrontOfficeFolder");

            // console.log(dispatchvalue({ type: "HrFolder", value: "PatientManagement" }))
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      }
    }
  };

  const handleSaveClick = () => {
    if (UserData?.Create) {
      handlesubmit(); // Proceed with form submission
    } else {
      handleRestrictedAction();// Show alert for unauthorized users
    }
  };

  // -------------------------------ABHA----------------------------------
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };


  const handle_OtpChange = (e) => {
    setMobile_Otp(e.target.value);
  };


  // ----------------------ABHA submit-----------------------------------------

  const ABHAsubmit = () => {
    setOtpvisible(true);
    // Step 1: Get public key
    // axios
    //   .get("https://healthidsbx.abdm.gov.in/api/v1/auth/cert")
    //   .then((publicKeyRes) => {
    //     const publicKey = publicKeyRes.data
    //     console.log("Public Key:", publicKey);

    // Step 2: Send public key and Aadhaar number
    axios
      .post(`${UrlLink}Frontoffice/abha_register`, {
        // public_key: publicKey,
        aadhaar_number: RegisterData.UHIDNo, // Ensure this matches the backend key
      })
      .then((response) => {
        const resData = response.data;
        console.log(response.data)
        console.log("Public key and Aadhaar number sent successfully:", response.data.otp_response);
        const { otp_response } = resData;

        if (otp_response) {
          const message = otp_response.message; // Extract the message
          const type = "success"; // You can assign a type, e.g., success or info

          const tdata = {
            message: message,
            type: type,
          };

          dispatchvalue({ type: "toast", value: tdata });
        } else {
          console.error("OTP response is missing in the data.");
        }

        const { txnId } = response.data.otp_response;
        const data34 = response.data.access_token;
        console.log(data34)
        setTxnId(txnId);
        setAccesstoken(data34)

        console.log("txnId:", txnId);
        //  console.log("access_token:", access_token);

        // alert("OTP sent successfully!");


      })
      .catch((error) => {
        console.error("Error sending public key and Aadhaar number:", error.message);
        console.error("Error sending public key and Aadhaar number:", error.response?.data);

        const ErrData = error.response?.data
        console.log(ErrData, 'ErrData');





        if (ErrData) {
          console.log(ErrData?.message, 'otpErrRes');
          console.log(ErrData?.error?.message, 'otpErrRes');


          const message = ErrData?.error?.message || ErrData?.message || "Failed to send OTP. Please try again.";
          // const errtype = "warn";

          const errdata = {
            message: message,
            type: "warn",
          };

          dispatchvalue({ type: "toast", value: errdata })
        }
      });
    // })
    // .catch((error) => {
    //   console.error("Error fetching public key:", error.response?.data || error.message);
    // });
  };


  // -------------------------ABHA OTP----------------------
  const handleOtpSubmit = () => {
    console.log("access_token:", accesstoken);
    // Ensure accesstoken and txnId are available before proceeding


    console.log("OTP Submitted:", otp);
    console.log("Phone Number:", RegisterData.PhoneNo);
    console.log("Payload being sent:", { otp });
    console.log("Transaction ID:", txnId);
    console.log("access_token:", accesstoken);

    // Axios POST request to send OTP
    axios
      .post(`${UrlLink}Frontoffice/abha_OTP_register`, {
        otp: otp,
        PhoneNo: RegisterData.PhoneNo,
        txnId: txnId,
        acctoken: accesstoken,
      })
      .then((response) => {
        const data = response.data;
        console.log("OTP verified successfully:", data);
        console.log("Response Data:", data);

        const { message } = data;

        const tdata = {
          message: message || "OTP verified successfully.",
          type: "success",
        };
        dispatchvalue({ type: "toast", value: tdata });


        console.log("Xtoken", response.data.response.tokens.token)
        const newXToken = response.data.response.tokens.token; // Extract the token

        setXtoken(newXToken); // Store the token in state
        console.log("Stored X_token:", newXToken);
        // alert("OTP verified successfully!");

      })
      .catch((error) => {
        if (error.response) {
          console.error("Error sending OTP:", error.response.data);
          console.error("Error status:", error.response.status);
          const OtpSubmitErr = error.response.data

          const message = OtpSubmitErr?.error?.message

          const errOtpsub = {
            message: message,
            type: "warn",
          }

          dispatchvalue({ type: "toast", value: errOtpsub })

        } else if (error.request) {
          console.error("Error sending OTP - No response:", error.request);
        } else {
          console.error("Error sending OTP - Request setup:", error.message);
        }
      });
  };

  // ------------------------verifyOtpSubmit--------------------------
  const verifyOtpSubmit = () => {
    setMobileOtpVisible(true)
    console.log("Phone Number:", RegisterData.PhoneNo);
    console.log("Transaction ID:", txnId);
    console.log("access_token:", accesstoken);

    axios
      .post(`${UrlLink}Frontoffice/verifyOtpSubmit`, {
        otp: otp,
        PhoneNo: RegisterData.PhoneNo,
        txnId: txnId,
        acctoken: accesstoken,
      })
      .then((response) => {
        const data = response.data;
        console.log("OTP verified successfully:", data);

        const { message } = data
        const tdata = {
          message: message || "New OTP has been successfully sent! Please check your phone.",
          type: "success",
        };
        dispatchvalue({ type: "toast", value: tdata });

        // alert("New OTP has been successfully sent! Please check your phone.");
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error sending OTP:", error.response.data);
          console.error("Error status:", error.response.status);
          const verifyOtp = error.response.data
          const message = verifyOtp?.message
          const verotp = {
            message: message,
            type: "warn",
          }
          dispatchvalue({ type: "toast", value: verotp })

        } else if (error.request) {
          console.error("Error sending OTP - No response:", error.request);
        } else {
          console.error("Error sending OTP - Request setup:", error.message);
        }
      });

  }

  // -----------------------------------handleMobile_OtpSubmit--------------------
  const ABHA_Mobile_OTP = async () => {
    const payload = {
      MobileOtp: Mobile_Otp,
      txnId: txnId,
      acctoken: accesstoken,
    };

    console.log("Payload Sent to Backend:", payload);

    try {
      // Sending the first POST request
      const response = await axios.post(`${UrlLink}Frontoffice/ABHA_Mobile_OTP`, payload);

      console.log("Response from Mobile OTP server:", response.data);
      console.log("response", response)


      const { message } = response.data

      const ABHA_Number = response.data.ABHANumber;
      setABHA_Number(ABHA_Number)
      console.log("ABHA_Number:", ABHA_Number)



      const tdata = {
        message: message || "OTP successfully verified! Your ABHA Number is Created !",
        type: "success",
      };
      dispatchvalue({ type: "toast", value: tdata });

      // alert("OTP successfully verified! Your ABHA Number is Created !");

    }
    catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
        const mobOtp = error.response.data
        const message = mobOtp?.error || mobOtp?.error?.message
        const errMobotp = {
          message: message,
          type: "warn",
        }
        dispatchvalue({ type: "toast", value: errMobotp })


        console.error("HTTP Status Code:", error.response.status);
      } else if (error.request) {
        console.error("No Response from Server:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  // ----------------------------------------------------------------------------------
  const ABHA_Address_Suggestion_API = () => {

    console.log("txnId", txnId);
    console.log("accesstoken", accesstoken);
    const data_to_send = {
      txnId: txnId,
      acctoken: accesstoken,
      abhaaddress: abhadd,

    }

    // Step 1: Make GET request to ABHA API
    axios.post(`${UrlLink}Frontoffice/ABHA_Address_Suggestion_API`, data_to_send)
      .then((suggestionResponse) => {
        console.log("Response from Address Suggestion API:", suggestionResponse.data);

        // // Step 2: Directly select the first address from abhaAddressList
        // const abhaAddressList = suggestionResponse.data.abhaAddressList;
        // const abhaAddress = abhaAddressList[0];  // Always select the first address

        // console.log("Selected ABHA Address:", abhaAddress);

        const resData = suggestionResponse.data;
        console.log(suggestionResponse.data)
        console.log("ABHA address successfully submitted!", suggestionResponse.data.post_response);

        if (resData) {

          const preferredAbhaAddress = resData?.preferredAbhaAddress || "";
          const abhaName = preferredAbhaAddress; // Extract "mukesh01" from "mukesh01@sbx"
          // const abhaName = preferredAbhaAddress.split("@")[0]; // Extract "mukesh01" from "mukesh01@sbx"

          const message = `${abhaName} ABHA Address created successfully`; // Extract the message
          const type = "success"; // You can assign a type, e.g., success or info

          const tdata = {
            message: message,
            type: type,
          };

          dispatchvalue({ type: "toast", value: tdata });
        } else {
          console.error("ABHA address Not submitted!");
        }



        // alert("ABHA address successfully submitted!");
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error details:", error.response.data);

          const AbhaAdd = error.response.data
          let errorMessage = "An unexpected error occurred"; // Default message

          try {
            const parsedError = JSON.parse(AbhaAdd?.error?.abhaAddress || AbhaAdd?.error || AbhaAdd); // Parse error string if needed
            errorMessage = parsedError || parsedError?.message; // Extract message
          } catch (e) {
            console.error("Error parsing response:", e);
          }

          const errAbhaadd = {
            message: errorMessage,
            type: "warn",
          };

          dispatchvalue({ type: "toast", value: errAbhaadd })


        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      });


  };

  // ----------------------------ABHA_card------------------------------------
  const ABHA_card = () => {

    console.log('abhaaaaaaaaaaaaaaaaaa')


    const data_to_send = {
      acctoken: accesstoken,
      xToken: xToken,
      UhidNo:RegisterData?.UHIDNo
    };

    console.log(data_to_send,'data_to_send')

    axios.post(`${UrlLink}Frontoffice/ABHA_card`, data_to_send)
      .then((response) => {
        console.log("Response from API:", response.data);

        const resData = response.data;
        console.log(response.data)
        console.log("ABHA process successfully completed! Your card is ready!", response.data.response_1);
        const { response_1 } = resData;

        if (response_1) {
          const message = response_1.message; // Extract the message
          const type = response_1.message.includes("already exists") ? "warn" : "success"; // Assign type based on the message content


          // const type = "success"; // You can assign a type, e.g., success or info

          const tdata = {
            message: message,
            type: type,
          };

          dispatchvalue({ type: "toast", value: tdata });
        } else {
          console.error("ABHA process Not completed!!!");
        }



        // alert("ABHA process successfully completed! Your card is ready.");
        fetch_abha_data();
      })
      .catch((error) => {

        console.error("Error:", error);
        const FetchAbhaCard = error?.response?.data
        if (error) {
          const message = FetchAbhaCard?.message
          const AbhaCard = {
            message: message,
            type: "warn",
          };
          dispatchvalue({ type: "toast", value: AbhaCard })

        }
        setError("Failed to fetch data. Please try again.");
      });
  };
  // ----------------------------------------

const fetch_abha_data = () => {
  console.log("ABHA_card_get useEffect");

  axios.get(`${UrlLink}Frontoffice/ABHA_card_get`, {
    params: {
      Mobile_No: RegisterData.PhoneNo,
      UHIDNo:RegisterData.UHIDNo
      // ABHA: RegisterData.ABHA, // ✅ Aadhaar number included
    },
  })
    .then((res) => {
      const response = res.data;
      console.log("response:", response);
      console.log("response[].ABHANumber:", response[0]?.ABHANumber);

      const dob = response[0]?.dayOfBirth;
      const currentdate = new Date();
      const selectedDate = new Date(dob);

      const years = differenceInYears(currentdate, selectedDate);
      const months = differenceInMonths(currentdate, selectedDate) % 12;
      const days = differenceInDays(
        currentdate,
        addMonths(addYears(selectedDate, years), months)
      );

      const genderMap = {
        F: "Female",
        M: "Male",
        T: "Transgender",
        O: "Other",
      };

      setRegisterData((prev) => ({
        ...prev,
        ABHA: response[0]?.ABHANumber,
        FirstName: response[0]?.name,
        Gender: genderMap[response[0]?.gender] || response[0]?.gender,
        DOB: dob,
        Age: `${years} Y, ${months} M, ${days} D`,
        Email: response[0]?.email,
        PermanentAddress: response[0]?.address,
        PermanentPincode: response[0]?.pincode,
        PermanentArea: response[0]?.townName,
        PermanentCity: response[0]?.subdistrictName,
        PermanentDistrict: response[0]?.subdistrictName,
        PermanentState: response[0]?.stateName,
      }));
    })
    .catch((err) => console.log(err));
};

useEffect(() => {
    const postdata = {
      PhoneNo: RegisterData.PhoneNo,
      FirstName: RegisterData.FirstName,
      UhidNo:RegisterData?.UHIDNo
 
    };
    axios
      .get(`${UrlLink}Frontoffice/Get_Patient_by_PhoneNo_Using_AbhaRegister`, {
        params: postdata,
      })
      .then((res) => {
        const data = res.data;
        console.log(data, 'dataaaaaaaaa');
 
        setFilterbyPatientId(data);
 
      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    UrlLink,
    RegisterData.PhoneNo,
    RegisterData.FirstName,
    RegisterData?.UHIDNo
 
  ]);
 



const HandlesearchPatient = () => {
  console.log("Search triggered for:", searchQuery);

  const query = searchQuery.toLowerCase().trim();
  if (!query) {
    console.warn("Empty search query");

    const tdata = {
      message: 'Empty search query',
      type: 'warn',
    };

    dispatchvalue({ type: "toast", value: tdata });

    return;
  }

  const filteredPatients = FilterbyPatientId.filter(patient =>
    patient.FirstName.toLowerCase().includes(query) ||
    String(patient.UniqueIdNo) === query
  );

  if (filteredPatients.length > 0) {
    const patient = filteredPatients[0]; // First match
    console.log("Patient Found:", patient);

    axios.get(`${UrlLink}Frontoffice/ABHA_card_get`, {
      params: {
        Mobile_No: patient.PhoneNo,
        UHIDNo: patient.UniqueIdNo, // ✅ Aadhaar number included
      }
    })
      .then(res => {
        if (!res.data.length) {
          console.warn("No ABHA data found!");

          const tdata = {
            message: 'No ABHA data found!',
            type: 'warn',
          };

          dispatchvalue({ type: "toast", value: tdata });

          return;
        }

        const response = res.data[0];
        console.log("ABHA Data:", response);

        const dob = response.dayOfBirth;
        const currentdate = new Date();
        const selectedDate = new Date(dob);

        const years = differenceInYears(currentdate, selectedDate);
        const months = differenceInMonths(currentdate, selectedDate) % 12;
        const days = differenceInDays(currentdate, addMonths(addYears(selectedDate, years), months));

        const genderMap = { F: "Female", M: "Male", T: "Transgender", O: "Other" };

        setRegisterData(prev => ({
          ...prev,
          ABHA: response.ABHANumber,
          FirstName: response.name,
          Gender: genderMap[response.gender] || response.gender,
          DOB: dob,
          Age: `${years} Y, ${months} M, ${days} D`,
          Email: response.email,
          PermanentAddress: response.address,
          PermanentPincode: response.pincode,
          PermanentArea: response.townName,
          PermanentCity: response.subdistrictName,
          PermanentDistrict: response.subdistrictName,
          PermanentState: response.stateName,
        }));
      })
      .catch(err => console.error("ABHA API error:", err));
  } else {
    console.warn("No patient found for:", searchQuery);
  }
};



  // const handleSearchChange = (e) => {
  //   const value = e.target.value;
  //   console.log(value,'valueeeeeeeeeeeee')
  //   setSearchQuery(value);

  //   if (value.trim() === '') {
  //     setRegisterData(prevData => ({
  //           ...prevData,
  //           ABHA: '',
  //           FirstName: '',
  //           Gender: '',
  //           DOB: '',
  //           Age: '',
  //           Email: '',
  //           PermanentPincode: '',
  //           PermanentArea: '',
  //           PermanentCity: '',
  //           PermanentDistrict: '',
  //           PermanentState: '',

  //       }));
  //   }

  //   console.log(value);
  // };




  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value.trim()) {
      // Reset fields when search is empty
      setRegisterData(prev => ({
        ...prev,
        ABHA: '',
        FirstName: '',
        Gender: '',
        DOB: '',
        Age: '',
        Email: '',
        PermanentPincode: '',
        PermanentArea: '',
        PermanentCity: '',
        PermanentDistrict: '',
        PermanentState: '',
      }));
    }
  };


  // --------------------------------------------------------------------------------------------------
  return (



    <>

    <div className="Main_container_app">
      <br />
      <br />
      <div className="RegisFormcon" id="RegisFormcon_11">
        <div className="RegisForm_1">
          <label> Search Here <span>:</span> </label>
          <input
            list="patients"
            type="text"
            placeholder="FirstName/PhoneNumber"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === 'Enter' && HandlesearchPatient()}
          />
          <datalist id="patients">
            {FilterbyPatientId.map((row, indx) => (
              <option key={indx} value={row.UniqueIdNo}>
                {`${row.PhoneNo} | ${row.FirstName} | ${row.UniqueIdNo} `}
              </option>
            ))}
          </datalist>

          <span>
            <PersonSearchIcon onClick={HandlesearchPatient} />
          </span>
        </div>
      </div>
      <br />




      {/* ----------------------Personal Details-------------------- */}


      <div className="RegisFormcon" id="RegisFormcon_11" ref={gridRef}>

        <div className="DivCenter_container">ABHA REGISTRATION</div>


        {UhidNo &&
          UhidNo.filter((p) => p !== "EnterOTP").map((field, index) => (
            <div className="RegisForm_1" key={index}>
              <div className="imp_v_star">
                <label htmlFor={`${field}_${index}`}>
                  {formatLabel(field)}
                  {field === 'PhoneNo' && <span className="requirreg12">*</span>}
                  <span>:</span>
                </label>
              </div>

              {["UHIDType"].includes(field) ? (
                <select
                  id={`${field}_${index}`}
                  name={field}
                  value={RegisterData[field]}
                  onChange={HandleOnchange}
                >
                  <option value="Aadhar">Aadhar</option>
                  {/* {field === "Nationality" &&
                        ["Indian", "International"].map((row, indx) => (
                          <option key={indx} value={row}>
                            {row}
                          </option>
                        ))} */}
                  {/* {field === "UHIDType" &&
                        (RegisterData.Nationality === "International"
                          ? ["DrivingLicence", "Passport"]
                          : ["Aadhar", "VoterId", "SmartCard"] 
                        ).map((row, indx) => (
                          <option key={indx} value={row}>
                            {row}
                          </option>
                        ))} */}
                </select>
              ) : (
                <input
                  id={`${field}_${index}`}
                  autoComplete="off"
                  type={field === "UHIDNo" && "PhoneNo" ? "number" : "text"}
                  name={field}
                  pattern={field === "UHIDNo" ? "\\d{12}" : field === "PhoneNo" ? "\\d{10}" : undefined}
                  maxLength={field === "PhoneNo" ? 10 : field === "UHIDNo" ? 12 : undefined}
                  className={
                    errors[field] === "Invalid"
                      ? "invalid"
                      : errors[field] === "Valid"
                        ? "valid"
                        : ""
                  }
                  required
                  value={RegisterData[field]}
                  onKeyDown={
                    [
                      "UHIDNo", "PhoneNo"
                    ].includes(field)
                      ? handleKeyDownPhoneNo
                      : null}
                  onChange={HandleOnchange}
                />

              )}


            </div>
          ))}
        {/* Button to get OTP */}
        <div className="Main_container_Btn1" style={{ width: "79px" }}>
          <button onClick={ABHAsubmit}>Get OTP</button>
        </div>
        <br />

        {/* OTP Input Box */}
        {otpVisible && (
          <>
            {OtpNumber &&
              OtpNumber.map((field, index) => (
                <div className="RegisForm_1" key={index}>
                  <label htmlFor={`${field}_${index}`}>
                    {formatLabel(field)}
                    <span>:</span>
                  </label>
                  <input
                    id={`${field}_${index}`}
                    autoComplete="off"
                    type="number" // Assuming all fields in OtpNumber relate to OTP and are numeric
                    name={field}
                    maxLength={6}
                    className={
                      errors[field] === "Invalid"
                        ? "invalid"
                        : errors[field] === "Valid"
                          ? "valid"
                          : ""
                    }
                    required
                    value={otp} // Fallback to empty string
                    onKeyDown={handleKeyDownPhoneNo} // Assuming `handleKeyDownPhoneNo` is relevant for all OTP fields
                    onChange={handleOtpChange}
                    aria-invalid={errors[field] === "Invalid"} // Accessibility
                    aria-describedby={`${field}_error`}
                  />
                  {errors[field] === "Invalid" && (
                    <span id={`${field}_error`} className="error-message">
                      Invalid {formatLabel(field)}
                    </span>
                  )}


                </div>



              ))}
            <br />
            <div className="Main_container_Btn1" style={{ width: "79px" }}>
              <button className="submit-otp-btn" onClick={handleOtpSubmit}>
                Submit OTP
              </button>
            </div>
          </>

        )}



        <div className="Main_container_Btn1" style={{ width: "79px" }}>
          <button onClick={verifyOtpSubmit}>verify OTP</button>
        </div>
        <br />
        {/* mobile OTP MobileOtp */}


        {MobileOtpVisible && (
          <>
            {MobileOtp &&
              MobileOtp.map((field, index) => (
                <div className="RegisForm_1" key={index}>
                  <label htmlFor={`${field}_${index}`}>
                    {formatLabel(field)}
                    <span>:</span>
                  </label>
                  <input
                    id={`${field}_${index}`}
                    autoComplete="off"
                    type="number" // Assuming all fields in OtpNumber relate to OTP and are numeric
                    name={field}
                    maxLength={6}
                    className={
                      errors[field] === "Invalid"
                        ? "invalid"
                        : errors[field] === "Valid"
                          ? "valid"
                          : ""
                    }
                    required
                    value={Mobile_Otp} // Fallback to empty string
                    onKeyDown={handleKeyDownPhoneNo} // Assuming `handleKeyDownPhoneNo` is relevant for all OTP fields
                    onChange={handle_OtpChange}
                    aria-invalid={errors[field] === "Invalid"} // Accessibility
                    aria-describedby={`${field}_error`}
                  />
                  {errors[field] === "Invalid" && (
                    <span id={`${field}_error`} className="error-message">
                      Invalid {formatLabel(field)}
                    </span>
                  )}


                </div>





              ))}
            <div className="Main_container_Btn1" style={{ width: "79px" }}>
              <button onClick={ABHA_Mobile_OTP}>Submit OTP</button>
            </div>
            <br />

          </>
          // <div className="RegisForm_1">
          //   <label htmlFor="otpInput">Enter Mobile OTP:</label>
          //   <input
          //     id="otpInput"
          //     type="text"
          //     maxLength={6}
          //     name="Mobile_Otp"
          //     value={Mobile_Otp}
          //     onChange={handle_OtpChange}
          //   />

          // </div>

        )}

        {/* <div className="Main_container_Btn1" style={{ width: "79px" }}>
              <button onClick={ABHA_Address_Suggestion_API}>Suggestion</button>
            </div> */}

        <br />
        {/* ADD Abha Address */}

        {Abhaaddress &&
          Abhaaddress.map((field, index) => (
            <div className="RegisForm_1" key={index}>
              <label htmlFor={`${field}_${index}`}>
                {field === "AbhaAddress" ? "Abha Address" : formatLabel(field)}
                <span>:</span>
              </label>
              <input
                id={`${field}_${index}`}
                autoComplete="off"
                type="text" // Assuming all fields in OtpNumber relate to OTP and are numeric
                name={field}
                className={
                  errors[field] === "Invalid"
                    ? "invalid"
                    : errors[field] === "Valid"
                      ? "valid"
                      : ""
                }
                required
                value={abhadd} // Fallback to empty string
                // onKeyDown={handleKeyDownPhoneNo} // Assuming `handleKeyDownPhoneNo` is relevant for all OTP fields
                // onChange={HandleOnchange}
                onChange={(e) => setAbhaadd(e.target.value)}

                aria-invalid={errors[field] === "Invalid"} // Accessibility
                aria-describedby={`${field}_error`}
              />
              {errors[field] === "Invalid" && (
                <span id={`${field}_error`} className="error-message">
                  Invalid {formatLabel(field)}
                </span>
              )}


            </div>


          ))}




        <div className="Main_container_Btn1" style={{ width: "79px", paddingLeft: "5px" }}>
          <button onClick={ABHA_Address_Suggestion_API}>Submit add</button>
        </div>
        <br />


        <div className="Main_container_Btn1" style={{ width: "79px" }}>
          <button onClick={ABHA_card}>ABHA CARD</button>
        </div>
        <br />
        <br />

      
      </div>

      <div className="RegisFormcon" id="RegisFormcon_11" ref={gridRef}>
        <div className="DivCenter_container">PERSONAL INFORMATION</div>

        {FilteredFormdata &&
          FilteredFormdata.filter((p) => p !== "Photo").map((field, index) => (
            <div className="RegisForm_1" key={index}>
              <label htmlFor={`${field}_${index}`}>
                <div className="imp_v_star">
                  {field === "Title" ||
                    field === "Gender" ||
                    field === "PhoneNo" ||
                    field === "Nationality" ||
                    field === "FirstName" ? (
                    <>
                      {field === "Title" && "Title"}
                      {field === 'Nationality' && 'Nationality'}
                      {field === "Gender" && "Gender"}
                      {field === "PhoneNo" && "Phone No"}
                      {field === "FirstName" && "First Name"}
                      <span className="requirreg12">*</span>{" "}
                    </>
                  ) : field === "DOB" || field === "Age" ? (
                    <>
                      {field === "DOB" && "DOB"}
                      {field === "Age" && "Age"}
                      <span className="requirreg12">**</span>{" "}
                    </>
                  ) : (
                    formatLabel(field)
                  )}
                </div>
                <span>:</span>
              </label>

              {field === "ABHA" ? (
                <input
                  name="ABHA"
                  type="text"
                  maxLength={17}
                  pattern="\d{2}-\d{4}-\d{4}-\d{4}"
                  title="Enter 14-digit ABHA in format: XX-XXXX-XXXX-XXXX"
                  value={RegisterData.ABHA}
                  onChange={HandleOnchange}
                  className={errors.ABHA === "Invalid" ? "invalid" : errors.ABHA === "Valid" ? "valid" : ""}
                />
              ) : [
                "Title",
                "Gender",
                "MaritalStatus",
                "BloodGroup",
                "Religion",
                "Nationality",
                "DoctorName",
                "PatientType",
                "Flagging",
                "InsuranceName",
                "DonationType",
                "InsuranceType",
                "ClientName",
                "ClientEmployeeRelation",
                "EmployeeRelation",
                "EmployeeId",
                "EmployeeRelation",
                "DoctorId",
                "DoctorRelation",
                "CorporateName",
                "CorporateEmployeeRelation",
              ].includes(field) ? (
                <select
                  id={`${field}_${index}`}
                  name={field}
                  value={RegisterData[field]}
                  onChange={HandleOnchange}
                >
                  <option value="">Select</option>
                  {field === "Title" &&
                    TitleNameData.map((row, indx) => (
                      <option key={indx} value={row.id}>
                        {row.Title}
                      </option>
                    ))}
                  {field === "Gender" &&
                    ["Male", "Female", "Transgender"].map((row, indx) => (
                      <option key={indx} value={row}>
                        {row}
                      </option>
                    ))}
                  {field === "MaritalStatus" &&
                    ["Single", "Married", "Divorced", "Widowed"].map(
                      (row, indx) => (
                        <option key={indx} value={row}>
                          {row}
                        </option>
                      )
                    )}
                  {field === "BloodGroup" &&
                    BloodGroupData?.map((row, indx) => (
                      <option key={indx} value={row.id}>
                        {row.BloodGroup}
                      </option>
                    ))}
                  {field === "Religion" &&
                    ReligionData?.map((row, indx) => (
                      <option key={indx} value={row.id}>
                        {row.religion}
                      </option>
                    ))}
                  {field === "Nationality" &&
                    ["Indian", "International"].map((row, indx) => (
                      <option key={indx} value={row}>
                        {row}
                      </option>
                    ))}
                  {field === "UHIDType" && (
                    <>
                      {RegisterData.Nationality === "Indian" &&
                        ["Aadhar", "VoterId", "SmartCard"].map((row, indx) => (
                          <option key={indx} value={row}>
                            {row}
                          </option>
                        ))}
                      {RegisterData.Nationality === "International" &&
                        ["DrivingLicence", "Passport"].map((row, indx) => (
                          <option key={indx} value={row}>
                            {row}
                          </option>
                        ))}
                    </>
                  )}
                  {field === "PatientType" &&
                    ["General", "VIP", "Govt"].map((row, indx) => (
                      <option key={indx} value={row}>
                        {row}
                      </option>
                    ))}
                  {field === "Flagging" &&
                    FlaggData?.filter((p) => p.Status === "Active").map(
                      (row, indx) => (
                        <option
                          key={indx}
                          value={row.id}
                          style={{ backgroundColor: row.FlaggColor }}
                        >
                          {row.FlaggName}
                        </option>
                      )
                    )}
                  {field === "InsuranceType" &&
                    ["Cashless", "Reimbursable"].map((row, indx) => (
                      <option key={indx} value={row}>
                        {row}
                      </option>
                    ))}
                  {[
                    "ClientEmployeeRelation",
                    "EmployeeRelation",
                    "DoctorRelation",
                    "CorporateEmployeeRelation",
                  ].includes(field) &&
                    relationships?.map((row, indx) => (
                      <option key={indx} value={row}>
                        {row}
                      </option>
                    ))}
                  {["EmployeeId", "EmployeeRelation"].includes(field) &&
                    EmployeeData?.map((row, indx) => (
                      <option key={indx} value={row.id}>
                        {row.Name}
                      </option>
                    ))}
                  {["DoctorId", "DoctorRelation"].includes(field) &&
                    DoctorIdData?.filter(
                      (p) => p.id !== RegisterData.DoctorName
                    ).map((row, indx) => (
                      <option key={indx} value={row.id}>
                        {row.ShortName}
                      </option>
                    ))}
                  {field === "ClientName" &&
                    ClientData?.map((row, indx) => (
                      <option key={indx} value={row.id}>
                        {row.Name}
                      </option>
                    ))}
                  {field === "CorporateName" &&
                    CorporateData?.map((row, indx) => (
                      <option key={indx} value={row.id}>
                        {row.Name}
                      </option>
                    ))}
                  {field === "InsuranceName" &&
                    InsuranceData?.map((row, indx) => (
                      <option key={indx} value={row.id}>
                        {row?.Type === "MAIN"
                          ? `${row?.Name} - ${row?.Type}`
                          : `${row?.Name} - ${row?.Type} - ${row?.TPA_Name}`}
                      </option>
                    ))}
                  {field === "DonationType" &&
                    DonationData?.map((row, indx) => (
                      <option
                        key={indx}
                        value={row.id}
                      >{`${row?.Type} - ${row?.Name}`}</option>
                    ))}
                </select>
              ) : ["ExistingPtNo", "PhoneNo", "FirstName", "PatientId"].includes(field) ? (
                <div className="Search_patient_icons">
                  {field === "FirstName" ? (
                    <>
                      <input
                        id={`${field}_${index}`}
                        type="text"
                        list={`${field}_list`}
                        autoComplete="off"
                        name={field}
                        pattern="[A-Za-z/]+"
                        className={
                          errors[field] === "Invalid"
                            ? "invalid"
                            : errors[field] === "Valid"
                              ? "valid"
                              : ""
                        }
                        required
                        value={RegisterData[field]}
                        onChange={HandleOnchangeunique}
                        onKeyDown={handleKeyDownText}
                      />
                      <datalist id={`${field}_list`}>
                        {ExistPatientList?.map((name, idx) => (
                            <option key={idx} value={`${name.FirstName} | ${name.PhoneNo}`} />
                        ))}
                      </datalist>
                    </>
                  ) : (
                    <input
                      id={`${field}_${index}`}
                      type="text"
                      onKeyDown={
                        field === "PhoneNo" || field === "ExistingPtNo"
                          ? handleKeyDownPhoneNo
                          : null
                      }
                      list={`${field}_iddd`}
                      autoComplete="off"
                      name={field}
                      pattern={
                        field === "PhoneNo" ? "\\d{10}" :
                        field === "ExistingPtNo" ? "\\d{1,10}" :
                        "[A-Za-z/]+"
                      }
                      className={
                        errors[field] === "Invalid"
                          ? "invalid"
                          : errors[field] === "Valid"
                            ? "valid"
                            : ""
                      }
                      readOnly={field === "PatientId"}
                      required={field !== "PatientId"}
                      value={RegisterData[field]}
                      onChange={HandleOnchange}
                    />
                  )}
                </div>
              ) : [
                "CorporateType",
                "ClientType",
              ].includes(field) ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "135px",
                  }}
                >
                  <label style={{ width: "auto" }} htmlFor={`${field}_yes`}>
                    <input
                      required
                      id={`${field}_yes`}
                      type="radio"
                      name={field}
                      value={
                        field === "ClientType"
                          ? "Self"
                          : field === "CorporateType"
                            ? "Company"
                            : "Yes"
                      }
                      style={{ width: "15px" }}
                      checked={
                        field === "ClientType"
                          ? RegisterData[field] === "Self"
                          : field === "CorporateType"
                            ? RegisterData[field] === "Company"
                            : RegisterData[field] === "Yes"
                      }
                      onChange={(e) =>
                        setRegisterData((prevState) => ({
                          ...prevState,
                          [field]:
                            field === "ClientType"
                              ? "Self"
                              : field === "CorporateType"
                                ? "Company"
                                : "Yes",
                        }))
                      }
                    />
                    {field === "ClientType"
                      ? "Self"
                      : field === "CorporateType"
                        ? "Company"
                        : "Yes"}
                  </label>
                  <label style={{ width: "auto" }} htmlFor={`${field}_No`}>
                    <input
                      required
                      id={`${field}_No`}
                      type="radio"
                      name={field}
                      value={
                        field === "ClientType"
                          ? "Relative"
                          : field === "CorporateType"
                            ? "Individual"
                            : "No"
                      }
                      style={{ width: "15px" }}
                      checked={
                        field === "ClientType"
                          ? RegisterData[field] === "Relative"
                          : field === "CorporateType"
                            ? RegisterData[field] === "Individual"
                            : RegisterData[field] === "No"
                      }
                      onChange={(e) =>
                        setRegisterData((prevState) => ({
                          ...prevState,
                          [field]:
                            field === "ClientType"
                              ? "Relative"
                              : field === "CorporateType"
                                ? "Individual"
                                : "No",
                        }))
                      }
                    />
                    {field === "ClientType"
                      ? "Relative"
                      : field === "CorporateType"
                        ? "Individual"
                        : "No"}
                  </label>
                </div>
              ) : field === "Age" ? (
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  <input
                    type="number"
                    placeholder="Age"
                    value={ageUnit === "Years" ? ageYears : ageUnit === "Months" ? ageMonths : ageDays}
                    onChange={(e) => {
                      if (ageUnit === "Years") {
                        handleAgeYearsChange(e.target.value);
                      } else if (ageUnit === "Months") {
                        handleAgeMonthsChange(e.target.value);
                      } else if (ageUnit === "Days") {
                        handleAgeDaysChange(e.target.value);
                      }
                    }}
                    style={{ width: "60px" }}
                    min="0"
                    max={ageUnit === "Years" ? "120" : ageUnit === "Months" ? "1440" : "43800"}
                  />
                  <select
                    value={ageUnit}
                    onChange={(e) => handleAgeUnitChange(e.target.value)}
                    style={{ width: "80px" }}
                  >
                    <option value="Years">Years</option>
                    <option value="Months">Months</option>
                    <option value="Days">Days</option>
                  </select>
                </div>
              ) : (
                <input
                  id={`${field}_${index}`}
                  autoComplete="off"
                  type={
                    field === "DOB" || field === "DateOfReg" || field === "LastVisitDate" ? "date"
                      : field === "UHIDNo" || field === "ExistingPtNo"
                        ? "number"
                        : "text"
                  }
                  name={field}
                  {...(field === "Email" ? { pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[cC][oO][mM]$" } :
                    field === "PhoneNo" ? { pattern: "\\d{10}" } :
                      field === "ExistingPtNo" ? { pattern: "\\d{1,15}" } :
                        field === "UHIDNo" ? { pattern: "\\d{12}" } :
                          // field === "Age" ? { pattern: "\\d{1,3}" } :
                            {})}
                  className={
                    errors[field] === "Invalid"
                      ? "invalid"
                      : errors[field] === "Valid"
                        ? "valid"
                        : ""
                  }
                  required
                  placeholder={field === "Age" ? "e.g. 24y 8m 8d or 24" : undefined}
                  value={RegisterData[field]}
                  onKeyDown={
                    [
                      "MiddleName",
                      "SurName",
                      "Street",
                      "Area",
                      "City",
                      "District",
                      "State",
                      "Country",
                    ].includes(field)
                      ? handleKeyDownTextRegistration
                      : field === "PhoneNo" || field === "ExistingPtNo"
                        ? handleKeyDownPhoneNo
                        : null
                  }
                  onChange={HandleOnchange}
                />
              )}
            </div>
          ))}

        {UhidNo &&
          UhidNo.filter((p) => p !== "PhoneNo").map((field, index) => (
            <div className="RegisForm_1" key={index}>
              <label htmlFor={`${field}_${index}`}>
                {formatLabel(field)}
                <span>:</span>
              </label>
              {["UHIDType", "Nationality"].includes(field) ? (
                <select
                  id={`${field}_${index}`}
                  name={field}
                  value={RegisterData[field]}
                  onChange={HandleOnchange}
                >
                  <option value="">Select</option>
                  {field === "Nationality" &&
                    ["Indian", "International"].map((row, indx) => (
                      <option key={indx} value={row}>
                        {row}
                      </option>
                    ))}
                  {field === "UHIDType" &&
                    (RegisterData.Nationality === "International"
                      ? ["DrivingLicence", "Passport"]
                      : ["Aadhar", "VoterId", "SmartCard"]
                    ).map((row, indx) => (
                      <option key={indx} value={row}>
                        {row}
                      </option>
                    ))}
                </select>
              ) : (
                <input
                  id={`${field}_${index}`}
                  autoComplete="off"
                  type={field === "UHIDNo" ? "number" : "text"}
                  name={field}
                  pattern={field === "UHIDNo" ? "\\d{12}" : undefined}
                  className={
                    errors[field] === "Invalid"
                      ? "invalid"
                      : errors[field] === "Valid"
                        ? "valid"
                        : ""
                  }
                  required
                  value={RegisterData[field]}
                  onChange={HandleOnchange}
                />
              )}
            </div>
          ))}
      </div>


      {/* ----------------------Address-------------------- */}

      <div className="RegisFormcon" id="RegisFormcon_11" ref={gridRef}>
        <div className="DivCenter_container">Permanent Address</div>

        {FilteredFormdataPermanentAddress &&
          FilteredFormdataPermanentAddress.map((field, index) => (
            <div className="RegisForm_1" key={index}>
              {field === "PermanentAddressSameAsAbove" ? (
                <>
                  <label htmlFor={`${field}_${index}`}>
                    {/* {
                            field === 'DoorNo' || field === 'PermanentdoorNo'
                              ? 'DoorNo / House Name'
                              : field === 'PermanentAddressSameAsAbove'
                              ? 'Communication Address Same As Above ?'
                              : formatLabel(field)
                          } */}

                    {field === 'DoorNo' ? 'DoorNo / House Name' : field === 'PermanentdoorNo' ? 'DoorNo / House Name' : field === 'PermanentAddressSameAsAbove' ? 'Communication Address Same As Above ?' : formatLabel(field)}
                    <span>:</span>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      width: "120px",
                      gap: "10px",
                    }}
                  >
                    <label style={{ width: "auto" }} htmlFor={`${field}_yes`}>
                      <input
                        required
                        id={`${field}_yes`}
                        type="radio"
                        name={field}
                        value="Yes"
                        style={{ width: "15px" }}
                        checked={RegisterData[field] === "Yes"}
                        onChange={(e) =>
                          setRegisterData((prevState) => ({
                            ...prevState,
                            [field]: "Yes",
                          }))
                        }
                      />
                      Yes
                    </label>
                    <label style={{ width: "auto" }} htmlFor={`${field}_no`}>
                      <input
                        required
                        id={`${field}_no`}
                        type="radio"
                        name={field}
                        value="No"
                        style={{ width: "15px" }}
                        checked={RegisterData[field] === "No"}
                        onChange={(e) =>
                          setRegisterData((prevState) => ({
                            ...prevState,
                            [field]: "No",
                          }))
                        }
                      />
                      No
                    </label>
                  </div>
                </>
              ) : field === "PermanentState" ? (
                <>
                  <label htmlFor={`${field}_${index}`}>State<span>:</span></label>
                  <input
                    id={`${field}_${index}`}
                    name={field}
                    value={RegisterData[field]}
                    onChange={HandleOnchange}
                    list="permanent-state-list"
                  />
                  <datalist id="permanent-state-list">
                    {stateList.map((state, i) => (
                      <option key={i} value={state} />
                    ))}
                  </datalist>
                </>
              ) : field === "PermanentDistrict" ? (
                <>
                  <label htmlFor={`${field}_${index}`}>District<span>:</span></label>
                  <input
                    id={`${field}_${index}`}
                    name={field}
                    value={RegisterData[field]}
                    onChange={HandleOnchange}
                    list="permanent-district-list"
                  />
                  <datalist id="permanent-district-list">
                    {districtList.map((dist, i) => (
                      <option key={i} value={dist} />
                    ))}
                  </datalist>
                </>
              ) : field === "PermanentCity" ? (
                <>
                  <label htmlFor={`${field}_${index}`}>City<span>:</span></label>
                  <input
                    id={`${field}_${index}`}
                    name={field}
                    value={RegisterData[field]}
                    onChange={HandleOnchange}
                    list="permanent-city-list"
                  />
                  <datalist id="permanent-city-list">
                    {cityList.map((city, i) => (
                      <option key={i} value={city} />
                    ))}
                  </datalist>
                </>
              ) : (
                <>
                  <label htmlFor={`${field}_${index}`}>
                    {
                      field === "PermanentPincode" ? "Pincode" :
                        field === "PermanentdoorNo" ? "DoorNo / HouseName" :
                          field === "PermanentStreet" ? "Street" :
                            field === "PermanentArea" ? "Area" :
                              field === "PermanentCity" ? "City" :
                                field === "PermanentDistrict" ? "District" :
                                  field === "PermanentState" ? "State" :
                                    field === "PermanentCountry" ? "Country" :

                                      formatLabel(field)}
                    <span>:</span>
                  </label>
                  <input
                    id={`${field}_${index}`}
                    autoComplete="off"
                    type={field === "PermanentPincode" ? "number" : "text"}
                    name={field}
                    pattern={
                      field === "PermanentPincode"
                        ? "\\d{6,7}" // Pattern for 6-7 digit numbers
                        : field === "PermanentdoorNo"
                          ? "[A-Za-z0-9]+" // Alphanumeric pattern
                          : "[A-Za-z]+" // Alphabetic pattern
                    }
                    className={
                      errors[field] === "Invalid"
                        ? "invalid"
                        : errors[field] === "Valid"
                          ? "valid"
                          : ""
                    }
                    value={RegisterData[field]} // Ensure controlled input
                    onChange={HandleOnchange}
                  />
                </>

              )}


            </div>
          ))}

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
                  {RegisterData.Photo ? (
                    <div>
                      <img
                        src={RegisterData.Photo}
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
                  Selectedfileview(RegisterData.Photo);
                }}
              >
                <VisibilityIcon />
              </button>
            </div>
          </div>
        </div>

        {RegisterData.PermanentAddressSameAsAbove === "No" ? (
          <>
            <div className="DivCenter_container"> Communication Address</div>

            {FilteredFormdataAddress &&
              FilteredFormdataAddress.map((field, index) => (
                <div className="RegisForm_1" key={index}>
                  {field === "PermanentAddressSameAsAbove" ? (
                    <>
                      <label htmlFor={`${field}_${index}`}>
                        {/* {
                              field === 'DoorNo' || field === 'PermanentdoorNo'
                              ? 'DoorNo / House Name'
                              : field === 'PermanentAddressSameAsAbove'
                              ? 'Communication Address Same As Above ?'
                              : formatLabel(field)
                            } */}

                        {field === 'PermanentAddressSameAsAbove' ? 'Communication Address Same As Above ?' : formatLabel(field)}
                        <span>:</span>
                      </label>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          width: "120px",
                          gap: "10px",
                        }}
                      >
                        <label style={{ width: "auto" }} htmlFor={`${field}_yes`}>
                          <input
                            required
                            id={`${field}_yes`}
                            type="radio"
                            name={field}
                            value="Yes"
                            style={{ width: "15px" }}
                            checked={RegisterData[field] === "Yes"}
                            onChange={(e) =>
                              setRegisterData((prevState) => ({
                                ...prevState,
                                [field]: "Yes",
                              }))
                            }
                          />
                          Yes
                        </label>
                        <label style={{ width: "auto" }} htmlFor={`${field}_no`}>
                          <input
                            required
                            id={`${field}_no`}
                            type="radio"
                            name={field}
                            value="No"
                            style={{ width: "15px" }}
                            checked={RegisterData[field] === "No"}
                            onChange={(e) =>
                              setRegisterData((prevState) => ({
                                ...prevState,
                                [field]: "No",
                              }))
                            }
                          />
                          No
                        </label>
                      </div>
                    </>
                  ) : (
                    <>
                      <label htmlFor={`${field}_${index}`}>
                        {
                          field === 'DoorNo' || field === 'PermanentdoorNo'
                            ? 'DoorNo / HouseName'
                            : field === 'PermanentAddressSameAsAbove'
                              ? 'Communication Address Same As Above ?'
                              : formatLabel(field)
                        }
                        {/* {formatLabel(field)} */}
                        <span>:</span>
                      </label>
                      <input
                        id={`${field}_${index}`}
                        autoComplete="off"
                        type={field === "Pincode" ? "number" : "text"}
                        name={field}
                        pattern={
                          field === "Pincode"
                            ? "\\d{6,7}"
                            : ["DoorNo"].includes(field)
                              ? "[A-Za-z0-9]+"
                              : "[A-Za-z]+"
                        }
                        className={
                          errors[field] === "Invalid"
                            ? "invalid"
                            : errors[field] === "Valid"
                              ? "valid"
                              : ""
                        }
                        value={RegisterData[field]}
                        onChange={HandleOnchange}
                      />
                    </>
                  )}
                </div>
              ))}

          </>
        ) : null}

      </div>


      {/* ----------------------Document-------------------- */}


      <div className="Main_container_Btn">
        <button
          onClick={handleSaveClick}
          className={`px-4 py-2 rounded ${UserData?.Create
              ? "bg-blue-500 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        // disabled={!UserData?.Create}
        >
          Save
        </button>
      </div>



      {loading && (
        <div className="loader">
          <div className="Loading">
            <div className="spinner-border"></div>
            <div>Loading...</div>
          </div>
        </div>
      )}

      {/* {selectedrow && (
        <div className="loader_001" onClick={() => setselectedrow(false)}>
          <div
            className="loader_register_roomshow_002"
            onClick={(e) => e.stopPropagation()}
          >

            <SmartCard rowData={smartCardDetailes} />


            <br />



          </div>
        </div>
      )} */}


            <div className="RegisFormcon_1" style={{ marginTop: '10px' }}>
          <div className="RegisForm_1">
                <label>Patient Id<span>:</span></label>
                <input
                  type="text"
                  name="searchpid"
                  list="pids"
                  value={SearchQueryfilter.searchpid}
                  onChange={handleSearchChangefilter}
                />
                <datalist id="pids">
                  {Patientidsearch.map((opdr, index) => (
                    <option key={index} value={opdr} />
                  ))}
                </datalist>
              </div>

                     <div className="RegisForm_1">
                <label>Patient Name<span>:</span></label>
                <input
                  type="text"
                  name="searchpname"
                  list="pnames"
                  value={SearchQueryfilter.searchpname}
                  onChange={handleSearchChangefilter}
                />
                <datalist id="pnames">
                  {Patientnamesearch.map((opdr, index) => (
                    <option key={index} value={opdr} />
                  ))}
                </datalist>
              </div>

            <div className="RegisForm_1">
                <label>Mobile<span>:</span></label>
                <input
                  type="text"
                  name="searchmobile"
                  list="pmobiles"
                  value={SearchQueryfilter.searchmobile}
                  onChange={handleSearchChangefilter}
                />
                <datalist id="pmobiles">
                  {Patientphonenoserach.map((opdr, index) => (
                    <option key={index} value={opdr} />
                  ))}
                </datalist>
              </div>
              </div>






      {/* <ToastContainer /> */}
      <ModelContainer />
      <ToastAlert Message={toast.message} Type={toast.type} />

      <ReactGrid columns={PatientRegisterColumns} RowData={filteredPatientData} />

      {/* <ToastAlert Message={toast.message} Type={toast.type} /> */}

      {/* {RegisterRoomShow.val && <RoomDetialsSelect />} */}
      <br />
    </div>
    </>
  );

};

export default MRDNewRegistration;
