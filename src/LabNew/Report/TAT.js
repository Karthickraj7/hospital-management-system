import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { saveAs } from 'file-saver';
import { useSelector } from 'react-redux';
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";

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

const TAT = () => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    const urllink = useSelector(state => state.userRecord?.UrlLink)
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
    const [searchQuery, setSearchQuery] = useState("");
    const today = new Date().toISOString().slice(0, 10);
    const [searchQuery1, setSearchQuery1] = useState(today);
    const [searchQuery2, setSearchQuery2] = useState("date");
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [input, setInput] = useState("date")



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


    // useEffect(() => {
    //     const currentDate = new Date();
    //     const formattedDate = format(currentDate, 'dd-MM-yyyy');
    //     setSearchformData((prev) => ({
    //         ...prev,
    //         date: formattedDate
    //     }))
    //     axios
    //         .get(`${urllink}usercontrol/getlocationdata`)
    //         .then((response) => {
    //             const data = response.data.map(p => p.location_name);
    //             setLocation(data);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });

    // }, [])


    // const dynamicColumns = [
    //     { key: 'Billing_Invoice', headerName: 'Invoice NO', width: 130 },
    //     { key: 'Patient_Id', headerName: 'Patient Id', width: 100 },
    //     { key: 'Patient_Name', headerName: 'Patient Name', width: 150 },
    //     { key: 'Age', headerName: 'Age', width: 80 },
    //     { key: 'Phone_Number', headerName: 'Mobile Number', width: 120 },
    //     { key: 'Referring_Doctor_Name', headerName: 'Ref Doctor Name', width: 150 },
    //     { key: 'Sample_ID', headerName: 'Barcode / Sample ID', width: 150 },
    //     { key: 'BilledBy', headerName: 'Billed By', width: 130 },
    //     { key: 'BilledDate', headerName: 'Billed Date', width: 120 },
    //     { key: 'BilledTime', headerName: 'Billed Time', width: 120 },
    //     { key: 'Test_Name', headerName: 'Test Name', width: 150 },
    //     { key: 'CollectedBy', headerName: 'Sample Collected By', width: 150 },
    //     { key: 'CollectedDate', headerName: 'Collected Date', width: 120 },
    //     { key: 'CollectedTime', headerName: 'Collected Time', width: 120 },
    //     { key: 'Collection_Status', headerName: 'Collection Status', width: 130 },
    //     { key: 'AnalysisedBy', headerName: 'Analysed By', width: 130 },
    //     { key: 'AnalysisedDate', headerName: 'Analysed Date', width: 120 },
    //     { key: 'AnalysisedTime', headerName: 'Analysed Time', width: 120 },
    //     { key: 'Analysis_Status', headerName: 'Analysis Status', width: 130 },
    //     { key: 'VerifyedBy', headerName: 'Verified By', width: 130 },
    //     { key: 'VerifyedDate', headerName: 'Verified Date', width: 120 },
    //     { key: 'VerifyedTime', headerName: 'Verified Time', width: 120 },
    //     { key: 'Verify_Status', headerName: 'Verify Status', width: 130 },
    //     { key: 'ApprovedBy', headerName: 'Approved By', width: 130 },
    //     { key: 'ApprovedDate', headerName: 'Approved Date', width: 120 },
    //     { key: 'ApprovedTime', headerName: 'Approved Time', width: 120 },
    //     { key: 'Approve_Status', headerName: 'Approve Status', width: 130 },
    //     { key: 'register_collect_timing', headerName: 'Billed → Collected', width: 150 },
    //     { key: 'collection_Received_timing', headerName: 'Collected → Analysed', width: 150 },
    //     { key: 'process_Received_timing', headerName: 'Analysed → Verified', width: 150 },
    //     { key: 'received_done_timing', headerName: 'Verified → Approved', width: 150 },
    //     { key: 'total_process_time_formatted', headerName: 'Total Process Time', width: 150 },
    //     { key: 'total_process_time_minutes', headerName: 'Total Minutes', width: 130 },
    //     { key: 'original_TAT', headerName: 'Original TAT', width: 130 },
    //     { key: 'Beyond_tat', headerName: 'Beyond TAT', width: 100 },
    // ];

    const dynamicColumns = [
        { key: 'id', headerName: 'S.NO', width: 50 },
        { key: 'Billing_Invoice', headerName: 'Invoice NO', width: 130 },
        { key: 'Patient_Name', headerName: 'PATIENT NAME', width: 150 },
        { key: 'Patient_Id', headerName: 'PAtient Id', width: 100 },
        { key: 'Visit_Id', headerName: 'Visit Id', width: 100 },
        { key: 'Age', headerName: 'Age', width: 100 },
        { key: 'Gender', headerName: 'Gender', width: 100 },
        { key: 'Phone_Number', headerName: 'MOBILE NUMBER', width: 100 },
        { key: 'Referring_Doctor_Name', headerName: 'Ref Doctor Name', width: 150 },
        { key: 'Sample_ID', headerName: 'Barcode Id', width: 150 },
        { key: 'Test_Name', headerName: 'Test Name', width: 150 },
        { key: 'RegDate', headerName: 'Reg Date/Time', width: 150 },
        { key: 'CreatedBy', headerName: 'Reg User', width: 100 },
        { key: 'outsource_type', headerName: 'Outsource Type', width: 130 },
        { key: 'collecteddatetime', headerName: 'Sample Collect D/T', width: 130 },
        { key: 'userphelop', headerName: 'Sample Collected User', width: 130 },
        { key: 'Capture_Sample_Status', headerName: 'Sample Capture Status', width: 130 },
        { key: 'Received_date', headerName: 'Sample Received D/T', width: 150 },
        { key: 'Received_user', headerName: 'Received User', width: 130 },
        { key: 'Test_done_date', headerName: 'Test Done D/T', width: 150 },
        { key: 'Test_Done_User', headerName: 'Test Done user', width: 130 },
        { key: 'Analyze_Status', headerName: 'Analyze Status', width: 130 },
        { key: 'process_datetime', headerName: 'Process D/T', width: 130 },
        { key: 'Process_Rec_User', headerName: 'Process User', width: 130 },
        { key: 'Verify_Status', headerName: 'Verify Status', width: 130 },
        { key: 'Authorize_DateTime', headerName: 'Authorize D/T', width: 130 },
        { key: 'Authorized_User', headerName: 'Authorized User', width: 130 },
        { key: 'Approve_Status', headerName: 'Approve Status', width: 130 },
        { key: 'PrintDateTime', headerName: 'Print D/T', width: 130 },
        { key: 'Printuser', headerName: 'Print user', width: 130 },
        { key: 'dispatch_date', headerName: 'Dispatch D/T', width: 130 },
        { key: 'dispatch_user', headerName: 'Dispatch User', width: 130 },

        // ⏱ TAT Calculation Columns
        { key: 'register_collect_timing', headerName: 'Register → Collect Timing', width: 160 },
        { key: 'collection_Received_timing', headerName: 'Collect → Received Timing', width: 170 },
        { key: 'process_Received_timing', headerName: 'Received → Process Timing', width: 170 },
        { key: 'received_done_timing', headerName: 'Process → Done Timing', width: 170 },
        { key: 'total_process_time_formatted', headerName: 'Total Timing', width: 130 },
        { key: 'total_process_time_minutes', headerName: 'Total Minutes', width: 130 },
        { key: 'original_TAT', headerName: 'Original TAT', width: 130 },
        { key: 'actual_TAT', headerName: 'Actual TAT', width: 130 },
        { key: 'original_TAT_seconds', headerName: 'Original TAT Seconds', width: 150 },
        { key: 'actual_TAT_seconds', headerName: 'Actual TAT Seconds', width: 150 },
        { key: 'Beyond_tat', headerName: 'Beyond TAT', width: 130 },
    ];



    useEffect(() => {
        axios.get(`${urllink}Lab/get_tat_report?dateType=${searchQuery2}&date=${searchQuery1}&from=${from}&to=${to}`)
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
    }, [urllink, searchQuery1, from, to])


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

            axios.get(`${urllink}Lab/get_tat_report`, { params })
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

    // const handleExportToExcel = () => {
    //     if (filteredRows.length !== 0) {
    //         const columns = [
    //             { datakey: 'id', headerName: 'S.NO' },
    //             { datakey: 'Location', headerName: 'Branch Name' },
    //             { datakey: 'Billing_Invoice', headerName: 'Invoice NO' },
    //             { datakey: 'Patient_Name', headerName: 'PATIENT NAME' },
    //             { datakey: 'Patient_Id', headerName: 'PAtient Id' },
    //             { datakey: 'Visit_Id', headerName: 'Visit Id' },
    //             { datakey: 'Age', headerName: 'Age' },
    //             { datakey: 'Gender', headerName: 'Gender' },
    //             { datakey: 'Phone_Number', headerName: 'MOBILE NUMBER' },
    //             { datakey: 'Referring_Doctor_Name', headerName: 'Ref Doctor Name' },
    //             { datakey: 'Barcode_Id', headerName: 'Barcode Id' },
    //             { datakey: 'Test_Name', headerName: 'Test Name' },
    //             { datakey: 'RegDate', headerName: 'Reg Date/Time' },
    //             { datakey: 'CreatedBy', headerName: 'Reg User' },
    //             { datakey: 'outsource_type', headerName: 'Outsource Type' },
    //             { datakey: 'collecteddatetime', headerName: 'Sample Collect D/T' },
    //             { datakey: 'userphelop', headerName: 'Sample Collected User' },
    //             { datakey: 'Capture_Sample_Status', headerName: 'Sample Capture Status' },
    //             { datakey: 'Received_date', headerName: 'Sample Received D/T' },
    //             { datakey: 'Received_user', headerName: 'Received User' },
    //             { datakey: 'Test_done_date', headerName: 'Test Done D/T' },
    //             { datakey: 'Test_Done_User', headerName: 'Test Done user' },
    //             { datakey: 'Analyze_Status', headerName: 'Analyze Status' },
    //             { datakey: 'process_datetime', headerName: 'Process D/T' },
    //             { datakey: 'Process_Rec_User', headerName: 'Process User' },
    //             { datakey: 'Verify_Status', headerName: 'Verify Status' },
    //             { datakey: 'Authorize_DateTime', headerName: 'Authorize D/T' },
    //             { datakey: 'Authorized_User', headerName: 'Authorized User' },
    //             { datakey: 'Approve_Status', headerName: 'Approve Status' },
    //             { datakey: 'PrintDateTime', headerName: 'Print D/T' },
    //             { datakey: 'Printuser', headerName: 'Print user' },
    //             { datakey: 'dispatch_date', headerName: 'Dispatch D/T' },
    //             { datakey: 'dispatch_user', headerName: 'Dispatch User' },
    //             { datakey: 'register_collect_timing', headerName: 'register collect Timing' },
    //             { datakey: 'collection_Received_timing', headerName: 'collection Received Timing' },
    //             { datakey: 'process_Received_timing', headerName: 'process Received Timing' },
    //             { datakey: 'received_done_timing', headerName: 'received done Timing' },
    //             { datakey: 'total_process_time_formatted', headerName: 'Total Timing' },
    //             { datakey: 'total_process_time_minutes', headerName: 'Total Minutes' },
    //             { datakey: 'original_TAT', headerName: 'original TAT' },
    //             { datakey: 'actual_TAT', headerName: 'Actual TAT' },
    //             { datakey: 'original_TAT_seconds', headerName: 'Original TAT Seconds' },
    //             { datakey: 'actual_TAT_seconds', headerName: 'Actual TAT Seconds' },
    //             { datakey: 'Beyond_tat', headerName: 'Beyond TAT' },
    //         ];

    //         const header = columns.map(col => col.headerName).join(",");

    //         const rows = filteredRows.map(row => {
    //             return columns.map(col => {
    //                 let cellValue = row[col.datakey];
    //                 if (typeof cellValue === 'string') {
    //                     // Escape quotes by doubling them
    //                     cellValue = `"${cellValue.replace(/"/g, '""')}"`;
    //                 }
    //                 return cellValue;
    //             }).join(",");
    //         });

    //         const csvContent = [
    //             '\ufeff' + header, // BOM + header row
    //             ...rows
    //         ].join("\r\n");

    //         const data = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    //         saveAs(data, "TAT Report.csv");
    //     } else {
    //         alert('No Data to Save');
    //     }
    // };



    const handleExportToExcel = () => {
        if (filteredRows.length === 0) {
            alert('No Data to Save');
            return;
        }

        const columns = [
            { datakey: 'Billing_Invoice', headerName: 'Invoice NO' },
            { datakey: 'Patient_Id', headerName: 'Patient Id' },
            { datakey: 'Patient_Name', headerName: 'Patient Name' },
            { datakey: 'Age', headerName: 'Age' },
            { datakey: 'Phone_Number', headerName: 'Mobile Number' },
            { datakey: 'Referring_Doctor_Name', headerName: 'Ref Doctor Name' },
            { datakey: 'Sample_ID', headerName: 'Barcode / Sample ID' },
            { datakey: 'BilledBy', headerName: 'Billed By' },
            { datakey: 'BilledDate', headerName: 'Billed Date' },
            { datakey: 'BilledTime', headerName: 'Billed Time' },
            { datakey: 'Test_Name', headerName: 'Test Name' },
            { datakey: 'CollectedBy', headerName: 'Sample Collected By' },
            { datakey: 'CollectedDate', headerName: 'Collected Date' },
            { datakey: 'CollectedTime', headerName: 'Collected Time' },
            { datakey: 'Collection_Status', headerName: 'Collection Status' },
            { datakey: 'AnalysisedBy', headerName: 'Analysed By' },
            { datakey: 'AnalysisedDate', headerName: 'Analysed Date' },
            { datakey: 'AnalysisedTime', headerName: 'Analysed Time' },
            { datakey: 'Analysis_Status', headerName: 'Analysis Status' },
            { datakey: 'VerifyedBy', headerName: 'Verified By' },
            { datakey: 'VerifyedDate', headerName: 'Verified Date' },
            { datakey: 'VerifyedTime', headerName: 'Verified Time' },
            { datakey: 'Verify_Status', headerName: 'Verify Status' },
            { datakey: 'ApprovedBy', headerName: 'Approved By' },
            { datakey: 'ApprovedDate', headerName: 'Approved Date' },
            { datakey: 'ApprovedTime', headerName: 'Approved Time' },
            { datakey: 'Approve_Status', headerName: 'Approve Status' },
            { datakey: 'ProcessingTime', headerName: 'Processing Time' }, // from f"{row[27]} {row[28]}"
            { datakey: 'register_collect_timing', headerName: 'Billed → Collected' },
            { datakey: 'collection_Received_timing', headerName: 'Collected → Analysed' },
            { datakey: 'process_Received_timing', headerName: 'Analysed → Verified' },
            { datakey: 'received_done_timing', headerName: 'Verified → Approved' },
            { datakey: 'total_process_time_formatted', headerName: 'Total Process Time' },
            { datakey: 'total_process_time_minutes', headerName: 'Total Minutes' },
            { datakey: 'original_TAT', headerName: 'Original TAT' },
            { datakey: 'Beyond_tat', headerName: 'Beyond TAT' },
        ];

        const header = columns.map(col => col.headerName).join(",");

        const rows = filteredRows.map(row => {
            return columns.map(col => {
                let cellValue = row[col.datakey] ?? '';
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
        saveAs(data, "TAT_Report.csv");
    };



    const handleSearchChange = (e, key) => {
        const value = e.target.value;
        if (key === "name") setSearchQuery(value);
        if (key === "date") setSearchQuery1(value);

        if (key === "dateType") {
            setSearchQuery2(value);

            if (value.includes("month")) {
                setInput("month");
            } else {
                setInput("date");
            }

            const todays = new Date().toISOString().slice(0, 10);
            const today = new Date();
            const fullDate = today.toISOString().split("T")[0];
            const currentMonth = fullDate.slice(0, 7);

            if (value === "date") {
                setSearchQuery1(todays);
            } else if (value === "month") {
                setSearchQuery1(currentMonth);
            }
        }

        if (key === "from") setFrom(value);
        if (key === "to") setTo(value);
    };




    return (
        <div className="appointment">

            <div className="h_head">
                <h3>TAT Report</h3>
            </div>
            <div className="con_1 ">
                {/* <div className="ShiftClosing_Con_column">
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

                </div> */}

                {/* <div className="inp_1">
                    <label htmlFor="input">Test Name</label>
                    <input
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e, "")}
                        placeholder="Enter Test Name"
                        type="text"
                        id="testname"
                        name="testname"
                        list="testnamelist"
                        className=""
                        required
                        autoComplete="Off"
                    />
                    <datalist id="testnamelist">
                        {Array.isArray(TestNameList) && TestNameList?.map((item, index) => (
                            <option key={index} value={item.name}>
                                {item.Test_Code}
                            </option>
                        ))}
                    </datalist>
                </div> */}

                <div className="inp_1" style={{ gap: "5px", }}>
                    <select
                        name="dateType"
                        value={searchQuery2}
                        onChange={(e) => handleSearchChange(e, "dateType")}
                        style={{ width: "120px", }}
                    >
                        <option value={"date"}>Date</option>
                        <option value={"customdate"}>Custom Date</option>
                        <option value={"month"}>Month</option>
                        <option value={"custommonth"}>Custom Month</option>
                    </select>
                    {searchQuery2 === "date" || searchQuery2 === "month" ?
                        (<input
                            id="input"
                            type={input}
                            value={searchQuery1}
                            onChange={(e) => handleSearchChange(e, 'date')}
                            placeholder='Enter Invoice Number'
                        />
                        ) :
                        (
                            <div>
                                <div style={{ display: "inline-block", }}>
                                    <span style={{ display: "inline-block", width: "40px", color: "black", fontSize: "13px", fontWeight: "bold" }}>From </span>
                                    <input
                                        id="input"
                                        type={input}
                                        value={from}
                                        onChange={(e) => handleSearchChange(e, 'from')}
                                        placeholder='From Date'
                                    />
                                </div>
                                <div style={{ display: "inline-block" }}>
                                    <span style={{ display: "inline-block", width: "40px", color: "black", fontSize: "13px", fontWeight: "bold" }}> To </span>
                                    <input
                                        id="input"
                                        type={input}
                                        value={to}
                                        onChange={(e) => handleSearchChange(e, 'to')}
                                        placeholder='To Date'
                                    />
                                </div>
                            </div>)}

                </div>




            </div>

            <div className='grid_1'>
                <ReactGrid
                    RowData={filteredRows} // Display only the current page's data
                    columns={dynamicColumns} // Use dynamic columns here
                    className='data_grid'
                />

            </div>
            {filteredRows.length !== 0 &&
                <div className='PrintExelPdf'>
                    <button onClick={handleExportToExcel}>Save Exel</button>
                </div>
            }
        </div>
    )
}

export default TAT;
