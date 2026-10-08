import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "var(--ProjectColor)",
        },
        root: {
          "& .MuiDataGrid-window": {
            overflow: "hidden !important",
          },
        },
        cell: {
          borderTop: "0px !important",
          borderBottom: "1px solid var(--ProjectColor) !important",
        },
      },
    },
  },
});

const TAT = () => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  const [SearchformData, setSearchformData] = useState({
    Location: "",
    DateType: "",
    CurrentDate: "",
    FromDate: "",
    ToDate: "",
    invoiceno: "",
  });

  const [Location, setLocation] = useState([]);

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
    if (name === "DateType") {
      if (value === "Current") {
        setSearchformData({
          ...SearchformData,
          CurrentDate: formattedDate,
          [name]: value,
        });
      } else {
        setSearchformData({
          ...SearchformData,
          CurrentDate: "",
          [name]: value,
        });
      }
    } else {
      setSearchformData({
        ...SearchformData,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, "dd-MM-yyyy");
    setSearchformData((prev) => ({
      ...prev,
      date: formattedDate,
    }));
    axios
      .get(`${urllink}usercontrol/getlocationdata`)
      .then((response) => {
        const data = response.data.map((p) => p.location_name);
        setLocation(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [urllink]);

  const dynamicColumns = [
    { field: "id", headerName: "S.NO", width: 50 },
    { field: "Location", headerName: "Branch Name", width: 130 },
    { field: "Billing_Invoice", headerName: "Invoice NO", width: 130 },
    { field: "Patient_Name", headerName: "PATIENT NAME", width: 150 },
    { field: "Patient_Id", headerName: "PAtient Id", width: 100 },
    { field: "Visit_Id", headerName: "Visit Id", width: 100 },
    { field: "Age", headerName: "Age", width: 100 },
    { field: "Gender", headerName: "Gender", width: 100 },
    { field: "Phone_Number", headerName: "MOBILE NUMBER", width: 100 },
    {
      field: "Referring_Doctor_Name",
      headerName: "Ref Doctor Name",
      width: 150,
    },
    { field: "Barcode_Id", headerName: "Barcode Id", width: 150 },
    { field: "Test_Name", headerName: "Test Name", width: 150 },
    { field: "RegDate", headerName: "Reg Date/Time", width: 150 },
    { field: "CreatedBy", headerName: "Reg User", width: 100 },
    { field: "outsource_type", headerName: "Outsource Type", width: 130 },
    {
      field: "collecteddatetime",
      headerName: "Sample Collect D/T",
      width: 130,
    },
    { field: "userphelop", headerName: "Sample Collected User", width: 130 },
    {
      field: "Capture_Sample_Status",
      headerName: "Sample Capture Status",
      width: 130,
    },
    { field: "Received_date", headerName: "Sample Received D/T", width: 150 },
    { field: "Received_user", headerName: "Received User", width: 130 },
    { field: "Test_done_date", headerName: "Test Done D/T", width: 150 },
    { field: "Test_Done_User", headerName: "Test Done user", width: 130 },
    { field: "Analyze_Status", headerName: "Analyze Status", width: 130 },
    { field: "process_datetime", headerName: "Process D/T", width: 130 },
    { field: "Process_Rec_User", headerName: "Process User", width: 130 },
    { field: "Verify_Status", headerName: "Verify Status", width: 130 },
    { field: "Authorize_DateTime", headerName: "Authorize D/T", width: 130 },
    { field: "Authorized_User", headerName: "Authorized User", width: 130 },
    { field: "Approve_Status", headerName: "Approve Status", width: 130 },
    { field: "PrintDateTime", headerName: "Print D/T", width: 130 },
    { field: "Printuser", headerName: "Print user", width: 130 },
    { field: "dispatch_date", headerName: "Dispatch D/T", width: 130 },
    { field: "dispatch_user", headerName: "Dispatch User", width: 130 },
    {
      field: "register_collect_timing",
      headerName: "register collect Timing",
      width: 130,
    },
    {
      field: "collection_Received_timing",
      headerName: "collection Received Timing",
      width: 130,
    },
    {
      field: "process_Received_timing",
      headerName: "process Received Timing",
      width: 130,
    },
    {
      field: "received_done_timing",
      headerName: "received done Timing",
      width: 130,
    },
    {
      field: "total_process_time_formatted",
      headerName: "Total Timing ",
      width: 130,
    },
    {
      field: "total_process_time_minutes",
      headerName: "Total Minutes",
      width: 130,
    },
    { field: "original_TAT", headerName: "original TAT", width: 130 },
    { field: "actual_TAT", headerName: "Actual TAT", width: 130 },
    {
      field: "original_TAT_seconds",
      headerName: "Original TAT Seconds",
      width: 130,
    },
    {
      field: "actual_TAT_seconds",
      headerName: "Actual TAT Seconds",
      width: 130,
    },
    { field: "Beyond_tat", headerName: "Beyond TAT", width: 130 },
  ];

  const handletoSearch = () => {
    const params = {
      Location: SearchformData.Location,
      DateType: SearchformData.DateType,
      CurrentDate: SearchformData.CurrentDate,
      FromDate: SearchformData.FromDate,
      ToDate: SearchformData.ToDate,
      invoiceno: SearchformData.invoiceno,
    };

    let requiredFields = [];
    if (SearchformData.DateType === "Customize") {
      requiredFields = ["Location", "DateType", "FromDate", "ToDate"];
    } else if (SearchformData.DateType) {
      requiredFields = ["Location", "DateType"];
    } else {
      requiredFields = ["Location", "invoiceno"];
    }
    const existingItem = requiredFields.filter(
      (field) => !SearchformData[field]
    );
    if (existingItem.length > 0) {
      alert(`Please Fill the RequiredFields : ${existingItem.join(",")} `);
    } else {
      axios
        .get(`${urllink}Billing/get_tat_report`, { params })
        .then((response) => {
          // console.log('111',response.data)
          const A_data = response.data;
          const B_data = A_data.map((p, index) => ({
            id: index + 1,
            ...p,
          }));
          setFilteredRows(B_data);
          console.log("111B_data", B_data);
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
  };

  const handleExportToExcel = () => {
    if (filteredRows.length !== 0) {
      const columns = [
        { datakey: "id", headerName: "S.NO" },
        { datakey: "Location", headerName: "Branch Name" },
        { datakey: "Billing_Invoice", headerName: "Invoice NO" },
        { datakey: "Patient_Name", headerName: "PATIENT NAME" },
        { datakey: "Patient_Id", headerName: "PAtient Id" },
        { datakey: "Visit_Id", headerName: "Visit Id" },
        { datakey: "Age", headerName: "Age" },
        { datakey: "Gender", headerName: "Gender" },
        { datakey: "Phone_Number", headerName: "MOBILE NUMBER" },
        { datakey: "Referring_Doctor_Name", headerName: "Ref Doctor Name" },
        { datakey: "Barcode_Id", headerName: "Barcode Id" },
        { datakey: "Test_Name", headerName: "Test Name" },
        { datakey: "RegDate", headerName: "Reg Date/Time" },
        { datakey: "CreatedBy", headerName: "Reg User" },
        { datakey: "outsource_type", headerName: "Outsource Type" },
        { datakey: "collecteddatetime", headerName: "Sample Collect D/T" },
        { datakey: "userphelop", headerName: "Sample Collected User" },
        {
          datakey: "Capture_Sample_Status",
          headerName: "Sample Capture Status",
        },
        { datakey: "Received_date", headerName: "Sample Received D/T" },
        { datakey: "Received_user", headerName: "Received User" },
        { datakey: "Test_done_date", headerName: "Test Done D/T" },
        { datakey: "Test_Done_User", headerName: "Test Done user" },
        { datakey: "Analyze_Status", headerName: "Analyze Status" },
        { datakey: "process_datetime", headerName: "Process D/T" },
        { datakey: "Process_Rec_User", headerName: "Process User" },
        { datakey: "Verify_Status", headerName: "Verify Status" },
        { datakey: "Authorize_DateTime", headerName: "Authorize D/T" },
        { datakey: "Authorized_User", headerName: "Authorized User" },
        { datakey: "Approve_Status", headerName: "Approve Status" },
        { datakey: "PrintDateTime", headerName: "Print D/T" },
        { datakey: "Printuser", headerName: "Print user" },
        { datakey: "dispatch_date", headerName: "Dispatch D/T" },
        { datakey: "dispatch_user", headerName: "Dispatch User" },
        {
          datakey: "register_collect_timing",
          headerName: "register collect Timing",
        },
        {
          datakey: "collection_Received_timing",
          headerName: "collection Received Timing",
        },
        {
          datakey: "process_Received_timing",
          headerName: "process Received Timing",
        },
        { datakey: "received_done_timing", headerName: "received done Timing" },
        { datakey: "total_process_time_formatted", headerName: "Total Timing" },
        { datakey: "total_process_time_minutes", headerName: "Total Minutes" },
        { datakey: "original_TAT", headerName: "original TAT" },
        { datakey: "actual_TAT", headerName: "Actual TAT" },
        { datakey: "original_TAT_seconds", headerName: "Original TAT Seconds" },
        { datakey: "actual_TAT_seconds", headerName: "Actual TAT Seconds" },
        { datakey: "Beyond_tat", headerName: "Beyond TAT" },
      ];

      const header = columns.map((col) => col.headerName).join(",");

      const rows = filteredRows.map((row) => {
        return columns
          .map((col) => {
            let cellValue = row[col.datakey];
            if (typeof cellValue === "string") {
              // Escape quotes by doubling them
              cellValue = `"${cellValue.replace(/"/g, '""')}"`;
            }
            return cellValue;
          })
          .join(",");
      });

      const csvContent = [
        "\ufeff" + header, // BOM + header row
        ...rows,
      ].join("\r\n");

      const data = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(data, "TAT Report.csv");
    } else {
      alert("No Data to Save");
    }
  };

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>TAT Report</h4>
      </div>
      <br />


      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="">
            Location <span>:</span>
          </label>
          <select
            name="Location"
            value={SearchformData.Location}
            onChange={handleChange}
          >
            <option value="">Select</option>
            {Location.map((p) => (
              <option key={p} value={p}>
                {p.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="RegisForm_1">
                                <label htmlFor="">Invoice No <span>:</span></label>
                                <input
                                    name="invoiceno"
                                    value={SearchformData.invoiceno}
                                    onChange={handleChange}

                                />
                            </div> */}

        <div className="RegisForm_1">
          <label htmlFor="">
            Date Type <span>:</span>
          </label>
          <select
            name="DateType"
            value={SearchformData.DateType}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Current">Current Date</option>
            <option value="Customize">Customize</option>
          </select>
        </div>

        {SearchformData.DateType === "Current" && (
          <div className="RegisForm_1">
            <label htmlFor="">
              Current Date <span>:</span>
            </label>
            <input
              type="date"
              name="CurrentDate"
              value={SearchformData.CurrentDate}
              onChange={handleChange}
            />
          </div>
        )}
        {SearchformData.DateType === "Customize" && (
          <>
            <div className="RegisForm_1">
              <label htmlFor="">
                From Date <span>:</span>
              </label>
              <input
                type="date"
                name="FromDate"
                value={SearchformData.FromDate}
                onChange={handleChange}
              />
            </div>
            <div className="RegisForm_1">
              <label htmlFor="">
                To Date <span>:</span>
              </label>
              <input
                type="date"
                name="ToDate"
                value={SearchformData.ToDate}
                onChange={handleChange}
              />
            </div>
          </>
        )}
      </div>
<br />

      <div className="Register_btn_con">
      <button className="RegisterForm_1_btns" onClick={handletoSearch}>
        Search
      </button>
</div>
      <div className="grid_1">
        <ThemeProvider theme={theme}>
          <div className="grid_1">
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
              className="data_grid"
            />
            {showdown > 0 && filteredRows.length > 10 && (
              <div className="grid_foot">
                <button
                  onClick={() =>
                    setPage((prevPage) => Math.max(prevPage - 1, 0))
                  }
                  disabled={page === 0}
                >
                  Previous
                </button>
                Page {page + 1} of {totalPages}
                <button
                  onClick={() =>
                    setPage((prevPage) =>
                      Math.min(prevPage + 1, totalPages - 1)
                    )
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
          ""
        ) : (
          <div className="IP_norecords">
            <span>No Records Found</span>
          </div>
        )}
      </div>
      {filteredRows.length !== 0 && (
        <div className="PrintExelPdf">
          <button onClick={handleExportToExcel}>Save Exel</button>
        </div>
      )}
    </div>
  );
};

export default TAT;
