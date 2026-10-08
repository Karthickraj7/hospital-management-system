import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./IP_DischargeSummary.css";
import SignatureCanvas from "react-signature-canvas";
import { useReactToPrint } from "react-to-print";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../../OtherComponent/ToastContainer/ToastAlert";

const PrintContent = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} id="reactprintcontent">
      {props.children}
    </div>
  );
});

const IP_DischargeSummary = () => {
  const printRef = useRef();
  const [pages, setPages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const dispatch = useDispatch();

  const UserData = useSelector((state) => state.userRecord?.UserData);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log(UserData, 'UserData');

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );

  console.log(IP_DoctorWorkbenchNavigation, "IP_DoctorWorkbenchNavigation");

  // const RadiologyWorkbenchNavigation = useSelector(state => state.Frontoffice?.RadiologyWorkbenchNavigation);
  const RadiologyWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.RadiologyWorkbenchNavigation
  );

  console.log(RadiologyWorkbenchNavigation, "RadiologyWorkbenchNavigation");

  const pagewidth = useSelector((state) => state.userRecord?.pagewidth);

  const [AssesmentData, setAssesmentData] = useState([]);
  const [AllergyData, setAllergyData] = useState([]);
  const [HospitalClinicDetails, setHospitalClinicDetails] = useState([]);
  const [Prescription, setPrescription] = useState([]);

  const [InchargeDetailsData, setInchargeDetailsData] = useState([]);

  console.log(InchargeDetailsData, "InchargeDetailsData");

  const [PrescriptionData, setPrescriptionData] = useState([]);
  console.log(PrescriptionData, "PrescriptionData");

  const [DamaData, setDamaData] = useState([]);
  const [DoctorData, setDoctorData] = useState([]);
  const [RadiologyData, setRadiologyData] = useState([]);
  const [LabData, setLabData] = useState([]);
  const [DrugNameData, setDrugNameData] = useState([]);
  const [selectedDrugName, setSelectedDrugName] = useState("");
  const [Dose, setDose] = useState([]);
  const [Frequency, setFrequency] = useState([]);
  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();



  const [DischargeSummarySavedData, setDischargeSummarySavedData] = useState(
    []
  );

  console.log(DrugNameData, "DrugNameData");
  console.log(selectedDrugName, "selectedDrugName");
  console.log(Dose, "Dose");
  console.log(Frequency, "Frequency");
  console.log(DischargeSummarySavedData, "DischargeSummarySavedData");

  const [currentDate, setCurrentDate] = useState("");

  const [finalDiagnosis, setFinalDiagnosis] = useState("");
  const [presentingComplaints, setPresentingComplaints] = useState("");
  const [PastMedicalHistory, setPastMedicalHistory] = useState("");
  const [AllergyHistory, setAllergyHistory] = useState("");
  const [vitals, setVitals] = useState("");
  const [Radiology, setRadiology] = useState("");
  const [dischargeNotes, setDischargeNotes] = useState("");
  const [Referdoctor, setReferdoctor] = useState("");
  const [ConditionOnDischarge, setConditionOnDischarge] = useState("");
  const [PrescriptionSummary, setPrescriptionSummary] = useState("");
  const [Followup, setFollowup] = useState({
    Followupid: "",
    NoOfDays: "",
    TimeInterval: "days",
    Date: "",
  });
  const [DietAdvice, setDietAdvice] = useState("");
  const [Emergency, setEmergency] = useState("");
  const [AdviceOnDischarge, setAdviceOnDischarge] = useState("");
  const [doctorSchedule, setDoctorSchedule] = useState("");
  const [HospitalDetails, setHospitalDetails] = useState("");
  const [treatmentGiven, setTreatmentGiven] = useState("");
  const [Lab, setLab] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [ShowPrintBtn, setShowPrintBtn] = useState(false);
  const componentRef = useRef();
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);

  const Finddays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [rows, setRows] = useState([
    {
      ItemId: "",
      drugName: "",
      strength: "",
      frequencyId: "",
      frequency: "",
      route: "",
      mealRelation: "",
      duration: "",
      durationType: "Days",
    }
  ]);

  console.log(rows,'rows')

  // const handleChange = (index, field, value) => {
  //   console.log(value,'value');

  //   const newRows = [...rows];
  //   newRows[index][field] = value;
  //   setRows(newRows);
  // };


  // const handleChange = (e, index, field) => {

  //   const { name, value } = e.target;
  //   console.log(value, 'value');
  //   console.log(name, 'name');

  //   if (name === "drugName") {
  //     const SelectedDrug = DrugNameData.find((item) => item.ItemName === value);
      
  //     setSelectedDrugName(SelectedDrug ? SelectedDrug.ItemId : ""); // ✅ Store selected ItemName
  //     console.log('tcjhj', SelectedDrug.ItemId);
  //     axios
  //       .get(`${UrlLink}Workbench/Item_Types_Link`, {
  //         params: {
  //           Itemid: SelectedDrug.ItemId
  //         },
  //       })
  //       .then((res) => {
  //         const ress = res.data;
  //         console.log(ress, 'ress----')
  //         setDose(ress);
  //       })
  //       .catch((err) => {
  //         console.log("Error fetching Dose:", err);
  //       });

  //   }

  //   const newRows = [...rows];
  //   newRows[index][field] = value;
  //   setRows(newRows);
  // };



  // const handleChange = (e, index, field) => {
  //   const { name, value } = e.target;
  //   console.log(value, 'value');
  //   console.log(name, 'name');
  
  //   const newRows = [...rows];
  
  //   if (name === "drugName") {
  //     const SelectedDrug = DrugNameData.find((item) => item.ItemName === value);
  
      

  //     setSelectedDrugName(SelectedDrug ? SelectedDrug.ItemId : ""); // Store selected ID
  //     newRows[index]['drugName'] = value; // Set drug name in the row
  
  //     // Reset and clear current strength
  //     newRows[index]['strength'] = '';
  //     newRows[index]['ItemId'] = SelectedDrug ? SelectedDrug.ItemId : '';


  //     if (SelectedDrug) {
  //       axios
  //         .get(`${UrlLink}Workbench/Item_Types_Link`, {
  //           params: {
  //             Itemid: SelectedDrug.ItemId
  //           },
  //         })
  //         .then((res) => {
  //           const ress = res.data;
  //           console.log(ress, 'ress----');
  
  //           // 🧠 Assume res.data has a field like `strength`, update the current row
  //           const strengthValue = ress.strength || ress[0]?.strength || ""; // adjust as per actual response
  
  //           newRows[index]['strength'] = strengthValue;
  //           setRows(newRows); // Update rows with strength
  //           setDose(ress); // (optional) store for dropdown or other uses
  //         })
  //         .catch((err) => {
  //           console.log("Error fetching Dose:", err);
  //         });
  //     } else {
  //       setRows(newRows); // Update rows anyway if no SelectedDrug found
  //     }
  //   } else {
  //     newRows[index][field] = value;
  //     setRows(newRows);
  //   }
  // };



  const handleChange = (e, index, field) => {
    const { name, value } = e.target;
    console.log(value, 'value');
    console.log(name, 'name');
  
    const newRows = [...rows];
  
    if (name === "drugName") {
      const SelectedDrug = DrugNameData.find((item) => item.ItemName === value);
  
      // Set drug name and clear strength
      newRows[index]['drugName'] = value;
      newRows[index]['strength'] = '';
      newRows[index]['ItemId'] = SelectedDrug ? SelectedDrug.ItemId : '';
  
      setSelectedDrugName(SelectedDrug ? SelectedDrug.ItemId : '');
  
      console.log(SelectedDrug,'SelectedDrug');
      
      if (SelectedDrug) {
        axios
          .get(`${UrlLink}Workbench/Item_Types_Link`, {
            params: {
              Itemid: SelectedDrug.ItemId
            },
          })
          .then((res) => {
            const ress = res.data;
            console.log(ress, 'ress----');
  
            const strengthValue = ress.strength || ress[0]?.strength || ""; // update if field is different
            newRows[index]['strength'] = strengthValue;
            setRows(newRows);
            setDose(ress);
          })
          .catch((err) => {
            console.log("Error fetching Dose:", err);
            setRows(newRows); // Still update rows even if request fails
          });
      } else {
        setRows(newRows); // No drug found, update row anyway
      }
    } 
    
    else {
      newRows[index][field] = value;
      setRows(newRows);
    }

    if (name === "frequency") {
      const selectedFrequency = Frequency.find((item) => item.Frequency === value);
      newRows[index]['frequencyId'] = selectedFrequency ? selectedFrequency.Frequency_Id : '';
    }
  };
  
  
  const addRow = () => {
    setRows([
      ...rows,
      { drugName: "", strength: "", frequency: "", route: "", mealRelation: "", duration: "",durationType: "Days" }
    ]);
    setDose([]); 
    setSelectedDrugName("");

  };

  const deleteRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  const handleFollowupInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "NoOfDays") {
      const numberOfDays = parseInt(value, 10);
      const timeInterval = Followup.TimeInterval;

      let totalDaysToAdd = 0;

      if (timeInterval === "days") {
        totalDaysToAdd = numberOfDays || 0;
      } else if (timeInterval === "weeks") {
        totalDaysToAdd = (numberOfDays || 0) * 7;
      } else if (timeInterval === "months") {
        const currentDate = new Date();
        const newDate = new Date(
          currentDate.setMonth(currentDate.getMonth() + (numberOfDays || 0))
        );
        const formattedDate = newDate.toISOString().split("T")[0];

        setFollowup((prevData) => ({
          ...prevData,
          NoOfDays: value,
          Date: formattedDate,
          TimeInterval: timeInterval, // Ensure the interval is stored
        }));
        return;
      }

      const newDate = new Date();
      newDate.setDate(newDate.getDate() + totalDaysToAdd);
      const formattedDate = newDate.toISOString().split("T")[0];

      setFollowup((prevData) => ({
        ...prevData,
        NoOfDays: value,
        Date: formattedDate,
        TimeInterval: timeInterval, // Ensure the interval is stored
      }));
    } else if (name === "TimeInterval") {
      const currentNoOfDays = parseInt(Followup.NoOfDays, 10) || 0;
      let totalDaysToAdd = 0;

      if (value === "days") {
        totalDaysToAdd = currentNoOfDays;
      } else if (value === "weeks") {
        totalDaysToAdd = currentNoOfDays * 7;
      } else if (value === "months") {
        const currentDate = new Date();
        const newDate = new Date(
          currentDate.setMonth(currentDate.getMonth() + currentNoOfDays)
        );
        const formattedDate = newDate.toISOString().split("T")[0];

        setFollowup((prevData) => ({
          ...prevData,
          TimeInterval: value,
          Date: formattedDate,
        }));
        return;
      }

      const newDate = new Date();
      newDate.setDate(newDate.getDate() + totalDaysToAdd);
      const formattedDate = newDate.toISOString().split("T")[0];

      setFollowup((prevData) => ({
        ...prevData,
        TimeInterval: value,
        Date: formattedDate,
      }));
    } else if (name === "Date") {
      const selectedDate = new Date(value);
      const currentDate = new Date();
      const timeDiff = selectedDate - currentDate;

      if (timeDiff >= 0) {
        const monthsDiff =
          (selectedDate.getFullYear() - currentDate.getFullYear()) * 12 +
          (selectedDate.getMonth() - currentDate.getMonth());
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        let timeInterval = "days";

        if (monthsDiff > 0) {
          timeInterval = "months";
          setFollowup((prevData) => ({
            ...prevData,
            NoOfDays: monthsDiff.toString(),
            Date: value,
            TimeInterval: timeInterval,
          }));
        } else if (daysDiff >= 7) {
          timeInterval = "weeks";
          setFollowup((prevData) => ({
            ...prevData,
            NoOfDays: Math.ceil(daysDiff / 7).toString(),
            Date: value,
            TimeInterval: timeInterval,
          }));
        } else {
          timeInterval = "days";
          setFollowup((prevData) => ({
            ...prevData,
            NoOfDays: daysDiff.toString(),
            Date: value,
            TimeInterval: timeInterval,
          }));
        }
      } else {
        setFollowup((prevData) => ({
          ...prevData,
          NoOfDays: "",
          Date: value,
          TimeInterval: "", // Reset TimeInterval if the date is in the past
        }));
      }
    } else {
      setFollowup((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    // Get the current date
    const today = new Date();

    // Format the date (e.g., 'MM/DD/YYYY' or 'DD/MM/YYYY')
    const formattedDate = `${today.getMonth() + 1
      }/${today.getDate()}/${today.getFullYear()}`;

    // Set the formatted date to state
    setCurrentDate(formattedDate);
  }, []);

  const [PatientDischargeData, setPatientDischargeData] = useState([]);
  console.log(PatientDischargeData, "PatientDischargeData");
  const [expanded, setExpanded] = useState(false);

  const handleAccordionClick = () => {
    setExpanded(!expanded); // Toggle the expanded state when accordion is clicked
  };

  const signatureRef = useRef(null);

  const clearSignature = () => {
    signatureRef.current.clear();
  };

  const saveSignature = () => {
    console.log("Signature saved");
  };

  const fetchDischargeSummary = useCallback(() => {
    const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;
    const doctorId = IP_DoctorWorkbenchNavigation?.DoctorId;
    const PatientID = IP_DoctorWorkbenchNavigation?.PatientId;
    const VisitID = IP_DoctorWorkbenchNavigation?.RegistrationId;

    if (RegistrationId) {
      // Check if data exists for the given RegistrationId
      axios
        .get(`${UrlLink}Ip_Workbench/IP_DischargeSummary_Details_Link`, {
          params: {
            RegistrationId,
            DepartmentType: departmentType,
          },
        })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            // If data exists, set the state with backend data
            const dischargeDetails = res.data[0]; // Assuming you want the first result
            setDischargeSummarySavedData(dischargeDetails);
            console.log("Discharge Details from backend:", dischargeDetails);
            setShowPrintBtn(true);
            setFinalDiagnosis(dischargeDetails.FinalDiagnosis);
            setPresentingComplaints(dischargeDetails.PresentingComplaints);
            setPastMedicalHistory(dischargeDetails.PastMedicalHistory);
            setVitals(dischargeDetails.Vitals);
            setTreatmentGiven(dischargeDetails.DischargeNotes);
            setAllergyHistory(dischargeDetails.AllergyHistory);
            setDischargeNotes(dischargeDetails.DischargeNotes);
            setReferdoctor(dischargeDetails.Referdoctor);
            setConditionOnDischarge(dischargeDetails.ConditionOnDischarge);
            setDietAdvice(dischargeDetails.DietAdvice);
            setEmergency(dischargeDetails.Emergency);
            setAdviceOnDischarge(dischargeDetails.AdviceOnDischarge);
            setDoctorSchedule(dischargeDetails.DoctorSchedule);
            setRadiology(dischargeDetails.Radiology);
            // setPrescriptionSummary(dischargeDetails.PrescriptionSummary);
            setFollowup((prevFollowup) => ({
              ...prevFollowup,
              NoOfDays: dischargeDetails.NoOfDays,
              TimeInterval: dischargeDetails.TimeInterval,
              Date: dischargeDetails.Date,
            }));

            const mappedRows = dischargeDetails.PrescriptionData.map((item) => ({
              ItemId: item.ItemId,
              drugName: item.ItemName,
              strength: item.Dose,
              frequencyId: item.FrequencyId, 
              frequency: item.Frequency,
              route: item.Route,
              mealRelation: item.mealRelation,
              duration: item.DurationNumber,
              durationType: item.DurationUnit,
            }));

            setRows(mappedRows);



          } else {
            // If no data exists, fetch assessment details
            // fetchAssessmentDetails(RegistrationId, departmentType);
            // fetchAllergyDetails(RegistrationId, departmentType);
            // fetchProgressNotesDetails(RegistrationId, departmentType);
            // fetchDamaDetails(RegistrationId, departmentType);
            // fetchInchargeAndReferDocDetails(RegistrationId, departmentType);
            // fetchDoctorSchedule(Doctor);

            fetchAdditionalData(
              RegistrationId,
              departmentType,
              doctorId,
              PatientID,
              VisitID
            );
          }
        })
        .catch((err) => {
          console.log("Error fetching discharge details:", err);
        });
    }
  }, [UrlLink, IP_DoctorWorkbenchNavigation]);

  const fetchAdditionalData = (
    RegistrationId,
    departmentType,
    doctorId,
    PatientID,
    VisitID
  ) => {
    fetchAssessmentDetails(RegistrationId, departmentType);
    fetchAllergyDetails(RegistrationId, departmentType);
    fetchProgressNotesDetails(RegistrationId, departmentType);
    fetchDamaDetails(RegistrationId, departmentType);
    fetchInchargeAndReferDocDetails(RegistrationId, departmentType);
    fetchDoctorSchedule(doctorId);
    fetchPrescriptionData(PatientID, VisitID);
  };


  useEffect(() => {
    if (!UserData?.location) return;

    axios
      .get(`${UrlLink}Workbench/Nurse_Item_Names_Details_all_Link`, {
        params: {
          Location: UserData.location,
        },
      })
      .then((res) => {
        const ress = res.data;
        setDrugNameData(ress);
      })
      .catch((err) => {
        console.log("Error fetching Nurse Item Names:", err);
      });
  }, [UrlLink, UserData?.location]);


  useEffect(() => {
    if (!selectedDrugName) return;

    axios
      .get(`${UrlLink}Workbench/Item_Types_Link`, {
        params: {
          Itemid: selectedDrugName
        },
      })
      .then((res) => {
        const ress = res.data;
        console.log(ress, 'ress----')
        setDose(ress);
      })
      .catch((err) => {
        console.log("Error fetching Dose:", err);
      });
  }, [UrlLink]);


  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/insert_frequency_masters`)
      .then((res) => {
        const ress = res.data;
        console.log(ress, 'ress----')
        setFrequency(ress);
      })
      .catch((err) => {
        console.log("Error fetching Dose:", err);
      });
  }, [UrlLink]);


  const fetchAssessmentDetails = (RegistrationId, departmentType) => {
    axios
      .get(`${UrlLink}Ip_Workbench/IP_Assesment_details_Link`, {
        params: {
          RegistrationId,
          DepartmentType: departmentType,
        },
      })
      .then((res) => {
        const ress = res.data;
        console.log("Assessment Data:", ress);
        setAssesmentData(ress);
      })
      .catch((err) => {
        console.log("Error fetching assessment details:", err);
      });
  };

  const fetchAllergyDetails = (RegistrationId, departmentType) => {
    axios
      .get(`${UrlLink}Ip_Workbench/IP_Allergy_Details_Link`, {
        params: {
          RegistrationId,
          DepartmentType: departmentType,
        },
      })
      .then((res) => {
        const ress = res.data;
        console.log("Assessment Data:", ress);
        setAllergyData(ress);
      })
      .catch((err) => {
        console.log("Error fetching assessment details:", err);
      });
  };

  const fetchProgressNotesDetails = (RegistrationId, departmentType) => {
    axios
      .get(`${UrlLink}Ip_Workbench/IP_ProgressNotes_Details_Link`, {
        params: {
          RegistrationId,
          DepartmentType: departmentType,
        },
      })
      .then((res) => {
        console.log(res.data, "Prescription");
        setPrescriptionData(res.data);
      })
      .catch((err) => {
        console.log("Error fetching prescription details:", err);
      });
  };

  const fetchDamaDetails = (RegistrationId, departmentType) => {
    axios
      .get(`${UrlLink}Ip_Workbench/IP_Dama_Details_Link`, {
        params: {
          RegistrationId,
          DepartmentType: departmentType,
          Type: "Nurse",
        },
      })
      .then((res) => {
        setDamaData(res.data);
      })
      .catch((err) => {
        console.log("Error fetching DAMA details:", err);
      });
  };

  const fetchInchargeAndReferDocDetails = (RegistrationId, departmentType) => {
    axios
      .get(`${UrlLink}Ip_Workbench/IP_InchargeAndRefer_Details_Link`, {
        params: {
          RegistrationId,
          DepartmentType: departmentType,
          Type: "Refer",
        },
      })
      .then((res) => {
        setInchargeDetailsData(res.data || []);
      })
      .catch((err) => {
        console.log("Error fetching Refer a doctor details:", err);
      });
  };

  const fetchDoctorSchedule = (doctorId) => {
    if (!doctorId) return;

    axios
      .get(`${UrlLink}Masters/get_DoctorSchedule_details`, {
        params: { DoctorId: doctorId },
      })
      .then((response) => {
        const schedule = response.data.DoctorScheduleForm.Schedule || [];
        console.log(schedule, "Doctor details");

        // Update raw data
        setDoctorData(schedule);

        // Format and update schedule for display
        const formattedSchedule = schedule
          .filter((item) => item.working === "yes") // Filter for working days
          .map(
            (item) =>
              `${item.days}: ${item.starting_time} to ${item.ending_time}`
          ) // Format schedule
          .join("\n"); // Join for display

        setDoctorSchedule(formattedSchedule);
      })
      .catch((error) => {
        console.error("Error fetching doctor schedule:", error);
      });
  };

  const fetchPrescriptionData = (PatientID, VisitID) => {
    axios
      .get(`${UrlLink}DrugAdminstrations/get_prescription_forIP_Discharge`, {
        params: {
          PatientID,
          VisitID,
        },
      })
      .then((res) => {
        console.log("Prescription Data:", res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPrescription(res.data); // Assuming `setPrescription` is defined elsewhere
        }
      })
      .catch((err) => {
        console.error("Error fetching prescription data:", err);
      });
  };

  useEffect(() => {
    axios
      .get(
        `${UrlLink}DrugAdminstrations/get_prescription_forIP_Discharge?PatientID=${IP_DoctorWorkbenchNavigation?.PatientId}&VisitID=${IP_DoctorWorkbenchNavigation.RegistrationId}`
      )
      .then((res) => {
        console.log("111111111", res.data);

        setPrescription(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [UrlLink, IP_DoctorWorkbenchNavigation]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((res) => {
        setHospitalClinicDetails(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [UrlLink, IP_DoctorWorkbenchNavigation]);

  const handleDiagnosisChange = (event) => {
    setFinalDiagnosis(event.target.value);
    adjustHeight(event);
  };

  useEffect(() => {
    if (AssesmentData.length > 0) {
      const latestFinalDiagnosis =
        AssesmentData[AssesmentData.length - 1].FinalDiagnosis;
      setFinalDiagnosis(latestFinalDiagnosis);

      const latestAssessment = AssesmentData[AssesmentData.length - 1];

      console.log(latestAssessment, "latestAssessment");

      // Set presenting complaints
      const presentingComplaintsData =
        `PresentingComplaints : ${latestAssessment.PresentingComplaints}  ,  ` +
        `DetailsPresentingComplaints : ${latestAssessment.DetailsPresentingComplaints}`;
      // ` ${latestAssessment.HistoryOf}`
      console.log("presentingComplaintsData", presentingComplaintsData);

      setPresentingComplaints(presentingComplaintsData);

      const medicalHistoryArray =
        latestAssessment.MedicalHistoryCheckbox.split(",");
      const surgicalHistoryArray =
        latestAssessment.SurgicalHistoryCheckbox.split(",");
      const socialHistoryArray =
        latestAssessment.SocialHistoryCheckbox.split(",");
      const familyHistoryArray =
        latestAssessment.FamilyHistoryCheckbox.split(",");

      const pastmedicalhistory = `
      Medical History: ${medicalHistoryArray.join(", ")}
      Surgical History: ${surgicalHistoryArray.join(", ")}
      Social History: ${socialHistoryArray.join(", ")}
      Family History: ${familyHistoryArray.join(", ")}
      `;

      // Set the state
      setPastMedicalHistory(pastmedicalhistory);

      // Log the value
      console.log(pastmedicalhistory, "PastMedicalHistory");

      // Set vitals
      const vitalsData =
        `Temperature: ${latestAssessment.Temperature}  ` +
        `PulseRate: ${latestAssessment.PulseRate}  ` +
        `SPO2: ${latestAssessment.SPO2}  ` +
        `HeartRate: ${latestAssessment.HeartRate}  ` +
        `RR: ${latestAssessment.RR}  ` +
        `BP: ${latestAssessment.BP}  ` +
        `Height: ${latestAssessment.Height}  ` +
        `Weight: ${latestAssessment.Weight}  ` +
        `BMI: ${latestAssessment.BMI}  ` +
        `WC: ${latestAssessment.WC}  ` +
        `HC: ${latestAssessment.HC}  ` +
        `BSL: ${latestAssessment.BSL}` +
        `Cvs: ${latestAssessment.Cvs}` +
        `Pupil: ${latestAssessment.Pupil}` +
        `Ul Rt: ${latestAssessment.UlRt}, Ul Lt: ${latestAssessment.UlLt}, ` +
        `Ll Rt: ${latestAssessment.LlRt}, Ll Lt: ${latestAssessment.LlLt}, ` +
        `Rt: ${latestAssessment.Rt}, Lt: ${latestAssessment.Lt} ` +
        `Rs: ${latestAssessment.Rs} ` +
        `Pa: ${latestAssessment.Pa} ` +
        `Cns: ${latestAssessment.Cns}`;
      setVitals(vitalsData);

      // Set treatment given
      setTreatmentGiven(latestAssessment.TreatmentGiven);
    }
  }, [AssesmentData]);

  useEffect(() => {
    if (AllergyData.length > 0) {
      // Format each allergy item with Allergent and AllergyType
      const formattedAllergyList = AllergyData.map(
        (item) =>
          `Allergent: ${item.Allergent} AllergyType: ${item.AllergyType}`
      );

      setAllergyHistory(formattedAllergyList.join("\n"));
    } else {
      setAllergyHistory("No allergies recorded.");
    }
  }, [AllergyData]);

  useEffect(() => {
    if (InchargeDetailsData.length > 0) {
      const referDoctorList = InchargeDetailsData.map(
        (item) => `${item.DoctorName} (${item.Speciality})`
      ).join("\n\n");
      setReferdoctor(referDoctorList);
    }
  }, [InchargeDetailsData]);

  useEffect(() => {
    let combinedNotes = "";

    // Get the last element from DamaData if available
    if (DamaData.length > 0) {
      const lastDama = DamaData[DamaData.length - 1];
      const damaNotes = `Reasons for DAMA: ${lastDama.Reasons}\n\n`;
      combinedNotes += `${damaNotes}`;
    }

    // Get the last element from PrescriptionData if available
    if (PrescriptionData.length > 0) {
      const lastPrescription = PrescriptionData[PrescriptionData.length - 1];
      const notes = `
      ProgressNotes: ${lastPrescription.ProgressNotes}
      TreatmentNotes: ${lastPrescription.TreatmentNotes}`;
      combinedNotes += notes;
    }

    setDischargeNotes(combinedNotes);
  }, [PrescriptionData, DamaData]);

  useEffect(() => {
    if (HospitalClinicDetails.length > 0) {
      const HospitalNo = HospitalClinicDetails.map((item) => item.PhoneNo);
      setHospitalDetails(HospitalNo);
    }
  }, [HospitalClinicDetails]);

  // useEffect(() => {
  //   if (Prescription.length > 0) {
  //     const summary = Prescription.map((item) => ({
  //       DrugName: item.GenericName,
  //       Strength: item.Strength,
  //       Frequency: item.Frequency,
  //       Route: item.Route,
  //       MealRelation: item.FrequencyMethod,
  //       Duration: item.Duration,
  //     }));
  //     setPrescriptionSummary(summary);
  //   }
  // }, [Prescription]);

  useEffect(() => {
    if (Prescription && Prescription.length > 0) {
      const summary =
        Array.isArray(Prescription) &&
        Prescription?.map((item) => ({
          DrugName: item.GenericName,
          Strength: item.Strength,
          Frequency: item.Frequency,
          Route: item.Route,
          MealRelation: item.FrequencyMethod, // Assuming 'FrequencyMethod' is MealRelation
          Duration: item.Duration,
        }));
      setPrescriptionSummary(summary); // This will hold the summary details
    }
  }, [Prescription]);

  useEffect(() => {
    if (RadiologyData.length > 0) {
      const allRadiologyDetails =
        Array.isArray(RadiologyData) &&
        RadiologyData.map((entry, index) => {
          return (
            `Date: ${entry.ReportDate || "N/A"}  ` +
            `Test Name: ${entry.TestName || "N/A"}  ` +
            `SubTest Name: ${entry.SubTestName || "N/A"}  ` +
            `Report: ${entry.Report || "No report available"}  \n`
          );
        }).join(""); // Combine all records into one string

      setRadiology(allRadiologyDetails); // Update state with the formatted details
    }
  }, [RadiologyData]);

  useEffect(() => {
    if (LabData.length > 0) {
      const LabReportDetails =
        Array.isArray(LabData) &&
        LabData.map((entry) => {
          return (
            `Date: ${entry.report_date || "N/A"}  ` +
            `Test Name: ${entry.test_name || "N/A"}  ` +
            `Value: ${entry.value || "N/A"}  \n`
          );
        }).join("");
      setLab(LabReportDetails);
    }
  }, [LabData]);

  const LabColumns = [
    {
      key: "id",
      name: "S.No",
      frozen: true,
    },

    {
      key: "test_name",
      name: "test_name",
      frozen: true,
    },

    {
      key: "value",
      name: "value",
    },

    {
      key: "report_date",
      name: "report_date",
    },
    {
      key: "report_time",
      name: "report_time",
    },
  ];

  const prepareTableData = () => {
    const tableData = {};
    const uniqueDates = new Set();

    LabData.forEach((item) => {
      const { report_date, test_name, value } = item;

      // Add the date to the uniqueDates set
      uniqueDates.add(report_date);

      // Initialize the row for test_name if it doesn't exist
      if (!tableData[test_name]) {
        tableData[test_name] = {};
      }

      // Assign the value for the test_name and report_date
      tableData[test_name][report_date] = value || "N/A"; // Set 'N/A' if value is empty
    });

    return { tableData, uniqueDates: Array.from(uniqueDates) };
  };

  // Prepare tableData and uniqueDates
  const { tableData, uniqueDates } = prepareTableData();

  useEffect(() => {
    axios
      .get(`${UrlLink}Ip_Workbench/IP_DischargeRequest_Details_Link`, {
        params: {
          RegistrationId: IP_DoctorWorkbenchNavigation?.RegistrationId,
        },
      })
      .then((res) => {
        const ress = res.data;
        console.log(ress, "resssss");
        setPatientDischargeData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    if (IP_DoctorWorkbenchNavigation?.pk) {
      // Ensure pk exists
      const params = {
        Register_Id: IP_DoctorWorkbenchNavigation.pk,
        RegisterType: "IP",
      };

      axios
        .get(`${UrlLink}OP/Radiology_Complete_Details_Link`, { params })
        .then((res) => {
          const ress = res.data;
          console.log("Response Data:", ress);
          setRadiologyData(ress); // Update state with the response
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  }, [UrlLink, IP_DoctorWorkbenchNavigation?.pk]); // Add pk to the dependency array

  useEffect(() => {
    // Define the params object to include RegistrationId
    const params = {
      Register_Id: IP_DoctorWorkbenchNavigation?.RegistrationId,
      RegisterType: "IP",
    };

    axios
      .get(`${UrlLink}OP/lab_report_details_view`, { params })
      .then((res) => {
        console.log("Response Lab Report:", res.data);

        // Extract report date
        const rawReportDate = res.data.lab_report_entry.report_date;
        const rawReportTime = res.data.lab_report_entry.report_time;
        const dateObject = new Date(rawReportDate);
        const formattedDate = dateObject.toISOString().split("T")[0]; // "YYYY-MM-DD"

        // Combine individual tests and favorite tests
        const combinedTests = [
          ...res.data.individual_tests.map((test, idx) => ({
            id: idx + 1, // Add index for S.No
            test_name: test.test_name,
            value: test.value || "N/A",
            report_date: formattedDate,
            report_time: rawReportTime,
          })),
          ...res.data.favourite_tests.map((fav, idx) => ({
            id: res.data.individual_tests.length + idx + 1, // Continue the S.No after individual tests
            test_name: fav.test_name,
            value: fav.value || "N/A",
            report_date: formattedDate,
            report_time: rawReportTime,
          })),
        ];

        // Update state with combined tests
        setLabData(combinedTests);

        console.log("Combined Tests:", combinedTests);
      })
      .catch((err) => {
        console.error("Error fetching lab report details:", err);
      });
  }, [UrlLink, IP_DoctorWorkbenchNavigation?.RegistrationId]);

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
  //   @page {
  //     size: auto;
    
  
  //     @bottom-center {
  //       content: 'Page ' counter(page) ' of ' counter(pages);
  //       text-align: center;
  //       font-size: 10.5px;
  //       font-family: Arial, sans-serif;
  //       font-style: italic;
  //    margin-bottom: 100px !important;
    
  //     }
  //   }
  // `,
    onAfterPrint: async () => {
      // Additional action after printing, if needed
    },
  });

  const Submitalldata = () => {
    setIsPrintButtonVisible(false);
    setTimeout(() => {
      handlePrint2();
      setIsPrintButtonVisible(true); // Resetting print button visibility
    }, 800);
  };

  const handleClear = () => {
    setFinalDiagnosis("");
    setPresentingComplaints("");
    setPastMedicalHistory("");
    setAllergyHistory("");
    setVitals("");
    setRadiology("");
    setDischargeNotes("");
    setReferdoctor("");
    setConditionOnDischarge("");
    // setPrescriptionSummary('');
    // setFollowup('');
    setFollowup({
      NoOfDays: "",
      TimeInterval: "",
      Date: "",
    });
    setDietAdvice("");
    setEmergency("");
    setAdviceOnDischarge("");
    setDoctorSchedule("");
  };

  const handleDischargeSummarySubmit = () => {
    const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    const DepartmentType = IP_DoctorWorkbenchNavigation?.RequestType;

    if (!RegistrationId) {
      dispatch({
        type: "toast",
        value: { message: "Registration ID is missing", type: "error" },
      });
      return;
    }

    console.log(IP_DoctorWorkbenchNavigation?.RegistrationId);

    const senddata = {
      finalDiagnosis,
      presentingComplaints,
      PastMedicalHistory,
      AllergyHistory,
      vitals,
      Radiology,
      dischargeNotes,
      Referdoctor,
      ConditionOnDischarge,
      PrescriptionSummary,
      ...Followup,
      Prescription:rows,
      
      DietAdvice,
      Emergency,
      AdviceOnDischarge,
      doctorSchedule,
      RegistrationId,
      DepartmentType,
      Createdby: userRecord?.username,
    };

    // Remove newline characters
    const cleanedData = Object.fromEntries(
      Object.entries(senddata).map(([key, value]) => [
        key,
        typeof value === "string" ? value.replace(/\n/g, " ") : value,
      ])
    );

    console.log("Cleaned data:", cleanedData);

    axios
      .post(
        `${UrlLink}Ip_Workbench/IP_DischargeSummary_Details_Link`,
        cleanedData
      )
      .then((res) => {
        const [type, message] = [
          Object.keys(res.data)[0],
          Object.values(res.data)[0],
        ];
        dispatch({ type: "toast", value: { message, type } });
        handleClear();
        fetchDischargeSummary();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchDischargeSummary();
  }, [fetchDischargeSummary]);

  const adjustHeight = (e) => {
    e.target.style.height = "auto"; // Reset height to calculate scrollHeight
    e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight
  };

  return (
    <>
      {isPrintButtonVisible ? (
        <>
          {/* <div className="Main_container_app"> */}
          {/* Patient Details */}

          <br />

          {/* Final Diagnosis */}

          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot wedje_98i">
              <label htmlFor="finalDiagnosis">
                FINAL DIAGNOSIS<span>:</span>{" "}
              </label>
              <textarea
                name="finalDiagnosis"
                id="finalDiagnosis"
                value={finalDiagnosis}
                onChange={handleDiagnosisChange}
                style={{
                  overflow: "hidden",
                  resize: "none",
                  minHeight: "60px",
                }}
              />
            </div>

            <div className="text_adjust_mt_Ot wedje_98i">
              <label>
                {" "}
                PRESENTING HISTORY <span>:</span>{" "}
              </label>

              <textarea
                name="presentingComplaints"
                id="presentingComplaints"
                value={presentingComplaints}
                onChange={(e) => {
                  setPresentingComplaints(e.target.value);
                  adjustHeight(e);
                }}
                style={{
                  overflow: "hidden",
                  resize: "none",
                  minHeight: "60px",
                }}
              />
            </div>
          </div>

          <br />
          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot wedje_98i">
              <label htmlFor="PastMedicalHistory">
                PAST MEDICAL HISTORY<span>:</span>{" "}
              </label>
              <textarea
                name="PastMedicalHistory"
                id="PastMedicalHistory"
                value={PastMedicalHistory}
                onChange={(e) => {
                  setPastMedicalHistory(e.target.value);
                  adjustHeight(e);
                }}
                style={{
                  overflow: "hidden",
                  resize: "none",
                  minHeight: "60px",
                }}
              />
            </div>
          </div>
          <br />
          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot wedje_98i">
              <label htmlFor="AllergyHistory">
                DRUG ALLERGIES<span>:</span>{" "}
              </label>
              <textarea
                name="AllergyHistory"
                id="AllergyHistory"
                value={AllergyHistory}
                onChange={(e) => {
                  setAllergyHistory(e.target.value);
                  adjustHeight(e);
                }}
                style={{
                  overflow: "hidden",
                  resize: "none",
                  minHeight: "60px",
                }}
              />
            </div>
          </div>

          {/* On Admission Examination */}
          <br />
          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot wedje_98i">

              <label> ON EXAMINATION<span>:</span></label>


              <textarea
                name="OnAdmissionExamination"
                id="OnAdmissionExamination"
                value={vitals}
                onChange={(e) => {
                  setVitals(e.target.value);
                  adjustHeight(e);
                }}
                style={{
                  overflow: "hidden",
                  resize: "none",
                  minHeight: "60px",
                }}
              />
            </div>
          </div>

          <br />
          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot wedje_98i">
              <label> Radiology Details<span>:</span></label>

              <textarea
                name="RadiologyDetails"
                id="RadiologyDetails"
                value={Radiology}
                onChange={(e) => {
                  setRadiology(e.target.value);
                  adjustHeight(e);
                }}
                style={{
                  overflow: "hidden",
                  resize: "none",
                  minHeight: "60px",
                }}
              />
            </div>
          </div>

          {/* Lab Details */}

          {/* <div className="RegisFormcon_1">

            <div className="Otdoctor_intra_Con_2_New0">
              <div className="common_center_tag">
                <span>Lab Details</span>
              </div>
              
              <textarea
                name="LabDetails"
                id="LabDetails"
                value={Lab}
                onChange={(e) => setLab(e.target.value)}
                rows={10} // Optional: Adjust rows for better display
                style={{ width: '100%' }} // Optional: Full width textarea
              />
              

            </div> 


          </div> */}

          {/* <div className="RegisFormcon_1">
            <div className="Otdoctor_intra_Con_2_New0">
                <div className="common_center_tag">
                    <span>Lab Details</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Test Name</th>
                            <th>Value</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {LabData.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.test_name || 'N/A'}</td>
                                <td>{entry.value || 'N/A'}</td>
                                <td>{entry.report_date || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div> */}

          <div className="RegisFormcon_1">
            <div className="Otdoctor_intra_Con_2_New0">
              <div className="common_center_tag">
                <span>Lab Details</span>
              </div>
              {LabData.length >= 0 && (
                <ReactGrid columns={LabColumns} RowData={LabData} />
              )}
            </div>
          </div>
          <br />
          {/* <div className="RegisFormcon_1">
            <div className="Otdoctor_intra_Con_2_New0">
                <div className="common_center_tag">
                    <span>Lab Details</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
        <thead>
            <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>Test Name</th>
                {uniqueDates.map((date, index) => (
                    <th key={index} style={{ border: '1px solid black', padding: '8px' }}>{date}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {Object.keys(tableData).map((testName, index) => (
                <tr key={index}>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{testName}</td>
                    {uniqueDates.map((date, idx) => (
                        <td key={idx} style={{ border: '1px solid black', padding: '8px' }}>
                            {tableData[testName][date] || 'N/A'}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>

            </div>
        </div> */}

          {/* <div className="RegisFormcon_1">
            <div className="Otdoctor_intra_Con_2_New0">
                <div className="common_center_tag">
                    <span>Lab Details</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Test Name</th>
                            {uniqueDates.map(date => (
                                <th key={date}>{date}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(tableData).map(([test_name, dates]) => (
                            <tr key={test_name}>
                                <td>{test_name}</td>
                                {uniqueDates.map(date => (
                                    <td key={date} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                                        {dates[date] !== undefined ? dates[date] : '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div> */}

          {/* Treatment Given */}

          {/* <div className='Otdoctor_intra_Con'>
            <div className='text_adjust_mt_Ot wedje_98i'>
              <label htmlFor='treatmentGiven'>
                TREATMENT GIVEN <span>:</span>{' '}
              </label>
              <textarea
                name='treatmentGiven'
                id='treatmentGiven'
                value={treatmentGiven}
                onChange={e => setTreatmentGiven(e.target.value)}
              />
            </div>
          </div> */}

          {/* Prescription - Progress Notes */}
          {/* Course in Ward */}

          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot wedje_98i">
              <label> COURSE IN THE HOSPITAL
                <span>:</span>
              </label>

              <textarea
                name="notes"
                id="notes"
                value={dischargeNotes}
                onChange={(e) => {
                  setDischargeNotes(e.target.value);
                  adjustHeight(e);
                }}
                style={{
                  overflow: "hidden",
                  resize: "none",
                  minHeight: "60px",
                }}
              />
            </div>
          </div>
          <br />

          {/* refer a doctor / cross consultant  */}

          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot wedje_98i">
              <label htmlFor="Referdoctor">
                CROSS CONSULTATION <span>:</span>{" "}
              </label>
              <textarea
                name="Referdoctor"
                id="Referdoctor"
                value={Referdoctor}
                onChange={(e) => {
                  setReferdoctor(e.target.value);
                  adjustHeight(e);
                }}
                style={{
                  overflow: "hidden",
                  resize: "none",
                  minHeight: "60px",
                }}
              />
            </div>
          </div>

          {/* Condition on Discharge */}
          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot wedje_98i">
              <label htmlFor="ConditionDischarge">
                CONDITION AT DISCHARGE <span>:</span>{" "}
              </label>

              <textarea
                name="ConditionDischarge"
                id="ConditionDischarge"
                value={ConditionOnDischarge}
                onChange={(e) => {
                  setConditionOnDischarge(e.target.value);
                  adjustHeight(e);
                }}
                style={{
                  overflow: "hidden",
                  resize: "none",
                  minHeight: "60px",
                }}
              />
            </div>
          </div>

          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot wedje_98i">
              <label htmlFor="PrescriptionSummary">
                DISCHARGE MEDICATIONS<span>:</span>
              </label>

              <div className="Selected-table-container">
                <table className="selected-medicine-table2">
                  <thead>
                    <tr>
                      <th>Drug Name</th>
                      <th>Strength</th>
                      <th>Frequency</th>
                      <th>Route</th>
                      <th>Relationship with Meal</th>
                      <th>Duration</th>
                      <th>      <button onClick={addRow}><AddCircleOutlineIcon /></button>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.length > 0 ? (
                      rows.map((row, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              name="drugName"
                              list={`drugList_${index}`}
                              value={row.drugName}
                              autoComplete="off"
                              onChange={(e) => handleChange(e, index, 'drugName')}
                            />
                            <datalist id={`drugList_${index}`}>
                              {Array.isArray(DrugNameData) &&
                                DrugNameData.map((item, idx) => (
                                  <option key={idx} value={item.ItemName}>
                                    {`${item.ItemId} | MRP: ${item.MRP} | Av.Qty : ${item.AvailableQuantity}`}
                                  </option>
                                ))}
                            </datalist>
                          </td>


                          <td>

                            <input
                              type="text"
                              name="strength"
                              list={`strength_${index}`}
                              value={row.strength}
                              autoComplete="off"
                              onChange={(e) => handleChange(e, index, 'strength')}
                            />
                            <datalist id={`strength_${index}`}>
                              {Array.isArray(Dose) &&
                                Dose.map((item, idx) => (
                                  <option key={idx} value={item.Dose}>
                                    {`ProductTypeId: ${item.ProductTypeId} | ProductTypeName: ${item.ProductTypeName}`}
                                  </option>
                                ))}
                            </datalist>


                          </td>

                          <td>

                            <input
                              type="text"
                              name="frequency"
                              list={`frequency_${index}`}
                              value={row.frequency}
                              autoComplete="off"
                              onChange={(e) => handleChange(e, index, 'frequency')}
                            />
                            <datalist id={`frequency_${index}`}>
                              {Array.isArray(Frequency) &&
                                Frequency.filter(item => item.Status === "Active").map((item, idx) => (
                                  <option key={idx} value={item.Frequency}>
                                    {`Name: ${item.FrequencyName} | Type: ${item.FrequencyType} | Time: ${item.FrequencyTime}`}
                                  </option>
                                ))}
                            </datalist>


                          </td>
                          <td>
                            <select
                              name="route"
                              value={row.route}
                              onChange={(e) => handleChange(e, index, 'route')}

                            >
                              <option value="">Select</option>
                              <option value="IV-Direct"> IV-Direct</option>
                              <option value="IV-Infusion"> IV-Infusion</option>
                              <option value="Intramuscular">Intramuscular</option>
                              <option value="Subcutaneous">Subcutaneous</option>
                              <option value="Sublingual">Sublingual </option>
                              <option value="Rectal">Rectal</option>
                              <option value="Oral">Oral</option>
                              <option value="Inhalational">Inhalational</option>
                              <option value="Nasal">Nasal</option>
                            </select>

                          </td>
                          <td>

                            <input
                              type="text"
                              name="mealRelation"
                              list={`mealRelation${index}`}
                              value={row.mealRelation}
                              autoComplete="off"
                              onChange={(e) => handleChange(e, index, 'mealRelation')}
                            />
                            <datalist id={`mealRelation${index}`}>
                              {Array.isArray(Frequency) &&
                                Frequency.filter(item => item.Status === "Active").map((item, idx) => (
                                  <option key={idx} value={item.FrequencyType}>
                                    {`Name: ${item.FrequencyName} | Time: ${item.FrequencyTime}`}
                                  </option>
                                ))}
                            </datalist>


                          </td>
                          <td>
                            <input
                              name="duration"
                              type="number"
                              onKeyDown={blockInvalidChar}
                              style={{ width: "50px" }}
                              value={row.duration}
                              autoComplete="off"
                              onChange={(e) => handleChange(e, index, 'duration')}
                            />
                            <select
                              name="durationType"
                              style={{ width: "110px" }}
                              value={row.durationType}
                              onChange={(e) => handleChange(e, index, 'durationType')}
                            >
                              <option value="Days">Days</option>
                              <option value="Weeks">Weeks</option>
                              <option value="Months">Months</option>
                            </select>
                          </td>

                          <td>
                            <button onClick={() => deleteRow(index)}><DeleteIcon /></button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center" }}>
                          No prescription data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* <button onClick={handleSave}>Save</button> */}
              </div>
            </div>
          </div>

          {/* Follow Up  */}

          {/* <div className='Otdoctor_intra_Con'>
            <div className='text_adjust_mt_Ot wedje_98i'>
              <label htmlFor='Followup'>
                Follow Up<span>:</span>{' '}
              </label>

              <textarea name='Followup' id='Followup' />
            </div>
          </div> */}

          {/* <div className='Otdoctor_intra_Con'>
            <div className='Otdoctor_intra_Con_2_input'>
              <label htmlFor='followupDate'>
                Followup Date <span>:</span>
              </label>
              <input type='date' id='followupDate' name='followupDate' />
            </div>
          </div>
          <br /> */}
          <br />

          <div className="RegisFormcon">
            <div className="RegisForm_1">
              <label>
                After <span>:</span>
              </label>
              <input
                name="NoOfDays"
                id="NoOfDays"
                type="number"
                value={Followup.NoOfDays}
                className="dura_with2"
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                onChange={handleFollowupInputChange}
              />
              <select
                name="TimeInterval"
                id="TimeInterval"
                value={Followup.TimeInterval} // Add this to your state
                onChange={handleFollowupInputChange}
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>

            <div className="RegisForm_1">
              <label>
                Date <span>:</span>
              </label>
              <input
                name="Date"
                type="date"
                value={Followup.Date}
                onChange={handleFollowupInputChange}
              />
            </div>

            <div className="RegisForm_1">
              <span
                style={{
                  color: ["Sunday", "Saturday"].includes(
                    Finddays[new Date(Followup.Date).getDay()]
                  )
                    ? "red"
                    : "",
                }}
              >
                {Finddays[new Date(Followup.Date).getDay()]}
              </span>
            </div>
          </div>
          <br />
          {/* Advise on Discharge  */}

          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot wedje_98i">
              <label htmlFor="DietAdvice">
                DIET ADVICE<span>:</span>{" "}
              </label>

              <textarea
                name="DietAdvice"
                id="DietAdvice"
                value={DietAdvice}
                onChange={(e) => {
                  setDietAdvice(e.target.value);
                  adjustHeight(e);
                }}
                style={{
                  overflow: "hidden",
                  resize: "none",
                  minHeight: "60px",
                }}
              />
            </div>
          </div>
          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot wedje_98i">
              <label htmlFor="DietAdvice">
                PLEASE COME TO EMERGENCY IF YOU HAVE<span>:</span>{" "}
              </label>

              <textarea
                name="Emergency"
                id="Emergency"
                value={Emergency}
                onChange={(e) => {
                  setEmergency(e.target.value);
                  adjustHeight(e);
                }}
                style={{
                  overflow: "hidden",
                  resize: "none",
                  minHeight: "60px",
                }}
              />
            </div>
          </div>

          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot wedje_98i">
              <label htmlFor="AdviseonDischarge">
                ADVICE ON DISCHARGE<span>:</span>{" "}
              </label>

              <textarea
                name="AdviseonDischarge"
                id="AdviseonDischarge"
                value={AdviceOnDischarge}
                onChange={(e) => {
                  setAdviceOnDischarge(e.target.value);
                  adjustHeight(e);
                }}
                style={{
                  overflow: "hidden",
                  resize: "none",
                  minHeight: "60px",
                }}
              />
            </div>
          </div>

          {/* Dcotors Schedule  */}
          {/* mam says dont want this part so i commented  */}


          {/* <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot wedje_98i">
              <label htmlFor="doctorSchedule ">
                DOCTOR SCHEDULE <span>:</span>{" "}
              </label>

              <textarea
                name="doctorSchedule"
                id="doctorSchedule"
                value={doctorSchedule} // Use doctorSchedule here
                onChange={(e) => {
                  setDoctorSchedule(e.target.value);
                  adjustHeight(e);
                }} // Optional: If you want users to edit
                style={{
                  overflow: "hidden",
                  resize: "none",
                  minHeight: "60px",
                }}
              />
            </div>
          </div> */}

           {/* mam says dont want this part so i commented  */}

          {/* Advise on Discharge  */}

          {/* <div className='Otdoctor_intra_Con'>
            <div className='text_adjust_mt_Ot wedje_98i'>
              <label htmlFor='OtherClinic'>
                Other Clinic OPD Contact<span>:</span>{' '}
              </label>

              <textarea name='OtherClinic' id='OtherClinic' />
            </div>
          </div>
          <br /> */}

          <div className="RegisForm_1 signature-align">
            <div className="">
              <div>
                <SignatureCanvas
                  ref={signatureRef}
                  penColor="black"
                  canvasProps={{
                    width: 190,
                    height: 100,
                    className: "sigCanvas2",
                  }}
                />
              </div>
              <h5
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "5px",
                }}
              >
                Signature
              </h5>

              <div className="Register_btn_con">
                <button
                  className="RegisterForm_1_btns"
                  onClick={clearSignature}
                >
                  Clear
                </button>
                <button className="RegisterForm_1_btns" onClick={saveSignature}>
                  Save
                </button>
              </div>
            </div>
          </div>
          <br />
          <br />

          {isPrintButtonVisible && (
            <div className="Main_container_Btn">
              <button onClick={handleDischargeSummarySubmit}>
                {ShowPrintBtn ? "Update" : "Submit"}
              </button>

              <button onClick={Submitalldata}>Print</button>
            </div>
          )}

          {/* 
      <div className="Main_container_Btn">
          <button onClick={handlePrint2}>Print</button>
      </div> */}
          {/* </div> */}
        </>
      ) : (
        <>
          {/* Patient Details */}

          {/* {pages.map((pageContent, pageIndex) => ( */}

          <PrintContent
            ref={componentRef}
            // key={pageIndex}
            style={{
              // marginTop: "50px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              className="Print_ot_all_div edewdedw_89j"
              id="reactprintcontent"
            >
              <div className="print_dischrge_sum" ref={printRef}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <div>
                      <div className="paymt-fr-mnth-slp">
                        <div className="logo-pay-slp">
                          <img alt="" />
                        </div>

                        <div>
                          <h2>{/* {clinicName} ({location}) */}</h2>
                        </div>
                      </div>
                    </div>

                    <div className="patient_basic_details_print">
                      <div className="align_label_print_head">
                        <div className="align_label_print">
                          <label htmlFor="PatientName">
                            Patient Name <span>:</span>{" "}
                          </label>
                          <h5 htmlFor="PatientName">
                            {IP_DoctorWorkbenchNavigation?.PatientName}
                          </h5>
                        </div>

                        <div className="align_label_print">
                          <label htmlFor="Age">
                            Age <span>:</span>{" "}
                          </label>
                          <h5 htmlFor="Age">
                            {IP_DoctorWorkbenchNavigation?.Age}
                          </h5>
                        </div>

                        <div className="align_label_print">
                          <label htmlFor="Age">
                            Gender <span>:</span>{" "}
                          </label>
                          <h5 htmlFor="Gender">
                            {IP_DoctorWorkbenchNavigation?.Gender}
                          </h5>
                        </div>

                        <div className="align_label_print">
                          <label htmlFor="BedNo">
                            Bed No <span>:</span>{" "}
                          </label>
                          <h5 htmlFor="BedNo">
                            {IP_DoctorWorkbenchNavigation?.BedNo}
                          </h5>
                        </div>

                        <div className="align_label_print">
                          <label htmlFor="Age">
                            PhoneNo <span>:</span>{" "}
                          </label>
                          <h5 htmlFor="PhoneNo">
                            {IP_DoctorWorkbenchNavigation?.PhoneNo}
                          </h5>
                        </div>

                        <div className="align_label_print">
                          <label htmlFor="Address">
                            Address <span>:</span>{" "}
                          </label>
                          <h5 htmlFor="Address">
                            {IP_DoctorWorkbenchNavigation?.Address}
                          </h5>
                        </div>
                      </div>

                      <div className="align_label_print_head">
                        <div className="align_label_print">
                          <label htmlFor="RegistrationId">
                            In Patient No <span>:</span>{" "}
                          </label>
                          <h5 htmlFor="RegistrationId">
                            {IP_DoctorWorkbenchNavigation?.RegistrationId}
                          </h5>
                        </div>

                        <div className="align_label_print">
                          <label htmlFor="CurrDate">
                            Admit Date <span>:</span>{" "}
                          </label>
                          <h5 htmlFor="CurrDate">
                            {IP_DoctorWorkbenchNavigation?.CurrDate}
                          </h5>
                        </div>

                        <div className="align_label_print">
                          <label htmlFor="CurrTime">
                            Time <span>:</span>{" "}
                          </label>
                          <h5 htmlFor="CurrTime">
                            {IP_DoctorWorkbenchNavigation?.CurrTime}
                          </h5>
                        </div>

                        <div className="align_label_print">
                          <label htmlFor="CurrDate">
                            Discharge date <span>:</span>{" "}
                          </label>
                          <h5 htmlFor="CurrDate">{currentDate}</h5>
                        </div>

                        <div className="align_label_print">
                          <label htmlFor="DoctorName">
                            Primary Dr Name <span>:</span>{" "}
                          </label>
                          <h5 htmlFor="DoctorName">
                            {IP_DoctorWorkbenchNavigation?.DoctorName}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </thead>

                  <tbody>
                    <tr className="">
                      <td className="text_adjust_ppd8">
                        <label htmlFor="finalDiagnosis">FINAL DIAGNOSIS</label>
                        <p>{DischargeSummarySavedData.FinalDiagnosis}</p>
                      </td>

                      <td className="text_adjust_ppd8">
                        <label> PRESENTING HISTORY</label>

                        <p>{DischargeSummarySavedData.PresentingComplaints}</p>
                      </td>
                      <td className="text_adjust_ppd8">
                        <label> PAST MEDICAL HISTORY</label>

                        <p>{DischargeSummarySavedData.PastMedicalHistory}</p>
                      </td>
                      <td className="text_adjust_ppd8">
                        <label> DRUG ALLERGIES </label>

                        <p>{DischargeSummarySavedData.AllergyHistory}</p>
                      </td>

                      <td className="text_adjust_ppd8">
                        <label> ON EXAMINATION</label>

                        <p>{DischargeSummarySavedData.Vitals}</p>
                      </td>

                      {/* <td className='text_adjust_ppd8'>
                        <label htmlFor='finalDiagnosis'>Treatment Given</label>
                        <p
                         
                          >{treatmentGiven}
                        </p>
                      </td> */}

                      <td className="text_adjust_ppd8">
                        <label> COURSE IN WARD</label>

                        <p>{DischargeSummarySavedData.DischargeNotes}</p>
                      </td>

                      <td className="text_adjust_ppd8">
                        <label> CROSS CONSULTATION </label>

                        <p>{DischargeSummarySavedData.Referdoctor}</p>
                      </td>

                      <td className="text_adjust_ppd8">
                        <label htmlFor="ConditionDischarge">
                          CONDITION AT DISCHARGE
                        </label>

                        <p>{DischargeSummarySavedData.ConditionOnDischarge}</p>
                      </td>

                      {/* {rows.length > 0 && (
                        <td className="text_adjust_ppd8">
                          <label htmlFor="ConditionDischarge">
                            DISCHARGE MEDICATIONS
                          </label>
  
                          <div className="table-container-pp09">
                            <div className="table-rowcc header">
                              <div className="table-cellcv">Drug Name</div>
                              <div className="table-cellcv">Strength</div>
                              <div className="table-cellcv">Frequency</div>
                              <div className="table-cellcv">Route</div>
                              <div className="table-cellcv">Relationship with Meal</div>
                              <div className="table-cellcv">Duration</div>
                            </div>
  
                            {rows.length > 0 ? (
                              rows.map((row, index) => (
                                <div className="table-rowcc" key={index}>
                                  <div className="table-cellcv">
                                    <input
                                      type="text"
                                      value={row.drugName}
                                    />
                                  </div>
                                  <div className="table-cellcv">
                                    <input
                                      type="text"
                                      value={row.strength}
                                    />
                                  </div>
                                  <div className="table-cellcv">
                                    <input
                                      type="text"
                                      value={row.frequency}
                                    />
                                  </div>
                                  <div className="table-cellcv">
                                    <input
                                      type="text"
                                      value={row.route}
                                    />
                                  </div>
                                  <div className="table-cellcv">
                                    <input
                                      type="text"
                                      value={row.mealRelation}
                                    />
                                  </div>
                                  <div className="table-cellcv">
  
                                    <input
                                      type="text"
                                      // value={`${row.duration || ''} ${row.durationType || ''}`}
                                      value={`${row.duration} ${row.durationType?.charAt(0).toUpperCase() + row.durationType?.slice(1) || ''}`
  }                                  
                                    />
                                    
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="table-row no-datad">
                                <div className="table-cellcv" style={{ textAlign: "center" }} colSpan={6}>
                                  No prescription data available.
                                </div>
                              </div>
                            )}
                          </div>
  
                        </td>
                        
                      )} */}

                      {rows.some(row => row.drugName) && (
                        <td className="text_adjust_ppd8">
                          <label htmlFor="ConditionDischarge">DISCHARGE MEDICATIONS</label>

                          <div className="table-container-pp09">
                            <div className="table-rowcc header">
                              <div className="table-cellcv">Drug Name</div>
                              <div className="table-cellcv">Strength</div>
                              <div className="table-cellcv">Frequency</div>
                              <div className="table-cellcv">Route</div>
                              <div className="table-cellcv">Relationship with Meal</div>
                              <div className="table-cellcv">Duration</div>
                            </div>

                            {rows.map((row, index) => (
                              <div className="table-rowcc" key={index}>
                                <div className="table-cellcv">
                                  <input type="text" value={row.drugName || ""} readOnly />
                                </div>
                                <div className="table-cellcv">
                                  <input type="text" value={row.strength || ""} readOnly />
                                </div>
                                <div className="table-cellcv">
                                  <input type="text" value={row.frequency || ""} readOnly />
                                </div>
                                <div className="table-cellcv">
                                  <input type="text" value={row.route || ""} readOnly />
                                </div>
                                <div className="table-cellcv">
                                  <input type="text" value={row.mealRelation || ""} readOnly />
                                </div>
                                <div className="table-cellcv">
                                  <input
                                    type="text"
                                    value={
                                      `${row.duration || ""} ${
                                        row.durationType
                                          ? row.durationType.charAt(0).toUpperCase() + row.durationType.slice(1)
                                          : ""
                                      }`
                                    }
                                    readOnly
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      )}

                     

                      <td className="text_adjust_ppd8">
                        <label htmlFor="FollowupSchedule">
                          FOLLOW-UP SCHEDULE
                        </label>
                        <p>
                          {Followup?.NoOfDays && Followup?.TimeInterval && Followup?.Date ? (
                            <>
                              After {Followup.NoOfDays}{" "}
                              {Followup.TimeInterval.charAt(0).toUpperCase() + Followup.TimeInterval.slice(1)} | Date:{" "}
                              {new Date(Followup.Date).toLocaleDateString("en-GB")} | Day:{" "}
                              {Finddays[new Date(Followup.Date).getDay()]}
                            </>
                          ) : (
                            "Not scheduled"
                          )}
                        </p>

                      </td>




                      <td className="text_adjust_ppd8">
                        <label htmlFor="ConditionDischarge">DIET ADVICE</label>
                        <p>{DischargeSummarySavedData.DietAdvice}</p>
                      </td>

                      <td className="text_adjust_ppd8 esdjej_0o">
                        <label htmlFor="Appointment">
                          FOR APPOINTMENTS / EMERGENCY CALL
                        </label>
                        <h6>IN CASE OF EMERGENCY CALL :{HospitalDetails}</h6>
                        <h6>FOR APPOINTMENTS CALL :{HospitalDetails}</h6>
                      </td>

                      <td className="text_adjust_ppd8">
                        <label htmlFor="ConditionDischarge">
                          PLEASE COME TO EMERGENCY IF YOU HAVE
                        </label>
                        <p>{DischargeSummarySavedData.Emergency}</p>
                      </td>

                      <td className="text_adjust_ppd8">
                        <label htmlFor="followupDate">FOLLOW UP</label>
                        <p>
                          To Review {DischargeSummarySavedData.Referdoctor}{" "}
                          after {DischargeSummarySavedData.NoOfDays}{" "}
                          {DischargeSummarySavedData.TimeInterval}
                        </p>
                      </td>

                      <td className="text_adjust_ppd8">
                        <label htmlFor="AdviseonDischarge"></label>

                        <p name="AdviseonDischarge" id="AdviseonDischarge"></p>
                      </td>


                      
                      {/* mam says dont want this part so i commented  */}

                      {/* <td className="text_adjust_ppd8">
                        <label htmlFor="finalDiagnosis">DOCTOR SCHEDULE</label>

                        <p>{DischargeSummarySavedData.DoctorSchedule} </p>
                      </td> */}

                      {/* mam says dont want this part so i commented  */}


                      {/* <td className='text_adjust_ppd8'>
                        <label htmlFor='OtherClinic'>
                          Other Clinic OPD Contact
                        </label>

                        <p name='OtherClinic' id='OtherClinic' />
                      </td> */}
                    </tr>
                  </tbody>

                  <tfoot className="print_footerr">
                    {/* <tr className='signature-align'>
                      <td className='signature-align-plo'>
                        <div>
                          <SignatureCanvas
                            ref={signatureRef}
                            penColor='black'
                            canvasProps={{
                              width: 130,
                              height: 80,
                              className: 'sigCanvas2'
                            }}
                          />
                        </div>

                        
                        <h5
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '5px'
                          }}
                        >
                          Signature
                        </h5>

                       
                      </td>
                    </tr> */}

                    <tr className="ehydyedyu">
                      <td
                        className="hdhsj_kkw"
                        colSpan="3"
                        style={{
                          borderTop: "2px solid #000",
                          paddingTop: "10px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{ height: "1px solid black", width: "100%" }}
                        ></div>
                        <p>Lab Address: 456 Lab St., City, State, Zip</p>
                        <p>Total Tests: deded</p>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </PrintContent>
        </>
      )}
    </>
  );
};

export default IP_DischargeSummary;
