import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from "react-redux";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

const MinMaxReorder = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
 const UserData = useSelector((state) => state.userRecord?.UserData);

     const dispatchvalue = useDispatch();
 
    const [minMaxData, setMinMaxData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        NurseStation: '',
        Prod_Stock: '',
        Min_Qty: 0,
        Max_Qty: 0,
        created_by: ''
    });

    const [nurseStations, setNurseStations] = useState([]);
    const [products, setProducts] = useState([]);

      const [SelectedFile, setSelectedFile] = useState(null);

      const [searchNS, setSearchNS] = useState('');
const [searchProd, setSearchProd] = useState('');

const filteredData = minMaxData.filter(item => {
    return (
        item.NurseStation.toLowerCase().includes(searchNS.toLowerCase()) &&
        item.Prod_Stock.toLowerCase().includes(searchProd.toLowerCase())
    );
});


  const handleFileChange = (event) => {
    setSelectedFile(null);
    setSelectedFile(event.target.files[0]);
  };
  const handleCsvupload = () => {
    console.log(SelectedFile);
    const formData = new FormData();
    formData.append("file", SelectedFile);
    formData.append("created_by", UserData?.username);

    if (SelectedFile) {
      axios
        .post(`${UrlLink}NurseStation/minmax_nursestation_excel_upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          console.log(response);
          setSelectedFile(null);
          fetchMinMaxData();

          let data = response.data;

          let type = Object.keys(data)[0]
          let mess = Object.values(data)[0]
          const tdata = {
            message: mess,
            type: type
          }
          dispatchvalue({ type: 'toast', value: tdata })
          

        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    } else {
      // userwarn("Choose File");
    }
  };

    // Fetch nurse stations and products for dropdowns
    useEffect(() => {
        axios.get(`${UrlLink}NurseStation/nurse_station_list`).then(res => setNurseStations(res.data));
        axios.get(`${UrlLink}Inventory/product_master_Detials_link`).then(res => setProducts(res.data));
        fetchMinMaxData();
    }, []);

    const fetchMinMaxData = (ns = '', prod = '') => {
    axios.get(`${UrlLink}NurseStation/minmax_nursestation_api`, {
        params: { NurseStation: ns, Prod_Stock: prod }
    })
    .then(res => setMinMaxData(res.data.data))
    .catch(err => console.error(err));
};


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.NurseStation || !formData.Prod_Stock) {
            alert('Select Nurse Station and Product');
            return;
        }
        const payload = {...formData};
        payload.created_by = 'Admin'; // or from redux

        if (isEditing && editId) {
            axios.put(`${UrlLink}NurseStation/minmax_nursestation_api`, {...payload, id: editId})
                .then(() => {
                    fetchMinMaxData();
                    resetForm();
                })
                .catch(err => console.error(err));
        } else {
            axios.post(`${UrlLink}NurseStation/minmax_nursestation_api`, payload)
                .then(() => {
                    fetchMinMaxData();
                    resetForm();
                })
                .catch(err => console.error(err));
        }
    };

    const handleEdit = (record) => {
        setFormData({
            NurseStation: record.NurseStation,
            Prod_Stock: record.Prod_Stock,
            Min_Qty: record.Min_Qty,
            Max_Qty: record.Max_Qty
        });
        setIsEditing(true);
        setEditId(record.id);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            axios.delete(`${UrlLink}NurseStation/minmax_nursestation_api`, { data: { id } })
                .then(() => fetchMinMaxData())
                .catch(err => console.error(err));
        }
    };

    const resetForm = () => {
        setFormData({ NurseStation: '', Prod_Stock: '', Min_Qty: 0, Max_Qty: 0 });
        setIsEditing(false);
        setEditId(null);
    };

    const columns = [
        { key: 'id', name: 'ID', width: 80 },
        { key: 'NurseStation', name: 'Nurse Station' },
        { key: 'Prod_Stock', name: 'Product' },
        { key: 'Min_Qty', name: 'Min Qty' },
        { key: 'Max_Qty', name: 'Max Qty' },
        {
            key: 'actions', name: 'Actions', renderCell: (params) => (
                <>
                    <Button onClick={() => handleEdit(params.row)} startIcon={<EditIcon />} variant="contained" color="primary">Edit</Button>
                    <Button onClick={() => handleDelete(params.row.id)} startIcon={<DeleteIcon />} variant="contained" color="secondary" style={{marginLeft:5}}>Delete</Button>
                </>
            )
        }
    ];

    return (
        <>
        <br />
        
            <form onSubmit={handleSubmit} style={{marginBottom: '20px'}}>
                <div className='RegisFormcon'>
                    <div className="RegisForm_1">
                        <label>Nurse Station:</label>
                        <select name="NurseStation" value={formData.NurseStation} onChange={handleChange} required>
                            <option value="">Select Nurse Station</option>
                            {nurseStations.map(ns => <option key={ns.id} value={ns.NurseStationName}>{ns.NurseStationName}</option>)}
                        </select>
                    </div>
                     <div className="RegisForm_1">
                    <label htmlFor='TrayName' >Item Name<span>:</span></label>
                    <input
                        type='text'
                        id="Prod_Stock"
                        name="Prod_Stock"
                        list='ItemCodeList'
                        value={formData.Prod_Stock}
                        onChange={handleChange}
                       
                    />
                    <datalist id='ItemCodeList'>
                        {products.map((option,index)=>(
                        <option key={index} value={option.Item_Name} ></option>
                        ))}
                    </datalist>
                
                    </div> 
                    <div className="RegisForm_1">
                        <label>Min Qty:</label>
                        <input type="number" name="Min_Qty" value={formData.Min_Qty} onChange={handleChange} required/>
                    </div>
                    <div className="RegisForm_1">
                        <label>Max Qty:</label>
                        <input type="number" name="Max_Qty" value={formData.Max_Qty} onChange={handleChange} required/>
                    </div>

                      <div style={{ display: "flex", alignItems: "center", }}>
          <label>
            {" "}
            CurrentStock Excel File<span>:</span>{" "}
          </label>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            id="Servicechoose"
            required
            style={{ display: "none" }}
            onChange={handleFileChange}
            autoComplete='off'
          />



          <label
            htmlFor="Servicechoose"
            title='Choose File'
            className="RegisterForm_1_btns choose_file_update"
          >
            <PhotoCameraBackIcon />
          </label>
          <button
            className="RegisterForm_1_btns choose_file_update"
            onClick={handleCsvupload}
            title='File Upload'
          >

            <DriveFolderUploadIcon />

          </button>
 <div style={{ display: "flex", alignItems: "center",padding:"32px" }}>
          <div className='RegisForm_1'>
    <input
        type="text"
        placeholder="Search Nurse Station"
        value={searchNS}
        onChange={(e) => setSearchNS(e.target.value)}
       
    />
   
    <input
        type="text"
        placeholder="Search Product"
        value={searchProd}
        onChange={(e) => setSearchProd(e.target.value)}
        />

        </div>


{/* <button onClick={() => fetchMinMaxData(searchNS, searchProd)}>Search</button> */}


        </div>
        </div>
                    <br />
                    <br />
                    <div className='Main_container_Btn'>
                        <button type="submit">{isEditing ? 'Update' : 'Save'}</button>
                        {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
                    </div>
                </div>
            </form>

           <ReactGrid columns={columns} RowData={filteredData} />

        </>
    );
};

export default MinMaxReorder;
