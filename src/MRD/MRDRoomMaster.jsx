import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { DeleteIcon } from 'lucide-react';
import { TrashIcon } from 'lucide-react';


const MRDRoomMaster = () => {
    const dispatchvalue = useDispatch();
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const [LocationData, setLocationData] = useState([]);
    const [IsBuildingGet, setIsBuildingGet] = useState(false)

    const navigate = useNavigate()

    const [MasterOptions, setMasterOptions] = useState('Room')

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





    // room name ------------

    const [RoomName, setRoomName] = useState({

        Location: '',
        BuildingName: '',
        BlockName: '',
        FloorName: '',
        WardName: '',
        // RoomCharge: 0,
        Roomno : '',
        // DoctorCharges: 0,
        // NurseCharges: 0,
        // isAc: false,
        // Acamt : 0,
        // NonACamt : 0,
        // GST: 'Nill',
        RoomId: '',
    })
    const [RoomData, setRoomData] = useState([])
    const [filteredRoomData, setFilteredRoomData] = useState([]);
    
    const [Room_Building_by__loc, setRoom_Building_by__loc] = useState([])
    const [Room_block_by_Building, setRoom_block_by_Building] = useState([])
    const [Room_Floor_by_Block, setRoom_Floor_by_Block] = useState([])
    const [Room_ward_by_FLoor, setRoom_ward_by_FLoor] = useState([])

    console.log(Room_Building_by__loc,'Room_Building_by__loc');
    console.log(Room_block_by_Building,'Room_block_by_Building')
    console.log(Room_Floor_by_Block,'Room_Floor_by_Block');
    console.log(Room_ward_by_FLoor,'Room_ward_by_FLoor');

    const [SearchQueryfilter, setSearchQueryfilter] = useState({
          searchfloor: '',
          searchward:  '',
          searchrooom:  '', 
        });

    const [FloorList,setFloorList] = useState([]);
    const [WardList,setWardList] = useState([]);
    const [RoomList,setRoomList] = useState([]);
    
       const handleSearchChangefilter = (e) => {
        const { name, value } = e.target;
        setSearchQueryfilter((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

    useEffect(() => {
        const { searchfloor, searchward,searchrooom } = SearchQueryfilter;
    
        const filteredData = RoomData.filter((item) => {
          const matchesfloor = searchfloor
            ? item.FloorName.toLowerCase().includes(searchfloor.toLowerCase())
            : true;
          const matchesward = searchward
            ? item.WardName.toLowerCase().includes(searchward.toLowerCase())
            : true;
          const matchesroom = searchrooom
            ? item.Roomno.toLowerCase().includes(searchrooom.toLowerCase())
            : true;
    
          return matchesward && matchesfloor && matchesroom;
        });
    
        setFilteredRoomData(filteredData);
      }, [SearchQueryfilter,RoomData]);

    useEffect(() => {
        if (RoomName.Location) {
            axios.get(`${UrlLink}Masters/get_building_Data_by_location?Location=${RoomName.Location}`)
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setRoom_Building_by__loc(res.data)
                    } else {
                        setRoom_Building_by__loc([])
                    }

                })
                .catch(err => {
                    setRoom_Building_by__loc([])
                    console.log(err);
                })
        }

    }, [RoomName.Location, UrlLink])

    useEffect(() => {
        if (RoomName.BuildingName) {
            const data = {
                Building: RoomName.BuildingName,
            }
            axios.get(`${UrlLink}Masters/get_block_Data_by_Building`, { params: data })
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setRoom_block_by_Building(res.data)
                    } else {
                        setRoom_block_by_Building([])
                    }
                })
                .catch(err => {
                    setRoom_block_by_Building([])
                    console.log(err);
                })
        }

    }, [RoomName.BuildingName, UrlLink])

    useEffect(() => {
        if (RoomName.BlockName) {
            const data = {
                Block: RoomName.BlockName,
            }
            axios.get(`${UrlLink}Masters/get_Floor_Data_by_Building_block_loc`, { params: data })
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setRoom_Floor_by_Block(res.data)
                    } else {
                        setRoom_Floor_by_Block([])
                    }

                })
                .catch(err => {
                    setRoom_Floor_by_Block([])
                    console.log(err);
                })
        }

    }, [RoomName.BlockName, UrlLink])

useEffect(() => {
    axios.get(`${UrlLink}Masters/Ward_Master_Detials_link`)
        .then(res => {
            if (Array.isArray(res.data)) {
                setRoom_ward_by_FLoor(res.data)
            } else {
                setRoom_ward_by_FLoor([])
            }
        })
        .catch(err => {
            setRoom_ward_by_FLoor([])
            console.log(err);
        })
}  
, [ UrlLink])



    const handlechangeRoom = (e) => {
        const { name, value } = e.target
        if (name === 'Location') {
            setRoomName((prev) => ({
                ...prev,
                [name]: value,
                BuildingName: '',
                BlockName: '',
                FloorName: '',
                WardName: '',
               
                // GST: 'Nill',
            }))
        } else if (name === 'BuildingName') {
            setRoomName((prev) => ({
                ...prev,
                [name]: value,
                BlockName: '',
                FloorName: '',
                WardName: '',
                
                // GST: 'Nill',
            }))
        } else if (name === 'BlockName') {
            setRoomName((prev) => ({
                ...prev,
                [name]: value,
                FloorName: '',
                WardName: '',
                
                // GST: 'Nill',
            }))
        } else if (name === 'FloorName') {
            setRoomName((prev) => ({
                ...prev,
                [name]: value,
                WardName: '',
               
                // GST: 'Nill',
            }))
        } else if (name === 'WardName') {
            setRoomName((prev) => ({
                ...prev,
                [name]: value,
               
                // GST: 'Nill',
            }))
        } else if (name === 'RoomCharge') {
            if (+value < 5000) {
                setRoomName((prev) => ({
                    ...prev,
                    [name]: value.toUpperCase(),
                    // GST: 'Nill'
                }))

            } else {
                setRoomName((prev) => ({
                    ...prev,
                    [name]: value.toUpperCase(),
                    // GST: ''
                }))

            }
        } else if (name === 'Roomno') {

            setRoomName((prev) => ({
                ...prev,
                Roomno : value
            }))
        }
        
        else {
            setRoomName((prev) => ({
                ...prev,
                [name]: value.toUpperCase()
            }))
        }

    }

    const handleCheckboxChange = (e) => {

        console.log(e.target.checked)
        setRoomName((prevState) => ({
            ...prevState,
            isAc: e.target.checked
        }));
    };

    const RoomColumns = [
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
            key: "WardName",
            name: "Ward Name",
        },
        {
            key: "Roomno",
            name: "Room No",
        },
        // {
        //     key: "isAc",
        //     name: "AC",
        //     width: 120,
        // },
       
        // {
        //     key: "RoomCharge",
        //     name: "Room Charge",
        //     children: [
        //         {
        //             key: "Prev_Charge",
        //             name: "Previous Charge",
        //             width: 120
        //         },
        //         {
        //             key: "Current_Charge",
        //             name: "Current Charge",
        //             width: 120
        //         },
        //     ]
        // },

        // {
        //     key: "GST_val",
        //     name: "GST",
        // },
        // {
        //     key: "TotalRoomCharge",
        //     name: "Total Room Charge",
        //     children: [
        //         {
        //             key: "Total_Prev_Charge",
        //             name: "Previous Charge",
        //             width: 120
        //         },
        //         {
        //             key: "Total_Current_Charge",
        //             name: "Current Charge",
        //             width: 120
        //         },
        //     ]
        // },
        {
            key: "Status",
            name: "Status",
            frozen: true,
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleEditRoomStatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        // {
        //     key: "Doctor_Charge",
        //     name: "Doctor Charges",
        // },
        // {
        //     key: "Nurse_Charge",
        //     name: "Nurse Charges",
        // },
        {
            key: "Action",
            name: "Edit",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleEditRoom(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        },
         {
            key: "Action",
            name: "Delete",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleDeleteRoom(params.row)}
                    >
                        <TrashIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        },
        // {
        //     key: "RatecardAction",
        //     name: "Rate Card View",
        //     renderCell: (params) => (
        //         <>
        //                     <Button
        //                         className="cell_btn"
        //                         onClick={() => HandleRateCardView(params.row)}
        //                     >
        //                         <Visibility className="check_box_clrr_cancell" />
        //                     </Button>
        //         </>
        //     ),
        // },
    ]

    const HandleRateCardView = (params) => {

        const { id } = params
        dispatchvalue({ type: 'DoctorListId', value: { RoomId: id } })

        navigate("/Home/MasterFolder");
        dispatchvalue({ type: 'HrFolder', value:'RoomRateCardList'});
        dispatchvalue({ type: "setPreviousFolder", value: null }); 
        dispatchvalue({ type: "showMenu", value: true });

    }

    const HandleEditRoomStatus = (params) => {
        const data = {
            RoomId: params.id,
            Statusedit: true
        }
        const confirmation = window.confirm('Are you sure you want to update the status? All the children room and bed statuses will be changed.');
        if (confirmation) {
            axios.post(`${UrlLink}Masters/MRD_Room_Master_Detials_link`, data)
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
    const HandleEditRoom = (params) => {
        const { id, BuildingId, BlockId, FloorId, Location_Id, WardId, Current_Charge, GST_val,Roomno,ACstatus,Doctor_Charge,Nurse_Charge,Acamt,NonACamt } = params
        setRoomName({
            Location: Location_Id,
            BuildingName: BuildingId,
            BlockName: BlockId,
            FloorName: FloorId,
            WardName: WardId, 
            // GST: GST_val,
            RoomId: id,
            Roomno : Roomno,
           

        })
    }
const HandleDeleteRoom = async (params) => {
    try {
        const res = await axios.post(`${UrlLink}Masters/HandleRoomDelete`, {
            id: params.Roomno
        });
        alert("Room deleted successfully");
        FetchRoom();
        console.log(res.data);
    } catch (error) {
        alert("Failed to delete room");
        console.error(error);
    }
};


    const HandleSaveRoom = () => {
        const exist = Object.keys(RoomName)
            .filter(p => 
                !['RoomId'].includes(p)
            )
            .filter(field => !RoomName[field]);
    
        // if (exist.length === 0 && RoomName.Roomno !== '') {

        if (exist.length === 0) {
            const data = {
                ...RoomName,
                created_by: userRecord?.username || ''
            };
    
            console.log(data, 'data');
    
            axios.post(`${UrlLink}Masters/MRD_Room_Master_Detials_link`, data)
                .then((res) => {
                    // const { type, message } = res.data;

                    // console.log( res[0],'ressss')
                    // console.log( res[1],'ressss')

                    // console.log(res.data,'ressss')
                    let resdata = res.data
                    let type = Object.keys(resdata)[0]
                    let message = Object.values(resdata)[0]

                    const tdata = {
                        message,
                        type,
                    };

                    console.log(tdata,'tdata')
    
                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsBuildingGet(prev => !prev);
                    setRoomName({
                        Location: '',
                        BuildingName: '',
                        BlockName: '',
                        FloorName: '',
                        WardName: '',
                       
                        RoomId: '',
                        Roomno: '', // Added to reset Roomno
                    });
                })
                .catch((err) => {
                    console.error('Error saving room:', err);
                    const tdata = {
                        message: 'Failed to save room details',
                        type: 'error',
                    };
                    dispatchvalue({ type: 'toast', value: tdata });
                });
        } else {
            const tdata = {
                message: `Please provide ${exist.join(' and ')} ${exist.length > 0 && RoomName.Roomno === '' ? 'and Room Number' : ''}`,
                type: 'warn',
            };
            dispatchvalue({ type: 'toast', value: tdata });
        }
    };

    
    const FetchRoom = ()=>{
axios.get(`${UrlLink}MCI/MRD_Room_Master_Detials_link`)
            .then((res) => {
                const ress = res.data
                console.log('111111', ress);

        if (Array.isArray(ress)) {
          const FloorList = [...new Set(ress.map((item) => item.FloorName))];
          const WardList = [...new Set(ress.map((item) => item.WardName))];
          const RoomList = [...new Set(ress.map((item) => item.Roomno))];
          setFloorList(FloorList);
          setWardList(WardList);
          setRoomList(RoomList);

          setRoomData(ress)
        } else {
          setFloorList([]);
          setWardList([]);
          setRoomList([]);
          
        }
                
            })
            .catch((err) => {
                console.log(err);
            })
        }  
        useEffect(() => {
            FetchRoom();
        
    }, [IsBuildingGet, UrlLink])




    // room master  ------------

    const [RoomMasterName, setRoomMasterName] = useState({

        Location: '',
        BuildingName: '',
        BlockName: '',
        FloorName: '',
        WardName: '',
        // BedCharge: '',
        // GST: '',
        // TotalCharge: '',
        RoomNo: '',
        Roomid: '',
        BedCount:'',
        BedNo: '',
        RoomMasterId: '',
    })
    const [RoomMasterData, setRoomMasterData] = useState([])
    const [RoomMaster_Building_by__loc, setRoomMaster_Building_by__loc] = useState([])
    const [RoomMaster_block_by_Building, setRoomMaster_block_by_Building] = useState([])
    const [RoomMaster_Floor_by_Block, setRoomMaster_Floor_by_Block] = useState([])
    const [RoomMaster_ward_by_FLoor, setRoomMaster_ward_by_FLoor] = useState([])
    const [RoomMaster_Room_by_Ward, setRoomMaster_Room_by_Ward] = useState([])
  
    const [filteredBedData, setFilteredBedData] = useState([]);

    const [SearchQueryBedfilter, setSearchQueryBedfilter] = useState({
          searchBedfloor: '',
          searchBedward:  '',
          searchBedrooom:  '', 
        });

    const [BedFloorList,setBedFloorList] = useState([]);
    const [BedWardList,setBedWardList] = useState([]);
    const [BedRoomList,setBedRoomList] = useState([]);
    
       const handleSearchChangeBedfilter = (e) => {
        const { name, value } = e.target;
        setSearchQueryBedfilter((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

    useEffect(() => {
        const { searchBedfloor, searchBedward,searchBedrooom } = SearchQueryBedfilter;
    
        const filteredData = RoomMasterData.filter((item) => {
          const matchesfloor = searchBedfloor
            ? item.FloorName.toLowerCase().includes(searchBedfloor.toLowerCase())
            : true;
          const matchesward = searchBedward
            ? item.WardName.toLowerCase().includes(searchBedward.toLowerCase())
            : true;
          const matchesroom = searchBedrooom
            ? item.RoomNo.toLowerCase().includes(searchBedrooom.toLowerCase())
            : true;
    
          return matchesward && matchesfloor && matchesroom;
        });
    
        setFilteredBedData(filteredData);
      }, [SearchQueryBedfilter,RoomMasterData]);

    useEffect(() => {
        if (RoomMasterName.Location) {
            axios.get(`${UrlLink}Masters/get_building_Data_by_location?Location=${RoomMasterName.Location}`)
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setRoomMaster_Building_by__loc(res.data)
                    } else {
                        setRoomMaster_Building_by__loc([])
                    }
                })
                .catch(err => {
                    setRoomMaster_Building_by__loc([])
                    console.log(err);
                })
        }

    }, [RoomMasterName.Location, UrlLink])

    useEffect(() => {
        if (RoomMasterName.BuildingName) {
            const data = {
                Building: RoomMasterName.BuildingName,
            }
            axios.get(`${UrlLink}Masters/get_block_Data_by_Building`, { params: data })
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setRoomMaster_block_by_Building(res.data)
                    } else {
                        setRoomMaster_block_by_Building([])
                    }
                })
                .catch(err => {
                    setRoomMaster_block_by_Building([])
                    console.log(err);
                })
        }

    }, [RoomMasterName.BuildingName, UrlLink])

    useEffect(() => {
        if (RoomMasterName.BlockName) {
            const data = {
                Block: RoomMasterName.BlockName,
            }
            axios.get(`${UrlLink}Masters/get_Floor_Data_by_Building_block_loc`, { params: data })
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setRoomMaster_Floor_by_Block(res.data)
                    } else {
                        setRoomMaster_Floor_by_Block([])
                    }

                })
                .catch(err => {
                    setRoomMaster_Floor_by_Block([])
                    console.log(err);
                })
        }

    }, [RoomMasterName.BlockName, UrlLink])

    useEffect(() => {
       
            axios.get(`${UrlLink}Masters/Ward_Master_Detials_link`)
                .then(res => {

                    if (Array.isArray(res.data)) {
                        setRoomMaster_ward_by_FLoor(res.data)
                    } else {
                        setRoomMaster_ward_by_FLoor([])
                    }
                })
                .catch(err => {
                    setRoomMaster_ward_by_FLoor([])
                    console.log(err);
                })
        

    }, [RoomMasterName.FloorName, UrlLink])

    useEffect(() => {
        if (RoomMasterName.WardName) {
            const data = {
                Ward: RoomMasterName.WardName,
                Floor : RoomMasterName.FloorName,
            }
            axios.get(`${UrlLink}Masters/get_RoomType_Data_by_Building_block_Floor_ward_loc`, { params: data })
                .then(res => {
                    if (Array.isArray(res.data)) {

                        console.log('111111111', res.data);
                        setRoomMaster_Room_by_Ward(res.data)
                    } else {
                        setRoomMaster_Room_by_Ward([])
                    }

                })
                .catch(err => {
                    setRoomMaster_Room_by_Ward([])
                    console.log(err);
                })
        }

    }, [RoomMasterName.WardName, UrlLink])

    useEffect(() => {
        if (RoomMaster_Room_by_Ward.length > 0 && RoomMasterName.WardName) {
            console.log(RoomMaster_Room_by_Ward, 'RoomMaster_Room_by_Ward');
            console.log(RoomMasterName.WardName, 'RoomMasterName.WardName');
            
            const datass = RoomMaster_Room_by_Ward.find(p => p.id1 === + RoomMasterName.WardName);
            console.log(datass, 'Matching RoomMaster_Room_by_Ward item');
        }
    }, [RoomMaster_Room_by_Ward, RoomMasterName.WardName]);

    const handlechangeRoomMaster = (e) => {
        const { name, value } = e.target
        if (name === 'Location') {
            setRoomMasterName((prev) => ({
                ...prev,
                [name]: value,
                BuildingName: '',
                BlockName: '',
                FloorName: '',
                WardName: '',
                // BedCharge: '',
                // GST: '',
                // TotalCharge: '',
                RoomNo: '',
                BedNo: '',
            }))
        } else if (name === 'BuildingName') {
            setRoomMasterName((prev) => ({
                ...prev,
                [name]: value,
                BlockName: '',
                FloorName: '',
                WardName: '',
                // BedCharge: '',
                // GST: '',
                // TotalCharge: '',
                RoomNo: '',
                BedNo: '',
            }))
        } else if (name === 'BlockName') {
            setRoomMasterName((prev) => ({
                ...prev,
                [name]: value,
                FloorName: '',
                WardName: '',
                // BedCharge: '',
                // GST: '',
                // TotalCharge: '',
                RoomNo: '',
                BedNo: '',
            }))
        } else if (name === 'FloorName') {
            setRoomMasterName((prev) => ({
                ...prev,
                [name]: value,
                WardName: '',
                // BedCharge: '',
                // GST: '',
                // TotalCharge: '',
                RoomNo: '',
                BedNo: '',
            }))
        }
        // else if (name === 'WardName') {
        //     setRoomMasterName((prev) => ({
        //         ...prev,
        //         [name]: value,
        //         BedCharge: '',
        //         GST: '',
        //         TotalCharge: '',
        //         RoomNo: '',
        //         BedNo: '',
        //     }))
        // } 
        else if (name === 'WardName') {
            // if (value) {
            //     axios.get(`${UrlLink}Masters/get_RoomType_Data_by_Building_block_Floor_ward_loc?Ward=${value}`)
            //         .then(res => {
            //             if (Array.isArray(res.data)) {

            //                 console.log('111111111', res.data);
            //                 setRoomMaster_Room_by_Ward(res.data)

            //                 const datass = res?.data.find(p => p.id1 === +value)
            //                 console.log(datass, 'value', value);
            //                 setRoomMasterName((prev) => ({
            //                     ...prev,
            //                     [name]: value,
            //                     // BedCharge: datass?.BedCharge,
            //                     // GST: datass?.GST,
            //                     // TotalCharge: datass?.TotalCharge,
            //                     RoomNo: datass?.RoomNo,
            //                     BedNo: '',
            //                 }))
            //             } else {
            //                 setRoomMaster_Room_by_Ward([])
            //                 setRoomMasterName((prev) => ({
            //                     ...prev,
            //                     [name]: value,
            //                     // BedCharge: "",
            //                     // GST: "",
            //                     // TotalCharge: "",
            //                     RoomNo: '',
            //                     BedNo: '',
            //                 }))
            //             }

            //         })
            //         .catch(err => {
            //             setRoomMaster_Room_by_Ward([])
            //             console.log(err);
            //         })

            // } else {
            //     setRoomMasterName((prev) => ({
            //         ...prev,
            //         [name]: value,
            //         // BedCharge: '',
            //         // GST: '',
            //         // TotalCharge: '',
            //         RoomNo: '',
            //         BedNo: '',
            //     }))
            // }

            setRoomMasterName((prev) => ({
                ...prev,
                [name]: value,              
                // BedCharge: '',
                // GST: '',
                // TotalCharge: '',
                RoomNo: '',
                BedNo: '',
            }))

        }

        else if (name === 'RoomNo'){

            const value1 = value.split('-');
            const value2 = value1[0];
            const value3 = value1[1];

            console.log(value1,value2,value3);

            setRoomMasterName((prev) => ({
                ...prev,
                RoomNo : value2,
                Roomid : value3,      
                BedNo: '',
            }))
        }
        else {
            setRoomMasterName((prev) => ({
                ...prev,
                [name]: value.toUpperCase()
            }))
        }



    }

    const RoomMasterColumns = [
        {
            key: "id",
            name: "Room Master Id",
            frozen: true
        },
        {
            key: "LocationName",
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
            key: "WardName",
            name: "Ward Name",
        },
        {
            key: "RoomNo",
            name: "Room No",
        },
        {
            key: "BedNo",
            name: "Bed No",
        },
        // {
        //     key: "BedCharge",
        //     name: "Bed Charge",
        // },
        // {
        //     key: "GST",
        //     name: "GST",
        // },
        // {
        //     key: "TotalCharge",
        //     name: "Total Charge",
        // },

        {
            key: "Status",
            name: "Status",
            frozen: true,
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditRoomMasterstatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Edit",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditRoomMaster(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Delete",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleDeleteRoommaster(params.row)}
                    >
                        <TrashIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ]
    const handleeditRoomMasterstatus = (params) => {
        const data = {
            RoomMasterId: params.id,
            Statusedit: true
        }
        const conformation = window.confirm('Are you sure ,want to update the status')
        if (conformation) {
            axios.post(`${UrlLink}MCI/MRD_Room_Master_Master_Detials_link`, data)
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
    const handleeditRoomMaster = (params) => {
        const { id, ...rest } = params
        console.log(rest,'rest');
        setRoomMasterName((prev) => ({
            ...prev,
            RoomMasterId: id,
            BuildingName: rest.BuildingId,
            BlockName: rest.BlockId,
            FloorName: rest.FloorId,
            WardName: rest.WardId,
            // RoomName: rest.RoomId,
            Location: rest.LocationId,
            // BedCharge: rest.BedCharge,
            // GST: rest.GST,
            // TotalCharge: rest.TotalCharge,
            RoomNo: rest.RoomNo,
            BedNo: rest.BedNo,
            BedCount : rest.NOB

        }))
    }
const HandleDeleteRoommaster = async (params) => {
    try {
        const res = await axios.post(`${UrlLink}Masters/HandleRoomMasterDelete`, {
            id: params.id
        });
        alert("Roommaster deleted successfully");
        roommaster();
        console.log(res.data);
    } catch (error) {
        alert("Failed to delete roommaster");
        console.error(error);
    }
};


    const HandleSaveRoomMaster = () => {
        const exist = Object.keys(RoomMasterName).filter(p => p !== 'RoomMasterId' && p !== 'BedNo' && p !== 'Roomid').filter((field) => !RoomMasterName[field])
        if (exist.length === 0) {


            const data = {
                ...RoomMasterName,
                created_by: userRecord?.username || ''
            }
            axios.post(`${UrlLink}MCI/MRD_Room_Master_Master_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    console.log(resres, '----');
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsBuildingGet(prev => !prev)
                    setRoomMasterName({
                        Location: '',
                        BuildingName: '',
                        BlockName: '',
                        FloorName: '',
                        WardName: '',
                        // BedCharge: '',
                        // GST: '',
                        // TotalCharge: '',
                        RoomNo: '',
                        BedCount:'',
                        BedNo: '',
                        RoomMasterId: '',
                        

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

    
    const roommaster = () =>{
        axios.get(`${UrlLink}MCI/MRD_Room_Master_Master_Detials_link`)
        .then((res) => {
            const ress = res.data
            console.log('22222222',ress);

        if (Array.isArray(ress)) {
          const FloorList = [...new Set(ress.map((item) => item.FloorName))];
          const WardList = [...new Set(ress.map((item) => item.WardName))];
          const RoomList = [...new Set(ress.map((item) => item.RoomNo))];
          setBedFloorList(FloorList);
          setBedWardList(WardList);
          setBedRoomList(RoomList);

        setRoomMasterData(ress)
        } else {
          setFloorList([]);
          setWardList([]);
          setRoomList([]);
          
        }
            
        })
        .catch((err) => {
            console.log(err);
        })
        
    }  
    useEffect(() => {
        roommaster();
    
    }, [IsBuildingGet, UrlLink])


    return (
        <>
            <div className="Main_container_app">
                <h3>Room Master</h3>
                <div className="RegisterTypecon">
                    <div className="RegisterType">
                        {["Room", "Bed"].map((p, ind) => (
                            <div className="registertypeval" key={ind}>
                                <input
                                    type="radio"
                                    id={p}
                                    name="appointment_type"
                                    checked={MasterOptions === p}
                                    onChange={(e) => {
                                        setMasterOptions(e.target.value)
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



                {/*-----------------------------Room Name-----------------------------------------------------------------------*/}

                {MasterOptions === 'Room' &&
                    <>
                        {/* <div className="common_center_tag">
                    <span>Room Name</span>
                </div>   */}
                        {/* <br/> */}
                        
                        {/* <div className="RegisFormcon_1">
                            {Object.keys(RoomName).filter(p => p !== 'RoomId').map((field, indx) => (
                                <div className="RegisForm_1" key={indx}>
                                    <label> {formatLabel(field)} <span>:</span> </label>
                                    {
                                        (field === 'GST' && (parseInt(RoomName.RoomCharge, 0) < 5000 || RoomName.RoomCharge === '')) || field === 'RoomCharge' || field === 'DoctorCharges' || field === 'NurseCharges' ?
                                            <input
                                                type={field === 'RoomCharge' || field === 'DoctorCharges' || field === 'NurseCharges' ? 'number' : 'text'}
                                                name={field}
                                                onKeyDown={(e) => (field === 'RoomCharge' || field === 'DoctorCharges' || field === 'NurseCharges') && (['+', '-', 'e', 'E'].includes(e.key) && e.preventDefault())}
                                                autoComplete='off'
                                                required
                                                readOnly={field === 'GST' && (RoomName.RoomCharge ? parseInt(RoomName.RoomCharge, 0) < 5000 : true)}
                                                value={RoomName[field]}
                                                onChange={handlechangeRoom}
                                            />
                                            :
                                            <select
                                                name={field}
                                                required
                                                disabled={RoomName.RoomId}
                                                value={RoomName[field]}
                                                onChange={handlechangeRoom}
                                            >
                                                <option value=''>Select</option>
                                                {field === 'BuildingName' &&
                                                    Room_Building_by__loc.map((p, index) => (
                                                        <option key={index} value={p.id}>{p.BuildingName}</option>
                                                    ))
                                                }
                                                {field === 'BlockName' &&
                                                    Room_block_by_Building.map((p, index) => (
                                                        <option key={index} value={p.id}>{p.BlockName}</option>
                                                    ))
                                                }
                                                {field === 'FloorName' &&
                                                    Room_Floor_by_Block.map((p, index) => (
                                                        <option key={index} value={p.id}>{p.FloorName}</option>
                                                    ))
                                                }
                                                {field === 'WardName' &&
                                                    Room_ward_by_FLoor.map((p, index) => (
                                                        <option key={index} value={p.id}>{p.WardName}</option>
                                                    ))
                                                }
                                                {field === 'Location' &&
                                                    LocationData.map((p, index) => (
                                                        <option key={index} value={p.id}>{p.locationName}</option>
                                                    ))
                                                }
                                                
                                            </select>
                                    }
                                </div>
                            ))}
                        </div> */}

                        {/* {field === 'GST' &&
                                                    <>
                                                        <option value='28'>28 %</option>
                                                        <option value='18'>18 %</option>
                                                        <option value='12'>12 %</option>
                                                        <option value='5'>5 %</option>
                                                    </>
                                                } */}


                        <div className="RegisFormcon_1">
    {Object.keys(RoomName).filter(p => p !== 'RoomId' && p !== 'Roomno' && p !== 'isAc' && p !== 'Acamt' && p !== 'NonACamt').map((field, indx) => (
      <div className="RegisForm_1" key={indx}>
        <label> {formatLabel(field)} <span>:</span> </label>
        {
          (field === 'GST' && (parseInt(RoomName.RoomCharge, 0) < 5000 || RoomName.RoomCharge === '')) || field === 'RoomCharge' || field === 'DoctorCharges' || field === 'NurseCharges' ?
            <input
              type={field === 'RoomCharge'? 'number' : 'text'}
              name={field}
              onKeyDown={(e) => (field === 'RoomCharge' || field === 'Acamt' || field === 'NonACamt') && (['+', '-', 'e', 'E'].includes(e.key) && e.preventDefault())}
              autoComplete='off'
              required
              readOnly={field === 'GST' && (RoomName.RoomCharge ? parseInt(RoomName.RoomCharge, 0) < 5000 : true)}
              value={RoomName[field]}
              onChange={handlechangeRoom}
            />
            :
            <select
              name={field}
              required
            //   disabled={RoomName.RoomId}
              value={RoomName[field]}
              onChange={handlechangeRoom}
            >
              <option value=''>Select</option>
              {field === 'BuildingName' &&
                Room_Building_by__loc.map((p, index) => (
                  <option key={index} value={p.id}>{p.BuildingName}</option>
                ))
              }
              {field === 'BlockName' &&
                Room_block_by_Building.map((p, index) => (
                  <option key={index} value={p.id}>{p.BlockName}</option>
                ))
              }
              {field === 'FloorName' &&
                Room_Floor_by_Block.map((p, index) => (
                  <option key={index} value={p.id}>{p.FloorName}</option>
                ))
              }
              {field === 'WardName' &&
                Room_ward_by_FLoor.map((p, index) => (
                  <option key={index} value={p.id}>{p.WardName}</option>
                ))
              }
              {field === 'Location' &&
                LocationData.map((p, index) => (
                  <option key={index} value={p.id}>{p.locationName}</option>
                ))
              }
            </select>
        }
      </div>
    ))}
    {/* Added Roomno field */}
    <div className="RegisForm_1">
      <label> Room No <span>:</span> </label>
      <input
        type="text"
        name="Roomno"
        autoComplete='off'
        required
        value={RoomName.Roomno || ''}
        onChange={handlechangeRoom}
      />
    </div>

    {/* <div className="RegisForm_1">
        <label>AC Room <span>:</span> </label>
        <input
            type="checkbox"
            name="isAc"
            checked={RoomName.isAc}
            onChange={handleCheckboxChange}
        />
    </div>

                        {RoomName.isAc && (
                            <>
                            
                            <div className="RegisForm_1">
                            <label> AC Amount <span>:</span> </label>
                            <input
                                type="text"
                                name="Acamt"
                                autoComplete='off'
                                required
                                value={RoomName.Acamt || ''}
                                onChange={handlechangeRoom}
                            />
                            </div>

                            <div className="RegisForm_1">
                            <label> Non Ac Amount<span>:</span> </label>
                            <input
                                type="text"
                                name="NonACamt"
                                autoComplete='off'
                                required
                                value={RoomName.NonACamt || ''}
                                onChange={handlechangeRoom}
                            />
                            </div>
                            </>
                        )} 
                            */}
                        </div>
                      
                        <br />
                        <div className="Main_container_Btn">
                            <button onClick={HandleSaveRoom}>
                                {RoomName.RoomId ? "Update" : "Add"}
                            </button>
                        </div>
                        <br />

            <div className="RegisFormcon_1" style={{ marginTop: '10px' }}>
                        <div className="RegisForm_1">
                                <label>FLOOR<span>:</span></label>
                                <input
                                type="text"
                                name="searchfloor"
                                list="fids"
                                value={SearchQueryfilter.searchfloor}
                                onChange={handleSearchChangefilter}
                                />
                                <datalist id="fids">
                                {FloorList.map((opdr, index) => (
                                    <option key={index} value={opdr} />
                                ))}
                                </datalist>
                        </div>

                        <div className="RegisForm_1">
                            <label>Ward Name<span>:</span></label>
                            <input
                            type="text"
                            name="searchward"
                            list="wards"
                            value={SearchQueryfilter.searchward}
                            onChange={handleSearchChangefilter}
                            />
                            <datalist id="wards">
                            {WardList.map((opdr, index) => (
                                <option key={index} value={opdr} />
                            ))}
                            </datalist>
                        </div>

                        <div className="RegisForm_1">
                            <label>Room No<span>:</span></label>
                            <input
                            type="text"
                            name="searchrooom"
                            list="rooms"
                            value={SearchQueryfilter.searchrooom}
                            onChange={handleSearchChangefilter}
                            />
                            <datalist id="rooms">
                            {RoomList.map((opdr, index) => (
                                <option key={index} value={opdr} />
                            ))}
                            </datalist>
                        </div>
            </div>


                        <ReactGrid columns={RoomColumns} RowData={filteredRoomData} />
                    </>
                }
                {/* -----------room master -------*/}
                {MasterOptions === 'Bed' &&
                    <>
                        <div className="common_center_tag">
                            <span>Room Master</span>
                        </div>
                        <br />
                        <div className="RegisFormcon_1">
                            {
                                Object.keys(RoomMasterName).filter(p => !['RoomMasterId','Roomid'].includes(p)).map((field, indx) => (
                                    <div className="RegisForm_1" key={indx}>
                                        <label> {formatLabel(field)} <span>:</span> </label>
                                        {
                                            ['BedNo','BedCount'].includes(field) ?
                                                <input
                                                    type={'text'}
                                                    name={field}
                                                    autoComplete='off'
                                                    required
                                                //    readOnly={['BedCharge', 'TotalCharge'].includes(field)}
                                                    // readOnly={[...(RoomMasterName.RoomMasterId ? ['BedCount'] : ['BedNo'])].includes(field)}
                                                    readOnly={[...(RoomMasterName.RoomMasterId ? [] : ['BedNo'])].includes(field)}
                                                    value={RoomMasterName[field]}
                                                    onChange={handlechangeRoomMaster}
                                                />
                                                :
                                                <select
                                                    name={field}
                                                    required
                                                    // disabled={RoomMasterName.RoomMasterId}
                                                    value={RoomMasterName[field]}
                                                    onChange={handlechangeRoomMaster}
                                                >
                                                    <option value=''>Select</option>
                                                    {field === 'BuildingName' &&
                                                        RoomMaster_Building_by__loc.map((p, index) => (
                                                            <option key={index} value={p.id}>{p.BuildingName}</option>
                                                        ))
                                                    }
                                                    {field === 'BlockName' &&
                                                        RoomMaster_block_by_Building.map((p, index) => (
                                                            <option key={index} value={p.id}>{p.BlockName}</option>
                                                        ))
                                                    }
                                                    {field === 'FloorName' &&
                                                        RoomMaster_Floor_by_Block.map((p, index) => (
                                                            <option key={index} value={p.id}>{p.FloorName}</option>
                                                        ))
                                                    }
                                                    {field === 'WardName' &&
                                                        RoomMaster_ward_by_FLoor.map((p, index) => (
                                                            <option key={index} value={p.id}>{p.WardName}</option>
                                                        ))
                                                    }

                                                    {field === 'RoomNo' &&
                                                        RoomMaster_Room_by_Ward.map((p, index) => (
                                                            <option key={index} value={p.id}>{p.RoomNo}</option>
                                                        ))
                                                    }
                                                    {/* {field === 'RoomName' &&
                                                RoomMaster_Room_by_Ward.map((p, index) => (
                                                    <option key={index} value={p.id}>{p.RoomName}</option>
                                                ))
                                            } */}
                                                    {field === 'Location' &&
                                                        LocationData.map((p, index) => (
                                                            <option key={index} value={p.id}>{p.locationName}</option>
                                                        ))
                                                    }

                                                </select>
                                        }
                                    </div>
                                ))
                            }

                        </div>
                        <br />
                        <div className="Main_container_Btn">
                            <button onClick={HandleSaveRoomMaster}>
                                {RoomMasterName.RoomMasterId ? "Update" : "Add"}
                            </button>
                        </div>
                        <br />

                        <div className="RegisFormcon_1" style={{ marginTop: '10px' }}>
                        <div className="RegisForm_1">
                                <label>FLOOR<span>:</span></label>
                                <input
                                type="text"
                                name="searchBedfloor"
                                list="bfids"
                                value={SearchQueryBedfilter.searchBedfloor}
                                onChange={handleSearchChangeBedfilter}
                                />
                                <datalist id="bfids">
                                {BedFloorList.map((opdr, index) => (
                                    <option key={index} value={opdr} />
                                ))}
                                </datalist>
                        </div>

                        <div className="RegisForm_1">
                            <label>Ward Name<span>:</span></label>
                            <input
                            type="text"
                            name="searchBedward"
                            list="bwards"
                            value={SearchQueryfilter.searchBedward}
                            onChange={handleSearchChangeBedfilter}
                            />
                            <datalist id="bwards">
                            {BedWardList.map((opdr, index) => (
                                <option key={index} value={opdr} />
                            ))}
                            </datalist>
                        </div>

                        <div className="RegisForm_1">
                            <label>Room No<span>:</span></label>
                            <input
                            type="text"
                            name="searchBedrooom"
                            list="brooms"
                            value={SearchQueryBedfilter.searchBedrooom}
                            onChange={handleSearchChangeBedfilter}
                            />
                            <datalist id="brooms">
                            {BedRoomList.map((opdr, index) => (
                                <option key={index} value={opdr} />
                            ))}
                            </datalist>
                        </div>
            </div>
                        <ReactGrid columns={RoomMasterColumns} RowData={filteredBedData} />

                    </>
                }
            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    )
}

export default MRDRoomMaster;