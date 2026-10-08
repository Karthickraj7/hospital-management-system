import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
// import jsPDF from "jspdf";
import bgImg2 from "../../Assets/bgImg2.jpg";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import PrintIcon from '@mui/icons-material/Print';
import Button from "@mui/material/Button";

const PrintContent = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} id="reactprintcontent">
      {props.children}
    </div>
  );
});

function OtLabour() {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const OTPatientdata = useSelector((state) => state.Frontoffice?.OTPatientdata);

  console.log(OTPatientdata, 'OTPatientdata')

  const dispatchvalue = useDispatch();

  const [checkboxState, setCheckboxState] = useState({
    Spontaneous: false,
    InducedbyStripping: false,
    ARM: false,
    Oxytonic: false,
    Combined: false,
  });

  const [checkboxState2, setCheckboxState2] = useState({
    ExpelledSpontaneously: false,
    ByhandIntroduction: false,
    ControlledCordTraction: false,
  });

  const [radioState, setRadioState] = useState({
    Episiotomy: "",
    Uterus: "",
  });

  const getTrueCheckboxes = () => {
    return Object.entries(checkboxState)
      .filter(([key, value]) => value === true) // Filter keys with `true` values
      .map(([key]) => key); // Extract the key names
  };

  const getTrueCheckboxes1 = () => {
    return Object.entries(checkboxState2)
      .filter(([key, value]) => value === true) // Filter keys with `true` values
      .map(([key]) => key); // Extract the key names
  };

  const getTrueCheckboxes2 = () => {
    return Object.entries(radioState)
      .filter(([key, value]) => value === true) // Filter keys with `true` values
      .map(([key]) => key); // Extract the key names
  };

  const trueCheckboxes = getTrueCheckboxes();
  const trueCheckboxes1 = getTrueCheckboxes1();
  const trueCheckboxes2 = getTrueCheckboxes2();

  const [Crewdata, setCrewdata] = useState([]);

  const [entries, setEntries] = useState({
    id: '',
    surgeon: [],
    surgeonname: [],
    assistantSurgeon: [],
    assistantSurgeonname: [],
    anaesthesiologist: [],
    anaesthesiologistname: [],
    scrubNurse: [],
    scrubNursename: [],
    technician: [],
    technicianname: [],
    circulatingNurse: [],
    circulatingNursename: [],
    othersname: [],
    others: [],
  });
  const [formDataLabour, setFormDataLabour] = useState({
    firstStageDuration: "",
    secondStageDuration: "",
    thirdStageDuration: "",
    dateAndDay: "",
    deliveryTime: "",
    babySex: "",
    babyWeight: "",
    apgarScore: "",
    deliveryType: "",
    complications: "",
    babyBloodGroupid: "",
    babyBloodGroupname: "",
    ConditionofMembranes: "",
    ConditionofPlacenta: "",
    ConductedBy: "",
    AssistedBy: "",
    Anaesthesiologist: "",
    LabourAnalgesia: "",
    PPH: {
      Nil: false,
      Mild: false,
      Moderate: false,
      Severe: false,
    },
    Amount: "",
    Laceration: "",
    Episiotomy: "",

    EpisiotomySutureMaterial: "",
    ProphylacticOxytocic: "",

    Pulse: "",
    BP: "",
    BleedingPV: "",

    Wt: "",
    HC: "",
    Length: "",
    AnomaliesAny: "",
    Remarks: "",

    Paediatricians: "",
    PostDeliveryOrders: "",
  });

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setCheckboxState({
      ...Object.fromEntries(
        Object.entries(checkboxState).map(([key]) => [key, false])
      ),
      [id]: checked,
    });
  };

  const handleCheckboxChange2 = (e) => {
    const { id, checked } = e.target;
    setCheckboxState2({
      ...Object.fromEntries(
        Object.entries(checkboxState2).map(([key]) => [key, false])
     

 ),
      [id]: checked,
    });
  };

  const handleChange = (e) => {
    const { name, id, value, type } = e.target;

    if (type === "checkbox") {
      if (name === "PPH") {
        setFormDataLabour((prevFormData) => ({
          ...prevFormData,
          PPH: {
            ...Object.fromEntries(
              Object.entries(prevFormData.PPH).map(([key]) => [key, false])
            ),
            [id]: true,
          },
        }));
      } else {
        setFormDataLabour((prevFormData) => ({
          ...prevFormData,
          [id]: !prevFormData[id],
        }));
      }
    } else if (type === "radio") {
      setRadioState((prevRadioState) => ({
        ...prevRadioState,
        [name]: value,
      }));
    } 

    else if(id === "babyBloodGroup"){

      console.log(value,'valuevalue');
      const value1 = value.split('|');
      const value2 = value1[0];
      const value3 = value1[1];
      console.log(value1,value2,value3);

      setFormDataLabour((prevFormData) => ({
        ...prevFormData,
        babyBloodGroupid : value2,
        babyBloodGroupname : value3
      }));
      

    }
    
    
    
    else {
      setFormDataLabour((prevFormData) => ({
        ...prevFormData,
        [id]: value,
      }));
    }
  };

  const [blooddata, setblooddata] = useState([]);
  const [DeliveryNotes, setDeliveryNotes] = useState([]);
  const [Load, setLoad] = useState(false);

  useEffect(() => {
    axios.get(`${UrlLink}Masters/BloodGroup_Master_link`)
        .then((res) => setblooddata(res.data))
        .catch((err) => console.log(err));
  }, [UrlLink]);

  useEffect(() => {
    axios.get(`${UrlLink}OT/Labour_delivery_Notes_OT_Details?RegistrationId=${OTPatientdata?.RegistrationId}&BookingType=${OTPatientdata?.BookingType}`)
        .then((res) => setDeliveryNotes(res.data))
        .catch((err) => console.log(err));
  }, [UrlLink, Load]);

  useEffect(() => {
    axios.get(`${UrlLink}OT/Surgical_Team_details?RegistrationId=${OTPatientdata?.RegistrationId}&BookingType=${OTPatientdata?.BookingType}`)
      
        .then((res) => {
          const data = res.data;
  
          console.log(data,'res');
          console.log(data[0].surgeonId.split(", ").map(id => id.trim()).join(", "),'premkumar');
          // setCrewdata(res.data);
          setFormDataLabour((prev)=>({
            ...prev,
            ConductedBy : data[0].surgeon.split(", ").map(id => id.trim()).join(", "),
            AssistedBy : data[0].assistantSurgeon.split(", ").map(id => id.trim()).join(", "),
            Anaesthesiologist : data[0].anaesthesiologist.split(", ").map(id => id.trim()).join(", "),
        
          }))
          // setEntries({
  
          //   id : data[0].id,
          //   surgeon: data[0].surgeonId.split(", ").map(id => id.trim()),
          //   surgeonname: data[0].surgeon.split(", ").map(id => id.trim()),
          //   assistantSurgeon: data[0].assistantSurgeonId.split(", ").map(id => id.trim()),
          //   assistantSurgeonname: data[0].assistantSurgeon.split(", ").map(id => id.trim()),
          //   anaesthesiologist: data[0].anaesthesiologistId.split(", ").map(id => id.trim()),
          //   anaesthesiologistname: data[0].anaesthesiologist.split(", ").map(id => id.trim()),
          //   scrubNurse: data[0].scrubNurseId.split(", ").map(id => id.trim()),
          //   scrubNursename: data[0].scrubNurse.split(", ").map(id => id.trim()),
          //   technician: data[0].technicianId.split(", ").map(id => id.trim()),
          //   technicianname: data[0].technician.split(", ").map(id => id.trim()),
          //   circulatingNurse: data[0].circulatingNurseId.split(", ").map(id => id.trim()),
          //   circulatingNursename: data[0].circulatingNurse.split(", ").map(id => id.trim()),
          //   othersname: data[0].others.split(", ").map(id => id.trim()),
          //   others: data[0].othersId.split(", ").map(id => id.trim()),
  
          // });
          }
  
        )
        .catch((err) => console.log(err));
  
  
  }, [OTPatientdata]);

  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
  const [selectedData, setSelectedData] = useState([]);
  console.log(selectedData.Duration1,'selectedData')
  // Rest of your state and logic...

  const componentRef = useRef();

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: async () => {
      setIsPrintButtonVisible(true);

      setSelectedData(null);
    },
  });

  const Submitalldata = () => {

    const data = {

      Patientid :  OTPatientdata.patientId,
      RegistrationId : OTPatientdata?.RegistrationId,
      created_by : userRecord?.username || '',
      DoctorId :  userRecord?.Doctor || '',
      BookingType : OTPatientdata?.BookingType,


        Labourtype : trueCheckboxes[0],
        Duration1 : formDataLabour.firstStageDuration,
        Duration2 : formDataLabour.secondStageDuration,
        Duration3 : formDataLabour.thirdStageDuration,
        DeliveryDate : formDataLabour.dateAndDay,
        DeliveryTime : formDataLabour.deliveryTime,
        Gender : formDataLabour.babySex,
        DeliveryWt : formDataLabour.babyWeight,
        APGARscore : formDataLabour.apgarScore,
        Type : formDataLabour.deliveryType,
        Complications : formDataLabour.complications,
        Babybloodgroup : formDataLabour.babyBloodGroupid,
        Placenta_Membranes : trueCheckboxes1[0],
        MembranesCondition : formDataLabour.ConditionofMembranes,
        PlacentaCondition : formDataLabour.ConditionofPlacenta,
        Conductedby : formDataLabour.ConductedBy,
        Assistedby : formDataLabour.AssistedBy,
        Anaesthesiologist : formDataLabour.Anaesthesiologist,
        LabourAnalgesia : formDataLabour.LabourAnalgesia,
        PPH : formDataLabour.PPH.Nil
        ? "Nil"
        : formDataLabour.PPH.Mild
        ? "Mild"
        : formDataLabour.PPH.Moderate
        ? "Moderate"
        : formDataLabour.PPH.Severe
        ? "Severe"
        : "Unknown",
        Amount : formDataLabour.Amount,
        Laceration : formDataLabour.Laceration,
        Episiotomy : radioState.Episiotomy,
        EpisiotomyMaterial : formDataLabour.EpisiotomySutureMaterial,
        ProphylacticOxytocic : formDataLabour.ProphylacticOxytocic,
        Pulse : formDataLabour.Pulse,
        BP : formDataLabour.BP,
        Uterus : radioState.Uterus,
        BleedingPV : formDataLabour.BleedingPV,
        PostDeleiveryOrders  : formDataLabour.PostDeliveryOrders,
        BeforeWT : formDataLabour.Wt,
        BeforeHC : formDataLabour.HC,
        Length : formDataLabour.Length,
        Anomalies : formDataLabour.AnomaliesAny,
        Remarks : formDataLabour.Remarks,
        PaediatricianRecord : formDataLabour.Paediatricians
    }
    console.log(data,'data');

    axios.post(`${UrlLink}OT/Labour_delivery_Notes_OT_Details`, data)
    .then((res) => {
  
      const response = res.data;
                  const messageType = Object.keys(response)[0];
                  const messageContent = Object.values(response)[0];
                  console.log(messageType);
                  console.log(messageContent);
                  setLoad((prev) => !prev);
                  dispatchvalue({
                      type: 'toast',
                      value: { message: messageContent, type: messageType },
                  });
    })
    .catch((err) => console.log(err));
  };

  const [clinicName, setClinicName] = useState("");
  const [clinicLogo, setClinicLogo] = useState(null);
  const [location, setlocation] = useState("");

  useEffect(() => {
    const location = userRecord?.location;

    axios
      .get("your_api_endpoint")
      .then((response) => {
        console.log(response.data);
        if (response.data) {
          const data = response.data;
          setClinicName(data.Clinic_Name);
          setClinicLogo(`data:image/png;base64,${data.Clinic_Logo}`);
          setlocation(data.location);
        } else {
          // Handle error if needed
        }
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, [userRecord]);
  //

  const [workbenchformData, setFormData] = useState({
    SerialNo: "",
    PatientID: OTPatientdata?.patientId ||  "",
    PatientName: OTPatientdata?.PatientName || "",
    visitNo: "",
    firstName: "",
    lastName: "",
    AppointmentDate: "",
    Complaint: "",
    PatientPhoto: "",
    DoctorName: OTPatientdata?.DoctorName || "",
    Age:  OTPatientdata?.Age || "",
    Gender: OTPatientdata?.Gender ||  "",
    Location: "",
    RegisterID : OTPatientdata?.RegistrationId

  });

  console.log(workbenchformData);
  dispatchvalue({
    type: "workbenchformData",
    value: workbenchformData,
    
  });

  const handlePrint = (row) => {
  console.log(row, 'rowsssssssssssssssssss');

  setSelectedData(Array.isArray(row) ? row : [row]);

  setIsPrintButtonVisible(false);

  setTimeout(() => {
    handlePrint2();
  }, 500);
};


  const NotesColumn = [
    {
      key: "sno",
      name: "S.No",
    },
    {
      key: "RegisterId",
      name: "IPNo",
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 150,
    },
    {
      key: "EditAction",
      name: "Action",
      renderCell: (params) => (
        <Button onClick={() => handlePrint(params.row)}>
          <PrintIcon />
        </Button>
      ),
    },
  ];

  const LabourPrint = React.forwardRef(({ data }, ref) => {
    if (!data) return null;
    return (
      <div ref={ref} id="reactprintcontent" style={{ marginTop: "50px", display: "flex", justifyContent: "center" }}>
        <div className="Print_ot_all_div">
          <div className="new-patient-registration-form ">
            <div>
              <div className="paymt-fr-mnth-slp">
                <div className="logo-pay-slp">
                  <img src={clinicLogo} alt="" />
                </div>
                <div>
                  <h2>
                    {clinicName} ({location})
                  </h2>
                </div>
              </div>
              <h4
                style={{
                  color: "var(--labelcolor)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "start",
                  padding: "10px",
                }}
              >
                Nurse
              </h4>
            </div>

            <div className="dctr_info_up_head Print_ot_all_div_second2">
              {/* <div className="RegisFormcon ">
                <div className="dctr_info_up_head22">
                  {workbenchformData.PatientPhoto ? (
                    <img
                      src={workbenchformData.PatientPhoto}
                      alt="Patient Photo"
                    />
                  ) : (
                    <img src={bgImg2} alt="Default Patient Photo" />
                  )}
                  <label>Profile</label>
                </div>
              </div> */}

              <div className="RegisFormcon">
                <div className="RegisForm_1 ">
                  <label htmlFor="FirstName">
                    Patient Name <span>:</span>{" "}
                  </label>

                  <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                    {workbenchformData.PatientName}
                  </span>
                </div>
                <div className="RegisForm_1 ">
                  <label htmlFor="FirstName">
                    Patient ID <span>:</span>
                  </label>

                  <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                    {workbenchformData.PatientID}{" "}
                  </span>
                </div>

                <div className="RegisForm_1 ">
                  <label htmlFor="FirstName">
                    Age <span>:</span>{" "}
                  </label>

                  <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                    {workbenchformData.Age}{" "}
                  </span>
                </div>
                <div className="RegisForm_1 ">
                  <label htmlFor="FirstName">
                    Gender <span>:</span>{" "}
                  </label>

                  <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                    {workbenchformData.Gender}{" "}
                  </span>
                </div>
                <div className="RegisForm_1 ">
                  <label htmlFor="FirstName">
                    Primary Doctor <span>:</span>{" "}
                  </label>

                  <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                    {workbenchformData.DoctorName}{" "}
                  </span>
                </div>
                {/* <div className="RegisForm_1 ">
                  <label htmlFor="FirstName">
                    Location <span>:</span>{" "}
                  </label>
                  <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                    {workbenchformData.Location}{" "}
                  </span>
                </div> */}
              </div>
            </div>
          </div>
          <div className="appointment">
            <h4
              style={{
                color: "var(--labelcolor)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "start",
                padding: "10px",
              }}
            >
              Labour & Delivery Record
            </h4>
            <br />
            <div className="OtMangement_con">
              <div className="OtMangementForm_1">
                <label>
                  Type of Labour<span>:</span>
                </label>
                <div
                  className="OtMangementForm_1_checkbox weewdexewdd"
                >
                  <label htmlFor="Spontaneous">
                    <input
                      id="Spontaneous"
                      value="Spontaneous"
                      type="checkbox"
                      checked={data.Labourtype === "Spontaneous"}
                      readOnly
                    />
                    <span>Spontaneous</span>
                  </label>
                  <label htmlFor="InducedbyStripping">
                    <input
                      id="InducedbyStripping"
                      value="InducedbyStripping"
                      type="checkbox"
                      checked={data.Labourtype === "InducedbyStripping"}
                      readOnly
                    />
                    <span>Induced by Stripping</span>
                  </label>
                  <label htmlFor="ARM">
                    <input
                      id="ARM"
                      value="ARM"
                      type="checkbox"
                      checked={data.Labourtype === "ARM"}
                      readOnly
                    />
                    <span>ARM</span>
                  </label>
                  <label htmlFor="Oxytonic">
                    <input
                      id="Oxytonic"
                      value="Oxytonic"
                      type="checkbox"
                      checked={data.Labourtype === "Oxytonic"}
                      readOnly
                    />
                    <span>Oxytonic</span>
                  </label>
                  <label htmlFor="Combined">
                    <input
                      id="Combined"
                      value="Combined"
                      type="checkbox"
                      checked={data.Labourtype === "Combined"}
                      readOnly
                    />
                    <span>Combined</span>
                  </label>
                </div>
              </div>
            </div>
            <br />
            <div
              className="RegisFormcon"
              style={{ justifyContent: "center" }}
            >
              <h4 style={{ width: "180px", display: "flex", gap: "5px" }}>
                Duration of Labours<span>:</span>
              </h4>
              <div className="RegisForm_1">
                <label>
                  1st Stage<span>:</span>
                </label>
                <input
                  type="number"
                  id="firstStageDuration"
                  name="firstStageDuration"
                  className="de32111"
                  value={data.Duration1}
                  readOnly
                />
                hrs
              </div>
              <div className="RegisForm_1">
                <label>
                  2nd Stage<span>:</span>
                </label>
                <input
                  type="number"
                  id="secondStageDuration"
                  name="secondStageDuration"
                  className="de32111"
                  value={data.Duration2}
                  readOnly
                />
                hrs
              </div>
              <div className="RegisForm_1">
                <label>
                  3rd Stage<span>:</span>
                </label>
                <input
                  type="number"
                  id="thirdStageDuration"
                  name="thirdStageDuration"
                  className="de32111"
                  value={data.Duration3}
                  readOnly
                />
                hrs
              </div>
            </div>
            <br />
            <h4
              style={{
                color: "var(--labelcolor)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "start",
                padding: "10px",
              }}
            >
              Details of Delivery
            </h4>
            <div className="Selected-table-container">
              <table className="selected-medicine-table2">
                <thead>
                  <tr>
                    <th>Date & Day</th>
                    <th>Time</th>
                    <th>Sex</th>
                    <th>Wt.</th>
                    <th>APGAR Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        className="wedscr54_secd_8643r"
                        value={data.DeliveryDate}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="wedscr54_secd_8643r"
                        value={data.DeliveryTime}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="wedscr54_secd_8643r"
                        value={data.Gender}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="wedscr54_secd_8643r"
                        value={data.DeliveryWt}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="wedscr54_secd_8643r"
                        value={data.APGARscore}
                        readOnly
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="Selected-table-container">
              <table className="selected-medicine-table2">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Complications</th>
                    <th>Baby's Blood Group</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        className="wedscr54_secd_8643r"
                        value={data.Type}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="wedscr54_secd_8643r"
                        value={data.Complications}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="wedscr54_secd_8643r"
                        value={data.Babybloodgroupname}
                        readOnly
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br />
            <div className="OtMangement_con">
              <div className="OtMangementForm_1">
                <label>
                  Placenta & Membranes<span>:</span>
                </label>
                <div
                  className="OtMangementForm_1_checkbox weewdexewdd"
                >
                  <label htmlFor="ExpelledSpontaneously">
                    <input
                      id="ExpelledSpontaneously"
                      type="checkbox"
                      checked={data.Placenta_Membranes === "ExpelledSpontaneously"}
                      readOnly
                    />
                    <span>Expelled Spontaneously</span>
                  </label>
                  <label htmlFor="ByhandIntroduction">
                    <input
                      id="ByhandIntroduction"
                      type="checkbox"
                      checked={data.Placenta_Membranes === "ByhandIntroduction"}
                      readOnly
                    />
                    <span>By hand Introduction</span>
                  </label>
                  <label htmlFor="ControlledCordTraction">
                    <input
                      id="ControlledCordTraction"
                      type="checkbox"
                      checked={data.Placenta_Membranes === "ControlledCordTraction"}
                      readOnly
                    />
                    <span>Controlled Cord Traction</span>
                  </label>
                </div>
              </div>
            </div>
            <br />
            <div className="Otdoctor_intra_Con">
              <div className="text_adjust_mt_Ot">
                <label htmlFor="ConditionofMembranes">
                  Condition of Membranes <span>:</span>
                </label>
                <textarea
                  name="ConditionofMembranes"
                  value={data.MembranesCondition}
                  readOnly
                ></textarea>
              </div>
              <div className="text_adjust_mt_Ot">
                <label htmlFor="ConditionofPlacenta">
                  Condition of Placenta <span>:</span>
                </label>
                <textarea
                  name="ConditionofPlacenta"
                  value={data.PlacentaCondition}
                  readOnly
                ></textarea>
              </div>
            </div>
            <br />
            <br />
            <div
              className="RegisFormcon"
              style={{ justifyContent: "center", flexDirection: "column" }}
            >
              <div className="text_adjust_mt_Ot">
                <label htmlFor="ConductedBy">
                  Conducted by<span>:</span>
                </label>
                <textarea
                  name="ConductedBy"
                  value={data.Conductedby}
                  readOnly
                ></textarea>
                
              </div>
              <div className="text_adjust_mt_Ot">
                <label htmlFor="AssistedBy">
                  Assisted by<span>:</span>
                </label>
                <textarea
                  name="AssistedBy"
                  value={data.Assistedby}
                  readOnly
                ></textarea>
                
              </div>
              <div className="text_adjust_mt_Ot">
                <label htmlFor="Anaesthesiologist">
                  Anaesthesiologist<span>:</span>
                </label>
                <textarea
                  name="Anaesthesiologist"
                  value={data.Anaesthesiologist}
                  readOnly
                ></textarea>
                
              </div>
              <div className="RegisForm_1">
                <label htmlFor="LabourAnalgesia">
                  Labour Analgesia<span>:</span>
                </label>
                <input
                  type="text"
                  value={data.LabourAnalgesia}
                  readOnly
                />
              </div>
            </div>
            <br />
            <div
              className="RegisFormcon"
              style={{ justifyContent: "center", flexDirection: "column" }}
            >
              <div className="RegisForm_1">
                <label htmlFor="name">
                  PPH<span>:</span>
                </label>
                <div className="radio_Nurse_ot2_head dsewwsdw32 dededxs">
                  <div className="radio_Nurse_ot2 vvbvcxxzas">
                    <label htmlFor="Nil">
                      <input
                        type="checkbox"
                        id="Nil"
                        name="PPH"
                        value="Nil"
                        className="radio_Nurse_ot2_input"
                        checked={data.PPH === "Nil"}
                        readOnly
                      />
                      Nil
                    </label>
                  </div>
                  <div className="radio_Nurse_ot2 vvbvcxxzas">
                    <label htmlFor="Mild">
                      <input
                        type="checkbox"
                        id="Mild"
                        name="PPH"
                        value="Mild"
                        className="radio_Nurse_ot2_input"
                        checked={data.PPH === "Mild"}
                        readOnly
                      />
                      Mild
                    </label>
                  </div>
                  <div className="radio_Nurse_ot2 vvbvcxxzas">
                    <label htmlFor="Moderate">
                      <input
                        type="checkbox"
                        id="Moderate"
                        name="PPH"
                        value="Moderate"
                        className="radio_Nurse_ot2_input"
                        checked={data.PPH === "Moderate"}
                        readOnly
                      />
                      Moderate
                    </label>
                  </div>
                  <div className="radio_Nurse_ot2 vvbvcxxzas">
                    <label htmlFor="Severe">
                      <input
                        type="checkbox"
                        id="Severe"
                        name="PPH"
                        value="Severe"
                        className="radio_Nurse_ot2_input"
                        checked={data.PPH === "Severe"}
                        readOnly
                      />
                      Severe
                    </label>
                  </div>
                </div>
              </div>
              <br />
            </div>
            <div
              className="RegisFormcon"
              style={{ justifyContent: "center", flexDirection: "column" }}
            >
              <div className="RegisForm_1">
                <label htmlFor="Amount">
                  Amount<span>:</span>
                </label>
                <input
                  type="text"
                  value={data.Amount}
                  readOnly
                />
              </div>
              <div className="RegisForm_1">
                <label htmlFor="Laceration">
                  Laceration<span>:</span>
                </label>
                <input
                  type="text"
                  value={data.Laceration}
                  readOnly
                />
              </div>

              <div className="RegisForm_1">
                <label>
                  Episiotomy<span>:</span>
                </label>
                <div className="radio_Nurse_ot2_head">
                  <div className="radio_Nurse_ot2">
                    <label htmlFor="Givenw">
                      <input
                        type="radio"
                        id="Givenw"
                        name="Episiotomy"
                        value="Given"
                        className="radio_Nurse_ot2_input"
                        checked={data.Episiotomy === "Given"}
                        readOnly
                      />
                      Given
                    </label>
                  </div>
                  <div className="radio_Nurse_ot2">
                    <label htmlFor="NotGivenw">
                      <input
                        type="radio"
                        id="NotGivenw"
                        name="Episiotomy"
                        value="NotGiven"
                        className="radio_Nurse_ot2_input"
                        checked={data.Episiotomy === "NotGiven"}
                        readOnly
                      />
                      Not Given
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <br />

            <div
              className="RegisFormcon"
              style={{ justifyContent: "center" }}
            >
              <div className="RegisForm_1 euiwd6745q3">
                <label htmlFor="EpisiotomySutureMaterial">
                  Episiotomy Suture Material<span>:</span>
                </label>

                <textarea
                  value={data.EpisiotomyMaterial}
                  readOnly
                ></textarea>
              </div>

              <div className="RegisForm_1 euiwd6745q3">
                <label htmlFor="ProphylacticOxytocic">
                  Prophylactic Oxytocic<span>:</span>
                </label>

                <textarea
                  value={data.ProphylacticOxytocic}
                  readOnly
                ></textarea>
              </div>
            </div>

            <br />
            <h4
              style={{
                color: "var(--labelcolor)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "start",
                padding: "10px",
              }}
            >
              Material Condition just before Transfer to Ward :
            </h4>
            <br />

            <div className="RegisFormcon">
              <div className="RegisForm_1">
                <label htmlFor="Pulse">
                  Pulse<span>:</span>
                </label>
                <input
                  type="text"
                  value={data.Pulse}
                  readOnly
                />
              </div>
              <div className="RegisForm_1">
                <label htmlFor="BP">
                  BP<span>:</span>
                </label>
                <input
                  type="text"
                  value={data.BP}
                  readOnly
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Uterus<span>:</span>
                </label>
                <div className="radio_Nurse_ot2_head">
                  <div className="radio_Nurse_ot2">
                    <label htmlFor="Contracted">
                      <input
                        type="radio"
                        id="Contracted"
                        name="Uterus"
                        value="Contracted"
                        className="radio_Nurse_ot2_input"
                        checked={data.Uterus === "Contracted"}
                        readOnly
                      />
                      Contracted
                    </label>
                  </div>
                  <div className="radio_Nurse_ot2">
                    <label htmlFor="Flaccid">
                      <input
                        type="radio"
                        id="Flaccid"
                        name="Uterus"
                        value="Flaccid"
                        className="radio_Nurse_ot2_input"
                        checked={data.Uterus === "Flaccid"}
                        readOnly
                      />
                      Flaccid
                    </label>
                  </div>
                </div>
              </div>
              <div className="RegisForm_1">
                <label htmlFor="BleedingPV">
                  Bleeding PV<span>:</span>
                </label>
                <input
                  type="text"
                  value={data.BleedingPV}
                  readOnly
                />
              </div>
            </div>
            <br />
            <br />
            <div className="Otdoctor_intra_Con">
              <div className="text_adjust_mt_Ot">
                <label htmlFor="PostDeliveryOrders">
                  POST DELIVERY ORDERS <span>:</span>
                </label>
                <textarea
                  value={data.PostDeleiveryOrders}
                  readOnly
                ></textarea>
              </div>
            </div>
            <br />
            <div className="Selected-table-container">
              <table className="selected-medicine-table2">
                <thead>
                  <tr>
                    <th>Wt.</th>
                    <th>H.C.</th>
                    <th>Length</th>
                    <th>Anomalies if any</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  <td>
                    <input
                      type="text"
                      className="wedscr54_secd_8643r"
                      value={data.BeforeWT}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="wedscr54_secd_8643r"
                      value={data.BeforeHC}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="wedscr54_secd_8643r"
                      value={data.Length}
                      readOnly
                    />
                  </td>
                  <td>
                    <textarea
                      value={data.Anomalies}
                      className="edjuwydrt56 ee33223"
                      readOnly
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      value={data.Remarks}
                      className="edjuwydrt56 ee33223"
                      readOnly
                    ></textarea>
                  </td>
                </tbody>
              </table>
            </div>

            <br />
            <div className="Otdoctor_intra_Con">
              <div className="text_adjust_mt_Ot">
                <label htmlFor="Paediatricians">
                  PAEDIATRICIAN'S RECORD <span>:</span>
                </label>
                <textarea
                  value={data.PaediatricianRecord}
                  readOnly
                ></textarea>
              </div>
            </div>
            <br />
          </div>
        </div>
      </div>
    );
  });



  const ForPrintLabourDelivery = () => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

    // Helper function to render the main table section
    const renderTableSection = (data, title) => {
      if (!data || data.length === 0) return null;

      return (
        <>
          <tr>
            <td colSpan="9" style={{ border: 'none', padding: '12px 0', fontSize: '14px', fontWeight: 'bold', textAlign: 'left' }}>
              {title}
            </td>
          </tr>
          {data.map((row, index) => (
            <tr key={`delivery-${index}`} style={{ fontSize: '12px', backgroundColor: '#f9f9f9' }}>
              <td style={{ padding: '8px', textAlign: 'center' }}>{index + 1}</td>
              <td style={{ padding: '8px', textAlign: 'center' }}>
                {row.DeliveryDate ? new Date(row.DeliveryDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                }).replace(/\//g, '-') : '-'}
              </td>
              <td style={{ padding: '8px', textAlign: 'center' }}>{row.DeliveryTime || '-'}</td>
              <td style={{ padding: '8px', textAlign: 'center' }}>{row.Gender || '-'}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{row.DeliveryWt || '-'}</td>
              <td style={{ padding: '8px', textAlign: 'center' }}>{row.APGARscore || '-'}</td>
              <td style={{ padding: '8px', textAlign: 'center' }}>{row.Type || '-'}</td>
              <td style={{ padding: '8px', textAlign: 'center' }}>{row.Complications || '-'}</td>
              <td style={{ padding: '8px', textAlign: 'center' }}>{row.Babybloodgroupname || '-'}</td>
            </tr>
          ))}
        </>
      );
    };

    // Use the first row of selectedData for fields that are not part of the table
    const data = selectedData[0] || {};

    return (
      <div ref={componentRef} style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <div className="Register_btn_con added_Register_btn_con">
          <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrint}>
            Print
          </button>
          <button className="RegisterForm_1_btns jwedu6_99" onClick={handleCloseLabourPrint}>
            Close
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {/* Hospital Info */}
              <tr>
                <td colSpan="9" style={{ border: 'none', textAlign: 'center' }}>
                  <div>
                    <h2 style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
                      KARUNA MEDICAL COLLEGE HOSPITAL
                    </h2>
                    <h1 style={{ margin: '0', fontSize: '22px', fontWeight: '600', color: 'black' }}>
                      Vilayodi, Chittur, Palakkad
                    </h1>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>
                      Report Date: {new Date().toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                      }).replace(/\//g, '-')}
                    </p>
                  </div>
                </td>
              </tr>

              {/* Patient Details Section */}
              <tr>
                <td colSpan="9" style={{ border: 'none', padding: '12px 0', fontSize: '14px', fontWeight: 'bold', textAlign: 'left' }}>
                  Patient Details
                </td>
              </tr>
              <tr style={{ fontSize: '12px', backgroundColor: '#f0f0f0' }}>
                <td colSpan="3" style={{ padding: '8px' }}>Patient Name</td>
                <td colSpan="2" style={{ padding: '8px' }}>Patient ID</td>
                <td colSpan="2" style={{ padding: '8px' }}>Register ID</td>
                <td colSpan="2" style={{ padding: '8px' }}>Age</td>
                <td colSpan="2" style={{ padding: '8px' }}>Gender</td>
              </tr>
              <tr style={{ fontSize: '12px' }}>
                <td colSpan="3" style={{ padding: '8px' }}>{workbenchformData.PatientName || '-'}</td>
                <td colSpan="2" style={{ padding: '8px' }}>{workbenchformData.PatientID || '-'}</td>
                <td colSpan="2" style={{ padding: '8px' }}>{workbenchformData.RegisterID || '-'}</td>
                <td colSpan="2" style={{ padding: '8px' }}>{workbenchformData.Age || '-'}</td>
                <td colSpan="2" style={{ padding: '8px' }}>{workbenchformData.Gender || '-'}</td>

              </tr>

              {/* Labour & Delivery Summary Section */}
              <tr>
                <td colSpan="9" style={{ border: 'none', padding: '12px 0', fontSize: '14px', fontWeight: 'bold', textAlign: 'left' }}>
                  Labour & Delivery Summary
                </td>
              </tr>
              <tr style={{ fontSize: '12px', backgroundColor: '#f0f0f0' }}>
                <td colSpan="2" style={{ padding: '8px' }}>Type of Labour</td>
                <td colSpan="2" style={{ padding: '8px' }}>Duration of Labour</td>
              </tr>
              <tr style={{ fontSize: '12px' }}>
                <td colSpan="2" style={{ padding: '8px' }}>{data.Labourtype || '-'}</td>
                <td colSpan="2" style={{ padding: '8px' }}>
                  1st: {data.Duration1 || '-'} hrs, 2nd: {data.Duration2 || '-'} hrs, 3rd: {data.Duration3 || '-'} hrs
                </td>
              </tr>

              {/* Delivery Details Table */}
              <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold', fontSize: '14px' }}>
                <th style={{ border: '1px solid #000', padding: '8px' }}>S.No</th>
                <th style={{ border: '1px solid #000', padding: '8px' }}>Date</th>
                <th style={{ border: '1px solid #000', padding: '8px' }}>Time</th>
                <th style={{ border: '1px solid #000', padding: '8px' }}>Sex</th>
                <th style={{ border: '1px solid #000', padding: '8px' }}>Weight</th>
                <th style={{ border: '1px solid #000', padding: '8px' }}>APGAR Score</th>
                <th style={{ border: '1px solid #000', padding: '8px' }}>Type</th>
                <th style={{ border: '1px solid #000', padding: '8px' }}>Complications</th>
                <th style={{ border: '1px solid #000', padding: '8px' }}>Blood Group</th>
              </tr>
              {renderTableSection(selectedData, 'Delivery Details')}

              {/* Placenta & Membranes Section */}
              <tr>
                <td colSpan="9" style={{ border: 'none', padding: '12px 0', fontSize: '14px', fontWeight: 'bold', textAlign: 'left' }}>
                  Placenta & Membranes
                </td>
              </tr>
              <tr style={{ fontSize: '12px', backgroundColor: '#f0f0f0' }}>
                <td colSpan="3" style={{ padding: '8px' }}>Placenta & Membranes</td>
                <td colSpan="3" style={{ padding: '8px' }}>Condition of Membranes</td>
                <td colSpan="3" style={{ padding: '8px' }}>Condition of Placenta</td>
              </tr>
              <tr style={{ fontSize: '12px' }}>
                <td colSpan="3" style={{ padding: '8px' }}>{data.Placenta_Membranes || '-'}</td>
                <td colSpan="3" style={{ padding: '8px' }}>{data.MembranesCondition || '-'}</td>
                <td colSpan="3" style={{ padding: '8px' }}>{data.PlacentaCondition || '-'}</td>
              </tr>

              {/* Medical Personnel Section */}
              <tr>
                <td colSpan="9" style={{ border: 'none', padding: '12px 0', fontSize: '14px', fontWeight: 'bold', textAlign: 'left' }}>
                  Medical Personnel
                </td>
              </tr>
              <tr style={{ fontSize: '12px', backgroundColor: '#f0f0f0' }}>
                <td colSpan="3" style={{ padding: '8px' }}>Conducted By</td>
                <td colSpan="3" style={{ padding: '8px' }}>Assisted By</td>
                <td colSpan="3" style={{ padding: '8px' }}>Anaesthesiologist</td>
              </tr>
              <tr style={{ fontSize: '12px' }}>
                <td colSpan="3" style={{ padding: '8px' }}>{data.Conductedby || '-'}</td>
                <td colSpan="3" style={{ padding: '8px' }}>{data.Assistedby || '-'}</td>
                <td colSpan="3" style={{ padding: '8px' }}>{data.Anaesthesiologist || '-'}</td>
              </tr>

              {/* Additional Details Section */}
              <tr>
                <td colSpan="9" style={{ border: 'none', padding: '12px 0', fontSize: '14px', fontWeight: 'bold', textAlign: 'left' }}>
                  Additional Details
                </td>
              </tr>
              <tr style={{ fontSize: '12px', backgroundColor: '#f0f0f0' }}>
                <td colSpan="2" style={{ padding: '8px' }}>Labour Analgesia</td>
                <td colSpan="2" style={{ padding: '8px' }}>PPH</td>
                <td colSpan="2" style={{ padding: '8px' }}>Amount</td>
                <td colSpan="3" style={{ padding: '8px' }}>Laceration</td>
              </tr>
              <tr style={{ fontSize: '12px' }}>
                <td colSpan="2" style={{ padding: '8px' }}>{data.LabourAnalgesia || '-'}</td>
                <td colSpan="2" style={{ padding: '8px' }}>{data.PPinfrastrutture || '-'}</td>
                <td colSpan="2" style={{ padding: '8px' }}>{data.Amount || '-'}</td>
                <td colSpan="3" style={{ padding: '8px' }}>{data.Laceration || '-'}</td>
              </tr>

              {/* Episiotomy Section */}
              <tr>
                <td colSpan="9" style={{ border: 'none', padding: '12px 0', fontSize: '14px', fontWeight: 'bold', textAlign: 'left' }}>
                  Episiotomy Details
                </td>
              </tr>
              <tr style={{ fontSize: '12px', backgroundColor: '#f0f0f0' }}>
                <td colSpan="3" style={{ padding: '8px' }}>Episiotomy</td>
                <td colSpan="6" style={{ padding: '8px' }}>Episiotomy Suture Material</td>
              </tr>
              <tr style={{ fontSize: '12px' }}>
                <td colSpan="3" style={{ padding: '8px' }}>{data.Episiotomy || '-'}</td>
                <td colSpan="6" style={{ padding: '8px' }}>{data.EpisiotomyMaterial || '-'}</td>
              </tr>

              {/* Maternal Condition Section */}
              <tr>
                <td colSpan="9" style={{ border: 'none', padding: '12px 0', fontSize: '14px', fontWeight: 'bold', textAlign: 'left' }}>
                  Maternal Condition Before Transfer
                </td>
              </tr>
              <tr style={{ fontSize: '12px', backgroundColor: '#f0f0f0' }}>
                <td colSpan="3" style={{ padding: '8px' }}>Pulse</td>
                <td colSpan="3" style={{ padding: '8px' }}>BP</td>
                <td colSpan="3" style={{ padding: '8px' }}>Uterus</td>
              </tr>
              <tr style={{ fontSize: '12px' }}>
                <td colSpan="3" style={{ padding: '8px' }}>{data.Pulse || '-'}</td>
                <td colSpan="3" style={{ padding: '8px' }}>{data.BP || '-'}</td>
                <td colSpan="3" style={{ padding: '8px' }}>{data.Uterus || '-'}</td>
              </tr>

              {/* Baby Measurements Section */}
              <tr>
                <td colSpan="9" style={{ border: 'none', padding: '12px 0', fontSize: '14px', fontWeight: 'bold', textAlign: 'left' }}>
                  Baby Measurements
                </td>
              </tr>
              <tr style={{ fontSize: '12px', backgroundColor: '#f0f0f0' }}>
                <td colSpan="2" style={{ padding: '8px' }}>Weight</td>
                <td colSpan="2" style={{ padding: '8px' }}>Head Circumference</td>
                <td colSpan="2" style={{ padding: '8px' }}>Length</td>
                <td colSpan="3" style={{ padding: '8px' }}>Anomalies</td>
              </tr>
              <tr style={{ fontSize: '12px' }}>
                <td colSpan="2" style={{ padding: '8px' }}>{data.BeforeWT || '-'}</td>
                <td colSpan="2" style={{ padding: '8px' }}>{data.BeforeHC || '-'}</td>
                <td colSpan="2" style={{ padding: '8px' }}>{data.Length || '-'}</td>
                <td colSpan="3" style={{ padding: '8px' }}>{data.Anomalies || '-'}</td>
              </tr>

              {/* Additional Notes Section */}
              <tr>
                <td colSpan="9" style={{ border: 'none', padding: '12px 0', fontSize: '14px', fontWeight: 'bold', textAlign: 'left' }}>
                  Additional Notes
                </td>
              </tr>
              <tr style={{ fontSize: '12px', backgroundColor: '#f0f0f0' }}>
                <td colSpan="3" style={{ padding: '8px' }}>Prophylactic Oxytocic</td>
                <td colSpan="3" style={{ padding: '8px' }}>Post Delivery Orders</td>
                <td colSpan="3" style={{ padding: '8px' }}>Paediatrician's Record</td>
              </tr>
              <tr style={{ fontSize: '12px' }}>
                <td colSpan="3" style={{ padding: '8px' }}>{data.ProphylacticOxytocic || '-'}</td>
                <td colSpan="3" style={{ padding: '8px' }}>{data.PostDeleiveryOrders || '-'}</td>
                <td colSpan="3" style={{ padding: '8px' }}>{data.PaediatricianRecord || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const handleCloseLabourPrint = () => {
    setIsPrintButtonVisible(true);
  };


  return (
    <>
      {isPrintButtonVisible ? (
        <div className="appointment">
          <h4
            style={{
              color: "var(--labelcolor)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "start",
              padding: "10px",
            }}
          >
            Labour & Delivery Record
          </h4>
          <br />
          <div className="OtMangement_con">
            <div className="OtMangementForm_1">
              <label>
                Type of Labour<span>:</span>
              </label>
              <div
                className="OtMangementForm_1_checkbox weewdexewdd"
             
              >
                <label htmlFor="Spontaneous">
                  <input
                    id="Spontaneous"
                    value="Spontaneous"
                    type="checkbox"
                    checked={checkboxState.Spontaneous}
                    onChange={handleCheckboxChange}
                  />
                  Spontaneous
                </label>
                <label htmlFor="InducedbyStripping">
                  <input
                    id="InducedbyStripping"
                    value="InducedbyStripping"
                    type="checkbox"
                    checked={checkboxState.InducedbyStripping}
                    onChange={handleCheckboxChange}
                  />
               Induced by Stripping
                </label>
                <label htmlFor="ARM">
                  <input
                    id="ARM"
                    value="ARM"
                    type="checkbox"
                    checked={checkboxState.ARM}
                    onChange={handleCheckboxChange}
                  />
                 ARM
                </label>
                <label htmlFor="Oxytonic">
                  <input
                    id="Oxytonic"
                    value="Oxytonic"
                    type="checkbox"
                    checked={checkboxState.Oxytonic}
                    onChange={handleCheckboxChange}
                  />
                 Oxytonic
                </label>
                <label htmlFor="Combined">
                  <input
                    id="Combined"
                    value="Combined"
                    type="checkbox"
                    checked={checkboxState.Combined}
                    onChange={handleCheckboxChange}
                  />
                  Combined
                </label>
              </div>
            </div>
          </div>
          <br />
          <div className="RegisFormcon" style={{ justifyContent: "center" }}>
            <h4 style={{ width: "180px", display: "flex", gap: "5px" }}>
              Duration of Labours<span>:</span>
            </h4>
            
            <div className="RegisForm_1">
              <label>
                1st Stage<span>:</span>
              </label>
              <input
                type="number"
                id="firstStageDuration"
                name="firstStageDuration"
                className="de32111"
                value={formDataLabour.firstStageDuration}
                onChange={handleChange}
              />
              hrs
            </div>
            <div className="RegisForm_1">
              <label>
                2nd Stage<span>:</span>
              </label>
              <input
                type="number"
                id="secondStageDuration"
                name="secondStageDuration"
                className="de32111"
                value={formDataLabour.secondStageDuration}
                onChange={handleChange}
              />
              hrs
            </div>
            <div className="RegisForm_1">
              <label>
                3rd Stage<span>:</span>
              </label>
              <input
                type="number"
                id="thirdStageDuration"
                name="thirdStageDuration"
                className="de32111"
                value={formDataLabour.thirdStageDuration}
                onChange={handleChange}
              />
              hrs
            </div>
          </div>
          <br />
          <h4
            style={{
              color: "var(--labelcolor)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "start",
              padding: "10px",
            }}
          >
            Details of Delivery
          </h4>
          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Sex</th>
                  <th>Wt.</th>
                  <th>APGAR Score</th>
                  <th>Type</th>
                  <th>Complications</th>
                  <th>Baby's Blood Group</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="date"
                      className="wedscr54_secd_8643r"
                      id="dateAndDay"
                      value={formDataLabour.dateAndDay}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      className="wedscr54_secd_8643r"
                      id="deliveryTime"
                      value={formDataLabour.deliveryTime}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="wedscr54_secd_8643r"
                      id="babySex"
                      value={formDataLabour.babySex}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="wedscr54_secd_8643r"
                      id="babyWeight"
                      value={formDataLabour.babyWeight}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="wedscr54_secd_8643r"
                      id="apgarScore"
                      value={formDataLabour.apgarScore}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="wedscr54_secd_8643r"
                      id="deliveryType"
                      value={formDataLabour.deliveryType}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="wedscr54_secd_8643r"
                      id="complications"
                      value={formDataLabour.complications}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="wedscr54_secd_8643r"
                      id="babyBloodGroup"
                      value={formDataLabour.babyBloodGroupname}
                      onChange={handleChange}
                      list = 'bloodgrouplist'
                    />
                   <datalist id="bloodgrouplist">
                      {Array.isArray(blooddata) &&
                          blooddata.map((f, i) => (
                              <option key={i} value={`${f.id} | ${f.BloodGroup}`}></option>
                          ))}
                  </datalist>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <div className="OtMangement_con">
            <div className="OtMangementForm_1">
              <label>
                Placenta & Membranes<span>:</span>
              </label>
              <div
                className="OtMangementForm_1_checkbox weewdexewdd"
            
              >
                <label htmlFor="ExpelledSpontaneously">
                  <input
                    id="ExpelledSpontaneously"
                    type="checkbox"
                    checked={checkboxState2.ExpelledSpontaneously}
                    onChange={handleCheckboxChange2}
                  />
                  Expelled Spontaneously
                </label>
                <label htmlFor="ByhandIntroduction">
                  <input
                    id="ByhandIntroduction"
                    type="checkbox"
                    checked={checkboxState2.ByhandIntroduction}
                    onChange={handleCheckboxChange2}
                  />
                 By hand Introduction
                </label>
                <label htmlFor="ControlledCordTraction">
                  <input
                    id="ControlledCordTraction"
                    type="checkbox"
                    checked={checkboxState2.ControlledCordTraction}
                    onChange={handleCheckboxChange2}
                  />
                 Controlled Cord Traction
                </label>
              </div>
            </div>
          </div>
          <br />
          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot">
              <label htmlFor="ConditionofMembranes">
                Condition of Membranes <span>:</span>
              </label>
              <textarea
                name="ConditionofMembranes"
                value={formDataLabour.ConditionofMembranes}
                onChange={handleChange}
                id="ConditionofMembranes"
              ></textarea>
            </div>
            <div className="text_adjust_mt_Ot">
              <label htmlFor="ConditionofPlacenta">
                Condition of Placenta <span>:</span>
              </label>
              <textarea
                id="ConditionofPlacenta"
                name="ConditionofPlacenta"
                value={formDataLabour.ConditionofPlacenta}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <br />
          <div
            style={{
              // display: "flex",
              // flexWrap: "wrap",
              // justifyContent: "center",... // rowGap: "10px",
            }}
          >
            <div
              className="RegisFormcon"
              style={{ justifyContent: "center", flexDirection: "column" }}
            >
               <div className="text_adjust_mt_Ot">
                <label htmlFor="ConductedBy">
                  Conducted by<span>:</span>
                </label>
                <textarea
                  name="ConductedBy"
                  value={formDataLabour.ConductedBy}
                  readOnly
                ></textarea>
                
              </div>
              <div className="text_adjust_mt_Ot">
                <label htmlFor="AssistedBy">
                  Assisted by<span>:</span>
                </label>
                <textarea
                  name="AssistedBy"
                  value={formDataLabour.AssistedBy}
                  readOnly
                ></textarea>
                
              </div>
              <div className="text_adjust_mt_Ot">
                <label htmlFor="Anaesthesiologist">
                  Anaesthesiologist<span>:</span>
                </label>
                <textarea
                  name="Anaesthesiologist"
                  value={formDataLabour.Anaesthesiologist}
                  readOnly
                ></textarea>
                
              </div>
              <div className="RegisForm_1">
                <label htmlFor="LabourAnalgesia">
                  Labour Analgesia<span>:</span>
                </label>
                <input
                  type="text"
                  id="LabourAnalgesia"
                  name="LabourAnalgesia"
                  value={formDataLabour.LabourAnalgesia}
                  onChange={handleChange}
                />
              </div>
            </div>
            <br />

            <div
              className="RegisFormcon"
              style={{ justifyContent: "center", flexDirection: "column" }}
            >
              <div className="RegisForm_1">
                <label htmlFor="name">
                  PPH<span>:</span>
                </label>
                <div className="radio_Nurse_ot2_head dsewwsdw32 dededxs">
                  <div className="radio_Nurse_ot2 vvbvcxxzas">
                    <label htmlFor="Nil">
                      <input
                        type="checkbox"
                        id="Nil"
                        name="PPH"
                        value="Nil"
                        className="radio_Nurse_ot2_input"
                        checked={formDataLabour.PPH.Nil}
                        onChange={handleChange}
                      />
                      Nil
                    </label>
                  </div>
                  <div className="radio_Nurse_ot2 vvbvcxxzas">
                    <label htmlFor="Mild">
                      <input
                        type="checkbox"
                        id="Mild"
                        name="PPH"
                        value="Mild"
                        className="radio_Nurse_ot2_input"
                        checked={formDataLabour.PPH.Mild}
                        onChange={handleChange}
                      />
                      Mild
                    </label>
                  </div>
                  <div className="radio_Nurse_ot2 vvbvcxxzas">
                    <label htmlFor="Moderate">
                      <input
                        type="checkbox"
                        id="Moderate"
                        name="PPH"
                        value="Moderate"
                        className="radio_Nurse_ot2_input"
                        checked={formDataLabour.PPH.Moderate}
                        onChange={handleChange}
                      />
                      Moderate
                    </label>
                  </div>
                  <div className="radio_Nurse_ot2 vvbvcxxzas">
                    <label htmlFor="Severe">
                      <input
                        type="checkbox"
                        id="Severe"
                        name="PPH"
                        value="Severe"
                        className="radio_Nurse_ot2_input"
                        checked={formDataLabour.PPH.Severe}
                        onChange={handleChange}
                      />
                      Severe
                    </label>
                  </div>
                </div>
              </div>
              <br />
            </div>
            <div
              className="RegisFormcon"
              style={{ justifyContent: "center", flexDirection: "column" }}
            >
              <div className="RegisForm_1">
                <label htmlFor="Amount">
                  Amount<span>:</span>
                </label>
                <input
                  type="text"
                  id="Amount"
                  name="Amount"
                  value={formDataLabour.Amount}
                  onChange={handleChange}
                />
              </div>
              <div className="RegisForm_1">
                <label htmlFor="Laceration">
                  Laceration<span>:</span>
                </label>
                <input
                  type="text"
                  id="Laceration"
                  name="Laceration"
                  value={formDataLabour.Laceration}
                  onChange={handleChange}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Episiotomy<span>:</span>
                </label>
                <div className="radio_Nurse_ot2_head">
                  <div className="radio_Nurse_ot2">
                    <label htmlFor="Givenw">
                      <input
                        type="radio"
                        id="Givenw"
                        name="Episiotomy"
                        value="Given"
                        className="radio_Nurse_ot2_input"
                        checked={radioState.Episiotomy === "Given"}
                        onChange={handleChange}
                      />
                      Given
                    </label>
                  </div>
                  <div className="radio_Nurse_ot2">
                    <label htmlFor="NotGivenw">
                      <input
                        type="radio"
                        id="NotGivenw"
                        name="Episiotomy"
                        value="NotGiven"
                        className="radio_Nurse_ot2_input"
                        checked={radioState.Episiotomy === "NotGiven"}
                        onChange={handleChange}
                      />
                      Not Given
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />

          <div className="RegisFormcon" style={{ justifyContent: "center" }}>
            <div className="RegisForm_1 euiwd6745q3">
              <label htmlFor="EpisiotomySutureMaterial">
                Episiotomy Suture Material<span>:</span>
              </label>

              <textarea
                id="EpisiotomySutureMaterial"
                name="EpisiotomySutureMaterial"
                value={formDataLabour.EpisiotomySutureMaterial}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="RegisForm_1 euiwd6745q3">
              <label htmlFor="ProphylacticOxytocic">
                Prophylactic Oxytocic<span>:</span>
              </label>

              <textarea
                id="ProphylacticOxytocic"
                name="ProphylacticOxytocic"
                value={formDataLabour.ProphylacticOxytocic}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <br />
          <h4
            style={{
              color: "var(--labelcolor)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "start",
              padding: "10px",
            }}
          >
            Material Condition just before Transfer to Ward :
          </h4>
          <br />

          <div className="RegisFormcon">
            <div className="RegisForm_1">
              <label htmlFor="Pulse">
                Pulse<span>:</span>
              </label>
              <input
                type="text"
                id="Pulse"
                name="Pulse"
                value={formDataLabour.Pulse}
                onChange={handleChange}
              />
            </div>
            <div className="RegisForm_1">
              <label htmlFor="BP">
                BP<span>:</span>
              </label>
              <input
                type="text"
                id="BP"
                name="BP"
                value={formDataLabour.BP}
                onChange={handleChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Uterus<span>:</span>
              </label>
              <div className="radio_Nurse_ot2_head">
                <div className="radio_Nurse_ot2">
                  <label htmlFor="Contracted">
                    <input
                      type="radio"
                      id="Contracted"
                      name="Uterus"
                      value="Contracted"
                      className="radio_Nurse_ot2_input"
                      checked={radioState.Uterus === "Contracted"}
                      onChange={handleChange}
                    />
                    Contracted
                  </label>
                </div>
                <div className="radio_Nurse_ot2">
                  <label htmlFor="Flaccid">
                    <input
                      type="radio"
                      id="Flaccid"
                      name="Uterus"
                      value="Flaccid"
                      className="radio_Nurse_ot2_input"
                      checked={radioState.Uterus === "Flaccid"}
                      onChange={handleChange}
                    />
                    Flaccid
                  </label>
                </div>
              </div>
            </div>
            <div className="RegisForm_1">
              <label htmlFor="BleedingPV">
                Bleeding PV<span>:</span>
              </label>
              <input
                type="text"
                id="BleedingPV"
                name="BleedingPV"
                value={formDataLabour.BleedingPV}
                onChange={handleChange}
              />
            </div>
          </div>
          <br />
          <br />
          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot">
              <label htmlFor="PostDeliveryOrders">
                POST DELIVERY ORDERS <span>:</span>
              </label>
              <textarea
                id="PostDeliveryOrders"
                name="PostDeliveryOrders"
                value={formDataLabour.PostDeliveryOrders}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <br />

          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th>Wt.</th>
                  <th>H.C.</th>
                  <th>Length</th>
                  <th>Anomalies if any</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                <td>
                  <input
                    type="text"
                    className="wedscr54_secd_8643r"
                    id="Wt"
                    value={formDataLabour.Wt}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="wedscr54_secd_8643r"
                    id="HC"
                    value={formDataLabour.HC}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="wedscr54_secd_8643r"
                    id="Length"
                    value={formDataLabour.Length}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <textarea
                    id="AnomaliesAny"
                    name="AnomaliesAny"
                    value={formDataLabour.AnomaliesAny}
                    onChange={handleChange}
                    className="edjuwydrt56 ee33223"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    id="Remarks"
                    name="Remarks"
                    value={formDataLabour.Remarks}
                    onChange={handleChange}
                    className="edjuwydrt56 ee33223"
                  ></textarea>
                </td>
              </tbody>
            </table>
          </div>

          <br />
          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot">
              <label htmlFor="Paediatricians">
                PAEDIATRICIAN'S RECORD <span>:</span>
              </label>
              <textarea
                id="Paediatricians"
                name="Paediatricians"
                value={formDataLabour.Paediatricians}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <br />

          <br />
          {isPrintButtonVisible && (
            <div className="Register_btn_con">
              <button className="RegisterForm_1_btns" onClick={Submitalldata}>
                Save
              </button>
            </div>
          )}

        <ReactGrid columns={NotesColumn} RowData={DeliveryNotes} />
          <br />
        </div>
      ) : (
        <ForPrintLabourDelivery />
      )}
    </>
  );
}

export default OtLabour;
