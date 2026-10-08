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
import Tooltip from '@mui/material/Tooltip';
import Modal from 'react-modal';
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useSelector } from 'react-redux'
import { GiProgression } from "react-icons/gi";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import '../Report/smartreport.css'
const theme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                columnHeader: {
                    backgroundColor: "var(--ProjectColor)",
                    textAlign: 'Center',
                },
                root: {
                    "& .MuiDataGrid-root .MuiDataGrid-columnHeader, .MuiDataGrid-columnHeaderTitleContainer": {
                        textAlign: 'center',
                        display: 'flex !important',
                        justifyContent: 'center !important'
                    },
                    "& .MuiDataGrid-window": {
                        overflow: "hidden !important",
                    },
                },
                cell: {
                    borderTop: "0px !important",
                    borderBottom: "1px solid  var(--ProjectColor) !important",
                    display: 'flex',
                    justifyContent: 'center'
                },
            },
        },
    },
});

const getColorName = (value, min, max) => {
    const percentage = ((value - min) / (max - min)) * 100;
    if (percentage <= 20) {
        return "Panic";
    } else if (percentage <= 40) {
        return "Abnormal - Y";
    } else if (percentage <= 60) {
        return "Normal";
    } else if (percentage <= 80) {
        return "Abnormal - O";
    } else {
        return "Panic";
    }
};



const NewDispatchQueue = () => {


    const userRecord = useSelector(state => (state.userRecord?.UserData))
    console.log(userRecord, userRecord)

    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQuery1, setSearchQuery1] = useState('');

    const [searchQuery2, setSearchQuery2] = useState('');
    const [searchQuery3, setSearchQuery3] = useState('');
    const [summa, setsumma] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [searchdata, setSearchdata] = useState([]);
    const dispatchvalue = useDispatch()
    const [openModel, setOpenModel] = useState(false)
    const isSidebarOpen = useSelector(state => state.userRecord?.isSidebarOpen)
    const [smartreport, setsmartreport] = useState([])
    const [reportvalue, setreportvalue] = useState({
        minvalue: '',
        maxvalue: '',
        capturevalue: ''
    })

    const [openModal, setOpenModal] = useState(false);

    const urllink = useSelector(state => state.userRecord?.UrlLink)

    const [view, setview] = useState(false);
    const [testdetails, settestdetails] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [selectedrow, setselectedrow] = useState()
    const [totalPages, setTotalPages] = useState(0); // New state for total pages

    const pageSize = 10;

    const [printpapaer, setprintpapaer] = useState('')
    const [loading, setLoading] = useState(false);

    const yourStyles = {
        position: 'absolute',
        inset: '100px',
        border: '1px solid rgb(204, 204, 204)',
        background: 'rgb(97 90 90 / 75%)',
        overflow: 'auto',
        borderRadius: '4px',
        outline: 'none',
        padding: '0px'
    }
    const closeModal = () => {
        setModalIsOpen(false);
        setModalContent('');
    };

    useEffect(() => {
        const offset = page * pageSize;

        const isSearchCleared = !searchQuery && !searchQuery1 && !searchQuery2 && !searchQuery3;
        console.log("Search Cleared:", isSearchCleared);

        if (isSearchCleared) {
            console.log("Fetching default data...");
            // Fetch default data
            axios.get(`${urllink}Billing/dispatchdataforque?Location=${userRecord?.location}&limit=${pageSize}&offset=${offset}&Refering_Hospital=${userRecord.Refering_Hospital}`)
                .then((response) => {
                    console.log(response.data.patients_data);
                    const totalrecords = response.data.total_records;
                    const data = response.data.patients_data.map((row, index) => ({
                        id: index + 1,
                        ...row,
                        status: "Status"
                    }));
                    data.sort((a, b) => {
                        const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ''), 10);
                        const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ''), 10);
                        return invoiceB - invoiceA;
                    });
                    setFilteredRows([])
                    setTotalPages(0)
                    setsumma(data);
                    setTotalPages(Math.ceil(totalrecords / pageSize));
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        } else {
            console.log("Performing search...");
            // Perform search
            fetchSearchData();
        }
    }, [urllink, userRecord?.location, page, searchQuery, searchQuery1, searchQuery2, searchQuery3]);




    // Function to handle search data
    const fetchSearchData = async () => {
        try {
            // Check if at least one search query is provided
            if (!searchQuery && !searchQuery1 && !searchQuery2 && !searchQuery3) {

                return; // Stop execution if no input is given
            }


            const response = await axios.get(`${urllink}Billing/dispatchsearch`, {
                params: {
                    name: searchQuery,
                    phone: searchQuery1,
                    barcode: searchQuery2,
                    invoice: searchQuery3,
                    Refering_Hospital: userRecord.Refering_Hospital

                },
            });
            const totalrecords = response.data.total_records
            const data = response.data.patients_data.map((row, index) => ({
                id: index + 1, // Assuming Patient_Id is the unique identifier
                ...row,
                status: 'Status',
            }));

            data.sort((a, b) => {
                const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ''), 10);
                const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ''), 10);
                return invoiceB - invoiceA;
            });
            setsumma([]);
            setTotalPages(0)
            setFilteredRows(data); // Set filtered search results into filteredRows
            setTotalPages((Math.ceil(totalrecords / pageSize)))

        } catch (error) {
            console.error('Error fetching search data:', error);
        }
    };



    // Handle search input change
    const handleSearchChange = (e, field) => {
        const value = e.target.value;
        if (field === 'name') setSearchQuery(value);
        if (field === 'phone') setSearchQuery1(value);
        if (field === 'barcode') setSearchQuery2(value);
        if (field === 'invoice') setSearchQuery3(value);
    };


    const handleSampleCapture = (params) => {
        console.log(params)
        // Directoly setting selectedrow to the new value
        const data = params

        // const data =filteredRows.find((p)=>+p.id===+params.row.id)
        setLoading(true);

        if (printpapaer) {
            dispatchvalue({ type: 'Capturesample', value: data });
            setTimeout(() => {
                setLoading(false);
                navigate('/Home/CompleteReports')
            }, 1000);


        } else {
            alert('choose print paper')
            setLoading(prev => (
                !prev
            ))
        }






        // navigate('/SampleCapture')
    };


    const handlesmartreport = (params) => {

        console.log(params)

        axios.get(`${urllink}Phelobotomist/get_data_for_smart_report?invoice=${params.Billing_Invoice}&Patientid=${params.Patient_Id}&Visitid=${params.Visit_Id}`)
            .then((response) => {
                console.log(response)
                let data = response.data
                let error = response.error
                if (error || data.length === 0) {
                    setOpenModel(false)
                } else {
                    setOpenModel(!openModel)

                    setsmartreport(response.data)

                }

            })
            .catch((error) => {
                console.log(error)
            })
    };

    const [signperson, setsignperson] = useState('')



    const handlechoosesign = (e, row) => {
        const { value } = e.target;
        console.log(value)
        setsignperson(value)
        dispatchvalue({ type: 'SignPerson', value: value });
    };



    const handlechoosep_paper = (e, row) => {
        const { value } = e.target;
        console.log(value)
        setprintpapaer(value)
        dispatchvalue({ type: 'printpapaer', value: value });
    };


    const dynamicColumns = [
        { field: 'Barcode', headerName: 'Sample Id', width: 100 },

        { field: 'Billing_Invoice', headerName: 'Invoice', width: 100 },
        { field: 'Visit_Id', headerName: 'Visit Id', width: 60 },
        { field: 'UpdatedAt', headerName: 'Date', width: 100 },
        { field: 'Patient_Name', headerName: 'Patient Name', width: 150 },
        { field: 'Age', headerName: 'Age', width: 80 },

        {
            field: 'actions',
            headerName: 'Options',
            width: 100,
            renderCell: (params) => (
                <>
                    <Button className='cell_btn' onClick={() => handleSampleCapture(params.row)}>
                        <ForwadIcon />
                    </Button>
                </>
            ),
        },
        {
            field: 'view',
            headerName: 'View',
            width: 100,
            renderCell: (params) => (
                <>
                    <Button className='cell_btn' onClick={() => handleview(params.row.TestDetails)}>
                        <VisibilityIcon />
                    </Button>
                </>
            ),
        },
        { field: 'Gender', headerName: 'Gender', width: 100 },
        { field: 'Phone', headerName: 'Phone', width: 120 },
        // { field: 'Patient_Group', headerName: 'Patient Group', width: 150 },
        { field: 'Refering_Doctor', headerName: 'Reference Doctor', width: 130 },
        // { field: 'Test_Name', headerName: 'Test Name', width: 150 },
        // { field: 'Test_value', headerName: 'Test Value', width: 150 },

        {
            field: "ChoosePrintPaper",
            headerName: "Choose PrintPaper",
            width: 150,
            renderCell: (params) => (
                <>
                    <select
                        value={params.value}
                        onChange={(e) => handlechoosep_paper(e, params.row)}
                    >
                        <option value=''>Select</option>
                        <option value='RMC'>RMC</option>
                        <option value='RDL'>RDL</option>
                    </select>

                </>
            ),
        },

        {
            field: "ChooseSign",
            headerName: "Choose Signature",
            width: 150,
            renderCell: (params) => (
                <>
                    <select
                        value={params.value}
                        onChange={(e) => handlechoosesign(e, params.row)}
                    >
                        <option value=''>Select</option>
                        <option value='Suresh'>Dr. M. Suresh Ph.D</option>
                        <option value='Aparna'>Dr.Aparna Devi C MD DM</option>
                    </select>

                </>
            ),
        },



        //   {
        //     field: 'smartaction',
        //     headerName: 'Smart Report',
        //     width: 100,
        //     renderCell: (params) => (
        //         <>
        //             <Button className='cell_btn' onClick={()=>handlesmartreport(params.row)}>
        //                 <GiProgression />
        //             </Button>
        //         </>
        //     ),
        // },
        {
            field: 'status', // Ensure this matches the key in your data
            headerName: 'Status',
            width: 100,
            renderCell: (params) => {
                // Handle possibly undefined Service_Statuses
                const serviceStatuses = params.row.Service_Statuses || [];
                return (
                    <Tooltip title={
                        <>
                            <div>Capture Status : {serviceStatuses[0].Capture}</div>
                            <div>Analaysis Status : {serviceStatuses[0].Analaysis}</div>
                            <div>Verified Status : {serviceStatuses[0].Verify}</div>
                            <div>Approve Status : {serviceStatuses[0].Approve}</div>
                        </>
                    } arrow>
                        <span>{params.row.status}</span>
                    </Tooltip>
                );
            },
        },
    ];


    const dynamicColumns1 = [
        { field: 'id', headerName: 'S No', width: 100 },
        { field: 'Test_Name', headerName: 'Test Name', width: 250 },
        { field: 'Service_Status', headerName: 'Collection Status', width: 100 },
        { field: 'Analysis_Status', headerName: 'Report Entry Status', width: 100 },
        { field: 'Verify_Status', headerName: 'Verify Status', width: 100 },
        { field: 'Approve_Status', headerName: 'Approve Status', width: 100 },
    ]


    useEffect(() => {
        smartreport.forEach((item) => {
            getColorName(item.Percentage)
        })

    }, [smartreport])


    const handleview = (params) => {
        console.log('params', params);

        settestdetails(params)
        setOpenModal(prev => (
            !prev
        ))
    }

    return (
        <>
            <div className="appointment">
                <div className="h_head">
                    <h3>Dispatch Que List</h3>

                </div>
                <div className="con_1 ">
                    <div className="inp_1">
                        <label htmlFor="input">Patient Name :</label>
                        <input type="text" value={searchQuery} onChange={(e) => handleSearchChange(e, 'name')} placeholder='Enter the Patient Name' />
                    </div>
                    <div className="inp_1">
                        <label htmlFor="input">Phone :</label>
                        <input type="text" value={searchQuery1} onChange={(e) => handleSearchChange(e, 'phone')} placeholder='Enter the Phone Number' />
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
                        <label htmlFor="input">Invoice No</label>
                        <input
                            id="input"
                            type="text"
                            value={searchQuery3}
                            onChange={(e) => handleSearchChange(e, 'invoice')}
                            placeholder='Enter Invoice Number'
                        />
                    </div>



                </div>
                <div className='grid_1'>
                    <ThemeProvider theme={theme}>
                        <DataGrid

                            rows={filteredRows.length > 0 ? filteredRows : summa}
                            columns={dynamicColumns}
                            pageSize={pageSize}
                            pageSizeOptions={[pageSize]}
                            hideFooterPagination
                            hideFooterSelectedRowCount
                            className="data_grid"
                        />

                        <div className="grid_foot">
                            <button
                                onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
                                disabled={page === 0} // Disable if on the first page
                            >
                                Previous
                            </button>
                            Page {page + 1} of {totalPages}
                            <button
                                onClick={() => setPage((prevPage) => prevPage + 1)}
                                // Disable if no more rows left
                                disabled={page + 1 >= totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </ThemeProvider>


                    {summa.length === 0 && (
                        <div className='IP_norecords'>
                            <span>No Records Found</span>
                        </div>
                    )}
                </div>
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={{ content: { ...yourStyles } }}>
                <div className="pdf_img_show">

                    <iframe
                        title="PDF Viewer"
                        src={modalContent}
                        style={{
                            width: "100%",
                            height: "435px",
                            border: "1px solid rgba(0, 0, 0, 0.5)", // Black border with reduced opacity
                        }}
                    />



                    <div className="jhuhhjh">
                        <Button
                            style={{ color: "white" }}
                            className="clse_pdf_img"
                            onClick={closeModal}
                        >
                            <HighlightOffIcon
                                style={{
                                    fontSize: "40px",
                                    backgroundColor: "var(--ProjectColor)",
                                    borderRadius: "40px",
                                }}
                            />
                        </Button>
                    </div>
                </div>
            </Modal>
            {openModal && (
                <div
                    className={
                        isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
                    }
                >
                    <div className="newwProfiles newwPopupforreason">

                        <div className='grid_1'>
                            <ThemeProvider theme={theme}>
                                <DataGrid
                                    rows={testdetails}
                                    columns={dynamicColumns1}
                                    pageSize={pageSize}
                                    pageSizeOptions={[pageSize]}

                                    hideFooterPagination
                                    hideFooterSelectedRowCount
                                    className='data_grid'
                                />

                            </ThemeProvider>
                        </div>
                        <div className="Register_btn_con">
                            <button
                                className="RegisterForm_1_btns"
                                onClick={() => setOpenModal(false)}
                            >
                                close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner">
                        <div className="rect1"></div>
                        <div className="rect2"></div>
                        <div className="rect3"></div>
                        <div className="rect4"></div>
                        <div className="rect5"></div>
                    </div>
                </div>
            )}



        </>
    );
}

export default NewDispatchQueue;
