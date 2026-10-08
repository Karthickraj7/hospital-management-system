import React, { useCallback, useEffect, useState } from 'react'
import LoupeIcon from "@mui/icons-material/Loupe";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Modal, Box, Typography } from '@mui/material';
import VoucherEntrytable from './VoucherEntrytable';



const NarrationCell = ({ narration }) => {

    // console.log('narration',narration);
    
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const truncatedText = narration.length > 25 ? `${narration.substring(0, 25)}...` : narration;

    return (
        <>
            <span>{truncatedText}</span>
            {narration.length > 25 && (
                <Button onClick={handleOpen} className="view-full-text-btn">
                    View
                </Button>
            )}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4
                    }}
                >
                    <Typography variant="h6" component="h2">
                        Full Narration
                    </Typography>
                    <Typography sx={{ mt: 2 }}>{narration}</Typography>
                    <Button onClick={handleClose} sx={{ mt: 2 }} variant="contained" color="primary">
                        Close
                    </Button>
                </Box>
            </Modal>
        </>
    );
};




const VouchersList = () => {

    const navigate = useNavigate()

    const dispatchvalue = useDispatch();

    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];

    
    const currentYear = today.getFullYear();
    const aprilFirstDateLastYear = new Date(Date.UTC(currentYear - 1, 3, 1));
    const formattedDate = aprilFirstDateLastYear.toISOString().split('T')[0];


    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    
    const toast = useSelector(state => state.userRecord?.toast);


    const [VoucherListName, setVoucherListName] = useState('Contra');

    const [voucherlistdata,setvoucherlistdata]=useState([])

    const [Itemlist,setItemlist]=useState([])

    const [selectRoom, setselectRoom] = useState(false);

    const [SerchOptions,setSerchOptions] =useState({
        FromDate:formattedDate,
        ToDate:currentDate,
      })

    
    const HandeleOnchange =(e)=>{
        
        const {name,value}=e.target

        setSerchOptions((prev) => ({
            ...prev,
            [name]:value, 
            }));
        

    }



    const handleselectChange = (e) => {
        const { value } = e.target
        setVoucherListName(value)
    }


    const HandeleGoTopage =()=>{

        dispatchvalue({ type:'FinanceVouchersEdit', value: {} });
        
        if(VoucherListName  === 'Contra'){

          navigate("/Home/Financefolder");
          dispatchvalue({ type: 'HrFolder', value:'ContraVoucher'});
          dispatchvalue({ type: "setPreviousFolder", value: null }); 
          dispatchvalue({ type: "showMenu", value: true });

        }
        else if(VoucherListName  === 'Payment'){

            navigate("/Home/Financefolder");
            dispatchvalue({ type: 'HrFolder', value:'PaymentVoucher'});
            dispatchvalue({ type: "setPreviousFolder", value: null }); 
            dispatchvalue({ type: "showMenu", value: true });

          }
        else if(VoucherListName  === 'Receipt'){
            navigate("/Home/Financefolder");
            dispatchvalue({ type: 'HrFolder', value:'ReceiptVoucher'});
            dispatchvalue({ type: "setPreviousFolder", value: null }); 
            dispatchvalue({ type: "showMenu", value: true });
          }
        else if(VoucherListName  === 'Journal'){

            navigate("/Home/Financefolder");
            dispatchvalue({ type: 'HrFolder', value:'JournalVoucher'});
            dispatchvalue({ type: "setPreviousFolder", value: null }); 
            dispatchvalue({ type: "showMenu", value: true });

        }
        else if(VoucherListName === 'Sales'){
            
            navigate("/Home/Financefolder");
            dispatchvalue({ type: 'HrFolder', value:'SalesVoucher'});
            dispatchvalue({ type: "setPreviousFolder", value: null }); 
            dispatchvalue({ type: "showMenu", value: true });
        }
        else if(VoucherListName === 'Purchase'){
            
            navigate("/Home/Financefolder");
            dispatchvalue({ type: 'HrFolder', value:'PurchaseVoucher'});
            dispatchvalue({ type: "setPreviousFolder", value: null }); 
            dispatchvalue({ type: "showMenu", value: true });
        }
        else if(VoucherListName === 'CreditNote'){
            
            navigate("/Home/Financefolder");
            dispatchvalue({ type: 'HrFolder', value:'CreditNoteVoucher'});
            dispatchvalue({ type: "setPreviousFolder", value: null }); 
            dispatchvalue({ type: "showMenu", value: true });
        }
        else if(VoucherListName === 'DebitNote'){
            
            navigate("/Home/Financefolder");
            dispatchvalue({ type: 'HrFolder', value:'DebitNoteVoucher'});
            dispatchvalue({ type: "setPreviousFolder", value: null }); 
            dispatchvalue({ type: "showMenu", value: true });
        }
    }


    const AllvoucherDataget = useCallback(()=>{

        if(VoucherListName !== '' && Object.keys(SerchOptions).length !==0){

            let senddata={
                ...SerchOptions,
                voucherType:VoucherListName+'Voucher',
            }

            let PostURLlink

            if(['SalesVoucher','PurchaseVoucher','CreditNoteVoucher','DebitNoteVoucher'].includes(VoucherListName+'Voucher')){
                PostURLlink='postvoucherdataSecondfourvouchers'
              }else{
                PostURLlink='postvoucherdataallvouchers'
              }

        axios.get(`${UrlLink}finance/${PostURLlink}`,{
            params:senddata,
        })
        .then((res)=>{
            console.log('888vvvv',res.data);
            let getdata = res?.data

            if(getdata && Array.isArray(getdata) && getdata.length !==0){
                setvoucherlistdata(getdata)
            }
            else{
                setvoucherlistdata([])
            }

        })
        .catch((err)=>{
            console.log(err);            
        })
        }
    },[UrlLink,VoucherListName,SerchOptions])


    useEffect(()=>{
     AllvoucherDataget()
    },[AllvoucherDataget])




const ItemView =(row)=>{

    let Item=row?.VoucherEntryarray

    if(Item && Item.length !==0){
        setselectRoom(true)        
        setItemlist(Item)
    }else{

        const tdata = {
            message: 'There is no data to view.',
            type: 'warn'
        };
        dispatchvalue({ type: 'toast', value: tdata });

    }

}



const HandelEditdata =(row)=>{

    console.log('08888',row);

    if(Object.values(row).length !==0){

        const {id,Status,VoucherEntryarray,...rest} = row;

        const sendObj={
            VoucherNo:id,
            ...rest,
            VoucherEntryarray:VoucherEntryarray
        }

        dispatchvalue({ type:'FinanceVouchersEdit', value: sendObj });
        
        if(VoucherListName === 'Contra'){
            navigate('/Home/ContraVoucher');
        }
        else if(VoucherListName === 'Payment'){
            navigate('/Home/PaymentVoucher');
        }
        else if(VoucherListName === 'Receipt'){
            navigate('/Home/ReceiptVoucher');
        }
        else if(VoucherListName === 'Journal'){
            navigate('/Home/JournalVoucher');
        }
        else if(VoucherListName === 'Sales'){
            navigate('/Home/SalesVoucher');
        }
        else if(VoucherListName === 'Purchase'){
            navigate('/Home/PurchaseVoucher');
        }
        else if(VoucherListName === 'CreditNote'){
            navigate('/Home/CreditNoteVoucher');
        }
        else if(VoucherListName === 'DebitNote'){
            navigate('/Home/DebitNoteVoucher');
        }
     
        

    }
    


  
}


const HandelChangeStatus=(row)=>{

    console.log('pppppp',row.id);
    
    let EditStatus={
        EditNumchange:row.id,
        voucherType:VoucherListName+'Voucher',
    }

    let PostURLlink
    if(['SalesVoucher','PurchaseVoucher','CreditNoteVoucher','DebitNoteVoucher'].includes(VoucherListName+'Voucher')){
        PostURLlink='postvoucherdataSecondfourvouchers'
      }else{
        PostURLlink='postvoucherdataallvouchers'
      }

    axios.post(`${UrlLink}finance/${PostURLlink}`,EditStatus)
    .then((res)=>{
        console.log(res.data); 
        let resdata = res.data
        let type = Object.keys(resdata)[0]
        let mess = Object.values(resdata)[0]
        const tdata = {
            message: mess,
            type: type,
        }
      dispatchvalue({ type: 'toast', value: tdata });     
      AllvoucherDataget()  
    })
    .catch((err)=>{
        console.log(err);        
    })

}



const ContraVouchercolumn=[
    {
        key:'id',
        name:'Invoice Number',
        frozen: true
    },
    {
        key:'VoucherDate',
        name:'Voucher Date',
        frozen: true
    },
    {
        key:'VoucherNarration',
        name:'Narration',
        width:'250px',
        renderCell: (params) => <NarrationCell narration={params.row.VoucherNarration} />
    },
    {
        key:'Particulars',
        name:'Particulars',
        renderCell:(params)=>(
        <Button onClick={()=>ItemView(params.row)} className="cell_btn">
           <FormatListBulletedIcon/>
        </Button>  
        )

    },
    {
        key:'Action',
        name:'Action',
        renderCell:(params)=>(
            params.row.Status === true ? <Button className="cell_btn" onClick={()=>HandelEditdata(params.row)} >
                <EditIcon className="check_box_clrr_cancell" /> 
            </Button>
            :'No Action'
        )
    },
    {
        key:'Status',
        name:'Status',
        renderCell:(params)=>(
            <Button className="cell_btn" onClick={()=>HandelChangeStatus(params.row)}>
                {params.row.Status === true ? 'Active' :'InActive'}
            </Button>
        )
    },
]



  return (
    <>

    <div className="Main_container_app">
            <h3>Voucher List</h3>

        
            <div className="RegisterTypecon" style={{gap:'40px'}}>
                
                <div className="RegisterType eced_p00">
                    {["Contra","Payment","Receipt",'Journal','Sales','Purchase','CreditNote','DebitNote'].map((p, ind) => (
                        <div className="registertypeval" key={ind + 'key'}>
                            <input
                                type="radio"
                                id={p}
                                name="appointment_type"
                                checked={VoucherListName === p}
                                onChange={handleselectChange}
                                value={p}
                            />
                            <label htmlFor={p}>
                                {p}
                            </label>
                        </div>
                    ))}
                </div>
                

                <button
                className="search_div_bar_btn_1"
                title="New Master"
                onClick={HandeleGoTopage}
                >
                    <LoupeIcon />
                </button>

        </div>

        <br/>
        <div className="RegisFormcon_1" >

              <div className="RegisForm_1">
              <label>From Date<span>:</span></label>
              <input
                type='date'
                name='FromDate'
                value={SerchOptions.FromDate}
                onChange={HandeleOnchange}
                />
                
              </div>


              <div className="RegisForm_1">
              <label>To Date<span>:</span></label>
              <input
                type='date'
                name='ToDate'
                value={SerchOptions.ToDate}
                onChange={HandeleOnchange}
                min={SerchOptions.FromDate}
                />
                
              </div>

        
        </div>

        <br/>
        <ReactGrid columns={ContraVouchercolumn} RowData={voucherlistdata} />


        </div>
        <ToastAlert Message={toast.message} Type={toast.type} />

        {selectRoom && Itemlist.length !==0 &&(
            <div className="loader" onClick={() => setselectRoom(false)}>
            <div className="loader_register_roomshow"   onClick={(e) => e.stopPropagation()}>
            <br/>
            
            <div className="common_center_tag">
                <span>Particulars</span>
            </div>
            <br/>
            <br/>

            {Itemlist.length !==0 &&  <div className="for">
                <VoucherEntrytable 
                VoucherEntryarray={Itemlist}
                />
            </div>}
            </div>
            </div>
            )}
    </>
  )
}

export default VouchersList;
