import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import './NewRoomAvail.css';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed } from '@fortawesome/free-solid-svg-icons';
import { MdBlock } from 'react-icons/md';

function CustomTooltip({ content, children }) {
  return (
    <Tooltip title={content} placement="top" arrow>
      {children}
    </Tooltip>
  );
}

const NewRoomAvail = () => {
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const [RoomdataColumnsData, setRoomdataColumnsData] = useState([]);
  const [RoomDatas, setRoomDatas] = useState([]); // Initialized as array
  const [RoomdataColumns, setRoomdataColumns] = useState([]);
  const [Roomdata, setRoomdata] = useState({
    Building: '',
    Block: '',
    Floor: '',
    Ward: '',
  });
  const [Building, setBuilding] = useState([]);
  const [Block_by_building, setBlock_by_building] = useState([]);
  const [Floor_by_block, setFloor_by_block] = useState([]);
  const [Ward_by_floor, setWard_by_floor] = useState([]);
  const [filtertypes, setfiltertypes] = useState({
    wardtype: '',
    status: 'Total',
  });
  const [newFloor, setNewFloor] = useState({
    FloorName: '',
    BlockId: '',
  });
  const [patientData, setPatientData] = useState({
    PatientName: '',
  })
  const [FloorData, setFloorData] = useState([]);
  const [WardData, setWardData] = useState([]);
  const [RoomData, setRoomData] = useState([]);
  const [RoomMasterData, setRoomMasterData] = useState([]);
  const [IsBuildingGet] = useState(true);
  // const 

  const handleheaderclicked = useCallback((params) => {
    setfiltertypes((prev) => ({
      ...prev,
      status: params,
      wardtype: '',
    }));
  }, []);

  const handlecellclicked = useCallback((params, field) => {
    setfiltertypes((prev) => ({
      ...prev,
      status: field,
      wardtype: params.roomname,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Building') {
      setRoomdata((prev) => ({
        ...prev,
        [name]: value,
        Block: '',
        Floor: '',
        Ward: '',
      }));
    } else if (name === 'Block') {
      setRoomdata((prev) => ({
        ...prev,
        [name]: value,
        Floor: '',
        Ward: '',
      }));
    } else if (name === 'Floor') {
      setRoomdata((prev) => ({
        ...prev,
        [name]: value,
        Ward: '',
      }));
      setWard_by_floor([]);
      setRoomdataColumns([]);
    }
  };

  const handleNewFloorChange = (e) => {
    const { name, value } = e.target;
    setNewFloor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddFloor = () => {
    const floorData = {
      FloorName: newFloor.FloorName,
      BlockId: newFloor.BlockId,
      location: userRecord?.location,
    };

    axios
      .post(`${UrlLink}Masters/Floor_Master_Details_link`, floorData)
      .then((response) => {
        const newFloorData = response.data;
        setFloor_by_block((prev) => [...prev, newFloorData]);
        setNewFloor({ FloorName: '', BlockId: '' });
        alert('Floor added successfully!');
      })
      .catch((error) => {
        console.log(error);
        alert('Failed to add floor.');
      });
  };

  // Updated useEffect for fetching RoomDatas with array validation
  useEffect(() => {
    const fetchData = async () => {
      const params = {
        location: userRecord?.location,
        ...filtertypes,
      };

      if (params.location && params.status) {
        try {
          const response = await axios.get(
            `${UrlLink}Masters/get_Room_Master_Data`,
            { params }
          );
          console.log("get_Room_Master_Data:", response.data);
          // Ensure response.data is an array, fallback to empty array if not
          setRoomDatas(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error("API Error:", error);
          setRoomDatas([]); // Fallback to empty array on error
        }
      }
    };

    fetchData();
  }, [filtertypes, userRecord?.location, UrlLink]);

  useEffect(() => {
    const data = {
      location: userRecord?.location,
      ...filtertypes,
    };
    if (data.location && data.status) {
      axios
        .get(`${UrlLink}Masters/get_Building_data`, { params: data })
        .then((response) => {
          setBuilding(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [UrlLink]);

  useEffect(() => {
    if (userRecord?.location && Roomdata.Building) {
      const data = {
        location: userRecord?.location,
        Building: Roomdata.Building,
      };

      axios
        .get(`${UrlLink}Masters/get_block_Data_by_Building`, { params: data })
        .then((response) => {
          setBlock_by_building(response.data);
        })
        .catch((error) => {
          console.log(error);
          setBlock_by_building([]);
        });
    } else {
      setBlock_by_building([]);
    }
  }, [Roomdata.Building, userRecord?.location, UrlLink]);

  useEffect(() => {
    if (userRecord?.location && Roomdata.Block) {
      const data = {
        location: userRecord?.location,
        Block: Roomdata.Block,
      };

      axios
        .get(`${UrlLink}Masters/get_floor_data_by_Block`, { params: data })
        .then((response) => {
          setFloor_by_block(response.data);
        })
        .catch((error) => {
          console.log(error);
          setFloor_by_block([]);
        });
    } else {
      setFloor_by_block([]);
    }
  }, [Roomdata.Block, userRecord?.location, UrlLink]);

  useEffect(() => {
    if (userRecord?.location && Roomdata.Floor) {
      const data = {
        location: userRecord?.location,
        Floor: Roomdata.Floor,
      };

      axios
        .get(`${UrlLink}Masters/get_Ward_details_by_floor`, { params: data })
        .then((response) => {
          setWard_by_floor(response.data);
        })
        .catch((error) => {
          console.log(error);
          setWard_by_floor([]);
        });
    } else {
      setWard_by_floor([]);
    }
  }, [Roomdata.Floor, userRecord?.location, UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Floor_Master_Detials_link`)
      .then((res) => {
        const ress = res.data;
        console.log('Floor Data:', ress);
        setFloorData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [IsBuildingGet, UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Ward_Master_Detials_link`)
      .then((res) => {
        const ress = res.data;
        console.log('Ward Data:', ress);
        setWardData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [IsBuildingGet, UrlLink]);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`${UrlLink}Masters/Room_Master_Detials_link`, {
          params: { location: userRecord?.location },
        });
        const ress = response.data;
        console.log('Room Data:', ress);
        setRoomData(ress);
      } catch (err) {
        console.log(err);
      }
    };

    if (IsBuildingGet && UrlLink) {
      fetchRoomData();
    }
  }, [IsBuildingGet, UrlLink, userRecord?.location]);

  const generateRoomMasterData = useCallback(() => {
    if (!FloorData.length || !WardData.length || !RoomData.length) return [];

    const combinedData = [];

    RoomData.forEach(room => {
      const ward = WardData.find(w => w.id === room.WardId);
      if (!ward) return;

      const floor = FloorData.find(f => f.id === ward.FloorId);
      if (!floor) return;

      combinedData.push({
        id: room.id,
        RoomId: room.id,
        RoomNo: room.Roomno,
        BedNo: `${room.Roomno}/1`,
        WardId: ward.id,
        WardName: ward.WardName,
        FloorId: floor.id,
        FloorName: floor.FloorName,
        BlockId: floor.BlockId,
        BlockName: floor.BlockName,
        BuildingId: floor.BuildingId,
        BuildingName: floor.BuildingName,
        BookingStatus: room.Status || 'Available',
        TotalCharge: room.Acamt || '0.00',
        Status: 'Active'
      });
    });

    return combinedData;
  }, [FloorData, WardData, RoomData]);

  useEffect(() => {
    if (FloorData.length > 0 && WardData.length > 0 && RoomData.length > 0) {
      const generatedData = generateRoomMasterData();
      if (generatedData.length > 0) {
        setRoomMasterData(generatedData);
      }
    }
  }, [FloorData, WardData, RoomData, generateRoomMasterData]);


  const handleStatus = (type) => {
    setfiltertypes(prev => ({
      ...prev,
      status: type || 'Total', // If "All" selected, use 'Total' as fallback
    }));
  }

  useEffect(() => {
    const fetchAllRoomData = async () => {
      const params = {
        location: userRecord?.location,
        status: filtertypes.status || 'Total',
        searchquery: patientData.PatientName
      };

      if (params.location) {
        try {
          const response = await axios.get(
            `${UrlLink}Masters/get_Room_Master_Data`,
            { params }
          );
          console.log("Room Master Data (Complete):", response.data);
          setRoomMasterData(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error("API Error:", error);
          setRoomMasterData([]);
        }
      }
    };

    fetchAllRoomData();
  }, [UrlLink, userRecord?.location, filtertypes.status,patientData]);



  const filteredRoomMasterData = RoomMasterData.filter((bed) => {
    const matchesBuilding = !Roomdata.Building || bed.BuildingId === parseInt(Roomdata.Building, 10);
    const matchesBlock = !Roomdata.Block || bed.BlockId === parseInt(Roomdata.Block, 10);
    const matchesFloor = !Roomdata.Floor || bed.FloorId === parseInt(Roomdata.Floor, 10);
    return matchesBuilding && matchesBlock && matchesFloor;
  });

  const filteredFloors = [...new Map(filteredRoomMasterData.map((bed) => [bed.FloorId, {
    id: bed.FloorId,
    FloorName: bed.FloorName
  }])).values()];

  const filteredWards = [...new Map(filteredRoomMasterData.map((bed) => [bed.WardId, {
    id: bed.WardId,
    WardId: bed.WardId,
    WardName: bed.WardName,
    FloorId: bed.FloorId
  }])).values()];

  const filteredRooms = [...new Map(filteredRoomMasterData.map((bed) => [bed.RoomId, {
    id: bed.RoomId,
    Roomno: bed.RoomNo,
    WardId: bed.WardId
  }])).values()];

  const handleBedClick = async (bed) => {
    if (bed.BookingStatus !== 'Occupied') return;

    console.log("Bed details:", bed);
    const params = {
      location: userRecord?.location,
      status: 'Occupied',
      BedNo: bed.BedNo,
    };
    console.log("Params for API call:", params);

    const fetchPatientData = async () => {
      try {
        let patientData = {};

        const roomRes = await axios.get(`${UrlLink}Masters/get_Room_Master_Data`, {
          params,
        });
        console.log("get_Room_Master_Data response:", roomRes.data);

        const matchingBed = Array.isArray(roomRes.data)
          ? roomRes.data.find((item) => item.BedNo === bed.BedNo)
          : roomRes.data;

        if (matchingBed) {
          patientData = {
            PatientProfile: matchingBed.PatientProfile || bed.PatientProfile || 'N/A',
            PatientId: matchingBed.PatientID || bed.PatientID || 'N/A',
            PatientName: matchingBed.PatientName || bed.PatientName || 'N/A',
            Age: matchingBed.Age || bed.Age || 'N/A',
            Gender: matchingBed.Gender || bed.Gender || 'N/A',
            BloodGroup: matchingBed.BloodGroup || bed.BloodGroup || 'N/A',
            RegistrationId: matchingBed.IP_Registration_Id || bed.PatientID || 'N/A',
            BedNo: matchingBed.BedNo || bed.BedNo || 'N/A',
            DoctorName: matchingBed.DoctorName || bed.DoctorName || 'N/A',
            PatientCategory: matchingBed.PatientCategory || bed.PatientCategory || 'N/A',
            PatientCategoryName: matchingBed.PatientCategory || bed.PatientCategory || 'N/A',
            IsMLC: matchingBed.IsMLC || bed.IsMLC || 'N/A',
            FlaggingColour: matchingBed.FlaggingColour || bed.FlaggingColour || 'green',
            Flagging: matchingBed.Flagging || bed.Flagging || 'No flagging data',
            Admitdate: matchingBed.Admitdate || bed.Admitdate || 'N/A',
            AdmissionPurpose: matchingBed.AdmissionPurpose || bed.AdmissionPurpose || 'N/A',
          };
        }

        if (!patientData.PatientId || patientData.PatientId === 'N/A') {
          const patientRes = await axios.get(`${UrlLink}Frontoffice/get_patient_details`, {
            params: { PatientId: bed.PatientID },
          });
          console.log("Patient details data:", patientRes.data);
          patientData = {
            ...patientData,
            ...patientRes.data,
          };
        }

        return patientData;
      } catch (err) {
        console.error("Error in fetchPatientData:", err);
        return null;
      }
    };

    const patientData = await fetchPatientData();

    if (!patientData) {
      console.error("No patient data fetched, using fallback.");
      const fallbackData = {
        PatientProfile: bed.PatientProfile || 'N/A',
        PatientId: bed.PatientID || 'N/A',
        PatientName: bed.PatientName || 'N/A',
        Age: bed.Age || 'N/A',
        Gender: bed.Gender || 'N/A',
        BloodGroup: bed.BloodGroup || 'N/A',
        RegistrationId: bed.PatientID || 'N/A',
        BedNo: bed.BedNo || 'N/A',
        DoctorName: bed.DoctorName || 'N/A',
        PatientCategory: bed.PatientCategory || 'N/A',
        PatientCategoryName: bed.PatientCategoryName || 'N/A',
        IsMLC: bed.IsMLC || 'N/A',
        FlaggingColour: bed.FlaggingColour || 'green',
        Flagging: bed.Flagging || 'No flagging data',
        Admitdate: bed.Admitdate || 'N/A',
        AdmissionPurpose: bed.AdmissionPurpose || 'N/A',
        RequestType: 'Nurse',
      };
      dispatchvalue({ type: 'IP_DoctorWorkbenchNavigation', value: fallbackData });
      navigate('/Home/WardManagementFolder');
      dispatchvalue({ type: 'HrFolder', value: 'PatientProfileFromBed' });
      dispatchvalue({ type: 'setPreviousFolder', value: null });
      dispatchvalue({ type: 'showMenu', value: true });
      return;
    }

    let admissionData = {};
    try {
      const admissionRes = await axios.get(`${UrlLink}Frontoffice/get_AdmissionDetails`, {
        params: { RegistrationId: patientData.RegistrationId || bed.PatientID },
      });
      admissionData = Array.isArray(admissionRes.data) && admissionRes.data.length > 0
        ? admissionRes.data[0]
        : {};
      console.log("Fetched admission data:", admissionData);
    } catch (err) {
      console.error("Error fetching admission data:", err);
    }

    const dispatchedData = {
      PatientProfile: patientData.PatientProfile || bed.PatientProfile || 'N/A',
      PatientId: patientData.PatientId || bed.PatientID || 'N/A',
      PatientName: patientData.PatientName || bed.PatientName || 'N/A',
      Age: patientData.Age || bed.Age || 'N/A',
      Gender: admissionData.Gender || patientData.Gender || bed.Gender || 'N/A',
      BloodGroup: admissionData.BloodGroup || patientData.BloodGroup || bed.BloodGroup || 'N/A',
      RegistrationId: admissionData.RegistrationId || patientData.RegistrationId || bed.PatientID || 'N/A',
      BedNo: patientData.BedNo || bed.BedNo || admissionData.BedNo || 'N/A',
      DoctorName: admissionData.DoctorName || patientData.DoctorName || bed.DoctorName || 'N/A',
      PatientCategory: admissionData.PatientCategory || patientData.PatientCategory || bed.PatientCategory || 'N/A',
      PatientCategoryName: admissionData.PatientCategoryName || patientData.PatientCategoryName || bed.PatientCategoryName || 'N/A',
      IsMLC: admissionData.IsMLC || patientData.IsMLC || bed.IsMLC || 'N/A',
      FlaggingColour: admissionData.FlaggingColour || patientData.FlaggingColour || bed.FlaggingColour || 'green',
      Flagging: admissionData.Flagging || patientData.Flagging || bed.Flagging || 'No flagging data',
      Admitdate: admissionData.AdmitDate || patientData.Admitdate || bed.Admitdate || 'N/A',
      AdmissionPurpose: admissionData.AdmissionPurpose || patientData.AdmissionPurpose || bed.AdmissionPurpose || 'N/A',
      RequestType: 'Nurse',
    };

    console.log("Dispatching IP_DoctorWorkbenchNavigation:", dispatchedData);
    dispatchvalue({ type: 'IP_DoctorWorkbenchNavigation', value: dispatchedData });
    navigate('/Home/WardManagementFolder');
    dispatchvalue({ type: 'HrFolder', value: 'PatientProfileFromBed' });
    dispatchvalue({ type: 'setPreviousFolder', value: null });
    dispatchvalue({ type: 'showMenu', value: true });
  };

  // Updated roomCards with array check
  const roomCards = Array.isArray(RoomDatas) ? RoomDatas.map((room, index) => {
    const attendersText = Array.isArray(room?.attenders) ? room?.attenders.join(', ') : room?.attenders || '';

    const tooltipContent = (
      <div>
        Patient : {room?.PatientName}
        <br />
        Age : {room?.Age}
        <br />
        Attenders : {attendersText}
        <br />
        Contact : {room?.attenderPhoneNo}
        <br />
        Admitted Date : {room?.Admitdate}
        <br />
        {`Admission Purpose  : ${room?.AdmissionPurpose || ''}`}
      </div>
    );

    return (
      <CustomTooltip
        content={['Occupied', 'Booked', 'Requested'].includes(room.BookingStatus) ? tooltipContent : ''}
        key={index}
      >
        <Card sx={{ maxWidth: 450 }}>
          <div className="tooltip-trigger">
            <CardContent className="Rooms_avail_card_container">
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
                component="div"
                className="Rooms_avail_card_container_container"
              >
                <div className="no_v_rooms">Room Number <span>:</span> {room?.RoomNo}</div>
                <div className="Rooms_avail_card_one">
                  <div className="Rooms_avail_card_neww">
                    <label htmlFor="">
                      Bed No <span>:</span>
                    </label>
                    <div>{room?.BedNo}</div>
                  </div>
                  <div className="Rooms_avail_card_neww">
                    <label htmlFor="">
                      Patient<span>:</span>
                    </label>
                    <div>{room?.PatientName}</div>
                  </div>
                  <div className="Rooms_avail_card_neww">
                    <label htmlFor="">
                      Age<span>:</span>
                    </label>
                    <div>{room?.Age}</div>
                  </div>
                  <div className="Rooms_avail_card_neww">
                    <label htmlFor="">
                      Charge <span>:</span>
                    </label>
                    <div>{room?.TotalCharge}</div>
                  </div>
                </div>
              </Typography>
            </CardContent>
            <CardActions className="Rooms_avail_card_btns">
              <div className="status-container">
                {room.Status !== 'Inactive' ? (
                  <>
                    <FontAwesomeIcon
                      icon={faBed}
                      style={{
                        color:
                          room.BookingStatus === 'Occupied'
                            ? 'red'
                            : room.BookingStatus === 'Maintenance'
                              ? 'orange'
                              : room.BookingStatus === 'Booked'
                                ? 'blue'
                                : room.BookingStatus === 'Requested'
                                  ? 'grey'
                                  : 'green',
                      }}
                      className="Rooms_avail_carditems_availableIcon"
                    />
                    <span
                      style={{
                        color:
                          room.BookingStatus === 'Occupied'
                            ? 'red'
                            : room.BookingStatus === 'Maintenance'
                              ? 'orange'
                              : room.BookingStatus === 'Booked'
                                ? 'blue'
                                : room.BookingStatus === 'Requested'
                                  ? 'grey'
                                  : 'green',
                      }}
                    >
                      {room.BookingStatus === 'Occupied' && 'Occupied'}
                      {room.BookingStatus === 'Maintenance' && 'Under Maintenance'}
                      {room.BookingStatus === 'Available' && 'Available'}
                      {room.BookingStatus === 'Booked' && 'Booked'}
                      {room.BookingStatus === 'Requested' && 'Requested'}
                    </span>
                  </>
                ) : (
                  <>
                    <MdBlock
                      style={{ color: 'red' }}
                      className="Rooms_avail_carditems_availableIcon"
                    />
                    <span style={{ color: 'red' }}>Inactive</span>
                  </>
                )}
              </div>
            </CardActions>
          </div>
        </Card>
      </CustomTooltip>
    );
  }) : [];

  return (
    <>
      <div className="Main_container_app">
        <h3>Room Management</h3>
        <div className="search_div_bar">
          <div className="RegisForm_1">
            <label>
              Building Name <span>:</span>
            </label>
            <select name="Building" onChange={handleChange} value={Roomdata.Building}>
              <option value="">Select</option>
              {Array.isArray(Building) &&
                Building.map((p, index) => (
                  <option key={index} value={p.id}>
                    {p.BuildingName}
                  </option>
                ))}
            </select>
          </div>
          <div className="RegisForm_1">
            <label>
              Block Name <span>:</span>
            </label>
            <select name="Block" onChange={handleChange} value={Roomdata.Block}>
              <option value="">Select</option>
              {Array.isArray(Block_by_building) &&
                Block_by_building.map((p, index) => (
                  <option key={index} value={p.id}>
                    {p.BlockName}
                  </option>
                ))}
            </select>
          </div>
          <div className="RegisForm_1">
            <label>
              Floor Name <span>:</span>
            </label>
            <select name="Floor" onChange={handleChange} value={Roomdata.Floor}>
              <option value="">Select</option>
              {Array.isArray(Floor_by_block) &&
                Floor_by_block.map((p, index) => (
                  <option key={index} value={p.id}>
                    {p.FloorName}
                  </option>
                ))}
            </select>
          </div>
          <div className="RegisForm_1">
            <label>
              Patient Name <span>:</span>
            </label>
            <input
              type='text'
              name='PatientName'
              value={patientData.PatientName}
              onChange={(e) => setPatientData({
                PatientName: e.target.value
              })}
            />
          </div>
        </div>
      </div>

      <div className="wdu6wtc_s8x5">
        <span style={{ backgroundColor: 'grey' }} onClick={() => handleStatus('')}>All</span>
        <span className="available" onClick={() => handleStatus('Available')}>Available</span>
        <span className="occupied" onClick={() => handleStatus('Occupied')}>Occupied</span>
        <span className="discharge" onClick={() => handleStatus('Discharge')}>Discharge Advised</span>
        <span className="housekeeping" onClick={() => handleStatus('Housekeeping')}>Housekeeping</span>
        <span className="maintenance" onClick={() => handleStatus('Maintenance')}>Maintenance</span>
      </div>
      <br />
      <br />
      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th>Floor</th>
              <th>Ward Name</th>
              <th>Room No</th>
              <th>Beds</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredFloors.length > 0 && filteredWards.length > 0 ? (
              filteredFloors.map((floor) => {
                const floorWards = filteredWards.filter((ward) => ward.FloorId === floor.id);

                if (floorWards.length === 0) {
                  return (
                    <tr key={floor.id}>
                      <td>{floor.FloorName}</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>0</td>
                    </tr>
                  );
                }

                return floorWards.map((ward, wardIndex) => {
                  const wardRooms = filteredRooms.filter((room) => room.WardId === ward.id || room.WardId === ward.WardId);
                  const wardBeds = filteredRoomMasterData.filter((bed) =>
                    wardRooms.some((room) =>
                      room.Roomno === bed.RoomNo ||
                      (bed.WardId && (bed.WardId === ward.id || bed.WardId === ward.WardId))
                    )
                  );

                  return (
                    <tr key={`${floor.id}-${ward.WardId}`}>
                      {wardIndex === 0 && (
                        <td rowSpan={floorWards.length}>{floor.FloorName}</td>
                      )}
                      <td>{ward.WardName}</td>
                      <td>
                        {wardRooms.length > 0
                          ? wardRooms.map((room) => (
                            <div key={room.id}>{room.Roomno ? room.Roomno : '-'}</div>
                          ))
                          : '-'}
                      </td>
                      <td>
                        {wardBeds.length > 0 ? (
                          <div className="beds-container">
                            {[...wardBeds]
                              .sort((a, b) => {
                                const numA = parseInt(a.BedNo.split('/')[1], 10) || 0;
                                const numB = parseInt(b.BedNo.split('/')[1], 10) || 0;
                                return numA - numB;
                              })
                              .map((bed) => {
                                const attendersText = Array.isArray(bed?.attenders)
                                  ? bed?.attenders.join(', ')
                                  : bed?.attenders;

                                console.log(bed,'bedbedbedbed')

                             

                                const tooltipContent = (
                                  <div>
                                    Patient: {bed?.PatientName}
                                    <br />
                                    PatientId: {bed?.PatientID}
                                    <br />
                                      IPNO: {bed?.IP_Registration_Id}
                                    <br />
                                    Age: {bed?.Age}
                                    <br />
                                    Attenders: {attendersText}
                                    <br />
                                    Contact: {bed?.attenderPhoneNo}
                                    <br />
                                    Admitted Date: {bed?.Admitdate}
                                    <br />
                                    {`Admission Purpose: ${bed?.AdmissionPurpose || ''}`}
                                  </div>
                                );

                                return (
                                  <CustomTooltip
                                    key={bed.id}
                                    content={['Occupied', 'Booked', 'Requested'].includes(bed.BookingStatus) ? tooltipContent : ''}
                                  >
                                    <span
                                      className={
                                        bed.BookingStatus
                                          ? bed.BookingStatus.toLowerCase().replace(' ', '-')
                                          : 'available'
                                      }
                                      onClick={() => handleBedClick(bed)}
                                      style={{ cursor: bed.BookingStatus === 'Occupied' ? 'pointer' : 'default' }}
                                    >
                                      {bed.BedNo}
                                    </span>
                                  </CustomTooltip>
                                );
                              })}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>{wardBeds.length}</td>
                    </tr>
                  );
                });
              })
            ) : (
              <tr>
                <td colSpan="5">
                  {Roomdata.Building || Roomdata.Block || Roomdata.Floor
                    ? 'No data available for the selected criteria.'
                    : 'Loading data...'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <br />
      <br />
      <br />
      {/* Updated rendering of roomCards with loading/empty state handling */}
      <div className="Rooms_avail_card">
        {Array.isArray(RoomDatas) && RoomDatas.length > 0 ? (
          roomCards
        ) : (
          <p>No rooms available or data is loading...</p>
        )}
      </div>
    </>
  );
};

export default NewRoomAvail;