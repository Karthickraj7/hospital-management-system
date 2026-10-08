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
import { useSelector } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import TaskAltIcon from '@mui/icons-material/TaskAlt';


const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "var(--ProjectColor)",
          textAlign: 'Center',
          color: "var(--header-text-color)"
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


const Analyzereport = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const navigate = useNavigate();
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

  const [summa, setsumma] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedrow, setselectedrow] = useState([])
  const pageSize = 10;

  const showdown = filteredRows.length;
  const [totalPages, setTotalPages] = useState(0); // New state for total pages
  const urllink = useSelector(state => state.userRecord?.UrlLink)

  const get = useSelector((state) => state.userRecord?.searchLab);
  const toast = useSelector((state) => state.userRecord?.toast);

  useEffect(() => {
    console.log("GET--------------->>>", get);
    if (get.name !== "" || get.date !== "") {
      const [day, month, year] = get.date.split("-");
      const formatted = `${year}-${month}-${day}`; // yyyy-MM-dd
      setSearchQuery5(formatted);
      setSearchQuery(get.name)
    }
  }, [get]);


  useEffect(() => {
    const offset = page * pageSize;
    const departmentCodes = userRecord?.Lab_Department?.join(','); // Convert array to comma-separated string

    const isSearchCleared = !searchQuery && !searchQuery1 && !searchQuery2 && !searchQuery3;
    // if (isSearchCleared) {
    axios.get(`${urllink}Lab/getanalysislist?Location=${userRecord?.location}&limit=${pageSize}&offset=${offset}&Department=${departmentCodes}&name=${searchQuery}&id=${searchQuery1}&barcode=${searchQuery2}&invoice=${searchQuery3}&dateType=${searchQuery4}&date=${searchQuery5}&from=${searchQuery6}&to=${searchQuery7}`)
      .then((response) => {
        console.log(response.data)
        const totalrecords = response.data.total_records;
        const data = response.data.patients_data.map((row, index) => ({
          id: index, // Assuming you want to use Patient_Id as id
          ...row,
        }));
        data.sort((a, b) => {
          const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ''), 10);
          const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ''), 10);
          return invoiceB - invoiceA;
        });
        setFilteredRows([])
        setTotalPages(0)
        setsumma(prev => [...data]);
        setTotalPages(Math.ceil(totalrecords / pageSize));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    // } else {
    //   console.log("Performing search...");
    //   // Perform search
    //   fetchSearchData();
    // }
  }, [urllink, userRecord.location, userRecord?.Department, page, searchQuery, searchQuery1, searchQuery2, searchQuery3, searchQuery5, searchQuery6, searchQuery7]);

  // const fetchSearchData = async () => {

  //   try {
  //     // Check if at least one search query is provided
  //     if (!searchQuery && !searchQuery1 && !searchQuery2 && !searchQuery3) {

  //       return; // Stop execution if no input is given
  //     }

  //     const departmentCodes = userRecord?.Lab_Department?.join(','); // Convert array to comma-separated string

  //     const response = await axios.get(`${urllink}Lab/searchlabtechnician`, {
  //       params: {
  //         name: searchQuery,
  //         phone: searchQuery1,
  //         barcode: searchQuery2,
  //         invoice: searchQuery3,
  //         Location: userRecord.userRecord?.location,
  //         Department: departmentCodes,

  //       },
  //     });
  //     const totalrecords = response.data.total_records
  //     const data = response.data.patients_data.map((row, index) => ({
  //       id: index + 1, // Assuming Patient_Id is the unique identifier
  //       ...row,
  //       status: 'Status',
  //     }));

  //     data.sort((a, b) => {
  //       const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ''), 10);
  //       const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ''), 10);
  //       return invoiceB - invoiceA;
  //     });
  //     setsumma([]);
  //     setTotalPages(0)
  //     setFilteredRows(data); // Set filtered search results into filteredRows
  //     setTotalPages((Math.ceil(totalrecords / pageSize)))

  //   } catch (error) {
  //     console.error('Error fetching search data:', error);
  //   }
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
    setPage(0);
  };


  const dispatchvalue = useDispatch()


  const handleprovisionalreport = () => {
    dispatchvalue({ type: 'HrFolder', value: 'provisionalreportlist' });
    dispatchvalue({ type: "setPreviousFolder", value: "LabTechnician" });
  }

  // const handleSampleCapture = (params) => {
  //   // Directly setting selectedrow to the new value
  //   setselectedrow(params.row);
  //   dispatchvalue({ type: 'Capturesample', value: params.row });


  //   console.log(dispatchvalue);
  //   dispatchvalue({ type: 'HrFolder', value: 'NavigationLab' });
  //   dispatchvalue({ type: "setPreviousFolder", value: null });
  // };


  const handleSampleCapture = (params) => {
    // Directly setting selectedrow to the new value
    if (params.row.SampleState === "Completed") {
      const tdata = {
        message: "Sample Already Recived...",
        type: "success",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return
    }
    setselectedrow(params.row);

    dispatchvalue({ type: "Capturesample", value: params.row });

    console.log(dispatchvalue);
    dispatchvalue({ type: "HrFolder", value: "NavigationLab" });
    dispatchvalue({ type: "activeTab", value: "CaptureApprove" });
    dispatchvalue({ type: "setPreviousFolder", value: "LabTechnician" });
  };

  const handleReportEntry = (params) => {
    // Directly setting selectedrow to the new value
    setselectedrow(params.row);
    dispatchvalue({ type: "Capturesample", value: params.row });

    console.log(dispatchvalue);
    dispatchvalue({ type: "HrFolder", value: "NavigationLab" });
    dispatchvalue({ type: "activeTab", value: "Reportentry" });
    dispatchvalue({ type: "setPreviousFolder", value: "LabTechnician" });
  };




  console.log('selectedrow', selectedrow);
  const dynamicColumns = [
    { key: 'Barcode_Id', headerName: 'Sample Barcode', width: 150 },
    { key: 'Patient_Id', headerName: 'Patient Id', width: 80 },
    { key: 'billdept', headerName: 'Dept', width: 80 },
    { key: 'CreatedAt', headerName: 'Date', width: 100 },
    { key: 'Billing_Invoice', headerName: 'OP/IP No', width: 100 },
    { key: 'Patient_Name', headerName: 'Patient Name', width: 130 },
    { key: 'Age', headerName: 'Age', width: 70 },
    // {
    //   key: 'actions',
    //   headerName: 'Options',
    //   width: 150,
    //   renderCell: (params) => (
    //     <>
    //       <Button className='cell_btn' onClick={() => handleSampleCapture(params)}>
    //         <ForwadIcon />
    //       </Button>
    //     </>
    //   ),
    // },
    {
      key: "actions",
      headerName: "Sample",
      width: 150,
      renderCell: (params) => (
        <>
          {params.row.SampleState === "Completed" ? (
            <><Button
              className="cell_btn"
              onClick={() => handleSampleCapture(params)}
            >
              <TaskAltIcon />
            </Button>  </>
          ) : (
            <Button
              className="cell_btn"
              onClick={() => handleSampleCapture(params)}
            >
              <ErrorOutlineIcon />
            </Button>
          )}
        </>
      ),
    },
    {
      key: "actions",
      headerName: "Reprot Entry",
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => handleReportEntry(params)}
          >
            <ForwadIcon />
          </Button>
        </>
      ),
    },

    { key: 'Gender', headerName: 'Gender', width: 100 },
    // { key: 'Address', headerName: 'Address', width: 150 },
    { key: 'Phone', headerName: 'Phone', width: 130 },
    // { key: 'Patient_Group', headerName: 'Patient Group', width: 150 },
    { key: 'Refering_Doctor', headerName: 'Reference Doctor', width: 150 },
    // { key: 'Test_Name', headerName: 'Test Name', width: 150 },
    // { key: 'Test_value', headerName: 'Test Value', width: 150 },



  ];


  return (
    <>
      <div className="appointment">
        <ToastAlert Message={toast.message} Type={toast.type} />

        <div className="h_head">
          <h3 style={{ color: "white" }}>Lab Technician List</h3>
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
            <label htmlFor="input">Patient Name :</label>
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
            <label htmlFor="input">Phone :</label>
            <input type="text" value={searchQuery1} onChange={(e) => handleSearchChange(e, 'phone')} placeholder='Enter the Phone Number' />
          </div>
          <div className="inp_1">
            <label htmlFor="input">Invoice No :</label>
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

export default Analyzereport;










