import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import {useSelector ,useDispatch} from 'react-redux';
import LoupeIcon from "@mui/icons-material/Loupe";
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Button from "@mui/material/Button";
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';




const TrayManagementList =()=> {

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);

    const [ItemArray,setItemArray]=useState([])

    const [ProductArray,setProductArray]=useState([])

    const [TrayStatus,setTrayStatus]=useState('All')


    const [TrayArray,setTrayArray]=useState([])

    const [ShelfArray,setShelfArray]=useState([])

    const [RackArray,setRackArray]=useState([])

    
    const [LocationData, setLocationData] = useState([]);

    const [StoreData, setStoreData] = useState([])




    const[mapingState,setmapingState]=useState({
        SearchLocation:'',
        StoreLocation:'',
        RackName:'',
        ShelfName:'',
        TrayName:'',
        ItemCode:'',
        ItemName:'',
    })


    const navigate = useNavigate();
    const dispatchvalue = useDispatch();

    const handleNewMaster = () => {
        navigate("/Home/InventoryMaster");
        dispatchvalue({ type: "HrFolder", value: "TrayManagement" });
        dispatchvalue({ type: "setPreviousFolder", value: null }); 
        dispatchvalue({ type: "showMenu", value: true });
        dispatchvalue({ type: 'TrayManagementState', value: {}});

    };


    useEffect(()=>{

        if(userRecord && Object.keys(userRecord).length !==0){

            setmapingState((prev)=>({
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

            axios.get(`${UrlLink}Inventory/GET_Product_Detials_For_Tray_link2`)
            .then((res)=>{
                let data = res.data;
        
                if(data && Array.isArray(data)){
                    setItemArray(data)
                }
            })
            .catch((err)=>{
                console.log(err);        
            })

    }, [UrlLink])


  

    useEffect(()=>{

        if(mapingState.SearchLocation !==''){
            axios.get(`${UrlLink}Masters/Inventory_Master_Detials_link?SearchLocation=${mapingState.SearchLocation}`)
            .then((res) => {
                const ress = res.data
                setStoreData(ress)
            })
            .catch((err) => {
                console.log(err);
            })
           }
    
        if(mapingState.SearchLocation !=='' && mapingState.StoreLocation !==0){
    
        const params = {
                SearchLocation: mapingState.SearchLocation, 
                StoreLocation: mapingState.StoreLocation,
                Statuschek:'Statuschek',
            };
    
            axios.get(`${UrlLink}Masters/Rack_Detials_link`, { params })
            .then((res)=>{
                console.log('kkkk',res.data);
    
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
        }
    
        if(mapingState.SearchLocation !=='' && mapingState.StoreLocation !==0 && mapingState.RackName !==0){
    
            const params = {
                SearchLocation: mapingState.SearchLocation, 
                StoreLocation: mapingState.StoreLocation,  
                RackName: mapingState.RackName,
                Statuschek:'Statuschek',
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
        
            }
    
            if(mapingState.SearchLocation !=='' && mapingState.StoreLocation !==0 
                && mapingState.RackName !==0 &&  mapingState.ShelfName !==0 ){
        
        
                const params = {
                    SearchLocation: mapingState.SearchLocation, 
                    StoreLocation: mapingState.StoreLocation,  
                    RackName:mapingState.RackName,
                    ShelfName:mapingState.ShelfName ,
                    Statuschek:'Statuschek',
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
            }
        
    
      },[UrlLink,mapingState])
    
    


    useEffect(()=>{
        axios.get(`${UrlLink}Masters/Rack_Detials_link`)
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
    
    // ------------------------------------------------------
    
        axios.get(`${UrlLink}Masters/Shelf_Detials_link`)
        .then((res)=>{
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
    
    // ------------------------------------------------------
    
        axios.get(`${UrlLink}Masters/Tray_Detials_link`)
        .then((res)=>{
            let data =res.data
    
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


    },[UrlLink])

    

    // console.log('mapingState-----',mapingState);
    

    const handleInputChange=(e)=>{
        const {name,value}=e.target

        if(name === 'StoreLocation'){
        
            setmapingState((prev)=>({
                ...prev,
                [name]:value,
                RackName:'',
                ShelfName:'',
                TrayName:'',
            }))
        }

        else if(name === 'RackName'){

        setmapingState((prev)=>({
            ...prev,
            [name]:value,
            ShelfName: '',
            TrayName:'',
        }))
        }
        else if(name === 'ShelfName'){
            setmapingState((prev)=>({
                ...prev,
                [name]:value,
                TrayName:'',
            }))
        }
        else if(name === 'ItemCode'){
            let find=ItemArray.find((ele)=>+ele.Item_Code === +value)
            
            if(find){
                setmapingState((prev)=>({
                    ...prev,
                    [name]:value,
                    ItemName:find?.Item_Name,
                }))
            }
            else{
                setmapingState((prev)=>({
                    ...prev,
                    [name]:value,
                    ItemName:'',
                }))

            }
        }

        else if(name === 'ItemName'){
            let find=ItemArray.find((ele)=>ele.Item_Name === value)
            
            if(find){
                setmapingState((prev)=>({
                    ...prev,
                    [name]:value,
                    ItemCode:find?.Item_Code,
                }))
            }
            else{
                setmapingState((prev)=>({
                    ...prev,
                    [name]:value,
                    ItemCode:'',
                }))

            }
        }
        else{
            setmapingState((prev)=>({
                ...prev,
                [name]:value
            }))  
        }

    }





    const Getreportdata = useCallback (()=>{

        let Senddata={
            TrayStatus:TrayStatus,            
            ...mapingState,
        }

        let queryString = new URLSearchParams(Senddata).toString();

        axios.get(`${UrlLink}Masters/Tray_Management_List_For_Products?${queryString}`)
        .then((res)=>{
            console.log('222--00--jjjjj',res.data);
            let data=res.data
            if(data.length !==0 && Array.isArray(data))
            {
                setProductArray(data)
            }
            else{
                setProductArray([])
            }            
            
        })
        .catch((err)=>{
            console.log(err);            
        })


    },[TrayStatus,mapingState])


    useEffect(() => {
        Getreportdata();
    }, [TrayStatus, mapingState]);
    

   const HandelEditdata =(row)=>{

    let RemoveConf = window.confirm('Are you sure you want to remove this item from the tray?');

    if(RemoveConf){

        console.log('---kkvv----1111',row);


        let Senddata={
            TrayManagementId: Number(row.Tray_Management_Id) || 0,  
            RackName: Number(row.Rack_Id) || 0, 
            ShelfName: Number(row.Shelf_Id) || 0, 
            TrayName: Number(row.Tray_Id) || 0,                        
            ItemCode: row.Item_Code || '',     
            Batch_No : row.Batch_No || '',                        
            created_by: userRecord?.username || '' 
        }


        console.log('---kkvv----7777',Senddata);



        axios.delete(`${UrlLink}Masters/Difine_Tray_For_Products`, {
            data: Senddata,
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
        .then((res)=>{
            console.log(res.data)

            let resdata =res.data
            let type = Object.keys(resdata)[0]
            let mess = Object.values(resdata)[0]
            const tdata = {
                message: mess,
                type: type,
            }
            Getreportdata()

            dispatchvalue({ type: 'toast', value: tdata });

        })
        .catch((err)=>{
            console.log(err);
        })
        
    }




   }


    const TrayManagementColumn=[
        {
            key:'id',
            name:'S.No',
            frozen:true
        },
        {
            key:'Store_Location_Name',
            name:'Store Location',
            frozen:true
        },
        {
            key:'Rack_Name',
            name:'Rack Name',
            frozen:true
        },
        {
            key:'Shelf_Name',
            name:'Shelf Name',
            frozen:true
        },
        {
            key:'Tray_Name',
            name:'Tray Name',
            frozen:true
        },
        {
            key:'Item_Code',
            name:'Item Code'
        },
        {
            key:'Item_Name',
            name:'Item Name'
        },
        {
key:'Batch_No',
name :'Batch No'
        },
        {
            key: 'Remove item',
            name: 'Remove item',
            renderCell: (params) => (
                params.row? (
                    <Button className="cell_btn" onClick={() => HandelEditdata(params.row)}>
                        <RemoveShoppingCartIcon className="check_box_clrr_cancell" />
                    </Button>
                ) :<> No Action </>
            )
        }
        
        
    ]




  return (
    <>
      <div className="Main_container_app">
                <h3>Medical Tray Management List</h3>

                <div className="RegisterTypecon">
                    <div className="RegisterType">

                    <div className="RegisForm_1">
                        <label>Location <span>:</span> </label>
                        <select
                            disabled
                            name='SearchLocation'
                            required
                            value={mapingState.SearchLocation}
                            onChange={(e) => setmapingState((prev) => ({ ...prev, SearchLocation: e.target.value, StoreLocation : '' }))}
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
                            value={mapingState.StoreLocation}
                            onChange={handleInputChange}
                        >
                            <option value=''>Select</option>
                            {
                                StoreData.map((p, index) => (
                                    <option key={index} value={p.id}>{p.StoreName}</option>
                                ))
                            }
                        </select>
                        </div>
                        {/* ["All", "Available", "Occupied","InActive"] */}
                        {["All"].map((p, ind) => (
                            <div className="registertypeval" key={ind}>
                                <input
                                    type="radio"
                                    id={p}
                                    name="appointment_type"
                                    checked={TrayStatus === p}
                                    onChange={(e) => {
                                        setTrayStatus(e.target.value)
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
                
                <div className="RegisFormcon_1"> 
                
                <div className="RegisForm_1">
                <label htmlFor='RackName'>Rack Name<span>:</span></label>
                <select
                    id="RackName"
                    name="RackName"
                    value={mapingState.RackName}
                    onChange={handleInputChange}
                    disabled={mapingState.StoreLocation === ''}
                    >
                    <option value="">Select</option>
                    {RackArray.map((ele, ind) => (
                        <option key={ind} value={ele.id}>
                        {ele.RackName}
                        </option>
                    ))}
                    </select>
                    
                    </div>

                    <div className="RegisForm_1">
                    <label htmlFor='ShelfName' >Shelf Name<span>:</span></label>
                    <select
                    id="ShelfName"
                    name="ShelfName"
                    value={mapingState.ShelfName}
                    onChange={handleInputChange}
                    disabled={mapingState.RackName === ''}
                    >
                    <option value="">Select</option>
                    {ShelfArray.map((ele, ind) => (
                        <option key={ind} value={ele.id}>{ele.Shelf_Name}</option>
                    ))}
                    </select>

                    </div>

                    <div className="RegisForm_1">
                    <label htmlFor='TrayName' >Tray Name<span>:</span></label>
                    <select
                    id="TrayName"
                    name="TrayName"
                    value={mapingState.TrayName}
                    disabled={mapingState.ShelfName === ''}
                    onChange={handleInputChange}
                    >
                    <option value="">Select</option>
                    {TrayArray.map((ele, ind) => (
                       <option key={ind} value={ele.id}>{ele.Tray_Name}</option> 
                    ))}
                    </select>

                    </div>



                    {/* <div className="RegisForm_1">
                    <label htmlFor='TrayName' >Item Code<span>:</span></label>
                    <input
                        type='text'
                        id="ItemCode"
                        name="ItemCode"
                        list='ItemCodeList'
                        value={mapingState.ItemCode}
                        onChange={handleInputChange}
                        disabled={mapingState.SubCategory === ''}
                    />
                    <datalist id='ItemCodeList'>
                        {ItemArray.map((option,index)=>(
                        <option key={index} value={option.Item_Code} ></option>
                        ))}
                    </datalist>
                    

                    </div> */}

                    <div className="RegisForm_1">
                    <label htmlFor='TrayName' >Item Name<span>:</span></label>
                    <input
                        type='text'
                        id="ItemName"
                        name="ItemName"
                        list='ItemNameList'
                        value={mapingState.ItemName}
                        onChange={handleInputChange}
                        // disabled={mapingState.SubCategory === ''}
                    />
                    <datalist id='ItemNameList'>
                        {ItemArray.map((option,index)=>(
                        <option key={index} value={option.Item_Name} ></option>
                        ))}
                    </datalist>
                    

                    </div>


                    <button
                        className="search_div_bar_btn_1"
                        onClick={handleNewMaster}
                        title="New Doctor Register"
                        >
                    <LoupeIcon />
                    </button>


               
                </div>
                
                 <br/>
                 <div className="RegisFormcon_1 jjxjx_">
                <ReactGrid columns={TrayManagementColumn} RowData={ProductArray} />
                </div>
                <ToastAlert Message={toast.message} Type={toast.type}/>
            </div>
    </>
  )
}

export default TrayManagementList;