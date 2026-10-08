import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";
import { IoBedOutline } from "react-icons/io5";
import "../../App.css";
import IP_NurseMlc from "../../IP_Workbench/Nurse/IP_NurseMlc";
import RoomDetialsSelect from "./RoomDetialsSelect";
import Button from "@mui/material/Button";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  isBefore,
  subYears,
  addYears,
  addMonths,
  startOfYear,
  format
} from "date-fns";


const EmergencyRegistration = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const navigate = useNavigate();

  console.log(UserData,'UserData');
  

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const Registeredit = useSelector((state) => state.Frontoffice?.Registeredit);
  const [errors, setErrors] = useState({});
  const [PatientRegisterDetails, setPatientRegisterDetails] = useState({});
  const AppointmentRegisType = "Emergency";
  console.log(PatientRegisterDetails, "PatientRegisterDetails");
  const [FilteredFormdataIpRoomDetials, setFilteredFormdataIpRoomDetials] =
    useState(null);

  const RegisterRoomShow = useSelector(
    (state) => state.Frontoffice?.RegisterRoomShow
  );
  const SelectRoomRegister = useSelector(
    (state) => state.Frontoffice?.SelectRoomRegister
  );
  const [PatientData, setPatientData] = useState([]);
  const [IsGetData, setIsGetData] = useState(false);
  const [allDoctorList, setAllDoctorList] = useState([]);
  const [specialityList, setSpecialityList] = useState([]);




  const [EmgRegister, setEmgRegister] = useState({
    FirstName: "",
    Gender: "",
    PhoneNumber: "",
    Age: "",
    DOB: "",
    MaritalStatus: "",
    UHIDtype: "",
    UHIDno: "",
    Doorno: "",
    Area: "",
    Pincode: "",
    State: "",
    Country: "",
    RelativePhoneNumber: "",
    IOTime: "",
    DoctorName: "",     // ✅ ADD THIS

    ReferralBy: "",
    NextToKin: "",

    IdentificationMark1: "",
    IdentificationMark2: "",
    IsConscious: "No",
    Instructions: "",
    IsMLC: "No",
   
    

    
  // 🔴🟡🔵 ADD THIS
    Triage: "",

    Building: null,
    Block: null,
    Floor: null,
    WardType: null,
    RoomNo: null,
    BedNo: null,
    RoomId: null,
  });

  const [RoomdeditalsShow, setRoomdeditalsShow] = useState({
    Building: "",
    Block: "",
    Floor: "",
    WardType: "",
    RoomNo: "",
    BedNo: "",
    RoomId: "",
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

  const handleClear = () => {
    setEmgRegister({
      FirstName: "",
      Gender: "",
      PhoneNumber: "",
      Age: "",
      DOB: "",
      MaritalStatus: "",
      UHIDtype: "",
      UHIDno: "",
      Doorno: "",
      Area: "",
      Pincode: "",
      State: "",
      Country: "",
      RelativePhoneNumber: "",
      IOTime: "",
      DoctorName: "",     // ✅ ADD BACK


      ReferralBy: "",
      NextToKin: "",

      IdentificationMark1: "",
      IdentificationMark2: "",
      IsConscious: "",
      Instructions: "",
      IsMLC: "",

      Triage: "",

      Building: null,
      Block: null,
      Floor: null,
      WardType: null,
      // RoomType: null,
      RoomNo: null,
      BedNo: null,
      RoomId: null,
    });

    setRoomdeditalsShow((prev) => ({
      ...prev,
      Building: "",
      Block: "",
      Floor: "",
      WardType: "",
      // RoomType: '',
      RoomNo: "",
      BedNo: "",
      RoomId: "",
    }));
  };

  // NEW: Handle DOB and Age synchronization
  const handleDateAndAgeChange = (name, value) => {
    if (name === "DOB") {
      const currentDate = new Date();
      const minAllowedDate = subYears(currentDate, 100);
      const selectedDate = new Date(value);

      if (isBefore(minAllowedDate, selectedDate) && isBefore(selectedDate, currentDate)) {
        const years = differenceInYears(currentDate, selectedDate);
        const months = differenceInMonths(currentDate, selectedDate) % 12;
        const days = differenceInDays(
          currentDate,
          addMonths(addYears(selectedDate, years), months)
        );

        const formattedAge = `${years} Y, ${months} M, ${days} D`;

        setEmgRegister((prev) => ({
          ...prev,
          DOB: value,
          Age: formattedAge,
        }));
      } else {
        setEmgRegister((prev) => ({
          ...prev,
          DOB: value,
          Age: "",
        }));
      }
    } else if (name === "Age") {
      const formattedValue = value.replace(/[^0-9]/g, ""); // Allow only numbers

      if (formattedValue && !isNaN(formattedValue) && formattedValue.length <= 3) {
        const currentDate = new Date();
        const targetYear = subYears(currentDate, +formattedValue);
        const dob = startOfYear(targetYear);
        const formattedDOB = format(dob, "yyyy-MM-dd");

        setEmgRegister((prev) => ({
          ...prev,
          Age: formattedValue,
          DOB: formattedDOB,
        }));
      } else {
        setEmgRegister((prev) => ({
          ...prev,
          Age: formattedValue,
          DOB: "",
        }));
      }
    }
  };

  useEffect(() => {
  if (!UrlLink) return;

  Promise.all([
    axios.get(`${UrlLink}Masters/Speciality_Detials_link`),
    axios.get(`${UrlLink}Masters/get_All_doctor_Name_Detials`)
  ])
    .then(([specialityRes, allDoctorRes]) => {
      setSpecialityList(
        Array.isArray(specialityRes.data) ? specialityRes.data : []
      );

      setAllDoctorList(
        Array.isArray(allDoctorRes.data) ? allDoctorRes.data : []
      );
    })
    .catch((error) => {
      console.error("Error loading masters data:", error);
    });
}, [UrlLink]);

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
      "Street",
      "Area",
      "City",
      "District",
      "State",
      "Country",
    ].includes(name)
      ? `${value.charAt(0).toUpperCase()}${value.slice(1)}`
      : value;

    setRoomdeditalsShow((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
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

  useEffect(() => {
    let roomdata = Object.keys(EmgRegister).filter((p) =>
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
  }, [EmgRegister]);

  useEffect(() => {
    if (Object.keys(SelectRoomRegister).length !== 0) {
      setEmgRegister((prev) => ({
        ...prev,
        Building: SelectRoomRegister.BuildingId,
        Block: SelectRoomRegister.BlockId,
        Floor: SelectRoomRegister.FloorId,
        WardType: SelectRoomRegister.WardId,
        // RoomType: SelectRoomRegister.RoomId,
        RoomNo: SelectRoomRegister.RoomNo,
        BedNo: SelectRoomRegister.BedNo,
        RoomId: SelectRoomRegister.id,
      }));
      setRoomdeditalsShow({
        Building: SelectRoomRegister.BuildingName,
        Block: SelectRoomRegister.BlockName,
        Floor: SelectRoomRegister.FloorName,
        WardType: SelectRoomRegister.WardName,
        // RoomType: SelectRoomRegister.RoomName,
        RoomNo: SelectRoomRegister.RoomNo,
        BedNo: SelectRoomRegister.BedNo,
        RoomId: SelectRoomRegister.RoomId,
      });
    }
  }, [SelectRoomRegister]);

  
  // useEffect(() => {
  //   axios
  //     .get(`${UrlLink}Frontoffice/get_Emergency_patient_list`, {
  //       params: { status: "EmgPatientSaved" },
  //     })
  //     .then((res) => {
  //       const data = res.data;
  //       if (Array.isArray(data)) {
  //         setPatientData(data);
  //       } else {
  //         setPatientData([]);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [UrlLink, IsGetData]);

useEffect(() => {
  if (!UrlLink) return;

  axios
    .get(`${UrlLink}Frontoffice/get_Emergency_patient_list`, {
      params: { status: "EmgPatientSaved" },
    })
    .then((res) => {
      const data = Array.isArray(res.data) ? res.data : [];

      const normalized = data.map((row) => ({
        ...row,

        // 🔴🟡🔵 FORCE correct key
        Triage:
          row.Triage ??
          row.triage ??
          row.triage_level ??
          row.TriageLevel ??
          "",
      }));

      setPatientData(normalized);
    })
    .catch((err) => {
      console.error("Error loading emergency patient list:", err);
      setPatientData([]);
    });
}, [UrlLink, IsGetData]);


  const handleRestrictedAction = () => {
    alert("You do not have permission to perform this action.");
  };

  const PatientRegisterColumns = [
    { key: "id", name: "ID" },
    { key: "PatientId", name: "Patient Id" },
    {
  key: "PatientName",
  name: "Patient Name",
  renderCell: ({ row }) => {
    const rawName =
      row.FullName ||
      row.PatientName ||
      row.Name ||
      "";

    // remove 'None', 'null', extra dots & spaces
    return rawName
      .replace(/None/gi, "")
      .replace(/null/gi, "")
      .replace(/\.+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  },
},


    { key: "PhoneNo", name: "PhoneNo" },
    { key: "Gender", name: "Gender" },
    {
  key: "Triage",
  name: "Triage",
  renderCell: ({ row }) => {
    if (!row.Triage) return null;

    return (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: "6px",
          color: "white",
          fontWeight: "bold",
          minWidth: "70px",
          textAlign: "center",
          display: "inline-block",
          backgroundColor:
            row.Triage === "RED"
              ? "#dc2626"
              : row.Triage === "YELLOW"
              ? "#facc15"
              : row.Triage === "GREEN"
              ? "#04471bff"
              : "transparent",
        }}
      >
        {row.Triage}
      </span>
    );
  },
},


    

    

    // { key: "Email", name: "Email" },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => {
        console.log(params.row, "params.row");

        return (
          <>
            <Button
              className="cell_btn"
              onClick={() => {
                if (UserData?.Create) {
                  handleNavigateEmergency(params.row)// Pass row data to handleNavigateEmg
                 
                } else {
                  handleRestrictedAction();
                }}
              }
                
            >
              Emg
            </Button>
            
            <Button
                className="cell_btn"
                onClick={() => {
                  if (UserData?.Create) {
                    handleNavigateOT(params.row)// Pass row data to handleNavigateIP
                   
                  } else {
                    handleRestrictedAction();
                  }
                }}
                   
              >
                OT
              </Button>
              <Button
              className="cell_btn"
              onClick={() => {
                if (UserData?.Create) {
                  handleNavigateIP(params.row)// Pass row data to handleNavigateEmg
                 
                } else {
                  handleRestrictedAction();
                }}
              }
                
            >
              IP & OP
            </Button>
          </>
        );
      },
    },
  ];

  const handleSubmit = () => {
    // setLoading(true);
    // scrollToElement("RegisFormcon_11");

    // Define explicitly required fields
    const requiredFields = ["Gender"];
    const requiredField = ["Triage"];

    let missingFields = [];

    // Identify missing fields from the explicitly required list
    requiredFields.forEach((field) => {
      if (!EmgRegister[field]) {
        missingFields.push(formatLabel(field)); // Assuming formatLabel formats field names for display
      }
    });

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
          ...EmgRegister,
          Created_by: UserData?.username,
          Location: UserData?.location,
        };
        console.log("submitdata", submitdata);

        axios
          .post(
            `${UrlLink}Frontoffice/Emergency_Patient_Registration`,
            submitdata
          )
          .then((res) => {
            setLoading(false);

            console.log(res.data);
            const resData = res.data;
            console.log(resData, "resData");

            let typp = Object.keys(resData)[0];
            let mess = Object.values(resData)[0];
            const tdata = {
              message: mess,
              type: typp,
            };
            // dispatchvalue({ type: "Registeredit", value: {} });
            dispatchvalue({ type: "toast", value: tdata });
            handleClear();
            setIsGetData((prev) => !prev);

            setPatientRegisterDetails(resData.data[0]);

            dispatchvalue({ type: "PatientDetails", value: {} });
            dispatchvalue({ type: "Registeredit", value: {} });

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
      handleSubmit(); // Proceed with form submission
    } else {
      handleRestrictedAction();// Show alert for unauthorized users
    }
  };



  const handleNavigateEmergency = async (row) => {
    try {
      const response = await axios.get(
        `${UrlLink}Frontoffice/get_Emergency_Registration_edit_details`,
        {
          params: { RegistrationId: row.RegistrationId }, // Send PatientId as a query parameter
        }
      );
      const patientData = response.data;
      console.log(response.data, "response.data");

      console.log(patientData, "Fetched Patient Data for Emg");
      
      dispatchvalue({
        type: "HrFolder",
        value: "EmergencyPatientRoomRegistration",
      });

      dispatchvalue({ type: "PatientDetails", value: {...patientData,Department:'EMERGENCY'} });
      navigate("/Home/FrontOfficeFolder");
    } catch (error) {
      console.error("Error fetching patient data for OP:", error);
    }
  };


  const handleNavigateOT = async (params) => {  
 
    console.log(params,'otttttttttt');

     const tdata = {
              message: 'This Patient Already had a OT Request',
              type: 'warn',
            };

     axios
        .get(`${UrlLink}/OT/Theatre_booking_request_detail_For_Emg_Patient?RegistrationId=${params?.RegistrationId}`)
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
                  dispatchvalue({ type: "toast", value: tdata });
          } else {
            try {
      dispatchvalue({ type: "EmgOTPatientdata", value:{ ...params} });
 
      navigate("/Home/OTManagement");
      dispatchvalue({ type: "HrFolder", value: "New_theater_booking" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
      // navigate("/New_theater_booking", { state: { params }  });
    } catch (error) {
      console.error("Error fetching patient data for OP:", error);
    }
          }
        })
        .catch((err) => {
          console.error('Error fetching theatre request data:', err);
        });
    
  };


  
  // const handleNavigateIP = async (params) => {  
 
  //   console.log(params,'ippppp');

  //    const tdata = {
  //             message: 'This Patient Already had a IP Request',
  //             type: 'warn',
  //           };

  //    axios
  //       .get(`${UrlLink}/OT/Theatre_booking_request_detail_For_Emg_Patient?RegistrationId=${params?.RegistrationId}`)
  //       .then((res) => {
  //         if (Array.isArray(res.data) && res.data.length > 0) {
  //                 dispatchvalue({ type: "toast", value: tdata });
  //         } else {
  //           try {
  //     dispatchvalue({ type: "EmgOTPatientdata", value:{ ...params} });
 
  //     navigate("/Home/OTManagement");
  //     dispatchvalue({ type: "HrFolder", value: "New_theater_booking" });
  //     dispatchvalue({ type: "setPreviousFolder", value: null });
  //     dispatchvalue({ type: "showMenu", value: true });
  //     // navigate("/New_theater_booking", { state: { params }  });
  //   } catch (error) {
  //     console.error("Error fetching patient data for OP:", error);
  //   }
  //         }
  //       })
  //       .catch((err) => {
  //         console.error('Error fetching theatre request data:', err);
  //       });
    
  // };

  const handleNavigateIP = async (row) => {
  try {
    // 🔹 Fetch patient details by PatientId
    const response = await axios.get(
      `${UrlLink}Frontoffice/get_Patient_Details_by_patientId`,
      
      {
        params: { PatientId: row.PatientId },
      }
    );

    const patientData = response.data;

    console.log("IP Patient Data:", patientData);

    // 🔹 Set IP folder
    dispatchvalue({
      type: "HrFolder",
      value: "IPPatientRegistration", // change if your folder name differs
    });

    // 🔹 Store patient details in redux
    dispatchvalue({
      type: "PatientDetails",
      value: {
        ...patientData,
        Department: "IP",
      },
    });

    // 🔹 Navigate to IP screen
    navigate("/Home/FrontOfficeFolder");

  } catch (error) {
    console.error("Error fetching patient data for IP:", error);
  }
};

 
  const adjustHeight = (e) => {
    e.target.style.height = "auto"; // Reset height to calculate scrollHeight
    e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight
  };


return (
    <>
      <div className="Main_container_app">
        <h3>Emergency Registration</h3>
        <br />
        <div className="RegisFormcon" id="RegisFormcon_11">
          {Object.keys(EmgRegister)
            .filter(
              (p) =>
                ![
                  "DoctorName",
                  "Building",
                  "Block",
                  "Floor",
                  "WardType",
                  "RoomNo",
                  "BedNo",
                  "RoomId",
                  "IdentificationMark1",
                  "IdentificationMark2",
                  "Instructions",
                ].includes(p)
            )
            .map((field, indx) => (
              <div className="RegisForm_1" key={indx}>
                <label>
                  {formatLabel(field)} <span>:</span>
                </label>
                {field === "Gender" ? (
                  <select
                    name={field}
                    required
                    value={EmgRegister[field]}
                    onChange={(e) =>
                      setEmgRegister((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select</option>
                    {["Male", "Female", "TransGender"].map((row, indx) => (
                      <option key={indx} value={row}>
                        {row}
                      </option>
                    ))}
                  </select>
                ) : field === "IsMLC" || field === "IsConscious" ? (
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
                        name={`radio_${field}`}
                        value="Yes"
                        style={{ width: "15px" }}
                        checked={EmgRegister[field] === "Yes"}
                        onChange={(e) => {
                          setEmgRegister((prevState) => ({
                            ...prevState,
                            [field]: "Yes",
                          }));
                          if (field === "IsMLC") {
                            setShowModal(true);
                          }
                        }}
                      />
                      Yes
                    </label>
                    <label style={{ width: "auto" }} htmlFor={`${field}_no`}>
                      <input
                        required
                        id={`${field}_no`}
                        type="radio"
                        name={`radio_${field}`}
                        value="No"
                        style={{ width: "15px" }}
                        checked={EmgRegister[field] === "No"}
                        onChange={(e) => {
                          setEmgRegister((prevState) => ({
                            ...prevState,
                            [field]: "No",
                          }));
                          if (field === "IsMLC") {
                            setShowModal(false);
                          }
                        }}
                      />
                      No
                    </label>
                  </div>
                ) : field === "DOB" ? (
                  <input
                    type="date"
                    name={field}
                    value={EmgRegister[field]}
                    max={format(new Date(), "yyyy-MM-dd")}
                    onChange={(e) => handleDateAndAgeChange("DOB", e.target.value)}
                  />
                ) : field === "Age" ? (
                  <input
                    type="text"
                    name={field}
                    placeholder="e.g. 35"
                    value={EmgRegister[field]}
                    onChange={(e) => handleDateAndAgeChange("Age", e.target.value)}
                    maxLength={3}
                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                  />
                ) : (
                  <input
                    name={field}
                    required
                    type={field === "PhoneNumber" ? "number" : "text"}
                    onKeyDown={(e) =>
                      field === "PhoneNumber" &&
                      ["e", "E", "+", "-"].includes(e.key) &&
                      e.preventDefault()
                    }
                    value={EmgRegister[field]}
                    onChange={(e) => {
                      const { value } = e.target;
                      if (field === "PhoneNumber" && value.length > 10) return;
                      setEmgRegister((prev) => ({ ...prev, [field]: value }));
                    }}
                  />
                )}
                
              </div>
              
            ))}
   
  <div className="RegisForm_1">
  {/* <label>
    Doctor Name <span>:</span>
  </label>

  <select
    value={EmgRegister.DoctorName}
    onChange={(e) =>
      setEmgRegister((prev) => ({
        ...prev,
        DoctorName: e.target.value,
      }))
    }
  >
    <option value="">Select</option>

    {allDoctorList.map((row, index) => (
      <option
        key={index}
        value={row.Doctor_Name || row.Name}   // ✅ NAME ONLY
      >
        {row.Doctor_Name || row.Name}
      </option>
    ))}
  </select> */}

  <label>Doctor Name <span>:</span>

</label>

 

<input

  type="text"

  placeholder="Enter Doctor Name"

  value={EmgRegister.DoctorName}

  onChange={(e) =>

    setEmgRegister((prev) => ({

      ...prev,

      DoctorName: e.target.value

    }))

  }

/>



</div>



                   {/* <div className="RegisForm_1">
  <label>
    Speciality <span>:</span>
  </label>

  <select
    value={EmgRegister.Speciality}
    onChange={(e) =>
      setEmgRegister((prev) => ({
        ...prev,
        Speciality: e.target.value,
      }))
    }
  >
    <option value="">Select</option>
    {specialityList.map((row, index) => (
      <option key={index} value={row.Speciality_Id || row.id}>
        {row.Speciality_Name || row.Speciality}
      </option>
    ))}
  </select>
</div>

<div className="RegisForm_1">
  <label>
    Doctor Name <span>:</span>
  </label>

  <select
    value={EmgRegister.DoctorName}
    onChange={(e) =>
      setEmgRegister((prev) => ({
        ...prev,
        DoctorName: e.target.value,
      }))
    }
  >
    <option value="">Select</option>

    {allDoctorList.map((row, index) => (
      <option key={index} value={row.Doctor_Id || row.id}>
        {row.Doctor_Name || row.Name}
      </option>
    ))}
  </select>
</div> */}
        </div>
 
<br />

        <div className="RegisForm_1">
  <label>
    Triage <span>:</span>
  </label>

  <div style={{ display: "flex", gap: "10px" }}>
    {/* 🔴 RED */}
    <button
      type="button"
      onClick={() =>
        setEmgRegister(prev => ({ ...prev, Triage: "RED" }))
      }
      style={{
        padding: "6px 14px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        backgroundColor:
          EmgRegister.Triage === "RED" ? "#dc2626" : "#fecaca",
        color: EmgRegister.Triage === "RED" ? "white" : "#7f1d1d",
        fontWeight: "bold",
      }}
    >
      RED
    </button>

    {/* 🟡 YELLOW */}
    <button
      type="button"
      onClick={() =>
        setEmgRegister(prev => ({ ...prev, Triage: "YELLOW" }))
      }
      style={{
        padding: "6px 14px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        backgroundColor:
          EmgRegister.Triage === "YELLOW" ? "#facc15" : "#fef3c7",
        color: "#92400e",
        fontWeight: "bold",
      }}
    >
      YELLOW
    </button>

    {/* GREEN */}
    <button
      type="button"
      onClick={() =>
        setEmgRegister(prev => ({ ...prev, Triage: "GREEN" }))
      }
      style={{
        padding: "6px 14px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        backgroundColor:
          EmgRegister.Triage === "GREEN" ? "#04471bff" : "#dbeafe",
        color: EmgRegister.Triage === "GREEN" ? "white" : "#04471bff",
        fontWeight: "bold",
      }}
    >
      GREEN
    </button>
  </div>
</div>

<br />

          <div className="RegisFormcon extend_textarea_new">
            {/* Render the separated fields */}
            <div className="RegisForm_1 extend_textarea_new">
              <label>
                Identification Mark 1 <span>:</span>
              </label>
              <textarea
                name="IdentificationMark1"
                value={EmgRegister["IdentificationMark1"]}
                onChange={(e) =>{
                  setEmgRegister((prev) => ({
                    ...prev,
                    IdentificationMark1: e.target.value,
                  }));
                  adjustHeight(e); 

                }
                  
                }

                style={{
                  overflow: "hidden", 
                  resize: "none", 
                  minHeight: "60px", 
                }}

              />
            </div>
          </div>


<div className="RegisFormcon extend_textarea_new">
          <div className="RegisForm_1 extend_textarea_new">
            <label>
              Identification Mark 2 <span>:</span>
            </label>
            <textarea
              name="IdentificationMark2"
              value={EmgRegister["IdentificationMark2"]}
              onChange={(e) =>{
                setEmgRegister((prev) => ({
                  ...prev,
                  IdentificationMark2: e.target.value,
                }));
                adjustHeight(e); 


              }
              
              }

              style={{
                overflow: "hidden", 
                resize: "none", 
                minHeight: "60px", 
              }}

            />
          </div>

          </div>

          
<div className="RegisFormcon extend_textarea_new">
          <div className="RegisForm_1 extend_textarea_new">
            <label>
              Instructions <span>:</span>
            </label>
            <textarea
              name="Instructions"
              value={EmgRegister["Instructions"]}
              onChange={(e) =>{
                setEmgRegister((prev) => ({
                  ...prev,
                  Instructions: e.target.value,
                }));
                adjustHeight(e); 

              }
              }

              style={{
                overflow: "hidden", 
                resize: "none", 
                minHeight: "60px", 
              }}
              
            />
          </div>
          </div>


        
            <div className="DivCenter_container">Room Details </div>
            <div className="DivCenter_container" style={{
              justifyContent:'center'
            }}>
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

            <div className="RegisFormcon">
            {FilteredFormdataIpRoomDetials &&
              FilteredFormdataIpRoomDetials.map((field, index) => (
                <div className="RegisForm_1" key={index}>
                  <label htmlFor={field}>
                    {formatLabel(field)}
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
         
    

        {showModal && (
          <div
            className="sideopen_showcamera_profile"
            onClick={() => setShowModal(false)}
          >
            <div
              className="newwProfiles newwPopupforreason"
              onClick={(e) => e.stopPropagation()}
            >
              <h4>MLC Details</h4>
              <IP_NurseMlc />
            </div>
          </div>
        )}

        <div className="Main_container_Btn">
          <button 
          onClick={handleSaveClick}
          className={`px-4 py-2 rounded ${
            UserData?.Create
              ? "bg-blue-500 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          >Submit</button>
          {/* <button onClick={handleNavigateEmergency}>Emergency</button> */}
        </div>
        {/* {RegData.length > 0 &&
            <ReactGrid columns={EmgRegisterColumns} RowData={RegData} />
        } */}

        <ToastAlert Message={toast.message} Type={toast.type} />
        <ReactGrid columns={PatientRegisterColumns} RowData={PatientData} />

        {RegisterRoomShow.val && <RoomDetialsSelect />}
      </div>
    </>
  );
};

export default EmergencyRegistration;

