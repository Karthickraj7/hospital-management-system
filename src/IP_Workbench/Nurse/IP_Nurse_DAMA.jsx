import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useReactToPrint } from "react-to-print";

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

const IP_Nurse_DAMA = () => {
  const dispatch = useDispatch();

  const componentRef = useRef();

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
 
  const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
  console.log(IP_DoctorWorkbenchNavigation,'IP_DoctorWorkbenchNavigation');
  
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [modalOpen, setModalOpen] = useState(false);

  const DamaReasons = [
    "Absconded",
    "Dama Npn Affordable",
    "Dama Relatives Not Wish",
    "Dama Insurance Or Cashless",
    "Others",
  ];

  const transferReasons = [
    "Non Availability Of Consultant",
    "Non Availability Of ICU Bed",
    "Relatives Not Available(Unknown Patients)",
    "Brought Dead",
    "Higher Center For Further Investigation & Treatment",
    "Toxic Patients Or Relatives",
    "Drunk Patients",
    "Others",
  ];

  const [Dama, setDama] = useState({
    PatientExitType: "",
    Reasons: "",
    Date: "",
    Time: "",
    Remarks: "",
  });

  const [gridData, setGridData] = useState([]);
  const [TransferGridData, setTransferGridData] = useState(false);
  const [TransferReferalData, setTransferReferalData] = useState([]);
  const [IsViewMode, setIsViewMode] = useState(false);
  const [HospitalClinicDetails, setHospitalClinicDetails] = useState([]);
  const [HospitalDetails, setHospitalDetails] = useState([]);
  const [MlcDetails, setMlcDetails] = useState([]);
  const [MlcNo, setMlcNo] = useState("");

  console.log(HospitalClinicDetails,'HospitalClinicDetails');
  console.log(HospitalDetails,'HospitalDetails');
  console.log(MlcDetails,'MlcDetails');
  console.log(MlcNo,'MlcNo');
  console.log(TransferReferalData,'TransferReferalData');

  const DamaColumns = [
    { key: "id", name: "S.No", frozen: true },
    { key: "PrimaryDoctorName", name: "Doctor Name", frozen: true },
    { key: "Date", name: "Date", frozen: true },
    { key: "Time", name: "Time", frozen: true },
    { key: "Type", name: "Type" },
    { key: "PatientExitType", name: "Patient Exit Type" },
    { key: "Reasons", name: "Reasons" },
    { key: "Remarks", name: "Remarks" },
    {
      key: "view",
      frozen: true,
      name: "View",
      renderCell: (params) => (
        <IconButton onClick={() => handleView(params.row)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  const handleView = (data) => {
    setDama({
      PatientExitType: data.PatientExitType || "",
      Reasons: data.Reasons || "",
      Date: data.Date || "",
      Time: data.Time || "",
      Remarks: data.Remarks || "",
    });
    setIsViewMode(true);
  };



  const handleOpenTransferModal = () => {
    setModalOpen(true);
  };

  const handleClear = () => {
    setDama({
      PatientExitType: "",
      Reasons: "",
      Date: "",
      Time: "",
      Remarks: "",
    });
    setIsViewMode(false);
  };

  useEffect(() => {
    const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;

    if (RegistrationId) {
      axios
        .get(`${UrlLink}Ip_Workbench/IP_Dama_Details_Link`, {
          params: {
            RegistrationId,
            DepartmentType: departmentType,
            Type: "Nurse",
          },
        })
        .then((res) => setGridData(res.data))
        .catch((err) => console.log(err));
    }
  }, [UrlLink, IP_DoctorWorkbenchNavigation]);

  const filteredReasons =
    Dama.PatientExitType === "Transfer" ? transferReasons : DamaReasons;

  const handleDamaChange = (e) => {
    const { name, value } = e.target;
    if (name === "PatientExitType") {
      setDama((prev) => ({ ...prev, [name]: value, Reasons: "" }));
    } else {
      setDama((prev) => ({ ...prev, [name]: value }));
    }

    if (e.target.name === "Remarks") {
      adjustHeight(e);
    }
  };

  const [showTransferPrintContent, setShowTransferPrintContent] =
    useState(false);

  const handlePrintPres = useReactToPrint({
    content: () => componentRef.current,
    // onAfterPrint: async () => {
    //   // Additional action after printing, if needed
    // },
    onAfterPrint: () => setShowTransferPrintContent(false),
  });

  const TransferDatafunction = () => {
    setShowTransferPrintContent(true);
    // setComplete(false); // Show content for printing
    setTimeout(() => {
      handlePrintPres(); // Trigger print
      setShowTransferPrintContent(false);
    }, 500);
  };

  const [formData, setFormData] = useState({
    patientName: IP_DoctorWorkbenchNavigation?.PatientName || "",
    ageSex: IP_DoctorWorkbenchNavigation?.Age && IP_DoctorWorkbenchNavigation?.Gender
            ? `${IP_DoctorWorkbenchNavigation?.Age} / ${IP_DoctorWorkbenchNavigation?.Gender}`
            : "",
    admittingConsultant: IP_DoctorWorkbenchNavigation?.AdmissionDrIncharge || "",
    PatientId: IP_DoctorWorkbenchNavigation?.PatientId || "",
    emergencyRoutine: "", 
    mlcNo: MlcNo || "",
    to: "",
    hospitalName: "",
    address: "",
    history: "",
    complaints: "",
    comorbidities: "",
    pastMedicalHistory: "",
    diagnosis: "",
    treatmentGiven: "",
    purposeOfTransfer: "",
    transportMethod: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    console.log(name,'name--------1');
    console.log(value,'value--------1');
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


      useEffect(() => {
      axios
        .get(`${UrlLink}Masters/Clinic_Detials_link`)
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setHospitalClinicDetails(res.data[0]); // Set the first object
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }, [UrlLink]);

    useEffect(() => {
      axios
        .get(`${UrlLink}Masters/Hospital_Detials_link`)
        .then((res) => {
          setHospitalDetails(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }, [UrlLink]);


    useEffect(() => {
    
      const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
      const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;
  
        
      if (RegistrationId) {
        axios.get(`${UrlLink}Ip_Workbench/IP_Mlc_Details_Link`,{
          params:{
            RegistrationId: RegistrationId,
            DepartmentType: departmentType,
            

          }})
            .then((res) => {
              
              const ress = res.data
              console.log(ress,'mlccccccccc')
              if (ress.length > 0) {
                setMlcDetails(ress);       // Set the first object in the array
                setMlcNo(ress[0]?.MlcNo);     // Access MlcNo from the first object
              }
            
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }, [UrlLink,IP_DoctorWorkbenchNavigation])
      
    // useEffect(() => {
    //   if (MlcDetails) {
    //     setFormData({
    //       mlcNo: MlcDetails.MlcNo || "",
    //       // other fields
    //     });
    //   }
    // }, [MlcDetails]);

    
  // Handle radio button changes
  const handleRadioChange = (value) => {
    console.log(value,'value');
    
    setFormData((prevData) => ({
      ...prevData,
      transportMethod: value,
    }));
  };

  // Auto-adjust height of textareas
  const adjustHeight = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // Initialize textarea heights on mount and when content changes
  useEffect(() => {
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach((textarea) => {
      adjustHeight({ target: textarea });
    });
  }, [formData]);

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

    const senddata = {
      ...Dama,
      RegistrationId,
      DepartmentType,
      Createdby: userRecord?.username,
      Type: "Nurse",
    };

    axios
      .post(`${UrlLink}Ip_Workbench/IP_Dama_Details_Link`, senddata)
      .then((res) => {
        const [type, message] = [
          Object.keys(res.data)[0],
          Object.values(res.data)[0],
        ];
        dispatch({ type: "toast", value: { message, type } });
        setGridData((prev) => [...prev, senddata]);
        handleClear();
      })
      .catch((err) => console.log(err));
  };

  const handleTransferFormSubmit = () => {
    const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    const DepartmentType = IP_DoctorWorkbenchNavigation?.RequestType;

    if (!RegistrationId) {
      dispatch({
        type: "toast",
        value: { message: "Registration ID is missing", type: "error" },
      });
      return;
    }

    const senddata = {
      ...formData,
      RegistrationId,
      DepartmentType,
      Createdby: userRecord?.username,
      
    };

    axios
      .post(`${UrlLink}Ip_Workbench/IP_TransferForm_Details_Link`, senddata)
      .then((res) => {
        const [type, message] = [
          Object.keys(res.data)[0],
          Object.values(res.data)[0],
        ];
        dispatch({ type: "toast", value: { message, type } });
        setTransferGridData(prev => !prev);
        // setTransferGridData((prev) => [...prev, senddata]);
        // handleClear();
      })
    .catch((err) => console.log(err));

    
  };


useEffect(() => {
  const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
  const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;

  if (RegistrationId) {
    axios
      .get(`${UrlLink}Ip_Workbench/IP_TransferForm_Details_Link`, {
        params: {
          RegistrationId,
          DepartmentType: departmentType,
          
        },
      })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const TransData = res.data[0];

          setFormData(() => ({
            emergencyRoutine: TransData?.EmergencyRoutine || "",
            to: TransData?.To || "",
            hospitalName: TransData?.HospitalName || "",
            address: TransData?.Address || "",
            history: TransData?.History || "",
            complaints: TransData?.Complaints || "",
            comorbidities: TransData?.Comorbidities || "",
            pastMedicalHistory: TransData?.PastMedicalHistory || "",
            diagnosis: TransData?.Diagnosis || "",
            treatmentGiven: TransData?.TreatmentGiven || "",
            purposeOfTransfer: TransData?.PurposeOfTransfer || "",
            transportMethod: TransData?.TransportMethod || "",


            patientName: IP_DoctorWorkbenchNavigation?.PatientName || "",
            ageSex:
              IP_DoctorWorkbenchNavigation?.Age && IP_DoctorWorkbenchNavigation?.Gender
                ? `${IP_DoctorWorkbenchNavigation.Age} / ${IP_DoctorWorkbenchNavigation.Gender}`
                : "",
            admittingConsultant: IP_DoctorWorkbenchNavigation?.AdmissionDrIncharge || "",
            PatientId: IP_DoctorWorkbenchNavigation?.PatientId || "",
          }));
        }

        // ✅ This should be outside the `if` but still inside `.then()`
        setTransferReferalData(res.data[0]);
      })
      .catch((err) => console.log(err));
  }
}, [UrlLink, IP_DoctorWorkbenchNavigation, TransferGridData]);




  //   const adjustHeight = (e) => {
  //     e.target.style.height = "auto"; // Reset height to calculate scrollHeight
  //     e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight
  //   };

  return (
    <div className="Main_container_app">
      <div className="form-section5">
        <div className="RegisFormcon_1">
          {[
            {
              label: "Patient Exit Type",
              id: "PatientExitType",
              type: "select",
            },
            { label: "Reasons", id: "Reasons", type: "select" },
            { label: "Date", id: "Date", type: "date" },
            { label: "Time", id: "Time", type: "time" },
            // { label: "Remarks", id: "Remarks", type: "textarea" }
          ].map((input) => (
            <div className="RegisForm_1" key={input.id}>
              <label htmlFor={input.id}>
                {input.label} <span>:</span>
              </label>
              {input.type === "textarea" ? (
                <textarea
                  id={input.id}
                  name={input.id}
                  onChange={handleDamaChange}
                  value={Dama[input.id]}
                  readOnly={IsViewMode}
                  required
                />
              ) : input.type === "select" && input.id === "PatientExitType" ? (
                <select
                  id={input.id}
                  name={input.id}
                  onChange={handleDamaChange}
                  value={Dama[input.id]}
                  readOnly={IsViewMode}
                  required
                >
                  <option value="">Select</option>
                  <option value="Transfer">Transfer</option>
                  <option value="DAMA">DAMA</option>
                </select>
              ) : input.type === "select" && input.id === "Reasons" ? (
                <select
                  id={input.id}
                  name={input.id}
                  onChange={handleDamaChange}
                  value={Dama[input.id]}
                  readOnly={IsViewMode}
                  required
                >
                  <option value="">Select </option>
                  {filteredReasons.map((reason, index) => (
                    <option key={index} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={input.type}
                  id={input.id}
                  name={input.id}
                  onChange={handleDamaChange}
                  value={Dama[input.id]}
                  readOnly={IsViewMode}
                  required
                />
              )}
            </div>
          ))}
        </div>
        <br />

        <div
          className="RegisFormcon_1"
          style={{ justifyContent: "center" }}
          onClick={handleOpenTransferModal}
        >
          <button style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <VisibilityIcon /> Transfer / Referral Letter
          </button>
        </div>

        <br />

        <div className="RegisFormcon extend_textarea_new">
          <div className="RegisForm_1 extend_textarea_new">
            <label htmlFor="Remarks">
              Remarks <span>:</span>
            </label>
            <textarea
              id="Remarks"
              name="Remarks"
              onChange={handleDamaChange}
              value={Dama.Remarks}
              placeholder="Enter your remarks here"
              readOnly={IsViewMode}
              required
            />
          </div>
        </div>

        {modalOpen && (
          <div
            className="sideopen_showcamera_profile"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="newwProfiles newwPopupforreason"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="transfer-moal-body">

                <div className="transfer-hospital-info">
                  {Object.keys(HospitalDetails).length > 0 && (
                    <h2 className="transfer-hospital-name">{HospitalDetails.hospitalName}</h2>
                  )}

                  {HospitalClinicDetails ? (
                    <p className="transfer-hospital-address">
                      {HospitalClinicDetails.DoorNo}{' '}
                      {HospitalClinicDetails.Street}{' '}
                      {HospitalClinicDetails.Area}{' '}
                      {HospitalClinicDetails.City}{' '}
                      {HospitalClinicDetails.State}{' '}
                      {HospitalClinicDetails.Country}{' '}
                      {HospitalClinicDetails.Pincode}
                    </p>
                  ) : (
                    <p className="transfer-hospital-address">&nbsp;</p>
                  )}
                </div>


                <div className="transfer-hospital-info">
                  <h2 className="transfer-hospital-name">
                    Transfer / Referral Letter
                  </h2>
                </div>

                <div className="transfer-form">
                  <div className="ewjdew_p802">
                    <div className="transfer-form-row">
                      <div className="transfer-form-cell">
                        <label>
                          Patient Name<span>:</span>
                        </label>
                        <input
                          type="text"
                          name="patientName"
                          value={formData.patientName}
                          onChange={handleInputChange}
                        />
                      </div>


                      <div className="transfer-form-cell">
                        <label>
                          Admitting Consultant<span>:</span>
                        </label>
                        <input
                          type="text"
                          name="admittingConsultant"
                          value={formData.admittingConsultant}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="transfer-form-cell">
                        <label>
                          Emergency/Routine<span>:</span>
                        </label>
                        <input
                          type="text"
                          name="emergencyRoutine"
                          value={formData.emergencyRoutine}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="transfer-form-row">
                      <div className="transfer-form-cell">
                        <label>
                          Age/Sex<span>:</span>
                        </label>
                        <input
                          type="text"
                          name="ageSex"
                          value={formData.ageSex}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="transfer-form-cell">
                        <label>
                          PatientId<span>:</span>
                        </label>
                        <input
                          type="text"
                          name="PatientId"
                          value={formData.PatientId}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="transfer-form-cell">
                        <label>
                          MLC No<span>:</span>
                        </label>
                        <input
                          type="text"
                          name="mlcNo"
                          value={MlcNo}
                          onChange={(e) => setMlcNo(e.target.value)}
                          // onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="transfer-form-row">
                    <div className="transfer-form-cell transfer-form-cell-full">
                      <label>To,</label>
                      <textarea
                        name="to"
                        value={formData.to}
                        onChange={(e) => {
                          handleInputChange(e);
                          adjustHeight(e);
                        }}
                        onInput={adjustHeight}
                      ></textarea>
                    </div>
                  </div>

                  <div className="transfer-form-row">
                    <div className="transfer-form-cell transfer-form-cell-full">
                      <label>Hospital Name-</label>
                      <textarea
                        name="hospitalName"
                        value={formData.hospitalName}
                        onChange={(e) => {
                          handleInputChange(e);
                          adjustHeight(e);
                        }}
                        onInput={adjustHeight}
                      ></textarea>
                    </div>
                  </div>

                  <div className="transfer-form-row">
                    <div className="transfer-form-cell transfer-form-cell-full">
                      <label>Address-</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={(e) => {
                          handleInputChange(e);
                          adjustHeight(e);
                        }}
                        onInput={adjustHeight}
                      ></textarea>
                    </div>
                  </div>

                  <div className="transfer-form-row">
                    <div className="transfer-form-cell transfer-form-cell-full">
                      <label>Admitted with History of</label>
                      <textarea
                        className="transfer-textarea"
                        name="history"
                        value={formData.history}
                        onChange={(e) => {
                          handleInputChange(e);
                          adjustHeight(e);
                        }}
                        onInput={adjustHeight}
                      ></textarea>
                    </div>
                  </div>

                  <div className="transfer-form-row">
                    <div className="transfer-form-cell transfer-form-cell-full">
                      <label>Complaints of:</label>
                      <textarea
                        className="transfer-textarea"
                        name="complaints"
                        value={formData.complaints}
                        onChange={(e) => {
                          handleInputChange(e);
                          adjustHeight(e);
                        }}
                        onInput={adjustHeight}
                      ></textarea>
                    </div>
                  </div>

                  <div className="transfer-form-row">
                    <div className="transfer-form-cell transfer-form-cell-full">
                      <label>Comorbidities-</label>
                      <textarea
                        className="transfer-textarea"
                        name="comorbidities"
                        value={formData.comorbidities}
                        onChange={(e) => {
                          handleInputChange(e);
                          adjustHeight(e);
                        }}
                        onInput={adjustHeight}
                      ></textarea>
                    </div>
                  </div>

                  <div className="transfer-form-row">
                    <div className="transfer-form-cell transfer-form-cell-full">
                      <label>Past Medi/Surgical history</label>
                      <textarea
                        className="transfer-textarea"
                        name="pastMedicalHistory"
                        value={formData.pastMedicalHistory}
                        onChange={(e) => {
                          handleInputChange(e);
                          adjustHeight(e);
                        }}
                        onInput={adjustHeight}
                      ></textarea>
                    </div>
                  </div>

                  <div className="transfer-form-row">
                    <div className="transfer-form-cell transfer-form-cell-full">
                      <label>Diagnosis:</label>
                      <textarea
                        className="transfer-textarea"
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={(e) => {
                          handleInputChange(e);
                          adjustHeight(e);
                        }}
                        onInput={adjustHeight}
                      ></textarea>
                    </div>
                  </div>

                  <div className="transfer-form-row">
                    <div className="transfer-form-cell transfer-form-cell-full">
                      <label>Treatment Given</label>
                      <textarea
                        className="transfer-textarea"
                        name="treatmentGiven"
                        value={formData.treatmentGiven}
                        onChange={(e) => {
                          handleInputChange(e);
                          adjustHeight(e);
                        }}
                        onInput={adjustHeight}
                      ></textarea>
                    </div>
                  </div>

                  <div className="transfer-form-row">
                    <div className="transfer-form-cell transfer-form-cell-full">
                      <label>Purpose of Transfer/ Referral:</label>
                      <textarea
                        className="transfer-textarea"
                        name="purposeOfTransfer"
                        value={formData.purposeOfTransfer}
                        onChange={(e) => {
                          handleInputChange(e);
                          adjustHeight(e);
                        }}
                        onInput={adjustHeight}
                      ></textarea>
                    </div>
                  </div>

                  <div className="transfer-form-row">
                    <div className="transfer-form-cell transfer-form-cell-full">
                      <label>---to Transfer with :</label>
                    </div>
                  </div>

                  <div className="transfer-form-row">
                    <div className="transfer-form-cell-full transfer-transport-options">
                      <div className="transfer-option-container">
                        <label className="transfer-option-label">
                          <input
                            type="radio"
                            name="transport"
                            className="transfer-radio"
                            checked={formData.transportMethod === "cardiac"}
                            onChange={() => handleRadioChange("cardiac")}
                          />
                          Cardiac Ambulance with Medical Supervision
                        </label>

                        <label className="transfer-option-label">
                          <input
                            type="radio"
                            name="transport"
                            className="transfer-radio"
                            checked={formData.transportMethod === "noncardiac"}
                            onChange={() => handleRadioChange("noncardiac")}
                          />
                          Non-cardiac Ambulance-with or without Oxygen
                        </label>

                        <label className="transfer-option-label">
                          <input
                            type="radio"
                            name="transport"
                            className="transfer-radio"
                            checked={formData.transportMethod === "private"}
                            onChange={() => handleRadioChange("private")}
                          />
                          Private Vehicle
                        </label>

                        <label className="transfer-option-label">
                          <input
                            type="radio"
                            name="transport"
                            className="transfer-radio"
                            checked={formData.transportMethod === "other"}
                            onChange={() => handleRadioChange("other")}
                          />
                          Other means of Transport
                        </label>
                      </div>
                      <p className="transfer-risk-notice">
                        (Due risks & consequences during travelling explained)
                      </p>
                    </div>
                  </div>

                  <div className="Main_container_Btn">

                    <button onClick={handleTransferFormSubmit}>{TransferReferalData?.RegistrationId ? 'Update' : 'Submit'}</button>
                    <button onClick={TransferDatafunction}>Print</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



        {showTransferPrintContent && (
          <PrintContent ref={componentRef} >
            <div className="transfer-moal-body">
              <div className="transfer-hospital-info">
                {Object.keys(HospitalDetails).length > 0 && (
                  <h2 className="transfer-hospital-name">{HospitalDetails.hospitalName}</h2>
                )}
                {HospitalClinicDetails ? (
                    <p className="transfer-hospital-address">
                      {HospitalClinicDetails.DoorNo}{' '}
                      {HospitalClinicDetails.Street}{' '}
                      {HospitalClinicDetails.Area}{' '}
                      {HospitalClinicDetails.City}{' '}
                      {HospitalClinicDetails.State}{' '}
                      {HospitalClinicDetails.Country}{' '}
                      {HospitalClinicDetails.Pincode}
                    </p>
                  ) : (
                    <p className="transfer-hospital-address">&nbsp;</p>
                  )}
              </div>

              <div className="transfer-hospital-info">
                <h2 className="transfer-hospital-name">
                  Transfer / Referral Letter
                </h2>
              </div>

              <div className="transfer-form">
                <div className="ewjdew_p802">
                  <div className="transfer-form-row">
                    <div className="transfer-form-cell transfer-form-cell-forprint">
                      <label>
                        Patient Name<span>:</span>
                      </label>
                    <h2>{IP_DoctorWorkbenchNavigation?.PatientName || ""}</h2>
                    </div>

                    <div className="transfer-form-cell">
                      <label>
                        Admitting Consultant<span>:</span>
                      </label>
                      <h2>{IP_DoctorWorkbenchNavigation?.AdmissionDrIncharge || ""}</h2>
                      </div>

                    <div className="transfer-form-cell">
                      <label>
                        Emergency/Routine<span>:</span>
                      </label>
                      <h2>{TransferReferalData?.EmergencyRoutine}</h2>
                      </div>
                  </div>

                  <div className="transfer-form-row">
                    <div className="transfer-form-cell">
                      <label>
                        Age/Sex<span>:</span>
                      </label>
                      <h2>{ IP_DoctorWorkbenchNavigation?.Age && IP_DoctorWorkbenchNavigation?.Gender
                        ? `${IP_DoctorWorkbenchNavigation?.Age} / ${IP_DoctorWorkbenchNavigation?.Gender}`
                        : ""}
                      </h2>
                      </div>
                    <div className="transfer-form-cell">
                      <label>
                        PatientId<span>:</span>
                      </label>
                      <h2>{IP_DoctorWorkbenchNavigation?.PatientId || ""}</h2>
                      </div>
                    <div className="transfer-form-cell">
                      <label>
                        MLC No<span>:</span>
                      </label>
                      <h2>{MlcNo}</h2>
                      </div>
                  </div>
                </div>

              <div style={{display:'flex',flexDirection:'column',rowGap:'5px'}}>
                <div className="transfer-form-row">
                  <div className="transfer-form-cell transfer-form-cell-full">
                    <label>To,</label>
                    <textarea type="text" value={TransferReferalData?.To}/>
                  </div>
                </div>

                <div className="transfer-form-row">
                  <div className="transfer-form-cell transfer-form-cell-full">
                    <label>Hospital Name-</label>
                    <textarea type="text" value={TransferReferalData?.HospitalName}/>
                  </div>
                </div>

                <div className="transfer-form-row">
                  <div className="transfer-form-cell transfer-form-cell-full">
                    <label>Address-</label>
                    <textarea type="text" value={TransferReferalData?.Address}/>
                  </div>
                </div>

                <div className="transfer-form-row">
                  <div className="transfer-form-cell transfer-form-cell-full">
                    <label>Admitted with History of</label>
                    <textarea className="transfer-textarea " value={TransferReferalData?.History} />
                  </div>
                </div>

                <div className="transfer-form-row">
                  <div className="transfer-form-cell transfer-form-cell-full">
                    <label>Complaints of:</label>
                    <textarea className="transfer-textarea" value={TransferReferalData?.Complaints}/>
                  </div>
                </div>

                <div className="transfer-form-row">
                  <div className="transfer-form-cell transfer-form-cell-full">
                    <label>Comorbidities-</label>
                    <textarea className="transfer-textarea" value={TransferReferalData?.Comorbidities}/>
                  </div>
                </div>

                <div className="transfer-form-row">
                  <div className="transfer-form-cell transfer-form-cell-full">
                    <label>Past Medi/Surgical history</label>
                    <textarea className="transfer-textarea" value={TransferReferalData?.PastMedicalHistory} />
                  </div>
                </div>

                <div className="transfer-form-row">
                  <div className="transfer-form-cell transfer-form-cell-full">
                    <label>Diagnosis:</label>
                    <textarea className="transfer-textarea" value={TransferReferalData?.Diagnosis}/>
                  </div>
                </div>

                <div className="transfer-form-row">
                  <div className="transfer-form-cell transfer-form-cell-full">
                    <label>Treatment Given</label>
                    <textarea className="transfer-textarea" value={TransferReferalData?.TreatmentGiven}/>
                  </div>
                </div>

                <div className="transfer-form-row">
                  <div className="transfer-form-cell transfer-form-cell-full">
                    <label>Purpose of Transfer/ Referral:</label>
                    <textarea className="transfer-textarea" value={TransferReferalData?.PurposeOfTransfer}/>
                  </div>
                </div>
                </div>

                <div className="transfer-form-row">
                  <div className="transfer-form-cell transfer-form-cell-full">
                    <label>---to Transfer with :</label>
                  </div>
                </div>

                <div className="transfer-form-row">
                  <div className="transfer-form-cell-full transfer-transport-options">
                    <div className="transfer-option-container">
                      <label className="transfer-option-label">
                        <input
                          type="radio"
                          name="transport"
                          className="transfer-radio"
                          value="cardiac"
                          checked={formData.transportMethod === "cardiac"}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, transportMethod: e.target.value }))
                          }
                        />
                        Cardiac Ambulance with Medical Supervision
                      </label>

                      <label className="transfer-option-label">
                        <input
                          type="radio"
                          name="transport"
                          className="transfer-radio"
                          value="noncardiac"
                          checked={formData.transportMethod === "noncardiac"}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, transportMethod: e.target.value }))
                          }
                        />
                        Non-cardiac Ambulance-with or without Oxygen
                      </label>

                      <label className="transfer-option-label">
                        <input
                          type="radio"
                          name="transport"
                          className="transfer-radio"
                          value="private"
                          checked={formData.transportMethod === "private"}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, transportMethod: e.target.value }))
                          }
                        />
                        Private Vehicle
                      </label>

                      <label className="transfer-option-label">
                        <input
                          type="radio"
                          name="transport"
                          className="transfer-radio"
                          value="other"
                          checked={formData.transportMethod === "other"}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, transportMethod: e.target.value }))
                          }
                        />
                        Other means of Transport
                      </label>
                    </div>
                    <p className="transfer-risk-notice">
                      (Due risks & consequences during travelling explained)
                    </p>
                  </div>
                </div>


                <div className="Main_container_Btn">
                  <button onClick={TransferDatafunction}>Print</button>
                </div>
              </div>
            </div>
          </PrintContent>
        )}
      </div>

      <div className="Main_container_Btn">
        {IsViewMode && <button onClick={handleClear}>Clear</button>}
        {!IsViewMode && <button onClick={handleSubmit}>Submit</button>}
      </div>

      {gridData.length > 0 && (
        <ReactGrid columns={DamaColumns} RowData={gridData} />
      )}

      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
};

export default IP_Nurse_DAMA;
