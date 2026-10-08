import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import VisibilityIcon from "@mui/icons-material/Visibility";

function NurseStationMaser() {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [LocationData, setLocationData] = useState([]);
  const [WardData, setWardData] = useState([]);
  const [ward_Building_by__loc, setward_Building_by__loc] = useState([]);
  const [ward_block_by_Building, setward_block_by_Building] = useState([]);
  const [ward_Floor_by_Block, setward_Floor_by_Block] = useState([]);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [NurseStationResData, setNurseStationResData] = useState([]);
  const [ViewWards, setViewWards] = useState([]);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const dispatchvalue = useDispatch();

  const [OpenModal, setOpenModal] = useState(false);
  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

  const [NurseStationData, setNurseStationData] = useState({
    Location_Name: "",
    Building_Name: "",
    Block_Name: "",
    Floor_Name: "",
    NurseStationName: "",
     HeadNurseStation: "No",
    WardNames: [],
    SelectedWardIDs: [],
    created_by: userRecord?.username,
   
  });


console.log(NurseStationData);

  const ClearState=()=>{
    setNurseStationData({
      Location_Name: "",
      Building_Name: "",
      Block_Name: "",
      Floor_Name: "",
      NurseStationName: "",
      HeadNurseStation: "No",
      WardNames: [],
      SelectedWardIDs: [],
      created_by: userRecord?.username,
    })
  }

  // console.log(NurseStationData);
  useEffect(() => {
    if (NurseStationData.Location_Name) {
      axios
        .get(
          `${UrlLink}Masters/get_building_Data_by_location?Location=${NurseStationData.Location_Name}`
        )
        .then((res) => {
          console.log(res);
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
    if (NurseStationData.Floor_Name) {
      const data = {
        FloorName: NurseStationData.Floor_Name,
      };
      axios
        .get(`${UrlLink}Masters/get_Ward_Data_by_Floor_loc`, {
          params: data,
        })
        .then((res) => {
          console.log(res);
          setNurseStationData((prev) => ({
            ...prev,
            WardNames: res.data,
          }));

          // setWardNames(res.data);
        })
        .catch((err) => {
          setNurseStationData((prev) => ({
            ...prev,
            WardNames: [],
          }));
          console.log(err);
        });
    }
  }, [NurseStationData.Floor_Name, UrlLink]);

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
    const { name, value ,checked} = e.target;
    if (name === "Location_Name") {
      setNurseStationData((prev) => ({
        ...prev,
        [name]: value,
        Building_Name: "",
        Block_Name: "",
        Floor_Name: "",
        NurseStationName: "",
      }));
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
    } else if (name === "HeadNurseStation") {
      setNurseStationData((prev) => ({
        ...prev,
        [name]: checked ? "Yes" : "No",
      }));
    } else {
      setNurseStationData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
    }
  };

  const handleWardCheckboxChange = (e, id) => {
    const { checked } = e.target;

    setNurseStationData((prev) => {
      let updatedSelectedWardIDs = [...prev.SelectedWardIDs];

      if (id === "ALL") {
        // If "ALL" is checked, add all Ward IDs
        updatedSelectedWardIDs = checked
          ? prev.WardNames.map((ward) => ward.id) // Add all IDs including 'ALL'
          : []; // Uncheck all IDs
      } else {
        // If an individual ward is checked/unchecked
        if (checked) {
          updatedSelectedWardIDs = [...updatedSelectedWardIDs, id];
        } else {
          updatedSelectedWardIDs = updatedSelectedWardIDs.filter(
            (wardId) => wardId !== id
          );
        }

        // Ensure "ALL" is toggled appropriately
        const allChecked =
          updatedSelectedWardIDs.length === prev.WardNames.length - 1; // Exclude 'ALL'
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
      };
    });
  };

  const validateFields = () => {
    const missingFields = [];
    if (!NurseStationData.Location_Name) missingFields.push("Location Name");
    if (!NurseStationData.Building_Name) missingFields.push("Building Name");
    if (!NurseStationData.Block_Name) missingFields.push("Block Name");
    if (!NurseStationData.Floor_Name) missingFields.push("Floor Name");
    if (!NurseStationData.NurseStationName)
      missingFields.push("Nurse Station Name");
    if (!NurseStationData.SelectedWardIDs.length)
      missingFields.push("Select Atleast One Ward");

    return missingFields;
  };

  const HandleSaveWard = () => {
    const missingFields = validateFields();
    // console.log(missingFields.length > 0)
    if (missingFields.length > 0) {
      const tdata = {
        message: `The following fields are mandatory and missing: ${missingFields.join(
          ", "
        )}`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });

      return
    }

    axios
      .post(`${UrlLink}Masters/NurseStationData`, NurseStationData)
      .then((res) => {
        console.log(res);
        const tdata = {
          message: res.data.message,
          type: res.data.type,
        };
        console.log(tdata);
        dispatchvalue({ type: "toast", value: tdata });
        fetchNurseStationData();
        ClearState();
      })
      .catch((err) => {
        // setward_Building_by__loc([]);
        console.log(err);
      });
  };
  const fetchNurseStationData = useCallback(() => {
    axios
      .get(`${UrlLink}Masters/NurseStationData`)
      .then((res) => {
        console.log(res);
        setNurseStationResData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    fetchNurseStationData();
  }, [fetchNurseStationData]);

  const handleView = (row) => {
    setViewWards(row.Wards);
    setOpenModal(true);
  };

  const handleclosemodal1 = () => {
    setOpenModal(false);
    // setCheckedTests([]);
  };

  const NurseStationColumn = [
    {
      key: "NurseStationid",
      name: "Nurse StationID",
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
      name: "NurseStation Name",
    },
    {
      key: "Status_Name",
      name: "Status",
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            // onClick={() => handleeditFlaggstatus(params.row)}
          >
            {params.row.Status_Name}
          </Button>
        </>
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
  ];

  const WardColumns = [
    {
      key: "NurseStationDetailsid",
      name: "Ward Id",
      frozen: true,
    },
    {
      key: "Ward_Name",
      name: "Ward Name",
      frozen: true,
    },
  ];

  return (
    <div className="Main_container_app">
      <h3>NurseStation Maser</h3>
      <>
        <br />
        <div className="RegisFormcon_1">
          {Object.keys(NurseStationData)
            .filter((p) => p !== "WardId")
            .map((field, indx) => (
              <>
                <div className="RegisForm_1" key={indx}>
                  {field !== "SelectedWardIDs" && field !== "created_by" && (
                    <label>
                      {" "}
                      {formatLabel(field)} <span>:</span>{" "}
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
                   {field === "HeadNurseStation" && (
                    <input
                      type="checkbox"
                      name={field}
                      required
                      value={NurseStationData[field]}
                      onChange={handlechangeWard}
                    />
                  )}
                  {field !== "NurseStationName" &&
                    field !== "WardNames" &&
                    field !== "SelectedWardIDs" &&
                    field !== "created_by" &&
                    field !== "HeadNurseStation" && (
                      <select
                        name={field}
                        required
                        disabled={NurseStationData.WardId}
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
                        {/* {console.log(ward_Floor_by_Block)} */}
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
                    // justifyContent: "space-between", // Distributes items evenly
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
                          flex: "0 1 calc(33.33% - 10px)", // Ensures three items per row
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <input
                          type="checkbox"
                          name={field}
                          value={p.WardName}
                          autoComplete="off"
                          required
                          style={{ width: "13px" }}
                          checked={NurseStationData.SelectedWardIDs.includes(
                            p.id
                          )}
                          onChange={(e) => handleWardCheckboxChange(e, p.id)}
                        />
                        <label style={{ fontSize: "7px" }}>{p.WardName}</label>
                      </div>
                    ))
                  ) : (
                    <>
                      {field === "WardNames" && <label>No Ward Avilable</label>}
                    </>
                  )}
                </div>
              </>
            ))}
        </div>
        <br />

        <div className="Main_container_Btn">
          <button onClick={HandleSaveWard}>
            {NurseStationData.WardId ? "Update" : "Create"}
          </button>
        </div>
        <br />
        <div className="Main_container_app">
          <ReactGrid
            columns={NurseStationColumn}
            RowData={NurseStationResData}
          />
        </div>
      </>
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
                <h4>Wards </h4>
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