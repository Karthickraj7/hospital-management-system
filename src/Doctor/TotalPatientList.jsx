import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
// import './Patient.css';
import "../PatientManagement/Patient.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";

import { useReactToPrint } from "react-to-print";

const PrintContent = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      id="reactprintcontent"
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        height: "100%",

        width: "95%",
      }}
    >
      {props.children}
    </div>
  );
});

const TotalPatientList = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const pagewidth = useSelector((state) => state.userRecord?.pagewidth);
  const navigate = useNavigate();
  const dispatchvalue = useDispatch();

  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const [IpPatientCount, setIpPatientCount] = useState(0);
  const [OpPatientCount, setOpPatientCount] = useState(0);
  const [CasualityPatientCount, setCasualityPatientCount] = useState(0);
  const [WardPatientCount, setWardPatientCount] = useState(0);

  const [Flag, setFlag] = useState(0);
  const [isHost, setIsHost] = useState(false);

  console.log(Flag, "Flaggggggg");
  console.log(isHost, "isHost");

  const [dateOption, setDateOption] = useState("current");
  const [IpDateOption, setIpDateOption] = useState("all");
  
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [ParticularDate, setParticularDate] = useState("");
  const [CurrentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [showPrintContent, setShowPrintContent] = useState(false);

  const [showViewContent, setShowViewContent] = useState(false); // New state for viewing content
  const [visitid, setvisitid] = useState("");
  const [Registerid, setRegisterid] = useState("");
  const [PatientId, setPatientId] = useState("");

  console.log(visitid,'row-----------');
  console.log(Registerid,'row-----------');
  console.log(PatientId,'row-----------');
  


  const PrintViewfunction = (row) => {
    console.log("row-----------", row);
    if (row) {
      setvisitid(row?.VisitId);
      setRegisterid(row?.RegistrationId);
      setPatientId(row?.PatientId);
      setShowViewContent(true);
      setPatients({
        PatientId: row?.PatientId,
        PatientName: row?.PatientName,
        Age: row?.Age,
        Gender: row?.Gender,
        DoctorName : row?.DoctorName
      });
    } else {
      setvisitid("");
      setRegisterid("");
      setPatientId("");
      setShowViewContent(false);
    }
  };

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    // onAfterPrint: async () => {
    //   // Additional action after printing, if needed
    // },
    onAfterPrint: () => setShowPrintContent(false),
  });

  const PrintIconfunction = (row) => {
    setvisitid(row?.VisitId);
    setRegisterid(row?.RegistrationId);
    setPatientId(row?.PatientId);
    setShowPrintContent(true);
    setPatients({
      PatientId: row?.PatientId,
      PatientName: row?.PatientName,
      Age: row?.Age,
      Gender: row?.Gender,
      DoctorName : row?.DoctorName
    });
    // setComplete(false); // Show content for printing
    setTimeout(() => {
      handlePrint2(); // Trigger print
      setShowPrintContent(false);
    }, 500);
  };

  // --------------
  const [nextreview, setNextreview] = useState([]);
  const [advice, setAdvice] = useState([]);
  const [RadiologyTest, setRadiologyTest] = useState([]);
  const [prescriptiondata, setprescriptiondata] = useState([]);
  const [LabTest, setLabTest] = useState([]);
  const [GeneralEvaluationData, setGeneralEvaluationData] = useState([]);
  const [VitalsData, setVitalsData] = useState([]);
  const DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.DoctorWorkbenchNavigation
  );
  const [referarr, setReferarr] = useState([]);

  const componentRef = useRef();

  useEffect(() => {
    if (dateOption === "current") {
      setCurrentDate(new Date().toISOString().split("T")[0]); // Auto-set today
    }
  }, [dateOption]);

  // ------------OP-----------------------
  const UserData = useSelector((state) => state.userRecord?.UserData);

  const [searchOPParams, setsearchOPParams] = useState({
    query: "",
    status: "Inprogress",
    // status: "Paid",
    DoctorId: UserData?.Doctor,
  });
  // const [searchOPParams, setsearchOPParams] = useState({ query: '', status: 'Pending' });
  const [searchDoctorParams, setsearchDoctorParams] = useState({
    Doctor: "",
    DoctorId: UserData?.Doctor,
  });

  console.log("1111111111", searchOPParams);
  console.log("searchDoctorParams", searchDoctorParams);

  const [PatientRegisterData, setPatientRegisterData] = useState([]);
  const [TotalOPCount, setTotalOPCount] = useState(0);
  const [TotalIPCount, setTotalIPCount] = useState(0);
  const [TotalCasualityCount, setTotalCasualityCount] = useState(0);
  const [TotalICUCount, setTotalICUCount] = useState(0);
  const [TotalCCUCount, setTotalCCUCount] = useState(0);

  console.log(TotalOPCount, "TotalOPCount");
  console.log(TotalIPCount, "TotalIPCount");
  console.log(PatientRegisterData, "PatientRegisterData");

  const [DocWisePatientRegisterData, setDocWisePatientRegisterData] = useState(
    []
  );

  const [DoctorNames, setDoctorNames] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  console.log(DepartmentData, "DepartmentData");

  const [isSelected, setIsSelected] = useState("");

  const [showTooltip, setShowTooltip] = useState(null);
  const [hoveredFlagIndex, setHoveredFlagIndex] = useState(null);
  const [showTooltip2, setShowTooltip2] = useState(false);

  console.log(UserData, "UserData");
  const [Patients, setPatients] = useState({
    PatientId: "",
    PatientName: "",
    Age: "",
    Gender: "",
    DoctorName: "",
  });
  console.log(Patients,'row-----------')

  // ------------IP-----------------------

  const [searchIPParams, setsearchIPParams] = useState({
    query: "",
    status: "Admitted",
    type: "IP",
    DoctorId: UserData?.Doctor,
    // SelectedWard : SelectedWard
  });

  const [IpPatientRegisterData, setIpPatientRegisterData] = useState([]);
  console.log(IpPatientRegisterData, "IpPatientRegisterData");

  const [WardGet, setWardGet] = useState([]);

  const [SelectedWard, setSelectedWard] = useState(0);
  console.log(WardGet, "WardGet");
  console.log(SelectedWard, "SelectedWard");

  const filteredIpData = IpPatientRegisterData.filter(
    (patient) =>
      (SelectedWard ? patient.WardId === Number(SelectedWard) : true) &&
      patient.WardName !== "ICU" &&
      patient.WardName !== "CCU"
  );

  const filteredIcuData = IpPatientRegisterData.filter(
    (patient) =>
      (SelectedWard ? patient.WardId === Number(SelectedWard) : true) &&
      patient.WardName === "ICU"
  );

  const filteredCcuData = IpPatientRegisterData.filter(
    (patient) =>
      (SelectedWard ? patient.WardId === Number(SelectedWard) : true) &&
      patient.WardName === "CCU"
  );


    useEffect(() => {
      const filteredIpData = IpPatientRegisterData.filter(
        (patient) =>
          (SelectedWard ? patient.WardId === Number(SelectedWard) : true) &&
          patient.WardName !== "ICU" &&
          patient.WardName !== "CCU"
      );
  
      const filteredIcuData = IpPatientRegisterData.filter(
        (patient) =>
          (SelectedWard ? patient.WardId === Number(SelectedWard) : true) &&
          patient.WardName === "ICU"
      );
  
      const filteredCcuData = IpPatientRegisterData.filter(
        (patient) =>
          (SelectedWard ? patient.WardId === Number(SelectedWard) : true) &&
          patient.WardName === "CCU"
      );
  
      setTotalIPCount(filteredIpData.length);
      setTotalICUCount(filteredIcuData.length);
      setTotalCCUCount(filteredCcuData.length);
    }, [IpPatientRegisterData, SelectedWard]);
  

    console.log(filteredIpData,'filteredIpData');
    console.log(filteredIcuData,'filteredIcuData');
    console.log(filteredCcuData,'filteredccuData');
  

    // const filteredIpCount = filteredIpData.length;
    // const filteredIcuCount = filteredIcuData.length;
    // const filteredCcuCount = filteredCcuData.length;

  // ------------Casuality-----------------------

  const [SearchCasualityParams, setSearchCasualityParams] = useState({
    query: "",
    status: "Pending",
    type: "Casuality",
  });

  const [CasualityPatientRegisterData, setCasualityPatientRegisterData] =
    useState([]);

  //==========================================================================

  const [SearchEmergencyParams, setSearchEmergencyParams] = useState({
    query: "",
    status: "Admitted",
    type: "Casuality",
  });

  const [EmergencyPatientRegisterData, setEmergencyPatientRegisterData] =
    useState([]);

  //==========================================================================

  // ------------OP-----------------------

  useEffect(() => {
    const params = {};

    if (searchOPParams.query.trim()) {
      params.query = searchOPParams.query;
    } 

    if (searchOPParams.status) {
      params.status = searchOPParams.status;
    } else {
      setPatientRegisterData([]);
      return;
    }

    console.log('122222222222');
    console.log('133333333333', searchDoctorParams.DoctorId);

   

    // if (searchDoctorParams.Doctor) {
    //   params.Doctor = searchDoctorParams.Doctor;
    // } 

    // if (UserData.DoctorName){
    //   if (searchDoctorParams.DoctorId) {
    //   params.Doctor = searchDoctorParams.DoctorId;
    //   } 
    // }

    if (UserData.DoctorName && searchDoctorParams.DoctorId) {
    params.Doctor = searchDoctorParams.DoctorId;
  } else if (searchDoctorParams.Doctor) {
    params.Doctor = searchDoctorParams.Doctor;
  }
    


    console.log('1444444444',searchDoctorParams.Doctor);


    if (dateOption === "custom") {
      if (fromDate && toDate) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      } else {
        setPatientRegisterData([]);
        return;
      }
    } else if (dateOption === "current") {
      if (CurrentDate) {
        console.log("dateOptionoooooooo", dateOption, CurrentDate);

        params.CurrentDate = CurrentDate;
      } else {
        setPatientRegisterData([]);
        return;
      }
    } else if (dateOption === "particular") {
      if (ParticularDate) {
        params.ParticularDate = ParticularDate;
      } else {
        setPatientRegisterData([]); // Clear data if no particular date is selected
        return;
      }
    }

    axios
      .get(
        `${UrlLink}Frontoffice/get_OP_Patient_Que_with_Multiple_Doc`,
        { params }
      )
      .then((res) => {
        const ress = res.data.appointments;
        const OPCount = res.data.Total_OP_Count;
        setTotalOPCount(OPCount)
        // const ress = res.data;
        console.log("OPpppppppppppppp", ress);


        // const processedData = ress.map((patient) => {
        //   return {
        //     ...patient,
        //     // Fix Specialization Mapping
        //     Specilization: patient.Multiple_Doc?.map(doc => doc.Specilization).join(", ") || "",

        //     // Fix Doctor Name Mapping
        //     DoctorName: patient.Multiple_Doc?.map(doc => doc.DoctorName).join(", ") || "",

        //     // Fix Complaint Mapping (Ensure it doesn't remain empty)
        //     Complaint: patient.Multiple_Doc?.map(doc => doc.Complaint).join(", ") || "",
        //   };
        // });

        // console.log(processedData,'processedData');
        // setPatientRegisterData(processedData);



        if (Array.isArray(ress)) {
          setPatientRegisterData(ress);
        } else {
          setPatientRegisterData([]);
        }



      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    UrlLink,
    searchDoctorParams,
    searchOPParams,
    dateOption,
    fromDate,
    toDate,
    ParticularDate,
    CurrentDate,
    UserData.DoctorName,
  ]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/get_All_DoctorNames`)
      .then((res) => {
        const ress = res.data;
        console.log("DoctorsNames", ress);
        if (Array.isArray(ress)) {
          setDoctorNames(ress);
        } else {
          setDoctorNames([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  const handleeditOPPatientRegister = (params) => {
    console.log("params", params);

    if (params.Status === "Completed") {
      alert("Navigation is not allowed for completed status.");
      return; // Stop execution if status is "Completed"
    }
    const { RegistrationId, DoctorId } = params;
    axios
      .get(`${UrlLink}OP/get_workbenchquelist_doctor`, {
        params: { RegistrationId: RegistrationId, DoctorId: DoctorId, Type: "OP" },
      })
      .then((res) => {
        console.log(res, "OPpppppppppppppp");
        navigate("/Home/DoctorFolder");
        dispatchvalue({ type: "IP_DoctorWorkbenchNavigation", value: {} });
        dispatchvalue({ type: "AllergyDetails", value: {} });

        dispatchvalue({
          type: "DoctorWorkbenchNavigation",
          value: { ...res.data },
        });
        dispatchvalue({
          type: "SpecialityWise_DoctorWorkbenchNavigation",
          value: {},
        });


        dispatchvalue({ type: "HrFolder", value: "DoctorWorkbenchNavigation" });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addSerialNumbers = (data) => {
    return data.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Flagg_color_Detials_link`)
      .then((res) => setFlag(res?.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Department_Detials_link`)
      .then((res) => setDepartmentData(res?.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  const allDepartments = ["OP", "IP", "CASUALITY", "ICU", "CCU"];
  // const departmentCounts = [
  //   {OP: TotalOPCount},
  //   {IP: TotalIPCount},
  //   {CASUALITY: TotalCasualityCount},
  //   {ICU: TotalICUCount},
  //   {CCU: TotalCCUCount},
  // ]
    
  const departmentCounts = {
    OP: TotalOPCount || 0,
    IP: TotalIPCount || 0,
    CASUALITY: TotalCasualityCount || 0,
    ICU: TotalICUCount || 0,
    CCU: TotalCCUCount || 0,

    // IP: filteredIpCount || 0,
    // ICU: filteredIcuCount || 0,
    // CCU: filteredCcuCount || 0,
  };

 

  const [DepartmentNames, setDepartmentNames] = useState([]);

  // useEffect(() => {
  //   if (UserData?.username === "host" || UserData?.username === "admin") {
  //     setIsHost(true);
  //     setIsSelected("OP");
  //   } else {
  //     setIsHost(false);

  //     if (UserData?.DepartmentId && Array.isArray(UserData?.DepartmentId)) {
  //       const assignedDepartments = DepartmentData?.filter((item) =>
  //         UserData.DepartmentId.includes(item.id)
  //       );

  //       console.log(assignedDepartments, "assignedDepartments");

  //       if (assignedDepartments.length > 0) {
  //         setDepartmentNames(
  //           assignedDepartments.map((dep) => dep.DepartmentName)
  //         );
  //         setIsSelected(assignedDepartments[0]);
  //       } else {
  //         setDepartmentNames([]);
  //       }
  //     }
  //   }
  // }, [UserData, DepartmentData]);



  useEffect(() => {
    if (!UserData || !DepartmentData.length) return;
  
    if (UserData.username === "host" || UserData.username === "admin") {
      setIsHost(true);
      setIsSelected("OP"); // default for host/admin
      const allowedDepts = ["OP", "IP", "CASUALITY", "ICU", "CCU"];
      const filtered = DepartmentData.filter(dep =>
        allowedDepts.includes(dep.DepartmentName.toUpperCase())
      ).map(dep => dep.DepartmentName);
      setDepartmentNames(filtered);
    } else {
      setIsHost(false);
  
      if (Array.isArray(UserData.DepartmentId) && UserData.DepartmentId.length > 0) {
        const assignedDepartments = DepartmentData.filter(item =>
          UserData.DepartmentId.includes(item.id)
        );
  
        const deptNames = assignedDepartments.map(dep => dep.DepartmentName);
        setDepartmentNames(deptNames);
  
        if (deptNames.length > 0) {
          setIsSelected(deptNames[0]); // ✅ default to the first available dept
        }
      } else {
        setDepartmentNames([]);
      }
    }
  }, [UserData, DepartmentData]);

  

  const handleDepartmentOptionChange = (department) => {
    setIsSelected(department);
    setDateOption("");
    setCurrentDate(new Date().toISOString().split("T")[0]);
    setFromDate("");
    setToDate("");
    setParticularDate("");
    setsearchDoctorParams({
      Doctor: "",
      DoctorId: UserData?.Doctor,
    });
    setSelectedWard("");
    setsearchIPParams({
      query:"",
      status:"Admitted",
      type:"IP",
    })
  };

  const handleDateOptionChange = (e) => {
    setDateOption(e.target.value);

    // Reset date states when changing the selection
    if (e.target.value === "current") {
      setFromDate("");
      setToDate("");
      setParticularDate("");
      // setsearchDoctorParams('')

      setsearchDoctorParams({
        Doctor: "",
        DoctorId: UserData?.Doctor,
      });

      setSelectedWard("");
      setsearchOPParams({
        query: "",
        status: "Inprogress",
        DoctorId: UserData?.Doctor || "",

        // status: "Registered",

      });
      setsearchIPParams((prev) => ({
        ...prev,
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      }));
      setSearchEmergencyParams({
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      });
    } else if (e.target.value === "custom") {
      setParticularDate("");
      setCurrentDate("");
      // setsearchDoctorParams('')

      setsearchDoctorParams({
        Doctor: "",
        DoctorId: UserData?.Doctor,
      });

      setSelectedWard("");
      setsearchOPParams({
        query: "",
        status: "Inprogress",
        // status: "Registered",
        DoctorId: UserData?.Doctor || "",
      });

      setsearchIPParams((prev) => ({
        ...prev,
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      }));
      setSearchEmergencyParams({
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      });

    } else if (e.target.value === "particular") {
      setFromDate("");
      setToDate("");
      setCurrentDate("");
      // setsearchDoctorParams('')

      setsearchDoctorParams({
        Doctor: "",
        DoctorId: UserData?.Doctor,
      });

      setSelectedWard("");
      setsearchOPParams({
        query: "",
        status: "Inprogress",
        // status: "Registered",
        DoctorId: UserData?.Doctor || "",

      });

      setsearchIPParams((prev) => ({
        ...prev,
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      }));
      setSearchEmergencyParams({
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      });
    } else if (e.target.value === "all"){
      
      setCurrentDate("");
      setFromDate("");
      setToDate("");
      setParticularDate("");

      setsearchDoctorParams({
        Doctor: "",
        DoctorId: UserData?.Doctor,
      });

      setSelectedWard("");
      setsearchOPParams({
        query: "",
        status: "Inprogress",
        DoctorId: UserData?.Doctor || "",
      });
      setsearchIPParams((prev) => ({
        ...prev,
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      }));
      setSearchEmergencyParams({
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      });
      
    }

  };


    const handleIPDateOptionChange = (e) => {
    setIpDateOption(e.target.value);

    if (e.target.value === "all"){
      setFromDate("");
      setToDate("");
      setCurrentDate("");
      setParticularDate("");

      setsearchDoctorParams({
        Doctor: "",
        DoctorId: UserData?.Doctor,
      });

      setSelectedWard("");
      setsearchOPParams({
        query: "",
        status: "Inprogress",
        DoctorId: UserData?.Doctor || "",
      });
      setsearchIPParams((prev) => ({
        ...prev,
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      }));
      setSearchEmergencyParams({
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      });
      
    } else if (e.target.value === "current") {
      setFromDate("");
      setToDate("");
      setParticularDate("");
      // setsearchDoctorParams('')

      setsearchDoctorParams({
        Doctor: "",
        DoctorId: UserData?.Doctor,
      });

      setSelectedWard("");
      setsearchOPParams({
        query: "",
        status: "Inprogress",
        DoctorId: UserData?.Doctor || "",
      });
      setsearchIPParams((prev) => ({
        ...prev,
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      }));
      setSearchEmergencyParams({
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      });
    } else if (e.target.value === "custom") {
      setParticularDate("");
      setCurrentDate("");
      // setsearchDoctorParams('')

      setsearchDoctorParams({
        Doctor: "",
        DoctorId: UserData?.Doctor,
      });

      setSelectedWard("");
      setsearchOPParams({
        query: "",
        status: "Inprogress",
        DoctorId: UserData?.Doctor || "",
      });
      setsearchIPParams((prev) => ({
        ...prev,
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      }));
      setSearchEmergencyParams({
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      });
    } else if (e.target.value === "particular") {
      setFromDate("");
      setToDate("");
      setCurrentDate("");
      // setsearchDoctorParams('')

      setsearchDoctorParams({
        Doctor: "",
        DoctorId: UserData?.Doctor,
      });

      setSelectedWard("");
      setsearchOPParams({
        query: "",
        status: "Inprogress",
        DoctorId: UserData?.Doctor || "",
      });
      setsearchIPParams((prev) => ({
        ...prev,
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      }));
      setSearchEmergencyParams({
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      });
    } 
    
  }

  
  const handleCurrentDateChange = (e) => {
    setCurrentDate(e.target.value);
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handleParticularDateChange = (e) => {
    setParticularDate(e.target.value);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;

    setsearchOPParams({ ...searchOPParams, [name]: value });
  };

  const handleDoctorSearch = (e) => {
    const { name, value } = e.target;
    console.log("Selected Doctor ID:", value);

    // Update searchDoctorParams state with the selected doctor ID
    setsearchDoctorParams({ ...searchDoctorParams, [name]: value });
    // setIsSelected(department);
    // setDateOption('current');
    // setCurrentDate(new Date().toISOString().split('T')[0]);
    // setFromDate('');
    // setToDate('');
    // setParticularDate('');
  };

  const handleRestrictedAction = () => {
    alert("You do not have permission to perform this action.");
  };

  const PatientOPRegisterColumns = [
    {
      key: "id",
      name: "S.No",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "FlaggingColour",
      name: "Flagging Colour",
      frozen: true,
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: params.row.FlaggingColour || "transparent",
            width: "20px",
            height: "20px",
            cursor: "pointer",
            position: "relative",
          }}
          onMouseEnter={() => setShowTooltip(params.row.id)} // Show tooltip for this row
          onMouseLeave={() => setShowTooltip(null)} // Hide tooltip
        >
          {/* <h4>{params.row.Flagging ? params.row.Flagging : "N/A"}</h4> */}

          {/* Conditional rendering of the tooltip */}
          {showTooltip === params.row.id && (
            <div
              style={{
                position: "absolute",
                top: "-15px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#d2cdd4",
                color: "#000",
                padding: "5px 10px",
                borderRadius: "4px",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              {params.row.Flagging ? params.row.Flagging : "N/A"}
            </div>
          )}
        </div>
      ),
    },

    {
      key: "PatientId",
      name: "Patient Id",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 200,
      frozen: true,
    },
    {
      key: "Age",
      name: "Age",
    },
    {
      key: "Gender",
      name: "Gender",
    },
    {
      key: "PhoneNo",
      name: "PhoneNo",
    },
    {
      key: "Complaint",
      name: "Complaint",
    },

    {
      key: "Specilization",
      name: "Specilization",
    },
    {
      key: "DoctorName",
      name: "Doctor Name",
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => {
        if (params.row.Status === "Completed") {
          return (
            <div style={{ display: "flex", gap: "20px", justifyContent: 'center' }}>
              <button
                className="cell_btn"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (UserData?.Read) {
                    PrintViewfunction(params.row)
                  } else {
                    handleRestrictedAction();
                  }
                }}

              >
                <VisibilityIcon className="check_box_clrr_view" />
              </button>

              <button
                className="cell_btn"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (UserData?.Read) {
                    PrintIconfunction(params.row)
                  } else {
                    handleRestrictedAction();
                  }
                }}


              >
                <PrintIcon className="check_box_clrr_view" />
              </button>
            </div>
          );
        }

        if (params.row.Status === "Completed") {
          return "-";
        }

        return (
          <Button
            className="cell_btn"
            onClick={() => {
              if (UserData?.Create) {
                handleeditOPPatientRegister(params.row)
              } else {
                handleRestrictedAction();
              }
            }}
          >
            <ArrowForwardIcon className="check_box_clrr_cancell" />
          </Button>
        );
      },
    },
  ];

  // ------------IP-----------------------

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Ward_Detials_link`)
      .then((res) => {
        const ress = res.data;
        console.log("Roommmmmmmmm", ress);
        if (Array.isArray(ress)) {
          setWardGet(ress);
        } else {
          setWardGet([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  // ----------------------------------------------------------------------------
// useEffect(() => {
//   handleDepartmentOptionChange("IP");
// }, []);
 
useEffect(() => {
    // if (isSelected !== "IP" && isSelected !== "CCU" && isSelected !== "ICU") return;

    const params = {};

    if (searchIPParams.query.trim()) {
      params.query = searchIPParams.query;
    } 
    // else {
    //   params.limit = 10; // Default limit if no search query
    // }

    console.log("uuuuuuuuuuuuu");

    if (searchIPParams.status) {
      params.status = searchIPParams.status;
    } 

    console.log("wwwwwwwwwww");

    // if (searchDoctorParams.DoctorId) {
    //   params.Doctor = searchDoctorParams.DoctorId;
    // } 
    // else {
    //   params.limit = 10; // Default limit if no search query
    // }

    if (SelectedWard){
      params.WardName = SelectedWard;
    }

    console.log('1444444444');

    // if (searchIPParams.type) {
    //   params.type = searchIPParams.type;
    // }

    // console.log("eeeeeeeeeee");

    if (IpDateOption === "custom" && fromDate && toDate) {
      params.fromDate = fromDate;
      params.toDate = toDate;
      console.log("yyyyyyyy");
    } else if (IpDateOption === "current" && CurrentDate) {
      params.CurrentDate = CurrentDate;

      console.log("uuuuiiii");
    } else if (IpDateOption === "particular" && ParticularDate) {
      params.ParticularDate = ParticularDate;
    }

     if (UserData.DoctorName && searchDoctorParams.DoctorId) {
        params.Doctor = searchDoctorParams.DoctorId;
      } else if (searchDoctorParams.Doctor) {
        params.Doctor = searchDoctorParams.Doctor;
      }


    console.log("iooooppppp");

    console.log(params, "params");

    axios
      .get(
        `${UrlLink}Frontoffice/get_ip_Patient_registration_details_for_workbench`,
        { params }
      )
      .then((res) => {
        // const ress1 = res.data;
        const ress = res.data.appointments;
        // const IpCount = res.data.Total_IP_Count;
        // setTotalIPCount(IpCount);
        console.log("IPpppppppppppppp", ress);
        // console.log("IPpppp----pppp", ress1);
        if (Array.isArray(ress)) {
          setIpPatientRegisterData(ress);
        } else {
          setIpPatientRegisterData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    UrlLink,
    // searchDoctorParams,
    searchIPParams,
    IpDateOption,
    fromDate,
    toDate,
    ParticularDate,
    CurrentDate,
    isSelected,
    SelectedWard
  ]);


// ------------------------------------------------------------------------
  const handleIPTypeChange = (e) => {
    const newType = e.target.value;
    // Determine the new status based on the selected type
    const newStatus = newType === "Casuality" ? "Pending" : "Admitted";

    // Update both type and status in state
    setsearchIPParams({ ...searchIPParams, type: newType, status: newStatus });
  };

  const handleeditIPPatientRegister = (params, type) => {
    console.log("params", params);
    const { RegistrationId } = params;

    const requestType = type || searchIPParams.type; // Use selected type or fallback to default

    axios
      .get(`${UrlLink}OP/get_workbenchquelist_doctor`, {
        params: { RegistrationId, Type: requestType },
      })
      .then((res) => {
        console.log(res);
        dispatchvalue({ type: "DoctorWorkbenchNavigation", value: {} });
        dispatchvalue({ type: "AllergyDetails", value: {} });

        dispatchvalue({
          type: "IP_DoctorWorkbenchNavigation",
          value: { ...res.data, ...params, RequestType: requestType },
        });
        navigate("/Home/DoctorFolder");
        dispatchvalue({
          type: "HrFolder",
          value: "IP_DoctorWorkbenchNavigation",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleIPSearchChange = (e) => {
    const { name, value } = e.target;

    setsearchIPParams({ ...searchIPParams, [name]: value });
    if (name === "Ward") {
      setSelectedWard(value);
    }
  };

  const PatientIPRegisterColumns = [
    {
      key: "id",
      name: "S.No",
      frozen: pagewidth > 500 ? true : false,
    },
    // {
    //   key: "FlaggingColour",
    //   name: "Flagging Colour",
    //   frozen: true,
    //   renderCell: (params) => (
    //     <div
    //       style={{
    //         backgroundColor: params.row.FlaggingColour || "transparent",
    //         width: "20px",
    //         height: "20px",
    //         cursor: "pointer",
    //         position: "relative",
    //       }}
    //       onMouseEnter={() => setShowTooltip(params.row.id)} // Show tooltip for this row
    //       onMouseLeave={() => setShowTooltip(null)} // Hide tooltip
    //     >
    //       {/* <h4>{params.row.Flagging ? params.row.Flagging : "N/A"}</h4> */}

    //       {/* Conditional rendering of the tooltip */}
    //       {showTooltip === params.row.id && (
    //         <div
    //           style={{
    //             position: "absolute",
    //             top: "-15px",
    //             left: "50%",
    //             transform: "translateX(-50%)",
    //             backgroundColor: "#d2cdd4",
    //             color: "#000",
    //             padding: "5px 10px",
    //             borderRadius: "4px",
    //             fontSize: "12px",
    //             whiteSpace: "nowrap",
    //           }}
    //         >
    //           {params.row.Flagging ? params.row.Flagging : "N/A"}
    //         </div>
    //       )}
    //     </div>
    //   ),
    // },
    {
      key: "RegistrationId",
      name: "IPNo",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientId",
      name: "Patient Id",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 200,
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "Age",
      name: "Age",
    },
    {
      key: "Gender",
      name: "Gender",
    },

    {
      key: "PhoneNo",
      name: "PhoneNo",
    },

    {
      key: "Complaint",
      name: "Complaint",
    },

    {
      key: "DoctorName",
      name: "Doctor Name",
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) =>
        params.row.Status === "Admitted" || params.row.Status === "Pending" ? (
          <Button
            className="cell_btn"
            onClick={() => {
              if (UserData?.Create) {
                handleeditIPPatientRegister(params.row, searchIPParams.type)
              } else {
                handleRestrictedAction();
              }
            }}
          >
            <ArrowForwardIcon className="check_box_clrr_cancell" />
          </Button>
        ) : (
          "-"
        ),
    },
  ];

  // ------------Casuality-----------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        // Fetch IP data or Casuality data based on the 'type' in searchIPParams
        if (SearchCasualityParams.type === "Casuality") {
          response = await axios.get(
            `${UrlLink}Frontoffice/get_patient_casuality_details`,
            { params: SearchCasualityParams }
          );
        }

        const data = response.data;
        console.log(data, "dataaaaaa");

        // Check if the response is an array
        if (Array.isArray(data)) {
          setCasualityPatientRegisterData(data);
        } else {
          setCasualityPatientRegisterData([]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [
    UrlLink,
    SearchCasualityParams,
    dateOption,
    fromDate,
    toDate,
    ParticularDate,
    CurrentDate,
  ]);

  const handleCasualityTypeChange = (e) => {
    const newType = e.target.value;
    // Determine the new status based on the selected type
    const newStatus = newType === "Casuality" ? "Pending" : "Admitted";

    // Update both type and status in state
    setsearchIPParams({ ...searchIPParams, type: newType, status: newStatus });
  };

  const handleeditCasualityPatientRegister = (params, type) => {
    console.log("params", params);
    const { RegistrationId } = params;

    const requestType = type || SearchCasualityParams.type; // Use selected type or fallback to default

    axios
      .get(`${UrlLink}OP/get_workbenchquelist_doctor`, {
        params: { RegistrationId, Type: requestType },
      })
      .then((res) => {
        console.log(res);
        dispatchvalue({
          type: "IP_DoctorWorkbenchNavigation",
          value: { ...res.data, ...params, RequestType: requestType },
        });
        navigate("/Home/DoctorFolder");
        dispatchvalue({
          type: "HrFolder",
          value: "IP_DoctorWorkbenchNavigation",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCasualitySearchChange = (e) => {
    const { name, value } = e.target;

    setSearchCasualityParams({ ...SearchCasualityParams, [name]: value });
  };

  const PatientCasualityRegisterColumns = [
    {
      key: "id",
      name: "S.No",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "Triage",
      name: "Triage",
      frozen: true,
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: params.row.Triage || "transparent",
            width: "20px",
            height: "20px",
            cursor: "pointer",
            position: "relative",
          }}
          onMouseEnter={() => setShowTooltip(params.row.id)} // Show tooltip for this row
          onMouseLeave={() => setShowTooltip(null)} // Hide tooltip
        >
          {/* <h4>{params.row.Flagging ? params.row.Flagging : "N/A"}</h4> */}

          {/* Conditional rendering of the tooltip */}
          {showTooltip === params.row.id && (
            <div
              style={{
                position: "absolute",
                top: "-15px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#d2cdd4",
                color: "#000",
                padding: "5px 10px",
                borderRadius: "4px",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              {params.row.Flagging ? params.row.Flagging : "N/A"}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "PatientId",
      name: "Patient Id",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 150,
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "Age",
      name: "Age",
    },
    {
      key: "Gender",
      name: "Gender",
    },
    {
      key: "PhoneNo",
      name: "PhoneNo",
    },

    {
      key: "Complaint",
      name: "Complaint",
    },

    {
      key: "Action",
      name: "Action",
      renderCell: (params) =>
        params.row.Status === "Pending" ? (
          <Button
            className="cell_btn"
            onClick={() =>
              handleeditCasualityPatientRegister(
                params.row,
                SearchCasualityParams.type
              )
            } // Use selected type
          >
            <ArrowForwardIcon className="check_box_clrr_cancell" />
          </Button>
        ) : (
          "-"
        ),
    },
  ];

  // ------------Emergency-----------------------

  useEffect(() => {
    const params = {};

    if (SearchEmergencyParams.query.trim()) {
      params.query = SearchEmergencyParams.query;
    } else {
      params.limit = 10; // Default limit if no search query
    }

    if (SearchEmergencyParams.status) {
      params.status = SearchEmergencyParams.status;
    } else {
      setEmergencyPatientRegisterData([]);
      return;
    }
    if (SearchEmergencyParams.type) {
      params.type = SearchEmergencyParams.type;
    } else {
      setEmergencyPatientRegisterData([]);
      return;
    }

    if (dateOption === "custom") {
      if (fromDate && toDate) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      } else {
        setEmergencyPatientRegisterData([]);
        return;
      }
    } else if (dateOption === "current") {
      if (CurrentDate) {
        params.CurrentDate = CurrentDate;
      } else {
        setEmergencyPatientRegisterData([]);
        return;
      }
    } else if (dateOption === "particular") {
      if (ParticularDate) {
        params.ParticularDate = ParticularDate;
      } else {
        setEmergencyPatientRegisterData([]); // Clear data if no particular date is selected
        return;
      }
    }

    axios
      .get(`${UrlLink}Frontoffice/get_Emergency_patient_details_for_Quelist`, {
        params,
      })
      .then((res) => {
        // const ress = res.data;
        const ress = res.data.appointments;
        const EmgCount = res.data.Total_Emg_Count;
        setTotalCasualityCount(EmgCount)
        console.log("IPpppppppppppppp", ress);
        if (Array.isArray(ress)) {
          setEmergencyPatientRegisterData(ress);
        } else {
          setEmergencyPatientRegisterData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    UrlLink,
    SearchEmergencyParams,
    dateOption,
    fromDate,
    toDate,
    ParticularDate,
    CurrentDate,
  ]);

  const handleeditEmergencyPatientRegister = (params, type) => {
    console.log("params", params);
    const { RegistrationId } = params;

    const requestType = type || SearchCasualityParams.type; // Use selected type or fallback to default

    axios
      .get(`${UrlLink}OP/get_workbenchquelist_doctor`, {
        params: { RegistrationId, Type: requestType },
      })
      .then((res) => {
        console.log(res);
        dispatchvalue({
          type: "IP_DoctorWorkbenchNavigation",
          value: { ...res.data, ...params, RequestType: requestType },
        });
        navigate("/Home/DoctorFolder");
        dispatchvalue({
          type: "HrFolder",
          value: "IP_DoctorWorkbenchNavigation",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEmergencySearchChange = (e) => {
    const { name, value } = e.target;

    setSearchEmergencyParams({ ...SearchCasualityParams, [name]: value });
  };

  const PatientEmergencyRegisterColumns = [
    {
      key: "id",
      name: "S.No",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "Triage",
      name: "Triage",
      frozen: true,
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: params.row.Triage || "transparent",
            width: "20px",
            height: "20px",
            cursor: "pointer",
            position: "relative",
          }}
          onMouseEnter={() => setShowTooltip(params.row.id)} // Show tooltip for this row
          onMouseLeave={() => setShowTooltip(null)} // Hide tooltip
        >
          {/* <h4>{params.row.Flagging ? params.row.Flagging : "N/A"}</h4> */}

          {/* Conditional rendering of the tooltip */}
          {showTooltip === params.row.id && (
            <div
              style={{
                position: "absolute",
                top: "-15px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#d2cdd4",
                color: "#000",
                padding: "5px 10px",
                borderRadius: "4px",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              {params.row.Flagging ? params.row.Flagging : "N/A"}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "PatientId",
      name: "Patient Id",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 150,
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "Age",
      name: "Age",
    },
    {
      key: "Gender",
      name: "Gender",
    },
    {
      key: "PhoneNo",
      name: "PhoneNo",
    },

    {
      key: "Complaint",
      name: "Complaint",
    },

    {
      key: "Action",
      name: "Action",
      renderCell: (params) =>
        params.row.Status === "Admitted" ? (
          <Button
            className="cell_btn"
            onClick={() => {
              if (UserData?.Create) {
                handleeditEmergencyPatientRegister(params.row, SearchEmergencyParams.type)
              } else {
                handleRestrictedAction();
              }
            }
            }
          >
            <ArrowForwardIcon className="check_box_clrr_cancell" />
          </Button>
        ) : (
          "-"
        ),
    },
  ];

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Refer_DoctorOpd_Details_CaseSheet`, {
        params: {
          RegistrationId: Registerid,
          VisitId: visitid,
          PatientId: PatientId,
        },
      })
      .then((res) => {
        const ress = Array.isArray(res.data) ? res.data : []; // Ensure it's an array
        setReferarr(ress);
        // Ensure this sets correctly
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, Registerid, visitid, PatientId]);

  useEffect(() => {
    axios
      .get(
        `${UrlLink}Workbench/Workbench_GeneralEvaluation_Details_CaseSheet`,
        {
          params: {
            RegistrationId: Registerid,
            VisitId: visitid,
          },
        }
      )
      .then((res) => {
        const ress = Array.isArray(res.data) ? res.data : [];
        setGeneralEvaluationData(ress); // Ensure this sets correctly
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, Registerid, visitid]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Workbench_Prescription_Details_CaseSheet`, {
        params: {
          RegistrationId: Registerid,
          VisitId: visitid,
        },
      })
      .then((res) => {
        const ress = Array.isArray(res.data) ? res.data : [];
        setprescriptiondata(ress); // Ensure this sets correctly
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, Registerid, visitid]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Workbench_Vitals_Details_CaseSheet`, {
        params: {
          RegistrationId: Registerid,
          VisitId: visitid,
        },
      })
      .then((res) => {
        const ress = Array.isArray(res.data) ? res.data : [];
        setVitalsData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, Registerid, visitid]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Workbench_Lab_Details_CaseSheet`, {
        params: {
          RegistrationId: Registerid,
          VisitId: visitid,
        },
      })
      .then((res) => {
        const ress = Array.isArray(res.data) ? res.data : [];
        setLabTest(ress); // Ensure this sets correctly
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, Registerid, visitid]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Workbench_Radiology_Details_CaseSheet`, {
        params: {
          RegistrationId: Registerid,
          VisitId: visitid,
        },
      })
      .then((res) => {
        const ress = Array.isArray(res.data) ? res.data : [];
        setRadiologyTest(ress); // Ensure this sets correctly
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, Registerid, visitid]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Worbench_Advice_Details_CaseSheet`, {
        params: {
          RegistrationId: Registerid,
          VisitId: visitid,
        },
      })
      .then((res) => {
        const ress = Array.isArray(res.data) ? res.data : [];
        setAdvice(ress); // Ensure this sets correctly
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, Registerid, visitid]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Worbench_Review_Details_CaseSheet`, {
        params: {
          RegistrationId: Registerid,
          VisitId: visitid,
        },
      })
      .then((res) => {
        const ress = Array.isArray(res.data) ? res.data : [];
        setNextreview(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, visitid, Registerid]);

  return (
    <>
      <div className="Main_container_app">
        <div className="DivCenter_container">Patientsss List </div>

        {/*------------- Patient Counts --------------------- */}

        <div className="con_1 ">
          {(isHost ? allDepartments : DepartmentNames)?.map((department) => (
            <div
              className="chart_body_1_child_1 dww3"
              key={department}
              onClick={() => handleDepartmentOptionChange(department)}
            >
              <div className="chart_body_1_child_1_body">
                <div className="chart_body_1_child_1_body_icon">
                  <Diversity1Icon />
                </div>
                <div className="chart_body_1_child_1_body_name">
                  {department === "CASUALITY"
                    ? "Casuality / Emergency Patients"
                    : `${department} Patients`}
                </div>
                <div className="chart_body_1_child_1_body_count">
                  {departmentCounts[department] ?? 0} {/* Show count */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {isSelected === "OP" ? (
          <>
            <div className="search_div_bar">
              <div className="search_div_bar_inp_1">
                <label>
                  {" "}
                  Date <span>:</span>{" "}
                </label>
                <select value={dateOption} onChange={handleDateOptionChange}>
                  <option value="all">All</option>
                  <option value="current">Current Date</option>
                  <option value="custom">Custom Date</option>
                  <option value="particular">Particular Date</option>
                </select>
              </div>

              {dateOption === "current" && (
                <div className="search_div_bar_inp_1">
                  <label>
                    {" "}
                    Current Date <span>:</span>{" "}
                  </label>
                  <input
                    type="date"
                    value={CurrentDate}
                    disabled
                    onChange={handleCurrentDateChange}
                  />
                </div>
              )}

              {dateOption === "custom" && (
                <>
                  <div className="search_div_bar_inp_1">
                    <label>
                      {" "}
                      From <span>:</span>{" "}
                    </label>

                    <input
                      type="date"
                      placeholder="From Date"
                      value={fromDate}
                      onChange={handleFromDateChange}
                    />
                  </div>

                  <div className="search_div_bar_inp_1">
                    <label>
                      {" "}
                      To <span>:</span>{" "}
                    </label>

                    <input
                      type="date"
                      placeholder="To Date"
                      value={toDate}
                      onChange={handleToDateChange}
                    />
                  </div>
                </>
              )}

              {/* Particular Date Input */}
              <br />
              {dateOption === "particular" && (
                <div className="search_div_bar_inp_1">
                  <label>
                    {" "}
                    Select Date <span>:</span>{" "}
                  </label>
                  <input
                    type="date"
                    value={ParticularDate}
                    onChange={handleParticularDateChange}
                  />
                </div>
              )}

              <div className="search_div_bar_inp_1">
                <label htmlFor="">
                  Search by
                  <span>:</span>
                </label>
                <input
                  type="text"
                  name="query"
                  value={searchOPParams.query}
                  placeholder="Search here... "
                  onChange={handleSearchChange}
                />
              </div>

              <div className="search_div_bar_inp_1">
                <label>
                  Status <span>:</span>
                </label>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "13px",
                    width: "330px",
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
                    Registered
                  </label>
                  <label style={{ width: "auto" }} htmlFor="status_in">
                    <input
                      required
                      id="status_in"
                      type="radio"
                      name="status"
                      value="Inprogress"
                      style={{ width: "15px" }}
                      checked={searchOPParams.status === "Inprogress"}
                      onChange={handleSearchChange}
                    />
                    Inprogress
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

              {/* <div className="search_div_bar_inp_1">
                            <label htmlFor="">Status
                                <span>:</span>
                            </label>
                            <select
                                id=''
                                name='status'
                                value={searchOPParams.status}
                                onChange={handleSearchChange}
                            >
                                <option value='Pending'>Pending</option>
                                <option value='Completed'>Completed</option>
                            </select>
                        </div> */}

              {UserData.Doctor ? (
                <div className="search_div_bar_inp_1">
                  <label htmlFor="doctor">
                    Doctor Name<span>:</span>
                  </label>
                  <input
                    type="text"
                    id="doctor"
                    name="Doctor"
                    value={UserData.DoctorName || "Doctor name not available"}
                    readOnly
                  />
                </div>
              ) : (
                <div className="search_div_bar_inp_1">
                  <label htmlFor="doctor">
                    Doctor Name<span>:</span>
                  </label>
                  <select
                    id="doctor"
                    name="Doctor"
                    value={searchDoctorParams.Doctor}
                    onChange={handleDoctorSearch}
                  >
                    <option value="">Select</option> {/* Default option */}
                    {DoctorNames.map((doctor, index) => (
                      <option key={index} value={doctor.id}>
                        {doctor.DoctorName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <ReactGrid
              columns={PatientOPRegisterColumns}
              RowData={PatientRegisterData}
            />
          </>
        ) : isSelected === "IP" ? (
          <>
            <div className="search_div_bar">
              <div className="search_div_bar_inp_1">
                <label>
                  {" "}
                  Date <span>:</span>{" "}
                </label>
                <select value={IpDateOption} onChange={handleIPDateOptionChange}>
                  <option value="all">All</option>
                  <option value="current">Current Date</option>
                  <option value="custom">Custom Date</option>
                  <option value="particular">Particular Date</option>
                </select>
              </div>

              {IpDateOption === "current" && (
                <div className="search_div_bar_inp_1">
                  <label>
                    {" "}
                    Current Date <span>:</span>{" "}
                  </label>
                  <input
                    type="date"
                    value={CurrentDate}
                    disabled
                    onChange={handleCurrentDateChange}
                  />
                </div>
              )}

              {IpDateOption === "custom" && (
                <>
                  <div className="search_div_bar_inp_1">
                    <label>
                      {" "}
                      From <span>:</span>{" "}
                    </label>

                    <input
                      type="date"
                      placeholder="From Date"
                      value={fromDate}
                      onChange={handleFromDateChange}
                    />
                  </div>

                  <div className="search_div_bar_inp_1">
                    <label>
                      {" "}
                      To <span>:</span>{" "}
                    </label>

                    <input
                      type="date"
                      placeholder="To Date"
                      value={toDate}
                      onChange={handleToDateChange}
                    />
                  </div>
                </>
              )}

              {/* Particular Date Input */}
              <br />
              {IpDateOption === "particular" && (
                <div className="search_div_bar_inp_1">
                  <label>
                    {" "}
                    Select Date <span>:</span>{" "}
                  </label>
                  <input
                    type="date"
                    value={ParticularDate}
                    onChange={handleParticularDateChange}
                  />
                </div>
              )}

              <div className=" search_div_bar_inp_1">
                <label htmlFor="">
                  Search by
                  <span>:</span>
                </label>
                <input
                  type="text"
                  name="query"
                  value={searchIPParams.query}
                  placeholder="Search here ... "
                  onChange={handleIPSearchChange}
                />
              </div>

              <div className="search_div_bar_inp_1">
                <label htmlFor="">
                  Status
                  <span>:</span>
                </label>
                <select
                  id=""
                  name="status"
                  value={searchIPParams.status}
                  onChange={handleIPSearchChange}
                >
                  {/* <option value=''>Select</option> */}
                  {/* <option value='Pending'>Pending</option> */}
                  <option value="Admitted">Admitted</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>

                  {/* <option value='Pending'>Pending</option>
                            <option value='Completed'>Completed</option> */}
                </select>
              </div>

              <div className="search_div_bar_inp_1">
                <label>
                  {" "}
                  Ward Type <span>:</span>{" "}
                </label>
                <select
                  name="Ward"
                  required
                  value={SelectedWard}
                  onChange={handleIPSearchChange}
                >
                  <option value="">Select Ward</option>
                  {/* Exclude ICU and CCU wards */}
                  {WardGet.filter(
                    (ward) =>
                      ward.Status === "Active" &&
                      ward.WardName !== "ICU" &&
                      ward.WardName !== "CCU" &&
                      ward.WardName !== "CASUALITY"
                  ).map((ward, indx) => (
                    <option key={indx} value={ward.id}>
                      {ward.WardName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* <div className="search_div_bar_inp_1">
                        <label>Type<span>:</span></label>
                        <select value={searchIPParams.type} onChange={handleIPTypeChange}>
                            <option value="IP">IP</option>
                            <option value="Casuality">Casuality</option>
                        </select>
                    </div> */}

            {/* <ReactGrid columns={PatientIPRegisterColumns} RowData={IpPatientRegisterData} /> */}
            
            
            {/* <ReactGrid
              columns={PatientIPRegisterColumns}
              RowData={IpPatientRegisterData.filter(
                (patient) =>
                  // Filter by SelectedWard and exclude ICU and CCU wards
                  (SelectedWard ? patient.WardId === SelectedWard : true) &&
                  patient.WardName !== "ICU" &&
                  patient.WardName !== "CCU"
              )}
            /> */}

            <ReactGrid
              columns={PatientIPRegisterColumns}
              RowData={filteredIpData}
            />
          </>
        ) : isSelected === "CASUALITY" ? (
          <>
            <div className="search_div_bar">
              <div className="search_div_bar_inp_1">
                <label>
                  {" "}
                  Date <span>:</span>{" "}
                </label>
                <select value={dateOption} onChange={handleDateOptionChange}>
                  <option value="all">All</option>
                  <option value="current">Current Date</option>
                  <option value="custom">Custom Date</option>
                  <option value="particular">Particular Date</option>
                </select>
              </div>

              {dateOption === "current" && (
                <div className="search_div_bar_inp_1">
                  <input
                    type="date"
                    value={CurrentDate}
                    disabled
                    onChange={handleCurrentDateChange}
                  />
                </div>
              )}

              {dateOption === "custom" && (
                <>
                  {" "}
                  <div className="search_div_bar_inp_1">
                    <label>
                      {" "}
                      From <span>:</span>{" "}
                    </label>

                    <input
                      type="date"
                      placeholder="From Date"
                      value={fromDate}
                      onChange={handleFromDateChange}
                    />
                  </div>
                  <div className="search_div_bar_inp_1">
                    <label>
                      {" "}
                      To <span>:</span>{" "}
                    </label>

                    <input
                      type="date"
                      placeholder="To Date"
                      value={toDate}
                      onChange={handleToDateChange}
                    />
                  </div>
                </>
              )}

              {dateOption === "particular" && (
                <div className="search_div_bar_inp_1">
                  <label>
                    {" "}
                    Select Date <span>:</span>{" "}
                  </label>
                  <input
                    type="date"
                    value={ParticularDate}
                    onChange={handleParticularDateChange}
                  />
                </div>
              )}

              <div className="search_div_bar_inp_1">
                <label htmlFor="">
                  Search by
                  <span>:</span>
                </label>
                <input
                  type="text"
                  name="query"
                  value={SearchEmergencyParams.query}
                  placeholder="Search here ... "
                  onChange={handleEmergencySearchChange}
                />
              </div>

              <div className="search_div_bar_inp_1">
                <label htmlFor="">
                  Status
                  <span>:</span>
                </label>
                <select
                  id=""
                  name="status"
                  value={SearchEmergencyParams.status}
                  onChange={handleEmergencySearchChange}
                >
                  {/* <option value=''>Select</option> */}
                  {/* <option value='Pending'>Pending</option> */}

                  <option value="Admitted">Admitted</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <ReactGrid
              columns={PatientEmergencyRegisterColumns}
              RowData={EmergencyPatientRegisterData}
            />
          </>
        ) : isSelected === "ICU" ? (
          <>
            <div className="search_div_bar">
              <div className="search_div_bar_inp_1">
                <label>
                  {" "}
                  Date <span>:</span>{" "}
                </label>
                <select value={dateOption} onChange={handleDateOptionChange}>
                  <option value="all">All</option>
                  <option value="current">Current Date</option>
                  <option value="custom">Custom Date</option>
                  <option value="particular">Particular Date</option>
                </select>
              </div>

              {dateOption === "current" && (
                <div className="search_div_bar_inp_1">
                  <input
                    type="date"
                    value={CurrentDate}
                    disabled
                    onChange={handleCurrentDateChange}
                  />
                </div>
              )}

              {dateOption === "custom" && (
                <>
                  {" "}
                  <div className="search_div_bar_inp_1">
                    <label>
                      {" "}
                      From <span>:</span>{" "}
                    </label>

                    <input
                      type="date"
                      placeholder="From Date"
                      value={fromDate}
                      onChange={handleFromDateChange}
                    />
                  </div>
                  <div className="search_div_bar_inp_1">
                    <label>
                      {" "}
                      To <span>:</span>{" "}
                    </label>

                    <input
                      type="date"
                      placeholder="To Date"
                      value={toDate}
                      onChange={handleToDateChange}
                    />
                  </div>
                </>
              )}

              {/* Particular Date Input */}
              <br />
              {dateOption === "particular" && (
                <div className="search_div_bar_inp_1">
                  <label>
                    {" "}
                    Select Date <span>:</span>{" "}
                  </label>
                  <input
                    type="date"
                    value={ParticularDate}
                    onChange={handleParticularDateChange}
                  />
                </div>
              )}

              <div className="search_div_bar_inp_1">
                <label htmlFor="">
                  Search by
                  <span>:</span>
                </label>
                <input
                  type="text"
                  name="query"
                  value={searchIPParams.query}
                  placeholder="Search here ... "
                  onChange={handleIPSearchChange}
                />
              </div>
              <div className="search_div_bar_inp_1">
                <label htmlFor="">
                  Status
                  <span>:</span>
                </label>
                <select
                  id=""
                  name="status"
                  value={searchIPParams.status}
                  onChange={handleIPSearchChange}
                >
                  <option value="Admitted">Admitted</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* <ReactGrid
              columns={PatientIPRegisterColumns}
              RowData={addSerialNumbers(
                IpPatientRegisterData.filter(
                  (patient) =>
                    // Filter by SelectedWard and exclude ICU and CCU wards
                    (SelectedWard ? patient.WardName === SelectedWard : true) &&
                    patient.WardName === "ICU"
                )
              )}
            /> */}

            <ReactGrid
              columns={PatientIPRegisterColumns}
              RowData={filteredIcuData}
            />
            
          </>
        ) : isSelected === "CCU" ? (
          <>
            <div className="search_div_bar">
              <div className="search_div_bar_inp_1">
                <label>
                  {" "}
                  Date <span>:</span>{" "}
                </label>
                <select value={dateOption} onChange={handleDateOptionChange}>
                  <option value="all">All</option>
                  <option value="current">Current Date</option>
                  <option value="custom">Custom Date</option>
                  <option value="particular">Particular Date</option>
                </select>
              </div>

              {dateOption === "current" && (
                <div className="search_div_bar_inp_1">
                  <input
                    type="date"
                    value={CurrentDate}
                    disabled
                    onChange={handleCurrentDateChange}
                  />
                </div>
              )}

              {dateOption === "custom" && (
                <>
                  {" "}
                  <div className="search_div_bar_inp_1">
                    <label>
                      {" "}
                      From <span>:</span>{" "}
                    </label>

                    <input
                      type="date"
                      placeholder="From Date"
                      value={fromDate}
                      onChange={handleFromDateChange}
                    />
                  </div>
                  <div className="search_div_bar_inp_1">
                    <label>
                      {" "}
                      To <span>:</span>{" "}
                    </label>

                    <input
                      type="date"
                      placeholder="To Date"
                      value={toDate}
                      onChange={handleToDateChange}
                    />
                  </div>
                </>
              )}

              {/* Particular Date Input */}
              <br />
              {dateOption === "particular" && (
                <div className="search_div_bar_inp_1">
                  <label>
                    {" "}
                    Select Date <span>:</span>{" "}
                  </label>
                  <input
                    type="date"
                    value={ParticularDate}
                    onChange={handleParticularDateChange}
                  />
                </div>
              )}

              <div className="search_div_bar_inp_1">
                <label htmlFor="">
                  Search by
                  <span>:</span>
                </label>
                <input
                  type="text"
                  name="query"
                  value={searchIPParams.query}
                  placeholder="Search here ... "
                  onChange={handleIPSearchChange}
                />
              </div>
              <div className="search_div_bar_inp_1">
                <label htmlFor="">
                  Status
                  <span>:</span>
                </label>
                <select
                  id=""
                  name="status"
                  value={searchIPParams.status}
                  onChange={handleIPSearchChange}
                >
                  <option value="Admitted">Admitted</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* <ReactGrid
              columns={PatientIPRegisterColumns}
              RowData={addSerialNumbers(
                IpPatientRegisterData.filter(
                  (patient) =>
                    (SelectedWard ? patient.WardName === SelectedWard : true) &&
                    patient.WardName === "CCU"
                )
              )}
            /> */}

            <ReactGrid
              columns={PatientIPRegisterColumns}
              RowData={filteredCcuData}
            />


          </>
        ) : null}

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "70px",
              flexWrap: "wrap",
            }}
          >
            {Array.isArray(Flag) &&
              Flag?.map((flag, indx) => (
                <div
                  key={indx}
                  style={{
                    width: "15px",
                    height: "15px",
                    backgroundColor: flag.FlaggColor,
                    border: "1px solid black",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredFlagIndex(indx)}
                  onMouseLeave={() => setHoveredFlagIndex(null)}
                >
                  {hoveredFlagIndex === indx && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-25px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#d2cdd4",
                        color: "#000",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {flag.FlaggName || "No flagging data"}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {showPrintContent && (
        <PrintContent
          ref={componentRef}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div id="reactprintcontent">
            <div className="wdqwtyxghs0">
              <h2 style={{ textAlign: "center",fontSize:'17px' }}>Patient Visit Details</h2>
              <h2 style={{ textAlign: "center",fontSize:'17px' }}>Case Sheet</h2>

              <br />
                                  <div style={{marginBottom:'20px', textAlign: "start",fontWeight:'bold',fontSize:'16px' }}>
                  <span style={{fontSize:'15px',fontWeight:'bold'}}>Prescribed by
                    <span>
                  {Patients?.PatientName ? (
                    <span style={{fontSize:'14px',fontWeight:'bold',marginLeft:'5px'}}>
                   { Patients.DoctorName}
                   
                  </span>
                 ) : (
                  <span>No Doctor Name...</span>
                )}
                </span>
                  </span>
                </div>
<div style={{display:'flex', justifyContent:'flex-start', width:'100%', textAlign:'start' }}>


                {Patients?.PatientName ? (
                  <span>
                    { 
                      Patients.PatientName +
                      " (Patient ID: " +
                      Patients.PatientId +
                      ") Age " +
                      Patients.Age +
                      " Years, " +
                      Patients.Gender }
                       {GeneralEvaluationData?.length > 0 && (
                      " — The patient had the following presentations: " +
                      GeneralEvaluationData.map((item, index) => {
                        const keyComplaint = item.KeyComplaint?.name || "N/A";
                        const history = item.History?.map(h => h.HistoryName).join(", ") || "N/A";
                        return `${index + 1}) ${keyComplaint} with history of ${history}`;
                      }).join("; ") + "."
                    )}
                  </span>
                ) : (
                  <span>No patient details...</span>
                )}
                </div>

                    <div
                      style={{ border: "1px solid grey", margin: "5px 0px" }}
                    ></div>
                  </div>
                {/* <br /> */}

            {/* refer */}
            <div className="dshcyts_8i">
              <div>
                {Array.isArray(referarr) && referarr.length > 0 ? (
                  <>
                    {" "}
                    <h2 style={{ textAlign: "start",fontSize:'17px' }}>ReferDoctor Details</h2>
                    <div className="for"  style={{paddingLeft:'0px'}}>
                      <div className="prin_nnrmll_table">
                        <table>
                          <thead>
                            <tr>
                              <th id="slectbill_ins">PrimaryDoctor Name</th>
                              <th id="slectbill_ins">ReferDoctor Speciality</th>
                              <th id="slectbill_ins">ReferDoctor Name</th>
                              <th id="slectbill_ins">ReferDoctor Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {referarr[0] && referarr[0].ReferDoctorId ? ( // Check if nextreview[0] has content
                              <tr key={referarr[0].id || 0}>
                                <td>{referarr[0].PrimaryDoctorId}</td>
                                <td>{referarr[0].ReferDoctorSpeciality}</td>
                                <td>{referarr[0].ReferDoctorId}</td>
                                <td>{referarr[0].ReferDoctorType}</td>
                              </tr>
                            ) : (
                              <tr>
                                <td colSpan="3">
                                  No refer doctor details available.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                     <div style={{marginTop:'0px'}}>
                        <hr/>
                      </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>

            <div className="dshcyts_8i">
              {Array.isArray(VitalsData) && VitalsData.length > 0 ? ( // Check if VitalsData is an array and has items
                <>
                  {" "}
                  <h2 style={{ textAlign: "start",fontSize:'17px' }}>Vitals</h2>
                  <div className="for"  style={{paddingLeft:'0px'}}>
                    <div className="prin_nnrmll_table">
                      <table>
                        <thead>
                          <tr>
                            <th id="slectbill_ins">Temperature</th>
                            <th id="slectbill_ins">SBP</th>
                            <th id="slectbill_ins">DBP</th>
                            <th id="slectbill_ins">Pulse Rate</th>
                            <th id="slectbill_ins">Height</th>
                            <th id="slectbill_ins">Weight</th>
                            <th id="slectbill_ins">BMI</th>
                            <th id="slectbill_ins">SPO2</th>
                            <th id="slectbill_ins">WC</th>
                            <th id="slectbill_ins">HC</th>
                            <th id="slectbill_ins">Date</th>
                            <th id="slectbill_ins">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {VitalsData.map((item, index) => (
                            <tr key={item.id || index}>
                              {console.log("Vitals Item:", item)}{" "}
                              {/* Debugging log */}
                              <td>{item.Temperature || "-"}</td>
                              <td>{item.SBP || "-"}</td>
                              <td>{item.DBP || "-"}</td>
                              <td>{item.PulseRate || "-"}</td>
                              <td>{item.Height || "-"}</td>
                              <td>{item.Weight || "-"}</td>
                              <td>{item.BMI || "-"}</td>
                              <td>{item.SPO2 || "-"}</td>
                              <td>{item.WC || "-"}</td>
                              <td>{item.HC || "-"}</td>
                              <td>{item.Date || "-"}</td>
                              <td>{item.Time || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                   <div style={{marginTop:'0px'}}>
                        <hr/>
                      </div>
                </>
              ) : (
                <>{/* No vitals were recorded during the current visit. */}</>
              )}
            </div>

            <div className="dshcyts_8i">
              {/* <h2 style={{ textAlign: "start",fontSize:'17px' }}>Treatment</h2> */}
              {Array.isArray(prescriptiondata) &&
                prescriptiondata.length > 0 ? ( // Check if prescriptionList is an array and has items
                <>
                  {" "}
                  <h2>Prescription</h2>
                  <div className="for"  style={{paddingLeft:'0px'}}>
                    <div className="prin_nnrmll_table">
                      <table>
                        <thead>
                          <tr>
                            <th id="slectbill_ins">Item Name</th>
                            <th id="slectbill_ins">Item Type</th>
                            <th id="slectbill_ins">Dosage</th>
                            <th id="slectbill_ins">Route</th>
                            <th id="slectbill_ins">Frequency Type</th>
                            <th id="slectbill_ins">Frequency</th>
                            <th id="slectbill_ins">Duration</th>
                            <th id="slectbill_ins">Qty</th>
                            <th id="slectbill_ins">Instruction</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prescriptiondata.map((item, index) => (
                            <tr key={item.Id || index}>
                              {console.log("item", item)}{" "}
                              {/* Log the item for debugging */}
                              <td>{item.ItemName || "No ItemName"}</td>
                              <td>{item.ItemType || "No ItemType"}</td>
                              <td>{item.Dosage || "No Dossage"}</td>
                              <td>{item.Route || "No Route"}</td>
                              <td>
                                {item.FrequencyType || "No FrequencyType"}
                              </td>
                              <td>
                                {item.Frequency ||
                                  item.Frequencys ||
                                  "No Frequency"}
                              </td>
                              <td>{`${item.DurationNumber} ${item.DurationUnit || ""
                                }`}</td>
                              <td>{item.Qty || "None"}</td>
                              <td>{item.Instruction || "No Instruction"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                   <div style={{marginTop:'0px'}}>
                        <hr/>
                      </div>
                </>
              ) : (
                <></>
              )}
            </div>

            <div className="dshcyts_8i">
              <div>
                {Array.isArray(LabTest) && LabTest.length > 0 ? ( // Check if VitalsData is an array and has items
                  <>
                    {" "}
                    <h2 style={{ textAlign: "start",fontSize:'17px' }}>
                      Investigations Ordered
                    </h2>
                    <h2 style={{textAlign:'start',fontSize:'17px'}}>Lab</h2>
                    <div className="for"  style={{paddingLeft:'0px'}}>
                      <div className="prin_nnrmll_table">
                        <table>
                          <thead>
                            <tr>
                              <th id="slectbill_ins">TestName</th>
                            </tr>
                          </thead>
                          <tbody>
                            {LabTest.map((item, index) => (
                              <tr key={item.id || index}>
                                      <td>{item.TestName || item.GroupName || item.PackageName || "No TestName"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                     <div style={{marginTop:'0px'}}>
                        <hr/>
                      </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>

            <div className="dshcyts_8i">
              <div>
                {Array.isArray(RadiologyTest) && RadiologyTest.length > 0 ? ( // Check if VitalsData is an array and has items
                  <>
                    {" "}
                    <h2 style={{ textAlign: "start",fontSize:'17px' }}>
                      Investigations Ordered
                    </h2>
                    <h2 style={{textAlign:'start'}}>Radiology</h2>
                    <div className="for"  style={{paddingLeft:'0px'}}>
                      <div className="prin_nnrmll_table">
                        <table>
                          <thead>
                            <tr>
                              <th>Radiology Department</th>
                              <th id="slectbill_ins">TestName</th>
                            </tr>
                          </thead>
                          <tbody>
                            {RadiologyTest.map((item, index) => (
                              <tr key={item.id || index}>
                                <td>
                                  {item.RadiologyName || "No RadiologyName"}
                                </td>
                                <td>{item.TestName || "No TestName"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                     <div style={{marginTop:'0px'}}>
                        <hr/>
                      </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>

            <div className="dshcyts_8i">
              <div>
                {Array.isArray(advice) && advice.length > 0 ? (
                  <>
                    <h2 style={{ textAlign: "start",fontSize:'17px' }}>Advice</h2>
                    <div className="for"  style={{paddingLeft:'0px'}}>
                      <div className="">
                        <table>
                          <tbody className="wdwdxsxww">
                            {advice[0] &&
                              advice[0].Advice &&
                              advice[0].Advice.trim() !== "" ? ( // Check if advice[0] has content
                              <tr key={advice[0].id || 0}>
                                <td>{advice[0].Advice}</td>
                              </tr>
                            ) : (
                              <tr>
                                <td>No advice available.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                     <div style={{marginTop:'0px'}}>
                        <hr/>
                      </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>

            <div className="dshcyts_8i">
              <div>
                {Array.isArray(nextreview) && nextreview.length > 0 ? (
                  <>
                    {" "}
                    <h2 style={{ textAlign: "start",fontSize:'17px' }}> Review </h2>
                    <div className="for"  style={{paddingLeft:'0px'}}>
                      <div className="">
                        <table>
                          <tbody className="wdwdxsxww">
                            {nextreview[0] && nextreview[0].NoOfDays ? ( // Check if nextreview[0] has content
                              <tr key={nextreview[0].id || 0}>
                                {/* <td>{nextreview[0].NoOfDays}</td>
                                <td>{nextreview[0].TimeInterval}</td>
                                <td>{nextreview[0].Date}</td> */}

                                <td>
                                  Next Review Date (On/After) :
                                  {nextreview[0].Date} ({nextreview[0].NoOfDays}
                                  Day(s))
                                </td>
                              </tr>
                            ) : (
                              <tr>
                                <td colSpan="3">
                                  No next review details available.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                     <div style={{marginTop:'0px'}}>
                        <hr/>
                      </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </PrintContent>
      )}

     {showViewContent && (
        <div
          className="sideopen_showcamera_profile"
          onClick={() => setShowViewContent(false)}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <PrintContent
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div id="reactprintcontent">
                <div className="wdqwtyxghs0">
                    <h2 style={{ textAlign: "center",fontSize:'17px'  }}>
                      Patient Visit Details
                    </h2>
                    <h2 style={{ textAlign: "center",fontSize:'17px'  }}>Case Sheet</h2>

                    <br />

                                    <div style={{marginBottom:'20px', textAlign: "start",fontWeight:'bold',fontSize:'16px' }}>
                  <span style={{fontSize:'15px',fontWeight:'bold'}}>Prescribed by
                    <span>
                  {Patients?.PatientName ? (
                    <span style={{fontSize:'14px',fontWeight:'bold',marginLeft:'5px'}}>
                   { Patients.DoctorName}
                   
                  </span>
                 ) : (
                  <span>No Doctor Name...</span>
                )}
                </span>
                  </span>
                </div>
<div style={{display:'flex', justifyContent:'flex-start', width:'100%', textAlign:'start' }}>


                {Patients?.PatientName ? (
                  <span>
                    { 
                      Patients.PatientName +
                      " (Patient ID: " +
                      Patients.PatientId +
                      ") Age " +
                      Patients.Age +
                      " Years, " +
                      Patients.Gender}
                      {GeneralEvaluationData?.length > 0 && (
                      " — The patient had the following presentations: " +
                      GeneralEvaluationData.map((item, index) => {
                        const keyComplaint = item.KeyComplaint?.name || "N/A";
                        const history = item.History?.map(h => h.HistoryName).join(", ") || "N/A";
                        return `${index + 1}) ${keyComplaint} with history of ${history}`;
                      }).join("; ") + "."
                    )}
                      
                       
                  </span>
                ) : (
                  <span>No patient details...</span>
                )}
                </div>

                    <div
                      style={{ border: "1px solid grey", margin: "5px 0px" }}
                    ></div>
                  </div>
                {/* <br /> */}

                {/* refer */}
                <div className="dshcyts_8i">
                  <div>
                    {Array.isArray(referarr) && referarr.length > 0 ? (
                      <>
                        {" "}
                        <h2 style={{ textAlign: "start",fontSize:'17px' }}>
                          ReferDoctor Details
                        </h2>
                        <div className="for"  style={{paddingLeft:'0px'}}>
                          <div className="prin_nnrmll_table">
                            <table>
                              <thead>
                                <tr>
                                  <th id="slectbill_ins">PrimaryDoctor Name</th>
                                  <th id="slectbill_ins">
                                    ReferDoctor Speciality
                                  </th>
                                  <th id="slectbill_ins">ReferDoctor Name</th>
                                  <th id="slectbill_ins">ReferDoctor Type</th>
                                </tr>
                              </thead>
                              <tbody>
                                {referarr[0] && referarr[0].ReferDoctorId ? ( // Check if nextreview[0] has content
                                  <tr key={referarr[0].id || 0}>
                                    <td>{referarr[0].PrimaryDoctorId}</td>
                                    <td>{referarr[0].ReferDoctorSpeciality}</td>
                                    <td>{referarr[0].ReferDoctorId}</td>
                                    <td>{referarr[0].ReferDoctorType}</td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td colSpan="3">
                                      No refer doctor details available.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                         <div style={{marginTop:'0px'}}>
                        <hr/>
                      </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                <div className="dshcyts_8i">
                  {Array.isArray(VitalsData) && VitalsData.length > 0 ? ( // Check if VitalsData is an array and has items
                    <>
                      {" "}
                      <h2 style={{ textAlign: "start",fontSize:'17px' }}>Vitals</h2>
                      <div className="for"  style={{paddingLeft:'0px'}}>
                        <div className="prin_nnrmll_table">
                          <table>
                            <thead>
                              <tr>
                                <th id="slectbill_ins">Temperature</th>
                                <th id="slectbill_ins">SBP</th>
                                <th id="slectbill_ins">DBP</th>
                                <th id="slectbill_ins">Pulse Rate</th>
                                <th id="slectbill_ins">Height</th>
                                <th id="slectbill_ins">Weight</th>
                                <th id="slectbill_ins">BMI</th>
                                <th id="slectbill_ins">SPO2</th>
                                <th id="slectbill_ins">WC</th>
                                <th id="slectbill_ins">HC</th>
                                <th id="slectbill_ins">Date</th>
                                <th id="slectbill_ins">Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {VitalsData.map((item, index) => (
                                <tr key={item.id || index}>
                                  {console.log("Vitals Item:", item)}{" "}
                                  {/* Debugging log */}
                                  <td>
                                    {item.Temperature || "No Temperature"}
                                  </td>
                                  <td>{item.SBP || "No SBP"}</td>
                                  <td>{item.DBP || "No DBP"}</td>
                                  <td>{item.PulseRate || "No Pulse Rate"}</td>
                                  <td>{item.Height || "No Height"}</td>
                                  <td>{item.Weight || "No Weight"}</td>
                                  <td>{item.BMI || "No BMI"}</td>
                                  <td>{item.SPO2 || "No SPO2"}</td>
                                  <td>{item.WC || "No WC"}</td>
                                  <td>{item.HC || "No HC"}</td>
                                  <td>{item.Date || "No Date"}</td>
                                  <td>{item.Time || "No Time"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                       <div style={{marginTop:'0px'}}>
                        <hr/>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="dshcyts_8i">
                  {Array.isArray(prescriptiondata) &&
                    prescriptiondata.length > 0 ? ( // Check if prescriptionList is an array and has items
                    <>
                      {" "}
                      <h2 style={{ textAlign: "start",fontSize:'17px' }}>Treatment</h2>
                      <h2 style={{ textAlign: "start",fontSize:'17px' }}>Prescription</h2>
                      <div className="for"  style={{paddingLeft:'0px'}}>
                        <div className="prin_nnrmll_table">
                          <table>
                            <thead>
                              <tr>
                                <th id="slectbill_ins">Item Name</th>
                                <th id="slectbill_ins">Item Type</th>
                                <th id="slectbill_ins">Dosage</th>
                                <th id="slectbill_ins">Route</th>
                                <th id="slectbill_ins">Frequency Type</th>
                                <th id="slectbill_ins">Frequency</th>
                                <th id="slectbill_ins">Duration</th>
                                <th id="slectbill_ins">Qty</th>
                                <th id="slectbill_ins">Instruction</th>
                              </tr>
                            </thead>
                            <tbody>
                              {prescriptiondata.map((item, index) => (
                                <tr key={item.Id || index}>
                                  {console.log("item", item)}{" "}
                                  {/* Log the item for debugging */}
                                  <td>{item.ItemName || "No ItemName"}</td>
                                  <td>{item.ItemType || "No ItemType"}</td>
                                  <td>{item.Dosage || "No Dossage"}</td>
                                  <td>{item.Route || "No Route"}</td>
                                  <td>
                                    {item.FrequencyType || "No FrequencyType"}
                                  </td>
                                  <td>
                                    {item.Frequency ||
                                      item.Frequencys ||
                                      "No Frequency"}
                                  </td>
                                  <td>{`${item.DurationNumber} ${item.DurationUnit || ""
                                    }`}</td>
                                  <td>{item.Qty || "None"}</td>
                                  <td>
                                    {item.Instruction || "No Instruction"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                       <div style={{marginTop:'0px'}}>
                        <hr/>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="dshcyts_8i">
                  <div>
                    {Array.isArray(LabTest) && LabTest.length > 0 ? ( // Check if VitalsData is an array and has items
                      <>
                        {" "}
                        <h2 style={{ textAlign: "start",fontSize:'17px' }}>
                          Investigations Ordered
                        </h2>{" "}
                        <h2 style={{textAlign:'start'}}>Lab</h2>
                        <div className="for"  style={{paddingLeft:'0px'}}>
                          <div className="prin_nnrmll_table">
                            <table>
                              <thead>
                                <tr>
                                  <th id="slectbill_ins">TestName</th>
                                </tr>
                              </thead>
                              <tbody>
                                {LabTest.map((item, index) => (
                                  <tr key={item.id || index}>
                                      <td>{item.TestName || item.GroupName || item.PackageName || "No TestName"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                         <div style={{marginTop:'0px'}}>
                        <hr/>
                      </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                <div className="dshcyts_8i">
                  <div>
                    {Array.isArray(RadiologyTest) &&
                      RadiologyTest.length > 0 ? ( // Check if VitalsData is an array and has items
                      <>
                        {" "}
                        <h2 style={{ textAlign: "start",fontSize:'17px' }}>
                          Investigations Ordered
                        </h2>{" "}
                        <h2 style={{textAlign:'start'}}>Radiology</h2>
                        <div className="for"  style={{paddingLeft:'0px'}}>
                          <div className="prin_nnrmll_table">
                            <table>
                              <thead>
                                <tr>
                                  <th>Radiology Department</th>
                                  <th id="slectbill_ins">TestName</th>
                                </tr>
                              </thead>
                              <tbody>
                                {RadiologyTest.map((item, index) => (
                                  <tr key={item.id || index}>
                                    <td>
                                      {item.RadiologyName || "No RadiologyName"}
                                    </td>
                                    <td>{item.TestName || "No TestName"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                         <div style={{marginTop:'0px'}}>
                        <hr/>
                      </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                <div className="dshcyts_8i">
                  <div>
                    {Array.isArray(advice) && advice.length > 0 ? (
                      <>
                        {" "}
                        <h2 style={{ textAlign: "start",fontSize:'17px' }}>Advice</h2>
                        <div className="for"  style={{paddingLeft:'0px'}}>
                          <div className="">
                            <table>
                              <tbody className="wdwdxsxww">
                                {advice[0] &&
                                  advice[0].Advice &&
                                  advice[0].Advice.trim() !== "" ? ( // Check if advice[0] has content
                                  <tr key={advice[0].id || 0}>
                                    <td>{advice[0].Advice}</td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td>No advice available.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                         <div style={{marginTop:'0px'}}>
                        <hr/>
                      </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                <div className="dshcyts_8i">
                  <div>
                    {Array.isArray(nextreview) && nextreview.length > 0 ? (
                      <>
                        {" "}
                        <h2 style={{ textAlign: "start",fontSize:'17px' }}> Review </h2>
                        <div className="for"  style={{paddingLeft:'0px'}}>
                          <div className="">
                            <table>
                              <tbody className="wdwdxsxww">
                                {nextreview[0] && nextreview[0].NoOfDays ? ( // Check if nextreview[0] has content
                                  <tr key={nextreview[0].id || 0}>
                                    <td>
                                      Next Review Date (On/After) :
                                      {nextreview[0].Date} (
                                      {nextreview[0].NoOfDays}Day(s))
                                    </td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td colSpan="3">
                                      No next review details available.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                         <div style={{marginTop:'0px'}}>
                        <hr/>
                      </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </PrintContent>
          </div>
        </div>
      )}
    </>
  );
};

export default TotalPatientList;
