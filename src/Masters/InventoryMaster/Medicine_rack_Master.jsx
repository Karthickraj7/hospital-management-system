import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';



    


const Medicine_rack_Master =()=>{


    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);

    
    const dispatchvalue = useDispatch();

    const [LocationData, setLocationData] = useState([]);

    const [StoreData, setStoreData] = useState([])

    console.log('StoreData',StoreData);
    
    const [RackMasterPage,setRackMasterPage]=useState('Rack')

    const userRecord = useSelector((state) => state.userRecord?.UserData);

    // console.log('userRecord',userRecord);
    

    const [Searchstate,setSearchstate]=useState({
        SearchLocation:'',
        StoreLocation:''
    })

    const [RackState,setrackState]=useState({
        RackID:'',
        RackName:'',
    })

    const [RackArray,setRackArray]=useState([])


    const [Shelfstate,setshelfstate]=useState({
        ShelfID:'',
        RackName:'',
        ShelfName:'',
    })


    const [ShelfArray,setShelfArray]=useState([])

    const [Traystate,setTraystate]=useState({
        TrayID:'',
        RackName:'',
        ShelfName:'',
        TrayName:'',
    })


    const [TrayArray,setTrayArray]=useState([])






    useEffect(()=>{

        if(userRecord && Object.keys(userRecord).length !==0){

            setSearchstate((prev)=>({
                ...prev,
                SearchLocation:userRecord?.location,
            }))           

        }

    },[userRecord])

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


    useEffect(() => {
       if(Searchstate.SearchLocation !==''){
        axios.get(`${UrlLink}Masters/Inventory_Master_Detials_link?SearchLocation=${Searchstate.SearchLocation}`)
        .then((res) => {
            const ress = res.data
            setStoreData(ress)
        })
        .catch((err) => {
            console.log(err);
        })
       }
    }, [UrlLink,Searchstate.SearchLocation])


    // --------------------------RACK Functions--------------------------------------------------


    const GetRackdataFun = useCallback(()=>{

        const params = {
            SearchLocation: Searchstate.SearchLocation, 
            StoreLocation: Searchstate.StoreLocation,   
        };

        axios.get(`${UrlLink}Masters/Rack_Detials_link`, { params })
        .then((res)=>{
            // console.log('kkkk',res.data);

            let data =res.data

            if(Array.isArray(data) && data.length !==0){
                setRackArray(data)
            }
            else{
                setRackArray([])
            }

        })
        .catch((err)=>{
            console.log(err);
        })
    },[UrlLink,Searchstate])
    

    useEffect(()=>{
        GetRackdataFun()
    },[GetRackdataFun])



    const HandleEditRackStatus = (params) => {

        console.log(params,'=====');
        let data = {
            RackID: params.id,
            Statusedit: true
        }

        axios.post(`${UrlLink}Masters/Rack_Detials_link`,data)
        .then((res)=>{
            console.log(res.data)
            let resdata=res.data
            let type=Object.keys(resdata)[0]
            let mess=Object.values(resdata)[0]
            const tdata = {
                message: mess,
                type: type,
            }
    
            dispatchvalue({ type: 'toast', value: tdata });
            GetRackdataFun()
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const HandelEditdata =(params)=>{

        let Editdata=params.row

        console.log(Editdata);

        setrackState((prev)=>({
            ...prev,
            RackName:Editdata.RackName,
            RackID:Editdata.id,
        }))

        setSearchstate((prev)=>({
            ...prev,
             SearchLocation:Editdata.Location_Id,
             StoreLocation:Editdata.Store_Location_Id,
        }))
    }

    const RackColumns =[
        {
            key: 'id',
            name:'Rack Id',
            frozen: true
        },
        {
            key: 'RackName',
            name:'Rack Name',
            frozen: true
        },
        {
            key: 'Store_Location',
            name:'Store Location',
            frozen: true
        },
        {
            key:'Location',
            name:'Location',
        },
        {
            key:'Status',
            name:'Status',
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => HandleEditRackStatus(params.row)}
                    >
                        {params.row.Status ? "ACTIVE" : "INACTIVE"}
                    </Button>
                </>
            ),
        },
        {
            key:'Action',
            name:'Action',
            renderCell:(params)=>(
                <>
                <Button className="cell_btn" 
                onClick={()=>HandelEditdata(params)}                
                >
                <EditIcon className="check_box_clrr_cancell" />
                </Button>
                </>

            )
        }
        

    ]


   

    const HandleSaveRack =()=>{
      
            let senddata={
                ...RackState,
                Location:Searchstate.SearchLocation,
                StoreLocation:Searchstate.StoreLocation,
                created_by: userRecord?.username || ''
            }
            
            axios.post(`${UrlLink}Masters/Rack_Detials_link`,senddata)
            .then((res)=>{
                let resdata =res.data
                let type = Object.keys(resdata)[0]
                let mess = Object.values(resdata)[0]
                const tdata = {
                    message: mess,
                    type: type,
                }
        
                dispatchvalue({ type: 'toast', value: tdata });
                GetRackdataFun() 

                if(type ==='success'){
                    setrackState({
                        RackID:'',
                        RackName:'',
                    })
                }
            })  
            .catch((err)=>{
                console.log(err);
            })  
        
                 
    }




// ---------------------------------------------------------------


const getShelfdata = useCallback (()=>{

    const params = {
        SearchLocation: Searchstate.SearchLocation, 
        StoreLocation: Searchstate.StoreLocation,  
        RackName: Shelfstate.RackName || Traystate.RackName,
    };

    axios.get(`${UrlLink}Masters/Shelf_Detials_link`, { params })
    .then((res)=>{
        // console.log(res.data);
        let data =res.data

            if(Array.isArray(data) && data.length !==0){
                setShelfArray(data)
            }
            else{
                setShelfArray([])
            }

    })
    .catch((err)=>{
        console.log(err);
    })

},[UrlLink,Searchstate,Shelfstate,Traystate])


useEffect(()=>{
    getShelfdata()
},[getShelfdata])


const HandelChangeShelfStatus =(params)=>{

    // console.log(params);
    let data = {
        ShelfID:params.id,
        Statusedit: true
    }

    axios.post(`${UrlLink}Masters/Shelf_Detials_link`,data)
    .then((res)=>{
        console.log(res.data);
        let resdata=res.data
            let type=Object.keys(resdata)[0]
            let mess=Object.values(resdata)[0]
            const tdata = {
                message: mess,
                type: type,
            }

            dispatchvalue({ type: 'toast', value: tdata });
            getShelfdata()

    })
    .catch((err)=>{
        console.log(err);
    })
}



const HandelEditShelfdata =(params)=>{

    let Editdata=params
    setshelfstate((prev)=>({
        ...prev,
        ShelfID:Editdata.id,
        RackName:Editdata.Rack_Id,
        ShelfName:Editdata.Shelf_Name,
    }))

    setSearchstate((prev)=>({
        ...prev,
         SearchLocation:Editdata.Location_Id,
         StoreLocation:Editdata.Store_Location_Id,
    }))


}


const ShelfColumns=[
    {
        key:'id',
        name:'Shelf Id',
        frozen: true
    },
    {
        key:'Shelf_Name',
        name:'Shelf Name',
        frozen:true
    },
    {
        key:'Rack_Name',
        name:'Rack_Name',
        frozen:true
    },
    {
        key:'Store_Location',
        name:'Store Location',
        frozen:true
    },
    {
        key:'Location_Name',
        name:'Location',
        frozen:true

    },
    {
        key:'Status',
        name:'Status',
        renderCell:(params)=>(
            <>
            <Button
            className="cell_btn"
            onClick={()=>HandelChangeShelfStatus(params.row)}
            >
            {params.row.Status ? "ACTIVE" : "INACTIVE"}
            </Button>
            </>
        )
    },
    {
        key:'Action',
        name:'Action',
        renderCell:(params)=>(
            <>
            <Button 
            className="cell_btn"
            onClick={()=>HandelEditShelfdata(params.row)}
            >
            <EditIcon className="check_box_clrr_cancell" />
            </Button>
            </>
        )

    }
]




const HandleSaveShelf =()=>{

   
        let  senddata={
            ...Shelfstate,
            Location:Searchstate.SearchLocation,
            StoreLocation:Searchstate.StoreLocation,
            created_by: userRecord?.username || ''
        }
        axios.post(`${UrlLink}Masters/Shelf_Detials_link`,senddata)
        .then((res)=>{
            // console.log(res.data);
            let resdata=res.data
            let type=Object.keys(resdata)[0]
            let mess=Object.values(resdata)[0]
            const tdata = {
                message: mess,
                type: type,
            }

            dispatchvalue({ type: 'toast', value: tdata });

            // console.log('tdata',tdata)

            if(type ==='success'){
                setshelfstate({
                    ShelfID:'',
                    RackName:'',
                    ShelfName: '',
                })
            }

            
            // setSearchstate({
            //     SearchLocation:'',
            //     StoreLocation: '',
            // })

            getShelfdata()
        })
        .catch((err)=>{
            console.log(err);
        })
    

}


// ------------------------------------------------------------------


const getTraydata =useCallback(()=>{

    const params = {
        SearchLocation: Searchstate.SearchLocation, 
        StoreLocation: Searchstate.StoreLocation,  
        RackName: Traystate.RackName ,
        ShelfName:Traystate.ShelfName ,
    };

    axios.get(`${UrlLink}Masters/Tray_Detials_link`, { params })
    .then((res)=>{
        let data =res.data
        // console.log('0000',data);
            if(Array.isArray(data) && data.length !==0){
                setTrayArray(data)
            }
            else{
                setTrayArray([])
            }
    })
    .catch((err)=>{
        console.log(err);
    })

},[Searchstate,Traystate])

useEffect(()=>{
    getTraydata()
},[getTraydata])


const HandelChangeTrayStatus =(params)=>{
    let data = {
        TrayID:params.id,
        Statusedit: true
    }

    axios.post(`${UrlLink}Masters/Tray_Detials_link`,data)
    .then((res)=>{
        console.log(res.data);
        getTraydata()
    })
    .catch((err)=>{
        console.log(err);
    })
}

const HandelEditTraydata =(params)=>{

    let Editdata =params

    setTraystate((prev)=>({
        ...prev,
        TrayID:Editdata.id,
        TrayName:Editdata.Tray_Name,
        RackName:Editdata.Rack_Id,
        ShelfName:Editdata.Shelf_Id,
    }))
    setSearchstate({
        SearchLocation:Editdata.Location_Id,
        StoreLocation:Editdata.Store_Location_Id,
    })

}

const TrayColumn=[
    {
        key:'id',
        name:'Tray Id',
        frozen:true 
    },
    {
        key:'Tray_Name',
        name:'Tray Name',
        frozen:true
    },
    {
        key:'Shelf_Name',
        name:'Shelf Name',
    },
    {
        key:'Rack_Name',
        name:'Rack Name'
    },
    {
        key:'Store_Location',
        name:'Store Location'
    },
    {
        key:'Location_Name',
        name:'Location Name'
    },
    {
        key:'Status',
        name:'Status',
        renderCell:(params)=>(
            <>
            <Button
             className="cell_btn"
             onClick={()=>HandelChangeTrayStatus(params.row)}
            >
            {params.row.Status ? "ACTIVE" : "INACTIVE"}
            </Button>
            </>
        )
    },
    {
        key:'Action',
        name:'Action',
        renderCell:(params)=>(
            <>
            <Button
            className="cell_btn"
            onClick={()=>HandelEditTraydata(params.row)}
            >
            <EditIcon className="check_box_clrr_cancell" />
            </Button>
            </>
        )
    }
]

const  HandleSaveTray =()=>{

    let  senddata={
        ...Traystate,
        Location:Searchstate.SearchLocation,
        StoreLocation:Searchstate.StoreLocation,
        created_by: userRecord?.username || ''
    }

    axios.post(`${UrlLink}Masters/Tray_Detials_link`,senddata)
    .then((res)=>{
        // console.log(res.data);
        let resdata =res.data
        let type = Object.keys(resdata)[0]
        let mess = Object.values(resdata)[0]
        const tdata = {
            message: mess,
            type: type,
        }

        dispatchvalue({ type: 'toast', value: tdata });

        if(type ==='success'){
        setTraystate({
            TrayID: "",
            RackName:  "",
            ShelfName:  "",
            TrayName: "",
        })
        }

        getTraydata()

    })
    .catch((res)=>{
        console.log(res);
    })

}


    return(
        <>
        <div className="Main_container_app">
         <h3>Medicine Rack Master</h3>

         <div className="RegisterTypecon">

            
            
            <div className="RegisterType">
            <div className="RegisForm_1">
                <label>Location <span>:</span> </label>
                <select
                    disabled
                    name='SearchLocation'
                    required
                    value={Searchstate.SearchLocation}
                    onChange={(e) => setSearchstate((prev) => ({ ...prev, SearchLocation: e.target.value, StoreLocation : '' }))}
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
                <label>Store Location <span>:</span> </label>
                <select
                    name='StoreLocation'
                    required
                    value={Searchstate.StoreLocation}
                    onChange={(e) => setSearchstate((prev) => ({ ...prev, StoreLocation: e.target.value}))}
                >
                    <option value=''>Select</option>
                    {
                        StoreData.map((p, index) => (
                            <option key={index} value={p.id}>{p.StoreName}</option>
                        ))
                    }
                </select>
                </div>
                
                {["Rack", "Shelf", "Tray"].map((p, ind) => (
                    <div className="registertypeval" key={ind}>
                        <input
                            type="radio"
                            id={p}
                            name="appointment_type"
                            checked={RackMasterPage === p}
                            onChange={(e) => {
                                setRackMasterPage(e.target.value)
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
        
        <br/>

        {RackMasterPage === 'Rack' && <>
         <div className="common_center_tag">
             <span>Rack Name</span>
         </div>

         <br/>

        <div className="RegisFormcon_1">

            <div className="RegisForm_1">
                <label> Rack Name <span>:</span> </label>
                <input
                    type="text"
                    name='RackName'
                    autoComplete='off'
                    required
                    value={RackState.RackName}
                    onChange={(e) => setrackState((prev) => ({ ...prev, RackName: e.target.value.toUpperCase() }))}
                    disabled={Searchstate.StoreLocation ===''}
                />
            </div>

        </div>
        
        <br/>

        <div className="Main_container_Btn">
            <button onClick={HandleSaveRack} >
            {RackState.RackID ? "Update" : "Add"}
        </button>
        </div>
         <br/>

        <ReactGrid columns={RackColumns} RowData={RackArray}/>
        </>
        }
        {/* --------------------------------------------- */}

        {RackMasterPage === 'Shelf' && <>

        <div className="common_center_tag">
             <span>Shelf Name</span>
        </div>

        <br/>

        <div className="RegisFormcon_1">

        <div className="RegisForm_1">
            <label> Rack Name <span>:</span> </label>
            <select
                name='RackName'
                required
                value={Shelfstate.RackName}
                onChange={(e) => setshelfstate((prev) => ({ ...prev, RackName: e.target.value, ShelfName : '' }))}
                disabled={Searchstate.StoreLocation ===''}
            >
                <option value=''>Select</option>
                {   
                    RackArray.map((p, index) => (
                        <option key={index} value={p.id}>{p.RackName}</option>
                    ))
                }
                </select>
            </div>

            <div className="RegisForm_1">
                <label> Shelf Name <span>:</span> </label>
                <input
                    type="text"
                    name='ShelfName'
                    autoComplete='off'
                    required
                    value={Shelfstate.ShelfName}
                    onChange={(e) => setshelfstate((prev) => ({ ...prev, ShelfName: e.target.value.toUpperCase() }))}
                    disabled={Shelfstate.RackName ===''}
                />
            </div>
        </div>
        <br/>
        <div className="Main_container_Btn">
            <button onClick={HandleSaveShelf} >
            {Shelfstate.ShelfID ? "Update" : "Add"}
        </button>
        </div>
        <br/>
        <ReactGrid columns={ShelfColumns} RowData={ShelfArray}/>
        
        </>
        }

{/* ----------------------------------------------------- */}

    {RackMasterPage === 'Tray' && <>
        <div className="common_center_tag">
             <span>Tray Name</span>
        </div>
        <br/>
        <div className="RegisFormcon_1">


        <div className="RegisForm_1">
            <label> Rack Name <span>:</span> </label>
            <select
                disabled={Searchstate.StoreLocation ===''}
                name='RackName'
                required
                value={Traystate.RackName}
                onChange={(e) => setTraystate((prev) => ({ ...prev, RackName: e.target.value, ShelfName : '',TrayName:'' }))}
            >
                <option value=''>Select</option>
                {   
                    RackArray.map((p, index) => (
                        <option key={index} value={p.id}>{p.RackName}</option>
                    ))
                }
                </select>
            </div>

            <div className="RegisForm_1">
            <label> Shelf Name <span>:</span> </label>
            <select
                disabled={Traystate.RackName ===''}
                name='ShelfName'
                required
                value={Traystate.ShelfName}
                onChange={(e) => setTraystate((prev) => ({ ...prev, ShelfName: e.target.value, TrayName : '' }))}
            >
                <option value=''>Select</option>
                {   
                    ShelfArray.map((p, index) => (
                        <option key={index} value={p.id}>{p.Shelf_Name}</option>
                    ))
                }
                </select>
            </div>

            <div className="RegisForm_1">
                <label> Tray Name <span>:</span> </label>
                <input
                    type="text"
                    name='TrayName'
                    autoComplete='off'
                    required
                    value={Traystate.TrayName}
                    onChange={(e) => setTraystate((prev) => ({ ...prev, TrayName: e.target.value.toUpperCase() }))}
                />
            </div>
        </div>
        <br/>
        <div className="Main_container_Btn">
            <button onClick={HandleSaveTray} >
            {Traystate.TrayID ? "Update" : "Add"}
        </button>
        </div>
        <br/>

        <ReactGrid columns={TrayColumn} RowData={TrayArray}/>


        </>
        }

        </div>

        <ToastAlert Message={toast.message} Type={toast.type} />
        
        </>
    )
}

export default Medicine_rack_Master;