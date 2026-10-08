import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import debounce from 'lodash.debounce'
import {
  differenceInYears,
  format,
  startOfYear,
  subYears,
  isBefore
} from 'date-fns'
import axios from 'axios'
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoBedOutline } from 'react-icons/io5'
import profile from '../../Assets/profileimg.jpeg'
import '../../App.css'
import { handleKeyDownText } from '../../OtherComponent/OtherFunctions'
import { handleKeyDownPhoneNo } from '../../OtherComponent/OtherFunctions'
// handleKeyDownTextRegistration
import { handleKeyDownTextRegistration } from '../../OtherComponent/OtherFunctions'
import RoomDetialsSelect from './RoomDetialsSelect'
import Button from '@mui/material/Button'
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import { useLocation } from 'react-router-dom';
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";

import Webcam from "react-webcam";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import ModelContainer from "../../OtherComponent/ModelContainer/ModelContainer";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Ownregistration = () => {
  const dispatchvalue = useDispatch()
  const navigate = useNavigate()

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const id = queryParams.get('id');
  const name = queryParams.get('name');
  const type = queryParams.get('type');


  const relationships = [
    'Spouse',
    'Father',
    'Mother',
    'Brother',
    'Sister',
    'Father-in-law',
    'Mother-in-law',
    'Grandfather',
    'Grandmother',
    'Son',
    'Daughter',
    'Grandson',
    'Granddaughter',
    'Son-in-law',
    'Daughter-in-law',
    'Uncle',
    'Aunt',
    'Nephew',
    'Niece',
    'Cousin',
    'Step-father',
    'Step-mother',
    'Step-son',
    'Step-daughter'
  ]

  const [AppointmentRegisType, setAppointmentRegisType] = useState('OP')
  const Registeredit = useSelector(state => state.Frontoffice?.Registeredit)
  const UrlLink = useSelector(state => state.userRecord?.UrlLink)
  const UserData = useSelector(state => state.userRecord?.UserData)
  console.log('UserData', UserData)
  const [errors, setErrors] = useState({});

  const toast = useSelector(state => state.userRecord?.toast)
  const RegisterRoomShow = useSelector(
    state => state.Frontoffice?.RegisterRoomShow
  )
  const SelectRoomRegister = useSelector(
    state => state.Frontoffice?.SelectRoomRegister
  )
  const [loading, setLoading] = useState(false)
  const [SpecializationData, setSpecializationData] = useState([])
  const [DoctorData, setDoctorData] = useState([])
  const [TokenData, setTokenData] = useState([]);
  const [ReferralDoctorData, setReferralDoctorData] = useState([])
  const [EmployeeData, setEmployeeData] = useState([])
  console.log(EmployeeData, 'qqqqqqqqqqqqq')

  const [DoctorIdData, setDoctorIdData] = useState([])
  const [FlaggData, setFlaggData] = useState([])
  const [ReligionData, setReligionData] = useState([])
  const [AllDoctorData, setAllDoctorData] = useState([])
  const [InsuranceData, setInsuranceData] = useState([])
  const [ClientData, setClientData] = useState([])
  const [CorporateData, setCorporateData] = useState([])
  const [DonationData, setDonationData] = useState([])
  const [BloodGroupData, setBloodGroupData] = useState([])
  const [TitleNameData, setTitleNameData] = useState([]);
  const [PatientRegisterDetails, setPatientRegisterDetails] = useState({});

  // Function to format date as MM/DD/YYYY
  const formatDate = date => {
    const d = new Date(date)
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    const year = d.getFullYear()
    return `${year}-${month}-${day}`
  }

  const [FilterbyPatientId, setFilterbyPatientId] = useState([])
  const [FilteredFormdata, setFilteredFormdata] = useState(null)
  const [FilteredFormdataAddress, setFilteredFormdataAddress] = useState(null)
  const [FilteredFormdataRoute, setFilteredFormdataRoute] = useState(null)
  const [FilteredFormdataIpDetials, setFilteredFormdataIpDetials] =
    useState(null)
  const [FilteredFormdataIpRoomDetials, setFilteredFormdataIpRoomDetials] =
    useState(null)
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
      Title: "",
      FirstName: "",
      MiddleName: "",
      SurName: "",
      Gender: "",
      MaritalStatus: "Single",
      SpouseName: "",
      FatherName: "",
      // AliasName: '',
      DOB: "",
      Age: "",
      PhoneNo: "",
      Email: "",
      BloodGroup: "",
      Occupation: "",
      Religion: "",
      Nationality: "",
      UHIDType: "",
      UHIDNo: "",
  
      PatientType: "",
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
      Country: "",
      ABHA: "",
      Photo: null,
    });
  
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
  
  
  
  //   useEffect(() => {
  //     axios.get(`${UrlLink}Frontoffice/Register_Patients_Details`)
  //     .then((res) => {
  //         const data = res.data;
  //         if (Array.isArray(data)) {
  //             setPatientData(data);
  //         } else {
  //             setPatientData([]);
  //         }
  //     })
  //     .catch((err) => {
  //         console.log(err);
  //     });
  // }, [UrlLink,IsGetData]);
  
  
  // const PatientRegisterColumns = [
  //   { key: "id", name: "ID" },
  //   { key: "PatientId", name: "Patient Id" },
  //   { key: "FullName", name: "Patient Name" },
  //   { key: "PhoneNo", name: "PhoneNo" },
  //   { key: "Gender", name: "Gender" },
  //   // { key: "Email", name: "Email" },
  //   {
  //     key: "Action",
  //     name: "Action",
  //     renderCell: (params) => {
  //       console.log(params.row,'params.row');
        
  //       return (
  //         <>
  //           <Button
  //             className="cell_btn"
  //             onClick={() => handleNavigateOP(params.row)} // Pass row data to handleNavigateOP
  //           >
  //             OP
  //           </Button>
  //           <Button
  //             className="cell_btn"
  //             onClick={() => handleNavigateIP(params.row)} // Pass row data to handleNavigateIP
  //           >
  //             IP
  //           </Button>
  //         </>
  //       );
  //     },
  //   },
    
  // ];
  
  
  
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
            // axios
            //   .get(`${UrlLink}Frontoffice/get_patient_visit_details`, {
            //     params: postdata
            //   })
            //   .then(res => {
            //     const visit = res.data?.VisitType
            //     console.log('Vissssss', res.data)
  
            //     setRegisterData(prev => ({
            //       ...prev,
            //       VisitType: visit
            //     }))
            //   })
            //   .catch(err => {
            //     console.log(err)
            //   })
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (
        Object.keys(Registeredit).length > 0 &&
        Registeredit.appconversion
      ) {
        setRegisterData((prev) => ({
          ...prev,
          Title: Registeredit.TitleId || "",
          FirstName: Registeredit.FirstName || "",
          MiddleName: Registeredit.MiddleName || "",
          SurName: Registeredit.LastName || "",
          Gender: Registeredit.Gender || "",
          PhoneNo: Registeredit.PhoneNumber || "",
          Email: Registeredit.Email || "",
        }));
      }
    }, [
      UrlLink,
      Registeredit,
      RegisterData.PatientId,
      RegisterData.PhoneNo,
      RegisterData.FirstName,
    ]);
  
    useEffect(() => {
      let fdata = Object.keys(RegisterData).filter(
        (p) =>
          ![
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
        ].includes(p)
      );
      setFilteredFormdataAddress(Addressdata);
  
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
  
    // const HandleSearchchange = (e) => {
    //   const { name, value } = e.target;
    //   setpatientsearch((prev) => ({
    //     ...prev,
    //     [name]: value,
    //   }));
    // };
  
    // const HandlesearchPatient = (value) => {
    //   const exist = FilterbyPatientId.find((f) => f.PatientId === value);
    //   if (!exist) {
    //     const tdata = {
    //       message: "Please enter a valid Patient Id",
    //       type: "warn",
    //     };
    //     dispatchvalue({ type: "toast", value: tdata });
    //   } else {
    //     axios
    //       .get(
    //         `${UrlLink}Frontoffice/get_Patient_Details_by_patientId?PatientId=${value}`
    //       )
    //       .then((res) => {
    //         const { PatientProfile, PatientId, AliasName, ...resss } = res.data;
    //         console.log("paaatttttttttt", res.data);
  
    //         setRegisterData(res?.data)
    //       })
    //       .catch((err) => console.log(err));
    //   }
    // };
  
    const HandleOnchange = async (e) => {
      const { name, value, pattern } = e.target;
  
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
        "Street",
        "Area",
        "City",
        "District",
        "State",
        "Country",
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
          Nationality: "",
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
      } else if (name === "Title") {
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
          const age = differenceInYears(currentdate, selectedDate);
  
          setRegisterData((prevFormData) => ({
            ...prevFormData,
            [name]: formattedValue,
            Age: age,
          }));
        } else {
          setRegisterData((prevFormData) => ({
            ...prevFormData,
            [name]: formattedValue,
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
              DOB: format(formattedDOB, "yyyy-MM-dd"),
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
  
      // else if (name === 'DoctorName') {
      //   setRegisterData(prev => ({
      //     ...prev,
      //     [name]: formattedValue
      //   }))
  
      //   // Filter for the selected doctor based on the doctor_id
      //   const doctor_list = DoctorData.find(
      //     doc => doc.doctor_id === formattedValue
      //   )
  
      //   // Check if the doctor was found
      //   if (doctor_list) {
      //     const doctor_schedule = doctor_list.schedule?.[0] // Access the first schedule in the doctor's schedule list
      //     console.log('RequestedSchedule', doctor_schedule)
  
      //     if (doctor_schedule?.working === 'yes') {
      //       const currentTime = new Date()
  
      //       // Single Shift
      //       if (doctor_schedule?.shift === 'Single') {
      //         const startTime = doctor_schedule.starting_time
      //         const endTime = doctor_schedule.ending_time
  
      //         // Convert schedule times to Date objects
      //         const startTimeDate = new Date(`1970-01-01T${startTime}Z`)
      //         const endTimeDate = new Date(`1970-01-01T${endTime}Z`)
  
      //         // Check if the current time is within the available time
      //         if (currentTime >= startTimeDate && currentTime <= endTimeDate) {
      //           const tdata = {
      //             message: `The Doctor is currently Available`,
      //             type: 'success'
      //           }
      //           dispatchvalue({ type: 'toast', value: tdata })
      //         } else {
      //           const tdata = {
      //             message: `The Doctor is not Available at this time, Available from ${startTime} to ${endTime}`,
      //             type: 'warn'
      //           }
      //           dispatchvalue({ type: 'toast', value: tdata })
      //         }
      //       }
  
      //       // Double Shift
      //       else if (doctor_schedule?.shift === 'Double') {
      //         const startTime_f = doctor_schedule.starting_time_f
      //         const endTime_f = doctor_schedule.ending_time_f
      //         const startTime_a = doctor_schedule.starting_time_a
      //         const endTime_a = doctor_schedule.ending_time_a
  
      //         // Convert schedule times to Date objects
      //         const startTimeDate_f = new Date(`1970-01-01T${startTime_f}Z`)
      //         const endTimeDate_f = new Date(`1970-01-01T${endTime_f}Z`)
      //         const startTimeDate_a = new Date(`1970-01-01T${startTime_a}Z`)
      //         const endTimeDate_a = new Date(`1970-01-01T${endTime_a}Z`)
  
      //         // Check if the current time falls within either shift (forenoon or afternoon)
      //         if (
      //           (currentTime >= startTimeDate_f &&
      //             currentTime <= endTimeDate_f) ||
      //           (currentTime >= startTimeDate_a && currentTime <= endTimeDate_a)
      //         ) {
      //           const tdata = {
      //             message: `The Doctor is currently Available`,
      //             type: 'success'
      //           }
      //           dispatchvalue({ type: 'toast', value: tdata })
      //         } else {
      //           const tdata = {
      //             message: `The Doctor is not Available at this time, Available in FN: ${startTime_f} to ${endTime_f} or AN: ${startTime_a} to ${endTime_a}`,
      //             type: 'warn'
      //           }
      //           dispatchvalue({ type: 'toast', value: tdata })
      //         }
      //       }
      //     }
      //   } else {
      //     const tdata = {
      //       message: 'Doctor not found',
      //       type: 'error'
      //     }
      //     dispatchvalue({ type: 'toast', value: tdata })
      //   }
      // }
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
  
        axios
          .get(
            `${UrlLink}Frontoffice/get_location_by_pincode?pincode=${formattedValue}`
          )
          .then((reponse) => {
            let data = reponse.data;
            console.log("ressss", data);
            if (formattedValue.length > 5) {
              const { country, state, city, district } = data;
              setRegisterData((prev) => ({
                ...prev,
                Country: country,
                State: state,
                City: city,
                District: district,
              }));
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setRegisterData((prev) => ({
          ...prev,
          [name]: formattedValue,
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
  
      const error = validateField(value, pattern);
      console.log(error, "error");
  
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    };
  
    // const handleNavigateOP = () => {
    //   dispatchvalue({ type: "HrFolder", value: "OPVisitEntry" });
    //   dispatchvalue({ type: "PatientDetails", value: PatientData });
    //   // dispatchvalue({ type: "PatientDetails", value: PatientRegisterDetails });
    //   navigate("/Home/FrontOfficeFolder");
    // };
  
    // const handleNavigateIP = () => {
    //   dispatchvalue({ type: "HrFolder", value: "IPRegistration" });
    //   dispatchvalue({ type: "PatientDetails", value: PatientRegisterDetails });
    //   navigate("/Home/FrontOfficeFolder");
    // };
  
  
    // const handleNavigateOP = async (row) => {
    //   try {
    //     const response = await axios.get(`${UrlLink}Frontoffice/Fetch_Register_Patients_Details`, {
    //       params: { PatientId: row.PatientId }, // Send PatientId as a query parameter
    //     });
    //     const patientData = response.data;
    //     console.log(patientData, "Fetched Patient Data for OP");
    //     dispatchvalue({ type: "HrFolder", value: "OPVisitEntry" });
    //     dispatchvalue({ type: "PatientDetails", value: patientData });
    //     navigate("/Home/FrontOfficeFolder");
    //   } catch (error) {
    //     console.error("Error fetching patient data for OP:", error);
    //   }
    // };
    
    // const handleNavigateIP = async (row) => {
    //   try {
    //     const response = await axios.get(`${UrlLink}Frontoffice/Fetch_Register_Patients_Details`, {
    //       params: { PatientId: row.PatientId }, // Send PatientId as a query parameter
    //     });
    //     const patientData = response.data;
    //     console.log(patientData, "Fetched Patient Data for IP");
    //     dispatchvalue({ type: "HrFolder", value: "IPRegistration" });
    //     dispatchvalue({ type: "PatientDetails", value: patientData });
    //     navigate("/Home/FrontOfficeFolder");
    //   } catch (error) {
    //     console.error("Error fetching patient data for IP:", error);
    //   }
    // };
    
  
    const handleClear = () => {
      setRegisterData({
        Title: "",
        FirstName: "",
        MiddleName: "",
        SurName: "",
        Gender: "",
        MaritalStatus: "Single",
        SpouseName: "",
        FatherName: "",
        DOB: "",
        Age: "",
        PhoneNo: "",
        Email: "",
        BloodGroup: "",
        Occupation: "",
        Religion: "",
        Nationality: "",
        UHIDType: "",
        UHIDNo: "",
        PatientType: "",
        Pincode: "",
        DoorNo: "",
        Street: "",
        Area: "",
        City: "",
        District: "",
        State: "",
        Country: "",
        ABHA: "",
        Photo: null,
      });
    };
  
    const handlesubmit = () => {
      setLoading(true);
      scrollToElement("RegisFormcon_11");
  
      // Define explicitly required fields
      const requiredFields = ["Title", "FirstName", "Gender", "PhoneNo"];
  
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
            apptoreg: Registeredit?.appconversion ? Registeredit?.id : "",
            //   TestNames: FavouriteNamess || [],
            //   addedTests: addedTests || [],
          };
          console.log("datatosend", submitdata);
  
          axios
            .post(`${UrlLink}Frontoffice/Patient_Registration`, submitdata)
            .then((res) => {
              setLoading(false);
              // setAddedTests([]);
              // setFavouriteNamess([]);
              console.log(res);
              const resData = res.data;
              const message = Object.values(resData)[0];
              const type = Object.keys(resData)[0];
              const tdata = {
                message: message,
                type: type,
              };
              console.log(resData.data, "resData");
  
              // dispatchvalue({ type: "Registeredit", value: {} });
              dispatchvalue({ type: "toast", value: tdata });
              // setIsGetData(prev => !prev);
              handleClear();
              setPatientRegisterDetails(resData.data[0]);
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
  

  return (
    <>
      <div className="Main_container_app">
      {/* <h3>Registration</h3> */}
      <br />
      <div className="RegisFormcon" id="RegisFormcon_11">
        {/* <div className='RegisForm_1' >
            <label>
              Search <span>:</span>
            </label>
            <div className="Search_patient_icons">
              <input
                type="text"
                onKeyDown={
                  patientsearch === "FirstName"
                    ? (e) => HandlesearchPatient(patientsearch.Search)
                    : null
                }
                list="Search_iddd"
                autoComplete="off"
                name="Search"
                pattern={
                  patientsearch === "PhoneNumber" ? "\\d{10}" : "[A-Za-z]+"
                }
                className={
                  errors["Search"] === "Invalid"
                    ? "invalid"
                    : errors["Search"] === "Valid"
                      ? "valid"
                      : ""
                }
                value={patientsearch.Search}
                onChange={HandleSearchchange}
              />
              <datalist id="Search_iddd">
                {FilterbyPatientId.map((row, indx) => (
                  <option key={indx} value={row.PatientId}>
                    {`${row.PhoneNo} | ${row.FirstName} | ${row.UniqueIdNo}`}
                  </option>
                ))}
              </datalist>
              {patientsearch.Search && (
                <span
                  onClick={() => HandlesearchPatient(patientsearch.Search)}
                >
                  <PersonSearchIcon />
                </span>
              )}
            </div>
            
          </div> */}

        {FilteredFormdata &&
          FilteredFormdata.filter((p) => p !== "Photo").map((field, index) => (
            <div className="RegisForm_1" key={index}>
              <label htmlFor={`${field}_${index}`}>
                <div className="imp_v_star">
                  {field === "Title" ||
                    field === "Gender" ||
                    field === "PhoneNo" ||
                    field === "FirstName" ? (
                    <>
                      {field === "Title" && "Title"}
                      {/* {field === 'Nationality' && 'Nationality'} */}
                      {field === "Gender" && "Gender"}
                      {/* {field === 'UHIDType' && 'UHID Type'} */}
                      {/* {field === 'UHIDNo' && 'UHID No'} */}
                      {field === "PhoneNo" && "Phone No"}
                      {field === "FirstName" && "First Name"}
                      <span className="requirreg12">*</span>{" "}
                      {/* Single star for required fields */}
                    </>
                  ) : field === "DOB" || field === "Age" ? (
                    <>
                      {field === "DOB" && "DOB"}
                      {field === "Age" && "Age"}
                      <span className="requirreg12">**</span>{" "}
                      {/* Two stars for DOB and Age */}
                    </>
                  ) : (
                    formatLabel(field)
                  )}
                </div>
                <span>:</span>
              </label>

              {[
                "Title",
                "Gender",
                "MaritalStatus",
                "BloodGroup",
                "Religion",
                "Nationality",
                "UHIDType",
                "DoctorName",
                "PatientType",
                // 'PatientCategory',
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
                    ["Male", "Female", "TransGender"].map((row, indx) => (
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
                  {/* {field === 'PatientCategory' &&
                      [
                        'General',
                        'Insurance',
                        'Client',
                        'Corporate',
                        'CorporateEmployeeRelation',
                        'Donation',
                        'Employee',
                        'EmployeeRelation',
                        'Doctor',
                        'DoctorRelation'
                      ].map((row, indx) => (
                        <option key={indx} value={row}>
                          {row}
                        </option>
                      ))} */}

                  {field === "Flagging" &&
                    FlaggData?.filter((p) => p.Status === "Active").map(
                      (row, indx) => (
                        <option
                          key={indx}
                          value={row.id}
                          style={{ backgroundColor: row.FlaggColor }}
                        >
                          {" "}
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
              ) : ["PhoneNo", "FirstName", "PatientId"].includes(field) ? (
                <div className="Search_patient_icons">
                  <input
                    id={`${field}_${index}`}
                    type={"text"}
                    onKeyDown={
                      field === "FirstName"
                        ? handleKeyDownText
                        : handleKeyDownPhoneNo
                    }
                    list={`${field}_iddd`}
                    autoComplete="off"
                    name={field}
                    pattern={field === "PhoneNo" ? "\\d{10}" : "[A-Za-z]+"}
                    className={
                      errors[field] === "Invalid"
                        ? "invalid"
                        : errors[field] === "Valid"
                          ? "valid"
                          : ""
                    }
                    readOnly={
                      field === "PatientId"
                      // && Object.keys(Registeredit).length !== 0
                    }
                    required={field !== "PatientId"}
                    value={RegisterData[field]}
                    onChange={HandleOnchange}
                  />
                </div>
              ) : [
                "CorporateType",
                "ClientType",
                // 'IsMLC',
                // 'IsReferral',
                // 'IsConsciousness'
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
              ) : (
                <input
                  id={`${field}_${index}`}
                  autoComplete="off"
                  type={
                    field === "DOB"
                      ? "date"
                      : field === "UHIDNo"
                        ? "number"
                        : "text"
                  }
                  name={field}
                  pattern={
                    field === "Email"
                      ? "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[cC][oO][mM]$"
                      : field === "PhoneNo"
                        ? "\\d{10}"
                        : ["UHIDNo"].includes(field)
                          ? "\\d{12}"
                          : field === "Age"
                            ? "\\d{1,3}"
                            : field === "DOB"
                              ? ""
                              : "[A-Za-z]+"
                  }
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
                      : field === "PhoneNo"
                        ? handleKeyDownPhoneNo
                        : null
                  }
                  onChange={HandleOnchange}
                />
              )}
            </div>
          ))}

        {FilteredFormdataAddress &&
          FilteredFormdataAddress.map((field, index) => (
            <div className="RegisForm_1" key={index}>
              <label htmlFor={`${field}_${index}`}>
                {formatLabel(field)}
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



        {/* <div className='Main_container_Btn'>
            <button onClick={handlesubmit}>
              {Object.keys(Registeredit).length !== 0 &&
                (Registeredit?.conversion
                  ? !Registeredit?.conversion
                  : Registeredit?.appconversion
                    ? !Registeredit?.appconversion
                    : true)
                ? 'Update'
                : 'Save'}
            </button>
          </div> */}


      </div>

      <br />

      <div className="Main_container_Btn">
        <button onClick={handlesubmit}>Save</button>
        {/* <button onClick={handleNavigateOP}>To OP</button> */}
        {/* <button onClick={handleNavigateIP}>To IP</button> */}
      </div>
      {loading && (
        <div className="loader">
          <div className="Loading">
            <div className="spinner-border"></div>
            <div>Loading...</div>
          </div>
        </div>
      )}

      {/* <ToastContainer /> */}
      <ModelContainer />
      <ToastAlert Message={toast.message} Type={toast.type} />

      {/* <ReactGrid columns={PatientRegisterColumns} RowData={PatientData} /> */}

      {/* <ToastAlert Message={toast.message} Type={toast.type} /> */}

      {/* {RegisterRoomShow.val && <RoomDetialsSelect />} */}
      <br />
      </div>
    </>
  )
}

export default Ownregistration
