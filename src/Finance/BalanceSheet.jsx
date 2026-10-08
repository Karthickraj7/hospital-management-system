import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';


const BalanceSheet = () => {

    const dispatchvalue = useDispatch();
    
    const navigate = useNavigate()

    const toast = useSelector(state => state.userRecord?.toast);

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    
    const [liablityarr,setliablityarr]=useState([])
    
    const [assetarr,setassetarr]=useState([])

    const [totalamountState,settotalamountState]=useState({
        liability_Total:0,
        asset_Total:0,
    })

    console.log('kkkkkkkkkkk',liablityarr,assetarr);
    

    useEffect(()=>{
        axios.get(`${UrlLink}finance/getbalancesheetreport`)
        .then((res)=>{
            console.log('vvvvv33444',res.data);
            let Objeget=res.data

            if(Objeget && Object.keys(Objeget).length !==0){
                
                let getliablityarr=Objeget.liabilityArr || []
                let getassetarr=Objeget.AsetArr || []

                setliablityarr(getliablityarr)
                setassetarr(getassetarr)

                settotalamountState({
                liability_Total: Objeget.Totalamount_lib || 0,
                asset_Total:Objeget.Totalamount_Ass || 0
                })
            }
        })
        .catch((err)=>{
            console.log(err);            
        })
    },[UrlLink])



    
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
        <h3>Balance Sheet</h3>
        <br/>


        <div style={{display:'flex'}}>

        {assetarr.length !==0 &&  <div className="for">
              <div className="Selected-table-container">
                
                <span>Assets</span>  
                  <table className="selected-medicine-table25">
                      <thead>
                          <tr>
                              <th id="slectbill_ins" style={{ width: "350px",height:'30px' }}>Particulars</th>
                              <th id="slectbill_ins" style={{ width: "140px",height:'30px' }}>Total</th>
                          </tr>
                      </thead>
                      <tbody>
                          {assetarr.length !==0 &&  assetarr.map((item, index) => (
                              <React.Fragment>
                              <tr key={index}>
                                  <>
                                  <td style={{ width: "140px",height:'30px',fontWeight:'bold'}}>{item.GroupName}</td>
                                  <td style={{ width: "140px",height:'30px',fontWeight:'bold',textAlign:'right'}} >{item.ClosingBalance || ''}</td>
                                  </>
                              </tr>

                              {item.filterrarr && item.filterrarr?.map((ledger, ledgerIndex) => (
                                <tr key={ledgerIndex}>
                                <td style={{ cursor: 'pointer', textAlign: 'right' }} className="cell_btn" onClick={() => MovieToListPage(ledger)} >{ledger.LedgerName}</td>
                                <td style={{ textAlign: 'left' }}>{ledger.ClosingBalance || 0}</td>
                                </tr>
                            ))}
                              </React.Fragment>
                          ))}

                          <tr>
                            <td style={{ width: "140px",height:'30px',fontWeight:'bold'}}>Total</td>
                            <td style={{ width: "140px",height:'30px',fontWeight:'bold',textAlign:'right'}}>{totalamountState.asset_Total}</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>}

        {liablityarr.length !==0 &&  <div className="for">
              <div className="Selected-table-container">
                
                <span>Liabilitys</span>  
                  <table className="selected-medicine-table25">
                      <thead>
                          <tr>
                              <th id="slectbill_ins" style={{ width: "350px",height:'30px' }}>Particulars</th>
                              <th id="slectbill_ins" style={{ width: "140px",height:'30px' }}>Total</th>
                          </tr>
                      </thead>
                      <tbody>
                          {liablityarr.length !==0 &&  liablityarr.map((item, index) => (
                              <React.Fragment>
                              <tr key={index}>
                                  <>
                                  <td style={{ width: "140px",height:'30px',fontWeight:'bold'}} >{item.GroupName}</td>
                                  <td style={{ width: "140px",height:'30px',fontWeight:'bold',textAlign:'right'}} >{item.ClosingBalance || ''}</td>
                                  </>                               
                              </tr>
                              {item.filterrarr && item.filterrarr?.map((ledger, ledgerIndex) => (
                                <tr key={ledgerIndex}>
                                <td style={{ cursor: 'pointer', textAlign:'right' }} className="cell_btn" onClick={() => MovieToListPage(ledger)} >{ledger.LedgerName}</td>
                                <td style={{ textAlign: 'left' }}>{ledger.ClosingBalance || 0}</td>
                                </tr>
                                ))}
                              </React.Fragment>
                          ))}

                        <tr>
                            <td style={{ width: "140px",height:'30px',fontWeight:'bold'}}>Total</td>
                            <td style={{ width: "140px",height:'30px',fontWeight:'bold',textAlign:'right'}}>{totalamountState.liability_Total}</td>
                        </tr>
                      </tbody>
                  </table>
              </div>
          </div>}
        
        </div>

      </div>
    </>
  )
}

export default BalanceSheet;