import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';


const ProfitandLoss = () => {

    const dispatchvalue = useDispatch();

    const navigate = useNavigate()

    const toast = useSelector(state => state.userRecord?.toast);

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const [Expenarr,setExpenarr]=useState([])

    const [IncomeArr,setIncomeArr]=useState([])

    // console.log('111',Expenarr,IncomeArr);

    const [Itemlist,setItemlist]=useState([])
        
    const [selectRoom, setselectRoom] = useState(false);
    

    useEffect(()=>{
        axios.get(`${UrlLink}finance/getprofitandloss`)
        .then((res)=>{
            console.log('lllll',res.data);

            let Objeget=res.data

            if(Objeget && Object.keys(Objeget).length !==0){
                let getExpenarr=Objeget.ExpenArr || []
                let getIncomeArr=Objeget.IncomeArr || []

                setExpenarr(getExpenarr)
                setIncomeArr(getIncomeArr)
            }


        })
        .catch((err)=>{
            console.log(err);            
        })
    },[UrlLink])


    const ItemView =(row)=>{

   

        let Item=row || []
      
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
        <h3>Profit and Loss</h3>

        <div style={{display:'flex'}}>
        {Expenarr.length !==0 &&  <div className="for">
              <div className="Selected-table-container">
                
                <span>Expenses</span>  
                  <table className="selected-medicine-table25">
                      <thead>
                          <tr>
                              <th id="slectbill_ins" style={{ width: "350px",height:'30px' }}>Particulars</th>
                              <th id="slectbill_ins" style={{ width: "140px",height:'30px' }}>Total</th>
                          </tr>
                      </thead>
                      <tbody>
                          {Expenarr.length !==0 &&  Expenarr.map((item, index) => (

                            <React.Fragment>
                              <tr key={index}>
                                 
                                  <td style={{ width: "140px",height:'30px',fontWeight:'bold'}} >{item.GroupName}</td>
                                  <td style={{ width: "140px",height:'30px',fontWeight:'bold',textAlign: 'right'}} >{item.TotalDebit || ''}</td>
                              

                              </tr>

                            {item.ledgerarr && item.ledgerarr?.map((ledger, ledgerIndex) => (
                                <tr key={ledgerIndex}>
                                <td style={{ cursor: 'pointer', textAlign: 'center' }} className="cell_btn" onClick={() => MovieToListPage(ledger)}>{ledger.LedgerName}</td>
                                <td style={{ textAlign: 'left' }}>{ledger.ledger_Debit || 0}</td>
                                </tr>
                            ))}

                            </React.Fragment>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>}
          {IncomeArr.length !==0 &&  <div className="for">
              <div className="Selected-table-container">
                
                <span>Income</span>  
                  <table className="selected-medicine-table25">
                      <thead>
                          <tr>
                              <th id="slectbill_ins" style={{ width: "350px",height:'30px' }}>Particulars</th>
                              <th id="slectbill_ins" style={{ width: "140px",height:'30px' }}>Total</th>
                          </tr>
                      </thead>
                      <tbody>
                          {IncomeArr.length !==0 &&  IncomeArr.map((item, index) => (
                              <React.Fragment>
                              <tr key={index}>
                            
                                  <td style={{ width: "140px",height:'30px',fontWeight:'bold'}}>{item.GroupName}</td>
                                  <td style={{ width: "140px",height:'30px',fontWeight:'bold', textAlign: 'right'}} >{item.TotalCredit || ''}</td>
                                  
                              </tr>

                            {item.ledgerarr && item.ledgerarr?.map((ledger, ledgerIndex) => (
                                <tr key={ledgerIndex}>
                                <td style={{ cursor: 'pointer', textAlign: 'center' }} className="cell_btn" onClick={() => MovieToListPage(ledger)}>{ledger.LedgerName}</td>
                                <td style={{ textAlign: 'left' }}>{ledger.ledger_Credit || 0}</td>
                                </tr>
                            ))}
                            </React.Fragment>
                          ))}
                          
                      </tbody>
                  </table>
              </div>
          </div>}
        </div>
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

      <div className="Selected-table-container">
                  <table className="selected-medicine-table2">
                      <thead>
                          <tr>
                              <th id="slectbill_ins" style={{ width: "100px" }}>S.No</th>
                              <th id="slectbill_ins" style={{ width: "140px" }}>LedgerName</th>
                              <th id="slectbill_ins" style={{ width: "140px" }}>Opening Balance</th>
                              <th id="slectbill_ins" style={{ width: "140px" }}>Debit</th>
                              <th id="slectbill_ins" style={{ width: "140px" }}>Credit</th>
                              <th id="slectbill_ins" style={{ width: "140px" }}>Closing Balance</th>
                          </tr>
                      </thead>
                      <tbody>
                          {Itemlist.length !==0 &&  Itemlist.map((item, index) => (
                              <tr key={index}>
                                  <td style={{ width: "100px"}}>{item.id}</td>
                                  <td style={{ width: "140px" , cursor:'pointer'}} className="cell_btn" onClick={()=>MovieToListPage(item)}>{item.LedgerName }</td>
                                  <td style={{ width: "140px" }}>{item.OpeningBalance + ' ' + item.DebitOrCredit }</td>                             
                                  <td style={{ width: "140px" }}>{+item.ledger_Debit || 0}</td>
                                  <td style={{ width: "140px" }}>{+item.ledger_Credit || 0}</td>
                                  <td style={{ width: "140px" }}>{item.ClosingBalance || 0}</td>
                              </tr>
                          ))}
                      </tbody>

                  </table>
              </div>

     
    </div>}
    </div>
    </div>
    )}
    </>
  )
}

export default ProfitandLoss;