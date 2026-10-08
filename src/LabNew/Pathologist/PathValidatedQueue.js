import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPrint } from '@fortawesome/free-solid-svg-icons';
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





function PathValidatedQueue() {
    const [page, setPage] = useState(0);
    const [filteredRows, setFilteredRows] = useState([]);
    const pageSize = 10;
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQuery1, setSearchQuery1] = useState('');
    const [summa, setsumma] = useState([]);
    const urllink = useSelector(state=>state.userRecord?.UrlLink)



   
    const dynamicColumns = [
         { field: 'Analyse_Id', headerName: 'Analyse  Id', width: 105 },
         { field: 'Test', headerName: 'Test', width: 150 },
         { field: 'Sample_Specimen', headerName: 'Sample Specimen', width: 155 },
         { field: 'Method', headerName: 'Method', width: 150 },
         { field: 'Capture_Value', headerName: 'Capture Value', width: 140 },
         { field: 'Panic_Low', headerName: 'Panic Low', width: 150 },
         { field: 'Panic_High', headerName: 'Panic High', width: 150 },
         { field: 'Medical_Remark', headerName: 'Remarks', width: 150 },
         { field: 'Status', headerName: 'Status', width: 150 },
      ];

      useEffect(() => {
        // Fetch payment history data from the backend using Axios
        axios.get(`${urllink}Phelobotomist/get_record_from_lab_pathalogist_completed`)
          .then((response) => {
            const data = response.data.map((row) => ({
              id: row.Analyse_Id, // Assuming you want to use Patient_Id as id
              ...row,
            }));
            setsumma(data);
            console.log("Backend Data:", data);
          })
          .catch((error) => {
            console.error('Error fetching payment history data:', error);
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

    return (
        <div className="appointment">
            <div className="h_head">
                <h4>
                  Approval Completed List</h4>
            </div>
            <div className="con_1 ">
                    <div className="inp_1">
                        <label htmlFor="input">Test Name :</label>
                        <input type="text" value={searchQuery} onChange={(e) => handleSearchChange(e, 'name')} placeholder='Enter the Patient Name' />
                    </div>
                    <div className="inp_1">
                        <label htmlFor="input">Sample Name :</label>
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
            {filteredRows.length > pageSize && (
              <div className='grid_foot'>
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




           

        </div>
    );
}

export default PathValidatedQueue;

