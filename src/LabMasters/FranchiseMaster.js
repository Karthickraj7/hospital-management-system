import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import EditIcon from "@mui/icons-material/Edit";

const FranchiseMaster = () => {
  const urllink=useSelector(state=>state.userRecord?.UrlLink)
  const [data, setdata] = useState([])
  const [isEdit, setisEdit] = useState(true)
  const [summa, setsumma] =useState(true)
  const [id, setid] = useState('')
    const [dataform, setdataform] = useState({
        Franchisename: '',
        Franchisetype: '',
        phone: '',
        commission: '',
        address1: '',
        address2: '',
        PaymentType:'',
        Bankname:'',
        CardNumber:'',
        HolderName:'',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setdataform(prevDataForm => ({
            ...prevDataForm,
            [name]: value
        }));
    };

    const handleSubmit = () => {
    
        if (!dataform.Franchisename.trim() ||
            !dataform.Franchisetype.trim() ||
            !dataform.phone.trim() ||
            !dataform.commission.trim()) {
            alert('please Enter All Details')
        }else{
        axios.post(`${urllink}usercontrol/insert_into_commission_master`, dataform)
            .then((response) => {
                console.log(response);
                setsumma(prevSumma => !prevSumma);
                setdataform({
                    doctorname: '',
                    doctortype: '',
                    phone: '',
                    commission: '',
                    address1: '',
                    address2: ''
                })
            })
            .catch((error) => {
                console.error(error);
            });
        }
    };
    
    useEffect(()=>{
        axios.get(`${urllink}usercontrol/get_commission_data`)
        .then((response)=>{
            const data = response.data.data
            console.log(response)
            setdata(data)
        })
        .catch((error)=>{
            console.error(error)
        })
    },[summa])

    const handlestatuschange =(data)=>{
        console.log('data------------------------------=>', data)
        if (data.Status === 'Inactive') {
            const status = 'Active'
            const Commission_Id = data.Commission_Id
            Update_status_fun(Commission_Id, status)
          }
          else {
            const status = 'Inactive'
            const Commission_Id = data.Commission_Id
            Update_status_fun(Commission_Id, status)
          }
      
        
    }

    const Update_status_fun =(Commission_Id, status)=>{
        axios
        .post(`${urllink}usercontrol/statusupdatefor_doc_commission`, {
          status,
          Commission_Id
        })
        .then((res) => {
          console.log(res.data)
        //   fetchLocationData();
        //   successMsg('Status Update Successfully');
        setsumma(prevSumma => !prevSumma);
        })
        .catch((err) => console.log(err));
    }
    const handleEdit = (row) => {
        // Extract the values from the selected row and update dataform state
        setdataform({
            doctorname: row.Doctor_Name,
            doctortype: row.Doctor_Type,
            phone: row.Phone,
            commission: row.Commission_Percentage,
            address1: row.Address_One,
            address2: row.Address_Two,
            PaymentType: row.Payment_Type,
            Bankname:row.Bank_Name,
            CardNumber:row.Account_Number,
            HolderName:row.Holder_Name,

        });
        setid(row.Commission_Id)
        // Change the state to enable editing mode
        setisEdit(false);
    };
    

    const handleupdate =()=>{
        if (!dataform.doctorname.trim() ||
        !dataform.doctortype.trim() ||
        !dataform.phone.trim() ||
        !dataform.commission.trim()) {
        alert('please Enter All Details')
    }else{
        const postdata ={
            ...dataform, 
            id : id
        }
    axios.post(`${urllink}usercontrol/update_into_commission_master`, postdata)
        .then((response) => {
            console.log(response);
            setisEdit(true)

            setsumma(prevSumma => !prevSumma);
            setdataform({
                doctorname: '',
                doctortype: '',
                phone: '',
                commission: '',
                address1: '',
                address2: ''
            })
        })
        .catch((error) => {
            console.error(error);
        });
    }
    }

    return (
        <>
            <div className="appointment">
                <div className="h_head">
                    <h3>Franchise Master</h3>
                </div>
           
                    <div className="RegisFormcon">

                        <div className="RegisForm_1">
                            <label className="new_form_first" htmlFor="DoctorName"> Franchise Name <span>:</span></label>
                            <input
                                type="text"
                                id="Franchisename"
                                name="Franchisename"
                                required
                                value={dataform.Franchisename}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label className="new_form_first" htmlFor="DoctorType">Franchise Type<span>:</span></label>
                            <select
                                id="DoctorType"
                                name="doctortype"
                                required
                                value={dataform.doctortype}
                                onChange={handleInputChange}
                            >
                                <option value="">Select</option>
                                <option value="Laborotry">Lab</option>
                                <option value="Clinic">Clinic</option>
                                <option value="Hospital">Hospital</option>
                            </select>
                        </div>

                        <div className="RegisForm_1">
                            <label className="new_form_first" htmlFor="Phone">Phone<span>:</span></label>
                            <input
                                type="text"
                                id="Phone"
                                name="phone"
                                required
                                value={dataform.phone}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label className="new_form_first" htmlFor="Commission">Commission in Percentage<span>:</span></label>
                            <input
                                type="text"
                                id="Commission"
                                name="commission"
                                required
                                pattern="[0-9]+"
                                title="Please enter a valid numbers"
                                value={dataform.commission}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label className="new_form_first" htmlFor="PaymentType">Payment Type<span>:</span></label>
                            <select
                                id="PaymentType"
                                name="PaymentType"
                                required
                                value={dataform.PaymentType}
                                onChange={handleInputChange}
                            >
                                <option value="">Select</option>
                                <option value="Cash">Cash</option>
                                <option value="DD">DD</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Banking">Banking</option>
                                {/* <option value="OnlinePayment"></option> */}
                            </select>
                        </div>
                        {(dataform.PaymentType === 'Banking' || dataform.PaymentType === 'DD')&&(
                         <>
                         <div className="RegisForm_1">
                             <label className="new_form_first" htmlFor="Bankname">Bank Name<span>:</span></label>
                             <input
                                 type="text"
                                 id="Bankname"
                                 name="Bankname"
                                 required
                                 value={dataform.Bankname}
                                 onChange={handleInputChange}
                             />
                         </div>
                         <div className="RegisForm_1">
                             <label className="new_form_first" htmlFor="HolderName"> Holder Name<span>:</span></label>
                             <input
                                 type="text"
                                 id="HolderName"
                                 name="HolderName"
                                 required
                                 value={dataform.HolderName}
                                 onChange={handleInputChange}
                             />
                         </div>
                            <div className="RegisForm_1">
                             <label className="new_form_first" htmlFor="CardNumber"> Account Number<span>:</span></label>
                             <input
                                 type="number"
                                 id="CardNumber"
                                 name="CardNumber"
                                 required
                                 value={dataform.CardNumber}
                                 onChange={handleInputChange}
                             />
                         </div>

                            
                         </>
                        )}


                        <div className="RegisForm_1">
                            <label className="new_form_first" htmlFor="Address">Address<span>:</span></label>
                            <input
                                type="text"
                                id="Address"
                                name="address1"
                                required
                                value={dataform.address1}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label className="new_form_first" htmlFor="Address2">Address Two<span>:</span></label>
                            <input
                                type="text"
                                id="Address2"
                                name="address2"
                                required
                                value={dataform.address2}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className='Register_btn_con'>
                        <button  className='RegisterForm_1_btns' onClick={isEdit ?handleSubmit : handleupdate}>
                            {isEdit? 'Submit': 'Update'}</button>
                    </div>
           

                {/* <div style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
                

                <div className="Selected-table-container ">
                  <table className="selected-medicine-table2 ">
                    <thead>
                      <tr>
                        <th >S.No</th>
                        <th>Doctor Name</th>
                        <th >Doctor Type</th>
                        <th>Phone</th>
                        <th>Commission</th>
                        <th>Address One</th>
                        <th>Address Two</th>
                        <th>Action</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.map((row, index) => (
                        <tr key={index}>
                          <td>{row.Commission_Id}</td>
                          <td>{row.Doctor_Name}</td>
                          <td>

                            {row.Doctor_Type}
                          </td>
                          <td>{row.Phone}</td>
                          <td>{row.Commission_Percentage}</td>
                          <td>{row.Address_One}</td>
                          <td>{row.Address_Two}</td>
                          <td>
                            <button  className='Addnamebtn_pt2' onClick={()=>{handleEdit(row)}}>
                            <EditIcon/>
                            </button>
                          </td>
                          <td>
                            <button className='Addnamebtn_pt2' onClick={()=>{handlestatuschange(row)}}>
                                {row.Status}
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>

              </div> */}
            </div>
        </>
    );
}

export default FranchiseMaster;
