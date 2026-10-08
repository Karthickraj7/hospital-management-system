import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";

function NurseMappingtoNurseStation() {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [nurseSearchQuery, setNurseSearchQuery] = useState("");
  const [pendingMappings, setPendingMappings] = useState([]);
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [sourceStation, setSourceStation] = useState("");
  const [targetStation, setTargetStation] = useState("");
  const [nursesToSwap, setNursesToSwap] = useState([]);
  const [nurseStations, setNurseStations] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [mappings, setMappings] = useState([]);

  // Fetch nurse stations
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${UrlLink}Masters/NurseStationData`)
      .then((response) => {
        setNurseStations(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load nurse stations");
        setLoading(false);
      });
  }, [UrlLink]);

  // Fetch nurses based on location
  useEffect(() => {
    if (userRecord?.location) {
      setLoading(true);
      axios
        .get(
          `${UrlLink}HR_Management/Get_All_Nurses?Location=${userRecord?.location}`
        )
        .then((response) => {
          setNurses(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError("Failed to load nurses");
          setLoading(false);
        });
    }
  }, [UrlLink, userRecord?.location]);

  // Fetch existing mappings
  const fetchMappings = useCallback(() => {
    setLoading(true);
    axios
      .get(`${UrlLink}HR_Management/AssignNurseToStation`)
      .then((response) => {
        setMappings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load current mappings");
        setLoading(false);
      });
  }, [UrlLink]);

  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  // Filter nurses based on search query
  const getFilteredNurses = () => {
    if (!nurseSearchQuery.trim()) {
      return nurses;
    }

    const searchTerm = nurseSearchQuery.toLowerCase();
    return nurses.filter((nurse) =>
      nurse.EmployeeName.toLowerCase().includes(searchTerm)
    );
  };

  // Add or update a pending mapping
  const addToPendingMappings = (NurseStationid, nurseId) => {
    setPendingMappings((prev) => {
      // Check if station already exists in pending mappings
      const existingStationIndex = prev.findIndex(
        (m) => m.NurseStationid === NurseStationid
      );

      if (existingStationIndex >= 0) {
        // Station exists, update its nurses
        const updatedMappings = [...prev];

        // Check if nurse is already assigned to this station
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
        // Station doesn't exist, add new mapping
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

  // Remove a nurse from pending mappings
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

      // Remove any stations that now have no nurses
      return updatedMappings.filter(
        (mapping) => mapping.Employee_ID.length > 0
      );
    });
  };

  // Handle adding a nurse to a station
  const handleAddNurse = (NurseStationid, nurseId) => {
    // First remove nurse from any other pending station (can't be in two stations)
    pendingMappings.forEach((mapping) => {
      if (
        mapping.NurseStationid !== NurseStationid &&
        mapping.Employee_ID.includes(nurseId)
      ) {
        removeFromPendingMappings(mapping.NurseStationid, nurseId);
      }
    });

    // Then add to the selected station
    addToPendingMappings(NurseStationid, nurseId);
  };

  // Handle swapping nurses between stations
  const handleOpenSwapDialog = () => {
    setSwapDialogOpen(true);
  };

  const handleCloseSwapDialog = () => {
    setSwapDialogOpen(false);
    setSourceStation("");
    setTargetStation("");
    setNursesToSwap([]);
  };

  const handleSwapNurses = () => {
    if (!sourceStation || !targetStation || nursesToSwap.length === 0) {
      setError(
        "Please select source station, target station, and nurses to swap"
      );
      return;
    }

    // Get current nurses from the target station
    const currentMapping = mappings.find(
      (m) => m.NurseStationid === targetStation
    );
    const targetNurses = currentMapping ? currentMapping.Employee_ID : [];

    // Remove selected nurses from source station
    nursesToSwap.forEach((nurseId) => {
      removeFromPendingMappings(sourceStation, nurseId);
    });

    // Add them to target station
    nursesToSwap.forEach((nurseId) => {
      addToPendingMappings(targetStation, nurseId);
    });

    setSuccess(
      `Nurses swapped from ${getStationName(sourceStation)} to ${getStationName(
        targetStation
      )}`
    );
    handleCloseSwapDialog();
  };

  // Submit all pending mappings
  const handleSubmitAllMappings = () => {
    if (pendingMappings.length === 0) {
      setError("No changes to submit");
      return;
    }

    setLoading(true);
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
        setPendingMappings([]);
        setTimeout(() => {
          navigate("/Home/HR");
        }, 700);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Handle removing an existing mapping
  const handleRemoveMapping = (mappingId) => {
    setLoading(true);
    axios
      .delete(`${UrlLink}Masters/RemoveNurseMapping/${mappingId}`)
      .then(() => {
        setSuccess("Mapping removed successfully");
        fetchMappings(); // Refresh mappings
      })
      .catch(() => {
        setError("Failed to remove mapping");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Find station name by ID
  const getStationName = (NurseStationid) => {
    const station = nurseStations.find(
      (s) => s.NurseStationid === NurseStationid
    );
    return station ? station.NurseStationName : "Unknown Station";
  };

  // Find nurse name by ID
  const getNurseName = (nurseId) => {
    const nurse = nurses.find((n) => n.Employee_ID === nurseId);
    return nurse ? nurse.EmployeeName : "Unknown Nurse";
  };

  // Combine existing mappings with pending changes for display
  const getCombinedMappings = () => {
    const combined = [...mappings];

    pendingMappings.forEach((pending) => {
      const existingIndex = combined.findIndex(
        (m) => m.NurseStationid === pending.NurseStationid
      );

      if (existingIndex >= 0) {
        // Update existing mapping
        combined[existingIndex] = {
          ...combined[existingIndex],
          Employee_ID: pending.Employee_ID,
          isPending: true,
        };
      } else {
        // Add new mapping
        combined.push({
          ...pending,
          id: `pending-${pending.NurseStationid}`,
          isPending: true,
        });
      }
    });

    return combined;
  };

  // Check if a nurse is assigned to a station in pending mappings
  const isNursePendingForStation = (NurseStationid, nurseId) => {
    const pendingMapping = pendingMappings.find(
      (m) => m.NurseStationid === NurseStationid
    );
    return pendingMapping && pendingMapping.Employee_ID.includes(nurseId);
  };

  // Check if a nurse is available (not assigned to any station in pending mappings)
  const isNurseAvailable = (nurseId, excludeStationId = null) => {
    return !pendingMappings.some(
      (mapping) =>
        mapping.NurseStationid !== excludeStationId &&
        mapping.Employee_ID.includes(nurseId)
    );
  };

  // Get all nurses assigned to a station (including pending)
  const getNursesForStation = (NurseStationid) => {
    const existingMapping = mappings.find(
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

  // Clear search input
  const handleClearSearch = () => {
    setNurseSearchQuery("");
  };

  return (
    <div className="Main_container_app">
      <h3>Nurse to Nurse Station Mapping</h3>
      <br />
      <Box sx={{ marginBottom: 4 }}>
        <span>
          Assign Nurses To Specific Nurse Stations. You can assign multiple
          nurses to different stations and submit all changes at once.
        </span>
      </Box>

      <Grid container spacing={3}>
        {/* Station Selection Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent
              style={{
                padding: "20px",
                backgroundColor: "var(--selectbackgroundcolor)",
              }}
            >
              <span>Assign Nurses to Stations</span>
              <br />
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="station-select-label">
                    Select Nurse Station
                  </InputLabel>
                  <Select
                    labelId="station-select-label"
                    id="station-select"
                    value={sourceStation}
                    label="Select Nurse Station"
                    onChange={(e) => setSourceStation(e.target.value)}
                    disabled={loading || nurseStations.length === 0}
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
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Available Nurses
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search nurses by name..."
                      value={nurseSearchQuery}
                      onChange={(e) => setNurseSearchQuery(e.target.value)}
                      sx={{ mb: 1 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: nurseSearchQuery && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={handleClearSearch}
                              edge="end"
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Paper
                      elevation={0}
                      sx={{
                        p: 1,
                        bgcolor: "#f9f9f9",
                        maxHeight: "200px",
                        overflow: "auto",
                      }}
                    >
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {getFilteredNurses().length > 0 ? (
                          getFilteredNurses().map((nurse) => {
                            const isAssigned = !isNurseAvailable(
                              nurse.Employee_ID,
                              sourceStation
                            );
                            const isPending = isNursePendingForStation(
                              sourceStation,
                              nurse.Employee_ID
                            );

                            return (
                              <Chip
                                key={nurse.Employee_ID}
                                label={nurse.EmployeeName}
                                color={isPending ? "primary" : "default"}
                                variant={
                                  isAssigned && !isPending
                                    ? "outlined"
                                    : "filled"
                                }
                                disabled={isAssigned && !isPending}
                                onClick={() => {
                                  if (isPending) {
                                    removeFromPendingMappings(
                                      sourceStation,
                                      nurse.Employee_ID
                                    );
                                  } else if (!isAssigned) {
                                    handleAddNurse(
                                      sourceStation,
                                      nurse.Employee_ID
                                    );
                                  }
                                }}
                              />
                            );
                          })
                        ) : nurseSearchQuery ? (
                          <Typography variant="body2" color="text.secondary">
                            No nurses found matching "{nurseSearchQuery}"
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No nurses available
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 3,
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<SwapHorizIcon />}
                    onClick={handleOpenSwapDialog}
                    disabled={loading || pendingMappings.length === 0}
                  >
                    Swap Nurses
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Pending Changes */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Changes
              </Typography>

              {pendingMappings.length > 0 ? (
                pendingMappings.map((mapping) => (
                  <Paper
                    key={mapping.NurseStationid}
                    elevation={1}
                    sx={{ p: 2, mb: 2, bgcolor: "#f5f5f5" }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {getStationName(mapping.NurseStationid)}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mt: 1,
                      }}
                    >
                      {mapping.Employee_ID.map((nurseId) => (
                        <Chip
                          key={nurseId}
                          label={getNurseName(nurseId)}
                          color="primary"
                          onDelete={() =>
                            removeFromPendingMappings(
                              mapping.NurseStationid,
                              nurseId
                            )
                          }
                        />
                      ))}
                    </Box>
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No pending changes. Select a station and assign nurses to
                  create changes.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginTop: "25px",
          }}
        >
          {" "}
          <Button
            variant="outlined"
            onClick={handleSubmitAllMappings}
            // disabled={loading || pendingMappings.length === 0}
          >
            Submit
          </Button>
        </div>
      </Grid>

      {/* Swap Nurses Dialog */}
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
                          key={nurseId}
                          label={getNurseName(nurseId)}
                          color={
                            nursesToSwap.includes(nurseId)
                              ? "primary"
                              : "default"
                          }
                          onClick={() => {
                            if (nursesToSwap.includes(nurseId)) {
                              setNursesToSwap(
                                nursesToSwap.filter((id) => id !== nurseId)
                              );
                            } else {
                              setNursesToSwap([...nursesToSwap, nurseId]);
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
          <Button onClick={handleCloseSwapDialog}>Cancel</Button>
          <Button
            onClick={handleSwapNurses}
            color="primary"
            variant="contained"
            disabled={
              !sourceStation || !targetStation || nursesToSwap.length === 0
            }
          >
            Swap Nurses
          </Button>
        </DialogActions>
      </Dialog>
      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
}

export default NurseMappingtoNurseStation;


