import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";

function NurseStationMaser() {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const navigate = useNavigate();
  
  const [LocationData, setLocationData] = useState([]);
  const [WardData, setWardData] = useState([]);
  const [ward_Building_by__loc, setward_Building_by__loc] = useState([]);
  const [ward_block_by_Building, setward_block_by_Building] = useState([]);
  const [ward_Floor_by_Block, setward_Floor_by_Block] = useState([]);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [NurseStationResData, setNurseStationResData] = useState([]);
  const [ViewWards, setViewWards] = useState([]);
  const [ViewRooms, setViewRooms] = useState([]);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const dispatchvalue = useDispatch();
  const [OpenModal, setOpenModal] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState({});
  const [selectedRoomIds, setSelectedRoomIds] = useState([]); // For wards with Type === 'ROOM'
  const [selectedRoomIdsForSelection, setSelectedRoomIdsForSelection] = useState({}); // Dictionary: { wardId: [roomId, ...] }
  const [roomNamesByWard, setRoomNamesByWard] = useState({});

  const [NurseStationData, setNurseStationData] = useState({
    NurseStationid: "",
    Location_Name: "",
    Building_Name: "",
    Block_Name: "",
    Floor_Name: "",
    NurseStationName: "",
    WardNames: [],
    SelectedWardIDs: [],
    SelectedRoomIDs: [],
    created_by: userRecord?.username,
  });

  const [load,setload] = useState(false);

  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

  const ClearState = () => {
    setNurseStationData({
      NurseStationid: "",
      Location_Name: "",
      Building_Name: "",
      Block_Name: "",
      Floor_Name: "",
      NurseStationName: "",
      WardNames: [],
      SelectedWardIDs: [],
      SelectedRoomIDs: [],
      created_by: userRecord?.username,
    });
    setSelectedRoomIds([]);
    setSelectedRoomIdsForSelection({});
    setRoomNamesByWard({});
    setLoadingRooms({});
  };

  useEffect(() => {
    if (NurseStationData.Location_Name) {
      axios
        .get(
          `${UrlLink}Masters/get_building_Data_by_location?Location=${NurseStationData.Location_Name}`
        )
        .then((res) => {
          const tdata = {
            message: res.message,
            type: res.type,
          };
          dispatchvalue({ type: "toast", value: tdata });
          setward_Building_by__loc(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [UrlLink, NurseStationData.Location_Name]);

  useEffect(() => {
    if (NurseStationData.Location_Name) {
      const data = {
        LocationName: NurseStationData.Location_Name,
      };
      axios
        .get(`${UrlLink}Masters/get_Ward_Data_by_Floor_loc`, {
          params: data,
        })
        .then((res) => {
          setNurseStationData((prev) => ({
            ...prev,
            WardNames: res.data,
          }));
        })
        .catch((err) => {
          setNurseStationData((prev) => ({
            ...prev,
            WardNames: [],
          }));
          console.log(err);
        });
    }
  }, [NurseStationData.Location_Name, UrlLink]);

  useEffect(() => {
    if (NurseStationData.Block_Name) {
      const data = {
        Block: NurseStationData.Block_Name,
      };
      axios
        .get(`${UrlLink}Masters/get_Floor_Data_by_Building_block_loc`, {
          params: data,
        })
        .then((res) => {
          if (Array.isArray(res.data)) {
            setward_Floor_by_Block(res.data);
          } else {
            setward_Floor_by_Block([]);
          }
        })
        .catch((err) => {
          setward_Floor_by_Block([]);
          console.log(err);
        });
    }
  }, [NurseStationData.Block_Name, UrlLink]);

  useEffect(() => {
    if (NurseStationData.Building_Name) {
      const data = {
        Building: NurseStationData.Building_Name,
      };
      axios
        .get(`${UrlLink}Masters/get_block_Data_by_Building`, { params: data })
        .then((res) => {
          if (Array.isArray(res.data)) {
            setward_block_by_Building(res.data);
          } else {
            setward_block_by_Building([]);
          }
        })
        .catch((err) => {
          setward_block_by_Building([]);
          console.log(err);
        });
    }
  }, [NurseStationData.Building_Name, UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Location_Detials_link`)
      .then((res) => {
        const ress = res.data;
        setLocationData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  const handlechangeWard = (e) => {
    const { name, value } = e.target;
    if (name === "Location_Name") {
      setNurseStationData((prev) => ({
        ...prev,
        [name]: value,
        Building_Name: "",
        Block_Name: "",
        Floor_Name: "",
        NurseStationName: "",
        WardNames: [],
        SelectedWardIDs: [],
        SelectedRoomIDs: [],
      }));
      setSelectedRoomIds([]);
      setSelectedRoomIdsForSelection({});
      setRoomNamesByWard({});
      setLoadingRooms({});
    } else if (name === "Building_Name") {
      setNurseStationData((prev) => ({
        ...prev,
        [name]: value,
        Block_Name: "",
        Floor_Name: "",
        NurseStationName: "",
      }));
    } else if (name === "Block_Name") {
      setNurseStationData((prev) => ({
        ...prev,
        [name]: value,
        Floor_Name: "",
        NurseStationName: "",
      }));
    } else if (name === "Floor_Name") {
      setNurseStationData((prev) => ({
        ...prev,
        [name]: value,
        NurseStationName: "",
      }));
    } else {
      setNurseStationData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
    }
  };

  const handleWardCheckboxChange = (e, id, Type) => {
    const { checked } = e.target;

    console.log(Type)

    if (Type === "WARD") {
      setNurseStationData((prev) => {
        let updatedSelectedWardIDs = [...prev.SelectedWardIDs];

        if (id === "ALL") {
          updatedSelectedWardIDs = checked
            ? prev.WardNames.map((ward) => ward.id)
            : [];
        } else {
          if (checked) {
            updatedSelectedWardIDs = [...updatedSelectedWardIDs, id];
          } else {
            updatedSelectedWardIDs = updatedSelectedWardIDs.filter(
              (wardId) => wardId !== id
            );
          }

          const allChecked =
            updatedSelectedWardIDs.length === prev.WardNames.length - 1;
          if (allChecked && !updatedSelectedWardIDs.includes("ALL")) {
            updatedSelectedWardIDs.push("ALL");
          } else if (!allChecked && updatedSelectedWardIDs.includes("ALL")) {
            updatedSelectedWardIDs = updatedSelectedWardIDs.filter(
              (wardId) => wardId !== "ALL"
            );
          }
        }

        return {
          ...prev,
          SelectedWardIDs: updatedSelectedWardIDs,
          SelectedRoomIDs: updatedSelectedWardIDs.filter((wardId) =>
            prev.WardNames.some(
              (ward) => ward.id === wardId && ward.Type === "ROOM"
            )
          ),
        };
      });
    } 
    else if (Type === "ROOM") {
      setNurseStationData((prev) => {
        let updatedSelectedWardIDs = [...prev.SelectedWardIDs];
        let updatedSelectedRoomIDs = [...prev.SelectedRoomIDs];
        if (checked) {
          updatedSelectedWardIDs = [...updatedSelectedWardIDs, id];
          updatedSelectedRoomIDs = [...updatedSelectedRoomIDs, id];
        } else {
          updatedSelectedWardIDs = updatedSelectedWardIDs.filter(
            (wardId) => wardId !== id
          );
          updatedSelectedRoomIDs = updatedSelectedRoomIDs.filter(
            (wardId) => wardId !== id
          );
          setSelectedRoomIdsForSelection((prev) => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
          });
        }
        return {
          ...prev,
          SelectedWardIDs: updatedSelectedWardIDs,
          SelectedRoomIDs: updatedSelectedRoomIDs,
        };
      });
      setSelectedRoomIds((prev) =>
        checked
          ? [...prev, id]
          : prev.filter((roomId) => roomId !== id)
      );
      if (!checked) {
        setRoomNamesByWard((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        setLoadingRooms((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      }
    }
  };

  const handleRoomCheckboxChange = (e, roomId, wardId) => {
    const { checked } = e.target;
    setSelectedRoomIdsForSelection((prev) => {
      const updated = { ...prev };
      if (checked) {
        updated[wardId] = [...(updated[wardId] || []), roomId];
      } else {
        updated[wardId] = (updated[wardId] || []).filter((id) => id !== roomId);
        if (updated[wardId].length === 0) {
          delete updated[wardId];
        }
      }
      return updated;
    });
  };

  useEffect(() => {
    selectedRoomIds.forEach((wardId) => {
      if (!roomNamesByWard[wardId] && !loadingRooms[wardId]) {
        setLoadingRooms((prev) => ({ ...prev, [wardId]: true }));
        axios
          .get(`${UrlLink}Masters/get_roomdetails_by_ward`, {
            params: { id: wardId },
          })
          .then((res) => {
            setRoomNamesByWard((prev) => ({
              ...prev,
              [wardId]: res.data,
            }));
            setLoadingRooms((prev) => ({ ...prev, [wardId]: false }));
          })
          .catch((err) => {
            setRoomNamesByWard((prev) => ({ ...prev, [wardId]: [] }));
            setLoadingRooms((prev) => ({ ...prev, [wardId]: false }));
            dispatchvalue({
              type: "toast",
              value: { message: `Failed to fetch rooms for ward ${wardId}`, type: "error" },
            });
            console.error(err);
          });
      }
    });
  }, [selectedRoomIds, UrlLink, dispatchvalue]);

  /*const validateFields = () => {
    const missingFields = [];
    if (!NurseStationData.Location_Name) missingFields.push("Location Name");
    if (!NurseStationData.Building_Name) missingFields.push("Building Name");
    if (!NurseStationData.Block_Name) missingFields.push("Block Name");
    if (!NurseStationData.Floor_Name) missingFields.push("Floor Name");
    if (!NurseStationData.NurseStationName)
      missingFields.push("Nurse Station Name");
    if (!NurseStationData.SelectedWardIDs.length)
      missingFields.push("Select At least One Ward");

    return missingFields;
  };*/

  const validateFields = () => {
  const missingFields = [];
  if (!NurseStationData.Location_Name) missingFields.push("Location Name");
  if (!NurseStationData.Building_Name) missingFields.push("Building Name");
  if (!NurseStationData.Block_Name) missingFields.push("Block Name");
  if (!NurseStationData.Floor_Name) missingFields.push("Floor Name");
  if (!NurseStationData.NurseStationName)
    missingFields.push("Nurse Station Name");
  if (!NurseStationData.SelectedWardIDs.length)
    missingFields.push("At least one Ward must be selected");

  // Optional room selection check (for ROOM-type wards)
  const roomTypeWardIds = NurseStationData.SelectedWardIDs.filter((id) =>
    NurseStationData.WardNames.some((w) => w.id === id && w.Type === "ROOM")
  );
  for (const wardId of roomTypeWardIds) {
    if (!selectedRoomIdsForSelection[wardId]?.length) {
      missingFields.push(`Select rooms for Ward ID ${wardId}`);
    }
  }

  return missingFields;
};


  const handleEdit = (row) => {
    // Populate form with nurse station data
    const selectedWardIDs = row.Wards.map((ward) => ward.Wardid);
    const selectedRoomIDs = row.Wards.filter((ward) =>
      row.Rooms.some((room) => room.ward === ward.Wardid)
    ).map((ward) => ward.Wardid);
    const selectedRoomIdsForSelection = {};
    row.Rooms.forEach((room) => {
      selectedRoomIdsForSelection[room.ward] = room.Room_Nos.map((r) => r.Roomid);
    });

    setNurseStationData({
      NurseStationid: row.NurseStationid,
      Location_Name: row.Location_Name.toString(),
      Building_Name: row.Building_Name.toString(),
      Block_Name: row.Block_Name.toString(),
      Floor_Name: row.Floor_Name.toString(),
      NurseStationName: row.NurseStationName,
      WardNames: NurseStationData.WardNames, // Preserve existing ward options
      SelectedWardIDs: selectedWardIDs,
      SelectedRoomIDs: selectedRoomIDs,
      created_by: userRecord?.username,
    });
    setSelectedRoomIds(selectedRoomIDs);
    setSelectedRoomIdsForSelection(selectedRoomIdsForSelection);

    // Fetch rooms for selected ROOM-type wards
    selectedRoomIDs.forEach((wardId) => {
      if (!roomNamesByWard[wardId] && !loadingRooms[wardId]) {
        setLoadingRooms((prev) => ({ ...prev, [wardId]: true }));
        axios
          .get(`${UrlLink}Masters/get_roomdetails_by_ward`, {
            params: { id: wardId },
          })
          .then((res) => {
            setRoomNamesByWard((prev) => ({
              ...prev,
              [wardId]: res.data,
            }));
            setLoadingRooms((prev) => ({ ...prev, [wardId]: false }));
          })
          .catch((err) => {
            setRoomNamesByWard((prev) => ({ ...prev, [wardId]: [] }));
            setLoadingRooms((prev) => ({ ...prev, [wardId]: false }));
            dispatchvalue({
              type: "toast",
              value: { message: `Failed to fetch rooms for ward ${wardId}`, type: "error" },
            });
            console.error(err);
          });
      }
    });
  };

  const handleAssets = (row) => {

    console.log(row,'row');
    dispatchvalue({ type: "NursestationAssets", value: row});

    

    dispatchvalue({ type: "HrFolder", value: "NurseStationAssets" });
    navigate("/Home/MasterFolder");
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });

   
  };

 /* const HandleSaveWard = () => {

    const missingFields = validateFields();
    if (missingFields.length > 0) {
      const tdata = {
        message: `The following fields are mandatory and missing: ${missingFields.join(
          ", "
        )}`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    const payload = {
      ...NurseStationData,
      SelectedRoomIdsForSelection: selectedRoomIdsForSelection,
    };

    const requestMethod = NurseStationData.NurseStationid ? axios.put : axios.post;
    const url = `${UrlLink}Masters/NurseStationData`;

    requestMethod(url, payload)
      .then((res) => {
        const tdata = {
          message: res.data.message,
          type: res.data.type,
        };
        dispatchvalue({ type: "toast", value: tdata });
        fetchNurseStationData();
        ClearState();
      })
      .catch((err) => {
        console.error(err);
        const tdata = {
          message: err.response?.data?.message || "Error saving nurse station",
          type: "error",
        };
        dispatchvalue({ type: "toast", value: tdata });
      });
  };*/

  const HandleSaveWard = () => {
  const missingFields = validateFields();
  if (missingFields.length > 0) {
    const tdata = {
      message: `The following fields are mandatory and missing: ${missingFields.join(", ")}`,
      type: "warn",
    };
    dispatchvalue({ type: "toast", value: tdata });
    return;
  }
 
  const payload = {
    ...NurseStationData,
    SelectedRoomIdsForSelection: selectedRoomIdsForSelection,
  };
 
  payload.Location_Name = parseInt(payload.Location_Name);
  payload.Building_Name = parseInt(payload.Building_Name);
  payload.Block_Name = parseInt(payload.Block_Name);
  payload.Floor_Name = parseInt(payload.Floor_Name);
  payload.SelectedWardIDs = payload.SelectedWardIDs.map(id => parseInt(id));
  for (const wardId in payload.SelectedRoomIdsForSelection) {
    payload.SelectedRoomIdsForSelection[wardId] = payload.SelectedRoomIdsForSelection[wardId].map(id => parseInt(id));
  }
 
  console.log("🟡 Payload being sent:", payload); // <-- Very important
 
  const url = `${UrlLink}Masters/NurseStationData`;
 
  axios.post(url, payload)
    .then((res) => {
      const tdata = {
        message: res.data.message,
        type: res.data.type,
      };
      dispatchvalue({ type: "toast", value: tdata });
      fetchNurseStationData();
      ClearState();
    })
    .catch((err) => {
      console.error("❌ Axios error:", err);
      console.error("❌ Backend response:", err.response?.data); // <-- Look here in console
      const tdata = {
        message: err.response?.data?.message || "Error saving nurse station",
        type: "error",
      };
      dispatchvalue({ type: "toast", value: tdata });
    });
};
 

  const handleCancel = () => {
    ClearState();
  };

  const fetchNurseStationData = useCallback(() => {
    axios
      .get(`${UrlLink}Masters/NurseStationData`)
      .then((res) => {
        setNurseStationResData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [UrlLink,load]);

  useEffect(() => {
    fetchNurseStationData();
  }, [fetchNurseStationData]);

  const handleView = (row) => {
    setViewWards(row.Wards);
    setViewRooms(row.Rooms || []);
    setOpenModal(true);
  };

  // const handlestatuschange = (row) => {
  //   console.log(row.NurseStationid,'row')

  //   const payload = {
  //     NurseStationid: row.NurseStationid
  //   }

  // }

  const handlestatuschange = (row) => {
        const data = {
          NurseStationid: row.NurseStationid
        };
        axios.post(`${UrlLink}Masters/NurseStationStatusEdit
          `, data)
            .then((res) => {
                const response = res.data;
                const messageType = Object.keys(response)[0];
                const messageContent = Object.values(response)[0];
                dispatchvalue({
                    type: 'toast',
                    value: { message: messageContent, type: messageType },
                });
                setload((prev) => !prev);

            })
            .catch((err) => {
                console.log(err);
                dispatchvalue({
                    type: 'toast',
                    value: { message: 'An error occurred while updating the status.', type: 'error' },
                });
            });
    };

  const handleclosemodal1 = () => {
    setOpenModal(false);
    setViewWards([]);
    setViewRooms([]);
  };

  const NurseStationColumn = [
    {
      key: "NurseStationid",
      name: "Nurse Station ID",
      frozen: true,
    },
    {
      key: "Display_Location_Name",
      name: "Location",
      frozen: true,
    },
    {
      key: "Display_Building_Name",
      name: "Building Name",
    },
    {
      key: "Display_Block_Name",
      name: "Block Name",
    },
    {
      key: "Display_Floor_Name",
      name: "Floor Name",
    },
    {
      key: "NurseStationName",
      name: "Nurse Station Name",
    },
    {
      key: "Status_Name",
      name: "Status",
      renderCell: (params) => (
        <Button onClick={() => handlestatuschange(params.row)} className="cell_btn">{params.row.Status_Name}</Button>
      ),
    },
    {
      key: "View",
      name: "See Wards",
      width: 70,
      renderCell: (params) => (
        <Button onClick={() => handleView(params.row)}>
          <VisibilityIcon />
        </Button>
      ),
    },
    {
      key: "Action",
      name: "Action",
      width: 70,
      renderCell: (params) => (
        <Button onClick={() => handleEdit(params.row)}>
          <EditIcon />
        </Button>
      ),
    },
    {
      key: "Assets",
      name: "Assets",
      width: 70,
      renderCell: (params) => (
        <Button onClick={() => handleAssets(params.row)}>
          ASSETS
        </Button>
      ),
    },
  ];

  const WardColumns = [
    {
      key: "NurseStationDetailsid",
      name: "Ward ID",
      frozen: true,
    },
    {
      key: "Ward_Name",
      name: "Ward Name",
      frozen: true,
    },
    {
      key: "Rooms",
      name: "Rooms",
      renderCell: (params) => {
        const wardId = params.row.Wardid;
        const roomEntry = ViewRooms.find((room) => room.ward === wardId);
        const roomNos = roomEntry
          ? roomEntry.Room_Nos.map((room) => room.RoomNo).join(", ")
          : "N/A";
        return <span style={{ fontSize: "12px" }}>{roomNos}</span>;
      },
    },
  ];

  return (
    <div className="Main_container_app">
      <h3>Nurse Station Master</h3>
      <br />
      <div className="RegisFormcon_1">
        {Object.keys(NurseStationData)
          .filter((p) => p !== "NurseStationid" && p !== "WardId")
          .map((field, indx) => (
            <React.Fragment key={indx}>
              <div className="RegisForm_1">
                {field !== "SelectedWardIDs" &&
                  field !== "SelectedRoomIDs" &&
                  field !== "created_by" && (
                    <label>
                      {formatLabel(field)} <span>:</span>
                    </label>
                  )}
                {field === "NurseStationName" && (
                  <input
                    type="text"
                    name={field}
                    autoComplete="off"
                    required
                    value={NurseStationData[field]}
                    onChange={handlechangeWard}
                  />
                )}
                {field !== "NurseStationName" &&
                  field !== "WardNames" &&
                  field !== "SelectedWardIDs" &&
                  field !== "SelectedRoomIDs" &&
                  field !== "created_by" && (
                    <select
                      name={field}
                      required
                      value={NurseStationData[field]}
                      onChange={handlechangeWard}
                    >
                      <option value="">Select</option>
                      {field === "Building_Name" &&
                        ward_Building_by__loc.map((p, index) => (
                          <option key={index} value={p.id}>
                            {p.BuildingName}
                          </option>
                        ))}
                      {field === "Block_Name" &&
                        ward_block_by_Building.map((p, index) => (
                          <option key={index} value={p.id}>
                            {p.BlockName}
                          </option>
                        ))}
                      {field === "Floor_Name" &&
                        ward_Floor_by_Block.map((p, index) => (
                          <option key={index} value={p.id}>
                            {p.FloorName}
                          </option>
                        ))}
                      {field === "Location_Name" &&
                        LocationData.map((p, index) => (
                          <option key={index} value={p.id}>
                            {p.locationName}
                          </option>
                        ))}
                    </select>
                  )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                  maxWidth: "100%",
                }}
              >
                {field === "WardNames" &&
                Array.isArray(NurseStationData?.WardNames) &&
                NurseStationData?.WardNames.length > 0 ? (
                  NurseStationData?.WardNames.map((p, index) => (
                    <div
                      key={p.id}
                      style={{
                        flex: "0 1 calc(33.33% - 10px)",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <input
                          type="checkbox"
                          id={`ward-${p.id}`}
                          name={field}
                          value={p.WardName}
                          autoComplete="off"
                          required
                          style={{ width: "16px", height: "16px" }}
                          checked={NurseStationData.SelectedWardIDs.includes(p.id)}
                          onChange={(e) => handleWardCheckboxChange(e, p.id, p.Type)}
                        />
                        <label
                          htmlFor={`ward-${p.id}`}
                          style={{ fontSize: "10px" }}
                        >
                          {p.WardName}
                        </label>
                      </div>
                      {p.Type === "ROOM" && selectedRoomIds.includes(p.id) && (
                        <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                          {loadingRooms[p.id] ? (
                            <div style={{ fontSize: "10px", color: "#666" }}>
                              Loading rooms...
                            </div>
                          ) : Array.isArray(roomNamesByWard[p.id]) &&
                            roomNamesByWard[p.id].length > 0 ? (
                            roomNamesByWard[p.id].map((room) => (
                              <div
                                key={room.Roomid}
                                style={{
                                  fontSize: "10px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  marginBottom: "5px",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  id={`room-${room.Roomid}`}
                                  name="RoomNames"
                                  value={room.RoomNo}
                                  autoComplete="off"
                                  style={{ width: "16px", height: "16px" }}
                                  checked={(selectedRoomIdsForSelection[p.id] || []).includes(
                                    room.Roomid
                                  )}
                                  onChange={(e) =>
                                    handleRoomCheckboxChange(e, room.Roomid, p.id)
                                  }
                                />
                                <label
                                  htmlFor={`room-${room.Roomid}`}
                                  style={{ fontSize: "10px" }}
                                >
                                  {room.RoomNo}
                                </label>
                              </div>
                            ))
                          ) : (
                            <div style={{ fontSize: "10px", color: "#666" }}>
                              No Rooms Available
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  field === "WardNames" && (
                    <label style={{ fontSize: "12px", color: "#666" }}>
                      No Wards Available
                    </label>
                  )
                )}
              </div>
            </React.Fragment>
          ))}
      </div>
      <br />
      <div className="Main_container_Btn">
        <button onClick={HandleSaveWard}>
          {NurseStationData.NurseStationid ? "Update" : "Create"}
        </button>
        {NurseStationData.NurseStationid && (
          <button onClick={handleCancel} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        )}
      </div>
      <br />
      <div className="Main_container_app">
        <ReactGrid
          columns={NurseStationColumn}
          RowData={NurseStationResData}
        />
      </div>
      {OpenModal && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={handleclosemodal1}
        >
          <div className="newwProfiles" onClick={(e) => e.stopPropagation()}>
            <br />
            <div className="appointment">
              <div className="h_head">
                <h4>Wards and Rooms</h4>
              </div>
              <ReactGrid columns={WardColumns} RowData={ViewWards} />
              <div className="Register_btn_con">
                <button
                  className="RegisterForm_1_btns"
                  onClick={handleclosemodal1}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
}

export default NurseStationMaser;