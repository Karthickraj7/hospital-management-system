import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Modal from "react-modal";
import EditIcon from "@mui/icons-material/Edit";

import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "var(--ProjectColor)",
          textAlign: "Center",
        },
        root: {
          "& .MuiDataGrid-root .MuiDataGrid-columnHeader, .MuiDataGrid-columnHeaderTitleContainer":
            {
              textAlign: "center",
              display: "flex !important",
              justifyContent: "center !important",
            },
          "& .MuiDataGrid-window": {
            overflow: "hidden !important",
          },
        },
        cell: {
          borderTop: "0px !important",
          borderBottom: "1px solid  var(--ProjectColor) !important",
          display: "flex",
          justifyContent: "center",
        },
      },
    },
  },
});

function ConsultancyTypeUpList() {
  
  const yourStyles = {
    position: "absolute",
    inset: "100px",
    border: "1px solid rgb(204, 204, 204)",
    background: "rgb(97 90 90 / 75%)",
    overflow: "auto",
    borderRadius: "4px",
    outline: "none",
    padding: "0px",
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const navigate = useNavigate();
  const dispatchvalue = useDispatch();
  const Urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);

  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);

  const pageSize = 10;
  const showdown = filteredRows.length;
  const totalPages = Math.ceil(filteredRows.length / 10);
  const [file, setfile] = useState(null);

  const handlePageChange = (params) => {
    setPage(params.page);
  };

  const handleVisibilityClick = (params) => {
    console.log(params);
    if (params.row.ContractForm) {
      setOpenModal(true);
      setfile(params.row.ContractForm);
    } else {
      alert("No Document to View");
    }
  };

  const handleEdit = (params) => {
    console.log(params);
    dispatchvalue({ type: "ConsultancyMasterdata", value: params.row });
    navigate("/Home/Consultancy-Mater");
  };

  const [columns] = React.useState([
    {
      field: "Consultancyname",
      headerName: "Consultancy Name",
      width: 200,
    },
    {
      field: "PhoneNumber",
      headerName: "Phone Number",
      width: 130,
    },
    {
      field: "ConsultingService",
      headerName: "Consulting Service",
      width: 200,
    },
    {
      field: "Status",
      headerName: "Status",
      width: 100,
    },
    {
      field: "ContractForm",
      headerName: "Contract Form",
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => handleVisibilityClick(params)}
          >
            <VisibilityIcon />
          </Button>
        </>
      ),
    },
    {
      field: "Edit ",
      headerName: "Edit",
      width: 80,
      renderCell: (params) => (
        <>
          <Button className="cell_btn" onClick={() => handleEdit(params)}>
            <EditIcon />
          </Button>
        </>
      ),
    },
  ]);

  useEffect(() => {
    axios
      .get(
        `${Urllink}HRmanagement/getconsultancymaster?location=${userRecord?.location}`
      )
      .then((response) => {
        console.log(response.data);
        const data = response.data;

        setRows(
          data.map((userdata, index) => ({
            id: index + 1,
            ...userdata,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userRecord?.location]);

  const handleSearchChange = (event) => {
    const { id, value } = event.target;

    if (id === "FirstName") {
      setSearchQuery(value);
    }
  };

  const handleNavigate = () => {
    dispatchvalue({ type: "ConsultancyMasterdata", value: [] });
    navigate("/Home/Consultancy-Mater");
  };

  useEffect(() => {
    const filteredData = rows.filter((row) => {
      const lowerCaseSupplierName = row.Consultancyname.toLowerCase();

      const startsWithFirstName = lowerCaseSupplierName.startsWith(
        searchQuery.toLowerCase()
      );

      return startsWithFirstName || !searchQuery;
    });

    // If there is a search query, sort the data to bring the left-to-right matching rows to the top

    setFilteredRows(filteredData);
    setPage(0);
  }, [searchQuery, rows]);

  return (
    <>
      <div className="appointment">
        <div className="h_head">
          <h4>Consultancy Master List</h4>
        </div>
        <div className="con_1 ">
          <div className="inp_1">
            <label htmlFor="input">
              Consultancy Name
              <span>:</span>
            </label>
            <input
              type="text"
              id="FirstName"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Enter Consultancy Name"
            />
          </div>
          <div className="Register_btn_con">
            <button className="btn_1" onClick={handleNavigate}>
              <AddIcon />
            </button>
          </div>
        </div>
        <ThemeProvider theme={theme}>
          <div className="grid_1">
            <DataGrid
              rows={filteredRows.slice(page * pageSize, (page + 1) * pageSize)}
              columns={columns}
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
        {filteredRows.length !== 0 ? (
          ""
        ) : (
          <div className="IP_norecords">
            <span>No Records Found</span>
          </div>
        )}
      </div>

      {openModal && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setOpenModal(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pdf_img_show">
              {file.toLowerCase().startsWith("data:application/pdf;base64,") ? (
                <iframe
                  title="PDF Viewer"
                  src={file}
                  style={{
                    width: "100%",
                    height: "435px",
                    border: "1px solid rgba(0, 0, 0, 0.5)",
                  }}
                />
              ) : (
                <img
                  src={file}
                  alt="Concern Form"
                  style={{
                    width: "80%",
                    height: "75%",
                    marginTop: "20px",
                  }}
                />
              )}
            </div>
            <div className="Register_btn_con regster_btn_contsai">
              <button
                className="RegisterForm_1_btns"
                onClick={() => setOpenModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default ConsultancyTypeUpList;
