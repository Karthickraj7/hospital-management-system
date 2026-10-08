import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import axios from "axios";

import { Checkbox } from '@mui/material';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

const OtMaster = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector(state => state.userRecord?.UserData);
    const toast = useSelector((state) => state.userRecord?.toast);

    const dispatchvalue = useDispatch();

    const [locationData, setLocationData] = useState([]);
    const [buildingName, setBuildingName] = useState([]);
    const [blockName, setBlockName] = useState([]);
    const [floorData, setFloorData] = useState([]);
    // const [wardData,setWardData] = useState([]);
    const [otMasterData, setOtMasterData] = useState([]);
    const [IsOtMasterData, setIsOtMasterData] = useState(false);
    const [specialityData, setSpecilitydata] = useState([]);
    const [speciality, setSpeciality] = useState([]);
    //const [Departments, setDepartments] = useState([]);
    const [selectSpeciality, setSelectSpeciality] = useState(false);
    
    const [selectspeModal, setselectspeModal] = useState({
        SelectSpeciality: "",
      });
      

    console.log(speciality);
    console.log(selectspeModal);

    const [otMaster, setOtMaster] = useState({
        OtId: '',
        Location: '',
        Building: '',
        Block: '',
        TheatreName: '',
        ShortName: '',
        FloorName: '',
        WardName: '',
        Emergency: false,
        Speciality:'',
        SpecialityId:'',
        TheatreType: '',
        Details: '',
        Remarks: '',
        Rent: '',
    });

    // const formatLabel = (label) => {
    //     if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
    //         return label
    //             .replace(/([a-z])([A-Z])/g, "$1 $2")
    //             .replace(/^./, (str) => str.toUpperCase());
    //     } else {
    //         return label;
    //     }
    // };

    const HandleDepartmentSelect = () => {
        console.log("Icon clickedddd");
    
        setSelectSpeciality(true);
      };

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Location_Detials_link`)
            .then((res) => setLocationData(res.data))
            .catch((err) => console.log(err));
    }, [UrlLink]);

    useEffect(() => {
        axios.get(`${UrlLink}Masters/get_Floor_Data_by_Building_block_loc?Block=${otMaster.Block}`)
            .then((res) => setFloorData(res.data))
            .catch((err) => console.log(err));
    }, [UrlLink, otMaster.Block]);

    useEffect(() => {
        axios.get(`${UrlLink}Masters/get_building_Data_by_location?Location=${otMaster.Location}`)
            .then((res) => setBuildingName(res.data))
            .catch((err) => console.log(err));
    }, [UrlLink, otMaster.Location]);

    useEffect(() => {
        axios.get(`${UrlLink}Masters/get_block_Data_by_Building?Building=${otMaster.Building}`)
            .then((res) => setBlockName(res.data))
            .catch((err) => console.log(err));
    }, [UrlLink, otMaster.Building]);

    useEffect(() => {
        axios.get(`${UrlLink}OT/OtTheaterMaster_Detials_link`)
            .then((res) => {
                const ress = res.data
                if (Array.isArray(ress)) {
                    setOtMasterData(res.data)
                }
            })
            .catch((err) => console.log(err));
    }, [UrlLink, IsOtMasterData]);

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
            .then((res) => setSpecilitydata(res.data))
            .catch((err) => console.log(err));
    }, [UrlLink]);

    const SelectDataColumn = [
        {
          key: "id",
          name: "Speciality Id",
        },
        {
          key: "selectedSpeciality",
          name: "Selected Speciality",
        },
        {
          key: "Action",
          name: "Action",
          renderCell: (params) => {
            return (
              <>
                <Button
                  className="cell_btn"
                  onClick={() => handleDeleteDepartments(params.row)}
                >
                  <DeleteIcon className="check_box_clrr_cancell" />
                </Button>
              </>
            );
          },
        },
      ];


    // useEffect(() => {
    //     axios.get(`${UrlLink}Masters/get_Ward_Data_by_Building_block_Floor_loc?Floor=${otMaster.FloorName}`)
    //         .then((res) => setWardData(res.data))
    //         .catch((err) => console.log(err));
    // },[UrlLink,otMaster.FloorName]);




    const handleEditOtMasterStatus = (row) => {
        const data = {
            OtId: row.id,
            Statusedit: true,
        };
        axios.post(`${UrlLink}OT/OtTheaterMaster_Detials_link`, data)
            .then((res) => {
                const response = res.data;
                const messageType = Object.keys(response)[0];
                const messageContent = Object.values(response)[0];
                dispatchvalue({
                    type: 'toast',
                    value: { message: messageContent, type: messageType },
                });
                setIsOtMasterData(prev => !prev);
            })
            .catch((err) => console.log(err));
    };

    console.log(otMaster)
    const handleEditOtMaster = (row) => {
        // const { id, ...rest } = row;
        
        setOtMaster((prev) => ({
            ...prev,
            OtId: row?.id,
            Location: row?.LocationId,
            Building: row?.BuidingId,
            Block: row?.BlockId,
            TheatreName: row?.TheatreName,
            ShortName: row?.ShortName,
            FloorName: row?.FloorId,  
            Emergency: row?.Emergency,
            TheatreType: row?.TheatreType,
            Details: row?.Details,
            Remarks: row?.Remarks,
            Rent: row?.Rent,
            Speciality:row?.Specialityname,
            SpecialityId:row?.SpecialityID
        }));

        const department =
            (row?.Specialityname).split(",") || [];
          const departmentId = row?.SpecialityID.split(",");
          console.log("Deeeeeeeee", department);
          console.log("Deeeeeeeee", departmentId);

          const specialityData = departmentId.map((id, index) => ({
            id: id.trim(), // Trim to remove any leading/trailing whitespace
            selectedSpeciality: department[index]?.trim(), // Trim department name and ensure it's mapped correctly
          }));

          // Log the mapped department data for verification
          console.log("Mapped Department Data:", specialityData);

          // Set the mapped department data to the state
          setSpeciality(specialityData);

    
        const data = {

            ...otMaster,
            Speciality :speciality
        };

        console.log(data);

        axios.post(`${UrlLink}OT/OtTheaterMaster_Detials_link`, data)
            .then((res) => {
                const response = res.data;
                const messageType = Object.keys(response)[0];
                const messageContent = Object.values(response)[0];
                console.log(messageType);
                console.log(messageContent);
                dispatchvalue({
                    type: 'toast',
                    value: { message: messageContent, type: messageType },
                });
                setIsOtMasterData(prev => !prev);
                setSpeciality([]);
                setOtMaster({
                    OtId: '',
                    Location: '',
                    Building: '',
                    Block: '',
                    TheatreName: '',
                    ShortName: '',
                    FloorName: '',
                    WardName: '',
                    Emergency: false,
                    Speciality: '',
                    SpecialityId:'',
                    SurgeryType: '',
                    Details: '',
                    Remarks: '',
                    Rent: '',
                });
            })
            .catch((err) => console.log(err));

    };

    const handleOtMastersubmit = () => {
        if (!otMaster.Location || !otMaster.TheatreName) {
            dispatchvalue({
                type: 'toast',
                value: { message: 'Please provide both Location and Theatre Name.', type: 'warn' },
            });
            return;
        }

        const data = {
            ...otMaster,
            Speciality: speciality,
            created_by: userRecord?.username || ''
        };

        console.log(data, 'data');


        axios.post(`${UrlLink}OT/OtTheaterMaster_Detials_link`, data)
            .then((res) => {
                const response = res.data;
                const messageType = Object.keys(response)[0];
                const messageContent = Object.values(response)[0];
                dispatchvalue({
                    type: 'toast',
                    value: { message: messageContent, type: messageType },
                });
                setIsOtMasterData(prev => !prev);
                setSpeciality([]);
                setOtMaster({
                    OtId: '',
                    Location: '',
                    Building: '',
                    Block: '',
                    TheatreName: '',
                    ShortName: '',
                    FloorName: '',
                    WardName: '',
                    Emergency: false,
                    Speciality: '',
                    SpecialityId:'',
                    TheatreType: '',
                    Details: '',
                    Remarks: '',
                    Rent: '',
                });
            })
            .catch((err) => console.log(err));
    };

    const handleInputChange = (e) => {
        const { name, type, value, checked, options, multiple } = e.target;

        setOtMaster(prevState => ({
            ...prevState,
            [name]: multiple
                ? Array.from(options).filter(option => option.selected).map(option => option.value)
                : (type === 'checkbox' ? checked : value),
        }));
        // setOtMaster(prevState => ({
        //     ...prevState,
        //     [name]: type === 'checkbox' ? checked : value,
        // }));

        if ( name === "Speciality") {
            setOtMaster((prev) => ({
              ...prev,
              [name]: speciality.join(","),
      
             
            }));
          }

          if (e.target.name === 'Remarks' || e.target.name === 'Details') {
            adjustHeight(e);
          }
    };
    const adjustHeight = (e) => {
      e.target.style.height = "auto"; // Reset height to calculate scrollHeight
      e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight
    };
  

     // Save the selected department
  const handleDepartmentSave = () => {
    const selectedSpeciality = specialityData.find(
      (dep) => dep.id === parseInt(selectspeModal.SelectSpeciality)
    );

    console.log(selectedSpeciality);

    if (selectedSpeciality) {
      const specilaityExists = speciality.some(
        (dep) => dep.id === selectedSpeciality.id
      );

      if (specilaityExists) {
        // Dispatch a warning toast
        const tdata = {
          message: "The Department is already Selected",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        const updatedSpeciality = [
          ...speciality,
          {
            id: selectedSpeciality.id,
            selectedSpeciality: selectedSpeciality.SpecialityName,
          },
        ];

        setSpeciality(updatedSpeciality);

       // Update the DoctorProfessForm state with a comma-separated string
        setOtMaster((prev) => ({
          ...prev,
          Speciality: updatedSpeciality
            .map((dep) => dep.selectedSpeciality)
            .join(", "),
            SpecialityId: updatedSpeciality.map((dep) => dep.id).join(", "),
        }));
      }
    }

    setselectspeModal({ SelectSpeciality: "" }); // Reset after saving
    
  };

  // Delete a selected department
  const handleDeleteDepartments = (departmentId) => {
    console.log("Department ID to delete:", departmentId);
    const updatedSpeciality = speciality.filter(
      (dep) => dep.id !== departmentId.id
    );
    console.log("Updated Departments after deletion:", updatedSpeciality);
    setSpeciality(updatedSpeciality);

    // Update the DoctorProfessForm state with the remaining departments
    setOtMaster((prev) => ({
        ...prev,
        Speciality: updatedSpeciality
          .map((dep) => dep.selectedSpeciality)
          .join(", "),
          SpecialityId: updatedSpeciality.map((dep) => dep.id).join(", "),
      }));
  };

  const handleinpchangeDepartment = (e) => {
    const { name, value } = e.target;
    console.log(name,value);
    const formattedValue = value;

    setselectspeModal((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

    const OtMasterColumns = [
        { key: "sno", name: "S.No", frozen: true },
        { key: "created_by", name: "Created By", frozen: true },
        { key: "TheatreName", name: "Theatre Name" },
        { key: "ShortName", name: "Short Name" },
        // { key: "FloorName", name: "Floor Name" },
        //{ key: "Emergency", name: "Emergency" },    
        { key: "Specialityname", name: "Speciality" },
        { key: "TheatreType", name: "TheatreType" },
        { key: "Details", name: "Details" },
        { key: "Remarks", name: "Remarks" },
        // { key: "BuildingName", name: "Building" },
        // { key: "BlockName", name: "Block" },
        { key: "Rent", name: "Rent" },
        // { key: "Location", name: "Location" },
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <Button onClick={() => handleEditOtMasterStatus(params.row)}>
                    {params.row.Status}
                </Button>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <Button onClick={() => handleEditOtMaster(params.row)}>
                    <EditIcon />
                </Button>
            ),
        }
    ];

    return (
        <div className="Main_container_app">
            <h3>
                Theatre Masters
                {/* <div style={{ float: 'right' }}>
                    OT Available
                    <span><FontAwesomeIcon icon={faCalendarDays} className="cal_icon" /></span>
                </div> */}
            </h3>
            <br />
            <div className="RegisFormcon_1">
                <div className="RegisForm_1">
                    <label>Location<span>:</span></label>
                    {console.log(otMaster,'otMaster')}
                    <select name="Location" value={otMaster.Location} onChange={handleInputChange} required>
                        <option value="">Select</option>
                        {locationData.map((loc, index) => (
                            <option key={index} value={loc.id}>{loc.locationName}</option>
                        ))}
                    </select>
                </div>
                <div className="RegisForm_1">
                    <label>Building<span>:</span></label>
                    <select name="Building" value={otMaster.Building} onChange={handleInputChange} required>
                        <option value="">Select</option>
                        {Array.isArray(buildingName) && buildingName.map((building, index) => (
                            <option key={index} value={building.id}>{building.BuildingName}</option>
                        ))}
                    </select>
                </div>
                <div className="RegisForm_1">
                    <label>Block<span>:</span></label>
                    <select name="Block" value={otMaster.Block} onChange={handleInputChange} required>
                        <option value="">Select</option>
                        {Array.isArray(blockName) && blockName.map((block, index) => (
                            <option key={index} value={block.id}>{block.BlockName}</option>
                        ))}
                    </select>
                </div>
                <div className="RegisForm_1">
                    <label>Floor Name<span>:</span></label>
                    <select name="FloorName" value={otMaster.FloorName} onChange={handleInputChange} required>
                        <option value="">Select</option>
                        {Array.isArray(floorData) && floorData.map((floor, index) => (
                            <option key={index} value={floor.id}>{floor.FloorName}</option>
                        ))}
                    </select>
                </div>
                {/* <div className="RegisForm_1">
                    <label>Ward Name<span>:</span></label>
                    <select name="WardName" value={otMaster.WardName} onChange={handleInputChange} required>
                        <option value="">Select</option>
                        {Array.isArray(wardData) && wardData.map((ward, index) => (
                            <option key={index} value={ward.id}>{ward.WardName}</option>
                        ))}
                    </select>
                </div> */}
                 {/* <div className="RegisForm_1">
                    <label>FloorName Name<span>:</span></label>
                    <input
                        type="text"
                        name="TheatreName"
                        placeholder="Enter Theatre Name"
                        value={otMaster.FloorName}
                        onChange={handleInputChange}
                        required
                    />
                </div> */}


                <div className="RegisForm_1">
                    <label>Theatre Name<span>:</span></label>
                    <input
                        type="text"
                        name="TheatreName"
                        placeholder="Enter Theatre Name"
                        value={otMaster.TheatreName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label>Short Name<span>:</span></label>
                    <input
                        type="text"
                        name="ShortName"
                        placeholder="Enter Short Name"
                        value={otMaster.ShortName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label>Emergency<span>:</span></label>

                    <div style={{width:'120px', display:'flex', justifyContent:'flex-start'}}>
                    <Checkbox
                        name="Emergency"
                        checked={otMaster.Emergency}
                        onChange={handleInputChange}
                    />
                    </div>
                </div>
                
                <div className="RegisForm_1">
                    <label>Theatre Type<span>:</span></label>
                    <select name="TheatreType" onChange={handleInputChange} value={otMaster.TheatreType} required>
                        <option value="">Select</option>
                        <option value="Major">Major</option>
                        <option value="Minor">Minor</option>
                    </select>
                </div>

               


                <div className="RegisForm_1">
                    <label>Speciality<span>:</span></label>
                    <input
                        type="Text"
                        name="Speciality"
                        className='jdsjd_o9d'
                        value={otMaster.Speciality}
                        onChange={handleInputChange}
                        required
                    
                    />
                    <span>
                      <AddBoxIcon onClick={HandleDepartmentSelect} />
                    </span>
                    
                </div>


                <div className="RegisForm_1">
                    <label>Rent/hr (Rs.)<span>:</span></label>
                    <input
                        type="Number"
                        name="Rent"
                        placeholder="Enter Amount"
                        value={otMaster.Rent}
                        onChange={handleInputChange}
                        required
                    />
                </div>


         
         
            </div>

            <div className="RegisFormcon extend_textarea_new">
        <div className="RegisForm_1 extend_textarea_new"

        >
                    <label>Details<span>:</span></label>
                    <textarea
                        name="Details"
                        placeholder="Enter Details"
                        value={otMaster.Details}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>

            <div className="RegisFormcon extend_textarea_new">
        <div className="RegisForm_1 extend_textarea_new"

        >
                    <label>Remarks<span>:</span></label>
                    <textarea
                        name="Remarks"
                        placeholder="Enter Remarks"
                        value={otMaster.Remarks}
                        onChange={handleInputChange}
                        required
                    />
                </div>

            </div>


            <div className="Main_container_Btn">
                <button onClick={handleOtMastersubmit}>
                    {otMaster.OtId ? 'Update' : 'Save'}
                </button>
            </div>
            {otMasterData.length > 0 && (
                <ReactGrid columns={OtMasterColumns} RowData={otMasterData} />
            )}
             {selectSpeciality && (
        <div className="loader" onClick={() => setSelectSpeciality(false)}>
          <div
            className="loader_register_roomshow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="DivCenter_container">Select Speciality Details</div>
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label htmlFor="selectDepModal.SelectDepartment">
                  Select Speciality <span>:</span>
                </label>
                <select
                  name="SelectSpeciality"
                  required
                  id={selectspeModal.SelectSpeciality}
                  value={selectspeModal.SelectSpeciality}
                  onChange={handleinpchangeDepartment}
                >
                  <option value="">Select</option>
                  {specialityData.filter((p) => p.Status === "Active").map(
                    (p, index) => (
                      <option key={index} value={p.Speciality_Id}>
                        {p.SpecialityName}
                      </option>
                    )
                  )}
                </select>
                <div className="Main_container_Btn">
                  <button onClick={handleDepartmentSave}>Save</button>
                </div>
              </div>
            </div>
            <ReactGrid columns={SelectDataColumn} RowData={speciality} />
            
          </div>
        </div>
      )}

<ToastAlert Message={toast.message} Type={toast.type} />
        </div>
        
    );
};

export default OtMaster;
