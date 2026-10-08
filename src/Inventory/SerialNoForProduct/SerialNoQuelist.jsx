
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';


const SerialNoQuelist= () => {

    const navigate = useNavigate();
    
    const dispatchvalue = useDispatch();
    
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    // const [StatusCheck,setStatusCheck]=useState('')

    const [SerialNumberArray,setSerialNumberArray]=useState([])

    useEffect(()=>{

        axios.get(`${UrlLink}Inventory/GET_SerialNo_Quelist?StatusCheck=${'Pending'}`)
        .then((res)=>{
            console.log('---',res.data);
            if(Array.isArray(res.data)){
              setSerialNumberArray(res.data)
            }
        })
        .catch((err)=>{
            console.log(err)            
        })
    },[UrlLink])


    const HandelMovePage =(row)=>{

      console.log('row????',row);
      dispatchvalue({ type:'SerialNoData', value: row });
      // navigate('/Home/SerialNoAssignPage')
      navigate("/Home/InventoryMaster");
      dispatchvalue({ type: "HrFolder", value: "SerialNoAssignPage" });
      dispatchvalue({ type: "setPreviousFolder", value: null }); 
      dispatchvalue({ type: "showMenu", value: true });
    }





    const SerialNumberItemColumn =[
      {
          key:'id',
          name:'S.No',
          frozen: true
      },
      {
          key:'StockId',
          name:'Stock Id',
          frozen: true
      },
      {
          key:'ItemCode',
          name:'Item Code',
          frozen: true
      },
      {
        key: 'ItemName',
        name: 'Item Name',
        frozen: true,
      },
      {
        key: 'ProductCategory',
        name: 'Product Category',
        frozen: true,
      },
      {
        key:'SubCategory',
        name:'Sub Category',
      },
      {
          key:'BatchNo',
          name:'Batch No',
         
      },
      {
          key:'ItemQuantity',
          name:'Item Quantity',
      },
      {
        key:'StoreLocationName',
        name:'Store Location',
      },
      {
          key:'Status',
          name:'Status',
      },
      {
        key:'Action',
        name:'Action',
        renderCell:(params)=>(

            <>
            <Button className="cell_btn" 
            onClick={()=>HandelMovePage(params.row)}               
            >
            <ArrowForwardIcon className="check_box_clrr_cancell" />
            </Button>            
            </>
        )
    }
  ]
  


  return (
    <>

        <div className="Main_container_app">
            <h3>Serial Number Pending Quelist</h3>
            <br />
            <br/>


            <ReactGrid columns={SerialNumberItemColumn} RowData={SerialNumberArray} />


        </div>
      
    </>
  )
}

export default SerialNoQuelist;