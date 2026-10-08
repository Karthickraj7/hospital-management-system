// import React, { useState, useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
// import Button from "@mui/material/Button";
// import EditIcon from "@mui/icons-material/Edit";
// import axios from "axios";
// import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
// import ListIcon from '@mui/icons-material/List';

// const TherapyMaster = () => {
//     const UrlLink = useSelector(state => state.userRecord?.UrlLink);
//     const userRecord = useSelector((state) => state.userRecord?.UserData);
//     const toast = useSelector(state => state.userRecord?.toast);
//     const dispatchvalue = useDispatch();
//     const [TherapyTypeData, setTherapyTypeData] = useState([]);
//     const [TherapyTypePage, setTherapyTypePage] = useState('TherapyMaster')
//     const [Specialities, setSpecialities] = useState([])

//     // -----------------------TherapyTypeMaster
//     const [TherapyType, setTherapyType] = useState({
//         TherapyId: '',
//         // Department:'',
//         TherapyType: '',
//         TherapyName: '',
//         SubprocedureName: '',
//         Description: '',
//         IsRequireMedication:false,
//         IpAmount : '',
//         OpAmount: '',
//         IsGst: false,
//         GSTvalue: ''

//     });

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         if (name === 'TherapyName') {
//             setTherapyType((prevState) => ({
//                 ...prevState,
//                 [name]: value?.toUpperCase()?.trim(),
//             }));
//         }
//         else if (name === 'Description') {
//             setTherapyType((prevState) => ({
//                 ...prevState,
//                 [name]: value?.toUpperCase()?.trim(),
//             }));
//         }
        
//         else if (name === 'IsRequireMedication') {
//             setTherapyType((prevState) => ({
//                 ...prevState,
//                 [name]: value === "true",
//             }));
//         }
//         else if (name === 'IsGst') {
//             setTherapyType((prevState) => ({
//                 ...prevState,
//                 [name]: value === "true",
//             }));
//         }
        
//         else {
//             setTherapyType((prevState) => ({
//                 ...prevState,
//                 [name]: value,
//             }));
//         }

//     };
//     const [IsTherapyTypeGet, setIsTherapyTypeGet] = useState(false);

//     const handleTherapyTypeubmit = () => {
//         if (TherapyType.TherapyName) {
//             const data = {
//                 ...TherapyType,
//                 created_by: userRecord?.username || ''
//             }
//             axios.post(`${UrlLink}Masters/TherapyType_Master_link`, data)
//                 .then((res) => {
//                     const resData = res.data;
//                     const mess = Object.values(resData)[0];
//                     const typp = Object.keys(resData)[0];
//                     const tdata = {
//                         message: mess,
//                         type: typp,
//                     }
//                     dispatchvalue({ type: 'toast', value: tdata })
//                     setIsTherapyTypeGet(prev => !prev)
//                     setTherapyType({
//                         TherapyId: '',
//                         TherapyType: '',
//                         TherapyName: '',
//                         SubprocedureName: '',
//                         Description: '',
//                         IsRequireMedication:false,
//                         IpAmount : '',
//                         OpAmount: '',
//                         IsGst: false,
//                         GSTvalue: ''
//                                     })
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                 })
//         }
//         else {
//             const tdata = {
//                 message: "Please Provide TherapyType.",
//                 type: 'warn'
//             }
//             dispatchvalue({ type: 'toast', value: tdata });
//         }
//     };

//     useEffect(() => {
//         axios.get(`${UrlLink}Masters/TherapyType_Master_link`)
//             .then((res) => {
//                 const ress = res.data;
//                 console.log(ress, 'gdtgdtgdtdgdtdg');
                
//                 setTherapyTypeData(ress)
//             })
//             .catch((err) => {
//                 console.log(err);
//             })
//     }, [IsTherapyTypeGet, UrlLink])

//     const handleeditTherapyType = (params) => {
//         const { id, ...rest } = params
//         setTherapyType((prev) => ({
//             ...prev,
//             TherapyId: id,
//             ...rest
//         }))
//     }

//     const handleeditTherapyTypeStatus = (params) => {
//         const data = {
//             TherapyId: params.id,
//             Statusedit: true
//         }
//         axios.post(`${UrlLink}Masters/TherapyType_Master_link`, data)
//             .then((res) => {
//                 const resres = res.data;
//                 console.log("resres",resres);
//                 let typp = Object.keys(resres)[0]
//                 let mess = Object.values(resres)[0]
//                 const tdata = {
//                     message: mess,
//                     type: typp,
//                 }

//                 dispatchvalue({ type: 'toast', value: tdata });
//                 setIsTherapyTypeGet(prev => !prev)
//             })
//             .catch((err) => {
//                 console.log(err);
//             })
//     }
//     const TheropyTypeColumns = [
//         {
//             key: "id",
//             name: "Therapy Id",
//             frozen: true
//         },
//         {
//             key: "created_by",
//             name: "Created By ",
//             frozen: true
//         },
//         {
//             key: "SpecialityName",
//             name: "Speciality Name",
//             frozen: true
//         },
//         {
//             key: "TherapyName",
//             name: "Therapy Name",
      
//         },
//         {
//             key: "SubprocedureName",
//             name: "Sub Therapy Name",
      
//         },
//         {
//             key: "Description",
//             name: "Description",
      
//         },
//         {
//             key: "IpAmount",
//             name: "IpAmount",
      
//         },
//         {
//             key: "OpAmount",
//             name: "OpAmount",
      
//         },
//         {
//             key: "GSTvalue",
//             name: "GST Value",
      
//         },
//         {
//             key: "OldIpAmount",
//             name: "Old IpAmount",
      
//         },
//         {
//             key: "OldOpAmount",
//             name: "Old OpAmount",
      
//         },
//         {
//             key: "IsRequireMedication",
//             name: "IsMedications",
//             renderCell: (params) => (
//                 <>{params.row.IsRequireMedication ? "Yes" : "No"}</>
//             ),
//         },
//         {
//             key: "status",
//             name: "Status",
//             renderCell: (params) => (
//                 <>
//                     <Button
//                         className="cell_btn"
//                         onClick={() => handleeditTherapyTypeStatus(params.row)}
//                     >
//                         {params.row.status}
//                     </Button>
//                 </>
//             ),
//         },
//         {
//             key: "Action",
//             name: "Action",
//             renderCell: (params) => (
//                 <>
//                     <Button
//                         className="cell_btn"
//                         onClick={() => handleeditTherapyType(params.row)}
//                     >
//                         <EditIcon className="check_box_clrr_cancell" />
//                     </Button>
//                 </>
//             ),
//         }
//     ]

//     useEffect(()=>{
//         axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
//         .then((response)=>{
//             console.log(response.data, 'shhhhdhdhhdhdhdhdhd');

//             setSpecialities(response.data)
            
//         })
//         .catch((error)=>{
//             console.log(error);
            
//         })
//     },[])


//     // ----------------------SubTherapyTypeMaster_______
  
//     const formatLabel = (label) => {
//         if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
//             return label
//                 .replace(/([a-z])([A-Z])/g, "$1 $2")
//                 .replace(/^./, (str) => str.toUpperCase());
//         } else {
//             return label;
//         }
//     };
    

//     return (
//         <>
//             <div className="Main_container_app">
//                 <h3>Therapy Masters</h3>
//                 <div className="RegisterTypecon">
//                     <div className="RegisterType">
//                         {["TherapyMaster"].map((p, ind) => (
//                             <div className="registertypeval" key={ind}>
//                                 <input
//                                     type="radio"
//                                     id={p}
//                                     name="appointment_type"
//                                     checked={TherapyTypePage === p}
//                                     onChange={(e) => {
//                                         setTherapyTypePage(e.target.value)
//                                     }}
//                                     value={p}
//                                 />
//                                 <label htmlFor={p}>
//                                     {p}
//                                 </label>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//                 <br />
//                 {/* ----------------------TherapyType */}
//                 {TherapyTypePage === 'TherapyMaster' &&
//                     <>
//                         <div className="common_center_tag">
                            
//                             <span>Therapy Master</span>

//                         </div>
//                         <br />
//                         <div className="RegisFormcon_1">
                           
//                             <div className="RegisForm_1">
//                                 <label> Therapy Department <span>:</span> </label>
                                
//                                 <select 
//                                 name="TherapyType" 
//                                 id="TherapyType"
//                                 value={TherapyType.TherapyType}
//                                 onChange={handleInputChange}
//                                 >
//                                     <option value="">Select</option>
//                                { Specialities.map((val, ind) => (
//                                                 <option key={ind} value={val.Speciality_Id}>{val.SpecialityName}</option>
//                                             ))}
//                                 </select>
//                             </div>
//                             <div className="RegisForm_1">
//                                 <label> Therapy Name <span>:</span> </label>
//                                 <input
//                                     type="text"
//                                     placeholder='Enter Therapy Name'
//                                     name='TherapyName'
//                                     required
//                                     value={TherapyType.TherapyName}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className="RegisForm_1">
//                                 <label>Sub Therapy Name <span>:</span> </label>
//                                 <input
//                                     type="text"
//                                     placeholder='Enter Sub Therapy Name'
//                                     name='SubprocedureName'
//                                     required
//                                     value={TherapyType.SubprocedureName}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className="RegisForm_1">
//                                 <label>Description
//                                     <span>:</span>
//                                 </label>
//                                 <textarea
//                                     name="Description"
//                                     required
//                                     value={TherapyType.Description}
//                                     autoComplete="off"
//                                     onChange={handleInputChange}
//                                 />
//                             </div>

//                             <div className="RegisForm_1">
//                                 <label> Op Amount<span>:</span> </label>
//                                 <input
//                                     type="number"
//                                     // placeholder='Enter Sub Therapy Name'
//                                     name='OpAmount'
//                                     required
//                                     value={TherapyType.OpAmount}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className="RegisForm_1">
//                                 <label> Ip Amount<span>:</span> </label>
//                                 <input
//                                     type="number"
//                                     // placeholder='Enter Sub Therapy Name'
//                                     name='IpAmount'
//                                     required
//                                     value={TherapyType.IpAmount}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>

//                             <div className="RegisForm_1">
//                                 <label>
//                                     Is GST<span>:</span>
//                                 </label>


//                                 <div style={{
//                                     display: "flex",
//               justifyContent: "flex-start",
//               width: "120px",
//               gap: "10px",
//                                 }}>
//                                     <label htmlFor="IsGst" style={{ width: "auto" }}>Yes</label>
//                                     <input
//                                         type="radio"
//                                         id="IsGst"
//                                         name="IsGst"
//                                         value="true" // Value associated with this option
//                                         style={{ width: "15px" }}
//                                         checked={TherapyType.IsGst === true} // Checked when Subtype is true
//                                         onChange={handleInputChange}
//                                     />
//                                     <label htmlFor="subtypeNo" style={{ width: "auto" }}>No</label>
//                                     <input
//                                         type="radio"
//                                         id="IsGst"
//                                         name="IsGst"
//                                         value="false" // Value associated with this option
//                                         style={{ width: "15px" }}
//                                         checked={TherapyType.IsGst === false} // Checked when Subtype is false
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>
//                             </div> 

//                            {TherapyType.IsGst === true &&
//                             <div className="RegisForm_1">
//                                 <label> GST Value<span>:</span> </label>
//                                 <input
//                                     type="number"
//                                     // placeholder='Enter Sub Therapy Name'
//                                     name='GSTvalue'
//                                     required
//                                     value={TherapyType.GSTvalue}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
                            
//                             }

//                             <div className="RegisForm_1">
//                                 <label>
//                                     Is Requires Medications<span>:</span>
//                                 </label>
//                                 <div style={{

//                                  display: "flex",
//               justifyContent: "flex-start",
//               width: "120px",
//               gap: "10px",
//                                 }}>
//                                     <label htmlFor="IsRequireMedicationyes" style={{ width: "auto" }}>Yes</label>
//                                     <input
//                                         type="radio"
//                                         id="IsRequireMedicationyes"
//                                         name="IsRequireMedication"
//                                         value="true" // Value associated with this option
//                                         style={{ width: "15px" }}
//                                         checked={TherapyType.IsRequireMedication === true} // Checked when Subtype is true
//                                         onChange={handleInputChange}
//                                     />
//                                     <label htmlFor="IsRequireMedicationno" style={{ width: "auto" }}>No</label>
//                                     <input
//                                         type="radio"
//                                         id="IsRequireMedicationno"
//                                         name="IsRequireMedication"
//                                         value="false" // Value associated with this option
//                                         style={{ width: "15px" }}
//                                         checked={TherapyType.IsRequireMedication === false} // Checked when Subtype is false
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>
//                             </div>
                            
//                         </div>
//                         <br />
//                         <div className="Main_container_Btn">
//                             <button onClick={handleTherapyTypeubmit}>
//                                 {TherapyType.TherapyId ? 'Update' : 'Save'}
//                             </button>
//                         </div>
//                         <br />
//                         {TherapyTypeData.length > 0 &&
//                             <ReactGrid columns={TheropyTypeColumns} RowData={TherapyTypeData} />}
//                     </>
//                 }



// <ToastAlert Message={toast.message} Type={toast.type} />

//             </div>

//         </>
//     )
// }

// export default TherapyMaster


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
 
const TherapyTypeMaster = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [therapyData, setTherapyData] = useState([]);
    const [therapyTypeData, setTherapyTypeData] = useState([]);
    const [isEditingTherapy, setIsEditingTherapy] = useState(false);
    const [editTherapyId, setEditTherapyId] = useState(null);
    const [TherapyChange, setTherapyChange] = useState("TherapyTypeMaster");
 
    const [formData, setFormData] = useState({
        TherapyType_Name: '',
        TherapyType_Id: null
    });
 
    const [therapyForm, setTherapyForm] = useState({
        Therapy_Id: '',
        therapytype_id: '',
        Therapy_Name: '',
        Description: '',
        IsMedications: true,
        IpAmount: '',
        OpAmount: '',
        OldIpAmount: '',
        OldOpAmount: '',
        IsGst: true,
        GSTvalue: '',
        Status: true,
        created_by: 'admin'
    });
 
    useEffect(() => {
        fetchTherapyTypes();
        fetchTherapies();
    }, []);
 
    const handleselectChange = (e) => {
        setTherapyChange(e.target.value);
    };
 
    const fetchTherapies = () => {
        axios.get(`${UrlLink}Masters/therapy-type-details/`)
            .then(res => setTherapyData(res.data || []))
            .catch(err => console.error('Error fetching therapy master', err));
    };
 
    const fetchTherapyTypes = () => {
        axios.get(`${UrlLink}Masters/therapytype-master/`)
            .then((response) => setTherapyTypeData(response.data.data || []))
            .catch((error) => console.error('Error fetching therapy types', error));
    };
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
 
    const handleTherapyFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTherapyForm({ ...therapyForm, [name]: type === 'checkbox' ? checked : value });
    };
 
    const resetForm = () => {
        setFormData({ TherapyType_Name: '', TherapyType_Id: null });
        setIsEditing(false);
        setEditId(null);
    };
 
    const resetTherapyForm = () => {
        setTherapyForm({
            Therapy_Id: '',
            therapytype_id: '',
            Therapy_Name: '',
            Description: '',
            IsMedications: true,
            IpAmount: '',
            OpAmount: '',
            OldIpAmount: '',
            OldOpAmount: '',
            IsGst: true,
            GSTvalue: '',
            Status: true,
            created_by: 'admin'
        });
        setIsEditingTherapy(false);
        setEditTherapyId(null);
    };
 
    const handleSubmit = (e) => {
        e.preventDefault();
 
        const payload = {
            TherapyType_Name: formData.TherapyType_Name
        };
 
        if (isEditing && editId) {
            axios.put(`${UrlLink}Masters/therapy-type-master/update/${editId}/`, payload)
                .then(() => {
                    resetForm();
                    fetchTherapyTypes();
                })
                .catch((error) => {
                    console.error('Error updating therapy type', error);
                    alert('Error updating therapy type');
                });
        } else {
            axios.post(`${UrlLink}Masters/therapytype-master/`, payload)
                .then(() => {
                    resetForm();
                    fetchTherapyTypes();
                })
                .catch((error) => {
                    console.error('Error adding therapy type', error);
                    alert('Error adding');
                });
        }
    };
 
    const submitTherapyMaster = (e) => {
        e.preventDefault();
        const {
    Therapy_Id, therapytype_id, Therapy_Name, Description,
    IpAmount, OpAmount, IsMedications, IsGst, GSTvalue,
    Status, created_by
} = therapyForm;
 
const payload = {
    therapytype_id, Therapy_Name, Description,
    IpAmount, OpAmount, IsMedications, IsGst, GSTvalue,
    Status, created_by
};
 
        const url = editTherapyId
            ? `${UrlLink}Masters/therapy-type-details/update/${editTherapyId}/`
            : `${UrlLink}Masters/therapy-type-details/`;
 
        const method = editTherapyId ? axios.put : axios.post;
 
        method(url, payload)
            .then(() => {
                fetchTherapies();
                resetTherapyForm();
            })
            .catch(() => alert('Error saving Therapy Master'));
    };
 
    const handleEdit = (item) => {
        setFormData({
            TherapyType_Name: item.TherapyType_Name,
            TherapyType_Id: item.TherapyType_Id
        });
        setIsEditing(true);
        setEditId(item.TherapyType_Id);
    };
 
    const handleEditTherapy = (item) => {
    setTherapyForm({
        ...item,
        therapytype_id: item.TherapyType_Name?.TherapyType_Id || '', // Set only the ID
    });
    setEditTherapyId(item.Therapy_Id);
    setIsEditingTherapy(true);
};
 
    const columns = [
        { key: 'TherapyType_Id', name: 'ID', frozen: true, width: 80 },
        { key: 'TherapyType_Name', name: 'Therapy Type Name', filter: true },
        {
            key: 'actions',
            name: 'Actions',
            renderCell: (params) => (
                <Button
                    onClick={() => handleEdit(params.row)}
                    startIcon={<EditIcon />}
                    variant="contained"
                    color="primary"
                >
                    Edit
                </Button>
            )
        }
    ];
 
    const therapyColumns = [
        { key: 'Therapy_Id', name: 'ID', width: 80 },
        { key: 'TherapyType_Name', name: 'Type', renderCell: ({ row }) => row.TherapyType_Name?.TherapyType_Name || row.TherapyType_Name },
 
        { key: 'Therapy_Name', name: 'Therapy Name' },
        { key: 'IpAmount', name: 'IP Amt' },
        { key: 'OpAmount', name: 'OP Amt' },
        // { key: 'Status', name: 'Active' },
        {
            key: 'actions',
            name: 'Actions',
            renderCell: (params) => (
                <Button
                    onClick={() => handleEditTherapy(params.row)}
                    startIcon={<EditIcon />}
                    variant="contained"
                >
                    Edit
                </Button>
            )
        }
    ];
 
    return (
        <>
            <div className="RegisterTypecon">
                <div className="RegisterType">
                    {["TherapyTypeMaster", "TherapyMaster"].map((p) => (
                        <div className="registertypeval" key={p}>
                            <input
                                type="radio"
                                id={p}
                                name="appointment_type"
                                checked={TherapyChange === p}
                                onChange={handleselectChange}
                                value={p}
                            />
                           <label htmlFor={p}>{p === "TherapyTypeMaster" ? "Therapy Type Master" : "Therapy Master"}</label>

                        </div>
                    ))}
                </div>
            </div>
<br />
<br /><br />
            {TherapyChange === 'TherapyTypeMaster' && (
                <>
                    <form onSubmit={handleSubmit}>
                        <div className='RegisFormcon' style={{ margin: '12px' }}>
                            <div className="RegisForm_1">
                                <label>Therapy Type Name<span>:</span></label>
                                <input
                                    type="text"
                                    name="TherapyType_Name"
                                    value={formData.TherapyType_Name}
                                    onChange={handleChange}
                                    style={{ textTransform: 'uppercase' }}
                                    required
                                />
                            </div>
                            <br />
                            <br /><br />
                            <div className='Main_container_Btn'>
                                <button type="submit">{isEditing ? 'Update' : 'Save'}</button>
                                {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
                            </div>
                        </div>
                    </form>
<br /><br /><br />
                    <ReactGrid columns={columns} RowData={therapyTypeData} />
                </>
            )}
 
            {TherapyChange === 'TherapyMaster' && (
                <>
                    <form onSubmit={submitTherapyMaster}>
                        <div className='RegisFormcon'>
                            <div className="RegisForm_1">
                                <label>Therapy Type Name:</label>
                                <select
    name="therapytype_id"
    value={therapyForm.therapytype_id}
    onChange={handleTherapyFormChange}
    required
>
    <option value="">Select</option>
    {therapyTypeData.map((type) => (
        <option key={type.TherapyType_Id} value={type.TherapyType_Id}>
            {type.TherapyType_Name}
        </option>
    ))}
</select>
 
 
 
                            </div>
                            <div className="RegisForm_1">
                                <label>Therapy Name:</label>
                                <input
                                    type="text"
                                    name="Therapy_Name"
                                    value={therapyForm.Therapy_Name}
                                    onChange={handleTherapyFormChange}
                                    required
                                />
                            </div>
                            <div className="RegisForm_1">
                                <label>Description:</label>
                                <input
                                    type="text"
                                    name="Description"
                                    value={therapyForm.Description}
                                    onChange={handleTherapyFormChange}
                                />
                            </div>
                            <div className="RegisForm_1">
                                <label>IP Amount:</label>
                                <input
                                    type="number"
                                    name="IpAmount"
                                    value={therapyForm.IpAmount}
                                    onChange={handleTherapyFormChange}
                                />
                            </div>
                            <div className="RegisForm_1">
                                <label>OP Amount:</label>
                                <input
                                    type="number"
                                    name="OpAmount"
                                    value={therapyForm.OpAmount}
                                    onChange={handleTherapyFormChange}
                                />
                            </div>
                            <br /><br /><br />
                            <div className='Main_container_Btn'>
                                <button type="submit">{isEditingTherapy ? 'Update' : 'Save'}</button>
                                {isEditingTherapy && <button type="button" onClick={resetTherapyForm}>Cancel</button>}
                            </div>
                        </div>
                    </form>
                    <br /><br /><br />
                    <ReactGrid columns={therapyColumns} RowData={therapyData} />
                </>
            )}
        </>
    );
};
 
export default TherapyTypeMaster;
