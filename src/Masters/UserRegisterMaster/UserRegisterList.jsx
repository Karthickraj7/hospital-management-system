import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';

const UserRegisterList = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    // const UserData = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const dispatchvalue = useDispatch();
    const navigate = useNavigate()
    const [UserRegisterData, setUserRegisterData] = useState([])
    const [GetUserRegisterData, setGetUserRegisterData] = useState(false)

    const [searchName, setSearchName] = useState("");
    const [filterRole, setFilterRole] = useState("");

    const filteredData = UserRegisterData.filter(user =>
        user.Name?.toLowerCase().includes(searchName.toLowerCase()) &&
        (filterRole === "" || user.roleName === filterRole)
    );



    useEffect(() => {
        axios.get(`${UrlLink}Masters/UserRegister_Detials_link`)
            .then((res) => {
                const ress = res.data
                console.log(ress,'resssssssssssss');
                
                setUserRegisterData(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [UrlLink,GetUserRegisterData])

    const UserRegisterColumns = [
        {
            key: "id",
            name: "User Id",
            frozen: true
        },
        {
            key: "roleName",
            name: "Role Name",
            frozen: true
        },
        {
            key: "EmployeeId",
            name: "Employee/Doctor Id",
            width: 180,
            frozen: true,
            renderCell: (params) => (
                params.row.EmployeeType === 'DOCTOR' ?
                    params.row.DoctorId
                    :
                    params.row.EmployeeId
            )
        },

        {
            key: "UserName",
            name: "User Name",
        },
        {
            key: "Name",
            name: "Name",
        },

        {
            key: "PhoneNo",
            name: "Phone No",
        },
        {
            key: "Email",
            name: "Email",
        },

        {
            key: "Gender",
            name: "Gender",
        },
        {
            key: "Qualification",
            name: "Qualification",
        },
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (

                <Button
                    className="cell_btn"
                    onClick={() => handleeditUserstatus(params.row)}
                >
                    {params.row.Status}
                </Button>
            )

        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditUserRegister(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }

    ]
    const handleeditUserstatus = (params) => {
        const data = {UserId: params.id}
       axios.post(`${UrlLink}Masters/update_status_User_Detials_link`, data)
           .then((res) => {
               const resres = res.data
               let typp = Object.keys(resres)[0]
               let mess = Object.values(resres)[0]
               const tdata = {
                   message: mess,
                   type: typp,
               }

               dispatchvalue({ type: 'toast', value: tdata });
               setGetUserRegisterData(prev => !prev)
           })
           .catch((err) => {
               console.log(err);
           })
       
    }

    // const handleeditUserRegister = (params) => {
    //     const { id } = params
    //     dispatchvalue({ type: 'UserListId', value: { UserId: id } })

    //     navigate("/Home/MasterFolder");
    //     // dispatchvalue({ type: 'Usercreatedocdata', value: {} })
    //     // dispatchvalue({ type: 'UsercreateEmpdata', value: {} })

    //     dispatchvalue({ type: 'HrFolder', value:'UserRegisterMaster'});
    //     dispatchvalue({ type: "setPreviousFolder", value: null }); 
    //     dispatchvalue({ type: "showMenu", value: true });
        
    // }



    const handleeditUserRegister = (params) => {
       
        console.log("Editing User:", params);
    
        dispatchvalue({ type: 'UserListId', value: { ...params } });
   
    
        navigate("/Home/MasterFolder");
        dispatchvalue({ type: 'HrFolder', value: 'UserRegisterMaster' });
    
        dispatchvalue({ type: 'Usercreatedocdata', value: {} });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });
    };


    return (
        <>

            <div className="Main_container_app">
                <h3>User List</h3>

                <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                    <label>Name<span>:</span></label>
                    <input
                        type="text"
                        placeholder="Search by Name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        style={{ padding: "5px", width: "200px" }}
                    />

                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        style={{ padding: "5px", width: "200px" }}
                    >
                        <option value="">All Roles</option>
                        {[...new Set(UserRegisterData.map(user => user.roleName))].map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>

                <ReactGrid columns={UserRegisterColumns} RowData={filteredData} />


            </div>

            
            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    )
}

export default UserRegisterList;