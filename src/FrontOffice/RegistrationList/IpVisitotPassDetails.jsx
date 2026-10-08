import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../OtManagement/OtManagement.css";
import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from '@mui/icons-material/Remove';


const IpVisitorPassDetails = ({rowData}) => {
//   const Registeredit = useSelector((state) => state.Frontoffice?.Registeredit);
  console.log("egggggggggggg", rowData);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const [getdata, setgetdata] = useState(false);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const [AdmitCard, setAdmitCard] = useState({});
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
  const componentRef = useRef();


  const [visitorNames, setVisitorNames] = useState([""]);

  const [selectedPrintOption, setSelectedPrintOption] = useState("1"); // Default: Print 1


  const handlePrintSelection = (e) => {
    setSelectedPrintOption(e.target.value);
  };

  const handleAddVisitor = () => {
    setVisitorNames([...visitorNames, ""]);
  };

  const removeVisitorNameField = (index) => {
    setVisitorNames(visitorNames.filter((_, i) => i !== index));
  };

  const handleVisitorChange = (index, value) => {
    const updatedVisitors = [...visitorNames];
    updatedVisitors[index] = value;
    setVisitorNames(updatedVisitors);
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
            <div className="DivCenter_container">Patient Visitor Card</div>
            <div className="RegisForm_con_Admit handover">
            {visitorNames.map((visitor, index) => (
                <div className="RegisForm_Admit" key={index}>
                  <label>
                    Visitor Name {index + 1}
                    <span>:</span>
                  </label>
                  <input
                    type="text"
                    value={visitor}
                    onChange={(e) => handleVisitorChange(index, e.target.value)}
                  />
                  <button onClick={handleAddVisitor} className="add-visitor-button">
                <AddIcon />
               
              </button>
              {visitorNames.length > 1 && (
                    <button onClick={() => removeVisitorNameField(index)}><RemoveIcon /></button>
                  )}
                </div>
              ))}
              

              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Named
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
                  <Barcode
                    value={rowData?.RegistrationId}
                    lineColor="Black"
                    height={35}
                    width={1.2}
                    fontSize={10}
                    displayValue={false}
                  />
                ) : (
                  "N/A"
                )}
              </div>

              <div className="RegisForm_Admit">
                <label htmlFor="">Print Copies<span>:</span></label>
                <input
                  type="radio"
                  name="printOption"
                  value="1"
                  checked={selectedPrintOption === "1"}

                  onChange={handlePrintSelection}
                /> Print 1
                <input
                  type="radio"
                  name="printOption"
                  value="2"
                  checked={selectedPrintOption === "2"}

                  onChange={handlePrintSelection}
                /> Print 2
              </div>
            </div>
            <div className="please_return_p">
            <h6>* PLEASE RETURN TO RECEPTION AND SIGN OUT BEFORE LEAVING THE PREMISES *</h6>
            </div>  
            
            </div>
          <div className="Main_container_Btn">
            <button onClick={handlesave}>{"Print"}</button>
          </div>
          <ToastAlert Message={toast.message} Type={toast.type} />
        </>
      ) : (
        <PrintContent
          ref={componentRef}
          style={{
            marginTop: "50px",
            display: "flex",
            justifyContent: "center",
          }}
        >

{selectedPrintOption === "1" && (

<div className="form-section5 handover_con erfewf_Asck9 page-break">
<h2>Patient Visitor Card</h2>
<table className="RegisForm_con_Admit handover RegisForm_Admit_print">
  <tbody>
    {visitorNames.map((visitor, index) => (
      <tr className="RegisForm_Admit RegisForm_Admit_print" key={index}>
        <td><label>Visitor Name {index + 1}<span>:</span> </label></td>
        <td>
          <input
            type="text"
            value={visitor}
            onChange={(e) => handleVisitorChange(index, e.target.value)}
          />
        </td>
      </tr>
    ))}
    <tr className="RegisForm_Admit RegisForm_Admit_print">
      <td><label>Name<span>:</span> </label></td>
      <td>{rowData?.PatientName}</td>
    </tr>
    <tr className="RegisForm_Admit RegisForm_Admit_print">
      <td><label>Age<span>:</span> </label></td>
      <td>{rowData?.Age}</td>
    </tr>
    <tr className="RegisForm_Admit RegisForm_Admit_print">
      <td><label>D.O.A<span>:</span> </label></td>
      <td>{rowData?.AdmissionDate}</td>
    </tr>
    <tr className="RegisForm_Admit RegisForm_Admit_print">
      <td><label>Contact No<span>:</span> </label></td>
      <td>{rowData?.PhoneNo}</td>
    </tr>
    <tr className="RegisForm_Admit RegisForm_Admit_print">
      <td><label>Doctor/Specialization<span>:</span> </label></td>
      <td>{`${rowData?.DoctorName}/${rowData?.Specilization}`}</td>
    </tr>
    <tr className="RegisForm_Admit RegisForm_Admit_print">
      <td><label>Ward/Room No/Bed No<span>:</span> </label></td>
      <td>{`${rowData?.WardName}/${rowData?.RoomNo}/${rowData?.BedNo}`}</td>
    </tr>
    <tr className="RegisForm_Admit RegisForm_Admit_print">
      <td><label>In-Patient No<span>:</span></label></td>
      <td>{rowData?.RegistrationId}</td>
    </tr>
    <tr className="RegisForm_Admit RegisForm_Admit_print">
      <td><label>Barcode<span>:</span> </label></td>
      <td>
        {rowData?.RegistrationId ? (
          <Barcode
            value={rowData?.RegistrationId}
            lineColor="Black"
            height={30}
            width={1}
            fontSize={11}
            displayValue={false}
          />
        ) : (
          "N/A"
        )}
      </td>
    </tr>
  </tbody>
</table>
<div className="please_return_p RegisForm_Admit_print">
  <h6>* PLEASE RETURN TO RECEPTION AND SIGN OUT BEFORE LEAVING THE PREMISES *</h6>
</div>
</div>
)}

{selectedPrintOption === "2" && (
  <>
  
    <div className="form-section5 handover_con erfewf_Asck9 page-break">
      <h2>Patient Visitor Card</h2>
      <table className="RegisForm_con_Admit handover RegisForm_Admit_print">
        <tbody>
          {visitorNames.map((visitor, index) => (
            <tr className="RegisForm_Admit RegisForm_Admit_print" key={index}>
              <td><label>Visitor Name {index + 1}<span>:</span> </label></td>
              <td>
                <input
                  type="text"
                  value={visitor}
                  onChange={(e) => handleVisitorChange(index, e.target.value)}
                />
              </td>
            </tr>
          ))}
          <tr className="RegisForm_Admit RegisForm_Admit_print">
            <td><label>Name<span>:</span> </label></td>
            <td>{rowData?.PatientName}</td>
          </tr>
          <tr className="RegisForm_Admit RegisForm_Admit_print">
            <td><label>Age<span>:</span> </label></td>
            <td>{rowData?.Age}</td>
          </tr>
          <tr className="RegisForm_Admit RegisForm_Admit_print">
            <td><label>D.O.A<span>:</span> </label></td>
            <td>{rowData?.AdmissionDate}</td>
          </tr>
          <tr className="RegisForm_Admit RegisForm_Admit_print">
            <td><label>Contact No<span>:</span> </label></td>
            <td>{rowData?.PhoneNo}</td>
          </tr>
          <tr className="RegisForm_Admit RegisForm_Admit_print">
            <td><label>Doctor/Specialization<span>:</span> </label></td>
            <td>{`${rowData?.DoctorName}/${rowData?.Specilization}`}</td>
          </tr>
          <tr className="RegisForm_Admit RegisForm_Admit_print">
            <td><label>Ward/Room No/Bed No<span>:</span> </label></td>
            <td>{`${rowData?.WardName}/${rowData?.RoomNo}/${rowData?.BedNo}`}</td>
          </tr>
          <tr className="RegisForm_Admit RegisForm_Admit_print">
            <td><label>In-Patient No<span>:</span></label></td>
            <td>{rowData?.RegistrationId}</td>
          </tr>
          <tr className="RegisForm_Admit RegisForm_Admit_print">
            <td><label>Barcode<span>:</span> </label></td>
            <td>
              {rowData?.RegistrationId ? (
                <Barcode
                  value={rowData?.RegistrationId}
                  lineColor="Black"
                  height={30}
                  width={1}
                  fontSize={11}
                  displayValue={false}
                />
              ) : (
                "N/A"
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="please_return_p RegisForm_Admit_print">
        <h6>* PLEASE RETURN TO RECEPTION AND SIGN OUT BEFORE LEAVING THE PREMISES *</h6>
      </div>
    </div>

    {/* Second Card with page break */}
    <div className="form-section5 handover_con erfewf_Asck9" style={{ pageBreakBefore: "always" }}>
      <h2>Patient Visitor Card</h2>
      <table className="RegisForm_con_Admit handover RegisForm_Admit_print">
        <tbody>
          {visitorNames.map((visitor, index) => (
            <tr className="RegisForm_Admit RegisForm_Admit_print" key={index}>
              <td><label>Visitor Name {index + 1}<span>:</span> </label></td>
              <td>
                <input
                  type="text"
                  value={visitor}
                  onChange={(e) => handleVisitorChange(index, e.target.value)}
                />
              </td>
            </tr>
          ))}
          <tr className="RegisForm_Admit RegisForm_Admit_print">
            <td><label>Name<span>:</span> </label></td>
            <td>{rowData?.PatientName}</td>
          </tr>
          <tr className="RegisForm_Admit RegisForm_Admit_print">
            <td><label>Age<span>:</span> </label></td>
            <td>{rowData?.Age}</td>
          </tr>
          <tr className="RegisForm_Admit RegisForm_Admit_print">
            <td><label>D.O.A<span>:</span></label></td>
            <td>{rowData?.AdmissionDate}</td>
          </tr>
          <tr className="RegisForm_Admit RegisForm_Admit_print">
            <td><label>Contact No<span>:</span> </label></td>
            <td>{rowData?.PhoneNo}</td>
          </tr>
          <tr className="RegisForm_Admit RegisForm_Admit_print">
            <td><label>Doctor/Specialization<span>:</span> </label></td>
            <td>{`${rowData?.DoctorName}/${rowData?.Specilization}`}</td>
          </tr>
          <tr className="RegisForm_Admit RegisForm_Admit_print">
            <td><label>Ward/Room No/Bed No<span>:</span> </label></td>
            <td>{`${rowData?.WardName}/${rowData?.RoomNo}/${rowData?.BedNo}`}</td>
          </tr>
          <tr className="RegisForm_Admit RegisForm_Admit_print">
            <td><label>In-Patient No<span>:</span> </label></td>
            <td>{rowData?.RegistrationId}</td>
          </tr>
          <tr className="RegisForm_Admit RegisForm_Admit_print">
            <td><label>Barcode<span>:</span> </label></td>
            <td>
              {rowData?.RegistrationId ? (
                <Barcode
                  value={rowData?.RegistrationId}
                  lineColor="Black"
                  height={30}
                  width={1}
                  fontSize={11}
                  displayValue={false}
                />
              ) : (
                "N/A"
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="please_return_p RegisForm_Admit_print">
        <h6>* PLEASE RETURN TO RECEPTION AND SIGN OUT BEFORE LEAVING THE PREMISES *</h6>
      </div>
    </div>
  </>
)}


        </PrintContent>
      )}
    </>
  );
};

export default IpVisitorPassDetails;
