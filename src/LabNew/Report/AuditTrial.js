import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { saveAs } from 'file-saver';
import { useSelector } from "react-redux";
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

const AuditTrial = () => {
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

    const [Location, setLocation] = useState([])

    const [page, setPage] = useState(0);
    const [filteredRows, setFilteredRows] = useState([]);
    const handlePageChange = (params) => {
        setPage(params.page);
    };
    // Define the handleAdd function to handle the "Edit" button click
    const pageSize = 10;
    const showdown = filteredRows.length;
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
        }

        else {
            setSearchformData({
                ...SearchformData,
                [name]: value
            });
        }
    };


    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, 'dd-MM-yyyy');
        setSearchformData((prev) => ({
            ...prev,
            date: formattedDate
        }))
        axios
            .get(`${urllink}usercontrol/getlocationdata`)
            .then((response) => {
                const data = response.data.map(p => p.location_name);
                setLocation(data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, [])

    const dynamicColumns = [
        { field: 'id', headerName: 'S.NO', width: 50 },
        { field: 'Location', headerName: 'Branch Name', width: 130 },
        { field: 'Billing_Invoice', headerName: 'Invoice NO', width: 130 },
        { field: 'Patient_Name', headerName: 'PATIENT NAME', width: 150 },
        { field: 'Patient_Id', headerName: 'PAtient Id', width: 100 },
        { field: 'Visit_Id', headerName: 'Visit Id', width: 100 },
        { field: 'Referring_Doctor_Name', headerName: 'Ref Doctor Name', width: 150 },
        { field: 'Barcode_Id', headerName: 'Barcode Id', width: 150 },
        { field: 'Test_Name', headerName: 'Test Name', width: 150 },
        { field: 'RegDate', headerName: 'Reg Date/Time', width: 150 },
        { field: 'Created_User', headerName: 'Reg User', width: 100 },
        { field: 'Previous_Capture_Value', headerName: 'Prev capture Value', width: 160 },
        { field: 'Edited_Capture_Value', headerName: 'Edited Capture Value', width: 160 },
        { field: 'Previous_Medical_Remark', headerName: 'Prev Medical Remark', width: 160 },
        { field: 'Latest_Medical_Remark', headerName: 'Latest Medical Remark', width: 160 },
        { field: 'Previous_Technical_Remark', headerName: 'Prev Medical Remark', width: 160 },
        { field: 'Latest_Technical_Remark', headerName: 'Latest Technical Remark ', width: 160 },
        { field: 'Latest_Updated_At', headerName: 'Edited D/T', width: 150 },
        { field: 'Edited_User', headerName: 'Edited By', width: 130 },
        
    ];



    const handletoSearch = () => {
        const params = {
            Location: SearchformData.Location,
            DateType: SearchformData.DateType,
            CurrentDate: SearchformData.CurrentDate,
            FromDate: SearchformData.FromDate,
            ToDate: SearchformData.ToDate,
            invoiceno: SearchformData.invoiceno
        }

        let requiredFields = []
        if (SearchformData.DateType === 'Customize') {
            requiredFields = [
                'Location',
                'DateType',
                'FromDate',
                'ToDate',
            ]
        } else if (SearchformData.DateType) {
            requiredFields = [
                'Location',
                'DateType',
            ]
        }
        else {
            requiredFields = [
                'Location',
                'invoiceno',
            ]
        }
        const existingItem = requiredFields.filter((field) => !SearchformData[field])
        if (existingItem.length > 0) {

            alert(`Please Fill the RequiredFields : ${existingItem.join(',')} `)
        } else {

            axios.get(`${urllink}Billing/get_audit_report`, { params })
                .then((response) => {
                    // console.log('111',response.data)
                    const A_data = response.data
                    const B_data = A_data.map((p, index) => ({
                        id: index + 1,
                        ...p
                    }))
                    setFilteredRows(B_data)
                    console.log('111B_data', B_data)
                    // setSearchformData({
                    //     Location: '',
                    //     DateType: '',
                    //     CurrentDate:'',
                    //     FromDate: '',
                    //     ToDate: '',
                    // })
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    const handleExportToExcel = () => {
        if (filteredRows.length !== 0) { const columns = [
                { datakey: 'id', headerName: 'S.NO'},
        { datakey: 'Location', headerName: 'Branch Name' },
        { datakey: 'Billing_Invoice', headerName: 'Invoice NO' },
        { datakey: 'Patient_Name', headerName: 'PATIENT NAME' },
        { datakey: 'Patient_Id', headerName: 'PAtient Id' },
        { datakey: 'Visit_Id', headerName: 'Visit Id' },
        { datakey: 'Referring_Doctor_Name', headerName: 'Ref Doctor Name' },
        { datakey: 'Barcode_Id', headerName: 'Barcode Id' },
        { datakey: 'Test_Name', headerName: 'Test Name' },
        { datakey: 'RegDate', headerName: 'Reg Date/Time' },
        { datakey: 'Created_User', headerName: 'Reg User' },
        { datakey: 'Previous_Capture_Value', headerName: 'Prev capture Value'},
        { datakey: 'Edited_Capture_Value', headerName: 'Edited Capture Value'},
        { datakey: 'Previous_Medical_Remark', headerName: 'Prev Medical Remark'},
        { datakey: 'Latest_Medical_Remark', headerName: 'Latest Medical Remark'},
        { datakey: 'Previous_Technical_Remark', headerName: 'Prev MEdical Remark'},
        { datakey: 'Latest_Technical_Remark', headerName: 'Latest Technical Remark '},
        { datakey: 'Latest_Updated_At', headerName: 'Edited D/T'},
        { datakey: 'Edited_User', headerName: 'Edited By'},
            ];

            const header = columns.map(col => col.headerName).join(",");

            const rows = filteredRows.map(row => {
                return columns.map(col => {
                    let cellValue = row[col.datakey];
                    if (typeof cellValue === 'string') {
                        // Escape quotes by doubling them
                        cellValue = `"${cellValue.replace(/"/g, '""')}"`;
                    }
                    return cellValue;
                }).join(",");
            });

            const csvContent = [
                '\ufeff' + header, // BOM + header row
                ...rows
            ].join("\r\n");

            const data = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            saveAs(data, "Audit Trail Report.csv");
        } else {
            alert('No Data to Save');
        }
    };

    const handleExportToPDF = () => {
        if (filteredRows.length !== 0) {
          const columns = [
            { datakey: 'id', headerName: 'S.NO'},
        { datakey: 'Location', headerName: 'Branch Name' },
        { datakey: 'Billing_Invoice', headerName: 'Invoice NO' },
        { datakey: 'Patient_Name', headerName: 'PATIENT NAME' },
        { datakey: 'Patient_Id', headerName: 'PAtient Id' },
        { datakey: 'Visit_Id', headerName: 'Visit Id' },
        { datakey: 'Referring_Doctor_Name', headerName: 'Ref Doctor Name' },
        { datakey: 'Barcode_Id', headerName: 'Barcode Id' },
        { datakey: 'Test_Name', headerName: 'Test Name' },
        { datakey: 'RegDate', headerName: 'Reg Date/Time' },
        { datakey: 'Created_User', headerName: 'Reg User' },
        { datakey: 'Previous_Capture_Value', headerName: 'Prev capture Value'},
        { datakey: 'Edited_Capture_Value', headerName: 'Edited Capture Value'},
        { datakey: 'Previous_Medical_Remark', headerName: 'Prev Medical Remark'},
        { datakey: 'Latest_Medical_Remark', headerName: 'Latest Medical Remark'},
        { datakey: 'Previous_Technical_Remark', headerName: 'Prev MEdical Remark'},
        { datakey: 'Latest_Technical_Remark', headerName: 'Latest Technical Remark '},
        { datakey: 'Latest_Updated_At', headerName: 'Edited D/T'},
        { datakey: 'Edited_User', headerName: 'Edited By'}
          ];
    
          const doc = new jsPDF({ orientation: 'landscape' });
    
          // Title
          doc.setFontSize(8);
          doc.text("Audit Trail", 14, 22);
    
          // Calculate the total sum of net_salary
    
          // Define autoTable options
          const autoTableOptions = {
            startY: 30,
            head: [columns.map(col => col.headerName)],
            body: [
              ...filteredRows.map(row => columns.map(col => row[col.datakey] != null ? row[col.datakey].toString() : '-')),
    
            ],
            theme: 'grid',
            styles: { fontSize: 8 },
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
          saveAs(blob, `Audittrail${currentDate}.pdf`);
        } else {
          alert('No Data to Save');
        }
      };



    return (
        <div className='ShiftClosing_over'>
            <div className="ShiftClosing_Container">
                <div className="ShiftClosing_header">
                    <h3>AuditTrial Report</h3>
                </div>
                <div className="ShiftClosing_Invoice_container" >

                    <div className="ShiftClosing_Con" >
                        <div className="ShiftClosing_Con_row" style={{ gap: "31px" }}>
                            <div className="ShiftClosing_Con_column">
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

                            {/* <div className="ShiftClosing_Con_column">
                                <label htmlFor="">Invoice No <span>:</span></label>
                                <input
                                    name="invoiceno"
                                    value={SearchformData.invoiceno}
                                    onChange={handleChange}

                                />
                            </div> */}


                            <div className="ShiftClosing_Con_column">
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



                        </div>

                        <div className="ShiftClosing_Con_row">

                            {SearchformData.DateType === 'Current' &&
                                <div className="ShiftClosing_Con_column">
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
                                    <div className="ShiftClosing_Con_column">
                                        <label htmlFor="">From Date <span>:</span></label>
                                        <input
                                            type="date"
                                            name="FromDate"
                                            value={SearchformData.FromDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="ShiftClosing_Con_column">
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
                    </div>
                </div>
                <div >
                    <button className="btn_1" onClick={handletoSearch}>Search</button>
                </div>
            </div>
            <div className='grid_1'>
                <ThemeProvider theme={theme}>
                    <div className='grid_1'>
                        <DataGrid
                            rows={filteredRows.slice(page * pageSize, (page + 1) * pageSize)} // Display only the current page's data
                            columns={dynamicColumns} // Use dynamic columns here
                            pageSize={10}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                    },
                                },
                            }}
                            pageSizeOptions={[10]}
                            onPageChange={handlePageChange}
                            hideFooterPagination
                            hideFooterSelectedRowCount
                            className='data_grid'
                        />
                        {showdown > 0 && filteredRows.length > 10 && (
                            <div className='IP_grid_foot'>
                                <button
                                    onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
                                    disabled={page === 0}
                                >
                                    Previous
                                </button>
                                Page {page + 1} of {totalPages}
                                <button
                                    onClick={() =>
                                        setPage((prevPage) => Math.min(prevPage + 1, totalPages - 1))
                                    }
                                    disabled={page === totalPages - 1}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </ThemeProvider>
                {showdown !== 0 && filteredRows.length !== 0 ? (
                    ''
                ) : (
                    <div className='IP_norecords'>
                        <span>No Records Found</span>
                    </div>
                )}
            </div>
            {filteredRows.length !== 0 &&
                <div className='PrintExelPdf'>
                    <button onClick={handleExportToExcel}>Save Exel</button>
                    <button onClick={handleExportToPDF}>Save Pdf</button>

                </div>
            }
        </div>
    )
}

export default AuditTrial;

