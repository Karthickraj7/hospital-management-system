import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import axios from "axios";
import Button from '@mui/material/Button';
import ForwardIcon from "@mui/icons-material/Forward"; // Fixed typo
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid2";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';

const Approvereport = () => {
    const userRecord = useSelector(state => state.userRecord?.UserData);
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Fixed variable name
    const today = new Date().toISOString().slice(0, 10);

    const [page, setPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQuery1, setSearchQuery1] = useState('');
    const [searchQuery2, setSearchQuery2] = useState('');
    const [searchQuery3, setSearchQuery3] = useState('');
    const [searchQuery4, setSearchQuery4] = useState('currentdate');
    const [searchQuery5, setSearchQuery5] = useState(today);
    const [searchQuery6, setSearchQuery6] = useState('');
    const [searchQuery7, setSearchQuery7] = useState('');


    const [summa, setSumma] = useState([]); // Fixed typo in state name
    const [filteredRows, setFilteredRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState({}); // Fixed typo and initialized as object
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;
    const urllink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector((state) => state.userRecord?.toast);

    const SelectedData = useSelector((state) => state.userRecord?.SelectedData);

    const fetchData = useCallback(() => {
        const offset = page * pageSize;
        const departmentCodes = userRecord?.Lab_Department?.join(',') || '';
        const isSearchCleared = !searchQuery && !searchQuery1 && !searchQuery2 && !searchQuery3;

        // if (isSearchCleared) {
        axios.get(`${urllink}Lab/getforpathalogist`, {
            params: {
                Location: userRecord?.location,
                limit: pageSize,
                offset: offset,
                Department: departmentCodes,
                name: searchQuery,
                id: searchQuery1,
                barcode: searchQuery2,
                invoice: searchQuery3,
                dateType: searchQuery4,
                date: searchQuery5,
                from: searchQuery6,
                to: searchQuery7,
            }
        })
            .then((response) => {
                const totalRecords = response.data.total_records;
                const data = response.data.patients_data.map((row, index) => ({
                    id: index + 1 + offset, // Adjusted for pagination
                    ...row,
                }));
                data.sort((a, b) => {
                    const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ''), 10);
                    const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ''), 10);
                    return invoiceB - invoiceA;
                });
                setFilteredRows([]);
                setSumma(data);
                setTotalPages(Math.ceil(totalRecords / pageSize));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setSumma([]);
                setTotalPages(0);
            });
        // } else {
        //     fetchSearchData(offset);
        // }
    }, [urllink, userRecord?.location, userRecord?.Lab_Department, page, pageSize, searchQuery, searchQuery1, searchQuery2, searchQuery3, searchQuery5, searchQuery6, searchQuery7]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // const fetchSearchData = async (offset) => {
    //     try {
    //         const response = await axios.get(`${urllink}Lab/searchpathologist`, {
    //             params: {
    //                 name: searchQuery,
    //                 patientid: searchQuery1,
    //                 barcode: searchQuery2,
    //                 invoice: searchQuery3,
    //                 Location: userRecord?.location,
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

    const handleSearchChange = (e, key) => {
        const value = e.target.value;
        if (key === 'name') setSearchQuery(value);
        if (key === 'phone') setSearchQuery1(value);
        if (key === 'barcode') setSearchQuery2(value);
        if (key === 'invoice') setSearchQuery3(value);
        if (key === "dateType") setSearchQuery4(value);
        if (key === "date") setSearchQuery5(value);
        if (key === "fromdate") setSearchQuery6(value);
        if (key === "todate") setSearchQuery7(value);


        setPage(0); // Reset page to 0 on search change
    };

    const handleSampleCapture = (params) => {
        setSelectedRow(params.row);
        dispatch({ type: 'Capturesample', value: params.row });
        dispatch({ type: 'HrFolder', value: 'Navigationpath' });
        dispatch({ type: "setPreviousFolder", value: null });
    };

    const dynamicColumns = [
        { key: 'Barcode', headerName: 'Sample Barcode', width: 150 },
        { key: 'Patient_Id', headerName: 'Patient Id', width: 90 },
        { key: 'UpdatedAt', headerName: 'Date', width: 100 },
        { key: 'Billing_Invoice', headerName: 'OP/IP No', width: 110 },
        { key: 'Patient_Name', headerName: 'Patient Name', width: 120 },
        { key: 'Age', headerName: 'Age', width: 90 },
        {
            key: 'actions',
            headerName: 'Options',
            width: 150,
            renderCell: (params) => (
                <Button className='cell_btn' onClick={() => handleSampleCapture(params)}>
                    <ForwardIcon />
                </Button>
            ),
        },
        { key: 'Gender', headerName: 'Gender', width: 100 },
        { key: 'Phone', headerName: 'Phone', width: 130 },
        { key: 'Refering_Doctor', headerName: 'Reference Doctor', width: 130 },
    ];


    const handleSubmit = () => {
        if (SelectedData.length > 0) {
            const selected = SelectedData.map((item) => {
                return {
                    Billinginvoice: item.Billing_Invoice,
                    Visitid: item.Visit_Id,
                    Sampleid: item.Barcode,
                    Patientid: item.Patient_Id,
                    Location: userRecord?.location,
                    created: userRecord?.username,
                    Department: userRecord?.Lab_Department?.join(',') || ''
                }
            }
            );
            console.log("Selected IDs:", selected);
            axios.post(`${urllink}Lab/insertBulkpathologist`, selected)
                .then((response) => {
                    console.log("Response:", response.data);
                    fetchData()
                    const tdata = {
                        message: "Samples Collected Successfully",
                        type: 'success',
                    };
                    dispatch({ type: "toast", value: tdata });

                })
                .catch((error) => {
                    console.error('Error forwarding data:', error);
                });
        } else {
            alert("Please select at least one record to forward.");
        }
    };


    console.log("Selected Data:", SelectedData);

    return (
        <div className="appointment">
            <div className="h_head">
                <h3>Approval Que List</h3>
            </div>
            <div className="con_1">
                <div className="inp_1">
                    <label htmlFor="input">Patient Name</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e, 'name')}
                        placeholder='Enter the Patient Name'
                    />
                </div>
                <div className="inp_1">
                    <label htmlFor="input">Patient ID</label>
                    <input
                        type="text"
                        value={searchQuery1}
                        onChange={(e) => handleSearchChange(e, 'phone')}
                        placeholder='Enter the UHID Number'
                    />
                </div>
                <div className="inp_1">
                    <label htmlFor="input">Barcode</label>
                    <input
                        id="input"
                        type="text"
                        value={searchQuery2}
                        onChange={(e) => handleSearchChange(e, 'barcode')}
                        placeholder='Enter Barcode Number'
                    />
                </div>
                <div className="inp_1">
                    <label htmlFor="input">OP/IP No</label>
                    <input
                        id="input"
                        type="text"
                        value={searchQuery3}
                        onChange={(e) => handleSearchChange(e, 'invoice')}
                        placeholder='Enter Invoice Number'
                    />
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
                    submit={handleSubmit}
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
            <ToastAlert Message={toast.message} Type={toast.type} />

        </div>
    );
};

export default Approvereport;