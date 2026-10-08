
// import axios from 'axios';
// import React, { useCallback, useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
// import TrialBalance from './TrialBalance';



// const CashBook = () => {


//     const navigate = useNavigate()

//     const dispatchvalue = useDispatch();

//     const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    
//     const toast = useSelector(state => state.userRecord?.toast);
    


//     const today = new Date();
//     const currentDate = today.toISOString().split('T')[0];

    
//     const currentYear = today.getFullYear();
//     const aprilFirstDateLastYear = new Date(Date.UTC(currentYear - 1, 3, 1));
//     const formattedDate = aprilFirstDateLastYear.toISOString().split('T')[0];


//     const [SerchOptions,setSerchOptions] =useState({
//         VouchersType:'',
//         FromDate:formattedDate,
//         ToDate:currentDate,
//         })

//      const[DebitNetTotalAmount,setDebitNetTotalAmount]=useState(0)
//      const[CreditNetTotalAmount,setCreditNetTotalAmount]=useState(0)
     
//      const[closingbal,setclosingbal]=useState({
//         ViewSide:'',
//         Balanceamount:0,
//      })
    
//     const[Cashbookarr,setCashbookarr]=useState([])


//     const HandeleOnchange =(e)=>{
    
//         const {name,value}=e.target

//         setSerchOptions((prev) => ({
//             ...prev,
//             [name]:value, 
//             }));
        

//     }



//     useEffect(()=>{

//         axios.get(`${UrlLink}finance/getcashbookforallvouchers`,{
//             params:SerchOptions
//         })
//         .then((res)=>{
//             console.log('SSSS33',res.data); 
//             let getdata=res?.data
//             if(getdata && Array.isArray(getdata) && getdata.length !==0){

//                 setCashbookarr(getdata)              
//             }
//             else{
//                 setCashbookarr([])
//             }
//         })
//         .catch((err)=>{
//             console.log(err);            
//         })

//     },[UrlLink,SerchOptions])



//     useEffect(() => {
//         const calculateTotals = () => {
//             const Loc_DebitNetTotalAmount =Cashbookarr.length >0 ? Cashbookarr?.reduce((sum, item) => sum + parseFloat(item.Debit || 0), 0).toFixed(2) : 0
//             const Loc_CreditNetTotalAmount = Cashbookarr.length >0 ? Cashbookarr?.reduce((sum, item) => sum + parseFloat(item.Credit || 0), 0).toFixed(2) : 0
    
//             if (Loc_DebitNetTotalAmount && Loc_CreditNetTotalAmount) {
//                 const debitTotal = parseFloat(Loc_DebitNetTotalAmount);
//                 const creditTotal = parseFloat(Loc_CreditNetTotalAmount);
    
//                 if (debitTotal > creditTotal) {
//                     const diff = debitTotal - creditTotal;
    
//                     setclosingbal({
//                         ViewSide: 'Credit',
//                         Balanceamount: diff,
//                     });
    
//                     setDebitNetTotalAmount(debitTotal.toFixed(2));
//                     setCreditNetTotalAmount((creditTotal + diff).toFixed(2));
//                 } else if (creditTotal > debitTotal) {
//                     const diff = creditTotal - debitTotal;
    
//                     setclosingbal({
//                         ViewSide: 'Debit',
//                         Balanceamount: diff,
//                     });
    
//                     setDebitNetTotalAmount((debitTotal + diff).toFixed(2));
//                     setCreditNetTotalAmount(creditTotal.toFixed(2));
//                 }
//             }
//         };
    
//         if(Cashbookarr && Cashbookarr.length !==0){
//         calculateTotals();
//         }
//     }, [Cashbookarr]);


//     const ViewVocherDetailes =(item)=>{

//         console.log('item gettt',item.VoucherNo);

//         let voucherType = item.VoucherNo.startsWith('CON') ? 'ContraVoucher' :
//         item.VoucherNo.startsWith('PAY') ? 'PaymentVoucher' :
//         item.VoucherNo.startsWith('REC') ? 'ReceiptVoucher' :
//         item.VoucherNo.startsWith('JOU') ? 'JournalVoucher' :
//         item.VoucherNo.startsWith('SAL') ? 'SalesVoucher' :
//         item.VoucherNo.startsWith('PUR') ? 'PurchaseVoucher' :
//         item.VoucherNo.startsWith('CRE') ? 'CreditNoteVoucher' : 'DebitNoteVoucher';

//         let senddata={
//             VoucherNo:item.VoucherNo,
//             voucherType:voucherType
//         }

//         axios.get(`${UrlLink}finance/getsinglevoucherbyinvoicenumber`,{
//             params:senddata
//         })
//         .then((res)=>{
//             console.log('kkkkk',res.data);

//             let getdata = res?.data

//             if(getdata && Object.keys(getdata).length !==0){
                
//                     console.log(getdata);

//                     let {Debit,Credit,...rest} = getdata;

//                     let reduxsenddata={
//                         ...rest,
//                     }
                    
//                 dispatchvalue({ type:'FinanceVouchersEdit', value: reduxsenddata });
        
//                 if(senddata.voucherType === 'ContraVoucher'){
//                     navigate('/Home/ContraVoucher');
//                 }
//                 else if(senddata.voucherType === 'PaymentVoucher'){
//                     navigate('/Home/PaymentVoucher');
//                 }
//                 else if(senddata.voucherType === 'ReceiptVoucher'){
//                     navigate('/Home/ReceiptVoucher');
//                 }
//                 else if(senddata.voucherType === 'JournalVoucher'){
//                     navigate('/Home/JournalVoucher');
//                 }
//                 else if(senddata.voucherType === 'SalesVoucher'){
//                     navigate('/Home/SalesVoucher');
//                 }
//                 else if(senddata.voucherType === 'PurchaseVoucher'){
//                     navigate('/Home/PurchaseVoucher');
//                 }
//                 else if(senddata.voucherType === 'CreditNoteVoucher'){
//                     navigate('/Home/CreditNoteVoucher');
//                 }
//                 else if(senddata.voucherType === 'DebitNoteVoucher'){
//                     navigate('/Home/DebitNoteVoucher');
//                 }
//             }
//             else{
//                 const tdata = {
//                     message: 'There is no data to view.',
//                     type: 'warn'
//                 };
//                 dispatchvalue({ type: 'toast', value: tdata });
//             }

//         })
//         .catch((err)=>{
//             console.log(err);            
//         })
        

//     }


  
//     return (
//     <>
//     <div className="Main_container_app">
//         <h3>Cash Book</h3>

//         <br/>
//         <div className="RegisFormcon_1" >

            
//         <div className="RegisForm_1">
//               <label>From Date<span>:</span></label>
//               <input
//                 type='date'
//                 name='FromDate'
//                 value={SerchOptions.FromDate}
//                 onChange={HandeleOnchange}
//                 />
                
//               </div>


//               <div className="RegisForm_1">
//               <label>To Date<span>:</span></label>
//               <input
//                 type='date'
//                 name='ToDate'
//                 value={SerchOptions.ToDate}
//                 onChange={HandeleOnchange}
//                 min={SerchOptions.FromDate}
//                 />
                
//               </div>


//         </div>

//         <br/>

//         {Cashbookarr.length !==0 &&  <div className="for">
//               <div className="Selected-table-container">
//                   <table className="selected-medicine-table2">
//                       <thead>
//                           <tr>
//                               <th id="slectbill_ins" style={{ width: "100px" }}>S.No</th>
//                               <th id="slectbill_ins" style={{ width: "140px" }}>Date</th>
//                               <th id="slectbill_ins" style={{ width: "350px" }}>Particulars</th>
//                               <th id="slectbill_ins" style={{ width: "140px" }}>Voucher No</th>
//                               <th id="slectbill_ins" style={{ width: "140px" }}>Debit</th>
//                               <th id="slectbill_ins" style={{ width: "140px" }}>Credit</th>
//                           </tr>
//                       </thead>
//                       <tbody>
//                           {Cashbookarr.length !==0 &&  Cashbookarr.map((item, index) => (
//                               <tr key={index}>
//                                   <td style={{ width: "100px",height:'30px'}}>{item.id}</td>
//                                   <td style={{ width: "140px",height:'30px'}}>{item.VoucherDate}</td>                                  
//                                   <td style={{ width: "350px",height:'30px'}}>{item?.Particulars[0].Particulars}</td>
//                                   <td style={{ width: "140px",height:'30px',cursor:'pointer'}} className="cell_btn" 
//                                   onClick={()=>ViewVocherDetailes(item)} >{item.VoucherNo}</td>
//                                   <td style={{ width: "140px",height:'30px'}}>{+item.Debit || ''}</td>
//                                   <td style={{ width: "140px",height:'30px'}}>{+item.Credit || ''}</td>
//                               </tr>
//                           ))}
                         
                        
//                          <tr>
//                             <td style={{height:'30px' }} ></td>
//                             <td style={{height:'30px' }} ></td>
//                             <td style={{height:'30px' }} ></td>
//                             <td style={{height:'30px' }} ></td>
//                             <td style={{height:'30px' }} ></td>
//                             <td style={{height:'30px' }} ></td>
//                           </tr>

//                           {closingbal.Balanceamount && 
//                           <>
//                           <tr>
//                             <td style={{height:'30px' }} ></td>
//                             <td style={{height:'30px' }} ></td>
//                             <td style={{height:'30px' }} ></td>
//                             <td style={{height:'30px',fontWeight: "bold" }} >Total</td>
//                             <td style={{height:'30px' }} >{closingbal.ViewSide === 'Debit' ? +DebitNetTotalAmount - +closingbal.Balanceamount : ''}</td>
//                             <td style={{height:'30px' }} >{closingbal.ViewSide === 'Credit' ? +CreditNetTotalAmount - +closingbal.Balanceamount : ''}</td>
//                           </tr>

//                           <tr>
//                             <td style={{height:'30px' }} ></td>
//                             <td style={{height:'30px' }} ></td>
//                             <td style={{height:'30px' }} ></td>
//                             <td style={{height:'30px' }} ></td>
//                             <td style={{height:'30px' }} ></td>
//                             <td style={{height:'30px' }} ></td>
//                           </tr>

//                           <tr>
//                             <td style={{height:'30px' }} ></td>
//                             <td style={{height:'30px' }} ></td>
//                             <td style={{height:'30px' }} ></td>
//                             <td style={{height:'30px',fontWeight: "bold" }} >Balance c/f</td>
//                             <td style={{height:'30px' }} >{closingbal.ViewSide === 'Debit' ? closingbal.Balanceamount : ''}</td>
//                             <td style={{height:'30px' }} >{closingbal.ViewSide === 'Credit' ? closingbal.Balanceamount : ''}</td>
//                           </tr>
//                           </>}                         

//                       </tbody>

//                       <tfoot>

//                     <tr>
//                       <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>Grand Total:</td>
//                       <td style={{ width: "140px", fontWeight: "bold" }}>
//                         {DebitNetTotalAmount +' '+ 'Dr'} 
//                       </td>
//                       <td style={{ width: "140px", fontWeight: "bold" }}>
//                         {CreditNetTotalAmount +' '+ 'Cr'} 
//                       </td>
//                     </tr>

//                     <tr>
//                       <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>Closing Balance:</td>
                
//                       <td colSpan="6" style={{ width: "140px", fontWeight: "bold" }}>
//                       {closingbal.ViewSide === 'Credit' ? closingbal.Balanceamount.toFixed(2) + ' '+'Dr' :closingbal.Balanceamount+' '+'Cr'}
//                       </td>
//                     </tr>

//                   </tfoot>

//                   </table>
//               </div>
//           </div>}

        
//         <br/>
//         <br/>

//     </div>
//     </>
//   )
// }

// export default CashBook;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CashBook = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);

  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];
  const currentYear = today.getFullYear();
  const aprilFirstDateLastYear = new Date(Date.UTC(currentYear - 1, 3, 1));
  const formattedDate = aprilFirstDateLastYear.toISOString().split('T')[0];

  const [searchOptions, setSearchOptions] = useState({
    VouchersType: '',
    FromDate: formattedDate,
    ToDate: currentDate,
  });

  const [debitTotal, setDebitTotal] = useState(0);
  const [creditTotal, setCreditTotal] = useState(0);
  const [closingBal, setClosingBal] = useState({ ViewSide: '', Balanceamount: 0 });
  const [cashBookArr, setCashBookArr] = useState([]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSearchOptions(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchCashbook = async () => {
      try {
        const res = await axios.get(`${UrlLink}finance/getcashbookforallvouchers`, {
          params: searchOptions,
        });

        const getData = res?.data;
        if (Array.isArray(getData) && getData.length > 0) {
          setCashBookArr(getData);
        } else {
          setCashBookArr([]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (UrlLink) fetchCashbook();
  }, [UrlLink, searchOptions]);

  useEffect(() => {
    if (cashBookArr && cashBookArr.length > 0) {
      const debitSum = cashBookArr.reduce((sum, item) => sum + parseFloat(item.Debit || 0), 0);
      const creditSum = cashBookArr.reduce((sum, item) => sum + parseFloat(item.Credit || 0), 0);

      let viewSide = '';
      let balanceAmount = 0;

      if (debitSum > creditSum) {
        viewSide = 'Credit';
        balanceAmount = debitSum - creditSum;
        setDebitTotal(debitSum.toFixed(2));
        setCreditTotal((creditSum + balanceAmount).toFixed(2));
      } else if (creditSum > debitSum) {
        viewSide = 'Debit';
        balanceAmount = creditSum - debitSum;
        setDebitTotal((debitSum + balanceAmount).toFixed(2));
        setCreditTotal(creditSum.toFixed(2));
      } else {
        setDebitTotal(debitSum.toFixed(2));
        setCreditTotal(creditSum.toFixed(2));
      }

      setClosingBal({ ViewSide: viewSide, Balanceamount: balanceAmount });
    }
  }, [cashBookArr]);

  const viewVoucherDetails = (item) => {
    const voucherType = item.VoucherNo.startsWith('CON') ? 'ContraVoucher' :
      item.VoucherNo.startsWith('PAY') ? 'PaymentVoucher' :
      item.VoucherNo.startsWith('REC') ? 'ReceiptVoucher' :
      item.VoucherNo.startsWith('JOU') ? 'JournalVoucher' :
      item.VoucherNo.startsWith('SAL') ? 'SalesVoucher' :
      item.VoucherNo.startsWith('PUR') ? 'PurchaseVoucher' :
      item.VoucherNo.startsWith('CRE') ? 'CreditNoteVoucher' : 'DebitNoteVoucher';

    const sendData = {
      VoucherNo: item.VoucherNo,
      voucherType: voucherType
    };

    axios.get(`${UrlLink}finance/getsinglevoucherbyinvoicenumber`, { params: sendData })
      .then((res) => {
        const data = res?.data;
        if (data && Object.keys(data).length > 0) {
          const { Debit, Credit, ...rest } = data;
          dispatch({ type: 'FinanceVouchersEdit', value: rest });

          navigate(`/Home/${voucherType}`);
        } else {
          dispatch({
            type: 'toast',
            value: { message: 'There is no data to view.', type: 'warn' }
          });
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="Main_container_app">
      <h3>Cash Book</h3>

      <div className="RegisFormcon_1">
        <div className="RegisForm_1">
          <label>From Date<span>:</span></label>
          <input
            type="date"
            name="FromDate"
            value={searchOptions.FromDate}
            onChange={handleOnChange}
          />
        </div>

        <div className="RegisForm_1">
          <label>To Date<span>:</span></label>
          <input
            type="date"
            name="ToDate"
            value={searchOptions.ToDate}
            min={searchOptions.FromDate}
            onChange={handleOnChange}
          />
        </div>
      </div>

      <br />

      {Array.isArray(cashBookArr) && cashBookArr.length > 0 && (
        <div className="for">
          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th style={{ width: "100px" }}>S.No</th>
                  <th style={{ width: "140px" }}>Date</th>
                  <th style={{ width: "350px" }}>Particulars</th>
                  <th style={{ width: "140px" }}>Voucher No</th>
                  <th style={{ width: "140px" }}>Debit</th>
                  <th style={{ width: "140px" }}>Credit</th>
                </tr>
              </thead>
              <tbody>
                {cashBookArr.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.VoucherDate}</td>
                    <td>
                      {Array.isArray(item.Particulars) && item.Particulars.length > 0
                        ? item.Particulars.map((part, i) => (
                            <div key={i}>{part.Particulars}</div>
                          ))
                        : ''}
                    </td>
                    <td
                      className="cell_btn"
                      style={{ cursor: 'pointer' }}
                      onClick={() => viewVoucherDetails(item)}
                    >
                      {item.VoucherNo}
                    </td>
                    <td>{+item.Debit || ''}</td>
                    <td>{+item.Credit || ''}</td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={4} style={{ textAlign: "right", fontWeight: "bold" }}>Total</td>
                  <td>
                    {closingBal.ViewSide === 'Debit'
                      ? (+debitTotal - closingBal.Balanceamount).toFixed(2)
                      : debitTotal}
                  </td>
                  <td>
                    {closingBal.ViewSide === 'Credit'
                      ? (+creditTotal - closingBal.Balanceamount).toFixed(2)
                      : creditTotal}
                  </td>
                </tr>

                <tr>
                  <td colSpan={4} style={{ textAlign: "right", fontWeight: "bold" }}>Balance c/f</td>
                  <td>{closingBal.ViewSide === 'Debit' ? closingBal.Balanceamount.toFixed(2) : ''}</td>
                  <td>{closingBal.ViewSide === 'Credit' ? closingBal.Balanceamount.toFixed(2) : ''}</td>
                </tr>
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>Grand Total:</td>
                  <td style={{ fontWeight: "bold" }}>{debitTotal} Dr</td>
                  <td style={{ fontWeight: "bold" }}>{creditTotal} Cr</td>
                </tr>
                <tr>
                  <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>Closing Balance:</td>
                  <td colSpan="2" style={{ fontWeight: "bold" }}>
                    {closingBal.ViewSide === 'Credit'
                      ? `${closingBal.Balanceamount.toFixed(2)} Dr`
                      : `${closingBal.Balanceamount.toFixed(2)} Cr`}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashBook;
