import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router-dom";
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import { AiOutlineStop } from "react-icons/ai";
import Button from "@mui/material/Button";


const NewProcedure = () => {
  const workbenchformData = useSelector(state => state.Frontoffice?.DoctorWorkbenchNavigation);
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

useEffect(()=>{
  axios.get(`${urllink}Ip_Workbench/Insert_Ip_Procedure_Order?Patientid=${workbenchformData?.PatientId}&Visitid=${workbenchformData?.VisitId}`)
    .then((response)=>{
        console.log(response.data, 'shhhhdhdhhdhdhdhdhd');

        setSelectedProcedure(response.data)
        
    })
    .catch((error)=>{
        console.log(error);
        
    })
},[getprocedure])



  const handleSave = () => {
    const date = new Date();
    // Format the date as DD-MM-YYYY
    const formattedDate =date.toISOString().split('T')[0];

    const procedure = ProcedureData.flatMap((p) => {
      const additionalRows = [];

      return [
        {
          Therapy_Name: p.ProcedureName,
          Sub_Therapy_Name: p.SubprocredureName ||'None',
          Therapist_Name: userRecord.Employeeid,
          Sessions: +p.Sessions,
          Speciality_Name: p.Speciality,
          AppointmentDate:formattedDate,
          Patient_id: workbenchformData.PatientId,
          createdBy: userRecord?.username,
          DoctorName: workbenchformData.DoctorId,
          Status: p.Status,
          Visit_id: workbenchformData.VisitId,
          Location: userRecord?.location,
          Completed_Sessions: 0,
          Remaining_Sessions: +p.Sessions
        },
        ...additionalRows,
      ];
    });

    console.log(procedure, "----");

    axios
      .post(`${urllink}Ip_Workbench/Insert_Ip_Procedure_Order`, procedure)
      .then((response) => {
        console.log(response.data);
        successMsg("Ordered Successfully")

        setProcedureData([]);
        setgetprocedure((prev) => !prev);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };



  



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

  const handlestopSessions = (data) =>{
    console.log(data);

    axios.post(`${urllink}Ip_Workbench/Stop_Ip_Procedure_Order`, data)
    .then((response)=>{
    console.log(response);
    successMsg('Stoped Sucessfully')
    setgetprocedure((prev) => !prev);

    })
    .catch((error)=>{
      console.log(error);
      
    })

  }

  const TheropyTypeColumns = [
    {
        key: "id",
        name: "S No",
        frozen: true
    },
    {
        key: "Patient_id",
        name: "Patient Id",
        frozen: true
    },
    {
        key: "Visit_id",
        name: "Visit Id",
        frozen: true
    },
    {
        key: "AppointmentDate",
        name: "Appointment Date",
  
    },
    {
        key: "Doctor_Name",
        name: "Doctor Name",
  
    },
    {
        key: "Therapy_Name",
        name: "Therapy Name",
  
    },
    {
        key: "Sub_Therapy_Name",
        name: "Sub Therapy Name",
  
    },
    {
        key: "Sessions",
        name: "Total Sessions",
  
    },
    {
        key: "Status",
        name: "Status",
  
    },
    {
        key: "Completed_Session",
        name: "Completed Session",
  
    },
    {
        key: "Remaining_Sessions",
        name: "Remaining Sessions",
  
    },
   
    {
        key: "Edit",
        name: "Stop",
        renderCell: (params) => (
            <>
                <Button
                    className="cell_btn"
                    onClick={() => handlestopSessions(params.row)}
                >
                    <AiOutlineStop  style={{color:'red'}}/>

                </Button>
            </>
        ),
    },
    // {
    //     key: "Action",
    //     name: "Action",
    //     renderCell: (params) => (
    //         <>
    //             <Button
    //                 className="cell_btn"
    //                 onClick={() => handleeditTherapyType(params.row)}
    //             >
    //                 <EditIcon className="check_box_clrr_cancell" />
    //             </Button>
    //         </>
    //     ),
    // }
]




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
{/* 
          <div className="RegisForm_1">
            <label htmlFor="TherapistName">
              Therapist Name<span>:</span>
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
 */}


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

                  {/* <th>Therapist Name</th> */}
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
                    {/* <td>{formValues.TherapistName}</td> */}
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

      {SelectedProcedure.length > 0 &&
                            <ReactGrid columns={TheropyTypeColumns} RowData={SelectedProcedure} />}
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