import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

// import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";

function OtNeuroSurgery() {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
 
  const OTPatientdata = useSelector((state) => state.Frontoffice?.OTPatientdata);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();
  
  const IpNurseQueSelectedRow = {
    Booking_Id: "1001A", // Replace with actual data or initialize as needed
    PatientId: "1",
    PatientName: "diya",
  };

  const [OtSheet, setOtSheet] = useState({
    SurgeryName: "",
    OperationNotes: "",
    PostOfInstructions: "",
  });

  const [load,setload] = useState(false);

  const [OtSheetGet, setOtSheetGet] = useState(false);

  const handleOtChange = (e) => {
    const { name, value } = e.target;
    setOtSheet((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOt = () => {

    const data = {
      Patientid :  OTPatientdata.patientId,
      RegistrationId : OTPatientdata?.RegistrationId,
      created_by : userRecord?.username || '',
      DoctorId :  userRecord?.Doctor || '',
      BookingType : OTPatientdata?.BookingType,
      Surgeryname : OtSheet.SurgeryName,
      Operationnotes : OtSheet.OperationNotes,
      PostOpInstructions : OtSheet.PostOfInstructions,
        
    };

    console.log(data,'data');

    axios.post(`${UrlLink}OT/Neuro_Notes_OT_Details`, data)
  .then((res) => {

    const response = res.data;
                const messageType = Object.keys(response)[0];
                const messageContent = Object.values(response)[0];
                console.log(messageType);
                console.log(messageContent);
                dispatchvalue({
                    type: 'toast',
                    value: { message: messageContent, type: messageType },
                });

  })
  .catch((err) => console.log(err));
   
  };

  
  return (
    <>
   
      <div className="Main_container_app" >
       
      {/* <div className="common_center_tag">
          <h3>Dr Shree Vijay Phadke - Ot</h3>
        </div> */}
        <br />

            
        <div className="ewdfhyewuf65">
            <div className="OtMangementForm_1 djkwked675">
              <label htmlFor="SurgeryName">
              Surgery Name <span>:</span>
              </label>
              <textarea
                style={{ width: "305px", height: "40px" }}
                id="SurgeryName"
                name="SurgeryName"
                value={OtSheet.SurgeryName}
                onChange={handleOtChange}
                required
              />
            </div>

            <div className="Otdoctor_intra_Con_2 with_increse_85">
              <label htmlFor="OperationNotes">
                Operation Notes<span>:</span>
              </label>
              <textarea
             

                id="OperationNotes"
                name="OperationNotes"
                value={OtSheet.OperationNotes}
                onChange={handleOtChange}
                required
              />
            </div>
            <div className="OtMangementForm_1 djkwked675">
              <label htmlFor="PostOfInstructions">
              Post Op Instructions <span>:</span>
              </label>
              <textarea
                style={{ width: "305px", height: "40px" }}
                id="PostOfInstructions"
                name="PostOfInstructions"
                value={OtSheet.PostOfInstructions}
                onChange={handleOtChange}
                required
              />
            </div>
            </div>
            <br />
            <div className="Register_btn_con">
          <button className="RegisterForm_1_btns" onClick={handleSubmitOt}>
            Submit
          </button>
        </div>
        {/* <ToastAlert Message={toast.message} Type={toast.type} /> */}
        </div>
    </>
  );
}

export default OtNeuroSurgery;


