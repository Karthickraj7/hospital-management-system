import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import 'jspdf-autotable';

const theme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                columnHeader: {
                    backgroundColor: 'var(--ProjectColor)',
                },
                root: {
                    '& .MuiDataGrid-window': {
                        overflow: 'hidden !important',
                    },
                },
                cell: {
                    borderTop: '0px !important',
                    borderBottom: '1px solid var(--ProjectColor) !important',
                },
            },
        },
    },
});

const useStyles = makeStyles({
    spanCell: {
        gridColumn: 'span 15', // Adjust according to the number of columns you have
        background: '#f5f5f5',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold',
    },
});


// const useStyles = {
//     spanCell: {
//         gridColumn: 'span 15', // Adjust according to the number of columns you have
//         background: '#f5f5f5',
//         padding: '8px',
//         display: 'flex',
//         alignItems: 'center',
//         fontWeight: 'bold',
//     },
// }


const other = {
  autoHeight: true,
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
};

const ReferDocreport = () => {
    const classes = useStyles();
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    const urllink=useSelector(state=>state.userRecord?.UrlLink)

    const [SearchformData, setSearchformData] = useState({
        Location: '',
        DateType: '',
        CurrentDate: '',
        FromDate: '',
        ToDate: '',
        invoiceno: ''
    });

    const [Location, setLocation] = useState([]);
    const [page, setPage] = useState(0);
    const [filteredRows, setFilteredRows] = useState([]);

    const handlePageChange = (params) => {
        setPage(params.page);
    };

    const pageSize = 10;
    const totalPages = Math.ceil(filteredRows.length / 10);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'DateType') {
            if (value === 'Current') {
                setSearchformData({
                    ...SearchformData,
                    CurrentDate: formattedDate,
                    [name]: value
                });
            } else {
                setSearchformData({
                    ...SearchformData,
                    CurrentDate: '',
                    [name]: value
                });
            }
        } else {
            setSearchformData({
                ...SearchformData,
                [name]: value
            });
        }
    };

    useEffect(() => {
        const formattedDate = format(currentDate, 'dd-MM-yyyy');
        setSearchformData((prev) => ({
            ...prev,
            date: formattedDate
        }));
        axios
            .get(`${urllink}usercontrol/getlocationdata`)
            .then((response) => {
                const data = response.data.map(p => p.location_name);
                setLocation(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [urllink]);

    const columns = [
        {
            field: "Doctor_Name",
            headerName: "Doctor Name",
            width: 200,
            renderCell: (params) => {
                if (params.row.isDoctor) {
                    return <div className={classes.spanCell}>{params.value}</div>;
                }
                return params.value || "";
            },
        },
        { field: "Billing_Invoice", headerName: "Billing Invoice", width: 150, hide: true },
        { field: "Patient_Name", headerName: "Patient Name", width: 150 },
        { field: "Visit_Id", headerName: "Visit ID", width: 100 },
        { field: "Total_BillAmount", headerName: "Total Bill Amount", width: 150 },
        { field: "Location", headerName: "Location", width: 100 },
        { field: "Billing_Date", headerName: "Billing Date", width: 150 },
        { field: "Test_Name", headerName: "Test Name", width: 300 },
        { field: "Patient_Id", headerName: "Patient ID", width: 100 },
        { field: "Item_Count", headerName: "Item Count", width: 100 },
        { field: "Discount", headerName: "Discount", width: 100 },
        { field: "Discount_Type", headerName: "Discount Type", width: 150 },
        { field: "Paid_Amount", headerName: "Paid Amount", width: 150 },
        { field: "Remaining_Amount", headerName: "Remaining Amount", width: 150 },
        { field: "Status", headerName: "Status", width: 100 },
    ];

    const handletoSearch = () => {
        const params = {
            Location: SearchformData.Location,
            DateType: SearchformData.DateType,
            CurrentDate: SearchformData.CurrentDate,
            FromDate: SearchformData.FromDate,
            ToDate: SearchformData.ToDate,
            invoiceno: SearchformData.invoiceno
        };

        let requiredFields = [];
        if (SearchformData.DateType === 'Customize') {
            requiredFields = [
                'Location',
                'DateType',
                'FromDate',
                'ToDate',
            ];
        } else if (SearchformData.DateType) {
            requiredFields = [
                'Location',
                'DateType',
            ];
        } else {
            requiredFields = [
                'Location',
                'invoiceno',
            ];
        }
        const existingItem = requiredFields.filter((field) => !SearchformData[field]);
        if (existingItem.length > 0) {
            alert(`Please Fill the Required Fields: ${existingItem.join(', ')}`);
        } else {
            axios.get(`${urllink}Billing/get_report_for_refering_doctor_patient`, { params })
                .then((response) => {
                    let rows = [];
                    let data = response.data;
                    data.forEach((doctor, index) => {
                        rows.push({
                            id: `doctor-${index}`,
                            Doctor_Name: doctor.Doctor_Name,
                            isDoctor: true,
                        });
                        doctor.Details.forEach((detail, detailIndex) => {
                            rows.push({
                                id: `${index}-${detailIndex}`,
                                ...detail,
                                isDoctor: false,
                            });
                        });
                    });
                    setFilteredRows(rows);
                    console.log('Data:', rows);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    console.log('filteredRows', filteredRows);

    const handleExportToExcel = () => {
        // Fetch all rows from filteredRows
        const allRows = filteredRows;
      
        // Ensure to include all columns in the CSV export
        const headers = columns.map((col) => col.headerName);
        const rowsdata = columns.map((col)=> col.field)
        // Prepare CSV rows
        const csvRows = [];
        csvRows.push(rowsdata.join(','));
      
        // Iterate over all rows and map their values to CSV format
        allRows.forEach((row) => {
          const values = rowsdata.map((header) => {
            const value = row[header];
            return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
          });
          csvRows.push(values.join(','));
        });
      
        // Create the CSV content
        const csvContent = csvRows.join('\n');
      
        // Create a Blob object and create a link to trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.csv';
        link.click();
      };



      
  const handleExportToPDF = () => {
    if (filteredRows.length !== 0) {
        const columns = [
            { dataKey: 'Doctor_Name', header: 'Doctor Name' },
            { dataKey: 'Billing_Invoice', header: 'Invoice' },
            { dataKey: 'Patient_Name', header: 'Patient Name' },
            { dataKey: 'Visit_Id', header: 'VisitID' },
            { dataKey: 'Total_BillAmount', header: 'Amount' },
            { dataKey: 'Location', header: 'Location' },
            { dataKey: 'Billing_Date', header: 'Date' },
            { dataKey: 'Test_Name', header: 'Test Name' },
            { dataKey: 'Patient_Id', header: 'Patient ID' },
            { dataKey: 'Item_Count', header: 'Count' },
            { dataKey: 'Discount', header: 'Discount' },
            // { dataKey: 'Discount_Type', header: 'Discount Type' },
            { dataKey: 'Paid_Amount', header: 'Paid Amount' },
            { dataKey: 'Remaining_Amount', header: 'Remaining' },
            { dataKey: 'Status', header: 'Status' },
        ];

        const doc = new jsPDF({ orientation: 'landscape' });
      
        // Title
        doc.setFontSize(18);
        doc.text("Refering Doctor Report", 14, 22);
        if (SearchformData.DateType === 'Currentdate') {
            doc.text(`Current Date: ${SearchformData.CurrentDate}`);
        } else if (SearchformData.DateType === 'Customize') {
            doc.text(`From Date: ${SearchformData.FromDate}`   `To Date: ${SearchformData.FromDate}`);
}

        // Prepare the data for the table
        const body = [];
        filteredRows.forEach(row => {
            if (row.isDoctor) {
                // Add the Doctor Name row
                body.push([{
                    content: row.Doctor_Name,
                    colSpan: columns.length,
                    styles: { halign: 'center', fontStyle: 'bold' }
                }]);
            } else {
                // Add the regular data row
                body.push(columns.map(col => row[col.dataKey] != null ? row[col.dataKey].toString() : ''));
            }
        });

        // Define autoTable options
        const autoTableOptions = {
            startY: 30,
            head: [columns.map(col => col.header)],
            body: body,
            theme: 'grid',
            styles: { fontSize: 6},
            headStyles: { fillColor: [0, 0, 0] },
            columnStyles: columns.reduce((styles, col, index) => {
                styles[index] = { cellWidth: 'auto' };
                return styles;
            }, {})
        };

        // Create table
        doc.autoTable(autoTableOptions);

        // Convert to Blob and use saveAs
        const blob = doc.output('blob');
        saveAs(blob, `ReferingDoctorReport_${formattedDate}.pdf`);
    } else {
        alert('No Data to Save');
    }
};

      
    return (
        <div className='appointment'>
            <div className="h_head">
                <h3>Refering Doctor Report</h3>
            </div>
            <div className="RegisFormcon">
                <div className="RegisForm_1">
                    <label htmlFor="">Location <span>:</span></label>
                    <select
                        name='Location'
                        value={SearchformData.Location}
                        onChange={handleChange}
                    >
                        <option value=''>Select Location</option>
                        {Location.map((p) => (
                            <option key={p} value={p}>
                                {p.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="RegisForm_1">
                    <label htmlFor="">Date Type <span>:</span></label>
                    <select
                        name="DateType"
                        value={SearchformData.DateType}
                        onChange={handleChange}
                    >
                        <option value="">-Select-</option>
                        <option value="Current">Current Date</option>
                        <option value="Customize">Customize</option>
                    </select>
                </div>

                {SearchformData.DateType === 'Current' &&
                    <div className="RegisForm_1">
                        <label htmlFor="">Current Date <span>:</span></label>
                        <input
                            type="date"
                            name="CurrentDate"
                            value={SearchformData.CurrentDate}
                            onChange={handleChange}
                        />
                    </div>}
                {SearchformData.DateType === 'Customize' &&
                    <>
                        <div className="RegisForm_1">
                            <label htmlFor="">From Date <span>:</span></label>
                            <input
                                type="date"
                                name="FromDate"
                                value={SearchformData.FromDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label htmlFor="">To Date <span>:</span></label>
                            <input
                                type="date"
                                name="ToDate"
                                value={SearchformData.ToDate}
                                onChange={handleChange}
                            />
                        </div>
                    </>}
            </div>
            <div className="Register_btn_con">
                <button className="RegisterForm_1_btns" onClick={handletoSearch}>
                    Search
                </button>
            </div>
            <div className='grid_1'>
                <ThemeProvider theme={theme}>

                    <DataGrid
              rows={filteredRows.slice(page * pageSize, (page + 1) * pageSize)}
              columns={columns}
              pageSize={pageSize}
              pageSizeOptions={[pageSize]}
              onPageChange={(newPage) => setPage(newPage)}
              hideFooterPagination
              hideFooterSelectedRowCount
              className='data_grid'
              getCellClassName={(params) =>
                params.row.isDoctor ? classes.spanCell : ""
            }
            />
            {filteredRows.length > pageSize && (
              <div className='IP_grid_foot'>
                <button
                  onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
                  disabled={page === 0}
                >
                  Previous
                </button>
                Page {page + 1} of {Math.ceil(filteredRows.length / pageSize)}
                <button
                  onClick={() => setPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filteredRows.length / pageSize) - 1))}
                  disabled={page === Math.ceil(filteredRows.length / pageSize) - 1}
                >
                  Next
                </button>
              </div>
            )}
                   
                    </ThemeProvider>
                    {filteredRows.length === 0 && (
            <div className='IP_norecords'>
              <span>No Records Found</span>
            </div>
          )}
         </div>
         {filteredRows.length !== 0 && (
        <div className="PrintExelPdf">
          <button onClick={handleExportToExcel}>Save Excel</button>
          <button onClick={handleExportToPDF}>Save PDF</button> 

        </div>
      )}
        </div>
        
    );
}

export default ReferDocreport;
