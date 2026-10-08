// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import Barcode from "react-barcode";
// import ReactToPrint from "react-to-print";
// import "../Report/barcode.css";

// const printBarcodeStyles = `
// @page {
//   size: 4cm 2.5cm !important; /* Ensure that the size fits the content properly */
//   margin: 0 !important; /* Remove margins to prevent extra space */
//   padding: 0 !important;
//   margin-bottom: 0 !important;
// }
// @media print {
//   .pageBreak {
//     page-break-before: always !important; /* Ensure that page breaks are handled */
//   }
//   .barcode_container_print_data_new {
//     margin: 0 !important;
//     page-break-inside: avoid !important; /* Avoid breaking a single barcode item into pages */
//   }
//   .parent_barcode_div_new{
//   margin: 0 !important;
//   padding : 0 !important;
//   gap: 0px !important;
//   }
// }
// `;

// export const BarcodePrint = () => {
//   // const [value, setValue] = useState(null);
//   const componentRef = useRef();
//   const [department, setDepartment] = useState([]);
//   const urllink = useSelector((state) => state.userRecord?.UrlLink);
//   const Printdata = useSelector((state) => state.userRecord?.PrintBarcode);
//   // const [barcodeimages, setBarcodeImages] = useState([]);

//   useEffect(() => {
//     axios
//       .get(
//         `${urllink}Lab/getfor_barcode_details_print?invoice=${Printdata?.Billing_Invoice}`
//       )
//       .then((response) => {
//         console.log(response);
//         setDepartment(response.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, [Printdata, urllink]);

//   // const handleSubmit = async () => {
//   //   if (department.length > 0 && Printdata) {
//   //     try {
//   //       const dataToSend = department.map((test) => ({
//   //         invoice_no: Printdata.Billing_Invoice,
//   //         barcode_id: test.barcode_id,
//   //         patientid: Printdata.Patient_Id,
//   //         visitid: Printdata.Visit_Id,
//   //         patientname: Printdata.Patient_Name,
//   //         test_name: test.Test_Name,
//   //         test_code: test.Test_Code,
//   //       }));

//   //       const formData = new FormData();
//   //       dataToSend.forEach((item, index) => {
//   //         Object.keys(item).forEach((key) => {
//   //           formData.append(`${key}[${index}]`, item[key]);
//   //         });
//   //       });

//   //       const response = await axios.post(
//   //         `${urllink}Billing/insertbarcode_id`,
//   //         formData
//   //       );
//   //       console.log("Barcode IDs inserted:", response.data);

//   //       const barcodeResponse = await axios.get(
//   //         `${urllink}Billing/getbarcodeimage?patientid=${Printdata.Patient_Id}&visitid=${Printdata.Visit_Id}&invoice=${Printdata.Billing_Invoice}`
//   //       );
//   //       console.log("Barcode images fetched:", barcodeResponse.data);
//   //       setBarcodeImages(barcodeResponse.data);
//   //     } catch (error) {
//   //       console.error("Error inserting or fetching barcode data:", error);
//   //     }
//   //   }
//   // };
//   const getCurrentDateTime = () => {
//     const today = new Date();

//     // Format date
//     const dd = String(today.getDate()).padStart(2, "0");
//     const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
//     const yyyy = today.getFullYear();
//     const yy = yyyy.toString().slice(-2); // Get the last two digits of the year

//     // Format time
//     const hh = String(today.getHours()).padStart(2, "0");
//     const min = String(today.getMinutes()).padStart(2, "0");
//     const sec = String(today.getSeconds()).padStart(2, "0");

//     return `${dd}-${mm}-${yy}  ${hh}:${min}:${sec}`;
//   };

//   const currentDateTime = getCurrentDateTime();

//   return (
//     <>
//       <div className="div_grand_parent">
//         <div
//           className="parent_barcode_div_new"
//           id="requestbarcode"
//           ref={componentRef}
//         >
//           {department.map((test, index) => (
//             <div className="barcode_container_print_data_new" key={index}>
//               <div className="barcode_patient_new hehdfh_jhd">
//                 <div className="jcfujd_p9">
//                   <p>{Printdata?.Patient_Name}</p>
//                 </div>

//                 <div className="fchdj_lfe">
//                   <p>{Printdata?.Age} / {Printdata?.Gender === "Male" ? "M" : Printdata?.Gender === "Female" ? "F" : ""}</p>
//                 </div>

//               </div>

//               {/* {Printdata?.Barcode}*/}
//               <div className="adden_width_barcde_new32n">
//                 <Barcode
//                   value={Printdata?.Barcode}
//                   lineColor="black"
//                   height={42}
//                   width={1.0}               // Adjust for print size
//                   fontSize={14}
//                   displayValue={false}
//                   renderer="svg"          // 🔥 Ensure high-quality SVG rendering
//                 />

//                 <div className="barcode_dept fedfefvv">

//                   <p >{Printdata?.Barcode}</p>
//                 </div>
//               </div>



//               {/* <div className="barcode_dept fedfefvv">
//               </div> */}

//               <div className="barcode_dept fedfefvv">
//                 <p>{test} {currentDateTime}</p>
//               </div>
//             </div>
//           ))}

//           {/* {barcodeimages.length === 0 && (
//             <div className="Register_btn_con">
//               <button
//                 className="RegisterForm_1_btns"
//                 onClick={handleSubmit}
//                 disabled={department.length === 0}
//               >
//                 Submit
//               </button>
//             </div>
//           )} */}
//         </div>

//         <ReactToPrint
//           trigger={() => (
//             <div className="Register_btn_con">
//               <button className="RegisterForm_1_btns">Print</button>
//             </div>
//           )}
//           content={() => componentRef.current}
//           pageStyle={printBarcodeStyles}
//         />
//       </div>
//     </>
//   );
// };



import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Barcode from "react-barcode";
import ReactToPrint from "react-to-print";
import "../Report/barcode.css";
 
const printBarcodeStyles = `
@page {
  size: 4cm 2.5cm !important; /* Ensure that the size fits the content properly */
  margin: 0 !important; /* Remove margins to prevent extra space */
  padding: 0 !important;
  margin-bottom: 0 !important;

  @top-center {
    content: none !important;
  }
  @bottom-center {
    content: none !important;
  }
}
@media print {
  .pageBreak {
    page-break-before: always !important; /* Ensure that page breaks are handled */
  }
  .barcode_container_print_data_new {
    margin: 0 !important;
    page-break-inside: avoid !important; /* Avoid breaking a single barcode item into pages */
  }
  .parent_barcode_div_new{
  margin: 0 !important;
  padding : 0 !important;
  gap: 0px !important;
  }
}
`;
 
export const BarcodePrint = () => {
  // const [value, setValue] = useState(null);
  const componentRef = useRef();
  const [department, setDepartment] = useState([]);
  const [patient_id, setPatientId] = useState([]);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const Printdata = useSelector((state) => state.userRecord?.PrintBarcode);
  // console(Printdata, "printdataaa");
  // const [barcodeimages, setBarcodeImages] = useState([]);
 
  useEffect(() => {
    axios
      .get(
        `${urllink}Lab/getfor_barcode_details_print?invoice=${Printdata?.Billing_Invoice}`
      )
      .then((response) => {
        console.log(response);
        // setDepartment(response.data);
        setDepartment(response.data.departments);
        setPatientId(response.data.patient_id);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [Printdata, urllink]);
 
  const getCurrentDateTime = () => {
    const today = new Date();
 
    // Format date
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const yy = yyyy.toString().slice(-2);
 
    // Format time
    const hh = String(today.getHours()).padStart(2, "0");
    const min = String(today.getMinutes()).padStart(2, "0");
    const sec = String(today.getSeconds()).padStart(2, "0");
 
    return `${dd}-${mm}-${yy}  ${hh}:${min}:${sec}`;
  };
 
  const currentDateTime = getCurrentDateTime();
 
  return (
    <>
      <div className="div_grand_parent">
        <div
          className="parent_barcode_div_new"
          id="requestbarcode"
          ref={componentRef}
        >
          {department.map((test, index) => (
            <div className="barcode_container_print_data_new" key={index}>
              <div className="barcode_patient_new hehdfh_jhd">
                <div className="jcfujd_p9">
                  <p>{Printdata?.Patient_Name}</p>
                </div>
 
                <div className="fchdj_lfe">
                  <p>
                    {Printdata?.Age} /{" "}
                    {Printdata?.Gender === "Male"
                      ? "M"
                      : Printdata?.Gender === "Female"
                      ? "F"
                      : ""}
                  </p>
                </div>
              </div>
 
              <div className="adden_width_barcde_new32n">
                <Barcode
                  value={Printdata?.Barcode}
                  lineColor="black"
                  height={42}
                  width={1.0}
                  fontSize={14}
                  displayValue={false}
                  renderer="svg"
                />
 
                <div className="barcode_dept fedfefvv">
                  <p>
                    {/* {Printdata?.Barcode} / {patient_id} */}
                    {Printdata?.Barcode} /UHID: {patient_id}
                  </p>
                </div>
              </div>
 
              <div className="barcode_dept fedfefvv">
                <p>
                  {test} {currentDateTime}
                </p>
              </div>
            </div>
          ))}
        </div>
 
        <ReactToPrint
          trigger={() => (
            <div className="Register_btn_con">
              <button className="RegisterForm_1_btns">Print</button>
            </div>
          )}
          content={() => componentRef.current}
          pageStyle={printBarcodeStyles}
        />
      </div>
    </>
  );
};
 

