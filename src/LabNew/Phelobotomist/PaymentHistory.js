

import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "#54d854bf",
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
          borderBottom: "1px solid  #54d854bf !important",
          display: 'flex',
          justifyContent: 'center'
        },
      },
    },
  },
});


const PaymentHistory = () => {
  const [page, setPage] = useState(0);
  const [filteredRows, setFilteredRows] = useState([]);
  const pageSize = 10;
  const urllink = useSelector(state=>state.userRecord?.UrlLink)
  

  useEffect(() => {
    // Fetch payment history data from the backend using Axios
    axios.get(`${urllink}Billing/getpatienthistorydata`)
      .then((response) => {
        const data = response.data.map((row) => ({
          id: row.Patient_Id, // Assuming you want to use Patient_Id as id
          ...row,
        }));
        setFilteredRows(data);
        console.log("Backend Data:", data);
      })
      .catch((error) => {
        console.error('Error fetching payment history data:', error);
      });
  }, []);

  const dynamicColumns = [
    { field: 'Patient_Id', headerName: 'Bill Number', width: 150 },
    { field: 'Patient_Name', headerName: 'Patient Name', width: 150 },
    { field: 'Address', headerName: 'Address', width: 200 },
    { field: 'Phone', headerName: 'Phone', width: 150 },
    { field: 'Refering_Doctor', headerName: 'Reference Doctor', width: 150 },
    // { field: 'Net_Total', headerName: 'Test Count', width: 150 },
    { field: 'PaymentDetails_Net_Amount', headerName: 'Cross Total', width: 150 },
    { field: 'BillingAmount_Discount', headerName: 'Discount', width: 150 },
    { field: 'BillingAmount_Item_Count', headerName: 'Tax', width: 150 },
    { field: 'BillingAmount_Net_Amount', headerName: 'Net Total', width: 150 },
    { field: 'PaymentDetails_Paid_Amount', headerName: 'Received', width: 150 },
    { field: 'PaymentDetails_Remaing_Amount', headerName: 'Duepending', width: 150 },
    // { field: 'PaymentDetails_Billing_Invoice', headerName: 'Option', width: 150 }
    {
      field: 'PaymentDetails_Billing_Invoice',
      headerName: 'Option',
      width: 150,
      renderCell: (params) => (
        <FontAwesomeIcon icon={faPrint} color="#54d854" size="lg" />
      ),
    },
  ];

  return (
    <>
      <div className="appointment">
        <div className="h_head">
          <h3>Payment History</h3>
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
    </>
  );
}

export default PaymentHistory;
