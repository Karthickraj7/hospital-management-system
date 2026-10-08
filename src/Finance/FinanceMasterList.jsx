
import React, { useEffect, useState } from 'react'
import LoupeIcon from "@mui/icons-material/Loupe";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";


const FinanceMasterList = () => {

const navigate = useNavigate()

const dispatchvalue = useDispatch();


const UrlLink = useSelector(state => state.userRecord?.UrlLink);

const toast = useSelector(state => state.userRecord?.toast);

const userRecord = useSelector((state) => state.userRecord?.UserData);


const [InsuranceClientForm, setInsuranceClientForm] = useState('Group');

const[MasterGroupArr,setMasterGroupArr]=useState([])

const handleselectChange = (e) => {
    const { value } = e.target
    setInsuranceClientForm(value)
}


// --------------page route conditions

const HandeleGoTopage =()=>{
    if(InsuranceClientForm  === 'Group'){

      navigate("/Home/Financefolder");
      dispatchvalue({ type: 'HrFolder', value:'FinanceGroupMaster'});
      dispatchvalue({ type: "setPreviousFolder", value: null }); 
      dispatchvalue({ type: "showMenu", value: true });

      dispatchvalue({ type: 'FinanceMasterEdit', value: {} })
    }
    else if ('Finance Ledger'){

      navigate("/Home/Financefolder");
      dispatchvalue({ type: 'HrFolder', value:'FinanceLedgerMaster'});
      dispatchvalue({ type: "setPreviousFolder", value: null }); 
      dispatchvalue({ type: "showMenu", value: true });

      dispatchvalue({ type: 'FinanceLedgerMasterEdit', value: {} })

    }
}


useEffect(()=>{

    axios.get(`${UrlLink}finance/allgrouplistmasterget`)
    .then((res)=>{
        console.log(res);  
        let getdata=res.data
        if (getdata && Array.isArray(getdata) && getdata.length !==0 ){
            setMasterGroupArr(getdata)
        }      
    })
    .catch((err)=>{
        console.log(err);        
    })
},[UrlLink])



const EditDataMasterGroup =(row)=>{

    console.log('pppppp',row);
    dispatchvalue({ type: 'FinanceMasterEdit', value: row })
    // navigate('/Home/FinanceGroupMaster');


    navigate("/Home/Financefolder");
    dispatchvalue({ type: 'HrFolder', value:'FinanceGroupMaster'});
    dispatchvalue({ type: "setPreviousFolder", value: null }); 
    dispatchvalue({ type: "showMenu", value: true });
}


const FinaceGroupMasterColumn=[
    {
        key:'id',
        name:'ID',
        frozen: true
    },
    {
        key:'GroupName',
        name:'Group Name',
    },
    {
        key:'UnderGroup',
        name:'Under Group',
    },
    {
        key:'Action',
        name:'Action',
        renderCell:(params)=>(
            
            params.row.CreateBy !== 'host' ?
            <Button className="cell_btn" onClick={()=>EditDataMasterGroup(params.row)} >
                <EditIcon className="check_box_clrr_cancell" />
            </Button> 
            :
            <Button className="cell_btn">
                No Action
            </Button>
            
        )
    }
]




// -------------------------------------LedgerMasterList----------------------------------------------

const [ledgerarray,setLedgerArray]=useState([])



useEffect(()=>{

    axios.get(`${UrlLink}finance/postledgermasterdata`)
    .then((res)=>{
        console.log('++++++',res?.data);    
        
        let getdata=res?.data

        if(getdata && Array.isArray(getdata) && getdata.length !==0){
            setLedgerArray(getdata)
            
        }
        
    })
    .catch((err)=>{
        console.log(err);        
    })

},[UrlLink])


const EditDataMasterLedger =(row)=>{
    // console.log('111',row);
    dispatchvalue({ type: 'FinanceLedgerMasterEdit', value: row })
    navigate('/Home/FinanceLedgerMaster');

}




const LedgerMasterColumn=[
    {
        key:'id',
        name:'ID',
        frozen: true
    },
    {
        key:'LedgerName',
        name:'Ledger Name',        
        frozen: true,
    },
    {
        key:'UseGroupName',
        name:'Group Name',        
        frozen: true
    },
    {
        key: 'OpeningBalance',
        name: 'Opening Balance',
        renderCell: (params) => {
            return (
                <>
                    {params.row.OpeningBalance + ' ' + params.row.DebitOrCredit}
                </>
            );
        }
    },
    {
        key:'Action',
        name:'Action',
        renderCell:(params)=>(
            
            <Button className="cell_btn" onClick={()=>EditDataMasterLedger(params.row)} >
                <EditIcon className="check_box_clrr_cancell" />
            </Button>
            
        )
    }

]



// ------------------------------------------------------------------------------


const [Reportarr,setReportarr]=useState([])



   
useEffect(()=>{

    axios.get(`${UrlLink}finance/get_ledger_report_list`)
    .then((res)=>{
        console.log('++++++',res?.data);    
        
        let getdata=res?.data

        if(getdata && Array.isArray(getdata) && getdata.length !==0){
            setReportarr(getdata)                
        }else{
            setReportarr([])                
        }
        
    })
    .catch((err)=>{
        console.log(err);        
    })

},[UrlLink])




const MovieToListPage=(row)=>{
    dispatchvalue({ type: 'FinanceLedgerMasterEdit', value: row })
    navigate('/Home/SingleLedgerList');
}


const ReportLedgerMasterColumn=[
    {
        key:'id',
        name:'ID',
        frozen: true
    },
    {
        key:'LedgerName',
        name:'Ledger Name',        
        frozen: true,
        renderCell:(params)=>(
            <Button className="cell_btn" onClick={()=>MovieToListPage(params.row)} >
                {params.row.LedgerName}
            </Button>
        )
    },
    {
        key:'UseGroupName',
        name:'Group Name',        
        frozen: true
    },
    {
        key:'OpeningBalance',
        name:'Opening Balance',
    },
    {
        key:'Debit',
        name:'Debit',
    },
    {
        key:'Credit',
        name:'Credit',
    },
    {
        key:'ClosingBalance',
        name:'Closing Balance',
    }

]



  return (
    <>
    <div className="Main_container_app">
        <h3>Finance Master</h3>

    
        <div className="RegisterTypecon" style={{gap:'40px'}}>
            
            <div className="RegisterType">
                {["Group", "Finance Ledger",'Ledgers Report'].map((p, ind) => (
                    <div className="registertypeval" key={ind + 'key'}>
                        <input
                            type="radio"
                            id={p}
                            name="appointment_type"
                            checked={InsuranceClientForm === p}
                            onChange={handleselectChange}
                            value={p}
                        />
                        <label htmlFor={p}>
                            {p}
                        </label>
                    </div>
                ))}
            </div>
            

           { InsuranceClientForm !== 'Ledgers Report' && <button
            className="search_div_bar_btn_1"
            title="New Master"
            onClick={HandeleGoTopage}
            >
                <LoupeIcon />
            </button>
            }

        </div>
    
    <br/>
    {
        InsuranceClientForm === 'Group' ? 
        <ReactGrid columns={FinaceGroupMasterColumn} RowData={MasterGroupArr} />
        :
        InsuranceClientForm === 'Finance Ledger' ? 
        <ReactGrid columns={LedgerMasterColumn} RowData={ledgerarray} />
        :
        <ReactGrid columns={ReportLedgerMasterColumn} RowData={Reportarr} />
    }
    </div>

    </>
  )
}

export default FinanceMasterList;
