import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import "../../IP/ICU_Management/ICU_Doctor/ICU_Assesment.css";
import "../../OtMangement/OtManagement.css";

const InsuranceMedicalHistory = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const [modalData, setModalData] = useState(null);
  const InsurancePatientDetailes = useSelector(state => state.Insurancedata?.InsurancePatientDetailes)


  console.log(InsurancePatientDetailes, "InsurancePatientDetailes");

  const dispatch = useDispatch();

  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

  const [AssessmentFormData, setAssessmentFormData] = useState({
    PresentingComplaints: "",
    DetailsPresentingComplaints: "",
    HistoryOf: "",
    PatientStatusAtAdmission: "",
    Allergies: "",
    Pupil: "",
    Cvs: "",
    Rs: "",
    Pa: "",
    Cns: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssessmentFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (
      name === "PresentingComplaints" ||
      name === "DetailsPresentingComplaints" ||
      name === "others" ||
      name === "Listnamesdates" ||
      name === "TreatmentGiven" ||
      name === "Cvs" ||

      name === "Pupil" ||

      name === "Rs" ||
      name === "Pa" ||

      name === "Cns" ||
      name === "Impression" ||

      name === "Ix" ||

      name === "ProvisionalDiagnosis" ||

      name === "FinalDiagnosis" ||
      name === "Discussion"


    ) {
      adjustHeight(e);
    }

  };


  const adjustHeight = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };


  const [medicalHistory, setMedicalHistory] = useState({
    Anemia: false,
    Arthritis: false,
    Asthma: false,
    Cancer: false,
    ChronicObstructivePulmonaryDisease: false,
    ClottingDisorder: false,
    SkinDisease: false,
    CongestiveHeartFailure: false,
    CrohnsDisease: false,
    Depression: false,
    Diabetes: false,
    Emphysema: false,
    EndocrineProblems: false,
    GERD: false,
    Glaucoma: false,
    Hepatitis: false,
    HivAids: false,
    Hypertension: false,
    KidneyDisease: false,
    MyocardialInfarction: false,
    PepticUlcerDisease: false,
    Seizures: false,
    Stroke: false,
    UlcerativeColitis: false,
  });
  const [sourceTable, setSourceTable] = useState("");
  const [others, setOthers] = useState(false); //1
  const [othersCheckbox, setOthersCheckbox] = useState("");

  const handlemedicalCheckboxChange = (key) => {
    setMedicalHistory((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
    setOthers(false);
  };

  const handlemedicalOthersChange = (event) => {
    const isChecked = event.target.checked;
    setOthers(isChecked);
    if (isChecked) {
      const updatedMedicalHistory = Object.fromEntries(
        Object.entries(medicalHistory).map(([key]) => [key, false])
      );
      setMedicalHistory(updatedMedicalHistory);
    }
    setOthersCheckbox("");
  };

  const [socialHistory, setSocialHistory] = useState({
    alcoholUseNever: false,
    alcoholUseOccasionally: false,
    alcoholUseDaily: false,

    tobaccoUseNever: false,
    tobaccoUseOccasionally: false,
    tobaccoUseDaily: false,

    SmokingUseNever: false,
    SmokingUseOccasionally: false,
    SmokingUseDaily: false,
  });

  const handleCheckboxChange2 = (name) => {
    setSocialHistory((prevState) => {
      let updatedState = { ...prevState };

      switch (name) {
        case "alcoholUseNever":
        case "alcoholUseOccasionally":
        case "alcoholUseDaily":
          updatedState = {
            ...prevState,
            alcoholUseNever: false,
            alcoholUseOccasionally: false,
            alcoholUseDaily: false,
            [name]: !prevState[name],
          };
          break;
        case "tobaccoUseNever":
        case "tobaccoUseOccasionally":
        case "tobaccoUseDaily":
          updatedState = {
            ...prevState,
            tobaccoUseNever: false,
            tobaccoUseOccasionally: false,
            tobaccoUseDaily: false,
            [name]: !prevState[name],
          };
          break;
        case "SmokingUseNever":
        case "SmokingUseOccasionally":
        case "SmokingUseDaily":
          updatedState = {
            ...prevState,
            SmokingUseNever: false,
            SmokingUseOccasionally: false,
            SmokingUseDaily: false,
            [name]: !prevState[name],
          };
          break;
        default:
          break;
      }

      return updatedState;
    });
  };

  const [familyHistory, setFamilyHistory] = useState({
    CancerPolyps: false,
    Anemia1: false,
    Diabetes1: false,
    BloodClots1: false,
    HeartDisease1: false,
    Stroke1: false,
    HighBloodPressure1: false,
    AnesthesiaReaction1: false,
    BleedingProblems1: false,
    Hepatitis1: false,
    Tb: false,
    SkinDisease: false,
  });

  const [others1, setOthers1] = useState(false);
  const [othersCheckbox1, setOthersCheckbox1] = useState("");

  const [familyHistoryInfo, setFamilyHistoryInfo] = useState({
    RelationShip: "",
  });
  const handleCheckboxChange3 = (key) => {
    setFamilyHistory((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
    setOthers1(false);
  };

  const handleOthersChange1 = (event) => {
    const isChecked = event.target.checked;
    setOthers1(isChecked);
    if (isChecked) {
      const updatedFamilyHistory = Object.fromEntries(
        Object.entries(familyHistory).map(([key]) => [key, false])
      );
      setFamilyHistory(updatedFamilyHistory);
    }
    setOthersCheckbox1("");
  };

  const handleInputWomenChange = (e) => {
    const { name, value } = e.target;
    setFamilyHistoryInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [SurgicalHistory1, setSurgicalHistory1] = useState({
    AdrenalGlandSurgery: false,
    Appendectomy: false,
    BariatricSurgery: false,
    BladderSurgery: false,
    BreastSurgery: false,
    CesareanSection: false,
    Cholecystectomy: false,
    ColonSurgery: false,
    CoronaryArteryBypassGraft: false,
    EsophagusSurgery: false,
    GastricBypassSurgery: false,
    HemorrhoidSurgery: false,
    HerniaRepair: false,
    Hysterectomy: false,
    KidneySurgery: false,
    NeckSurgery: false,
    ProstateSurgery: false,
    SmallIntestineSurgery: false,
    SpineSurgery: false,
    StomachSurgery: false,
    ThyroidSurgery: false,
  });

  const [other, setOther] = useState(false);
  const [otherCheckbox, setOtherCheckbox] = useState("");
  const [patientInfo2, setPatientInfo2] = useState({
    Listnamesdates: "",
  });

  const handleSurgicalCheckboxChange = (key) => {
    setSurgicalHistory1((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
    setOther(false);
  };

  const handleOtherChange2 = (event) => {
    const isChecked = event.target.checked;
    setOther(isChecked);
    if (isChecked) {
      const updatedSurgical = Object.fromEntries(
        Object.entries(SurgicalHistory1).map(([key]) => [key, false])
      );
      setSurgicalHistory1(updatedSurgical);
    }
    setOtherCheckbox("");
  };

  const handleInputChange12 = (e) => {
    const { name, value } = e.target;
    setPatientInfo2((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (e.target.name === 'Listnamesdates') {
      adjustHeight(e);
    }

  };

  const [womenMen, setWomenMen] = useState({
    Monthlyselfexam: false,
    Yearlyphysicianexam: false,
    Lastmammogram: false,

    YearlyGYNexam: false,
    YearlyPAPexam: false,
    Lastmammogram2: false,

    Highsunexposure: false,
    Yearlyskinexam: false,
  });

  const [men, setMen] = useState({
    Yearlyrectalexam: false,
    YearlyPSAbloodtest: false,
    Yearlyrectalexam2: false,
    Yearlystooltestforblood: false,
  });

  const [mentext, setMenText] = useState({
    Dateoflastcolonoscopy: "",
  });

  const handleCheckboxChangeWomenMen = (name) => {
    setWomenMen((prevWomenMen) => ({
      ...prevWomenMen,
      [name]: !prevWomenMen[name],
    }));
  };

  const handleCheckboxChangeMen = (name) => {
    setMen((prevMen) => ({
      ...prevMen,
      [name]: !prevMen[name],
    }));
  };

  const handleInputChangeMen = (event) => {
    const { name, value } = event.target;
    setMenText((prevMen) => ({
      ...prevMen,
      [name]: value,
    }));
  };

  const [GynecHistory, setGynecHistory] = useState({
    Lmp: "",
    NoOfPregnancies: "",
    NoOfDeliveries: "",
    Vaginal: "",
    Csection: "",
    MisCarriage: "",
    VipAbortions: "",
  });

  const handleGynecChange = (e) => {
    const { name, value } = e.target;
    setGynecHistory((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [VitalFormData, setVitalFormData] = useState({
    Temperature: "",
    PulseRate: "",
    SPO2: "",
    HeartRate: "",
    RR: "",
    BP: "",
    Height: "",
    Weight: "",
    BMI: "",
    WC: "",
    HC: "",
    PainScore: "",
    BSL: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    console.log(name, value, type);
    setVitalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (VitalFormData.Weight && VitalFormData.Height) {
      const parsedWeight = parseFloat(VitalFormData.Weight);
      const parsedHeight = parseFloat(VitalFormData.Height) / 100;
      const calculatedBMI = (
        parsedWeight /
        (parsedHeight * parsedHeight)
      ).toFixed(2);

      setVitalFormData((prev) => ({
        ...prev,
        BMI: calculatedBMI,
      }));
    }
  }, [VitalFormData.Weight, VitalFormData.Height]);

  const [Msp, setMsp] = useState({
    UlRt: "",
    UlLt: "",
    LlRt: "",
    LlLt: "",
  });

  const [Plantars, setPlantars] = useState({
    Rt: "",
    Lt: "",
  });

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  const handleMspChange = (section, field, value) => {
    if (section === "Msp") {
      setMsp({ ...Msp, [field]: value });
    } else if (section === "Plantars") {
      setPlantars({ ...Plantars, [field]: value });
    }
  };

  const [LocalExamination, setLocalExamination] = useState({
    Oedma: false,
    Cyanosis: false,
    Clubbing: false,
    SurgicalScars: false,
    Jaundice: false,
    Pallor: false,
    Lymphadenopathy: false,
    Thyromegaly: false,
  });

  const [LocalOthers, setLocalOthers] = useState(false);
  const [LocalOthersCheckbox, setLocalOthersCheckbox] = useState("");

  const handleCheckboxChange1 = (key) => {
    if (key === "LocalOthers") {
      const isChecked = !LocalOthers;
      setLocalOthers(isChecked);
      if (isChecked) {
        const updatedLocal = Object.fromEntries(
          Object.entries(LocalExamination).map(([key]) => [key, false])
        );
        setLocalExamination(updatedLocal);
      }
    } else {
      setLocalExamination((prevState) => ({
        ...prevState,
        [key]: !prevState[key],
      }));
      if (LocalOthers) {
        setLocalOthers(false);
        setLocalOthersCheckbox("");
      }
    }
  };

  const [Textarea3, setTextarea3] = useState({
    Impression: "",
    Ix: "",
    ProvisionalDiagnosis: "",
    FinalDiagnosis: "",
    TreatmentGiven: "",
    Discussion: "",
  });

  const [isSameAsProvisional, setIsSameAsProvisional] = useState(false);

  const handleNotesChange1 = (event) => {
    const { name, value } = event.target;
    if (value.length <= 1000) {
      setTextarea3((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    if (

      name === "others" ||
      name === "TreatmentGiven" ||

      name === "Impression" ||

      name === "Ix" ||

      name === "ProvisionalDiagnosis" ||

      name === "FinalDiagnosis" ||
      name === "Discussion"


    ) {
      adjustHeight(event);
    }

  };

  const handleCheckboxChange4 = () => {
    setIsSameAsProvisional(!isSameAsProvisional);
    if (!isSameAsProvisional) {
      setTextarea3((prevState) => ({
        ...prevState,
        FinalDiagnosis: Textarea3.ProvisionalDiagnosis,
      }));
    } else {
      setTextarea3((prevState) => ({
        ...prevState,
        FinalDiagnosis: "",
      }));
    }
  };

  const [gridData, setGridData] = useState([]);
  const [IsGetData, setIsGetData] = useState(false);
  const [IsViewMode, setIsViewMode] = useState(false);


  const handleAction = (data) => {
    setAssessmentFormData({
      PresentingComplaints: data.PresentingComplaints || "",
      DetailsPresentingComplaints: data.DetailsPresentingComplaints || "",
      HistoryOf: data.HistoryOf || "",
      PatientStatusAtAdmission: data.PatientStatusAtAdmission || "",
      Allergies: data.Allergies || "",
      Pupil: data.Pupil || "",
      Cvs: data.Cvs || "",
      Rs: data.Rs || "",
      Pa: data.Pa || "",
      Cns: data.Cns || "",
    });
    const medicalHistoryKeys = data.MedicalHistoryCheckbox?.split(",") || [];
    setMedicalHistory((prev) =>
      Object.fromEntries(
        Object.keys(prev).map((key) => [key, medicalHistoryKeys.includes(key)])
      )
    );

    if (data.MedicalHistoryOthers) {
      setOthers(true);
      setOthersCheckbox(data.MedicalHistoryOthers);
    }
    setVitalFormData({
      Temperature: data.Temperature || "",
      PulseRate: data.PulseRate || "",
      SPO2: data.SPO2 || "",
      HeartRate: data.HeartRate || "",
      RR: data.RR || "",
      BP: data.BP || "",
      Height: data.Height || "",
      Weight: data.Weight || "",
      BMI: data.BMI || "",
      WC: data.WC || "",
      HC: data.HC || "",
      PainScore: data.PainScore || "",
      BSL: data.BSL || "",
    });

    setTextarea3({
      Impression: data.Impression || "",
      Ix: data.Ix || "",
      ProvisionalDiagnosis: data.ProvisionalDiagnosis || "",
      FinalDiagnosis: data.FinalDiagnosis || "",
      TreatmentGiven: data.TreatmentGiven || "",
      Discussion: data.Discussion || "",
    });

    setIsSameAsProvisional(data.isSameAsProvisional === "true");
    axios
      .get(`${UrlLink}Insurance/Insurance_Medical_data`, {
        params: { RegistrationId: data.RegistrationId, DepartmentType: data.DepartmentType },
      })
      .then((res) => {
        setGridData(res.data);
      })
      .catch((err) => console.error("Fetch error:", err));
  };



  const AssesmentColumns = [
    { key: "id", name: "S.No", frozen: true },
    { key: "PrimaryDoctorName", name: "Doctor Name", editable: true, frozen: true },
    { key: "Date", name: "Date", editable: true, frozen: true },
    { key: "Time", name: "Time", editable: true, frozen: true },
    { key: "PresentingComplaints", name: "Chief Complaint", editable: true },
    { key: "DetailsPresentingComplaints", name: "Presenting Illness", editable: true },
    {
      key: "view",
      name: "View",
      frozen: true,
      renderCell: (params) => {
        console.log("View params.row:", params.row);
        return (
          <IconButton onClick={() => handleView(params.row)}>
            <VisibilityIcon />
          </IconButton>
        );
      }
    },
    {
      key: "action",
      name: "Action",
      frozen: true,
      renderCell: (params) => (
        <IconButton onClick={() => handleAction(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    const RegistrationId = InsurancePatientDetailes?.RegistrationId;
    const DepartmentType = InsurancePatientDetailes?.RequestType || "IP";

    if (RegistrationId && DepartmentType) {
      axios
        .get(`${UrlLink}Insurance/Insurance_Medical_data`, {
          params: { RegistrationId, DepartmentType },
        })
        .then((res) => {
          const insuranceData = res.data;
          if (insuranceData.length > 0) {
            setGridData(insuranceData);
            setSourceTable("Insurance_Medical_History");
            setModalData(insuranceData[0]);
            setIsModalOpen(true);
          } else {
            axios
              .get(`${UrlLink}Ip_Workbench/IP_Assesment_details_Link`, {
                params: { RegistrationId, DepartmentType },
              })
              .then((ipRes) => {
                const ipData = ipRes.data;
                setGridData(ipData);
                setSourceTable("IP_Assesment_Details");
                if (ipData.length > 0) {
                  setModalData(ipData[0]);
                  setIsModalOpen(true);
                }
              })
              .catch((err) => {
                console.error("IP API Error:", err);
                setGridData([]);
              });
          }
        })
        .catch((err) => {
          console.error("Insurance API Error:", err);
          setGridData([]);
        });
    }
  }, [UrlLink, InsurancePatientDetailes]);

  const handleRowEditCommit = (params) => {
    console.log("onRowEditCommit params:", params);
    const updatedRow = { ...params.row, [params.field]: params.value };
    const newGridData = gridData.map((row) =>
      row.id === params.id ? { ...row, ...updatedRow } : row
    );
    setGridData(newGridData);
    const fullUpdatedData = {
      ...updatedRow,
      ...AssessmentFormData,
      ...Textarea3,
      MedicalHistoryCheckbox: Object.keys(medicalHistory)
        .filter((key) => medicalHistory[key])
        .join(","),
    };

    axios
      .put(`${UrlLink}Insurance/Insurance_Medical_data/${params.id}`, fullUpdatedData)
      .then((res) => {
        console.log("Update successful:", res.data);
        dispatch({
          type: "toast",
          value: { message: "Data updated successfully", type: "success" },
        });
      })
      .catch((err) => {
        console.error("Update failed:", err);
        dispatch({
          type: "toast",
          value: { message: "Update failed", type: "error" },
        });
      });
  };

  const handleView = (data) => {
    console.log("handleView called with:", data);
    if (!data) return;
    setIsViewMode(true);
    setModalData(data);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    const RegistrationId = InsurancePatientDetailes?.RegistrationId;
    const DepartmentType = InsurancePatientDetailes?.RequestType || "IP";
  
    if (!RegistrationId) {
      dispatch({
        type: "toast",
        value: { message: "Registration ID is missing", type: "error", toggle: true },
      });
      return;
    }
  
    const data = {
      ...AssessmentFormData,
      MedicalHistoryCheckbox: Object.keys(medicalHistory)
        .filter((key) => medicalHistory[key])
        .join(","),
      SocialHistoryCheckbox: Object.keys(socialHistory)
        .filter((key) => socialHistory[key])
        .join(","),
      FamilyHistoryCheckbox: Object.keys(familyHistory)
        .filter((key) => familyHistory[key])
        .join(","),
      SurgicalHistoryCheckbox: Object.keys(SurgicalHistory1)
        .filter((key) => SurgicalHistory1[key])
        .join(","),
      womenMenCheckbox: Object.keys(womenMen)
        .filter((key) => womenMen[key])
        .join(","),
      menCheckbox: Object.keys(men)
        .filter((key) => men[key])
        .join(","),
      LocalExamination: Object.keys(LocalExamination)
        .filter((key) => LocalExamination[key])
        .join(","),
      ...GynecHistory,
      ...VitalFormData,
      ...Msp,
      ...Plantars,
      ...Textarea3,
      RegistrationId,
      DepartmentType,
      created_by: userRecord?.username || "",
      isSameAsProvisional: isSameAsProvisional.toString(),
    };
  
    if (others) data.MedicalHistoryOthers = othersCheckbox;
    if (others1) data.FamilyHistoryOthers = othersCheckbox1;
    if (other) data.SurgicalHistoryOthers = otherCheckbox;
    if (LocalOthers) data.LocalOthersCheckbox = LocalOthersCheckbox;
  
    data.RelationShip = familyHistoryInfo?.RelationShip;
    data.Listnamesdates = patientInfo2?.Listnamesdates;
    data.Dateoflastcolonoscopy = mentext?.Dateoflastcolonoscopy;
  
    axios
      .post(`${UrlLink}Insurance/Insurance_Medical_data`, data)
      .then((res) => {
        const [type, message] = [
          Object.keys(res.data)[0],
          Object.values(res.data)[0],
        ];
        dispatch({
          type: "toast",
          value: { message, type, toggle: true }, 
        });
  
        axios
          .get(`${UrlLink}Insurance/Insurance_Medical_data`, {
            params: { RegistrationId, DepartmentType },
          })
          .then((res) => {
            const insuranceData = res.data;
            if (insuranceData.length > 0) {
              setGridData(insuranceData);
              setSourceTable("Insurance_Medical_History");
              setModalData(insuranceData[0]);
              setIsModalOpen(true);
            }
          })
          .catch((err) => {
            console.error("Insurance API Error:", err);
            setGridData([]);
            dispatch({
              type: "toast",
              value: { message: "Failed to fetch data", type: "error", toggle: true },
            });
          });
      })
      .catch((err) => {
        console.error("POST Error:", err);
        dispatch({
          type: "toast",
          value: { message: "Failed to save data", type: "error", toggle: true },
        });
      });
  };

  useEffect(() => {
    const RegistrationId = InsurancePatientDetailes?.RegistrationId;
    const DepartmentType = InsurancePatientDetailes?.RequestType || "IP";

    if (RegistrationId && DepartmentType) {
      axios
        .get(`${UrlLink}Insurance/Insurance_Medical_data`, {
          params: { RegistrationId, DepartmentType },
        })
        .then((res) => {
          const insuranceData = res.data;
          if (insuranceData.length > 0) {
            setGridData(insuranceData);
            setSourceTable("Insurance_Medical_History");
          } else {
            axios
              .get(`${UrlLink}Ip_Workbench/IP_Assesment_details_Link`, {
                params: { RegistrationId, DepartmentType },
              })
              .then((ipRes) => {
                setGridData(ipRes.data);
                setSourceTable("IP_Assesment_Details");
              })
              .catch((err) => {
                console.error("IP API Error:", err);
                setGridData([]);
              });
          }
        })
        .catch((err) => {
          console.error("Insurance API Error:", err);
          setGridData([]);
        });
    }
  }, [UrlLink, InsurancePatientDetailes]);



  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);


  return (
    <>
      <div className="new-patient-registration-form">

        <div className="RegisFormcon_1 edxwsjds_xcucd7">
          <div className="text_adjust_mt_Ot_Ass">
            <label>
              {" "}
              Chief C/O <span>:</span>{" "}
            </label>
            <textarea
              name="PresentingComplaints"
              id="PresentingComplaints"
              onChange={handleChange}
              // readOnly={IsViewMode}
              value={AssessmentFormData.PresentingComplaints}
            />
          </div>
          <div className="text_adjust_mt_Ot_Ass">
            <label>
              {" "}
              Presenting illness<span>:</span>{" "}
            </label>
            <textarea
              name="DetailsPresentingComplaints"
              id="DetailsPresentingComplaints"
              onChange={handleChange}
              // readOnly={IsViewMode}
              value={AssessmentFormData.DetailsPresentingComplaints}
            />
          </div>
        </div>


        <div className="form-section522 form-section522-Ass">
          <div>
            <div className="dkwjd">
              <h3>Medical History </h3>
            </div>

            <div className="div_ckkkbox_head  div_ckkkbox_head_ASs">
              {Object.keys(medicalHistory).map((labelname, indx) => (
                <React.Fragment key={labelname}>
                  {indx % 8 === 0 && (
                    <div className="div_ckkck_box">
                      {Object.keys(medicalHistory)
                        .slice(indx, indx + 8)
                        .map((key) => (
                          <label key={key} className="checkbox-label_ooo checkbox-label_ooo-Ass">
                            <input
                              type="checkbox"
                              id={key}
                              className="checkbox-input"
                              checked={medicalHistory[key]}
                              // readOnly={IsViewMode}
                              disabled={IsViewMode}
                              onChange={() => handlemedicalCheckboxChange(key)}
                            />
                            {formatLabel(key)}
                          </label>
                        ))}
                    </div>
                  )}
                </React.Fragment>
              ))}

              <div className="checkbox-label_ooo checkbox-label_ooo-Ass">
                <label key="others" className="checkbox-label1">
                  <input
                    type="checkbox"
                    id="others"
                    name="others"
                    className="checkbox-input"
                    checked={others}
                    // readOnly={IsViewMode}
                    disabled={IsViewMode}
                    onChange={handlemedicalOthersChange}
                  />
                  <span>Others</span>
                </label>

                <textarea
                  id="others-textarea"
                  value={othersCheckbox}
                  onChange={(e) => setOthersCheckbox(e.target.value)}
                  // readOnly={IsViewMode}
                  placeholder="Please Specify Here"
                  style={{ marginLeft: "8px" }}
                  className="textarea-wide1"
                />
              </div>
            </div>
          </div>


          <div>
            <div className="dkwjd">
              <h3>Surgical History </h3>
            </div>

            <div className="div_ckkkbox_head  div_ckkkbox_head_ASs">
              {Object.keys(SurgicalHistory1).map((labelname, indx) => (
                <React.Fragment key={labelname}>
                  {indx % 7 === 0 && (
                    <div className="div_ckkck_box">
                      {Object.keys(SurgicalHistory1)
                        .slice(indx, indx + 7)
                        .map((key) => (
                          <label key={key} className="checkbox-label_ooo checkbox-label_ooo-Ass">
                            <input
                              type="checkbox"
                              id={key}
                              className="checkbox-input"
                              checked={SurgicalHistory1[key]}
                              // readOnly={IsViewMode}
                              disabled={IsViewMode}
                              onChange={() => handleSurgicalCheckboxChange(key)}
                            />
                            {formatLabel(key)}
                          </label>
                        ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
              <div className="checkbox-label_ooo checkbox-label_ooo-Ass">
                <label key="other" className="checkbox-label1 ">
                  <input
                    type="checkbox"
                    id="other"
                    className="checkbox-input"
                    checked={other}
                    // readOnly={IsViewMode}
                    disabled={IsViewMode}
                    onChange={handleOtherChange2}
                  />
                  <span style={{ marginRight: "8px" }}>Others</span>
                </label>

                <textarea
                  id="others-textarea"
                  value={otherCheckbox}
                  onChange={(e) => setOtherCheckbox(e.target.value)}
                  placeholder="Please specify..."
                  style={{ marginLeft: "8px" }}
                  // readOnly={IsViewMode}
                  className="textarea-wide1"
                />
              </div>
            </div>
            <br />

          </div>
          <div className="RegisFormcon">
            <div className="text_adjust_mt_Ot_Ass edwdwdw21">
              <label> Names and Date of Surgeries
                <span>:</span>
              </label>
              <textarea
                name="Listnamesdates"
                value={patientInfo2.Listnamesdates}
                // readOnly={IsViewMode}
                onChange={handleInputChange12}
              ></textarea>
            </div>
          </div>
        </div>

        <br />

        <div className="form-section522 form-section522-Ass">
          <div>
            <div className="dkwjd">
              <h3>Social History </h3>
            </div>

            <div className=" ">
              <div className="div_ckkck_box alcho_tac_drg11">
                <div className="ffdff44">
                  <div>
                    <label className="checkbox-label_ooo checkbox-label_ooo-Ass alcho_tac_drg">
                      {" "}
                      Alcohol use <span>- </span>
                    </label>
                  </div>

                  <div className="flx_cjk_labl3">
                    <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                      <input
                        type="checkbox"
                        className="checkbox-input ddsfe"
                        checked={socialHistory.alcoholUseNever}
                        // readOnly={IsViewMode}
                        disabled={IsViewMode}
                        onChange={() => {
                          handleCheckboxChange2("alcoholUseNever");
                        }}
                      />
                      Never
                    </label>

                    <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                      <input
                        type="checkbox"
                        className="checkbox-input ddsfe"
                        checked={socialHistory.alcoholUseOccasionally}
                        // readOnly={IsViewMode}
                        disabled={IsViewMode}
                        onChange={() => {
                          handleCheckboxChange2("alcoholUseOccasionally");
                        }}
                      />
                      Occasionally
                    </label>

                    <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                      <input
                        type="checkbox"
                        className="checkbox-input ddsfe"
                        checked={socialHistory.alcoholUseDaily}
                        // readOnly={IsViewMode}
                        disabled={IsViewMode}
                        onChange={() => {
                          handleCheckboxChange2("alcoholUseDaily");
                        }}
                      />
                      Daily
                    </label>
                  </div>
                </div>
              </div>

              <div className="div_ckkck_box alcho_tac_drg11">
                <div className="ffdff44">
                  <div>
                    <label className="checkbox-label_ooo checkbox-label_ooo-Ass alcho_tac_drg">
                      {" "}
                      Tobacco use <span>- </span>
                    </label>
                  </div>
                  <div className="flx_cjk_labl3">
                    <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                      <input
                        type="checkbox"
                        className="checkbox-input ddsfe"
                        checked={socialHistory.tobaccoUseNever}
                        // readOnly={IsViewMode}
                        disabled={IsViewMode}
                        onChange={() => {
                          handleCheckboxChange2("tobaccoUseNever");
                        }}
                      />
                      Never
                    </label>

                    <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                      <input
                        type="checkbox"
                        className="checkbox-input ddsfe"
                        // readOnly={IsViewMode}
                        disabled={IsViewMode}
                        checked={socialHistory.tobaccoUseOccasionally}
                        onChange={() => {
                          handleCheckboxChange2("tobaccoUseOccasionally");
                        }}
                      />
                      Occasionally
                    </label>

                    <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                      <input
                        type="checkbox"
                        className="checkbox-input ddsfe"
                        checked={socialHistory.tobaccoUseDaily}
                        // readOnly={IsViewMode}
                        disabled={IsViewMode}
                        onChange={() => {
                          handleCheckboxChange2("tobaccoUseDaily");
                        }}
                      />
                      Daily
                    </label>
                  </div>
                </div>
              </div>

              <div className="div_ckkck_box alcho_tac_drg11">
                <div className="ffdff44">
                  <div>
                    <label className="checkbox-label_ooo checkbox-label_ooo-Ass alcho_tac_drg">
                      {" "}
                      Drugs use <span>- </span>
                    </label>
                  </div>
                  <div className="flx_cjk_labl3">
                    <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                      <input
                        type="checkbox"
                        className="checkbox-input ddsfe"
                        checked={socialHistory.drugsUseNever}
                        // readOnly={IsViewMode}
                        disabled={IsViewMode}
                        onChange={() => {
                          handleCheckboxChange2("drugsUseNever");
                        }}
                      />
                      Never
                    </label>

                    <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                      <input
                        type="checkbox"
                        className="checkbox-input ddsfe"
                        checked={socialHistory.drugsUseOccasionally}
                        // readOnly={IsViewMode}
                        disabled={IsViewMode}
                        onChange={() => {
                          handleCheckboxChange2("drugsUseOccasionally");
                        }}
                      />
                      Occasionally
                    </label>

                    <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                      <input
                        type="checkbox"
                        className="checkbox-input ddsfe"
                        checked={socialHistory.drugsUseDaily}
                        // readOnly={IsViewMode}
                        disabled={IsViewMode}
                        onChange={() => {
                          handleCheckboxChange2("drugsUseDaily");
                        }}
                      />
                      Daily
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div>
            <div className="dkwjd">
              <h3>Family History </h3>
            </div>

            <div className="div_ckkkbox_head  div_ckkkbox_head_ASs">
              <div className="div_ckkck_box">
                <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={familyHistory.CancerPolyps}
                    // readOnly={IsViewMode}
                    disabled={IsViewMode}
                    onChange={() => handleCheckboxChange3("CancerPolyps")}
                  />
                  Cancer/Polyps
                </label>

                <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={familyHistory.Anemia1}
                    // readOnly={IsViewMode}
                    disabled={IsViewMode}
                    onChange={() => handleCheckboxChange3("Anemia1")}
                  />
                  Anemia
                </label>

                <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={familyHistory.Diabetes1}
                    // readOnly={IsViewMode}
                    disabled={IsViewMode}
                    onChange={() => handleCheckboxChange3("Diabetes1")}
                  />
                  Diabetes
                </label>

                <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={familyHistory.BloodClots1}
                    // readOnly={IsViewMode}
                    disabled={IsViewMode}
                    onChange={() => handleCheckboxChange3("BloodClots1")}
                  />
                  Blood Clots
                </label>
              </div>

              <div className="div_ckkck_box">
                <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={familyHistory.HeartDisease1}
                    // readOnly={IsViewMode}
                    disabled={IsViewMode}
                    onChange={() => handleCheckboxChange3("HeartDisease1")}
                  />
                  Heart Disease
                </label>

                <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={familyHistory.Stroke1}
                    // readOnly={IsViewMode}
                    disabled={IsViewMode}
                    onChange={() => handleCheckboxChange3("Stroke1")}
                  />
                  Stroke
                </label>
                <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={familyHistory.HighBloodPressure1}
                    // readOnly={IsViewMode}
                    disabled={IsViewMode}
                    onChange={() => handleCheckboxChange3("HighBloodPressure1")}
                  />
                  High Blood Pressure
                </label>
                <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={familyHistory.AnesthesiaReaction1}
                    // readOnly={IsViewMode}
                    disabled={IsViewMode}
                    onChange={() => handleCheckboxChange3("AnesthesiaReaction1")}
                  />
                  Anesthesia Reaction
                </label>
              </div>

              <div className="div_ckkck_box">
                <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={familyHistory.BleedingProblems1}
                    // readOnly={IsViewMode}
                    disabled={IsViewMode}
                    onChange={() => handleCheckboxChange3("BleedingProblems1")}
                  />
                  Bleeding Problems
                </label>

                <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={familyHistory.Hepatitis1}
                    // readOnly={IsViewMode}
                    disabled={IsViewMode}
                    onChange={() => handleCheckboxChange3("Hepatitis1")}
                  />
                  Hepatitis
                </label>

                <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={familyHistory.Tb}
                    // readOnly={IsViewMode}
                    disabled={IsViewMode}
                    onChange={() => handleCheckboxChange3("Tb")}
                  />
                  TB
                </label>

                <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={familyHistory.SkinDisease}
                    // readOnly={IsViewMode}
                    disabled={IsViewMode}
                    onChange={() => handleCheckboxChange3("SkinDisease")}
                  />
                  Skin Disease
                </label>
              </div>

              <div className="checkbox-label_ooo checkbox-label_ooo-Ass ">
                <label key="others1" className="checkbox-label1 ">
                  <input
                    type="checkbox"
                    id="others1"
                    className="checkbox-input"
                    checked={others1}
                    onChange={handleOthersChange1}
                    // readOnly={IsViewMode}
                    disabled={IsViewMode}
                  />
                  <span style={{ marginRight: "8px" }}>Others</span>
                </label>

                <textarea
                  id="others-textarea1"
                  value={othersCheckbox1}
                  onChange={(e) => setOthersCheckbox1(e.target.value)}
                  // readOnly={IsViewMode}
                  placeholder="Please specify..."
                  style={{ marginLeft: "8px" }}
                  className="textarea-wide1"
                />
              </div>
            </div>

            <div className="form-section56">
              <label className="form-field56">
                {" "}
                Relationship :
                <input
                  type="text"
                  name="RelationShip"
                  value={familyHistoryInfo.RelationShip}
                  onChange={handleInputWomenChange}
                // readOnly={IsViewMode}
                />
              </label>
            </div>
          </div>
        </div>


        <div className="form-section522">
          <div className="dkwjd">
            <h3 style={{ justifyContent: 'flex-start' }}>Gynec History</h3>
          </div>

          <div className="RegisFormcon">
            <div className="RegisForm_1">
              <label htmlFor="LMP">
                LMP <span>:</span>
              </label>
              <input
                type="date"
                id="LMP"
                name="Lmp"
                onChange={handleGynecChange}
                value={GynecHistory.Lmp}
                required
              // readOnly={IsViewMode}
              />
            </div>

            <div className="RegisForm_1">
              <label htmlFor="Noofpregnancies">
                No.of Pregnancies <span>:</span>
              </label>
              <input
                type="number"
                id="Noofpregnancies"
                name="NoOfPregnancies"
                onChange={handleGynecChange}
                value={GynecHistory.NoOfPregnancies}
                required
              // readOnly={IsViewMode}
              />
            </div>

            <div className="RegisForm_1">
              <label htmlFor="Noofdeliveries">
                No.of Deliveries <span>:</span>
              </label>
              <input
                type="number"
                id="Noofdeliveries"
                name="NoOfDeliveries"
                onChange={handleGynecChange}
                value={GynecHistory.NoOfDeliveries}
                required
              // readOnly={IsViewMode}
              />
            </div>

            <div className="RegisForm_1">
              <label htmlFor="vaginal">
                Vaginal <span>:</span>
              </label>
              <input
                type="text"
                id="vaginal"
                name="Vaginal"
                onChange={handleGynecChange}
                value={GynecHistory.Vaginal}
                required
              // readOnly={IsViewMode}
              />
            </div>

            <div className="RegisForm_1">
              <label htmlFor="csection">
                C-Section <span>:</span>
              </label>
              <input
                type="text"
                id="csection"
                name="Csection"
                onChange={handleGynecChange}
                value={GynecHistory.Csection}
                required
              // readOnly={IsViewMode}
              />
            </div>

            <div className="RegisForm_1">
              <label htmlFor="Miscarriage">
                Miscarriage <span>:</span>
              </label>
              <input
                type="number"
                id="Miscarriage"
                name="MisCarriage"
                onChange={handleGynecChange}
                value={GynecHistory.MisCarriage}
                required
              // readOnly={IsViewMode}
              />
            </div>

            <div className="RegisForm_1">
              <label htmlFor="Vipabortions">
                VIPs(Abortion)<span>:</span>
              </label>
              <input
                type="number"
                id="Vipabortions"
                name="VipAbortions"
                onChange={handleGynecChange}
                value={GynecHistory.VipAbortions}
                required
              // readOnly={IsViewMode}
              />
            </div>
          </div>

          <div className="RegisFormcon">

            <div className="text_adjust_mt_Ot_Ass edwdwdw21">
              <label htmlFor="TreatmentGiven">
                Treatment H/O <span>:</span>
              </label>
              <textarea
                id="TreatmentGiven"
                name="TreatmentGiven"
                value={Textarea3.TreatmentGiven}
                onChange={handleNotesChange1}
                maxLength={1000}
              // readOnly={IsViewMode}
              />
            </div>
          </div>
        </div>
        <div className="form-section522">
          <div className="dkwjd">
            <h3 style={{ justifyContent: 'flex-start' }}>O/E(on examination) </h3>
          </div>{" "}
          <div className="new-patient-registration-form">
            <div className="RegisFormcon">
              {Object.keys(VitalFormData).map((labelname, index) => (
                <div className="RegisForm_1" key={index}>
                  <label>
                    {formatLabel(labelname)} <span>:</span>
                  </label>
                  {
                    <input
                      type={
                        labelname === "CapturedDate"
                          ? "date"
                          : labelname === "Time"
                            ? "time"
                            : labelname === "BP"
                              ? "text"
                              : "number"
                      }
                      name={labelname}
                      onKeyDown={blockInvalidChar}
                      value={VitalFormData[labelname]}
                      // readOnly={labelname === "CapturedDate" && IsViewMode}
                      onChange={handleInputChange}
                    />
                  }
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section522">
          <div className="dkwjd">
            <h3 style={{ justifyContent: 'flex-start' }}>S/E (systemicexamination) </h3>
          </div>

          <div className="RegisFormcon_1" style={{ justifyContent: 'center' }}>
            <div className="text_adjust_mt_Ot_Ass">
              <label>
                {" "}
                CVS<span>:</span>{" "}
              </label>

              <textarea
                id="CVS"
                name="Cvs"
                onChange={handleChange}
                value={AssessmentFormData.Cvs}
                required
              // readOnly={IsViewMode}
              />
            </div>
            <div className="text_adjust_mt_Ot_Ass">
              <label>
                {" "}
                Pupil<span>:</span>{" "}
              </label>

              <textarea
                id="pupil"
                name="Pupil"
                onChange={handleChange}
                value={AssessmentFormData.Pupil}
                required
                // readOnly={IsViewMode}
                className="textarea-wide"
              />
            </div>
          </div>
          <div className="RegisFormcon_1 form-section522-Ass">
            <div className="text_adjust_mt_Ot_Ass nnn_prcx3">
              <label>
                {" "}
                MSP<span>:</span>{" "}
              </label>

              <div className="Selected-table-container">
                <table className="selected-medicine-table2">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Rt</th>
                      <th>Lt</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>UL</td>
                      <td>
                        <input
                          type="number"
                          id="Ul_RT"
                          name="UlRt"
                          value={Msp.UlRt}
                          // readOnly={IsViewMode}
                          onChange={(e) =>
                            handleMspChange("Msp", "UlRt", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          id="Ul_LT"
                          name="UlLt"
                          value={Msp.UlLt}
                          // readOnly={IsViewMode}
                          onChange={(e) =>
                            handleMspChange("Msp", "UlLt", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>LL</td>
                      <td>
                        <input
                          type="number"
                          id="Ll_Rt"
                          name="LlRt"
                          value={Msp.LlRt}
                          // readOnly={IsViewMode}
                          onChange={(e) =>
                            handleMspChange("Msp", "LlRt", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          id="Ll_Lt"
                          name="LlLt"
                          value={Msp.LlLt}
                          // readOnly={IsViewMode}
                          onChange={(e) =>
                            handleMspChange("Msp", "LlLt", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

            <div className="text_adjust_mt_Ot_Ass nnn_prcx3">
              <label>
                {" "}
                Plantors<span>:</span>{" "}
              </label>
              <div className="Selected-table-container">
                <table className="selected-medicine-table2">
                  <thead>
                    <tr>
                      <th>Rt</th>
                      <th>Lt</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="number"
                          name="Rt"
                          value={Plantars.Rt}
                          // readOnly={IsViewMode}
                          onChange={(e) =>
                            handleMspChange("Plantars", "Rt", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="Lt"
                          value={Plantars.Lt}
                          // readOnly={IsViewMode}
                          onChange={(e) =>
                            handleMspChange("Plantars", "Lt", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="RegisFormcon_1">
            <div className="text_adjust_mt_Ot_Ass">
              <label>
                {" "}
                RS<span>:</span>{" "}
              </label>
              <textarea
                id="RS"
                name="Rs"
                onChange={handleChange}
                value={AssessmentFormData.Rs}
                required
              // readOnly={IsViewMode}
              />
            </div>

            <div className="text_adjust_mt_Ot_Ass">
              <label>
                {" "}
                P/A<span>:</span>{" "}
              </label>

              <textarea
                id="PA"
                name="Pa"
                onChange={handleChange}
                value={AssessmentFormData.Pa}
                required
                // readOnly={IsViewMode}
                className="textarea-wide"
              />
            </div>
            <div className="text_adjust_mt_Ot_Ass">
              <label>
                {" "}
                CNS<span>:</span>{" "}
              </label>

              <textarea
                id="CNS"
                name="Cns"
                onChange={handleChange}
                value={AssessmentFormData.Cns}
                required
                // readOnly={IsViewMode}
                className="textarea-wide"
              />
            </div>
          </div>
        </div>
        <div className="form-section522">
          <div className="dkwjd">
            <h3 style={{ justifyContent: 'flex-start' }}>L/E (local examination)</h3>
          </div>
          <div>
            <div className="div_ckkkbox_head  div_ckkkbox_head_ASs">
              {Object.keys(LocalExamination).map((labelname, indx) => (
                <React.Fragment key={labelname}>
                  {indx % 2 === 0 && (
                    <div className="div_ckkck_box">
                      {Object.keys(LocalExamination)
                        .slice(indx, indx + 2)
                        .map((key) => (
                          <label key={key} className="checkbox-label_ooo checkbox-label_ooo-Ass">
                            <input
                              type="checkbox"
                              id={key}
                              className="checkbox-input"
                              checked={LocalExamination[key]}
                              onChange={() => handleCheckboxChange1(key)}
                              // readOnly={IsViewMode}
                              disabled={IsViewMode}
                            />
                            {formatLabel(key)}
                          </label>
                        ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
              <div
                className="checkbox-label_ooo checkbox-label_ooo-Ass"
                style={{ justifyContent: "center" }}
              >
                <label htmlFor="LocalOthers" className="checkbox-label1">
                  <input
                    type="checkbox"
                    id="LocalOthers"
                    className="checkbox-input"
                    checked={LocalOthers}
                    disabled={IsViewMode}
                    onChange={() => handleCheckboxChange1("LocalOthers")}
                  // readOnly={IsViewMode}
                  />
                  <span style={{ marginRight: "8px" }}>Others</span>
                </label>
                <textarea
                  id="others-textarea"
                  value={LocalOthersCheckbox}
                  onChange={(e) => setLocalOthersCheckbox(e.target.value)}
                  placeholder="Please specify..."
                  style={{ marginLeft: "8px" }}
                  // readOnly={IsViewMode}
                  className="textarea-wide1"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="RegisFormcon_1">
          <div className="text_adjust_mt_Ot_Ass">
            <label htmlFor="Impression">
              Impression <span>:</span>
            </label>
            <textarea
              id="Impression"
              name="Impression"
              value={Textarea3.Impression}
              onChange={handleNotesChange1}
              maxLength={1000}
            // readOnly={IsViewMode}
            />
          </div>

          <div className="text_adjust_mt_Ot_Ass">
            <label htmlFor="Ix">
              IX <span>:</span>
            </label>
            <textarea
              id="Ix"
              name="Ix"
              value={Textarea3.Ix}
              onChange={handleNotesChange1}
              maxLength={1000}
            // readOnly={IsViewMode}
            />
          </div>

          <div className="text_adjust_mt_Ot_Ass">
            <label htmlFor="ProvisionalDiagnosis">
              Diagnosis <span>:</span>
            </label>
            <textarea
              id="ProvisionalDiagnosis"
              name="ProvisionalDiagnosis"
              value={Textarea3.ProvisionalDiagnosis}
              onChange={handleNotesChange1}
              maxLength={1000}
            // readOnly={IsViewMode}
            />
          </div>
        </div>


        <div className="RegisFormcon_1">
          <div className="text_adjust_mt_Ot_Ass">
            <input
              type="checkbox"
              id="sameAsProvisional"
              checked={isSameAsProvisional}
              onChange={handleCheckboxChange4}
              // readOnly={IsViewMode}
              disabled={IsViewMode}
            />
            <label htmlFor="sameAsProvisional">
              Same as Provisional Diagnosis
            </label>
          </div>
        </div>


        <div className="RegisFormcon_1">
          {console.log(isSameAsProvisional, "isSameAsProvisional")}

          <div className="text_adjust_mt_Ot_Ass">
            <label htmlFor="FinalDiagnosis">
              Final Diagnosis <span>:</span>
            </label>
            <textarea
              id="FinalDiagnosis"
              name="FinalDiagnosis"
              value={Textarea3.FinalDiagnosis}
              onChange={handleNotesChange1}
              maxLength={1000}
            // readOnly={isSameAsProvisional || IsViewMode}
            />
          </div>

          <div className="text_adjust_mt_Ot_Ass">
            <label htmlFor="ProvisionalDiagnosis">
              Discussion <span>:</span>
            </label>
            <textarea
              id="Discussion"
              name="Discussion"
              value={Textarea3.Discussion}
              onChange={handleNotesChange1}
              maxLength={1000}
            // readOnly={IsViewMode}
            />
          </div>
        </div>

        <div className="Main_container_Btn">
          <button onClick={handleSubmit}>Submit</button>
        </div>

        {gridData.length > 0 && (
          <ReactGrid
            columns={AssesmentColumns}
            RowData={gridData}
            onRowEditCommit={handleRowEditCommit}
          />
        )}

        {/* <ToastAlert Message={toast.message} Type={toast.type} /> */}
      </div>

      {isModalOpen && modalData && (
        <div
          className="sideopen_showcamera_profile"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Submitted Details</h2>
            <div className="asset_show_seled_datad">
              {Object.entries(modalData)
                .filter(([key, value]) => value)
                .map(([key, value]) => (
                  <p key={key} className="wdwqd_p0w">
                    <strong>
                      {formatLabel(key)}
                      <span>:</span>
                    </strong>
                    <h5> {value}</h5>
                  </p>
                ))}
            </div>
            <div>
              <button
                className="RegisterForm_1_btns"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default InsuranceMedicalHistory;
