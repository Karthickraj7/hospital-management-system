import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";

import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import MoneyIcon from "@mui/icons-material/Money";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import Button from "@mui/material/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Modal from "@mui/material/Modal";
import '../PatientManagement/PatientProfile.css';

import { useDispatch, useSelector } from "react-redux";

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
          borderBottom: "1px solid  var(--ProjectColor) !important",
        },
      },
    },
  },
});

function EmployeeProfile() {
  const foremployeedata = useSelector(
    (state) => state.userRecord?.foremployeedata
  );

  console.log(foremployeedata)

  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);

  // const [bankdetails, setbankdetails] = useState({});
  // const [financedetails, setfinancedetails] = useState({});
  // const [epfdetails, setepfdetails] = useState({});
  // const [documentsdetails, setdocumentsdetails] = useState({});

  // useEffect(() => {
  //   const forfinance = foremployeedata?.[2] || [];
  //   const forbank = foremployeedata?.[3] || [];
  //   const forepf = foremployeedata?.[4] || [];
  //   const fordocuments = foremployeedata?.[5] || [];

  //   setbankdetails([forbank]);
  //   setfinancedetails([forfinance]);
  //   setepfdetails([forepf]);
  //   setdocumentsdetails([fordocuments]);
  // }, [foremployeedata]); // Empty dependency array ensures the effect runs only once after the initial render

  // const employeepersonaldetails = foremployeedata?.[0] || [];
  // const employeerolldata = foremployeedata?.[1] || [];
  // const employeefinance = foremployeedata?.[2] || [];
  // const employeebank = foremployeedata?.[3] || [];
  // const employeeepfdetails = foremployeedata?.[4] || [];
  // const employeedocuments = foremployeedata?.[5] || [];
  // const [modalContent, setModalContent] = useState("");
  // const [modalIsOpen, setModalIsOpen] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [selecteddocument, setselecteddocument] = useState(null);


  const [photo, setPhoto] = useState(null);
  const [Rowdata, setRowData] = useState([]);
  const [page, setPage] = useState(0);
  const [show, setShow] = useState("");
  const [column, setColumn] = useState([]);
  const [salaryType, setSalaryType] = useState("fixed");


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



  const handleVisibilityClick = (View) => {
    console.log(View)
    setOpenModal1(true)
    setselecteddocument(View)

  };

  const handleOpenModle = (summa) => {
    setShow(summa);
    if (summa === "Bank Account Details") {
      setColumn([
        { field: "AccountName", headerName: "Account Holder Name", width: 180 },
        { field: "AccountNumber", headerName: "Account Number", width: 180 },
        { field: "BankName", headerName: "Bank Name", width: 180 },
        { field: "Branch", headerName: "Branch", width: 180 },
        { field: "IFSCCode", headerName: "IFSC Code", width: 180 },
        { field: "PanNumber", headerName: "Pan Number", width: 180 },
      ]);
      setOpenModal(true);

      setRowData(
        foremployeedata.map((row, index) => ({
          id: index+1,
          ...row
        }))
      )
    } else if (summa === "Financial Details") {
      setOpenModal(true);

      const commonColumns = [
        { field: "SalaryType", headerName: "Salary Type", width: 150 },
        { field: "PayScale", headerName: "Pay Scale", width: 150 },
      ];
      const salaryType = foremployeedata[0].SalaryType;

      let salaryTypeColumns = [];
      if (salaryType === "fixed") {
        salaryTypeColumns = [
          { field: "Basic_Salary", headerName: "Basic Payment", width: 150 },
        ];
      } else if (salaryType === "hourly") {
        salaryTypeColumns = [
          { field: "PeHour", headerName: "Per Hour", width: 150 },
        ];
      } else if (salaryType === "commission") {
        salaryTypeColumns = [
          { field: "PercentageOfCommission", headerName: "% of Commission", width: 150 },
          { field: "FixedAmount", headerName: "Fixed Amount", width: 150 },
          {
            field: "ComissionAmount",
            headerName: "Commission Amount",
            width: 150,
          },
          { field: "remarks", headerName: "Remarks", width: 150 },
        ];
      } else if (salaryType === "allowance") {
        salaryTypeColumns = [
          { field: "TravelAllowance", headerName: "Travel Allowance", width: 150 },
          { field: "HouseRentalAmount", headerName: "HRA", width: 150 },
          { field: "MedicalAllowance", headerName: "Medical Allowance", width: 150 },
        ];
      }

      const columns = [...commonColumns, ...salaryTypeColumns];
      setColumn(columns); // Assuming setColumns is the correct function to set your columns
      setRowData(
        foremployeedata.map((row, index) => ({
          id: row.EmployeeID,
          ...row
        }))
      )
    } else if (summa === "EPF Details") {
      setColumn([
        { field: "EPFNumber", headerName: "EPF Number", width: 250 },
        { field: "UANNumber", headerName: "UAN Number", width: 150 },
        // { field: "esiNumber", headerName: "ESI Number", width: 150 },
      ]);
      setOpenModal(true);
      setRowData(
        foremployeedata.map((row, index) => ({
          id: row.EmployeeID,
          ...row
        }))
      )
    } else if (summa === "Documents Details") {
      const initialRowData = [
        {
          id: 1,
          documents: ["Resume"],
          View: foremployeedata[0]?.Resume || "",
          CreatedAt: foremployeedata[0]?.created_at || "",
        },
        {
          id: 2,
          documents: ["Offer Letter"],
          View: foremployeedata[0]?.OfferLetter || "",
          CreatedAt: foremployeedata[0]?.created_at || "",
        },
        {
          id: 3,
          documents: ["Contract"],
          View: foremployeedata[0]?.Contract || "",
          CreatedAt: foremployeedata[0]?.created_at || "",
        },
        {
          id: 4,
          documents: ["Joining Letter"],
          View: foremployeedata[0]?.JoiningLetter || "",
          CreatedAt: foremployeedata[0]?.created_at || "",
        },
        {
          id: 9,
          documents: ["Others"],
          View: foremployeedata[0]?.Others || "",
          CreatedAt: foremployeedata[0]?.created_at || "",
        },

        // Add more rows as needed
      ];

      setColumn([
        { field: "id", headerName: "Sl No", width: 100 },
        {
          field: "documents",
          headerName: "Documents",
          width: 200,
        },
        {
          field: "View",
          headerName: "View",
          width: 100,
          renderCell: (params) => (
            <>
              <Button
                className="cell_btn"
                onClick={() => handleVisibilityClick(params.value)}
              >
                <VisibilityIcon />
              </Button>
            </>
          ),
        },
        { field: "CreatedAt", headerName: "Date", width: 100 },
      ]);

      setRowData(initialRowData);

      setOpenModal(true);
    }
  };

  const DisplayData = () => {
    const showdown = Rowdata.length;
    const pageSize = 10;

    const handlePageChange = (params) => {
      setPage(params.page);
    };

    const totalPages = Math.ceil(Rowdata.length / 10);

    return (
      <>

        <div className="appointment">
          <div className="h_head">
            <h4> {show + " List"}</h4>
          </div>
          <ThemeProvider theme={theme}>
            <div className="grid_1">
              <DataGrid
                rows={Rowdata.slice(page * pageSize, (page + 1) * pageSize)}
                columns={column}
                pageSize={pageSize} // Set the page size to your desired value
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: pageSize, // Set the page size to your desired value
                    },
                  },
                }}
                pageSizeOptions={[pageSize]} // Set the page size options to your desired values
                onPageChange={handlePageChange}
                hideFooterPagination
                hideFooterSelectedRowCount
                className="data_grid"
              />
              {showdown > pageSize && (
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

          {showdown !== 0 && Rowdata.length !== 0 ? (
            ""
          ) : (
            <div className="IP_norecords">
              <span>No Records Found</span>
            </div>
          )}
        </div>
      </>
    );
  };
  return (
    <div className="appointment">
      <div className="h_head">
        <h4>Employee Profile</h4>
      </div>
      {/* <br /> */}
      <div className="p_data">
        <div className="p_p_detials hid-prof-tils">
          <div className="p_profile_img_head">
            {foremployeedata[0]?.EmployeePhoto && (
              <div className="p_profile_img img_096">
                <img src={`${foremployeedata[0]?.EmployeePhoto}`} />
              </div>
            )}

            <div className="p_profile_name">
              <h3>{foremployeedata[0]?.EmployeeName}</h3>

              <div className="p_profile_body_icon icn-emp-pro-cs">
                <h5>
                  <PhoneAndroidIcon />
                  <p>
                    <h4 className="ieudh78e6e34">
                      {foremployeedata[0]?.PhoneNumber || ""}
                    </h4>
                  </p>
                </h5>
              </div>

              <div className="p_profile_body_icon">
                <h5>
                  <EmailIcon />
                  <p>
                    <h4 className="ieudh78e6e34">
                      {foremployeedata[0]?.Email || ""}
                    </h4>
                  </p>
                </h5>
              </div>
            </div>
          </div>

          <div className="p_profile_body">
            <h3>Address</h3>
            <div className="p_profile_body_icon">
              <HomeIcon />
              <div className="text-hmeicn">
                {foremployeedata[0]?.CommunicationAddress || ""}
              </div>
            </div>
          </div>
        </div>

        <div className="p_p_detial_1">
          <div className="p_p_data">
            <div className="p_profile_data overview">
              <h3>Overview </h3>
            </div>
            <div className="p_profile_items_11">
              <div className="p_profile_items">
                <div className="p_profile_data">
                  <h6>Gender :</h6>
                  <h3>{foremployeedata[0]?.Gender || ""}</h3>
                </div>
                <div className="p_profile_data">
                  <h6>Age :</h6>
                  <h3>{foremployeedata[0]?.Age || ""}</h3>
                </div>
              </div>

              <div className="p_profile_items">
                <div className="p_profile_data">
                  <h6> Date of Birth :</h6>
                  <h3>{foremployeedata[0]?.DateofBirth || ""}</h3>
                </div>
                <div className="p_profile_data">
                  <h6>Qualification :</h6>
                  <h3>{foremployeedata[0]?.Qualification || ""}</h3>
                </div>
              </div>

              <div className="p_profile_items">
                <div className="p_profile_data">
                  <h6>Nationality :</h6>
                  <h3>{foremployeedata[0]?.Nationality || ""}</h3>
                </div>
                <div className="p_profile_data">
                  <h6>Aadhar Number :</h6>
                  <h3>{foremployeedata[0]?.AadhaarNumber || ""}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="p_p_data">
            <div className="p_profile_items_11">
              <div className="p_profile_items">
                <div className="p_profile_data">
                  <h6>Employee ID :</h6>
                  <h4>{foremployeedata[0]?.EmployeeID || ""}</h4>
                </div>
                <div className="p_profile_data">
                  <h6>Department :</h6>
                  <h4>{foremployeedata[0]?.Department || ""}</h4>
                </div>
              </div>
              <div className="p_profile_items">
                <div className="p_profile_data">
                  <h6> Designation :</h6>
                  <h4>{foremployeedata[0]?.Designation || ""}</h4>
                </div>
                <div className="p_profile_data">
                  <h6>Date Of Joining :</h6>
                  <h4>{foremployeedata[0]?.DateofJoining || ""}</h4>
                </div>
              </div>
              <div className="p_profile_items">
                <div className="p_profile_data">
                  <h6>Reporting Manager :</h6>
                  <h4>{foremployeedata[0]?.ReportingManager || ""}</h4>
                </div>
                <div className="p_profile_data">
                  <h6>Employee Status :</h6>
                  <h4>{foremployeedata[0]?.EmployeeStatus || ""}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p_data_1 emp-prof-cntraln">
        <div className="p_p_data_detial_1 gap-fr-empl-prof ">
          <div className="p_p_data_items_left flx-wrp-modals">
            <button
              className="p_p_data_items flex_1"
              onClick={() => handleOpenModle("Bank Account Details")}
            >
              <div className="p_profile_img cente_1">
                <AccountBalanceIcon />
              </div>
              <h3>Bank Account Details</h3>
              <ChevronRightIcon />
            </button>

            <button
              className="p_p_data_items flex_1"
              onClick={() => handleOpenModle("Financial Details")}
            >
              <div className="p_profile_img cente_1">
                <MoneyIcon />
              </div>
              <h3>Financial Details</h3>
              <ChevronRightIcon />
            </button>
            <button
              className="p_p_data_items flex_1"
              onClick={() => handleOpenModle("EPF Details")}
            >
              <div className="p_profile_img cente_1">
                <AssignmentIndIcon />
              </div>
              <h3>EPF Details</h3>
              <ChevronRightIcon />
            </button>
            <button
              className="p_p_data_items flex_1"
              onClick={() => handleOpenModle("Documents Details")}
            >
              <div className="p_profile_img cente_1">
                <AssignmentIcon />
              </div>
              <h3>Documents Details</h3>
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        <div className="p_p_data_detial_2">
          <div className="p_p_data_detials_2_images">
            {foremployeedata[0]?.EmployeePhoto && (
              <div className="p_p_data_detials_2_img">
                <img src={`${foremployeedata[0]?.EmployeePhoto}`} alt="" />
              </div>
            )}
          </div>
          <div className="p_p_data_detials_2_view">View</div>
        </div>
      </div>

      {openModal && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
        >
          <div className="newwProfiles">
            <DisplayData />
            <button
              className="closeicon-cs"
              onClick={() => setOpenModal(false)}
            >
              close
            </button>
          </div>
        </div>
      )}



      {openModal1 && (
        <div className={isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"}>
          <div className="newwProfiles">
            <div>
              {selecteddocument.startsWith('data:application/pdf;base64,') ? (
                <iframe src={selecteddocument} title="Document" style={{height: '100%' , width: '100%'}} />
              ) : selecteddocument.startsWith('data:image/jpg;base64,') ? (
                <img src={selecteddocument} alt="Document" style={{height: '100%' , width: '100%'}} />
              ) : null}
            </div>
            <br />
            <button className="closeicon-cs" onClick={() => setOpenModal1(false)}>
              close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default EmployeeProfile;
