
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';



const withVoucherManagement = (WrappedComponent, voucherType) => {

    return () => {

    const dispatchvalue = useDispatch();
    const navigate = useNavigate()


    const UrlLink = useSelector(state => state.userRecord?.UrlLink);


    const userRecord = useSelector((state) => state.userRecord?.UserData);

    const VoucherEdit = useSelector((state) => state.Financedata?.FinanceVouchersEdit);

    // console.log('VoucherEdit',VoucherEdit);

    const [LedgerArr,setLedgerArr]=useState([])

    const[VoucherHead,setVoucherHead]=useState({
        VoucherDate: format(new Date(), "yyyy-MM-dd"),
        PaymentType: "",
        VoucherNarration: "",
    })
    
    const [CreditAccountstate, setCreditAccountstate] = useState({
        CreditParticularsId: "",
        CreditParticulars: "",
        UnitOrTax:'',
        UnitOrTaxValue:'',
        PerUnitOrTaxable:'',
        RatePerUnitOrTaxableValue:'',
        CreditAmount:0,
      });


    const [DebitAccountstate, setDebitAccountstate] = useState({
        DebitParticularsId: "",
        DebitParticulars: "",
        UnitOrTax:'',
        UnitOrTaxValue:'',
        PerUnitOrTaxable:'',
        RatePerUnitOrTaxableValue:'',
        DebitAmount:0,
      });

    
    

      const [VoucherEntryarray,setVoucherEntryarray]=useState([])
      
      const[NetTotalAmount,setNetTotalAmount]=useState({
        CreditTotalAmount:0,
        DebitTotalAmount:0
      })


      console.log('VoucherEntryarray',VoucherEntryarray);
      


    useEffect(()=>{
    if(VoucherEdit && Object.keys(VoucherEdit).length !==0){
        const {VoucherEntryarray,...rest}=VoucherEdit;
        setVoucherEntryarray(VoucherEntryarray || []);
        setVoucherHead(rest || {});
    }
    },[VoucherEdit])


  useEffect(()=>{
    if(UrlLink && voucherType){
    axios.get(`${UrlLink}finance/getassetledgerforvouchersbytype?voucherType=${voucherType}`)
    .then((res)=>{
      console.log('00000',res.data);  
      let getdata=res?.data
      if(getdata && Array.isArray(getdata) && getdata.length !==0){
        setLedgerArr(getdata)
      }      
    })
    .catch((err)=>{
      console.log(err);        
    })
  }
  

  },[UrlLink])


  
useEffect(() => {
  
      if (VoucherEntryarray && VoucherEntryarray.length !== 0 && voucherType !=='') {
  
        const TotalAmout = VoucherEntryarray.reduce((sum, ele) => sum + +(+ele.Credit || 0), 0);
  
        const TotalDebit = VoucherEntryarray.reduce((sum, ele) => sum + +(+ele.Debit || 0), 0);
  
        setNetTotalAmount({
          CreditTotalAmount:TotalAmout || 0,
          DebitTotalAmount:TotalDebit || 0
        })
      } 
  
    }, [VoucherEntryarray]);
  


    const ClearCreditAccountstate=()=>{
      setCreditAccountstate({
        CreditParticularsId:'',
        CreditParticulars:'',
        UnitOrTax:'',
        UnitOrTaxValue:'',
        PerUnitOrTaxable:'',
        RatePerUnitOrTaxableValue:'',
        CreditAmount:0
      })
    }

    const ClearDebitAccountstate=()=>{
      setDebitAccountstate({
        DebitParticularsId:'',
        DebitParticulars:'',
        UnitOrTax:'',
        UnitOrTaxValue:'',
        PerUnitOrTaxable:'',
        RatePerUnitOrTaxableValue:'',
        DebitAmount:0
      })
    }


  const AddEntryfunc=(datafrom)=>{


    // console.log('datafrom',datafrom);
    

    if(datafrom === 'Credit'){

      let requiredFields=[
        'CreditParticulars',
        'CreditAmount'
      ]


      if (['SalesVoucher','DebitNoteVoucher'].includes(voucherType)){
        requiredFields.push(
          'UnitOrTax',
          'UnitOrTaxValue',
          'PerUnitOrTaxable',
          'RatePerUnitOrTaxableValue')
      }

      let missingFields = requiredFields.filter((filed)=> !CreditAccountstate[filed])

      if (missingFields.length !==0){
        const tdata = {
            message: `Please fill out all required fields: ${missingFields.join(", ")}`,
            type: 'warn',
        }
        dispatchvalue({ type: 'toast', value: tdata });

        return;

      }

      if (CreditAccountstate?.id) {
        // console.log('********', voucherType, CreditAccountstate);
      
        let updatedArray; 
      
        if (['SalesVoucher','DebitNoteVoucher'].includes(voucherType)) {
          updatedArray = VoucherEntryarray.map((ele) => {
            if (ele.id === CreditAccountstate?.id) {
              return {
                ...ele,
                ParticularsId: +CreditAccountstate?.CreditParticularsId,
                Particulars: CreditAccountstate?.CreditParticulars,
                UnitOrTax: CreditAccountstate?.UnitOrTax,
                UnitOrTaxValue: +CreditAccountstate.UnitOrTaxValue,
                PerUnitOrTaxable: CreditAccountstate.PerUnitOrTaxable,
                RatePerUnitOrTaxableValue: +CreditAccountstate.RatePerUnitOrTaxableValue,
                Credit: +CreditAccountstate?.CreditAmount,
              };
            }
            return ele; 
          });
        } else {
          
          updatedArray = VoucherEntryarray.map((ele) => {
            if (ele.id === CreditAccountstate?.id) {
              return {
                ...ele,
                ParticularsId:+CreditAccountstate?.CreditParticularsId,
                Particulars: CreditAccountstate?.CreditParticulars,
                Credit: +CreditAccountstate?.CreditAmount,
              };
            }
            return ele; 
          });
        }
      
        setVoucherEntryarray(updatedArray);
      }
      

      else{

        if (['ContraVoucher','ReceiptVoucher','SalesVoucher','DebitNoteVoucher'].includes(voucherType)){
        
        setVoucherEntryarray((prev) => {
          let lastint = prev.map((ele) => ele.Debit).lastIndexOf(0);
          let credint= prev.map((ele) => ele.Credit).lastIndexOf(0);
          
          let newobj

          if (['SalesVoucher','DebitNoteVoucher'].includes(voucherType)){
            newobj = {
              'id': credint !== -1 ? credint+1 : lastint === -1 ? prev.length + 1 : lastint + 2,
              'ParticularsId': +CreditAccountstate.CreditParticularsId,
              'Particulars': CreditAccountstate.CreditParticulars,
              'UnitOrTax':CreditAccountstate.UnitOrTax,
              'UnitOrTaxValue':+CreditAccountstate.UnitOrTaxValue,
              'PerUnitOrTaxable':CreditAccountstate.PerUnitOrTaxable,
              'RatePerUnitOrTaxableValue':+CreditAccountstate.RatePerUnitOrTaxableValue,
              'Debit': 0,
              'Credit': +CreditAccountstate.CreditAmount
          };
          }
          
          else{

            newobj = {
              'id': credint !== -1 ? credint+1 : lastint === -1 ? prev.length + 1 : lastint + 2,
              'ParticularsId': +CreditAccountstate.CreditParticularsId,
              'Particulars': CreditAccountstate.CreditParticulars,
              'Debit': 0,
              'Credit': +CreditAccountstate.CreditAmount
          };

          }
          
      
          return [
              ...prev.slice(0, lastint + 1),  
              newobj,
              ...prev.slice(lastint + 1).map((ele) => ({
                  ...ele,
                  id: lastint + 3  
              }))
          ];
        });

        }
        else if (['PurchaseVoucher','CreditNoteVoucher'].includes(voucherType)){

          setVoucherEntryarray((prev)=>[
            ...prev,
            { 'id':prev.length+1,
              'ParticularsId': +CreditAccountstate.CreditParticularsId,
              'Particulars':CreditAccountstate.CreditParticulars,
              'UnitOrTax':'',
              'UnitOrTaxValue':0,
              'PerUnitOrTaxable':'',
              'RatePerUnitOrTaxableValue':0,
              'Debit':0,
              'Credit':+CreditAccountstate.CreditAmount
            }
          ])
          
        }
        else if (['PaymentVoucher','JournalVoucher'].includes(voucherType)){

          setVoucherEntryarray((prev)=>[
            ...prev,
            { 'id':prev.length+1,
              'ParticularsId': +CreditAccountstate.CreditParticularsId,
              'Particulars':CreditAccountstate.CreditParticulars,
              'Debit':0,
              'Credit':+CreditAccountstate.CreditAmount 
            }
          ])
    
        }
        
      }



    }
    else if(datafrom === 'Debit'){

      let requiredFields=[
        'DebitParticulars',
        'DebitAmount'
      ]

      if (['PurchaseVoucher','CreditNoteVoucher'].includes(voucherType)){
        requiredFields.push(
          'UnitOrTax',
          'UnitOrTaxValue',
          'PerUnitOrTaxable',
          'RatePerUnitOrTaxableValue')
      }

      let missingFields = requiredFields.filter((filed)=> !DebitAccountstate[filed])
      
      if ( +DebitAccountstate.DebitAmount < 0) {
        
        const tdata = {
          message: `DebitAmount value is negative:${DebitAccountstate.DebitAmount}`,
          type: 'warn',
       }
      dispatchvalue({ type: 'toast', value: tdata });

      return;
      }
      if (missingFields.length !==0){
        const tdata = {
            message: `Please fill out all required fields: ${missingFields.join(", ")}`,
            type: 'warn',
        }
        dispatchvalue({ type: 'toast', value: tdata });

        return;

      }

      
      if(DebitAccountstate?.id){


        let updatedArray; 


        if (['PurchaseVoucher','CreditNoteVoucher'].includes(voucherType)) {
          updatedArray = VoucherEntryarray.map((ele) => {
            if(ele.id === DebitAccountstate?.id){
              return {
                ...ele,
                ParticularsId: +DebitAccountstate.DebitParticularsId,
                Particulars: DebitAccountstate?.DebitParticulars,
                UnitOrTax: DebitAccountstate?.UnitOrTax,
                UnitOrTaxValue: +DebitAccountstate.UnitOrTaxValue,
                PerUnitOrTaxable: DebitAccountstate.PerUnitOrTaxable,
                RatePerUnitOrTaxableValue: +DebitAccountstate.RatePerUnitOrTaxableValue,
                Debit: +DebitAccountstate?.DebitAmount,
              };
            }
            return ele; 
          });
        }
        else{
          updatedArray  =VoucherEntryarray.map((ele,ind)=>{
         
            if(ele.id === DebitAccountstate?.id){
              return {
              ...ele,
              ParticularsId: +DebitAccountstate.DebitParticularsId,
              Particulars:DebitAccountstate?.DebitParticulars,
              Debit:+DebitAccountstate?.DebitAmount}
            }
  
            return ele;
  
          })
        }
        

        setVoucherEntryarray(updatedArray)

      }
      else{

      if (['ContraVoucher','ReceiptVoucher'].includes(voucherType)){
       setVoucherEntryarray((prev)=>[
        ...prev,
        { 'id':prev.length+1,
          'ParticularsId':+DebitAccountstate.DebitParticularsId,
          'Particulars':DebitAccountstate.DebitParticulars,
          'Debit':+DebitAccountstate.DebitAmount,
          'Credit':0
        }
      ])
      }
      else if (['SalesVoucher','DebitNoteVoucher'].includes(voucherType)){

        setVoucherEntryarray((prev)=>[
          ...prev,
          { 'id':prev.length+1,
            'ParticularsId': +DebitAccountstate.DebitParticularsId,
            'Particulars':DebitAccountstate.DebitParticulars,
            'UnitOrTax':'',
            'UnitOrTaxValue':0,
            'PerUnitOrTaxable':'',
            'RatePerUnitOrTaxableValue':0,
            'Debit':+DebitAccountstate.DebitAmount,
            'Credit':0
          }
        ])
        
      }
      else if (['PaymentVoucher','JournalVoucher','PurchaseVoucher','CreditNoteVoucher'].includes(voucherType)){
        
        setVoucherEntryarray((prev) => {
          let lastint = prev.map((ele) => ele.Credit).lastIndexOf(0);
          let credint= prev.map((ele) => ele.Debit).lastIndexOf(0);
          
          let newobj

          if (['PurchaseVoucher','CreditNoteVoucher'].includes(voucherType)){
            newobj = {
              'id': credint !== -1 ? credint+1 : lastint === -1 ? prev.length + 1 : lastint + 2,
              'ParticularsId':+DebitAccountstate.DebitParticularsId,
              'Particulars': DebitAccountstate.DebitParticulars,
              'UnitOrTax':DebitAccountstate.UnitOrTax,
              'UnitOrTaxValue': +DebitAccountstate.UnitOrTaxValue,
              'PerUnitOrTaxable':DebitAccountstate.PerUnitOrTaxable,
              'RatePerUnitOrTaxableValue':+DebitAccountstate.RatePerUnitOrTaxableValue,
              'Debit': +DebitAccountstate.DebitAmount,
              'Credit': 0
          };
          }
          
          else{
            newobj = {
              'id': credint !== -1 ? credint+1 : lastint === -1 ? prev.length + 1 : lastint + 2,
              'ParticularsId':+DebitAccountstate.DebitParticularsId,
              'Particulars': DebitAccountstate.DebitParticulars,
              'Debit':+DebitAccountstate.DebitAmount,
              'Credit': 0
          }; 
          }
           
          return [
              ...prev.slice(0, lastint + 1),  
              newobj,
              ...prev.slice(lastint + 1).map((ele) => ({
                  ...ele,
                  id: lastint + 3  
              }))
          ];
      });

      }



      }
    }

    ClearCreditAccountstate()
    ClearDebitAccountstate()

  }






  const VoucherHeadOnchange=(e)=>{
      const {name,value}=e.target;

      setVoucherHead((prev)=>({
          ...prev,
          [name]:value,
      }))
  }

  const formStateOnchane = (e) => {
    const { name, value } = e.target;
  
    if (['PurchaseVoucher', 'CreditNoteVoucher'].includes(voucherType)) {
      setDebitAccountstate((prev) => {
        let updatedState = { ...prev };
  
        if (name === 'DebitParticulars') {
          const [splitId, splitname] = value.split('-');
          updatedState = {
            ...updatedState,
            DebitParticularsId: +splitId,
            DebitParticulars: splitname,
            UnitOrTax: '',
            UnitOrTaxValue: '',
            PerUnitOrTaxable: '',
            RatePerUnitOrTaxableValue: '',
            DebitAmount: 0,
          };
        } else if (name === 'UnitOrTax') {
          updatedState = {
            ...updatedState,
            UnitOrTax: value,
            UnitOrTaxValue: '',
            PerUnitOrTaxable: '',
            RatePerUnitOrTaxableValue: '',
            DebitAmount: 0,
          };
        } else if (name === 'UnitOrTaxValue') {
          updatedState = {
            ...updatedState,
            UnitOrTaxValue: value,
            PerUnitOrTaxable: '',
            RatePerUnitOrTaxableValue: '',
            DebitAmount: 0,
          };
        } else if (name === 'PerUnitOrTaxable') {
          updatedState = {
            ...updatedState,
            PerUnitOrTaxable: value,
            RatePerUnitOrTaxableValue: '',
            DebitAmount: 0,
          };
        } else if (name === 'RatePerUnitOrTaxableValue') {
          const rateValue = +value;
  
          if (updatedState.UnitOrTax === 'Unit') {
            updatedState.DebitAmount = +updatedState.UnitOrTaxValue * rateValue;
          } else if (updatedState.UnitOrTax === 'Tax') {
            updatedState.DebitAmount = (+updatedState.UnitOrTaxValue * rateValue) / 100;
          }
  
          updatedState.RatePerUnitOrTaxableValue = value;
        } else {
          updatedState[name] = value;
        }
  
        return updatedState;
      });
    } else {
     
      if (name === 'DebitParticulars') {
        const [splitId, splitname] = value.split('-');
        setDebitAccountstate((prev) => ({
          ...prev,
          DebitParticularsId:+splitId,
          [name]: splitname,
        }));
      }
      else{
      setDebitAccountstate((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    }
  };
  

  const CreditAccountstateOnchange = (e) => {
    const { name, value } = e.target;
  
    if (['SalesVoucher', 'DebitNoteVoucher'].includes(voucherType)) {
      setCreditAccountstate((prev) => {
        let updatedState = { ...prev };
  
        if (name === 'CreditParticulars') {
          const [splitId, splitname] = value.split('-');
  
          updatedState = {
            ...updatedState,
            CreditParticularsId: +splitId,
            [name]: splitname,
            UnitOrTax: '',
            UnitOrTaxValue: '',
            PerUnitOrTaxable: '',
            RatePerUnitOrTaxableValue: '',
            CreditAmount: 0,
          };
        } else if (name === 'UnitOrTax') {
          updatedState = {
            ...updatedState,
            UnitOrTax: value,
            UnitOrTaxValue: '',
            PerUnitOrTaxable: '',
            RatePerUnitOrTaxableValue: '',
            CreditAmount: 0,
          };
        } else if (name === 'UnitOrTaxValue') {
          updatedState = {
            ...updatedState,
            UnitOrTaxValue: value,
            PerUnitOrTaxable: '',
            RatePerUnitOrTaxableValue: '',
            CreditAmount: 0,
          };
        } else if (name === 'PerUnitOrTaxable') {
          updatedState = {
            ...updatedState,
            PerUnitOrTaxable: value,
            RatePerUnitOrTaxableValue: '',
            CreditAmount: 0,
          };
        } else if (name === 'RatePerUnitOrTaxableValue') {
          const rateValue = +value;
  
          if (updatedState.UnitOrTax === 'Unit') {
            updatedState.CreditAmount = +updatedState.UnitOrTaxValue * rateValue;
          } else if (updatedState.UnitOrTax === 'Tax') {
            updatedState.CreditAmount = (+updatedState.UnitOrTaxValue * rateValue) / 100;
          }
  
          updatedState.RatePerUnitOrTaxableValue = value;
        } else {
          updatedState[name] = value;
        }
  
        return updatedState;
      });
    } 
    else {
      if (name === 'CreditParticulars') {
      const [splitId, splitname] = value.split('-');
      setCreditAccountstate((prev) => ({
        ...prev,
        CreditParticularsId: +splitId,
        [name]: splitname,
      }));
      }
      else{
        setCreditAccountstate((prev) => ({
          ...prev,
          [name]: value,
        }));

      }

     
    }
  };
  





  
  const EditVocherentry =(item)=>{

    if (['SalesVoucher','PurchaseVoucher','CreditNoteVoucher','DebitNoteVoucher'].includes(voucherType)){

      if (+item.Debit === 0){
        setCreditAccountstate({
          id:item.id,
          CreditParticularsId:item.ParticularsId,
          CreditParticulars:item.Particulars,
          UnitOrTax:item.UnitOrTax,
          UnitOrTaxValue:item.UnitOrTaxValue,
          PerUnitOrTaxable:item.PerUnitOrTaxable,      
          RatePerUnitOrTaxableValue:item.RatePerUnitOrTaxableValue,
          CreditAmount:item.Credit,
        })
      }
      else if (+item.Credit === 0){

        console.log('itemssss',item,item.Credit,+item.Credit);
        
        setDebitAccountstate({
          id:item.id,
          DebitParticularsId:item.ParticularsId,
          DebitParticulars:item.Particulars,
          UnitOrTax:item.UnitOrTax,
          UnitOrTaxValue:item.UnitOrTaxValue,
          PerUnitOrTaxable:item.PerUnitOrTaxable,
          RatePerUnitOrTaxableValue:item.RatePerUnitOrTaxableValue,
          DebitAmount:item.Debit,
        })
      }

    }else{
      if(+item.Debit === 0){
        setCreditAccountstate({
          id:item.id,
          CreditParticularsId:item.ParticularsId,
          CreditParticulars:item.Particulars,
          CreditAmount:item.Credit,
        })
      }
      else if (+item.Credit === 0){
        setDebitAccountstate({
          id:item.id,
          DebitParticularsId:item.ParticularsId,
          DebitParticulars:item.Particulars,
          DebitAmount:item.Debit,
        })
      }
    }

   



 
    
  }


  const DeleteVocherentry =(delid)=>{

    // console.log('delid',delid);
    
    let Removedata = VoucherEntryarray.filter(ele => +ele.id !== +delid)

    Removedata = Removedata.map((ele,ind)=>{
      return {...ele,id:ind+1}
    })

    setVoucherEntryarray(Removedata)

  }


  const SaveVouchersEntry =()=>{

    let SaverequiredFields = ['VoucherDate','VoucherNarration']

    if(!['JournalVoucher'].includes(voucherType)){
      SaverequiredFields.push('PaymentType')
    }

    let missingFields =SaverequiredFields.filter((filed)=>!VoucherHead[filed])

   

    if (missingFields.length !==0){
      const tdata = {
          message: `Please fill out all required fields: ${missingFields.join(", ")}`,
          type: 'warn',
      }
      dispatchvalue({ type: 'toast', value: tdata });

      return;

    }

    if (NetTotalAmount.CreditTotalAmount !== NetTotalAmount.DebitTotalAmount) {
      const difference = NetTotalAmount.CreditTotalAmount - NetTotalAmount.DebitTotalAmount;
  
      const tdata = {
          message: `Difference between CreditAmount and DebitAmount is ${difference}. Please correct the entry.`,
          type: 'warn',
      };  
      dispatchvalue({ type: 'toast', value: tdata });
      return;
    }

    let params={
      ...VoucherHead,
      voucherType:voucherType,
      VoucherEntryarray:VoucherEntryarray,
      createby:userRecord.username,
    }

    console.log('params',params);

    let PostURLlink
    if(['SalesVoucher','PurchaseVoucher','CreditNoteVoucher','DebitNoteVoucher'].includes(voucherType)){
      PostURLlink='postvoucherdataSecondfourvouchers'
    }else{
      PostURLlink='postvoucherdataallvouchers'
    }
    
    axios.post(`${UrlLink}finance/${PostURLlink}`,params)
    .then((res)=>{
      console.log(res.data);   
      let resdata = res.data
        let type = Object.keys(resdata)[0]
        let mess = Object.values(resdata)[0]
        const tdata = {
            message: mess,
            type: type,
        }
      dispatchvalue({ type: 'toast', value: tdata});

      if (type === 'success') {
          navigate('/Home/VouchersList');
        dispatchvalue({ type:'FinanceVouchersEdit', value: {} });

      }     
    })
    .catch((err)=>{
      console.log(err);        
    })
    

  }


  const sharedProps = {
    LedgerArr,
    VoucherHead,
    CreditAccountstate,
    DebitAccountstate,
    VoucherEntryarray,
    NetTotalAmount,
    setDebitAccountstate,
    setNetTotalAmount,    
    setVoucherEntryarray,
    setCreditAccountstate,
    AddEntryfunc,
    SaveVouchersEntry,
    VoucherHeadOnchange,
    formStateOnchane,
    CreditAccountstateOnchange,
    ClearCreditAccountstate,
    ClearDebitAccountstate,
    EditVocherentry,
    DeleteVocherentry,
    
  }

  return  <WrappedComponent {...sharedProps} />;

}

    
}

export default withVoucherManagement;