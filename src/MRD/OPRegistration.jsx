import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import {
  differenceInYears,
  format,
  startOfYear,
  subYears,
  isBefore,
} from "date-fns";
import axios from "axios";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import LoupeIcon from "@mui/icons-material/Loupe";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { FaTrash } from "react-icons/fa";
import { Plus, ChevronLeft, ChevronRight, Edit, Trash, Check, ArrowRight ,CalendarClock} from "lucide-react";
// import AllPatienbarcode from "../RegistrationList/AllPatientbarcode";


const OPRegistration = () => {
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

  const [Billpage,setBBillpage] = useState("")

  // radiology 05-06-25
const [expandedRadiologyIds, setExpandedRadiologyIds] = React.useState([]);
const toggleRadiology = (id) => {
  setExpandedRadiologyIds((prev) =>
    prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
  );
};
  const [AppointmentRegisType, setAppointmentRegisType] = useState("OP");
  const Registeredit = useSelector((state) => state.Frontoffice?.Registeredit);
  const ReferalDocPatient = useSelector((state) => state.Frontoffice?.ReferalDocPatient);

  const PatientDetails = useSelector(
    (state) => state.Frontoffice?.PatientDetails
  );

  console.log(PatientDetails, "PatientDetails");
  console.log(Registeredit, "Registeredit");
  console.log(ReferalDocPatient, "ReferalDocPatient");

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);


  useEffect(() => {
    if (Registeredit?.Department) {
      setAppointmentRegisType(Registeredit.Department);
 
      if (Registeredit?.Department === 'RADIOLOGY') {
        setradiologydoctor(Registeredit?.DoctorId);
        setOPVisitEntry((prev) => ({
          ...prev,
          Raddocid: Registeredit?.Raddocid
        }));
        setSubtestNo(Registeredit?.testlist)
      }
 
      else if(Registeredit?.Department == 'LAB'){
        setlabdoctor(Registeredit?.DoctorId);
        setOPVisitEntry((prev) => ({
          ...prev,
          Labdocid: Registeredit?.Labdocid,
          LabrequestID : Registeredit?.LabrequestID
        }));
        setSelectedTest(Registeredit?.testlist)
      }
     
    } else {
      setAppointmentRegisType("OP");
    }
  }, [Registeredit]);

  useEffect(()=>{
    if (PatientDetails?.Department === "CASUALITY"){
      setAppointmentRegisType(PatientDetails?.Department)
    }

    else if (PatientDetails?.Department === "RADIOLOGY"){
      setAppointmentRegisType(PatientDetails?.Department)
    }

    else if (PatientDetails?.Department === "SERVICES"){
      setAppointmentRegisType(PatientDetails?.Department)
    }

  },[PatientDetails])




  
  const [labvisit, setlabvisit] = useState("WALK-IN");
  const [labdoctor, setlabdoctor] = useState("");

  const [radiologyvisit, setradiologyvisit] = useState("WALK-IN");
  const [radiologydoctor, setradiologydoctor] = useState("");

  const [MHCvisit, setMHCvisit] = useState("WALK-IN");
  const [MHCdoctor, setMHCdoctor] = useState("");

  const [daycaredoctor, setdaycaredoctor] = useState("");

  const [packages, setPackages] = useState([]);

  const [Packagename, setPackagename] = useState({
    pkgname: "",
    pkgid: "",
  });

  const [Daycareservices, setDaycareservices] = useState({
    dcname: "",
    dcid: "",
  });

  const [selecteddaycare, setselecteddaycare] = useState([]);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const [Daycare, setDaycare] = useState("");
  const [Daycareprocedure, setDaycareprocedure] = useState([]);
  const [Daycaretherapy, setDaycaretherapy] = useState([]);

  const [servicesdoctor, setservicesdoctor] = useState("");
  const [openModal3, setOpenModal3] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedEmgRowData, setSelectedEmgRowData] = useState(null);
  const [SelectedOpPatientData, setSelectedOpPatientData] = useState([]);
  const [SelectedEmgPatientData, setSelectedEmgPatientData] = useState([]);

  console.log(openModal3,'openModal3')
  console.log(selectedRowData,'selectedRowData----')
  console.log(selectedEmgRowData,'selectedEmgRowData----')
  console.log(SelectedOpPatientData,'SelectedOpPatientData----')
  console.log(SelectedEmgPatientData,'SelectedEmgPatientData----')
 
 useEffect(() => {
  if (selectedEmgRowData) {
    console.log("🔥 selectedEmgRowData changed:", selectedEmgRowData);
    // do something useful here
  }
}, [selectedEmgRowData]);

  const [openModal2, setOpenModal2] = useState(false);
  const [filteredTestList, setFilteredTestList] = useState([]);
  const [mulappoint, setmulappoint] = useState([]);
  

 
  const [FetchedNewPatientDetails, setFetchedNewPatientDetails] = useState(null);
  const [DateOfPatientReg, setDateOfPatientReg] = useState("");
  const [Exisitingvisitdetails,setExisitingvisitdetails] = useState([]);
  console.log(FetchedNewPatientDetails,'FetchedNewPatientDetails----1')
  console.log(DateOfPatientReg,'DateOfPatientReg----1')

  useEffect(() => {
    if (
      PatientDetails &&
      Object.keys(PatientDetails).length > 0 &&
      !FetchedNewPatientDetails
    ) {
      setFetchedNewPatientDetails(PatientDetails);
    }
  }, [PatientDetails, FetchedNewPatientDetails]);

  // useEffect(()=>{
  //   if(PatientDetails && Object.keys(PatientDetails).length > 0 ){
  //   setDateOfPatientReg(PatientDetails?.LastVisitDate)
  //   }
  // },[PatientDetails?.LastVisitDate])

 
  const openModal = () => {
    setOpenModal2(true);
  };



  const handleCloseModal = () => {
    setOpenModal3(null);
    setSelectedRowData(null);

    const submitdata = {
      ...OPVisitEntry,
      Created_by: UserData?.username,
      RegisterType: AppointmentRegisType,
      DocEditId: DocEdit,
      PatientId: patientsearch.Search,
      RegistrationId: Registeredit?.RegistrationId || EditEventId || "",
      Appoint_list: mulappoint,
      RegisterData: RegisterData,
      AppointmentId:
        Registeredit?.AppointmentId ||
        PatientDetails?.AppointmentId ||
        null,
      labvisit: labvisit,
      labdoctor: labdoctor,
      radiologyvisit: radiologyvisit,
      radiologydoctor: radiologydoctor,
      SelectedTest: SelectedTest,

      Packagename: Packagename,
      selectedServices: selectedServices,

      MHCvisit: MHCvisit,
      MHCdoctor: MHCdoctor,

      daycaredoctor: daycaredoctor,
      selecteddaycare: selecteddaycare,

      SubtestNoArr: SubtestNo,
      location: UserData?.location,
      // ...formData
    };

    console.log("datatosend", submitdata);

  
    // After closing the Barcode modal
    setTimeout(() => {
      const userConfirmed = window.confirm("Do you want to pay Consultation Fee?");
      if (userConfirmed && Registeredit?.RegistrationId !== '' &&  ReferalDocPatient?.RegistrationId !== '') {
        navigate("/Home/FrontOfficeFolder");
        dispatchvalue({
          type: "OPConsultDetails",
          value: {
            submitdata: submitdata,
            BillingType: 'Consultation',
            RegistrationId: selectedRowData || selectedEmgRowData || "", // use selected data
          },
        });
        dispatchvalue({ type: "HrFolder", value: "QuickBilling" });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });
      } else {
        navigate("/Home/FrontOfficeFolder");
        dispatchvalue({
          type: "HrFolder",
          value: "PatientRegisterList",
        });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });
      }
    }, 200); // Small delay after closing modal
  };



  





      useEffect(() => {
        if (selectedRowData) {  // Fetch only if RegistrationId exists
          axios.get(`${UrlLink}Frontoffice/get_OP_Patient_Details_For_BarcodePrint`, {
            params: { RegistrationId: selectedRowData }
          })
          .then((res) => {
            const ress = res.data;
            setSelectedOpPatientData(ress);
            setOpenModal3("Barcode"); // ✅ Only open barcode after fetching
          })
          .catch((err) => {
            console.log(err);
          });
        }
      }, [selectedRowData]);  // ✅ Listen to selectedRowData changes
      
      useEffect(() => {
        if (selectedEmgRowData) {  // Fetch only if RegistrationId exists
          axios.get(`${UrlLink}Frontoffice/get_Emg_Patient_Details_For_BarcodePrint`, {
            params: { RegistrationId: selectedEmgRowData }
          })
          .then((res) => {
            const ress = res.data;
            setSelectedEmgPatientData(ress);
            console.log(ress,'ress');
            
            setOpenModal3("Barcode"); // ✅ Only open barcode after fetching
          })
          .catch((err) => {
            console.log(err);
          });
        }
      }, [selectedEmgRowData]);  // ✅ Listen to selectedRowData changes
      

      const getModalContent = () => {
        // if (!SelectedOpPatientData || !openModal3  || !FetchedNewPatientDetails) return null;
      
        console.log('ssssssssss');
        const rowData = (SelectedOpPatientData && SelectedOpPatientData.RegistrationId) 
        ? SelectedOpPatientData 
        : SelectedEmgPatientData;

        // const rowData = SelectedOpPatientData || SelectedEmgPatientData;

        if (openModal3 === 'Barcode' && !rowData) {
          console.log('⛔️ Barcode modal opened before rowData is ready');
          return <div>Loading barcode data...</div>;
        }
        console.log(SelectedOpPatientData, 'jj----SelectedOpPatientData');
        console.log(SelectedEmgPatientData, 'jj----SelectedEmgPatientData');
        console.log(FetchedNewPatientDetails, 'jj---FetchedNewPatientDetails');
        console.log('aaaaaaaaa');
      
        switch (openModal3) {
          case 'Barcode':
            // return <AllPatienbarcode rowData={rowData} PatientDetails={FetchedNewPatientDetails}/>;
          default:
            return null;
        }
        // console.log('dddddddd');

      };
      


  const handleCloseModal1 = () => {
    setOpenModal2(false);
  };

  const handlepkgchange = (e) => {
    const { value, name } = e.target;
    const value1 = value.split("|");
    const value2 = value1[0];
    const value3 = value1[1];

    console.log(value1, value2, value3);

    setPackagename((prev) => ({
      ...prev,
      pkgname: value3,
      pkgid: value2,
    }));

    // const selectedPkg = packages.find((pkg) => pkg.id.toString() === value2);
    const selectedPkg = packages.find((pkg) => pkg.PackageName === value3);

    if (selectedPkg) {
      setSelectedPackage(selectedPkg);
      setSelectedServices(selectedPkg.Services_details);
    }
  };

  const handledcchange = (e) => {
    const { value, name } = e.target;
    const value1 = value.split("|");
    const value2 = value1[0];
    const value3 = value1[1];

    console.log(value1, value2, value3);

    setDaycareservices((prev) => ({
      ...prev,
      dcname: value3,
      dcid: value2,
    }));
  };

  const handledaycareadd = (e) => {
    let isDuplicate = false;

    setselecteddaycare((prev) => {
      if (prev.some((item) => item.dcname === Daycareservices.dcname)) {
        dispatchvalue({
          type: "toast",
          value: { message: "Services Already Added", type: "warn" },
        });
        isDuplicate = true;
        return prev;
      }

      return [
        ...prev,
        {
          sno: prev.length + 1,
          dcname: Daycareservices.dcname,
          dcid: Daycareservices.dcid,
          Categoryname: Daycare,
        },
      ];
    });

    // if (isDuplicate) {

    // }

    setDaycareservices({
      dcname: "",
      dcid: "",
    });

    setDaycare("");
  };

  const [TestNames, setTestNames] = useState([]);
  const [SubtestNo, setSubtestNo] = useState([]);
  const [IsRadilogyGet, setIsRadilogyGet] = useState(false);
  const [no, setno] = useState([]);

  const handleCheckboxSubtestNo = (
    Curr_Amount,
    testid,
    TestName,
    Radiologyid,
    RadiologyName,
    TestCode
  ) => {
    const isChecked = SubtestNo.some((item) => item.TestCode === TestCode);
    if (isChecked) {
      const newCheckedState = SubtestNo.filter(
        (item) => item.TestCode !== TestCode
      );
      setSubtestNo(newCheckedState);
    } else {
      const newCheckedState = [
        ...SubtestNo,
        {
          Radiologyid,
          RadiologyName,
          testid,
          TestName,
          Curr_Amount,
          TestCode,
        },
      ];
      setSubtestNo(newCheckedState);
    }
  };

  const handleRemoveTestName = (row) => {
    // Remove from SubtestNo (if applicable)
    const newSubtestNoState = SubtestNo.filter(
      (item) =>
        item.testid !== row.testid || item.Radiologyid !== row.Radiologyid
    );
    setSubtestNo(newSubtestNoState);
  };

  const IndivitualColumns = [
    {
      key: "id",
      name: "S.No",
      frozen: true,
    },
    {
      key: "TestCode",
      name: "Test Code",
    },
    {
      key: "RadiologyName",
      name: "Radiology Name",
    },

    {
      key: "TestName",
      name: "Test Name",
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleRemoveTestName(params.row)}
        >
          <FaTrash className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];

  const pkgColumns = [
    {
      key: "id",
      name: "S.No",
      frozen: true,
    },
    {
      key: "Categoryname",
      name: "ServiceType",
    },
    {
      key: "SubCategoryname",
      name: "Services",
    },
  ];

  const daycarecol = [
    {
      key: "sno",
      name: "S.No",
      frozen: true,
    },
    {
      key: "Categoryname",
      name: "ServiceType",
    },
    {
      key: "dcname",
      name: "Services",
    },
  ];

  const transformFavouriteData = (SubtestNo) => {
    return SubtestNo.map((sutestno, ind) => ({
      Radiologyid: sutestno.Radiologyid, // Correctly assign Radiologyid
      RadiologyName: sutestno.RadiologyName,
      TestCode: sutestno.TestCode,
      TestName: sutestno.TestName,
      testid: sutestno.testid, // Correctly assign testid
      id: ind + 1, // Ensure unique key for each row
    }));
  };

  const transformedFavouriteData1 = transformFavouriteData(SubtestNo);



  const toast = useSelector((state) => state.userRecord?.toast);
  const RegisterRoomShow = useSelector(
    (state) => state.Frontoffice?.RegisterRoomShow
  );
  const SelectRoomRegister = useSelector(
    (state) => state.Frontoffice?.SelectRoomRegister
  );
  const [loading, setLoading] = useState(false);
  const [SpecializationData, setSpecializationData] = useState([]);
  const [DoctorData, setDoctorData] = useState([]);
  const [TokenData, setTokenData] = useState([]);
  const [ReferralDoctorData, setReferralDoctorData] = useState([]);
  const [EmployeeData, setEmployeeData] = useState([]);
  console.log(DoctorData, "DoctorData");
  console.log(SpecializationData, "SpecializationData");

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
  const [expanded, setExpanded] = useState(false);

  const [category, setcategory] = useState([]);
  const [subcategory, setsubcategory] = useState([]);

  console.log(TitleNameData, "TitleNameData");
  const [editingIndex, setEditingIndex] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [EditEventId, setEditEventId] = useState(null);
  const [DocEdit, setDocEdit] = useState([]);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [deleteDocName, setdeleteDocName] = useState(null);
  const [DeleteAppointmentData, setDeleteAppointmentData] = useState(false);



  // Function to format date as MM/DD/YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [patientsearch, setpatientsearch] = useState({
    Search: PatientDetails.PatientId || Registeredit.PatientId || ReferalDocPatient.PatientId || "",
  });


  
  console.log(patientsearch,'patientsearch');
  
  console.log(PatientDetails.PatientId,'1111')
  console.log(Registeredit.PatientId,'2222')
  console.log(ReferalDocPatient.PatientId ,'3333')

  
  const [FilterbyPatientId, setFilterbyPatientId] = useState([]);
  const [PreVisitedDoctors, setPreVisitedDoctors] = useState([]);

  console.log(FilterbyPatientId, "FilterbyPatientId");
  console.log(PreVisitedDoctors, "PreVisitedDoctors");

  const [FilteredFormdata, setFilteredFormdata] = useState(null);

  console.log(FilteredFormdata, "FilteredFormdata");
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

  const [errors, setErrors] = useState({});
  const [BillDueChanges, setBillDueChanges] = useState(false);
  const [BillDue, setBillDue] = useState([]);
  const [SearchPatientIdCard, setSearchPatientIdCard] = useState({});
  const [RegisterData, setRegisterData] = useState({
    // PatientId: '',
    ABHA: PatientDetails.ABHA || Registeredit.ABHA || ReferalDocPatient.ABHA || "",
    Title: PatientDetails.Title || Registeredit.TitleId || ReferalDocPatient.Title || "",
    FirstName: PatientDetails.FirstName || Registeredit.FirstName || ReferalDocPatient.FirstName || "",
    MiddleName: PatientDetails.MiddleName || Registeredit.MiddleName || ReferalDocPatient.MiddleName || "",
    SurName: PatientDetails.SurName || Registeredit.LastName || ReferalDocPatient.LastName || "",
    Gender: PatientDetails.Gender || Registeredit.Gender || ReferalDocPatient.Gender || "",
    MaritalStatus: PatientDetails.MaritalStatus || Registeredit.MaritalStatus || ReferalDocPatient.MaritalStatus || "",
    SpouseName: PatientDetails.SpouseName || Registeredit.SpouseName || ReferalDocPatient.SpouseName || "",
    FatherName: PatientDetails.FatherName || Registeredit.FatherName || ReferalDocPatient.FatherName || "",
    DOB: PatientDetails.DOB || Registeredit.DOB || ReferalDocPatient.DOB || "",
    Age: PatientDetails.Age || Registeredit.Age ||  ReferalDocPatient.Age || "",
    PhoneNo: PatientDetails.PhoneNo || Registeredit.PhoneNumber || ReferalDocPatient.PhoneNo || "",
    Email: PatientDetails.Email || Registeredit.Email || ReferalDocPatient.Email || "",
    BloodGroup: PatientDetails.BloodGroup || Registeredit.BloodGroup || ReferalDocPatient.BloodGroup || "",
    Occupation: PatientDetails.Occupation || Registeredit.Occupation || ReferalDocPatient.Occupation || "",
    Religion: PatientDetails.Religion || Registeredit.Religion || ReferalDocPatient.Religion || "",
    Nationality: PatientDetails.Nationality || Registeredit.Nationality || ReferalDocPatient.Nationality || "",
    UHIDType: PatientDetails.UHIDType || Registeredit.UniqueIdType || ReferalDocPatient.UHIDType || "",
    UHIDNo: PatientDetails.UHIDNo || Registeredit.UniqueIdNo || ReferalDocPatient.UHIDNo || "",
    PatientType: PatientDetails.PatientType || Registeredit.PatientType || ReferalDocPatient.PatientType || "",
    CardValidity: "",
    // CardValidity: ReferalDocPatient.CardValidity || "",
    Pincode:PatientDetails.Pincode || PatientDetails.PermanentPincode || Registeredit.Pincode || "",
    DoorNo: PatientDetails.DoorNo || PatientDetails.PermanentdoorNo || Registeredit.DoorNo || "",
    Street: PatientDetails.Street || PatientDetails.PermanentStreet || Registeredit.Street || "",
    Area: PatientDetails.Area || PatientDetails.PermanentArea || Registeredit.Area || "",
    City: PatientDetails.City || PatientDetails.PermanentCity || Registeredit.City || "",
    District: PatientDetails.District || PatientDetails.PermanentDistrict || Registeredit.District || "",
    State: PatientDetails.State || PatientDetails.PermanentState || Registeredit.State || "",
    Country: PatientDetails.Country || PatientDetails.PermanentCountry || Registeredit.Country || "",
  });

  const [OPVisitEntry, setOPVisitEntry] = useState({
    VisitType:
      AppointmentRegisType === "OP"
        ? "OP"
        : AppointmentRegisType === "LAB" || AppointmentRegisType === "RADIOLOGY"
          ? "WALK-IN"
          : "",
    // VisitType: Registeredit.VisitPurpose,
    Speciality: PatientDetails.SpecializationId || Registeredit.SpecializationId || ReferalDocPatient.RefDoctorSpecilization || "",
    DoctorName: PatientDetails.DoctorID || Registeredit.DoctorID || ReferalDocPatient.RefDoctorId || "",
    TokenNo: "",
    Complaint: "",
    IsMLC: "No",
    IsReferral: "No",

    ReferralSource: "",
    ReferredBy: "",

    NextToKinName: "",
    Relation: "",
    RelativePhoneNo: "",

    PatientCategory: "General",

    InsuranceName: "",
    InsuranceType: "",

    ClientName: "",
    ClientType: "Self",
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
    EmployeeDesignation: "",

    DoctorId: "",
    DoctorRelation: "",

    DonationType: "",

    // BroughtBy: '',
    // BroughtContactNo: '',
    // ModeOfTransport: '',
    // ConditionOnArrival: '',
    // IsConsciousness: 'Yes',

    // Categoryid: "",
    // Categoryname:"",
    ServiceCategory: "",
    ServiceSubCategory: "",
    // Subcategorypk:"",
    // SubCategoryid: "",
    // SubCategoryname: "",
  });

  const [Todayappointment,setTodayappointment] = useState([]);
 

  console.log(OPVisitEntry, "OPVisitEntry");
  console.log(PatientDetails?.PatientId,'PatientDetails?.PatientId');
  console.log(Registeredit?.PatientId,'Registeredit?.PatientId');
  console.log(ReferalDocPatient?.PatientId,'ReferalDocPatient?.PatientIdd');
  console.log(SearchPatientIdCard,'SearchPatientIdCard');
  
useEffect(() => {
  const isRegistereditEmpty = Object.keys(Registeredit).length === 0;

  const basePostData = isRegistereditEmpty
    ? {
        PatientId: RegisterData.PatientId,
        PhoneNo: RegisterData.PhoneNo,
        FirstName: RegisterData.FirstName,
        UHIDNo: RegisterData.UHIDNo,
        MiddleName: RegisterData.MiddleName,
        SurName: RegisterData.SurName,
        DoctorId: OPVisitEntry.DoctorName,
        patientsearch : patientsearch.Search
      }
    : {
        PatientId: Registeredit.PatientId,
        PhoneNo: Registeredit.PhoneNumber,
        FirstName: Registeredit.FirstName,
        DoctorId: Registeredit.DoctorID || OPVisitEntry.DoctorName,
        Speciality: Registeredit.SpecializationId || OPVisitEntry.Speciality,
        patientsearch : patientsearch.Search
      };

  axios
    .get(`${UrlLink}MCI/Fake_Patients_Management_Filter_OPVisitEntry`, {
      params: basePostData,
    })
    .then((res) => {
      setFilterbyPatientId(res.data);
    })
    .catch((err) => {
      console.error("❌ Error fetching patient filter:", err);
    });

}, [
  UrlLink,
  Registeredit,
  RegisterData.PatientId,
  RegisterData.PhoneNo,
  RegisterData.FirstName,
  RegisterData.UHIDNo,
  RegisterData.MiddleName,
  RegisterData.SurName,
  OPVisitEntry.DoctorName,
  OPVisitEntry.Speciality,
  patientsearch.Search
]);

useEffect(() => {
  const postdata = {
    ExistingPtNo: PatientDetails.ExistingPtNo,
    Year: PatientDetails.YearNo,
  };

  axios
    .get(`${UrlLink}Frontoffice/Existing_Visit_Details`, { params: postdata })
    .then((res) => {
      setExisitingvisitdetails(res.data);
    })
    .catch((err) => {
      console.error("Error fetching last visit date:", err);
    });
}, [PatientDetails?.YearNo, PatientDetails?.ExistingPtNo]);



useEffect(() => {
  const isRegistereditEmpty = Object.keys(Registeredit).length === 0;
  const isCasuality = PatientDetails?.Department === "CASUALITY";

  const visitApiEndpoint = isCasuality
    ? "get_emergency_visit_details"
    : "get_patient_visit_details";

  const visitParams = isRegistereditEmpty
    ? {
        FirstName: RegisterData.FirstName,
        PhoneNo: RegisterData.PhoneNo,
        DateOfReg: DateOfPatientReg || PatientDetails?.DateOfReg,
        LastVisitDate:  PatientDetails?.LastVisitDate,
        OldDepartment : PatientDetails?.OldDepartment,
        DoctorId: OPVisitEntry.DoctorName,
        Speciality: OPVisitEntry.Speciality || Registeredit.SpecializationId,
        PatientId: SearchPatientIdCard,
        YearNo : PatientDetails?.YearNo,
        PateientCategory : OPVisitEntry?.PatientCategory
      }
    : {
        FirstName: Registeredit.FirstName,
        PhoneNo: Registeredit.PhoneNumber,
        DoctorId: Registeredit.DoctorID || OPVisitEntry.DoctorName,
        Speciality: Registeredit.SpecializationId || OPVisitEntry.Speciality,
        PatientId: Registeredit.PatientId,
      };

  axios
    .get(`${UrlLink}Frontoffice/${visitApiEndpoint}`, {
      params: visitParams,
    })
    .then((res) => {
      const visit = res.data?.VisitPurpose;
      console.log("✅ Visit Type:", visit);

      setOPVisitEntry((prev) => ({
        ...prev,
        VisitType: visit,
      }));
    })
    .catch((err) => {
      console.error("❌ Error fetching visit details:", err);
    });


  axios
    .get(`${UrlLink}Frontoffice/get_same_doctor_appointment_for_today`, {
      params: visitParams,
    })
    .then((res) => {
 
      console.log(res.data,'todayappoint')
 
      const visit = res.data;
 
      console.log(visit,'visitttttt')
      setTodayappointment(visit);
 
      if (visit?.length > 0){
 
        console.log(Todayappointment,'Todayappointment')
 
        const tdata = { message: `Today Already met a Doctor in ${visit[0]?.Specialization}  ${visit[0]?.DoctorName}`, type: "warn" };
 
        console.log(tdata,'tdata')
        dispatchvalue({ type: "toast", value: tdata });
 
      }
     
    })
    .catch((err) => {
      console.error("❌ Error fetching visit details:", err);
    });
 

}, [
  UrlLink,
  Registeredit,
  RegisterData.FirstName,
  RegisterData.PhoneNo,
  PatientDetails?.Department,
  PatientDetails?.DateOfReg,
  DateOfPatientReg,
  OPVisitEntry.DoctorName,
  OPVisitEntry.Speciality,
  SearchPatientIdCard,
  OPVisitEntry.PatientCategory
]);



// useEffect(() => {
//   const isRegistereditEmpty = Object.keys(Registeredit).length === 0;

//   console.log(isRegistereditEmpty,'isRegistereditEmpty')
//   const isCasuality = PatientDetails?.Department === "CASUALITY";

//   const basePostData = isRegistereditEmpty
//     ? {
//         PatientId: RegisterData.PatientId,
//         PhoneNo: RegisterData.PhoneNo,
//         FirstName: RegisterData.FirstName,
//         UHIDNo: RegisterData.UHIDNo,
//         MiddleName: RegisterData.MiddleName,
//         SurName: RegisterData.SurName,
//         DoctorId: OPVisitEntry.DoctorName,
//       }
//     : {
//         PatientId: Registeredit.PatientId,
//         PhoneNo: Registeredit.PhoneNumber,
//         FirstName: Registeredit.FirstName,
//         DoctorId: Registeredit.DoctorID || OPVisitEntry.DoctorName,
//         Speciality: Registeredit.SpecializationId || OPVisitEntry.Speciality,
//       };

//   const visitApiEndpoint = isCasuality
//     ? "get_emergency_visit_details"
//     : "get_patient_visit_details";
   
//   console.log(visitApiEndpoint,'visitApiEndpoint');
    
//   const visitParams = isRegistereditEmpty
//     ? {
//         FirstName: RegisterData.FirstName,
//         PhoneNo: RegisterData.PhoneNo,
//         LastVisitDate:DateOfPatientReg || PatientDetails?.DateOfReg,
//         // DateOfReg:DateOfPatientReg,
//         DoctorId: OPVisitEntry.DoctorName,
//         Speciality:OPVisitEntry.Speciality || Registeredit.SpecializationId,
//         PatientId:SearchPatientIdCard
//       }
//     : {
//         FirstName: Registeredit.FirstName,
//         PhoneNo: Registeredit.PhoneNumber,
//         // DateOfReg:DateOfPatientReg,
//         DoctorId: Registeredit.DoctorID || OPVisitEntry.DoctorName,
//         Speciality: Registeredit.SpecializationId || OPVisitEntry.Speciality,
//         PatientId: Registeredit.PatientId,
//       };
//     console.log(visitParams,'visitParams');
      
//   axios
//     .get(`${UrlLink}Frontoffice/Patients_Management_Filter`, {
//       params: basePostData,
//     })
//     .then((res) => {
//       const data = res.data;
//       setFilterbyPatientId(data);

//       axios
//         .get(`${UrlLink}Frontoffice/${visitApiEndpoint}`, {
//           params: visitParams,
//         })
//         .then((res) => {
//           const visit = res.data?.VisitPurpose;
//           console.log("✅ Visit Type:", visit);

//           setOPVisitEntry((prev) => ({
//             ...prev,
//             VisitType: visit,
//           }));
//         })
//         .catch((err) => {
//           console.error("❌ Error fetching visit details:", err);
//         });
//     })
//     .catch((err) => {
//       console.error("❌ Error fetching patient filter:", err);
//     });
// }, [
//   UrlLink,
//   Registeredit,
//   RegisterData.PatientId,
//   RegisterData.PhoneNo,
//   RegisterData.FirstName,
//   RegisterData.UHIDNo,
//   RegisterData.MiddleName,
//   RegisterData.SurName,
//   OPVisitEntry.DoctorName,
//   OPVisitEntry.Speciality,
//   // PatientDetails.DateOfReg,
//   PatientDetails.LastVisitDate,
//   PatientDetails?.Department, // 🆕 Make sure Department change triggers the effect
// ]);

useEffect(() => {
  // Determine which PatientId to use
  const patientId =
    PatientDetails?.PatientId ||
    Registeredit?.PatientId ||
    ReferalDocPatient?.PatientId ||
    SearchPatientIdCard;

  console.log(patientId,'patientId---1');
  

  if (patientId) {
    console.log("Fetching patient smart card details...");

    axios
      .get(`${UrlLink}Frontoffice/Get_Patient_SmartCard_Details_link`,{
      params: { PatientId: patientId }
    })
      .then((res) => {
        const data = res.data;

        console.log(data, "Smart card response");

        if (data && "ToValidityDate" in data) {
          setRegisterData((prev) => ({
            ...prev,
            CardValidity: data.ToValidityDate || "",
          }));
        }
      })
      .catch((err) => {
        console.error("Error fetching patient data:", err);
      });
  }
}, [PatientDetails, Registeredit, ReferalDocPatient,SearchPatientIdCard, UrlLink]);


  const [type, setType] = useState("Addtest");
  console.log(UrlLink);
  const [Department, setDepartment] = useState([]);
  const [MainDepartment, setMainDepartment] = useState([]);
  const [TestNameList, setTestNameList] = useState([]);
  const [SelectedTest, setSelectedTest] = useState([]);
  const [DeletedTest,setDeletedTest] = useState([]);
  console.log(SelectedTest,'SelectedTestSelectedTest');
    console.log(DeletedTest,'SelectedTestSelectedTest1');

  const [testType, setTestType] = useState("Individual");
  const [ProfileData, setProfileData] = useState([]);
  const [SelectedGroupTestList, setSelectedGroupTestList] = useState([]);
  const [isViewTests, setisViewTests] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [formData, setFormData] = useState({
    SubDepartment_Code: "",
    SubDepartment_Name: "",
    Name: "",
    Test_Code: "",
    testType: testType,
    Remarks: "",
    Group_Code: "",
    Group_Name: "",
    GroupList: null,
    Department_Name: "",
    Department_Code: "",
    created_by: UserData?.username,
    location: UserData?.location,
  });
  console.log(formData,'formDataaaaaaaaa');

  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setsearchQuery] = useState("");



 

  useEffect(() => {
    // console.log(ageData)
    if (Array.isArray(TestNameList)) {
      const lowerCaseNameQuery = searchQuery.toLowerCase();
      const filteredData = TestNameList.filter((row) => {
        const lowerCasePatientName = row?.Test_Name
          ? row.Test_Name.toLowerCase()
          : "";
        return lowerCasePatientName.includes(lowerCaseNameQuery);
      });
      setFilteredRows(filteredData);
    } else {
      setFilteredRows([]);
    }
  }, [searchQuery, TestNameList]);

  const handlePageChange = (event, newType) => {
    if (newType !== null && newType !== type) {
      setType(newType);
    }
  };

const handleInputChange = (e) => {
    const { name, value } = e.target;
 
    const value1 = e.target.value.split("|").map((val) => val.trim());
    const value2 = value1[0];
    const Type = value1[1];
    const val3 = value1[2];
 
    console.log(value1, value2, Type,val3);
 
    let SubDepartment_Code;
    let Test_Code;
    let Group_Code;
    let GroupList;
    let Department_Code;
    let Package_Code;
 
    // if (name === "SubDepartment_Name") {
    //   const selectedDepartment = Department?.find(
    //     (item) => item.SubDepartment_Name === value
    //   );
    //   SubDepartment_Code = selectedDepartment?.SubDepartment_Code;
    // }
 
    if (Type === "Individual") {
      console.log("premmmmmIndividual");

      setTestType(Type);

 
      const selectedTest = TestNameList?.find((item) => item.Code === val3);
      Test_Code = selectedTest?.Code;

      console.log(selectedTest,'premmmmmIndividual')
      console.log(Test_Code,'premmmmmIndividual')
 
      console.log(Test_Code, "Test_Code");
    }
     else if (Type === "Group") {
      console.log("premmmmmGroup");
      setTestType(Type);
 
      const selectedTest = TestNameList?.find((item) => item.Code === val3);
      console.log(selectedTest, "selectedTest");
      Group_Code = selectedTest?.Code;
 
      console.log(Group_Code, "Test_Code");
    } 
    else if (Type === "Offers") {
      console.log("Gokul...");
      setTestType(Type);
 
      const selectedTest = TestNameList?.find((item) => item.Code === val3);
      Package_Code = selectedTest?.Code;
 
      console.log(Package_Code, "Test_Code");
    }
 
    // if (name === "Group_Name") {
    //   const selectedProfile = ProfileData?.find(
    //     (item) => item.Group_Name === value
    //   );
    //   Group_Code = selectedProfile?.Group_Code;
    //   GroupList = selectedProfile?.GroupList;
    // }
    // if (name === "Department_Name") {
    //   const selectedDepartment = MainDepartment?.find(
    //     (item) => item.Department_Name === value
    //   );
    //   console.log(selectedDepartment);
    //   Department_Code = selectedDepartment?.Department_Code;
    // }
 
    setFormData((prevData) => ({
      ...prevData,
      [name]: value2,
      SubDepartment_Code: SubDepartment_Code || prevData.SubDepartment_Code,
      Test_Code: Test_Code || prevData.Test_Code,
      Group_Code: Group_Code || prevData.Group_Code,
      GroupList: GroupList,
      Department_Code: Department_Code || prevData.Department_Code,
      Package_Code: Package_Code || prevData.Package_Code,
    }));
  };
 

  const handleAddTest = () => {
    console.log(formData,'PlaylistAddIcon');
    console.log(SelectedTest,'PlaylistAddIcon');
 
    if (!formData.Name) {
 
      console.log("testtttttttt");
      const tdata = {
        message: "Test Name are required",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }
 
    if (formData) {
      const isTestCodeExists = SelectedTest.some(
        (test) => test.Code === formData?.Test_Code
      );
 
      const isgroupCodeExists = SelectedTest.some(
        (test) => test.Code === formData?.Group_Code
      );
 
      const ispkgCodeExists = SelectedTest.some(
        (test) => test.Code === formData?.Package_Code
      );
 
      console.log(isTestCodeExists,'isTestCodeExists')
 
      if (isTestCodeExists) {
        const mess =
          " This Test already exists in Selected Test : " +
          SelectedTest.find((test) => test.Code === formData?.Test_Code).Name;
 
        const tdata = {
          message: mess,
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
        setFormData((prev) => ({
          ...prev,
          Name: "",
          Test_Code: "",
        }));
      }
 
      else if(isgroupCodeExists){
 
        const mess =
          " This Test already exists in Selected Test : " +
          SelectedTest.find((test) => test.Code === formData?.Group_Code).Name;
 
        const tdata = {
          message: mess,
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
        setFormData((prev) => ({
          ...prev,
          Name: "",
          Group_Code: "",
        }));
 
      }
 
      else if(ispkgCodeExists){
 
        const mess =
          " This Test already exists in Selected Test : " +
          SelectedTest.find((test) => test.Code === formData?.Package_Code).Name;
 
        const tdata = {
          message: mess,
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
        setFormData((prev) => ({
          ...prev,
          Name: "",
          Package_Code: "",
        }));
 
      }
 
 
      else {
        const newvalues = {
          id: SelectedTest.length + 1,
          SubDepartment_Code: formData.SubDepartment_Code,
          SubDepartment_Name: formData?.SubDepartment_Name,
          Name: testType === "Individual" ? formData?.Name : formData?.Name,
          Code:
            testType === "Individual"
              ? formData?.Test_Code
              : testType === "Group"
                ? formData?.Group_Code
                : formData?.Package_Code,
          testType: testType,
          GroupList: formData?.GroupList,
          Department_Name: formData?.Department_Name,
          Department_Code: formData?.Department_Code,
        };
        console.log(newvalues,'newvaluessssssssss');
        setSelectedTest((prev) => [...prev, newvalues]);
        // const tdata = {
        //   message: "Added Successfully",
        //   type: "success",
        // };
        // dispatchvalue({ type: "toast", value: tdata });
        setFormData((prev) => ({
          ...prev,
          Name: "",
          Test_Code: "",
          Remarks: "",
          Group_Code: "",
          Group_Name: "",
          GroupList: null,
          Package_Code: "",
          
        }));
      }
    } else {
      const tdata = {
        message: "Select Test",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };
 

  const handleDelete = (index) => {
    console.log(index, "index");

    const deltests = SelectedTest.filter(
            (test) => test.Code == index.Code

    )
    const updatedTests = SelectedTest.filter(
      (test) => test.Code !== index.Code
    );
    setSelectedTest(updatedTests);
    setDeletedTest(deltests);
  };

  const handleSearchlabChange = (e) => {
    const query = e.target.value.toLowerCase();
    setsearchQuery(query);

    if (!query) {
      setFilteredTestList(TestNameList); // Reset to full list if empty
      return;
    }

    const filteredList = TestNameList.filter((test) =>
      test.Name.toLowerCase().includes(query)
    );

    setFilteredTestList(filteredList);
  };

  const handleView = (row) => {
    console.log(row);
    setSelectedGroupTestList(row?.GroupList);
    setisViewTests(true);
  };

  const Testlistcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
      frozen: true,
    },

    // {
    //   key: "testType",
    //   name: "Test Type",
    //   frozen: true,
    // },
    {
      key: "Name",
      name: "Name",
      frozen: true,
    },
    // {
    //   key: "View",
    //   name: "View",
    //   renderCell: (params) =>
    //     params.row.testType !== "Individual" ? (
    //       <Button onClick={() => handleView(params.row)}>
    //         <VisibilityIcon />
    //       </Button>
    //     ) : (
    //       "-"
    //     ),
    // },

    {
      key: "EditAction",
      name: "Action",
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.row)}>
          <DeleteIcon />
        </Button>
      ),
    },
  ];

  useEffect(() => {

      if (AppointmentRegisType !== 'LAB') return; // ✅ Only run if RADIOLOGY

    axios
      .get(
        `${UrlLink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=LabSubDepartment`
      )
      .then((response) => {
        const data = response.data;

        setDepartment(data);
      })
      .catch((error) => {
        console.error("Error fetching SubDepartment data:", error);
      });

    axios
      .get(`${UrlLink}Frontoffice/Walk_in_patient_labtestname_details`)
      .then((response) => {
        setTestNameList(response.data);
        setFilteredTestList(response.data);
      })
      .catch((error) => {
        //.error(error);
      });

    axios
      .get(
        `${UrlLink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=GroupMaster`
      )
      .then((response) => {
        console.log(response.data);

        setProfileData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching test description data:", error);
      });

    axios
      .get(
        `${UrlLink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=LabDepartment`
      )
      .then((response) => {
        console.log(response.data);
        const data = response.data.map((row, index) => ({
          id: index + 1,
          ...row,
        }));

        setMainDepartment(data);
      })
      .catch((error) => {
        console.error("Error fetching test description data:", error);
      });
  }, [UrlLink,AppointmentRegisType, formData?.SubDepartment_Code]);

  const isRegisterDataEmpty = Object.values(RegisterData).every(
    (value) => value === "" || value === null
  );

  console.log(OPVisitEntry.VisitType, "newdata");
  console.log("PatientDetails", Object.keys(PatientDetails).length);
  console.log("PatientDetails", RegisterData);

  console.log("PatientDetails", !RegisterData);

  const clearRegisterdata = () => {
    setRegisterData((prev) => ({
      ...prev,

      // PatientId: '',
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
      ABHA: "",
      // Photo : null,
    }));
    setOPVisitEntry((prev) => ({
      ...prev,
      VisitType: "",
      Speciality: "",
      DoctorName: "",
      TokenNo: "",
      Complaint: "",
      IsMLC: "",
      IsReferral: "",

      ReferralSource: "",
      ReferredBy: "",

      NextToKinName: "",
      Relation: "",
      RelativePhoneNo: "",

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

      // BroughtBy: '',
      // BroughtContactNo: '',
      // ModeOfTransport: '',
      // ConditionOnArrival: '',
      // IsConsciousness: 'Yes',

      ServiceCategory: "",
      ServiceSubCategory: "",
    }));
    setErrors({});

    setpatientsearch({
      Search: "",
    });

    setAppointmentRegisType("");
  };

  console.log("RegisterData", RegisterData);

  const [ServiceCategoryData, setServiceCategoryData] = useState([]);
  const [ServiceSubCategoryData, setServiceSubCategoryData] = useState([]);

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
    axios
      .get(`${UrlLink}Masters/Speciality_Detials_link`)
      .then((res) => setSpecializationData(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  // useEffect(() => {
  //   axios
  //     .get(`${UrlLink}Masters/Insert_service_category_master`)
  //     .then((res) => {
  //       const ress = res.data;
  //       console.log(ress, "ddhdhdhdhdhdhdhdhdhdhdhdhdhdh");

  //       setcategory(ress);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [UrlLink]);

  // useEffect(() => {
  //   axios
  //     .get(
  //       `${UrlLink}Masters/Services_List_by_servicecategory?servicecategory=${OPVisitEntry.Categoryid}`
  //     )
  //     .then((res) => {
  //       const ress = res.data;
  //       console.log(ress, "ddhdhdhdhdhdhdhdhdhdhdhdhdhdh");

  //       setsubcategory(ress);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [UrlLink, OPVisitEntry.Categoryid]);

  useEffect(() => {
    if (patientsearch.Search !== "") {
      axios
        .get(
          `${UrlLink}/Frontoffice/get_credit_due_amount_for_patient?PatientId=${patientsearch.Search}`
        )
        .then((res) => {
          const ress = res.data;
          console.log("Dueeeee", ress);
          setBillDue(ress);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [UrlLink, patientsearch, BillDueChanges]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          // specializationResponse,
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
          // axios.get(`${UrlLink}Masters/Speciality_Detials_link`),
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

        // setSpecializationData(
        //   Array.isArray(specializationResponse.data)
        //     ? specializationResponse.data
        //     : []
        // )
        setReferralDoctorData(
          Array.isArray(referralDoctorResponse.data)
            ? referralDoctorResponse.data
            : []
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
    const fetchData = async () => {
      const postdata = {
        LocationId: UserData?.location,
        Date: formatDate(new Date()),
        Speciality:
          OPVisitEntry.Speciality || Registeredit.SpecilizationId || ReferalDocPatient.RefDoctorSpecilization || "",
        Department:
          PatientDetails.Department || Registeredit.Department  || AppointmentRegisType || ReferalDocPatient.Type,
      };
      console.log("Doctrrrrr", postdata);

      try {
        const response = await axios.get(
          `${UrlLink}Frontoffice/get_available_doctor_by_speciality_For_Registration`,
          { params: postdata }
        );

        setDoctorData(response.data);
        console.log("Doctrrrrr", response.data);
      } catch (error) {
        setDoctorData([]);
        console.error("Error fetching referral doctors:", error);
      }
    };

    console.log(
      "jjjjjjj------",
      OPVisitEntry.Speciality,
      PatientDetails.Department
    );

    const shouldFetch =
      OPVisitEntry.Speciality ||
      Registeredit.SpecilizationId ||
      Registeredit.Department ||
      PatientDetails.Department;

    if (shouldFetch) {
      fetchData();
    }
  }, [
    UrlLink,
    UserData.location,
    OPVisitEntry.Speciality,
    PatientDetails.Department,
    Registeredit.SpecilizationId,
    Registeredit.Department,
    ReferalDocPatient.RefDoctorSpecilization,
    ReferalDocPatient.Type,
    AppointmentRegisType
  ]);

  const handleSave = () => {
    // setSavedTests(selectedTests); // Store selected tests in savedTests state
    setOpenModal2(false); // Close modal after saving
  };

  console.log(PatientDetails?.DateOfReg,'PatientDetailsDateOfReg');
  console.log(PatientDetails?.LastVisitDate,'LastVisitDate');

  console.log('snfsdnf');
  
  

  // ------------- for op and Casuality --------------------


  useEffect(()=>{

    if (AppointmentRegisType !== 'OP') return; 


    const PatientId = patientsearch?.Search

    if (PatientId) {
      axios.get(`${UrlLink}Frontoffice/Get_Patient_Previous_Visited_Doctor`,{
        params:{PatientId}
      })
      .then((res) => {
        const data = res.data;
        setPreVisitedDoctors(data)

      })
      .catch((err)=>{
        console.log(err);
        
      })
    }

  },[UrlLink,patientsearch?.Search])

  const DoctorsListColumn = [
    {
      key: "id",
      name: "S.No",
    },
    {
      key: "Date",
      name: "Date",
    },
    // {
    //   key: "Time",
    //   name: "Time",
    // },
    {
      key: "RegistrationId",
      name: "RegistrationId",
    },
    {
      key: "Specialization",
      name: "Specialization",
    },
    {
      key: "DoctorName",
      name: "DoctorName",
      width: 150,
    },
    {
      key:"RenewDate",
      name:"RenewDate"
    },
    {
      key:"validity_date",
      name:"validity_date"
    },
    {
      key: "VisitType",
      name: "VisitType",     
    },
    {
      key: "Fees",
      name: "Fees",     
    },
    {
      key: "PatientCategory",
      name: "PatientCategory",    
    },
 
  ];

  const visitListColumn = [
    
    {
      key: "ReVisitDate",
      name: "ReVisitDate",
    },
    {
      key: "DeptName",
      name: "DeptName",
    }
      
    
  ];

  console.log("1111---------", Registeredit?.RegistrationId);

  useEffect(() => {
    if (Registeredit && Registeredit?.RegistrationId) {
      console.log("oooooooo----------");

      axios
        .get(
          `${UrlLink}MCI/get_MCI_OP_patient_details?RegistrationId=${Registeredit.RegistrationId}`
        )
        .then((res) => {
          const data = res.data; // Assume the response data contains the patient details

          console.log(data, "iiiii---------");

          if (data) {
            console.log("ttttttttttt----");

            setRegisterData((prev) => ({
              ...prev, // Spread previous state

              // PatientId: data.PatientId || '', // Update PatientId
              PhoneNo: data.PhoneNo || "", // Update PhoneNo
              Title: data.Title || "",
              FirstName: data.FirstName || "",
              MiddleName: data.MiddleName || "",
              SurName: data.SurName || "",
              Gender: data.Gender || "",
              MaritalStatus: data.MaritalStatus || "",
              SpouseName: data.SpouseName || "",
              FatherName: data.FatherName || "",
              // AliasName: data.AliasName || '',
              DOB: data.DOB || "",
              Age: data.Age || "",
              Email: data.Email || "",
              BloodGroup: data.BloodGroup || "",
              Occupation: data.Occupation || "",
              Religion: data.Religion || "",
              Nationality: data.Nationality || "",
              UHIDType: data.UHIDType || "",
              UHIDNo: data.UHIDNo || "",
              DoorNo: data.DoorNo || "",
              PatientType: data.PatientType || "",
              Street: data.Street || "",
              Area: data.Area || "",
              City: data.City || "",
              District: data.District || "",
              State: data.State || "",
              Country: data.Country || "",
              Pincode: data.Pincode || "",
              ABHA: data.ABHA || "",
              // CardValidity: data.CardValidity || "",
              // PatientType: data.PatientType || '',
              // Flagging: data.Flagging || '',

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

            console.log("uuuuuuuuuu");

            setOPVisitEntry((prev) => ({
              ...prev,
              // VisitType: data.VisitType || '',
              // Speciality: data.Speciality || '',
              // DoctorName: data.PrimaryDoctor || '',
              // TokenNo: data.TokenNo || '',
              // Complaint: data.Complaint || '',
              IsMLC: data.IsMLC || "",
              IsReferral: data.IsReferral || "",
              ReferralSource: data.ReferralSource || "",
              ReferredBy: data.ReferredBy || "",
              NextToKinName: data.NextToKinName || "",

              Relation: data.Relation || "",
              RelativePhoneNo: data.RelativePhNo || "",
              PatientCategory: data.PatientCategory || "",
              InsuranceName: data.InsuranceName || "",
              InsuranceType: data.InsuranceType || "",
              ClientName: data.ClientName || "",
              ClientType: data.ClientType || "",
              ClientEmployeeId: data.ClientEmployeeId || "",
              ClientEmployeeDesignation: data.ClientEmployeeDesignation || "",
              ClientEmployeeRelation: data.ClientEmployeeRelation || "",

              CorporateName: data.CorporateName || "",
              CorporateType: data.CorporateType || "",
              CorporateEmployeeId: data.CorporateEmployeeId || "",
              CorporateEmployeeDesignation:
                data.CorporateEmployeeDesignation || "",
              CorporateEmployeeRelation: data.CorporateEmployeeRelation || "",

              EmployeeId: data.EmployeeId || "",
              EmployeeRelation: data.EmployeeRelation || "",

              DoctorId: data.Doctor_Id || "",
              DoctorRelation: data.DoctorRelation || "",

              DonationType: data.DonationType || "",
              ServiceCategory: data.ServiceCategory || "",
              ServiceSubCategory: data.ServiceSubCategory || "",
            }));
            console.log("qqqqqqqqq----");

            console.log(data?.Multiple_Doc, "bbbbbbbbbbbbbb--------");

            const MultipleDoc =
              data?.Multiple_Doc?.map((doc) => ({
                id:doc.id,
                Speciality: doc.SpecializationId || "",
                SpecialityName: doc.Specialization || "",
                // Speciality: doc.Specialization || "",
                DoctorId: doc.DoctorId || "",
                DoctorName: doc.DoctorName || "",
                TokenNo: String(doc.TokenNo ?? ""), // Ensure TokenNo is a string
                Complaint: doc.Complaint || "",
                VisitType: doc.VisitType || "",
              })) || [];

            setmulappoint(MultipleDoc); // ✅ Update state with processed data
          }
        })
        .catch((err) => {
          console.error("Error fetching patient data:", err);
        });
    }
  }, [Registeredit, UrlLink]);




  const HandleSearchchange = (e) => {
    const { name, value } = e.target;
    setpatientsearch((prev) => ({
      ...prev,
      [name]: value,
    }));
 
    if (name === "Search" && value.trim() === "") {
      // Clear patient details if search input is cleared
      setRegisterData({
        ABHA: "",
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
        PhoneNo: "",
        Email: "",
        BloodGroup: "",
        Occupation: "",
        Religion: "",
        Nationality: "",
        UHIDType: "",
        UHIDNo: "",
        PatientType: "",
        CardValidity: "",
        Pincode: "",
        DoorNo: "",
        Street: "",
        Area: "",
        City: "",
        District: "",
        State: "",
        Country: "",
      });
      setBillDue({});
      setBillDueChanges(false);
    } else {
      setBillDueChanges(false);
    }
 
    // setBillDueChanges(false);
  };

  
  const HandlesearchPatient = (value) => {
    console.log("HandlesearchPatient", value);

    const exist = FilterbyPatientId.find((f) => f.PatientId === value);

    console.log(exist, "exist");
    if (!exist) {
      const tdata = {
        message: "Please enter a valid Patient Id",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {
      axios
        .get(
          `${UrlLink}Frontoffice/get_Patient_Details_by_patientId?PatientId=${value}`
        )
        .then((res) => {
          const resss = res.data;

          setSearchPatientIdCard(resss.PatientId)

          console.log("paaatttttttttt", res.data);

          if (resss.warn) {
            const tdata = {
              message: resss.warn,
              type: "warn",
            };
            dispatchvalue({ type: "toast", value: tdata });
            return;
          }

          console.log("Patient details:", resss);

          setRegisterData((prev) => ({
            ...prev,
            // PatientId: resss.PatientId,
            ABHA: resss.ABHA,
            Title: resss.Title,
            FirstName: resss.FirstName,
            MiddleName: resss.MiddleName,
            SurName: resss.SurName,
            Gender: resss.Gender,
            MaritalStatus: resss.MaritalStatus,
            SpouseName: resss.SpouseName,
            FatherName: resss.FatherName,
            DOB: resss.DOB,
            Age: resss.Age,
            PhoneNo: resss.PhoneNo,
            Email: resss.Email,
            BloodGroup: resss.BloodGroup,
            Occupation: resss.Occupation,
            Religion: resss.Religion,
            Nationality: resss.Nationality,
            UHIDType: resss.UHIDType,
            UHIDNo: resss.UHIDNo,
            PatientType: resss.PatientType,
            Pincode: resss.Pincode,
            DoorNo: resss.DoorNo,
            Street: resss.Street,
            Area: resss.Area,
            City: resss.City,
            District: resss.District,
            State: resss.State,
            Country: resss.Country,
          }));
          setBillDueChanges(true);
        })
        .catch((err) => console.log(err));
    }
  };



  const personalDetailsRef = useRef(null);
  const addressRef = useRef(null);
  const opvisitref = useRef(null);
  const referalref = useRef(null);
  const categoryref = useRef(null);
  const kinref = useRef(null);
  const serviceref = useRef(null);

  const handleResize = (ref) => {
    if (ref.current) {
      const { clientWidth } = ref.current;
      const updatedclientWidth = clientWidth - 20;

      const items = ref.current.querySelectorAll(".RegisForm_1");
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
      let gapBetweenItems = Math.floor(remainingGap / currentRowItemsCount);

      // Ensure gap doesn't fluctuate too much
      gapBetweenItems = Math.max(gapBetweenItems, 5);

      const container = ref.current;

      if (updatedclientWidth > 800) {
        container.style.justifyContent = "flex-start";
        container.style.columnGap = `${gapBetweenItems}px`;
      } else {
        container.style.justifyContent = "center";
        container.style.columnGap = `10px`;
      }
    }
  };

  useLayoutEffect(() => {
    const resizeHandler = debounce(() => {
      handleResize(personalDetailsRef);
      handleResize(addressRef);
      handleResize(opvisitref);
      handleResize(referalref);
      handleResize(categoryref);
      handleResize(kinref);
      handleResize(serviceref);
    }, 200);

    const personalResizeObserver = new ResizeObserver(() =>
      handleResize(personalDetailsRef)
    );
    const addressResizeObserver = new ResizeObserver(() =>
      handleResize(addressRef)
    );
    const opvisitResizeObserver = new ResizeObserver(() =>
      handleResize(opvisitref)
    );
    const referalResizeObserver = new ResizeObserver(() =>
      handleResize(referalref)
    );
    const categoryResizeObserver = new ResizeObserver(() =>
      handleResize(categoryref)
    );
    const kinResizeObserver = new ResizeObserver(() => handleResize(kinref));
    const serviceResizeObserver = new ResizeObserver(() =>
      handleResize(serviceref)
    );

    if (personalDetailsRef.current) {
      personalResizeObserver.observe(personalDetailsRef.current);
    }

    if (addressRef.current) {
      addressResizeObserver.observe(addressRef.current);
    }
    if (opvisitref.current) {
      opvisitResizeObserver.observe(opvisitref.current);
    }
    if (referalref.current) {
      referalResizeObserver.observe(referalref.current);
    }
    if (categoryref.current) {
      categoryResizeObserver.observe(categoryref.current);
    }
    if (kinref.current) {
      kinResizeObserver.observe(kinref.current);
    }
    if (serviceref.current) {
      serviceResizeObserver.observe(serviceref.current);
    }

    window.addEventListener("resize", resizeHandler);

    return () => {
      if (personalDetailsRef.current) {
        personalResizeObserver.unobserve(personalDetailsRef.current);
      }
      if (addressRef.current) {
        addressResizeObserver.unobserve(addressRef.current);
      }
      if (opvisitref.current) {
        opvisitResizeObserver.unobserve(opvisitref.current);
      }
      if (referalref.current) {
        referalResizeObserver.observe(referalref.current);
      }
      if (categoryref.current) {
        categoryResizeObserver.unobserve(categoryref.current);
      }
      if (kinref.current) {
        kinResizeObserver.unobserve(kinref.current);
      }
      if (serviceref.current) {
        serviceResizeObserver.unobserve(serviceref.current);
      }

      window.removeEventListener("resize", resizeHandler);
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
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        document.body.style.pointerEvents = "auto";
        window.removeEventListener("scroll", handleStopEvent);
        window.removeEventListener("click", handleStopEvent);
      }, 500); // Allow time for scroll
    }
  };

  console.log(mulappoint, "mulappoint");


  // const handlemultipledoctor = () => {
  //   const specalityname = SpecializationData.find(
  //     (e) => String(e.Speciality_Id) === String(OPVisitEntry.Speciality)
  //   );
  
  //   const doctorname = DoctorData.find(
  //     (e) => e.doctor_id === OPVisitEntry.DoctorName
  //   );
  
  //   const doctorId = doctorname?.doctor_id;
  //   const doctorDisplayName = doctorname?.doctor_name?.trim() || "This doctor";
  
  //   const newdata = {
  //     VisitType: OPVisitEntry.VisitType,
  //     Speciality: specalityname?.Speciality_Id,
  //     SpecialityName: specalityname?.SpecialityName,
  //     DoctorId: doctorId,
  //     DoctorName: doctorname?.doctor_name?.trim(),
  //     TokenNo: String(OPVisitEntry.TokenNo),
  //     Complaint: OPVisitEntry.Complaint,
  //   };
  
  //   const isDuplicate = mulappoint.some((entry, index) => {
  //     return editingIndex !== null
  //       ? index !== editingIndex && entry.DoctorId === doctorId
  //       : entry.DoctorId === doctorId;
  //   });
  
  //   if (isDuplicate) {
  //     alert(`${doctorDisplayName} is already selected!`);
  //     return;
  //   }
  
  //   if (editingIndex !== null) {
  //     newdata.id = DocEdit;
  
  //     setmulappoint((prevEntries) => {
  //       const updated = [...prevEntries];
  //       updated[editingIndex] = newdata;
  //       return updated;
  //     });
  
  //     setEditingIndex(null);
  //     setDocEdit(null);
  //   } else {
  //     setmulappoint((prevEntries) => [...prevEntries, newdata]);
  //   }
  
  //   // Clear form after add/edit
  //   setOPVisitEntry((prev) => ({
  //     ...prev,
  //     VisitType: "",
  //     Speciality: "",
  //     DoctorName: "",
  //     TokenNo: "",
  //     Complaint: "",
  //   }));
  // };
  
  const handlemultipledoctor = () => {
  // Validate required fields
  if (
    !OPVisitEntry.VisitType ||
    !OPVisitEntry.Speciality ||
    !OPVisitEntry.DoctorName
  ) {
    alert("Please select Visit Type, Speciality, and Doctor before proceeding.");
    return;
  }

  const specalityname = SpecializationData.find(
    (e) => String(e.Speciality_Id) === String(OPVisitEntry.Speciality)
  );

  const doctorname = DoctorData.find(
    (e) => e.doctor_id === OPVisitEntry.DoctorName
  );

  const doctorId = doctorname?.doctor_id;
  const doctorDisplayName = doctorname?.doctor_name?.trim() || "This doctor";

  const newdata = {
    VisitType: OPVisitEntry.VisitType,
    Speciality: specalityname?.Speciality_Id,
    SpecialityName: specalityname?.SpecialityName,
    DoctorId: doctorId,
    DoctorName: doctorname?.doctor_name?.trim(),
    TokenNo: String(OPVisitEntry.TokenNo),
    Complaint: OPVisitEntry.Complaint,
  };

  const isDuplicate = mulappoint.some((entry, index) => {
    return editingIndex !== null
      ? index !== editingIndex && entry.DoctorId === doctorId
      : entry.DoctorId === doctorId;
  });

  if (isDuplicate) {
    alert(`${doctorDisplayName} is already selected!`);
    return;
  }

  if (editingIndex !== null) {
    newdata.id = DocEdit;

    setmulappoint((prevEntries) => {
      const updated = [...prevEntries];
      updated[editingIndex] = newdata;
      return updated;
    });

    setEditingIndex(null);
    setDocEdit(null);
  } else {
    setmulappoint((prevEntries) => [...prevEntries, newdata]);
  }

  // Clear form after add/edit
  setOPVisitEntry((prev) => ({
    ...prev,
    VisitType: "",
    Speciality: "",
    DoctorName: "",
    TokenNo: "",
    Complaint: "",
  }));
};



  const handleCancelEdit = () => {
    setEditingIndex(null);
    setOPVisitEntry({
      VisitType: "",
      Speciality: "",
      DoctorName: "",
      TokenNo: "",
      Complaint: "",
    });
  };
  

  const handleEditDoc = (entry, index) => {
    console.log("Edit clicked:", entry);
    console.log("Edit :",index);
    setEditEventId(entry.DoctorId);
    setDocEdit(entry.id);

    setOPVisitEntry((prev) =>({
      ...prev,
     
      VisitType: entry.VisitType || "",
      Speciality: entry.Speciality || "",
      DoctorName: entry.DoctorId || "", // Make sure it's ID for dropdown
      TokenNo: entry.TokenNo || "",
      Complaint: entry.Complaint || "",
    }));
  
    setEditingIndex(index);
  };


  const handleDeleteDoc = (entry, index) => {
    // Confirmation and delete logic here
    console.log("Delete clicked:", entry);
    console.log("Delete index:", index);

    setDeleteEventId(entry.DoctorId);
    setdeleteDocName(entry.DoctorName);
    setShowDeleteConfirmation(true);
  };


  const handleDeleteEvent = () => {
    const Doc_id = deleteEventId;
    const RegistrationId = Registeredit.RegistrationId


    if (!RegistrationId) {
      // ❌ Patient not registered — only delete from array
      setmulappoint((prev) => prev.filter((doc) => doc.DoctorId !== Doc_id));
      setShowDeleteConfirmation(false);
      setdeleteDocName(null);
 
      const tdata = { message: "Doctor removed from list (not yet saved)", type: "info" };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    axios
        .post(`${UrlLink}Frontoffice/Delete_Doctor_In_OP_Register/`,{
        
            RegistrationId,
            Doc_id
          
        })  
        .then((response) => {
            console.log(response.data.message, 'Doctor deleted successfully');

            setmulappoint((prev) =>
              prev.filter((doc) => doc.DoctorId !== Doc_id)
            );
            // setEvents(events.filter((event) => event.id !== deleteEventId));
            setShowDeleteConfirmation(false);
            setdeleteDocName(null);

            const tdata = { message: "Doctor deleted successfully", type: "success" };
            dispatchvalue({ type: "toast", value: tdata });
            setDeleteAppointmentData((prev) => !prev);
           
          })
        .catch((error) => {
            console.error("Error deleting Doctor:", error);

            const tdata = { message: "Failed to delete appointment", type: "error" };
            dispatchvalue({ type: "toast", value: tdata });
        });
};

  
  
  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteEventId(null);
    
    
  };

  const [selectedSpecialityName,setselectedSpecialityName] = useState("")

  const HandleOnchange = async (e) => {
    const { name, value, pattern } = e.target;

    if (name === "Speciality") {
      setOPVisitEntry((prev) => ({
        ...prev,
        [name]: value,
        DoctorName: "",
        TokenNo: "",
      }));

    const selectedSpecialityName = SpecializationData.find(p => p.Speciality_Id === Number(value))?.SpecialityName;
    setselectedSpecialityName(selectedSpecialityName);
    } else if (name === "ServiceCategory") {
      if (value.includes("-")) {
        const value1 = value.split("-");
        const value2 = value1[0];
        const value3 = value1[1];
        console.log("serrrrrr", value1, value2, value3);
        setOPVisitEntry((prev) => ({
          ...prev,
          [name]: value3,
        }));

        if (value2) {
          axios
            .get(
              `${UrlLink}Masters/services_Subcategory_details_by_category?ServiceCategory=${value2}`
            )
            .then((res) => {
              const ress = res.data;
              console.log(ress, "ddhdhdhdhdhdhdhdhdhdhdhdhdhdh");

              setServiceSubCategoryData(ress);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    } else if (name === "ServiceSubCategory") {
      if (value.includes("-")) {
        const value1 = value.split("-");
        const value2 = value1[0];
        const value3 = value1[1];
        const value4 = value1[2];
        setOPVisitEntry((prev) => ({
          ...prev,
          [name]: value4,
        }));
      }
    } else if (name === "DoctorName") {
      setOPVisitEntry((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "RelativePhoneNo") {
      if (value.length <= 10) {
        setOPVisitEntry((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setOPVisitEntry((prev) => ({
        ...prev,
        [name]: value,
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

  const HandleRegchange = async (e) => {
    const { name, value, pattern } = e.target;

    console.log(name, "namename-----------1");
    console.log(value, "value-------1");

    if (name === "Title") {
      // Find the title based on ID
      const selectedTitle = TitleNameData.find(
        (title) => title.id === parseInt(value)
      );
      console.log(selectedTitle, "selectedTitle-----------1");

      if (selectedTitle) {
        const titleName = selectedTitle.Title; // Extract title name

        // Determine gender based on Title
        const genderValue = ["Miss", "Ms", "Mrs"].includes(titleName)
          ? "Female"
          : ["Mr", "Master"].includes(titleName)
            ? "Male"
            : // : ["Transgender"].includes(titleName)
            // ? "TransGender"
            ["Dr", "Baby", "Transgender"].includes(titleName)
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
        if (value === "Female")
          return ["Miss", "Ms", "Mrs"].includes(title.Title);
        if (value === "Male") return ["Mr", "Master"].includes(title.Title);
        if (value === "TransGender")
          return ["Transgender", "Baby", "Dr"].includes(title.Title);
        return false;
      });

      const isTitleValid = titleOptions.some(
        (title) => title.id === RegisterData.Title
      );

      setRegisterData((prev) => ({
        ...prev,
        [name]: value,
        Title: isTitleValid ? prev.Title : "", // Keep title if valid, else reset
      }));
    }

    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (PatientDetails.ReferalDoctor_Id) {
      setOPVisitEntry((prevState) => ({
        ...prevState,
        IsReferral: "Yes",
        ReferredBy: PatientDetails.ReferalDoctor_Id, // Assign ReferredByDocID if needed
      }));
    }
  }, [PatientDetails.ReferalDoctor_Id]);

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
          // 'Speciality',
          // 'DoctorName',
          "PatientCategory",
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
    //       // 'VisitType',  ///added on 09-01-2024
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

    //       // 'TokenNo',

    //       'ServiceCategory',
    //       'ServiceSubCategory',

    //       'NextToKinName',
    //       'Relation',
    //       'RelativePhoneNo',
    //       'PatientCategory',
    //     ].includes(p)
    // )

    // let OpVisit = Object.keys(OPVisitEntry).filter((p) =>
    //   [
    //     "VisitType",
    //     "Speciality",
    //     "DoctorName",
    //     "TokenNo",
    //     "Complaint",

    //   ].includes(p)
    // );

    // setFilteredFormdataOPVisitEntry(OpVisit);

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
          "DonationType",
          "VisitType",
          "Speciality",
          "DoctorName",
          "TokenNo",
          "Complaint",
          "IsMLC",
          "IsReferral",
          "ReferralSource",
          "ReferredBy",
          "NextToKinName",
          "Relation",
          "RelativePhoneNo",
          "CorporateName",
          "CorporateType",
          "CorporateEmployeeId",
          "CorporateEmployeeDesignation",
          "CorporateEmployeeRelation",
          "ServiceCategory",
          "ServiceSubCategory",
          "FirstName",
          "SurName",
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

    let OPServicesdata = Object.keys(OPVisitEntry).filter((p) =>
      ["ServiceCategory", "ServiceSubCategory"].includes(p)
    );
    setFilteredFormdataServices(OPServicesdata);

    let Ipdetialdata = Object.keys(RegisterData).filter((p) =>
      [
        "AdmissionPurpose",
        "DrInchargeAtTimeOfAdmission",
        "NextToKinName",
        "Relation",
        "RelativePhoneNo",
        "PersonLiableForBillPayment",
        "FamilyHead",
        "IpKitGiven",
      ].includes(p)
    );
    if (RegisterData.FamilyHead === "No") {
      const categoryIndex = Ipdetialdata.indexOf("FamilyHead");
      Ipdetialdata.splice(categoryIndex + 1, 0, "FamilyHeadName");
    }
    setFilteredFormdataIpDetials(Ipdetialdata);
  }, [OPVisitEntry,RegisterData, SpecializationData, AppointmentRegisType]);

  // useEffect(() => {
  //   axios
  //     .get(`${UrlLink}Masters/services_Group_list_details`)
  //     .then((res) => {
  //       const ress = res.data;
  //       console.log(ress, "ddhdhdhdhdhdhdhdhdhdhdhdhdhdh");

  //       setServiceCategoryData(ress);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [UrlLink]);

  const handleRestrictedAction = () => {
    alert("You do not have permission to perform this action.");
  };

  const handlesubmit = () => {
    setLoading(true);
    scrollToElement("RegisFormcon_11");

    if ((AppointmentRegisType === "OP" || AppointmentRegisType === "CASUALITY") && mulappoint.length === 0) {
      setLoading(false);
      const tdata = {
        message:
          "Please click the add icon in the OP VISIT section before saving.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    const requiredFields = ["Title", "FirstName", "Gender", "PhoneNo"];
    const requiredFields1 = ["PatientCategory"];
    let missingFields = [];

    requiredFields.forEach((field) => {
      if (!RegisterData[field]) {
        missingFields.push(formatLabel(field));
      }
    });
    requiredFields1.forEach((field) => {
      if (!OPVisitEntry[field]) {
        missingFields.push(formatLabel(field));
      }
    });

    if (!RegisterData.DOB && !RegisterData.Age) {
      missingFields.push("DOB or Age");
    }
    // if (!OPVisitEntry.DoctorName) {
    //   missingFields.push("DoctorName");
    // }

    console.log("missingFields", missingFields);

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
          message: `Please fill the field required pattern: ${exist.join(",")}`,
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        const submitdata = {
          ...OPVisitEntry,
          Created_by: UserData?.username,
          RegisterType: AppointmentRegisType,
          DocEditId: DocEdit,
          PatientId: patientsearch.Search,
          RefDocRegistrationId: ReferalDocPatient?.RegistrationId,
          RefDoctorId: ReferalDocPatient?.RefDoctorId,
          RegistrationId: Registeredit?.RegistrationId || EditEventId || "",
          Appoint_list: mulappoint,
          RegisterData: RegisterData,
          AppointmentId:
            Registeredit?.AppointmentId ||
            PatientDetails?.AppointmentId ||
            null,
          labvisit: labvisit,
          labdoctor: labdoctor,
          radiologyvisit: radiologyvisit,
          radiologydoctor: radiologydoctor,
          SelectedTest: SelectedTest,
          DeletedTest : DeletedTest,

          Packagename: Packagename,
          selectedServices: selectedServices,

          MHCvisit: MHCvisit,
          MHCdoctor: MHCdoctor,

          daycaredoctor: daycaredoctor,
          selecteddaycare: selecteddaycare,

          SubtestNoArr: SubtestNo,
          location: UserData?.location,

          Serviceaddedlist : Serviceaddedlist

          // ...formData
        };

        const EmergencySubmitdata = {
          ...OPVisitEntry,
          Created_by: UserData?.username,
          RegisterType: AppointmentRegisType,
          // DocEditId: DocEdit,
          PatientId: patientsearch.Search,
          // RefDocRegistrationId: ReferalDocPatient?.RegistrationId,
          // RefDoctorId: ReferalDocPatient?.RefDoctorId,
          RegistrationId: Registeredit?.RegistrationId || EditEventId || "",
          Appoint_list: mulappoint,
          // RegisterData: RegisterData,
          // AppointmentId:
          //   Registeredit?.AppointmentId ||
          //   PatientDetails?.AppointmentId ||
          //   null,
          Location: UserData?.location,
           ...RegisterData
          // labvisit: labvisit,
          // labdoctor: labdoctor,
          // radiologyvisit: radiologyvisit,
          // radiologydoctor: radiologydoctor,
          // SelectedTest: SelectedTest,

          // Packagename: Packagename,
          // selectedServices: selectedServices,

          // MHCvisit: MHCvisit,
          // MHCdoctor: MHCdoctor,

          // daycaredoctor: daycaredoctor,
          // selecteddaycare: selecteddaycare,

          // SubtestNoArr: SubtestNo,
          // location: UserData?.location,
          

          // ...formData
        };

        console.log("EmergencySubmitdata", EmergencySubmitdata);
        console.log("datatosend", submitdata);

        // if (Object.keys(Registeredit).length === 0 && AppointmentRegisType === 'OP') {
        //   // Confirmation Step
        //   const userConfirmed = window.confirm(
        //     "Do you want to pay Consultation Fee?"
        //   );

        //   axios
        //     .post(`${UrlLink}Frontoffice/MRD_Patient_OP_Registration`, submitdata)
        //     .then((res) => {
        //       setLoading(false);
        //       console.log(res.data);
        //       const resres = res.data;
        //       console.log(resres,'resres-------');

        //       let typp = Object.keys(resres)[0];
        //       let mess = Object.values(resres)[0];
        //       const tdata = {
        //         message: mess,
        //         type: typp,
        //       };
        //       console.log('11111111');

        //       dispatchvalue({ type: "toast", value: tdata });
        //       clearRegisterdata();
        //       dispatchvalue({ type: "Registeredit", value: {} });
        //       dispatchvalue({ type: "PatientDetails", value: {} });

        //       if (userConfirmed) {
        //         navigate("/Home/FrontOfficeFolder");
        //         dispatchvalue({
        //           type: "OPConsultDetails",
        //           value: {
        //             submitdata: submitdata, // Explicit key-value pair
        //             RegistrationId: resres?.RegistrationId || "", // Ensure it's not undefined
        //           },
        //         });
        //         dispatchvalue({ type: "HrFolder", value: "QuickBilling" });
        //         dispatchvalue({ type: "setPreviousFolder", value: null });
        //         dispatchvalue({ type: "showMenu", value: true });
        //       } else {
        //         navigate("/Home/FrontOfficeFolder");
        //         dispatchvalue({
        //           type: "HrFolder",
        //           value: "PatientRegisterList",
        //         });
        //         dispatchvalue({ type: "setPreviousFolder", value: null });
        //         dispatchvalue({ type: "showMenu", value: true });
        //       }
        //     })
        //     .catch((err) => {
        //       setLoading(false);
        //       console.log(err);
        //     });
        // }

        if (AppointmentRegisType === "MHC") {
          axios
            .post(`${UrlLink}Frontoffice/Patient_MHC_Registration`, submitdata)
            .then((res) => {
              setLoading(false);
              console.log(res.data);
              const resres = res.data;
              let typp = Object.keys(resres)[0];
              let mess = Object.values(resres)[0];
              const tdata = {
                message: mess,
                type: typp,
              };
              dispatchvalue({ type: "toast", value: tdata });
              clearRegisterdata();
              dispatchvalue({ type: "Registeredit", value: {} });
              dispatchvalue({ type: "PatientDetails", value: {} });

              navigate("/Home/FrontOfficeFolder");
              dispatchvalue({ type: "HrFolder", value: "PatientRegisterList" });
              dispatchvalue({ type: "setPreviousFolder", value: null });
              dispatchvalue({ type: "showMenu", value: true });
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
            });
        } 

         else if (AppointmentRegisType === "SERVICES") {
          axios
            .post(`${UrlLink}Frontoffice/Patient_SERVICES_Registration`, submitdata)
            .then((res) => {
              setLoading(false);
              console.log(res.data);
              const resres = res.data;
              let typp = Object.keys(resres)[0];
              let mess = Object.values(resres)[0];
              const tdata = {
                message: mess,
                type: typp,
              };
              dispatchvalue({ type: "toast", value: tdata });
              clearRegisterdata();
              dispatchvalue({ type: "Registeredit", value: {} });
              dispatchvalue({ type: "PatientDetails", value: {} });
        
              dispatchvalue({
                type: "OPConsultDetails",
                value: {
                  submitdata: submitdata,
                  BillingType: 'Services',
                  RegistrationId: resres?.RegistrationId || "", 
                }
              });
        
              // ✅ Ask user before navigating
              if (window.confirm("Do you want to proceed to Billing for payment?")) {
                navigate("/Home/CashierFolder");
                dispatchvalue({ type: "HrFolder", value: "BillingServicesCashier" });
              } else {
                // If NO, stay on same page or redirect to Patient List
                navigate("/Home/FrontOfficeFolder");
                dispatchvalue({ type: "HrFolder", value: "PatientRegisterList" });
              }
        
              dispatchvalue({ type: "setPreviousFolder", value: null });
              dispatchvalue({ type: "showMenu", value: true });
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
            });
                  }


        else if (AppointmentRegisType === "CASUALITY") {
          axios
            .post(
              `${UrlLink}Frontoffice/Emergency_Patient_From_Patient_Registration`,
              EmergencySubmitdata
            )
            .then((res) => {
              setLoading(false);
              console.log(res.data);
              const resres = res?.data;
              console.log(resres,'resres');
              
              let typp = Object.keys(resres)[0];
              let mess = Object.values(resres)[0];
              const tdata = {
                message: mess,
                type: typp,
              };

              const regId = resres?.RegistrationId;
              
              if (regId) {
                console.log("✅ Setting selectedEmgRowData:", regId);
                setSelectedEmgRowData(regId);  // Triggers your useEffect
              } else {
                console.warn("❌ RegistrationId missing from response.");
              }


              // if (resres?.RegistrationId) {
              //   console.log('rrrrrrrrrr');
              //   console.log("✅ Setting RegistrationId:", resres?.RegistrationId);
              //   setSelectedEmgRowData(resres?.RegistrationId);  // ✅ Set RegistrationId -> triggers useEffect
              // }

              dispatchvalue({ type: "toast", value: tdata });
              clearRegisterdata();
              dispatchvalue({ type: "Registeredit", value: {} });
              dispatchvalue({ type: "PatientDetails", value: {} });
              dispatchvalue({ type: "ReferalDocPatient", value: {} });


              // navigate("/Home/FrontOfficeFolder");
              // dispatchvalue({ type: "HrFolder", value: "PatientRegisterList" });
              dispatchvalue({ type: "setPreviousFolder", value: null });
              dispatchvalue({ type: "showMenu", value: true });
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
            });
        } 
        else if (AppointmentRegisType === "DAYCARE") {
          axios
            .post(
              `${UrlLink}Frontoffice/Patient_DAYCARE_Registration`,
              submitdata
            )
            .then((res) => {
              setLoading(false);
              console.log(res.data);
              const resres = res.data;
              let typp = Object.keys(resres)[0];
              let mess = Object.values(resres)[0];
              const tdata = {
                message: mess,
                type: typp,
              };
              dispatchvalue({ type: "toast", value: tdata });
              clearRegisterdata();
              dispatchvalue({ type: "Registeredit", value: {} });
              dispatchvalue({ type: "PatientDetails", value: {} });

              navigate("/Home/FrontOfficeFolder");
              dispatchvalue({ type: "HrFolder", value: "PatientRegisterList" });
              dispatchvalue({ type: "setPreviousFolder", value: null });
              dispatchvalue({ type: "showMenu", value: true });
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
            });
        }
        else if (AppointmentRegisType === "LAB") {
          axios
            .post(`${UrlLink}Frontoffice/Patient_LAB_Registration`, submitdata)
            .then((res) => {
              setLoading(false);
              console.log(res.data);
              const resres = res.data;
              let typp = Object.keys(resres)[0];
              let mess = Object.values(resres)[0];
              const tdata = {
                message: mess,
                type: typp,
              };
              dispatchvalue({ type: "toast", value: tdata });
              clearRegisterdata();
              dispatchvalue({ type: "Registeredit", value: {} });
              dispatchvalue({ type: "PatientDetails", value: {} });

              navigate("/Home/FrontOfficeFolder");
              dispatchvalue({ type: "HrFolder", value: "PatientRegisterList" });
              dispatchvalue({ type: "setPreviousFolder", value: null });
              dispatchvalue({ type: "showMenu", value: true });
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
            });
        } 
        else if (AppointmentRegisType === "RADIOLOGY") {
          axios
            .post(
              `${UrlLink}Frontoffice/Patient_RADIOLOGY_Registration`,
              submitdata
            )
            .then((res) => {
              setLoading(false);
              console.log(res.data);
              const resres = res.data;
              let typp = Object.keys(resres)[0];
              let mess = Object.values(resres)[0];
              const tdata = {
                message: mess,
                type: typp,
              };
              dispatchvalue({ type: "toast", value: tdata });
              clearRegisterdata();
              dispatchvalue({ type: "Registeredit", value: {} });
              dispatchvalue({ type: "PatientDetails", value: {} });

              navigate("/Home/FrontOfficeFolder");
              dispatchvalue({ type: "HrFolder", value: "PatientRegisterList" });
              dispatchvalue({ type: "setPreviousFolder", value: null });
              dispatchvalue({ type: "showMenu", value: true });
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
            });
        } else {
          // Confirmation Step

          if (Registeredit?.Edit !== 'Yes'){
            
          
            axios
              .post(`${UrlLink}MCI/MRD_Patient_OP_Registration`, submitdata)
              .then((res) => {
                setLoading(false);
                console.log(res.data);
                const resres = res.data;
                let typp = Object.keys(resres)[0];
                let mess = Object.values(resres)[0];
                const tdata = {
                  message: mess,
                  type: typp,
                };
                dispatchvalue({ type: "toast", value: tdata });
                clearRegisterdata();
                dispatchvalue({ type: "Registeredit", value: {} });
                dispatchvalue({ type: "PatientDetails", value: {} });
                dispatchvalue({ type: "ReferalDocPatient", value: {} });


                navigate("/Home/MRDFolder");
                dispatchvalue({ type: "HrFolder", value: "MCIRegistrationList" });

                dispatchvalue({ type: "setPreviousFolder", value: null });
                dispatchvalue({ type: "showMenu", value: true });



                if (resres?.RegistrationId) {
                  setSelectedRowData(resres.RegistrationId);  // ✅ Set RegistrationId -> triggers useEffect
                }

              

          })


          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
        }
        else {

          console.log('ffff--jjj')
          
          axios
            .post(`${UrlLink}MCI/MRD_Patient_OP_Registration`, submitdata)
            .then((res) => {
              setLoading(false);
              console.log(res.data);
              const resres = res.data;

              console.log(resres,'resres')
              let typp = Object.keys(resres)[0];
              let mess = Object.values(resres)[0];
              const tdata = {
                message: mess,
                type: typp,
              };

              if (resres?.Billpage) {
                  setBBillpage(resres.Billpage);  // ✅ Set RegistrationId -> triggers useEffect
                }
              dispatchvalue({ type: "toast", value: tdata });
              clearRegisterdata();
              dispatchvalue({ type: "Registeredit", value: {} });
              dispatchvalue({ type: "PatientDetails", value: {} });
              dispatchvalue({ type: "ReferalDocPatient", value: {} });
              dispatchvalue({ type: "OP_BillingData", value: {} });


              if (resres?.Billpage === "Refund"){

                console.log('refunddddddddddddoage')

              dispatchvalue({ type: "OPBillingData", value: resres?.RegistrationId });


              navigate("/Home/CashierFolder");
              dispatchvalue({
                type: "HrFolder",
                value: "ConsultationbillrefundPage",
              });
              dispatchvalue({ type: "setPreviousFolder", value: null });
              dispatchvalue({ type: "showMenu", value: true });

              }

              else if (resres?.Billpage === "Bill"){

                console.log('billlpageeeee')

                dispatchvalue({ type: "OPBillingData", value: resres?.RegistrationId });

                navigate("/Home/CashierFolder");
              dispatchvalue({
                type: "HrFolder",
                value: "Consultationbilleditpage",
              });
              dispatchvalue({ type: "setPreviousFolder", value: null });
              dispatchvalue({ type: "showMenu", value: true });
              }

              else {
                navigate("/Home/MRDFolder");
              dispatchvalue({
                type: "HrFolder",
                value: "MCIRegistrationList",
              });
              dispatchvalue({ type: "setPreviousFolder", value: null });
              dispatchvalue({ type: "showMenu", value: true });
              }
              
              
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
            });

            }
           
        }
      }
    }
  };

 
  const handleSaveClick = () => {
    if (UserData?.Create) {
      handlesubmit(); // Proceed with form submiu689ssion
    } else {
      handleRestrictedAction(); // Show alert for unauthorized users
    }
  };

  const handleSaveDoc = () =>{


  }

  // #-------------Final working code ------------------

  useEffect(() => {
    if (
      AppointmentRegisType === "LAB" ||
      AppointmentRegisType === "RADIOLOGY"
    ) {
      const Opvisitforradiology = Object.keys(OPVisitEntry).filter((p) =>
        [
          "VisitType",
          "DoctorName",
          //  'IsReferral',
        ].includes(p)
      );
      console.log(Opvisitforradiology); // Check the filtered keys
      setFilteredFormdataOPVisitEntry(Opvisitforradiology);
    }
  }, [AppointmentRegisType]);



  const [selectedTests, setSelectedTests] = useState([]);

  console.log(selectedTests, "selectedTests");


  const handleCheckboxChange = (e) => {
    const { name, checked, value } = e.target;

    const value1 = value.split("|").map((val) => val.trim());
    const value2 = value1[0];
    const Type = value1[1];

    console.log(value1, value2, Type);

    let SubDepartment_Code;
    let Test_Code;
    let Group_Code;
    let GroupList;
    let Department_Code;

    if (Type === "Individual") {
      console.log("Handling Individual Test");
      const selectedTest = TestNameList?.find((item) => item.Name === value2);
      Test_Code = selectedTest?.Code;
      console.log(Test_Code, "Test_Code");
    } else if (Type === "Group") {
      console.log("Handling Group Test");
      setTestType(Type);
      const selectedTest = TestNameList?.find((item) => item.Name === value2);
      Group_Code = selectedTest?.Code;
      console.log(Group_Code, "Group_Code");
    }

    // Update formData state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value2,
      SubDepartment_Code: SubDepartment_Code || prevData.SubDepartment_Code,
      Test_Code: Test_Code || prevData.Test_Code,
      Group_Code: Group_Code || prevData.Group_Code,
      GroupList: GroupList,
      Department_Code: Department_Code || prevData.Department_Code,
    }));

    // Handling checkbox selection
    if (checked) {
      // Prevent duplicate selection
      const isTestCodeExists = SelectedTest.some(
        (test) => test.Code === (Type === "Individual" ? Test_Code : Group_Code)
      );

      if (isTestCodeExists) {
        const mess =
          "This Test already exists in Selected Test: " +
          SelectedTest.find(
            (test) =>
              test.Code === (Type === "Individual" ? Test_Code : Group_Code)
          ).Name;

        const tdata = { message: mess, type: "warn" };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        const newvalues = {
          id: SelectedTest.length + 1,
          SubDepartment_Code: formData.SubDepartment_Code,
          SubDepartment_Name: formData?.SubDepartment_Name,
          Name: Type === "Individual" ? value2 : formData?.Group_Name,
          Code: Type === "Individual" ? Test_Code : Group_Code,
          testType: Type,
          GroupList: formData?.GroupList,
          Department_Name: formData?.Department_Name,
          Department_Code: formData?.Department_Code,
        };

        console.log("Adding:", newvalues);
        setSelectedTest((prev) => [...prev, newvalues]);

        // const tdata = { message: "Added Successfully", type: "success" };
        // dispatchvalue({ type: "toast", value: tdata });
      }
    } else {
      // Removing the deselected checkbox test
      setSelectedTest((prev) =>
        prev.filter(
          (test) =>
            test.Code !== (Type === "Individual" ? Test_Code : Group_Code)
        )
      );
      console.log("Removed:", value2);
    }
  };

  const isChecked = (test) => {
    return SelectedTest.some((t) => t.Code === test.Code);
  };

  const handleMLCChange = (e) => {
    const { name, value } = e.target;
    setOPVisitEntry((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleIsReferralChange = (e) => {
    const { name, value } = e.target;
    setOPVisitEntry((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const Testcolumns = [
    {
      key: "Sno",
      name: "S.No",
    },
    {
      key: "",
      name: "Speciality Id",
    },
    {
      key: "id",
      name: "Speciality Id",
    },
  ];

  useEffect(() => {
    const fetchtoken = async () => {
      if (OPVisitEntry.TokenNo) return;
      const postdata = {
        LocationId: UserData?.location,
        Date: formatDate(new Date()),
        Speciality: OPVisitEntry.Speciality,
      };
      console.log("token", postdata);

      try {
        const response = await axios.get(
          `${UrlLink}Frontoffice/get_available_tokenno_by_speciality`,
          { params: postdata }
        );

        // Set the token data to state
        setTokenData(response?.data?.next_available_token_no);
        console.log("Tokendata", response?.data);

        // Assuming response.data contains next_available_token_no
        if (response?.data) {
          const tokenno = response?.data?.next_available_token_no || 0;
          setOPVisitEntry((prevData) => {
            const updatedData = {
              ...prevData,
              TokenNo: tokenno,
            };
            console.log("UpdatedOPVisitEntry", updatedData);
            return updatedData;
          });
        }
        console.log("OPVisitEntryyyy", OPVisitEntry);
      } catch (error) {
        setTokenData([]);
        console.error("Errortoken no:", error);
      }
    };

    if (OPVisitEntry.Speciality) {
      fetchtoken();
    }
  }, [UrlLink, UserData.location, OPVisitEntry.Speciality]);

  useEffect(() => {
  if (AppointmentRegisType !== 'RADIOLOGY') return; // ✅ Only run if RADIOLOGY

  axios
    .get(`${UrlLink}Masters/Radiology_details_link_view`)
    .then((res) => {
      const ress = res.data;
      setTestNames(ress);
    })
    .catch((err) => {
      console.log(err);
    });

}, [AppointmentRegisType, UrlLink]);

  useEffect(() => {

    if (AppointmentRegisType !== 'MHC') return;
    axios
      .get(`${UrlLink}Masters/package_master_details`)
      .then((res) => {
        const ress = res.data;
        console.log(ress[0].Services_details, "ddhdhdhdhdhdhdhdhdhdhdhdhdhdh");

        setPackages(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink,AppointmentRegisType]);

  useEffect(() => {
    if (Daycare === "Procedure") {
      axios
        .get(
          `${UrlLink}Masters/Service_Procedure_Master_Detials_link?MasterType=${Daycare}&Type=&SearchBy=`
        )
        .then((res) => {
          const ress = res.data;
          setDaycareprocedure(ress);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (Daycare === "Therapy") {
      axios
        .get(`${UrlLink}Masters/TherapyType_Master_link`)
        .then((res) => {
          const ress = res.data;
          setDaycaretherapy(ress);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [Daycare]);


  // Services..................................................

  const [ServiceProcedure, setServiceProcedure] = useState({
        ServiceCategory: '',
        Categoryid: '',
        ServiceSubCategory: '',
        ServiceSubCatId: '',
        Subcategorypk: '',
        Rate: '',
        Quantity: 1,
        type: "",
      });
  
    const [Serviceaddedlist,setServiceaddedlist] = useState([]);


 const handledayGSadd = () => {

     if (!ServiceProcedure.ServiceCategory || !ServiceProcedure.Rate) {
    alert("Please fill service category and rate before adding");
    return;
  }
  // Step 1: Add current ServiceProcedure to list
  setServiceaddedlist((prevList) => [...prevList, ServiceProcedure]);

  // Step 2: Reset ServiceProcedure
  setServiceProcedure((prev) => ({
  ServiceCategory: prev.ServiceCategory,  
  Categoryid: prev.Categoryid,  
  ServiceSubCategory: '',
  ServiceSubCatId: '',
  Subcategorypk: '',
  Rate: '',
  Quantity: 1,
  type: '',
}));
   };

   const handleRemoveServiceName = (row) => {
  setServiceaddedlist((prevList) =>
    prevList.filter((item) => item !== row)
  );
};

useEffect(() => {

      if (AppointmentRegisType !== 'SERVICES') return;

    axios
      .get(`${UrlLink}Masters/services_Group_list_details`)
      .then((res) => {
        const ress = res.data;
        console.log(ress, "ddhdhdhdhdhdhdhdhdhdhdhdhdhdh");

        setcategory(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink,AppointmentRegisType]);

  useEffect(() => {

        if (AppointmentRegisType !== 'SERVICES') return;

    axios
      .get(
        `${UrlLink}Masters/services_Subcategory_details_by_category?ServiceCategory=${ServiceProcedure?.Categoryid}`
      )
      .then((res) => {
        const ress = res.data;
        console.log(ress, "ddhdhdhdhdhdhdhdhdhdhdhdhdhdh");

        setsubcategory(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, ServiceProcedure.ServiceCategory]);



    const ServiceListColumn = [
      
      {
        key: "ServiceCategory",
        name: "ServiceCategory",
      },
      {
        key: "ServiceSubCategory",
        name: "ServiceSubCategory",
      },
      {
        key: "Rate",
        name: "Rate",
      },
      {
        key: "Quantity",
        name: "Quantity",
      },
       {
        key: "Action",
        name: "Action",
        renderCell: (params) => (
          <Button
            className="cell_btn"
            onClick={() => handleRemoveServiceName(params.row)}
          >
            <FaTrash className="check_box_clrr_cancell" />
          </Button>
        ),
      },
  
        
      
    ];

    const HandleOnchangeService = (e) => {
      const { name, value } = e.target;
      if (name === 'ServiceCategory') {
        if (value.includes('|')) {
          const value1 = value.split('|')
          const value2 = value1[0];
          const value3 = value1[1];
          console.log('serrrrrr', value1, value2, value3);
          setServiceProcedure((prev) => ({
            ...prev,
            Categoryid: value2,
            [name]: value3,
          }))
   
        }
        else {
          setServiceProcedure((prev) => ({
            ...prev,
            [name]: value,
            Categoryid: '',
            ServiceSubCategory: '',
            ServiceSubCatId: '',
            Subcategorypk: '',
            Rate: '',
            Quantity: 1,
          }))
        }
      }
      else if (name === 'ServiceSubCategory') {



        const value1 = value.split('|');

        console.log(value1,'value1')
        if (value1.length === 3) {
          const subcategorypk = value1[0];
          const subCategoryid = value1[1];
          const subCategoryname = value1[2];
          setServiceProcedure((prev) => ({
            ...prev,
            ServiceSubCatId: subCategoryid,
            [name]: subCategoryname,
            Subcategorypk: subcategorypk,
          }));
        } 
        else if (value1.length === 2) {
          const subcategorypk = value1[0];
          const subCategoryname = value1[1];
          const matchedOne = subcategory.find(
            (item) =>
              item.pk === Number(subcategorypk)
          ); 

          console.log(matchedOne,'matchedOne')
          setServiceProcedure((prev) => ({
            ...prev,
            Subcategorypk: subcategorypk,
            [name]: subCategoryname,
            Rate : matchedOne?.Amount
            
          }));
        } 
        else if (value1.length === 4) {
          const subcategorypk = value1[0];
          const roomno = value1[1];
          const bedno = value1[2];
          const Wardname = value1[3];
          const subCategoryname = roomno + bedno + Wardname;
          setServiceProcedure((prev) => ({
            ...prev,
            Subcategorypk: subcategorypk,
            [name]: subCategoryname,
          }));
        }
         else {
          setServiceProcedure((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
      }

      else if (name === 'Quantity') {

        const matchedOne = subcategory.find(
            (item) =>
              item.pk === Number(ServiceProcedure.Subcategorypk)
          ); 

          setServiceProcedure((prev) => ({
            ...prev,
            [name]: value,
            Rate: Number(matchedOne.Amount) * Number(value) 
          }));
        }
      else {
        setServiceProcedure((prev) => ({
          ...prev,
          [name]: value,
          Categoryid: '',
          ServiceSubCatId: '',
          Subcategorypk: '',
        }));
      }
  }


  return (
    <>
      <div className="Main_container_app">
        <h3>OP Visit Entry</h3>
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
          {patientsearch.Search !== "" && BillDueChanges && (
            <div className="RegisForm_12 uvkvbf_sri">
              <div className="bill-due-container">
                {BillDue.OP_ResultType !== "No Due" && (
                  <div className="bill-due-item">
                    <label>
                      {`OP ${BillDue.OP_ResultType}`} <span>:</span>
                    </label>
                    <span>{BillDue.OP_Amount}</span>
                  </div>
                )}
                {BillDue.IP_ResultType !== "No Due" && (
                  <div className="bill-due-item">
                    <label>
                      {`IP ${BillDue.IP_ResultType}`} <span>:</span>
                    </label>
                    <span>{BillDue.IP_Amount}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="DivCenter_container">Personal Details</div>
        <br />

        <div
          className="RegisFormcon"
          id="RegisFormcon_1"
          ref={personalDetailsRef}
        >
          <div className="RegisForm_1">
            <label htmlFor={AppointmentRegisType}>
              Visit Purpose <span>:</span>
            </label>
            <select
              id={AppointmentRegisType}
              value={AppointmentRegisType}
              onChange={(e) => {
                setAppointmentRegisType(e.target.value);
              }}
            >
              <option value="OP">Out-Patient</option>
              <option value="CASUALITY">CASUALITY</option>
              <option value="DAYCARE">DayCare</option>
              <option value="SERVICES">Services</option>
              <option value="MHC">MHC</option>
              <option value="LAB">LAB</option>
              <option value="RADIOLOGY">RADIOLOGY</option>
            </select>
          </div>

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
                        {/* {field === 'UHIDType' && 'UHID Type'} */}
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
                    // 'Speciality',
                    // 'DoctorName',
                    "PatientType",
                    // "FirstName",
                    // "MiddleName",
                    // "SurName",

                    // 'PatientCategory',
                    // 'ColorFlag',
                    // 'ReferralSource',

                    // 'Flagging',
                    // 'InsuranceName',
                    // 'DonationType',
                    // 'InsuranceType',
                    // 'ClientName',
                    // 'ClientEmployeeRelation',
                    // 'EmployeeRelation',
                    // 'EmployeeId',
                    // 'EmployeeRelation',
                    // 'Relation',
                    // 'DoctorId',
                    // 'DoctorRelation',
                    // 'CorporateName',
                    // 'CorporateEmployeeRelation'
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
                        //  readOnly
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
                      readOnly={field === "CardValidity"}
                      value={RegisterData[field]}
                      onKeyDown={
                        [
                          "MiddleName",
                          "SurName",
                          // 'AliasName',
                          "Occupation",
                          "NextToKinName",
                          "FamilyHeadName",
                          "Street",
                          "Area",
                          "City",
                          "District",
                          "State",
                          "Complaint",
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
                  <span className="requirreg12">**</span> <span>:</span>
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

                    {["EmployeeId"].includes(field) &&
                      EmployeeData?.map((row, indx) => (
                        <option key={indx} value={row.id}>
                          {row.Name}
                        </option>
                      ))}

                    {["DoctorId"].includes(field) &&
                      DoctorIdData?.filter(
                        (p) => p.id !== OPVisitEntry.DoctorName
                      ).map((row, indx) => (
                        <option key={indx} value={row.id}>
                          {row.Name}
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
                          {`${row?.Name}`}
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
         

          <div style={{ display: "flex", gap: "10px" }}>
            <label style={{ fontWeight: "bold" }}>IsMLC</label>
            <label htmlFor="IsMLC_yes">
              <input
                type="radio"
                id="IsMLC_yes"
                name="IsMLC"
                value="Yes"
                checked={OPVisitEntry.IsMLC === "Yes"}
                onChange={handleMLCChange}
              />
              Yes
            </label>

            <label htmlFor="IsMLC_no">
              <input
                type="radio"
                id="IsMLC_no"
                name="IsMLC"
                value="No"
                checked={OPVisitEntry.IsMLC === "No"}
                onChange={handleMLCChange}
              />
              No
            </label>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <label style={{ fontWeight: "bold" }}>Is Referal</label>
            <label htmlFor="IsMLC_yes">
              <input
                type="radio"
                id="IsMLC_yes"
                name="IsReferral"
                value="Yes"
                checked={OPVisitEntry.IsReferral === "Yes"}
                onChange={handleMLCChange}
              />
              Yes
            </label>

            <label htmlFor="IsMLC_no">
              <input
                type="radio"
                id="IsMLC_no"
                name="IsReferral"
                value="No"
                checked={OPVisitEntry.IsReferral === "No"}
                onChange={handleMLCChange}
              />
              No
            </label>
          </div>
        </div>

        <br />

        <br />

        {/* --------- here address they dont want to show in frontoffice for KMCH -------- Address --------------- */}

        {/* <br />

        <div className="DivCenter_container">Address</div>
        <br />

        <div className="RegisFormcon" id="RegisFormcon_2" ref={addressRef}>
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

        {/* ----------------- Referral --------------- */}

{OPVisitEntry.IsReferral === "Yes" && (
  <>
    <br />
    <div className="DivCenter_container">Referral</div>
    <br />
    <div className="RegisFormcon" id="RegisFormcon_4" ref={referalref}>
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

                {/* FIXED - Remove the extra <option> inside the map */}
                {field === "ReferredBy" && 
                  ReferralDoctorData.map((row, indx) => (
                    <option key={indx} value={row.id}>
                      {row.ShortName}
                    </option>
                  ))}

              </select>
            )}
          </div>
        ))}
    </div>
  </>
)}
        

        {/* ----------------- OP Visit --------------- */}
        <br />
        {(AppointmentRegisType === "OP" || AppointmentRegisType ==="CASUALITY") && (
          <div>
            <div className="DivCenter_container">OP Visit</div>
            <br />

            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                  <label>
                    VisitType <span>:</span>
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    name="VisitType"
                    list="visitTypeOptions"    
                    value={OPVisitEntry?.VisitType || ""}
                    onChange={HandleOnchange}
                  />
                    <datalist id="visitTypeOptions">
                      <option value="NewConsultation" />
                      <option value="FollowUp With Fee" />
                      <option value="FollowUp No Fee" />
                    </datalist>
                  </div>


              <div className="RegisForm_1">
                <label>
                  Speciality <span>:</span>
                </label>
                <select
                  name="Speciality"
                  value={OPVisitEntry?.Speciality || ""}
                  onChange={HandleOnchange}
                  disabled={
                    Object.keys(PatientDetails).length === 0 &&
                    isRegisterDataEmpty
                  }
                >
                  <option value="">Select</option>
                  {Array.isArray(SpecializationData) &&
                    SpecializationData.filter((p) => p.Status === "Active").map(
                      (Catg, indx) => (
                        <option key={indx} value={Catg.id}>
                          {Catg.SpecialityName}
                        </option>
                      )
                    )}
                </select>
              </div>

              <div className="RegisForm_1">
                <label>
                  Doctor Name <span>:</span>
                </label>
                <select
                  name="DoctorName"
                  value={OPVisitEntry?.DoctorName || ""}
                  onChange={HandleOnchange}
                >
                  <option value="">Select</option>
                  {Array.isArray(SpecializationData) &&
                    Array.isArray(DoctorData) &&
                    DoctorData.length > 0 &&
                    DoctorData.filter(
                      (p) => p.schedule?.[0]?.working === "yes"
                    ).map((row, indx) => (
                      <option key={indx} value={row.doctor_id}>
                        {row.doctor_name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="RegisForm_1">
                <label>
                  Token No <span>:</span>
                </label>
                <input
                  autoComplete="off"
                  type="text"
                  name="TokenNo"
                  readOnly
                  value={OPVisitEntry?.TokenNo || ""}
                  onChange={HandleOnchange}
                />
              </div>

               {(selectedSpecialityName === 'OBST&GYNECOLOGY') && (<>
 
               <div className="RegisForm_1">
                <label>
                  Complaint <span>:</span>
                </label>
               <select
                 name="Complaint"
                 value={OPVisitEntry?.Complaint || ""}
                 onChange={HandleOnchange}>
                  <option value="">SELECT</option>
                  <option value="GYNECOLOGY">GYNECOLOGY</option>
                  <option value="OBSTETRICS">OBSTETRICS</option>
                  </select>
              </div>
 
              </>)}
 
                {(selectedSpecialityName === 'PAEDIATRICS') && (<>
 
                <div className="RegisForm_1">
                  <label>
                    Complaint <span>:</span>
                  </label>
                <select
                  name="Complaint"
                  value={OPVisitEntry?.Complaint || ""}
                  onChange={HandleOnchange}>
                    <option value="">SELECT</option>
                    <option value="PAEDIATRICS">PAEDIATRICS</option>
                    <option value="NEONATAL">NEONATAL</option>
                    </select>
                </div>
 
              </>)}
 
                {(selectedSpecialityName !== 'OBST&GYNECOLOGY' && selectedSpecialityName !=='PAEDIATRICS') && (<>
 
                  <div className="RegisForm_1">
                    <label>
                      Complaint <span>:</span>
                    </label>
                    <textarea
                      autoComplete="off"
                      name="Complaint"
                      value={OPVisitEntry?.Complaint || ""}
                      onChange={HandleOnchange}
                    />
                  </div>
 
              </>)}
 
 

              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={handlemultipledoctor}
              >
                <LoupeIcon />
              </button>
              {editingIndex !== null && (
                <button
                  onClick={handleCancelEdit}
                  className="text-white bg-gray-500 px-3 py-1 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}

             {mulappoint.length > 0 && (
                <div style={{
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                  overflow: 'hidden',
                  margin: '15px 0',
                  border: '1px solid #e1e5e9'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                    color: 'white',
                    padding: '12px 16px',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <i className="fas fa-calendar-check" style={{fontSize: '16px'}}></i>
                    <span>Appointment Schedule</span>
                  </div>

                  <div style={{overflowX: 'auto'}}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      minWidth: '700px',
                      fontSize: '13px'
                    }}>
                      <thead>
                        <tr style={{
                          background: '#f1f8ff',
                          borderBottom: '2px solid #d1e3f8'
                        }}>
                          <th style={{
                            padding: '10px 8px',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#2c3e50',
                            fontSize: '12px',
                            textTransform: 'uppercase'
                          }}>Visit Type</th>
                          <th style={{
                            padding: '10px 8px',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#2c3e50',
                            fontSize: '12px',
                            textTransform: 'uppercase'
                          }}>Speciality</th>
                          <th style={{
                            padding: '10px 8px',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#2c3e50',
                            fontSize: '12px',
                            textTransform: 'uppercase'
                          }}>Doctor Name</th>
                          <th style={{
                            padding: '10px 8px',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#2c3e50',
                            fontSize: '12px',
                            textTransform: 'uppercase'
                          }}>Token No</th>
                          <th style={{
                            padding: '10px 8px',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#2c3e50',
                            fontSize: '12px',
                            textTransform: 'uppercase'
                          }}>Complaint</th>
                          <th style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            fontWeight: '600',
                            color: '#2c3e50',
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            width: '120px'
                          }}>Actions</th>
                          {Registeredit?.RegistrationId && <th style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            fontWeight: '600',
                            color: '#2c3e50',
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            width: '80px'
                          }}>Save</th>}
                        </tr>
                      </thead>

                      <tbody>
                        {mulappoint.map((entry, index) => (
                          <tr
                            key={index}
                            style={{
                              background: editingIndex === index 
                                ? '#fffde7' 
                                : index % 2 === 0 ? '#fafbfc' : 'white',
                              borderBottom: '1px solid #edf2f7',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = editingIndex === index 
                                ? '#fffde7' 
                                : '#f8fafc';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = editingIndex === index 
                                ? '#fffde7' 
                                : index % 2 === 0 ? '#fafbfc' : 'white';
                            }}
                          >
                            <td style={{
                              padding: '10px 8px',
                              color: '#2d3748',
                              fontSize: '13px',
                              fontWeight: '500'
                            }}>{entry?.VisitType || "-"}</td>
                            <td style={{
                              padding: '10px 8px',
                              color: '#4a5568',
                              fontSize: '13px'
                            }}>{entry?.SpecialityName || "-"}</td>
                            <td style={{
                              padding: '10px 8px',
                              color: '#2d3748',
                              fontSize: '13px',
                              fontWeight: '500'
                            }}>{entry?.DoctorName || "-"}</td>
                            <td style={{
                              padding: '10px 8px',
                              color: '#4a5568',
                              fontSize: '13px',
                              textAlign: 'center'
                            }}>
                              {entry?.TokenNo ? (
                                <span style={{
                                  background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                                  color: 'white',
                                  padding: '3px 8px',
                                  borderRadius: '12px',
                                  fontSize: '11px',
                                  fontWeight: '600'
                                }}>
                                  {entry.TokenNo}
                                </span>
                              ) : "-"}
                            </td>
                            <td style={{
                              padding: '10px 8px',
                              color: '#4a5568',
                              fontSize: '13px',
                              maxWidth: '150px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>{entry?.Complaint || "-"}</td>

                            {/* Actions column - Only Edit and Delete buttons */}
                            <td style={{
                              padding: '10px 8px',
                              textAlign: 'center'
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                              }}>
                                <button
                                  onClick={() => handleEditDoc(entry, index)}
                                  disabled={editingIndex !== null && editingIndex !== index}
                                  style={{
                                    background: 'transparent',
                                    color: '#3498db',
                                    border: '1px solid #3498db',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    cursor: editingIndex !== null && editingIndex !== index ? 'not-allowed' : 'pointer',
                                    opacity: editingIndex !== null && editingIndex !== index ? 0.5 : 1,
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                  }}
                                  title="Edit"
                                  onMouseEnter={(e) => {
                                    if (!(editingIndex !== null && editingIndex !== index)) {
                                      e.currentTarget.style.background = '#3498db';
                                      e.currentTarget.style.color = 'white';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!(editingIndex !== null && editingIndex !== index)) {
                                      e.currentTarget.style.background = 'transparent';
                                      e.currentTarget.style.color = '#3498db';
                                    }
                                  }}
                                >
                                  <i className="fas fa-edit" style={{fontSize: '10px'}}></i>
                                  Edit
                                </button>

                                <button
                                  onClick={() => handleDeleteDoc(entry, index)}
                                  disabled={editingIndex !== null && editingIndex !== index}
                                  style={{
                                    background: 'transparent',
                                    color: '#e74c3c',
                                    border: '1px solid #e74c3c',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    cursor: editingIndex !== null && editingIndex !== index ? 'not-allowed' : 'pointer',
                                    opacity: editingIndex !== null && editingIndex !== index ? 0.5 : 1,
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                  }}
                                  title="Delete"
                                  onMouseEnter={(e) => {
                                    if (!(editingIndex !== null && editingIndex !== index)) {
                                      e.currentTarget.style.background = '#e74c3c';
                                      e.currentTarget.style.color = 'white';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!(editingIndex !== null && editingIndex !== index)) {
                                      e.currentTarget.style.background = 'transparent';
                                      e.currentTarget.style.color = '#e74c3c';
                                    }
                                  }}
                                >
                                  <i className="fas fa-trash" style={{fontSize: '10px'}}></i>
                                  Delete
                                </button>
                              </div>
                            </td>

                            {/* Save column - Only Save button */}
                            {Registeredit?.RegistrationId && (
                              <td style={{
                                padding: '10px 8px',
                                textAlign: 'center'
                              }}>
                                <button
                                  onClick={() => handleSaveDoc(entry, index)}
                                  disabled={editingIndex !== null && editingIndex !== index}
                                  style={{
                                    background: editingIndex === index ? '#27ae60' : 'transparent',
                                    color: editingIndex === index ? 'white' : '#27ae60',
                                    border: '1px solid #27ae60',
                                    padding: '5px 12px',
                                    borderRadius: '4px',
                                    cursor: editingIndex !== null && editingIndex !== index ? 'not-allowed' : 'pointer',
                                    opacity: editingIndex !== null && editingIndex !== index ? 0.5 : 1,
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    margin: '0 auto'
                                  }}
                                  title="Save"
                                  onMouseEnter={(e) => {
                                    if (!(editingIndex !== null && editingIndex !== index)) {
                                      e.currentTarget.style.background = '#27ae60';
                                      e.currentTarget.style.color = 'white';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!(editingIndex !== null && editingIndex !== index)) {
                                      e.currentTarget.style.background = editingIndex === index ? '#27ae60' : 'transparent';
                                      e.currentTarget.style.color = editingIndex === index ? 'white' : '#27ae60';
                                    }
                                  }}
                                >
                                  <i className="fas fa-check" style={{fontSize: '10px'}}></i>
                                  Save
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        <div></div>

        <br />
        {AppointmentRegisType === "RADIOLOGY" && (
          <>
            <div className="DivCenter_container">RADIOLOGY VISIT</div>

            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  Visit Type<span>:</span>
                </label>

                <input
                  type="text"
                  name="radiologyvisit"
                  value={radiologyvisit}
                  onChange={(e) => setradiologyvisit(e.target.value)}
                />
              </div>

              <div className="RegisForm_1">
                <label>
                  Doctor<span>:</span>
                </label>

                <select
                  name="radiologydoctor"
                  value={radiologydoctor}
                  onChange={(e) => setradiologydoctor(e.target.value)}
                >
                  <option value="">Select Doctor</option>
                  {Array.isArray(AllDoctorData) &&
                    AllDoctorData.map((val, idx) => (
                      <option key={idx} value={val.id}>
                        {val.Name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </>
        )}

        <br />

        {AppointmentRegisType === "LAB" && (
          <>
            <div className="DivCenter_container">LAB VISIT</div>

            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  Visit Type<span>:</span>
                </label>
                <input
                  type="text"
                  name="labvisit"
                  value={labvisit}
                  onChange={(e) => setlabvisit(e.target.value)}
                />
              </div>

              <div className="RegisForm_1">
                <label>
                  Doctor<span>:</span>
                </label>

                <select
                  name="Labdoctor"
                  value={labdoctor}
                  onChange={(e) => setlabdoctor(e.target.value)}
                >
                  <option value="">Select Doctor</option>
                  {Array.isArray(AllDoctorData) &&
                    AllDoctorData.map((val, idx) => (
                      <option key={idx} value={val.id}>
                        {val.Name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </>
        )}

        {AppointmentRegisType === "LAB" && type === "Addtest" && (
          <>
            <div className="DivCenter_container">LAB</div>
            <br />
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label className="" htmlFor="TestName">
                  Test Name <span className="mandatory"></span>
                  <span>:</span>
                </label>

                <input
                  id="TestName"
                  name="Name"
                  list="browsers1"
                  onChange={handleInputChange}
                  value={formData?.Name}
                  required
                  autoComplete="off"
                  placeholder={
                    Array.isArray(TestNameList) && TestNameList.length > 0
                      ? "Select Test"
                      : "No Test available"
                  }
                  disabled={
                    Array.isArray(TestNameList) && TestNameList.length === 0
                  }
                />
                <datalist id="browsers1">
                  {TestNameList && TestNameList.length > 0 ? (
                    TestNameList.map((item) => (
                      <option
                        key={item.Code}
                        value={`${item.Name} | ${item.Type} | ${item.Code} `}
                      >
                        {item.Name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No tests available
                    </option>
                  )}
                </datalist>
              </div>

              <button onClick={handleAddTest}>
                <PlaylistAddIcon />
              </button>

              <div className="RegisForm_1">
                <Button onClick={() => openModal()}>
                  <VisibilityIcon />
                </Button>
              </div>

              {Array.isArray(SelectedTest) && SelectedTest.length > 0 && (
                <div className="Main_container_app">
                  <ReactGrid columns={Testlistcolumns} RowData={SelectedTest} />
                </div>
              )}

              {Array.isArray(SelectedTest) && SelectedTest.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div className="RegisForm_1">
                    <label>
                      Remarks<span>:</span>
                    </label>
                    <textarea
                      name="Remarks"
                      value={formData.Remarks}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {openModal2 && (
          <div className="loader" onClick={handleCloseModal1}>
            <div className="cardModel" onClick={(e) => e.stopPropagation()}>
              <div className="Main_container_app">
                <h3>Test Names</h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    placeItems: "center",
                    gap: "15px",
                    padding: "0px 15px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <div className="con_1">
                      <div className="inp_1">
                        <label htmlFor="input">
                          Test Name <span>:</span>
                        </label>
                        <input
                          type="text"
                          value={searchQuery}
                          placeholder="Enter Test Name"
                          onChange={(e) => handleSearchlabChange(e, "name")}
                        />
                      </div>
                    </div>
                  </div>

                  {Array.isArray(filteredTestList) &&
                    filteredTestList.length > 0 ? (
                    filteredTestList.map((test, index) => (
                      <div key={index}>
                        <label
                          htmlFor={`test-${index}`}
                          style={{
                            gap: "15px",
                            padding: "10px",
                          }}
                        >
                          <input
                            type="checkbox"
                            name="testArray"
                            id={`test-${index}`}
                            value={`${test.Name} | ${test.Type}`}
                            checked={isChecked(test)}
                            onChange={(e) => handleCheckboxChange(e, test)}
                          />
                          {test.Name}
                        </label>
                        <span>{test.Amount}</span>
                      </div>
                    ))
                  ) : (
                    <div className="Add_items_Purchase_Master">
                      <span>No Test Found</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      {AppointmentRegisType === "RADIOLOGY" && (
        <div className="displayuseraccess">
          <div
            className="DivCenter_container"
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Radiology
          </div>
      
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <tbody>
              {TestNames.map((item) => {
                const isExpanded = expandedRadiologyIds.includes(item.id);
                const chunks = [];
                for (let i = 0; i < item.TestNames.length; i += 7) {
                  chunks.push(item.TestNames.slice(i, i + 7));
                }
      
                return (
                  <React.Fragment key={item.id}>
                    {/* Radiology Name row */}
                    <tr
                      onClick={() => toggleRadiology(item.id)}
                      style={{
                        backgroundColor: "lightgrey",
                        cursor: "pointer",
                      }}
                    >
                      <td
                        colSpan={7}
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          fontSize: "14px",
                          border: "1px solid #ccc",
                        }}
                      >
                        {item.RadiologyName}{" "}
                        <span style={{ float: "right", fontWeight: "normal" }}>
                          {isExpanded ? "▲ Hide tests" : "▼ Show tests"}
                        </span>
                      </td>
                    </tr>
      
                    {/* Test rows (7 per row) */}
                    {isExpanded && chunks.length > 0
                      ? chunks.map((chunk, chunkIndex) => (
                          <tr key={`${item.id}-${chunkIndex}`}>
                            {chunk.map((test) => (
                              <td
                                key={test.id}
                                style={{
                                  padding: "6px",
                                  border: "1px solid #ccc",
                                  textAlign: "left",
                                  width: "14.2%", // 100% / 7
                                }}
                              >
                                <div>{test.TestName}</div>
                                <div style={{ textAlign: "center", marginTop: "4px" }}>
                                  <input
                                    type="checkbox"
                                    id={test.id}
                                    onChange={() =>
                                      handleCheckboxSubtestNo(
                                        test.Curr_Amount,
                                        test.id,
                                        test.TestName,
                                        item.id,
                                        item.RadiologyName,
                                        test.TestCode
                                      )
                                    }
                                    checked={SubtestNo.some(
                                      (checkedItem) =>
                                        checkedItem.TestCode === test.TestCode
                                    )}
                                    style={{ width: "14px", height: "14px" }}
                                  />
                                </div>
                              </td>
                            ))}
                            {/* Fill blank cells if less than 7 */}
                            {chunk.length < 7 &&
                              [...Array(7 - chunk.length)].map((_, i) => (
                                <td
                                  key={`empty-${chunkIndex}-${i}`}
                                  style={{ border: "1px solid #ccc" }}
                                ></td>
                              ))}
                          </tr>
                        ))
                      : isExpanded && (
                          <tr>
                            <td
                              colSpan={7}
                              style={{ padding: "6px", border: "1px solid #ccc" }}
                            >
                              No test available
                            </td>
                          </tr>
                        )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
        {transformedFavouriteData1.length > 0 && (
          <>
            <div className="common_center_tag">
              <span>Selected Test Name</span>
            </div>

            <div className="RegisFormcon_1 jjxjx_">
              <ReactGrid
                columns={IndivitualColumns}
                RowData={transformedFavouriteData1}
              />
            </div>
          </>
        )}

        {AppointmentRegisType === "MHC" && (
          <>
            <div className="DivCenter_container">MHC VISIT</div>

            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  Visit Type<span>:</span>
                </label>
                <input
                  type="text"
                  name="MHCvisit"
                  value={MHCvisit}
                  onChange={(e) => setMHCvisit(e.target.value)}
                />
              </div>

              <div className="RegisForm_1">
                <label>
                  Doctor<span>:</span>
                </label>

                <select
                  name="MHCdoctor"
                  value={MHCdoctor}
                  onChange={(e) => setMHCdoctor(e.target.value)}
                >
                  <option value="">Select Doctor</option>
                  {Array.isArray(AllDoctorData) &&
                    AllDoctorData.map((val, idx) => (
                      <option key={idx} value={val.id}>
                        {val.Name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </>
        )}

        {AppointmentRegisType === "MHC" && (
          <>
            <div className="DivCenter_container">MASTER HEALTH CARE</div>
            <br />

            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  Package Name<span>:</span>
                </label>

                <input
                  name="Packagename"
                  value={Packagename.pkgname}
                  onChange={handlepkgchange}
                  list="SubCategoryNameList"
                />

                <datalist id="SubCategoryNameList">
                  {Array.isArray(packages) &&
                    packages.map((f, i) => (
                      <option
                        key={i}
                        value={`${f.id}|${f.PackageName}`}
                      ></option>
                    ))}
                </datalist>
              </div>
            </div>
          </>
        )}

        {selectedPackage && (
          <div>
            <h3>Selected Package: {selectedPackage.PackageName}</h3>

            <div className="RegisFormcon_1 jjxjx_">
              <ReactGrid columns={pkgColumns} RowData={selectedServices} />
            </div>
          </div>
        )}

        {AppointmentRegisType === "DAYCARE" && (
          <>
            <div className="DivCenter_container">DAY CARE</div>

            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  Visit Type<span>:</span>
                </label>
                <input
                  type="text"
                  name="MHCvisit"
                  value="WALK-IN"
                //   onChange={(e) => setMHCvisit(e.target.value)}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Doctor<span>:</span>
                </label>

                <select
                  name="daycaredoctor"
                  value={daycaredoctor}
                  onChange={(e) => setdaycaredoctor(e.target.value)}
                >
                  <option value="">Select Doctor</option>
                  {Array.isArray(AllDoctorData) &&
                    AllDoctorData.map((val, idx) => (
                      <option key={idx} value={val.id}>
                        {val.Name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </>
        )}

        {AppointmentRegisType === "DAYCARE" && (
          <>
            <div className="DivCenter_container">DAY CARE</div>

            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  Daycare<span>:</span>
                </label>

                <select
                  name="Daycare"
                  value={Daycare}
                  onChange={(e) => setDaycare(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Therapy">Therapy</option>
                  <option value="Procedure">Procedures</option>
                </select>
              </div>

              <div className="RegisForm_1">
                <label>
                  Daycare service<span>:</span>
                </label>

                <input
                  name="Daycareservice"
                  value={Daycareservices.dcname}
                  onChange={handledcchange}
                  list={
                    Daycare === "Therapy"
                      ? "Daycaretherapy"
                      : "Daycareprocedure"
                  }
                />

                <datalist id="Daycareprocedure">
                  {Array.isArray(Daycareprocedure) &&
                    Daycareprocedure.map((f, i) => (
                      <option
                        key={i}
                        value={`${f.id}|${f.ProcedureName}`}
                      ></option>
                    ))}
                </datalist>

                <datalist id="Daycaretherapy">
                  {Array.isArray(Daycaretherapy) &&
                    Daycaretherapy.map((f, i) => (
                      <option
                        key={i}
                        value={`${f.id}|${f.TherapyName}`}
                      ></option>
                    ))}
                </datalist>
              </div>

              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={handledaycareadd}
              >
                <LoupeIcon />
              </button>
            </div>
          </>
        )}

        {selecteddaycare.length > 0 && (
          <div>
            <div className="RegisFormcon_1 jjxjx_">
              <ReactGrid columns={daycarecol} RowData={selecteddaycare} />
            </div>
          </div>
        )}

        {AppointmentRegisType === "SERVICES" && (
          <>
            <div className="DivCenter_container">GENERAL SERVICES</div>

            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  Visit Type<span>:</span>
                </label>
                <input
                  type="text"
                  name="MHCvisit"
                  value="WALK-IN"
                //   onChange={(e) => setMHCvisit(e.target.value)}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Doctor<span>:</span>
                </label>

                <select
                  name="servicesdoctor"
                  value={servicesdoctor}
                  onChange={(e) => setservicesdoctor(e.target.value)}
                >
                  <option value="">Select Doctor</option>
                  {Array.isArray(AllDoctorData) &&
                    AllDoctorData.map((val, idx) => (
                      <option key={idx} value={val.id}>
                        {val.Name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </>
        )}

        {AppointmentRegisType === "SERVICES" && (
          <>
            <div className="DivCenter_container">GENERAL SERVICES</div>

            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  Service Category<span>:</span>
                </label>

                <input
                    autoComplete="off"
                    type="text"
                    name="ServiceCategory"
                    list="servicecategorylist"    
                    value={ServiceProcedure?.ServiceCategory || ""}
                    onChange={HandleOnchangeService}
                  />
                    <datalist id="servicecategorylist">
                     

                          {Array.isArray(category) && category.map((row, index) => (
                    <option key={index} value={`${row.service_category_id}|${row.service_name}`}
 />
                  ))}
                    </datalist>
              </div>

              <div className="RegisForm_1">
                <label>
                  Service Sub Category<span>:</span>
                </label>

                <input
                    autoComplete="off"
                    type="text"
                    name="ServiceSubCategory"
                    list="ServiceSubCategorylist"    
                    value={ServiceProcedure?.ServiceSubCategory || ""}
                    onChange={HandleOnchangeService}
                  />
                    <datalist id="ServiceSubCategorylist">
                      {Array.isArray(subcategory) && subcategory.map((row, index) => (
                    <option key={index} value={`${row.pk}|${row.ServiceName}`}
                      />
                  ))}
                    </datalist>
              </div>

              <div className="RegisForm_1">
                <label>
                  Quantity<span>:</span>
                </label>

                <input
                    autoComplete="off"
                    type="text"
                    name="Quantity"
                    value={ServiceProcedure?.Quantity || ""}
                    onChange={HandleOnchangeService}
                  />
                    
              </div>

              <div className="RegisForm_1">
                <label>
                  Rate<span>:</span>
                </label>

                <input
                    autoComplete="off"
                    type="text"
                    name="Rate"
                    value={ServiceProcedure?.Rate || ""}
                    onChange={HandleOnchangeService}
                  />
                    
              </div>

              

            

              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={handledayGSadd}
              >
                <LoupeIcon />
              </button>
            </div>
          </>
        )}

        {/* 
        {selecteddaycare.length > 0 && (

          <div>


            <div className="RegisFormcon_1 jjxjx_">
              <ReactGrid columns={daycarecol} RowData={selecteddaycare} />
            </div>



          </div>
        )} */}

        <div className="Main_container_Btn">
          <button
            onClick={handleSaveClick}
            className={`px-4 py-2 rounded ${UserData?.Create
              ? "bg-blue-500 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            {Registeredit?.RegistrationId ? "Update" : "Save"}
          </button>
          {/* <button
          // onClick={handleOpenModal}
            className={`px-4 py-2 rounded ${UserData?.Create
            ? "bg-blue-500 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
          Barcode
          </button>
          <button
            className={`px-4 py-2 rounded ${UserData?.Create
            ? "bg-blue-500 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
           Fee
          </button> */}
        </div>
      </div>
      {loading && (
        <div className="loader">
          <div className="Loading">
            <div className="spinner-border"></div>
            <div>Loading...</div>
          </div>
        </div>
      )}


        {showDeleteConfirmation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setShowDeleteConfirmation(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md max-w-md-22"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
            Are you sure you want to delete {deleteDocName}?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                No
              </button>
              <button
                onClick={handleDeleteEvent}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {openModal3 && (
        <div className="sideopen_showcamera_profile">
          <div className="newwProfiles" onClick={(e) => e.stopPropagation()}>
            <h2>{openModal3}</h2>
            {getModalContent()}
            <div className="Main_container_Btn">
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      <ToastAlert Message={toast.message} Type={toast.type} />


      {Exisitingvisitdetails?.length > 0 &&  (AppointmentRegisType === 'OP') && (
          <>
            <div className="DivCenter_container">OLD Visit </div>
            <ReactGrid columns={visitListColumn} RowData={Exisitingvisitdetails} />
          </>
        )}

  {Serviceaddedlist?.length > 0 && (
            <>
              <div className="DivCenter_container">Added Services </div>
              <ReactGrid columns={ServiceListColumn} RowData={Serviceaddedlist} />
            </>
          )}

    {PreVisitedDoctors?.length > 0 &&  (AppointmentRegisType === 'OP') && (
          <>
      <ReactGrid columns={DoctorsListColumn} RowData={PreVisitedDoctors} />
          </>
        )}

      
      

      {/* {RegisterRoomShow.val && <RoomDetialsSelect />} */}
      <br />
    </>
  );
};

export default OPRegistration;
