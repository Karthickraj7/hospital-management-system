import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import "./op_patients.css";
import CancelIcon from "@mui/icons-material/Cancel";
import UpdateIcon from "@mui/icons-material/Update";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Completed Icon
import LoginIcon from "@mui/icons-material/Login"; // Check-In Icon
import LogoutIcon from "@mui/icons-material/Logout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import LabTest from "./LabTest";
import RadiologyTest from "../DoctorWorkBench/RadiologyTest";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LabTest from "../DoctorWorkBench/LabTest";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { TextField } from "@mui/material";

const OP_patients = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const pagewidth = useSelector((state) => state.userRecord?.pagewidth);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [selectedrow, setselectedrow] = useState({});
  console.log(selectedrow);

  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [behalfdoc,setbehalfdoc] = useState("");
  const [Prescribedby, setPrescribedby] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [IsViewMode, setIsViewMode] = useState(false);

  const [access,setaccess] = useState('');


  console.log(behalfdoc,'behalfdoc');

  const [dateTime, setDateTime] = useState(null);

  const dispatchvalue = useDispatch();

  const toast = useSelector((state) => state.userRecord?.toast);
  const [DoctorNames, setDoctorNames] = useState([]);

  const [selectedvalueclear, setselectedvalueclear] = useState("");

  const [PatientRegisterData, setPatientRegisterData] = useState([]);

  console.log("PatientRegisterData", PatientRegisterData);

  //this is to visible the patient registred and completed list
  const [TotalPatientCount, setTotalPatientCount] = useState(0);
  const [RegisteredPatientCount, setRegisteredPatientCount] = useState(0);
  const [CompletedPatientCount, setCompletedPatientCount] = useState(0);

  const [clickreason, setclickreason] = useState(false);
  const [mainfollowup, setmainfollowup] = useState(false);

  const [completedRows, setCompletedRows] = useState({}); // Object to track completed rows

  //   const [clickreason, setclickreason] = useState(false);
  const [isPrescriptiondetailsGet, setIsPrescriptiondetailsGet] =
    useState(false);
  const [showDataGrid, setShowDataGrid] = useState(true);
  const [frequencydata, setFrequencydata] = useState([]);
  const [genericName, setgenericName] = useState([]);
  const [itemNames, setItemNames] = useState([]);
  const [checked, setchecked] = useState([]);

  const [DoctorNameData, setDoctorNameData] = useState([]);
  console.log("DoctorNameData", DoctorNameData);

  const [formDataPrescription, setFormDataPrescription] = useState({
    Prescription_Id: "",
    GenericId: "",
    GenericName: "",
    Itemid: "",
    ItemName: "",
    dose: "",
    route: "",
    qty: "",
    instruction: "",
    frequencyname: "",
    frequencyid: "",
    frequency: "",
    frequencytype: "",
    durationNumber: "",
    durationUnit: "days",
    itemtype: "",
    MRP: "",
    Onbehalf: "No",
    Prescribedby: "",
    DoctorId: "",
  });

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Medical_Stock_InsetLink_for_Prescription`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setgenericName(response.data); // Assuming `setgenericName` expects an array
        } else {
          setgenericName([]); // Handle non-array response gracefully
        }
      })
      .catch((error) => {
        console.error("Error fetching generic names:", error);
        // Handle the error, e.g., show an error message to the user
      });
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Item_Names_Link_fordoctor`, {
        params: {
          ItemName: formDataPrescription.ItemName,
          // Genericnameid: formDataPrescription.GenericId,
          Location: userRecord.location, // Assuming `userRecord.location` is a string or valid parameter
          Store_location : 2
        },
      })
      .then((response) => {
        console.log("itemname", response.data);
        if (Array.isArray(response.data)) {
          setItemNames(response.data); // Assuming `setgenericName` expects an array
        } else {
          setItemNames([]); // Handle non-array response gracefully
        }
      })
      .catch((err) => {
        console.error("Error fetching item names:", err);
      });
  }, [
    UserData.location,
    formDataPrescription.ItemName,
  ]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/insert_frequency_masters`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          const data = response.data.map((p) => ({
            ...p,
            id: p.Frequency_Id, // Assign Frequency_Id as id
          }));
          setFrequencydata(data);
        } else {
          setFrequencydata([]); // Handle non-array responses
        }
      })
      .catch((error) => {
        console.error("Error fetching frequency data:", error);
      });
  }, [UrlLink]);

  const addMedicine = () => {
    if (formDataPrescription.ItemName !== "") {
      const medicineData = {
        id: selectedMedicines.length + 1,
        GenericId: formDataPrescription.GenericId, // Ensure GenericId is included
        GenericName: formDataPrescription.GenericName,
        Itemid: formDataPrescription.Itemid, // Ensure ItemId is included
        ItemName: formDataPrescription.ItemName,
        dose: formDataPrescription.dose,
        route: formDataPrescription.route,
        qty: formDataPrescription.qty,
        instruction: formDataPrescription.instruction,
        frequency: formDataPrescription.frequency,
        durationNumber: formDataPrescription.durationNumber,
        durationUnit: formDataPrescription.durationUnit,
        itemtype: formDataPrescription.itemtype,
        frequencyid: formDataPrescription.frequencyid,
        frequencytype: formDataPrescription.frequencytype,
        frequencyname: formDataPrescription.frequencyname,
      };

      const isDuplicate = selectedMedicines.some(
        (medicine) => medicine.ItemName === medicineData.ItemName
      );

      if (isDuplicate) {
        const tdata = {
          message:
            "Medicine with the same Item Name and Batch Number is already added",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        setSelectedMedicines((prevMedicines) => [
          ...prevMedicines,
          medicineData,
        ]);
      }

      // Reset form after adding the medicine
      setFormDataPrescription({
        GenericId: "",
        GenericName: "",
        ItemName: "",
        dose: "",
        route: "",
        qty: "",
        instruction: "",
        frequency: "",
        durationNumber: "",
        durationUnit: "days",
        itemtype: "",
        MRP: "",
        frequencyid: "",
        frequency: "",
        frequencyname: "",
        frequencytype: "",
        Prescription_Id: "",
      });
    } else {
      const tdata = {
        message: "Select the Itemname",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }

    // Check for duplicates based on ItemName and other unique identifiers if necessary
  };

  const updateMedicine = () => {
    // Ensure the selected medicine at editIndex is updated with new form data
    const updatedMedicines = [...selectedMedicines];
    updatedMedicines[editIndex] = {
      id: selectedMedicines[editIndex].id,
      Prescription_Id: IsViewMode
        ? selectedMedicines[editIndex].PrescriptionId
        : null,
      GenericId: formDataPrescription.GenericId, // Include GenericId
      GenericName: formDataPrescription.GenericName,
      Itemid: formDataPrescription.Itemid, // Include ItemId
      ItemName: formDataPrescription.ItemName,
      dose: formDataPrescription.dose,
      route: formDataPrescription.route,
      qty: formDataPrescription.qty,
      instruction: formDataPrescription.instruction,
      frequency: formDataPrescription.frequency,
      durationNumber: formDataPrescription.durationNumber,
      durationUnit: formDataPrescription.durationUnit,
      itemtype: formDataPrescription.itemtype,
      MRP: formDataPrescription.MRP,
      frequencyid: formDataPrescription.frequencyid,
      frequencytype: formDataPrescription.frequencytype,
      frequency: formDataPrescription.frequency,
      frequencyname: formDataPrescription.frequencyname, // Include batchno
    };

    // Update the state with the modified medicine list
    setSelectedMedicines(updatedMedicines);

    // Reset the edit index to null to exit edit mode
    setEditIndex(null);

    // Clear form data after updating
    setFormDataPrescription({
      GenericId: "", // Clear GenericId
      GenericName: "",
      ItemName: "",
      dose: "",
      route: "",
      qty: "",
      instruction: "",
      frequency: "",
      durationNumber: "",
      durationUnit: "days",
      itemtype: "",
      MRP: "",
      frequencyid: "",
      frequency: "",
      frequencyname: "",
      frequencytype: "",
      Prescription_Id: "", // Clear batchno
    });
  };

  const handleEditMedicine = (index) => {
    console.log("0000000000");
    //
    const selectedMedicine = selectedMedicines[index];

    // Set form data with the selected medicine for editing
    setFormDataPrescription({
      Prescription_Id: selectedMedicine.PrescriptionId || "",
      GenericId: selectedMedicine.GenericId || "", // Include GenericId or set empty if missing
      GenericName: selectedMedicine.GenericName || "",
      Itemid: selectedMedicine.Itemid || "", // Include ItemId or set empty if missing
      ItemName: selectedMedicine.ItemName || "",
      dose: selectedMedicine.dose || "",
      route: selectedMedicine.route || "",
      qty: selectedMedicine.qty || "",
      instruction: selectedMedicine.instruction || "",
      frequencyid: selectedMedicine.frequencyid || "",
      frequency: selectedMedicine.frequency || "",
      frequencyname: selectedMedicine.frequencyname || "",
      frequencytype: selectedMedicine.frequencytype || "",
      durationNumber: selectedMedicine.durationNumber || "",
      durationUnit: selectedMedicine.durationUnit || "days",
      itemtype: selectedMedicine.itemtype || "",
      MRP: selectedMedicine.MRP || 0, // Include batchno or set empty if missing
    });

    // Set the edit index to the current index for tracking the medicine being edited
    setEditIndex(index);
  };

  const handleDeleteMedicine = (index) => {
    const updatedMedicines = selectedMedicines.filter((_, i) => i !== index);

    // Update the selectedMedicines state after deletion
    setSelectedMedicines(updatedMedicines);

    // Reset form and edit state if in edit mode
    if (editIndex === index) {
      setFormDataPrescription({
        Prescription_Id: "",
        GenericId: "",
        GenericName: "",
        Itemid: "",
        ItemName: "",
        dose: "",
        route: "",
        qty: "",
        instruction: "",
        frequency: "",
        frequencytype: "",
        durationNumber: "",
        durationUnit: "days",
        itemtype: "",
        frequencyid: "",
        MRP: "",
      });
      setEditIndex(null); // Exit edit mode
    }
  };

  const handleDateChange = (date) => {
    setReshedule((prev) => ({ ...prev, rescheduledDate: date }));
  };

  const [reshedule, setReshedule] = useState({
    Status: "Reshedule",
    VisitId: "",
    newPatientId: "",
    registrationid: "",
    Reshedulereason: "",
    doctorname: "",
    speciality: "",
    doctorid: "",
    rescheduledDate: new Date(),
    oldDoctorid:"",
  });

  console.log("reshedule", reshedule);

  const handleSubmitButtonClick = () => {
 

    const sampledata = selectedValues["key"];
    console.log(sampledata, "sampledata");

    let newdata;
    let keydata;

    const registrationid = selectedrow?.RegistrationId;

    if (selectedValues.key === "referdoctor") {
      keydata = { ...formData, isCheckedReferDoctor: "true" };
    } else if (selectedValues.key === "admit") {
      const isCheckedOpIp = true;
      const primary_doctor_id = selectedrow?.Doctorid;
      const PatientId = selectedrow?.PatientId;
      const registrationid = selectedrow?.RegistrationId;
      keydata = {
        reason,
        IpNotes,
        isCheckedOpIp,
        Ipid,
        primary_doctor_id,
        PatientId,
        registrationid,
      };
    } else if (selectedValues.key === "ot_request") {
      const isCheckedOtRequest = true;
      const primary_doctor_id = selectedrow?.Doctorid;
      const PatientId = selectedrow?.PatientId;
      const registrationid = selectedrow?.RegistrationId;
      keydata = {
        ...OtRequest,
        isCheckedOtRequest,
        Ipid,
        primary_doctor_id,
        PatientId,
        registrationid,
      };
    } else if (selectedValues.key === "followup") {
      const isCheckedFollowup = true;
      const primary_doctor_id = selectedrow?.Doctorid;
      const PatientId = selectedrow?.PatientId;
      const registrationid = selectedrow?.RegistrationId;
      keydata = {
        ...Followup,
        isCheckedFollowup,
        primary_doctor_id,
        PatientId,
        registrationid,
        
      };
    } 
    else if (sampledata === "Prescription") {
      const primary_doctor_id = selectedrow?.Doctorid;
      const PatientId = selectedrow?.PatientId;
      const registrationid = selectedrow?.RegistrationId;
      const VisitId = selectedrow?.VisitId;
      console.log(registrationid, "registrationidregistrationid");
      keydata = {
        ...Followup,
        isCheckedFollowup,
        primary_doctor_id,
        PatientId,
        registrationid,
        VisitId,
        created_by: UserData?.username,
      };
    }

    if (selectedValues.key === "referdoctor") {
      newdata = {
        name: selectedValues.key,
        created_by: UserData?.username,
        keydata: keydata,
      };
    } else if (selectedValues.key === "admit") {
      newdata = {
        keydata: keydata,
        name: selectedValues.key,
        created_by: UserData?.username,
      };
    } else if (selectedValues.key === "ot_request") {
      newdata = {
        keydata: keydata,
        name: selectedValues.key,
        created_by: UserData?.username,
      };
    } else if (selectedValues.key === "followup") {
      const isCheckedAdvice = true;
      newdata = {
        keydata: keydata,
        name: selectedValues.key,
        adviceData: { AdviceNotes: "", ...Followup, isCheckedAdvice },
        created_by: UserData?.username,
      };
    } else if (sampledata === "Prescription") {
      console.log("inside the prescription");
      newdata = {
        prescriptionData: { ...formDataPrescription },
        selectedMedicines: selectedMedicines || [],
        keydata: keydata,
        behalfdoc : behalfdoc
      };
      console.log(newdata, "newdata");
      axios
        .post(
          `${UrlLink}Workbench/Prescription_OPD_Details_link_OPDRECEPTION`,
          newdata
        )
        .then((res) => {
          const resData = res.data;
          console.log("opddddd", resData);
          const type = Object.keys(resData)[0];
          const message = Object.values(resData)[0];
          const tdata = {
            message: message,
            type: type,
          };
          dispatchvalue({ type: "toast", value: tdata });
          if (type === "success") {
            resetFormStates();
            // setComplete(true);
            setShowDataGrid(true);
            setIsPrescriptiondetailsGet((prev) => !prev);
          }
        })

        .catch((error) => {
          // Handle any errors
          console.error(
            "An error occurred while saving prescription data:",
            error
          );
          const tdata = {
            message: "Failed to save prescription data. Please try again.",
            type: "warn",
          };
          dispatchvalue({ type: "toast", value: tdata });
        });
    }
    const resetFormStates = () => {
      // setAdviceNotes("");
      setFormDataPrescription({});
      // setFormData({
      //   referid: "",
      //   doctorType: "InHouse",
      //   doctorName: "",
      //   remarks: "",
      //   Specialization: "",
      //   specialityid: "",
      //   doctorid: "",
      // });
      // setreason("");
      // setIpNotes("");
      // setIpid("");
      // setFollowup({
      //   Followupid: "",
      //   NoOfDays: "",
      //   TimeInterval: "days",
      //   Date: "",
      // });
      // setOtRequest({});
      // setIsCheckedReferDoctor(false);
      // setIsCheckedOpIp(false);
      // setIsCheckedFollowup(false);
      // setIsCheckedOtRequest(false);
      // setIsCheckedAdvice(false);
      // setSelectedMedicines([]);
      // setDoctorNames([]);
    };

    if (sampledata !== "Prescription") {
      console.log(newdata, "newdata");

      axios
        .post(`${UrlLink}Frontoffice/OpdRec_Queue_POST`, newdata)
        .then((res) => {
          console.log(res);
          const tdata = {
            message: "Data saved successfully",
            type: "success",
          };
          dispatchvalue({ type: "toast", value: tdata });
          setreferdoctor(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  const [referdoctor, setreferdoctor] = useState(false);
  const [Specialization, setSpecialization] = useState([]);
  const [doctorNames, setDoctorNames1] = useState([]);

  const [formData, setFormData] = useState({
    // referid: "",
    doctorType: "InHouse",
    doctorName: "",
    remarks: "",
    Specialization: "",
    specialityid: "",
    doctorid: "",
    registrationid: "",
    PatientId: "",
    VisitId: "",
    created_by: UserData?.username,
    isCheckedReferDoctor: true,
    primary_doctor_id: "",
  });

  console.log(formData);
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    console.log(value,'value123')

    if (name === "doctorType") {
      const newFormData = {
        doctorType: value || "InHouse",
        doctorName: "",
        remarks: "",
        doctorid: "",
        // referid: formData.referid || "", // Retain referid if it's not empty
        Specialization: "",
        specialityid: "",
        registrationid: selectedrow?.RegistrationId,
        PatientId: selectedrow?.PatientId,
        VisitId: selectedrow?.VisitId,
        primary_doctor_id: selectedrow?.Doctorid,
      };
      setFormData(newFormData);
      setDoctorNames1([]); // Set the updated formData state
    }
     else if (name === "Specialization") {
      const selectedSpecialty = Specialization.find(
        (item) => item.Speciality_name === value
      );
      const newFormData = {
        ...formData,
        doctorName: "",
        remarks: "",
        doctorid: "",
        // referid: formData.referid || "", // Retain referid if it's not empty
        Specialization: value,
        specialityid: selectedSpecialty ? selectedSpecialty.id : "",
        registrationid: selectedrow?.RegistrationId,
        PatientId: selectedrow?.PatientId,
        VisitId: selectedrow?.VisitId,
        primary_doctor_id: selectedrow?.Doctorid,
      };
      setFormData(newFormData);
    } 
    else if (name === "doctorName") {
      const doctorNamesMatch =
        Array.isArray(doctorNames) &&
        doctorNames.find((item) => item.DoctorID === value);
      const newFormData = {
        ...formData,
        doctorName: value,
        doctorid: doctorNamesMatch ? doctorNamesMatch.DoctorID : "",
        // referid: doctorNamesMatch ? doctorNamesMatch.DoctorID : "", // Retain referid if it's not empty
        registrationid: selectedrow?.RegistrationId,
        PatientId: selectedrow?.PatientId,
        VisitId: selectedrow?.VisitId,
        primary_doctor_id: selectedrow?.Doctorid,
      };
      setFormData(newFormData);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/All_Speciality_Details_Link`)
      .then((response) => {
        const res = Array.isArray(response.data) ? response.data : []; // Ensure response.data is an array
        setSpecialization(res);
      })
      .catch((err) => {
        console.error("Error fetching specialization data:", err);
      });
  }, [UrlLink]);

  useEffect(() => {
    if (formData.doctorType && formData.specialityid) {
      // Ensure that both parameters are present
      axios
        .get(`${UrlLink}Workbench/Refer_doctor_details`, {
          params: {
            Doctortype: formData.doctorType,
            Speciality: formData.specialityid,
          },
        })
        .then((response) => {
          if (response.data.warn) {
            const [typp, mess] = Object.entries(response.data)[0];
            dispatchvalue({
              type: "toast",
              value: { message: mess, type: typp },
            }); // You can replace this with a custom UI message
            setDoctorNames1([]);
          } else if (Array.isArray(response.data)) {
            setDoctorNames1(response.data); // Set the doctor names if the response is valid
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [
    formData.doctorType,
    // DoctorID,
    formData.specialityid,
    UrlLink,
    dispatchvalue,
  ]);

  const [reason, setreason] = useState("");
  const [IpNotes, setIpNotes] = useState("");
  const [Ipid, setIpid] = useState("");

  const Finddays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [Followup, setFollowup] = useState({
    Followupid: "",
    NoOfDays: "",
    TimeInterval: "days",
    Date: "",
  });

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

  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const currentdate = formatDate(new Date());
  const [searchOPParams, setSearchOPParams] = useState({
    query: "",
    Doctor: "",
    datetype: "",
    date: "",
    todate: "",
  });

  console.log("searchDoctorParams", searchOPParams);

  const handleOpIpChange = (e) => {
    const { name, value } = e.target;
    if (name === "reason") {
      setreason(value);
      setIpid(Ipid);
    } else if (name === "IpNotes") {
      setIpNotes(value);
      setIpid(Ipid);
    }
  };

  //--------------------

  const [isCheckedFollowup, setIsCheckedFollowup] = useState(false);

  const handleCheckboxChangeFollowup = (e) => {
    const isChecked = e.target.checked;
    setIsCheckedFollowup(isChecked);

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    if (Followup.Followupid === "") {
      if (!isChecked) {
        setFollowup({
          Followupid: "",
          NoOfDays: "", // Default to empty
          TimeInterval: "days", // Default to days
          Date: formattedDate, // Set current date
        });
      }
    } else if (Followup.Followupid !== "") {
      if (!isChecked) {
        setFollowup((prev) => ({
          ...prev,
          NoOfDays: "", // Default to empty
          TimeInterval: "days", // Default to days
          Date: formattedDate,
        }));
      }
    }
  };
  //-----------------------prescription

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    setFormDataPrescription({
      ...formDataPrescription,
      [name]: value,
    });
    const { frequency, durationNumber, durationUnit } = {
      ...formDataPrescription,
      [name]: value,
    };

    if (name === "GenericName") {
      const selectedItem = genericName.find(
        (item) => item.Generic_Name === value
      );

      // Prepare the new form data
      const newFormData = {
        ...formDataPrescription,
        [name]: value,
        GenericId: selectedItem ? selectedItem.id : "",
        Itemid: "",
        ItemName: "",
        dose: "",
        route: "",
        qty: "",
        instruction: "",
        frequency: "",
        frequencyid: "",
        frequencyname: "",
        frequencytype: "",
        durationNumber: "",
        durationUnit: "days",
        itemtype: "",
        MRP: "",
      };

      setFormDataPrescription(newFormData); // Set the updated form data
    }
    if (name === "ItemName") {
      const selectedItemone = itemNames.find((item) => item.ItemName === value);

      const newFormData = {
        ...formDataPrescription,
        ItemName: selectedItemone ? selectedItemone.ItemName : value,
        Itemid: selectedItemone ? selectedItemone.ItemId : "",
        MRP: selectedItemone ? selectedItemone.MRP : "",
        dose: "",
        route: "",
        qty: "",
        instruction: "",
        frequency: "",
        frequencyid: "",
        frequencyname: "",
        durationNumber: "",
        durationUnit: "days",
        itemtype: "",
      };

      setFormDataPrescription(newFormData);

      if (selectedItemone) {
        axios
          .get(`${UrlLink}Workbench/Item_Types_Link`, {
            params: {
              Itemid: selectedItemone.ItemId, // Pass the selected ID as a parameter
            },
          })
          .then((response) => {
            if (Array.isArray(response.data) && response.data.length > 0) {
              const updatedFormData = {
                ...formDataPrescription,
                ItemName: selectedItemone ? selectedItemone.ItemName : value,
                Itemid: selectedItemone ? selectedItemone.ItemId : "",
                MRP: selectedItemone ? selectedItemone.MRP : "",
                dose: response.data[0]?.Dose || value, // If response.data[0].Dose exists, use it; otherwise, use 'value'
                itemtype: response.data[0]?.ProductTypeName || value,
                route: "",
                qty: "",
                instruction: "",
                frequency: "",
                frequencyid: "",
                frequencyname: "",
                durationNumber: "",
                durationUnit: "days",
              };

              // Update the form data state
              setFormDataPrescription(updatedFormData);
            }
          })
          .catch((err) => {
            console.error("Error fetching item types:", err);
          });
      }
    }
    if (
      formDataPrescription.itemtype?.toLowerCase() === "tablets" ||
      formDataPrescription.itemtype?.toLowerCase() === "tablet"
    ) {
      if (["frequency", "durationNumber", "durationUnit"].includes(name)) {
        if (!durationNumber || !durationUnit) {
          setFormDataPrescription((prevData) => ({
            ...prevData,
            qty: "",
          }));
          return;
        }

        // Safeguard against invalid frequency format
        const [morning = 0, afternoon = 0, night = 0] = frequency.split("-");

        let times1 = parseInt(morning) + parseInt(afternoon) + parseInt(night);
        let times = 1;
        switch (durationUnit) {
          case "days":
            times = parseInt(durationNumber);
            break;
          case "weeks":
            times = parseInt(durationNumber) * 7;
            break;
          case "months":
            times = parseInt(durationNumber) * 30;
            break;
          default:
            return;
        }

        const qty = times1 * times;

        setFormDataPrescription((prevData) => ({
          ...prevData,
          qty: qty,
        }));
      }
    }
    if (name === "frequencyname") {
      // Find the selected frequency item based on the value
      const selectedfrequency = frequencydata.find(
        (frequencyitem) => frequencyitem.FrequencyName === value
      );

      // Update the state with the new value
      setFormDataPrescription((prev) => ({
        ...prev,
        [name]: selectedfrequency ? selectedfrequency.FrequencyName : value, // Set the frequency name to the selected value
        frequencyid: selectedfrequency ? selectedfrequency.Frequency_Id : "",
        frequencytype: selectedfrequency ? selectedfrequency.FrequencyType : "",
        frequency: selectedfrequency ? selectedfrequency.Frequency : "",
      }));
    }
    if (name === "Onbehalf") {
      setFormDataPrescription((prev) => ({
        ...prev,
        [name]: checked ? "Yes" : "No", // Set value to "Yes" or "No"
      }));
    }
  };

  //-----------------------Lab

  // const [testType, setTestType] = useState("Individual");
  // const [activetestnames, setActivetestnames] = useState([]);
  // const [indivitualChecked, setIndivitualChecked] = useState([]);
  // const [FavouriteChecked, setFavouriteChecked] = useState([]);
  // const transformedFavouriteData = transformFavouriteData(FavouriteChecked);
  // const transformedFavouriteData1 = transformFavouriteData1(indivitualChecked);
  // const [FavTest, setFavTest] = useState([]);

  // const handleIndividualCheckboxChange = (id, Test_Name) => {

  //   console.log("testName", Test_Name);
  //   const isChecked = indivitualChecked.some(item => item.id === id);

  //   if (isChecked) {
  //       const newCheckedState = indivitualChecked.filter(item => item.id !== id);
  //       setIndivitualChecked(newCheckedState);
  //   } else {
  //       const newCheckedState = [...indivitualChecked, { id, Test_Name }];
  //       setIndivitualChecked(newCheckedState);
  //   }
  // };

  // const handleFavoriteCheckboxChange = (key, FavouriteName, Current_Amount, TestDetails) => {
  //   console.log("Change detected:", key, FavouriteName, Current_Amount, TestDetails);

  //   const isChecked = FavouriteChecked.some(item => item.key === key);

  //   if (isChecked) {
  //       const newCheckedState = FavouriteChecked.filter(item => item.key !== key);
  //       setFavouriteChecked(newCheckedState);
  //   } else {
  //       const newCheckedState = [...FavouriteChecked, { key, FavouriteName, Current_Amount, TestDetails }];
  //       setFavouriteChecked(newCheckedState);
  //   }
  // };

  // const handleCheckIn = (row) => {
  //   setCheckedInRows((prev) => ({
  //     ...prev,
  //     [row.RegistrationId]: true, // Mark patient as checked in
  //   }));
  //   handleColorChangeCheckin(row);
  // };

  // const handleCheckOut = (row) => {
  //   setCheckedInRows((prev) => {
  //     if (!prev[row.RegistrationId]) {
  //       alert("Patient not checked in! Please check in first.");
  //       return prev; // Return previous state to avoid unnecessary re-render
  //     }

  //     // If patient is checked in, proceed to checkout
  //     setCheckedOutRows((prevCheckedOut) => ({
  //       ...prevCheckedOut,
  //       [row.RegistrationId]: true, // Mark as checked out
  //     }));

  //     handleColorChangeCheckOut(row);
  //     return prev; // Ensure function doesn't reset state
  //   });
  // };

  //---------------------otrequest

  // const handleCheckOut = (row) => {
  //   if (!checkedInRows[row.RegistrationId]) {
  //     alert("Patient not checked in! Please check in first.");
  //     return;
  //   }
  //   setCheckedOutRows((prev) => ({
  //     ...prev,
  //     [row.RegistrationId]: true, // Mark patient as checked out
  //   }));
  //   handleColorChangeCheckOut(row);
  // };

  const [OtRequest, setOtRequest] = useState({
    OtRequestid: "",
    SurgeryName: "",
    Surgeryid: "",
    SurgeryRequestedDate: "",
    Speciality: "",
    Specialityid: "",
  });

  const [isCheckedOtRequest, setIsCheckedOtRequest] = useState(false);

  const [surgerynames, setSurgerynames] = useState([]);

  const handleCheckboxChangeOtRequest = (e) => {
    const isChecked = e.target.checked;
    setIsCheckedOtRequest(isChecked);

    if (OtRequest.OtRequestid === "") {
      if (!isChecked) {
        // If unchecked, clear the fields and surgerynames array
        setOtRequest({
          SurgeryName: "",
          OtRequestid: "",
          Surgeryid: "",
          SurgeryRequestedDate: "",
          Speciality: "",
          Specialityid: "",
        });
        setSurgerynames([]); // Clear the surgerynames array
      }
    } else if (OtRequest.OtRequestid !== "") {
      if (!isChecked) {
        // If OtRequestid is not empty and checkbox is unchecked, clear the fields
        setOtRequest({
          ...OtRequest, // Keep the previous state and modify specific fields if necessary
          Surgeryid: "",
          SurgeryRequestedDate: "",
          Speciality: "",
          Specialityid: "",
          SurgeryName: "",
        });
        setSurgerynames([]); // Optionally clear the surgerynames array or keep it
      } else {
        // If checkbox is checked, you can reinitialize or modify the state if needed
        setOtRequest({
          ...OtRequest,
          Surgeryid: "",
          SurgeryRequestedDate: "",
          Speciality: "",
          Specialityid: "",
          SurgeryName: "", // Optionally reset SurgeryRequestedDate if needed
        });
        // You can also add additional logic here to preserve or modify other fields
      }
    }
  };

  const fetchSurgeryData = useCallback(async () => {
    try {
      let response;
      if (OtRequest.Specialityid) {
        response = await axios.get(`${UrlLink}Workbench/Surgery_Details_link`, {
          params: { Speciality: OtRequest.Specialityid },
        });
      } else if (OtRequest.SurgeryName === "") {
        response = await axios.get(
          `${UrlLink}Workbench/Surgery_Details_link?Testgo=${OtRequest.SurgeryName.toUpperCase()}`
        );
      } else {
        response = await axios.get(`${UrlLink}Workbench/Surgery_Details_link`);
      }

      const data = response.data;

      if (Array.isArray(data)) {
        setSurgerynames(data);
      } else {
        console.error("Expected an array but received:", data);
        setSurgerynames([]); // Reset to empty array if the response is not valid
      }
    } catch (err) {
      console.error("Error fetching surgery data:", err);
    }
  }, [UrlLink, OtRequest.Specialityid, OtRequest.SurgeryName]); // Memoize the function

  useEffect(() => {
    fetchSurgeryData();
  }, [fetchSurgeryData]); // Only runs if fetchSurgeryData changes

  const handleOtRequestInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "Speciality") {
      // When Speciality is selected
      const selectedSpecialitySurgery = surgerynames.find(
        (item) => item.Specialityname === value
      );

      setOtRequest((prev) => ({
        ...prev,
        Speciality: selectedSpecialitySurgery
          ? selectedSpecialitySurgery.Specialityname
          : value,
        Specialityid: selectedSpecialitySurgery
          ? selectedSpecialitySurgery.specialityid
          : "",
        SurgeryRequestedDate: "",
        SurgeryName: "",
        Surgeryid: "",
      }));
    } else if (name === "SurgeryName") {
      const selectedSurgeryName = surgerynames.find(
        (item) => item.SurgeryName === value
      );
      if (selectedSurgeryName) {
        setOtRequest((prev) => ({
          ...prev,
          Speciality: selectedSurgeryName.Specialityname,
          Specialityid: selectedSurgeryName.specialityid,
          SurgeryRequestedDate: "",
          SurgeryName: selectedSurgeryName.SurgeryName,
          Surgeryid: selectedSurgeryName.id,
        }));
      } else {
        setOtRequest((prev) => ({
          ...prev,
          Speciality: "",
          Specialityid: "",
          SurgeryRequestedDate: "",
          SurgeryName: value,
          Surgeryid: "",
        }));
      }
    } else if (name === "SurgeryRequestedDate") {
      // Check if the selected date is in the past
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison

      // Compare the selected date with today's date
      if (selectedDate < today) {
        // Use '<' to prevent booking previous dates
        const tdata = {
          message: "You cannot book a surgery for any previous date.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
        return; // Do not update state if the date is invalid
      } else {
        // Update any other fields as well
        setOtRequest((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      // Update any other fields as well
      setOtRequest((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const fetchdat = async () => {
      const postdata = {
        LocationId: UserData?.location,
        Date: formatDate(new Date()),
        Speciality: reshedule?.speciality,
        Department: "OP",
      };
      console.log("checkingg", reshedule);
      // console.log("Doctrrrrr", postdata);
      // console.log("heelo doctor",DoctorNames)

      try {
        const response = await axios.get(
          `${UrlLink}Frontoffice/get_available_doctor_by_speciality`,
          { params: postdata }
        );

        setDoctorNameData(response.data);
      } catch (error) {
        setDoctorNameData([]);
        console.error("Error fetching referral doctors:", error);
      }
    };
    if (reshedule.speciality) {
      fetchdat();
    }
  }, [UrlLink, UserData.location, reshedule?.speciality]);

  const [IsPatientStatusGet, setIsPatientStatusGet] = useState(false);

  const [OpenModalCancel, setOpenModalCancel] = useState(false);
  const [selectedpatients, setselectedpatients] = useState({});
  const [cancel, setCancel] = useState({
    Status: "Cancelled",
    VisitId: "",
    newPatientId: "",
    registrationid: "",
    Cancelreason: "",
  });

  const [SpecializationData, setSpecializationData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specializationResponse] = await Promise.all([
          axios.get(`${UrlLink}Masters/Speciality_Detials_link`),
        ]);
        setSpecializationData(specializationResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [UrlLink]);

  const [ShowModalReschedule, setShowModalReschedule] = useState(false);
  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/get_patient_appointment_details`, {
        params: searchOPParams,
      })
      .then((res) => {
        const ress = res.data;
        console.log(ress, "rrrrrrrrrrrrrrrrr");

        if (Array.isArray(ress)) {
          setPatientRegisterData(ress);
          setTotalPatientCount(ress[0]?.TotalPatientCount || 0);
          const registeredCount = ress.filter(
            (patient) => patient.Status === "Registered"
          ).length;
          const completedCount = ress.filter(
            (patient) => patient.Status === "Completed"
          ).length;

          // Don't forget to update the state with these counts
          setRegisteredPatientCount(registeredCount);
          setCompletedPatientCount(completedCount);
        } else {
          setPatientRegisterData([]);
          setTotalPatientCount(0);
          setRegisteredPatientCount(0);
          setCompletedPatientCount(0);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, searchOPParams, IsPatientStatusGet]);

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

  const handleSearchChange = (e) => {
    const { name, value } = e.target;

    // Handle changes based on the datetype
    if (name === "datetype") {
      if (value === "CurrentDate") {
        setSearchOPParams({
          ...searchOPParams,
          datetype: value,
          date: currentdate, // Set the date to current date
          todate: "", // Clear todate
        });
      } else if (value === "CustomDate") {
        setSearchOPParams({
          ...searchOPParams,
          datetype: value,
          date: "", // Keep date empty for custom date
          todate: "", // Keep todate empty as well
        });
      } else {
        setSearchOPParams({
          ...searchOPParams,
          datetype: "",
          date: "",
          todate: "", // Clear both date and todate if no option selected
        });
      }
    } else {
      setSearchOPParams({
        ...searchOPParams,
        [name]: value,
      });
    }
  };
  const [selectedValues, setSelectedValues] = useState({}); // Store values per row ID
  console.log("selecteddddd", selectedValues);

  const handleDropdownChange = (event, params) => {
    console.log(params.row.Doctorid,'paramssssss');

    const selectedValue = event.target.value;
    if (selectedValue) {
      let name;
      if (selectedValue === "referdoctor") {
        name = "Refer Doctor";
      } else if (selectedValue === "admit") {
        name = "Ip Admit";
      } else if (selectedValue === "ot_request") {
        name = "OT Request";
      }
       else if (selectedValue === "lab") {
        name = "lab";
        const { RegistrationId,Doctorid } = params.row;

        console.log("Premkkkkkkkkk", RegistrationId,Doctorid);
        axios
          .get(`${UrlLink}OP/get_workbenchquelist_doctor`, {
            params: { RegistrationId: RegistrationId,DoctorId:params.row.Doctorid, Type: "OP" },
          })
          .then((res) => {
            console.log(res);
            dispatchvalue({
              type: "DoctorWorkbenchNavigation",
              value: { ...res.data },
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
       else if (selectedValue === "Radiology") {
        name = "Radiology";
        const { RegistrationId,Doctorid } = params.row;

        console.log("radiologyyyycheck", RegistrationId,Doctorid);
        axios
          .get(`${UrlLink}OP/get_workbenchquelist_doctor`, {
            params: { RegistrationId: RegistrationId,DoctorId:Doctorid, Type: "OP" },
          })
          .then((res) => {
            console.log(res);
            dispatchvalue({
              type: "DoctorWorkbenchNavigation",
              value: { ...res.data },
            });
          })
          .catch((err) => {
            console.log(err);
          });

      } 
      else if (selectedValue === "followup") {
        name = "Follow Up";
      }
       else if (selectedValue == "Prescription") {
        name = "Prescription";

        setFormDataPrescription((prev) => ({
          ...prev,
          Prescribedby: params.row.DoctorName,
          DoctorId: params.Doctorid,
        }));

        setbehalfdoc(params.row.Doctorid);

        setPrescribedby(params.row.DoctorName);
        console.log("params.row.Doctorid", params.Doctorid);
        
        setSelectedMedicines([]);
      }

      setSelectedValues((prev) => ({
        ...prev, // Preserve existing selections
        [params.row.RegistrationId]: selectedValue,
        labelname: name,
        key: selectedValue,
      }));
      setreferdoctor(true);
      setselectedrow(params.row);
    } else {
      setSelectedValues({});
      setreferdoctor(false);
      setselectedrow({});
    }
  };

  // const handleDropdownChange = (event, row) => {
  //   const selectedValue = event.target.value;
  //   console.log("Selected Action:", selectedValue);
  //   setselectedvalueclear(selectedValue)
  //   if (selectedValue === "referdoctor") {
  //     setreferdoctor(true);
  //   } else if (selectedValue === "admit") {
  //   } else if (selectedValue === "ot_request") {
  //   } else if (selectedValue === "followup") {
  //   }
  // };

  const handleclickreason = (params) => {
    console.log(params);
    setselectedpatients(params);
    setclickreason(true);
  };

  const handlemainfollowup = () => {
    setmainfollowup(true);
  };

  const [checkedInRows, setCheckedInRows] = useState(() => {
    const storedCheckedInRows = localStorage.getItem("checkedInRows");
    return storedCheckedInRows ? JSON.parse(storedCheckedInRows) : {};
  });

  useEffect(() => {
    localStorage.setItem("checkedInRows", JSON.stringify(checkedInRows));
  }, [checkedInRows]);

  const handleColorChangeCheckin = (rowss) => {

    console.log(rowss,'rowsssssss')
    const Status = "InProgress"; // Marking the status as 'InProgress'
    const VisitId = rowss?.VisitId;
    const newPatientId = rowss?.PatientId;
    const registrationid = rowss?.RegistrationId;
    const Doctorid =rowss?.Doctorid;

    console.log(Doctorid,'Doctorid')

    if (VisitId && newPatientId && registrationid) {
      axios
        .post(`${UrlLink}Masters/StatusUpdate_Details_Patient`, {
          newPatientId,
          VisitId,
          Status,
          registrationid,
          Doctorid
        })
        .then((res) => {
          const resres = res.data;
          const typp = Object.keys(resres)[0];
          const mess = Object.values(resres)[0];
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: "toast", value: tdata });

          // Mark patient as checked in in the local state
          // setCheckedInRows((prev) => {
          //   const updatedCheckedInRows = { ...prev, [registrationid]: true };
          //   return updatedCheckedInRows;
          // });
       
          setaccess('InProgress');


          // Update the UI or trigger a refresh
          setIsPatientStatusGet((prev) => !prev);
        })
        .catch((err) => {
          console.error("Error updating status:", err);
          dispatchvalue({
            type: "toast",
            value: { message: "Error updating status", type: "warn" },
          });
        });
    } else {
      dispatchvalue({
        type: "toast",
        value: { message: "PatientID and VisitId are required.", type: "warn" },
      });
    }
  };

  const [checkedOutRows, setCheckedOutRows] = useState(() => {
    const storedCheckedOutRows = localStorage.getItem("checkedOutRows");
    return storedCheckedOutRows ? JSON.parse(storedCheckedOutRows) : {};
  });

  useEffect(() => {
    localStorage.setItem("checkedOutRows", JSON.stringify(checkedOutRows));
  }, [checkedOutRows]);

  const handleColorChangeCheckOut = (rowss) => {
    console.log(rowss,'rowss')
    if (!rowss.Status=='InProgress') {
      alert("Patient not checked in! Please check in first.");
      return;
    }
    const Status = "CheckOut";
    const VisitId = rowss?.VisitId;
    const newPatientId = rowss?.PatientId;
    const registrationid = rowss?.RegistrationId;
    const Doctorid =rowss?.Doctorid;

    if (VisitId && newPatientId && Status) {
      axios
        .post(`${UrlLink}Masters/StatusUpdate_Details_Patient`, {
          newPatientId,
          VisitId,
          Status,
          registrationid,
          Doctorid
        })
        .then((res) => {
          const resres = res.data;
          console.log("resres", resres);
          const typp = Object.keys(resres)[0];
          const mess = Object.values(resres)[0];
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: "toast", value: tdata });

          // setCheckedOutRows((prev) => {
          //   const updatedCheckedOutRows = { ...prev, [registrationid]: true };
          //   localStorage.setItem(
          //     "checkedOutRows",
          //     JSON.stringify(updatedCheckedOutRows)
          //   );
          //   return updatedCheckedOutRows;
          // });
          setIsPatientStatusGet((prev) => !prev);
          
        })
        .catch((err) => {
          console.error("Error updating status:", err);
          dispatchvalue({
            type: "toast",
            value: { message: "Error updating status", type: "warn" },
          });
        });
    } else {
      const tdata = {
        message: "PatientID and Visitid not found.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  //----------------------------Old get above------------------------//

  const handleColorChangeCancel = (rowss) => {
    if (rowss?.VisitId && rowss?.PatientId && rowss?.id) {
      setCancel((prev) => ({
        ...prev,
        VisitId: rowss?.VisitId,
        newPatientId: rowss?.PatientId,
        registrationid: rowss?.RegistrationId,
        Doctorid :rowss?.Doctorid,
      }));
      setOpenModalCancel(true);
    } else {
      setOpenModalCancel(false);
      const tdata = {
        message: "PatientID and Visitid not found.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  const handleColorChangeReschedule = (rowss) => {
    console.log("handleColorChangeReschedule", rowss);
    if (rowss?.VisitId && rowss?.PatientId && rowss?.id) {
      setReshedule((prev) => ({
        ...prev,
        VisitId: rowss?.VisitId,
        newPatientId: rowss?.PatientId,
        registrationid: rowss?.RegistrationId,
        speciality: rowss?.Specilization || "",
        doctorname: "",
        doctorid: rowss?.Doctorid || "",
        oldDoctorid: rowss?.Doctorid ||"", 
      }));
      
      const selectedSpeciality = SpecializationData.find(
        (p) => p.SpecialityName === reshedule.speciality
      );
      if (selectedSpeciality) {
        setReshedule((prev) => ({
          ...prev,
          speciality: selectedSpeciality.id,
        }));
      }
      setShowModalReschedule(true);
    } else {
      setShowModalReschedule(false);
      const tdata = {
        message: "PatientID and Visitid not found.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  const handleCloseModal = () => {
    setOpenModalCancel(false);
    setShowModalReschedule(false);
  };

  const handleColorChangeCompleted = (rowss, color) => {
    const Status = "Completed";
    const VisitId = rowss?.VisitId;
    const newPatientId = rowss?.PatientId;
    const registrationid = rowss?.RegistrationId;
    const Doctorid =rowss?.Doctorid;
    // const doctor = rowss?.

    if (VisitId && newPatientId && registrationid) {
      axios
        .post(`${UrlLink}Masters/StatusUpdate_Details_Patient`, {
          newPatientId,
          VisitId,
          Status,
          registrationid,
          Doctorid,
        })
        .then((res) => {
          const resres = res.data;
          const typp = Object.keys(resres)[0];
          const mess = Object.values(resres)[0];
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: "toast", value: tdata });

          // Update the UI and state
          setIsPatientStatusGet((prev) => !prev);
          setPatientRegisterData((prevRows) =>
            prevRows.map((row) =>
              row.id === rowss.id ? { ...row, bgColour: color } : row
            )
          );
        })
        .catch((err) => {
          console.error("Error updating status:", err);
          dispatchvalue({
            type: "toast",
            value: { message: "Error updating status", type: "warn" },
          });
        });
    } else {
      dispatchvalue({
        type: "toast",
        value: { message: "PatientID and VisitId are required.", type: "warn" },
      });
    }
  };

  const PatientOPRegisterColumns = [
    {
      key: "id",
      name: "S.No",
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
      frozen: true,
      renderCell: (params) => {
        let bgColor;
        if (params.row.Status === "InProgress") {
          bgColor = "#e3ff7e"; // Background color for Inprogress
        } else if (params.row.Status === "CheckOut") {
          bgColor = "#88e76cfd"; // Background color for CheckOut
        } else if (params.row.Status === "Cancelled") {
          bgColor = "#f55e5e";
        } else if (params.row.Status === "Reshedule") {
          bgColor = "#c794dffd";
        } else if (params.row.Status === "Completed") {
          bgColor = "#4169E1";
        } else {
          bgColor = "transparent"; // Default background color
        }

        return (
          <div
            style={{
              backgroundColor: bgColor,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "black", // Adjust text color for visibility
              padding: "4px",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            {params.row.PatientName}
          </div>
        );
      },
    },
    {
      key: "PhoneNo",
      name: "Phone Number",
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
      key: "VisitType",
      name: "Visit Type",
    },

    {
      key: "Status",
      name: "Status",
    },
    {
      key: "DoctorName",
      name: "Doctor Name",
    },

    {
      key: "Action",
      name: "Action",

      renderCell: (params) => {
        // const isCompleted = completedRows[params.row.RegistrationId] || false;
        console.log(params.row.Status,'Completedddddd')
        const isCompleted = params.row.Status === "Completed";

        console.log(isCompleted,'isCompleted')
        return (
          <>
            <div className="actionv" style={{ gap: "5px" }}>
              <Button
                className="cell_btn"
                title="CheckIn"
                onClick={() => handleColorChangeCheckin(params.row)}
                disabled={
                  isCompleted || params.row.Status === 'InProgress' || params.row.Status === 'CheckOut' ||  params.row.Status === 'Cancelled'
                }
                style={{
                  opacity:
                    isCompleted || params.row.Status === 'InProgress' || params.row.Status === 'CheckOut' ||  params.row.Status === 'Cancelled'
                      ? 0.5
                      : 1,
                  cursor:
                    isCompleted || params.row.Status === 'InProgress' || params.row.Status === 'CheckOut' ||  params.row.Status === 'Cancelled'
                      ? "not-allowed"
                      : "pointer",
                  backgroundColor:
                    isCompleted || params.row.Status === 'InProgress' || params.row.Status === 'CheckOut' ||  params.row.Status === 'Cancelled'
                      ? "#ccc"
                      : "#e3ff7e",
                }}
              >
                <div
                  style={{ backgroundColor: "#e3ff7e", padding: "4px 14px" }}
                >
                  <LoginIcon className="check_box_clrr_cancell" />
                </div>
              </Button>

              <Button
                className="cell_btn"
                title="CheckOut"
                onClick={() => handleColorChangeCheckOut(params.row)}
                disabled={
                  isCompleted ||
                  // !checkedInRows[params.row.RegistrationId] || // Ensure patient is checked in
                 params.row.Status === 'CheckOut' // Disable after checkout
                }
                style={{
                  opacity:
                    isCompleted || params.row.Status === 'CheckOut' ||  params.row.Status === 'Cancelled'
                      ? 0.5
                      : 1,
                  cursor:
                    isCompleted || params.row.Status === 'CheckOut' ||  params.row.Status === 'Cancelled'
                      ? "not-allowed"
                      : "pointer",
                  backgroundColor:
                    isCompleted || params.row.Status === 'CheckOut' ||  params.row.Status === 'Cancelled'
                      ? "#ccc"
                      : "#88e76cfd",
                }}
              >
                <div
                  style={{ backgroundColor: "#88e76cfd", padding: "4px 14px" }}
                >
                  <LogoutIcon className="check_box_clrr_cancell" />
                </div>
              </Button>

              <Button
                className="cell_btn"
                title="Completed"
                onClick={() => {
                  handleColorChangeCompleted(params.row);
                  setCompletedRows((prevCompletedRows) => ({
                    ...prevCompletedRows,
                    [params.row.RegistrationId]: true,
                  }));
                }}
                disabled={isCompleted ||  params.row.Status === 'Cancelled'}
                style={{
                  opacity: isCompleted ||  params.row.Status === 'Cancelled' ? 0.5 : 1,
                  cursor: isCompleted ||  params.row.Status === 'Cancelled' ? "not-allowed" : "pointer",
                  backgroundColor:  isCompleted  ||  params.row.Status === 'Cancelled' ? "#ccc" : "#4169E1",
                }}
              >
                {" "}
                <div
                  style={{ backgroundColor: "#4169E1", padding: "4px 14px" }}
                >
                  <CheckCircleIcon className="check_box_clrr_cancell" />
                </div>
              </Button>

              <Button
                className="cell_btn"
                title="Cancel"
                onClick={() => handleColorChangeCancel(params.row)}
                disabled={isCompleted ||  params.row.Status === 'Cancelled'}
                style={{
                  opacity: isCompleted ||  params.row.Status === 'Cancelled'? 0.5 : 1,
                  cursor: isCompleted ||  params.row.Status === 'Cancelled' ? "not-allowed" : "pointer",
                  backgroundColor: isCompleted ||  params.row.Status === 'Cancelled'? "#ccc" : "#f55e5e",
                }}
              >
                {" "}
                <div
                  style={{ backgroundColor: "#f55e5e", padding: "4px 14px" }}
                >
                  <CancelIcon className="check_box_clrr_cancell" />
                </div>
              </Button>

              <Button
                className="cell_btn"
                title="Reshedule"
                onClick={() => handleColorChangeReschedule(params.row)}
                disabled={isCompleted ||  params.row.Status === 'Cancelled'}
                style={{
                  opacity: isCompleted ||  params.row.Status === 'Cancelled' ? 0.5 : 1,
                  cursor: isCompleted ||  params.row.Status === 'Cancelled' ? "not-allowed" : "pointer",
                  backgroundColor: isCompleted ||  params.row.Status === 'Cancelled' ? "#ccc" : "#c794dffd",
                }}
              >
                {" "}
                <div
                  style={{ backgroundColor: "#c794dffd", padding: "4px 14px" }}
                >
                  <UpdateIcon className="check_box_clrr_cancell" />
                </div>
              </Button>
            </div>
          </>
        );
      },
    },

    {
      key: "DoctorAdvise",
      name: "DoctorAdvise",

      renderCell: (params) =>
        params.row.Status !== "Completed" ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" NOT COMPLETED"}
          </span>
        ) : (
          <div className="actionv" style={{ gap: "5px" }}>
            {console.log(params)}
            <select
              className="cell_dropdown"
              value={selectedValues[params.row.RegistrationId] || ""} // Select value based on row ID
              onChange={(e) => handleDropdownChange(e, params)}
    
            >
              <option value="">Select Action</option>
              <option value="referdoctor">Refer_Doctor</option>
              <option value="admit">Admit</option>
              <option value="ot_request">OT_Request</option>
              <option value="lab">Lab</option>
              <option value="Radiology">Radiology</option>
              <option value="followup">Followup</option>
              <option value="Prescription">Prescription</option>
            </select>
          </div>
        ),
    },

    // {
    //   key: "Followup",
    //   name: "DoctorAdvise",

    //   renderCell: (params) => (
    //     <>
    //       <div className="actionv">
    //         <Button
    //           className="cell_btn"
    //           title="CheckIn"
    //           onClick={() => handleclickreason(params.row)}
    //         >
    //           {/* <LoginIcon className="check_box_clrr_cancell" /> */}
    //           Actions
    //         </Button>
    //       </div>
    //     </>
    //   ),
    // },

    // {
    //   key: "Followup",
    //   name: "Followup",

    //   renderCell: (params) => (
    //     <>
    //       <div className="actionv">
    //         <Button
    //           className="cell_btn"
    //           title="CheckIn"
    //           onClick={() => handlemainfollowup(params.row)}
    //         >
    //           {/* <LoginIcon className="check_box_clrr_cancell" /> */}
    //           Followup
    //         </Button>
    //       </div>
    //     </>
    //   ),
    // },
  ];

  const handleCancelOnChange = (e) => {
    const { name, value } = e.target; // Extract name and value

    setCancel((prev) => ({
      ...prev,
      [name]: value, // Dynamically update the relevant state field
    }));
  };

  const handleSaveCancelReason = () => {
    if (cancel.Cancelreason) {
      axios
        .post(`${UrlLink}Masters/StatusUpdate_Details_Patient_Cancel`, cancel)
        .then((res) => {
          const resres = res.data;
          console.log("resres", resres);
          const typp = Object.keys(resres)[0];
          const mess = Object.values(resres)[0];
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: "toast", value: tdata });
          setIsPatientStatusGet((prev) => !prev);
          handleCloseModal();
          setCancel({
            Status: "Cancel",
            VisitId: "",
            newPatientId: "",
            registrationid: "",
            Cancelreason: "",
          });
        })
        .catch((err) => {
          console.error("Error updating status:", err);
          dispatchvalue({
            type: "toast",
            value: { message: "Error updating status", type: "warn" },
          });
        });
    } else {
      dispatchvalue({
        type: "toast",
        value: { message: "Cancel reason required.", type: "warn" },
      });
    }
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setReshedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDocChange = (e) => {
    const { name, value } = e.target;
    setReshedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRescheduleSave = () => {
    if (reshedule.Reshedulereason !== "" && reshedule.doctorname !== "") {
      axios
        .post(
          `${UrlLink}Masters/StatusUpdate_Details_Patient_Reshedule`,
          reshedule
        )
        .then((res) => {
          const resres = res.data;
          const typp = Object.keys(resres)[0];
          const mess = Object.values(resres)[0];
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: "toast", value: tdata });
          setIsPatientStatusGet((prev) => !prev);
          handleCloseModal();
          setReshedule({
            Status: "Reshedule",
            VisitId: "",
            newPatientId: "",
            registrationid: "",
            Reshedulereason: "",
            doctorname: "",
            speciality: "",
            doctorid: "",
          });
        })
        .catch((err) => {
          console.error("Error updating status:", err);
          dispatchvalue({
            type: "toast",
            value: { message: "Error updating status", type: "warn" },
          });
        });
    } else {
      dispatchvalue({
        type: "toast",
        value: {
          message: "Reshedule reason and doctorname required.",
          type: "warn",
        },
      });
    }
  };

  // lab----------
  return (
    <div className="Main_container_app">
      <h3>OP PATIENTS LIST</h3>

      <div className="patientcontain1">
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "space-between",
            paddingBottom:'5px',
            padding: "10px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{display:'flex', gap
            :'5px'
          }}>
          <span
            style={{
              backgroundColor: "#e3ff7e",
              padding: "6px 12px",
              borderRadius: "4px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            Checkin
          </span>
          <span
            style={{
              backgroundColor: "#88e76cfd",
              padding: "6px 12px",
              borderRadius: "4px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            Checkout
          </span>
          <span
            style={{
              backgroundColor: "#4169E1",
              padding: "6px 12px",
              borderRadius: "4px",
              fontWeight: "500",
              color: "#fff",
            }}
          >
            Completed
          </span>
          <span
            style={{
              backgroundColor: "#f55e5e",
              padding: "6px 12px",
              borderRadius: "4px",
              fontWeight: "500",
              color: "#fff",
            }}
          >
            Cancel
          </span>
          <span
            style={{
              backgroundColor: "#c794dffd",
              padding: "6px 12px",
              borderRadius: "4px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            Reschedule
          </span>
</div>

          
        <div className="RegisFormcon">
          <div className="Matrix_90">
            <label htmlFor="" style={{width:'150px'}}>
              Total Patient Count<span>:</span>
            </label>
            <input
              type="number"
              name="TotalPatientCount"
              value={TotalPatientCount}
              disabled
              className="Inception-number-input"
            />
          </div>

          <div className="Matrix_90">
            <label htmlFor="" style={{width:'150px'}}>
              Registered Count<span>:</span>
            </label>
            <input
              type="number"
              name="RegisteredPatientCount"
              value={RegisteredPatientCount}
              disabled
              className="Inception-number-input"
            />
          </div>

          <div className="Matrix_90">
            <label htmlFor="" style={{width:'160px'}}>
              Completed Patient Count
              <span>:</span>
            </label>
            <input
              type="number"
              name="CompletedPatientCount"
              value={CompletedPatientCount}
              disabled
              className="Inception-number-input dsfewuf_n"
            />
          </div>
        </div>
        </div>

        <br />

        <div
          className="RegisFormcon"
          style={{ width: "100%", justifyContent: "center" }}
        >
          <div className="Matrix_90">
            <label htmlFor="">
              Search by<span>:</span>
            </label>
            <input
              type="text"
              name="query"
              value={searchOPParams.query}
              placeholder="Search here..."
              onChange={handleSearchChange}
              className="Inception-input"
            />
          </div>

          <div className="Matrix_90">
            <label htmlFor="doctor">
              Doctor Name<span>:</span>
            </label>
            <select
              id=""
              name="Doctor"
              value={searchOPParams.Doctor}
              onChange={handleSearchChange}
              className="Inception-select"
            >
              <option value="">Select</option>
              {DoctorNames.map((doctor, index) => (
                <option key={index} value={doctor.id}>
                  {doctor.ShortName}
                </option>
              ))}
            </select>
          </div>

          {searchOPParams.datetype === "CustomDate" && (
            <>
              <div className="Matrix_90">
                <label htmlFor="">
                  From Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={searchOPParams.date}
                  onChange={handleSearchChange}
                  className="Inception-input"
                />
              </div>
              <div className="Matrix_90">
                <label htmlFor="">
                  To Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="todate"
                  value={searchOPParams.todate}
                  onChange={handleSearchChange}
                  className="Inception-input"
                />
              </div>
            </>
          )}

          {searchOPParams.datetype === "CurrentDate" && (
            <div className="Matrix_90">
              <label htmlFor="">
                From Date<span>:</span>
              </label>
              <input
                type="date"
                name="date"
                value={searchOPParams.date}
                onChange={handleSearchChange}
                disabled
                className="Inception-input"
              />
            </div>
          )}

          <div className="Matrix_90">
            <label htmlFor="">
              Choose Date<span>:</span>
            </label>
            <select
              name="datetype"
              value={searchOPParams.datetype}
              onChange={handleSearchChange}
              className="Inception-select"
            >
              <option value="">Select</option>
              <option value="CurrentDate">Current Date</option>
              <option value="CustomDate">Custom Date</option>
            </select>
          </div>
        </div>
        <br />

        

        <div className="RegisFormcon_1 jjxjx_">
          <ReactGrid
            columns={PatientOPRegisterColumns}
            RowData={PatientRegisterData}
          />
        </div>
      </div>

      {OpenModalCancel && (
        <div className="modal-container" onClick={handleCloseModal}>
          <div
            className="App_Cancel_modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="common_center_tag">
              <span>Register Cancel Reason</span>
            </div>
            <textarea
              name="Cancelreason" // Key in the state to update
              id="Cancelreason" // Identifier for the textarea
              label="Cancellation Reason" // Informational label (optional)
              value={cancel.Cancelreason || ""} // Controlled input with fallback
              onChange={handleCancelOnChange} // Handles state updates
            />
            <div className="Main_container_Btn button">
              <button onClick={handleSaveCancelReason}>Save</button>
            </div>
          </div>
        </div>
      )}
      {ShowModalReschedule && (
        <>
          <div className="modal-container" onClick={handleCloseModal}>
            <div
              className="loader_register_roomshow"
              style={{ width: "60%", height: "40%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="common_center_tag">
                <span>Registration Re-Schedule</span>
              </div>
              <br></br>
              <div className="RegisFormcon_1">
                <div className="RegisForm_1">
                  <label htmlFor="Specialization">
                    Specialization<span>:</span>
                  </label>
                  <select
                    name="speciality"
                    id="speciality"
                    value={reshedule.speciality || ""}
                    onChange={handleSpecChange}
                  >
                    <option value="">Select</option>
                    {SpecializationData.filter(
                      (p) => p.Status === "Active"
                    ).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.SpecialityName}
                      </option>
                    ))}
                  </select>
                </div>
                <br></br>
                <br></br>
                <div className="RegisForm_1">
                  <label htmlFor="DoctorName">
                    Doctor Name<span>:</span>
                  </label>
                  <select
                    name="doctorname"
                    id="doctorname"
                    value={reshedule?.doctorname || ""}
                    onChange={handleDocChange}
                  >
                    <option value="">Select</option>
                    {/* {Array.isArray(DoctorNameData) &&
                      DoctorNameData.filter(
                        (p) =>
                          p.schedule?.[0]?.working === "yes" &&
                          reshedule.doctorid !== p.doctor_id
                      ).map((p) => (
                        <option key={p.doctor_id} value={p.doctor_id}>
                          {p.doctor_name}
                        </option>
                      ))} */}

                    {Array.isArray(DoctorNameData) &&
                      DoctorNameData.filter(
                        (p) =>
                          p.schedule?.[0]?.working === "yes" 
                    
                      ).map((p) => (
                        <option key={p.doctor_id} value={p.doctor_id}>
                          {p.doctor_name}
                        </option>
                      ))}


                  </select>
                </div>
                <br></br>
                <br></br>
                <div className="RegisForm_1">
                  <label htmlFor="ChangingReason">
                    Changing Reason<span>:</span>
                  </label>
                  <textarea
                    name="Reshedulereason"
                    id="Reshedulereason"
                    value={reshedule.Reshedulereason || ""}
                    onChange={(e) =>
                      setReshedule((prev) => ({
                        ...prev,
                        Reshedulereason: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* <div className="ejkfh_u23">
                  <label htmlFor="RescheduledDate">
                    Rescheduled Date and Time<span>:</span>
                  </label>
                  <div style={{ height: "" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Select Date & Time"
                        value={dateTime}
                        className="ejkfh_u23_v"
                        onChange={(newValue) => setDateTime(newValue)}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth variant="outlined" />
                        )}
                        ampm
                      />
                    </LocalizationProvider>
                  </div>
                </div> */}

                <div className="RegisForm_1">
                  {" "}
                  <label htmlFor="RescheduledDate">
                    {" "}
                    Rescheduled Date and Time<span>:</span>{" "}
                  </label>{" "}
                  <DatePicker
                    selected={reshedule.rescheduledDate}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeFormat="hh:mm aa"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd hh:mm aa"
                  />
                </div>
              </div>
              <br></br>
              <div className="Main_container_Btn button">
                <button onClick={handleRescheduleSave}>Save</button>
              </div>
            </div>
          </div>

          <button onClick={handleCloseModal} className="booked_app_btn">
            <HighlightOffIcon />
          </button>
        </>
      )}

      {clickreason && (
        <div
          className="sideopen_showcamera_profile"
          onClick={() => setclickreason(false)}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="Main_container_app">
              <h3>Follow-Up</h3>
              <br />
              <div className="Op_Ip">
                {/* <div className="treatcon_body_1 txtWidth">
                  <label>
                    Reason <span>:</span>
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={reason}
                    onChange={handleOpIpChange}
                  />
                </div> */}

                {/* <div className="treatcon_body_1 txtWidth">
                  <label>
                    Ip Notes <span>:</span>
                  </label>
                  <textarea
                    id="IpNotes"
                    name="IpNotes"
                    value={IpNotes}
                    onChange={handleOpIpChange}
                  />
                </div> */}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
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

              <div className="Main_container_Btn">
                <button onClick={handleSubmitButtonClick}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* {mainfollowup && (
        <div
          className="sideopen_showcamera_profile"
          onClick={() => setmainfollowup(false)}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            
                    
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
                              ["e", "E", "+", "-"].includes(e.key) &&
                              e.preventDefault()
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
                   

            <div className="Main_container_Btn">
              <button onClick={handleSubmitButtonClick}>Submit</button>
            </div>
          </div>
        </div>
      )} */}

      {referdoctor && (
        <div
          className="overlay1"
          onClick={() => {
            setreferdoctor(false);
            setSelectedValues({});
          }}
        >
          <div className="openModal1" onClick={(e) => e.stopPropagation()}>
            <div className="Main_container_app">
              <h3>
                {selectedValues.labelname} - Patient Name:{" "}
                {selectedrow?.PatientName}
              </h3>
              <br />
              {selectedValues.key === "referdoctor" && (
                <div
                  className="RegisFormcon"
                  style={{ flexDirection: "column", rowGap: "10px" }}
                >
                  <div className="RegisForm_1">
                    <label htmlFor="doctorType">
                      Doctor Type<span>:</span>
                    </label>
                    <select
                      id="doctorType"
                      name="doctorType"
                      className="selectField5"
                      value={formData.doctorType}
                      onChange={handleInputChange}
                    >
                      <option value="InHouse">InHouse</option>
                      <option value="Visiting">Visiting</option>
                      <option value="OutSource">OutSource</option>
                    </select>
                  </div>

                  <div className="RegisForm_1">
                    <label>
                      Specialization <span>:</span>
                    </label>
                    <input
                      type="text"
                      list="SpecializationOptions"
                      id="Specialization"
                      name="Specialization"
                      className="inputField3"
                      value={formData.Specialization}
                      onChange={handleInputChange}
                      autoComplete="off"
                    />
                    <datalist id="SpecializationOptions">
                      {Specialization.map((speciality, index) => (
                        <option
                          key={index}
                          value={speciality.Speciality_name}
                        ></option>
                      ))}
                    </datalist>
                  </div>

                  <div className="RegisForm_1">
                    <label>
                      Doctor Name <span>:</span>
                    </label>
                    <input
                      type="text"
                      list="doctorNameOptions"
                      id="doctorName"
                      name="doctorName"
                      className="inputField3"
                      value={formData.doctorName}
                      onChange={handleInputChange}
                      autoComplete="off"
                    />
                    <datalist id="doctorNameOptions">
                      {doctorNames.map((doctor, index) => (
                        <option key={index} value={doctor.DoctorID}>
                          {`${doctor.DoctorID} - ${doctor.DoctorFullName} (${doctor.SpecialityName})`}
                        </option>
                      ))}
                    </datalist>
                  </div>

                  <div className="RegisForm_1">
                    <label>
                      Remarks <span>:</span>
                    </label>
                    <textarea
                      id="remarks"
                      name="remarks"
                      className="textareaField4"
                      value={formData.remarks}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
              )}
              {selectedValues.key === "admit" && (
                <div className="Op_Ip">
                  <div className="treatcon_body_1 txtWidth">
                    <label>
                      Reason <span>:</span>
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      value={reason}
                      onChange={handleOpIpChange}
                    />
                  </div>

                  <div className="treatcon_body_1 txtWidth">
                    <label>
                      Ip Notes <span>:</span>
                    </label>
                    <textarea
                      id="IpNotes"
                      name="IpNotes"
                      value={IpNotes}
                      onChange={handleOpIpChange}
                    />
                  </div>
                </div>
              )}
              {selectedValues.key === "ot_request" && (
                <div className="RegisFormcon">
                  <div className="RegisForm_1">
                    <label>
                      Specialization <span>:</span>
                    </label>
                    <input
                      type="text"
                      list="SpecialityOptions"
                      id="Speciality"
                      name="Speciality"
                      value={OtRequest.Speciality}
                      onChange={handleOtRequestInputChange}
                      autoComplete="off"
                    />
                    <datalist id="SpecialityOptions">
                      {Array.isArray(surgerynames) &&
                        [
                          ...new Set(
                            surgerynames.map(
                              (speciality) => speciality.Specialityname
                            )
                          ),
                        ].map((Specialityname, index) => (
                          <option key={index} value={Specialityname}></option>
                        ))}
                    </datalist>
                  </div>
                  <div className="RegisForm_1">
                    <label>
                      Surgery Name <span>:</span>
                    </label>
                    <input
                      type="text"
                      list="SurgeryOptions"
                      id="SurgeryName"
                      name="SurgeryName"
                      value={OtRequest.SurgeryName}
                      onChange={handleOtRequestInputChange}
                      autoComplete="off"
                    />

                    <datalist id="SurgeryOptions">
                      {Array.isArray(surgerynames) &&
                        surgerynames.map((surgery, index) => (
                          <option
                            key={index}
                            value={surgery.SurgeryName}
                          ></option>
                        ))}
                    </datalist>
                  </div>

                  <div className="RegisForm_1">
                    <label>
                      Surgery Requested Date <span>:</span>
                    </label>
                    <input
                      type="date"
                      name="SurgeryRequestedDate"
                      value={OtRequest.SurgeryRequestedDate}
                      onChange={handleOtRequestInputChange}
                    />
                  </div>
                </div>
              )}
              {selectedValues.key === "followup" && (
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
                        ["e", "E", "+", "-"].includes(e.key) &&
                        e.preventDefault()
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
              )}
              {selectedValues.key === "lab" && <LabTest />}
              {selectedValues.key === "Radiology" && <RadiologyTest />}

              {selectedValues.key === "Prescription" && (
                <div className="RegisFormcon_1">
                  {/* <div className="RegisForm_1">
                    <label htmlFor="title">
                      Generic Name<span>:</span>
                    </label>
                    <input
                      id="medicine"
                      name="GenericName"
                      value={formDataPrescription.GenericName}
                      onChange={handleChange}
                      list="GenericName-options"
                      autoComplete="off"
                    />
                    <datalist id="GenericName-options">
                      <option value="">Select</option>
                      {genericName.map((item, index) => (
                        <option key={index} value={item.Generic_Name}></option>
                      ))}
                    </datalist>
                  </div> */}
                  <div className="RegisForm_1">
                    <label htmlFor="title">
                      Item Name<span>:</span>
                    </label>
                    <input
                      id="medicine"
                      name="ItemName"
                      value={formDataPrescription.ItemName}
                      onChange={handleChange}
                      list="ItemName-options"
                      autoComplete="off"
                    />
                    <datalist id="ItemName-options">
                      <option value="">Select</option>
                      {Array.isArray(itemNames) &&
                        itemNames.map((item, index) => (
                          <option key={index} value={item.ItemName}>
                            {`${item.ItemId} | MRP: ${item.MRP} | Av.Qty : ${item.AvailableQuantity} `}
                          </option>
                        ))}
                    </datalist>
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="itemtype">
                      Item Type<span>:</span>
                    </label>
                    <input
                      id="itemtype"
                      name="itemtype"
                      value={formDataPrescription.itemtype}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="dose">
                      Dose<span>:</span>
                    </label>
                    <input
                      id="dose"
                      name="dose"
                      value={formDataPrescription.dose}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="title">
                      Route<span>:</span>
                    </label>
                    <select
                      id="route"
                      name="route"
                      value={formDataPrescription.route}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Oral">Oral</option>
                      <option value="Injection">Injection</option>
                      <option value="External">External</option>
                    </select>
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="notes">
                      Frequency Name<span>:</span>
                    </label>
                    <input
                      id="frequencyname"
                      name="frequencyname"
                      value={formDataPrescription.frequencyname}
                      onChange={handleChange}
                      list="frequencynamelist"
                      autoComplete="off"
                    />
                    <datalist id="frequencynamelist">
                      <option value="">Select</option>
                      {frequencydata.map((item, index) => (
                        <option key={index} value={item.FrequencyName}></option>
                      ))}
                    </datalist>
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="itemtype">
                      Frequency Type<span>:</span>
                    </label>
                    <input
                      id="frequencytype"
                      name="frequencytype"
                      value={formDataPrescription.frequencytype}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="notes">
                      Frequency<span>:</span>
                    </label>
                    <input
                      id="frequency"
                      name="frequency"
                      rows="2"
                      value={formDataPrescription.frequency}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="duration">
                      Duration<span>:</span>
                    </label>
                    <input
                      type="number"
                      id="durationNumber"
                      name="durationNumber"
                      className="dura_with1"
                      value={formDataPrescription.durationNumber}
                      onKeyDown={(e) =>
                        ["e", "E", "+", "-"].includes(e.key) &&
                        e.preventDefault()
                      }
                      onChange={handleChange}
                      disabled={formDataPrescription.frequency === "SOS"}
                    ></input>
                    <select
                      id="durationUnit"
                      name="durationUnit"
                      className="dura_with"
                      value={formDataPrescription.durationUnit}
                      onChange={handleChange}
                      disabled={formDataPrescription.frequency === "SOS"}
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="title">
                      Qty<span>:</span>
                    </label>
                    <input
                      id="qty"
                      name="qty"
                      value={formDataPrescription.qty}
                      onChange={handleChange}
                      readOnly={
                        (formDataPrescription.itemtype === "tablets" ||
                          formDataPrescription.itemtype === "TABLET" ||
                          formDataPrescription.itemtype === "TABLETS" ||
                          formDataPrescription.itemtype === "tablet") &&
                        formDataPrescription.itemtype !== ""
                      }
                      disabled={formDataPrescription.frequency === "SOS"}
                    />
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="instruction">
                      Instruction<span>:</span>
                    </label>
                    <textarea
                      id="instruction"
                      name="instruction"
                      rows="2"
                      value={formDataPrescription.instruction}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="RegisForm_1">
                    <label htmlfor="Onbehalf">
                      On Behalf Of<span>:</span>
                    </label>
                    <input
                      name="Onbehalf"
                      type="checkbox"
                      checked={formDataPrescription.Onbehalf === "Yes"} // Check if value is "yes"
                      onChange={handleChange}
                    />
                  </div>

                  {formDataPrescription.Onbehalf === "Yes" && (
                    <div className="RegisForm_1">
                      <label>
                        Prescribed By <span>:</span>
                      </label>
                      <input
                        name="Prescribedby"
                        type="text"
                        disabled={formDataPrescription.Prescribedby === "SOS"}
                        value={Prescribedby || ""} // Ensure value isn't undefined
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="Main_container_Btn">
                {selectedValues.key === "Prescription" && (
                  <>
                    <button
                      className="RegisterForm_1_btns"
                      type="button"
                      onClick={
                        editIndex !== null ? updateMedicine : addMedicine
                      }
                    >
                      {editIndex !== null ? "Update" : "Add"}
                    </button>
                  </>
                )}
              </div>

              {selectedValues.key === "Prescription" &&
                selectedMedicines.length > 0 && (
                  <div className="for">
                    <div className="Add_items_Purchase_Master">
                      <span>Selected Medicine</span>
                    </div>
                    <div className="Selected-table-container">
                      <table className="selected-medicine-table2">
                        <thead>
                          <tr>
                            <th id="slectbill_ins">GenericName</th>
                            <th id="slectbill_ins">ItemName</th>
                            <th id="slectbill_ins">Item Type</th>
                            <th id="slectbill_ins">Dose</th>
                            <th id="slectbill_ins">Route</th>
                            <th id="slectbill_ins">Frequency Name</th>
                            <th id="slectbill_ins">Frequency Type</th>
                            <th id="slectbill_ins">Frequency</th>
                            <th id="slectbill_ins">Duration</th>
                            <th id="slectbill_ins">Qty</th>
                            <th id="slectbill_ins">Instruction</th>
                            <th id="slectbill_ins">Edit</th>
                            <th id="slectbill_ins">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedMedicines.map((medicineInfo, index) => (
                            <tr key={index}>
                              <td>{medicineInfo.GenericName}</td>
                              <td>{medicineInfo.ItemName}</td>
                              <td>{medicineInfo.itemtype}</td>
                              <td>{medicineInfo.dose}</td>
                              <td>{medicineInfo.route}</td>
                              <td>{medicineInfo.frequencyname}</td>
                              <td>{medicineInfo.frequencytype}</td>
                              <td>{medicineInfo.frequency}</td>
                              <td>
                                {medicineInfo.durationNumber}{" "}
                                {medicineInfo.durationUnit}
                              </td>
                              <td>{medicineInfo.qty}</td>
                              <td>{medicineInfo.instruction}</td>
                              <td>
                                <button
                                  className="delnamebtn"
                                  onClick={() => handleEditMedicine(index)}
                                >
                                  <EditIcon />
                                </button>
                              </td>
                              <td>
                                {!IsViewMode && (
                                  <button
                                    className="delnamebtn"
                                    onClick={() => handleDeleteMedicine(index)}
                                  >
                                    <DeleteIcon />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              <br />
              {selectedValues.key !== "lab" && selectedValues.key !=="Radiology" && (
              <div className="Main_container_Btn">
                <button onClick={handleSubmitButtonClick}>Submit</button>
              </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
};

export default OP_patients;
