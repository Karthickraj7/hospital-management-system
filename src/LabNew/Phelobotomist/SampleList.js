import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
// import { Helmet } from 'react-helmet';
// import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
// import './Neww.css';
// import Button from '@mui/material/Button';
// import ForwadIcon from "@mui/icons-material/Forward";
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import  faForward  from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

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

const SampleList= () => {
    // const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQuery1, setSearchQuery1] = useState('');
    const [summa, setsumma] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    // const [selectedrow,setselectedrow]  = useState([])
    const pageSize = 10;
    const totalPages = Math.ceil(filteredRows.length / pageSize);
    const showdown = filteredRows.length;

    const urllink = useSelector(state=>state.userRecord?.UrlLink)
    

    useEffect(() => {
      axios.get(`${urllink}Phelobotomist/getsamplelistphle`)
          .then((response) => {
            console.log(response.data)
              const data = response.data.map((row,index) => ({
                  id: index, // Assuming you want to use Patient_Id as id
                  ...row,
              }));
              data.sort((a, b) => {
                const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ''), 10);
                const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ''), 10);
                return invoiceB - invoiceA;
      });
              setsumma(data);
          })
          .catch((error) => {
              console.error('Error fetching data:', error);
          });
  }, [urllink]);
  
    

    useEffect(() => {
        const lowerCaseNameQuery = searchQuery.toLowerCase();
        const lowerCasePhoneQuery = searchQuery1.toLowerCase();
        const filteredData = summa.filter((row) => {
            const lowerCasePatientName = row.Patient_Name ? row.Patient_Name.toLowerCase() : '';
            const lowerCasePhone = row.Phone ? row.Phone.toLowerCase() : '';
            return lowerCasePatientName.includes(lowerCaseNameQuery) && lowerCasePhone.includes(lowerCasePhoneQuery);
        });
        setFilteredRows(filteredData);
    }, [searchQuery, searchQuery1, summa]);
    
    const handleSearchChange = (event, type) => {
        const value = event.target.value;
        if (type === 'name') {
            setSearchQuery(value);
        } else if (type === 'phone') {
            setSearchQuery1(value);
        }
    };

    // const dispatchvalue = useDispatch()
    
    // const handleSampleCapture = (params) => {
    //     // Directly setting selectedrow to the new value
    //     setselectedrow(params.row);
    

 

    //     dispatchvalue({type: 'Capturesample', value: params.row});
    
        
    //     console.log(dispatchvalue);
    //     navigate('/SampleCapture')
    // };
    
    // console.log('selectedrow', selectedrow);
    const dynamicColumns = [
        { field: 'Billing_Invoice', headerName: 'Invoice', width: 150 },
        
        { field: 'Patient_Id', headerName: 'Patient Id', width: 100 },
        // { field: 'UpdatedAt', headerName: 'Date', width: 150 },
        { field: 'Patient_Name', headerName: 'Patient Name', width: 200 },
        { field: 'Test_Name', headerName: 'Test Name', width: 150 },
        { field: 'Captured_Unit', headerName: 'Captured Unit', width: 150 },
        { field: 'UOM', headerName: 'Unit', width: 100 },
        { field: 'Medical_Remarks', headerName: 'Medical Remarks', width: 150 },
        { field: 'Technical_Remark', headerName: 'Technical Remark', width: 150 },
        { field: 'Status', headerName: 'Status', width: 130 },
        // { field: 'Test_Name', headerName: 'Test Name', width: 150 },
        // { field: 'Test_Count', headerName: 'Test Count', width: 150 },
        // { field: 'Test_value', headerName: 'Test Value', width: 150 },

        
        // {
        //     field: 'actions',
        //     headerName: 'Options',
        //     width: 200,
        //     renderCell: (params) => (
        //         <>
        //             <Button className='cell_btn' onClick={()=>handleSampleCapture(params)}>
        //                 <ForwadIcon/>
        //             </Button>
        //         </>
        //     ),
        // },
    ];

    return (
        <>
            <div className="appointment">
                <div className="h_head">
                    <h3>Sample Capture Completed List</h3>
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
                    
                </div>
                <div className='grid_1'>
                    <ThemeProvider theme={theme}>
                        <DataGrid
                            rows={filteredRows.slice(page * pageSize, (page + 1) * pageSize)}
                            columns={dynamicColumns}
                            pageSize={pageSize}
                            pageSizeOptions={[pageSize]}
                            onPageChange={(newPage) => setPage(newPage)}
                            hideFooterPagination
                            hideFooterSelectedRowCount
                            className='data_grid'
                        />
                        {showdown > 0 && filteredRows.length > pageSize && (
                            <div className='grid_foot'>
                                <button
                                    onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
                                    disabled={page === 0}
                                >
                                    Previous
                                </button>
                                Page {page + 1} of {totalPages}
                                <button
                                    onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages - 1))}
                                    disabled={page === totalPages - 1}
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
            </div>
        </>
    );
}

export default SampleList;

