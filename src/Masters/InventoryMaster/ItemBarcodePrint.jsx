import React, { useRef, useEffect } from "react";
import Barcode from "react-barcode";
import ReactToPrint from "react-to-print";

// Function to generate barcode data
const generateItemData = (count, data) => {
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
  size: 4cm 2cm !important;
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
  .barcode_container_print_data_new {
    width: 4cm !important;
    height: 2cm !important;
    margin: 0 !important;
    padding: 0 !important;
    page-break-inside: avoid !important;
    page-break-after: always !important;
    // display: block !important;
  }
  .parent_barcode_div_new {
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
    gap: 0px !important;
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

const ItemBarcodePrint = ({ rowData }) => {
  const componentRef = useRef();
  const itemData = generateItemData(rowData.PrintCount, rowData);

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

  return (
    <>
      <style>{printBarcodeStyles}</style>
      <div className="div_grand_parent">
        <div className="parent_barcode_div_new" ref={componentRef}>
          {itemData.map((item, index) => (
            <div className="barcode_container_print_data_new" key={index}>
             <div className="jcfujd_p9"> <p className="barcode-label">{item.name} / {item.code} / {item.batch}</p>
             </div>
              <Barcode
                value={item.barcode}
                height={30}
                width={1}
                displayValue={false}
                lineColor="Black"
                margin={0}
                renderAs="svg"
              />
              <div className="jcfujd_p9">
              <p className="barcode-label">Batch : {item.batch}</p>
              </div>
            </div>
          ))}
        </div>
        <ReactToPrint
          trigger={() => (
            <div className="print-btn">
              <button className="RegisterForm_1_btns">Print</button>
            </div>
          )}
          content={() => componentRef.current}
          pageStyle={printBarcodeStyles}
          onBeforeGetContent={() => new Promise(resolve => {
            // Small delay to ensure all barcodes are fully rendered
            setTimeout(() => {
              resolve();
            }, 500);
          })}
        />
      </div>
    </>
  );
};

export default ItemBarcodePrint;