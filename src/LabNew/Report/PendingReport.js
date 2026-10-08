import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { saveAs } from 'file-saver';
import { useSelector } from 'react-redux';
import jsPDF from "jspdf";
import Button from "@mui/material/Button";
import 'jspdf-autotable';
import DownloadIcon from '@mui/icons-material/Download';


function PendingReport() {

    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const urllink = useSelector((state) => state.userRecord?.UrlLink);
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const pageSize = 10;
    const totalPages = Math.ceil(rows.length / pageSize);
    const paginatedData = Array.isArray(rows) && rows?.slice(page * pageSize, (page + 1) * pageSize);
    // const [dateQueries, setDateQueries] = useState({});
    const currentMonth = new Date().toISOString().slice(0, 7); // Get current month in YYYY-MM format
    const [datetype, setdatetype] = useState('')
    const [currentdate, setcurrentdate] = useState('')
    const [fromdate, setfromdate] = useState('')
    const [todate, settodate] = useState('')

    const handledownloadreport = (lab) => {
        const datatosend = {
            currentdate: currentdate,
            datetype: datetype,
            fromdate: fromdate,
            todate: todate,
            Labcode: lab.Labcode
        };

        if (datetype) {
            if (datetype === "Currentdate" && !currentdate) {
                alert("Current date must be provided.");
                return;
            } else if (datetype === "Customize" && (!fromdate || !todate)) {
                alert("From date and To date must be provided.");
                return;
            }
        } else {
            alert('Select Date Type');
            return;
        }

        axios.get(`${urllink}Billing/get_report_pending`, { params: datatosend })
            .then((response) => {
                const data = response.data;
                console.log(data); // Check the data structure here
                createPDFReport(data, lab.Lab_Name, datatosend.datetype, datatosend.currentdate, datatosend.fromdate, datatosend.todate);
            })
            .catch((error) => {
                console.error("Error fetching employee data:", error);
            });
    };
  
    // const createPDFReport = (data, labName, dateType, currentDate, fromDate, toDate) => {
    //     const doc = new jsPDF({ orientation: 'landscape' });
    //     doc.setFont('times', 'normal');
    //     const margin = 14;
    //     let currentY = 20;

    //     // Title
    //     doc.setFontSize(20);
    //     doc.text(`Lab Report : ${labName}`, margin, currentY);
    //     currentY += 15;

    //     // Date Type and Dates
    //     doc.setFontSize(12);
    //     doc.text(`Date Type : ${dateType}`, margin, currentY);
    //     currentY += 10;

    //     if (dateType === 'Currentdate') {
    //         doc.text(`Current Date: ${currentDate}`, margin, currentY);
    //     } else if (dateType === 'Customize') {
    //         doc.text(`From Date: ${fromDate}   To Date: ${todate}`, margin, currentY);
    //     }
    //     currentY += 15;

    //     data.forEach((patient, index) => {
    //         // Calculate required height for patient details and test details table
    //         const patientDetailsHeight = (patient.testdetails?.length > 0 ? patient.testdetails.length * 10 : 30) + 40;
    //         const remainingPageHeight = doc.internal.pageSize.height - currentY - margin;

    //         // Add a new page if the content does not fit in the remaining space
    //         if (remainingPageHeight < patientDetailsHeight) {
    //             doc.addPage();
    //             currentY = 20;
    //         }

    //         // Patient Personal Details
    //         doc.setFontSize(16);
    //         doc.text(`Patient Details - ${index + 1}`, margin, currentY);
    //         currentY += 8;
    //         doc.setFontSize(12);
    //         const patientDetails = [
    //             `Patient Name    : ${patient.patientname}`,
    //             `Patient ID      : ${patient.patientid}`,
    //             `Visit ID        : ${patient.visitid}`
    //         ];
    //         patientDetails.forEach((detail, index) => {
    //             doc.text(detail, margin, currentY + (index * 10));
    //         });
    //         currentY += (patientDetails.length * 10) + 10;

    //         // Test Details Table
    //         doc.setFontSize(16);
    //         doc.text("Test Details", margin, currentY);
    //         currentY += 10;

    //         if (patient.testdetails?.length > 0) {
    //             let totalGrossAmount = 0;

    //             const testDetailsBody = patient.testdetails.map(test => {
    //                 totalGrossAmount += parseFloat(test.Gross_Amount) || 0;
    //                 return [
    //                     test.Test_Method === "Group" ? `Group (${test.Group_Name})` : test.Test_Method,
    //                     test.Test_Name,
    //                     test.Gross_Amount,
    //                     test.Location
    //                 ];
    //             });

    //             testDetailsBody.push([
    //                 '', // Empty cell for method
    //                 '', // Empty cell for name
    //                 `Total Amount: ${totalGrossAmount.toFixed(2)}`, // Total amount
    //                 '' // Empty cell for location
    //             ]);

    //             doc.autoTable({
    //                 startY: currentY,
    //                 head: [
    //                     ["Test Method", "Test Name", "Gross Amount", "Location"]
    //                 ],
    //                 body: testDetailsBody,
    //                 theme: 'grid',
    //                 styles: { fontSize: 10 },
    //                 headStyles: { fillColor: [173, 216, 230], textColor: [0, 0, 0] },
    //                 didDrawCell: (data) => {
    //                     if (data.row.index === testDetailsBody.length - 1) {
    //                         currentY = data.cell.y + data.cell.height + 10;
    //                     }
    //                 }
    //             });
    //             currentY = doc.autoTable.previous.finalY + 10;
    //         }
    //     });

    //     // Save PDF
    //     const blob = doc.output('blob');
    //     saveAs(blob, `Lab_Report_${labName}.pdf`);
    // };



    const createPDFReport = (data, labName, dateType, currentDate, fromDate, toDate) => {
        const doc = new jsPDF({ orientation: 'landscape' });
        doc.setFont('times', 'normal');
        const margin = 20;
        let currentY = 20;
        axios
            .get(`${urllink}usercontrol/getAccountsetting`)
            .then((response) => {
              const accountData = response.data;
              const clinicLogo = `data:image/png;base64,${accountData?.clinicLogo}`;
              axios
              .get(
                `${urllink}usercontrol/getClinic?location=${userRecord?.location}`
              )
              .then((response) => {
                const clinicData = response.data[0];
                console.log('clinicData', clinicData);
                
                if (clinicData) {
                  const {
                    ClinicName,
                    doorNo,
                    street,
                    area,
                    city,
                    state,
                    country,
                    pincode,
                  } = clinicData;
                
              doc.addImage(
                clinicLogo, // The base64 image data
                'PNG', // Image format (could be PNG, JPEG, etc.)
                doc.internal.pageSize.getWidth() - 280, // X position
                currentY - 17, // Y position
                40, // Width of the logo
                25 // Height of the logo
              );

              doc.setFontSize(13);
                doc.text(
                  `${ClinicName},`,
                  doc.internal.pageSize.getWidth() - 235,
                  14,
                  
                )

                doc.setFontSize(9);
                doc.text(
                  `${doorNo}, ${street}, `,
                  doc.internal.pageSize.getWidth() - 235,
                  18,
                  
                );
                doc.text(
                  `${area}, ${city},${state}, ${country} - ${pincode}`,
                  doc.internal.pageSize.getWidth() - 235,
                  22,
                 
                );

            }
        // Title
        doc.setFontSize(20);
        doc.text(`Statement of Report : ${labName}`, margin + 140, currentY);
        currentY += 15;
    
        // Date Type and Dates
        doc.setFontSize(12);
        doc.text(`Date Type : ${dateType}`, margin, currentY);
        currentY += 10;
    
        if (dateType === 'Currentdate') {
            doc.text(`Current Date: ${currentDate}`, margin, currentY);
        } else if (dateType === 'Customize') {
            doc.text(`From Date: ${fromDate}   To Date: ${toDate}`, margin, currentY);
        }
        currentY += 15;
    
        // Prepare data for table
        let totalNetAmount = 0;
        let totalPaidAmount = 0;
        let totalBalanceAmount = 0;
    
        const tableBody = data.map((patient) => {
            const testDetailsSet = new Set();
    
            const testDetails = patient.testdetails.map(test => {
                if (test.Test_Method === "Group" && !testDetailsSet.has(test.Group_Name)) {
                    testDetailsSet.add(test.Group_Name);
                    return `${test.Group_Name}`;
                } else if (test.Test_Method !== "Group") {
                    return `${test.Test_Name}`;
                }
                return null;
            }).filter(Boolean).join('\n');
    
            totalNetAmount += parseFloat(patient.Net_Amount) || 0;
            totalPaidAmount += parseFloat(patient.totalPaidAmount) || 0;
            totalBalanceAmount += parseFloat(patient.balanceAmount) || 0;
    
            return [
                patient.patientname,
                patient.patientid,
                patient.visitid,
                testDetails,
                patient.Billing_Date,
                patient.Net_Amount,
                patient.totalPaidAmount,
                patient.balanceAmount,
                patient.status,
                patient.Location
            ];
        });
    
        // Define column headers
        const headers = [
            'Patient Name', 'Patient ID', 'Visit ID', 'Test Details', 'Bill Date',
            'Net Amount', 'Total Paid Amount', 'Balance Amount', 'Status', 'Location'
        ];
    
        // Prepare the footer (total row) as part of the table body
        const totalRow = [
            'Total', '', '', '', '',
            totalNetAmount.toFixed(2),
            totalPaidAmount.toFixed(2),
            totalBalanceAmount.toFixed(2),
            '', ''
        ];
    
        tableBody.push(totalRow); // Add total row to the body
    
        // Add table with body data
        doc.autoTable({
            startY: currentY,
            head: [headers],
            body: tableBody,
            theme: 'grid',
            styles: { fontSize: 10, cellWidth: 'auto' },
            headStyles: { fillColor: [173, 216, 230], textColor: [0, 0, 0] },
            didParseCell: (data) => {
                if (data.row.index === tableBody.length - 1) {
                    // Apply bold style for the last row
                    data.cell.styles.fontStyle = 'bold';
                }
            },    
            didDrawPage: (data) => {
                // Page footer logic for non-table content (if needed)
                const pageCount = doc.internal.getNumberOfPages();
                const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
    
                
            },
        });
    
        // Save PDF
        const blob = doc.output('blob');
        saveAs(blob, `Lab_Report_${labName}.pdf`);
              })

    })
    };
    

    


    useEffect(() => {
        axios
            .get(
                `${urllink}Billing/get_refering_hospitals_for_report?location=${userRecord?.location}`
            )
            .then((response) => {
                console.log(response.data);
                const data = response.data;
                setRows(
                    data.map((row) => ({
                        id: row.EmployeeID,
                        ...row
                    }))
                );
            })
            .catch((error) => {
                console.log(error);
            });
    }, [urllink, userRecord?.location]);


    const handleonchange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'datetype') {
            setdatetype(value)
            setfromdate('')
            settodate('')
            setcurrentdate('')
        } else if (name === 'CurrentDate') {
            setcurrentdate(value)
            setfromdate('')
            settodate('')
        } else if (name === 'FromDate') {
            setfromdate(value)
            setcurrentdate('')
        } else if (name === 'ToDate') {
            settodate(value)
            setcurrentdate('')
        }

    }

    return (
        <div className='appointment'>
            <div className='h_head'>
                <h4>Refering Hospital Report</h4>
            </div>
            <br />
            <div className='RegisFormcon'>
                <div className="RegisForm_1">
                    <label htmlFor='datetype'>
                        Date Type<span>:</span>
                    </label>
                    <select
                        type="text"
                        name="datetype"
                        id='datetype'
                        required
                        onChange={handleonchange}
                    >
                        <option value=''>select</option>
                        <option value='Currentdate'>Current Date</option>
                        <option value='Customize'>Customize</option>
                    </select>
                </div>
                {datetype === 'Currentdate' && (
                    <div className="RegisForm_1">
                        <label htmlFor='CurrentDate'>
                            Current Date<span>:</span>
                        </label>
                        <input
                            type="date"
                            name="CurrentDate"
                            id='CurrentDate'
                            required
                            onChange={handleonchange}
                        >
                        </input>
                    </div>
                )}

                {datetype === 'Customize' && (
                    <>
                        <div className="RegisForm_1">
                            <label htmlFor='FromDate'>
                                From Date<span>:</span>
                            </label>
                            <input
                                type="date"
                                name="FromDate"
                                id='FromDate'
                                required
                                onChange={handleonchange}
                            >

                            </input>
                        </div>
                        <div className="RegisForm_1">
                            <label htmlFor='ToDate'>
                                To Date<span>:</span>
                            </label>
                            <input
                                type="date"
                                name="ToDate"
                                id='ToDate'
                                required
                                onChange={handleonchange}
                            >

                            </input>
                        </div></>
                )}

            </div>
            <div className="Selected-table-container">
                <table className="selected-medicine-table2">
                    <thead>
                        <tr>
                            <th>S No</th>
                            <th>Refering Hospital</th>
                            <th>SourceType</th>
                            <th>Phone No</th>
                            <th>Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(paginatedData) && paginatedData.map((lab, index) => (
                            <tr key={index}>
                                <td>{lab?.S_No}</td>
                                <td>{lab?.Lab_Name}</td>
                                <td>{lab?.SourceType}</td>
                                <td>{lab?.Phone_No}</td>
                                <td>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handledownloadreport(lab)}
                                        startIcon={<DownloadIcon />}
                                    >
                                        {/* Download */}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="grid_foot">
                    <button
                        onClick={() =>
                            setPage((prevPage) => Math.max(prevPage - 1, 0))
                        }
                        disabled={page === 0}
                    >
                        Previous
                    </button>
                    Page {page + 1} of {totalPages}
                    <button
                        onClick={() =>
                            setPage((prevPage) =>
                                Math.min(prevPage + 1, totalPages - 1)
                            )
                        }
                        disabled={page === totalPages - 1}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default PendingReport;






