
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';



const DayBook = () => {

    const navigate = useNavigate()

    const dispatchvalue = useDispatch();

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    
    const toast = useSelector(state => state.userRecord?.toast);
    


    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];

    
    const currentYear = today.getFullYear();
    const aprilFirstDateLastYear = new Date(Date.UTC(currentYear - 1, 3, 1));
    const formattedDate = aprilFirstDateLastYear.toISOString().split('T')[0];


    const [SerchOptions,setSerchOptions] =useState({
        VouchersType:'',
        FromDate:formattedDate,
        ToDate:currentDate,
        })
    
    const[DaybookArr,setdaybookArr]=useState([])

    const HandeleOnchange =(e)=>{
    
        const {name,value}=e.target

        setSerchOptions((prev) => ({
            ...prev,
            [name]:value, 
            }));
        

    }



    useEffect(()=>{

        axios.get(`${UrlLink}finance/getdaybookforallvouchers`,{
            params:SerchOptions
        })
        .then((res)=>{
            console.log('vvvvv',res.data); 
            let getdata=res?.data
            if(getdata && Array.isArray(getdata) && getdata.length !==0){
                setdaybookArr(getdata)
            }
            else{
                setdaybookArr([])
            }
        })
        .catch((err)=>{
            console.log(err);            
        })

    },[UrlLink,SerchOptions])



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
    <h3>Day Book</h3>

    <br/>
        <div className="RegisFormcon_1" >

            <div className="RegisForm_1">
            <label>Vouchers Type<span>:</span></label>
            <select
             name='VouchersType'
             value={SerchOptions.VouchersType}
             onChange={HandeleOnchange}
            >
            <option value=''>Select</option>
            <option value='Contra'>Contra</option>
            <option value='Payment'>Payment</option>
            <option value='Receipt'>Receipt</option>
            <option value='Journal'>Journal</option>
            <option value='Sales'>Sales</option>
            <option value='Purchase'>Purchase</option>
            <option value='CreditNote'>CreditNote</option>
            <option value='DebitNote'>DebitNote</option>
            </select>
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


        {DaybookArr.length !==0 &&  <div className="for">
              <div className="Selected-table-container">
                  <table className="selected-medicine-table2">
                      <thead>
                          <tr>
                              <th id="slectbill_ins" style={{ width: "100px" }}>S.No</th>
                              <th id="slectbill_ins" style={{ width: "140px" }}>Date</th>
                              <th id="slectbill_ins" style={{ width: "350px" }}>Particulars</th>
                              <th id="slectbill_ins" style={{ width: "140px" }}>Voucher Type</th>
                              <th id="slectbill_ins" style={{ width: "140px" }}>Voucher No</th>
                              <th id="slectbill_ins" style={{ width: "140px" }}>Debit</th>
                              <th id="slectbill_ins" style={{ width: "140px" }}>Credit</th>
                          </tr>
                      </thead>
                      <tbody>
                          {DaybookArr.length !==0 &&  DaybookArr.map((item, index) => (
                              <tr key={index}>
                                  <td style={{ width: "100px" }}>{item.id}</td>
                                  <td style={{ width: "140px" }}>{item.VoucherDate}</td>                                  
                                  <td style={{ width: "350px" }}>{item?.Particulars}</td>
                                  <td style={{ width: "140px" }}>{item.VouchersType}</td>
                                  <td style={{ width: "140px" ,cursor:'pointer'}} className="cell_btn" 
                                  onClick={()=>ViewVocherDetailes(item)} >{item.VoucherNo}</td>
                                  <td style={{ width: "140px" }}>{+item.Debit || ''}</td>
                                  <td style={{ width: "140px" }}>{+item.Credit || ''}</td>
                              </tr>
                          ))}
                      </tbody>

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

export default DayBook;