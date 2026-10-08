import React, { useRef } from "react";
import ReactToPrint from "react-to-print";

const PrintableComponent = React.forwardRef((props, ref) => (
  <div ref={ref} className="print-container">
    <div className="page">
      <h1>Page 1</h1>
      <p>This is content for page 1.</p>
    </div>
    <div className="page">
      <h1>Page 2</h1>
      <p>This is content for page 2.</p>
    </div>
    <div className="page">
      <h1>Page 3</h1>
      <p>This is content for page 3.</p>
    </div>
  </div>
));

const PrintPage = () => {
  const componentRef = useRef();

  const addPageNumbers = () => {
    const printContainer = componentRef.current;
    const pages = printContainer.querySelectorAll(".page");
    pages.forEach((page, index) => {
      const pageNumber = document.createElement("div");
      pageNumber.className = "page-number";
      pageNumber.textContent = `Page ${index + 1}`;
      page.appendChild(pageNumber); // Add the page number to each page
    });
  };

  const handleBeforePrint = () => {
    addPageNumbers(); // Add page numbers dynamically before printing
  };

  return (
    <div>
      <ReactToPrint
        trigger={() => <button>Print Document</button>}
        content={() => componentRef.current}
        onBeforePrint={handleBeforePrint}
      />
      <PrintableComponent ref={componentRef} />
    </div>
  );
};

export default PrintPage;
