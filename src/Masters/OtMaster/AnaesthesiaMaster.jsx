import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { Checkbox } from '@mui/material';

const AnaesthesiaMaster = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector(state => state.userRecord?.UserData);
    const dispatch = useDispatch();

    const [AnaesthesiaMasterData, setAnaesthesiaMasterData] = useState([]);
    const [IsAnaesthesiaMasterData, setIsAnaesthesiaMasterData] = useState(false);

    const [AnaesthesiaMaster, setAnaesthesiaMaster] = useState({
        AnaesthesiaId: '',
        AnaesthesiaName: '',
        ShortName: '',
       
    });

    useEffect(() => {
        axios.get(`${UrlLink}Masters/AnaesthesiaMaster_Detials_link`)
            .then((res) => setAnaesthesiaMaster(res.data))
            .catch((err) => console.log(err));
    }, [IsAnaesthesiaMasterData, UrlLink]);

    const handleEditAnaesthesiaMasterStatus = (row) => {
        const data = {
            AnaesthesiaId: row.id,
            Statusedit: true,
        };
        axios.post(`${UrlLink}Masters/AnaesthesiaMaster_Detials_link`, data)
            .then((res) => {
                const response = res.data;
                const messageType = Object.keys(response)[0];
                const messageContent = Object.values(response)[0];
                dispatch({
                    type: 'toast',
                    value: { message: messageContent, type: messageType },
                });
                setIsAnaesthesiaMasterData(prev => !prev);
            })
            .catch((err) => console.log(err));
    };

    const handleEditAnaesthesiaMaster = (row) => {
        const { id, ...rest } = row;
        setAnaesthesiaMaster({
            AnaesthesiaId: id,
            ...rest
        });
    };


    const handleAnaesthesiaMastersubmit = () => {
        if (!AnaesthesiaMaster.AnaesthesiaName || !AnaesthesiaMaster.ShortName) {
            dispatch({
                type: 'toast',
                value: { message: 'Please provide both Location and Theatre Name.', type: 'warn' },
            });
            return;
        }

        const data = {
            ...AnaesthesiaMaster,
            created_by: userRecord?.username || ''
        };

        console.log(data,'data');
        

        axios.post(`${UrlLink}Masters/AnaesthesiaMaster_Detials_link`, data)
            .then((res) => {
                const response = res.data;
                const messageType = Object.keys(response)[0];
                const messageContent = Object.values(response)[0];
                dispatch({
                    type: 'toast',
                    value: { message: messageContent, type: messageType },
                });
                setIsAnaesthesiaMasterData(prev => !prev);
                setAnaesthesiaMaster({
                    AnaesthesiaId: '',
                    AnaesthesiaName: '',
                    ShortName: '',
                    
                });
            })
            .catch((err) => console.log(err));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAnaesthesiaMaster(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };


    const AnaesthesiaMasterColumns = [
        { key: "id", name: "S.No", frozen: true },
        { key: "created_by", name: "Created By", frozen: true },
        { key: "AnaesthesiaName", name: "Anaesthesia Name" },
        { key: "ShortName", name: "Short Name" },
        
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <Button onClick={() => handleEditAnaesthesiaMasterStatus(params.row)}>
                    {params.row.Status}
                </Button>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <Button onClick={() => handleEditAnaesthesiaMaster(params.row)}>
                    <EditIcon />
                </Button>
            ),
        }
    ];


  return (
    <div className="Main_container_app">
            <h3>Anaesthesia Masters</h3>

            <br/>
            <div className="RegisFormcon_1">
                
                <div className="RegisForm_1">
                    <label>Anaesthesia Name:</label>
                    <input
                        type="text"
                        name="AnaesthesiaName"
                        placeholder="Enter Theatre Name"
                        value={AnaesthesiaMaster.AnaesthesiaName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label>Short Name:</label>
                    <input
                        type="text"
                        name="ShortName"
                        placeholder="Enter Short Name"
                        value={AnaesthesiaMaster.ShortName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
               
                
            </div>
            <div className="Main_container_Btn">
                <button onClick={handleAnaesthesiaMastersubmit}>
                    {AnaesthesiaMaster.AnaesthesiaId ? 'Update' : 'Save'}
                </button>
            </div>
            {AnaesthesiaMasterData.length > 0 && (
                <ReactGrid columns={AnaesthesiaMasterColumns} RowData={AnaesthesiaMasterData} />
            )}
        </div>
  )
}

export default AnaesthesiaMaster;