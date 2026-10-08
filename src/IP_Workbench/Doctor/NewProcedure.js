import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router-dom";


const NewProcedure = () => {
  const workbenchformData = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
  // console.log("workbenchformData",workbenchformData);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [formValues, setFormValues] = useState({
    Index: null,
    DoctorName: "",
    Speciality:'',
    ProcedureName: "",
    SubprocredureName: "",
    TherapistName:'',
    Sessions: "",
    IsComplementry: "",
    Complementry: "",
    ComplementrySessions: "",
    appointmentDate: "",
    PatientID: "",
    VisitID: "",
    createdBy: "",
    Status: "Pending",
    branchlocation: "",
    KitName: "",
    ServiceType: "Procedure",
  });


  console.log("formValues", formValues);


  const [ProcedureName, setProcedureName] = useState([]);
  const [ProcedureData, setProcedureData] = useState([]);
  const [openModal2, setOpenModal2] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const [getprocedure, setgetprocedure] = useState(false);
  const navigate = useNavigate();


  const [getStockid_Name, setgetStockid_Name] = useState([])


  // ------------------------------------------
      const [Specialities, setSpecialities] = useState([])
  

  const [SelectedProcedure, setSelectedProcedure] = useState([]);


  // const [FormTreatprocedure, setFormTreatprocedure] = useState({  
  //   PatientID: "",
  //   VisitID: "",
  //   AppointmentDate: "",
  //   TherapistName: "",
  //   TreatmentProcedure: "",
  //   NextAppointment: "",
  //   Sessions: "",
  //   CompletedSessions: "",
  //   currentsession: "",
  //   AdditionalComments: "",
  //   GraftCount: "",
  //   Complementry: "",
  // });


  const [Ratecard, setRatecard] = useState({
    RatecardType: "",
    InsuranceName: "",
    ClientName: "",
  });

  const [StatusSelectedProcedure, setStatusSelectedProcedure] = useState([]);
  const [capturedImage1, setCapturedImage1] = useState(null);
  const [capturedImage2, setCapturedImage2] = useState(null);
  const devices = ["iPhone", "iPad", "Android", "Mobile", "Tablet", "desktop"];
  const [IsmobileorNot, setIsmobileorNot] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent2, setModalContent2] = useState('');

  const yourStyles = {
    position: 'absolute',
    inset: '100px',
    border: '1px solid rgb(204, 204, 204)',
    background: 'rgb(97 90 90 / 75%)',
    overflow: 'auto',
    borderRadius: '4px',
    outline: 'none',
    padding: '0px'
  }


  const successMsg = (msg) => {
    toast.success(`${msg}`, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { marginTop: "50px" },
    });
  };
  const userwarn = (warningMessage) => {
    toast.warn(`${warningMessage}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { marginTop: "50px" },
    });
  };


  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent2('');
  };

  const openModal = (content) => {
    setModalContent(content);
    setOpenModal2(true);
  };

  useEffect(() => {
    axios
      .get(
        `${urllink}Masters/TherapyTypes_Active_link`
      )
      .then((response) => {
        setProcedureName(response.data);

        console.log("lololkkkk", response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    setFormValues((prev) => ({
      ...prev,
      DoctorName: workbenchformData?.DoctorName,
      PatientID: workbenchformData?.PatientId,
      createdBy: userRecord?.username,
      VisitID: workbenchformData?.VisitId,
      PatientID: workbenchformData?.PatientId,
      branchlocation: userRecord?.location,
    }));
  }, [userRecord?.location]);


  const getitemName = () => {
    const location = userRecord?.location;
    const ItemType = "KIT"
    axios
      .get(`${urllink}doctorsworkbench/get_Medical_ProductMaster_data_forKit?location=${location}&ItemType=${ItemType}`)
      .then((response) => {
        setgetStockid_Name(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getitemName()
  }, [userRecord?.location])


  const handleonchange = (e) => {
    const { name, value } = e.target;

    if (name === "ProcedureName") {
      const getSdata = ProcedureName.find((ele) => ele.ProcedureName === value)

      const AnsCond = getSdata?.isComplimentary === "True" ? "Yes" : "No"


      if (value.split("-")[0].includes("HT")) {
        setFormValues((prev) => ({
          ...prev,
          [name]: value,
          Sessions: "",
          IsComplementry: AnsCond,
          Complementry: AnsCond === "Yes" ? getSdata?.ComplimentaryName : "",
          ComplementrySessions: AnsCond === "Yes" ? getSdata?.SessenCounts : "",
        }));
      } else {
        setFormValues((prev) => ({
          ...prev,
          [name]: value,
          Sessions: 0,
          IsComplementry: AnsCond,
          Complementry: AnsCond === "Yes" ? getSdata?.ComplimentaryName : "",
          ComplementrySessions: AnsCond === "Yes" ? getSdata?.SessenCounts : "",
        }));
      }
    }

    else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const Addprocedure = () => {
    let requiredFields = ["ProcedureName", "IsComplementry"];

    if (formValues.IsComplementry === "Yes") {
      requiredFields.push("Complementry", "ComplementrySessions")
    } else if (formValues.ProcedureName.split("-")[0]?.includes("GFC")) {
      requiredFields.push("Sessions", "KitName")
    } else if (!formValues.ProcedureName.split("-")[0]?.includes("HT")) {
      requiredFields.push("Sessions")
    }


    const existingItem = requiredFields.filter((field) => !formValues[field]);

    if (existingItem.length === 0) {
      const alreadyexist = ProcedureData.find(
        (p) => p.ProcedureName === formValues.ProcedureName
      );
      const lengthval = ProcedureData.length + 1;
      if (!alreadyexist) {
        setProcedureData((prev) => [
          ...prev,
          { ...formValues, Index: lengthval },
        ]);
      } else {
        alert("Procedure Already Exist");
      }
      setFormValues((prev) => ({
        ...prev,
        Index: null,
        ProcedureName: "",
        Sessions: "",
        Complementry: "",
        IsComplementry: "",
        Complementry: "",
        ComplementrySessions: "",
        appointmentDate: "",
        Status: "Pending",
        KitName: "",
      }));
    } else {
      alert(`please fill the required fields : ${existingItem.join(",")}`);
    }
  };
  const Updateprocedure = () => {
    let requiredFields = ["ProcedureName", "IsComplementry"];

    if (formValues.IsComplementry === "Yes") {
      requiredFields.push("Complementry", "ComplementrySessions")
    } else if (formValues.ProcedureName.split("-")[0]?.includes("GFC")) {
      requiredFields.push("Sessions", "KitName")
    } else if (!formValues.ProcedureName.split("-")[0]?.includes("HT")) {
      requiredFields.push("Sessions")
    }

    const existingItem = requiredFields.filter((field) => !formValues[field]);

    if (existingItem.length === 0) {
      const updateddate = [...ProcedureData];
      const indx = updateddate.findIndex((p) => p.Index === formValues.Index);

      updateddate[indx] = { ...formValues };
      setProcedureData(updateddate);
      setFormValues((prev) => ({
        ...prev,
        Index: null,
        ProcedureName: "",
        Sessions: "",
        Complementry: "",
        IsComplementry: "",
        Complementry: "",
        ComplementrySessions: "",
        appointmentDate: "",
        Status: "Pending",
        KitName: "",
      }));
    } else {
      alert(`please fill the required fields : ${existingItem.join(",")}`);
    }
  };
  const handleEdit = (client) => {
    setFormValues({ ...client });
  };

  useEffect(()=>{
    axios.get(`${urllink}Masters/Speciality_Detials_link`)
    .then((response)=>{
        console.log(response.data, 'shhhhdhdhhdhdhdhdhd');

        setSpecialities(response.data)
        
    })
    .catch((error)=>{
        console.log(error);
        
    })
},[])



  const handleSave = () => {
    const date = new Date();
    // Format the date as DD-MM-YYYY
    const formattedDate =date.toISOString().split('T')[0];

    const procedure = ProcedureData.flatMap((p) => {
      const additionalRows = [];

      return [
        {
          Therapy_Name: p.ProcedureName,
          Sub_Therapy_Name: p.SubprocredureName,
          Therapist_Name: workbenchformData.DoctorId,
          Sessions: +p.Sessions,
          Speciality_Name: p.Speciality,
          AppointmentDate:formattedDate,
          Patient_id: workbenchformData.PatientId,
          createdBy: userRecord?.username,
          DoctorName: workbenchformData.DoctorId,
          Status: p.Status,
          Visit_id: workbenchformData.VisitId,
          Location: userRecord?.location
        },
        ...additionalRows,
      ];
    });

    console.log(procedure, "----");

    axios
      .post(`${urllink}Ip_Workbench/Insert_Ip_Procedure_Order`, procedure)
      .then((response) => {
        console.log(response.data);
        if (response.data?.message) {
          successMsg(response.data?.message);
        } else if (response.data?.warn) {
          userwarn(response.data?.warn);
        }

        setProcedureData([]);
        setgetprocedure((prev) => !prev);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };



  // ---------------------------------------------------------------------


  // const handleEdit1 = (client) => {
  //   setFormTreatprocedure((prev) => ({
  //     ...prev,
  //     PatientID: client.PatientId,
  //     VisitID: workbenchformData.VisitId,
  //     AppointmentDate: client.CurrDate,
  //     TherapistName: client.TherapistName,
  //     TreatmentProcedure: client.Treatment_Procedure,
  //     Sessions: client.Number_of_Sessions,
  //     CompletedSessions: client.Number_of_Sessions_completed,
  //     currentsession: client.current_session,
  //     CreatedBy: userRecord?.username,
  //     location: userRecord?.location,
  //     Complementry: client?.Complementry,
  //   }));
  // };

  // const handleonchange1 = (e) => {
  //   const { name, value } = e.target;

  //   setFormTreatprocedure((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  

  useEffect(() => {
    axios
      .get(
        `${urllink}Ip_Workbench/Insert_Ip_Procedure_Order?Patientid=${workbenchformData?.PatientId}`
      )
      .then((res) => {
        const data = res.data;
        console.log(data, "----uuuu");
        setStatusSelectedProcedure(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [workbenchformData?.PatientId]);

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  // const handleSave1 = () => {
  //   const dataToSend = {
  //     ...FormTreatprocedure,
  //     ServiceType: "Procedure",
  //     CreatedBy: userRecord?.username,
  //     location: userRecord?.location,
  //     // VisitID: workbenchformData.VisitID,
  //   };

  //   console.log(dataToSend);
  //   const BackformData = new FormData();

  //   for (const key in dataToSend) {
  //     if (dataToSend.hasOwnProperty(key)) {
  //       BackformData.append(key, dataToSend[key]);
  //     }
  //   }
  //   let arr = ["NextAppointment"];
  //   if (FormTreatprocedure.TreatmentProcedure.split("-")[0].includes("HT")) {
  //     arr = ["NextAppointment", "GraftCount"];
  //   }
  //   const exist = arr.filter((p) => !FormTreatprocedure[p]);
  //   if (exist.length > 0) {
  //     userwarn(`please fill allthe fields : ${exist.join(",")}`);
  //   } else {
  //     axios
  //       .post(
  //         `${urllink}doctorsworkbench/insert_therapist_procedure`,
  //         BackformData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       )
  //       .then((res) => {
  //       console.log(res, "-=-=-=-=-=-=-");
  //       if (dataToSend?.Complementry === "No") {
  //         let billingdata = {
  //           PatientID: workbenchformData?.PatientId,
  //           PatientName: `${workbenchformData?.firstName} ${workbenchformData?.lastName}`,
  //           VisitID: workbenchformData?.VisitId,
  //           ServiceType: "Procedure",
  //           DoctorName: workbenchformData?.DoctorName,
  //           ProcedureName: FormTreatprocedure?.TreatmentProcedure,
  //           appointmentDate: workbenchformData?.CurrDate,
  //           Sessions: FormTreatprocedure?.currentsession,
  //           Unit: parseInt(FormTreatprocedure?.GraftCount) || 0,
  //           Amount: 0,
  //           Discount: 0,
  //           Gstcharge: 0,
  //           TotalAmount: 0,
  //           Status: "Pending",
  //           location: userRecord?.location,
  //           CreatedBy: userRecord?.username,
  //         };

  //         let urlval = "get_RateCard_Service_Charge";
  //         let ratecardType = Ratecard.RatecardType;

  //         if (Ratecard.RatecardType === "Insurance") {
  //           urlval = "get_RateCard_Insurance_Charge";
  //           ratecardType = Ratecard.InsuranceName;
  //         }
  //         if (Ratecard.RatecardType === "Client") {
  //           urlval = "get_RateCard_client_Charge";
  //           ratecardType = Ratecard.ClientName;
  //         }

  //         const fetchAndPostBillingData = async () => {
  //           try {
  //             const response = await axios.get(
  //               `${urllink}usercontrol/${urlval}?servicetype=Procedure&servicename=${FormTreatprocedure.TreatmentProcedure}&ratecardtype=${ratecardType}&location=${userRecord?.location}`
  //             );

  //             const data = response.data.data[0];
  //             console.log(response.data);

  //             if (data?.Charge) {
  //               billingdata["Amount"] = parseFloat(data.Charge) || 0;
  //               billingdata["Gstcharge"] = parseFloat(data.GstCharge) || 0;
  //               billingdata["TotalAmount"] =
  //                 parseFloat(data.Charge) * parseFloat(billingdata.Unit) || 0;
  //             }

  //             const ProcedureData = [{ ...billingdata }];
  //             const postResponse = await axios.post(
  //               `${urllink}GeneralBilling/insertGeneral_Billing_Data`,
  //               ProcedureData
  //             );

  //             console.log(postResponse, "=====");
  //           } catch (error) {
  //             console.error(
  //               "Error in fetching and posting billing data:",
  //               error
  //             );
  //           }
  //         };

  //         fetchAndPostBillingData();
  //       }

  //       setgetprocedure((prev) => !prev);
  //       // setFormTreatprocedure({
  //       //   PatientID: "",
  //       //   VisitID: "",
  //       //   AppointmentDate: "",
  //       //   TherapistName: "",
  //       //   TreatmentProcedure: "",
  //       //   NextAppointment: "",
  //       //   Sessions: "",
  //       //   CompletedSessions: "",
  //       //   currentsession: "",
  //       //   AdditionalComments: "",
  //       // });
  //       setCapturedImage1(null);
  //       setCapturedImage2(null);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });


  //     const shouldProceed = window.confirm("Do you Complete Procedure?");
  //     const statuss = shouldProceed ? "Yes" : "No";

  //     if (statuss === "Yes") {
  //       // User clicked "OK"
  //       navigate("/Home/Treament-QueueList");
  //     }
  //   }
  // };





  return (
    <>
      <div className="Add_items_Purchase_Master">
        <span>Add Therapy</span>
      </div>
      <div className="new-patient-registration-form">
        <div className="RegisFormcon" style={{ justifyContent: "center" }}>
        
        <div className="RegisForm_1">
            <label htmlFor="Speciality">
            Speciality Name<span>:</span>
            </label>
            <select
              id="Speciality"
              name="Speciality"
              value={formValues.Speciality}
              onChange={handleonchange}
            >
              <option value="">Select </option>
              {Array.isArray(Specialities) ? (
                Specialities.map((val, ind) => (
                  <option key={ind} value={val.Speciality_Id}>{val.SpecialityName}</option>
                ))
              ) : (
                <option disabled>No procedure available</option>
              )}
            </select>
          </div>
          <div className="RegisForm_1">
            <label htmlFor="ProcedureName">
              Therapy Name<span>:</span>
            </label>
            <select
              id="ProcedureName"
              name="ProcedureName"
              value={formValues.ProcedureName}
              onChange={handleonchange}
            >
              <option value="">Select </option>
              {/* {Array.isArray(ProcedureName) ? (
                ProcedureName.map((procedure, index) => (
                  <option key={index} value={procedure.TherapyName}>
                    {procedure.TherapyName}
                  </option>
                ))
              ) : (
                <option disabled>No procedure available</option>
              )} */}

              {Array.isArray(ProcedureName)?
            ProcedureName.filter((p)=>p.Speciality_Id === Number(formValues.Speciality)).map((therapy, ind)=>(
              <option value={therapy.id}>{therapy.TherapyName}</option>
            )): (
              <option disabled>No procedure available</option>
            )}
            </select>
          </div>
          <div className="RegisForm_1">
            <label htmlFor="SubprocredureName">
              Sub Therapy Name<span>:</span>
            </label>
            <select
              id="SubprocredureName"
              name="SubprocredureName"
              value={formValues.SubprocredureName}
              onChange={handleonchange}
            >
              <option value="">Select </option>
              

              {Array.isArray(ProcedureName) && ProcedureName.length > 0 ? (
  ProcedureName.filter((p) => p.id === Number(formValues.ProcedureName))
    .flatMap((sub) => sub.SubTherapyName.split(','))
    .map((option, ind) => (
      <option key={ind} value={option}>
        {option}
      </option>
    ))
) : (
  <option disabled>No procedure available</option>
)}

            </select>
          </div>

          <div className="RegisForm_1">
            <label htmlFor="TherapistName">
              Therapy Name<span>:</span>
            </label>
            <select
              id="TherapistName"
              name="TherapistName"
              value={formValues.TherapistName}
              onChange={handleonchange}
            >
              <option value="">Select </option>
              {['Summa1', 'summa2'].map((procedure, index) => (
                  <option key={index} value={procedure}>
                    {procedure}
                  </option>
                ))
              // ) 
              }
            </select>
          </div>



          {
            <div className="RegisForm_1">
              <label htmlFor="Sessions">
                Numberof Sessions<span>:</span>
              </label>
              <input
                type="number"
                id="Sessions"
                name="Sessions"
                value={formValues.Sessions}
                onChange={handleonchange}
              />
            </div>}

          {/* {formValues.IsComplementry === "Yes" && (
            <>
              <div className="RegisForm_1">
                <label htmlFor="ConsultancyDiscount">
                  Complementary<span>:</span>
                </label>
                <input
                  type="text"
                  id="ConsultancyDiscount"
                  name="Complementry"
                  value={formValues.Complementry}
                  onChange={handleonchange}
                />
              </div>
              <div className="RegisForm_1">
                <label htmlFor="ConsultancyDiscount">
                  Complementary Sessions<span>:</span>
                </label>
                <input
                  type="text"
                  name="ComplementrySessions"
                  value={formValues.ComplementrySessions}
                  onChange={handleonchange}
                />
              </div>
            </>
          )} */}

          {/* {formValues.ProcedureName.split("-")[0]?.includes("GFC") && (
            <div className="RegisForm_1">
              <label htmlFor="ConsultancyDiscount">
                GFC Kit Name<span>:</span>
              </label>
              <input
                list="Kitbrowsers"
                type="text"
                id="KitName"
                name="KitName"
                value={formValues.KitName}
                onChange={handleonchange}
              />
              <datalist id="Kitbrowsers">
                {getStockid_Name.map((item, index) => (
                  <option
                    key={index}
                    value={item.ItemName}
                  >
                    {item.ItemName}
                  </option>
                ))}
              </datalist>
            </div>
          )} */}

          <button
            className="RegisterForm_1_btns"
            onClick={
              formValues.Index !== null ? Updateprocedure : Addprocedure
            }
          >
            {formValues.Index !== null ? "Update" : "Add"}
          </button>


        </div>
        <br />

        {ProcedureData.length > 0 && (
          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th>S No</th>
                  <th>Service Type</th>
                  <th>Doctor Name</th>
                  <th>Procedure Name</th>
                  <th>Sessions</th>

                  <th>Therapist Name</th>
                  {/* <th>Is Complementry</th> */}
                  {/* <th>Complementry</th>
                  <th>Complementry <br />Sessions</th>
                  <th>Kit Name</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ProcedureData.map((client, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{client.ServiceType}</td>
                    <td>{client.DoctorName}</td>
                    <td>{client.ProcedureName}</td>
                    <td>{client.Sessions || "-"}</td>
                    <td>{formValues.TherapistName}</td>
                    {/* <td>{client.IsComplementry}</td>
                    <td>{client.Complementry || "-"}</td> */}
                    {/* <td>{client.ComplementrySessions || "-"}</td> */}
                    {/* <td>{client.KitName || "-"}</td> */}
                    <td>
                      <button
                        className="delnamebtn"
                        onClick={() => handleEdit(client)}
                      >
                        <EditNoteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <br />

        {ProcedureData.length > 0 && (
          <div className="Register_btn_con">
            <button className="RegisterForm_1_btns" onClick={handleSave}>
              Save
            </button>
            
          </div>
        )}

       
      </div>

      {/* -------------------------------------------------Current Therapy List------------------------------------------------------------------------------------ */}

{/* 
      {SelectedProcedure.length > 0 && <div className="Add_items_Purchase_Master">
        <span>Current Therapy List</span>
      </div>} */}

      {/* {SelectedProcedure.length > 0 && (
        <div className="Selected-table-container">
          <table className="selected-medicine-table2">
            <thead>
              <tr>
                <th>S No</th>
                <th>Visit Id</th>
                <th>Therapist Name</th>
                <th>Procedure Name</th>
                <th>Sessions</th>
                <th>Sessions Completed</th>
                <th>Current Session</th>
                <th>Complementry</th>
                <th>Kit Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {SelectedProcedure.map((client, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{client.VisitID}</td>
                  <td>{client.TherapistName}</td>
                  <td>{client.Treatment_Procedure}</td>
                  <td>{client.Number_of_Sessions}</td>
                  <td>{client.Number_of_Sessions_completed}</td>
                  <td>{client.current_session}</td>
                  <td>{client.Complementry || "-"}</td>
                  <td>{client.KitName || "-"}</td>
                  <td>{client.Status}</td>
                  <td>
                    <button
                      className="delnamebtn"
                      onClick={() => handleEdit1(client)}
                    >
                      <EditNoteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )} */}

      <br />
      {/* <div className="RegisFormcon" style={{ justifyContent: "center" }}>
        <div className="RegisForm_1">
          <label htmlFor="TreatmentProcedure">
            Procedure Name<span>:</span>
          </label>
          <input
            type="TreatmentProcedure"
            id="TreatmentProcedure"
            name="TreatmentProcedure"
            readOnly
            value={FormTreatprocedure.TreatmentProcedure}
            onChange={handleonchange1}
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="Sessions">
            Sessions<span>:</span>
          </label>
          <input
            type="number"
            id="Sessions"
            name="Sessions"
            readOnly
            value={FormTreatprocedure.Sessions}
            onChange={handleonchange1}
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="CompletedSessions">
            Completed Sessions<span>:</span>
          </label>
          <input
            type="number"
            id="CompletedSessions"
            name="CompletedSessions"
            readOnly
            value={FormTreatprocedure.CompletedSessions}
            onChange={handleonchange1}
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="currentsession">
            Current Sessions<span>:</span>
          </label>
          <input
            type="number"
            id="currentsession"
            name="currentsession"
            readOnly
            value={FormTreatprocedure.currentsession}
            onChange={handleonchange1}
          />
        </div>

     


        
        <div className="RegisForm_1">
          <label htmlFor="AdditionalComments">
            Additional Comments<span>:</span>
          </label>
          <textarea
            id="AdditionalComments"
            name="AdditionalComments"
            value={FormTreatprocedure.AdditionalComments}
            onChange={handleonchange1}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="NextAppointment">
            Next Appointment<span>:</span>
          </label>
          <input
            type="date"
            id="NextAppointment"
            name="NextAppointment"
            value={FormTreatprocedure.NextAppointment}
            onChange={handleonchange1}
            required
          />
        </div>
      </div> */}
      <br />
      {/* <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handleSave1}>
          Save
        </button>
      </div> */}
      <ToastContainer />
    
    </>
  )
}

export default NewProcedure;