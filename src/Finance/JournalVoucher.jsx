import React from 'react'
import withVoucherManagement from './withVoucherManagement';
import AddBoxIcon from "@mui/icons-material/AddBox";
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import { useSelector } from 'react-redux';
import VoucherEntrytable from './VoucherEntrytable';

const JournalVoucher = ({
  LedgerArr,
  VoucherHead,
  CreditAccountstate,
  DebitAccountstate,
  VoucherEntryarray,
  NetTotalAmount,
  AddEntryfunc,
  SaveVouchersEntry,
  VoucherHeadOnchange,
  formStateOnchane,
  CreditAccountstateOnchange,
  EditVocherentry,
  DeleteVocherentry
}) => {





  const toast = useSelector(state => state.userRecord?.toast);

  
 
  return (
    <>
     <div className="Main_container_app">
        <h3>Journal Voucher</h3>


      <br/>

        <div className="RegisFormcon_1" >

      {VoucherHead?.VoucherNo && <div className="RegisForm_1">
        <label>Voucher No<span>:</span></label> 
        <input
        type='text'
        name='VoucherNo'
        value={VoucherHead?.VoucherNo}
        onChange={VoucherHeadOnchange}
        disabled
        />
        </div>}

        <div className="RegisForm_1">
        <label>Voucher Date<span>:</span></label> 
        <input
        type='date'
        name='VoucherDate'
        value={VoucherHead.VoucherDate}
        onChange={VoucherHeadOnchange}
        />
        </div>


        <div className="RegisForm_1">
        <label>Voucher Narration<span>:</span></label> 
        <textarea
        name='VoucherNarration'
        value={VoucherHead.VoucherNarration}
        onChange={VoucherHeadOnchange}
        >

        </textarea>
        </div>
      
        </div>

        <br/>

        <div className="RegisFormcon_1" >

        <div className="RegisForm_1">
        <label>Debit Particulars<span>:</span></label> 
        <input
        name='DebitParticulars'
        value={DebitAccountstate.DebitParticulars}
        onChange={formStateOnchane}
        list='DebitParticulars'
        />
       <datalist
        id='DebitParticulars'
        >
         {LedgerArr.length !==0 && LedgerArr.map((ele,ind)=>(
          <option key={ind+'key'} value={`${ele.id}-${ele.LedgerName}`}>{ele.LedgerName}</option>
        ))        
        }
        </datalist>
        </div>

        <div className="RegisForm_1">
            <label>Debit Amount<span>:</span></label> 
            <input
            type='number'
            name='DebitAmount'
            value={DebitAccountstate.DebitAmount}
            onChange={formStateOnchane}
            /> 
        </div>

        <div onClick={()=>AddEntryfunc('Debit')} className="Search_patient_icons" style={{cursor:'pointer'}}>
            <AddBoxIcon />
        </div>


        <div className="RegisForm_1">
        <label>Credit Particulars<span>:</span></label> 
        <input
        name='CreditParticulars'
        value={CreditAccountstate.CreditParticulars}
        onChange={CreditAccountstateOnchange}
        list='CreditParticulars'
        disabled={!CreditAccountstate?.id && (VoucherEntryarray.filter((ele)=> +ele.Debit !== 0).length === 0 || +CreditAccountstate.CreditAmount < 0 || 
          (NetTotalAmount.CreditTotalAmount ===  NetTotalAmount.DebitTotalAmount))}
        />
      <datalist
        id='CreditParticulars'>
        {LedgerArr.length !==0 && LedgerArr.map((ele,ind)=>(
          <option key={ind+'key'}  value={`${ele.id}-${ele.LedgerName}`}>{ele.LedgerName}</option>
        ))        
        }
      </datalist>
        </div>

        <div className="RegisForm_1">
            <label>Credit Amount<span>:</span></label> 
            <input
            type='number'
            name='CreditAmount'
            value={CreditAccountstate.CreditAmount}
            onChange={CreditAccountstateOnchange}
            disabled={!CreditAccountstate?.id && (VoucherEntryarray.filter((ele)=> +ele.Debit !== 0).length === 0 || +CreditAccountstate.CreditAmount < 0 || 
              (NetTotalAmount.CreditTotalAmount ===  NetTotalAmount.DebitTotalAmount))}
            />
        </div>

        <div onClick={()=>AddEntryfunc('Credit')} className="Search_patient_icons" style={{cursor:'pointer'}}>
            <AddBoxIcon />
        </div>

       
        </div>

       <br/>
       {VoucherEntryarray.length !== 0 && (
          <VoucherEntrytable 
            VoucherEntryarray={VoucherEntryarray} 
            EditVocherentry={EditVocherentry} 
            DeleteVocherentry={DeleteVocherentry} 
          />
        )}

        <br/>

          {VoucherEntryarray.length !==0 && <div className="Main_container_Btn">
              <button onClick={SaveVouchersEntry} >
                {VoucherHead?.VoucherNo ? 'Update':'Save'}
              </button>
          </div>}

        <br/>
        

      </div>
      
    <ToastAlert Message={toast.message} Type={toast.type} />

    </>
  )
}

export default withVoucherManagement(JournalVoucher, 'JournalVoucher');
