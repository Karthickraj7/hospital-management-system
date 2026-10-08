import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { format } from "date-fns";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useNavigate } from "react-router-dom";
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  startOfYear,
  subYears,
  isBefore,
  addMonths,
  addYears,
} from "date-fns";

import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import { Button } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";

import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import { handleKeyDownPhoneNo } from "../OtherComponent/OtherFunctions";
import { handleKeyDownText } from "../OtherComponent/OtherFunctions";



const PatientDetailsEdit = () => {
  const dispatchvalue = useDispatch();
  const dispatch = useDispatch();

  const PatientListId = useSelector(
    (state) => state.Frontoffice?.PatientListId
  );
  const navigate = useNavigate();

  // console.log(PatientListId,'111111111111');
  const toast = useSelector((state) => state.userRecord?.toast);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  // console.log(userRecord,'userRecord');
  const [BloodGroupData, setBloodGroupData] = useState([]);
  const [ReligionData, setReligionData] = useState([]);
  const [errors, setErrors] = useState({});
  const [FlaggData, setFlaggData] = useState([]);
  const [InsuranceData, setInsuranceData] = useState([]);
  const [ClientData, setClientData] = useState([]);
  const [DonationData, setDonationData] = useState([]);
  const [EmployeeData, setEmployeeData] = useState([]);
  // console.log(FlaggData,'FlaggDataaaaaaaaaaa');
  const [TitleNameData, setTitleNameData] = useState([]);

  const [DoctorIdData, setDoctorIdData] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [FilterbyPatientNo, setFilterbyPatientNo] = useState([]);
  const [RegPatientId, setRegPatientId] = useState(null);
  const [postdata, setPostData] = useState(null);

  const [patientList, setPatientList] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
//----------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
    const [familyData, setFamilyData] = useState([]);
    // const [familyMembersData, setFamilyMembersData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [primaryPatientId, setPrimaryPatientId] = useState(null);
//----------------------------------------------

  const [FamilymembersData, setFamilymembersData] = useState([]);

  const [FilteredFormdata, setFilteredFormdata] = useState(null);
  const [UhidNo, setUhidNo] = useState(null);
  
  const [FilteredFormdataAddress, setFilteredFormdataAddress] = useState(null);
  const [FilteredFormdataPermanentAddress,setFilteredFormdataPermanentAddress] = useState(null);
  const [loading, setLoading] = useState(false);


// ---------------------ABHA----------------------
  const [otpVisible, setOtpvisible] = useState(false);
  const [MobileOtpVisible, setMobileOtpVisible] = useState(false);// To toggle OTP input visibility
  const [otp, setOtp] = useState(""); // To store OTP value
  const [Mobile_Otp, setMobile_Otp] = useState(""); // To store OTP value
  const [abhadd, setAbhaadd] = useState(""); // To store OTP value
  
  const [txnId, setTxnId] = useState('');
  const [accesstoken, setAccesstoken] = useState('');
  const [xToken, setXtoken] = useState("");
  const [selectedrow, setselectedrow] = useState(false);
  const [smartCardDetailes, setSmartCardDetailes] = useState({});
  const [MobileOtp, setMobileOtp] = useState(null);
  const [OtpNumber, setOtpNumber] = useState(null);
  const [Abhaaddress, setAbhaaddress] = useState(null);
  
  const [ABHA_Number, setABHA_Number] = useState('');

  console.log(abhadd,'abhadd----------');
  


  const [PatientEdit, setPatientEdit] = useState({
    PatientId: "",
    ExistingPtNo: "",
    ABHA: "",
    Title: "",
    FirstName: "",
    MiddleName: "",
    SurName: "",
    DOB: "",
    Age: "",
    Gender: "",
    PhoneNo: "",
    Email: "",
    MaritalStatus: "",
    SpouseName: "",
    FatherName: "",
    AliasName: "",
    BloodGroup: "",
    Occupation: "",
    Religion: "",
    Nationality: "",
    UniqueIdType: "",
    UniqueIdNo: "",
    PatientType: "",

    // PatientCategory: "",
    // InsuranceName: "",
    // InsuranceType: "",
    // ClientName: "",
    // ClientType: "Self",
    // ClientEmployeeId: "",
    // ClientEmployeeDesignation: "",
    // ClientEmployeeRelation: "",
    // EmployeeId: "",
    // EmployeeRelation: "",
    // DoctorId: "",
    // DoctorRelation: "",
    // DonationType: "",

    Flagging: "",

    Pincode: "",
    DoorNo: "",
    Street: "",
    Area: "",
    City: "",
    District: "",
    State: "",
    Country: "",


    // PERMANENT ADDRESS
    PermanentPincode: "",
    PermanentdoorNo: "",
    PermanentStreet: "",
    PermanentArea: "",
    PermanentCity: "",
    PermanentDistrict: "",
    PermanentState: "",
    PermanentCountry: "",
    PermanentAddressSameAsAbove: "Yes",


    Photo: null,

    EnterOTP: "",
    AbhaAddress: "",
    EnterMobileOtp: "",

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

  useEffect(() => {
    console.log(PatientListId, "PatientListId after navigation");
  }, [PatientListId]);

  useEffect(() => {
    const PatientId = PatientListId?.PatientId;

    if (PatientId) {
      axios
        .get(`${UrlLink}Frontoffice/Patient_Master_List`, {
          params: { PatientId },
        })
        .then((res) => {
          const data = res.data; // Assume the response data contains the patient details
          console.log(data, "dataaaa");

          const OP = data?.OP_details?.[0];
          console.log(OP, "aaaaaaaaaa");
          const IP = data?.IP_details?.[0];
          console.log(IP, "bbbbbbbbb");
          const Casuality = data?.Casuality_details?.[0];
          console.log(Casuality, "ccccccccc");
          const Diagnosis = data?.Diagnosis_details?.[0];
          console.log(Diagnosis, "dddddddd");
          const Laboratory = data?.Laboratory_details?.[0];
          console.log(Laboratory, "eeeeeeeee");

          if (data) {
            setPatientEdit((prev) => ({
              ...prev, // Spread previous state

              PatientId: data.PatientId || "", // Update PatientId
              ExistingPtNo: data.ExistingPtNo || "", // Update PatientId
              PhoneNo: data.PhoneNo || "", // Update PhoneNo
              Title: data.Title || "",
              FirstName: data.FirstName || "",
              MiddleName: data.MiddleName || "",
              SurName: data.SurName || "",
              Gender: data.Gender || "",
              MaritalStatus: data.MaritalStatus || "",
              SpouseName: data.SpouseName || "",
              FatherName: data.FatherName || "",
              AliasName: data.AliasName || "",
              DOB: data.DOB || "",
              Age: data.Age || "",
              Email: data.Email || "",
              BloodGroup: data.BloodGroup || "",
              Occupation: data.Occupation || "",
              Religion: data.Religion || "",
              Nationality: data.Nationality || "",
              UniqueIdType: data.UniqueIdType || "",
              UniqueIdNo: data.UniqueIdNo || "",
              DoorNo: data.DoorNo || "",
              Street: data.Street || "",
              Area: data.Area || "",
              City: data.City || "",
              District: data.District || "",
              State: data.State || "",
              Country: data.Country || "",
              Pincode: data.Pincode || "",
              PatientType: data.PatientType || "",
              Flagging: data.Flagging || "",
              ABHA: data.ABHA || "",
              PermanentAddressSameAsAbove:data.PermanentAddressSameAsAbove || "",
              PermanentPincode: data.PermanentPincode || "",
              PermanentdoorNo: data.PermanentdoorNo || "",
              PermanentStreet: data.PermanentStreet || "",
              PermanentArea: data.PermanentArea || "",
              PermanentCity: data.PermanentCity || "",
              PermanentDistrict: data.PermanentDistrict || "",
              PermanentState: data.PermanentState || "",
              PermanentCountry: data.PermanentCountry || "",
              Photo: data.Photo || "",

              // PatientType: OP?.PatientType || IP?.PatientType || Casuality?.PatientType || Diagnosis?.PatientType || Laboratory?.PatientType|| "",
              // PatientCategory: OP?.PatientCategory || IP?.PatientCategory || Casuality?.PatientCategory || Diagnosis?.PatientCategory || Laboratory?.PatientCategory ||  "",
              // InsuranceName: OP?.InsuranceName || IP?.InsuranceName || Casuality?.InsuranceName || Diagnosis?.InsuranceName || Laboratory?.InsuranceName ||  "",
              // InsuranceType: OP?.InsuranceType || IP?.InsuranceType || Casuality?.InsuranceType || Diagnosis?.InsuranceType || Laboratory?.InsuranceType ||  "",
              // ClientName: OP?.ClientName || IP?.ClientName || Casuality?.ClientName || Diagnosis?.ClientName || Laboratory?.ClientName ||  "",
              // ClientType: OP?.ClientType || IP?.ClientType || Casuality?.ClientType || Diagnosis?.ClientType || Laboratory?.ClientType ||  "",
              // ClientEmployeeId: OP?.ClientEmployeeId || IP?.ClientEmployeeId || Casuality?.ClientEmployeeId || Diagnosis?.ClientEmployeeId || Laboratory?.ClientEmployeeId ||  "",
              // ClientEmployeeDesignation: OP?.ClientEmployeeDesignation || IP?.ClientEmployeeDesignation || Casuality?.ClientEmployeeDesignation || Diagnosis?.ClientEmployeeDesignation || Laboratory?.ClientEmployeeDesignation ||  "",
              // ClientEmployeeRelation: OP?.ClientEmployeeRelation || IP?.ClientEmployeeRelation || Casuality?.ClientEmployeeRelation || Diagnosis?.ClientEmployeeRelation || Laboratory?.ClientEmployeeRelation ||  "",
              // EmployeeId: OP?.EmployeeId || IP?.EmployeeId || Casuality?.EmployeeId || Diagnosis?.EmployeeId || Laboratory?.EmployeeId ||  "",
              // EmployeeRelation: OP?.EmployeeRelation || IP?.EmployeeRelation || Casuality?.EmployeeRelation || Diagnosis?.EmployeeRelation || Laboratory?.EmployeeRelation ||  "",
              // DoctorId: OP?.DoctorId || IP?.DoctorId || Casuality?.DoctorId || Diagnosis?.DoctorId || Laboratory?.DoctorId ||  "",
              // DoctorRelation: OP?.DoctorRelation || IP?.DoctorRelation || Casuality?.DoctorRelation || Diagnosis?.DoctorRelation || Laboratory?.DoctorRelation ||  "",
              // DonationType: OP?.DonationType || IP?.DonationType || Casuality?.DonationType || Diagnosis?.DonationType || Laboratory?.DonationType ||  "",
              // Flagging:OP?.Flagging || IP?.Flagging || Casuality?.Flagging || Diagnosis?.Flagging || Laboratory?.Flagging || "",
            }));
          }
        })
        .catch((err) => {
          console.error("Error fetching patient data:", err);
        });
    }
  }, [PatientListId, UrlLink]);

  useEffect(() => {
    let PersonalData = Object.keys(PatientEdit).filter((p) =>
      [
        "PatientId",
        "ExistingPtNo",
        "ABHA",
        "Title",
        "FirstName",
        "MiddleName",
        "SurName",
        "DOB",
        "Age",
        "Gender",
        "PhoneNo",
        "Email",
        "MaritalStatus",
        "SpouseName",
        "AliasName",
        "FatherName",
        "BloodGroup",
        "Occupation",
        "Religion",
        "Nationality",
        "UniqueIdType",
        "UniqueIdNo",
        "PatientType",
        "Flagging",
      ].includes(p)
    );
    setFilteredFormdata(PersonalData);

    let Uhid = Object.keys(PatientEdit).filter((p) => [
      "UniqueIdType",
      "UniqueIdNo",
      "PhoneNo",

      
    ].includes(p)
    );
    setUhidNo(Uhid)


    let EnetrOtp = Object.keys(PatientEdit).filter((p) => [
      "EnterOTP"
    ].includes(p)
    );
    setOtpNumber(EnetrOtp)

    let AbhaNo = Object.keys(PatientEdit).filter((p) => [
      "AbhaAddress"
    ].includes(p)
    );
    setAbhaaddress(AbhaNo)

    let MobileOtp = Object.keys(PatientEdit).filter((p) => [
      "EnterMobileOtp"
    ].includes(p)
    );
    setMobileOtp(MobileOtp)

    let Addressdata = Object.keys(PatientEdit).filter((p) =>
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

    let PermanentAddressdata = Object.keys(PatientEdit).filter((p) =>
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
  }, [PatientEdit]);

  // -------------------------------------------------------------------------

  

  // --------------------------------------------------------------------------
  useEffect(() => {
    axios
      .get(`${UrlLink}Frontoffice/get_DoctorId_by_PatientCategory`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setDoctorIdData(data);
        } else {
          setDoctorIdData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Frontoffice/get_Employee_by_PatientCategory`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setEmployeeData(data);
        } else {
          setEmployeeData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/get_client_data_registration`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setClientData(data);
        } else {
          setClientData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/get_donation_data_registration`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setDonationData(data);
        } else {
          setDonationData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/get_insurance_data_registration`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setInsuranceData(data);
        } else {
          setInsuranceData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/BloodGroup_Master_link`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setBloodGroupData(data);
        } else {
          setBloodGroupData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Flagg_color_Detials_by_specialtype`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setFlaggData(data);
        } else {
          setFlaggData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Relegion_Master_link`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setReligionData(data);
        } else {
          setReligionData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Title_Master_link`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setTitleNameData(data);
        } else {
          setTitleNameData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  const handleInputChange = (e) => {
    const { name, value, pattern } = e.target;

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

    // Field validation
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    let formattedValue = value;

    const formatABHA = (value) =>
      value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{4})?(\d{4})?(\d{4})?/, (match, p1, p2, p3, p4) =>
          [p1, p2, p3, p4].filter(Boolean).join("-")
        );

    if (name === "ABHA") {
      const formattedABHA = formatABHA(value);
      setPatientEdit((prev) => ({
        ...prev,
        [name]: formattedABHA,
      }));
      return;
    }

    const capitalizeFirstLetter = (value) =>
      value.charAt(0).toUpperCase() + value.slice(1);

    // Capitalize first letter for specific fields
    if (
      [
        "FirstName",
        "MiddleName",
        "SurName",
        "AliasName",
        "Occupation",
        "FatherName",
        "SpouseName",
        "DoorNo",
        "Street",
        "Area",
        "City",
        "District",
        "State",
        "Country",
        "PermanentdoorNo",
        "PermanentStreet",
        "PermanentArea",
        "PermanentCity",
        "PermanentDistrict",
        "PermanentState",
        "PermanentCountry",
      ].includes(name)
    ) {
      formattedValue = capitalizeFirstLetter(value);
    }

    // Check character length for certain fields
    if (
      [
        "ExistingPtNo",
        "FirstName",
        "MiddleName",
        "AliasName",
        "SurName",
        "Occupation",
      ].includes(name) &&
      value.length > 30
    ) {
      dispatchvalue({
        type: "toast",
        value: {
          message: `${name} should not exceed 30 characters.`,
          type: "warn",
        },
      });
      return; // Exit early
    }

    // Handle PhoneNo
    if (name === "PhoneNo") {
      if (formattedValue.includes("|")) {
        const [patientId, firstName, phoneNo] = formattedValue.split(" | ");
        if (phoneNo?.trim().length <= 10) {
          setPatientEdit((prev) => ({
            ...prev,
            [name]: phoneNo.trim(),
            PatientId: patientId.trim(),
            FirstName: firstName.trim(),
          }));
        }
      } else if (formattedValue.length <= 10) {
        setPatientEdit((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      }
    }

    // Handle FirstName with pipe logic
    else if (name === "FirstName") {
      if (formattedValue.includes("|")) {
        const [patientId, firstName, phoneNo] = formattedValue.split(" | ");
        setPatientEdit((prev) => ({
          ...prev,
          [name]: firstName.trim(),
          PatientId: patientId.trim(),
          PhoneNo: phoneNo.trim(),
        }));
      } else {
        setPatientEdit((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      }
    }

    // Handle Title changes for gender
    else if (name === "Title") {
      setPatientEdit((prev) => ({
        ...prev,
        [name]: formattedValue,
        Gender: ["Miss", "Ms", "Mrs"].includes(value)
          ? "Female"
          : ["Mr", "Master"].includes(value)
          ? "Male"
          : ["TransGender", "Baby", "Dr"].includes(value)
          ? "Transgender"
          : prev.Gender, // fallback to existing value
      }));
    }

    // Handle DOB validation and Age calculation
    // else if (name === "DOB") {
    //     const currentDate = new Date();
    //     const minAllowedDate = subYears(currentDate, 100);
    //     const selectedDate = new Date(value);

    //     if (isBefore(minAllowedDate, selectedDate) && isBefore(selectedDate, currentDate)) {
    //         const age = differenceInYears(currentDate, selectedDate);
    //         setPatientEdit((prev) => ({
    //             ...prev,
    //             [name]: formattedValue,
    //             Age: age,
    //         }));
    //     } else {
    //         setPatientEdit((prev) => ({
    //             ...prev,
    //             [name]: formattedValue,
    //             Age: "",
    //         }));
    //     }
    // }

    if (name === "DOB") {
      const currentdate = new Date();
      const minAllowedDate = subYears(currentdate, 100);
      const selectedDate = new Date(value);

      if (
        isBefore(minAllowedDate, selectedDate) &&
        isBefore(selectedDate, currentdate)
      ) {
        const years = differenceInYears(currentdate, selectedDate);
        const months = differenceInMonths(currentdate, selectedDate) % 12;
        const days = differenceInDays(
          currentdate,
          addMonths(addYears(selectedDate, years), months)
        );
        const formattedAge = `${years} Y, ${months} M, ${days} D`;

        setPatientEdit((prevFormData) => ({
          ...prevFormData,
          [name]: value,
          Age: formattedAge,
        }));
      } else {
        setPatientEdit((prevFormData) => ({
          ...prevFormData,
          [name]: value,
          Age: "",
        }));
      }
    }

    // Handle Age change and calculate DOB
    else if (name === "Age") {
      if (
        formattedValue &&
        !isNaN(formattedValue) &&
        formattedValue.length <= 3
      ) {
        const currentDate = new Date();
        const targetYear = subYears(currentDate, formattedValue);
        const dob = startOfYear(targetYear);
        const formattedDOB = format(dob, "yyyy-MM-dd");

        setPatientEdit((prev) => ({
          ...prev,
          [name]: formattedValue,
          DOB: formattedDOB,
        }));
      } else {
        setPatientEdit((prev) => ({
          ...prev,
          [name]: formattedValue,
          DOB: "",
        }));
      }
    }

    // Handle Unique ID validation
    else if (name === "UniqueIdNo") {
      if(PatientEdit.UniqueIdType === 'Aadhar') {
        if (formattedValue.length <= 12){
          setPatientEdit((prev) => ({
            ...prev,
            [name]: formattedValue,
          }));

          axios
          .get(
            `${UrlLink}Frontoffice/get_unique_id_no_validation?UniqueIdNo=${formattedValue}`
          )
          .then((response) => {
            if (response.data?.error) {
              dispatchvalue({
                type: "toast",
                value: { message: response.data.error, type: "warn" },
              });
            }
          })
          .catch((err) => console.error(err));
        }
      }
    } else {
      setPatientEdit((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));

       axios
        .get(`${UrlLink}Frontoffice/get_unique_id_no_validation?UniqueIdNo=${formattedValue}`)
        .then((response) => {
          let data = response.data;
          console.log("ressss", data);
          if (data && data.error) {
            const tdata = {
              message: data.error,
              type: "warn",
            };
            dispatchvalue({ type: "toast", value: tdata });
          }
        })
        .catch((err) => {
          console.log(err);
        });


    }

    if (name === "MaritalStatus") {
      setPatientEdit((prev) => ({
        ...prev,
        [name]: formattedValue,
        SpouseName: formattedValue === "Married" ? prev.SpouseName : "",
        FatherName: formattedValue === "Single" ? prev.FatherName : "",
      }));
      return; // Exit early to avoid the default set
    }

    if (name === "Pincode") {
      setPatientEdit((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    }

    if (name === "PermanentPincode") {
      setPatientEdit((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    }

    // Address handling
    if (
      [
        "DoorNo",
        "Street",
        "Area",
        "City",
        "District",
        "State",
        "Country",
        "Pincode",
      ].includes(name)
    ) {
      setPatientEdit((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    }
    
    if (
      [
        "PermanentdoorNo",
        "PermanentStreet",
        "PermanentArea",
        "PermanentCity",
        "PermanentDistrict",
        "PermanentState",
        "PermanentCountry",
        "PermanentPincode",
      ].includes(name)
    ) {
      setPatientEdit((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setPatientEdit((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    }

    // Permanent address handling based on condition
    if (PatientEdit.PermanentAddressSameAsAbove === "NO") {
      if (name === "PermanentPincode") {
        setPatientEdit((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      }
      if (
        [
          "PermanentdoorNo",
          "PermanentStreet",
          "PermanentArea",
          "PermanentCity",
          "PermanentDistrict",
          "PermanentState",
          "PermanentCountry",
          "PermanentPincode",
        ].includes(name)
      ) {
        setPatientEdit((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      }
    } else {
      setPatientEdit((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    }

    if (PatientEdit.PermanentAddressSameAsAbove==="Yes"){
      console.log(value, 'formattedValue');

      setPatientEdit((prev) => ({
        ...prev,
       
        DoorNo: '',
        Street: '',
        Area: '',
        City: '',
        District: '',
        State: '',
        Country: '',
        Pincode: '',

        // PermanentdoorNo: '',
        // PermanentStreet: '',
        // PermanentArea: '',
        // PermanentCity: '',
        // PermanentDistrict: '',
        // PermanentState: '',
        // PermanentCountry: '',
        // PermanentPincode: '',
      }));
  
     }

   

    // if (name === "PatientCategory") {
    //     setPatientEdit((prev) => ({
    //         ...prev,
    //         [name]:formattedValue,
    //         InsuranceName: formattedValue === "Insurance" ? prev.InsuranceName : "",

    //     }))
    // }
  };

  useEffect(() => {
    if (PatientEdit.PermanentPincode.length > 5) {
      axios
        .get(
          `${UrlLink}Frontoffice/get_location_by_pincode?pincode=${PatientEdit.PermanentPincode}`
        )
        .then((response) => {
          const data = response.data;
          console.log("Pincode response:", data);
          const { country, state, city, district } = data;
          setPatientEdit((prev) => ({
            ...prev,

            PermanentCountry: country || "",
            PermanentState: state || "",
            PermanentCity: city || "",
            PermanentDistrict: district || "",


           
          }));
        })
        .catch((err) => {
          console.error("Error fetching pincode details:", err);
        });
    }
  }, [PatientEdit.PermanentPincode]); 

  useEffect(() => {
    console.log("123");
    if (
      PatientEdit.PermanentAddressSameAsAbove === "Yes" &&
      PatientEdit.Pincode.length > 5
    ) {
      console.log("900000");
      axios
        .get(
          `${UrlLink}Frontoffice/get_location_by_pincode?pincode=${PatientEdit.Pincode}`
        )
        .then((response) => {
          const data = response.data;
          console.log("Permanent Pincode response:", data);
          const { country, state, city, district } = data;
          setPatientEdit((prev) => ({
            ...prev,
           
            Country: country || "",
            State: state || "",
            City: city || "",
            District: district || "",
          }));
        })
        .catch((err) => {
          console.error("Error fetching permanent pincode details:", err);
        });
    }
  }, [PatientEdit.PermanentAddressSameAsAbove, PatientEdit.Pincode]); // Dependencies for PermanentAddressSame and PermanentPincode


  
  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    }
    return label;
  };

  // const handlePhotoUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       handleInputChange({
  //         target: { name: "ProfilePhoto", value: reader.result },
  //       });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };


  // handleSearchChange


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
          console.log("File Loaded:", reader.result); 
          setPatientEdit((prev) => ({
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



  const handleClear = () => {
    setPatientEdit({
      PatientId: "",
      ExistingPtNo: "",
      PhoneNo: "",
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
      Email: "",
      BloodGroup: "",
      Occupation: "",
      Religion: "",
      Nationality: "",
      UniqueIdType: "",
      UniqueIdNo: "",

      PatientType: "",
      PatientCategory: "",
      InsuranceName: "",
      InsuranceType: "",
      ClientName: "",
      ClientType: "Self",
      ClientEmployeeId: "",
      ClientEmployeeDesignation: "",
      ClientEmployeeRelation: "",
      EmployeeId: "",
      EmployeeRelation: "",
      DoctorId: "",
      DoctorRelation: "",
      DonationType: "",

      DoorNo: "",
      Street: "",
      Area: "",
      City: "",
      District: "",
      State: "",
      Country: "",
      Pincode: "",
      ABHA: "",
      Photo: "",
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    const data = {
      ...PatientEdit,
      created_by: userRecord?.username || "",
    };

    console.log(data, "data");

    axios
      .post(`${UrlLink}Frontoffice/Patient_BasicDetails_Update`, data)
      .then((res) => {
        setLoading(false);
        const resData = res.data;
        console.log(resData, "resData");

        // const message = Object.values(resData)[0];
        // const type = Object.keys(resData)[0];
        // const tdata = {
        //   message: message,
        //   type: 'success',
        // };
        // console.log(tdata, "tdata");

        const [type, message] = [
          Object.keys(res.data)[0],
          Object.values(res.data)[0],
        ];
        dispatch({ type: "toast", value: { message, type } });
   

        // dispatchvalue({ type: "toast", value: tdata });
        handleClear();
        navigate("/Home/FrontOfficeFolder");
        dispatchvalue({ type: "HrFolder", value: "PatientManagement" });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err)
      });
  };

  const handleClose = () => {
    navigate("/Home/PatientList");
  };
  // --------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------
  const handleCheckboxChange = (id) => {
   setSelectedRows(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };
    const HandlesearchFamily = async () => {
      if (!searchQuery) {
          setError("Please enter a phone number.");
          return;
      }
  
      try {
          setIsLoading(true);
  
          const response = await axios.get(`${UrlLink}Frontoffice/search_patients_by_phone/`, {
              params: { 
                  phone: searchQuery, 
                  primary_patient_id: primaryPatientId // Pass primary patient ID
              }
          });
  
          const patientData = response.data || [];
          const transformedData = patientData.map((member) => ({
              id: member.PatientId,
              name: (`${member.FirstName} ${member.MiddleName || ""} ${member.SurName || ""}`).trim(),
              mobileNumber: member.PhoneNo,
              status: "active"  // Default status to active
          }));
  
          setFamilyData(transformedData);
          setError(transformedData.length === 0 ? 'No matching patients found' : '');
      } catch (err) {
          setError('Failed to fetch family member data');
          console.error('Search error:', err);
          setFamilyData([]);
      } finally {
          setIsLoading(false);
      }
  };
  
  

  const handleAddFamily = async () => {
    if (!primaryPatientId) {
        setError("Primary patient ID is missing.");
        return;
    }

    if (selectedRows.length === 0) {
        setError("Please select family members to add.");
        return;
    }

    try {
        const response = await axios.post(`${UrlLink}Frontoffice/add_family_members/`, {
            primary_patient_id: primaryPatientId,
            family_member_ids: selectedRows
        }, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("Family members added:", response.data);
        
        // Fetch family members again to update familyMembersData
        await fetchFamilyMembers();
        
        setSelectedRows([]);
        setError("");
    } catch (saveErr) {
        console.error("Warning: Failed to save to backend:", saveErr);
        setError("Failed to save family members.");
    }
};

  const fetchFamilyMembers = async () => {
    if (!primaryPatientId) return;

    try {
        const response = await axios.get(`${UrlLink}Frontoffice/get_family_members/${primaryPatientId}/`);
        setFamilymembersData(response.data);
    } catch (err) {
        console.error('Error fetching family members:', err);
    }
};

const handle_familyUpdate_Submit = async () => {
  if (selectedRows.length === 0) {
      setError("Please select family members to update");
      return;
  }

  try {
      const primaryPatientId = localStorage.getItem("primary_patient_id"); // Ensure this is set

      if (!primaryPatientId) {
          setError("Primary patient ID is missing.");
          return;
      }

      await axios.put(`${UrlLink}Frontoffice/update_family_members/${primaryPatientId}/`, {
          family_member_ids: selectedRows
      }, {
          headers: { "Content-Type": "application/json" }
      });

      // Fetch all family members again
      await fetchFamilyMembers();
      
      setSelectedRows([]);
      setError('');
  } catch (err) {
      console.error("Warning: Failed to update backend:", err);
      setError("Failed to update family members");
  }
};


    useEffect(() => {
        if (familyData.length > 0) {
            setPrimaryPatientId(familyData[0].id);
        }
    }, [familyData]);

    useEffect(() => {
        fetchFamilyMembers();
    }, [primaryPatientId]);
// ------------------------------------------
 
  const getRowStyle = (row) => ({
    backgroundColor: selectedRows.includes(row.id) ? "#e6f3ff" : "transparent",
    color: selectedRows.includes(row.id) ? "blue" : "blue",
    padding: "10px",
    cursor: "pointer",
  });
 
  const FamilyColumns = [
    { key: "id", name: "ID" },
    { key: "name", name: "Name" },
    { key: "mobileNumber", name: "Mobile Number" },
    {
      key: "status",
      name: "Status",
      renderCell: (params) => (
        <Button disabled={isUpdating} className="cell_btn">
          {params.row.status === "active" ? "ACTIVE" : "INACTIVE"}
        </Button>
      ),
    },
    {
      key: "checklist",
      name: "Select",
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(params.row.id)}
          onChange={() => handleCheckboxChange(params.row.id)}
        />
      ),
    },
  ];
 
  const FamilymembersColumns = [
    { key: "id", name: "ID" },
    { key: "name", name: "Name" },
    { key: "mobileNumber", name: "Mobile Number" },
  ];

// -------------------------------ABHA----------------------------------

const handleOtpChange = (e) => {
  setOtp(e.target.value);
};


const handle_OtpChange = (e) => {
  setMobile_Otp(e.target.value);
};


const SmartCardView = (row) => {
  console.log('zzzzzzzzzz', row);

  if (row) {
    setselectedrow(true);
    setSmartCardDetailes({ ...row, PrintCount: 1 });
  }
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
      aadhaar_number: PatientEdit.UniqueIdNo, // Ensure this matches the backend key
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
      console.error("Error sending public key and Aadhaar number:",  error.message);
      console.error("Error sending public key and Aadhaar number:", error.response?.data );
      
      const ErrData = error.response?.data
      console.log(ErrData,'ErrData');
      
      

      

      if(ErrData){
        console.log(ErrData?.message,'otpErrRes');
        console.log(ErrData?.error?.message,'otpErrRes');
        

        const message = ErrData?.error?.message || ErrData?.message || "Failed to send OTP. Please try again.";
        // const errtype = "warn";

        const errdata = {
          message: message,
          type: "warn",
        };

        dispatchvalue({type: "toast", value: errdata})
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
  console.log("Phone Number:", PatientEdit.PhoneNo);
  console.log("Payload being sent:", { otp });
  console.log("Transaction ID:", txnId);
  console.log("access_token:", accesstoken);

  // Axios POST request to send OTP
  axios
    .post(`${UrlLink}Frontoffice/abha_OTP_register`, {
      otp: otp,
      PhoneNo: PatientEdit.PhoneNo,
      txnId: txnId,
      acctoken: accesstoken,
    })
    .then((response) => {
      const data = response.data;
      console.log("OTP verified successfully:", data);
      console.log("Response Data:", data);

      const {message} = data;

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
          message:message,
          type: "warn",
        }

        dispatchvalue({type: "toast", value: errOtpsub})

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
  console.log("Phone Number:", PatientEdit.PhoneNo);
  console.log("Transaction ID:", txnId);
  console.log("access_token:", accesstoken);

  axios
    .post(`${UrlLink}Frontoffice/verifyOtpSubmit`, {
      otp: otp,
      PhoneNo: PatientEdit.PhoneNo,
      txnId: txnId,
      acctoken: accesstoken,
    })
    .then((response) => {
      const data = response.data;
      console.log("OTP verified successfully:", data);
      
      const {message} = data
      const tdata = {
        message: message ||  "New OTP has been successfully sent! Please check your phone.",
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
        dispatchvalue({type: "toast", value: verotp})

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
    
   
    const {message} = response.data

    const ABHA_Number = response.data.ABHANumber;
    setABHA_Number(ABHA_Number)
    console.log("ABHA_Number:", ABHA_Number)

    

    const tdata = {
      message: message ||  "OTP successfully verified! Your ABHA Number is Created !",
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
      dispatchvalue({type: "toast", value: errMobotp})


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
          const parsedError = JSON.parse(AbhaAdd?.error?.abhaAddress|| AbhaAdd?.error || AbhaAdd); // Parse error string if needed
          errorMessage = parsedError || parsedError?.message ; // Extract message
        } catch (e) {
          console.error("Error parsing response:", e);
        }

        const errAbhaadd = {
          message: errorMessage,
          type: "warn",
        };

        dispatchvalue({type: "toast", value: errAbhaadd})


      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    });


};


// ----------------------------ABHA_card------------------------------------
const ABHA_card = () => {
  const data_to_send = {
    acctoken: accesstoken,
    xToken: xToken
  };

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
      if (error){
        const message = FetchAbhaCard?.message
        const AbhaCard = {
          message: message,
          type: "warn",
        };
        dispatchvalue({type: "toast", value: AbhaCard})

      }
      setError("Failed to fetch data. Please try again.");
    });
};


const fetch_abha_data =()=>{

  console.log("ABHA_card_get useEffect");

  axios.get(`${UrlLink}Frontoffice/ABHA_card_get?Mobile_No=${PatientEdit.PhoneNo}`)
    .then((res) => {
      const response = res.data;
      console.log("response:", response);
      console.log("response[].ABHANumber:", response[0].ABHANumber)
      
      
      const dob = response[0]?.dayOfBirth;
      const currentdate = new Date();
      const selectedDate = new Date(dob);

      // Calculate age
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
        O: "Other", // Optional, for any other gender codes
      };
      
      
      setPatientEdit((prev) => ({

        ...prev,
        ABHA: response[0]?.ABHANumber,
        FirstName: response[0]?.name,
        
        // Gender: response[0]?.gender,
        Gender: genderMap[response[0]?.gender] || response[0]?.gender,
        
        DOB: dob,
        // Age: "",
        Age: `${years} Y, ${months} M, ${days} D`,

        Email: response[0]?.email,
        
        PermanentAddress: response[0]?.address,
        Pincode: response[0]?.pincode,
        
        Area: response[0]?.townName,
        City: response[0]?.subdistrictName,
        District: response[0]?.subdistrictName,
        State: response[0]?.stateName,
      

      }));
    })
    .catch((err) => console.log(err));

};


  // --------------------------------------------------------------------------
  return (
    <>
      <div className="RegisFormcon_1">
        <div className="common_center_tag">
          <span>Patient Details Update</span>
        </div>
        {/* -----------------------------------------photo-------------------------------------- */}
       
        <div className="efuiefh_jn8">
          <div className="ProfilePhotoContainer"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <img
              src={PatientEdit.Photo}
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "90px",
                objectFit: "cover",
                border: "2px solid #ccc",
              }}
            />
            <label
              htmlFor="Photo"
              style={{
                marginTop: "5px",
                padding: "2px 9px",
                backgroundColor: "var(--selectbackgroundcolor)",
                color: "black",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                display: "inline-block",
              }}
            >
              Choose File
            </label>
            <input
              type="file"
              // accept="image/*"
              accept="image/jpeg, image/png, application/pdf"
              name = "Photo"
              autoComplete="off"
              id="Photo"
              onChange={handleinpchangeDocumentsForm}
              style={{display: "none"}}
            />
          </div>


          {/* ------------------------------------------------------------------------------------------- */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div className="RegisFormcon">
              {FilteredFormdata &&
                FilteredFormdata.filter(
                  (p) => !["CreatedBy", "Location"].includes(p)
                ).map(
                  (field, indx) =>
                    (field !== "SpouseName" ||
                      ["Married", "Widowed"].includes(
                        PatientEdit.MaritalStatus
                      )) &&
                    (field !== "FatherName" ||
                      ["Single", "Divorced"].includes(
                        PatientEdit.MaritalStatus
                      )) &&
                    (field !== "AliasName" ||
                      ["Mrs"].includes(PatientEdit.Title)) && (
                      <div className="RegisForm_1" key={indx}>
                        <label>
                          {formatLabel(field)}
                          <span>:</span>{" "}
                        </label>
                        {field === "Flagging" ||
                        field === "PatientType" ||
                        field === "Gender" ||
                        field === "UniqueIdType" ||
                        field === "Nationality" ||
                        field === "MaritalStatus" ||
                        field === "BloodGroup" ||
                        field === "Religion" ||
                        field === "Title" ? (
                          <select
                            name={field}
                            value={PatientEdit[field]}
                            onChange={handleInputChange}
                          >
                            <option value="">Select</option>
                            {field === "Gender" &&
                              ["Male", "Female", "TransGender"].map(
                                (option, indx) => (
                                  <option value={option} key={indx}>
                                    {option}
                                  </option>
                                )
                              )}
                            {field === "MaritalStatus" &&
                              ["Single", "Married", "Divorced", "Widowed"].map(
                                (option, indx) => (
                                  <option value={option} key={indx}>
                                    {option}
                                  </option>
                                )
                              )}

                            {field === "Nationality" &&
                              ["Indian", "International"].map(
                                (option, indx) => (
                                  <option value={option} key={indx}>
                                    {option}
                                  </option>
                                )
                              )}

                            {field === "PatientType" &&
                              ["General", "VIP", "Govt"].map((option, indx) => (
                                <option value={option} key={indx}>
                                  {option}
                                </option>
                              ))}

                            {field === "Flagging" &&
                              FlaggData?.filter(
                                (p) => p.Status === "Active"
                              ).map((row, indx) => (
                                <option
                                  key={indx}
                                  value={row.id}
                                  style={{ backgroundColor: row.FlaggColor }}
                                >
                                  {" "}
                                  {row.FlaggName}
                                </option>
                              ))}

                            {field === "UniqueIdType" && (
                              <>
                                {PatientEdit.Nationality === "Indian" &&
                                  ["Aadhar", "VoterId", "SmartCard"].map(
                                    (row, indx) => (
                                      <option key={indx} value={row}>
                                        {row}
                                      </option>
                                    )
                                  )}
                                {PatientEdit.Nationality === "International" &&
                                  ["DrivingLicence", "Passport"].map(
                                    (row, indx) => (
                                      <option key={indx} value={row}>
                                        {row}
                                      </option>
                                    )
                                  )}
                              </>
                            )}
                            {field === "Title" &&
                              TitleNameData?.map((row, indx) => (
                                <option key={indx} value={row.id}>
                                  {row.Title}
                                </option>
                              ))}
                            {field === "BloodGroup" &&
                              BloodGroupData?.map((option, indx) => (
                                <option value={option.id} key={indx}>
                                  {option.BloodGroup}
                                </option>
                              ))}
                            {field === "Religion" &&
                              ReligionData?.map((option, indx) => (
                                <option key={indx} value={option.id}>
                                  {option.religion}
                                </option>
                              ))}
                          </select>
                        ) : field === "PermanentAddressSameAsAbove" ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "150px",
                            }}
                          >
                            <label
                              style={{ width: "auto" }}
                              htmlFor={`${field}_Yes`}
                            >
                              <input
                                required
                                id={`${field}_Yes`}
                                type="radio"
                                name={field}
                                value="Yes"
                                style={{ width: "15px" }}
                                checked={
                                  PatientEdit[field] === "Yes" ||
                                  PatientEdit[field] === undefined
                                }
                                onChange={(e) =>
                                  handleInputChange({
                                    target: { name: field, value: "Yes" },
                                  })
                                }
                              />
                              Yes
                            </label>
                            <label
                              style={{ width: "auto" }}
                              htmlFor={`${field}_No`}
                            >
                              <input
                                required
                                id={`${field}_No`}
                                type="radio"
                                name={field}
                                value="No"
                                style={{ width: "15px" }}
                                checked={PatientEdit[field] === "No"}
                                onChange={(e) =>
                                  handleInputChange({
                                    target: { name: field, value: "No" },
                                  })
                                }
                              />
                              No
                            </label>
                          </div>
                        ) : (
                          <input
                            type={field === "DOB" ? "date" : "text"}
                            name={field}
                            autoComplete="off"
                            value={PatientEdit[field]}
                            onChange={handleInputChange}
                            readOnly={field === "PatientId"}
                            pattern={
                              field === "Email"
                                ? "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[cC][oO][mM]$"
                                : field === "PhoneNo"
                                ? "\\d{10}"
                                : field === "ExistingPtNo"
                                ? "\\d{1,10}"
                                : ["UniqueIdNo"].includes(field)
                                ? "[A-Za-z0-9]+"
                                : field === "Age"
                                ? "\\d{1,3}"
                                : field === "DOB"
                                ? ""
                                : "[A-Za-z]+"
                            }
                          />
                        )}
                      </div>
                    )
                )}
            </div>
          </div>
        </div>

        {/* ----------------- Address --------------- */}
        <br />
        <div className="DivCenter_container">ABHA Register</div>
        <br />

        <div className="RegisFormcon" id="RegisFormcon_11">
          {UhidNo &&
            UhidNo.map((field, index) => (
              <div className="RegisForm_1" key={index}>
              <div className="imp_v_star">
              <label htmlFor={`${field}_${index}`}>
                {formatLabel(field)}
                {field === 'PhoneNo' && <span className="requirreg12">*</span>}
                <span>:</span>
              </label>
              </div>

                {["UniqueIdType"].includes(field) ? (
                  <select
                    id={`${field}_${index}`}
                    name={field}
                    value={PatientEdit[field]}
                    // onChange={HandleOnchange}
                  >
                    <option value="Aadhar">Aadhar</option>
                   
                  </select>
                ) : (
                  <input
                    id={`${field}_${index}`}
                    autoComplete="off"
                    type={field === "UniqueIdNo" && "PhoneNo" ? "number" : "text"}
                    name={field}
                    pattern={field === "UniqueIdNo" ? "\\d{12}": field === "PhoneNo" ? "\\d{10}" : undefined}
                    className={
                      errors[field] === "Invalid"
                        ? "invalid"
                        : errors[field] === "Valid"
                          ? "valid"
                          : ""
                    }
                    required
                    value={PatientEdit[field]}
                    onKeyDown={
                      [
                        "UniqueIdNo","PhoneNo"
                      ].includes(field)
                      ? handleKeyDownPhoneNo
                      : null}
                    onChange={handleInputChange}
                  />

                )}


              </div>
          ))}

          {/* Button to get OTP */}
          <div className="Main_container_Btn1" style={{ width: "79px" }}>
            <button onClick={ABHAsubmit}>Get OTP</button>
          </div>
          <br/>

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
              <br/>
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
          <br/>
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
              <br/>
            
            </>
          )}
          <br/>

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

          <div className="Main_container_Btn1" style={{ width: "79px",paddingLeft:"5px" }}>
            <button onClick={ABHA_Address_Suggestion_API}>Submit add</button>
          </div>
          <br/>

          <div className="Main_container_Btn1" style={{ width: "79px" }}>
            <button onClick={ABHA_card}>ABHA CARD</button>
          </div>
          <br/>
          <br/>


                        


          <br/>
        </div>
        

        <br />
        <div className="DivCenter_container"> PERMANENT ADDRESS</div>
        <br />


        <div className="RegisFormcon" id="RegisFormcon_11">
          
            {FilteredFormdataPermanentAddress &&
              FilteredFormdataPermanentAddress.map((field, index) => (
                <div className="RegisForm_1" key={index}>
                  {field === "PermanentAddressSameAsAbove" ? (
                    <>
                      <label htmlFor={`${field}_${index}`}>
                        Communication Address Same As Above? <span>:</span>
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
                            checked={PatientEdit[field] === "Yes"}
                            onChange={(e) =>
                              setPatientEdit((prevState) => ({
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
                            checked={PatientEdit[field] === "No"}
                            onChange={(e) =>
                              setPatientEdit((prevState) => ({
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
                        {field === "PermanentPincode"
                          ? "Pincode"
                          : field === "PermanentdoorNo"
                          ? "Door No / House Name"
                          : field === "PermanentStreet"
                          ? "Street"
                          : field === "PermanentArea"
                          ? "Area"
                          : field === "PermanentCity"
                          ? "City"
                          : field === "PermanentDistrict"
                          ? "District"
                          : field === "PermanentState"
                          ? "State"
                          : field === "PermanentCountry"
                          ? "Country"
                          : formatLabel(field)}
                        <span>:</span>
                      </label>
                      <input
                        id={`${field}_${index}`}
                        autoComplete="off"
                        type={field === "PermanentPincode" ? "number" : "text"}
                        name={field}
                        pattern={
                          field === "PermanentPincode"
                            ? "\\d{6,7}"
                            : field === "PermanentdoorNo"
                            ? "[A-Za-z0-9]+"
                            : "[A-Za-z ]+"
                        }
                        className={
                          errors[field] === "Invalid"
                            ? "invalid"
                            : errors[field] === "Valid"
                            ? "valid"
                            : ""
                        }
                        value={PatientEdit[field]}
                        onChange={handleInputChange}
                      />
                    </>
                  )}
                </div>
            ))}

    

            {PatientEdit.PermanentAddressSameAsAbove === "No" ? (
              <>
                <div className="DivCenter_container">COMMUNICATION ADDRESS</div>
                {FilteredFormdataAddress &&
                  FilteredFormdataAddress.map((field, index) => (
                    <div className="RegisForm_1" key={index}>
                      {(
                        <>
                          <label htmlFor={`${field}_${index}`}>
                          {
                            field === 'DoorNo' ? 'DoorNo / HouseName'
                            : formatLabel(field)
                          }
                          
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
                            value={PatientEdit[field]}
                            onChange={handleInputChange}
                          />
                        </>
                      )}
                    </div>
                ))}
              </>
            ) : null}


            {/* {FilteredFormdataPermanentAddress &&
              FilteredFormdataPermanentAddress.map((field, index) => (
                <div className="RegisForm_1" key={index}>
                  {field === "PermanentAddressSameAsAbove" ? (
                    <>
                        <label htmlFor={`${field}_${index}`}>

                            {field === 'DoorNo' ? 'DoorNo / House Name': field === 'PermanentdoorNo' ? 'DoorNo / House Name' :field === 'PermanentAddressSameAsAbove' ? 'Communication Address Same As Above ?' : formatLabel(field)}
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
                                checked={PatientEdit[field] === "Yes"}
                                onChange={(e) =>
                                  setPatientEdit((prevState) => ({
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
                                checked={PatientEdit[field] === "No"}
                                onChange={(e) =>
                                  setPatientEdit((prevState) => ({
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
                            ? "\\d{6,7}" 
                            : field === "PermanentdoorNo"
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
                        value={PatientEdit[field]} 
                        onChange={handleInputChange}
                      />
                    </>

                  )}
                  
                  
                </div>
            ))}   */}



              {/* {PatientEdit.PermanentAddressSameAsAbove === "No" ? (
                <>
                  <div className="DivCenter_container"> COMMUNICATION ADDRESS</div>
                  
                  {FilteredFormdataAddress &&
                    FilteredFormdataAddress.map((field, index) => (
                      <div className="RegisForm_1" key={index}>
                        {field === "PermanentAddressSameAsAbove" ? (
                          <>
                            <label htmlFor={`${field}_${index}`}>
                             

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
                                  checked={PatientEdit[field] === "Yes"}
                                  onChange={(e) =>
                                    setPatientEdit((prevState) => ({
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
                                  checked={PatientEdit[field] === "No"}
                                  onChange={(e) =>
                                    setPatientEdit((prevState) => ({
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
                                value={PatientEdit[field]}
                                onChange={handleInputChange}
                              />
                            </>
                          )}
                      </div>
                  ))}

                </>
              ) : null} */}


          
        </div>

        {/* /-----------------------------------------/ */}

        
        

        <div className="Main_container_Btn">
          <button onClick={handleSubmit}>Update</button>
          <button onClick={handleClose}>Close</button>
        </div>

          {loading && (
            <div className="loader">
              <div className="Loading">
                <div className="spinner-border"></div>
                <div>Loading...</div>
              </div>
            </div>
          )}

        {/* <ToastAlert Message={toast.message} Type={toast.type} /> */}
        
        {/* ---------------------------------FamilymembersColumns----------------------------------------- */}
        <br />

        <div className="RegisFormcon_1 jjxjx_">
          <ReactGrid
            columns={FamilymembersColumns}
            RowData={FamilymembersData}
          />
        </div>

        <div className="Main_container_Btn">
          <button onClick={handle_familyUpdate_Submit}>Update</button>
        </div>

        {/* --------------------------------------------------------------- */}
        <br />
        <div className="DivCenter_container">Family Member</div>
        <br />
        <div className="Main_container_app">
          <div className="RegisFormcon_1">
            <div className="RegisForm_1">
              <label>
                {" "}
                Search Here <span>:</span>{" "}
              </label>
              <input
                        type="text"
                        placeholder="Enter Patient Phone Number"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value.trim())}
                        onKeyDown={(e) => e.key === "Enter" && HandlesearchFamily()}
                    />
              <datalist id="patients">
                {FilterbyPatientNo.map((row, indx) => (
                  <option
                    key={indx}
                    value={`${row.PatientId} | ${row.PhoneNo} | ${
                      row.FirstName
                    } ${row.MiddleName || ""} ${row.SurName || ""}`}
                  >
                    {`${row.PatientId} | ${row.PhoneNo} | ${row.FirstName} ${
                      row.MiddleName || ""
                    } ${row.SurName || ""}`}
                  </option>
                ))}
              </datalist>

              <span>
                <PersonSearchIcon onClick={HandlesearchFamily} />{" "}
                {/* Call the search function on icon click */}
              </span>
            </div>
          </div>
          <ReactGrid
            columns={FamilyColumns}
            RowData={familyData}
            getRowStyle={getRowStyle} // Add this line
          />
          {/* <ReactGrid columns={FamilyColumns} RowData={FamilyData} /> */}
          <div className="Main_container_Btn">
            <button
              onClick={handleAddFamily}
              disabled={selectedRows.length === 0}
              style={{ width: "100px" }}
            >
              Add Family
            </button>
          </div>
        </div>
        <br />

        {/* ----------------------------------------------------------------- */}
        <ToastAlert Message={toast.message} Type={toast.type} />

        {/* <ToastContainer /> */}
      </div>
    </>
  );
};

export default PatientDetailsEdit;
