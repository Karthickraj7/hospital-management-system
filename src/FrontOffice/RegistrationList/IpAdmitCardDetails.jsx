import React, { useEffect, useState,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../OtManagement/OtManagement.css";
import axios from "axios";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";


const IpAdmitCardDetails = ({rowData}) => {

  console.log("rowData",rowData)
  
  // const Registeredit = useSelector((state) => state.Frontoffice?.Registeredit);
  // console.log("egggggggggggg", Registeredit);

  // const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  // const toast = useSelector((state) => state.userRecord?.toast);
  // const UserData = useSelector((state) => state.userRecord?.UserData);
  // const [getdata, setgetdata] = useState(false);
  // const dispatchvalue = useDispatch();
  // const navigate = useNavigate();
  // const [AdmitCard, setAdmitCard] = useState({});
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
  const componentRef = useRef();

  const handleonchange = (e) => {
    // const { name, value } = e.target
    // setAdmitCard((prev) => ({
    //   ...prev,
    //   [name]: value
    // }))
  };
  const handlesave = () => {
    setIsPrintButtonVisible(false);
    setTimeout(() => {
      handlePrint2();
      setIsPrintButtonVisible(true); // Resetting print button visibility
    }, 500); 
  };

  // useEffect(() => {
  //   axios.get(`${UrlLink}Frontoffice/post_ip_handover_details?RegistrationId=${Registeredit?.RegistrationId}`,)
  //     .then((res) => {
  //       const ress = res.data;
  //       setAdmitCard({
  //         ReasonForAdmission: ress.ReasonForAdmission,
  //         PatientConditionOnAdmission: ress.PatientConditionOnAdmission,
  //         PatientFileGiven: ress.PatientFileGiven,
  //         AadharGiven: ress.AadharGiven,
  //         getdata: true
  //       });

  //     })
  //     .catch((err) => {
  //       setAdmitCard({
  //         ReasonForAdmission: "",
  //         PatientConditionOnAdmission: "",
  //         PatientFileGiven: "No",
  //         AadharGiven: "No",
  //         getdata: false
  //       });
  //       console.log(err);
  //     });
  // }, [getdata, UrlLink, Registeredit])
  const PrintContent = React.forwardRef((props, ref) => {
    return (
      <div ref={ref} id="reactprintcontent">
        {props.children}
      </div>
    );
  });

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: async () => {
      // Additional action after printing, if needed
    },
  });

  return (
    <>
      {isPrintButtonVisible ? (
        <>
          <div className="form-section5 handover_con">
            <div className="DivCenter_container">Patient Admit Card</div>
            <div className="RegisForm_con_Admit handover">
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Name
                  <span>:</span>
                </label>
                {rowData?.PatientName}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Age
                  <span>:</span>
                </label>
                {rowData?.Age}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  D.O.A
                  <span>:</span>
                </label>
                {rowData?.AdmissionDate}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Contact No
                  <span>:</span>
                </label>
                {rowData?.PhoneNo}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Doctor/Specialization
                  <span>:</span>
                </label>
                {`${rowData?.DoctorName}/${rowData?.Specialization}`}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Ward/Room No/Bed No
                  <span>:</span>
                </label>
                {`${rowData?.WardName}/${rowData?.RoomNo}/${rowData?.BedNo}`}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  In-Patient No
                  <span>:</span>
                </label>
                {rowData?.RegistrationId}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Barcode
                  <span>:</span>
                </label>
                {rowData?.RegistrationId ? (
                  <Barcode
                  
                  value={rowData?.RegistrationId} 
                  lineColor="Black"
                  height={35}
                  width={1.2}
                  fontSize={10}
                  displayValue={false}/>
                ) : (
                  "N/A"
                )}
              </div>
            </div>
          </div>
          <div className="Main_container_Btn">
            <button onClick={handlesave}>{"Print"}</button>
          </div>
          {/* <ToastAlert Message={toast.message} Type={toast.type} /> */}
        </>
      ) : (<PrintContent ref={componentRef}
        style={{
          marginTop: "50px",
          display: "flex",
          justifyContent: "center",
        }}>


          <div className="form-section5 handover_con erfewf_Asck9">
          <h2 className="">Patient Admit Card</h2>   
                   <div className="RegisForm_con_Admit handover">
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Name
                  <span>:</span>
                </label>
                {rowData?.PatientName}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Age
                  <span>:</span>
                </label>
                {rowData?.Age}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  D.O.A
                  <span>:</span>
                </label>
                {rowData?.AdmissionDate}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Contact No
                  <span>:</span>
                </label>
                {rowData?.PhoneNo}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Doctor/Specialization
                  <span>:</span>
                </label>
                {`${rowData?.DoctorName}/${rowData?.Specilization}`}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Ward/Room No/Bed No
                  <span>:</span>
                </label>
                {`${rowData?.WardName}/${rowData?.RoomNo}/${rowData?.BedNo}`}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  In-Patient No
                  <span>:</span>
                </label>
                {rowData?.RegistrationId}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Barcode
                  <span>:</span>
                </label>
                {rowData?.RegistrationId ? (
                  <Barcode value={rowData?.RegistrationId}
                  lineColor="Black"
                  height={35}
                  width={1.2}
                  fontSize={10}
                  displayValue={false}/> 
                ) : (
                  "N/A"
                )}
              </div>
            </div>
          </div>
      </PrintContent>)}
    </>
  );
};

export default IpAdmitCardDetails;
