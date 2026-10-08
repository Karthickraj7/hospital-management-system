import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
// import jsPDF from "jspdf";
import bgImg2 from "../../Assets/bgImg2.jpg";
import { useDispatch, useSelector } from "react-redux";
// import "../../RegistrationForm/Registration.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const PrintContent = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} id="reactprintcontent">
      {props.children}
    </div>
  );
});

function OtDoctorIntra() {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const OTPatientdata = useSelector((state) => state.Frontoffice?.OTPatientdata);

  const dispatchvalue = useDispatch();

  const [formDataTextArea, setFormDataTextArea] = useState({
    procedure: "",
    complications: "",
    bloodLoss: "",
    replaced: "",
    closure: "",
    recovery: "",
    specimen: "",
    microbiology: "",

    patientToICU: "",
  });

  const [procedure,setprocedure] = useState(false);
  const [complications,setcomplications] = useState(false);
  const [bloodLoss,setbloodLoss] = useState(false)
  const [replaced,setreplaced] = useState(false);
  const [closure,setclosure] = useState(false);
  const [recovery,setrecovery] = useState(false);
  const [specimencheck,setspecimencheck] = useState(false);
  const [microbiology,setmicrobiology] = useState(false);
  const [patientToICU,setpatientToICU] = useState(false);

  const [specimen, setSpecimen] = useState("");
  const [selectedCheckbox, setSelectedCheckbox] = useState("");

   const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const [load,setload] = useState(false);

    const handleCheckboxChangefortextarea = (e) => {

      const { name, value,checked } = e.target;

      console.log(name,checked);



      if(name === 'procedure'){
        setprocedure(!procedure);
      }

      else if(name === 'complications'){
        setcomplications(!complications);
      }
    
      else if(name === 'bloodLoss'){
        setbloodLoss(!bloodLoss);
      }

      else if(name === 'replaced'){
        setreplaced(!replaced);
      }

      else if(name === 'closure'){
        setclosure(!closure);
      }

      else if(name === 'recovery'){
        setrecovery(!recovery);
      }

      else if(name === 'specimencheck'){
        setspecimencheck(!specimencheck);
      }

      else if(name === 'microbiology'){
        setmicrobiology(!microbiology);
      }

      // else if(name === 'patientToICU'){
      //   setpatientToICU()
      // }

      

    };

  const [drainsData, setDrainsData] = useState([
    { type: "", size: "", site: "" },
  ]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormDataTextArea({
      ...formDataTextArea,
      [name]: value,
    });
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleSpecimenChange = (event) => {
    setSpecimen(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setSelectedCheckbox(event.target.value);
  };

  const handleInputChangeTable = (event, index, field) => {
    const newDrainsData = [...drainsData];
    newDrainsData[index][field] = event.target.value;
    setDrainsData(newDrainsData);
  };

  const addRow = () => {
    setDrainsData([...drainsData, { type: "", size: "", site: "" }]);
  };

  const deleteRow = (index) => {
    const newDrainsData = [...drainsData];
    newDrainsData.splice(index, 1);
    setDrainsData(newDrainsData);
  };



  const [workbenchformData, setFormData] = useState({
    SerialNo: "",
    PatientID: "",
    AppointmentID: "",
    visitNo: "",
    firstName: "",
    lastName: "",
    AppointmentDate: "",
    Complaint: "",
    PatientPhoto: "",
    DoctorName: "",
    Age: "",
    Gender: "",
    Location: "",
  });

  console.log(workbenchformData);
  dispatchvalue({
    type: "workbenchformData",
    value: workbenchformData,
  });

  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
  const [isPrintButtonVisiblepost, setisPrintButtonVisiblepost] = useState(true);
  // Rest of your state and logic...

  const componentRef = useRef();

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: async () => {
      // Additional action after printing, if needed
    },
  });

  const Submitalldata = () => {


    const data = {
      Patientid :  OTPatientdata.patientId,
      RegistrationId : OTPatientdata?.RegistrationId,
      created_by : userRecord?.username || '',
      DoctorId :  userRecord?.Doctor || '',
      Procedure : formDataTextArea.procedure,
      Procedurecheck : procedure,
      Intraoperativecomplications :formDataTextArea.complications,
      Intraoperativecomplicationscheck : complications,
      Bloodloss : formDataTextArea.bloodLoss,
      Bloodlosscheck : bloodLoss,
      Replaced : formDataTextArea.replaced,
      Replacedcheck : replaced,
      Closure : formDataTextArea.closure,
      Closurecheck : closure,
      Extubation : formDataTextArea.recovery,
      Extubationcheck : recovery,
      SpecimenHistopathology : formDataTextArea.specimen,
      SpecimenHistopathologycheck : specimencheck,
      Microbiology : formDataTextArea.microbiology,
      Microbiologycheck : microbiology,
      Specimen : specimen,
      Surgicalprocedures :selectedCheckbox,
      Date : date,
      Time : time,
      Patientcondition :formDataTextArea.patientToICU,
      BookingType : OTPatientdata?.BookingType,
      drainsData : drainsData
    };

    console.log(data,'data');

    axios.post(`${UrlLink}OT/Intra_Post_Operative_Notes_OT_Details`, data)
  .then((res) => {

                const response = res.data;
                const messageType = Object.keys(response)[0];
                const messageContent = Object.values(response)[0];
                dispatchvalue({
                    type: 'toast',
                    value: { message: messageContent, type: messageType },
                });  
                setload((prev)=>!prev);
  })
  .catch((err) => console.log(err));

    setIsPrintButtonVisible(false);
    setTimeout(() => {
      handlePrint2();
      setIsPrintButtonVisible(true); // Resetting print button visibility
    }, 500); // Adjust delay as needed
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

  return (
    <>
      {isPrintButtonVisible ? (
        <div className="appointment">
          <br />
          <div className="Otdoctor_intra_Con">
            <div className="Otdoctor_intra_Con_2">
              <label>
                Procedure <span>:</span>
              </label>
              <input
                type="checkbox"
                id="procedure"
                name="procedure"
                onChange={handleCheckboxChangefortextarea}
              />
             {procedure && (
                <textarea
                  name="procedure"
                  value={formDataTextArea.procedure}
                  onChange={handleInputChange}
                ></textarea>
              )}
            </div>
          </div>
          <br />
          <br />
          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot">
              <label>
                Intra-Operative Complications <span>:</span>
              </label>
              <input
                type="checkbox"
                id="complications"
                name="complications"
                onChange={handleCheckboxChangefortextarea}
              />
               {complications && (
              <textarea
                name="complications"
                value={formDataTextArea.complications}
                onChange={handleInputChange}
              ></textarea>)}
            </div>
            <div className="text_adjust_mt_Ot">
              <label>
                Blood Loss <span>:</span>
              </label>
              <input
                type="checkbox"
                id="bloodLoss"
                name="bloodLoss"
                onChange={handleCheckboxChangefortextarea}
              />
               {bloodLoss && (
              <textarea
                name="bloodLoss"
                value={formDataTextArea.bloodLoss}
                onChange={handleInputChange}
              ></textarea>)}
            </div>
            <div className="text_adjust_mt_Ot">
              <label>
                Replaced<span>:</span>
              </label>
              <input
                type="checkbox"
                id="replaced"
                name="replaced"
                onChange={handleCheckboxChangefortextarea}
              />
               {replaced && (
              <textarea
                name="replaced"
                value={formDataTextArea.replaced}
                onChange={handleInputChange}
              ></textarea>)}
            </div>
            <div className="text_adjust_mt_Ot">
              <label>
                Closure<span>:</span>
              </label>
              <input
                type="checkbox"
                id="closure"
                name="closure"
                onChange={handleCheckboxChangefortextarea}
              />
               {closure && (
              <textarea
                name="closure"
                value={formDataTextArea.closure}
                onChange={handleInputChange}
              ></textarea>)}
            </div>
            <div className="text_adjust_mt_Ot">
              <label>
                Recovery - Extubated / Shifted without Extubation<span>:</span>
              </label>
              <input
                type="checkbox"
                id="recovery"
                name="recovery"
                onChange={handleCheckboxChangefortextarea}
              />
               {recovery && (
              <textarea
                name="recovery"
                value={formDataTextArea.recovery}
                onChange={handleInputChange}
              ></textarea>)}
            </div>
            <div className="text_adjust_mt_Ot">
              <label>
                Specimen to be sent to Histopathology<span>:</span>
              </label>
              <input
                type="checkbox"
                id="specimencheck"
                name="specimencheck"
                onChange={handleCheckboxChangefortextarea}
              />
               {specimencheck && (
              <textarea
                name="specimen"
                value={formDataTextArea.specimen}
                onChange={handleInputChange}
              ></textarea>)}
            </div>
            <div className="text_adjust_mt_Ot">
              <label>
                Microbiology<span>:</span>
              </label>
              <input
                type="checkbox"
                id="microbiology"
                name="microbiology"
                onChange={handleCheckboxChangefortextarea}
              />
               {microbiology && (
              <textarea
                name="microbiology"
                value={formDataTextArea.microbiology}
                onChange={handleInputChange}
              ></textarea>)}
            </div>
          </div>

          <br />
          <br />
          <div className="Otdoctor_intra_Con">
            <div className="Otdoctor_intra_Con_udy6d">
              <div className="Otdoctor_intra_Con_2_input">
                <label>
                  Specimen <span>:</span>
                </label>
                <input
                  type="text"
                  value={specimen}
                  onChange={handleSpecimenChange}
                />
              </div>

              <div className="OtMangementForm_1_checkbox_Intraaaaa">
                <label>
                  <input
                    type="checkbox"
                    value="Pathology"
                    checked={selectedCheckbox === "Pathology"}
                    onChange={handleCheckboxChange}
                  />
                  <span>Pathology</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Permanent"
                    checked={selectedCheckbox === "Permanent"}
                    onChange={handleCheckboxChange}
                  />
                  <span>Permanent</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="FrozenSection"
                    checked={selectedCheckbox === "FrozenSection"}
                    onChange={handleCheckboxChange}
                  />
                  <span>Frozen Section</span>
                </label>
              </div>
            </div>
          </div>
          <br />
          <br />

          <div className="Otdoctor_intra_Con">
            <div className="text_adjust_mt_Ot">
              <label style={{ width: "250px" }}>
                Drains / Catheters / Implants / Packing
              </label>
            </div>
            <div className="Selected-table-container">
              <table className="selected-medicine-table2">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Site</th>
                    <th>
                      <button className="cell_btn12" onClick={addRow}>
                        <AddIcon />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {drainsData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          className="input_table_tye_site"
                          value={item.type}
                          onChange={(event) =>
                            handleInputChangeTable(event, index, "type")
                          }
                          list='drainsDatalist'
                          />
                            <datalist id="drainsDatalist">
                              <option value="Drains" />
                              <option value="Catheters" />
                              <option value="Implants" />
                              <option value="Packing" />
                            </datalist>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input_table_tye_site"
                          value={item.size}
                          onChange={(event) =>
                            handleInputChangeTable(event, index, "size")
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input_table_tye_site"
                          value={item.site}
                          onChange={(event) =>
                            handleInputChangeTable(event, index, "site")
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="cell_btn12"
                          onClick={() => deleteRow(index)}
                        >
                          <RemoveIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <br />
          <br />

          <div className="Otdoctor_intra_Con">
                <div className="Otdoctor_intra_Con_2_input">
                  <label>
                    Date & Time <span>:</span>
                  </label>
                  <input
                    className="date_stle_OT"
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                  />

                  <input
                    className="date_stle_OT"
                    type="time"
                    value={time}
                    onChange={handleTimeChange}
                  />
                </div>
                <br />
                <div className="Otdoctor_intra_Con_2 with_increse_85">
                  <label>
                    Patient Condition at transfer to ICU <span>:</span>
                  </label>
                  <textarea
                    name="patientToICU"
                    value={formDataTextArea.patientToICU}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
          </div>
          <br />
          {isPrintButtonVisible && (
            <div className="Register_btn_con">
              <button className="RegisterForm_1_btns" onClick={Submitalldata}>
                Print
              </button>
            </div>
          )}
          <br />
        </div>
      ) : (
        <PrintContent
          ref={componentRef}
          style={{
            marginTop: "50px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className="Print_ot_all_div" id="reactprintcontent">
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
                  Doctor
                </h4>
              </div>

              <div className="dctr_info_up_head Print_ot_all_div_second">
                <div className="RegisFormcon ">
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
                </div>

                <div className="RegisFormcon">
                  <div className="RegisForm_1 ">
                    <label htmlFor="FirstName">
                      Patient Name <span>:</span>{" "}
                    </label>

                    <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                      {workbenchformData.firstName +
                        " " +
                        workbenchformData.lastName}{" "}
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
                  <div className="RegisForm_1 ">
                    <label htmlFor="FirstName">
                      Location <span>:</span>{" "}
                    </label>

                    <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                      {workbenchformData.Location}{" "}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="appointment">
              <br />
              <div className="Print_ot_all_div_pre ">
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
                  Doctor Intra - Operative Checklist
                </h4>
                <br />
            
                <div className="Otdoctor_intra_Con">
                  <div className="Otdoctor_intra_Con_2">
                    <label>
                      Procedure <span>:</span>
                    </label>
                    <textarea
                      name="procedure"
                      value={formDataTextArea.procedure}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
              </div>
              <br />
              <br />
           
              <div className="Otdoctor_intra_Con">
                <div className="text_adjust_mt_Ot">
                  <label>
                    Intra-Operative Complications <span>:</span>
                  </label>
                  <textarea
                    name="complications"
                    value={formDataTextArea.complications}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
        
                <div className="text_adjust_mt_Ot">
                  <label>
                    Blood Loss <span>:</span>
                  </label>
                  <textarea
                    name="bloodLoss"
                    value={formDataTextArea.bloodLoss}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="text_adjust_mt_Ot">
                  <label>
                    Replaced<span>:</span>
                  </label>
                  <textarea
                    name="replaced"
                    value={formDataTextArea.replaced}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                 
      
                <div className="text_adjust_mt_Ot">
                  <label>
                    Closure<span>:</span>
                  </label>
                  <textarea
                    name="closure"
                    value={formDataTextArea.closure}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
        
                <div className="text_adjust_mt_Ot">
                  <label>
                    Recovery - Extubated / Shifted without Extubation
                    <span>:</span>
                  </label>
                  <textarea
                    name="recovery"
                    value={formDataTextArea.recovery}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="text_adjust_mt_Ot">
                  <label>
                    Specimen to be sent to Histopathology<span>:</span>
                  </label>
                  <textarea
                    name="specimen"
                    value={formDataTextArea.specimen}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="text_adjust_mt_Ot">
                  <label>
                    Microbiology<span>:</span>
                  </label>
                  <textarea
                    name="microbiology"
                    value={formDataTextArea.microbiology}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>

              <br />
              <br />
              <div className="Otdoctor_intra_Con">
                <div className="Otdoctor_intra_Con_udy6d">
                  <div className="Otdoctor_intra_Con_2_input">
                    <label>
                      Specimen <span>:</span>
                    </label>
                    <input
                      type="text"
                      value={specimen}
                      onChange={handleSpecimenChange}
                    />
                  </div>

                  <div className="OtMangementForm_1_checkbox_Intraaaaa">
                    <label>
                      <input
                        type="checkbox"
                        value="Pathology"
                        checked={selectedCheckbox === "Pathology"}
                        onChange={handleCheckboxChange}
                      />
                      <span>Pathology</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Permanent"
                        checked={selectedCheckbox === "Permanent"}
                        onChange={handleCheckboxChange}
                      />
                      <span>Permanent</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="FrozenSection"
                        checked={selectedCheckbox === "FrozenSection"}
                        onChange={handleCheckboxChange}
                      />
                      <span>Frozen Section</span>
                    </label>
                  </div>
                </div>
              </div>
              <br />
              <br />

              <div className="Otdoctor_intra_Con">
                <div className="text_adjust_mt_Ot">
                  <label style={{ width: "250px" }}>
                    Drains / Catheters / Implants / Packing
                  </label>
                </div>
                <div className="Selected-table-container">
                  <table className="selected-medicine-table2">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Size</th>
                        <th>Site</th>
                        <th>
                          <button className="cell_btn12" onClick={addRow}>
                            <AddIcon />
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {drainsData.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              className="input_table_tye_site"
                              value={item.type}
                              onChange={(event) =>
                                handleInputChangeTable(event, index, "type")
                              }
                              list='drainsDatalist'
                            />
                              <datalist id="drainsDatalist">
                                <option value="Drains" />
                                <option value="Catheters" />
                                <option value="Implants" />
                                <option value="Packing" />
                              </datalist>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="input_table_tye_site"
                              value={item.size}
                              onChange={(event) =>
                                handleInputChangeTable(event, index, "size")
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="input_table_tye_site"
                              value={item.site}
                              onChange={(event) =>
                                handleInputChangeTable(event, index, "site")
                              }
                            />
                          </td>
                          <td>
                            <button
                              className="cell_btn12"
                              onClick={() => deleteRow(index)}
                            >
                              <RemoveIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="Otdoctor_intra_Con">
                <div className="Otdoctor_intra_Con_2_input">
                  <label>
                    Date & Time <span>:</span>
                  </label>
                  <input
                    className="date_stle_OT"
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                  />

                  <input
                    className="date_stle_OT"
                    type="time"
                    value={time}
                    onChange={handleTimeChange}
                  />
                </div>
                <br />
                <div className="Otdoctor_intra_Con_2 with_increse_85">
                  <label>
                    Patient Condition at transfer to ICU <span>:</span>
                  </label>
                  <textarea
                    name="patientToICU"
                    value={formDataTextArea.patientToICU}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>

            </div>

            {/* <div className="appointment">
              <br />
              <div className="Print_ot_all_div_pre ">
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
                  Doctor Post - Operative Checklist
                </h4>
                <br />
                <br />
              <div className="Otdoctor_intra_Con">
                <div className="Otdoctor_intra_Con_2_input">
                  <label>
                    Date & Time <span>:</span>
                  </label>
                  <input
                    className="date_stle_OT"
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                  />

                  <input
                    className="date_stle_OT"
                    type="time"
                    value={time}
                    onChange={handleTimeChange}
                  />
                </div>
                <br />
                <div className="Otdoctor_intra_Con_2 with_increse_85">
                  <label>
                    Patient Condition at transfer to ICU <span>:</span>
                  </label>
                  <textarea
                    name="patientToICU"
                    value={formDataTextArea.patientToICU}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
              </div>
            </div> */}


          </div>
        </PrintContent>
      )}
    </>
  );
}

export default OtDoctorIntra;
