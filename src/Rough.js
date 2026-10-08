import React, { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";

const Jjjjjj = () => {
  const printRef = useRef();
  const [pages, setPages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const testResults = Array.from({ length: 150 }, (_, index) => ({
    testName: `Test ${index + 1}`,
    result: `${Math.floor(Math.random() * 100)}`,
    range: "10 - 90",
  }));

  useEffect(() => {
    const pageHeight = 1122; // Approximate height for an A4 page at 96dpi
    const contentHeight = printRef.current.scrollHeight;
    const estimatedTotalPages = Math.ceil(contentHeight / pageHeight);

    // Slice results into pages based on estimated height
    const resultsPerPage = Math.floor(testResults.length / estimatedTotalPages);
    const paginatedResults = [];

    for (let i = 0; i < testResults.length; i += resultsPerPage) {
      paginatedResults.push(testResults.slice(i, i + resultsPerPage));
    }

    setPages(paginatedResults);
    setTotalPages(estimatedTotalPages);
  }, [testResults]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Patient Report",
  });

  return (
    <div>
      <button onClick={handlePrint}>Print Report</button>

      {/* Printable Content */}
      <div ref={printRef} style={{ padding: "20px" }}>
        <h2>Hospital Name</h2>
        <p>Address Line 1, City, State, Zip</p>
        <p>Contact: (123) 456-7890</p>
        <hr />

        {pages.map((page, pageIndex) => (
          <div key={pageIndex} style={{ marginBottom: "20px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              {/* Table Header */}
              <thead>
                <tr>
                  <th style={{ border: "1px solid #000", padding: "8px" }}>
                    Test Name
                  </th>
                  {/* <th style={{ border: '1px solid #000', padding: '8px' }}>Result</th> */}
                  <th style={{ border: "1px solid #000", padding: "8px" }}>
                    Normal Range
                  </th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {page.map((test, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                      {test.testName}
                    </td>
                    {/* <td style={{ border: '1px solid #000', padding: '8px' }}>{test.result}</td> */}
                    <td style={{ border: "1px solid #000", padding: "8px" }}>
                      {test.range}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      borderTop: "2px solid #000",
                      paddingTop: "10px",
                      textAlign: "center",
                    }}
                  >
                    <p>Lab Address: 456 Lab St., City, State, Zip</p>
                    <p>Total Tests: {testResults.length}</p>
                  </td>
                </tr>
              </tfoot>
            </table>
            {/* Footer with Page Number */}

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <p>
                Page {pageIndex + 1} of {totalPages}
              </p>
            </div>

            {pageIndex < pages.length - 1 && (
              <div style={{ pageBreakAfter: "always" }}></div>
            )}
          </div>
        ))}
      </div>

      {/* Styles for printing */}
      <style>
        {`
                    @media print {
                        body {
                            -webkit-print-color-adjust: exact;
                        }

                        /* Force page break */
                        div[style*="page-break-after: always"] {
                            display: block;
                            height: 0;
                            page-break-after: always;
                        }

                        /* Prevent table row breaks across pages */
                        table {
                            page-break-inside: auto;
                        }

                        thead {
                            display: table-header-group;
                        }

                        tfoot {
                            display: table-footer-group;
                        }

                        tbody tr {
                            page-break-inside: avoid;
                        }
                    }
                `}
      </style>
    </div>
  );
};

export default Jjjjjj;



