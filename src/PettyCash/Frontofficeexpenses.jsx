import React, { useEffect, useState } from 'react'
import { formatLabel } from '../OtherComponent/OtherFunctions'
import axios from 'axios';
import {useDispatch, useSelector } from 'react-redux';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';

const Frontofficeexpenses = () => { 

    const dispatchvalue = useDispatch();
    const navigate = useNavigate();
    
    const ExpensesVoucherEdit = useSelector((state) => state.Financedata?.ExpensesVouchersEdit);

   const blockInvalidChar = (e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
   const toast = useSelector(state => state.userRecord?.toast);
   const UrlLink = useSelector(state => state.userRecord?.UrlLink);
   const userRecord = useSelector((state) => state.userRecord?.UserData);
    
   const today = new Date();
   const currentDate = today.toISOString().split('T')[0];


   const [Expencestate,setexpencestate]=useState({
    Location:"",
    ExpenceDate:currentDate,
    IssueBy:'',
    Expenses:'',
    ExpensesAmount:'',
    Narration:''
   }) 
   const [LocationData, setLocationData] = useState([]);

    const [formAmount, setFormAmount] = useState({
        BillpayMethod: "",
        paidamount: "",
        Remarks:"",
    });

    const [billAmount, setBillAmount] = useState([]);
    const [isEdit, setIsEdit] = useState(null);

    const [ExpensesArr, setExpensesArr] = useState([])
    


   const clearStates=()=>{
    setexpencestate({
        Location:"",
        ExpenceDate:currentDate,
        IssueBy:'',
        Expenses:'',
        ExpensesAmount:'',
        Narration:''
    })
    setBillAmount([])
   }

   useEffect(()=>{
    if(userRecord && userRecord?.username){
        setexpencestate((prev)=>({
            ...prev,
            IssueBy:userRecord?.username,
        }))
        }
    },[userRecord])   


    useEffect(() => {
        axios.get(`${UrlLink}Masters/Expenses_Master_link`)
            .then((res) => {
                const ress = res.data
                setExpensesArr(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [UrlLink])

   useEffect(() => {
    axios.get(`${UrlLink}Masters/Location_Detials_link`)
        .then((res) => {
            const ress = res.data
            setLocationData(ress)
        })
        .catch((err) => {
            console.log(err);
        })


}, [UrlLink])


    useEffect(()=>{

        if(ExpensesVoucherEdit && Object.keys(ExpensesVoucherEdit).length !==0){

            const {LocationName,Status,billAmount,ExpensesName,ExpensesNameId,...rest} = ExpensesVoucherEdit;
            
            
            setexpencestate({
                ...rest,
                Expenses:ExpensesNameId
            })
            setBillAmount(billAmount && billAmount.length >0 ? billAmount : [])

        }

    },[ExpensesVoucherEdit])

   const HadelonchageSupplier = async (e) => {

    const { name, value } = e.target

   
    setexpencestate((prev) => ({
        ...prev,
        [name]: value
    }))
    


}



useEffect(() => {
    const totalPaidAmount = billAmount
    //   .filter((_, indx) => indx !== isEdit)
      .reduce((total, ele) => +total + +ele.paidamount, 0);
      
     
        setexpencestate((prev)=>({
            ...prev,
            ExpensesAmount:totalPaidAmount,
        }))

  }, [billAmount, billAmount.length, isEdit]);
  
    



  
  const handleChange = (e) => {
      // Calculate the total paid amount
    
      const { name, value } = e.target;
          setFormAmount((prev) => ({
            ...prev,
            [name]: value,
          }));

    };


    const handleAdd = () => {
      let req = ["BillpayMethod","paidamount"];
    
     const missing = req.filter((row) => !formAmount[row]);
     if (missing.length === 0) {
       const exist = billAmount.find(
         (p) => p.BillpayMethod === formAmount.BillpayMethod
       );
       if (!exist) {
         setBillAmount((prev) => [...prev, formAmount]);
         setFormAmount({
           BillpayMethod: "",
           paidamount: "",
           Remarks:"",
         });
       } else {
         alert("The Payment Method already exist");
       }
     } else {
       alert(`enter the required fields : ${missing.join(",")}`);
     }
   };
   
   const handleEdit = (index) => {
     setIsEdit(index);
     const item = billAmount[index];
     setFormAmount({
       ...item,
     });
   };
   
   
   
   const handleDeleteAmount = (index) => {
     setBillAmount((prevBillAmount) => {
       const updatedBillAmount = [...prevBillAmount];
       updatedBillAmount.splice(index, 1); 
       return updatedBillAmount;
     });
   };
   
   
   
   
   const handleUpdate = () => {
     let req = ["BillpayMethod","paidamount"];
   
     const missing = req.filter((row) => !formAmount[row]);
     if (missing.length === 0) {
       const data = [...billAmount];
       data[isEdit] = formAmount;
   
       setBillAmount(data);
       setFormAmount({
         BillpayMethod: "",
         paidamount: "",
         Remarks:"",
       });
       setIsEdit(null);
     } else {
       alert(`enter the required fields : ${missing.join(",")}`);
     }
   };

   const SaveExpenses =()=>{

    let requiredFields = [
        'Location',
        'ExpenceDate',
        'IssueBy',
        'Expenses',
        'ExpensesAmount',
        'Narration'
    ]

    const missingFields = requiredFields.filter(
        (field) => !Expencestate[field]
    )
    if (missingFields.length !== 0) {

        const tdata = {
            message: `Please fill out all required fields: ${missingFields.join(", ")}`,
            type: 'warn',
        }
        dispatchvalue({ type: 'toast', value: tdata });
    }
    else{

        let senddata={
           ...Expencestate,
           billAmount:billAmount,
           Create_by: userRecord?.username,
        }

        axios.post(`${UrlLink}finance/postdataforpettycash`,senddata)
        .then((res)=>{
            console.log('mmmmm',res.data);
            let resdata = res.data
                    let type = Object.keys(resdata)[0]
                    let mess = Object.values(resdata)[0]
                    const tdata = {
                        message: mess,
                        type: type,
                    }
                    dispatchvalue({ type: 'toast', value: tdata });
                    if (type === 'success') {
                        navigate("/Home/CashierFolder");
                        dispatchvalue({ type: "HrFolder", value: "FrontofficeexpensesList" });
                        dispatchvalue({ type: "setPreviousFolder", value: null }); 
                        dispatchvalue({ type: "showMenu", value: true });
                        
                        clearStates()
                    } 
        })
        .catch((err) => {
            console.log(err);
        })
    }


   }
   

  return (
    <><div className="Main_container_app">
    <h3>Expences</h3>

    <br />

    <div className="RegisFormcon_1">

        {
            Object.keys(Expencestate).filter(ele => ele !== 'id').map((StateName, Index) => {

                return (
                    <div className="RegisForm_1" key={Index + 'key'}>

                        <label htmlFor={StateName}>{formatLabel(StateName)} :</label>

                        {['Location','Expenses'].includes(StateName) ?

                            <select
                                id={StateName}
                                name={StateName}
                                value={Expencestate[StateName]}
                                onChange={HadelonchageSupplier}
                            >
                                <option value=''>Select</option>
                                {StateName ===  'Location' ?
                                    LocationData.map((ele, ind) => (
                                        <option key={ind + 'key'} value={ele.id} >{ele.locationName}</option>
                                    ))

                                    :
                                    ExpensesArr.filter(ele => ele.Status === 'Active').map((ele, ind) => (
                                        <option key={ind + 'key'} value={ele.id} >{ele.ExpensesName}</option>
                                    ))
                                }
                            </select>
                            :
                            ['Narration'].includes(StateName) ?
                                <textarea
                                    id={StateName}
                                    name={StateName}
                                    value={Expencestate[StateName]}
                                    onChange={HadelonchageSupplier}
                                >
                                </textarea>
                                :
                                <input
                                    type={StateName === 'ExpenceDate' ? 'date':StateName === 'Amount' ?'number':'text'}
                                    id={StateName}
                                    name={StateName}
                                    value={Expencestate[StateName]}
                                    onChange={HadelonchageSupplier}
                                    disabled={['ExpenceDate','IssueBy','ExpensesAmount'].includes(StateName) }  
                                />
                        }
                        {/* {['SupplierId', 'SupplierName'].includes(StateName) && (
                            <datalist id={StateName + 'List'}>
                                {supplierArray.map((option, index) => (
                                    <option key={index + 'key'} value={StateName === 'SupplierId' ? option.id : option.SupplierName} />
                                ))}
                            </datalist>
                        )} */}
                    </div>
                )
            })
        }


    </div>

            <div className="RegisFormcon_1">

        <div className="RegisForm_1">
            <label>
                Payment Method <span>:</span>
            </label>
            <select
                name="BillpayMethod"
                value={formAmount.BillpayMethod}
                onChange={handleChange}
            >
                <option value="">Select</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="OnlinePayment">Online Payment</option>
                <option value="Cheque">Cheque</option>
            </select>
            </div>

            <div className="RegisForm_1">
            <label>
                Amount <span>:</span>
            </label>
            <input
                onKeyDown={blockInvalidChar}
                type="number"
                name="paidamount"
                value={formAmount.paidamount}
                onChange={handleChange}
            />
            </div>


            <div className="RegisForm_1">
            <label>
            Remarks <span>:</span>
            </label>
            <textarea
            name="Remarks"
            value={formAmount.Remarks}
            onChange={handleChange}
            />
            </div>


            <div className="clm-itm-stl">
            <div className="Register_btn_con added_Register_btn_con">
                <button
                className="RegisterForm_1_btns added_RegisterForm_1_btns"
                onClick={isEdit !== null ? handleUpdate : handleAdd}
                >
                {isEdit !== null ? "Update" : "Add"}
                </button>
            </div>
            </div>
            
            <div>

        </div>
        </div>


        <br/>

        {billAmount.length !== 0 && (
        <div className="Selected-table-container444 DEWSDXWED">
            <table className="selected-medicine-table222 EDWEDE">
            <thead>
                <tr>
                <th style={{width:'70px'}}>S.No</th>
                <th style={{width:'100px'}}>Payment Type</th>
                <th style={{width:'100px'}}>Amount</th>
                <th>Remarks</th>
                <th style={{width:'100px'}}>Action </th>
                </tr>
            </thead> 
            <tbody>
                {billAmount.map((row, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{row.BillpayMethod}</td>
                    <td>{row.paidamount}</td>
                    <td>{row.Remarks}</td>
                    <td style={{gap:'10px'}}>
                    <button
                        className="delnamebtn"
                        onClick={() => handleEdit(index)}
                    >
                        <EditIcon />
                    </button>
                    <button
                        className="delnamebtn"
                        onClick={() => handleDeleteAmount(index)}
                    >
                        <DeleteIcon />
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        )}
        <br/>
        <div className="Main_container_Btn">
            <button onClick={SaveExpenses}>
                {Expencestate?.id ? 'Update' : 'Save'}
            </button>
        </div>
    </div>
    <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  )
}

export default Frontofficeexpenses;