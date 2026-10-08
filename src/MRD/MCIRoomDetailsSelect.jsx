import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { MdBlock } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faHistory, faExchangeAlt, faSignOutAlt, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const MCIRoomDetailsSelect = () => {
  const [RoomDataforRegister, setRoomDataforRegister] = useState([]);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const RegisterRoomShow = useSelector((state) => state.Frontoffice?.RegisterRoomShow);

  const dispatchvalue = useDispatch();
  const [searchdata, setSearchdata] = useState({
    Building: 1,
    Block: 1,
    Floor: "",
    Ward: "",
  });
  const [uniquedata, setUniquedata] = useState({});
  console.log(uniquedata,'uniquedata');
  
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showHistory, setShowHistory] = useState(false);

  // Reset selected room on mount
  useEffect(() => {
    dispatchvalue({ type: "SelectRoomRegister", value: {} });
  }, [dispatchvalue]);

  // Fetch filter data
  useEffect(() => {
    if (RegisterRoomShow.val && RegisterRoomShow.type) {
      const data = {
        location: UserData?.location,
        RegisterType: RegisterRoomShow.type,
        ...searchdata,
      };

      axios
        .get(`${UrlLink}Masters/get_filter_Data_for_registration`, { params: data })
        .then((res) => {
          console.log(res.data,'res.data----------1');
          
          setUniquedata(res.data);
        })
        .catch((err) => {
          setUniquedata({});
          console.error("Error fetching filter data:", err);
        });
    }
  }, [UserData, UrlLink, RegisterRoomShow.type, searchdata]);

  const [WardDatas,setWardDatas] = useState([]);

  useEffect(() => {
    if (RegisterRoomShow.val && RegisterRoomShow.type) {
      const data = {
        location: UserData?.location,
        RegisterType: RegisterRoomShow.type,
        ...searchdata,
      };

      axios
        .get(`${UrlLink}Masters/get_ward_details_by_floor_for_ipregistration`, { params: data })
        .then((res) => {
          if (Array.isArray(res.data)) {
            
            setWardDatas(res.data);
          } else {
            setWardDatas([]);
            console.warn("Room data is not an array:", res.data);
          }
        })
        .catch((err) => {
          setWardDatas([]);
          console.error("Error fetching room data:", err);
        });
    }
  }, [UserData, UrlLink, RegisterRoomShow.type, searchdata]);



  // Fetch room data
 useEffect(() => {
  if (!RegisterRoomShow.val || !RegisterRoomShow.type) return;

  const controller = new AbortController();

  const data = {
    location: UserData?.location,
    RegisterType: RegisterRoomShow.type,
    ...searchdata,
  };

  axios
    .get(
      `${UrlLink}MCI/get_Mci_Room_Master_Data_for_registration`,
      {
        params: data,
        signal: controller.signal, // 👈 abort support
      }
    )
    .then((res) => {
      if (Array.isArray(res.data)) {
        const statusOrder = {
          Booked: 1,
          Occupied: 2,
          Maintenance: 3,
          Available: 4,
          Inactive: 5,
        };

        const sortedRooms = [...res.data].sort(
          (a, b) =>
            statusOrder[a.BookingStatus] -
            statusOrder[b.BookingStatus]
        );

        setRoomDataforRegister(sortedRooms);
      } else {
        setRoomDataforRegister([]);
        console.warn("Room data is not an array:", res.data);
      }
    })
    .catch((err) => {
      if (err.name === "CanceledError") {
        // Request was cancelled
        return;
      }
      setRoomDataforRegister([]);
      console.error("Error fetching room data:", err);
    });

  // cleanup: cancel request on unmount or dependency change
  return () => {
    controller.abort();
  };
}, [UserData, UrlLink, RegisterRoomShow.type, searchdata]);



 // In your React component
 const handleACChange = (roomId, event) => {
  const newValue = event.target.checked;
  
  // Update UI immediately
  setRoomDataforRegister((prevRooms) =>
    prevRooms.map((room) =>
      room.id === roomId
        ? {
            ...room,
            isAC: newValue,
            TotalCharge: newValue ? room.ACCharge : room.NonACCharge,
          }
        : room
    )
  );
  
  // Add trailing slash to the URL
  const updateUrl = `${UrlLink}Masters/update_total_charge/${roomId}/`;
  console.log("Making request to:", updateUrl);
  
  // Then update the server
  const csrfToken = getCookie('csrftoken');
  
  axios.post(
    updateUrl, 
    {
      roomId: roomId,
      acStatus: newValue
    },
    {
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json'
      }
    }
  )
  .then(response => {
    console.log("Success response:", response);
    if (response.data.success) {
      console.log('Room AC status updated successfully');
    } else {
      console.error('Failed to update room:', response.data.message);
      revertRoomChanges(roomId, !newValue);
    }
  })
  .catch(error => {
    console.error('Error updating room AC status:', error);
    console.log("Failed URL was:", updateUrl);
    revertRoomChanges(roomId, !newValue);
  });
};

const revertRoomChanges = (roomId, originalACValue) => {
  setRoomDataforRegister((prevRooms) =>
    prevRooms.map((room) =>
      room.id === roomId
        ? { 
            ...room, 
            isAC: originalACValue, 
            TotalCharge: originalACValue ? room.ACCharge : room.NonACCharge 
          }
        : room
    )
  );
};


  const handleInputChangeRoomDetails = (e) => {
    const { name, value } = e.target;

    setSearchdata((prev) => {
      let newData = { ...prev, [name]: value };

      if (name === "Building") {
        const isBlockValid = uniquedata.Block?.some(
          (b) => b.id === newData.Block && b.BuildingId === value
        );
        newData.Block = isBlockValid ? newData.Block : "";
        newData.Floor = "";
        newData.Ward = "";
      } else if (name === "Block") {
        newData.Floor = "";
        newData.Ward = "";
      } else if (name === "Floor") {
        newData.Ward = "";
      }

      return newData;
    });
  };

  const handleTransfer = (room, e) => {
    e.stopPropagation();
    dispatchvalue({
      type: "RegisterRoomShow",
      value: { type: "transfer", val: true, room: room },
    });
  };

  const handleStatusChange = async (room, action, e) => {
    e.stopPropagation();
    const actions = {
      Vacate: {
        url: "Vacate_room_booking",
        from: "Occupied",
        to: "Maintenance",
      },
      Occupied: {
        url: "Occupied_room_booking",
        from: "Booked",
        to: "Occupied",
      },
      Cancel: {
        url: "cancel_room_booking",
        from: "Booked",
        to: "Available",
      },
      Available: {
        url: "Avilable_room_booking",
        from: "Maintenance",
        to: "Available",
      },
    };

    const { url, from, to } = actions[action];
    if (room.BookingStatus === from) {
      const confirmMove = window.confirm(
        `Are you sure you want to move this room from '${from}' to '${to}'?`
      );
      if (!confirmMove) return;
    }

    try {
      const response = await axios.post(`${UrlLink}Masters/${url}`, {
        roomId: room.id,
        location: UserData?.location,
      });

      if (response.data.success) {
        const data = {
          location: UserData?.location,
          RegisterType: RegisterRoomShow.type,
          ...searchdata,
        };

        const updatedRoomsResponse = await axios.get(
          `${UrlLink}MCI/get_Mci_Room_Master_Data_for_registration`,
          { params: data }
        );

        if (Array.isArray(updatedRoomsResponse.data)) {
          const sortedRooms = updatedRoomsResponse.data.sort((a, b) => {
            const statusOrder = {
              Booked: 1,
              Occupied: 2,
              Maintenance: 3,
              Available: 4,
              Inactive: 5,
            };
            return statusOrder[a.BookingStatus] - statusOrder[b.BookingStatus];
          });
          setRoomDataforRegister(sortedRooms);
        }
      }
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    }
  };

  const selectRoom = (room) => {
    dispatchvalue({ type: "SelectRoomRegister", value: { ...room } });
    dispatchvalue({
      type: "RegisterRoomShow",
      value: { type: "", val: false },
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Booked: "blue",
      Occupied: "red",
      Maintenance: "orange",
      Available: "green",
      Inactive: "gray",
    };
    return colors[status] || "black";
  };

  const renderStatusFilters = () => (
    <div className="status-filters flex gap-4 mb-4">
      {["All", "Booked", "Occupied", "Maintenance", "Available"].map((status) => (
        <Button
          key={status}
          variant={selectedStatus === status ? "contained" : "outlined"}
          onClick={() => setSelectedStatus(status)}
          style={{
            backgroundColor: selectedStatus === status ? getStatusColor(status) : "transparent",
            color: selectedStatus === status ? "white" : getStatusColor(status),
          }}
        >
          {status}
        </Button>
      ))}
    </div>
  );

  const renderActionButtons = (room) => {
    if (room.BookingStatus === "Occupied") {
      return (
        <>
          <Button
            size="small"
            startIcon={<FontAwesomeIcon icon={faExchangeAlt} />}
            onClick={(e) => handleTransfer(room, e)}
            className="text-blue-600 hover:bg-blue-50"
          >
            Transfer
          </Button>
          <Button
            size="small"
            startIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
            onClick={(e) => handleStatusChange(room, "Vacate", e)}
            className="text-red-600 hover:bg-red-50"
          >
            Vacate
          </Button>
        </>
      );
    } else if (room.BookingStatus === "Booked") {
      return (
        <>
          <Button
            size="small"
            startIcon={<FontAwesomeIcon icon={faCheckCircle} />}
            onClick={(e) => handleStatusChange(room, "Occupied", e)}
            className="text-green-600 hover:bg-green-50"
          >
            Occupied
          </Button>
          <Button
            size="small"
            startIcon={<FontAwesomeIcon icon={faCheckCircle} />}
            onClick={(e) => handleStatusChange(room, "Cancel", e)}
            className="text-black hover:bg-gray-50"
          >
            Cancel
          </Button>
        </>
      );
    } else if (room.BookingStatus === "Maintenance") {
      return (
        <Button
          size="small"
          startIcon={<FontAwesomeIcon icon={faCheckCircle} />}
          onClick={(e) => handleStatusChange(room, "Available", e)}
          className="text-green-600 hover:bg-green-50"
        >
          Available
        </Button>
      );
    }
    return null;
  };

  const filteredRooms = RoomDataforRegister.filter(
    (room) => selectedStatus === "All" || room.BookingStatus === selectedStatus
  );

  return (
    <div
      className="loader"
      onClick={() =>
        dispatchvalue({
          type: "RegisterRoomShow",
          value: { type: "", val: false },
        })
      }
    >
      <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
        <div className="DivCenter_container">
          <h2>Select Room Details</h2>
          {renderStatusFilters()}
        </div>

        <div className="RegisFormcon_1">
          {Object.keys(searchdata).map((field, index) => (
            <div className="RegisForm_1" key={index}>
              <label htmlFor={`${field}_${index}`}>
                {field === "Building"
                  ? "Building Name"
                  : field === "Block"
                    ? "Block Name"
                    : field === "Floor"
                      ? "Floor Name"
                      : "Ward Name"}
                <span>:</span>
              </label>
              <select
                id={`${field}_${index}`}
                name={field}
                value={searchdata[field]}
                onChange={handleInputChangeRoomDetails}
              >
                <option value="">Select</option>
                {field === "Building" &&
                  uniquedata.Building?.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.Name}
                    </option>
                  ))}

                {field === "Block" &&
                  uniquedata.Block?.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.Name}
                    </option>
                ))}
  
                {/* {field === "Block" &&
                  uniquedata.Block?.filter((b) => !searchdata.Building || b.BuildingId === searchdata.Building).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.Name}
                    </option>
                  ))} */}

                {field === "Floor" &&
                  uniquedata.Floor?.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.Name}
                    </option>
                ))}  
                  
                {/* {field === "Floor" &&
                  uniquedata.Floor?.filter((f) => !searchdata.Block || f.BlockId === searchdata.Block).map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.Name}
                    </option>
                  ))} */}

                {field === "Ward" &&
                  WardDatas?.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.Name}
                    </option>
                ))} 


                {/* {field === "Ward" &&
                  uniquedata.Ward?.filter((w) => !searchdata.Floor || w.FloorId === searchdata.Floor).map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.Name}
                    </option>
                  ))} */}


              </select>
            </div>
          ))}
        </div>

        <div className="Rooms_avail_card  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{    display: "grid",

gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'}}>
          {filteredRooms.map((room) => (
            <Card key={room.id} className="relative transition-all hover:shadow-lg">
              <div className="absolute top-2 right-2">
                <Typography
                  variant="caption"
                  className="font-semibold"
                  style={{ color: getStatusColor(room.BookingStatus), display:'flex' ,justifyContent:'center',paddingTop:'5px' }}
                >
                  Status: {room.BookingStatus}
                </Typography>
              </div>

              <CardContent>
                <Typography component="div" className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Building:</span>
                    <span>{room.BuildingName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Block:</span>
                    <span>{room.BlockName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Floor:</span>
                    <span>{room.FloorName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Ward:</span>
                    <span>{room.WardName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Room No:</span>
                    <span>{room.RoomNo}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Bed No:</span>
                    <span>{room.BedNo}</span>
                  </div>

                  {room.BookingStatus === "Available" && (
                    <>
                      <div key={room.id} className="flex justify-between items-center">
                        <span className="font-semibold">Room Type AC:</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <input
                              type="checkbox"
                              checked={room.isAC || false}
                              onChange={(e) => handleACChange(room.id, e)}
                              id={`ac-checkbox-${room.id}`}
                            />
                            {/* <span>{room.isAC ? "True" : "False"}</span> */}
                          </label>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Charge:</span>
                          <span>₹{room.isAC ? room.ACCharge : room.NonACCharge}</span>
                        </div>
                      </div>

                    </>
                  )}

                  {room.BookingStatus !== "Available" && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Room Type:</span>
                        <span>{room.isAC ? "AC" : "Non-AC"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Charge:</span>
                        <span>₹{room.TotalCharge || (room.isAC ? room.ACCharge : room.NonACCharge)}</span>
                      </div>
                    </>
                  )}
                </Typography>

                <div className="mt-4 flex justify-center" style={{justifyContent:'center'}}>
                  {room.Status !== "Inactive" ? (
                    <FontAwesomeIcon
                      icon={faBed}
                      size="2x"
                      style={{ color: getStatusColor(room.BookingStatus) }}
                    />
                  ) : (
                    <MdBlock style={{ color: "red", fontSize: "2rem" }} />
                  )}
                </div>
              </CardContent>

              <CardActions className="justify-between bg-gray-50 flex flex-wrap gap-2"  style={{justifyContent:'center'}}>
                <Button
                  size="small"
                  style={{ color: getStatusColor(room.BookingStatus) }}
                  onClick={() => selectRoom(room)}
                >
                  {room.BookingStatus}
                </Button>
                {renderActionButtons(room)}
              </CardActions>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MCIRoomDetailsSelect;