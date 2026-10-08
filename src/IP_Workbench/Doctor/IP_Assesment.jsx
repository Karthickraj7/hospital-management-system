import React, { useState, useEffect,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import "../../IP/ICU_Management/ICU_Doctor/ICU_Assesment.css";
import "../../OtMangement/OtManagement.css";
import "../../DoctorWorkBench/Prescription.css";

const IP_Assesment = () => {
const printRef = useRef(null);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  // const UsercreatePatientdata = useSelector(state => state.userRecord?.UsercreatePatientdata);
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );

  console.log(IP_DoctorWorkbenchNavigation, "IP_DoctorWorkbenchNavigation");

  const dispatch = useDispatch();

  const formatLabel = (label) => {
    // Check if the label contains both uppercase and lowercase letters, and doesn't contain numbers
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between lowercase and uppercase letters
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
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
        adjustHeight(e);  // Call adjustHeight for all textareas
    }

  };

      
  const adjustHeight = (e) => {
    e.target.style.height = "auto"; // Reset height to calculate scrollHeight
    e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight
  };

  // ----------------- Medical History State -----------------
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

const [others, setOthers] = useState(false);
const [othersCheckbox, setOthersCheckbox] = useState("");

// ----------------- Handlers -----------------
const handlemedicalCheckboxChange = (key) => {
  setMedicalHistory((prevState) => ({
    ...prevState,
    [key]: !prevState[key],
  }));
  setOthers(false); // Uncheck "Others" when any checkbox is ticked
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
  setOthersCheckbox(""); // Clear Others text
};

//revathi check box state fixed

// ----------------- JSX UI -----------------
<div className="medical-history-section">
  <h3>Medical History</h3>

  {Object.entries(medicalHistory).map(([key, value]) => (
    <label key={key} style={{ display: "block", marginBottom: "4px" }}>
      <input
        type="checkbox"
        checked={value}
        onChange={() => handlemedicalCheckboxChange(key)}
      />
      {formatLabel(key)}
    </label>
  ))}

  <label style={{ display: "block", marginTop: "8px" }}>
    <input
      type="checkbox"
      checked={others}
      onChange={handlemedicalOthersChange}
    />
    Others
  </label>

  {others && (
    <textarea
      value={othersCheckbox}
      onChange={(e) => setOthersCheckbox(e.target.value)}
      placeholder="Please specify"
      style={{ width: "100%", marginTop: "6px" }}
    />
  )}
</div>

  /*const [medicalHistory, setMedicalHistory] = useState({
    // MedicalHistory
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

  const [others, setOthers] = useState(false); //1
  const [othersCheckbox, setOthersCheckbox] = useState("");

  const handlemedicalCheckboxChange = (key) => {
    setMedicalHistory((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
    setOthers(false); // Uncheck "Others" checkbox if any medical history checkbox is checked
  };

  const handlemedicalOthersChange = (event) => {
    const isChecked = event.target.checked;
    setOthers(isChecked);
    if (isChecked) {
      // Set all medicalHistory values to false
      const updatedMedicalHistory = Object.fromEntries(
        Object.entries(medicalHistory).map(([key]) => [key, false])
      );
      setMedicalHistory(updatedMedicalHistory);
    }
    setOthersCheckbox(""); // Clear the "Others" textarea when checkbox is unchecked
  };*/

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

      // Deselect all other checkboxes in the same category
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
    setOthers1(false); // Uncheck "Others" checkbox if any family history checkbox is checked
  };

  const handleOthersChange1 = (event) => {
    const isChecked = event.target.checked;
    setOthers1(isChecked);
    if (isChecked) {
      // Set all familyHistory values to false
      const updatedFamilyHistory = Object.fromEntries(
        Object.entries(familyHistory).map(([key]) => [key, false])
      );
      setFamilyHistory(updatedFamilyHistory);
    }
    setOthersCheckbox1(""); // Clear the "Others" textarea when checkbox is unchecked
  };

  const handleInputWomenChange = (e) => {
    const { name, value } = e.target;
    setFamilyHistoryInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [SurgicalHistory1, setSurgicalHistory1] = useState({
    // Surgical History
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
    // NoneOfTheAbove:false,
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
    setOther(false); // Uncheck "Others" checkbox if any surgical history checkbox is checked
  };

  const handleOtherChange2 = (event) => {
    const isChecked = event.target.checked;
    setOther(isChecked);
    if (isChecked) {
      // Set all familyHistory values to false
      const updatedSurgical = Object.fromEntries(
        Object.entries(SurgicalHistory1).map(([key]) => [key, false])
      );
      setSurgicalHistory1(updatedSurgical);
    }
    setOtherCheckbox(""); // Clear the "Others" textarea when checkbox is unchecked
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
      const parsedHeight = parseFloat(VitalFormData.Height) / 100; // Convert cm to m
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
        // Set all LocalExamination values to false
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
      adjustHeight(event);  // Call adjustHeight for all textareas
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

  const AssesmentColumns = [
    { key: "id", name: "S.No", frozen: true },
    // { key: "VisitId", name: "VisitId", frozen: true },
    // { key: "PrimaryDoctorId", name: "Doctor Id", frozen: true },
    { key: "PrimaryDoctorName", name: "Doctor Name", frozen: true },
    { key: "Date", name: "Date", frozen: true },
    { key: "Time", name: "Time", frozen: true },

    {
      key: "view",
      name: "View",
      frozen: true,
      renderCell: (params) => (
        <IconButton onClick={() => handleView(params.row)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;

    if (RegistrationId) {
      axios
        .get(`${UrlLink}Ip_Workbench/IP_Assesment_details_Link`, {
          params: {
            RegistrationId: RegistrationId,
            DepartmentType: departmentType,
            // RegistrationId: IP_DoctorWorkbenchNavigation?.RegistrationId,
          },
        })
        .then((res) => {
          const ress = res.data;
          console.log(res);
          setGridData(ress);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [IsGetData, UrlLink, IP_DoctorWorkbenchNavigation]);

  const handleView = (data) => {
    // // Update the AssessmentFormData state
    // setAssessmentFormData({
    //   PresentingComplaints: data.PresentingComplaints || "",
    //   DetailsPresentingComplaints: data.DetailsPresentingComplaints || "",
    //   HistoryOf: data.HistoryOf || "",
    //   PatientStatusAtAdmission: data.PatientStatusAtAdmission || "",
    //   Allergies: data.Allergies || "",
    //   Pupil: data.Pupil || "",
    //   Cvs: data.Cvs || "",
    //   Rs: data.Rs || "",
    //   Pa: data.Pa || "",
    //   Cns: data.Cns || "",
    // });

    // // Update the medicalHistory state
    // const medicalHistoryMap = data.MedicalHistoryCheckbox?.split(",").reduce(
    //   (acc, key) => {
    //     acc[key] = true;
    //     return acc;
    //   },
    //   {}
    // );

    // setMedicalHistory({
    //   Anemia: medicalHistoryMap?.Anemia || false,
    //   Arthritis: medicalHistoryMap?.Arthritis || false,
    //   Asthma: medicalHistoryMap?.Asthma || false,
    //   Cancer: medicalHistoryMap?.Cancer || false,
    //   ChronicObstructivePulmonaryDisease:
    //     medicalHistoryMap?.ChronicObstructivePulmonaryDisease || false,
    //   ClottingDisorder: medicalHistoryMap?.ClottingDisorder || false,
    //   SkinDisease: medicalHistoryMap?.SkinDisease || false,
    //   CongestiveHeartFailure:
    //     medicalHistoryMap?.CongestiveHeartFailure || false,
    //   CrohnsDisease: medicalHistoryMap?.CrohnsDisease || false,
    //   Depression: medicalHistoryMap?.Depression || false,
    //   Diabetes: medicalHistoryMap?.Diabetes || false,
    //   Emphysema: medicalHistoryMap?.Emphysema || false,
    //   EndocrineProblems: medicalHistoryMap?.EndocrineProblems || false,
    //   GERD: medicalHistoryMap?.GERD || false,
    //   Glaucoma: medicalHistoryMap?.Glaucoma || false,
    //   Hepatitis: medicalHistoryMap?.Hepatitis || false,
    //   HivAids: medicalHistoryMap?.HivAids || false,
    //   Hypertension: medicalHistoryMap?.Hypertension || false,
    //   KidneyDisease: medicalHistoryMap?.KidneyDisease || false,
    //   MyocardialInfarction: medicalHistoryMap?.MyocardialInfarction || false,
    //   PepticUlcerDisease: medicalHistoryMap?.PepticUlcerDisease || false,
    //   Seizures: medicalHistoryMap?.Seizures || false,
    //   Stroke: medicalHistoryMap?.Stroke || false,
    //   UlcerativeColitis: medicalHistoryMap?.UlcerativeColitis || false,
    // });
    // // Update others and othersCheckbox states
    // setOthers(data.MedicalHistoryOthers || false);
    // setOthersCheckbox(data.MedicalHistoryOthers || "");
    // console.log(data.MedicalHistoryOthers, "data.MedicalHistoryOthers");

    // // Update the socialHistory state
    // const socialHistoryMap = data.SocialHistoryCheckbox?.split(",").reduce(
    //   (acc, key) => {
    //     acc[key] = true;
    //     return acc;
    //   },
    //   {}
    // );

    // setSocialHistory({
    //   alcoholUseNever: socialHistoryMap?.alcoholUseNever || false,
    //   alcoholUseOccasionally: socialHistoryMap?.alcoholUseOccasionally || false,
    //   alcoholUseDaily: socialHistoryMap?.alcoholUseDaily || false,
    //   tobaccoUseNever: socialHistoryMap?.tobaccoUseNever || false,
    //   tobaccoUseOccasionally: socialHistoryMap?.tobaccoUseOccasionally || false,
    //   tobaccoUseDaily: socialHistoryMap?.tobaccoUseDaily || false,
    //   SmokingUseNever: socialHistoryMap?.SmokingUseNever || false,
    //   SmokingUseOccasionally: socialHistoryMap?.SmokingUseOccasionally || false,
    //   SmokingUseDaily: socialHistoryMap?.SmokingUseDaily || false,
    // });

    // // Update familyHistory and familyHistoryInfo states
    // const familyHistoryMap = data.FamilyHistoryCheckbox?.split(",").reduce(
    //   (acc, key) => {
    //     acc[key] = true;
    //     return acc;
    //   },
    //   {}
    // );

    // setFamilyHistory({
    //   CancerPolyps: familyHistoryMap?.CancerPolyps || false,
    //   Anemia1: familyHistoryMap?.Anemia1 || false,
    //   Diabetes1: familyHistoryMap?.Diabetes1 || false,
    //   BloodClots1: familyHistoryMap?.BloodClots1 || false,
    //   HeartDisease1: familyHistoryMap?.HeartDisease1 || false,
    //   Stroke1: familyHistoryMap?.Stroke1 || false,
    //   HighBloodPressure1: familyHistoryMap?.HighBloodPressure1 || false,
    //   AnesthesiaReaction1: familyHistoryMap?.AnesthesiaReaction1 || false,
    //   BleedingProblems1: familyHistoryMap?.BleedingProblems1 || false,
    //   Hepatitis1: familyHistoryMap?.Hepatitis1 || false,
    //   Tb: familyHistoryMap?.Tb || false,
    //   SkinDisease: familyHistoryMap?.SkinDisease || false,
    // });

    // setFamilyHistoryInfo({
    //   RelationShip: data.RelationShip || "",
    // });

    // setOthers1(data.FamilyHistoryOthers || false);
    // setOthersCheckbox1(data.FamilyHistoryOthers || "");

    // // Update SurgicalHistory1 state
    // const surgicalHistoryMap = data.SurgicalHistoryCheckbox?.split(",").reduce(
    //   (acc, key) => {
    //     acc[key] = true;
    //     return acc;
    //   },
    //   {}
    // );

    // setSurgicalHistory1({
    //   AdrenalGlandSurgery: surgicalHistoryMap?.AdrenalGlandSurgery || false,
    //   Appendectomy: surgicalHistoryMap?.Appendectomy || false,
    //   BariatricSurgery: surgicalHistoryMap?.BariatricSurgery || false,
    //   BladderSurgery: surgicalHistoryMap?.BladderSurgery || false,
    //   BreastSurgery: surgicalHistoryMap?.BreastSurgery || false,
    //   CesareanSection: surgicalHistoryMap?.CesareanSection || false,
    //   Cholecystectomy: surgicalHistoryMap?.Cholecystectomy || false,
    //   ColonSurgery: surgicalHistoryMap?.ColonSurgery || false,
    //   CoronaryArteryBypassGraft:
    //     surgicalHistoryMap?.CoronaryArteryBypassGraft || false,
    //   EsophagusSurgery: surgicalHistoryMap?.EsophagusSurgery || false,
    //   GastricBypassSurgery: surgicalHistoryMap?.GastricBypassSurgery || false,
    //   HemorrhoidSurgery: surgicalHistoryMap?.HemorrhoidSurgery || false,
    //   HerniaRepair: surgicalHistoryMap?.HerniaRepair || false,
    //   Hysterectomy: surgicalHistoryMap?.Hysterectomy || false,
    //   KidneySurgery: surgicalHistoryMap?.KidneySurgery || false,
    //   NeckSurgery: surgicalHistoryMap?.NeckSurgery || false,
    //   ProstateSurgery: surgicalHistoryMap?.ProstateSurgery || false,
    //   SmallIntestineSurgery: surgicalHistoryMap?.SmallIntestineSurgery || false,
    //   SpineSurgery: surgicalHistoryMap?.SpineSurgery || false,
    //   StomachSurgery: surgicalHistoryMap?.StomachSurgery || false,
    //   ThyroidSurgery: surgicalHistoryMap?.ThyroidSurgery || false,
    // });

    // setOther(data.SurgicalHistoryOthers || false);
    // setOtherCheckbox(data.SurgicalHistoryOthers || "");

    // // Update patientInfo2 state
    // setPatientInfo2({
    //   Listnamesdates: data.Listnamesdates || "",
    // });

    // const womenMenKeys = data.womenMenCheckbox?.split(",") || [];
    // setWomenMen({
    //   Monthlyselfexam: womenMenKeys.includes("Monthlyselfexam"),
    //   Yearlyphysicianexam: womenMenKeys.includes("Yearlyphysicianexam"),
    //   Lastmammogram: womenMenKeys.includes("Lastmammogram"),
    //   YearlyGYNexam: womenMenKeys.includes("YearlyGYNexam"),
    //   YearlyPAPexam: womenMenKeys.includes("YearlyPAPexam"),
    //   Lastmammogram2: womenMenKeys.includes("Lastmammogram2"),
    //   Highsunexposure: womenMenKeys.includes("Highsunexposure"),
    //   Yearlyskinexam: womenMenKeys.includes("Yearlyskinexam"),
    // });

    // // Update men state
    // const menKeys = data.menCheckbox?.split(",") || [];
    // setMen({
    //   Yearlyrectalexam: menKeys.includes("Yearlyrectalexam"),
    //   YearlyPSAbloodtest: menKeys.includes("YearlyPSAbloodtest"),
    //   Yearlyrectalexam2: menKeys.includes("Yearlyrectalexam2"),
    //   Yearlystooltestforblood: menKeys.includes("Yearlystooltestforblood"),
    // });

    // // Update mentext state
    // setMenText({
    //   Dateoflastcolonoscopy: data.Dateoflastcolonoscopy || "",
    // });

    // // Update GynecHistory state
    // setGynecHistory({
    //   Lmp: data.Lmp || "",
    //   NoOfPregnancies: data.NoOfPregnancies || "",
    //   NoOfDeliveries: data.NoOfDeliveries || "",
    //   Vaginal: data.Vaginal || "",
    //   Csection: data.Csection || "",
    //   MisCarriage: data.MisCarriage || "",
    //   VipAbortions: data.VipAbortions || "",
    // });

    // // Update VitalFormData state
    // setVitalFormData({
    //   Temperature: data.Temperature || "",
    //   PulseRate: data.PulseRate || "",
    //   SPO2: data.SPO2 || "",
    //   HeartRate: data.HeartRate || "",
    //   RR: data.RR || "",
    //   BP: data.BP || "",
    //   Height: data.Height || "",
    //   Weight: data.Weight || "",
    //   BMI: data.BMI || "",
    //   WC: data.WC || "",
    //   HC: data.HC || "",
    //   PainScore: data.PainScore || "",
    //   BSL: data.BSL || "",
    // });

    // // Update Msp state
    // setMsp({
    //   UlRt: data.UlRt || "",
    //   UlLt: data.UlLt || "",
    //   LlRt: data.LlRt || "",
    //   LlLt: data.LlLt || "",
    // });

    // // Update Plantars state
    // setPlantars({
    //   Rt: data.Rt || "",
    //   Lt: data.Lt || "",
    // });

    // // Update LocalExamination state
    // const localExaminationKeys = data.LocalExamination?.split(",") || [];
    // setLocalExamination({
    //   Oedma: localExaminationKeys.includes("Oedma"),
    //   Cyanosis: localExaminationKeys.includes("Cyanosis"),
    //   Clubbing: localExaminationKeys.includes("Clubbing"),
    //   SurgicalScars: localExaminationKeys.includes("SurgicalScars"),
    //   Jaundice: localExaminationKeys.includes("Jaundice"),
    //   Pallor: localExaminationKeys.includes("Pallor"),
    //   Lymphadenopathy: localExaminationKeys.includes("Lymphadenopathy"),
    //   Thyromegaly: localExaminationKeys.includes("Thyromegaly"),
    // });

    // setLocalOthers(data.LocalOthers || false);
    // setLocalOthersCheckbox(data.LocalOthers || "");

    // // Update Textarea3 state
    // setTextarea3({
    //   ProvisionalDiagnosis: data.ProvisionalDiagnosis || "",
    //   FinalDiagnosis: data.FinalDiagnosis || "",
    //   TreatmentGiven: data.TreatmentGiven || "",
    // });

    // //   // Update isSameAsProvisional state
    // //   setIsSameAsProvisional(data.isSameAsProvisional || false);
    // // console.log(data.isSameAsProvisional);

    // const isSameAsProvisional = data.isSameAsProvisional === "true";
    // setIsSameAsProvisional(isSameAsProvisional || false);

    // console.log(isSameAsProvisional);

    // Set view mode to true
    setIsViewMode(true);

    setSelectedRow(data); // Store only the selected row data
    setIsModalOpen(true); // Open modal
  };

  const handleClear = () => {
    // Clear the AssessmentFormData state
    setAssessmentFormData({
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

    // Clear the medicalHistory state
    setMedicalHistory({
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

    // Clear the others and othersCheckbox states
    setOthers(false);
    setOthersCheckbox("");

    // Clear the socialHistory state
    setSocialHistory({
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

    // Clear the familyHistory and familyHistoryInfo states
    setFamilyHistory({
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

    setFamilyHistoryInfo({
      RelationShip: "",
    });

    setOthers1(false);
    setOthersCheckbox1("");

    // Clear the SurgicalHistory1 state
    setSurgicalHistory1({
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

    setOther(false);
    setOtherCheckbox("");

    // Clear the patientInfo2 state
    setPatientInfo2({
      Listnamesdates: "",
    });

    // Clear the womenMen state
    setWomenMen({
      Monthlyselfexam: false,
      Yearlyphysicianexam: false,
      Lastmammogram: false,
      YearlyGYNexam: false,
      YearlyPAPexam: false,
      Lastmammogram2: false,
      Highsunexposure: false,
      Yearlyskinexam: false,
    });

    // Clear the men state
    setMen({
      Yearlyrectalexam: false,
      YearlyPSAbloodtest: false,
      Yearlyrectalexam2: false,
      Yearlystooltestforblood: false,
    });

    // Clear the mentext state
    setMenText({
      Dateoflastcolonoscopy: "",
    });

    // Clear the GynecHistory state
    setGynecHistory({
      Lmp: "",
      NoOfPregnancies: "",
      NoOfDeliveries: "",
      Vaginal: "",
      Csection: "",
      MisCarriage: "",
      VipAbortions: "",
    });

    // Clear the VitalFormData state
    setVitalFormData({
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

    // Clear the Msp state
    setMsp({
      UlRt: "",
      UlLt: "",
      LlRt: "",
      LlLt: "",
    });

    // Clear the Plantars state
    setPlantars({
      Rt: "",
      Lt: "",
    });

    // Clear the LocalExamination state
    setLocalExamination({
      Oedma: false,
      Cyanosis: false,
      Clubbing: false,
      SurgicalScars: false,
      Jaundice: false,
      Pallor: false,
      Lymphadenopathy: false,
      Thyromegaly: false,
    });

    setLocalOthers(false);
    setLocalOthersCheckbox("");

    // Clear the Textarea3 state
    setTextarea3({
      ProvisionalDiagnosis: "",
      FinalDiagnosis: "",
      TreatmentGiven: "",
    });

    // Clear the isSameAsProvisional state
    setIsSameAsProvisional(false);

    // Exit view mode
    setIsViewMode(false);
  };


  const handleSubmit = () => {
    const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    const DepartmentType = IP_DoctorWorkbenchNavigation?.RequestType;

    if (!RegistrationId) {
      dispatch({
        type: "toast",
        value: { message: "Registration ID is missing", type: "error" },
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

      // RegistrationId: IP_DoctorWorkbenchNavigation?.RegistrationId,
      created_by: userRecord?.username || "",
      isSameAsProvisional: isSameAsProvisional,
    };

    if (others) {
      data.MedicalHistoryOthers = othersCheckbox;
    }
    if (others1) {
      data.FamilyHistoryOthers = othersCheckbox1;
    }
    if (other) {
      data.SurgicalHistoryOthers = otherCheckbox;
    }
    if (LocalOthers) {
      data.LocalOthersCheckbox = LocalOthersCheckbox;
    }

    data.RelationShip = familyHistoryInfo?.RelationShip;
    data.Listnamesdates = patientInfo2?.Listnamesdates;
    data.Dateoflastcolonoscopy = mentext?.Dateoflastcolonoscopy;

    console.log(data, "data");

    axios
      .post(`${UrlLink}Ip_Workbench/IP_Assesment_details_Link`, data)
      .then((res) => {
        const [type, message] = [
          Object.keys(res.data)[0],
          Object.values(res.data)[0],
        ];
        dispatch({ type: "toast", value: { message, type } });
        setIsGetData((prev) => !prev);

        handleClear();
      })

      .catch((err) => console.log(err));
  
    };
    



// Print Function
const handlePrint = () => {
  const printContents = printRef.current?.innerHTML;

  if (!printContents) {
    alert("Nothing to print");
    return;
  }

  const printWindow = window.open("", "_blank", "width=1200,height=800");

  printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          @page {
            size: landscape;
            margin: 10mm;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .wdwqd_p0w {
            display: flex;
            gap: 10px;
            margin-bottom: 8px;
          }
          strong {
            min-width: 200px;
          }
        </style>
      </head>
      <body>
        ${printContents}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = window.close;
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};



  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // const handleView = (rowData) => {

  // };

  


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
              readOnly={IsViewMode}
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
              readOnly={IsViewMode}
              value={AssessmentFormData.DetailsPresentingComplaints}
            />
          </div>

          {/* <div className="text_adjust_mt_Ot_Ass">
            <label>
              {" "}
              H/O(history of)<span>:</span>{" "}
            </label>
            <textarea
              name="HistoryOf"
              id="HistoryOf"
              onChange={handleChange}
              readOnly={IsViewMode}
              value={AssessmentFormData.HistoryOf}
            />
          </div>
          <div className="text_adjust_mt_Ot_Ass">
            <label>
              {" "}
              Patient Status At Admission<span>:</span>{" "}
            </label>
            <textarea
              name="PatientStatusAtAdmission"
              id="PatientStatusAtAdmission"
              onChange={handleChange}
              readOnly={IsViewMode}
              value={AssessmentFormData.PatientStatusAtAdmission}
            />
          </div> */}
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
                            readOnly={IsViewMode}
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
                  readOnly={IsViewMode}
                  disabled={IsViewMode}
                  onChange={handlemedicalOthersChange}
                  // onChange={(e) => setOthers(e.target.checked)}
                />
                <span>Others</span>
              </label>

              <textarea
                id="others-textarea"
                value={othersCheckbox}
                onChange={(e) => setOthersCheckbox(e.target.value)}
                readOnly={IsViewMode}
                // onChange={handleOthersChange}
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
                            readOnly={IsViewMode}
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
                  readOnly={IsViewMode}
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
                readOnly={IsViewMode}
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
                readOnly={IsViewMode}
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
                      readOnly={IsViewMode}
                      disabled={IsViewMode}
                      onChange={() => {
                        handleCheckboxChange2("alcoholUseNever");
                      }}
                    />
                    Never
                  </label>

                  {/* <div className="flx_cjk_labl3"> */}
                  <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                    <input
                      type="checkbox"
                      className="checkbox-input ddsfe"
                      checked={socialHistory.alcoholUseOccasionally}
                      readOnly={IsViewMode}
                      disabled={IsViewMode}
                      onChange={() => {
                        handleCheckboxChange2("alcoholUseOccasionally");
                      }}
                    />
                    Occasionally
                  </label>
                  {/* </div> */}

                  {/* <div className="flx_cjk_labl3"> */}
                  <label className="checkbox-label_ooo checkbox-label_ooo-Ass">
                    <input
                      type="checkbox"
                      className="checkbox-input ddsfe"
                      checked={socialHistory.alcoholUseDaily}
                      readOnly={IsViewMode}
                      disabled={IsViewMode}
                      onChange={() => {
                        handleCheckboxChange2("alcoholUseDaily");
                      }}
                    />
                    Daily
                  </label>
                  {/* </div> */}
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
                      readOnly={IsViewMode}
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
                      readOnly={IsViewMode}
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
                      readOnly={IsViewMode}
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
                      readOnly={IsViewMode}
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
                      readOnly={IsViewMode}
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
                      readOnly={IsViewMode}
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
                  readOnly={IsViewMode}
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
                  readOnly={IsViewMode}
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
                  readOnly={IsViewMode}
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
                  readOnly={IsViewMode}
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
                  readOnly={IsViewMode}
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
                  readOnly={IsViewMode}
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
                  readOnly={IsViewMode}
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
                  readOnly={IsViewMode}
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
                  readOnly={IsViewMode}
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
                  readOnly={IsViewMode}
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
                  readOnly={IsViewMode}
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
                  readOnly={IsViewMode}
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
                  readOnly={IsViewMode}
                  disabled={IsViewMode}
                />
                <span style={{ marginRight: "8px" }}>Others</span>
              </label>

              <textarea
                id="others-textarea1"
                value={othersCheckbox1}
                onChange={(e) => setOthersCheckbox1(e.target.value)}
                readOnly={IsViewMode}
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
                readOnly={IsViewMode}
              />
            </label>
          </div>
          </div>
        </div>


        <div className="form-section522">
          <div className="dkwjd">
            <h3  style={{justifyContent:'flex-start'}}>Gynec History</h3>
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
                readOnly={IsViewMode}
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
                readOnly={IsViewMode}
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
                readOnly={IsViewMode}
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
                readOnly={IsViewMode}
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
                readOnly={IsViewMode}
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
                readOnly={IsViewMode}
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
                readOnly={IsViewMode}
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
              readOnly={IsViewMode}
            />
          </div>
          </div>
        </div>

      
        <div className="form-section522">
          <div className="dkwjd">
            <h3  style={{justifyContent:'flex-start'}}>O/E(on examination) </h3>
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
                      // placeholder={`Enter the ${formatLabel(labelname)}`}
                      value={VitalFormData[labelname]}
                      readOnly={labelname === "CapturedDate" && IsViewMode}
                      onChange={handleInputChange}
                      // readOnly={IsViewMode}
                    />
                  }
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section522">
          <div className="dkwjd">
            <h3  style={{justifyContent:'flex-start'}}>S/E (systemicexamination) </h3>
          </div>

          <div className="RegisFormcon_1" style={{justifyContent:'center'}}>
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
                readOnly={IsViewMode}
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
                readOnly={IsViewMode}
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
                          readOnly={IsViewMode}
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
                          readOnly={IsViewMode}
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
                          readOnly={IsViewMode}
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
                          readOnly={IsViewMode}
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
                          readOnly={IsViewMode}
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
                          readOnly={IsViewMode}
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
                readOnly={IsViewMode}
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
                readOnly={IsViewMode}
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
                readOnly={IsViewMode}
                className="textarea-wide"
              />
            </div>
          </div>
        </div>



        <div className="form-section522">
          <div className="dkwjd">
            <h3 style={{justifyContent:'flex-start'}}>L/E (local examination)</h3>
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
                              readOnly={IsViewMode}
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
                    readOnly={IsViewMode}
                  />
                  <span style={{ marginRight: "8px" }}>Others</span>
                </label>

                <textarea
                  id="others-textarea"
                  value={LocalOthersCheckbox}
                  onChange={(e) => setLocalOthersCheckbox(e.target.value)}
                  placeholder="Please specify..."
                  style={{ marginLeft: "8px" }}
                  readOnly={IsViewMode}
                  className="textarea-wide1"
                />
              </div>
            </div>
            {/* <br /> */}
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
              readOnly={IsViewMode}
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
              readOnly={IsViewMode}
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
              readOnly={IsViewMode}
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
              readOnly={IsViewMode}
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
              readOnly={isSameAsProvisional || IsViewMode}
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
              readOnly={IsViewMode}
            />
          </div>
        </div>

        <div className="Main_container_Btn">
          {/* {IsViewMode && <button onClick={handleClear}>Clear</button>} */}
          {/* {!IsViewMode && <button onClick={handleSubmit}>Submit</button>} */}

          <button onClick={handleSubmit}>Submit</button>
        </div>

        {gridData.length > 0 && (
          <ReactGrid columns={AssesmentColumns} RowData={gridData} />
        )}

        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>
  {isModalOpen && selectedRow && (
  <div
    className="sideopen_showcamera_profile"
    onClick={() => setIsModalOpen(false)}
  >
    <div
      className="newwProfiles newwPopupforreason"
      ref={printRef} // ✅ This is correct
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: "0", padding: "10px 0" }}>Submitted Details</h2>
        <div>
          <button
            onClick={handlePrint}
            style={{
              marginRight: "10px",
              padding: "4px 10px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🖨️ Print
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            style={{
              padding: "4px 10px",
              background: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ✖ Close
          </button>
        </div>
      </div>

      <div className="asset_show_seled_datad">
        {Object.entries(selectedRow)
          .filter(([key, value]) => value)
          .map(([key, value]) => (
            <p key={key} className="wdwqd_p0w">
              <strong>{formatLabel(key)}<span>:</span></strong>
              <h5>{value}</h5>
            </p>
          ))}
      </div>
    </div>
  </div>
)}


    </>
  );
};

export default IP_Assesment;
