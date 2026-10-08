import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Import the named export
import './Qrcode.css';
import { useSelector } from 'react-redux';

const Qrcodecontainer = () => {
  const data = useSelector(state => state.userRecord?.QRdata)
  console.log(data, 'datata');
  

  const [barcodesize, setbarcodesize] = useState(100); // Default size

  // Convert data to a query string
  const queryString = new URLSearchParams(data).toString();

  // Full URL with query string
  const qrUrl = `https://hims.vesoft.co.in/#/Feedbackform?${queryString}`;

  const handleBarcodeSizeChange = (e) => {
    const newSize = parseInt(e.target.value); // Convert input value to integer
    if (!isNaN(newSize)) {
      setbarcodesize(newSize); // Update size if it's a valid positive number
    }
  };

  return (

    <div className='qr_all_container'>
      <div className="sizebarcode">
        <label htmlFor="barcodesize">Barcode Size <span>:</span></label>
        <input 
          type="number" 
          name="barcodesize" 
          value={barcodesize}
          onChange={handleBarcodeSizeChange}
        />
      </div>
   

      <div className="qr_container_for_print">
        
        <h3>{data.IdentifcationName}</h3>
     
   
      <QRCodeCanvas
        value={qrUrl} // Embed the URL with data
        size={barcodesize} // Dynamically change size
        bgColor="#ffffff"
        fgColor="#000000"
        className="Qr_container"
      />
      <p>Scan this QR code to register with the provided data.</p>

      </div>
    </div>
  );
};

export default Qrcodecontainer;
