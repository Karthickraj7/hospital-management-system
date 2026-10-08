import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
// import { Helmet } from 'react-helmet';
// import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
// import './Neww.css';
import Button from '@mui/material/Button';
import ForwadIcon from "@mui/icons-material/Forward";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import  faForward  from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';



const Verifyreport = () => {
    const userRecord = useSelector(state => state.userRecord?.UserData)
    console.log(userRecord)
    // const department = [
    //     "Microbiology",
    //     "Histopathology"
    // ]

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const today = new Date().toISOString().slice(0, 10);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQuery2, setSearchQuery2] = useState('');
    const [searchQuery1, setSearchQuery1] = useState('');
    const [searchQuery3, setSearchQuery3] = useState('');
    const [searchQuery4, setSearchQuery4] = useState('currentdate');
    const [searchQuery5, setSearchQuery5] = useState(today);
    const [searchQuery6, setSearchQuery6] = useState('');
    const [searchQuery7, setSearchQuery7] = useState('');

    const [summa, setSumma] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [selectedrow, setselectedrow] = useState([])
    const pageSize = 10;

    const showdown = filteredRows.length;
    const urllink = useSelector(state => state.userRecord?.UrlLink)

    useEffect(() => {
        const departmentCodes = userRecord?.Lab_Department?.join(',') || ''; // Convert array to comma-separated string
        const offset = page * pageSize;
        const isSearchCleared = !searchQuery && !searchQuery1 && !searchQuery2 && !searchQuery3;
        // if (isSearchCleared) {
        axios.get(`${urllink}Lab/getverifyresult?Location=${userRecord?.location}&Department=${departmentCodes}&limit=${pageSize}&offset=${offset}&name=${searchQuery}&id=${searchQuery1}&barcode=${searchQuery2}&invoice=${searchQuery3}&dateType=${searchQuery4}&date=${searchQuery5}&from=${searchQuery6}&to=${searchQuery7}`)
            .then((response) => {
                console.log(response.data);
                const totalrecords = response.data.total_records;
                const data = response.data.patients_data.map((row, index) => ({
                    id: index, // Sequential ID
                    ...row,
                }));
                data.sort((a, b) => {
                    const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ''), 10);
                    const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ''), 10);
                    return invoiceB - invoiceA;
                });
                setFilteredRows([])

                setSumma(data);
                setTotalPages(Math.ceil(totalrecords / pageSize));

            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        // }
        //  else {
        //     fetchSearchData(offset);
        // }
    }, [urllink, userRecord?.location, userRecord?.Lab_Department, page, pageSize, searchQuery, searchQuery1, searchQuery2, searchQuery3,searchQuery5, searchQuery6,searchQuery7]);

    // const fetchSearchData = async (offset) => {
    //     try {
    //         const response = await axios.get(`${urllink}Lab/searchseniorrtech`, {
    //             params: {
    //                 name: searchQuery,
    //                 phone: searchQuery1,
    //                 barcode: searchQuery2,
    //                 invoice: searchQuery3,
    //                 Location: userRecord?.location,
    //                 department: userRecord?.Lab_Department, // Fixed parameter name to match backend
    //                 limit: pageSize,
    //                 offset: offset,
    //             },
    //         });
    //         const totalRecords = response.data.total_records;
    //         const data = response.data.patients_data.map((row, index) => ({
    //             id: index + 1 + offset,
    //             ...row,
    //             status: 'Status',
    //         }));
    //         data.sort((a, b) => {
    //             const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ''), 10);
    //             const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ''), 10);
    //             return invoiceB - invoiceA;
    //         });
    //         setSumma([]);
    //         setFilteredRows(data);
    //         setTotalPages(Math.ceil(totalRecords / pageSize));
    //     } catch (error) {
    //         console.error('Error fetching search data:', error);
    //         setFilteredRows([]);
    //         setTotalPages(0);
    //     }
    // };



    const handleSearchChange = (event, type) => {
        const value = event.target.value;
        if (type === 'name') {
            setSearchQuery(value);
        } else if (type === 'phone') {
            setSearchQuery1(value);
        } else if (type === 'barcode') {
            setSearchQuery2(value)
        } else if (type === 'invoice') {
            setSearchQuery3(value)
        }
        else if (type === "dateType") setSearchQuery4(value);
        else if (type === "date") setSearchQuery5(value);
        else if (type === "fromdate") setSearchQuery6(value);
        else if (type === "todate") setSearchQuery7(value);

    };


    const handleSampleCapture = (params) => {
        // Directly setting selectedrow to the new value
        setselectedrow(params.row);
        dispatch({ type: 'Capturesample', value: params.row });
        dispatch({ type: 'HrFolder', value: 'Navigationseior' });

    };



    console.log('selectedrow', selectedrow);
    const dynamicColumns = [
        { key: 'Barcode', headerName: 'Sample Barcode', width: 150 },

        { key: 'Patient_Id', headerName: 'Patient Id', width: 100 },
        { key: 'UpdatedAt', headerName: 'Date', width: 150 },
        { key: 'Billing_Invoice', headerName: 'OP/IP No', width: 150 },
        { key: 'Patient_Name', headerName: 'Patient Name', width: 150 },
        { key: 'Age', headerName: 'Age', width: 100 },
        {
            key: 'actions',
            headerName: 'Options',
            width: 150,
            renderCell: (params) => (
                <>
                    <Button className='cell_btn' onClick={() => handleSampleCapture(params)}>
                        <ForwadIcon />
                    </Button>
                </>
            ),
        },
        { key: 'Gender', headerName: 'Gender', width: 150 },
        // { key: 'Address', headerName: 'Address', width: 150 },
        { key: 'Phone', headerName: 'Phone', width: 150 },
        // { key: 'Patient_Group', headerName: 'Patient Group', width: 150 },
        { key: 'Refering_Doctor', headerName: 'Reference Doctor', width: 150 },
        // { key: 'Test_Name', headerName: 'Test Name', width: 150 },
        // { key: 'TestCount', headerName: 'Test Count', width: 150 },
        // { key: 'Test_value', headerName: 'Test Value', width: 150 },



    ];

    const handleprovisionalreport = () => {
        dispatch({ type: 'HrFolder', value: 'provisionalreportlist' });
        dispatch({ type: "setPreviousFolder", value: null });
    }

    return (
        <>
            <div className="appointment">
                <div className="h_head">
                    <h3>Result Verify Que List</h3>
                    <button
                        className='btn_1'
                        onClick={handleprovisionalreport}
                        style={{
                            backgroundColor: 'rgb(0, 128, 0)',
                            color: 'rgb(255, 255, 255)',
                            textAlign: 'center',
                            borderRadius: '4px',
                            width: 'fit-content',
                            padding: '5px',
                        }}
                    >
                        Provisional Report
                    </button>
                </div>
                <div className="con_1 ">
                    <div className="inp_1">
                        <label htmlFor="input">Patient Name </label>
                        <input type="text" value={searchQuery} onChange={(e) => handleSearchChange(e, 'name')} placeholder='Enter the Patient Name' />
                    </div>

                    <div className="inp_1">
                        <label htmlFor="input">Barcode :</label>
                        <input
                            id="input"
                            type="text"
                            value={searchQuery2}
                            onChange={(e) => handleSearchChange(e, 'barcode')}
                            placeholder='Enter Barcode Number'
                        />
                    </div>
                    <div className="inp_1">
                        <label htmlFor="input">Patient ID </label>
                        <input type="text" value={searchQuery1} onChange={(e) => handleSearchChange(e, 'phone')} placeholder='Enter the Patient ID' />
                    </div>
                    <div className="inp_1">
                        <label htmlFor="input">OP/IP No </label>
                        <input type="text" value={searchQuery3} onChange={(e) => handleSearchChange(e, 'invoice')} placeholder='Enter Invoice Number' />
                    </div>
          <div className="inp_1">
            <label htmlFor="input">Date Type</label>
            <select
              value={searchQuery4}
              onChange={(e) => handleSearchChange(e, "dateType")}
              style={{ width: "165px", }}
            >
              <option value={"currentdate"}>Current</option>
              <option value={"customdate"}>Custom Date</option>

            </select>
          </div>
          {searchQuery4 === "currentdate" ?
            (<div className="inp_1">
              <label htmlFor="input">Date</label>
              <input
                id="input"
                type="date"
                value={searchQuery5}
                onChange={(e) => handleSearchChange(e, 'date')}
                placeholder='Enter Invoice Number'
              />
            </div>) :
            (
              <>
                <div className="inp_1" style={{ gap: "5px", }}>
                  <span style={{ color: "black", fontSize: "13px", fontWeight: "bold" }}>From </span>
                  <input
                    id="input"
                    type="date"
                    value={searchQuery6}
                    onChange={(e) => handleSearchChange(e, 'fromdate')}
                    placeholder='From Date'
                  />
                  <span style={{ color: "black", fontSize: "13px", fontWeight: "bold" }}> To </span>
                  <input
                    id="input"
                    type="date"
                    value={searchQuery7}
                    onChange={(e) => handleSearchChange(e, 'todate')}
                    placeholder='To Date'
                  />
                </div>
              </>)
          }
                </div>
                <div className='grid_1'>
                    <ReactGrid
                        RowData={filteredRows.length > 0 ? filteredRows : summa}
                        columns={dynamicColumns}
                        hidePagination={true}
                        className='data_grid'
                    />
                    <div className="pagination-controls">
                        <button
                            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
                            disabled={page === 0}
                            className="pagination-button"
                        >
                            <ArrowBackIosNewIcon />
                        </button>
                        Page {page + 1} of {totalPages}
                        <button
                            onClick={() => setPage((prevPage) => (prevPage + 1 < totalPages ? prevPage + 1 : prevPage))}
                            disabled={page + 1 >= totalPages}
                            className="pagination-button"
                        >
                            <ArrowForwardIosIcon />
                        </button>
                    </div>
                    {summa.length === 0 && filteredRows.length === 0 && (
                        <div className="IP_norecords">
                            <span>No Records Found</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Verifyreport;
