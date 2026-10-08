import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';
import LoupeIcon from "@mui/icons-material/Loupe";
 
function TraineeRegistrationlist() {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const pagewidth = useSelector(state => state.userRecord?.pagewidth);
    const dispatchvalue = useDispatch();
    const navigate = useNavigate()
    
    
    const [TraineeRegisterData, setTraineeRegisterData] = useState([])
    const [Departments, setDepartments] = useState([])
    const [Designations, setDesignations] = useState([])
    const [GetEmployeeRegisterData, setGetEmployeeRegisterData] = useState(false)
    const [EmployeeRegisterFIlteredData, setEmployeeRegisterFIlteredData] = useState([])
    const [SearchQuery, setSearchQuery] = useState('')
    
    useEffect(() => {
        axios.get(`${UrlLink}HR_Management/Trainee_Registration_Details`)
            .then((res) => {
                const ress = res.data
                console.log(ress,'ress');
                setTraineeRegisterData(Array.isArray(ress));
               

            })
            .catch((err) => {
                console.log(err);
            })
        dispatchvalue({ type: 'EmployeeListId', value: {} })
    }, [UrlLink, dispatchvalue])


    const handleedit =(row)=>{
        console.log('row----------',row);
         dispatchvalue({ type: 'TraineeEditData', value:  row });

        navigate("/Home/HR");
        dispatchvalue({ type: 'HrFolder', value:'TraineeRegistration'});
        dispatchvalue({ type: "setPreviousFolder", value: null }); 
        dispatchvalue({ type: "showMenu", value: true });

    }
 
    const TraineeRegisterColumns = [
        {
            key: "id",
            name: "S.No ",
            frozen: true
        },
        {
            key: "Trainee_Id",
            name: "Trainee Id",
            frozen:  true,
            // width:300
        },
        {
            key: "FirstName",
            name: "First Name",
            filter: true,
            frozen: true
        },
        {
            key: "Phone",
            name: "Contact Number",
            frozen:true
        },       
        {
            key: "CreatedBy",
            name: "created By",
        },


        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={()=>handleedit(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        },

       

    ]


    const handlenewEmpRegister = () => {

        dispatchvalue({ type: 'EmployeeListId', value: {} })
        dispatchvalue({ type: 'TraineeEditData', value:  {} });

        navigate("/Home/HR");
        dispatchvalue({ type: 'HrFolder', value:'TraineeRegistration'});
        dispatchvalue({ type: "setPreviousFolder", value: null }); 
        dispatchvalue({ type: "showMenu", value: true });

    }




  return (
    <>
    <div className="Main_container_app">
        <h3>Trainee List</h3>
        <div className="search_div_bar">
            <div className=" search_div_bar_inp_1">
                <label htmlFor="">Search Here
                    <span>:</span>
                </label>
                <input
                    type="text"
                    value={SearchQuery}
                    placeholder='Name or Number'
                    // onChange={(e) => setSearchQuery(e.target.value)}
                     />
            </div>
            <button
                className="search_div_bar_btn_1"
                onClick={handlenewEmpRegister}
                title="New Doctor Register"
            >
                <LoupeIcon />
            </button>

        </div>
        <ReactGrid columns={TraineeRegisterColumns} RowData={TraineeRegisterData} />

    </div>
    <ToastAlert Message={toast.message} Type={toast.type} />
</>
  )
}
 
export default TraineeRegistrationlist

