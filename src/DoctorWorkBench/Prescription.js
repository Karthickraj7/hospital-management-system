import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Prescription.css";
import axios from "axios";
import Button from "@mui/material/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import { useDispatch } from "react-redux";
import { IconButton } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import { useReactToPrint } from "react-to-print";
import AddBoxIcon from "@mui/icons-material/AddBox";

import VisibilityIcon from "@mui/icons-material/Visibility";

const PrintContent = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      id="reactprintcontent"
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        height: "100%",

        width: "100%",
      }}
    >
      {props.children}
    </div>
  );
});

const Prescription = () => {
  const toast = useSelector((state) => state.userRecord?.toast);

  const userRecord = useSelector((state) => state.userRecord?.UserData);
  // console.log("userRecord234", userRecord.location);
  const DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.DoctorWorkbenchNavigation
  );
  console.log("DoctorWorkbenchNavigation", DoctorWorkbenchNavigation);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [type, setType] = useState("Intake");
  const [complete, setComplete] = useState(true);

  console.log("complete", complete);
  const [showDataGrid, setShowDataGrid] = useState(true);
  const [Prescription_Id, setPrescription_Id] = useState(null);
  console.log('Prescription_Id123', Prescription_Id)
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
  });
  const [isPrescriptiondetailsGet, setIsPrescriptiondetailsGet] =
    useState(false);

  const dispatchvalue = useDispatch();

  const [selectedMedicines, setSelectedMedicines] = useState([]);

  const [prescriptionList, setPrescriptionList] = useState([]);
  const [hidesubmit, sethidesubmit] = useState("show");
  const [submitdisable, setsubmitdisable] = useState(false);
  const [completedisable, setCompletedisable] = useState(false);

  const [doctorpk, setDoctorpk] = useState([]);
  const [prevmedicine, setPrevmedicine] = useState([]);
  // console.log("prevmedicine", prevmedicine);
  const [editIndex, setEditIndex] = useState(null);
  const [genericName, setgenericName] = useState([]);
  const [nextreview, setNextreview] = useState([]);
  const [itemNames, setItemNames] = useState([]);
  const [GeneralEvaluationData, setGeneralEvaluationData] = useState([]);

  console.log(GeneralEvaluationData,'GeneralEvaluationData')
  console.log(GeneralEvaluationData?.KeyComplaint,'GeneralEvaluationData')
  const [VitalsData, setVitalsData] = useState([]);
  const [prescriptiondata, setprescriptiondata] = useState([]);
  const [LabTest, setLabTest] = useState([]);
  const [RadiologyTest, setRadiologyTest] = useState([]);
  const [advice, setAdvice] = useState([]);
  const [frequencydata, setFrequencydata] = useState([]);

  const [openModal2, setOpenModal2] = useState(false);

  const openModal = () => {
    setOpenModal2(true);
  };

  const [openRow, setOpenRow] = useState(null); // Track the row that is expanded

  const toggleRow = (index) => {
    setOpenRow(openRow === index ? null : index); // Toggle row open/close
  };

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

  const componentRef = useRef();

  const handlePageChange = (event, newType) => {
    if (newType !== null) {
      setType(newType);
    }
  };

  const ParentPrescriptioncolumns = [
    { key: "Id", name: "S.No", frozen: true },
    { key: "Primarydoctorname", name: "Doctor Name", frozen: true },
    { key: "Date", name: "Date", frozen: true },
    { key: "Time", name: "Time", frozen: true },
    {
      key: "view",
      name: "Edit",
      renderCell: (params) => (
        <IconButton
          key={`${params.row.Id}-edit-icon`}
          onClick={() => handleView(params.row)}
          aria-label="edit"
        >
          <EditIcon />
        </IconButton>
      ),
      // ),
    },
  ];

  const ChildPrescriptioncolumns = [
    { key: "ItemId", name: "Item ID" },
    { key: "ItemType", name: "Item Type" },
    { key: "ItemName", name: "Item Name" },
    { key: "Frequency", name: "Frequency" },
    { key: "Dosage", name: "Dosage" },
    { key: "Route", name: "Route" },
    { key: "Duration", name: "Duration" },
    { key: "Frequencys", name: "Frequency" },
    { key: "Qty", name: "Quantity" },
    { key: "Instruction", name: "Instruction" },
  ];

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

  const [IsViewMode, setIsViewMode] = useState(false);

  const handleedit = () => {

    console.log('bharathi')
    // Validate if both Reason and IpNotes are filled when OpIp is checked
    if (isCheckedOpIp && (!reason || !IpNotes)) {
      const tdata = {
        message:
          "Both Reason and Ip Notes must be filled after checking this Admit",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return; // Prevent further processing if validation fails
    }

    // Validate ReferDoctor section
    if (
      isCheckedReferDoctor &&
      (!formData.specialityid || !formData.Specialization)
    ) {
      const tdata = {
        message: "Select Specialization after checking this ReferDoctor",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Validate OT Request section
    if (
      isCheckedOtRequest &&
      (!OtRequest.Surgeryid ||
        !OtRequest.SurgeryRequestedDate ||
        !OtRequest.Specialityid ||
        !OtRequest.Speciality ||
        !OtRequest.SurgeryName)
    ) {
      const tdata = {
        message: "Select Speciality and Surgery Name after checking OtRequest",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Validate General Advice section
    if (isCheckedAdvice && !AdviceNotes) {
      const tdata = {
        message: "Write Advice after checking GeneralAdvice",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Validate Follow-up section
    if (
      isCheckedFollowup &&
      (!Followup.NoOfDays || !Followup.TimeInterval || !Followup.Date)
    ) {
      const tdata = {
        message: "Give next ReviewDate after checking ReviewDate",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Consolidate all form data
    const finalFormData = {
      prescriptionData: { ...formDataPrescription },
      selectedMedicines: selectedMedicines || [],
      Prescription_Id:Prescription_Id|| "",
      RegistrationId: DoctorWorkbenchNavigation?.RegistrationId,
      created_by: userRecord?.username || "",
      VisitId: DoctorWorkbenchNavigation?.VisitId || "",
      PatientId: DoctorWorkbenchNavigation?.PatientId || "",
      DoctorId: DoctorWorkbenchNavigation?.DoctorId || "",
      referDoctorData: { ...formData, isCheckedReferDoctor },
      opIpData: { reason, IpNotes, Ipid, isCheckedOpIp },
      otRequestData: { ...OtRequest, isCheckedOtRequest },
      adviceData: { AdviceNotes, ...Followup, isCheckedAdvice },
      followUpData: { ...Followup, isCheckedFollowup },
    };
    console.log('senddataedit---', finalFormData)

    axios
      .post(
        `${UrlLink}Workbench/Prescription_EditOPD_Details_link`,
        finalFormData
      )
      .then((res) => {
        const responseData = res.data;
        // console.log("responseData", responseData);
        const resData = res.data;
        const type = Object.keys(resData)[0];
        const message = Object.values(resData)[0];
        const tdata = {
          message: message,
          type: type,
        };
        dispatchvalue({ type: "toast", value: tdata });
        if (type === "success") {
          resetFormStates();
          setSelectedMedicines([]);
          setIsViewMode(false);
          sethidesubmit("hide");
          setPrescription_Id(null);
        }
        setIsPrescriptiondetailsGet((prev) => !prev);
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
  };
  // referdoctorget
  const [referarr, setReferarr] = useState([]);
  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Refer_DoctorOpd_Details_CaseSheet`, {
        params: {
          RegistrationId: DoctorWorkbenchNavigation?.pk,
          VisitId: DoctorWorkbenchNavigation?.VisitId,
          PatientId: DoctorWorkbenchNavigation?.PatientId || "",
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
  }, [UrlLink, DoctorWorkbenchNavigation, isPrescriptiondetailsGet]);

  useEffect(() => {
    axios
      .get(
        `${UrlLink}Workbench/Workbench_GeneralEvaluation_Details_CaseSheet`,
        {
          params: {
            RegistrationId: DoctorWorkbenchNavigation?.RegistrationId,
            VisitId: DoctorWorkbenchNavigation?.VisitId,
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
  }, [UrlLink, DoctorWorkbenchNavigation]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Workbench_Prescription_Details_CaseSheet`, {
        params: {
          RegistrationId: DoctorWorkbenchNavigation?.RegistrationId,
          VisitId: DoctorWorkbenchNavigation?.VisitId,
        },
      })
      .then((res) => {
        const ress = Array.isArray(res.data) ? res.data : [];
        setprescriptiondata(ress); // Ensure this sets correctly
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, DoctorWorkbenchNavigation, isPrescriptiondetailsGet]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Workbench_Vitals_Details_CaseSheet`, {
        params: {
          RegistrationId: DoctorWorkbenchNavigation?.RegistrationId,
          VisitId: DoctorWorkbenchNavigation?.VisitId,
        },
      })
      .then((res) => {
        const ress = Array.isArray(res.data) ? res.data : [];
        setVitalsData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, DoctorWorkbenchNavigation]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Workbench_Lab_Details_CaseSheet`, {
        params: {
          RegistrationId: DoctorWorkbenchNavigation?.RegistrationId,
          VisitId: DoctorWorkbenchNavigation?.VisitId,
        },
      })
      .then((res) => {
        const ress = Array.isArray(res.data) ? res.data : [];
        setLabTest(ress); // Ensure this sets correctly
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, DoctorWorkbenchNavigation]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Workbench_Radiology_Details_CaseSheet`, {
        params: {
          RegistrationId: DoctorWorkbenchNavigation?.RegistrationId,
          VisitId: DoctorWorkbenchNavigation?.VisitId,
        },
      })
      .then((res) => {
        const ress = Array.isArray(res.data) ? res.data : [];
        setRadiologyTest(ress); // Ensure this sets correctly
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, DoctorWorkbenchNavigation]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Worbench_Advice_Details_CaseSheet`, {
        params: {
          RegistrationId: DoctorWorkbenchNavigation?.RegistrationId,
          VisitId: DoctorWorkbenchNavigation?.VisitId,
        },
      })
      .then((res) => {
        const ress = Array.isArray(res.data) ? res.data : [];
        setAdvice(ress); // Ensure this sets correctly
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, DoctorWorkbenchNavigation, isPrescriptiondetailsGet]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Worbench_Review_Details_CaseSheet`, {
        params: {
          RegistrationId: DoctorWorkbenchNavigation?.RegistrationId,
          VisitId: DoctorWorkbenchNavigation?.VisitId,
        },
      })
      .then((res) => {
        const ress = Array.isArray(res.data) ? res.data : [];
        setNextreview(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, DoctorWorkbenchNavigation, isPrescriptiondetailsGet]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Prescription_OPD_Details_link`, {
        params: {
          RegistrationId: DoctorWorkbenchNavigation?.RegistrationId,
          VisitId: DoctorWorkbenchNavigation?.VisitId,
          PatientId: DoctorWorkbenchNavigation?.PatientId,
          DoctorId: DoctorWorkbenchNavigation?.DoctorId,
        },
      })
      .then((res) => {
        const ress = Array.isArray(res.data) ? res.data : [];
        console.log("ress123345", ress);
        const prescriptions = [];

        if (ress && ress.length > 0) {
          const completed = ress[0]?.prescriptions[0].prescription_data?.Status;
          // setComplete(completed);

          setDoctorpk(
            ress[0].registration_info ? [ress[0].registration_info] : []
          );
          ress.forEach((item) => {
            item.prescriptions.forEach((prescription) => {
              prescriptions.push(prescription.prescription_data);
            });
          });

          setPrescriptionList(prescriptions);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    DoctorWorkbenchNavigation?.RegistrationId,
    DoctorWorkbenchNavigation?.VisitId,
    DoctorWorkbenchNavigation?.PatientId,
    UrlLink,
    isPrescriptiondetailsGet,
  ]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Workbench_Previous_Prescription_Details`, {
        params: {
          VisitId: DoctorWorkbenchNavigation?.VisitId,
          PatientId: DoctorWorkbenchNavigation?.PatientId,
        },
      })
      .then((response) => {
        console.log("responsedatawater", response.data);
        const ress = Array.isArray(response.data) ? response.data : [];
        setPrevmedicine(ress);
      })
      .catch((error) => {
        console.error("Error fetching UOM:", error);
      });
  }, [DoctorWorkbenchNavigation, UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Item_Names_Link_fordoctor`, {
        params: {
          ItemName: formDataPrescription.ItemName,
          Genericnameid: formDataPrescription.GenericId,
          Location: userRecord.location, // Assuming `userRecord.location` is a string or valid parameter
          Store_location: 2, // Assuming `userRecord.location` is a string or valid parameter
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
    userRecord.location,
    formDataPrescription.ItemName,
    formDataPrescription.GenericId
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;

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
  };

  const addMedicine = () => {
    if (formDataPrescription.ItemName !== "") {
      const medicineData = {
        id: selectedMedicines.length + 1,
        GenericId: formDataPrescription.GenericId || '', // Ensure GenericId is included
        GenericName: formDataPrescription.GenericName || '',
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

  // ............Refer a Doctor...............

  const [isCheckedReferDoctor, setIsCheckedReferDoctor] = useState(false);

  const DoctorID = DoctorWorkbenchNavigation?.DoctorName;

  const [formData, setFormData] = useState({
    referid: "",
    doctorType: "InHouse",
    doctorName: "",
    remarks: "",
    Specialization: "",
    specialityid: "",
    doctorid: "",
  });
  console.log('formData', formData)

  const [Specialization, setSpecialization] = useState([]);
  const [doctorNames, setDoctorNames] = useState([]);
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "doctorType") {
      const newFormData = {
        doctorType: value || "InHouse",
        doctorName: "",
        remarks: "",
        doctorid: "",
        referid: formData.referid || "", // Retain referid if it's not empty
        Specialization: "",
        specialityid: "",
      };
      setFormData(newFormData);
      setDoctorNames([]); // Set the updated formData state
    } else if (name === "Specialization") {
      const selectedSpecialty = Specialization.find(
        (item) => item.Speciality_name === value
      );
      const newFormData = {
        ...formData,
        doctorName: "",
        remarks: "",
        doctorid: "",
        referid: formData.referid || "", // Retain referid if it's not empty
        Specialization: value,
        specialityid: selectedSpecialty ? selectedSpecialty.id : "",
      };
      setFormData(newFormData);
    } else if (name === "doctorName") {
      const doctorNamesMatch =
        Array.isArray(doctorNames) &&
        doctorNames.find((item) => item.DoctorFullName === value);
      const newFormData = {
        ...formData,
        doctorName: value,
        doctorid: doctorNamesMatch ? doctorNamesMatch.DoctorID : "",
        referid: formData.referid || "", // Retain referid if it's not empty
      };
      setFormData(newFormData);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChangeReferDoctor = (e) => {
    const isChecked = e.target.checked;
    setIsCheckedReferDoctor(isChecked);

    // Check if referid is not empty
    if (formData.referid !== "") {
      if (!isChecked) {
        // If unchecked and referid exists, clear formData but retain referid
        setFormData({
          doctorType: "InHouse",
          doctorName: "",
          remarks: "",
          Specialization: "",
          specialityid: "",
          doctorid: "",
          referid: formData.referid,
        });
        setDoctorNames([]);
      } else {
        // If checked and referid exists, retain the formData with referid
        setFormData((prev) => ({
          ...prev,
          referid: formData.referid,
        }));
      }
    } else {
      // If referid is empty
      if (!isChecked) {
        // If unchecked and referid is empty, clear all formData fields
        setFormData({
          doctorType: "InHouse",
          doctorName: "",
          remarks: "",
          Specialization: "",
          specialityid: "",
          doctorid: "",
          referid: "",
        });
        setDoctorNames([]);
      }
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
            DoctorID: DoctorID,
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
            setDoctorNames([]);
          } else if (Array.isArray(response.data)) {
            setDoctorNames(response.data); // Set the doctor names if the response is valid
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [
    formData.doctorType,
    DoctorID,
    formData.specialityid,
    UrlLink,
    dispatchvalue,
  ]);

  //............OP - IP

  const [reason, setreason] = useState("");
  const [IpNotes, setIpNotes] = useState("");
  const [Ipid, setIpid] = useState("");

  const [isCheckedOpIp, setIsCheckedOpIp] = useState(false);

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

  const handleCheckboxChangeOpIp = (e) => {
    const isChecked = e.target.checked;
    setIsCheckedOpIp(isChecked);

    if (Ipid === "") {
      if (!isChecked) {
        // If unchecked, clear reason and IpNotes
        setreason("");
        setIpNotes("");
        setIpid("");
      }
    } else if (Ipid !== "" && !isChecked) {
      setIpid(Ipid);
      setreason("");
      setIpNotes("");
    }
  };

  //............FollowUp

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

  // ----------------otrequest-------
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
  // ------------otrequest--------
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

  //-------------Advice

  const [AdviceNotes, setAdviceNotes] = useState("");
  const [isCheckedAdvice, setIsCheckedAdvice] = useState(false);

  const handleAdviceInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "AdviceNotes") {
      setAdviceNotes(value);
    }
  };

  const handleCheckboxChangeAdvice = (e) => {
    const isChecked = e.target.checked;
    setIsCheckedAdvice(isChecked); // Update the state for checkbox checked status

    if (!isChecked && !IsViewMode) {
      // If unchecked and not in view mode, clear advice notes
      setAdviceNotes("");
    } else if (IsViewMode && !isChecked) {
      // If unchecked and in view mode, you might want to preserve certain states
      setFollowup((prev) => {
        // You can preserve or modify the followup state here if needed
        return {
          ...prev,
        };
      });
    }
  };

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    // onAfterPrint: async () => {
    //   // Additional action after printing, if needed
    // },
    onAfterPrint: () => setShowPrintContent(false),
  });
  const [showPrintContent, setShowPrintContent] = useState(false);

  const [showViewContent, setShowViewContent] = useState(false); // New state for viewing content

  const PrintIconfunction = () => {
    setShowPrintContent(true);
    // setComplete(false); // Show content for printing
    setTimeout(() => {
      handlePrint2(); // Trigger print
      setShowPrintContent(false);
    }, 500);
  };

  const PrintViewfunction = () => {
    setShowViewContent(true); // Show content for viewing
  };

  const [showPrescriptionPrintContent, setShowPrescriptionPrintContent] =
    useState(false);
  const [showPrescriptionViewContent, setShowPrescriptionViewContent] =
    useState(false);
  const handlePrintPres = useReactToPrint({
    content: () => componentRef.current,
    // onAfterPrint: async () => {
    //   // Additional action after printing, if needed
    // },
    onAfterPrint: () => setShowPrescriptionPrintContent(false),
  });

  const PrescriptionPrintIconfunction = () => {
    setShowPrescriptionPrintContent(true);
    // setComplete(false); // Show content for printing
    setTimeout(() => {
      handlePrintPres(); // Trigger print
      setShowPrescriptionPrintContent(false);
    }, 500);
  };

  const PrescriptionPrintViewfunction = () => {
    setShowPrescriptionViewContent(true); // Show content for viewing
  };

  const handleSubmitButtonClick = () => {
    if (isCheckedOpIp && (!reason || !IpNotes)) {
      const tdata = {
        message:
          "Both Reason and Ip Notes must be filled after checking this Admit",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    if (
      isCheckedReferDoctor &&
      (!formData.specialityid || !formData.Specialization)
    ) {
      const tdata = {
        message: "Select Specialization after checking this ReferDoctor",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    if (
      isCheckedOtRequest &&
      (!OtRequest.Surgeryid ||
        !OtRequest.SurgeryRequestedDate ||
        !OtRequest.Specialityid ||
        !OtRequest.Speciality ||
        !OtRequest.SurgeryName)
    ) {
      const tdata = {
        message: "Select Speciality and Surgery Name after checking OtRequest",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Validate General Advice section
    if (isCheckedAdvice && !AdviceNotes) {
      const tdata = {
        message: "Write Advice after checking GeneralAdvice",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Validate Follow-up section
    if (
      isCheckedFollowup &&
      (!Followup.NoOfDays || !Followup.TimeInterval || !Followup.Date)
    ) {
      const tdata = {
        message: "Give next ReviewDate after checking ReviewDate",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Consolidate all form data
    const finalFormData = {
      prescriptionData: { ...formDataPrescription },
      selectedMedicines: selectedMedicines || [],
      RegistrationId: DoctorWorkbenchNavigation?.RegistrationId,
      created_by: userRecord?.username || "",
      VisitId: DoctorWorkbenchNavigation?.VisitId || "",
      PatientId: DoctorWorkbenchNavigation?.PatientId || "",
      DoctorId: DoctorWorkbenchNavigation?.DoctorId || "",

      referDoctorData: isCheckedReferDoctor
        ? { ...formData, isCheckedReferDoctor }
        : null,
      opIpData: isCheckedOpIp ? { reason, IpNotes, isCheckedOpIp, Ipid } : null,
      otRequestData: isCheckedOtRequest
        ? { ...OtRequest, isCheckedOtRequest }
        : null,
      adviceData: isCheckedAdvice
        ? { AdviceNotes, isCheckedAdvice, ...Followup }
        : null,
      followUpData: isCheckedFollowup
        ? { ...Followup, isCheckedFollowup }
        : null,
    };

    console.log("senddata", finalFormData);

    axios
      .post(`${UrlLink}Workbench/Prescription_OPD_Details_link`, finalFormData)
      .then((res) => {
        const resData = res.data;
        const type = Object.keys(resData)[0];
        console.log('type----', type)
        const message = Object.values(resData)[0];
        console.log('message---', message)
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
          setsubmitdisable(true);
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
  };

  // Function to reset form states after successful submission
  const resetFormStates = () => {
    setAdviceNotes("");
    setFormDataPrescription({});
    setFormData({
      referid: "",
      doctorType: "InHouse",
      doctorName: "",
      remarks: "",
      Specialization: "",
      specialityid: "",
      doctorid: "",
    });
    setreason("");
    setIpNotes("");
    setIpid("");
    setFollowup({
      Followupid: "",
      NoOfDays: "",
      TimeInterval: "days",
      Date: "",
    });
    setOtRequest({});
    setIsCheckedReferDoctor(false);
    setIsCheckedOpIp(false);
    setIsCheckedFollowup(false);
    setIsCheckedOtRequest(false);
    setIsCheckedAdvice(false);
    setSelectedMedicines([]);
    setDoctorNames([]);
  };

  const handleView = (data) => {
    console.log("data", data);

    setIsViewMode(true);
    axios
      .get(`${UrlLink}Workbench/Workbench_Prescription_Details_link`, {
        params: {
          RegistrationId: data?.Registration_Id,
          VisitId: data?.VisitId,
          PatientId: data?.Patient_Id,
        },
      })
      .then((res) => {
        const prescriptionsData = Array.isArray(res.data) ? res.data : [];
        console.log('prescriptionsData', prescriptionsData)
        if (prescriptionsData.length > 0 && prescriptionsData[0]?.Prescriptions[0]?.Itemid !== "" && prescriptionsData[0]?.Prescriptions[0]?.Itemid !== null) {
          console.log("111111111111111111111111111")
          const prescriptions = prescriptionsData[0].Prescriptions;
          setSelectedMedicines(prescriptions);

          // Handle related doctor details
          const referDoctorDetails =
            prescriptionsData[0].RelatedData.ReferDoctorDetails;
          console.log('referDoctorDetails---', referDoctorDetails)
          const nextReviewDateDetails =
            prescriptionsData[0].RelatedData.NextReviewDateDetails;
          const otrequest = prescriptionsData[0].RelatedData.OtRequestDetails;
          const optoip = prescriptionsData[0].RelatedData.OptoIpDetails;
          if (optoip) {
            setIsCheckedOpIp(true);
            setreason(optoip.OptoIpReason);
            setIpNotes(optoip.OptoIpIpNotes);
            setIpid(optoip.OptoIpId);
          } else {
            setIsCheckedOpIp(false);
            setreason("");
            setIpNotes("");
            setIpid("");
          }
          if (otrequest) {
            setIsCheckedOtRequest(true);
            setOtRequest({
              OtRequestid: otrequest.OtRequestId || "",
              SurgeryName: otrequest.SurgeryName || "",
              Surgeryid: otrequest.Specialityid || "",
              SurgeryRequestedDate: otrequest.SurgeryRequestedDate || "",
              Specialityid: otrequest.Specialityid || "",
              Speciality: otrequest.Specialityname || "",
            });
          } else {
            setIsCheckedOtRequest(false);
            setOtRequest({
              OtRequestid: "",
              SurgeryName: "",
              Surgeryid: "",
              SurgeryRequestedDate: "",
              Speciality: "",
              Specialityid: "",
            });
          }

          if (referDoctorDetails) {
            console.log("referDoctorDetails", referDoctorDetails);
            setIsCheckedReferDoctor(true);
            setFormData({
              referid: referDoctorDetails.ReferDoctorId || "",
              doctorType: referDoctorDetails.ReferDoctorType || "",
              remarks: referDoctorDetails.Remarks || "",
              Specialization:
                referDoctorDetails.ReferDoctorSpecialityName || "",
              specialityid: referDoctorDetails.ReferDoctorSpeciality || "",
              doctorid: referDoctorDetails.ReferDoctorid || "",
              doctorName: referDoctorDetails.ReferDoctorName || "",
            });
          } else {
            // Reset form data if no refer doctor details
            setIsCheckedReferDoctor(false);
            setFormData({
              referid: "",
              doctorType: "",
              remarks: "",
              Specialization: "",
              specialityid: "",
              doctorid: "",
              doctorName: ""
            });
          }

          // Handle next review date details
          if (nextReviewDateDetails) {
            if (nextReviewDateDetails.GeneralAdivice !== "") {
              setIsCheckedAdvice(true);
              // Use nextReviewDateDetails.Date directly if it's a string
              setFollowup({
                Followupid: nextReviewDateDetails.NextReviewId,
              });
              setAdviceNotes(nextReviewDateDetails.GeneralAdivice);
            } else {
              setIsCheckedAdvice(false);
              setAdviceNotes("");
              // Use nextReviewDateDetails.Date directly if it's a string
              setFollowup({
                Followupid: "",
              });
            }

            if (
              nextReviewDateDetails.NoOfDays &&
              nextReviewDateDetails.TimeInterval &&
              nextReviewDateDetails.Date
            ) {
              // Use nextReviewDateDetails.Date directly if it's a string
              setFollowup({
                Followupid: nextReviewDateDetails.NextReviewId,
                NoOfDays: nextReviewDateDetails.NoOfDays,
                TimeInterval: nextReviewDateDetails.TimeInterval,
                Date: nextReviewDateDetails.Date, // Use the Date as it is
              });
              setIsCheckedFollowup(true);
            } else {
              setIsCheckedFollowup(false);
              setFollowup({
                NoOfDays: "",
                TimeInterval: "days",
                Date: "",
                Followupid: "",
              });
            }
          } else {
            // Reset follow-up if no details are available
            setIsCheckedFollowup(false);
            setFollowup({
              NoOfDays: "",
              TimeInterval: "days",
              Date: "",
            });
          }

        }
        else if (prescriptionsData.length > 0 && prescriptionsData[0]?.Prescriptions[0]?.PrescriptionId) {
          console.log('22222222222222222222222222222222')
          setSelectedMedicines([]);
          setPrescription_Id(prescriptionsData[0]?.Prescriptions[0]?.PrescriptionId);
          const referDoctorDetails =
            prescriptionsData[0].RelatedData.ReferDoctorDetails;
          console.log('referDoctorDetails---', referDoctorDetails)
          const nextReviewDateDetails =
            prescriptionsData[0].RelatedData.NextReviewDateDetails;
          const otrequest = prescriptionsData[0].RelatedData.OtRequestDetails;
          const optoip = prescriptionsData[0].RelatedData.OptoIpDetails;
          if (optoip) {
            setIsCheckedOpIp(true);
            setreason(optoip.OptoIpReason);
            setIpNotes(optoip.OptoIpIpNotes);
            setIpid(optoip.OptoIpId);
          } else {
            setIsCheckedOpIp(false);
            setreason("");
            setIpNotes("");
            setIpid("");
          }
          if (otrequest) {
            setIsCheckedOtRequest(true);
            setOtRequest({
              OtRequestid: otrequest.OtRequestId || "",
              SurgeryName: otrequest.SurgeryName || "",
              Surgeryid: otrequest.Specialityid || "",
              SurgeryRequestedDate: otrequest.SurgeryRequestedDate || "",
              Specialityid: otrequest.Specialityid || "",
              Speciality: otrequest.Specialityname || "",
            });
          } else {
            setIsCheckedOtRequest(false);
            setOtRequest({
              OtRequestid: "",
              SurgeryName: "",
              Surgeryid: "",
              SurgeryRequestedDate: "",
              Speciality: "",
              Specialityid: "",
            });
          }

          if (referDoctorDetails) {
            console.log("referDoctorDetails", referDoctorDetails);
            setIsCheckedReferDoctor(true);
            setFormData({
              referid: referDoctorDetails.ReferDoctorId || "",
              doctorType: referDoctorDetails.ReferDoctorType || "",
              remarks: referDoctorDetails.Remarks || "",
              Specialization:
                referDoctorDetails.ReferDoctorSpecialityName || "",
              specialityid: referDoctorDetails.ReferDoctorSpeciality || "",
              doctorid: referDoctorDetails.ReferDoctorid || "",
              doctorName: referDoctorDetails.ReferDoctorName || "",
            });
          } else {
            // Reset form data if no refer doctor details
            setIsCheckedReferDoctor(false);
            setFormData({
              referid: "",
              doctorType: "",
              remarks: "",
              Specialization: "",
              specialityid: "",
              doctorid: "",
              doctorName: ""
            });
          }

          // Handle next review date details
          if (nextReviewDateDetails) {
            if (nextReviewDateDetails.GeneralAdivice !== "") {
              setIsCheckedAdvice(true);
              // Use nextReviewDateDetails.Date directly if it's a string
              setFollowup({
                Followupid: nextReviewDateDetails.NextReviewId,
              });
              setAdviceNotes(nextReviewDateDetails.GeneralAdivice);
            } else {
              setIsCheckedAdvice(false);
              setAdviceNotes("");
              // Use nextReviewDateDetails.Date directly if it's a string
              setFollowup({
                Followupid: "",
              });
            }

            if (
              nextReviewDateDetails.NoOfDays &&
              nextReviewDateDetails.TimeInterval &&
              nextReviewDateDetails.Date
            ) {
              // Use nextReviewDateDetails.Date directly if it's a string
              setFollowup({
                Followupid: nextReviewDateDetails.NextReviewId,
                NoOfDays: nextReviewDateDetails.NoOfDays,
                TimeInterval: nextReviewDateDetails.TimeInterval,
                Date: nextReviewDateDetails.Date, // Use the Date as it is
              });
              setIsCheckedFollowup(true);
            } else {
              setIsCheckedFollowup(false);
              setFollowup({
                NoOfDays: "",
                TimeInterval: "days",
                Date: "",
                Followupid: "",
              });
            }
          } else {
            // Reset follow-up if no details are available
            setIsCheckedFollowup(false);
            setFollowup({
              NoOfDays: "",
              TimeInterval: "days",
              Date: "",
            });
          }

        }

        else {
          setSelectedMedicines([]); // Clear if no data
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCompleteButtonClick = () => {
    const finalvisitData = {
      RegistrationId: DoctorWorkbenchNavigation?.RegistrationId,
      VisitId: DoctorWorkbenchNavigation?.VisitId || "",
      PatientId: DoctorWorkbenchNavigation?.PatientId || "",
      DoctorId: DoctorWorkbenchNavigation?.DoctorId || "",
      isvisitcomplete: true, // Directly setting to true here
    };

    if (
      finalvisitData.RegistrationId &&
      finalvisitData.VisitId &&
      finalvisitData.DoctorId &&
      finalvisitData.PatientId
    ) {
      axios
        .post(
          `${UrlLink}Workbench/Prescription_OPDComplete_Details_link`,
          finalvisitData
        )
        .then((res) => {
          const { data: resData } = res;
          console.log("res", res);
          const type = Object.keys(resData)[0];
          const message = Object.values(resData)[0];
          // setComplete(true);
          setShowDataGrid(false);
          setIsPrescriptiondetailsGet((prev) => !prev);
          dispatchvalue({
            type: "toast",
            value: { message, type },
          });
          setCompletedisable(true);
          // setOpenModal2(false);
        })
        .catch((error) => {
          console.error(
            "An error occurred while submitting complete data:",
            error
          );
        });
    } else {
      // setComplete(true);
      setShowDataGrid(false);
      dispatchvalue({
        type: "toast",
        value: {
          message: "Not complete. Missing required data.",
          type: "warn",
        },
      });
    }
  };




  const handleAddPreviousMedicine = (row) => {
    console.log("566", row);
    if (row) {
      setFormDataPrescription({
        Prescription_Id: "",
        GenericId: row.GenericId || "",
        GenericName: row.GenericName || "",
        Itemid: row.Itemid || "",
        ItemName: row.ItemName || "",
        itemtype: row.itemtype || "",
        dose: row.dose || "",
        route: row.route || "",
        qty: row.qty || "",
        frequencyname: row.frequencyname || "",
        frequencyid: row.frequencyid || "",
        frequency: row.frequency || row.frequencys || "",
        frequencytype: row.frequencytype || "",
        durationNumber: row.durationNumber || "",
        durationUnit: row.durationUnit || "",
      });
    }
  };

  return (
    <>
      <div className="RegisFormcon_1">
 <div className="RegisFormcon">
                <div
                  style={{
                    width: "100%",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <ToggleButtonGroup
                    value={type}
                    exclusive
                    onChange={handlePageChange}
                    aria-label="Platform"
                  >
                    <ToggleButton
                      value="Intake"
                      style={{
                        height: "30px",
                        width: "180px",
                        backgroundColor:
                          type === "Intake"
                            ? "var(--selectbackgroundcolor)"
                            : "inherit",
                      }}
                      className="togglebutton_container"
                    >
                      Add Drugs
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
                {type === "Intake" && (
                  <>
                    <div className="RegisFormcon">
                      <div className="common_center_tag">
                        <span>Prescription</span>
                      </div>

                      {/* previous medicine */}

                      {type === "Intake" && (
                        <>
                          {Array.isArray(prevmedicine) &&
                            prevmedicine.length > 0 ? ( // Check if prescriptionList is an array and has items
                            <div className="for" style={{ paddingLeft: '0px' }}>
                              <div className="Selected-table-container">
                                <table className="selected-medicine-table2">
                                  <thead>
                                    <tr>

                                      <th id="slectbill_ins">Item Name</th>
                                      <th id="slectbill_ins">Item Type</th>
                                      <th id="slectbill_ins">Dosage</th>
                                      <th id="slectbill_ins">Route</th>
                                      <th id="slectbill_ins">Frequency Name</th>
                                      <th id="slectbill_ins">Frequency Type</th>
                                      <th id="slectbill_ins">Frequency</th>
                                      <th id="slectbill_ins">Duration</th>
                                      <th id="slectbill_ins">Qty</th>
                                      <th id="slectbill_ins">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {prevmedicine.map((item, index) => (
                                      <tr key={item.Id || index}>
                                        {/* Log the item for debugging */}

                                        <td>
                                          {item.ItemName || "No ItemName"}
                                        </td>
                                        <td>
                                          {item.itemtype || "No ItemType"}
                                        </td>
                                        <td>{item.dose || "No Dossage"}</td>
                                        <td>{item.route || "No Route"}</td>
                                        <td>
                                          {item.frequencyname ||
                                            "No FrequencyName"}
                                        </td>
                                        <td>
                                          {item.frequencytype ||
                                            "No FrequencyType"}
                                        </td>
                                        <td>
                                          {item.frequency ||
                                            item.frequencys ||
                                            "No Frequency"}
                                        </td>
                                        <td>{`${item.durationNumber} ${item.durationUnit || ""
                                          }`}</td>
                                        <td>{item.qty || "None"}</td>
                                        <td>
                                          <AddBoxIcon
                                            onClick={() =>
                                              handleAddPreviousMedicine(item)
                                            }
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </>
                      )}

                      <br></br>

                      <div className="RegisFormcon_1">
                        {0===1 &&
                        <div className="RegisForm_1">
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
                              <option
                                key={index}
                                value={item.Generic_Name}
                              ></option>
                            ))}
                          </datalist>
                        </div>
                        }
                        <div style={{borderRadius:'12px'}}>
                          <label htmlFor="title">
                            Item Name<span>:</span>
                          </label>
                          <input
                          style={{borderRadius:'12px',height:'30px',borderWidth:'1px'}}
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
                        {0===1 &&
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
                        }
                        {0===1 &&
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
                        }
                        <div className="">
                          <label htmlFor="title">
                            Route<span>:</span>
                          </label>
                          <select
                          style={{borderRadius:'15px'}}
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
                        <div className="">
                          <label htmlFor="notes">
                            Frequency Name<span>:</span>
                          </label>
                          <input
                             style={{borderRadius:'12px',height:'30px',borderWidth:'1px'}}
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
                              <option
                                key={index}
                                value={item.FrequencyName}
                              ></option>
                            ))}
                          </datalist>
                        </div>
                        {0===1&&
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
                        }

                        {0==1 &&
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
                        }
                        <div style={{padding:'12px'}}>
                          <label style={{paddingRight:'22px'}} htmlFor="duration">
                            Duration<span>:</span>
                          </label >
                          
                          <input
                          style={{paddingLeft:'12px',width:'50px',borderWidth:'1px',gap:'12px',borderRadius:'12px'}}
                            type="number"
                            id="durationNumber"
                            name="durationNumber"
                         
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
                          style={{padding :'0 5px',borderRadius
                            :'15px'
                          }}
                            value={formDataPrescription.durationUnit}
                            onChange={handleChange}
                            disabled={formDataPrescription.frequency === "SOS"}
                          >
                            {/* <option value="">Select</option> */}
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                            <option value="months">Months</option>
                          </select>
                        </div>
                        <div className="">
                          <label htmlFor="title">
                            Qty<span>:</span>
                          </label>
                          <input
                             style={{borderRadius:'12px',borderWidth:'1px',height:'30px',padding:'10px'}}
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
                        <div className="">
                          <label htmlFor="instruction">
                            Instruction<span>:</span>
                          </label>
                          <textarea
                             style={{borderRadius:'12px',height:'30px',padding:'5px 12px'}}
                            id="instruction"
                            name="instruction"
                            rows="2"
                            value={formDataPrescription.instruction}
                            onChange={handleChange}
                          ></textarea>
                        </div>
                      </div>

                      {type === "Intake" && (
                        <div className="Main_container_Btn">
                          <button
                            className="RegisterForm_1_btns"
                            type="button"
                            onClick={
                              editIndex !== null ? updateMedicine : addMedicine
                            }
                          >
                            {editIndex !== null ? "Update " : "Add "}
                          </button>
                        </div>
                      )}

                      {selectedMedicines.length > 0 && selectedMedicines[0]?.Itemid && (
                        <div className="for" style={{ paddingLeft: '0px' }}>
                          <div className="Add_items_Purchase_Master">
                            <span>Selected Medicine</span>
                          </div>
                          <div className="Selected-table-container">
                            <table className="selected-medicine-table2">
                              <thead>
                                <tr>

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
                                  <th id="slectbill_ins">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedMedicines.map(
                                  (medicineInfo, index) => (
                                    <tr key={index}>

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
                                          onClick={() =>
                                            handleEditMedicine(index)
                                          }
                                        >
                                          <EditIcon />
                                        </button>

                                        {!IsViewMode ? (
                                          <button
                                            className="delnamebtn"
                                            onClick={() =>
                                              handleDeleteMedicine(index)
                                            }
                                          >
                                            <DeleteIcon />
                                          </button>
                                        ) : null}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {type === "Output" && (
                  <>
                    {Array.isArray(prescriptionList) &&
                      prescriptionList.length > 0 ? ( // Check if prescriptionList is an array and has items
                      <div className="for" style={{ paddingLeft: '0px' }}>
                        <div className="Selected-table-container">
                          <table className="selected-medicine-table2">
                            <thead>
                              <tr>
                                <th id="slectbill_ins">Item Name</th>
                                <th id="slectbill_ins">Item Type</th>
                                <th id="slectbill_ins">Dosage</th>
                                <th id="slectbill_ins">Route</th>
                                <th id="slectbill_ins">Frequency Name</th>
                                <th id="slectbill_ins">Frequency Type</th>
                                <th id="slectbill_ins">Frequency</th>
                                <th id="slectbill_ins">Duration</th>
                                <th id="slectbill_ins">Qty</th>
                                <th id="slectbill_ins">Instruction</th>
                              </tr>
                            </thead>
                            <tbody>
                              {prescriptionList.map((item, index) => (
                                <tr key={item.Id || index}>
                                  {console.log("item", item)}{" "}
                                  {/* Log the item for debugging */}
                                  <td>{item.ItemName || "No ItemName"}</td>
                                  <td>{item.ItemType || "No ItemType"}</td>
                                  <td>{item.Dosage || "No Dossage"}</td>
                                  <td>{item.Route || "No Route"}</td>
                                  <td>
                                    {item.FrequencyName || "No FrequencyName"}
                                  </td>
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
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <div>
                  {/* Refer a Doctor */}
                  {type === "Intake" && (
                    <div className="">
                      <br />

                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            gap: "5px",
                            width: "160px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isCheckedReferDoctor}
                            onChange={handleCheckboxChangeReferDoctor}
                          />
                          Refer a Doctor
                        </label>
                      </div>

                      {/* Conditionally render the form elements */}
                      {isCheckedReferDoctor && (
                        <>
                          <br />
                          <div className="RegisFormcon">
                            <div className="RegisForm_1">
                              <label htmlFor="doctorType">
                                Doctor Type<span>:</span>
                              </label>
                              <select
                                id="doctorType"
                                name="doctorType"
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
                                value={formData.doctorName}
                                onChange={handleInputChange}
                                autoComplete="off"
                              />
                           

                              <datalist id="doctorNameOptions">
                                {doctorNames.length > 0 &&
                                  doctorNames
                                    .filter(doctor => doctor.DoctorID !== DoctorWorkbenchNavigation.DoctorId)
                                    .map((doctor, index) => (
                                      <option key={index} value={doctor.DoctorFullName}>
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
                                value={formData.remarks}
                                onChange={handleInputChange}
                              ></textarea>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  {/* OP-IP / Admit*/}
                  {type === "Intake" && (
                    <div className="">
                      <br />
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            gap: "5px",
                            width: "160px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isCheckedOpIp}
                            onChange={handleCheckboxChangeOpIp}
                          />
                          Admit
                        </label>
                      </div>

                      {isCheckedOpIp && (
                        <>
                          <br />
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
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  {/* OtRequest */}
                  {type === "Intake" && (
                    <div className="">
                      <br />
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            gap: "5px",
                            width: "160px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isCheckedOtRequest}
                            onChange={handleCheckboxChangeOtRequest}
                          />
                          OT Request
                        </label>
                      </div>

                      {isCheckedOtRequest && (
                        <>
                          <br />
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
                                        (speciality) =>
                                          speciality.Specialityname
                                      )
                                    ),
                                  ].map((Specialityname, index) => (
                                    <option
                                      key={index}
                                      value={Specialityname}
                                    ></option>
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
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  {/* General Advice */}
                  {type === "Intake" && (
                    <div className="">
                      <br />
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            gap: "5px",
                            width: "160px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isCheckedAdvice}
                            onChange={handleCheckboxChangeAdvice}
                          />
                          General Advice
                        </label>
                      </div>

                      {isCheckedAdvice && (
                        <>
                          <br />
                          <div className="Op_Ip">
                            <div className="treatcon_body_1 txtWidth">
                              <label>
                                Advice Notes <span>:</span>
                              </label>
                              <textarea
                                id="AdviceNotes"
                                name="AdviceNotes"
                                value={AdviceNotes}
                                onChange={handleAdviceInputChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  {/* FollowUp / next review date */}
                  {type === "Intake" && (
                    <div className="">
                      <br />
                      <div className="">
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <label
                            style={{
                              display: "flex",
                              gap: "5px",
                              width: "160px",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isCheckedFollowup}
                              onChange={handleCheckboxChangeFollowup}
                            />
                            Next Review Date
                          </label>
                        </div>
                        {isCheckedFollowup && (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ------------- */}
              {type === "Intake" && (
                <div className="Main_container_Btn">
                  {IsViewMode ? (
                    <button onClick={handleedit}>Update</button>
                  ) : (
                    hidesubmit === "show" && (
                      <>
                        <button
                          disabled={submitdisable}
                          onClick={handleSubmitButtonClick}
                          style={{
                            cursor: submitdisable ? "not-allowed" : "pointer",
                          }}
                        >
                          {submitdisable ? "Submitted" : "Submit"}
                        </button>
                      </>
                    )
                  )}
                </div>
              )}

              <div className="RegisFormcon_1 jjxjx_">
                {type === "Intake" && doctorpk.length > 0 && showDataGrid && (
                  <ReactGrid
                    columns={ParentPrescriptioncolumns}
                    RowData={doctorpk}
                  />
                )}
              </div>

              {type === "Intake" && (
                <div className="Main_container_Btn">
                  <button
                    disabled={completedisable}
                    onClick={handleCompleteButtonClick}
                    style={{
                      cursor: completedisable ? "not-allowed" : "pointer",
                    }}
                  > {completedisable ? "Completed" : "Complete"}
                  </button>
                </div>
              )}

              
           





        {/* <div
          style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}
        >
          <Button
            className="cell_btn"
            style={{
              backgroundColor: "skyblue",
              width: "110px",
              fontSize: "13px",
            }}
            onClick={openModal}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                cursor: "pointer",
                alignItems: "center",
                fontSize: "11px",
                gap: "3px",
                justifyContent: "center",
              }}
            >
              <AddIcon style={{ fontSize: "17px" }} />
              Prescription
            </div>
          </Button>
        </div> */}

        {openModal2 && (
          <div
            className="sideopen_showcamera_profile"
            onClick={() => setOpenModal2(false)}
          >
            <div
              className="newwProfiles newwPopupforreason"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="RegisFormcon">
                <div
                  style={{
                    width: "100%",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <ToggleButtonGroup
                    value={type}
                    exclusive
                    onChange={handlePageChange}
                    aria-label="Platform"
                  >
                    <ToggleButton
                      value="Intake"
                      style={{
                        height: "30px",
                        width: "180px",
                        backgroundColor:
                          type === "Intake"
                            ? "var(--selectbackgroundcolor)"
                            : "inherit",
                      }}
                      className="togglebutton_container"
                    >
                      Add Drugs
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
                {type === "Intake" && (
                  <>
                    <div className="RegisFormcon">
                      <div className="common_center_tag">
                        <span>Prescription</span>
                      </div>

                      {/* previous medicine */}

                      {type === "Intake" && (
                        <>
                          {Array.isArray(prevmedicine) &&
                            prevmedicine.length > 0 ? ( // Check if prescriptionList is an array and has items
                            <div className="for" style={{ paddingLeft: '0px' }}>
                              <div className="Selected-table-container">
                                <table className="selected-medicine-table2">
                                  <thead>
                                    <tr>

                                      <th id="slectbill_ins">Item Name</th>
                                      <th id="slectbill_ins">Item Type</th>
                                      <th id="slectbill_ins">Dosage</th>
                                      <th id="slectbill_ins">Route</th>
                                      <th id="slectbill_ins">Frequency Name</th>
                                      <th id="slectbill_ins">Frequency Type</th>
                                      <th id="slectbill_ins">Frequency</th>
                                      <th id="slectbill_ins">Duration</th>
                                      <th id="slectbill_ins">Qty</th>
                                      <th id="slectbill_ins">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {prevmedicine.map((item, index) => (
                                      <tr key={item.Id || index}>
                                        {/* Log the item for debugging */}

                                        <td>
                                          {item.ItemName || "No ItemName"}
                                        </td>
                                        <td>
                                          {item.itemtype || "No ItemType"}
                                        </td>
                                        <td>{item.dose || "No Dossage"}</td>
                                        <td>{item.route || "No Route"}</td>
                                        <td>
                                          {item.frequencyname ||
                                            "No FrequencyName"}
                                        </td>
                                        <td>
                                          {item.frequencytype ||
                                            "No FrequencyType"}
                                        </td>
                                        <td>
                                          {item.frequency ||
                                            item.frequencys ||
                                            "No Frequency"}
                                        </td>
                                        <td>{`${item.durationNumber} ${item.durationUnit || ""
                                          }`}</td>
                                        <td>{item.qty || "None"}</td>
                                        <td>
                                          <AddBoxIcon
                                            onClick={() =>
                                              handleAddPreviousMedicine(item)
                                            }
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </>
                      )}

                      <br></br>

                      <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
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
                              <option
                                key={index}
                                value={item.Generic_Name}
                              ></option>
                            ))}
                          </datalist>
                        </div>
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

                        {0==1 &&
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
                        }
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
                              <option
                                key={index}
                                value={item.FrequencyName}
                              ></option>
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
                            {/* <option value="">Select</option> */}
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
                      </div>

                      {type === "Intake" && (
                        <div className="Main_container_Btn">
                          <button
                            className="RegisterForm_1_btns"
                            type="button"
                            onClick={
                              editIndex !== null ? updateMedicine : addMedicine
                            }
                          >
                            {editIndex !== null ? "Update " : "Add "}
                          </button>
                        </div>
                      )}

                      {selectedMedicines.length > 0 && selectedMedicines[0]?.Itemid && (
                        <div className="for" style={{ paddingLeft: '0px' }}>
                          <div className="Add_items_Purchase_Master">
                            <span>Selected Medicine</span>
                          </div>
                          <div className="Selected-table-container">
                            <table className="selected-medicine-table2">
                              <thead>
                                <tr>

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
                                  <th id="slectbill_ins">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedMedicines.map(
                                  (medicineInfo, index) => (
                                    <tr key={index}>

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
                                          onClick={() =>
                                            handleEditMedicine(index)
                                          }
                                        >
                                          <EditIcon />
                                        </button>

                                        {!IsViewMode ? (
                                          <button
                                            className="delnamebtn"
                                            onClick={() =>
                                              handleDeleteMedicine(index)
                                            }
                                          >
                                            <DeleteIcon />
                                          </button>
                                        ) : null}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {type === "Output" && (
                  <>
                    {Array.isArray(prescriptionList) &&
                      prescriptionList.length > 0 ? ( // Check if prescriptionList is an array and has items
                      <div className="for" style={{ paddingLeft: '0px' }}>
                        <div className="Selected-table-container">
                          <table className="selected-medicine-table2">
                            <thead>
                              <tr>
                                <th id="slectbill_ins">Item Name</th>
                                <th id="slectbill_ins">Item Type</th>
                                <th id="slectbill_ins">Dosage</th>
                                <th id="slectbill_ins">Route</th>
                                <th id="slectbill_ins">Frequency Name</th>
                                <th id="slectbill_ins">Frequency Type</th>
                                <th id="slectbill_ins">Frequency</th>
                                <th id="slectbill_ins">Duration</th>
                                <th id="slectbill_ins">Qty</th>
                                <th id="slectbill_ins">Instruction</th>
                              </tr>
                            </thead>
                            <tbody>
                              {prescriptionList.map((item, index) => (
                                <tr key={item.Id || index}>
                                  {console.log("item", item)}{" "}
                                  {/* Log the item for debugging */}
                                  <td>{item.ItemName || "No ItemName"}</td>
                                  <td>{item.ItemType || "No ItemType"}</td>
                                  <td>{item.Dosage || "No Dossage"}</td>
                                  <td>{item.Route || "No Route"}</td>
                                  <td>
                                    {item.FrequencyName || "No FrequencyName"}
                                  </td>
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
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <div>
                  {/* Refer a Doctor */}
                  {type === "Intake" && (
                    <div className="">
                      <br />

                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            gap: "5px",
                            width: "160px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isCheckedReferDoctor}
                            onChange={handleCheckboxChangeReferDoctor}
                          />
                          Refer a Doctor
                        </label>
                      </div>

                      {/* Conditionally render the form elements */}
                      {isCheckedReferDoctor && (
                        <>
                          <br />
                          <div className="RegisFormcon">
                            <div className="RegisForm_1">
                              <label htmlFor="doctorType">
                                Doctor Type<span>:</span>
                              </label>
                              <select
                                id="doctorType"
                                name="doctorType"
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
                                value={formData.doctorName}
                                onChange={handleInputChange}
                                autoComplete="off"
                              />
                              {/* <datalist id="doctorNameOptions">
                                {doctorNames.length > 0 &&
                                  doctorNames.map((doctor, index) => (
                                    <option
                                      key={index}
                                      value={doctor.ShortName}
                                    >
                                      {`${doctor.DoctorID} - ${doctor.ShortName} (${doctor.SpecialityName})`}
                                    </option>
                                  ))}
                              </datalist> */}

                              <datalist id="doctorNameOptions">
                                {doctorNames.length > 0 &&
                                  doctorNames
                                    .filter(doctor => doctor.DoctorID !== DoctorWorkbenchNavigation.DoctorId)
                                    .map((doctor, index) => (
                                      <option key={index} value={doctor.DoctorFullName}>
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
                                value={formData.remarks}
                                onChange={handleInputChange}
                              ></textarea>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  {/* OP-IP / Admit*/}
                  {type === "Intake" && (
                    <div className="">
                      <br />
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            gap: "5px",
                            width: "160px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isCheckedOpIp}
                            onChange={handleCheckboxChangeOpIp}
                          />
                          Admit
                        </label>
                      </div>

                      {isCheckedOpIp && (
                        <>
                          <br />
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
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  {/* OtRequest */}
                  {type === "Intake" && (
                    <div className="">
                      <br />
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            gap: "5px",
                            width: "160px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isCheckedOtRequest}
                            onChange={handleCheckboxChangeOtRequest}
                          />
                          OT Request
                        </label>
                      </div>

                      {isCheckedOtRequest && (
                        <>
                          <br />
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
                                        (speciality) =>
                                          speciality.Specialityname
                                      )
                                    ),
                                  ].map((Specialityname, index) => (
                                    <option
                                      key={index}
                                      value={Specialityname}
                                    ></option>
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
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  {/* General Advice */}
                  {type === "Intake" && (
                    <div className="">
                      <br />
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            gap: "5px",
                            width: "160px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isCheckedAdvice}
                            onChange={handleCheckboxChangeAdvice}
                          />
                          General Advice
                        </label>
                      </div>

                      {isCheckedAdvice && (
                        <>
                          <br />
                          <div className="Op_Ip">
                            <div className="treatcon_body_1 txtWidth">
                              <label>
                                Advice Notes <span>:</span>
                              </label>
                              <textarea
                                id="AdviceNotes"
                                name="AdviceNotes"
                                value={AdviceNotes}
                                onChange={handleAdviceInputChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  {/* FollowUp / next review date */}
                  {type === "Intake" && (
                    <div className="">
                      <br />
                      <div className="">
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
                          <label
                            style={{
                              display: "flex",
                              gap: "5px",
                              width: "160px",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isCheckedFollowup}
                              onChange={handleCheckboxChangeFollowup}
                            />
                            Next Review Date
                          </label>
                        </div>
                        {isCheckedFollowup && (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ------------- */}
              {type === "Intake" && (
                <div className="Main_container_Btn">
                  {IsViewMode ? (
                    <button onClick={handleedit}>Update</button>
                  ) : (
                    hidesubmit === "show" && (
                      <>
                        <button
                          disabled={submitdisable}
                          onClick={handleSubmitButtonClick}
                          style={{
                            cursor: submitdisable ? "not-allowed" : "pointer",
                          }}
                        >
                          {submitdisable ? "Submitted" : "Submit"}
                        </button>
                      </>
                    )
                  )}
                </div>
              )}

              <div className="RegisFormcon_1 jjxjx_">
                {type === "Intake" && doctorpk.length > 0 && showDataGrid && (
                  <ReactGrid
                    columns={ParentPrescriptioncolumns}
                    RowData={doctorpk}
                  />
                )}
              </div>

              {type === "Intake" && (
                <div className="Main_container_Btn">
                  <button
                    disabled={completedisable}
                    onClick={handleCompleteButtonClick}
                    style={{
                      cursor: completedisable ? "not-allowed" : "pointer",
                    }}
                  > {completedisable ? "Completed" : "Complete"}
                  </button>
                </div>
              )}

              <div className="Main_container_Btn">
                <button
                  onClick={() => setOpenModal2(false)} // Close the grid
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <h2
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
        >
          Case Sheet Print
        </h2>
        <div
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
        >
          <TableRow>
            <TableCell>
              <IconButton
                onClick={PrintViewfunction}
                aria-label="print case sheet"
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton
                onClick={PrintIconfunction}
                aria-label="print case sheet"
              >
                <PrintIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </div>

        <div className="NewTest_Master_grid_M_head_M">
          <TableContainer className="NewTest_Master_grid_M">
            <Table className="dehduwhd_o8i">
              <TableHead>
                <TableRow>
                  <TableCell width={10}></TableCell>
                  <TableCell width={10}>S.No</TableCell>
                  <TableCell width={100}>Doctor Name</TableCell>
                  <TableCell width={100}>Date</TableCell>
                  <TableCell width={100}>Time</TableCell>

                  <TableCell width={100}>Prescription</TableCell>
                  <TableCell width={100}>CaseSheetPrint</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctorpk.length > 0 &&
                  doctorpk.map((doctor, index) => (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => toggleRow(index)} // Pass the index here
                          >
                            {openRow === index ? (
                              <ArrowDropUpOutlinedIcon />
                            ) : (
                              <ArrowDropDownOutlinedIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>{index + 1}</TableCell>{" "}
                        <TableCell>{doctor.Primarydoctorname}</TableCell>
                        <TableCell>{doctor.Date}</TableCell>
                        <TableCell>{doctor.Time}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={PrescriptionPrintViewfunction}
                            aria-label="print prescription"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              PrescriptionPrintIconfunction(doctor)
                            }
                            aria-label="print prescription"
                          >
                            <PrintIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={PrintViewfunction}
                            aria-label="print case sheet"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => PrintIconfunction(doctor)}
                            aria-label="print case sheet"
                          >
                            <PrintIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>

                      {/* Show child grid if the row is expanded */}
                      {openRow === index && (
                        <TableRow>
                          <TableCell colSpan={8}>
                            <ReactGrid
                              columns={ChildPrescriptioncolumns}
                              RowData={prescriptionList}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {showPrintContent && (
          <PrintContent
            ref={componentRef}
            style={{
              // marginTop: "50px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div id="reactprintcontent">
              <div className="wdqwtyxghs0">
                <h2 style={{ textAlign: "center" }}>Patient Visit Details</h2>
                <h2 style={{ textAlign: "center" }}>Case Sheet</h2>

                <br />
                <div style={{ marginBottom: '20px', textAlign: "start", fontWeight: 'bold', fontSize: '16px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Prescribed by
                    <span>
                      {DoctorWorkbenchNavigation?.PatientName ? (
                        <span style={{ fontSize: '14px', fontWeight: 'bold', marginLeft: '5px' }}>
                          {DoctorWorkbenchNavigation.DoctorName}

                        </span>
                      ) : (
                        <span>No Doctor Name...</span>
                      )}
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', textAlign: 'start' }}>


                  {DoctorWorkbenchNavigation?.PatientName ? (
                    <span>
  {
    DoctorWorkbenchNavigation?.PatientName +
    " (Patient ID: " +
    DoctorWorkbenchNavigation?.PatientId +
    ") Age " +
    DoctorWorkbenchNavigation?.Age +
    " Years, " +
    DoctorWorkbenchNavigation?.Gender
  }
  {
    GeneralEvaluationData?.length > 0 &&
    (() => {
      const keyComplaints = [...new Set(GeneralEvaluationData.map(d => d.KeyComplaint))].join(", ");
      const histories = [...new Set(GeneralEvaluationData.map(d => d.History))].join(", ");
      const examines = [...new Set(GeneralEvaluationData.map(d => d.Examine))].join(", ");
      const diagnoses = [...new Set(GeneralEvaluationData.map(d => d.Diagnosis))].join(", ");

      return (
        `, was presented with ${keyComplaints}, with a history of ${histories}. ` +
        `Upon examination, ${examines}, and diagnosed with ${diagnoses}.`
      );
    })()
  }
</span>

                  ) : (
                    <span>No patient details...</span>
                  )}
                </div>

                <div
                  style={{ border: "1px solid grey", margin: "5px 0px" }}
                ></div>
              </div>
              <br />

              {/* refer */}
              <div className="dshcyts_8i">
                <div>
                  {Array.isArray(referarr) && referarr.length > 0 ? (
                    <>
                      {" "}
                      <h2 style={{ textAlign: "start" }}>
                        ReferDoctor Details
                      </h2>
                      <div className="for" style={{ paddingLeft: '0px' }}>
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
                      <div style={{ marginTop: '0px' }}>
                        <hr />
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
                    <h2 style={{ textAlign: "start" }}>Vitals</h2>
                    <div className="for" style={{ paddingLeft: '0px' }}>
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
                                <td>{item.Temperature || "No Temperature"}</td>
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
                    <div style={{ marginTop: '0px' }}>
                      <hr />
                    </div>
                  </>
                ) : (
                  <>{/* No vitals were recorded during the current visit. */}</>
                )}
              </div>

              <div className="dshcyts_8i">
                {/* <h2 style={{ textAlign: "start" }}>Treatment</h2> */}
                {Array.isArray(prescriptiondata) &&
                  prescriptiondata.length > 0 ? ( // Check if prescriptionList is an array and has items
                  <>
                    {" "}
                    <h2 style={{ textAlign: 'start' }}>Prescription</h2>
                    <div className="for" style={{ paddingLeft: '0px' }}>
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
                    <div style={{ marginTop: '0px' }}>
                      <hr />
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
                      <h2 style={{ textAlign: "start" }}>
                        Investigations Ordered
                      </h2>
                      <h2 style={{ textAlign: 'start' }}>Lab</h2>
                      <div className="for" style={{ paddingLeft: '0px' }}>
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
                      <div style={{ marginTop: '0px' }}>
                        <hr />
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
                      <h2 style={{ textAlign: "start" }}>
                        Investigations Ordered
                      </h2>
                      <h2 style={{ textAlign: 'start' }}>Radiology</h2>
                      <div className="for" style={{ paddingLeft: '0px' }}>
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
                      <div style={{ marginTop: '0px' }}>
                        <hr />
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
                      <h2 style={{ textAlign: "start" }}>Advice</h2>
                      <div className="for" style={{ paddingLeft: '10px' }}>
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
                      <div style={{ marginTop: '0px' }}>
                        <hr />
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
                      <h2 style={{ textAlign: "start" }}> Review </h2>
                      <div className="for" style={{ paddingLeft: '10px' }}>
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
                                    {nextreview[0].Date} (
                                    {nextreview[0].NoOfDays}
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
                      <div style={{ marginTop: '0px' }}>
                        <hr />
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
                    <h2 style={{ textAlign: "center" }}>
                      Patient Visit Details
                    </h2>
                    <h2 style={{ textAlign: "center" }}>Case Sheet</h2>

                    <br />

                    <div style={{ marginBottom: '20px', textAlign: "start", fontWeight: 'bold', fontSize: '16px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Prescribed by
                        <span>
                          {DoctorWorkbenchNavigation?.PatientName ? (
                            <span style={{ fontSize: '14px', fontWeight: 'bold', marginLeft: '5px' }}>
                              {DoctorWorkbenchNavigation.DoctorName}

                            </span>
                          ) : (
                            <span>No Doctor Name...</span>
                          )}
                        </span>
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', textAlign: 'start' }}>


                      {DoctorWorkbenchNavigation?.PatientName ? (
                    <span>
  {
    DoctorWorkbenchNavigation?.PatientName +
    " (Patient ID: " +
    DoctorWorkbenchNavigation?.PatientId +
    ") Age " +
    DoctorWorkbenchNavigation?.Age +
    " Years, " +
    DoctorWorkbenchNavigation?.Gender
  }
  {
    GeneralEvaluationData?.length > 0 &&
    (() => {
      const keyComplaints = [...new Set(GeneralEvaluationData.map(d => d.KeyComplaint))].join(", ");
      const histories = [...new Set(GeneralEvaluationData.map(d => d.History))].join(", ");
      const examines = [...new Set(GeneralEvaluationData.map(d => d.Examine))].join(", ");
      const diagnoses = [...new Set(GeneralEvaluationData.map(d => d.Diagnosis))].join(", ");

      return (
        `, was presented with ${keyComplaints}, with a history of ${histories}. ` +
        `Upon examination, ${examines}, and diagnosed with ${diagnoses}.`
      );
    })()
  }
</span>

                      ) : (
                        <span>No patient details...</span>
                      )}
                    </div>

                    <div
                      style={{ border: "1px solid grey", margin: "5px 0px" }}
                    ></div>
                  </div>
                  <br />

                  {/* refer */}
                  <div className="dshcyts_8i">
                    <div>
                      {Array.isArray(referarr) && referarr.length > 0 ? (
                        <>
                          {" "}
                          <h2 style={{ textAlign: "start" }}>
                            ReferDoctor Details
                          </h2>
                          <div className="for" style={{ paddingLeft: '0px' }}>
                            <div className="prin_nnrmll_table">
                              <table>
                                <thead>
                                  <tr>
                                    <th id="slectbill_ins">
                                      PrimaryDoctor Name
                                    </th>
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
                                      <td>
                                        {referarr[0].ReferDoctorSpeciality}
                                      </td>
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
                          <div style={{ marginTop: '0px' }}>
                            <hr />
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
                        <h2 style={{ textAlign: "start" }}>Vitals</h2>
                        <div className="for" style={{ paddingLeft: '0px' }}>
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
                        <div style={{ marginTop: '0px' }}>
                          <hr />
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
                        {/* <h2 style={{ textAlign: "start" }}>Treatment</h2> */}
                        <h2 style={{ textAlign: 'start' }}>Prescription</h2>
                        <div className="for" style={{ paddingLeft: '0px' }}>
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
                        <div style={{ marginTop: '0px' }}>
                          <hr />
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
                          <h2 style={{ textAlign: "start" }}>
                            Investigations Ordered
                          </h2>{" "}
                          <h2 style={{ textAlign: 'start' }}>Lab</h2>
                          <div className="for" style={{ paddingLeft: '0px' }}>
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
                          <div style={{ marginTop: '0px' }}>
                            <hr />
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
                          <h2 style={{ textAlign: "start" }}>
                            Investigations Ordered
                          </h2>{" "}
                          <h2 style={{ textAlign: 'start' }}>Radiology</h2>
                          <div className="for" style={{ paddingLeft: '0px' }}>
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
                                        {item.RadiologyName ||
                                          "No RadiologyName"}
                                      </td>
                                      <td>{item.TestName || "No TestName"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div style={{ marginTop: '0px' }}>
                            <hr />
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
                          <h2 style={{ textAlign: "start" }}>Advice</h2>
                          <div className="for" style={{ paddingLeft: '10px' }}>
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
                          <div style={{ marginTop: '0px' }}>
                            <hr />
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
                          <h2 style={{ textAlign: "start" }}> Review </h2>
                          <div className="for" style={{ paddingLeft: '10px' }}>
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
                          <div style={{ marginTop: '0px' }}>
                            <hr />
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

        {/* ---Prescription---- */}
        {showPrescriptionPrintContent && (
          <PrintContent
            ref={componentRef}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div id="reactprintcontent">
              <div className="wdqwtyxghs0">
                <h2 style={{ textAlign: "center" }}>Patient Visit Details</h2>
                <h2 style={{ textAlign: "center" }}>Case Sheet</h2>
                <br />

                <div style={{ marginBottom: '20px', textAlign: "start", fontWeight: 'bold', fontSize: '16px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Prescribed by
                    <span>
                      {DoctorWorkbenchNavigation?.PatientName ? (
                        <span style={{ fontSize: '14px', fontWeight: 'bold', marginLeft: '5px' }}>
                          {DoctorWorkbenchNavigation.DoctorName}

                        </span>
                      ) : (
                        <span>No Doctor Name...</span>
                      )}
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', textAlign: 'start' }}>


                  {DoctorWorkbenchNavigation?.PatientName ? (
                   <span>
  {
    DoctorWorkbenchNavigation?.PatientName +
    " (Patient ID: " +
    DoctorWorkbenchNavigation?.PatientId +
    ") Age " +
    DoctorWorkbenchNavigation?.Age +
    " Years, " +
    DoctorWorkbenchNavigation?.Gender
  }
  {
    GeneralEvaluationData?.length > 0 &&
    (() => {
      const keyComplaints = [...new Set(GeneralEvaluationData.map(d => d.KeyComplaint))].join(", ");
      const histories = [...new Set(GeneralEvaluationData.map(d => d.History))].join(", ");
      const examines = [...new Set(GeneralEvaluationData.map(d => d.Examine))].join(", ");
      const diagnoses = [...new Set(GeneralEvaluationData.map(d => d.Diagnosis))].join(", ");

      return (
        `, was presented with ${keyComplaints}, with a history of ${histories}. ` +
        `Upon examination, ${examines}, and diagnosed with ${diagnoses}.`
      );
    })()
  }
</span>

                  ) : (
                    <span>No patient details...</span>
                  )}
                </div>

                <div
                  style={{ border: "1px solid grey", margin: "5px 0px" }}
                ></div>
              </div>
              <br />

              <div className="dshcyts_8i">
                {Array.isArray(prescriptiondata) &&
                  prescriptiondata.length > 0 ? ( // Check if prescriptionList is an array and has items
                  <>
                    {/* <h2 style={{ textAlign: "start" }}>Treatment</h2> */}
                    <h2 style={{ textAlign: "start" }}>Prescription</h2>{" "}
                    <div className="for" style={{ paddingLeft: '0px' }}>
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
                    <div style={{ marginTop: '0px' }}>
                      <hr />
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </PrintContent>
        )}

        {showPrescriptionViewContent && (
          <div
            className="sideopen_showcamera_profile"
            onClick={() => setShowPrescriptionViewContent(false)}
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
                    <h2 style={{ textAlign: "center" }}>
                      Patient Visit Details
                    </h2>
                    <h2 style={{ textAlign: "center" }}>Case Sheet</h2>
                    <br />

                    <div style={{ marginBottom: '20px', textAlign: "start", fontWeight: 'bold', fontSize: '16px' }}>
                      <span>Prescribed by

                        {DoctorWorkbenchNavigation?.PatientName ? (
                          <span style={{ fontSize: '14px', fontWeight: 'bold', marginLeft: '5px' }}>
                            {DoctorWorkbenchNavigation.DoctorName}

                          </span>
                        ) : (
                          <span>No Doctor Name...</span>
                        )}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', textAlign: 'start' }}>


                      {DoctorWorkbenchNavigation?.PatientName ? (
                        <span>
  {
    DoctorWorkbenchNavigation?.PatientName +
    " (Patient ID: " +
    DoctorWorkbenchNavigation?.PatientId +
    ") Age " +
    DoctorWorkbenchNavigation?.Age +
    " Years, " +
    DoctorWorkbenchNavigation?.Gender
  }
  {
    GeneralEvaluationData?.length > 0 &&
    (() => {
      const keyComplaints = [...new Set(GeneralEvaluationData.map(d => d.KeyComplaint))].join(", ");
      const histories = [...new Set(GeneralEvaluationData.map(d => d.History))].join(", ");
      const examines = [...new Set(GeneralEvaluationData.map(d => d.Examine))].join(", ");
      const diagnoses = [...new Set(GeneralEvaluationData.map(d => d.Diagnosis))].join(", ");

      return (
        `, was presented with ${keyComplaints}, with a history of ${histories}. ` +
        `Upon examination, ${examines}, and diagnosed with ${diagnoses}.`
      );
    })()
  }
</span>

                      ) : (
                        <span>No patient details...</span>
                      )}
                    </div>

                    <div
                      style={{ border: "1px solid grey", margin: "5px 0px" }}
                    ></div>
                  </div>
                  <br />

                  <div className="dshcyts_8i">
                    {Array.isArray(prescriptiondata) &&
                      prescriptiondata.length > 0 ? ( // Check if prescriptionList is an array and has items
                      <>
                        {" "}
                        {/* <h2 style={{ textAlign: "start" }}>Treatment</h2> */}
                        <h2 style={{ textAlign: "start" }}>
                          Prescription
                        </h2>{" "}
                        <div className="for" style={{ paddingLeft: '0px' }}>
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
                        <div style={{ marginTop: '0px' }}>
                          <hr />
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </PrintContent>
            </div>
          </div>
        )}

        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>
    </>
  );
};

export default Prescription;
