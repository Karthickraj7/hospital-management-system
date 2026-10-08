import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Visibility from "@mui/icons-material/Visibility";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import "./EmployeeDutyManagement.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import PlaylistAddTwoToneIcon from "@mui/icons-material/PlaylistAddTwoTone"; // Required for select event
import PlaylistRemoveTwoToneIcon from "@mui/icons-material/PlaylistRemoveTwoTone";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import HotelIcon from "@mui/icons-material/Hotel";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";


function NursevsNurseStationList() {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [NurseStationData, setNurseStationData] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [selectedRowData, setselectedRowData] = useState({});
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [openmodel, setopenmodel] = useState(false);
  const [pendingMappings, setPendingMappings] = useState([]);
  const [sourceStation, setSourceStation] = useState("");
  const [targetStation, setTargetStation] = useState("");
  const [nursesToSwap, setNursesToSwap] = useState([]);
  const [nurseStations, setNurseStations] = useState([]);
  const [nurses, setNurses] = useState([]);
  const toast = useSelector((state) => state.userRecord?.toast);

  const toggleRow = (row) => {
    console.log(row);

    if (openRow === row.NurseStationid) {
      setOpenRow(null);
    } else {
      setOpenRow(row.NurseStationid);
      setselectedRowData(row);
    }
  };

  const handleOpenSwapDialog = () => {
    setSwapDialogOpen(true);
  };

  const handleseewards = (row) => {
    setselectedRowData(row);
    setopenmodel(true);
  };

  const handlenavigate = () => {
    navigate("/Home/NurseMappingtoNurseStation");
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/NurseStationData`)
      .then((response) => {
        setNurseStations(response.data);
      })
      .catch((error) => {});
  }, [UrlLink]);

  // Fetch nurses based on location
  useEffect(() => {
    if (userRecord?.location) {
      axios
        .get(
          `${UrlLink}HR_Management/Get_All_Nurses?Location=${userRecord?.location}`
        )
        .then((response) => {
          setNurses(response.data);
        })
        .catch((error) => {});
    }
  }, [UrlLink, userRecord?.location]);

  const fetchMappings = useCallback(() => {
    axios
      .get(`${UrlLink}HR_Management/AssignNurseToStation`)
      .then((response) => {
        setNurseStationData(response.data);
      })
      .catch((error) => {
      });
  }, [UrlLink]);

  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  const EmployeeColumns = [
    { key: "Employee_ID", name: "Employee ID", frozen: true },
    { key: "EmployeeName", name: "Employee Name", frozen: true },
    { key: "Gender", name: "Gender" },
    { key: "Department_Name", name: "Department" },
    { key: "Designation", name: "Designation" },
  ];

  const handleCloseSwapDialog = () => {
    setSwapDialogOpen(false);
    setSourceStation("");
    setTargetStation("");
    setNursesToSwap([]);
  };

  const getStationName = (NurseStationid) => {
    const station = nurseStations.find(
      (s) => s.NurseStationid === NurseStationid
    );
    return station && station.NurseStationName;
  };

  const handleSwapNurses = () => {
    if (!sourceStation || !targetStation || nursesToSwap.length === 0) {
      alert("Please select source station, target station, and nurses to swap");
      return;
    }

    // Check if any nurse is already in the target station
    const targetNurses = getNursesForStation(targetStation);
    const duplicates = nursesToSwap.filter((nurseId) =>
      targetNurses.includes(nurseId)
    );

    if (duplicates.length > 0) {
      alert(
        `The following nurses are already in the target station: ${duplicates.join(
          ", "
        )}`
      );
      return;
    }

    // Remove selected nurses from source station
    nursesToSwap.forEach((nurseId) => {
      removeFromPendingMappings(sourceStation, nurseId);
    });

    // Add them to target station
    nursesToSwap.forEach((nurseId) => {
      addToPendingMappings(targetStation, nurseId);
    });

    // Clear the selection after swapping
    setNursesToSwap([]);
  };

  const addToPendingMappings = (NurseStationid, nurseId) => {
    setPendingMappings((prev) => {
      const existingStationIndex = prev.findIndex(
        (m) => m.NurseStationid === NurseStationid
      );

      if (existingStationIndex >= 0) {
        const updatedMappings = [...prev];
        if (
          !updatedMappings[existingStationIndex].Employee_ID.includes(nurseId)
        ) {
          updatedMappings[existingStationIndex] = {
            ...updatedMappings[existingStationIndex],
            Employee_ID: [
              ...updatedMappings[existingStationIndex].Employee_ID,
              nurseId,
            ],
          };
        }
        return updatedMappings;
      } else {
        return [
          ...prev,
          {
            NurseStationid,
            Employee_ID: [nurseId],
            created_by: userRecord?.username,
            Location: userRecord?.location,
            Status: "Active",
          },
        ];
      }
    });
  };

  const removeFromPendingMappings = (NurseStationid, nurseId) => {
    setPendingMappings((prev) => {
      const updatedMappings = prev.map((mapping) => {
        if (mapping.NurseStationid === NurseStationid) {
          return {
            ...mapping,
            Employee_ID: mapping.Employee_ID.filter((id) => id !== nurseId),
          };
        }
        return mapping;
      });

      return updatedMappings.filter(
        (mapping) => mapping.Employee_ID.length > 0
      );
    });
  };

  const getNursesForStation = (NurseStationid) => {
    const existingMapping = NurseStationData.find(
      (m) => m.NurseStationid === NurseStationid
    );
    const pendingMapping = pendingMappings.find(
      (m) => m.NurseStationid === NurseStationid
    );

    if (pendingMapping) {
      return pendingMapping.Employee_ID;
    } else if (existingMapping) {
      return existingMapping.Employee_ID;
    }

    return [];
  };

  const getNurseName = (nurseId) => {
    const nurse = nurses.find((n) => n.Employee_ID === nurseId);
    return nurse ? nurse.EmployeeName : "";
  };

  const handleFinalSubmit = async () => {
    console.log(pendingMappings);
    axios
      .post(`${UrlLink}HR_Management/AssignNurseToStation`, pendingMappings)
      .then((res) => {
        console.log(res);
        const rest = res.data;
        const type = Object.keys(rest)[0];
        const mess = Object.values(rest)[0];
        dispatch({ type: "toast", value: { message: mess, type } });
        fetchMappings();
        setSwapDialogOpen(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="Main_container_app">
      <h3>NURSE VS NURSESTATION</h3>
      <br />
      <div
        style={{
          display: "flex",
          gap: "10px",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={handlenavigate}
        >
          ASSIGN NEW NURSE TO STATION
        </Button>
        <Button
          variant="outlined"
          startIcon={<SwapHorizIcon />}
          onClick={handleOpenSwapDialog}
          sx={{ width: "100%", maxWidth: "250px" }}
        >
          Swap Nurses
        </Button>
      </div>
      <br />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "85%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "rgb(90 255 72 / 32%)",
              display: "inline-block",
              marginRight: "10px",
              border: "1px solid grey",
            }}
          ></span>
          - Head Nurse Station
        </div>
      </div>
      <div className="NewTest_Master_grid_M_head_M">
        <TableContainer className="NewTest_Master_grid_M">
          <Table className="dehduwhd_o8i">
            <TableHead>
              <TableRow>
                <TableCell width={50}>S.No</TableCell>
                <TableCell width={250}>Nurse Station</TableCell>
                <TableCell width={500}>Station Location</TableCell>
                <TableCell width={200}>Wards</TableCell>
                <TableCell width={150}>Nurse Count</TableCell>
                <TableCell width={50}>View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {console.log(NurseStationData)}
              {Array.isArray(NurseStationData) &&
                NurseStationData.map((row, index) => (
                  <React.Fragment key={index}>
                    <TableRow
                      style={{
                        backgroundColor:
                          index % 2 === 1
                            ? "var(--selectbackgroundcolor)"
                            : "white",
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell
                        sx={{
                          backgroundColor:
                            row?.HeadNurseStation === "Yes"
                              ? "rgb(90 255 72 / 32%)"
                              : "",
                        }}
                      >
                        <span>{row.NurseStationName}</span>
                      </TableCell>
                      <TableCell>
                        {row?.Floor_Name} , {row?.Block_Name},{" "}
                        {row?.Building_Name} , {row?.Location_Name}
                      </TableCell>
                      <TableCell>
                        <div style={{ padding: "5px" }}>
                          <Button
                            startIcon={
                              <HotelIcon
                                sx={{
                                  color: "green",
                                  height: "20px",
                                  width: "20px",
                                }}
                              />
                            }
                            onClick={() => handleseewards(row)}
                            variant="outlined"
                            placeholder="Wards"
                          >
                            See Wards
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{row.Nurse_Count}</TableCell>
                      <TableCell>
                        <span
                          aria-label="expand row"
                          onClick={() => toggleRow(row)}
                        >
                          {openRow === row.NurseStationid ? (
                            <PlaylistRemoveTwoToneIcon />
                          ) : (
                            <PlaylistAddTwoToneIcon />
                          )}
                        </span>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={openRow === row.NurseStationid}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>
                            <div
                              style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                backgroundColor: "transparent",
                              }}
                            >
                              <div className="Main_container_app">
                                <h3>Nurse Details</h3>
                                <br />

                                {selectedRowData &&
                                Array.isArray(selectedRowData?.Employee_ID) ? (
                                  <ReactGrid
                                    columns={EmployeeColumns}
                                    RowData={selectedRowData?.Employee_ID}
                                  />
                                ) : (
                                  <span>No Nurse Assigned</span>
                                )}
                              </div>
                            </div>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog
        open={swapDialogOpen}
        onClose={handleCloseSwapDialog}
        maxWidth="md"
      >
        <DialogTitle>Swap Nurses Between Stations</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                <InputLabel>Source Station</InputLabel>
                <Select
                  value={sourceStation}
                  label="Source Station"
                  onChange={(e) => setSourceStation(e.target.value)}
                >
                  {nurseStations.map((station) => (
                    <MenuItem
                      key={station.NurseStationid}
                      value={station.NurseStationid}
                    >
                      {station.NurseStationName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {sourceStation && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Nurses to Move
                  </Typography>
                  <Paper sx={{ p: 1, maxHeight: "200px", overflow: "auto" }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {getNursesForStation(sourceStation).map((nurseId) => (
                        <Chip
                          key={nurseId?.Employee_ID}
                          label={getNurseName(nurseId?.Employee_ID)}
                          color={
                            nursesToSwap.includes(nurseId?.Employee_ID)
                              ? "primary"
                              : "default"
                          }
                          onClick={() => {
                            if (nursesToSwap.includes(nurseId?.Employee_ID)) {
                              setNursesToSwap(
                                nursesToSwap.filter(
                                  (id) => id !== nurseId?.Employee_ID
                                )
                              );
                            } else {
                              setNursesToSwap([
                                ...nursesToSwap,
                                nurseId?.Employee_ID,
                              ]);
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                <InputLabel>Target Station</InputLabel>
                <Select
                  value={targetStation}
                  label="Target Station"
                  onChange={(e) => setTargetStation(e.target.value)}
                >
                  {nurseStations
                    .filter(
                      (station) => station.NurseStationid !== sourceStation
                    )
                    .map((station) => (
                      <MenuItem
                        key={station.NurseStationid}
                        value={station.NurseStationid}
                      >
                        {station.NurseStationName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              {targetStation && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Current Nurses at Target
                  </Typography>
                  <Paper sx={{ p: 1, maxHeight: "200px", overflow: "auto" }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {getNursesForStation(targetStation).length > 0 ? (
                        getNursesForStation(targetStation).map((nurseId) => (
                          <Chip
                            key={nurseId}
                            label={getNurseName(nurseId)}
                            variant="outlined"
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No nurses assigned
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                </Box>
              )}
            </Grid>
          </Grid> 
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseSwapDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleSwapNurses}
            variant="outlined"
            disabled={
              !sourceStation || !targetStation || nursesToSwap.length === 0
            }
          >
            Swap Nurses
          </Button>
          <Button
            onClick={handleFinalSubmit}
            variant="outlined"
            disabled={pendingMappings.length === 0}
          >
            Submit Changes
          </Button>
        </DialogActions>
      </Dialog>
      {openmodel && (
        <div className="overlay1" onClick={() => setopenmodel(false)}>
          <div className="openModal1" onClick={(e) => e.stopPropagation()}>
            <div className="Main_container_app">
              <h3>Wards of ({selectedRowData?.NurseStationName})</h3>
            </div>
            <br />
            <div
              style={{
                display: "flex",
                width: "90%",
                gap: "10px",
                alignItems: "flex-start",
                marginLeft: "10px",
              }}
            >
              <div
                style={{
                  width: "70%",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "10px",
                }}
              >
                {selectedRowData &&
                  Array.isArray(selectedRowData?.Wards) &&
                  selectedRowData?.Wards.map((ward, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span>
                          <strong>
                            {index + 1}.{ward.WardName}
                            WARD (
                            <span
                              style={{
                                color: ward?.Status ? "green" : "red",
                              }}
                            >
                              {ward?.Status ? "ACTIVE" : "INACTIVE"}
                            </span>
                            )
                          </strong>
                        </span>
                        <span>BED COUNT : {ward?.BedCount}</span>
                        <span>
                          {ward?.Floor_Name} , {ward?.Block_Name} ,{" "}
                          {ward?.Building_Name} , {ward?.Location_Name}
                        </span>
                      </div>
                    </Box>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
}

export default NursevsNurseStationList;
