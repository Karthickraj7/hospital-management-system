import React, { useEffect, useState,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../OtManagement/OtManagement.css";
import axios from "axios";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";


const TokenPatient = ({rowData}) => {

  console.log("rowData",rowData)
  
 
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
  const componentRef = useRef();

  const handleonchange = (e) => {
    // const { name, value } = e.target
    // setAdmitCard((prev) => ({
    //   ...prev,
    //   [name]: value
    // }))s
  };
  const handlesave = () => {
    setIsPrintButtonVisible(false);
    setTimeout(() => {
      handlePrint2();
      setIsPrintButtonVisible(true); // Resetting print button visibility
    }, 500); 
  };

  
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
            <div className="DivCenter_container">Token Card</div>
            <div className="RegisForm_con_Admit handover">
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Patient Name
                  <span>:</span>
                </label>
                {rowData?.PatientName}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Patient ID
                  <span>:</span>
                </label>
                {rowData?.PatientId}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Token No
                  <span>:</span>
                </label>
                {rowData?.TokenNo}
              </div>
           
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Doctor Name
                  <span>:</span>
                </label>
                {rowData?.DoctorName}

              </div>

              <div className="RegisForm_Admit">
                <label htmlFor="">
                Speciality  
                  <span>:</span>
                </label>
                {rowData?.Specilization}
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
                  Patient Name
                  <span>:</span>
                </label>
                {rowData?.PatientName}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Patient ID
                  <span>:</span>
                </label>
                {rowData?.PatientId}
              </div>
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Token No
                  <span>:</span>
                </label>
                {rowData?.TokenNo}
              </div>
           
              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Doctor Name
                  <span>:</span>
                </label>
                {rowData?.DoctorName}

              </div>

              <div className="RegisForm_Admit">
                <label htmlFor="">
                Speciality  
                  <span>:</span>
                </label>
                {rowData?.Specilization}
              </div>

            </div>
          </div>
      </PrintContent>)}
    </>
  );
};

export default TokenPatient;
