// import React, { useState, useRef, useEffect } from "react";
// import Barcode from "react-barcode";
// import ReactToPrint from "react-to-print";
// import Barcodedummy from '../../Assets/Barcode.jpg';
// import { useDispatch, useSelector } from 'react-redux';
// import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';

// import axios from "axios";


// import {
//   differenceInYears,
//   format,
//   startOfYear,
//   subYears,
//   isBefore,
// } from "date-fns";

// // Function to generate barcode data
// const generateItemData = (count, data) => {
//   const currentDate = new Date();
//   const Formdate = format(currentDate, "dd.MM.yyyy");

//   const itemData = [];
//   for (let i = 0; i < count; i++) {
//     itemData.push({
//       name: data.ItemName,
//       code: data.ItemCode,
//       batch: data.BatchNo,
//       barcode: `${data.ItemCode}-${data.BatchNo}-${i + 1}`, // Unique barcode format
//     });
//   }
//   return itemData;
// };

// // CSS for barcode print styling
// const printBarcodeStyles = `
// @page {
//   size: 8.3cm 5.3cm !important;
//   margin: 0 !important;
//   padding: 0 !important;
//   margin-bottom: 0 !important;
// }
// @media print {
//   body {
//     margin: 0;
//     padding: 0;
//   }
//   .pageBreak {
//     page-break-before: always !important;
//   }


//   .barcode-label {
//     margin: 0 !important;
//     padding: 0 !important;
//     font-size: 8px !important;
//     line-height: 1 !important;
//   }
//   svg {
//     display: block !important;
//     width: 100% !important;
//   }
// }`;

// const SmartCard = ({ rowData }) => {
//   const currentDate = new Date();
//   const Formdate = format(currentDate, "dd/MM/yyyy");
//   const componentRef = useRef();
//   const itemData = generateItemData(rowData.PrintCount, rowData);
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const dispatchvalue = useDispatch();
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const printRef = useRef(null);

//   console.log(rowData, "rowData")

  
//   const [RegisterData, setRegisterData] = useState({
//     PatientId: '',
//     ExistingPtNo: '',
//     Title: '',
//     FirstName: '',
//     MiddleName: '',
//     SurName: '',
//     Gender: '',
//     SpouseName: '',
//     FatherName: '',
//     DOB: '',
//     Age: '',
//     Pincode: '',
//     DoorNo: '',
//     Street: '',
//     Area: '',
//     City: '',
//     District: '',
//     State: '',
//     Country: '',
//   });

//   const [SmartCard,setSmartCard]= useState({
//     CardValidityYear:'',
//     FromValidityDate:'',
//     ToValidityDate:'',
//   })

//   console.log(SmartCard,'SmartCard');
  
  
//   useEffect(() => {
//     if (rowData) {
//       setRegisterData({
//         PatientId: rowData.PatientId || '',
//         ExistingPtNo: rowData.ExistingPtNo || '',
//         Title: rowData.Title || '',
//         FirstName: rowData.FirstName || '',
//         MiddleName: rowData.MiddleName || '',
//         SurName: rowData.SurName || '',
//         Gender: rowData.Gender || '',
//         SpouseName: rowData.SpouseName || '',
//         FatherName: rowData.FatherName || '',
//         DOB: rowData.DOB || '',
//         Age: rowData.Age || '',
//         Pincode: rowData.Pincode || '',
//         DoorNo: rowData.DoorNo || '',
//         Street: rowData.Street || '',
//         Area: rowData.Area || '',
//         City: rowData.City || '',
//         District: rowData.District || '',
//         State: rowData.State || '',
//         Country: rowData.Country || '',
//       });
//     }
//   }, [rowData]);
  

//   // Use effect to ensure barcodes are fully rendered before printing
//   useEffect(() => {
//     // Force repaint of SVG elements
//     if (componentRef.current) {
//       const svgElements = componentRef.current.querySelectorAll('svg');
//       svgElements.forEach(svg => {
//         svg.setAttribute('width', svg.getAttribute('width'));
//       });
//     }
//   }, [itemData]);


 
//   const handleSmartcardSubmitAndPrint = async () => {
//     const data = {
//       ...RegisterData,
//       created_by: userRecord?.username || ''
//     };
  
//     try {
//       const res = await axios.post(`${UrlLink}Frontoffice/patient_smartcard_details_view`, data);
//       const resData = res.data;

//       console.log(resData,'resData----');
      
//       const mess = Object.values(resData)[0];
//       const typp = Object.keys(resData)[0];
  
//       dispatchvalue({
//         type: 'toast',
//         value: { message: mess, type: typp },
//       });
  
//       setRegisterData({
//         PatientId: '',
//         ExistingPtNo: '',
//         Title: '',
//         FirstName: '',
//         MiddleName: '',
//         SurName: '',
//         Gender: '',
//         SpouseName: '',
//         FatherName: '',
//         DOB: '',
//         Age: '',
//         Pincode: '',
//         DoorNo: '',
//         Street: '',
//         Area: '',
//         City: '',
//         District: '',
//         State: '',
//         Country: '',
//       });
  
//       // After data is saved, trigger the print
//       if (printRef.current) {
//         printRef.current.handlePrint();
//       }
  
//     } catch (err) {
//       console.error(err);
//       dispatchvalue({
//         type: 'toast',
//         value: { message: 'Error occurred while submitting data.', type: 'error' },
//       });
//     }
//   };
  

//   useEffect(() => {
//     if (rowData && rowData.PatientId) {
//       console.log("oooooooo----------");
  
//       axios
//         .get(
//           `${UrlLink}Frontoffice/Get_Patient_SmartCard_Details_link?PatientId=${rowData.PatientId}`
//         )
//         .then((res) => {
//           const data = res.data; // Assume the response data contains the patient details
  
//           console.log(data, "iiiii---------");
  
//           if (data && Object.keys(data).includes("CardValidityYear")) {
//             setSmartCard((prev) => ({
//               ...prev,
//               CardValidityYear: data.CardValidityYear || "",
//               FromValidityDate: data.FromValidityDate || "",
//               ToValidityDate: data.ToValidityDate || "",
//             }));
//           }
//         })
//         .catch((err) => {
//           console.error("Error fetching patient data:", err);
//         });
//     }
//   }, [rowData, UrlLink]);
    
  
  
//   return (
//     <>
      

//       <style>{printBarcodeStyles}</style>
//       <div className="div_grand_parent">

//         {/* {SmartCard.FromValidityDate && SmartCard.ToValidityDate && (
//           <div style={{ textAlign: "center", marginBottom: "10px" }}>
//             <p><strong>Card Validity:</strong></p>
//             <p>From: {SmartCard.FromValidityDate}</p>
//             <p>To: {SmartCard.ToValidityDate}</p>
//           </div>
//         )} */}

//         <div className="smartcard_003" id="printable-card" ref={componentRef}>
//           <div className="smartcard_header_004">
//             <h2 className="college_name_005"></h2>
//             {rowData?.PatientId && (
//               <div style={{ textAlign: "center", marginTop: "0.1px" }}>

//                 <Barcode
//                   value={rowData.PatientId}
//                   lineColor="Black"
//                   height={28}

//                   width={1}
//                   fontSize={10}
//                   displayValue={false}
//                   margin={0}
                  
//                 />

                
//               </div>
//             )}
//           </div>
//           <div className="smartcard_body_007">
//             <span
//               // src="/patient-image.jpg"
//               // alt="Patient"
//               className="patient_image_008"
//             />
//             <div className="patient_details_009">
//               <p> {rowData?.PatientName}</p>
//               <p>New Id : {rowData?.PatientId}</p>
//               {/* <p>Old Id : {rowData?.ExistingPtNo}</p> */}
//               {rowData?.ExistingPtNo && <p>Old Id : {rowData.ExistingPtNo}</p>}
//               <p>{rowData?.AgeGender}</p>
//               {/* <p>{rowData?.Age} / {rowData?.DOB} / {rowData?.Gender}</p> */}
//               <p> {Formdate} </p>
//               {/* <p >{`${rowData?.DoorNo},${rowData?.Street},${rowData?.Area},${rowData?.City},${rowData?.District},${rowData?.State},${rowData?.Country}-${rowData?.Pincode}`} */}
//               <p>
//                 {
//                   [
//                     rowData?.DoorNo,
//                     rowData?.Street,
//                     rowData?.Area,
//                     rowData?.City,
//                     rowData?.District,
//                     rowData?.State,
//                     rowData?.Country
//                   ]
//                   .filter(Boolean)
//                   .join(', ')
//                 }
//                 {rowData?.Pincode ? ` - ${rowData.Pincode}` : ''}
//               </p>
              
             
//             </div>
//           </div>

//           <div className="dregrdgh_hgf">
//             <h2 className="college_name_005"></h2>
//             <img
//               // src={Barcodedummy}
//               // alt="Barcode"
//               className=""
//             />
//           </div>

//         </div>

//         {/* <ReactToPrint
//           trigger={() => (
//             <div className="print-btn">
//               <button className="RegisterForm_1_btns" onClick={handlesubmitSmartcard}>Print</button>
//             </div>
//           )}
//           content={() => componentRef.current}
//           pageStyle={printBarcodeStyles}
//           onBeforeGetContent={() => new Promise(resolve => {
//             // Small delay to ensure all barcodes are fully rendered
//             setTimeout(() => {
//               resolve();
//             }, 500);
//           })}
//         /> */}


//         <ReactToPrint
//           ref={printRef}
//           trigger={() => <></>} // Invisible trigger
//           content={() => componentRef.current}
//           pageStyle={printBarcodeStyles}
//           onBeforeGetContent={() => new Promise(resolve => {
//             // Small delay to ensure all barcodes are fully rendered
//             setTimeout(() => {
//               resolve();
//             }, 5000);
//           })}
//         />

//         <div className="Register_btn_con">
//           <button className="RegisterForm_1_btns" onClick={handleSmartcardSubmitAndPrint}>
//             Print
//           </button>
//         </div>

//       </div>
      
//       {/* <ToastAlert Message={toast?.message} Type={toast?.type} /> */}
      
//     </>
//   );
// };

// export default SmartCard;


import React, { useState, useRef, useEffect } from "react";
import Barcode from "react-barcode";
import ReactToPrint from "react-to-print";
import Barcodedummy from '../../Assets/Barcode.jpg';
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';

import axios from "axios";


import {
  differenceInYears,
  format,
  startOfYear,
  subYears,
  isBefore,
} from "date-fns";

// Function to generate barcode data
const generateItemData = (count, data) => {
  const currentDate = new Date();
  const Formdate = format(currentDate, "dd.MM.yyyy");

  const itemData = [];
  for (let i = 0; i < count; i++) {
    itemData.push({
      name: data.ItemName,
      code: data.ItemCode,
      batch: data.BatchNo,
      barcode: `${data.ItemCode}-${data.BatchNo}-${i + 1}`, // Unique barcode format
    });
  }
  return itemData;
};

// CSS for barcode print styling
const printBarcodeStyles = `
@page {
  size: 8.3cm 5.3cm !important;
  margin: 0 !important;
  padding: 0 !important;
  margin-bottom: 0 !important;
}
@media print {
  body {
    margin: 0;
    padding: 0;
  }
  .pageBreak {
    page-break-before: always !important;
  }


  .barcode-label {
    margin: 0 !important;
    padding: 0 !important;
    font-size: 8px !important;
    line-height: 1 !important;
  }
  svg {
    display: block !important;
    width: 100% !important;
  }
}`;

const SmartCard = ({ rowData }) => {
  const currentDate = new Date();
  const Formdate = format(currentDate, "dd/MM/yyyy");
  const componentRef = useRef();
  const itemData = generateItemData(rowData.PrintCount, rowData);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const dispatchvalue = useDispatch();
  const toast = useSelector((state) => state.userRecord?.toast);
  const printRef = useRef(null);

  console.log(rowData, "rowData")

  
  const [RegisterData, setRegisterData] = useState({
    PatientId: '',
    ExistingPtNo: '',
    Title: '',
    FirstName: '',
    MiddleName: '',
    SurName: '',
    Gender: '',
    Phone: '',
    SpouseName: '',
    FatherName: '',
    DOB: '',
    Age: '',
    Pincode: '',
    DoorNo: '',
    Street: '',
    Area: '',
    City: '',
    District: '',
    State: '',
    Country: '',
  });

  const [SmartCard,setSmartCard]= useState({
    CardValidityYear:'',
    FromValidityDate:'',
    ToValidityDate:'',
  })

  console.log(SmartCard,'SmartCard');
  
  
  useEffect(() => {
    if (rowData) {
      setRegisterData({
        PatientId: rowData.PatientId || '',
        ExistingPtNo: rowData.ExistingPtNo || '',
        Title: rowData.Title || '',
        FirstName: rowData.FirstName || '',
        MiddleName: rowData.MiddleName || '',
        SurName: rowData.SurName || '',
        Gender: rowData.Gender || '',
        Phone: rowData.PhoneNo || '',
        SpouseName: rowData.SpouseName || '',
        FatherName: rowData.FatherName || '',
        DOB: rowData.DOB || '',
        Age: rowData.Age || '',
        Pincode: rowData.Pincode || '',
        DoorNo: rowData.DoorNo || '',
        Street: rowData.Street || '',
        Area: rowData.Area || '',
        City: rowData.City || '',
        District: rowData.District || '',
        State: rowData.State || '',
        Country: rowData.Country || '',
      });
    }
  }, [rowData]);
  

  // Use effect to ensure barcodes are fully rendered before printing
  useEffect(() => {
    // Force repaint of SVG elements
    if (componentRef.current) {
      const svgElements = componentRef.current.querySelectorAll('svg');
      svgElements.forEach(svg => {
        svg.setAttribute('width', svg.getAttribute('width'));
      });
    }
  }, [itemData]);


 
  const handleSmartcardSubmitAndPrint = async () => {
    const data = {
      ...RegisterData,
      created_by: userRecord?.username || ''
    };
  
    try {
      const res = await axios.post(`${UrlLink}Frontoffice/patient_smartcard_details_view`, data);
      const resData = res.data;

      console.log(resData,'resData----');
      
      const mess = Object.values(resData)[0];
      const typp = Object.keys(resData)[0];
  
      dispatchvalue({
        type: 'toast',
        value: { message: mess, type: typp },
      });
  
      setRegisterData({
        PatientId: '',
        ExistingPtNo: '',
        Title: '',
        FirstName: '',
        MiddleName: '',
        SurName: '',
        Gender: '',
        Phone: '',
        SpouseName: '',
        FatherName: '',
        DOB: '',
        Age: '',
        Pincode: '',
        DoorNo: '',
        Street: '',
        Area: '',
        City: '',
        District: '',
        State: '',
        Country: '',
      });
  
      // After data is saved, trigger the print
      if (printRef.current) {
        printRef.current.handlePrint();
      }
  
    } catch (err) {
      console.error(err);
      dispatchvalue({
        type: 'toast',
        value: { message: 'Error occurred while submitting data.', type: 'error' },
      });
    }
  };
  

  useEffect(() => {
    if (rowData && rowData.PatientId) {
      console.log("oooooooo----------");
  
      axios
        .get(
          `${UrlLink}Frontoffice/Get_Patient_SmartCard_Details_link?PatientId=${rowData.PatientId}`
        )
        .then((res) => {
          const data = res.data; // Assume the response data contains the patient details
  
          console.log(data, "iiiii---------");
  
          if (data && Object.keys(data).includes("CardValidityYear")) {
            setSmartCard((prev) => ({
              ...prev,
              CardValidityYear: data.CardValidityYear || "",
              FromValidityDate: data.FromValidityDate || "",
              ToValidityDate: data.ToValidityDate || "",
            }));
          }
        })
        .catch((err) => {
          console.error("Error fetching patient data:", err);
        });
    }
  }, [rowData, UrlLink]);
    
  
  
  return (
    <>
      

      <style>{printBarcodeStyles}</style>
      <div className="div_grand_parent">
        <div className="smartcard_003" id="printable-card" ref={componentRef}>
          <div className="smartcard_header_004">
            <h2 className="college_name_005"></h2>
            {rowData?.PatientId && (
              <div style={{ textAlign: "center", marginTop: "0.1px" }}>

                <Barcode
                  value={rowData.PatientId}
                  lineColor="Black"
                  height={28}

                  width={1}
                  fontSize={10}
                  displayValue={false}
                  margin={0}
                  
                />

                
              </div>
            )}
          </div>
          <div className="smartcard_body_007">
            <span
              // src="/patient-image.jpg"
              // alt="Patient"
              className="patient_image_008"
            />
            <div className="patient_details_009">
              <p> {rowData?.PatientName}</p>
              <p>Patient Id : {rowData?.PatientId}</p>
              {/* <p>Old Id : {rowData?.ExistingPtNo}</p> */}
              {rowData?.ExistingPtNo && <p>Old Id : {rowData.ExistingPtNo}</p>}
              <p>{rowData?.AgeGender}</p>
              <p>Ph : {rowData?.PhoneNo}</p>
              {/* <p>{rowData?.Age} / {rowData?.DOB} / {rowData?.Gender}</p> */}
              <p> {Formdate} </p>
              {/* <p >{`${rowData?.DoorNo},${rowData?.Street},${rowData?.Area},${rowData?.City},${rowData?.District},${rowData?.State},${rowData?.Country}-${rowData?.Pincode}`} */}
              <p>
                {
                  [
                    rowData?.DoorNo,
                    rowData?.Street,
                    rowData?.Area,
                    rowData?.City,
                    rowData?.District,
                    rowData?.State,
                    rowData?.Country
                  ]
                  .filter(Boolean)
                  .join(', ')
                }
                {rowData?.Pincode ? ` - ${rowData.Pincode}` : ''}
              </p>
              
             
            </div>
          </div>

          <div className="dregrdgh_hgf">
            <h2 className="college_name_005"></h2>
            <img
              // src={Barcodedummy}
              // alt="Barcode"
              className=""
            />
          </div>

        </div>

       

        <ReactToPrint
          ref={printRef}
          trigger={() => <></>} // Invisible trigger
          content={() => componentRef.current}
          pageStyle={printBarcodeStyles}
          onBeforeGetContent={() => new Promise(resolve => {
            // Small delay to ensure all barcodes are fully rendered
            setTimeout(() => {
              resolve();
            }, 5000);
          })}
        />

        <div className="Register_btn_con">
          <button className="RegisterForm_1_btns" onClick={handleSmartcardSubmitAndPrint}>
            Print
          </button>
        </div>

      </div>
      
      {/* <ToastAlert Message={toast?.message} Type={toast?.type} /> */}
      
    </>
  );
};

export default SmartCard;

