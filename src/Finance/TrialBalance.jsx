import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';
import "./FinanceReport.css";





const TrialBalance = () => {

    const dispatchvalue = useDispatch();

    const navigate = useNavigate()
    

  
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const toast = useSelector(state => state.userRecord?.toast);
    
    const[Trialbalancearr,setTrialbalancearr]=useState([])

    const [GroupTotal,setGroupTotal]=useState({
      GroupDebitTotal:0,
      GroupCreditTotal:0,
      DiffrentDebitamount:0,
      DiffrentCreditamount:0
    })

useEffect(()=>{
    axios.get(`${UrlLink}finance/gettrialbalance`)
    .then((res)=>{console.log('0000--11',res.data);
      let getdata=res.data

      if(getdata && Array.isArray(getdata) && getdata.length !==0){
        setTrialbalancearr(getdata)
      }

    })
    .catch((err)=>{console.log(err);
    })
},[UrlLink])



useEffect(()=>{

  if(Trialbalancearr && Array.isArray(Trialbalancearr) && Trialbalancearr.length !==0)
  {

    let TotalDebit = Trialbalancearr.reduce((num,ele)=> num+= +ele.TotalDebit,0).toFixed(2) || 0
    let TotalCredit =Trialbalancearr.reduce((num,ele)=> num+= +ele.TotalCredit,0).toFixed(2) || 0
    

    if(TotalDebit === TotalCredit){
      setGroupTotal((prev)=>({
        ...prev,
        GroupDebitTotal:TotalDebit,
        GroupCreditTotal:TotalCredit
      }))
    }
    else{

      let diffamount=+TotalDebit > +TotalCredit ? +TotalDebit - +TotalCredit : +TotalCredit - +TotalDebit

      setGroupTotal((prev)=>({
        ...prev,
        GroupDebitTotal: +TotalCredit > +TotalDebit ? (+diffamount + +TotalDebit).toFixed(2): TotalDebit,
        GroupCreditTotal: +TotalDebit > +TotalCredit ? (+diffamount + +TotalCredit).toFixed(2) : TotalCredit,
        DiffrentDebitamount:+TotalDebit > +TotalCredit ? diffamount : 0,
        DiffrentCreditamount:+TotalCredit > +TotalDebit ? diffamount : 0
      }))

    }
  }

},[Trialbalancearr])






const MovieToListPage=(row)=>{

  console.log('---)))0000row',row);

  let {
    id,
    ledgerid,
    LedgerName,
    OpeningBalance,
    DebitOrCredit,
    ledger_Debit,
    ledger_Credit,
    Debit,
    Credit,
    ClosingBalance,
    NatureOfGroupId} =row;

  let sendObj ={
    id:ledgerid,
    LedgerName:LedgerName,
    NatureOfgroupId:NatureOfGroupId,
    OpeningBalance:OpeningBalance + ' ' + DebitOrCredit,
    DebitOrCredit:DebitOrCredit,
    Debit:ledger_Debit,
    Credit:ledger_Credit,
    ClosingBalance:ClosingBalance
  }

  if(sendObj && Object.keys(sendObj).length !==0)
  {
    dispatchvalue({ type: 'FinanceLedgerMasterEdit', value: sendObj })
    navigate('/Home/SingleLedgerList');
  }

}
  
  return (
  <>
  <div className="Main_container_app">
  <h3>Trial Balance</h3>

  <div className="Selected-table-container">
  {Trialbalancearr && (
  <table className="selected-medicine-table25">
    <thead>
      <tr>
        <th id="slectbill_ins" style={{ width: "140px", height: "30px" }}>Particulars</th>
        <th id="slectbill_ins" style={{ width: "140px" }}>Opening Balance</th>
        <th id="slectbill_ins" style={{ width: "40px", height: "30px" }}>Debit</th>
        <th id="slectbill_ins" style={{ width: "40px", height: "30px" }}>Credit</th>
        <th id="slectbill_ins" style={{ width: "140px" }}>Closing Balance</th>
      </tr>
    </thead>                                             
    <tbody>
      {Trialbalancearr.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>{group.GroupName}</td>
            <td style={{ fontWeight: "bold", textAlign: "right" }}>{group.OpeningBalance}</td>
            <td style={{ fontWeight: "bold", textAlign: "right" }}>{group.TotalDebit}</td>
            <td style={{ fontWeight: "bold", textAlign: "right" }}>{group.TotalCredit}</td>
            <td style={{ fontWeight: "bold", textAlign: "right" }}>{group.TotalDebit > group.TotalCredit ? group.TotalDebit - group.TotalCredit +' '+ "Dr" : group.TotalCredit - group.TotalDebit +' '+ "Cr" }</td>
          </tr>

          {group.ledgerarr && group.ledgerarr?.map((ledger, ledgerIndex) => (
            <tr key={`ledger-${groupIndex}-${ledgerIndex}`}>
              <td style={{ cursor: 'pointer', textAlign: 'right' }} className="cell_btn" onClick={() => MovieToListPage(ledger)}>{ledger.LedgerName}</td>
              <td style={{ textAlign: 'left' }}>{+ledger.OpeningBalance !== 0 ? ledger.OpeningBalance + ' ' + ledger.DebitOrCredit : +ledger.OpeningBalance}</td>
              <td style={{ textAlign: 'left' }}>{ledger.ledger_Debit || 0}</td>
              <td style={{ textAlign: 'left' }}>{ledger.ledger_Credit || 0}</td>
              <td style={{ textAlign: 'left' }}>{ledger.ClosingBalance || 0}</td>
            </tr>
          ))}

          {group.SubGroup && group.SubGroup?.map((subGroup, subIndex) => (
            <React.Fragment key={`subgroup-${groupIndex}-${subIndex}`}>
              <tr>
                <td style={{ textAlign: "center"}}>{subGroup.GroupName}</td>
                <td style={{ textAlign: "right"}}>{subGroup.OpeningBalance}</td>
                <td style={{ textAlign: "right" }}>{subGroup.TotalDebit}</td>
                <td style={{ textAlign: "right" }}>{subGroup.TotalCredit}</td>
                <td style={{ textAlign: "right" }}>{subGroup.TotalDebit > subGroup.TotalCredit ? subGroup.TotalDebit - subGroup.TotalCredit +' '+ "Dr" : subGroup.TotalCredit - subGroup.TotalDebit +' '+ "Cr" }</td>
              </tr>

              {subGroup.ledgerarr && subGroup.ledgerarr?.map((subLedger, subLedgerIndex) => (
                <tr key={`subledger-${groupIndex}-${subIndex}-${subLedgerIndex}`}>
                  <td style={{ cursor: 'pointer', textAlign:'right' }} className="cell_btn" onClick={() => MovieToListPage(subLedger)}>{subLedger.LedgerName}</td>
                  {/* <td style={{ cursor: 'pointer', textAlign:'center' }} className="cell_btn" onClick={() => MovieToListPage(subLedger)}>{subLedger.LedgerName} {`(${subGroup.GroupName})`}</td> */}
                  <td style={{ textAlign: 'left' }}>{+subLedger.OpeningBalance !== 0 ? subLedger.OpeningBalance + ' ' + subLedger.DebitOrCredit : +subLedger.OpeningBalance}</td>
                  <td style={{ textAlign: 'left' }}>{subLedger.ledger_Debit || 0}</td>
                  <td style={{ textAlign: 'left' }}>{subLedger.ledger_Credit || 0}</td>
                  <td style={{ textAlign: 'left' }}>{subLedger.ClosingBalance || 0}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}

          <tr>
            <td colSpan={5} className='removeBordertable' ></td>
          </tr>
        </React.Fragment>
      ))}

      {GroupTotal.DiffrentDebitamount || GroupTotal.DiffrentCreditamount ? (
        <tr>
          <td style={{ textAlign: "left", height: "30px" , fontWeight: "bold"}}>Difference in opening balance</td>
          <td></td>
          <td style={{ textAlign: "right", height: "30px" }}>{GroupTotal.DiffrentCreditamount}</td>
          <td style={{ textAlign: "right", height: "30px" }}>{GroupTotal.DiffrentDebitamount}</td>
          <td colSpan={2}></td>
        </tr>
      ) : null}
    </tbody>
    <tfoot>
      <tr>
        <td colSpan="2" style={{ textAlign: "left", fontWeight: "bold" }}>Grand Total:</td>
        <td style={{ textAlign: "center", fontWeight: "bold" }}>{GroupTotal.GroupDebitTotal}</td>
        <td style={{ textAlign: "center", fontWeight: "bold" }}>{GroupTotal.GroupCreditTotal}</td>
        <td></td>
      </tr>
    </tfoot>
  </table>
  )}


    </div>
    
  </div>

<ToastAlert Message={toast.message} Type={toast.type} />

  </>
  )
}

export default TrialBalance;