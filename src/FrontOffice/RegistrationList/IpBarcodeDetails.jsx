import React, { useRef } from "react";
import Barcode from "react-barcode";
import ReactToPrint from "react-to-print";
import './BarcodeHashwar.css';


// Function to generate sample data dynamically
const generateSampleData = (count, data) => {
  const sampleData = [];
  for (let i = 0; i < count; i++) {
    sampleData.push({
      name: data.PatientName,
      age: data.Age,
      gender: data.Gender,
      barcode: data.RegistrationId,
      PatientId: data.PatientId
    });
  }
  return sampleData;
};

// CSS for printing (A4 paper size, 3 columns, 9 rows = 27 barcodes)
const printBarcodeStylesIP = `
@page {
  // size: A4 portrait !important;
  // margin: 8mm !important;
}



@media print {

  
  .barcode-print-container-newcp {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    grid-template-rows: repeat(9, 1fr) !important;
    gap: 2mm !important;
    width: 100% !important;
    height: 100vh !important;
    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box !important;
    page-break-inside: avoid !important;
  }
  
  .barcode-print-item-newcp {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap:10px;
    text-align: center !important;
    border: 0.5px solid #ddd !important;

    padding: 1.5mm !important;
    box-sizing: border-box !important;
    height: 100% !important;
    min-height: 22mm !important;
    page-break-inside: avoid !important;
  }
  
  .barcode-print-patient-info-newcp {
    margin: 0.5mm 0 !important;
    font-size: 7px !important;
    line-height: 1.1 !important;
    font-weight: 500 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    max-width: 100% !important;
  }
  
  .barcode-print-patient-info-newcp p {
    margin: 0 !important;
    padding: 0 !important;
    font-size: 12px !important;
  }
  
 
  

  .barcode-print-id-info-newcp {
    margin: 0.5mm 0 !important;
    font-size: 7px !important;
    line-height: 1.1 !important;
    font-weight: 500 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    max-width: 100% !important;
  }
  
  .barcode-print-id-info-newcp p {
    margin: 0 !important;
    padding: 0 !important;
    font-size: 12px !important;
}
  

  .barcode-screen-main-wrapper-newcp > *:not(..barcode-print-container-newcp) {
    display: none !important;
  }
}


}
`;

const IpBarcodeDetails = ({ rowData }) => {
  console.log("Barcode Data:", rowData);
  const componentRef = useRef();
  
  // Generate 27 sample barcode entries (3 columns × 9 rows = 27 per page)
  const sampleData = generateSampleData(27, rowData);
  console.log(sampleData, 'Generated Sample Data');
  
  const getCurrentDateTime = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yy = today.getFullYear().toString().slice(-2);
    const hh = String(today.getHours()).padStart(2, "0");
    const min = String(today.getMinutes()).padStart(2, "0");
    return `${dd}-${mm}-${yy} ${hh}:${min}`;
  };
  
  return (
    <div className="barcode-screen-main-wrapper-newcp">
      <div className="barcode-print-container-newcp" ref={componentRef}>
        {sampleData.map((data, index) => (
          <div className="barcode-print-item-newcp" key={index}>
            <div className="barcode-print-patient-info-newcp">
              <p>{data.name} / {data.age} / {data.gender}</p>
            </div>
           
              <Barcode
                value={data.barcode}
                lineColor="Black"
                height={30}
                width={1.0}
                fontSize={6}
                displayValue={false}
                margin={0}
              />
          
            <div className="barcode-print-id-info-newcp">
              <p>{data?.PatientId} / {data.barcode}</p>
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
        pageStyle={printBarcodeStylesIP}
        documentTitle={`Patient_Barcodes_${rowData?.PatientName || 'Unknown'}_${getCurrentDateTime()}`}
      />
    </div>
  );
};

export default IpBarcodeDetails;