import * as React from "react";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ownerDocument } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ForwardToInboxTwoToneIcon from "@mui/icons-material/ForwardToInboxTwoTone";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";

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

function ShortlistedResumelist() {
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [file, setfile] = useState(null);

  const [status, setstatus] = useState("Approved");

  const [filteredRows, setFilteredRows] = useState([]);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const showdown = filteredRows.length;
  const totalPages = Math.ceil(filteredRows.length / 10);
  const dispatchvalue = useDispatch();

  const [selectedrow, setselectedrow] = useState([]);

  // openmodal states

  const [Interviewdate, setInterviewdate] = useState("");
  const [Interviewtime, setInterviewtime] = useState("");
  const [Interviewlocaion, setInterviewlocaion] = useState("");
  const [Interviewaddress, setInterviewaddress] = useState("");
  const [googlemaplink, setgooglemaplink] = useState("");
  const [senderemail, setsenderemail] = useState("");
  const [InterviewRounds, setInterviewRounds] = useState("");
  const [InterviewRoundDetails, setInterviewRoundDetails] = useState("");

  const handlePageChange = (params) => {
    setPage(params.page);
  };

  const fetapproveddata = () => {

    if (status == 'Selected') {
      axios
      .get(
        `${urllink}HRmanagement/getselecteddata?location=${userRecord?.location}&status=${status}`
      )
      .then((response) => {
        console.log(response.data);
        const data = response.data;
        setFilteredRows([
          ...data.map((row, ind) => ({
            id: row.ResumeID,
            CandidateName: row.CandidateName,
            CandidateNumber: row.CandidateNumber,
            CandidateEmail: row.CandidateEmail,
            Resume: row.Resume,
            InterviewStatus: row.InterviewStatus,
            Interviewdate: row.Interviewdate,
            Interviewtime: row.Interviewtime,
            Role: row.Role,
            InterViewRounds: row.InterViewRounds,
            NextInterviewdate: row.NextInterviewdate,
            InterviewerName: row.InterviewerName,
            PerformanceMark: row.PerformanceMark,
            CompletedRound: row.CompletedRound,
          })),
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
    } else {
      axios
        .get(
          `${urllink}HRmanagement/getapproveddata?location=${userRecord?.location}&status=${status}`
        )
        .then((response) => {
          console.log(response.data);
          const data = response.data;
          setFilteredRows([
            ...data.map((row, ind) => ({
              id: row.ResumeID,
              CandidateName: row.CandidateName,
              CandidateNumber: row.CandidateNumber,
              CandidateEmail: row.CandidateEmail,
              Resume: row.Resume,
              InterviewStatus: row.InterviewStatus,
              Interviewdate: row.Interviewdate,
              Interviewtime: row.Interviewtime,
              Role: row.Role,
              InterViewRounds: row.InterViewRounds,
              NextInterviewdate: row.NextInterviewdate,
              InterviewerName: row.InterviewerName,
              PerformanceMark: row.PerformanceMark,
              CompletedRound: row.CompletedRound,
            })),
          ]);
        })
        .catch((error) => {
          console.error(error);
        });
    }


  };

  useEffect(() => {
    fetapproveddata(urllink, userRecord?.location, status);
  }, [urllink, userRecord?.location, status]);

  const handleview = (params) => {
    console.log(params);
    if (params.row.Resume) {
      setOpenModal(true);
      setfile(params.row.Resume);
    } else {
      alert("No Document to View");
    }
  };

  const handleproceed = (params) => {
    console.log(params);
    if (params.row.InterviewStatus === 'Not Scheduled') {
      const confirmation = window.confirm('First schedule the interview. Do you want to proceed?');
      if (confirmation) {
        // If the user confirms, proceed with scheduling the interview
        handlesendmail(params); // Call handlesendemail function
      } else {
        // If the user cancels, do nothing or provide feedback
      }
    } else {
      dispatchvalue({ type: 'SelectedCandidateData', value: params.row });
      navigate('/Home/InterviewProcessing-HR');
    }
  };


  const handlesendmail = (params) => {
    console.log(params.row);
    setOpenModal1(true);
    setselectedrow(params.row);
  };

  const columns = [
    { field: "id", headerName: "CandidateID / ResumeID", width: 180 },
    {
      field: "CandidateName",
      headerName: "Candidate Name",
      width: 150,
    },
    { field: "CandidateNumber", headerName: "Candidate Number", width: 150 },
    { field: "CandidateEmail", headerName: "Candidate Email", width: 200 },
    {
      field: "Resume",
      headerName: "Resume",
      width: 80,
      renderCell: (params) => (
        <>
          <Button className="cell_btn" onClick={() => handleview(params)}>
            <VisibilityIcon />
          </Button>
        </>
      ),
    },
    // { field: "Status", headerName: "Status", width: 100 },
  ];

  if (status === "Approved") {
    columns.push({
      field: "sendmail",
      headerName: "Schedule Interview",
      width: 140,
      renderCell: (params) => (
        <>
          <Button className="cell_btn" onClick={() => handlesendmail(params)}>
            <ForwardToInboxTwoToneIcon />
          </Button>
        </>
      ),
    });
  }

  if (status === "Approved") {
    columns.push({
      field: "InterviewStatus",
      headerName: "Interview Status",
      width: 170,
    });
  }

  if (status === "Approved") {
    columns.push({
      field: "Action",
      headerName: "Action",
      width: 80,
      renderCell: (params) => (
        <>
          <Button className="cell_btn" onClick={() => handleproceed(params)}>
            <ArrowForwardIcon />
          </Button>
        </>
      ),
    });
  }

  const handlesendemailtocandidate = () => {
    console.log("hai");
    const datatosend = new FormData();

    const resumeDataUrl = selectedrow.Resume;

    fetch(resumeDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        // Append the blob file to FormData
        datatosend.append("resume", blob, "resume.pdf");

        // Append other selected row data to FormData
        Object.entries(selectedrow).forEach(([key, value]) => {
          datatosend.append(key, value);
        });
        datatosend.append("Interviewdate", Interviewdate);
        datatosend.append("Interviewtime", Interviewtime);
        datatosend.append("Interviewlocaion", Interviewlocaion);
        datatosend.append("Interviewaddress", Interviewaddress);
        datatosend.append("googlemaplink", googlemaplink);
        datatosend.append("senderemail", senderemail);
        datatosend.append("CreatedBy", userRecord?.username);
        datatosend.append("Location", userRecord?.location);
        datatosend.append("RecuirterPhoneNumber", userRecord?.PhoneNumber);
        datatosend.append(
          "RecuirterName",
          userRecord?.First_Name + " " + userRecord?.Last_Name
        );
        datatosend.append("InterviewRounds", InterviewRounds);
        datatosend.append("InterviewRoundDetails", InterviewRoundDetails);

        // Send the FormData using axios.post
        axios
          .post(`${urllink}HRmanagement/sendemailtocandidate`, datatosend)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              setOpenModal1(false);
              fetapproveddata();
              setInterviewdate("");
              setInterviewtime("");
              setInterviewlocaion("");
              setInterviewaddress("");
              setgooglemaplink("");
              setsenderemail("");
              setInterviewRounds("");
              setInterviewRoundDetails("");
            } else {
              alert(response.data.Message);
              setOpenModal1(false);
            }
            // Handle response
          })
          .catch((error) => {
            // Handle error
          });
      });
  };

  const handleclose = () => {
    setOpenModal1(false);
    fetapproveddata();
    setInterviewdate("");
    setInterviewtime("");
    setInterviewlocaion("");
    setInterviewaddress("");
    setgooglemaplink("");
    setsenderemail("");
    setInterviewRounds("");
    setInterviewRoundDetails("");
  };

  return (
    <>
      <div className="appointment">
        <div className="h_head">
          <h4>Interview Schedule</h4>
          <div className="doctor_select_1 selt-dctr-nse vcxw2er">
            <label htmlFor="Calender"> Status :</label>
            <select
              className="Product_Master_div_select_opt"
              value={status}
              onChange={(e) => {
                setstatus(e.target.value);
              }}
            >
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Selected">Selected</option>
            </select>
          </div>
        </div>

        <br />
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
            <br />
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
      {openModal1 && (
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
            <div className="appointment">
              <div className="h_head">
                <h4>Inform to Candidate Via Mail</h4>
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1 ">
                <label htmlFor="candidateID">
                  Candidate ID / Resume ID<span>:</span>
                </label>
                <input
                  type="text"
                  name="candidateID"
                  id="candidateID"
                  value={selectedrow.id}
                  disabled
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1 ">
                <label htmlFor="CandidateName">
                  Candidate Name <span>:</span>
                </label>
                <input
                  type="text"
                  name="CandidateName"
                  id="CandidateName"
                  value={selectedrow.CandidateName}
                  disabled
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1 ">
                <label htmlFor="PhoneNumber">
                  Phone Number<span>:</span>
                </label>
                <input
                  type="text"
                  name="PhoneNumber"
                  id="PhoneNumber"
                  value={selectedrow.CandidateNumber}
                  disabled
                />
              </div>
            </div>

            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1 ">
                <label htmlFor="CandidateEmail">
                  Candidate Email<span>:</span>
                </label>
                <input
                  type="text"
                  name="CandidateEmail"
                  id="CandidateEmail"
                  value={selectedrow.CandidateEmail}
                  disabled
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1 ">
                <label htmlFor="InterviewRounds">
                  Interview Rounds<span>:</span>
                </label>
                <input
                  type="ext"
                  name="InterviewRounds"
                  id="InterviewRounds"
                  value={InterviewRounds}
                  onChange={(e) => {
                    setInterviewRounds(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1 ">
                <label htmlFor="InterviewRoundDetails">
                  Interview Round Details<span>:</span>
                </label>
                <textarea
                  id="InterviewRoundDetails"
                  name="Interviewlocaion"
                  value={InterviewRoundDetails}
                  onChange={(e) => {
                    setInterviewRoundDetails(e.target.value);
                  }}
                  required
                ></textarea>
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1 ">
                <label htmlFor="Interviewdate">
                  Interview Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="Interviewdate"
                  id="Interviewdate"
                  value={Interviewdate}
                  onChange={(e) => {
                    setInterviewdate(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1 ">
                <label htmlFor="Interviewtime">
                  Interview Time<span>:</span>
                </label>
                <input
                  type="time"
                  name="Interviewtime"
                  id="Interviewtime"
                  value={Interviewtime}
                  onChange={(e) => {
                    setInterviewtime(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1 ">
                <label htmlFor="Interviewlocaion">
                  Interview Location<span>:</span>
                </label>
                <input
                  type="text"
                  name="Interviewlocaion"
                  id="Interviewlocaion"
                  value={Interviewlocaion}
                  onChange={(e) => {
                    setInterviewlocaion(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1 ">
                <label htmlFor="Interviewaddress">
                  Interview Address<span>:</span>
                </label>
                <textarea
                  id="Interviewaddress"
                  name="Interviewlocaion"
                  value={Interviewaddress}
                  onChange={(e) => {
                    setInterviewaddress(e.target.value);
                  }}
                  required
                ></textarea>
              </div>
            </div>

            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1 ">
                <label htmlFor="googlemaplink">
                  GoogleMap Link<span>:</span>
                </label>
                <input
                  type="text"
                  name="googlemaplink"
                  id="googlemaplink"
                  value={googlemaplink}
                  onChange={(e) => {
                    setgooglemaplink(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1 ">
                <label htmlFor="senderemail">
                  Sender Email ID<span>:</span>
                </label>
                <input
                  type="text"
                  name="senderemail"
                  id="senderemail"
                  value={senderemail}
                  onChange={(e) => {
                    setsenderemail(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="Register_btn_con regster_btn_contsai">
              <button className="RegisterForm_1_btns" onClick={handleclose}>
                <CloseTwoToneIcon />
              </button>
              <button
                className="RegisterForm_1_btns"
                onClick={handlesendemailtocandidate}
              >
                <SendTwoToneIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShortlistedResumelist;
