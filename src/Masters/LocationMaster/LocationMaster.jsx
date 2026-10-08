import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import ListIcon from '@mui/icons-material/List';
import { useNavigate } from 'react-router-dom';
import { MdQrCode2 } from "react-icons/md";




const LocationMaster = () => {


    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const navigate = useNavigate()

    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const dispatchvalue = useDispatch();
    const [LocationData, setLocationData] = useState([]);
      const [Specialitydata, setSpecialitydata] = useState([]);
    

    const [LocationPage, setLocationPage] = useState('Locations')



    // ---------------location master

    const [LocationName, setLocationName] = useState({
        locationId: '',
        locationName: '',
        bedCount: '',


    });





    const [Locations, setLocations] = useState([])
    const [IsLocationget, setIsLocationget] = useState(false)

    const LocationsColumns = [
        {
            key: "id",
            name: "Location Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By ",
            frozen: true
        },
        {
            key: "locationName",
            name: "Location Name",
        },
        {
            key: "bedCount",
            name: "Bed Count",
        },
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditLocationstatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditLocation(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }


    ]

    const handleeditLocationstatus = (params) => {
        const data = {
            locationId: params.id,
            Statusedit: true
        }
        axios.post(`${UrlLink}Masters/Location_Detials_link`, data)
            .then((res) => {
                const resres = res.data
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }

                dispatchvalue({ type: 'toast', value: tdata });
                setIsLocationget(prev => !prev)
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const handleeditLocation = (params) => {
        const { id, ...rest } = params
        setLocationName((prev) => ({
            ...prev,
            locationId: id,
            ...rest
        }))
    }

    const handleLocationsubmit = () => {
        if (LocationName.locationName && LocationName.bedCount) {
            const data = {
                ...LocationName,
                created_by: userRecord?.username || ''

                // created_by: LocationName.locationId ? LocationName.created_by : userRecord?.username || '',
            }
            axios.post(`${UrlLink}Masters/Location_Detials_link`, data)
                .then((res) => {
                    const resData = res.data;
                    const mess = Object.values(resData)[0];
                    const typp = Object.keys(resData)[0];
                    const tdata = {
                        message: mess,
                        type: typp,
                    }



                    dispatchvalue({ type: 'toast', value: tdata })
                    setIsLocationget(prev => !prev)
                    setLocationName({
                        locationId: '',
                        locationName: '',
                        bedCount: '',


                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide both Location Name and Bed Count.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }



    };


    useEffect(() => {
        axios.get(`${UrlLink}Masters/Location_Detials_link`)
            .then((res) => {
                const ress = res.data
                setLocations(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [IsLocationget, UrlLink])

     useEffect(() => {
        axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
          .then((res) => setSpecialitydata(res.data))
          .catch((err) => console.log(err));
      }, [UrlLink]);





    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocationName((prevState) => ({
            ...prevState,
            [name]: value?.toUpperCase()?.trim(),
        }));
    };

    {/* -----------------------------Building------------------------------------------ */ }



    const formatLabel = (label) => {
        if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
            return label
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/^./, (str) => str.toUpperCase());
        } else {
            return label;
        }
    };
    useEffect(() => {
        axios.get(`${UrlLink}Masters/Location_Detials_link`)
            .then((res) => {
                const ress = res.data
                setLocationData(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [UrlLink])


    // Building name 
    const [BuildingName, setBuildingName] = useState({
        BuildingId: '',
        BuildingName: '',
        Location: '',
    })
    const [BuildingData, setBuildingData] = useState([])
    const [IsBuildingGet, setIsBuildingGet] = useState(false)
    const BuildingColumns = [
        {
            key: "id",
            name: "Building Id",
            frozen: true
        },
        {
            key: "Location_Name",
            name: "Location",
            frozen: true
        },
        {
            key: "BuildingName",
            name: "Building Name",
        },

        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleEditBuildingStatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleEditBuilding(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ]

    const HandleEditBuildingStatus = (params) => {
        const data = {
            BuildingId: params.id,
            Statusedit: true
        }
        const confirmation = window.confirm('Are you sure you want to update the status? All the children Block, Floor, Store, RoomType, room and bed statuses will be changed.');
        if (confirmation) {
            axios.post(`${UrlLink}Masters/Building_Master_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsBuildingGet(prev => !prev)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
    const HandleEditBuilding = (params) => {
        const { id, Location_Id, BuildingName } = params
        setBuildingName({
            BuildingId: id,
            BuildingName: BuildingName,
            Location: Location_Id,
        })
    }

    const HandleSaveBuilding = () => {
        if (BuildingName.BuildingName && BuildingName.Location) {


            const data = {
                ...BuildingName,
                created_by: userRecord?.username || ''
            }
            axios.post(`${UrlLink}Masters/Building_Master_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsBuildingGet(prev => !prev)
                    setBuildingName({
                        BuildingId: '',
                        BuildingName: '',
                        Location: '',

                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide both Store Name and Location.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Building_Master_Detials_link`)
            .then((res) => {
                const ress = res.data
                setBuildingData(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [IsBuildingGet, UrlLink])


    //Block Name
    const [BlockName, setBlockName] = useState({
        BlockId: '',
        BuildingName: '',
        BlockName: '',
        Location: '',
    })
    const [BlockData, setBlockData] = useState([])
    const [Buildingby_loc, setBuildingby_loc] = useState([])
    useEffect(() => {
        if (BlockName.Location) {
            axios.get(`${UrlLink}Masters/get_building_Data_by_location?Location=${BlockName.Location}`)
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setBuildingby_loc(res.data)
                    } else {
                        setBuildingby_loc([])
                    }
                })
                .catch(err => {
                    setBuildingby_loc([])
                    console.log(err);
                })
        }

    }, [BlockName.Location, UrlLink])

    const handlechangeBlock = (e) => {
        const { name, value } = e.target
        if (name === 'Location') {
            setBlockName((prev) => ({
                ...prev,
                [name]: value,
                BuildingName: '',
                BlockName: '',
            }))
        } else if (name === 'BuildingName') {
            setBlockName((prev) => ({
                ...prev,
                [name]: value,
                BlockName: '',
            }))
        } else {
            setBlockName((prev) => ({
                ...prev,
                [name]: value.toUpperCase()
            }))
        }
    }
    const BlockColumns = [
        {
            key: "id",
            name: "Block Id",
            frozen: true
        },
        {
            key: "Location_Name",
            name: "Location",
            frozen: true
        },
        {
            key: "BuildingName",
            name: "Building Name",
        },
        {
            key: "BlockName",
            name: "Block Name",
        },

        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleEditBlockStatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleEditBlock(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ]

    const HandleEditBlockStatus = (params) => {
        const data = {
            BlockId: params.id,
            Statusedit: true
        }
        const confirmation = window.confirm('Are you sure you want to update the status? All the children Floor, Store, RoomType, room and bed statuses will be changed.');
        if (confirmation) {
            axios.post(`${UrlLink}Masters/Block_Master_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    console.log(resres);
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsBuildingGet(prev => !prev)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
    const HandleEditBlock = (params) => {
        const { id, Location_Id, BuildingId, BlockName } = params
        setBlockName({
            BlockId: id,
            BlockName: BlockName,
            BuildingName: BuildingId,
            Location: Location_Id,
        })
    }

    const HandleSaveBlock = () => {
        if (BlockName.Location && BlockName.BuildingName && BlockName.BlockName) {


            const data = {
                ...BlockName,
                created_by: userRecord?.username || ''
            }
            axios.post(`${UrlLink}Masters/Block_Master_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsBuildingGet(prev => !prev)
                    setBlockName(
                        {
                            BlockId: '',
                            BlockName: '',
                            BuildingName: '',
                            Location: '',

                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide both Building Name, Block Name and Location.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Block_Master_Detials_link`)
            .then((res) => {
                const ress = res.data
                setBlockData(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [IsBuildingGet, UrlLink])



    //Floor Name
    const [FloorName, setFloorName] = useState({
        FloorId: '',
        BuildingName: '',
        BlockName: '',
        FloorName: '',
        Location: '',
    })

    const [FloorData, setFloorData] = useState([])
    const [BLockby_Building_loc, setBLockby_Building_loc] = useState([])
    const [BLockby_Building, setBLockby_Building] = useState([])
    useEffect(() => {
        if (FloorName.Location) {
            axios.get(`${UrlLink}Masters/get_building_Data_by_location?Location=${FloorName.Location}`)
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setBLockby_Building_loc(res.data)
                    } else {
                        setBLockby_Building_loc([])
                    }
                })
                .catch(err => {
                    setBLockby_Building_loc([])
                    console.log(err);
                })
        }

    }, [FloorName.Location, UrlLink])

    useEffect(() => {
        if (FloorName.BuildingName) {
            const data = {
                Building: FloorName.BuildingName,
            }
            axios.get(`${UrlLink}Masters/get_block_Data_by_Building`, { params: data })
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setBLockby_Building(res.data)
                    } else {
                        setBLockby_Building([])
                    }
                })
                .catch(err => {
                    setBLockby_Building([])
                    console.log(err);
                })
        }

    }, [FloorName.BuildingName, UrlLink])

    const handlechangeFloor = (e) => {
        const { name, value } = e.target
        if (name === 'Location') {
            setFloorName((prev) => ({
                ...prev,
                [name]: value,
                BuildingName: '',
                BlockName: '',
                FloorName: '',
            }))
        } else if (name === 'BuildingName') {
            setFloorName((prev) => ({
                ...prev,
                [name]: value,
                BlockName: '',
                FloorName: '',
            }))
        } else if (name === 'BlockName') {
            setFloorName((prev) => ({
                ...prev,
                [name]: value,
                FloorName: '',
            }))
        } else {
            setFloorName((prev) => ({
                ...prev,
                [name]: value.toUpperCase()
            }))
        }

    }
    const FloorColumns = [
        {
            key: "id",
            name: "Floor Id",
            frozen: true
        },
        {
            key: "Location_Name",
            name: "Location",
            frozen: true
        },
        {
            key: "BuildingName",
            name: "Building Name",
        },
        {
            key: "BlockName",
            name: "Block Name",
        },
        {
            key: "FloorName",
            name: "Floor Name",
        },

        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleEditFloorStatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleEditFloor(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        },
        {
            key: "QR",
            name: "QR",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleQRFloor(params.row)}
                    >
                        <MdQrCode2 style={{ color: 'black' }} className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ]

    const HandleEditFloorStatus = (params) => {
        const data = {
            FloorId: params.id,
            Statusedit: true
        }
        const confirmation = window.confirm('Are you sure you want to update the status? All the children Store and RoomType and room and bed statuses will be changed.');
        if (confirmation) {
            axios.post(`${UrlLink}Masters/Floor_Master_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    console.log(resres);
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsBuildingGet(prev => !prev)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    const HandleQRFloor = (params) => {

        const summadata = {
            Qrname: 'Floor',
            IdentifyId: params.id,
            IdentifcationName: params.FloorName,
        }
        navigate('/Home/QRgenerater')
        dispatchvalue({ type: 'QRdata', value: { ...summadata } })
    }

    const HandleEditFloor = (params) => {
        const { id, Location_Id, BlockId, BuildingId, FloorName } = params
        setFloorName({
            FloorId: id,
            BlockName: BlockId,
            BuildingName: BuildingId,
            FloorName: FloorName,
            Location: Location_Id,
        })
    }

    const HandleSaveFloor = () => {
        const exist = Object.keys(FloorName).filter(p => p !== 'FloorId').filter((field) => !FloorName[field])
        if (exist.length === 0) {


            const data = {
                ...FloorName,
                created_by: userRecord?.username || ''
            }
            axios.post(`${UrlLink}Masters/Floor_Master_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsBuildingGet(prev => !prev)
                    setFloorName({
                        FloorId: '',
                        BuildingName: '',
                        BlockName: '',
                        FloorName: '',
                        Location: '',

                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide ${exist.join(' and ')}`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Floor_Master_Detials_link`)
            .then((res) => {
                const ress = res.data
                setFloorData(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [IsBuildingGet, UrlLink])


    // -------------------------------------- ward Name


    // ward name ------------

    const [WardName, setWardName] = useState({
        Location: '',
        // BuildingName: '',
        // BlockName: '',
        // FloorName: '',
        Type:'',
        WardName: '',
        Amount:0,
        DoctorCharges: 0,
        NurseCharges: 0,
        isAc: false,
        Acamt : 0,
        NonACamt : 0,
        
        // StorageZone: false,
        WardId: '',
    })

    console.log(WardName,'WardName')
    const [WardData, setWardData] = useState([])
    const [ward_Building_by__loc, setward_Building_by__loc] = useState([])
    const [ward_block_by_Building, setward_block_by_Building] = useState([])
    const [ward_Floor_by_Block, setward_Floor_by_Block] = useState([])

    const [selectRoom, setselectRoom] = useState(false);
    // const [selectRoom, setselectRoom] = useState(false);
    // const ItemView = (row) => {

    //     console.log('row', row.getSingledata);

    //     let select = row?.getSingledata

    //     if (select && select.length !== 0) {
    //         setViewSelectoption(select)
    //         setselectRoom(true)
    //     }
    //     else {
    //         const tdata = {
    //             message: 'There is no select List to view.',
    //             type: 'warn'
    //         };
    //         dispatchvalue({ type: 'toast', value: tdata });

    //     }


    // }
    // const [ViewSelectoption, setViewSelectoption] = useState([]);
    // const [StorageZoneConditions, setStorageZoneConditions] = useState([
    //     {
    //         id: 'raiseApprove',
    //         label: 'Indent Raise Approve',
    //         exists: true,
    //     },
    //     {
    //         id: 'issueApprove',
    //         label: 'Indent Issue Approve',
    //         exists: true,
    //     },
    //     {
    //         id: 'receiveApprove',
    //         label: 'Indent Receive Approve',
    //         exists: true,
    //     },
    //     {
    //         id: 'returnApprove',
    //         label: 'Indent Return Approve',
    //         exists: true,
    //     },
    // ]);


    // const handleCheckbox = (index) => {
    //     const updatedConditions = StorageZoneConditions.map((item, idx) => {

    //         if (idx === index) {
    //             const newExistsState = !item.exists;

    //             return {
    //                 ...item,
    //                 exists: newExistsState,
    //             };
    //         }

    //         return item;
    //     });

    //     setStorageZoneConditions(updatedConditions);
    // };












    useEffect(() => {
        if (WardName.Location) {
            axios.get(`${UrlLink}Masters/get_building_Data_by_location?Location=${WardName.Location}`)
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setward_Building_by__loc(res.data)
                    } else {
                        setward_Building_by__loc([])
                    }
                })
                .catch(err => {
                    setward_Building_by__loc([])
                    console.log(err);
                })
        }

    }, [WardName.Location, UrlLink])

    useEffect(() => {
        if (WardName.BuildingName) {
            const data = {
                Building: WardName.BuildingName,
            }
            axios.get(`${UrlLink}Masters/get_block_Data_by_Building`, { params: data })
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setward_block_by_Building(res.data)
                    } else {
                        setward_block_by_Building([])
                    }
                })
                .catch(err => {
                    setward_block_by_Building([])
                    console.log(err);
                })
        }

    }, [WardName.BuildingName, UrlLink])

    useEffect(() => {
        if (WardName.BlockName) {
            const data = {
                Block: WardName.BlockName,
            }
            axios.get(`${UrlLink}Masters/get_Floor_Data_by_Building_block_loc`, { params: data })
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setward_Floor_by_Block(res.data)
                    } else {
                        setward_Floor_by_Block([])
                    }

                })
                .catch(err => {
                    setward_Floor_by_Block([])
                    console.log(err);
                })
        }

    }, [WardName.BlockName, UrlLink])


    const handlechangeWard = (e) => {
        const { name, value } = e.target
        if (name === 'Location') {
            setWardName((prev) => ({
                ...prev,
                [name]: value,
                // BuildingName: '',
                // BlockName: '',
                // FloorName: '',
                WardName: '',
                
            }))
        } else if (name === 'BuildingName') {
            setWardName((prev) => ({
                ...prev,
                [name]: value,
                // BlockName: '',
                // FloorName: '',
                WardName: '',
               
            }))
        } else if (name === 'BlockName') {
            setWardName((prev) => ({
                ...prev,
                [name]: value,
                // FloorName: '',
                WardName: '',
                
            }))
        } else if (name === 'FloorName') {
            setWardName((prev) => ({
                ...prev,
                [name]: value,
                WardName: '',
            
            }))
        } else {
            setWardName((prev) => ({
                ...prev,
                [name]: value.toUpperCase()
            }))
        }

    }

    const handleChangeIsAc = (e) => {
  const { name, checked } = e.target;
  setWardName(prev => ({
    ...prev,
    [name]: checked
  }));
};



    const WardColumns = [
        {
            key: "id",
            name: "Ward Id",
            frozen: true
        },
        {
            key: "Location_Name",
            name: "Location",
            frozen: true
        },
        // {
        //     key: "BuildingName",
        //     name: "Building Name",
        // },
        // {
        //     key: "BlockName",
        //     name: "Block Name",
        // },
        // {
        //     key: "FloorName",
        //     name: "Floor Name",
        // },
        {
            key: "WardName",
            name: "Ward Name",
        },

        // {
        //     key: "Storage Access",
        //     name: "Storage Access",
        //     renderCell: (params) => (
        //         <>
        //             <Button className="cell_btn"
        //                 onClick={() => ItemView(params.row)}
        //                 title='Add new Products'
        //             >
        //                 <ListIcon className="check_box_clrr_cancell" />
        //             </Button>
        //         </>
        //     )
        // },

        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleEditWardStatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleEditWard(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        },
        {
            key: "QR",
            name: "QR",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleQRWard(params.row)}
                    >
                        <MdQrCode2 style={{ color: 'black' }} className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ]

    const HandleEditWardStatus = (params) => {
        const data = {
            WardId: params.id,
            Statusedit: true
        }
        const confirmation = window.confirm('Are you sure you want to update the status? All the children RoomType and room and bed statuses will be changed.');
        if (confirmation) {
            axios.post(`${UrlLink}Masters/Ward_Master_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsBuildingGet(prev => !prev)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
    const HandleEditWard = (params) => {
        const { id, BuildingId, BlockId, FloorId, Location_Id, WardName,Type,Amount,DoctorCharges,NurseCharges,isAc,Acamt,NonACamt } = params
        setWardName({
            Location: Location_Id,
            // BuildingName: BuildingId,
            // BlockName: BlockId,
            // FloorName: FloorId,
            WardName: WardName,
            Type : Type,
            Amount : Amount,
            DoctorCharges : DoctorCharges,
            NurseCharges : NurseCharges,
            isAc : isAc,
            Acamt : Acamt,
            NonACamt : NonACamt,
            WardId: id,
        })

      
    }

    const HandleQRWard = (params) => {
        const summadata = {
            Qrname: 'Ward',
            IdentifyId: params.id,
            IdentifcationName: params.WardName,
        }
        navigate('/Home/QRgenerater')
        dispatchvalue({ type: 'QRdata', value: { ...summadata } })
    }

    const HandleSaveWard = () => {
        const exist = Object.keys(WardName)
            .filter(p => !['WardId', 'DoctorCharges', 'NurseCharges', 'isAc', 'Acamt', 'NonACamt'].includes(p))
            .filter(field => WardName[field] === '' || WardName[field] === null || WardName[field] === undefined);

        if (exist.length === 0) {
            const data = {
            ...WardName,
            created_by: userRecord?.username || ''
            };

            console.log(data, 'data::::::');

            axios.post(`${UrlLink}Masters/Ward_Master_Detials_link`, data)
            .then((res) => {
                const resres = res.data;
                let typp = Object.keys(resres)[0];
                let mess = Object.values(resres)[0];
                const tdata = {
                message: mess,
                type: typp,
                };

                dispatchvalue({ type: 'toast', value: tdata });
                setIsBuildingGet(prev => !prev);
                setWardName({
                Location: '',
                Type: '',
                WardName: '',
                WardId: '',
                Amount:0,
                DoctorCharges : 0,
                NurseCharges : 0,
                isAc : false,
                Acamt : 0,
                NonACamt : 0,

                });
            })
            .catch((err) => {
                console.log(err);
            });

        }
        else {
            const tdata = {
            message: `Please provide ${exist.join(' and ')}`,
            type: 'warn'
            };
            dispatchvalue({ type: 'toast', value: tdata });
        }
        };


    useEffect(() => {
        axios.get(`${UrlLink}Masters/Ward_Master_Detials_link`)
            .then((res) => {
                const ress = res.data
                setWardData(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [IsBuildingGet, UrlLink])




    //  Administartion---------------


    const [AdministartionName, setAdministartionName] = useState({
        Location: '',
        BuildingName: '',
        BlockName: '',
        FloorName: '',
        AdministartionName: '',
        AdministartionNameId: '',

    });
    const [IsAdministrationGet, setIsAdministrationGet] = useState(false);

    const [AdministartionNameData, setAdministartionNameData] = useState([])
    const [administration_Building_by__loc, setadministration_Building_by__loc] = useState([])
    const [administration_block_by_Building, setadministration_block_by_Building] = useState([])
    const [administration_Floor_by_Block, setadministration_Floor_by_Block] = useState([])

    useEffect(() => {
        if (AdministartionName.Location) {
            axios.get(`${UrlLink}Masters/get_building_Data_by_location?Location=${AdministartionName.Location}`)
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setadministration_Building_by__loc(res.data)
                    } else {
                        setadministration_Building_by__loc([])
                    }
                })
                .catch(err => {
                    setadministration_Building_by__loc([])
                    console.log(err);
                })
        }

    }, [AdministartionName.Location, UrlLink])


    useEffect(() => {
        if (AdministartionName.BuildingName) {
            const data = {
                Building: AdministartionName.BuildingName,
            }
            axios.get(`${UrlLink}Masters/get_block_Data_by_Building`, { params: data })
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setadministration_block_by_Building(res.data)
                    } else {
                        setadministration_block_by_Building([])
                    }
                })
                .catch(err => {
                    setadministration_block_by_Building([])
                    console.log(err);
                })
        }

    }, [AdministartionName.BuildingName, UrlLink])

    useEffect(() => {
        if (AdministartionName.BlockName) {
            const data = {
                Block: AdministartionName.BlockName,
            }
            axios.get(`${UrlLink}Masters/get_Floor_Data_by_Building_block_loc`, { params: data })
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setadministration_Floor_by_Block(res.data)
                    } else {
                        setadministration_Floor_by_Block([])
                    }

                })
                .catch(err => {
                    setadministration_Floor_by_Block([])
                    console.log(err);
                })
        }

    }, [AdministartionName.BlockName, UrlLink])


    const handlechangeAdministartion = (e) => {
        const { name, value } = e.target
        if (name === 'Location') {
            setAdministartionName((prev) => ({
                ...prev,
                [name]: value,
                BuildingName: '',
                BlockName: '',
                FloorName: '',
                AdministartionName: '',

            }))
        } else if (name === 'BuildingName') {
            setAdministartionName((prev) => ({
                ...prev,
                [name]: value,
                BlockName: '',
                FloorName: '',
                AdministartionName: '',

            }))
        } else if (name === 'BlockName') {
            setAdministartionName((prev) => ({
                ...prev,
                [name]: value,
                FloorName: '',
                AdministartionName: '',

            }))
        }
        else if (name == 'FloorName') {
            setAdministartionName((prev) => ({
                ...prev,
                [name]: value,
                AdministartionName: '',

            }))

        }
        else {
            setAdministartionName((prev) => ({
                ...prev,
                [name]: value.toUpperCase()
            }))
        }

    }


    const AdministrationColumns = [
        {
            key: "id",
            name: "Administration Id",
            frozen: true
        },
        {
            key: "Location_Name",
            name: "Location",
            frozen: true
        },
        {
            key: "BuildingName",
            name: "Building Name",
        },
        {
            key: "BlockName",
            name: "Block Name",
        },
        {
            key: "FloorName",
            name: "Floor Name",
        },
        {
            key: "AdministrationName",
            name: "Administartion Name",
        },

        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleEditAdministrationStatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleEditAdministration(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        },

    ]
    const HandleSaveAdministartionName = () => {
        if (AdministartionName.AdministartionName && AdministartionName.Location) {
            const data = {
                ...AdministartionName,
                created_by: userRecord?.username || ''
            }
            console.log("submitdata", data);
            axios.post(`${UrlLink}Masters/Administration_Details_link`, data)
                .then((res) => {
                    const resres = res.data
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }
                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsAdministrationGet(prev => !prev);
                    setAdministartionName({
                        Location: '',
                        BuildingName: '',
                        BlockName: '',
                        FloorName: '',
                        AdministartionName: '',
                        AdministartionNameId: ''
                    })
                })
                .catch((err) => {
                    console.log(err);
                })

        }
        else {
            const tdata = {
                message: `Please Provide both Administration Name and Location.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }

    const HandleEditAdministration = (params) => {
        console.log("params", params);

        const { id, AdministrationName, BlockId, BuildingId, FloorId, Location_Id } = params
        setAdministartionName({
            AdministartionNameId: id,
            AdministartionName: AdministrationName,
            BlockName: BlockId,
            BuildingName: BuildingId,
            FloorName: FloorId,
            Location: Location_Id,

        })

    }
    const HandleEditAdministrationStatus = (params) => {
        const data = {
            AdministartionNameId: params.id,
            Statusedit: true
        }
        const confirmation = window.confirm('Are you sure you want to update the status? All the children Block, Floor, Store, RoomType, room and bed statuses will be changed.');
        if (confirmation) {
            axios.post(`${UrlLink}Masters/Administration_Details_link`, data)
                .then((res) => {
                    const resres = res.data
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsAdministrationGet(prev => !prev)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }


    useEffect(() => {
        axios.get(`${UrlLink}Masters/Administration_Details_link`)
            .then((res) => {
                const ress = res.data
                setAdministartionNameData(ress);
            })
            .catch((err) => {
                console.log(err);
            })

    }, [IsAdministrationGet, UrlLink])


        //  Consultation room---------------


        const [ConsultationName, setConsultationName] = useState({
            Location: '',
            BuildingName: '',
            BlockName: '',
            FloorName: '',
            Specialization : '',
            OPNo : '',
            ConsultationroomName: '',
            ConsultationId: '',
    
        });
        const [IsConsultationGet, setIsConsultationGet] = useState(false);
    
        const [ConsultationNameData, setConsultationNameData] = useState([])
        const [Consultation_Building_by__loc, setConsultation_Building_by__loc] = useState([])
        const [Consultation_block_by_Building, setConsultation_block_by_Building] = useState([])
        const [Consultation_Floor_by_Block, setConsultation_Floor_by_Block] = useState([])
    
        useEffect(() => {
            if (ConsultationName.Location) {
                axios.get(`${UrlLink}Masters/get_building_Data_by_location?Location=${ConsultationName.Location}`)
                    .then(res => {
                        if (Array.isArray(res.data)) {
                            setConsultation_Building_by__loc(res.data)
                        } else {
                            setConsultation_Building_by__loc([])
                        }
                    })
                    .catch(err => {
                        setConsultation_Building_by__loc([])
                        console.log(err);
                    })
            }
    
        }, [ConsultationName.Location, UrlLink])
    
    
        useEffect(() => {
            if (ConsultationName.BuildingName) {
                const data = {
                    Building: ConsultationName.BuildingName,
                }
                axios.get(`${UrlLink}Masters/get_block_Data_by_Building`, { params: data })
                    .then(res => {
                        if (Array.isArray(res.data)) {
                            setConsultation_block_by_Building(res.data)
                        } else {
                            setConsultation_block_by_Building([])
                        }
                    })
                    .catch(err => {
                        setConsultation_block_by_Building([])
                        console.log(err);
                    })
            }
    
        }, [ConsultationName.BuildingName, UrlLink])
    
        useEffect(() => {
            if (ConsultationName.BlockName) {
                const data = {
                    Block: ConsultationName.BlockName,
                }
                axios.get(`${UrlLink}Masters/get_Floor_Data_by_Building_block_loc`, { params: data })
                    .then(res => {
                        if (Array.isArray(res.data)) {
                            setConsultation_Floor_by_Block(res.data)
                        } else {
                            setConsultation_Floor_by_Block([])
                        }
    
                    })
                    .catch(err => {
                        setConsultation_Floor_by_Block([])
                        console.log(err);
                    })
            }
    
        }, [ConsultationName.BlockName, UrlLink])
    
    
        const handlechangeConsultationName = (e) => {
            const { name, value } = e.target
            if (name === 'Location') {
                setConsultationName((prev) => ({
                    ...prev,
                    [name]: value,
                    BuildingName: '',
                    BlockName: '',
                    FloorName: '',
                    Specialization:'',
                    OPNo:'',
                    ConsultationroomName: '',
    
                }))
            } else if (name === 'BuildingName') {
                setConsultationName((prev) => ({
                    ...prev,
                    [name]: value,
                    BlockName: '',
                    FloorName: '',
                    Specialization:'',
                    OPNo:'',
                    ConsultationroomName: '',
    
                }))
            } else if (name === 'BlockName') {
                setConsultationName((prev) => ({
                    ...prev,
                    [name]: value,
                    FloorName: '',
                    Specialization:'',
                    OPNo:'',
                    ConsultationroomName: '',
    
                }))
            }
            else if (name == 'FloorName') {
                setConsultationName((prev) => ({
                    ...prev,
                    [name]: value,
                    Specialization:'',
                    OPNo:'',
                    ConsultationroomName: '',
    
                }))
    
            }
            else if (name == 'Specialization') {
                setConsultationName((prev) => ({
                    ...prev,
                    [name]: value,
                    // OPNo:'',
                    // ConsultationroomName: '',
    
                }))
    
            }
            else {
                setConsultationName((prev) => ({
                    ...prev,
                    [name]: value.toUpperCase()
                }))
            }
    
        }
    
    
        const ConsultaionroomColumns = [
            {
                key: "id",
                name: "Room Id",
                frozen: true
            },
            {
                key: "Location_Name",
                name: "Location",
                frozen: true
            },
            {
                key: "BuildingName",
                name: "Building Name",
            },
            {
                key: "BlockName",
                name: "Block Name",
            },
            {
                key: "FloorName",
                name: "Floor Name",
            },
            {
                key: "SpecialityName",
                name: "Speciality",
            },
            {
                key: "OPNo",
                name: "OPNo",
            },

            {
                key: "ConsultationroomName",
                name: "Room Name",
            },
    
            {
                key: "Status",
                name: "Status",
                renderCell: (params) => (
                    <>
                        <Button
                            className="cell_btn"
                            onClick={() => HandleEditConsultationNameStatus(params.row)}
                        >
                            {params.row.Status}
                        </Button>
                    </>
                ),
            },
            {
                key: "Action",
                name: "Action",
                renderCell: (params) => (
                    <>
                        <Button
                            className="cell_btn"
                            onClick={() => HandleEditConsultationName(params.row)}
                        >
                            <EditIcon className="check_box_clrr_cancell" />
                        </Button>
                    </>
                ),
            },
    
        ]
        const HandleSaveConsultationName = () => {
            if (ConsultationName.ConsultationroomName && ConsultationName.Location) {
                const data = {
                    ...ConsultationName,
                    created_by: userRecord?.username || ''
                }
                console.log("submitdata", data);
                axios.post(`${UrlLink}Masters/Consultation_Room_Details_link`, data)
                    .then((res) => {
                        const resres = res.data
                        let typp = Object.keys(resres)[0]
                        let mess = Object.values(resres)[0]
                        const tdata = {
                            message: mess,
                            type: typp,
                        }
                        dispatchvalue({ type: 'toast', value: tdata });
                        setIsConsultationGet(prev => !prev);
                        setConsultationName({
                            Location: '',
                            BuildingName: '',
                            BlockName: '',
                            FloorName: '',
                            Specialization : '',
                            OPNo : '',
                            ConsultationroomName: '',
                            ConsultationId: ''
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                    })
    
            }
            else {
                const tdata = {
                    message: `Please Provide both Consultation Name and Location.`,
                    type: 'warn'
                }
                dispatchvalue({ type: 'toast', value: tdata });
            }
        }
    
        const HandleEditConsultationName = (params) => {
            console.log("params", params);
    
            const { id, ConsultationroomName, BlockId, BuildingId, FloorId, Location_Id,SpecialityId,OPNo } = params
            setConsultationName({
                ConsultationId: id,
                Location: Location_Id,
                BuildingName: BuildingId,
                BlockName: BlockId,
                FloorName: FloorId,
                Specialization : SpecialityId,
                OPNo : OPNo,
                ConsultationroomName : ConsultationroomName,

            })
    
        }
        const HandleEditConsultationNameStatus = (params) => {
            const data = {
                ConsultationId: params.id,
                Statusedit: true
            }
            const confirmation = window.confirm('Are you sure you want to update the status? All the children Block, Floor, Store, RoomType, room and bed statuses will be changed.');
            if (confirmation) {
                axios.post(`${UrlLink}Masters/Consultation_Room_Details_link`, data)
                    .then((res) => {
                        const resres = res.data
                        let typp = Object.keys(resres)[0]
                        let mess = Object.values(resres)[0]
                        const tdata = {
                            message: mess,
                            type: typp,
                        }
    
                        dispatchvalue({ type: 'toast', value: tdata });
                        setIsConsultationGet(prev => !prev)
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        }
    
    
        useEffect(() => {
            axios.get(`${UrlLink}Masters/Consultation_Room_Details_link`)
                .then((res) => {
                    const ress = res.data
                    setConsultationNameData(ress);
                })
                .catch((err) => {
                    console.log(err);
                })
    
        }, [IsConsultationGet, UrlLink])
    





























    return (
        <>
            <div className="Main_container_app">
                <h3>Locations Masters</h3>

                <div className="RegisterTypecon">
                    <div className="RegisterType">
                        {["Locations", "Building", "Block", "Floor", 'Ward', 'Administration','Consultation Room Master'].map((p, ind) => (
                            <div className="registertypeval" key={ind}>
                                <input
                                    type="radio"
                                    id={p}
                                    name="appointment_type"
                                    checked={LocationPage === p}
                                    onChange={(e) => {
                                        setLocationPage(e.target.value)
                                    }}
                                    value={p}
                                />
                                <label htmlFor={p}>
                                    {p}
                                </label>
                            </div>
                        ))}
                    </div>

                </div>

                <br />

                {/*---------------Location-----------------------------*/}
                {LocationPage === 'Locations' && <>
                    <div className="common_center_tag">
                        <span>Location Name</span>
                    </div>
                    <br />
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> Location Name <span>:</span> </label>
                            <input
                                type="text"
                                placeholder='Enter Location Name'
                                name='locationName'
                                required
                                value={LocationName.locationName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label> Bed Count <span>:</span> </label>
                            <input
                                type="number"
                                placeholder='Enter Bed Count'
                                name='bedCount'
                                required
                                value={LocationName.bedCount}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <br />
                    <div className="Main_container_Btn">
                        <button onClick={handleLocationsubmit}>
                            {LocationName.locationId ? 'Update' : 'Save'}
                        </button>
                    </div>
                    <br />
                    {Locations.length > 0 &&
                        <ReactGrid columns={LocationsColumns} RowData={Locations} />}
                </>}

                {/* ------------Building------------ */}
                {LocationPage === 'Building' && <>

                    <div className="common_center_tag">
                        <span>Building Name</span>
                    </div>
                    <br />
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> Location <span>:</span> </label>

                            <select
                                name='Location'
                                required
                                disabled={BuildingName.BuildingId}
                                value={BuildingName.Location}
                                onChange={(e) => setBuildingName((prev) => ({ ...prev, Location: e.target.value, BuildingName: '' }))}
                            >
                                <option value=''>Select</option>
                                {
                                    LocationData.map((p, index) => (
                                        <option key={index} value={p.id}>{p.locationName}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="RegisForm_1">
                            <label> Building Name <span>:</span> </label>
                            <input
                                type="text"
                                name='BuildingName'
                                autoComplete='off'
                                required
                                value={BuildingName.BuildingName}
                                onChange={(e) => setBuildingName((prev) => ({ ...prev, BuildingName: e.target.value.toUpperCase() }))}
                            />
                        </div>

                    </div>
                    <br />
                    <div className="Main_container_Btn">
                        <button onClick={HandleSaveBuilding}>
                            {BuildingName.BuildingId ? "Update" : "Add"}
                        </button>
                    </div>
                    <br />


                    <ReactGrid columns={BuildingColumns} RowData={BuildingData} />

                </>}

                {/*-----------------------------Block Name-----------------------------------------------------------------------*/}

                {LocationPage === 'Block' && <>
                    <div className="common_center_tag">
                        <span>Block Name</span>
                    </div>
                    <br />
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> Location <span>:</span> </label>

                            <select
                                name='Location'
                                required
                                disabled={BlockName.BlockId}
                                value={BlockName.Location}
                                onChange={handlechangeBlock}
                            >
                                <option value=''>Select</option>
                                {
                                    LocationData.map((p, index) => (
                                        <option key={index} value={p.id}>{p.locationName}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="RegisForm_1">
                            <label> Building Name <span>:</span> </label>

                            <select
                                name='BuildingName'
                                required
                                disabled={BlockName.BlockId}
                                value={BlockName.BuildingName}
                                onChange={handlechangeBlock}
                            >
                                <option value=''>Select</option>
                                {
                                    Buildingby_loc.map((p, index) => (
                                        <option key={index} value={p.id}>{p.BuildingName}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="RegisForm_1">
                            <label> Block Name <span>:</span> </label>
                            <input
                                type="text"
                                name='BlockName'
                                autoComplete='off'
                                required
                                value={BlockName.BlockName}
                                onChange={handlechangeBlock}
                            />
                        </div>

                    </div>
                    <br />
                    <div className="Main_container_Btn">
                        <button onClick={HandleSaveBlock}>
                            {BlockName.BlockId ? "Update" : "Add"}
                        </button>
                    </div>
                    <br />
                    <ReactGrid columns={BlockColumns} RowData={BlockData} />

                </>}
                {/*-----------------------------Floor Name-----------------------------------------------------------------------*/}

                {LocationPage === 'Floor' && <>
                    <div className="common_center_tag">
                        <span>Floor Name</span>
                    </div>
                    <br />
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> Location <span>:</span> </label>

                            <select
                                name='Location'
                                required
                                disabled={FloorName.FloorId}
                                value={FloorName.Location}
                                onChange={handlechangeFloor}
                            >
                                <option value=''>Select</option>
                                {
                                    LocationData.map((p, index) => (
                                        <option key={index} value={p.id}>{p.locationName}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="RegisForm_1">
                            <label> Building Name <span>:</span> </label>

                            <select
                                name='BuildingName'
                                required
                                disabled={FloorName.FloorId}
                                value={FloorName.BuildingName}
                                onChange={handlechangeFloor}
                            >
                                <option value=''>Select</option>
                                {
                                    BLockby_Building_loc.map((p, index) => (
                                        <option key={index} value={p.id}>{p.BuildingName}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="RegisForm_1">
                            <label> Block Name <span>:</span> </label>

                            <select
                                name='BlockName'
                                required
                                disabled={FloorName.FloorId}
                                value={FloorName.BlockName}
                                onChange={handlechangeFloor}
                            >
                                <option value=''>Select</option>
                                {
                                    BLockby_Building.map((p, index) => (
                                        <option key={index} value={p.id}>{p.BlockName}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="RegisForm_1">
                            <label> Floor Name <span>:</span> </label>
                            <input
                                type="text"
                                name='FloorName'
                                autoComplete='off'
                                required
                                value={FloorName.FloorName}
                                onChange={handlechangeFloor}
                            />
                        </div>

                    </div>
                    <br />
                    <div className="Main_container_Btn">
                        <button onClick={HandleSaveFloor}>
                            {FloorName.FloorId ? "Update" : "Add"}
                        </button>
                    </div>
                    <br />
                    <ReactGrid columns={FloorColumns} RowData={FloorData} />
                </>}

                {/*-----------------------------Ward Name-----------------------------------------------------------------------*/}

                {LocationPage === 'Ward' &&
                    <>
                        <div className="common_center_tag">
                            <span>Ward Name</span>
                        </div>
                        <br />
                       <div className="RegisFormcon_1">
                        {Object.keys(WardName)
                            .filter(p => !['WardId', 'Acamt', 'NonACamt'].includes(p)) 
                            .map((field, indx) => (
                            <div className="RegisForm_1" key={indx}>
                                <label>{formatLabel(field)} <span>:</span></label>

                                {['Amount', 'DoctorCharges', 'NurseCharges'].includes(field) ? (
                                <input
                                    type="number"
                                    name={field}
                                    autoComplete="off"
                                    required
                                    value={WardName[field]}
                                    onChange={handlechangeWard}
                                />
                                ) : field === 'WardName' ? (
                                <input
                                    type="text"
                                    name={field}
                                    required
                                    value={WardName[field]}
                                    onChange={handlechangeWard}
                                />
                                ) : field === 'isAc' ? (
                                <input
                                    type="checkbox"
                                    name={field}
                                    checked={WardName[field]}
                                    onChange={handleChangeIsAc}
                                />
                                ) : field === 'Type' ? (
                                <select
                                    name={field}
                                    required
                                    value={WardName.Type}
                                    onChange={handlechangeWard}
                                >
                                    <option value="">Select</option>
                                    <option value="WARD">WARD</option>
                                    <option value="ROOM">ROOM</option>
                                </select>
                                ) : (
                                <select
                                    name={field}
                                    required
                                    disabled={WardName.WardId}
                                    value={WardName[field]}
                                    onChange={handlechangeWard}
                                >
                                    <option value="">Select</option>

                                    {field === 'BuildingName' &&
                                    ward_Building_by__loc.map((p, index) => (
                                        <option key={index} value={p.id}>{p.BuildingName}</option>
                                    ))}

                                    {field === 'BlockName' &&
                                    ward_block_by_Building.map((p, index) => (
                                        <option key={index} value={p.id}>{p.BlockName}</option>
                                    ))}

                                    {field === 'FloorName' &&
                                    ward_Floor_by_Block.map((p, index) => (
                                        <option key={index} value={p.id}>{p.FloorName}</option>
                                    ))}

                                    {field === 'Location' &&
                                    LocationData.map((p, index) => (
                                        <option key={index} value={p.id}>{p.locationName}</option>
                                    ))}
                                </select>
                                )}
                            </div>
                            ))}

                        {WardName.isAc && (
                            <>
                            <div className="RegisForm_1">
                                <label>AC Amount <span>:</span></label>
                                <input
                                type="text"
                                name="Acamt"
                                autoComplete="off"
                                required
                                value={WardName.Acamt || ''}
                                onChange={handlechangeWard}
                                />
                            </div>

                            <div className="RegisForm_1">
                                <label>Non AC Amount <span>:</span></label>
                                <input
                                type="text"
                                name="NonACamt"
                                autoComplete="off"
                                required
                                value={WardName.NonACamt || ''}
                                onChange={handlechangeWard}
                                />
                            </div>
                            </>
                        )}
                        </div>




                        <br />

                        <div className="Main_container_Btn">
                            <button onClick={HandleSaveWard}>
                                {WardName.WardId ? "Update" : "Add"}
                            </button>
                        </div>
                        <br />


                        <ReactGrid columns={WardColumns} RowData={WardData} />
                    </>
                }


                {/* -----------------------Administration Name------- */}

                {LocationPage === 'Administration' && (
                    <>
                        {/* Header */}
                        <div className="common_center_tag">
                            <span>Administration Name</span>
                        </div>
                        <br />

                        {/* Form Container */}
                        <div className="RegisFormcon_1">
                            {Object.keys(AdministartionName)
                                .filter(field => field !== 'AdministartionNameId')
                                .map((field, index) => (

                                    <div className="RegisForm_1" key={index}>
                                        {console.log("ppop", field)}
                                        <label>
                                            {formatLabel(field)} <span>:</span>
                                        </label>
                                        {field === 'AdministartionName' ? (
                                            <input
                                                type="text"
                                                name={field}
                                                autoComplete="off"
                                                required
                                                value={AdministartionName[field]}
                                                onChange={handlechangeAdministartion}
                                            />
                                        ) : (
                                            <select
                                                name={field}
                                                required
                                                disabled={AdministartionName.AdministartionNameId}
                                                value={AdministartionName[field]}
                                                onChange={handlechangeAdministartion}
                                            >
                                                <option value="">Select</option>
                                                {field === 'BuildingName' &&
                                                    administration_Building_by__loc.map((building, index) => (
                                                        <option key={index} value={building.id}>
                                                            {building.BuildingName}
                                                        </option>
                                                    ))}
                                                {field === 'BlockName' &&
                                                    administration_block_by_Building.map((block, index) => (
                                                        <option key={index} value={block.id}>
                                                            {block.BlockName}
                                                        </option>
                                                    ))}
                                                {field === 'FloorName' &&
                                                    administration_Floor_by_Block.map((floor, index) => (
                                                        <option key={index} value={floor.id}>
                                                            {floor.FloorName}
                                                        </option>
                                                    ))}
                                                {field === 'Location' &&
                                                    LocationData.map((location, index) => (
                                                        <option key={index} value={location.id}>
                                                            {location.locationName}
                                                        </option>
                                                    ))}
                                            </select>
                                        )}
                                    </div>
                                ))}
                        </div>
                        <br />

                        {/* Button Container */}
                        <div className="Main_container_Btn">
                            <button onClick={HandleSaveAdministartionName}>
                                {AdministartionName.AdministartionNameId ? 'Update' : 'Add'}
                            </button>
                        </div>
                        <br />

                        {/* Data Grid */}
                        <ReactGrid columns={AdministrationColumns} RowData={AdministartionNameData} />
                    </>
                )}

                {/*-----------------------------consultation room-----------------*/}
                
                {LocationPage === 'Consultation Room Master' && (
                    <>
                        {/* Header */}
                        <div className="common_center_tag">
                            <span>Consultation Room Name</span>
                        </div>
                        <br />

                        {/* Form Container */}
                        <div className="RegisFormcon_1">
                            {Object.keys(ConsultationName)
                                .filter(field => field !== 'ConsultationId')
                                .map((field, index) => (

                                    <div className="RegisForm_1" key={index}>
                                        {console.log("ppop", field)}
                                        <label>
                                            {formatLabel(field)} <span>:</span>
                                        </label>
                                        {field === 'ConsultationroomName' || field === 'OPNo' ? (
                                            <input
                                                type="text"
                                                name={field}
                                                autoComplete="off"
                                                required
                                                value={ConsultationName[field]}
                                                onChange={handlechangeConsultationName}
                                            />
                                        )   
                                        : (
                                            <select
                                                name={field}
                                                required
                                                // disabled={ConsultationName.ConsultationId}
                                                value={ConsultationName[field]}
                                                onChange={handlechangeConsultationName}
                                            >
                                                <option value="">Select</option>
                                                {field === 'BuildingName' &&
                                                    Consultation_Building_by__loc.map((building, index) => (
                                                        <option key={index} value={building.id}>
                                                            {building.BuildingName}
                                                        </option>
                                                    ))}
                                                {field === 'BlockName' &&
                                                    Consultation_block_by_Building.map((block, index) => (
                                                        <option key={index} value={block.id}>
                                                            {block.BlockName}
                                                        </option>
                                                    ))}
                                                {field === 'FloorName' &&
                                                    Consultation_Floor_by_Block.map((floor, index) => (
                                                        <option key={index} value={floor.id}>
                                                            {floor.FloorName}
                                                        </option>
                                                    ))}
                                                {field === 'Location' &&
                                                    LocationData.map((location, index) => (
                                                        <option key={index} value={location.id}>
                                                            {location.locationName}
                                                        </option>
                                                    ))}

                                                {field === 'Specialization' &&
                                                    Specialitydata.map((speciality, index) => (
                                                        <option key={index} value={speciality.Speciality_Id}>
                                                            {speciality.SpecialityName}
                                                        </option>
                                                    ))}

                                                    
                                            </select>
                                        )}
                                    </div>
                                ))}
                        </div>
                        <br />

                        {/* Button Container */}
                        <div className="Main_container_Btn">
                            <button onClick={HandleSaveConsultationName}>
                                {ConsultationName.ConsultationId ? 'Update' : 'Add'}
                            </button>
                        </div>
                        <br />

                        {/* Data Grid */}
                        <ReactGrid columns={ConsultaionroomColumns} RowData={ConsultationNameData} />
                    </>
                )}




            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
{/* 
            {selectRoom && ViewSelectoption.length !== 0 && (
                <div className="loader" onClick={() => setselectRoom(false)}>
                    <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
                        <br />

                        <div className="common_center_tag">
                            <span>Inventory Access</span>
                        </div>
                        <br />
                        <div className='displayuseraccess'>
                            {
                                ViewSelectoption.map((keys, indx) => (

                                    <div style={{ marginLeft: '20px' }} key={indx}>
                                        <label
                                            htmlFor={`${indx}_${keys}`}
                                            className='par_acc_lab'
                                        >
                                            {`${indx + 1}. ${keys}`}
                                        </label>
                                    </div>

                                ))
                            }
                        </div>



                    </div>
                </div>
            )} */}

        </>
    )
}

export default LocationMaster;
