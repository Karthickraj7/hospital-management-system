

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import ForwardIcon from '@mui/icons-material/Forward';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const Dispatch = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const [summa, setSumma] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [searchQuery3, setSearchQuery3] = useState('');


  useEffect(() => {
    axios.get(`${urllink}Radiology/Get_Data_For_Dispatch`)
      .then((res) => {
        const data = res.data.map((item, inx) => ({
          id: inx + 1,
          ...item,
        }));
        setSumma(data)

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [urllink])

  const handleSearchChange = (e, key) => {
    const value = e.target.value;
    if (key === 'name') setSearchQuery(value);
    if (key === 'phone') setSearchQuery1(value);
    if (key === 'barcode') setSearchQuery2(value);
    if (key === 'invoice') setSearchQuery3(value);
    // setPage(0); // Reset to first page on search
  };

  const handleSetPrint = (row) => {
    dispatch({ type: 'Capturesample', value: row });
    setTimeout(() => {
      navigate('/Home/Retro');
    }, 800);
  }


  const dynamicColumns = [
    { key: 'id', headerName: 'S.NO', width: 30 },
    { key: 'FirstName', headerName: 'Name', width: 100 },
    { key: 'Age', headerName: 'Age', width: 100 },
    { key: 'Phone', headerName: 'PhoneNO', width: 100 },
    { key: 'TestName', headerName: 'Test', width: 100 },
    { key: 'BillingStatus', headerName: 'Billing Status', width: 100 },
    { key: 'RegisterType', headerName: 'RegisterType', width: 100 },
    { key: 'DoctorName', headerName: 'Doctor', width: 100 },
    {
      key: 'actions',
      headerName: 'Options',
      width: 100,
      renderCell: ({ row }) => (
        <Button className="cell_btn" onClick={() => handleSetPrint(row)}>
          <ForwardIcon />
        </Button>
      ),
    },
  ]


  console.log("----Data-----", summa);



  return (
    <div className="appointment">
      <div className="h_head">
        <h3>Dispatch Que List</h3>
      </div>
      <div className="con_1">
        <div className="inp_1">
          <label htmlFor="input">Patient Name:</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e, 'name')}
            placeholder="Enter the Patient Name"
          />
        </div>
        <div className="inp_1">
          <label htmlFor="input">UHID:</label>
          <input
            type="text"
            value={searchQuery1}
            onChange={(e) => handleSearchChange(e, 'phone')}
            placeholder="Enter the UHID Number"
          />
        </div>
        <div className="inp_1">
          <label htmlFor="input">Barcode</label>
          <input
            id="input"
            type="text"
            value={searchQuery2}
            onChange={(e) => handleSearchChange(e, 'barcode')}
            placeholder="Enter Barcode Number"
          />
        </div>
        <div className="inp_1">
          <label htmlFor="input">OP/IP No</label>
          <input
            id="input"
            type="text"
            value={searchQuery3}
            onChange={(e) => handleSearchChange(e, 'invoice')}
            placeholder="Enter OP/IP Number"
          />
        </div>
      </div>
      <div className="grid_1">
        <ReactGrid
          
          columns={dynamicColumns}
          RowData={summa}
        />
      </div>
    </div>
  )
}

export default Dispatch
