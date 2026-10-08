
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';

const SingleLedgerList = () => {

    const navigate = useNavigate()

    const dispatchvalue = useDispatch();

    const LedgerMasterEdit = useSelector((state) => state.Financedata?.FinanceLedgerMasterEdit);

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    
    const toast = useSelector(state => state.userRecord?.toast);
    
    console.log('LedgerMasterEdit',LedgerMasterEdit);

    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];

    
    const currentYear = today.getFullYear();
    const aprilFirstDateLastYear = new Date(Date.UTC(currentYear - 1, 3, 1));
    const formattedDate = aprilFirstDateLastYear.toISOString().split('T')[0];

    const [SerchOptions,setSerchOptions] =useState({
        FromDate:formattedDate,
        ToDate:currentDate,
    })


    const[NetTotalAmount,setNetTotalAmount]=useState({
            DebitTotalAmount:0,
            CreditTotalAmount:0
        })

    const [Closingbalance,setClosingbalance]=useState('')
    
    console.log('SerchOptions',SerchOptions);

    const [getvouchersdata,setgetvouchersdata]=useState([])
    
    
    const HandeleOnchange =(e)=>{
    
        const {name,value}=e.target;

            setSerchOptions((prev) => ({
                ...prev,
                [name]:value, 
                }));
        
                
    }



    useEffect(()=>{

        if(UrlLink && Object.keys(LedgerMasterEdit).length !==0 && Object.keys(SerchOptions).length !==0)
        {
            let senddata={
                LedgerMasterId:LedgerMasterEdit?.id,
                ...SerchOptions,
            }

            axios.get(`${UrlLink}finance/getsingleledgeralldata`,{
                params:senddata
            })
            .then((res)=>{
                console.log('88888',res.data); 
                let getdata=res.data 
                if(getdata && Array.isArray(getdata) && getdata.length !==0){
                    setgetvouchersdata(getdata)
                }   
                else{
                    setgetvouchersdata([])
                }            
            })
            .catch((err)=>{
                console.log(err);                
            })
            
        }

    },[UrlLink,LedgerMasterEdit,SerchOptions])



    useEffect(()=>{

        if(getvouchersdata && getvouchersdata.length !==0){
          setNetTotalAmount({
                DebitTotalAmount:getvouchersdata.reduce((num,ele)=> num+=+ele.Debit,0).toFixed(2),
                CreditTotalAmount:getvouchersdata.reduce((num,ele)=> num+=+ele.Credit,0).toFixed(2),
            }) 
        }

    },[getvouchersdata])


    useEffect(()=>{
        if(LedgerMasterEdit && Object.keys(LedgerMasterEdit).length !==0 && (NetTotalAmount.DebitTotalAmount !==0 ||  NetTotalAmount.CreditTotalAmount !==0)){

            console.log('NetTotalAmount',NetTotalAmount,LedgerMasterEdit.OpeningBalance);

            let splitopning=+LedgerMasterEdit.OpeningBalance.split(' ')[0]

            let splitopning_CrDr=LedgerMasterEdit.OpeningBalance.split(' ')[1]

            console.log('splitopning',splitopning,splitopning_CrDr);

            let closebal

            if(splitopning_CrDr === 'Dr' && (splitopning + +NetTotalAmount.DebitTotalAmount) >=  NetTotalAmount.CreditTotalAmount)
            {
                closebal= (+splitopning + (NetTotalAmount.DebitTotalAmount - NetTotalAmount.CreditTotalAmount)).toFixed(2) + ' ' + 'Dr'
            }
            else if(splitopning_CrDr === 'Dr' && (splitopning + +NetTotalAmount.DebitTotalAmount) <=  NetTotalAmount.CreditTotalAmount){
                
                closebal= (+NetTotalAmount.CreditTotalAmount - (NetTotalAmount.DebitTotalAmount + +splitopning ) ).toFixed(2) + ' ' + 'Cr'
            }
            else if(splitopning_CrDr === 'Cr' && (splitopning + +NetTotalAmount.CreditTotalAmount)  >=  NetTotalAmount.DebitTotalAmount){
                
                closebal= (+splitopning + (NetTotalAmount.CreditTotalAmount - NetTotalAmount.DebitTotalAmount) ).toFixed(2) + ' ' + 'Cr'
            }
            else if(splitopning_CrDr === 'Cr' && (splitopning + +NetTotalAmount.CreditTotalAmount)   <=   NetTotalAmount.DebitTotalAmount){
                
                closebal=  (NetTotalAmount.DebitTotalAmount - (NetTotalAmount.CreditTotalAmount + +splitopning) ).toFixed(2) + ' ' + 'Dr'
            }

            setClosingbalance(closebal || '')
            
        }

    },[LedgerMasterEdit,NetTotalAmount])




    const ViewVocherDetailes =(item)=>{

        console.log('item gettt',item.VoucherNo);

        let voucherType = item.VoucherNo.startsWith('CON') ? 'ContraVoucher' :
        item.VoucherNo.startsWith('PAY') ? 'PaymentVoucher' :
        item.VoucherNo.startsWith('REC') ? 'ReceiptVoucher' :
        item.VoucherNo.startsWith('JOU') ? 'JournalVoucher' :
        item.VoucherNo.startsWith('SAL') ? 'SalesVoucher' :
        item.VoucherNo.startsWith('PUR') ? 'PurchaseVoucher' :
        item.VoucherNo.startsWith('CRE') ? 'CreditNoteVoucher' : 'DebitNoteVoucher';

        let senddata={
            VoucherNo:item.VoucherNo,
            voucherType:voucherType
        }

        axios.get(`${UrlLink}finance/getsinglevoucherbyinvoicenumber`,{
            params:senddata
        })
        .then((res)=>{
            console.log('kkkkk',res.data);

            let getdata = res?.data

            if(getdata && Object.keys(getdata).length !==0){
                
                    console.log(getdata);

                    let {Debit,Credit,...rest} = getdata;

                    let reduxsenddata={
                        ...rest,
                    }
                    
                dispatchvalue({ type:'FinanceVouchersEdit', value: reduxsenddata });
        
                if(senddata.voucherType === 'ContraVoucher'){
                    navigate('/Home/ContraVoucher');
                }
                else if(senddata.voucherType === 'PaymentVoucher'){
                    navigate('/Home/PaymentVoucher');
                }
                else if(senddata.voucherType === 'ReceiptVoucher'){
                    navigate('/Home/ReceiptVoucher');
                }
                else if(senddata.voucherType === 'JournalVoucher'){
                    navigate('/Home/JournalVoucher');
                }
                else if(senddata.voucherType === 'SalesVoucher'){
                    navigate('/Home/SalesVoucher');
                }
                else if(senddata.voucherType === 'PurchaseVoucher'){
                    navigate('/Home/PurchaseVoucher');
                }
                else if(senddata.voucherType === 'CreditNoteVoucher'){
                    navigate('/Home/CreditNoteVoucher');
                }
                else if(senddata.voucherType === 'DebitNoteVoucher'){
                    navigate('/Home/DebitNoteVoucher');
                }
            }
            else{
                const tdata = {
                    message: 'There is no data to view.',
                    type: 'warn'
                };
                dispatchvalue({ type: 'toast', value: tdata });
            }

        })
        .catch((err)=>{
            console.log(err);            
        })
        

    }



  return (
    <>
    <div className="Main_container_app">
            <h3>Voucher List</h3>

        
            <br/>
        <div className="RegisFormcon_1" >
        
        <div className="RegisForm_1" style={{justifyContent:'center'}}>
            <label>Ledger Name<span>:</span></label>
            <span style={{fontSize:'20px'}}>{LedgerMasterEdit?.LedgerName} </span>
                       
        </div>



        
        


              
              
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
        {getvouchersdata.length !==0 &&  <div className="for">
              <div className="Selected-table-container">
                  <table className="selected-medicine-table2">
                      <thead>
                          <tr>
                              <th id="slectbill_ins" style={{ width: "100px" }}>S.No</th>
                              <th id="slectbill_ins" style={{ width: "140px" }}>Date</th>
                              <th id="slectbill_ins" style={{ width: "140px" }}>Voucher No</th>
                              <th id="slectbill_ins" style={{ width: "350px" }}>Particulars</th>
                              <th id="slectbill_ins" style={{ width: "140px" }}>Debit</th>
                              <th id="slectbill_ins" style={{ width: "140px" }}>Credit</th>
                          </tr>
                      </thead>
                      <tbody>
                          {getvouchersdata.length !==0 &&  getvouchersdata.map((item, index) => (
                              <tr key={index}>
                                  <td style={{ width: "100px" }}>{item.id}</td>
                                  <td style={{ width: "140px" }}>{item.VoucherDate}</td>
                                  <td style={{ width: "140px" ,cursor:'pointer'}} className="cell_btn" onClick={()=>ViewVocherDetailes(item)} >{item.VoucherNo}</td>
                                  <td style={{ width: "350px" }}>
                                  {item?.Particulars && item?.Particulars.length === 1 ?
                                    item?.Particulars[0]?.Particulars                                  
                                   :
                                   <>
                                   (as per details)
                                   {item?.Particulars.map((part, i) => (
                                    <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                                        
                                      <div style={{ textAlign: "left" }}> 
                                        {part.Particulars}
                                      </div>
                                      <div style={{ textAlign: "right" }}>
                                        {part.Debit ? part.Debit : part.Credit ? part.Credit : ""}
                                      </div>
                                    </div>
                                  ))}
                                  </>
                                    }
                                  </td>
                                  <td style={{ width: "140px" }}>{+item.Debit || ''}</td>
                                  <td style={{ width: "140px" }}>{+item.Credit || ''}</td>
                              </tr>
                          ))}
                      </tbody>

                      <tfoot>
                      <tr>
                      <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>Opening Balance:</td>
                      {LedgerMasterEdit?.DebitOrCredit  === 'Dr' ?
                       <>
                      <td style={{ width: "140px", fontWeight: "bold" }}>
                        {LedgerMasterEdit?.OpeningBalance}
                      </td>
                      <td style={{ width: "140px", fontWeight: "bold" }}>
                      </td>
                      </>
                      :
                      <>
                      <td style={{ width: "140px", fontWeight: "bold" }}>
                      </td>
                      <td style={{ width: "140px", fontWeight: "bold" }}>
                        {LedgerMasterEdit?.OpeningBalance}
                      </td>
                      </>
                      }
                      
                    </tr>

                    <tr>
                      <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>Current Total:</td>
                      <td style={{ width: "140px", fontWeight: "bold" }}>
                        {NetTotalAmount.DebitTotalAmount}
                      </td>
                      <td style={{ width: "140px", fontWeight: "bold" }}>
                        {NetTotalAmount.CreditTotalAmount}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>Closing Balance:</td>
                      {Closingbalance && typeof Closingbalance === 'string' && Closingbalance?.split(' ')[1]  === 'Dr' ?
                       <>
                      <td style={{ width: "140px", fontWeight: "bold" }}>
                        {Closingbalance}
                      </td>
                      <td style={{ width: "140px", fontWeight: "bold" }}>
                      </td>
                      </>
                      :
                      <>
                      <td style={{ width: "140px", fontWeight: "bold" }}>
                      </td>
                      <td style={{ width: "140px", fontWeight: "bold" }}>
                        {Closingbalance}
                      </td>
                      </>
                      }
                      
                    </tr>

                  </tfoot>
                  </table>
              </div>
          </div>}
        
        <br/>
        <br/>

      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  )
}

export default SingleLedgerList;