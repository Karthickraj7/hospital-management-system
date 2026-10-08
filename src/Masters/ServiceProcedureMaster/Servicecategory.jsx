import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import ListIcon from '@mui/icons-material/List';
import { useNavigate } from 'react-router-dom';
import { MdQrCode2 } from "react-icons/md";

const Servicecategory = () => {


    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const navigate = useNavigate()

    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const dispatchvalue = useDispatch();
    const [category, setcategory] = useState([])
    const [categoryGet, setcategoryGet] = useState(false)

    const [Servicetype, setServicetype] = useState({
        Serviceid: '',
        Servicegroup: '',
        ServiceCategory: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setServicetype((prevState) => ({
            ...prevState,
            [name]: value?.toUpperCase()?.trim(),
        }));
    }

    const handleEdit = (params) => {
        setServicetype(prev => ({
            ...prev,
            Serviceid: params.id,
            Servicegroup: params.Servicegroup,
            ServiceCategory: params.ServiceCategory
        }))

    }

    const CategoryMaster = [
        {
            key: "Serviceid",
            name: "S.No",
            width: 70,
        },
        {
            key: "Servicegroup",
            name: "Service Group",
            width: 280,
        },
        {
            key: "ServiceCategory",
            name: "Service Category",
            width: 200,
        },
        {
            key: "EditAction",
            name: "Action",
            width: 200,
            renderCell: (params) => (
                <p
                    style={{ width: "130px", textAlign: "center", cursor: "pointer" }}
                    onClick={() => handleEdit(params.row)}
                >
                    <EditIcon />
                </p>
            ),
        },
    ];

    const handleLocationsubmit = () => {
        if (Servicetype.Servicegroup && Servicetype.ServiceCategory) {
            const data = {
                ...Servicetype,
                Createdby: userRecord?.username || '',
                Location: userRecord?.location

                // created_by: LocationName.locationId ? LocationName.created_by : userRecord?.username || '',
            }
            axios.post(`${UrlLink}Masters/Insert_service_category_master`, data)
                .then((res) => {
                    const resData = res.data;
                    const mess = Object.values(resData)[0];
                    const typp = Object.keys(resData)[0];
                    const tdata = {
                        message: mess,
                        type: typp,
                    }


                    setcategoryGet((prev) => !prev)
                    setServicetype({
                        Serviceid: '',
                        Servicegroup: '',
                        ServiceCategory: '',
                    })
                    dispatchvalue({ type: 'toast', value: tdata })
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide both Service Group and Category.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }



    };
    useEffect(() => {
        axios.get(`${UrlLink}Masters/Insert_service_category_master`)
            .then((res) => {
                const ress = res.data
                console.log(ress, 'ddhdhdhdhdhdhdhdhdhdhdhdhdhdh');

                setcategory(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [UrlLink, categoryGet])

    return (
        <>
            <div className="common_center_tag">
                <span>Service Category</span>
            </div>
            <br />
            <div className="RegisFormcon_1">
                <div className="RegisForm_1">
                    <label> Service Group <span>:</span> </label>
                    <input
                        type="text"
                        placeholder='Enter Service Group'
                        name='Servicegroup'
                        required
                        value={Servicetype.Servicegroup}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="RegisForm_1">
                    <label> Service Category <span>:</span> </label>
                    <input
                        type="text"
                        placeholder='Enter Category Name'
                        name='ServiceCategory'
                        required
                        value={Servicetype.ServiceCategory}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <br />
            <div className="Main_container_Btn">
                <button
                    onClick={handleLocationsubmit}
                >
                    {Servicetype.Serviceid ? 'Update' : 'Save'}
                </button>
            </div>
            <br />

            {category.length > 0 &&
                <ReactGrid columns={CategoryMaster} RowData={category} />}
            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    )
}

export default Servicecategory