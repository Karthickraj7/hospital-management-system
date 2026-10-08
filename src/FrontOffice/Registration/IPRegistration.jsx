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
  subYears,
  isBefore,
} from "date-fns";
 
import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoBedOutline } from "react-icons/io5";
import profile from "../../Assets/profileimg.jpeg";
import "../../App.css";
import { handleKeyDownText } from "../../OtherComponent/OtherFunctions";
import { handleKeyDownPhoneNo } from "../../OtherComponent/OtherFunctions";
// handleKeyDownTextRegistration
import { handleKeyDownTextRegistration } from "../../OtherComponent/OtherFunctions";
import RoomDetialsSelect from "./RoomDetialsSelect";
import Button from "@mui/material/Button";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import DeleteIcon from "@mui/icons-material/Delete";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import IpAdmitCardDetails from "../RegistrationList/IpAdmitCardDetails";
import IpVisitorPassDetails from "../RegistrationList/IpVisitotPassDetails";
import IpAttenderPassDetails from "../RegistrationList/IpAttenderPassDetails";
import IpBarcodeDetails from "../RegistrationList/IpBarcodeDetails";
import IPNurseFaceSheet from "../RegistrationList/IPNurseFaceSheet";


const IPRegistration = () => {
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();

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

  const AppointmentRegisType = "IP";
  const Registeredit = useSelector((state) => state.Frontoffice?.Registeredit);
  const OPtoIPRegister = useSelector((state) => state.Frontoffice?.OPtoIPRegister);
  const EmgToIpConnect = useSelector((state) => state.Frontoffice?.EmgToIpConnect);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  console.log("UserData", UserData);
  console.log("Registeredit", Registeredit);
  console.log("OPtoIPRegister", OPtoIPRegister);
  console.log("EmgToIpConnect", EmgToIpConnect);

  const PatientDetails = useSelector(
    (state) => state.Frontoffice?.PatientDetails
  );
  console.log("PatientDetails", PatientDetails);

  const toast = useSelector((state) => state.userRecord?.toast);
  const RegisterRoomShow = useSelector(
    (state) => state.Frontoffice?.RegisterRoomShow
  );
  const SelectRoomRegister = useSelector(
    (state) => state.Frontoffice?.SelectRoomRegister
  );

  console.log(SelectRoomRegister, "SelectRoomRegister");

  const [loading, setLoading] = useState(false);
  const [SpecializationData, setSpecializationData] = useState([]);
  const [DoctorData, setDoctorData] = useState([]);
  const [TokenData, setTokenData] = useState([]);
  const [ReferralDoctorData, setReferralDoctorData] = useState([]);
  const [EmployeeData, setEmployeeData] = useState([]);
  console.log(ReferralDoctorData, "ReferralDoctorData");
  console.log(EmployeeData, "qqqqqqqqqqqqq");

  const [DoctorIdData, setDoctorIdData] = useState([]);
  const [FlaggData, setFlaggData] = useState([]);
  const [ReligionData, setReligionData] = useState([]);
  const [AllDoctorData, setAllDoctorData] = useState([]);
  const [InsuranceData, setInsuranceData] = useState([]);
  const [ClientData, setClientData] = useState([]);
  const [CorporateData, setCorporateData] = useState([]);
  const [DonationData, setDonationData] = useState([]);
  const [BloodGroupData, setBloodGroupData] = useState([]);
  const [TitleNameData, setTitleNameData] = useState([]);



  const [PatientRegisterData, setPatientRegisterData] = useState([]);
  console.log(PatientRegisterData,'PatientRegisterData------------1');
  const [getdata, setgetdata] = useState(false);
    
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [SelectedIPPatientRowData, setSelectedIPPatientRowData] = useState(null);
  console.log(selectedRowData,'selectedRowData-------1');
  console.log(SelectedIPPatientRowData,'selectedIPPatientRowData-------1');
  
  
  const [openModal, setOpenModal] = useState(false);
    
  // Function to format date as MM/DD/YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [patientsearch, setpatientsearch] = useState({
    Search: PatientDetails?.PatientId || Registeredit?.PatientId || OPtoIPRegister?.PatientId || EmgToIpConnect?.PatientId || "",
  });
  const [FilterbyPatientId, setFilterbyPatientId] = useState([]);

  console.log(FilterbyPatientId, "FilterbyPatientId");

  const [FilteredFormdata, setFilteredFormdata] = useState(null);
  const [FilteredFormdataAddress, setFilteredFormdataAddress] = useState(null);
  const [FilteredFormdataRoute, setFilteredFormdataRoute] = useState(null);
  const [FilteredFormdataIpDetials, setFilteredFormdataIpDetials] =
    useState(null);
  const [FilteredFormdataIpRoomDetials, setFilteredFormdataIpRoomDetials] =
    useState(null);
  const [FilteredFormdataOPVisitEntry, setFilteredFormdataOPVisitEntry] =
    useState(null);
  const [FilteredFamilyDetails, setFilteredFamilyDetails] = useState(null);
  const [PatientCatg, setPatientCatg] = useState(null);

  const [FilteredFormdataServices, setFilteredFormdataServices] =
    useState(null);

  console.log("Fillteerrrrrrrr", FilteredFormdataOPVisitEntry);
  const [selectedDate, setSelectedDate] = useState(new Date());
  console.log(selectedDate);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  console.log(visitDate, 'visitDateeeeeeeeeee');
  console.log(visitTime, 'visitTimeeeeeeeee');
  const selectedDateRef = useRef(null);

  const formatDateTime = (date) => {
    return date.toLocaleString("sv-SE").replace("T", " "); 
    // Example: "2025-09-15 22:03:45"
  };

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);

  //   if (date) {
  //     // Format the date portion as yyyy-mm-dd
  //     const year = date.getFullYear();
  //     const month = (date.getMonth() + 1).toString().padStart(2, "0");
  //     const day = date.getDate().toString().padStart(2, "0");
  //     const formattedDate = `${year}-${month}-${day}`;

  //     // Format the time portion in 12-hour format
  //     const hours = date.getHours();
  //     const minutes = date.getMinutes();
  //     const hours12 = hours % 12 || 12;
  //     const formattedMinutes = minutes.toString().padStart(2, "0");
  //     const formattedTime = `${hours12}:${formattedMinutes}`;

  //     setVisitDate(formattedDate);
  //     setVisitTime(formattedTime);

  //     setOPVisitEntry((prev) => ({
  //       ...prev,
  //       VisitDateTime: date,
  //     }));
  //   } else {
  //     // Reset the states if no date is selected
  //     setVisitDate("");
  //     setVisitTime("");
  //   }
  // };


 

  const [errors, setErrors] = useState({});


  const [RegisterData, setRegisterData] = useState({
    // PatientId: '',
    ABHA: PatientDetails.ABHA || Registeredit.ABHA || "",
    Title: PatientDetails.Title || Registeredit.TitleId || OPtoIPRegister.TitleId || EmgToIpConnect.TitleId || "",
    FirstName: PatientDetails.FirstName || Registeredit.FirstName || OPtoIPRegister.FirstName || EmgToIpConnect.FirstName || "",
    MiddleName: PatientDetails.MiddleName || Registeredit.MiddleName || OPtoIPRegister.MiddleName || EmgToIpConnect.MiddleName || "",
    SurName: PatientDetails.SurName || Registeredit.LastName || OPtoIPRegister.LastName || EmgToIpConnect.LastName || "",
    Gender: PatientDetails.Gender || Registeredit.Gender || OPtoIPRegister.Gender || EmgToIpConnect.Gender || "",
    MaritalStatus:PatientDetails.MaritalStatus || Registeredit.MaritalStatus || OPtoIPRegister.MaritalStatus || EmgToIpConnect.MaritalStatus || "",
    SpouseName: PatientDetails.SpouseName || Registeredit.SpouseName || OPtoIPRegister.SpouseName || EmgToIpConnect.SpouseName || "",
    FatherName: PatientDetails.FatherName || Registeredit.FatherName || OPtoIPRegister.FatherName || EmgToIpConnect.FatherName || "",
    DOB: PatientDetails.DOB || Registeredit.DOB || OPtoIPRegister.DOB || EmgToIpConnect.DOB || "",
    Age: PatientDetails.Age || Registeredit.Age || OPtoIPRegister.Age || EmgToIpConnect.Age || "",
    PhoneNo: PatientDetails.PhoneNo || OPtoIPRegister.PhoneNumber || EmgToIpConnect.PhoneNumber || "",
    Email: PatientDetails.Email || Registeredit.Email || OPtoIPRegister.Email || EmgToIpConnect.Email || "",
    BloodGroup: PatientDetails.BloodGroup || Registeredit.BloodGroup || OPtoIPRegister.BloodGroup || EmgToIpConnect.BloodGroup || "",
    Occupation: PatientDetails.Occupation || Registeredit.Occupation || OPtoIPRegister.Occupation || EmgToIpConnect.Occupation || "",
    Religion: PatientDetails.Religion || Registeredit.Religion || OPtoIPRegister.Religion || EmgToIpConnect.Religion || "",
    Nationality: PatientDetails.Nationality || Registeredit.Nationality || OPtoIPRegister.Nationality || EmgToIpConnect.Nationality || "",
    UHIDType: PatientDetails.UHIDType || Registeredit.UniqueIdType || OPtoIPRegister.UniqueIdType || EmgToIpConnect.UniqueIdType || "",
    UHIDNo: PatientDetails.UHIDNo || Registeredit.UniqueIdNo || OPtoIPRegister.UniqueIdNo || EmgToIpConnect.UniqueIdNo || "",
    PatientType: PatientDetails.PatientType || Registeredit.PatientType || OPtoIPRegister.PatientType || EmgToIpConnect.PatientType || "",

    Pincode:
      PatientDetails.Pincode ||
      PatientDetails.PermanentPincode ||
      Registeredit.Pincode || Registeredit.PermanentPincode ||
      OPtoIPRegister.Pincode || OPtoIPRegister.PermanentPincode ||
      EmgToIpConnect.Pincode || EmgToIpConnect.PermanentPincode ||
      "",
    DoorNo:
      PatientDetails.DoorNo ||
      PatientDetails.PermanentdoorNo ||
      Registeredit.DoorNo || Registeredit.PermanentdoorNo ||
      OPtoIPRegister.DoorNo || OPtoIPRegister.PermanentdoorNo ||
      EmgToIpConnect.DoorNo || EmgToIpConnect.PermanentdoorNo ||
      "",
    Street:
      PatientDetails.Street ||
      PatientDetails.PermanentStreet ||
      Registeredit.Street || Registeredit.PermanentStreet ||
      OPtoIPRegister.Street || OPtoIPRegister.PermanentStreet ||
      EmgToIpConnect.Street || EmgToIpConnect.PermanentStreet ||
      "",
    Area:
      PatientDetails.Area ||
      PatientDetails.PermanentArea ||
      Registeredit.Area || Registeredit.PermanentArea ||
      OPtoIPRegister.Area || OPtoIPRegister.PermanentArea ||
      EmgToIpConnect.Area || EmgToIpConnect.PermanentArea ||
      "",
    City:
      PatientDetails.City ||
      PatientDetails.PermanentCity ||
      Registeredit.City || Registeredit.PermanentCity ||
      OPtoIPRegister.City || OPtoIPRegister.PermanentCity ||
      EmgToIpConnect.City || EmgToIpConnect.PermanentCity ||
      "",
    District:
      PatientDetails.District ||
      PatientDetails.PermanentDistrict ||
      Registeredit.District || Registeredit.PermanentDistrict ||
      OPtoIPRegister.District || OPtoIPRegister.PermanentDistrict ||
      EmgToIpConnect.District || EmgToIpConnect.PermanentDistrict ||
      "",
    State:
      PatientDetails.State ||
      PatientDetails.PermanentState ||
      Registeredit.State || Registeredit.PermanentState ||
      OPtoIPRegister.State || OPtoIPRegister.PermanentState ||
      EmgToIpConnect.State || EmgToIpConnect.PermanentState ||
      "",
    Country:
      PatientDetails.Country ||
      PatientDetails.PermanentCountry ||
      Registeredit.Country || Registeredit.PermanentCountry ||
      OPtoIPRegister.Country || OPtoIPRegister.PermanentCountry ||
      EmgToIpConnect.Country || EmgToIpConnect.PermanentCountry ||
      "",
  });

  const [OPVisitEntry, setOPVisitEntry] = useState({
    // VisitType: '',
    Speciality: PatientDetails.SpecializationId || Registeredit.SpecializationId || "",
    DoctorName: PatientDetails.DoctorID || Registeredit.DoctorID || "",
    Complaint: "",
    IsMLC: "No",
    IsReferral: "No",

    ReferralSource: "",
    ReferredBy: PatientDetails.referdoctorid || "",

    AdmissionPurpose: "Medical-Management",
    DrInchargeAtTimeOfAdmission: "",

    NextToKinName: "",
    Relation: "",
    RelativePhoneNo: "",
    PersonLiableForBillPayment: "",
    PersonLiablecontactno: "",
    VisitDateTime: null,
    FamilyHead: "No",
    FamilyHeadName: "",
    // IpKitGiven: "No",

    PatientCategory: "General",

    InsuranceName: "",
    InsuranceType: "",

    ClientName: "",
    ClientType: "Self",
    ClientEmployeeId: "",
    ClientEmployeeDesignation: "",
    ClientEmployeeRelation: "",

    CorporateName: "",
    CorporateType: "Company",
    CorporateEmployeeId: "",
    CorporateEmployeeDesignation: "",
    CorporateEmployeeRelation: "",

    EmployeeId: "",
    EmployeeRelation: "",

    DoctorId: "",
    DoctorRelation: "",

    DonationType: "",

    // BroughtBy: '',
    // BroughtContactNo: '',
    // ModeOfTransport: '',
    // ConditionOnArrival: '',
    // IsConsciousness: 'Yes',

    // ServiceCategory: '',
    // ServiceSubCategory: '',

    Building: null,
    Block: null,
    Floor: null,
    WardType: null,
    // RoomType: null,
    RoomNo: null,
    BedNo: null,
    RoomId: null,
  });

  const [RoomdeditalsShow, setRoomdeditalsShow] = useState({
    Building: "",
    Block: "",
    Floor: "",
    WardType: "",
    RoomType: "",
    RoomNo: "",
    BedNo: "",
    RoomId: "",
  });

  //  const handleDateChange = (date) => {
  //   if (date) {
  //     selectedDateRef.current = date; // Update the ref for filterTime

  //     setSelectedDate(date);

  //     const year = date.getFullYear();
  //     const month = (date.getMonth() + 1).toString().padStart(2, "0");
  //     const day = date.getDate().toString().padStart(2, "0");
  //     const formattedDate = `${year}-${month}-${day}`;

  //     const hours = date.getHours();
  //     const minutes = date.getMinutes();
  //     const hours12 = hours % 12 || 12;
  //     const formattedMinutes = minutes.toString().padStart(2, "0");
  //     const formattedTime = `${hours12}:${formattedMinutes}`;

  //     setVisitDate(formattedDate);
  //     setVisitTime(formattedTime);

  //     setOPVisitEntry((prev) => ({
  //       ...prev,
  //       VisitDateTime: date,
  //     }));
  //   } else {
  //     setVisitDate("");
  //     setVisitTime("");
  //   }
  // };



  const handleDateChange = (date) => {
  if (!date) return;

  const updatedDate = new Date(date);

  // If no time is set, default to now
  if (!selectedDate) {
    const now = new Date();
    updatedDate.setHours(now.getHours());
    updatedDate.setMinutes(now.getMinutes());
    updatedDate.setSeconds(now.getSeconds());
  }

  setSelectedDate(updatedDate);
};


  const clearRegisterdata = () => {
    setRegisterData((prev) => ({
      ...prev,
      // PatientId: '',
      ABHA: "",
      Title: "",
      FirstName: "",
      MiddleName: "",
      SurName: "",
      Gender: "",
      MaritalStatus: "",
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
      PatientType: "",
      Pincode: "",
      DoorNo: "",
      Street: "",
      Area: "",
      City: "",
      District: "",
      State: "",
      Country: "",
      
      // Photo : null,
    }));

    setOPVisitEntry((prev) => ({
      ...prev,
      // VisitType: '',
      Speciality: "",
      DoctorName: "",
      TokenNo: "",
      Complaint: "",
      IsMLC: "",
      IsReferral: "",
      ReferralSource: "",
      ReferredBy: "",
      AdmissionPurpose: "",
      DrInchargeAtTimeOfAdmission: "",
      NextToKinName: "",
      Relation: "",
      RelativePhoneNo: "",
      PersonLiableForBillPayment: "",
      PersonLiablecontactno: "",
      VisitDateTime: null,
      FamilyHead: "",
      FamilyHeadName: "",
      // IpKitGiven: "",
      PatientCategory: "General",
      InsuranceName: "",
      InsuranceType: "",
      ClientName: "",
      ClientType: "",
      ClientEmployeeId: "",
      ClientEmployeeDesignation: "",
      ClientEmployeeRelation: "",
      CorporateName: "",
      CorporateType: "",
      CorporateEmployeeId: "",
      CorporateEmployeeDesignation: "",
      CorporateEmployeeRelation: "",
      EmployeeId: "",
      EmployeeRelation: "",
      DoctorId: "",
      DoctorRelation: "",
      DonationType: "",
      Building: null,
      Block: null,
      Floor: null,
      WardType: null,
      // RoomType: null,
      RoomNo: null,
      BedNo: null,
      RoomId: null,
      // BroughtBy: '',
      // BroughtContactNo: '',
      // ModeOfTransport: '',
      // ConditionOnArrival: '',
      // IsConsciousness: 'Yes',
      // ServiceCategory: '',
      // ServiceSubCategory: '',
 
       visitDate : "",
       visitTime : "",
      
    }));

    setInchargedocname("")

    setErrors({});
    setVisitDate("")
    setVisitTime("")

    setRoomdeditalsShow((prev) => ({
      ...prev,
      Building: "",
      Block: "",
      Floor: "",
      WardType: "",
      RoomType: "",
      RoomNo: "",
      BedNo: "",
      RoomId: "",
    }));

    setpatientsearch((prev) => ({
      Search: "",
    }));
  };

  console.log("RegisterData", RegisterData);

  const [ServiceCategoryData, setServiceCategoryData] = useState([]);
  const [ServiceSubCategoryData, setServiceSubCategoryData] = useState([]);
  const [BillDueChanges, setBillDueChanges] = useState(false)
  const [BillDue, setBillDue] = useState([])


  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

  useEffect(() => {
    if (patientsearch.Search !== '') {
      axios.get(`${UrlLink}/Frontoffice/get_credit_due_amount_for_patient?PatientId=${patientsearch.Search}`)
        .then((res) => {
          const ress = res.data
          console.log('Dueeeee', ress);
          setBillDue(ress)
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }, [UrlLink, patientsearch, BillDueChanges])

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
          axios.get(`${UrlLink}Masters/get_All_doctor_Name_Detials_for_reports`),
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
        setReferralDoctorData(
          Array.isArray(referralDoctorResponse.data) ? referralDoctorResponse.data : []
        );
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
        setAllDoctorData(
          Array.isArray(AllDoctorData.data) ? AllDoctorData.data : []
        );
        setInsuranceData(
          Array.isArray(Insurancedata.data) ? Insurancedata.data : []
        );
        setClientData(Array.isArray(ClientData.data) ? ClientData.data : []);
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

 

     const RegisterColumn = [
        {
          key: "id",
          name: "S.No",
        },
        {
          key: "RegistrationId",
          name: "IP.No",
        },
        {
          key: "PatientName",
          name: "Patient Name",
          width: 150,
        },
        {
          key: "AdmitCard",
          name: "AdmitCard",
          width: 200,
          renderCell: (params) => {
            if (!params.row) return null; // Prevents errors if row data is missing
        
            // List of button types
            const buttonTypes = ["AdmitCard", "VisitorCard", "AttenderCard", "Barcode", "IpAdmissionForm"];
        
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px", // Adds spacing between buttons
                }}
                className="weudygwe_uy8iu"
              >
                {buttonTypes.map((type) => (
                  <Button
                    key={type}
                    onClick={() => handleOpenModal(type, params.row)}
                    
                  >
                    {type}
                  </Button>
                ))}
              </div>
            );
          },
        }
        
      ];


    //  const RegisterColumn = [
    //     {
    //       key: "id",
    //       name: "S.No",
    //     },
    //     {
    //       key: "RegistrationId",
    //       name: "IP.No",
    //     },
    //     {
    //       key: "PatientName",
    //       name: "Patient Name",
    //       width: 150,
    //     },
    //     {
    //       key: "AdmitCard",
    //       name: "AdmitCard",
    //       width: 200,
    //       renderCell: (params) => {
    //         return params.row.Status === "Pending" ? (
    //           <div
    //             style={{
    //               display: "flex",
    //               justifyContent: "center",
    //               alignItems: "center",
    //               gap: "8px", // Adds spacing between buttons
    //             }}
    //             className="weudygwe_uy8iu"
    //           >
    //             <Button onClick={() => handleOpenModal("AdmitCard", params.row)}>
    //               AdmitCard
    //             </Button>
    //             <Button onClick={() => handleOpenModal("VisitorCard", params.row)}>
    //               VisitorCard
    //             </Button>
    //             <Button onClick={() => handleOpenModal("AttenderCard", params.row)}>
    //               AttenderCard
    //             </Button>
    //             <Button onClick={() => handleOpenModal("Barcode", params.row)}>
    //               Barcode
    //             </Button>
    //             <Button 
    //               onClick={() => {
    //                 console.log("Before Passing to Modal:", params.row);
    //                 handleOpenModal("IPNurseFaceSheet", params.row);
    //               }}
    //             >
    //               IPNurseFaceSheet
    //             </Button>

    //           </div>
    //         ) : null; // Return null if Status is not "Pending"
    //       },
    //     },
    //   ];
      

      //  const handleOpenModal = (modalType,rowData) => {
      //   console.log("Received Row Data:", rowData);
      //     console.log(modalType,'modalType');
        
      //     setOpenModal(modalType);
      //     setSelectedRowData(rowData);
      // };
      

      const handleOpenModal = (modalType, rowData) => {
        console.log("Received Row Data:", rowData); // Debugging
        console.log("Modal Type:", modalType);
    
        const rowCopy = { ...rowData }; // Create a shallow copy to prevent mutations
        setOpenModal(modalType);
        setSelectedRowData(rowCopy);
    };
    
      const handleCloseModal = () => {
        setOpenModal(null);
        setSelectedRowData(null);
      };
      
      useEffect(() => {
        if (selectedRowData) {
          console.log("Updated selectedRowData:", selectedRowData);
        }
      }, [selectedRowData]);
      
      
      
      
      const getModalContent = () => {
          if (!selectedRowData) return null;
          console.log(selectedRowData,'selectedRowData');
          
      
          switch (openModal) {
              case 'AdmitCard':
                  return <IpAdmitCardDetails rowData={selectedRowData} />;
              case 'VisitorCard':
                  return <IpVisitorPassDetails rowData={selectedRowData} />;
              case 'AttenderCard':
                  return <IpAttenderPassDetails rowData={selectedRowData} />;
              case 'Barcode':
                  return <IpBarcodeDetails rowData={selectedRowData} />;
              case 'IpAdmissionForm':
                  return <IPNurseFaceSheet rowData={SelectedIPPatientRowData}/>;
              default:
                  return null;
          }
      };



      console.log(selectedRowData?.PatientId,'j-------------');
      console.log(selectedRowData?.RegistrationId,'j-------------');
      

      useEffect(() => {
        console.log("Fetching patient data...");
      
        axios
          .get(`${UrlLink}Frontoffice/get_ip_registered_Patient_basic_details`, {
            params: { status: "Pending" },
          })
          .then((response) => {
            console.log("API Response:", response.data);
      
            setPatientRegisterData(Array.isArray(response.data) ? response.data : []);
            
            if (!Array.isArray(response.data)) {
              console.warn("API response is not an array, resetting state.");
            }
          })
          .catch((error) => {
            console.error("Error fetching patient data:", error);
          });
      
      }, [UrlLink, getdata, selectedRowData]); // Dependencies
      



      useEffect(() => {
          const fetchData = () => {
              if (!selectedRowData?.RegistrationId) {
                  console.warn("No RegistrationId available, skipping fetch.");
                  return;
              }
      
              axios
                  .get(`${UrlLink}Frontoffice/get_ip_registration_before_handover_details_Duplicate`, {
                      params: { status: "Pending", RegistrationId: selectedRowData.RegistrationId },
                  })
                  .then((response) => {
                      console.log("Response from API:", response.data);
      
                      if (response.data && typeof response.data === "object") {
                        setSelectedIPPatientRowData(response.data); // Store as an object
                      } else {
                          console.warn("API response is not an object, resetting state.");
                          setSelectedIPPatientRowData({});
                      }
                  })
                  .catch((error) => {
                      console.error("Error fetching data:", error);
                      setSelectedIPPatientRowData({}); // Handle error case
                  });
          };
      
          fetchData();
      }, [UrlLink, getdata, selectedRowData]);
      
    

      // useEffect(() => {
      //   const fetchData = async () => {
    
      //     try {
      //       const response = await axios.get(
      //         `${UrlLink}Frontoffice/get_ip_registration_before_handover_details_Duplicate`,
      //         { params: { status: "Pending",RegistrationId:selectedRowData?.RegistrationId } } 
      //       );
      //       console.log(response.data, "Response from API");
      
      //       if (Array.isArray(response.data)) {
      //         setPatientRegisterData(response.data);
      //       } else {
      //         setPatientRegisterData([]); // Ensure state is always an array
      //       }
      //     } catch (error) {
      //       console.error("Error fetching data:", error);
      //     }
      //   };
      
      //   fetchData(); 
      
      // }, [UrlLink, getdata,selectedRowData]); 
      
      
      

  // useEffect(() => {
  //   if (PatientDetails.referdoctorid) {
  //     setOPVisitEntry((prevState) => ({
  //       ...prevState,
  //       IsReferral: "Yes",
  //       ReferredBy: PatientDetails.referdoctorid, // Assign ReferredByDocID if needed
  //     }));
  //   }
  // }, [PatientDetails.referdoctorid]);

  useEffect(() => {
    const fetchdat = async () => {
      const postdata = {
        LocationId: UserData?.location,
        Date: formatDate(new Date()),
        Speciality: OPVisitEntry.Speciality,
        Department:
          PatientDetails.Department || Registeredit.Department || "IP",
      };
      console.log("Doctrrrrr", postdata);

      try {
        const response = await axios.get(
          `${UrlLink}Frontoffice/get_available_doctor_by_speciality`,
          { params: postdata }
        );

        setDoctorData(response.data);
        console.log("Doctrrrrr", response.data);
      } catch (error) {
        setDoctorData([]);
        console.error("Error fetching referral doctors:", error);
      }
    };
    if (
      OPVisitEntry.Speciality ||
      (Registeredit.SpecilizationId && PatientDetails.Department) ||
      Registeredit.Department ||
      "OP"
    ) {
      fetchdat();
    }
  }, [
    UrlLink,
    UserData.location,
    OPVisitEntry.Speciality,
    PatientDetails.Department,
    Registeredit.SpecilizationId,
    Registeredit.Department,
  ]);

  useEffect(() => {
    if (Object.keys(Registeredit).length === 0) {
      const postdata = {
        PatientId: RegisterData.PatientId,
        PhoneNo: RegisterData.PhoneNo,
        FirstName: RegisterData.FirstName,
        UHIDNo: RegisterData.UHIDNo,
        MiddleName: RegisterData.MiddleName,
        SurName: RegisterData.SurName,
        patientsearch : patientsearch.Search
        // DoctorId: OPVisitEntry.DoctorName
      };
      console.log("PosttttDDDD", postdata);

      // Filter_Patient_by_Multiple_Criteria
      axios
        .get(`${UrlLink}Frontoffice/Patients_Management_Filter_OPVisitEntry`, {
          params: postdata,
        })
        .then((res) => {
          const data = res.data;
          console.log("ressss", data);
          setFilterbyPatientId(data);
          // setFilterbyPatientId(data.patients);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [
    UrlLink,
    Registeredit,
    RegisterData.PatientId,
    RegisterData.PhoneNo,
    RegisterData.FirstName,
    RegisterData.UHIDNo,
    RegisterData.MiddleName,
    RegisterData.SurName,
      patientsearch.Search

    // OPVisitEntry.DoctorName
  ]);

  const HandleSearchchange = (e) => {
    const { name, value } = e.target;
    setpatientsearch((prev) => ({
      ...prev,
      [name]: value,
    }));
    setBillDueChanges(false)
  };

  const HandlesearchPatient = (value) => {
    const exist = FilterbyPatientId.find((f) => f.PatientId === value);
    if (!exist) {
      const tdata = {
        message: "Please enter a valid Patient Id",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {


      axios
            .get(`${UrlLink}Frontoffice/get_same_ip_appointment_for_patient?PatientId=${patientsearch.Search}`)
            .then((res) => {
         
              console.log(res.data,'todayappoint')
         
              const visit = res.data;
         
              console.log(visit,'visitttttt')
         
              if (visit?.length > 0){
         
                const tdata = { message: `The Patient Already Admitted in ${visit[0]?.Specialization}`, type: "warn" };
                console.log(tdata,'tdata')
                dispatchvalue({ type: "toast", value: tdata });
         
              }
             
            })
            .catch((err) => {
              console.error("❌ Error fetching visit details:", err);
            });




      axios
        .get(
          `${UrlLink}Frontoffice/get_Patient_Details_by_patientId?PatientId=${value}`
        )
        .then((res) => {
          const { PatientProfile, PatientId, AliasName, ...resss } = res.data;
          console.log("paaatttttttttt", res.data);
          console.log("ressssssssssssss", resss);

          if (resss.warn) {
            const tdata = {
              message: resss.warn,
              type: "warn",
            };
            dispatchvalue({ type: "toast", value: tdata });
            return;
          }

          setRegisterData(resss);

          // setOPVisitEntry({
          //   Speciality: "",
          //   DoctorName: "",
          //   TokenNo: "",
          //   Complaint: "",
          //   IsMLC: "",
          //   IsReferral: "",
          //   ReferralSource: "",
          //   ReferredBy: "",
          //   AdmissionPurpose: "",
          //   DrInchargeAtTimeOfAdmission: "",
          //   NextToKinName: "",
          //   Relation: "",
          //   RelativePhoneNo: "",
          //   PersonLiablecontactno: "",
          //   PersonLiableForBillPayment: "",
          //   VisitDateTime: null,
          //   FamilyHead: "",
          //   FamilyHeadName: "",
          //   // IpKitGiven: "",
          //   InsuranceName: resss.InsuranceName,
          //   InsuranceType: resss.InsuranceType,
          //   ClientName: "",
          //   ClientType: "",
          //   ClientEmployeeId: "",
          //   ClientEmployeeDesignation: "",
          //   ClientEmployeeRelation: "",
          //   CorporateName: "",
          //   CorporateType: "",
          //   CorporateEmployeeId: "",
          //   CorporateEmployeeDesignation: "",
          //   CorporateEmployeeRelation: "",
          //   EmployeeId: "",
          //   EmployeeRelation: "",
          //   DoctorId: "",
          //   DoctorRelation: "",
          //   DonationType: "",
          //   Building: null,
          //   Block: null,
          //   Floor: null,
          //   WardType: null,
          //   // RoomType: null,
          //   RoomNo: null,
          //   BedNo: null,
          //   RoomId: null,
          //   PatientCategory: "",
          //   // PatientCategory: resss.PatientCategory,
          // })

          setRoomdeditalsShow((prev) => ({
            ...prev,
            Building: "",
            Block: "",
            Floor: "",
            WardType: "",
            RoomType: "",
            RoomNo: "",
            BedNo: "",
            RoomId: "",
          }));
          setBillDueChanges(true)
          // setpatientsearch((prev) => ({
          //   Search: "",
          // }));
        })
        .catch((err) => console.log(err));
    }
  };

  const gridRef = useRef(null);

  useLayoutEffect(() => {
    const handleResize = debounce(() => {
      if (gridRef.current) {
        const { clientWidth } = gridRef.current;
        const updatedclientWidth = clientWidth - 20;

        const items = document.querySelectorAll(".RegisForm_1");
        let totalWidth = 0;
        let currentRowItemsCount = 0;

        items.forEach((item) => {
          const itemStyles = getComputedStyle(item);
          const itemWidth =
            item.offsetWidth +
            parseFloat(itemStyles.marginLeft) +
            parseFloat(itemStyles.marginRight);

          if (totalWidth + itemWidth <= updatedclientWidth) {
            totalWidth += itemWidth;
            currentRowItemsCount++;
          }
        });
        const remainingGap = updatedclientWidth - totalWidth;
        const gapBetweenItems = Math.floor(remainingGap / currentRowItemsCount);
        const container = document.getElementById("RegisFormcon_11");

        if (updatedclientWidth > 800) {
          container.style.justifyContent = "flex-start";
          container.style.columnGap = `${gapBetweenItems === 0 ? 5 : gapBetweenItems
            }px`;
        } else {
          container.style.justifyContent = "center";
          container.style.columnGap = `10px`;
        }
      }
    }, 100); // Adjust the debounce delay as needed

    const currentGridRef = gridRef.current;
    const resizeObserver = new ResizeObserver(handleResize);
    if (currentGridRef) {
      resizeObserver.observe(currentGridRef);
    }
    return () => {
      if (currentGridRef) {
        resizeObserver.unobserve(currentGridRef);
      }
      resizeObserver.disconnect();
    };
  }, []);

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

  const HandleRegchange = async (e) => {

    const { name, value, pattern } = e.target;

    console.log(name, 'namename----------1');
    console.log(value, 'value-------------1');

    if (name === "Title") {
      // Find the title based on ID
      const selectedTitle = TitleNameData.find((title) => title.id === parseInt(value));
      console.log(selectedTitle,'selectedTitle-----------1');
      
      if (selectedTitle) {
        const titleName = selectedTitle.Title; // Extract title name
  
        // Determine gender based on Title
        const genderValue = ["Miss", "Ms", "Mrs"].includes(titleName)
        ? "Female"
        : ["Mr", "Master"].includes(titleName)
        ? "Male"
        // : ["Transgender"].includes(titleName)
        // ? "TransGender"
        : ["Dr", "Baby","Transgender"].includes(titleName)
        ? "Unspecified" // or keep it as "" if needed
        : "";

  
          setRegisterData((prev) => ({
          ...prev,
          [name]: value, // Store ID as value
          Gender: genderValue || prev.Gender,
        }));
      }
    }
  
    if (name === "Gender") {
      const titleOptions = TitleNameData.filter((title) => {
        if (value === "Female") return ["Miss", "Ms", "Mrs"].includes(title.Title);
        if (value === "Male") return ["Mr", "Master"].includes(title.Title);
        if (value === "TransGender") return ["Transgender", "Baby", "Dr"].includes(title.Title);
        return false;
      });

  
      const isTitleValid = titleOptions.some((title) => title.id === RegisterData.Title);

      setRegisterData((prev) => ({
        ...prev,
        [name]: value,
        Title: isTitleValid ? prev.Title : "", // Keep title if valid, else reset
      }));
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
          }


    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));

  }

    const [selectedSpecialityName,setselectedSpecialityName] = useState("")
  
   console.log(selectedSpecialityName,'selectedSpecialityName')
  const HandleOnchange = async (e) => {
    const { name, value, pattern } = e.target;

    console.log(name, 'name');
    console.log(value, 'value');

    const formattedValue = [
      "FirstName",
      "MiddleName",
      "SurName",
      "AliasName",
      "Occupation",
      "NextToKinName",
      "FamilyHeadName",
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

    if (name === "PhoneNo" || name === "RelativePhoneNo") {
      if (formattedValue.includes("|")) {
        const convert = formattedValue.split(" | ");
        console.log(convert);

        if (convert.length <= 10) {
          setOPVisitEntry((prev) => ({
            ...prev,
            [name]: convert[2].trim(),
            // PatientId: convert[0].trim(),
            FirstName: convert[1].trim(),
          }));
        }
      } else {
        if (formattedValue.length <= 10) {
          setOPVisitEntry((prev) => ({
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
          // PatientId: convert[0].trim(),
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
    }

    else if (name === "Speciality") {
      setOPVisitEntry((prev) => ({
        ...prev,
        [name]: formattedValue,
        DoctorName: "",
      }));

    const selectedSpecialityName = SpecializationData.find(p => p.Speciality_Id === Number(value))?.SpecialityName;
    setselectedSpecialityName(selectedSpecialityName);
      // } else if (name === "VisitDateTime") {
      //   setOPVisitEntry((prev) => ({
      //     ...prev,
      //     [name]: value,
      //   }));
    } else if (name === "DoctorName") {
      setOPVisitEntry((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));

      // // Filter for the selected doctor based on the doctor_id
      // const doctor_list = DoctorData.find(
      //   doc => doc.doctor_id === formattedValue
      // )

      // // Check if the doctor was found
      // if (doctor_list) {
      //   const doctor_schedule = doctor_list.schedule?.[0] // Access the first schedule in the doctor's schedule list
      //   console.log('RequestedSchedule', doctor_schedule)

      //   if (doctor_schedule?.working === 'yes') {
      //     const currentTime = new Date()

      //     // Single Shift
      //     if (doctor_schedule?.shift === 'Single') {
      //       const startTime = doctor_schedule.starting_time
      //       const endTime = doctor_schedule.ending_time

      //       // Convert schedule times to Date objects
      //       const startTimeDate = new Date(`1970-01-01T${startTime}Z`)
      //       const endTimeDate = new Date(`1970-01-01T${endTime}Z`)

      //       // Check if the current time is within the available time
      //       if (currentTime >= startTimeDate && currentTime <= endTimeDate) {
      //         const tdata = {
      //           message: `The Doctor is currently Available`,
      //           type: 'success'
      //         }
      //         dispatchvalue({ type: 'toast', value: tdata })
      //       } else {
      //         const tdata = {
      //           message: `The Doctor is not Available at this time, Available from ${startTime} to ${endTime}`,
      //           type: 'warn'
      //         }
      //         dispatchvalue({ type: 'toast', value: tdata })
      //       }
      //     }

      //     // Double Shift
      //     else if (doctor_schedule?.shift === 'Double') {
      //       const startTime_f = doctor_schedule.starting_time_f
      //       const endTime_f = doctor_schedule.ending_time_f
      //       const startTime_a = doctor_schedule.starting_time_a
      //       const endTime_a = doctor_schedule.ending_time_a

      //       // Convert schedule times to Date objects
      //       const startTimeDate_f = new Date(`1970-01-01T${startTime_f}Z`)
      //       const endTimeDate_f = new Date(`1970-01-01T${endTime_f}Z`)
      //       const startTimeDate_a = new Date(`1970-01-01T${startTime_a}Z`)
      //       const endTimeDate_a = new Date(`1970-01-01T${endTime_a}Z`)

      //       // Check if the current time falls within either shift (forenoon or afternoon)
      //       if (
      //         (currentTime >= startTimeDate_f &&
      //           currentTime <= endTimeDate_f) ||
      //         (currentTime >= startTimeDate_a && currentTime <= endTimeDate_a)
      //       ) {
      //         const tdata = {
      //           message: `The Doctor is currently Available`,
      //           type: 'success'
      //         }
      //         dispatchvalue({ type: 'toast', value: tdata })
      //       } else {
      //         const tdata = {
      //           message: `The Doctor is not Available at this time, Available in FN: ${startTime_f} to ${endTime_f} or AN: ${startTime_a} to ${endTime_a}`,
      //           type: 'warn'
      //         }
      //         dispatchvalue({ type: 'toast', value: tdata })
      //       }
      //     }
      //   }
      // } else {
      //   const tdata = {
      //     message: 'Doctor not found',
      //     type: 'error'
      //   }
      //   dispatchvalue({ type: 'toast', value: tdata })
      // }
    } else if (name === "UHIDNo") {
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
      setOPVisitEntry((prev) => ({
        ...prev,
        [name]: formattedValue || value,
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

  const [Inchargedocname,setInchargedocname] = useState("");


  const HandleDocChange = (e) => {
  const { name, value } = e.target;

  if (name === "DrInchargeAtTimeOfAdmission") {
    if (value.includes("|")) {
      const [id, docName] = value.split("|");
      setOPVisitEntry((prev) => ({
        ...prev,
        DrInchargeAtTimeOfAdmission: id,
      }));
      setInchargedocname(docName);
    } else {
      // while typing, just show what user types
      setInchargedocname(value);
    }
  }
};


  const adjustHeight = (e) => {
    e.target.style.height = "auto"; // Reset height to calculate scrollHeight
    e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight
  };

  useEffect(() => {
    if (Object.keys(SelectRoomRegister).length !== 0) {
      setOPVisitEntry((prev) => ({
        ...prev,
        Building: SelectRoomRegister.BuildingId,
        Block: SelectRoomRegister.BlockId,
        Floor: SelectRoomRegister.FloorId,
        WardType: SelectRoomRegister.WardId,
        RoomType: SelectRoomRegister.RoomId,
        RoomNo: SelectRoomRegister.RoomNo,
        BedNo: SelectRoomRegister.BedNo,
        RoomId: SelectRoomRegister.id,
      }));
      setRoomdeditalsShow({
        Building: SelectRoomRegister.BuildingName,
        Block: SelectRoomRegister.BlockName,
        Floor: SelectRoomRegister.FloorName,
        WardType: SelectRoomRegister.WardName,
        RoomType: SelectRoomRegister.RoomName,
        RoomNo: SelectRoomRegister.RoomNo,
        BedNo: SelectRoomRegister.BedNo,
        RoomId: SelectRoomRegister.RoomId,
      });
    }
  }, [SelectRoomRegister]);

  useEffect(() => {
    let fdata = Object.keys(RegisterData).filter(
      (p) =>
        ![
          // 'MiddleName',
          // 'SurName',
          // 'BloodGroup',
          // 'Occupation',
          // 'IsConsciousness',
          "AliasName",
          "DoorNo",
          "Street",
          "Area",
          "City",
          "District",
          "State",
          "Country",
          "Pincode",
          // 'PatientProfile',
          "SpouseName",
          "FatherName",
          "InsuranceName",
          "InsuranceType",
          "ClientName",
          "ClientType",
          "CorporateName",
          "CorporateType",
          // 'VisitType',
          "Speciality",
          "Specialization",
          "DoctorName",
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
          "ReferralSource",
          "ReferredBy",
          // 'RouteNo',
          // 'RouteName',
          // 'TehsilName',
          // 'VillageName',
          // 'AdmissionPurpose',
          // 'DrInchargeAtTimeOfAdmission',
          // 'NextToKinName',
          "InsuranceType",
          "Relation",
          "RelativePhoneNo",
          // 'PersonLiableForBillPayment',
          "FamilyHead",
          // 'FamilyHeadName',
          // 'IpKitGiven',

          "Building",
          "Block",
          "Floor",
          "WardType",
          "RoomType",
          "RoomNo",
          "BedNo",
          "RoomId",
          "TokenNo",
          "Status",
          "DoctorID"
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

    let routedata = Object.keys(OPVisitEntry).filter((p) =>
      ["ReferralSource", "ReferredBy"].includes(p)
    );
    setFilteredFormdataRoute(routedata);

    let roomdata = Object.keys(OPVisitEntry).filter((p) =>
      [
        "Building",
        "Block",
        "Floor",
        "WardType",
        // 'RoomType',
        "RoomNo",
        "BedNo",
      ].includes(p)
    );
    setFilteredFormdataIpRoomDetials(roomdata);

    let OpVisit = Object.keys(OPVisitEntry).filter((p) =>
      [
        "Speciality",
        "DoctorName",
        "Complaint",
        "IsMLC",
        "IsReferral",
        "AdmissionPurpose",
        "DrInchargeAtTimeOfAdmission",
        "PersonLiableForBillPayment",
        "PersonLiablecontactno",
        "VisitDateTime",
        "FamilyHead",
        "FamilyHeadName",
        // "IpKitGiven",
      ].includes(p)
    );
    setFilteredFormdataOPVisitEntry(OpVisit);

    let FamilyDetails = Object.keys(OPVisitEntry).filter((p) =>
      ["NextToKinName", "Relation", "RelativePhoneNo"].includes(p)
    );
    setFilteredFamilyDetails(FamilyDetails);

    let PatCateg = Object.keys(OPVisitEntry).filter(
      (p) =>
        ![
          "InsuranceName",
          "InsuranceType",
          "ClientName",
          "ClientType",
          "ClientEmployeeId",
          "ClientEmployeeDesignation",
          "ClientEmployeeRelation",
          "EmployeeId",
          "EmployeeDesignation",
          "EmployeeRelation",
          "DoctorId",
          "DoctorRelation",
          "AdmissionPurpose",
          "DrInchargeAtTimeOfAdmission",
          "DonationType",
          "Speciality",
          "DoctorName",
          "PersonLiableForBillPayment",
          "PersonLiablecontactno",
          "VisitDateTime",
          "TokenNo",
          "Complaint",
          "IsMLC",
          "IsReferral",
          "ReferralSource",
          "ReferredBy",
          "NextToKinName",
          "Relation",
          "RelativePhoneNo",
          "FamilyHead",
          "FamilyHeadName",
          "CorporateName",
          "CorporateType",
          "CorporateEmployeeId",
          "CorporateEmployeeDesignation",
          "CorporateEmployeeRelation",
          "ServiceCategory",
          "ServiceSubCategory",
          // "IpKitGiven",
          "Building",
          "Block",
          "Floor",
          "WardType",
          "RoomNo",
          "BedNo",
          "RoomType",
          "RoomId",
          "Pincode",
          "DoorNo",
          "Street",
          "Area",
          "City",
          "District",
          "State",
          "Country",
          "PatientType",
          "UHIDNo",
          "UHIDType",
          "Nationality",
          "Religion",
          "Occupation",
          "BloodGroup",
          "Email",
          "MaritalStatus",
          "Gender",
          "SurName",





        ].includes(p)
    );

    if (OPVisitEntry.PatientCategory === "Insurance") {
      const categoryIndex = PatCateg.indexOf("PatientCategory");
      PatCateg.splice(categoryIndex + 1, 0, "InsuranceName", "InsuranceType");
    }
    if (OPVisitEntry.PatientCategory === "Client") {
      const categoryIndex = PatCateg.indexOf("PatientCategory");
      PatCateg.splice(categoryIndex + 1, 0, "ClientName", "ClientType");
    }
    if (OPVisitEntry.PatientCategory === "Corporate") {
      const categoryIndex = PatCateg.indexOf("PatientCategory");
      PatCateg.splice(categoryIndex + 1, 0, "CorporateName", "CorporateType");
    }
    if (
      OPVisitEntry.ClientType === "Self" &&
      OPVisitEntry.PatientCategory === "Client"
    ) {
      const categoryIndex = PatCateg.indexOf("ClientType");
      PatCateg.splice(
        categoryIndex + 1,
        0,
        "ClientEmployeeId",
        "ClientEmployeeDesignation"
      );
    }
    if (
      OPVisitEntry.CorporateType === "Company" &&
      OPVisitEntry.PatientCategory === "Corporate"
    ) {
      const categoryIndex = PatCateg.indexOf("CorporateType");
      PatCateg.splice(
        categoryIndex + 1,
        0,
        "CorporateEmployeeId",
        "CorporateEmployeeDesignation"
      );
    }
    if (
      OPVisitEntry.ClientType === "Family" &&
      OPVisitEntry.PatientCategory === "Client"
    ) {
      const categoryIndex = PatCateg.indexOf("ClientType");
      PatCateg.splice(
        categoryIndex + 1,
        0,
        "ClientEmployeeId",
        "ClientEmployeeDesignation",
        "ClientEmployeeRelation"
      );
    }
    if (
      OPVisitEntry.CorporateType === "Individual" &&
      OPVisitEntry.PatientCategory === "Corporate"
    ) {
      const categoryIndex = PatCateg.indexOf("CorporateType");
      PatCateg.splice(
        categoryIndex + 1,
        0,
        "CorporateEmployeeId",
        "CorporateEmployeeDesignation",
        "CorporateEmployeeRelation"
      );
    }
    if (OPVisitEntry.PatientCategory === "Employee") {
      const categoryIndex = PatCateg.indexOf("PatientCategory");
      PatCateg.splice(categoryIndex + 1, 0, "EmployeeId");
    }
    if (OPVisitEntry.PatientCategory === "EmployeeRelation") {
      const categoryIndex = PatCateg.indexOf("PatientCategory");
      PatCateg.splice(categoryIndex + 1, 0, "EmployeeId", "EmployeeRelation");
    }
    if (OPVisitEntry.PatientCategory === "Doctor") {
      const categoryIndex = PatCateg.indexOf("PatientCategory");
      PatCateg.splice(categoryIndex + 1, 0, "DoctorId");
    }
    if (OPVisitEntry.PatientCategory === "DoctorRelation") {
      const categoryIndex = PatCateg.indexOf("PatientCategory");
      PatCateg.splice(categoryIndex + 1, 0, "DoctorId", "DoctorRelation");
    }
    if (OPVisitEntry.PatientCategory === "Donation") {
      const categoryIndex = PatCateg.indexOf("PatientCategory");
      PatCateg.splice(categoryIndex + 1, 0, "DonationType");
    }

    setPatientCatg(PatCateg);

    // let opdata = Object.keys(OPVisitEntry).filter(
    //   p =>
    //     ![

    //       'InsuranceName',
    //       'InsuranceType',
    //       'ClientName',
    //       'ClientType',
    //       'CorporateName',
    //       'CorporateType',
    //       'VisitPurpose',
    //       // 'DoctorName',
    //       'EmployeeId',
    //       'EmployeeDesignation',
    //       'ClientEmployeeId',
    //       'ClientEmployeeDesignation',
    //       'ClientEmployeeRelation',
    //       'CorporateEmployeeId',
    //       'CorporateEmployeeDesignation',
    //       'CorporateEmployeeRelation',
    //       'EmployeeRelation',
    //       'DoctorId',
    //       'DoctorRelation',
    //       'DonationType',
    //       'ReferralSource',
    //       'ReferredBy',
    //       'AdmissionPurpose',
    //       'DrInchargeAtTimeOfAdmission',
    //       'NextToKinName',
    //       'Relation',
    //       'RelativePhoneNo',
    //       'PersonLiableForBillPayment',
    //       'FamilyHead',
    //       'FamilyHeadName',
    //       'IpKitGiven',
    //       'Building',
    //       'Block',
    //       'Floor',
    //       'WardType',
    //       'RoomType',
    //       'RoomNo',
    //       'BedNo',
    //       'RoomId',
    //       // 'TokenNo',

    //       // 'ServiceCategory',
    //       // 'ServiceSubCategory',
    //     ].includes(p)
    // )

    // if (OPVisitEntry.PatientCategory === 'Insurance') {
    //   const categoryIndex = opdata.indexOf('PatientCategory')
    //   opdata.splice(categoryIndex + 1, 0, 'InsuranceName', 'InsuranceType')
    // }
    // if (OPVisitEntry.PatientCategory === 'Client') {
    //   const categoryIndex = opdata.indexOf('PatientCategory')
    //   opdata.splice(categoryIndex + 1, 0, 'ClientName', 'ClientType')
    // }
    // if (OPVisitEntry.PatientCategory === 'Corporate') {
    //   const categoryIndex = opdata.indexOf('PatientCategory')
    //   opdata.splice(categoryIndex + 1, 0, 'CorporateName', 'CorporateType')
    // }
    // if (
    //   OPVisitEntry.ClientType === 'Self' &&
    //   OPVisitEntry.PatientCategory === 'Client'
    // ) {
    //   const categoryIndex = opdata.indexOf('ClientType')
    //   opdata.splice(
    //     categoryIndex + 1,
    //     0,
    //     'ClientEmployeeId',
    //     'ClientEmployeeDesignation'
    //   )
    // }
    // if (
    //   OPVisitEntry.CorporateType === 'Company' &&
    //   OPVisitEntry.PatientCategory === 'Corporate'
    // ) {
    //   const categoryIndex = opdata.indexOf('CorporateType')
    //   opdata.splice(
    //     categoryIndex + 1,
    //     0,
    //     'CorporateEmployeeId',
    //     'CorporateEmployeeDesignation'
    //   )
    // }
    // if (
    //   OPVisitEntry.ClientType === 'Relative' &&
    //   OPVisitEntry.PatientCategory === 'Client'
    // ) {
    //   const categoryIndex = opdata.indexOf('ClientType')
    //   opdata.splice(
    //     categoryIndex + 1,
    //     0,
    //     'ClientEmployeeId',
    //     'ClientEmployeeDesignation',
    //     'ClientEmployeeRelation'
    //   )
    // }
    // if (
    //   OPVisitEntry.CorporateType === 'Individual' &&
    //   OPVisitEntry.PatientCategory === 'Corporate'
    // ) {
    //   const categoryIndex = opdata.indexOf('CorporateType')
    //   opdata.splice(
    //     categoryIndex + 1,
    //     0,
    //     'CorporateEmployeeId',
    //     'CorporateEmployeeDesignation',
    //     'CorporateEmployeeRelation'
    //   )
    // }
    // if (OPVisitEntry.PatientCategory === 'Employee') {
    //   const categoryIndex = opdata.indexOf('PatientCategory')
    //   opdata.splice(categoryIndex + 1, 0, 'EmployeeId')
    // }
    // if (OPVisitEntry.PatientCategory === 'EmployeeRelation') {
    //   const categoryIndex = opdata.indexOf('PatientCategory')
    //   opdata.splice(categoryIndex + 1, 0, 'EmployeeId', 'EmployeeRelation')
    // }
    // if (OPVisitEntry.PatientCategory === 'Doctor') {
    //   const categoryIndex = opdata.indexOf('PatientCategory')
    //   opdata.splice(categoryIndex + 1, 0, 'DoctorId')
    // }
    // if (OPVisitEntry.PatientCategory === 'DoctorRelation') {
    //   const categoryIndex = opdata.indexOf('PatientCategory')
    //   opdata.splice(categoryIndex + 1, 0, 'DoctorId', 'DoctorRelation')
    // }
    // if (OPVisitEntry.PatientCategory === 'Donation') {
    //   const categoryIndex = opdata.indexOf('PatientCategory')
    //   opdata.splice(categoryIndex + 1, 0, 'DonationType')
    // }
    // setFilteredFormdataOPVisitEntry(opdata)

    let Ipdetialdata = Object.keys(OPVisitEntry).filter((p) =>
      [
        "AdmissionPurpose",
        "DrInchargeAtTimeOfAdmission",
        "NextToKinName",
        // 'FamilyHeadName',
        "Relation",
        "RelativePhoneNo",
        "PersonLiableForBillPayment",
        // "PersonLiablecontactno",
        "FamilyHead",
        "IpKitGiven",
      ].includes(p)
    );
    if (OPVisitEntry.FamilyHead === "Yes") {
      const categoryIndex = Ipdetialdata.indexOf("FamilyHead");
      Ipdetialdata.splice(categoryIndex + 1, 0, "FamilyHeadName");
    }
    setFilteredFormdataIpDetials(Ipdetialdata);
  }, [OPVisitEntry, SpecializationData,RegisterData]);

  // useEffect(() => {
  //   if (UserData && UserData.location && selectedDoctor && TodayDate) {
  //     axios
  //       .get(`${UrlLink}Frontoffice/calender_modal_display_data_by_day`, {
  //         params: {
  //           DoctorId: selectedDoctor,
  //           LocationId: UserData.location,
  //           Date: TodayDate,
  //         },
  //       })
  //       .then((response) => {
  //         const res = response.data;
  //         setDoctorDayData(res);
  //       })
  //       .catch((err) => {
  //         console.error("Error fetching filtered data:", err);
  //       });
  //   }
  // }, [UrlLink, UserData, UserData.location, selectedDoctor,TodayDate]);

  // useEffect(() => {
  //   if (Registeredit && Object.keys(Registeredit).length !== 0) {
  //     setAppointmentRegisType(Registeredit?.Type)
  //     if (Registeredit?.conversion) {
  //       axios
  //         .get(
  //           `${UrlLink}Frontoffice/get_Patient_Details_by_patientId?PatientId=${Registeredit?.PatientId}`
  //         )
  //         .then(res => {
  //           const { PatientProfile, ...resss } = res.data
  //           console.log(resss)
  //           setpatientPhoto(PatientProfile)
  //           setRegisterData(prev => ({
  //             ...prev,
  //             ...resss
  //           }))
  //         })
  //         .catch(err => {
  //           console.log(err)
  //         })
  //     } else if (Registeredit?.appconversion) {
  //       axios
  //         .get(
  //           `${UrlLink}Frontoffice/get_Patient_Details_by_patientId?FirstName=${Registeredit?.FirstName}&PhoneNumber=${Registeredit?.PhoneNumber}`
  //         )
  //         .then(res => {
  //           if (res.data?.warn) {
  //             setRegisterData(prev => ({
  //               ...prev,
  //               DoctorName: Registeredit?.DoctorID,
  //               Speciality: Registeredit?.SpecializationId,
  //               Title: Registeredit?.Title,
  //               FirstName: Registeredit?.FirstName,
  //               MiddleName: Registeredit?.MiddleName,
  //               SurName: Registeredit?.LastName,
  //               PhoneNo: Registeredit?.PhoneNumber,
  //               Email: Registeredit?.Email,
  //               VisitType: Registeredit?.VisitType
  //             }))
  //           } else {
  //             const { PatientProfile, ...resss } = res.data

  //             console.log(resss)
  //             setpatientPhoto(PatientProfile)

  //             setRegisterData(prev => ({
  //               ...prev,
  //               ...resss,
  //               DoctorName: Registeredit?.DoctorID,
  //               Speciality: Registeredit?.SpecializationId,
  //               VisitType: Registeredit?.VisitType
  //             }))
  //           }
  //         })
  //         .catch(err => {
  //           console.log(err)
  //         })
  //     } else {
  //       axios
  //         .get(`${UrlLink}Frontoffice/get_Registration_edit_details`, {
  //           params: {
  //             RegistrationId: Registeredit?.RegistrationId || '',
  //             RegistrationType: Registeredit?.Type || ''
  //           }
  //         })
  //         .then(response => {
  //           const resdata = response.data
  //           const {
  //             BuildingName,
  //             BlockName,
  //             FloorName,
  //             WardTypeName,
  //             RoomTypeName,
  //             PatientProfile,
  //             ...res
  //           } = resdata
  //           setRoomdeditalsShow({
  //             Building: BuildingName,
  //             Block: BlockName,
  //             Floor: FloorName,
  //             WardType: WardTypeName,
  //             RoomType: RoomTypeName,
  //             RoomNo: res.RoomNo,
  //             BedNo: res.BedNo,
  //             RoomId: res.RoomId
  //           })
  //           setpatientPhoto(PatientProfile)
  //           setRegisterData(prev => ({
  //             ...prev,
  //             IsConsciousness: res?.IsConsciousness || 'Yes',
  //             PatientId: res.PatientId || '',
  //             PhoneNo: res.PhoneNo || '',
  //             Title: res.Title || '',
  //             FirstName: res.FirstName || '',
  //             MiddleName: res.MiddleName || '',
  //             SurName: res.SurName || '',
  //             Gender: res.Gender || '',
  //             MaritalStatus: res.MaritalStatus || '',
  //             SpouseName: res.SpouseName || '',
  //             FatherName: res.FatherName || '',
  //             AliasName: res.AliasName || '',
  //             DOB: res.DOB || '',
  //             Age: res.Age || '',
  //             Email: res.Email || '',
  //             BloodGroup: res.BloodGroup || '',
  //             Occupation: res.Occupation || '',
  //             Religion: res.Religion || '',
  //             Nationality: res.Nationality || '',
  //             UHIDType: res.UHIDType || '',
  //             UHIDNo: res.UniqueIdNo || '',

  //             VisitType: res.VisitType || '',

  //             Speciality: res.Speciality || '',
  //             DoctorName: res.DoctorName || '',
  //             Complaint: res.Complaint || '',
  //             PatientType: res.PatientType || 'General',
  //             PatientCategory: res.PatientCategory || 'General',
  //             InsuranceName: res.InsuranceName || '',
  //             InsuranceType: res.InsuranceType || '',
  //             ClientName: res.ClientName || '',
  //             ClientType: res.ClientType || '',
  //             ClientEmployeeId: res.ClientEmployeeId || '',
  //             ClientEmployeeDesignation: res.ClientEmployeeDesignation || '',
  //             ClientEmployeeRelation: res.ClientEmployeeRelation || '',
  //             CorporateName: res.CorporateName || '',
  //             CorporateType: res.CorporateType || '',
  //             CorporateEmployeeId: res.CorporateEmployeeId || '',
  //             CorporateEmployeeDesignation:
  //               res.CorporateEmployeeDesignation || '',
  //             CorporateEmployeeRelation: res.CorporateEmployeeRelation || '',
  //             EmployeeId: res.EmployeeId || '',
  //             EmployeeRelation: res.EmployeeRelation || '',
  //             DoctorId: res.DoctorId || '',
  //             DoctorRelation: res.DoctorRelation || '',
  //             DonationType: res.DonationType || '',
  //             IsMLC: res.IsMLC || '',
  //             Flagging: res.Flagging || 1,
  //             IsReferral: res.IsReferal || '',

  //             ReferralSource: res.ReferralSource || '',
  //             ReferredBy: res.ReferredBy || '',
  //             RouteNo: res.RouteNo || '',
  //             RouteName: res.RouteName || '',
  //             TehsilName: res.TehsilName || '',
  //             VillageName: res.VillageName || '',

  //             DrInchargeAtTimeOfAdmission:
  //               res.DrInchargeAtTimeOfAdmission || '',
  //             NextToKinName: res.NextToKinName || '',
  //             Relation: res.Relation || '',
  //             RelativePhoneNo: res.RelativePhoneNo || '',
  //             PersonLiableForBillPayment: res.PersonLiableForBillPayment || '',
  //             FamilyHead: res.FamilyHead || '',
  //             FamilyHeadName: res.FamilyHeadName || '',
  //             IpKitGiven: res.IpKitGiven || '',

  //             DoorNo: res.DoorNo || '',
  //             Street: res.Street || '',
  //             Area: res.Area || '',
  //             City: res.City || '',
  //             District: res.District || '',
  //             State: res.State || '',
  //             Country: res.Country || '',
  //             Pincode: res.Pincode || '',

  //             Building: res.Building || '',
  //             Block: res.Block || '',
  //             Floor: res.Floor || '',
  //             WardType: res.WardType || '',
  //             RoomType: res.RoomType || '',
  //             RoomNo: res.RoomNo || '',
  //             BedNo: res.BedNo || '',
  //             RoomId: res.RoomId || ''
  //           }))
  //         })
  //         .catch(e => {
  //           console.error('Error fetching patient appointment details:', e)
  //         })
  //     }
  //   } else {
  //     clearRegisterdata()
  //   }
  // }, [Registeredit, UrlLink])

  useEffect(() => {
    const RegistrationId = Registeredit?.RegistrationId;

    console.log(RegistrationId, "RegistrationId");
    if (RegistrationId) {
      axios
        .get(`${UrlLink}Frontoffice/get_IP_Registration_edit_details`, {
          params: {
            RegistrationId,
            // RegistrationId: Registeredit?.RegistrationId || '',
            // RegistrationType: Registeredit?.Type || ''
          },
        })
        .then((response) => {
          const resdata = response.data;
          console.log(resdata, "resdata");

          const {
            BuildingName,
            BlockName,
            FloorName,
            WardTypeName,
            PatientProfile,
            ...res
          } = resdata;

          setRoomdeditalsShow({
            Building: BuildingName,
            Block: BlockName,
            Floor: FloorName,
            WardType: WardTypeName,
            RoomNo: res.RoomNo,
            BedNo: res.BedNo,
            RoomId: res.RoomId,
          });

          // setpatientPhoto(PatientProfile)
          setRegisterData((prev) => ({
            ...prev,
            // IsConsciousness: res?.IsConsciousness || 'Yes',
            PatientId: res.PatientId || "",
            Title: res.Title || "",
            FirstName: res.FirstName || "",
            MiddleName: res.MiddleName || "",
            SurName: res.SurName || "",
            Gender: res.Gender || "",
            MaritalStatus: res.MaritalStatus || "",
            SpouseName: res.SpouseName || "",
            FatherName: res.FatherName || "",
            DOB: res.DOB || "",
            Age: res.Age || "",
            PhoneNo: res.PhoneNo || "",
            Email: res.Email || "",
            BloodGroup: res.BloodGroup || "",
            Occupation: res.Occupation || "",
            Religion: res.Religion || "",
            Nationality: res.Nationality || "",
            UHIDType: res.UniqueIdType || "",
            UHIDNo: res.UniqueIdNo || "",
            PatientType: res.PatientType || "",

            DoorNo: res.DoorNo || "",
            Street: res.Street || "",
            Area: res.Area || "",
            City: res.City || "",
            District: res.District || "",
            State: res.State || "",
            Country: res.Country || "",
            Pincode: res.Pincode || "",
            // VisitType: res.VisitType || '',
            ABHA: res.ABHA || "",
          }));
          console.log("ressssss", res);

          //   function formatVisitDateTime(dateStr, timeStr) {
          //     if (!dateStr || !timeStr) return ""; // Ensure values exist

          //     // Ensure correct parsing
          //     const [year, month, day] = dateStr.split("-").map(Number);
          //     const [hour, minute, second] = timeStr.split(":").map(Number);

          //     // Create a UTC date
          //     const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

          //     // Convert to local timezone & format
          //     return date.toLocaleString("en-US", {
          //         month: "long",
          //         day: "numeric",
          //         year: "numeric",
          //         hour: "numeric",
          //         minute: "2-digit",
          //         hour12: true,
          //     });
          // }


          function parseVisitDateTime(dateStr, timeStr) {
            if (!dateStr || !timeStr) return null; // Ensure values exist

            // Split date into (YYYY-MM-DD) & time into (HH:MM:SS)
            const [year, month, day] = dateStr.split("-").map(Number);
            const [hour, minute, second] = timeStr.split(":").map(Number);

            // Create a valid JavaScript Date object
            return new Date(year, month - 1, day, hour, minute, second);
          }



          setOPVisitEntry({
            Speciality: res.Speciality,
            DoctorName: res.PrimaryDoctor,
            Complaint: res.Complaint,
            IsMLC: res.IsMLC || "",

            PatientCategory: res.PatientCategory || "",

            InsuranceName: res.InsuranceName || "",
            InsuranceType: res.InsuranceType || "",
            ClientName: res.ClientName || "",
            ClientType: res.ClientType || "",
            ClientEmployeeId: res.ClientEmployeeId || "",
            ClientEmployeeDesignation: res.ClientEmployeeDesignation || "",
            ClientEmployeeRelation: res.ClientEmployeeRelation || "",

            CorporateName: res.CorporateName || "",
            CorporateType: res.CorporateType || "",
            CorporateEmployeeId: res.CorporateEmployeeId || "",
            CorporateEmployeeDesignation:
              res.CorporateEmployeeDesignation || "",
            CorporateEmployeeRelation: res.CorporateEmployeeRelation || "",
            EmployeeId: res.EmployeeId || "",
            EmployeeRelation: res.EmployeeRelation || "",
            DoctorId: res.DoctorId || "",
            DoctorRelation: res.DoctorRelation || "",
            DonationType: res.DonationType || "",

            AdmissionPurpose: res.AdmissionPurpose || "",
            DrInchargeAtTimeOfAdmission: res.DrInchargeAtTimeOfAdmission || "",
            NextToKinName: res.NextToKinName || "",
            Relation: res.Relation || "",
            RelativePhoneNo: res.RelativePhoneNo || "",
            VisitDateTime: res.visitDate && res.visitTime ? parseVisitDateTime(res.visitDate, res.visitTime) : "",
            PersonLiableForBillPayment: res.PersonLiableForBillPayment || "",
            PersonLiablecontactno: res.PersonLiablecontactno || "",
            // VisitDateTime: res.visitDate && res.visitTime || "",
            // VisitDateTime: res.visitDate && res.visitTime ? `${res.visitDate} ${res.visitTime}` : "",

            FamilyHead: res.FamilyHead || "",
            FamilyHeadName: res.FamilyHeadName || "",
            // IpKitGiven: res.IpKitGiven || "",

            IsReferral: res.IsReferral || "",
            ReferralSource: res.ReferralSource || "",
            ReferredBy: res.ReferredBy || "",

            Building: res.Building || "",
            Block: res.Block || "",
            Floor: res.Floor || "",
            WardType: res.WardType || "",
            RoomType: res.RoomType || "",
            RoomNo: res.RoomNo || "",
            BedNo: res.BedNo || "",
            RoomId: res.RoomId || "",
          });

          // 👇 Add this after setting OPVisitEntry
          if (res.visitDate && res.visitTime) {
            const parsedDate = parseVisitDateTime(res.visitDate, res.visitTime);

            if (parsedDate) {
              selectedDateRef.current = parsedDate; // Used for filterTime
              setSelectedDate(parsedDate); // This populates DatePicker

              const year = parsedDate.getFullYear();
              const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
              const day = parsedDate.getDate().toString().padStart(2, "0");
              const formattedDate = `${year}-${month}-${day}`;

              const hours = parsedDate.getHours();
              const minutes = parsedDate.getMinutes();
              const hours12 = hours % 12 || 12;
              const formattedMinutes = minutes.toString().padStart(2, "0");
              const formattedTime = `${hours12}:${formattedMinutes}`;

              setVisitDate(formattedDate);
              setVisitTime(formattedTime);
            }
          }



        })
        .catch((e) => {
          console.error("Error fetching patient ip details:", e);
        });
    }
  }, [Registeredit, UrlLink]);

  console.log("11111111", RegisterData);
  console.log("222222222", OPVisitEntry);

  const handleRestrictedAction = () => {
    alert("You do not have permission to perform this action.");
  };

  const handlesubmit = () => {
    setLoading(true);
    scrollToElement("RegisFormcon_11");

    // Define explicitly required fields
    const requiredFields = [
      "Title",
      "FirstName",
      "Gender",
      "DOB",
      "Age",
      "PhoneNo",
      "Building",
      "Block",
      "Floor",
      "WardType",
      "RoomNo",
      "BedNo",
      'Speciality',
      'DoctorName',
      'AdmissionPurpose',
    ];
    const requiredFields1 = [
      "PatientCategory"
    ];

    let missingFields = [];

    // Identify missing fields from the explicitly required list
    requiredFields.forEach((field) => {
      if (!RegisterData[field] && !OPVisitEntry[field]) {
        missingFields.push(formatLabel(field)); // Assuming formatLabel formats field names for display
      }
    });
    requiredFields1.forEach((field) => {
      if (!OPVisitEntry[field]) {
        missingFields.push(formatLabel(field)); // Assuming formatLabel formats field names for display
      }
    });

    console.log("11111111", missingFields);

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
          ...OPVisitEntry,
          // PatientPhoto: patientPhoto,
          PatientId: patientsearch.Search,
          Created_by: UserData?.username,
          RegisterType: AppointmentRegisType,
          RegistrationId: Registeredit?.RegistrationId || "",
          visitDate: visitDate,
          visitTime: visitTime,
          RegisterData: RegisterData,
          selectedDate : formatDateTime(selectedDate),
          // RegisterId: Registeredit?.conversion
          //   ? null
          //   : Registeredit?.RegistrationId,
          // optoip_id: Registeredit?.conversion
          //   ? Registeredit?.RegistrationId
          //   : null,
          Location: UserData?.location,
          // apptoreg: Registeredit?.appconversion ? Registeredit?.id : "",
          // TestNames: FavouriteNamess || [],
          // addedTests: addedTests || [],
        };
        console.log("submitdataaaaaaaaaaaa", submitdata);

        axios
          .post(
            `${UrlLink}Frontoffice/IP_Patient_Registration_Details_Link`,
            submitdata
          )
          .then((res) => {
            setLoading(false);
            console.log('outputttipppp',res.data);
            const resres = res.data;
            let typp = Object.keys(resres)[0];
            let mess = Object.values(resres)[0];
            const tdata = {
              message: mess,
              type: typp,
            };
            dispatchvalue({ type: "toast", value: tdata });
            dispatchvalue({ type: "Registeredit", value: {} });
            setgetdata((prev) => !prev);

            clearRegisterdata();
            dispatchvalue({ type: "PatientDetails", value: {} });
            dispatchvalue({ type: "SelectRoomRegister", value: {} });
            dispatchvalue({ type: "RegisterRoomShow", value: {} });
            
            //======================temporary commented line
            
            // navigate("/Home/WardManagementFolder");
            // dispatchvalue({ type: "HrFolder", value: "IPHandOverList" });

            //======================temporary commented line


            // if(Registeredit.Nav === true){

            // navigate("/Home/FrontOfficeFolder");
            // dispatchvalue({ type: "HrFolder", value: "RegistrationList" });
            // console.log({ type: "HrFolder", value: "RegistrationList" },'aaaaaaaaawwwwddddddddd');

            // dispatchvalue({ type: "setPreviousFolder", value: null });
            // dispatchvalue({ type: "showMenu", value: true });

            // }

            dispatchvalue({ type: "setPreviousFolder", value: null });
            dispatchvalue({ type: "showMenu", value: true });
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

  return (
    <>
      <div className="Main_container_app">
        <h3>In-Patient Registration</h3>
        <br />

        <div className="DivCenter_container">Personal Details</div>
        <br />

        <div className="RegisForm_12">
          <label>
            Patient Search <span>:</span>
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
              {FilterbyPatientId.map((row, indx) => {
                const name = [row.FirstName, row.MiddleName, row.SurName].filter(Boolean).join(' ');
                const guardian = row.FatherName || row.SpouseName;
                const addressParts = [
                  // row.DoorNo,
                  row.Street,
                  row.Area,
                  row.City,
                  // row.District,
                  // row.State,
                  // row.Country,
                  // row.Pincode,
                ].filter(Boolean);
                
                const details = [
                  row.PhoneNo ? `Ph: ${row.PhoneNo}` : null,
                  name ? `Name: ${name}` : null,
                  row.UHIDNo ? `Aadhar: ${row.UHIDNo}` : null,
                  guardian ? `Father/Spouse: ${guardian}` : null,
                  addressParts.length ? `Address: ${addressParts.join(', ')}` : null,
                ].filter(Boolean).join(' | ');

                return <option key={indx} value={row.PatientId}>{details}</option>;
              })}
            </datalist>
            {patientsearch.Search && (
              <span onClick={() => HandlesearchPatient(patientsearch.Search)}>
                <PersonSearchIcon />
              </span>
            )}
          </div>
          {patientsearch.Search !== '' && BillDueChanges && (
            <div className="RegisForm_12 uvkvbf_sri">
              <div className="bill-due-container">
                {BillDue.OP_ResultType !== 'No Due' && (
                  <div className="bill-due-item">
                    <label>{`OP ${BillDue.OP_ResultType}`} <span>:</span></label>
                    <span>{BillDue.OP_Amount}</span>
                  </div>
                )}
                {BillDue.IP_ResultType !== 'No Due' && (
                  <div className="bill-due-item">
                    <label>{`IP ${BillDue.IP_ResultType}`} <span>:</span></label>
                    <span>{BillDue.IP_Amount}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <br />
        
        <div className="RegisFormcon" id="RegisFormcon_11" ref={gridRef}>
          {FilteredFormdata &&
            FilteredFormdata.filter((p) => p !== "Photo").map(
              (field, index) => (
                <div className="RegisForm_1" key={index}>
                  <label htmlFor={`${field}_${index}`}>
                    {/* <div className=''> */}
                    {field === "Title" ||
                      field === "Gender" ||
                      field === "PhoneNo" ||
                      field === "FirstName" ? (
                      <>
                        {field === "Title" && "Title"}
                        {field === "Gender" && "Gender"}
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
                    ) : field === "ANCNumber" ? (
                      "ANC Number"
                    ) : field === "MCTSNo" ? (
                      "MCTS No"
                    ) : (
                      formatLabel(field)
                    )}
                    {/* </div> */}
                    <span>:</span>
                  </label>

                  {[
                    // 'VisitPurpose',
                    "Title",
                    "Gender",
                    "MaritalStatus",
                    "BloodGroup",
                    "Religion",
                    "Nationality",
                    "UHIDType",
                    "PatientType",
                  ].includes(field) ? (
                    <select
                      id={`${field}_${index}`}
                      name={field}
                      value={RegisterData[field]}
                      onChange={HandleRegchange}
                    //  disabled
                    >
                      <option value="">Select</option>

                      {field === "Title" &&
                        TitleNameData?.map((row, indx) => (
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
                            ["Aadhar", "VoterId", "SmartCard"].map(
                              (row, indx) => (
                                <option key={indx} value={row}>
                                  {row}
                                </option>
                              )
                            )}
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
                    </select>
                  ) : ["PhoneNo", "FirstName"].includes(field) ? (
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
                        // readOnly
                        required
                        value={RegisterData[field]}
                        onChange={HandleRegchange}
                      />
                    </div>
                  ) : (
                    <input
                      id={`${field}_${index}`}
                      autoComplete="off"
                      type={field === "DOB" ? "date" : "text"}
                      name={field}
                      pattern={
                        field === "Email"
                          ? "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[cC][oO][mM]$"
                          : field === "PhoneNo"
                            ? "\\d{10}"
                            : ["UHIDNo"].includes(field)
                              ? "[A-Za-z0-9]+"
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
                      //  readOnly
                      value={RegisterData[field]}
                      onKeyDown={
                        [
                          "MiddleName",
                          "SurName",
                          // 'AliasName',
                          "Occupation",
                          // 'NextToKinName',
                          // 'FamilyHeadName',
                          "Street",
                          "Area",
                          "City",
                          "District",
                          "State",
                          // 'Complaint',
                          "Country",
                        ].includes(field)
                          ? handleKeyDownTextRegistration
                          : field === "PhoneNo"
                            ? handleKeyDownPhoneNo
                            : null
                      }
                      onChange={HandleRegchange}
                    />
                  )}
                </div>
              )
            )}

          {PatientCatg &&
            PatientCatg.map((field, index) => (
              <div className="RegisForm_1" key={index}>
                <label htmlFor={`${field}_${index}`}>
                  {formatLabel(field)}
                  <span className="requirreg12">**</span>{" "}
                  <span>:</span>
                </label>
                {[
                  "PatientCategory",
                  "InsuranceName",
                  "InsuranceType",
                  "ClientName",
                  "ClientEmployeeRelation",
                  "DonationType",

                  "EmployeeRelation",
                  "EmployeeId",
                  "EmployeeRelation",
                  "DoctorId",
                  "DoctorRelation",
                ].includes(field) ? (
                  <select
                    id={`${field}_${index}`}
                    name={field}
                    value={OPVisitEntry[field]}
                    onChange={HandleOnchange}
                  >
                    <option value="">Select</option>

                    {field === "PatientCategory" &&
                      [
                        "General",
                        "Student",
                        "Camp",
                        "FreeAll",
                        "KRCL",
                        "Insurance",
                        "Client",
                        // 'Corporate',
                        "Donation",
                        "Employee",
                        "EmployeeRelation",
                        "Doctor",
                        "DoctorRelation",
                        "OBGSCHEME",
                        "WellWisher"
                      ].map((row, indx) => (
                        <option key={indx} value={row}>
                          {row}
                        </option>
                      ))}

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
                        (p) => p.id !== OPVisitEntry.DoctorName
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
                            ? `${row?.Name}`
                            : `${row?.Name}`}
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
                ) : ["ClientType"].includes(field) ? (
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
                            ? OPVisitEntry[field] === "Self"
                            : field === "CorporateType"
                              ? OPVisitEntry[field] === "Company"
                              : OPVisitEntry[field] === "Yes"
                        }
                        onChange={(e) =>
                          setOPVisitEntry((prevState) => ({
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
                            ? "Family"
                            : field === "CorporateType"
                              ? "Individual"
                              : "No"
                        }
                        style={{ width: "15px" }}
                        checked={
                          field === "ClientType"
                            ? OPVisitEntry[field] === "Family"
                            : field === "CorporateType"
                              ? OPVisitEntry[field] === "Individual"
                              : OPVisitEntry[field] === "No"
                        }
                        onChange={(e) =>
                          setOPVisitEntry((prevState) => ({
                            ...prevState,
                            [field]:
                              field === "ClientType"
                                ? "Family"
                                : field === "CorporateType"
                                  ? "Individual"
                                  : "No",
                          }))
                        }
                      />
                      {field === "ClientType"
                        ? "Family"
                        : field === "CorporateType"
                          ? "Individual"
                          : "No"}
                    </label>
                  </div>
                ) : field === "Complaint" ? (
                  <textarea
                    id={`${field}_${index}`}
                    autoComplete="off"
                    name={field}
                    required
                    value={OPVisitEntry[field]}
                    onChange={HandleOnchange}
                  />
                ) : (
                  <input
                    autoComplete="off"
                    type="text"
                    name={field}
                    value={OPVisitEntry[field]}
                    onChange={HandleOnchange}
                  />
                )}
              </div>
            ))}

          {FilteredFamilyDetails?.map((field, index) => (
            <div className="RegisForm_1" key={index}>
              <label htmlFor={`${field}_${index}`}>
                {formatLabel(field)}
                <span>:</span>
              </label>
              {field === "Relation" ? (
                <select
                  id={`${field}_${index}`}
                  name={field}
                  value={OPVisitEntry[field] || ""}
                  onChange={HandleOnchange}
                >
                  <option value="">Select</option>
                  {relationships?.map((row, indx) => (
                    <option key={indx} value={row}>
                      {row}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  autoComplete="off"
                  type={field === "RelativePhoneNo" ? "number" : "text"}
                  name={field}
                  value={OPVisitEntry[field] || ""}
                  onKeyDown={
                    field === "NextToKinName"
                      ? handleKeyDownTextRegistration
                      : undefined
                  }
                  onChange={HandleOnchange}
                />
              )}
            </div>
          ))}
        </div>



        {/* ----------------- Address --------------- */}
{/* 
        <br />

        <div className="DivCenter_container">Address</div>
        <br />

        <div className="RegisFormcon" id="RegisFormcon_11" ref={gridRef}>
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
                  onChange={HandleRegchange}
                // readOnly
                />
              </div>
            ))}
        </div> */}

        {/* ----------------- OP Visit --------------- */}
        <br />

        <div className="DivCenter_container">IP Visit</div>
        <br />

        <div className="RegisFormcon" id="RegisFormcon_11" ref={gridRef}>
          {FilteredFormdataOPVisitEntry &&
            FilteredFormdataOPVisitEntry.filter((field) =>
              OPVisitEntry.FamilyHead === "No"
                ? field !== "FamilyHeadName"
                : true
            ).map((field, index) => (
              <div className="RegisForm_1" key={index}>
                <label htmlFor={`${field}_${index}`}>
                  {field === "FamilyHeadName"
                    ? "FamilyHead Name"
                    : formatLabel(field)}
                  <span>:</span>
                </label>
 
                {/* ---------- SELECT FIELDS ---------- */}
                {[
                  "Speciality",
                  "AdmissionPurpose",
                  "DoctorName",
                  "ReferralSource",
                  "ReferredBy",
                  "PatientCategory",
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
                  "Relation",
                ].includes(field) ? (
                  <select
                    id={`${field}_${index}`}
                    name={field}
                    value={OPVisitEntry[field]}
                    onChange={HandleOnchange}
                  >
                    <option value="">Select</option>
 
                    {field === "Speciality" && 
  Array.isArray(SpecializationData) && 
  SpecializationData.filter(
    (p) => p.Status === "Active" && p.SpecialityName !== "OBST&GYNECOLOGY"
  ).map((Catg) => (
    <option key={Catg.id} value={Catg.id}>
      {Catg.SpecialityName}
    </option>
  ))
}

 
                    {field === "DoctorName" && Array.isArray(DoctorData) &&
                      DoctorData?.map((row, indx) => (
                        <option key={indx} value={row.doctor_id}>
                          {row.doctor_name}
                        </option>
                      ))}
 
                    {field === "AdmissionPurpose" &&
                      ["Medical-Management", "Surgery", "Day-Care"].map(
                        (row, indx) => (
                          <option key={indx} value={row}>
                            {row}
                          </option>
                        )
                      )}
 
                    {field === "PatientCategory" &&
                      [
                        "General",
                        "Student",
                        "Insurance",
                        "Client",
                        "Donation",
                        "Employee",
                        "EmployeeRelation",
                        "Doctor",
                        "DoctorRelation",
                      ].map((row, indx) => (
                        <option key={indx} value={row}>
                          {row}
                        </option>
                      ))}
 
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
                      "Relation",
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
                            ? `${row?.Name}`
                            : `${row?.Name}`}
                        </option>
                      ))}
 
                    {field === "DonationType" &&
                      DonationData?.map((row, indx) => (
                        <option key={indx} value={row.id}>
                          {`${row?.Type} - ${row?.Name}`}
                        </option>
                      ))}
                  </select>
                ) : field === "DrInchargeAtTimeOfAdmission" ? (
                  /* ---------- DATALIST FIELD ---------- */
                  <>
                    <input
                      type="text"
                      id={`${field}_${index}`}
                      name={field}
                      list="doctorList"
                      value={Inchargedocname || ""}
                      onChange={HandleDocChange}
                      placeholder="Select Doctor"
                    />
                    <datalist id="doctorList">
                      {AllDoctorData.map((row, indx) => (
                        <option key={indx} value={`${row.id}|${row.Name}`} >
                        {row.Name}
                        </option>
                      ))}
                    </datalist>
                  </>
                ) : [
                    "IsMLC",
                    "FamilyHead",
                    "IsReferral",
                    "ClientType",
                    "CorporateType",
                    "ClientEmployeeRelation",
                  ].includes(field) ? (
                  /* ---------- RADIO BUTTON FIELDS ---------- */
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "150px",
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
                            ? OPVisitEntry[field] === "Self"
                            : field === "CorporateType"
                              ? OPVisitEntry[field] === "Company"
                              : OPVisitEntry[field] === "Yes"
                        }
                        onChange={(e) =>
                          setOPVisitEntry((prevState) => ({
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
                            ? OPVisitEntry[field] === "Relative"
                            : field === "CorporateType"
                              ? OPVisitEntry[field] === "Individual"
                              : OPVisitEntry[field] === "No"
                        }
                        onChange={(e) =>
                          setOPVisitEntry((prevState) => ({
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
                ) : field === "Complaint" ? (
                  /* ---------- SPECIAL CASE COMPLAINT ---------- */
                  selectedSpecialityName === "OBST&GYNECOLOGY" ? (
                    <select
                      id={`${field}_${index}`}
                      name={field}
                      value={OPVisitEntry[field] || ""}
                      onChange={HandleOnchange}
                      required
                    >
                      <option value="">SELECT</option>
                      <option value="GYNECOLOGY">GYNECOLOGY</option>
                      <option value="OBSTETRICS">OBSTETRICS</option>
                    </select>
                  ) : selectedSpecialityName === "PAEDIATRICS" ? (
                    <select
                      id={`${field}_${index}`}
                      name={field}
                      value={OPVisitEntry[field] || ""}
                      onChange={HandleOnchange}
                      required
                    >
                      <option value="">SELECT</option>
                      <option value="PAEDIATRICS">PAEDIATRICS</option>
                      <option value="NEONATAL">NEONATAL</option>
                    </select>
                  ) : (
                    <textarea
                      id={`${field}_${index}`}
                      autoComplete="off"
                      name={field}
                      required
                      value={OPVisitEntry[field] || ""}
                      onChange={(e) => {
                        HandleOnchange(e);
                        adjustHeight(e);
                      }}
                    />
                  )
                ) : field === "TokenNo" && TokenData ? (
                  <input type="number" value={TokenData} readOnly />
                ) : field === "VisitDateTime" ? (
                  /* ---------- DATE PICKER ---------- */
                  <DatePicker
                    autoComplete="off"
                    selected={selectedDate}
                    onChange={handleDateChange}
                    showTimeSelect
                    name="VisitDateTime"
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select a date and time"
                    className="border p-2 rounded w-full"
                    injectTimes={[new Date()]}
                  />

                ) : field === "FamilyHeadName" && OPVisitEntry.FamilyHead === "Yes" ? (
                  <input
                    autoComplete="off"
                    type="text"
                    name="FamilyHeadName"
                    value={OPVisitEntry.FamilyHeadName || ""}
                    onChange={HandleOnchange}
                  />
                ) : (
                  field !== "FamilyHeadName" && (
                    <input
                      autoComplete="off"
                      type="text"
                      name={field}
                      value={OPVisitEntry[field] || ""}
                      onChange={HandleOnchange}
                    />
                  )
                )}
              </div>
            ))}
        </div>
 

        {/* ----------------- Referral --------------- */}

        {OPVisitEntry.IsReferral === "Yes" && (
          <>
            <br />

            <div className="DivCenter_container">Referral</div>
            <br />

            <div className="RegisFormcon" id="RegisFormcon_11" ref={gridRef}>
              {FilteredFormdataRoute &&
                FilteredFormdataRoute.map((field, index) => (
                  <div className="RegisForm_1" key={index}>
                    <label htmlFor={`${field}_${index}`}>
                      {formatLabel(field)}
                      <span>:</span>
                    </label>
                    {["ReferralSource", "ReferredBy"].includes(field) && (
                      <select
                        id={`${field}_${index}`}
                        name={field}
                        value={OPVisitEntry[field]}
                        onChange={HandleOnchange}
                        readOnly
                      >
                        <option value="">Select</option>

                        {field === "ReferralSource" &&
                          ["Call", "Letter", "Oral"].map((row, indx) => (
                            <option key={indx} value={row}>
                              {row}
                            </option>
                          ))}
                        {field === "ReferredBy" &&
                          ReferralDoctorData.map((row, indx) => (
                            <option key={indx} value={row.id}>
                              {row.ShortName}
                            </option>
                            // <option value="">Select</option>
                          ))}
                        {/* <option value="">Others</option> */}
                      </select>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}

        <br />

        {/* -----------------Patient Category --------------- */}


        {/* ----------------- Next to kin --------------- */}


        {/* {FilteredFormdataIpDetials &&
            FilteredFormdataIpDetials.map((field, index) => (
              <div className='RegisForm_1' key={index}>
                <label htmlFor={field}>
                  {formatLabel(field)}
                  <span>:</span>
                </label>
                {field === 'FamilyHead' || field === 'IpKitGiven' ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '135px'
                    }}
                  >
                    <label style={{ width: '60px' }}>
                      <input
                        id='MLCYes'
                        type='radio'
                        name={field}
                        value='Yes'
                        style={{ width: '15px' }}
                        checked={OPVisitEntry[field] === 'Yes'}
                        onChange={e =>
                          setOPVisitEntry(prevState => ({
                            ...prevState,
                            [field]: 'Yes'
                          }))
                        }
                      />
                      Yes
                    </label>
                    <label style={{ width: '60px' }}>
                      <input
                        id='MLCNo'
                        type='radio'
                        name={field}
                        value='No'
                        style={{ width: '15px' }}
                        checked={OPVisitEntry[field] === 'No'}
                        onChange={e =>
                          setOPVisitEntry(prevState => ({
                            ...prevState,
                            [field]: 'No'
                          }))
                        }
                      />
                      No
                    </label>
                  </div>
                ) : [
                  'Relation',
                  'DrInchargeAtTimeOfAdmission',
                  'AdmissionPurpose'
                ].includes(field) ? (
                  <select
                    id={`${field}_${index}`}
                    name={field}
                    value={OPVisitEntry[field]}
                    onChange={HandleOnchange}
                  >
                    <option value=''>Select</option>

                    {field === 'Relation' &&
                      relationships.map((row, indx) => (
                        <option key={indx} value={row}>
                          {row}
                        </option>
                      ))}

                    {field === 'DrInchargeAtTimeOfAdmission' &&
                      AllDoctorData.map((row, indx) => (
                        <option key={indx} value={row.id}>
                          {row.ShortName}
                        </option>
                      ))}
                    {field === 'AdmissionPurpose' &&
                      ['Medical-Management', 'Surgery', 'Day-Care'].map(
                        (row, indx) => (
                          <option key={indx} value={row}>
                            {row}
                          </option>
                        )
                      )}
                  </select>
                ) : (
                  <input
                    autoComplete='off'
                    type={field === 'RelativePhoneNo' ? 'number' : 'text'}
                    name={field}
                    pattern={
                      field === 'RelativePhoneNo' ? '\\d{10}' : '[A-Za-z]+'
                    }
                    onKeyDown={e =>
                      ['e', 'E', '+', '-'].includes(e.key) &&
                      e.preventDefault()
                    }
                    className={
                      errors[field] === 'Invalid'
                        ? 'invalid'
                        : errors[field] === 'Valid'
                          ? 'valid'
                          : ''
                    }
                    value={OPVisitEntry[field]}
                    onChange={HandleOnchange}
                  />
                )}
              </div>
            ))} */}

        {
          <>
            <div className="DivCenter_container">Room Details </div>
            <div
              className="DivCenter_container "
              style={{ justifyContent: "centerd" }}
            >
              <IoBedOutline
                className="HotelIcon_registration"
                onClick={() => {
                  if (
                    Object.keys(Registeredit).length !== 0 &&
                    !Registeredit?.conversion
                  ) {
                    const tdata = {
                      message:
                        "Unable to select the room because it is already selected and cannot be updated.",
                      type: "warn",
                    };
                    dispatchvalue({ type: "toast", value: tdata });
                  } else {
                    dispatchvalue({
                      type: "RegisterRoomShow",
                      value: { type: AppointmentRegisType, val: true },
                    });
                  }
                }}
              />
            </div>

            <div className="RegisFormcon" id="RegisFormcon_11" ref={gridRef}>
              {FilteredFormdataIpRoomDetials &&
                FilteredFormdataIpRoomDetials.map((field, index) => (
                  <div className="RegisForm_1" key={index}>
                    <label htmlFor={`${field}_${index}`}>
                      {field === "Building" ||
                        field === "Block" ||
                        field === "Floor" ||
                        field === "WardType" ||
                        field === "RoomNo" ||
                        field === "BedNo" ? (
                        <>
                          {field === "Building" && "Building"}
                          {field === "Block" && "Block"}
                          {field === "Floor" && "Floor"}
                          {field === "WardType" && "WardType"}
                          {field === "RoomNo" && "RoomNo"}
                          {field === "BedNo" && "BedNo"}
                          <span className="requirreg12">*</span>{" "}
                          {/* Single star for required fields */}
                        </>
                      ) : (
                        formatLabel(field)
                      )}
                      <span>:</span>
                    </label>

                    <input
                      type="text"
                      disabled
                      id={`${field}_${index}`}
                      name={field}
                      value={RoomdeditalsShow[field]}
                      onChange={HandleOnchange}
                    />
                  </div>
                ))}
            </div>
          </>
        }

        <div className="Main_container_Btn">
          <button 
          onClick={handleSaveClick}
          className={`px-4 py-2 rounded ${
            UserData?.Create
              ? "bg-blue-500 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          >
            {Object.keys(Registeredit).length !== 0 &&
              (Registeredit?.conversion
                ? !Registeredit?.conversion
                : Registeredit?.appconversion
                  ? !Registeredit?.appconversion
                  : true)
              ? "Update"
              : "Save"}
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
        <ToastAlert Message={toast.message} Type={toast.type} />
        <ReactGrid columns={RegisterColumn} RowData={PatientRegisterData} />


        {openModal && (
              <div className="sideopen_showcamera_profile" onClick={handleCloseModal}>
                  <div className="newwProfiles newwPopupforreason" onClick={(e) => e.stopPropagation()}>
                      <h2>{openModal}</h2>
                      
                      {getModalContent()}


                      <div className="Main_container_Btn">
                      <button onClick={handleCloseModal}>Close</button>
                      </div> </div>
              </div>
          )}
        
        {RegisterRoomShow.val && <RoomDetialsSelect />}
        <br />
      </div>
    </>
  );
};

export default IPRegistration;
