
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';


const FinanceLedgerMaster = () => {

    const navigate = useNavigate()

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const toast = useSelector(state => state.userRecord?.toast);

    const userRecord = useSelector((state) => state.userRecord?.UserData);

    const LedgerMasterEdit = useSelector((state) => state.Financedata?.FinanceLedgerMasterEdit);

    // console.log('LedgerMasterEdit',LedgerMasterEdit);
    

    const dispatchvalue = useDispatch();

    const [ LedgerMasterState,setLedgerMasterState]=useState({
        LedgerName:'',
        GroupName:'',
        OpeningBalance:0,
        DebitOrCredit:'',
        PhoneNumber:'',
        PANORITNO:'',
        GSTNo:'',
        Address:'',
        ProvideBankDetails:false,
    })

    const [BankDetailesState,setBankDetailesState]=useState({
        BankHolderName:'',
        BankName:'',
        AccountNumber:'',
        Branch:'',
        IFSCcode:'',
        PanNumber:''
    })

    const[GroupArray,setGroupArray]=useState([])

    console.log('LedgerMasterState',LedgerMasterState);
    

    useEffect(()=>{

        if(LedgerMasterEdit && Object.keys(LedgerMasterEdit).length !==0){

            let {id,Debit,Credit,ClosingBalance,UseGroupName,Bank_Detailes,NatureOfgroupId,...rest}=LedgerMasterEdit;

            setLedgerMasterState({...rest})
            // console.log('Bank_Detailes',Bank_Detailes);
            if(Bank_Detailes && Object.keys(Bank_Detailes).length !==0){
            setBankDetailesState(Bank_Detailes) }
        
        }

    },[LedgerMasterEdit])


    useEffect(()=>{
        axios.get(`${UrlLink}finance/allgrouplistmasterget`)
        .then((res)=>{
            console.log(res?.data);  
            let getdata=res?.data
            if(getdata && Array.isArray(getdata) && getdata.length !==0){
                setGroupArray(getdata)
            }
        })
        .catch((err)=>{
            console.log(err);            
        })

    },[UrlLink])

    const HandeleOnchange =(e)=>{
        const {name,value}=e.target

        if(name === 'ProvideBankDetails' ){
            console.log(name,'+++');
            
            setLedgerMasterState((prev) => ({
                ...prev,
                [name]:value==='Yes', 
              }));

          }
        else if(name === 'PhoneNumber'){
            
            if (''+value.length > 10){

            const tdata = {
                message: `Mobile number must be 10 digits`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });

            }
            else{
                setLedgerMasterState((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
           
          }
         else if(name === 'GroupName'){
            
            let finddata=GroupArray.find((ele)=>+ele.id === +value)
            // console.log('++++---',finddata);
            
            if(finddata){
           setLedgerMasterState((prev)=>({
                ...prev,
                [name]:value,
                DebitOrCredit:[1,2].includes(finddata?.NatureOfGroupId) ? 'Dr' : 'Cr',
            }))  
            }
            else{
                setLedgerMasterState((prev)=>({
                    ...prev,
                    [name]:value,
                    DebitOrCredit:'',
                }))
            }
          }
        else{
            setLedgerMasterState((prev)=>({
                ...prev,
                [name]:value,
            }))
        }

    }

    const HandeleOnchangeBank =(e)=>{
        const {name,value}=e.target

        setBankDetailesState((prev)=>({
            ...prev,
            [name]:value,
        }))

    }



    const Saveledgerdata =()=>{

        let requiredFields=[
        'LedgerName',
        'GroupName',
        'DebitOrCredit'
        ]

        let missingFields =requiredFields.filter((field)=> !LedgerMasterState[field])


        if (missingFields.length !==0){
            const tdata = {
                message: `Please fill out all required fields: ${missingFields.join(", ")}`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });

            return;

        }


        if(LedgerMasterState.ProvideBankDetails === true){

            let BankrequiredFields=[
                'BankHolderName',
                'BankName',
                'AccountNumber',
                'Branch',
                'IFSCcode',
                'PanNumber'
            ]

            let BankmissingFields= BankrequiredFields.filter((filed)=> !BankDetailesState[filed])


            if (BankmissingFields.length !==0){
                const tdata = {
                    message: `Please fill out all required fields: ${BankmissingFields.join(", ")}`,
                    type: 'warn',
                }
                dispatchvalue({ type: 'toast', value: tdata });
                return;
            }
            
        }


            
            let params ={
                ...LedgerMasterState,
                ...BankDetailesState,
                createby:userRecord.username,
                LedgerEditId:LedgerMasterEdit?.id || '',
            }

            console.log('params',params);


            axios.post(`${UrlLink}finance/postledgermasterdata`,params)
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
                if (type === 'success') {
                    navigate('/Home/FinanceMasterList');
                    dispatchvalue({ type: 'FinanceLedgerMasterEdit', value: {} })
                }     
            })
            .catch((err)=>{
                console.log(err);                
            })

    }

  return (
    <>

    <div className="Main_container_app">
        <h3>Finance Ledger Master</h3>
        <br/>

        <div className="RegisFormcon_1" >

            <div className="RegisForm_1">
                <label>Ledger Name<span>:</span></label>
                <input
                type='text'
                name='LedgerName'
                value={LedgerMasterState.LedgerName}
                onChange={HandeleOnchange}
                />

            </div>

            <div className="RegisForm_1">
                <label>Group Name<span>:</span></label>
                <select
                name='GroupName'
                value={LedgerMasterState.GroupName}
                onChange={HandeleOnchange}
                >
                <option value=''>Select</option>
                {
                    GroupArray?.map((ele,ind)=>(
                    <option key={ind+'key'} value={ele.id}>{ele.GroupName}</option>
                    ))
                }
                </select>

            </div>

            <div className="RegisForm_1">
                <label>Opening Balance<span>:</span></label>
                <input
                style={{width:'80px'}}
                type='number'
                name='OpeningBalance'
                value={LedgerMasterState.OpeningBalance}
                onChange={HandeleOnchange}
                />
                <select
                name='DebitOrCredit'
                style={{width:'70px'}}
                value={LedgerMasterState.DebitOrCredit}
                onChange={HandeleOnchange}
                >
                <option value=''>Select</option>
                <option value='Dr'>Dr</option>
                <option value='Cr'>Cr</option>
                </select>

            </div>

            

            <div className="RegisForm_1">
                <label>Phone Number<span>:</span></label>
                <input
                type='number'
                name='PhoneNumber'
                value={LedgerMasterState.PhoneNumber}
                onChange={HandeleOnchange}
                />

            </div>


            <div className="RegisForm_1">
                <label>PAN / IT NO<span>:</span></label>
                <input
                type='text'
                name='PANORITNO'
                value={LedgerMasterState.PANORITNO}
                onChange={HandeleOnchange}
                />

            </div>

            <div className="RegisForm_1">
                <label>GST No<span>:</span></label>
                <input
                type='text'
                name='GSTNo'
                value={LedgerMasterState.GSTNo}
                onChange={HandeleOnchange}
                />

            </div>

            <div className="RegisForm_1">
                <label>Address<span>:</span></label>
                <textarea
                name='Address'
                value={LedgerMasterState.Address}
                onChange={HandeleOnchange}
                >
                </textarea>

            </div>


            <div className="RegisForm_1">
            <label>Provide Bank Details<span>:</span></label>
            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', width: '150px' }}>
                <label style={{ width: 'auto' }} htmlFor="ProvideBankDetails_yes">
                <input
                    required
                    id="ProvideBankDetails_yes"
                    type="radio"
                    name="ProvideBankDetails"
                    value="Yes"
                    style={{ width: '15px' }}
                    checked={LedgerMasterState.ProvideBankDetails === true}
                    onChange={HandeleOnchange}
                />
                Yes
                </label>
                <label style={{ width: 'auto' }} htmlFor="ProvideBankDetails_No">
                <input
                    required
                    id="ProvideBankDetails_No"
                    type="radio"
                    name="ProvideBankDetails"
                    value="No"
                    style={{ width: '15px' }}
                    checked={LedgerMasterState.ProvideBankDetails === false}
                    onChange={HandeleOnchange}
                />
                No
                </label>
            </div>
            </div>

            

        </div>

       {LedgerMasterState.ProvideBankDetails === true &&

     <>
        <br />

        <div className="common_center_tag">
        <span>Bank Details</span>
        </div>

        <br />

        <div className="RegisFormcon_1" >

            <div className="RegisForm_1">
                <label>Bank Holder Name<span>:</span></label>
                <input
                type='text'
                name='BankHolderName'
                value={BankDetailesState.BankHolderName}
                onChange={HandeleOnchangeBank}
                />

            </div>

            <div className="RegisForm_1">
                <label>Bank Name<span>:</span></label>
                <input
                type='text'
                name='BankName'
                value={BankDetailesState.BankName}
                onChange={HandeleOnchangeBank}
                />

            </div>

            <div className="RegisForm_1">
                <label>Account Number<span>:</span></label>
                <input
                type='number'
                name='AccountNumber'
                value={BankDetailesState.AccountNumber}
                onChange={HandeleOnchangeBank}
                />

            </div>

            <div className="RegisForm_1">
                <label>Branch<span>:</span></label>
                <input
                type='text'
                name='Branch'
                value={BankDetailesState.Branch}
                onChange={HandeleOnchangeBank}
                />

            </div>

            <div className="RegisForm_1">
                <label>IFSC code<span>:</span></label>
                <input
                type='text'
                name='IFSCcode'
                value={BankDetailesState.IFSCcode}
                onChange={HandeleOnchangeBank}
                />

            </div>

            <div className="RegisForm_1">
                <label>Pan Number<span>:</span></label>
                <input
                type='text'
                name='PanNumber'
                value={BankDetailesState.PanNumber}
                onChange={HandeleOnchangeBank}
                />

            </div>

        </div> 
        </>
        }


    <br/>
    <div className="Main_container_Btn">
        <button onClick={Saveledgerdata}>
           {LedgerMasterEdit?.id ? 'Update' : 'Save'}
        </button>
    </div>

    </div>
    
        
    <ToastAlert Message={toast.message} Type={toast.type} />
      
    </>
  )
}

export default FinanceLedgerMaster;
