
import React, { useEffect, useState } from 'react'
import LoupeIcon from "@mui/icons-material/Loupe";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import ListIcon from '@mui/icons-material/List';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Modal, Box, Typography } from '@mui/material';


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



const DayCloseingList = () => {

    const dispatchvalue = useDispatch();
    const navigate = useNavigate();

   const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];

    const [SerchOptions, setSerchOptions] = useState({
        StatusCheck: '',
        DateType: '',
        CurrentDate: currentDate,
        FromDate: '',
        ToDate: '',
        IssueBy:'', 
    })

    const [getdata,setgetdata]=useState([])

    const [Itemlist, setItemlist] = useState([])

    const [selectRoom, setselectRoom] = useState(false);
    
  
  
    const handleNewMaster = () => {
    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "DayCloseing" });
    dispatchvalue({ type: "setPreviousFolder", value: null }); 
    dispatchvalue({ type: "showMenu", value: true });
  };


  const Handeleonchange = (e) => {
    const { name, value } = e.target

    setSerchOptions((prev) => ({
        ...prev,
        [name]: value

      }))

  }

  
  useEffect(()=>{

    axios.get(`${UrlLink}finance/postdataforDayclosing`,{
      params:SerchOptions,
    })
    .then((res)=>{
      console.log(res.data);

      let getdata=res.data

      if(getdata && Array.isArray(getdata) && getdata.length){
        setgetdata(getdata)
      }
      else{
        setgetdata([])
      }
      
    })


  },[UrlLink,SerchOptions])


  const HandelEditdata = (row) => {

   if(row){
    dispatchvalue({ type: 'DayCloseingEdit', value: row });
    // navigate('/Home/PurchaseOrder');
    navigate("/Home/PettyCashFolder");
    dispatchvalue({ type: "HrFolder", value: "DayCloseing" });
    dispatchvalue({ type: "setPreviousFolder", value: null }); 
    dispatchvalue({ type: "showMenu", value: true });
   }

  }


  const ItemView = (row) => {

    let Item = row.billAmount

    if (Item && Item.length !== 0) {
      setselectRoom(true)
      setItemlist(Item)
    }
    else {

      const tdata = {
        message: 'There is no data to view.',
        type: 'warn'
      };
      dispatchvalue({ type: 'toast', value: tdata });

    }

  }


  const ExpensesColumn =[
    {
      key: 'id',
      name: 'id',
      frozen: true
    },
    {
      key: 'closeingDate',
      name: 'Closeing Date',
      frozen: true
    },
    {
      key: 'OpeningCash',
      name: 'Opening Cash',
      frozen: true
    },
    {
      key: 'OPCollectionCash',
      name: 'OP Collection Cash',
    },
    {
      key: 'IPCollectionCash',
      name: 'IP Collection Cash',
    },
    {
      key: 'TotalCash',
      name: 'Total Cash',
    },
    {
      key: 'ExpensesCash',
      name: 'Expenses Cash',
    },
    {
      key: 'AvailableCash',
      name: 'Available Cash',
    },
    {
      key: 'HandoverCash',
      name: 'Handover Cash',
    },
    {
      key: 'BalanceCash',
      name: 'Balance Cash',
    },
    {
      key: 'Narration',
      name: 'Narration',
      width:'250px',
      renderCell: (params) => <NarrationCell narration={params.row.Narration} />
    },
    {
      key: 'IssueBy',
      name: 'IssueBy',
    },
    {
      key: 'Status',
      name: 'Status',
    },
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) => (
        <>
        {params.row.Status === 'Pending' ?
        <>
         <Button className="cell_btn"
          onClick={() => HandelEditdata(params.row)}
          >
          <EditIcon className="check_box_clrr_cancell" />
          </Button>

         <Button className="cell_btn"
          //  onClick={() => HandelApprovedata(params.row)}
          >
            <CheckCircleOutlineIcon className="check_box_clrr_cancell" />
          </Button>
          </>
          :
          'No Action'
        }
        </>
      )

    }
  ]


  const PaymentColumn =[
    {
        key: 'id',
        name: 'S.No',
        frozen: true
    },
    {
        key: 'BillpayMethod',
        name: 'Payment Method',
    },
    {
        key: 'paidamount',
        name: 'Amount',
    },
    {
        key: 'Remarks',
        name: 'Remarks',
    },
]



  return (
    <>
    <div className="Main_container_app">
            <h3>Day Closeing List</h3>
            <br />
        <div className="RegisFormcon_1">
        <div className="RegisForm_1">
        <label>Status<span>:</span></label>

            <select
            name='StatusCheck'
            value={SerchOptions.StatusCheck}
            onChange={Handeleonchange}
            >
            <option value=''>Select</option>
            <option value='Pending'>Pending</option>
            <option value='Approve'>Approve</option>
            </select>
        
        </div>

        <div className="RegisForm_1">
            <label>Date Type<span>:</span></label>
            <select
              name='DateType'
              value={SerchOptions.DateType}
              onChange={Handeleonchange}
            >
              <option value=''>Select</option>
              <option value='CurrentDate'>Current Date</option>
              <option value='Customize'>Customize</option>
            </select>
        </div>

        {SerchOptions.DateType === 'CurrentDate' ?
            <div className="RegisForm_1">
              <label>Current Date<span>:</span></label>
              <input
                type='date'
                name='CurrentDate'
                value={SerchOptions.CurrentDate}
                onChange={Handeleonchange}
                readOnly
              />

            </div>
            :
            <>
              <div className="RegisForm_1">
                <label>From Date<span>:</span></label>
                <input
                  type='date'
                  name='FromDate'
                  value={SerchOptions.FromDate}
                  onChange={Handeleonchange}
                />

              </div>


              <div className="RegisForm_1">
                <label>To Date<span>:</span></label>
                <input
                  type='date'
                  name='ToDate'
                  value={SerchOptions.ToDate}
                  onChange={Handeleonchange}
                  min={SerchOptions.FromDate}
                />

              </div>
            </>}
    
            <div className="RegisForm_1">
            <label>Issue By<span>:</span></label>
            <input
              type='text'
              name='IssueBy'
              value={SerchOptions.IssueBy}
              onChange={Handeleonchange}
            />

            </div>

            <button
                className="search_div_bar_btn_1"
                onClick={handleNewMaster}
                title="New Doctor Register"
                >
                <LoupeIcon />
            </button>


        </div>
        <div className='RegisFormcon_1 jjxjx_'>
           <ReactGrid columns={ExpensesColumn} RowData={getdata} /> 
        </div>
    </div>

    {selectRoom && Itemlist.length !== 0 && (
                <div className="loader" onClick={() => setselectRoom(false)}>
                <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
                    <br />

                    <div className="common_center_tag">
                    <span>Payment Details</span>
                    </div>
                    <br />
                    <br />

                    <ReactGrid columns={PaymentColumn} RowData={Itemlist} />
                </div>
                </div>
            )}

    </>
  )
}

export default DayCloseingList;